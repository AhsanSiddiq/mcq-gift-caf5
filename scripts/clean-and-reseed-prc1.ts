/**
 * clean-and-reseed-prc1.ts
 * 
 * Step 1: Loads prc1-ch1-part1.json and prc1-ch1-part2.json
 * Step 2: Cleans AI references like [1], [1, 2], [3-4] from explanations
 * Step 3: Deletes ALL existing PRC-1 questions in Supabase
 * Step 4: Re-seeds with the cleaned data
 * 
 * Run: npx ts-node --project tsconfig.scripts.json scripts/clean-and-reseed-prc1.ts
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
const SUBJECT_ID = 'prc-1';

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function parseOptionKey(optionStr: string): string {
  return optionStr.charAt(0).toUpperCase();
}

function cleanExplanation(text: string): string {
  if (!text) return text;
  // Patterns like [1], [1, 2], [3-4], [3, 4, 5]
  // We look for a bracket containing numbers, commas, spaces, or hyphens.
  // We also handle an optional leading space.
  return text.replace(/\s?\[\d+(?:[\s,-]\s?\d+)*\]/g, '');
}

// ──────────────────────────────────────────────
// Step 1 – Delete existing PRC-1 data
// ──────────────────────────────────────────────

async function deleteExisting() {
  console.log(`\n🗑️  Deleting all existing questions for subject: ${SUBJECT_ID} ...`);

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

  // Delete options first
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
// Step 2 – Import and Clean
// ──────────────────────────────────────────────

async function importAndClean(filePath: string) {
  console.log(`\n📂 Processing and Importing from: ${path.basename(filePath)}`);

  const raw = fs.readFileSync(filePath, 'utf-8');
  const items: any[] = JSON.parse(raw);

  // Clean the items and save back to file
  const cleanedItems = items.map(item => ({
    ...item,
    explanation: cleanExplanation(item.explanation)
  }));

  fs.writeFileSync(filePath, JSON.stringify(cleanedItems, null, 2), 'utf-8');
  console.log(`   ✅ Cleaned AI references in ${path.basename(filePath)} and saved file.`);

  let success = 0;
  let failed = 0;

  for (const item of cleanedItems) {
    const qId = crypto.randomUUID();
    const correctKey = parseOptionKey(item.correctAnswer);

    // Insert question
    const { error: qErr } = await supabase.from('questions').insert({
      id: qId,
      level: 'prc',
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
      option_text: optStr.substring(3).trim(),
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
  console.log(' PRC-1 Clean and Reseed Script');
  console.log('═══════════════════════════════════════');

  await deleteExisting();

  const scriptsDir = path.join(__dirname);
  const targetFiles = fs.readdirSync(scriptsDir)
    .filter(f => f.match(/^prc1-ch\d+-part\d+\.json$/))
    .sort()
    .map(f => path.join(scriptsDir, f));

  if (targetFiles.length === 0) {
    console.error('\n❌ No prc1-ch*-part*.json files found in scripts/');
    process.exit(1);
  }

  console.log(`\n📦 Found ${targetFiles.length} PRC-1 files to process.`);

  for (const file of targetFiles) {
    if (fs.existsSync(file)) {
      await importAndClean(file);
    } else {
      console.warn(`\n⚠️  File not found: ${path.basename(file)}`);
    }
  }

  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', SUBJECT_ID);

  console.log(`\n═══════════════════════════════════════`);
  console.log(`🎉 Done! Total PRC-1 questions in DB: ${count}`);
  console.log(`═══════════════════════════════════════\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
