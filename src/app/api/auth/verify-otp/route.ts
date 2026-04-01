import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

function generateToken(email: string): string {
  const secret = process.env.OTP_SECRET || "fallback_secret";
  return crypto.createHmac("sha256", secret).update(email + "|" + Date.now()).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
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

    if (session.otp_code !== otp.trim()) {
      return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 400 });
    }

    // Mark as verified
    await supabase
      .from("otp_sessions")
      .update({ verified: true })
      .eq("id", session.id);

    // Generate a session token
    const token = generateToken(normalizedEmail);

    // Store token in user_progress table as a lightweight session marker
    await supabase
      .from("user_progress")
      .upsert(
        { email: normalizedEmail, subject_id: "__session__", progress_json: { token, created_at: new Date().toISOString() } },
        { onConflict: "email,subject_id" }
      );

    return NextResponse.json({ success: true, token, email: normalizedEmail });
  } catch (err) {
    console.error("[verify-otp] error:", err);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
