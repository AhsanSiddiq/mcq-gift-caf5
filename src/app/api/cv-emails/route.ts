import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});

export async function POST(req: NextRequest) {
  try {
    const { email, name, pdfBase64, filename } = await req.json();
    if (!email?.includes("@")) return NextResponse.json({ ok: true }); // silent skip

    const normalizedEmail = email.toLowerCase().trim();

    // Store for analytics
    await supabase.from("cv_downloads").insert({ email: normalizedEmail, name: name || "" });

    // Send confirmation email
    await transporter.sendMail({
      from: `"The CA Hub" <${process.env.GMAIL_USER}>`,
      to: normalizedEmail,
      subject: `${name ? name + "'s" : "Your"} CA Induction CV — The CA Hub`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#111;border-radius:16px;overflow:hidden;border:1px solid #222;">
          <div style="background:linear-gradient(135deg,#1a6b3c 0%,#22c55e 100%);padding:36px 32px 28px;text-align:center;">
            <span style="font-size:32px;">🎓</span>
            <h1 style="margin:10px 0 4px;font-size:24px;font-weight:900;color:#fff;">The CA Hub</h1>
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);">Pakistan's CA Students Platform</p>
          </div>
          <div style="padding:32px;">
            <h2 style="margin:0 0 12px;font-size:18px;font-weight:700;color:#fff;">Your CV is ready${name ? `, ${name}` : ""}! 🎉</h2>
            <p style="margin:0 0 20px;font-size:14px;color:#999;line-height:1.7;">
              Thanks for using The CA Hub CV Maker. Your CV is attached to this email as a PDF. Come back anytime to update it as you clear more exams or add new experience.
            </p>
            <a href="https://thecahub.com/cv-maker" style="display:inline-block;background:#22c55e;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;">Open CV Maker →</a>
            <p style="margin:24px 0 0;font-size:12px;color:#555;line-height:1.7;">
              While you're here — practice MCQs for your upcoming exams on <a href="https://thecahub.com/practice" style="color:#22c55e;text-decoration:none;">thecahub.com/practice</a>. It's free.
            </p>
          </div>
          <div style="border-top:1px solid #1f1f1f;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#444;">© 2026 The CA Hub · <a href="https://thecahub.com" style="color:#22c55e;text-decoration:none;">thecahub.com</a></p>
          </div>
        </div>
      `,
      attachments: pdfBase64 ? [
        {
          filename: filename || "CA_Hub_CV.pdf",
          content: pdfBase64,
          encoding: 'base64'
        }
      ] : []
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[cv-emails]", err);
    return NextResponse.json({ ok: true }); // never fail the download
  }
}
