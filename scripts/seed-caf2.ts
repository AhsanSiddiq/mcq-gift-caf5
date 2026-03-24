import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const subjectId = "caf-2";

  console.log(`Deleting existing CAF-2 questions for Chapters 1-19 to replace with completely seeded data...`);
  const chapters = Array.from({length: 19}, (_, i) => i + 1);
  const { error: delErr } = await supabase
    .from('questions')
    .delete()
    .eq('subject_id', subjectId)
    .in('chapter', chapters);
    
  if (delErr) console.error("Error deleting old questions:", delErr.message);

  let allMCQs: any[] = [];
  const dataDir = path.join(__dirname, 'data');
  if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir).filter(f => f.startsWith('batch') && f.endsWith('.json'));
      for (const f of files) {
          console.log(`Loading file: ${f}`);
          const raw = fs.readFileSync(path.join(dataDir, f), 'utf-8');
          allMCQs = allMCQs.concat(JSON.parse(raw));
      }
  }

  console.log(`Total MCQs loaded: ${allMCQs.length}`);
  if (allMCQs.length === 0) {
      console.log("No MCQs to seed.");
      return;
  }
  
  let successCount = 0;
  
  for (const q of allMCQs) {
    const qId = crypto.randomUUID();
    const topic = q.chapterTitle || "General";
    
    const isCorrectOptions = q.options.map((optText: string) => {
        return optText.trim() === q.correctAnswer.trim();
    });
    
    let correctIndex = isCorrectOptions.indexOf(true);
    if (correctIndex === -1) {
        correctIndex = q.options.findIndex((optText: string) => q.correctAnswer.includes(optText) || optText.includes(q.correctAnswer));
    }
    
    const { data: insertedQuestion, error: qError } = await supabase
      .from('questions')
      .insert({
        id: qId,
        level: 'caf',
        subject_id: subjectId,
        topic: topic,
        chapter: q.chapter,
        question_text: q.question,
        explanation: q.explanation || '',
        difficulty: 'Medium',
        is_active: true
      })
      .select()
      .single();

    if (qError) {
      console.error(`Error inserting question (Chapter ${q.chapter}):`, qError.message);
      continue;
    }

    const optionsToInsert = q.options.map((optText: string, index: number) => {
        const keys = ['A', 'B', 'C', 'D', 'E'];
        return {
            question_id: insertedQuestion.id,
            option_key: keys[index],
            option_text: optText,
            is_correct: index === correctIndex || (correctIndex === -1 && index === 0)
        };
    });

    const { error: oError } = await supabase.from('options').insert(optionsToInsert);

    if (oError) {
      console.error('Error inserting options:', oError.message);
    } else {
      successCount++;
    }
  }

  console.log(`Successfully seeded ${successCount} questions for CAF-2.`);
}

seed().catch(console.error);
