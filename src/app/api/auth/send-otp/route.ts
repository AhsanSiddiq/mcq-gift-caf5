import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in Supabase
    const { error: insertError } = await supabase
      .from("otp_sessions")
      .insert({ email: normalizedEmail, otp_code: otp, expires_at: expiresAt.toISOString() });

    if (insertError) {
      console.error("[send-otp] insert error:", insertError);
      return NextResponse.json({ error: "Failed to generate OTP." }, { status: 500 });
    }

    // Send email via Gmail
    await transporter.sendMail({
      from: `"The CA Hub" <${process.env.GMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your CA Hub Verification Code",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #111; border-radius: 16px; overflow: hidden; border: 1px solid #222;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a6b3c 0%, #22c55e 100%); padding: 36px 32px 28px; text-align: center;">
            <div style="display: inline-flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.15); border-radius: 50%; width: 56px; height: 56px; margin-bottom: 14px;">
              <span style="font-size: 28px;">🎓</span>
            </div>
            <h1 style="margin: 0 0 4px; font-size: 26px; font-weight: 900; color: #fff; letter-spacing: -0.5px;">The CA Hub</h1>
            <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.75); font-weight: 500;">Pakistan's CA Students Platform</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <h2 style="margin: 0 0 10px; font-size: 19px; font-weight: 700; color: #fff;">Your Verification Code</h2>
            <p style="margin: 0 0 24px; font-size: 14px; color: #999; line-height: 1.7;">
              Use the code below to sign in to your CA Hub account and sync your progress across all your devices. This code is valid for <strong style="color: #e5e5e5;">10 minutes</strong>.
            </p>

            <!-- OTP Box -->
            <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 14px; padding: 28px 24px; text-align: center; margin-bottom: 24px;">
              <p style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #555; font-weight: 600;">Verification Code</p>
              <span style="font-size: 44px; font-weight: 900; letter-spacing: 14px; color: #22c55e; font-family: 'Courier New', monospace;">${otp}</span>
            </div>

            <!-- Spam Warning -->
            <div style="background: #1c1a10; border: 1px solid #3a3010; border-radius: 10px; padding: 14px 16px; margin-bottom: 24px; display: flex; align-items: flex-start; gap: 10px;">
              <span style="font-size: 16px; flex-shrink: 0;">⚠️</span>
              <p style="margin: 0; font-size: 12.5px; color: #bba94a; line-height: 1.6;">
                <strong>Can't see this email?</strong> Check your <strong>Spam</strong> or <strong>Junk</strong> folder. To avoid this in future, add <strong>thecahub01@gmail.com</strong> to your contacts.
              </p>
            </div>

            <p style="margin: 0; font-size: 12px; color: #555; line-height: 1.7;">
              If you didn't request this code, you can safely ignore this email. Your account remains secure.
            </p>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #1f1f1f; padding: 18px 32px; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #444;">© 2026 The CA Hub · Pakistan ·
              <a href="https://thecahub.com" style="color: #22c55e; text-decoration: none;">thecahub.com</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-otp] error:", err);
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
