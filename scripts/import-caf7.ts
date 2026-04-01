import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const subjectId = 'caf-7';

async function parseAndSeed(filename: string) {
  const filePath = path.join(__dirname, 'data', filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const questions: any[] = JSON.parse(content);

  console.log(`Deleting existing ${subjectId} questions from database...`);
  const { error: deleteError } = await supabase
    .from('questions')
    .delete()
    .eq('subject_id', subjectId);
    
  if (deleteError) {
    console.error('Error deleting existing questions:', deleteError);
    return;
  }
  console.log('Successfully deleted existing questions.');

  console.log(`Parsed ${questions.length} questions from ${filename}`);
  let successCount = 0;
  
  for (const q of questions) {
    const qId = crypto.randomUUID();
    
    const { error: qError } = await supabase
      .from('questions')
      .insert({
        id: qId,
        level: 'caf',
        subject_id: subjectId,
        topic: q.chapterTitle,
        chapter: q.chapter,
        question_text: q.question,
        explanation: q.explanation,
        difficulty: 'Medium',
        is_active: true
      });

    if (qError) {
      console.error(`Error inserting question ${q.id}:`, qError);
      continue;
    }

    const { error: optsError } = await supabase
      .from('options')
      .insert(
        q.options.map((optText: string) => {
          const key = optText.substring(0, 1);
          // Assuming format "A) Text"
          const text = optText.substring(3).trim();
          
          // Match the correct answer
          // q.correctAnswer is like "C) Nominal data..."
          const isCorrect = optText.startsWith(q.correctAnswer.substring(0, 2));
          
          return {
            question_id: qId,
            option_key: key,
            option_text: text,
            is_correct: isCorrect
          };
        })
      );

    if (optsError) {
      console.error(`Error inserting options for ${q.id}:`, optsError);
    } else {
      successCount++;
    }
  }
  console.log(`Successfully seeded ${successCount} questions from ${filename}.`);
}

async function run() {
  await parseAndSeed('caf7-bia.json');
}

run().catch(console.error);
