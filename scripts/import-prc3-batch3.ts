import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables! Check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const SUBJECT_ID = 'prc-3';

async function importMCQs() {
  console.log(`Starting MCQ batch 3 import for ${SUBJECT_ID}...`);

  const dataPath = path.join(__dirname, 'data', 'prc3-batch3.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const mcqs = JSON.parse(rawData);

  console.log(`Loaded ${mcqs.length} questions from prc3-batch3.json`);

  let successCount = 0;
  let errorCount = 0;

  for (const item of mcqs) {
    // 1. Clean AI signals from explanation (e.g., [1], [1, 2], [1, 2-3])
    let cleanedExplanation = item.explanation.replace(/\s*\[[\d,\s-]+\]/g, '').trim();

    const chapterNumber = item.chapter;
    const chapterTitle = item.chapterTitle;

    // Determine correct option
    const originalCorrect = item.correctAnswer;
    let correctAnswerChar = '';
    if (originalCorrect.match(/^[A-D]\)/)) {
        correctAnswerChar = originalCorrect.charAt(0);
    } else {
        const matchingOption = item.options.find((opt: string) => opt.includes(originalCorrect) || opt === originalCorrect);
        if (matchingOption) {
            correctAnswerChar = matchingOption.charAt(0);
        } else {
            correctAnswerChar = 'A'; 
        }
    }

    const qId = crypto.randomUUID();

    // 4. Insert Question
    const { error: questionError } = await supabase
      .from('questions')
      .insert({
        id: qId,
        level: 'prc',
        subject_id: SUBJECT_ID,
        topic: chapterTitle,
        chapter: chapterNumber,
        question_text: item.question,
        explanation: cleanedExplanation,
        difficulty: 'Medium',
        is_active: true
      });

    if (questionError) {
      console.error(`Error inserting question:`, questionError.message);
      errorCount++;
      continue;
    }

    // 5. Insert options
    const optionsToInsert = item.options.map((optStr: string) => {
      // Option format is like "A) Tangible goods only"
      const key = optStr.substring(0, 1);
      const isCorrect = key === correctAnswerChar;
      
      // Remove "A) " prefix
      const content = optStr.replace(/^[A-D]\)\s*/, '');
      
      return {
        question_id: qId,
        option_key: key,
        option_text: content,
        is_correct: isCorrect,
      };
    });

    const { error: optionsError } = await supabase
      .from('options')
      .insert(optionsToInsert);

    if (optionsError) {
      console.error(`Error inserting options for question ${qId}:`, optionsError.message);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log(`\nImport complete!`);
  console.log(`Successfully mapped and inserted/updated: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

importMCQs().catch(console.error);
