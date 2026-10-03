import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { buildPost } from "@/lib/social";
import { todayPKT } from "@/lib/daily";
import { themeFor } from "@/data/themes";
import type { BodyId } from "@/data/subjects";

/** 1080×1350 (Instagram portrait) "question of the day" card used by the social auto-poster. */
export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const body = (req.nextUrl.searchParams.get("body") ?? "icap") as BodyId;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(req.nextUrl.searchParams.get("date") ?? "") ? req.nextUrl.searchParams.get("date")! : todayPKT();
  const p = await buildPost(body, date);
  if (!p) return new Response("Not found", { status: 404 });
  const t = themeFor(body);
  const qSize = p.question.length > 200 ? 40 : p.question.length > 120 ? 46 : 54;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "72px 72px 64px",
        background: `linear-gradient(160deg, #0A0A0B 0%, #111113 55%, ${t.glow} 100%)`, color: "#F4F4F5", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: t.accent, letterSpacing: 3, textTransform: "uppercase" }}>
            {p.label}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#A1A1AA" }}>Question of the day</div>
        </div>
        <div style={{ display: "flex", fontSize: qSize, fontWeight: 800, lineHeight: 1.2, marginTop: 56 }}>{p.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 48 }}>
          {p.options.map((o, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 28px", borderRadius: 20,
              background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.12)", fontSize: o.length > 60 ? 28 : 34 }}>
              <div style={{ display: "flex", width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center",
                background: t.accent, color: "#fff", fontWeight: 800, fontSize: 28, flexShrink: 0 }}>{"ABCD"[i]}</div>
              <div style={{ display: "flex" }}>{o}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flex: 1 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 30 }}>
          <div style={{ display: "flex", fontWeight: 800 }}>Comment your answer 👇</div>
          <div style={{ display: "flex", color: "#F5A623", fontWeight: 700 }}>thecahub.com</div>
        </div>
      </div>
    ),
    { width: 1080, height: 1350 }
  );
}
