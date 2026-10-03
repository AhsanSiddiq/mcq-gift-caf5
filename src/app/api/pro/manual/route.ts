import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { adminSupabase, approvalSignature, approvalSigningKey, verifySession } from "@/lib/session";
import { PRICE_BOOKS, COUNTRY_COOKIE, priceBookForCountry } from "@/data/regions";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// POST /api/pro/manual — a student paid via a local rail and submits the transaction reference
export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    if (raw.length > 2048) return NextResponse.json({ error: "Request too large." }, { status: 413 });
    const { email, token, plan, method, reference } = JSON.parse(raw);

    if (!(await verifySession(email, token))) {
      return NextResponse.json({ error: "Please sign in with your email first." }, { status: 401 });
    }
    if (plan !== "monthly" && plan !== "sitting") {
      return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
    }

    const country = req.cookies.get(COUNTRY_COOKIE)?.value || req.headers.get("x-vercel-ip-country") || undefined;
    const book = priceBookForCountry(country);
    if (!book.localRails?.includes(method)) {
      return NextResponse.json({ error: "That payment method isn't available in your region." }, { status: 400 });
    }
    const ref = String(reference ?? "").trim();
    if (ref.length < 4 || ref.length > 64) {
      return NextResponse.json({ error: "Please enter the transaction ID from your receipt." }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const amount = PRICE_BOOKS[book.currency][plan as "monthly" | "sitting"];

    const { data, error } = await adminSupabase
      .from("payment_requests")
      .insert({ email: normalizedEmail, plan, currency: book.currency, amount, method, reference: ref, country })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[pro/manual]", error);
      return NextResponse.json({ error: "Could not record your payment. Please try again." }, { status: 500 });
    }

    // Notify the admin with a one-click, per-request approval link
    if (approvalSigningKey() && process.env.GMAIL_USER) {
      const origin = req.nextUrl.origin;
      const link = `${origin}/api/admin/pro-approve?id=${data.id}&sig=${approvalSignature(data.id)}`;
      try {
        await transporter.sendMail({
          from: `"The CA Hub" <${process.env.GMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
          subject: `💰 Pro payment to verify: ${book.currency} ${amount} via ${method}`,
          html: `<p><b>${esc(normalizedEmail)}</b> says they paid <b>${book.currency} ${amount}</b> (${plan}) via <b>${esc(method)}</b>.</p>
                 <p>Transaction ID: <code>${esc(ref)}</code> · Country: ${esc(country ?? "?")}</p>
                 <p>Check your ${esc(method)} account, then: <a href="${link}">✅ Approve & activate Pro</a></p>`,
        });
      } catch (mailErr) {
        console.error("[pro/manual] mail error", mailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[pro/manual] error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
