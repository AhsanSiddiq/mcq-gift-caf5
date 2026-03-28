import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importCaf4() {
  const subjectId = 'caf-4';
  const filePath = path.join(process.cwd(), 'scripts', 'caf4-bl.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const questions = JSON.parse(rawData);

  console.log(`Starting import for ${subjectId} (${questions.length} questions)...`);

  // 1. Delete existing questions for this subject
  console.log(`Deleting existing ${subjectId} questions...`);
  const { error: deleteError } = await supabase
    .from('questions')
    .delete()
    .eq('subject_id', subjectId);

  if (deleteError) {
    console.error('Error deleting existing questions:', deleteError);
    return;
  }

  let count = 0;
  for (const q of questions) {
    const qId = crypto.randomUUID();
    
    // Insert question
    const { error: qError } = await supabase
      .from('questions')
      .insert({
        id: qId,
        level: 'caf',
        subject_id: subjectId,
        topic: q.chapterTitle,
        chapter: q.chapter,
        question_text: q.question,
        explanation: q.explanation || '',
        difficulty: 'Medium',
        is_active: true
      });

    if (qError) {
      console.error(`Error inserting question ${q.id}:`, qError);
      continue;
    }

    // Insert options
    const optionsToInsert = q.options.map((opt: string) => {
      const key = opt.substring(0, 1); // 'A', 'B', 'C', 'D'
      const text = opt.includes(') ') ? opt.split(') ').slice(1).join(') ').trim() : opt.trim();
      
      // Match the correct answer
      const isCorrect = opt.trim() === q.correctAnswer.trim();

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
      if (count % 20 === 0) console.log(`Imported ${count}/${questions.length} questions...`);
    }
  }

  console.log(`Successfully imported ${count} questions for ${subjectId}`);
}

importCaf4().catch(console.error);
