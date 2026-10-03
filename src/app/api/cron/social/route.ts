import { NextRequest, NextResponse } from "next/server";
import { adminSupabase } from "@/lib/session";
import { todayPKT } from "@/lib/daily";
import { answerText, bodiesForToday, buildPost, instagramCaption, postText, type SocialPost } from "@/lib/social";
import type { BodyId } from "@/data/subjects";

/**
 * Daily social auto-poster, run by Vercel Cron (see vercel.json).
 * Channels are enabled by env vars; any channel without its vars is skipped:
 *   Facebook:  FB_PAGE_ID + FB_PAGE_TOKEN (long-lived Page access token)
 *   Instagram: IG_USER_ID (Instagram Business account linked to that Page) + FB_PAGE_TOKEN
 * Each (date, body, channel) is posted at most once, so retries and manual runs are safe.
 * Manual run: GET /api/cron/social?body=acca&dry=1 with header Authorization: Bearer <CRON_SECRET>
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const cardUrl = (p: SocialPost) => `https://www.thecahub.com/api/social/card?body=${p.body}&date=${todayPKT()}`;

function authorized(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const secrets = [process.env.CRON_SECRET, process.env.ADMIN_SECRET].filter(Boolean);
  return secrets.some((s) => auth === `Bearer ${s}`);
}

async function facebook(p: SocialPost) {
  const page = process.env.FB_PAGE_ID!;
  const token = process.env.FB_PAGE_TOKEN!;
  const graph = async (path: string, params: Record<string, string>) => {
    const r = await fetch(`https://graph.facebook.com/v21.0/${path}`, {
      method: "POST",
      body: new URLSearchParams({ ...params, access_token: token }),
      signal: AbortSignal.timeout(15_000),
    });
    const j = await r.json();
    if (!r.ok || j.error) throw new Error(`facebook ${path}: ${j.error?.message ?? r.status}`);
    return j;
  };
  // Photo post (the question card) gets far more reach than a text/link post
  const post = await graph(`${page}/photos`, { url: cardUrl(p), caption: postText(p) });
  const postId = String(post.post_id ?? post.id);
  // Answer as the first comment — keeps people reading the post and commenting first
  await graph(`${postId}/comments`, { message: answerText(p) }).catch((e) => console.error("[social]", e.message));
  return postId;
}

async function instagram(p: SocialPost) {
  const ig = process.env.IG_USER_ID!;
  const token = process.env.FB_PAGE_TOKEN!;
  const graph = async (path: string, params: Record<string, string>) => {
    const r = await fetch(`https://graph.facebook.com/v21.0/${path}`, {
      method: "POST",
      body: new URLSearchParams({ ...params, access_token: token }),
      signal: AbortSignal.timeout(30_000),
    });
    const j = await r.json();
    if (!r.ok || j.error) throw new Error(`instagram ${path}: ${j.error?.message ?? r.status}`);
    return j;
  };
  const container = await graph(`${ig}/media`, { image_url: cardUrl(p), caption: instagramCaption(p) });
  // Instagram fetches the image asynchronously; give it a moment before publishing
  let published: { id: string } | null = null;
  for (let attempt = 0; attempt < 5 && !published; attempt++) {
    await new Promise((r) => setTimeout(r, 3000));
    published = await graph(`${ig}/media_publish`, { creation_id: container.id }).catch((e) => {
      if (attempt === 4) throw e;
      return null;
    });
  }
  await graph(`${published!.id}/comments`, { message: answerText(p).split("\n\nPractise more:")[0] + "\n\nMore free MCQs: link in bio" })
    .catch((e) => console.error("[social]", e.message));
  return published!.id;
}

const CHANNELS = [
  { name: "facebook", enabled: () => !!(process.env.FB_PAGE_ID && process.env.FB_PAGE_TOKEN), send: facebook },
  { name: "instagram", enabled: () => !!(process.env.IG_USER_ID && process.env.FB_PAGE_TOKEN), send: instagram },
];

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const date = todayPKT();
  const dry = req.nextUrl.searchParams.get("dry") === "1";
  const only = req.nextUrl.searchParams.get("body");
  const bodies = only ? [only as BodyId] : bodiesForToday(date);
  const results: Record<string, unknown>[] = [];

  for (const body of bodies) {
    const post = await buildPost(body, date);
    if (!post) {
      results.push({ body, skipped: "no eligible question" });
      continue;
    }
    if (dry) {
      results.push({ body, card: cardUrl(post), text: postText(post), instagram: instagramCaption(post), answer: answerText(post) });
      continue;
    }
    for (const ch of CHANNELS) {
      if (!ch.enabled()) continue;
      // Claim the slot first so a retry can never double-post
      const { error: claimErr } = await adminSupabase.from("social_posts").insert({ day: date, body_id: body, channel: ch.name });
      if (claimErr) {
        results.push({ body, channel: ch.name, skipped: "already posted" });
        continue;
      }
      try {
        const id = await ch.send(post);
        await adminSupabase.from("social_posts").update({ external_id: id }).eq("day", date).eq("body_id", body).eq("channel", ch.name);
        results.push({ body, channel: ch.name, ok: true, id });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[social]", message);
        // Release the claim so the next run can retry
        await adminSupabase.from("social_posts").delete().eq("day", date).eq("body_id", body).eq("channel", ch.name);
        results.push({ body, channel: ch.name, ok: false, error: message });
      }
    }
  }
  return NextResponse.json({ date, channels: CHANNELS.filter((c) => c.enabled()).map((c) => c.name), results });
}
