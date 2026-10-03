import type { BodyId } from "@/data/subjects";

/**
 * Accent colour per qualification. ICAP keeps the original CA Hub green; every other
 * body gets its own accent so students feel the site is built for their exam.
 */
export interface BodyTheme {
  accent: string; // main brand accent (buttons, highlights)
  accentSoft: string; // translucent tint for badges / backgrounds
  glow: string; // dark gradient end used on hero / social cards
}

export const BODY_THEMES: Record<BodyId, BodyTheme> = {
  icap: { accent: "#3DB371", accentSoft: "rgba(61,179,113,0.12)", glow: "#12301f" },
  acca: { accent: "#E5484D", accentSoft: "rgba(229,72,77,0.12)", glow: "#3a1214" },
  icai: { accent: "#3B82F6", accentSoft: "rgba(59,130,246,0.12)", glow: "#0f1f3d" },
  cima: { accent: "#14B8A6", accentSoft: "rgba(20,184,166,0.12)", glow: "#0b2e2b" },
  icaew: { accent: "#A855F7", accentSoft: "rgba(168,85,247,0.12)", glow: "#2a1240" },
  ima: { accent: "#F59E0B", accentSoft: "rgba(245,158,11,0.12)", glow: "#3a2a0a" },
};

export function themeFor(body: string | undefined | null): BodyTheme {
  return BODY_THEMES[(body ?? "icap") as BodyId] ?? BODY_THEMES.icap;
}
