import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);
const SUBJECT_ID = 'prc-3';

async function updateMisfits() {
  console.log('Mapping Chapter 9 -> Chapter 3 (Organization of Business)');
  const { error: err1 } = await supabase
    .from('questions')
    .update({ chapter: 3, topic: 'Organization of Business' })
    .eq('subject_id', SUBJECT_ID)
    .eq('chapter', 9);
    
  if (err1) console.error(err1);
  else console.log('Ch 9 updated successfully.');

  console.log('Mapping Chapter 10 -> Chapter 4 (Sources of Business Finance)');
  const { error: err2 } = await supabase
    .from('questions')
    .update({ chapter: 4, topic: 'Sources of Business Finance' })
    .eq('subject_id', SUBJECT_ID)
    .eq('chapter', 10);
    
  if (err2) console.error(err2);
  else console.log('Ch 10 updated successfully.');
}

updateMisfits().catch(console.error);
