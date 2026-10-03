import { NextRequest, NextResponse } from "next/server";
import { adminSupabase as supabase, newSessionToken, storeSessionToken } from "@/lib/session";

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp || typeof email !== "string" || typeof otp !== "string") {
      return NextResponse.json({ error: "Email and OTP required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find the most recent unverified OTP for this email
    const { data: session, error } = await supabase
      .from("otp_sessions")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("verified", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "OTP expired or not found. Please request a new one." }, { status: 400 });
    }

    const attempts: number = session.attempts ?? 0;
    if (attempts >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: "Too many wrong attempts. Please request a new code." }, { status: 429 });
    }

    if (session.otp_code !== otp.trim()) {
      // Best-effort: the attempts column is added by supabase/migrations/20261003_growth.sql
      await supabase.from("otp_sessions").update({ attempts: attempts + 1 }).eq("id", session.id);
      return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 400 });
    }

    // Mark as verified
    await supabase
      .from("otp_sessions")
      .update({ verified: true })
      .eq("id", session.id);

    const token = newSessionToken();
    await storeSessionToken(normalizedEmail, token);

    return NextResponse.json({ success: true, token, email: normalizedEmail });
  } catch (err) {
    console.error("[verify-otp] error:", err);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
