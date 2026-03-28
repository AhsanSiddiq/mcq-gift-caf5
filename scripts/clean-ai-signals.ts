import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const aiRegex = /\s*\[[\d,\s-]+\]/g;

async function cleanSupabase() {
  console.log("Fetching all questions from Supabase...");
  
  let allQuestions: any[] = [];
  let from = 0;
  const step = 1000;
  let fetchMore = true;

  while (fetchMore) {
    const { data, error } = await supabase
      .from('questions')
      .select('id, explanation')
      .range(from, from + step - 1);

    if (error) {
      console.error("Error fetching questions:", error);
      return;
    }

    if (data && data.length > 0) {
      allQuestions = allQuestions.concat(data);
      from += step;
    } else {
      fetchMore = false;
    }
  }

  console.log(`Found ${allQuestions.length} questions in total.`);

  let updateCount = 0;
  for (const q of allQuestions) {
    if (q.explanation && aiRegex.test(q.explanation)) {
      const cleaned = q.explanation.replace(aiRegex, '').trim();
      
      const { error: updateError } = await supabase
        .from('questions')
        .update({ explanation: cleaned })
        .eq('id', q.id);

      if (updateError) {
        console.error(`Failed to update ${q.id}:`, updateError);
      } else {
        updateCount++;
      }
    }
  }

  console.log(`Successfully cleaned ${updateCount} questions in Supabase.`);
}

async function run() {
  console.log("Starting Global AI Signal Supabase Cleanup (Paginated)...");
  await cleanSupabase();
  console.log("Cleanup complete!");
}

run().catch(console.error);
