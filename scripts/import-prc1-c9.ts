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
const citationRegex = /\s*\[\s*\d+(?:\s*,\s*\d+)*\s*\]/g;

async function importChapter9() {
  console.log('Starting PRC-1 Chapter 9 (Bank Reconciliations) Import...');
  const dataDir = path.join(__dirname, 'data');
  const files = ['prc1-c9-1.json', 'prc1-c9-2.json', 'prc1-c9-3.json', 'prc1-c9-4.json'];
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

  let count = 0;
  for (const q of allQuestions) {
    const qId = crypto.randomUUID();
    const cleanExplanation = q.explanation ? q.explanation.replace(citationRegex, '').trim() : '';
    
    const { error: qError } = await supabase.from('questions').insert({
      id: qId, 
      level: 'prc', 
      subject_id: 'prc-1', 
      topic: 'Bank Reconciliations',
      chapter: 9, 
      question_text: q.question, 
      explanation: cleanExplanation, 
      difficulty: 'Medium', 
      is_active: true,
    });
    
    if (qError) { 
        console.error(`Error on ${q.id}:`, qError); 
        continue; 
    }
    
    const cleanCorrect = q.correctAnswer.trim();
    const opts = q.options.map((opt: string) => ({
      question_id: qId, 
      option_key: opt.substring(0, 1),
      option_text: opt.includes(') ') ? opt.split(') ').slice(1).join(') ').trim() : opt.trim(),
      is_correct: opt.trim() === cleanCorrect,
    }));
    
    const { error: optError } = await supabase.from('options').insert(opts);
    
    if (optError) { 
        console.error(`Opts error on ${q.id}:`, optError); 
    } else { 
        count++; 
        if (count % 10 === 0) console.log(`  ${count}/${allQuestions.length}...`); 
    }
  }
  
  console.log(`\nDone! Seeded ${count}/${allQuestions.length} questions for PRC-1 Chapter 9.`);
}

importChapter9().catch(console.error);
