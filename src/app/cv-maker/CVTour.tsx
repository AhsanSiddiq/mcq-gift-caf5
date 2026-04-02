"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
  desktopOnly?: boolean;
}

// Viewport-relative rect (for fixed positioning)
interface VRect { top: number; left: number; width: number; height: number; }

const STEPS: TourStep[] = [
  {
    targetId: "tour-steps",
    title: "Jump to any section",
    description: "Tap any section pill at the top to jump directly to it. Completed sections turn green automatically.",
    position: "bottom",
    desktopOnly: false,
  },
  {
    targetId: "tour-form",
    title: "Fill in your details",
    description: "Go section by section — Personal, Education, Experience. Takes about 8 minutes. The sample data shows you exactly what to write.",
    position: "bottom",
    desktopOnly: false,
  },
  {
    targetId: "tour-ats-target",
    title: "ATS Score — aim for 80+",
    description: "This score tells you if your CV will pass automated screening. Add a profile summary and add metrics to your bullet points to boost it.",
    position: "bottom",
    desktopOnly: true,
  },
  {
    targetId: "tour-download-btn",
    title: "Pick a template \u0026 Download",
    description: "Head to the Appearance section (last step) to choose your layout, font, and colour. Then hit Download for a clean print-ready PDF — no watermarks, no login.",
    position: "top",
    desktopOnly: true,
  },
];

function getViewportRect(id: string): VRect | null {
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

const PAD = 10;

export function CVTour({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<VRect | null>(null);
  // Initialize from window immediately so first render has correct viewport size
  const [vw, setVw] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1280);
  const [vh, setVh] = useState(() => typeof window !== "undefined" ? window.innerHeight : 800);

  const isMobile = vw > 0 && vw < 1024;

  // On mobile, filter out desktop-only steps
  const visibleSteps = STEPS.filter(s => !isMobile || !s.desktopOnly);
  const step = visibleSteps[idx] ?? visibleSteps[visibleSteps.length - 1];

  const measure = useCallback(() => {
    setVw(window.innerWidth);
    setVh(window.innerHeight);
    const r = getViewportRect(step?.targetId);
    setRect(r ?? null);
  }, [step?.targetId]);

  // Re-measure on scroll & resize (spotlight tracks element position)
  useEffect(() => {
    const t = setTimeout(measure, 150);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure); };
  }, [measure]);

  // Scroll to bring target element into view when step changes
  // Fires ONLY on step change (idx), not on every scroll
  useEffect(() => {
    if (!step?.targetId) return;
    const el = document.getElementById(step.targetId);
    if (!el) return;
    const elRect = el.getBoundingClientRect();
    const NAV = 80; // sticky navbar height + breathing room
    const MOBILE_BAR = 80; // mobile sticky bottom bar height
    const alreadyVisible =
      elRect.top >= NAV &&
      elRect.bottom <= window.innerHeight - (isMobile ? MOBILE_BAR : 20);

    if (!alreadyVisible) {
      // Scroll so element sits just below the navbar
      const targetScrollY = window.scrollY + elRect.top - NAV;
      window.scrollTo({ top: Math.max(0, targetScrollY), behavior: "smooth" });
    }
    // Re-measure after scroll settles
    const t = setTimeout(measure, 500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const prev = () => idx > 0 && setIdx(i => i - 1);
  const next = () => idx < visibleSteps.length - 1 ? setIdx(i => i + 1) : onDone();

  const NAVBAR_H = 72; // sticky navbar height — ensure popover never goes behind it
  const POPOVER_H = 260;
  const popoverStyle = (): React.CSSProperties => {
    const pw = Math.min(310, vw - 32);
    const clampX = (x: number) => Math.max(12, Math.min(x, vw - pw - 12));
    // Min is NAVBAR_H+8 so popover never slides behind the sticky nav
    const clampY = (y: number) => Math.max(NAVBAR_H + 8, Math.min(y, vh - POPOVER_H - 12));

    if (!rect) {
      return { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: pw };
    }

    const hl = rect.left - PAD;
    const ht = rect.top - PAD;
    const hw = rect.width + PAD * 2;
    const hh = rect.height + PAD * 2;
    const centerX = hl + hw / 2 - pw / 2;
    const pos = step.position ?? "bottom";

    // For large elements (taller than 60% of viewport):
    // On mobile: dock to BOTTOM so content above is visible
    // On desktop: center on screen
    if (hh > vh * 0.6) {
      if (isMobile) {
        // Pin above the mobile sticky bar (which is ~70px tall)
        const MOBILE_BAR = 72;
        const left = Math.max(12, Math.round((vw - pw) / 2));
        return {
          position: "fixed",
          bottom: MOBILE_BAR + 8,
          left,
          width: pw,
        };
      }
      return { position: "fixed", top: clampY(vh / 2 - POPOVER_H / 2), left: clampX(centerX), width: pw };
    }

    if (pos === "bottom") {
      const top = ht + hh + 12;
      if (top + POPOVER_H > vh) {
        // Flip above the element
        return { position: "fixed", top: clampY(ht - POPOVER_H - 12), left: clampX(centerX), width: pw };
      }
      return { position: "fixed", top: clampY(top), left: clampX(centerX), width: pw };
    }

    if (pos === "top") {
      const top = ht - POPOVER_H - 12;
      if (top < 12) {
        return { position: "fixed", top: clampY(ht + hh + 12), left: clampX(centerX), width: pw };
      }
      return { position: "fixed", top: clampY(top), left: clampX(centerX), width: pw };
    }

    if (pos === "right") {
      const l = hl + hw + 12;
      if (l + pw > vw - 8) {
        return { position: "fixed", top: clampY(ht + hh + 12), left: clampX(centerX), width: pw };
      }
      return { position: "fixed", top: clampY(ht + hh / 2 - POPOVER_H / 2), left: l, width: pw };
    }

    if (pos === "left") {
      const l = hl - pw - 12;
      if (l < 8) {
        return { position: "fixed", top: clampY(ht + hh + 12), left: clampX(centerX), width: pw };
      }
      return { position: "fixed", top: clampY(ht + hh / 2 - POPOVER_H / 2), left: l, width: pw };
    }

    return { position: "fixed", top: clampY(ht + hh + 12), left: clampX(centerX), width: pw };
  };


  // SVG spotlight — clamp cutout rect to viewport so it never reveals page bg below
  const Spotlight = () => {
    if (!rect) return null;
    // Clamp to viewport bounds before drawing
    const rawL = rect.left - PAD;
    const rawT = rect.top - PAD;
    const rawR = rawL + rect.width + PAD * 2;
    const rawB = rawT + rect.height + PAD * 2;
    const hl = Math.max(0, rawL);
    const ht = Math.max(0, rawT);
    const hr = Math.min(vw, rawR);
    const hb = Math.min(vh, rawB);
    const hw = Math.max(0, hr - hl);
    const hh = Math.max(0, hb - ht);
    if (hw === 0 || hh === 0) return null; // element not visible in viewport
    const r = 12;
    return (
      <svg
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect x={hl} y={ht} width={hw} height={hh} rx={r} ry={r} fill="black" />
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.62)" mask="url(#tour-mask)" />
        {/* Green glow ring */}
        <rect
          x={hl - 2} y={ht - 2} width={hw + 4} height={hh + 4}
          rx={r + 2} ry={r + 2}
          fill="none"
          stroke="var(--green)"
          strokeWidth="1.5"
          opacity="0.8"
        />
      </svg>
    );
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* Dimmed backdrop — click to dismiss */}
      <div
        style={{ position: "fixed", inset: 0, pointerEvents: "all" }}
        onClick={onDone}
      >
        <Spotlight />
      </div>

      {/* Popover */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            ...popoverStyle(),
            zIndex: 10000,
            pointerEvents: "all",
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "18px 20px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(61,179,113,0.12)",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Top accent */}
          <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 2, background: "linear-gradient(90deg, transparent, var(--green), transparent)", borderRadius: "0 0 2px 2px" }} />

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green)", marginBottom: 4, fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                Step {idx + 1} of {visibleSteps.length}
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", lineHeight: 1.3, margin: 0, fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                {step.title}
              </p>
            </div>
            <button
              onClick={onDone}
              style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 8px", color: "var(--text-3)", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center" }}
            >
              <X style={{ width: 13, height: 13 }} />
            </button>
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, margin: "0 0 16px 0", fontFamily: "var(--font-inter), sans-serif" }}>
            {step.description}
          </p>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
            {visibleSteps.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 4,
                  width: i === idx ? 20 : 6,
                  borderRadius: 3,
                  background: i === idx ? "var(--green)" : i < idx ? "rgba(61,179,113,0.35)" : "var(--bg-3)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {idx > 0 && (
              <button
                onClick={prev}
                style={{ padding: "9px 16px", borderRadius: 10, background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-2)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                <ChevronLeft style={{ width: 14, height: 14 }} /> Back
              </button>
            )}
            <button
              onClick={next}
              style={{
                flex: 1,
                padding: "9px 16px",
                borderRadius: 10,
                background: "var(--green)",
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                boxShadow: "0 3px 12px rgba(61,179,113,0.35)",
                fontFamily: "var(--font-space-grotesk), sans-serif",
              }}
            >
              {idx === visibleSteps.length - 1 ? "Done ✓" : <>Next <ChevronRight style={{ width: 14, height: 14 }} /></>}
            </button>
          </div>

          {/* Skip */}
          {idx < visibleSteps.length - 1 && (
            <button
              onClick={onDone}
              style={{ display: "block", width: "100%", textAlign: "center", marginTop: 10, background: "none", border: "none", color: "var(--text-3)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Skip tour
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
