import { NextRequest, NextResponse } from "next/server";
import { adminSupabase, getProStatus, verifySession } from "@/lib/session";
import { aiEnabled as tutorEnabled, clientIp, consumeDailyQuota, generate } from "@/lib/ai";

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

export async function GET() {
  return NextResponse.json({ enabled: tutorEnabled, freePerDay: FREE_PER_DAY });
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
  const ip = clientIp(req.headers);
  const usageKey = signedIn ? String(body.email).toLowerCase() : `ip:${ip}`;
  if ((await consumeDailyQuota(usageKey, pro ? PRO_PER_DAY : FREE_PER_DAY)) === null) {
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
