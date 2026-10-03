import { NextRequest, NextResponse } from "next/server";
import { adminSupabase as supabase, verifySession } from "@/lib/session";

// GET /api/progress?subject=z   (headers: x-cah-email, x-cah-token)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = (req.headers.get("x-cah-email") || searchParams.get("email"))?.toLowerCase().trim();
  const token = req.headers.get("x-cah-token") || searchParams.get("token");
  const subjectId = searchParams.get("subject");

  if (!email) {
    return NextResponse.json({ error: "Email required." }, { status: 400 });
  }
  if (!(await verifySession(email, token))) {
    return NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401 });
  }

  let query = supabase
    .from("user_progress")
    .select("subject_id, progress_json, updated_at")
    .eq("email", email)
    .neq("subject_id", "__session__");

  if (subjectId) query = query.eq("subject_id", subjectId);

  const { data, error } = await query;

  if (error) {
    console.error("[progress GET]", error);
    return NextResponse.json({ error: "Failed to fetch." }, { status: 500 });
  }

  return NextResponse.json({ progress: data ?? [] });
}

// POST /api/progress — body: { email, token, subject_id, progress }
export async function POST(req: NextRequest) {
  try {
    const { email, token, subject_id, progress } = await req.json();

    if (!email || !subject_id || !progress || typeof subject_id !== "string" || subject_id === "__session__") {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    if (!(await verifySession(normalizedEmail, token))) {
      return NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401 });
    }

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
