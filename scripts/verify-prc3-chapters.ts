import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables! Check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const SUBJECT_ID = 'prc-3';

async function checkChapters() {
  const { data, error } = await supabase
    .from('questions')
    .select('chapter, topic')
    .eq('subject_id', SUBJECT_ID)
    .order('chapter', { ascending: true });

  if (error) {
    console.error('Error fetching questions:', error);
    return;
  }

  const chapterMap = new Map();
  data.forEach(q => {
    const key = `${q.chapter}: ${q.topic}`;
    chapterMap.set(key, (chapterMap.get(key) || 0) + 1);
  });

  console.log(`Found ${data.length} total questions for ${SUBJECT_ID}.`);
  console.log('--- Chapters found ---');
  for (const [key, count] of chapterMap.entries()) {
    console.log(`${key} (${count} questions)`);
  }
}

checkChapters().catch(console.error);
