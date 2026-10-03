import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { adminSupabase, getProStatus, verifySession } from "@/lib/session";

/**
 * AI tutor: explains a question the student just answered.
 * The question is always loaded from the database by id — the client never supplies the prompt —
 * so the endpoint can't be used as a general-purpose LLM proxy. Answers are cached per
 * (question, mode, chosen option) and shared across students.
 */

const FREE_PER_DAY = 3;
const PRO_PER_DAY = 40;
const MODES = {
  why: "Explain step by step why the correct answer is right, and why each of the other options is wrong.",
  simpler: "Explain the underlying concept as simply as possible, with a short everyday example, then connect it back to this question.",
  mistake: "The student chose a wrong option. Explain the specific misconception that leads to that choice and how to avoid it in the exam.",
} as const;
type Mode = keyof typeof MODES;

const SYSTEM = `You are a patient, exam-focused tutor for professional accountancy students (ICAP, ACCA, ICAI, CIMA, ICAEW).
Write in clear, plain English for a student revising on a phone. Use short paragraphs or a short numbered list; no headings, no tables, no markdown symbols other than numbered lists.
Show calculations line by line where relevant. Keep it under 220 words. Be accurate — if the provided answer key looks wrong, say so plainly rather than defending it.`;

/* ── Providers, tried in order: NVIDIA → OpenAI (both OpenAI-compatible) → Anthropic ── */

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

const tutorEnabled = compatProviders.length > 0 || !!anthropic;

async function viaCompat(p: CompatProvider, system: string, prompt: string): Promise<string> {
  const res = await fetch(`${p.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: p.model,
      max_tokens: 900,
      temperature: 0.3,
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

/** Try each configured provider until one returns an answer. */
async function generate(system: string, prompt: string): Promise<string> {
  for (const p of compatProviders) {
    try {
      const out = await viaCompat(p, system, prompt);
      if (out) return out;
    } catch (err) {
      console.error("[tutor]", err instanceof Error ? err.message : err);
    }
  }
  if (anthropic) {
    try {
      return await viaAnthropic(system, prompt);
    } catch (err) {
      if (err instanceof Anthropic.APIError) console.error("[tutor] anthropic", err.status, err.message);
      else console.error("[tutor] anthropic", err);
    }
  }
  return "";
}

export async function GET() {
  return NextResponse.json({ enabled: tutorEnabled, freePerDay: FREE_PER_DAY });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function bumpUsage(key: string, limit: number): Promise<boolean> {
  const day = today();
  const { data } = await adminSupabase.from("tutor_usage").select("count").eq("usage_key", key).eq("day", day).maybeSingle();
  const count = data?.count ?? 0;
  if (count >= limit) return false;
  await adminSupabase.from("tutor_usage").upsert({ usage_key: key, day, count: count + 1 }, { onConflict: "usage_key,day" });
  return true;
}

export async function POST(req: NextRequest) {
  if (!tutorEnabled) return NextResponse.json({ error: "The AI tutor is launching soon." }, { status: 503 });

  let body: { questionId?: string; mode?: string; chosen?: string; email?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const questionId = String(body.questionId ?? "").slice(0, 80);
  const mode = (body.mode && body.mode in MODES ? body.mode : "why") as Mode;
  const chosen = /^[A-D]$/.test(body.chosen ?? "") ? body.chosen! : "";
  if (!questionId) return NextResponse.json({ error: "Missing question." }, { status: 400 });

  const cacheKey = `${questionId}|${mode}|${mode === "mistake" ? chosen : ""}`;
  const { data: cached } = await adminSupabase.from("tutor_cache").select("answer").eq("cache_key", cacheKey).maybeSingle();
  if (cached?.answer) return NextResponse.json({ answer: cached.answer, cached: true });

  // Quota (cached answers above are free for everyone)
  const signedIn = body.email && (await verifySession(body.email, body.token));
  const pro = signedIn ? (await getProStatus(body.email!)).pro : false;
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const usageKey = signedIn ? String(body.email).toLowerCase() : `ip:${ip}`;
  if (!(await bumpUsage(usageKey, pro ? PRO_PER_DAY : FREE_PER_DAY))) {
    return NextResponse.json(
      { error: pro ? "You've reached today's tutor limit." : `Free accounts get ${FREE_PER_DAY} new AI explanations a day.`, upgrade: !pro },
      { status: 429 }
    );
  }

  const { data: q } = await adminSupabase
    .from("questions")
    .select("question_text, explanation, topic, subject_id, options(option_key, option_text, is_correct)")
    .eq("id", questionId)
    .eq("is_active", true)
    .maybeSingle();
  if (!q) return NextResponse.json({ error: "Question not found." }, { status: 404 });

  const opts = ((q.options ?? []) as { option_key: string; option_text: string; is_correct: boolean }[]).sort((a, b) =>
    a.option_key.localeCompare(b.option_key)
  );
  const correct = opts.find((o) => o.is_correct);
  const prompt = [
    `Subject: ${q.subject_id} — ${q.topic ?? ""}`,
    `Question: ${q.question_text}`,
    ...opts.map((o) => `${o.option_key}) ${o.option_text}`),
    `Answer key: ${correct ? `${correct.option_key}) ${correct.option_text}` : "unknown"}`,
    q.explanation ? `Existing short explanation: ${q.explanation}` : "",
    mode === "mistake" && chosen ? `The student chose: ${chosen}` : "",
    "",
    MODES[mode],
  ]
    .filter(Boolean)
    .join("\n");

  const answer = await generate(SYSTEM, prompt);
  if (!answer) return NextResponse.json({ error: "The tutor is unavailable right now — try the written explanation." }, { status: 502 });

  await adminSupabase.from("tutor_cache").upsert({ cache_key: cacheKey, answer }, { onConflict: "cache_key" });
  return NextResponse.json({ answer, cached: false });
}
