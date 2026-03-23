import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, count, error } = await supabase
    .from('questions')
    .select('id, topic, chapter', { count: 'exact' })
    .eq('subject_id', 'prc-1');

  if (error) {
    console.error('Error fetching questions:', error);
    return;
  }

  console.log(`Total questions for prc-1: ${count}`);
  const topics = Array.from(new Set(data?.map(q => q.topic) || []));
  console.log('Topics found:', topics);
  
  const chapters = Array.from(new Set(data?.map(q => q.chapter) || []));
  console.log('Chapters found:', chapters);
}

check().catch(console.error);
