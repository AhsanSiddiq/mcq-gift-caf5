"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import {
  BODY_COOKIE,
  COUNTRY_COOKIE,
  EXAM_BODIES,
  defaultBodyForCountry,
  getBody,
  type ExamBody,
} from "@/data/regions";

/* ── cookie helpers ─────────────────────────────────────────── */

function readCookie(name: string): string | undefined {
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : undefined;
}

/** Body id from the explicit choice cookie, else derived from the IP-country cookie. */
function cookieBodyId(): string {
  return getBody(readCookie(BODY_COOKIE))?.id ?? defaultBodyForCountry(readCookie(COUNTRY_COOKIE));
}

function writeBodyCookie(id: string) {
  document.cookie = `${BODY_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

const noopSubscribe = () => () => {};

function bodyHref(body: ExamBody): string {
  return body.status === "live" && body.practiceHref ? body.practiceHref : `/exams/${body.id}`;
}

/* ── component ──────────────────────────────────────────────── */

interface Props {
  /**
   * "dropdown" (default) floats the menu under the pill — for the desktop header.
   * "inline" expands the list in place — for containers that clip overflow (mobile menu).
   */
  variant?: "dropdown" | "inline";
  /** Called after a body is picked (e.g. to close the mobile menu). */
  onSelect?: () => void;
}

export default function RegionSwitcher({ variant = "dropdown", onSelect }: Props) {
  const router = useRouter();
  // Cookie value is only known on the client; server snapshot is null so hydration matches.
  const cookieId = useSyncExternalStore(noopSubscribe, cookieBodyId, () => null);
  const [picked, setPicked] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = getBody(picked ?? cookieId);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (body: ExamBody) => {
    writeBodyCookie(body.id);
    setPicked(body.id);
    setOpen(false);
    onSelect?.();
    router.push(bodyHref(body));
  };

  const inline = variant === "inline";

  return (
    <div ref={rootRef} style={{ position: "relative", width: inline ? "100%" : undefined }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={current ? `Exam body: ${current.short}. Change exam body` : "Choose your exam body"}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 36, padding: "0 10px 0 12px", borderRadius: 9999,
          background: "var(--surface)", border: "1px solid var(--border)",
          color: "var(--text-1)", cursor: "pointer", whiteSpace: "nowrap",
          fontSize: 12, fontWeight: 700, letterSpacing: "0.02em",
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          width: inline ? "100%" : undefined, justifyContent: inline ? "space-between" : undefined,
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(61,179,113,0.5)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span aria-hidden style={{ fontSize: 14, lineHeight: 1 }}>{current?.flag ?? "🌐"}</span>
          <span>{current?.short ?? "Region"}</span>
        </span>
        <ChevronDown
          className="w-3.5 h-3.5"
          strokeWidth={2.4}
          style={{ color: "var(--text-2)", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Exam bodies"
          style={{
            ...(inline
              ? { marginTop: 8 }
              : {
                  position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 60,
                  width: 280, maxWidth: "calc(100vw - 32px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                }),
            background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14,
            padding: 6, maxHeight: inline ? "40vh" : "min(70vh, 460px)", overflowY: "auto",
          }}
        >
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
            color: "var(--text-3)", padding: "6px 10px 8px",
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}>
            Choose your exam
          </p>
          {EXAM_BODIES.map((b) => {
            const selected = b.id === current?.id;
            const live = b.status === "live";
            return (
              <button
                key={b.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => choose(b)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "9px 10px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: selected ? "rgba(61,179,113,0.10)" : "transparent",
                  textAlign: "left", transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "var(--surface)"; }}
                onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "transparent"; }}
              >
                <span aria-hidden style={{ fontSize: 16, lineHeight: 1, width: 20, textAlign: "center" }}>{b.flag}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-1)",
                    fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                  }}>
                    {b.short}
                  </span>
                  <span style={{
                    display: "block", fontSize: 11, color: "var(--text-3)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}>
                    {b.region}
                  </span>
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                  ...(live
                    ? { background: "var(--green)", color: "#fff" }
                    : { background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)" }),
                }}>
                  {live ? "Live" : "Soon"}
                </span>
                <Check
                  className="w-3.5 h-3.5 shrink-0"
                  strokeWidth={2.6}
                  style={{ color: "var(--green)", opacity: selected ? 1 : 0 }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
