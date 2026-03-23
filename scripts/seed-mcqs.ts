/**
 * Seed script: pushes all MCQs from the static mcqs.ts file into Supabase.
 *
 * ONE-TIME SETUP:
 * 1. Add SUPABASE_SERVICE_KEY to .env.local (get from Supabase > Settings > API > service_role key)
 * 2. Run: npx tsx scripts/seed-mcqs.ts
 */

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import { mcqs } from "../src/data/mcqs";

// Use service role key for seeding (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function seed() {
  console.log(`Seeding ${mcqs.length} CAF-5 questions into Supabase...`);

  for (const mcq of mcqs) {
    // 1. Insert the question
    const { data: question, error: qErr } = await supabase
      .from("questions")
      .insert({
        id: mcq.id,
        subject_id: "caf-5",
        level: "CAF",
        topic: mcq.chapterTitle,
        chapter: mcq.chapter,
        question_text: mcq.question,
        explanation: mcq.explanation,
        difficulty: "medium",
        source: "ICAP Study Text",
        is_active: true,
      })
      .select("id")
      .single();

    if (qErr) {
      if (qErr.code !== "23505") console.error(`Question ${mcq.id}:`, qErr.message);
      continue;
    }

    // 2. Insert the 4 options
    const optionRows = mcq.options.map((opt: string) => ({
      question_id: question.id,
      option_key: opt.charAt(0),
      option_text: opt.substring(3),
      is_correct: opt === mcq.correctAnswer,
    }));

    const { error: oErr } = await supabase.from("options").insert(optionRows);
    if (oErr) console.error(`Options for ${mcq.id}:`, oErr.message);
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
