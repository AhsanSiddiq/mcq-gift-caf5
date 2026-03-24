/**
 * import-caf2-clean.ts
 * 
 * Step 1: Deletes ALL existing CAF-2 questions (options cascade via FK)
 * Step 2: Imports from all caf2-batch*.json files found in the scripts folder
 * 
 * JSON format expected:
 * { id, chapter, chapterTitle, question, options: ["A) ...", "B) ...", ...], correctAnswer: "B) ...", explanation }
 * 
 * Run: npx ts-node --project tsconfig.scripts.json scripts/import-caf2-clean.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const SUBJECT_ID = 'caf-2';

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function parseOptionKey(optionStr: string): string {
  // "B) Some text" → "B"
  return optionStr.charAt(0).toUpperCase();
}

// ──────────────────────────────────────────────
// Step 1 – Delete existing CAF-2 data
// ──────────────────────────────────────────────

async function deleteExisting() {
  console.log(`\n🗑️  Deleting all existing questions for subject: ${SUBJECT_ID} ...`);

  // First get all question IDs for this subject
  const { data: questions, error: fetchErr } = await supabase
    .from('questions')
    .select('id')
    .eq('subject_id', SUBJECT_ID);

  if (fetchErr) {
    console.error('❌ Error fetching existing questions:', fetchErr.message);
    process.exit(1);
  }

  if (!questions || questions.length === 0) {
    console.log('ℹ️  No existing questions found — skipping delete step.');
    return;
  }

  const ids = questions.map((q: any) => q.id);
  console.log(`   Found ${ids.length} questions to delete.`);

  // Delete options first (in case there is no cascade)
  const { error: optErr } = await supabase
    .from('options')
    .delete()
    .in('question_id', ids);

  if (optErr) {
    console.error('❌ Error deleting options:', optErr.message);
    process.exit(1);
  }

  // Delete questions
  const { error: qErr } = await supabase
    .from('questions')
    .delete()
    .eq('subject_id', SUBJECT_ID);

  if (qErr) {
    console.error('❌ Error deleting questions:', qErr.message);
    process.exit(1);
  }

  console.log(`✅ Deleted ${ids.length} questions (and their options).`);
}

// ──────────────────────────────────────────────
// Step 2 – Import from batch JSON files
// ──────────────────────────────────────────────

async function importBatch(filePath: string) {
  console.log(`\n📂 Importing from: ${path.basename(filePath)}`);

  const raw = fs.readFileSync(filePath, 'utf-8');
  const items: any[] = JSON.parse(raw);

  let success = 0;
  let failed = 0;

  for (const item of items) {
    const qId = crypto.randomUUID();
    const correctKey = parseOptionKey(item.correctAnswer);

    // Insert question
    const { error: qErr } = await supabase.from('questions').insert({
      id: qId,
      level: 'caf',
      subject_id: SUBJECT_ID,
      topic: item.chapterTitle,
      chapter: item.chapter,
      question_text: item.question,
      explanation: item.explanation,
      difficulty: 'Medium',
      is_active: true,
    });

    if (qErr) {
      console.error(`   ❌ Failed to insert question ${item.id}:`, qErr.message);
      failed++;
      continue;
    }

    // Build options
    const options = item.options.map((optStr: string) => ({
      question_id: qId,
      option_key: parseOptionKey(optStr),
      option_text: optStr.substring(3).trim(), // strip "A) "
      is_correct: parseOptionKey(optStr) === correctKey,
    }));

    const { error: oErr } = await supabase.from('options').insert(options);

    if (oErr) {
      console.error(`   ❌ Failed to insert options for ${item.id}:`, oErr.message);
      failed++;
    } else {
      success++;
    }
  }

  console.log(`   ✅ ${success} inserted, ❌ ${failed} failed (from ${items.length} items)`);
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════');
  console.log(' CAF-2 Clean Reseed Script');
  console.log('═══════════════════════════════════════');

  // Delete all existing CAF-2 data
  await deleteExisting();

  // Find all caf2-batch*.json files in the scripts folder
  const scriptsDir = path.join(__dirname);
  const batchFiles = fs.readdirSync(scriptsDir)
    .filter(f => f.match(/^caf2-batch\d+\.json$/))
    .sort()
    .map(f => path.join(scriptsDir, f));

  if (batchFiles.length === 0) {
    console.error('\n❌ No caf2-batch*.json files found in scripts/');
    process.exit(1);
  }

  console.log(`\n📦 Found ${batchFiles.length} batch file(s): ${batchFiles.map(f => path.basename(f)).join(', ')}`);

  for (const file of batchFiles) {
    await importBatch(file);
  }

  // Summary
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', SUBJECT_ID);

  console.log(`\n═══════════════════════════════════════`);
  console.log(`🎉 Done! Total CAF-2 questions in DB: ${count}`);
  console.log(`═══════════════════════════════════════\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
