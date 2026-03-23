import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

/* ── Server-side Supabase client (service key bypasses RLS) ── */
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    /* 1 ── Save to Supabase ── */
    const { error: dbError } = await supabaseAdmin
      .from("contact_messages")
      .insert([{ name, email, subject: subject || "(no subject)", message }]);

    if (dbError) {
      console.error("[contact] DB error:", dbError);
      return NextResponse.json({ error: "Failed to save message." }, { status: 500 });
    }

    /* 2 ── Send email alert ── */
    const { error: emailError } = await resend.emails.send({
      from: "The CA Hub <noreply@thecahub.com>",
      to:   "ahsansiddiq01@gmail.com",
      replyTo: email,
      subject: `📬 New Contact: ${subject || "(no subject)"}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;">
          <h2 style="color:#1a1a1a;margin-bottom:4px;">New contact message</h2>
          <p style="color:#666;font-size:13px;margin-bottom:24px;">Received via thecahub.com contact form</p>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:10px 0;color:#555;width:80px;vertical-align:top;font-weight:600;">Name</td>
              <td style="padding:10px 0;color:#1a1a1a;">${name}</td>
            </tr>
            <tr style="border-top:1px solid #eee;">
              <td style="padding:10px 0;color:#555;font-weight:600;">Email</td>
              <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#3DB371;">${email}</a></td>
            </tr>
            <tr style="border-top:1px solid #eee;">
              <td style="padding:10px 0;color:#555;font-weight:600;">Subject</td>
              <td style="padding:10px 0;color:#1a1a1a;">${subject || "—"}</td>
            </tr>
            <tr style="border-top:1px solid #eee;">
              <td style="padding:10px 0;color:#555;font-weight:600;vertical-align:top;">Message</td>
              <td style="padding:10px 0;color:#1a1a1a;white-space:pre-wrap;">${message}</td>
            </tr>
          </table>

          <div style="margin-top:24px;padding:12px 16px;background:#f5f5f5;border-radius:8px;font-size:12px;color:#888;">
            Hit Reply to respond directly to ${name}.
          </div>
        </div>
      `,
    });

    if (emailError) {
      // Don't fail the request — message is already saved in DB
      console.error("[contact] Email error (non-fatal):", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
