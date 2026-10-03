import Link from "next/link";
import { activeSponsor } from "@/data/sponsors";

/** Native sponsor card. Falls back to an "advertise here" house ad when no deal is live. */
export default function SponsorSlot({ level, className = "" }: { level?: string; className?: string }) {
  const s = activeSponsor(level);
  const box = { background: "var(--bg-2)", border: "1px dashed var(--border)", textDecoration: "none" } as const;

  if (!s) {
    return (
      <Link href="/advertise" className={`flex items-center justify-between gap-4 rounded-2xl p-4 ${className}`} style={box}>
        <span className="text-sm" style={{ color: "var(--text-2)" }}>
          <span className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-3)" }}>Sponsored slot available</span>
          Run a CA academy or hiring firm? Put your name in front of students preparing for this exam.
        </span>
        <span className="shrink-0 text-sm font-bold" style={{ color: "var(--green)" }}>Advertise →</span>
      </Link>
    );
  }

  return (
    <a href={s.url} target="_blank" rel="sponsored noopener" className={`flex items-center justify-between gap-4 rounded-2xl p-4 ${className}`} style={{ ...box, borderStyle: "solid" }}>
      <span className="text-sm" style={{ color: "var(--text-2)" }}>
        <span className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-3)" }}>Sponsored</span>
        <strong style={{ color: "var(--text-1)" }}>{s.name}</strong> — {s.tagline}
      </span>
      <span className="shrink-0 text-sm font-bold" style={{ color: "var(--green)" }}>{s.cta} →</span>
    </a>
  );
}
