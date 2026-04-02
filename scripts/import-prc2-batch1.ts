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

async function importPRC2Batch1() {
  console.log('Starting PRC-2 (Quantitative Analysis for Business) Batch 1 Import...');
  const dataDir = path.join(__dirname, 'data');
  const files = [
    'prc2-batch1-p1.json',
    'prc2-batch1-p2.json',
    'prc2-batch1-p3.json',
    'prc2-batch1-p4.json'
  ];
  
  let allQuestions: any[] = [];
  
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
      allQuestions = allQuestions.concat(JSON.parse(fs.readFileSync(filePath, 'utf-8')));
    } else {
      console.warn(`File not found: ${file}`);
    }
  }
  
  console.log(`Parsed ${allQuestions.length} questions.`);
  
  if (allQuestions.length === 0) {
    console.log('No questions to import.');
    return;
  }

  // Optional: clear existing questions for this subject to avoid duplicates if re-running
  console.log('Deleting existing PRC-2 questions to ensure clean import...');
  const { error: delError } = await supabase
    .from('questions')
    .delete()
    .eq('subject_id', 'prc-2');
    
  if (delError) {
    console.warn('Error deleting existing questions (might be fresh subject):', delError);
  }

  let count = 0;
  for (const q of allQuestions) {
    const qId = crypto.randomUUID();
    
    const { error: qError } = await supabase.from('questions').insert({
      id: qId, 
      level: 'prc', 
      subject_id: 'prc-2', 
      topic: q.chapterTitle,
      chapter: q.chapter, 
      question_text: q.question, 
      explanation: q.explanation, 
      difficulty: 'Medium', 
      is_active: true,
    });
    
    if (qError) { 
        console.error(`Error inserting question ${q.id}:`, qError); 
        continue; 
    }
    
    const cleanCorrect = q.correctAnswer.trim();
    const opts = q.options.map((opt: string) => {
      const key = opt.substring(0, 1);
      const text = opt.includes(') ') ? opt.split(') ').slice(1).join(') ').trim() : opt.substring(3).trim();
      return {
        question_id: qId, 
        option_key: key,
        option_text: text,
        is_correct: opt.trim() === cleanCorrect,
      };
    });
    
    const { error: optError } = await supabase.from('options').insert(opts);
    
    if (optError) { 
        console.error(`Error inserting options for ${q.id}:`, optError); 
    } else { 
        count++; 
        if (count % 20 === 0) console.log(`  ${count}/${allQuestions.length}...`); 
    }
  }
  
  console.log(`\nDone! Seeded ${count}/${allQuestions.length} questions for PRC-2 Batch 1.`);
}

importPRC2Batch1().catch(console.error);
