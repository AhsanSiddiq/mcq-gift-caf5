import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const subjectId = 'caf-8';

async function parseAndSeed(filename: string) {
  const filePath = path.join(__dirname, 'data', filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const questions: any[] = JSON.parse(content);

  console.log(`Processing ${questions.length} questions from ${filename}...`);
  let successCount = 0;
  
  for (const q of questions) {
    // Check if question already exists to avoid duplicates if re-running
    const { data: existing } = await supabase
      .from('questions')
      .select('id')
      .eq('id', `caf8-${q.id}`)
      .single();

    if (existing) {
      console.log(`Question caf8-${q.id} already exists, skipping.`);
      successCount++;
      continue;
    }

    const { error: qError } = await supabase
      .from('questions')
      .insert({
        id: `caf8-${q.id}`,
        level: 'caf',
        subject_id: subjectId,
        topic: q.chapterTitle,
        chapter: q.chapter,
        question_text: q.question,
        explanation: q.explanation,
        difficulty: 'Medium',
        is_active: true,
        source: 'ICAP Study Text'
      });

    if (qError) {
      console.error(`Error inserting question ${q.id}:`, qError);
      continue;
    }

    const optionsToInsert = q.options.map((optText: string) => {
      const key = optText.substring(0, 1);
      // Format "A) Text"
      const text = optText.substring(3).trim();
      
      // Match the correct answer
      // q.correctAnswer is like "B) The expectation gap" or just "B) ..."
      const isCorrect = optText.substring(0, 2) === q.correctAnswer.substring(0, 2);
      
      return {
        question_id: `caf8-${q.id}`,
        option_key: key,
        option_text: text,
        is_correct: isCorrect
      };
    });

    const { error: optsError } = await supabase
      .from('options')
      .insert(optionsToInsert);

    if (optsError) {
      console.error(`Error inserting options for ${q.id}:`, optsError);
    } else {
      successCount++;
    }
  }
  console.log(`Successfully processed ${successCount}/${questions.length} questions from ${filename}.`);
}

async function run() {
  // We can delete existing to be clean if needed, but let's just insert
  // console.log(`Deleting existing ${subjectId} questions...`);
  // await supabase.from('questions').delete().eq('subject_id', subjectId);

  await parseAndSeed('caf8-p1.json');
  await parseAndSeed('caf8-p2.json');
  await parseAndSeed('caf8-p3.json');
}

run().catch(console.error);
