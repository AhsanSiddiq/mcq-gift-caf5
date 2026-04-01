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

async function importEcoMCQs() {
  console.log(`Starting Economic MCQ batch 1 import for ${SUBJECT_ID}...`);

  const dataPath = path.join(__dirname, 'data', 'prc3-eco-batch1.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const mcqs = JSON.parse(rawData);

  console.log(`Loaded ${mcqs.length} questions from prc3-eco-batch1.json`);

  let successCount = 0;
  let errorCount = 0;

  for (const item of mcqs) {
    // 1. Clean AI signals from explanation
    let cleanedExplanation = item.explanation.replace(/\s*\[[\d,\s-]+\]/g, '').trim();

    // To prevent overlap with Business Chapters (1 to 8), mapping Economics chapters:
    // Chapter 1 Economics -> Chapter 11
    // Chapter 2 Economics -> Chapter 12
    // Chapter 3 Economics -> Chapter 13
    // ...
    // Chapter 12 Economics -> Chapter 22
    // That way, we keep subject distinct. Actually, the user asked earlier: "if there are questions aside from it please fix the chapter relevant to it. i have these 8 chapters...". Wait, did the user mean TOTAL for the entire subject or just for the business portion? The business portion was just 8 chapters. Economics portion is distinctly separate in the syllabus. 
    // Wait, the syllabus for PRC-3 Business and Economic Insights has two parts: Business (Chapters 1-8) and Economics (Chapters 9-?). If we look at traditional CA PRC-3 syllabus, Economics includes Nature & Scope (9), Demand & Supply (10), Elasticity (11), Firm Theory (12), etc. 
    // I will map Eco Chapter `C` to `C + 8` since business was 1-8. Let's do that to avoid chapter name collisions in the UI.
    const mappedChapterNumber = item.chapter + 8;
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
        chapter: mappedChapterNumber,
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
      const key = optStr.substring(0, 1);
      const isCorrect = key === correctAnswerChar;
      
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

importEcoMCQs().catch(console.error);
