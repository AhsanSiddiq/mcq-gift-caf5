import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { grantPro, isValidEmail, PLAN_DAYS } from "@/lib/session";

/**
 * Paddle Billing webhook.
 * Configure in Paddle → Developer tools → Notifications:
 *   URL:    https://thecahub.com/api/webhooks/paddle
 *   Events: transaction.completed, subscription.created, subscription.updated, subscription.canceled
 * Secret → env PADDLE_WEBHOOK_SECRET.
 *
 * Checkout passes customData { email, plan } (see src/app/pro/ProCheckout.tsx), which is how
 * a payment is tied to the student's verified CA Hub email.
 */

function verifySignature(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(";").map((kv) => kv.split("=") as [string, string]));
  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;
  // Reject replays older than 5 minutes
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${ts}:${raw}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(h1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const GRACE_MS = 3 * 86_400_000; // keep access through payment retries

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured." }, { status: 503 });

  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("paddle-signature"), secret)) {
    return NextResponse.json({ error: "Bad signature." }, { status: 401 });
  }

  const event = JSON.parse(raw);
  const type: string = event.event_type;
  const data = event.data ?? {};
  const custom = data.custom_data ?? {};
  const email = custom.email;
  const plan = custom.plan === "sitting" ? "sitting" : "monthly";

  if (!isValidEmail(email)) {
    console.warn("[paddle] event without a usable custom_data.email", type, data.id);
    return NextResponse.json({ received: true });
  }

  try {
    if (type === "transaction.completed" && !data.subscription_id) {
      // One-off exam-sitting pass
      await grantPro({ email, plan, source: "paddle", externalId: data.id, days: PLAN_DAYS[plan] });
    } else if (type.startsWith("subscription.")) {
      const endsAt: string | undefined = data.current_billing_period?.ends_at;
      const ended = data.status === "canceled" || data.status === "paused";
      const expiresAt = endsAt
        ? new Date(new Date(endsAt).getTime() + (ended ? 0 : GRACE_MS)).toISOString()
        : ended
          ? new Date().toISOString()
          : null;
      await grantPro({
        email,
        plan: "monthly",
        source: "paddle",
        externalId: data.id,
        expiresAt,
        status: ended ? "cancelled" : "active",
      });
    }
  } catch (err) {
    console.error("[paddle] handler error", err);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 }); // Paddle retries
  }

  return NextResponse.json({ received: true });
}
