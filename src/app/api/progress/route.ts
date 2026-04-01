import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// GET /api/progress?email=x&token=y&subject=z
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.toLowerCase().trim();
  const subjectId = searchParams.get("subject");

  if (!email) {
    return NextResponse.json({ error: "Email required." }, { status: 400 });
  }

  let query = supabase
    .from("user_progress")
    .select("subject_id, progress_json, updated_at")
    .eq("email", email)
    .neq("subject_id", "__session__");

  if (subjectId) query = (query as any).eq("subject_id", subjectId);

  const { data, error } = await query;

  if (error) {
    console.error("[progress GET]", error);
    return NextResponse.json({ error: "Failed to fetch." }, { status: 500 });
  }

  return NextResponse.json({ progress: data ?? [] });
}

// POST /api/progress — body: { email, subject_id, progress }
export async function POST(req: NextRequest) {
  try {
    const { email, subject_id, progress } = await req.json();

    if (!email || !subject_id || !progress) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { error } = await supabase
      .from("user_progress")
      .upsert(
        { email: normalizedEmail, subject_id, progress_json: progress, updated_at: new Date().toISOString() },
        { onConflict: "email,subject_id" }
      );

    if (error) {
      console.error("[progress POST]", error);
      return NextResponse.json({ error: "Failed to save." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[progress POST] error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
