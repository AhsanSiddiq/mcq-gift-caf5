import Anthropic from "@anthropic-ai/sdk";
import { adminSupabase } from "@/lib/session";

/**
 * Shared AI text generation for server routes (AI tutor, cover-letter writer).
 * Providers are tried in order: NVIDIA → OpenAI (both OpenAI-compatible) → Anthropic.
 * Server-only: never import from client code.
 */

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

interface CompatProvider {
  name: string;
  baseUrl: string;
  key: string;
  model: string;
}

const compatProviders: CompatProvider[] = [
  process.env.NVIDIA_API_KEY && {
    name: "nvidia",
    baseUrl: "https://integrate.api.nvidia.com/v1",
    key: process.env.NVIDIA_API_KEY,
    model: process.env.NVIDIA_MODEL || "openai/gpt-oss-20b",
  },
  process.env.OPENAI_API_KEY && {
    name: "openai",
    baseUrl: "https://api.openai.com/v1",
    key: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  },
].filter(Boolean) as CompatProvider[];

/** True when at least one AI provider is configured. */
export const aiEnabled = compatProviders.length > 0 || !!anthropic;

export interface GenerateOptions {
  /** Token cap for the OpenAI-compatible providers. Default 900. */
  maxTokens?: number;
  /** Sampling temperature for the OpenAI-compatible providers. Default 0.3. */
  temperature?: number;
  /** Prefix for error logs. Default "tutor". */
  tag?: string;
}

async function viaCompat(p: CompatProvider, system: string, prompt: string, maxTokens: number, temperature: number): Promise<string> {
  const res = await fetch(`${p.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: p.model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`${p.name} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  // Strip markdown emphasis/headings some open models add despite the instruction
  return String(data.choices?.[0]?.message?.content ?? "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .trim();
}

async function viaAnthropic(system: string, prompt: string): Promise<string> {
  const response = await anthropic!.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 4000,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system,
    messages: [{ role: "user", content: prompt }],
  });
  if (response.stop_reason === "refusal") return "";
  return response.content
    .flatMap((b) => (b.type === "text" ? [b.text] : []))
    .join("\n")
    .trim();
}

/** Try each configured provider until one returns an answer. Returns "" when all fail. */
export async function generate(system: string, prompt: string, opts: GenerateOptions = {}): Promise<string> {
  const { maxTokens = 900, temperature = 0.3, tag = "tutor" } = opts;
  for (const p of compatProviders) {
    try {
      const out = await viaCompat(p, system, prompt, maxTokens, temperature);
      if (out) return out;
    } catch (err) {
      console.error(`[${tag}]`, err instanceof Error ? err.message : err);
    }
  }
  if (anthropic) {
    try {
      return await viaAnthropic(system, prompt);
    } catch (err) {
      if (err instanceof Anthropic.APIError) console.error(`[${tag}] anthropic`, err.status, err.message);
      else console.error(`[${tag}] anthropic`, err);
    }
  }
  return "";
}

/* ── Daily quotas (Supabase table `tutor_usage`: usage_key, day, count) ── */

function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Count one use against `key` for today. Returns the new count, or null when the
 * limit is already reached (nothing is recorded in that case).
 */
export async function consumeDailyQuota(key: string, limit: number): Promise<number | null> {
  const day = today();
  const { data } = await adminSupabase.from("tutor_usage").select("count").eq("usage_key", key).eq("day", day).maybeSingle();
  const count = data?.count ?? 0;
  if (count >= limit) return null;
  await adminSupabase.from("tutor_usage").upsert({ usage_key: key, day, count: count + 1 }, { onConflict: "usage_key,day" });
  return count + 1;
}

/** Give back one use (e.g. when every provider failed). Best effort. */
export async function refundDailyQuota(key: string): Promise<void> {
  const day = today();
  const { data } = await adminSupabase.from("tutor_usage").select("count").eq("usage_key", key).eq("day", day).maybeSingle();
  const count = data?.count ?? 0;
  if (count <= 0) return;
  await adminSupabase.from("tutor_usage").upsert({ usage_key: key, day, count: count - 1 }, { onConflict: "usage_key,day" });
}

/** First hop of x-forwarded-for, or "unknown". */
export function clientIp(headers: Headers): string {
  return (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
}
