import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);
const SUBJECT_ID = 'prc-3';

async function fetchMisfits() {
  const { data, error } = await supabase
    .from('questions')
    .select('id, chapter, topic, question_text')
    .eq('subject_id', SUBJECT_ID)
    .in('chapter', [9, 10]);

  if (error) {
    console.error('Error fetching questions:', error);
    return;
  }

  for (const q of data) {
    console.log(`[Ch ${q.chapter}] ${q.topic}`);
    console.log(`Q: ${q.question_text}\n`);
  }
}

fetchMisfits().catch(console.error);
