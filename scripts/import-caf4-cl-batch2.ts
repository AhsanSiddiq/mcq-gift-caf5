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

async function seedBatch2() {
  const filePath = path.join(process.cwd(), 'scripts', 'data', 'caf4-cl-batch2.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const questions = JSON.parse(rawData);

  console.log(`Starting import for caf-4 Batch 2 Company Law (${questions.length} questions)...`);

  let count = 0;
  for (const q of questions) {
    const qId = crypto.randomUUID(); // Giving them brand new UUIDs
    
    // Shift chapter by +15 so it falls perfectly in Company Law's 16-25 range.
    const shiftedChapter = q.chapter + 15;

    // Insert question
    const { error: qError } = await supabase
      .from('questions')
      .insert({
        id: qId,
        level: 'caf',
        subject_id: 'caf-4',
        topic: q.chapterTitle,
        chapter: shiftedChapter,
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

  console.log(`Successfully imported ${count} new Company Law questions into caf-4 with shifted chapters.`);
}

seedBatch2().catch(console.error);
