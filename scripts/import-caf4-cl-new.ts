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

async function seedSubject(subjectId: string, filename: string) {
  const filePath = path.join(process.cwd(), 'scripts', 'data', filename);
  const rawData = fs.readFileSync(filePath, 'utf8');
  const questions = JSON.parse(rawData);

  console.log(`Starting import for ${subjectId} (${questions.length} questions)...`);

  // 1. Delete existing questions for this subject
  console.log(`Deleting existing ${subjectId} questions...`);
  await supabase.from('questions').delete().eq('subject_id', subjectId);

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
      const key = opt.substring(0, 1);
      const text = opt.includes(') ') ? opt.split(') ').slice(1).join(') ').trim() : opt.trim();
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
    }
  }

  console.log(`Successfully imported ${count} questions for ${subjectId}`);
}

seedSubject('caf-4-cl', 'caf4-cl-new.json').catch(console.error);
