import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

async function check() {
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', 'prc-3');
    
  if (error) {
    console.error(error);
  } else {
    console.log(`Successfully found ${count} questions for prc-3.`);
  }
}

check();
