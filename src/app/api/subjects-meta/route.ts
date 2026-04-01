import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Cache subject meta at the edge for 5 minutes
export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subject");

  let allData: any[] = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    let query = supabase
      .from("questions")
      .select("subject_id, chapter, topic")
      .eq("is_active", true)
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (subjectId) query = query.eq("subject_id", subjectId);

    const { data, error } = await query;
    if (error) {
      console.error("[subjects-meta]", error);
      return NextResponse.json({ error: "Failed to fetch." }, { status: 500 });
    }

    if (!data || data.length === 0) break;
    allData.push(...data);
    
    // If we received less than pageSize, we've hit the end
    if (data.length < pageSize) break;
    page++;
  }

  // Build a map: subject_id -> { chapters: Map<chapter, { topic, count }> }
  const subjectMap: Record<string, { total: number; chapters: { chapter: number; topic: string; count: number }[] }> = {};

  for (const row of allData) {
    if (!subjectMap[row.subject_id]) {
      subjectMap[row.subject_id] = { total: 0, chapters: [] };
    }
    const subject = subjectMap[row.subject_id];
    subject.total++;
    const existing = subject.chapters.find((c) => c.chapter === row.chapter);
    if (existing) {
      existing.count++;
    } else {
      subject.chapters.push({ chapter: row.chapter, topic: row.topic || `Chapter ${row.chapter}`, count: 1 });
    }
  }

  // Sort chapters within each subject
  for (const subject of Object.values(subjectMap)) {
    subject.chapters.sort((a, b) => a.chapter - b.chapter);
  }

  return NextResponse.json({ subjects: subjectMap });
}
