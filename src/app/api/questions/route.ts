import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subject") || "caf-5";
  const topic = searchParams.get("topic");
  const chapter = searchParams.get("chapter");

  let query = supabase
    .from("questions")
    .select(`id, subject_id, topic, chapter, question_text, explanation, difficulty, options(option_key, option_text, is_correct)`)
    .eq("subject_id", subjectId)
    .eq("is_active", true);

  if (chapter) query = query.eq("chapter", parseInt(chapter));
  if (topic)   query = query.eq("topic", topic);

  const { data, error } = await query.order("chapter").order("created_at");

  if (error) {
    console.error("[questions]", error);
    return NextResponse.json({ error: "Failed to fetch questions." }, { status: 500 });
  }

  return NextResponse.json({ questions: data });
}
