import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Merging caf-4-bl and caf-4-cl back to caf-4...");

  // 1. Move caf-4-bl to caf-4
  const { data: blQuestions, error: blError } = await supabase
    .from('questions')
    .update({ subject_id: 'caf-4' })
    .eq('subject_id', 'caf-4-bl')
    .select('id');

  if (blError) {
    console.error("Error updating caf-4-bl:", blError);
  } else {
    console.log(`Moved ${blQuestions?.length || 0} questions from caf-4-bl to caf-4.`);
  }

  // 2. Fetch caf-4-cl to shift chapter numbers
  const { data: clQuestions, error: clFetchError } = await supabase
    .from('questions')
    .select('id, chapter')
    .eq('subject_id', 'caf-4-cl');

  if (clFetchError) {
    console.error("Error fetching caf-4-cl:", clFetchError);
    return;
  }

  console.log(`Shifting ${clQuestions?.length || 0} questions from caf-4-cl to caf-4 and +15 on chapters...`);
  
  let clCount = 0;
  for (const q of clQuestions || []) {
    const { error: clUpdateError } = await supabase
      .from('questions')
      .update({ subject_id: 'caf-4', chapter: q.chapter + 15 })
      .eq('id', q.id);

    if (clUpdateError) {
      console.error(`Failed to update CL question ${q.id}:`, clUpdateError);
    } else {
      clCount++;
    }
  }

  console.log(`Moved and shifted ${clCount} questions from caf-4-cl to caf-4.`);
  console.log("Merge complete!");
}

run().catch(console.error);
