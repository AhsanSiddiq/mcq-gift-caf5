import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', 'prc-2');
  
  if (error) {
    console.error('Error fetching count:', error);
  } else {
    console.log(`Total questions for prc-2: ${count}`);
  }

  // Also get count per chapter to see which chapters are done
  const { data, error: e2 } = await supabase
    .from('questions')
    .select('chapter_number, chapter_title')
    .eq('subject_id', 'prc-2')
    .order('chapter_number');

  if (e2) {
    console.error('Error:', e2);
    return;
  }

  const chapMap: Record<number, { title: string; count: number }> = {};
  for (const q of data || []) {
    if (!chapMap[q.chapter_number]) {
      chapMap[q.chapter_number] = { title: q.chapter_title, count: 0 };
    }
    chapMap[q.chapter_number].count++;
  }

  console.log('\nChapter breakdown:');
  for (const [ch, info] of Object.entries(chapMap).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    console.log(`  Ch ${ch} (${info.title}): ${info.count} questions`);
  }
}

check();
