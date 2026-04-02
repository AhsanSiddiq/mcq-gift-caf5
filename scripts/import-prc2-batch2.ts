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

async function importPRC2Batch2() {
  console.log('Starting PRC-2 (Quantitative Analysis for Business) Batch 2 Import...');
  const dataDir = path.join(__dirname, 'data');
  const files = [
    'prc2-batch2-p1.json',
    'prc2-batch2-p2.json',
    'prc2-batch2-p3.json',
    'prc2-batch2-p4.json'
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
  
  console.log(`Parsed ${allQuestions.length} questions from Batch 2.`);
  
  if (allQuestions.length === 0) {
    console.log('No questions to import.');
    return;
  }

  // NOTE: We are NOT deleting existing questions because we are ADDING to Batch 1.
  
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
    
    // Correct answer cleaning and mapping
    const cleanCorrect = q.correctAnswer.trim();
    const opts = q.options.map((opt: string) => {
      const key = opt.substring(0, 1);
      // Strip "A) ", "B) ", etc. from option text
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
  
  console.log(`\nDone! Seeded ${count}/${allQuestions.length} questions for PRC-2 Batch 2.`);
  console.log(`Total PRC-2 questions should now be 360.`);
}

importPRC2Batch2().catch(console.error);
