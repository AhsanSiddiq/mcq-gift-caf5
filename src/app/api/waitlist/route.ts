import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { COUNTRY_COOKIE, getBody } from "@/data/regions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const MAX_BODY_BYTES = 2048;
const MAX_EMAIL_LENGTH = 254;
const MAX_LEVEL_LENGTH = 120;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: NextRequest) {
  // Abuse guard: refuse oversized payloads before parsing.
  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > MAX_BODY_BYTES) return bad("Payload too large.", 413);

  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return bad("Payload too large.", 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return bad("Invalid JSON.");
  }
  if (!payload || typeof payload !== "object") return bad("Invalid request.");
  const { email, body_id, level } = payload as Record<string, unknown>;

  if (typeof email !== "string") return bad("Please enter a valid email address.");
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(cleanEmail)) {
    return bad("Please enter a valid email address.");
  }

  const body = typeof body_id === "string" ? getBody(body_id) : undefined;
  if (!body) return bad("Unknown exam body.");

  let cleanLevel: string | null = null;
  if (typeof level === "string" && level.trim()) {
    const l = level.trim().slice(0, MAX_LEVEL_LENGTH);
    // Only accept levels that actually belong to this body.
    cleanLevel = body.levels.some((x) => x.name === l) ? l : null;
  }

  const geo =
    req.cookies.get(COUNTRY_COOKIE)?.value ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry");
  const country = geo && /^[A-Za-z]{2}$/.test(geo) && geo.toUpperCase() !== "XX" ? geo.toUpperCase() : null;

  const { error } = await supabase
    .from("waitlist")
    .upsert(
      { email: cleanEmail, body_id: body.id, country, level: cleanLevel },
      { onConflict: "email,body_id" }
    );

  if (error) {
    console.error("[waitlist]", error);
    return bad("Could not join the waitlist. Please try again.", 500);
  }

  return NextResponse.json({ success: true });
}
