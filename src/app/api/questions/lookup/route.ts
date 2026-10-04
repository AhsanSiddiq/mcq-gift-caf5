import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MAX_IDS = 200;

/**
 * GET /api/questions/lookup?ids=a,b,c
 * Light metadata for specific questions (subject, chapter, a short question preview).
 * Used by /dashboard to group flagged questions saved before flags recorded their subject.
 */
export async function GET(req: NextRequest) {
  const raw = new URL(req.url).searchParams.get("ids") || "";
  const ids = Array.from(new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))).slice(0, MAX_IDS);
  if (ids.length === 0) return NextResponse.json({ questions: [] });

  const { data, error } = await supabase
    .from("questions")
    .select("id, subject_id, chapter, topic, question_text")
    .in("id", ids)
    .eq("is_active", true);

  if (error) {
    console.error("[questions/lookup]", error);
    return NextResponse.json({ error: "Failed to fetch." }, { status: 500 });
  }

  const questions = (data ?? []).map((r) => {
    const text = String(r.question_text ?? "");
    return {
      id: r.id as string,
      subject_id: r.subject_id as string,
      chapter: r.chapter as number,
      topic: (r.topic as string) || `Chapter ${r.chapter}`,
      preview: text.length > 160 ? `${text.slice(0, 157)}…` : text,
    };
  });

  return NextResponse.json(
    { questions },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
