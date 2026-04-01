import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importPrc1() {
  console.log("Starting PRC-1 Chapter 3 Ledgers and Trial Balance Import...");

  const dataDir = path.join(__dirname, 'data');
  const files = ['prc1-c3-1.json', 'prc1-c3-2.json', 'prc1-c3-3.json', 'prc1-c3-4.json'];
  
  let allQuestions: any[] = [];

  for (const file of files) {
    const rawData = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const parsedData = JSON.parse(rawData);
    allQuestions = allQuestions.concat(parsedData);
  }

  console.log(`Successfully parsed ${allQuestions.length} questions.`);

  let count = 0;

  for (const q of allQuestions) {
    const qId = crypto.randomUUID();

    // Clean citation markers like [1], [1, 2], [1, 2, 3] from explanations
    let cleanExplanation = q.explanation;
    if (cleanExplanation) {
      cleanExplanation = cleanExplanation.replace(/\s*\[\s*\d+(?:\s*,\s*\d+)*\s*\]/g, "");
    }

    const { error: qError } = await supabase
      .from('questions')
      .insert({
        id: qId,
        level: 'prc',
        subject_id: 'prc-1',
        topic: 'Ledgers and Trial Balance',
        chapter: 3,
        question_text: q.question,
        explanation: cleanExplanation || '',
        difficulty: 'Medium',
        is_active: true
      });

    if (qError) {
      console.error(`Error inserting question ${q.id}:`, qError);
      continue;
    }

    // Process and Insert linked options
    const cleanCorrectAnswer = q.correctAnswer ? q.correctAnswer.trim() : '';

    const optionsToInsert = q.options.map((opt: string) => {
      const key = opt.substring(0, 1);
      const text = opt.includes(') ') ? opt.split(') ').slice(1).join(') ').trim() : opt.trim();
      const isCorrect = opt.trim() === cleanCorrectAnswer;

      return {
        question_id: qId,
        option_key: key,
        option_text: text,
        is_correct: isCorrect
      };
    });

    const { error: optError } = await supabase
      .from('options')
      .insert(optionsToInsert);

    if (optError) {
      console.error(`Error inserting options for question ${q.id}:`, optError);
    } else {
      count++;
    }
  }

  console.log(`Successfully completed relational ingestion of ${count} questions for prc-1 Chapter 3.`);
}

importPrc1().catch(console.error);
