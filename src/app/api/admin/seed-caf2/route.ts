/**
 * TEMPORARY admin route — DELETE AFTER USE
 * GET /api/admin/seed-caf2
 * 
 * 1. Deletes all existing caf-2 questions + options
 * 2. Reads all caf2-batch*.json files from /scripts/
 * 3. Inserts them into Supabase
 */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const SUBJECT_ID = "caf-2";

function parseOptionKey(optionStr: string): string {
  return optionStr.charAt(0).toUpperCase();
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const log: string[] = [];

  // ── Step 1: Delete existing ──────────────────────────────────────────
  const { data: existingQs, error: fetchErr } = await supabase
    .from("questions")
    .select("id")
    .eq("subject_id", SUBJECT_ID);

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });

  if (existingQs && existingQs.length > 0) {
    const ids = existingQs.map((q: any) => q.id);

    // Delete options first
    await supabase.from("options").delete().in("question_id", ids);
    // Delete questions
    await supabase.from("questions").delete().eq("subject_id", SUBJECT_ID);

    log.push(`Deleted ${ids.length} existing questions.`);
  } else {
    log.push("No existing questions found.");
  }

  // ── Step 2: Find batch files ─────────────────────────────────────────
  const scriptsDir = path.join(process.cwd(), "scripts");
  const batchFiles = fs.readdirSync(scriptsDir)
    .filter((f) => /^caf2-batch\d+\.json$/.test(f))
    .sort()
    .map((f) => path.join(scriptsDir, f));

  if (batchFiles.length === 0) {
    return NextResponse.json({ error: "No caf2-batch*.json files found in /scripts/" }, { status: 400 });
  }

  log.push(`Found batch files: ${batchFiles.map((f) => path.basename(f)).join(", ")}`);

  // ── Step 3: Insert each batch ─────────────────────────────────────────
  let totalSuccess = 0;
  let totalFailed = 0;

  for (const filePath of batchFiles) {
    const items: any[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    let fileSuccess = 0;
    let fileFailed = 0;

    for (const item of items) {
      const qId = crypto.randomUUID();
      const correctKey = parseOptionKey(item.correctAnswer);

      const { error: qErr } = await supabase.from("questions").insert({
        id: qId,
        level: "caf",
        subject_id: SUBJECT_ID,
        topic: item.chapterTitle,
        chapter: item.chapter,
        question_text: item.question,
        explanation: item.explanation,
        difficulty: "Medium",
        is_active: true,
      });

      if (qErr) {
        fileFailed++;
        continue;
      }

      const options = item.options.map((optStr: string) => ({
        question_id: qId,
        option_key: parseOptionKey(optStr),
        option_text: optStr.substring(3).trim(),
        is_correct: parseOptionKey(optStr) === correctKey,
      }));

      const { error: oErr } = await supabase.from("options").insert(options);
      if (oErr) fileFailed++;
      else fileSuccess++;
    }

    log.push(`${path.basename(filePath)}: ${fileSuccess} ok, ${fileFailed} failed`);
    totalSuccess += fileSuccess;
    totalFailed += fileFailed;
  }

  // ── Step 4: Count final state ─────────────────────────────────────────
  const { count } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("subject_id", SUBJECT_ID);

  return NextResponse.json({
    success: true,
    log,
    totalInserted: totalSuccess,
    totalFailed,
    finalCountInDB: count,
  });
}
