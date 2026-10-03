import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminSupabase, approvalSignature, approvalSigningKey, grantPro, PLAN_DAYS } from "@/lib/session";

const page = (msg: string, status = 200) =>
  new NextResponse(`<!doctype html><meta name="viewport" content="width=device-width"><body style="font-family:system-ui;padding:32px;background:#0a0a0b;color:#f4f4f5"><h2>${msg}</h2></body>`, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

// GET /api/admin/pro-approve?id=...&sig=...  (link emailed to the admin)
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") || "";
  const sig = req.nextUrl.searchParams.get("sig") || "";
  if (!approvalSigningKey() || !id) return page("Not configured.", 400);

  const expected = Buffer.from(approvalSignature(id));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) {
    return page("Invalid link.", 403);
  }

  const { data: request } = await adminSupabase.from("payment_requests").select("*").eq("id", id).maybeSingle();
  if (!request) return page("Request not found.", 404);
  if (request.status === "approved") return page(`Already approved for ${request.email}.`);

  await grantPro({
    email: request.email,
    plan: request.plan,
    source: "manual",
    externalId: `${request.method}:${request.reference}`,
    days: PLAN_DAYS[request.plan] ?? 31,
  });
  await adminSupabase
    .from("payment_requests")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", id);

  return page(`✅ Pro activated for ${request.email} (${request.plan}).`);
}
