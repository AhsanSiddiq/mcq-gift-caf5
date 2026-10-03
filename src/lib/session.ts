import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

/** Service-role client for server routes only. Never import from client code. */
export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const SESSION_ROW = "__session__";
const MAX_TOKENS = 5; // signed-in devices per email

interface SessionJson {
  token?: string; // legacy single-token format
  tokens?: string[];
  created_at?: string;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export function newSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/** Store a freshly issued token, keeping the most recent few so multiple devices stay signed in. */
export async function storeSessionToken(email: string, token: string): Promise<void> {
  const { data } = await adminSupabase
    .from("user_progress")
    .select("progress_json")
    .eq("email", email)
    .eq("subject_id", SESSION_ROW)
    .maybeSingle();

  const prev = (data?.progress_json ?? {}) as SessionJson;
  const existing = prev.tokens ?? (prev.token ? [prev.token] : []);
  const tokens = [token, ...existing.filter((t) => t !== token)].slice(0, MAX_TOKENS);

  await adminSupabase
    .from("user_progress")
    .upsert(
      { email, subject_id: SESSION_ROW, progress_json: { tokens, created_at: new Date().toISOString() } },
      { onConflict: "email,subject_id" }
    );
}

/** True when `token` is a live session token for `email`. */
export async function verifySession(email: string | undefined | null, token: string | undefined | null): Promise<boolean> {
  if (!email || !token || typeof email !== "string" || typeof token !== "string") return false;
  const { data } = await adminSupabase
    .from("user_progress")
    .select("progress_json")
    .eq("email", email.toLowerCase().trim())
    .eq("subject_id", SESSION_ROW)
    .maybeSingle();

  const json = (data?.progress_json ?? {}) as SessionJson;
  const tokens = json.tokens ?? (json.token ? [json.token] : []);
  return tokens.some((t) => safeEqual(t, token));
}

export interface ProStatus {
  pro: boolean;
  plan?: string;
  expiresAt?: string | null;
}

export async function getProStatus(email: string): Promise<ProStatus> {
  const { data } = await adminSupabase
    .from("pro_members")
    .select("plan, status, expires_at")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  if (!data) return { pro: false };
  const notExpired = !data.expires_at || new Date(data.expires_at).getTime() > Date.now();
  // A cancelled subscription stays Pro until the paid period ends.
  const active = (data.status === "active" || data.status === "cancelled") && notExpired;
  return { pro: active, plan: data.plan, expiresAt: data.expires_at };
}

/** Grant or extend Pro. Extensions stack on top of any remaining time. */
export async function grantPro(opts: {
  email: string;
  plan: string;
  source: string;
  externalId?: string;
  days?: number; // relative extension
  expiresAt?: string | null; // absolute (subscriptions)
  status?: string;
}): Promise<void> {
  const email = opts.email.toLowerCase().trim();
  let expiresAt = opts.expiresAt ?? null;

  if (opts.days) {
    const { data } = await adminSupabase.from("pro_members").select("expires_at").eq("email", email).maybeSingle();
    const current = data?.expires_at ? new Date(data.expires_at).getTime() : 0;
    const base = Math.max(current, Date.now());
    expiresAt = new Date(base + opts.days * 86_400_000).toISOString();
  }

  await adminSupabase.from("pro_members").upsert(
    {
      email,
      plan: opts.plan,
      status: opts.status ?? "active",
      source: opts.source,
      external_id: opts.externalId ?? null,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  );
}

export const PLAN_DAYS: Record<string, number> = { monthly: 31, sitting: 122 };

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Per-request signature for the one-click approval link emailed to the admin. */
export function approvalSigningKey(): string | undefined {
  // Falls back to the service key (already a server-only secret) so approvals work without extra setup.
  return process.env.ADMIN_SECRET || process.env.SUPABASE_SERVICE_KEY || undefined;
}

export function approvalSignature(id: string): string {
  return crypto.createHmac("sha256", approvalSigningKey() || "").update(`approve:${id}`).digest("hex");
}
