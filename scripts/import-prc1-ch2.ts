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

const subjectId = 'prc-1';

async function parseAndSeed(filename: string) {
  const filePath = path.join(__dirname, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const questions: any[] = JSON.parse(content);

  console.log(`Parsed ${questions.length} questions from ${filename}`);
  let successCount = 0;
  
  for (const q of questions) {
    const qId = crypto.randomUUID();
    
    // In part 3 explanations the user provided string values, we should check for errors.
    const { error: qError } = await supabase
      .from('questions')
      .insert({
        id: qId,
        level: 'prc',
        subject_id: subjectId,
        topic: q.chapterTitle,
        chapter: q.chapter,
        question_text: q.question,
        explanation: q.explanation,
        difficulty: 'Medium',
        is_active: true
      });

    if (qError) {
      console.error('Error inserting question:', qError);
      continue;
    }

    const { error: optsError } = await supabase
      .from('options')
      .insert(
        q.options.map((optText: string) => {
          const key = optText.substring(0, 1);
          // the answer options text is provided like "A) Some answer".
          const text = optText.substring(3).trim();
          return {
            question_id: qId,
            option_key: key,
            option_text: text,
            is_correct: optText.startsWith(q.correctAnswer.substring(0, 2))
          };
        })
      );

    if (optsError) {
      console.error('Error inserting options:', optsError);
    } else {
      successCount++;
    }
  }
  console.log(`Successfully seeded ${successCount} questions from ${filename}.`);
}

async function run() {
  await parseAndSeed('prc1-ch2-part1.json');
  await parseAndSeed('prc1-ch2-part2.json');
  await parseAndSeed('prc1-ch2-part3.json');
}

run().catch(console.error);
