import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SUBJECT_ID = 'prc-2';

async function importPR2Batch4() {
  console.log('Starting PRC 2 Batch 4 import...');

  const batchParts = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
  let totalImported = 0;

  for (const part of batchParts) {
    const filePath = path.join(process.cwd(), 'scripts', 'data', `prc2-batch4-${part}.json`);
    const fileData = fs.readFileSync(filePath, 'utf8');
    const mcqs = JSON.parse(fileData);

    console.log(`Processing ${part} (${mcqs.length} MCQs)...`);

    for (const mcq of mcqs) {
      // 1. Insert Question
      const { data: questionData, error: qError } = await supabase
        .from('questions')
        .insert({
          subject_id: SUBJECT_ID,
          chapter_number: mcq.chapter,
          chapter_title: mcq.chapterTitle,
          question_text: mcq.question,
          explanation: mcq.explanation,
          difficulty_level: 'medium'
        })
        .select()
        .single();

      if (qError) {
        console.error(`Error inserting question ${mcq.id}:`, qError);
        continue;
      }

      // 2. Insert Options
      const optionsToInsert = mcq.options.map((opt: string) => ({
        question_id: questionData.id,
        option_text: opt,
        is_correct: opt === mcq.correctAnswer
      }));

      const { error: oError } = await supabase
        .from('options')
        .insert(optionsToInsert);

      if (oError) {
        console.error(`Error inserting options for ${mcq.id}:`, oError);
      } else {
        totalImported++;
      }
    }
  }

  console.log(`Successfully imported ${totalImported} MCQs for PRC 2 Batch 4.`);
}

importPR2Batch4().catch(console.error);
