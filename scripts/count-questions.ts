import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function countQuestions(subjectId: string) {
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', subjectId);

  if (error) {
    console.error(`Error counting questions for ${subjectId}:`, error.message);
  } else {
    console.log(`Total questions for ${subjectId}: ${count}`);
  }
}

async function run() {
  await countQuestions('caf-4-bl');
  await countQuestions('caf-4-cl');
  await countQuestions('caf-3');
  await countQuestions('caf-2');
  await countQuestions('prc-1');
}

run().catch(console.error);
