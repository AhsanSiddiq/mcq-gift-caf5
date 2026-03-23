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

const subjectId = 'caf-2';

async function parseAndSeed(filename: string) {
  const filePath = path.join(__dirname, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);

  let currentChapter = 0;
  let currentTitle = '';
  const questions: any[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().startsWith('chapter ')) {
      currentChapter = parseInt(line.split(' ')[1], 10);
      currentTitle = lines[i+1];
      i++; // skip the title line
      continue;
    }
    if (line.startsWith('Question ')) {
      // Parse the question block
      const qMatch = line.match(/Question \d+ (.*?) A\) (.*?) B\) (.*?) C\) (.*?) D\) (.*?) Correct Answer: ([A-D]) Explanation: (.*)/);
      if (qMatch) {
        questions.push({
          chapter: currentChapter,
          topic: currentTitle,
          text: qMatch[1].trim(),
          options: [
            { key: 'A', text: qMatch[2].trim() },
            { key: 'B', text: qMatch[3].trim() },
            { key: 'C', text: qMatch[4].trim() },
            { key: 'D', text: qMatch[5].trim() }
          ],
          correctKey: qMatch[6].trim(),
          explanation: qMatch[7].trim()
        });
      } else {
        console.error("Failed to parse line:", line.substring(0, 80));
      }
    }
  }

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
        topic: q.topic.split(' (')[0], // Remove (Grid B) if present
        chapter: q.chapter,
        question_text: q.text,
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
        q.options.map((opt: any) => ({
          question_id: qId,
          option_key: opt.key,
          option_text: opt.text,
          is_correct: opt.key === q.correctKey
        }))
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
  // await parseAndSeed('caf2-part2-a.txt');
  // await parseAndSeed('caf2-part2-b.txt');
  // await parseAndSeed('caf2-part3-a.txt');
  // await parseAndSeed('caf2-part3-b.txt');
  await parseAndSeed('caf2-part4.txt');
  await parseAndSeed('caf2-part5.txt');
  await parseAndSeed('caf2-part6.txt');
}

run().catch(console.error);
