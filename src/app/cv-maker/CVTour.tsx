"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface Rect { top: number; left: number; width: number; height: number; }

const STEPS: TourStep[] = [
  {
    targetId: "tour-form",
    title: "Fill in your details",
    description: "Go section by section — Personal, Education, Experience. Takes about 8 minutes. The sample data shows you exactly what to write.",
    position: "right",
  },
  {
    targetId: "tour-steps",
    title: "Jump to any section",
    description: "Tap any section at the top to jump directly to it. Completed sections turn green.",
    position: "bottom",
  },
  {
    targetId: "tour-ats",
    title: "ATS Score — aim for 80+",
    description: "This score tells you if your CV will pass automated screening. Add a profile summary and add metrics to your bullets to boost it.",
    position: "bottom",
  },
  {
    targetId: "tour-appearance",
    title: "Pick your template",
    description: "Classic (2-column) works best if you have experience. Executive (1-column) is better if you're just starting out.",
    position: "right",
  },
  {
    targetId: "tour-download",
    title: "Download your CV",
    description: "Click Download when you're ready. You'll get a clean, print-ready PDF — no watermarks, no login required. Ever.",
    position: "bottom",
  },
];

function getRect(id: string): Rect | null {
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, left: r.left + window.scrollX, width: r.width, height: r.height };
}

const PAD = 10;

export function CVTour({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
  const popRef = useRef<HTMLDivElement>(null);

  const step = STEPS[idx];

  const measure = useCallback(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    const r = getRect(step.targetId);
    if (r) {
      setRect(r);
      // Scroll element into view
      const el = document.getElementById(step.targetId);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [step.targetId]);

  useEffect(() => {
    const t = setTimeout(measure, 100);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); };
  }, [measure]);

  const prev = () => idx > 0 && setIdx(i => i - 1);
  const next = () => idx < STEPS.length - 1 ? setIdx(i => i + 1) : onDone();

  // Popover positioning
  const popoverStyle = (): React.CSSProperties => {
    if (!rect) return { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };
    const pw = Math.min(310, windowSize.w - 32);
    const ph = 180; // rough estimate
    const pos = step.position ?? "bottom";
    const hl = rect.left - PAD;
    const ht = rect.top - PAD;
    const hw = rect.width + PAD * 2;
    const hh = rect.height + PAD * 2;
    const centerX = hl + hw / 2 - pw / 2;
    const scrollY = window.scrollY;

    if (pos === "bottom") {
      return {
        position: "absolute",
        top: ht + hh + 12,
        left: Math.max(16, Math.min(centerX, windowSize.w - pw - 16)),
        width: pw,
      };
    }
    if (pos === "top") {
      return {
        position: "absolute",
        top: ht - ph - 12,
        left: Math.max(16, Math.min(centerX, windowSize.w - pw - 16)),
        width: pw,
      };
    }
    if (pos === "right") {
      const l = hl + hw + 12;
      // If not enough room, fall back below
      if (l + pw > windowSize.w - 8) {
        return {
          position: "absolute",
          top: ht + hh + 12,
          left: Math.max(16, Math.min(centerX, windowSize.w - pw - 16)),
          width: pw,
        };
      }
      return {
        position: "absolute",
        top: Math.max(scrollY + 16, ht + hh / 2 - ph / 2),
        left: l,
        width: pw,
      };
    }
    if (pos === "left") {
      const l = hl - pw - 12;
      if (l < 8) {
        return {
          position: "absolute",
          top: ht + hh + 12,
          left: Math.max(16, Math.min(centerX, windowSize.w - pw - 16)),
          width: pw,
        };
      }
      return {
        position: "absolute",
        top: Math.max(scrollY + 16, ht + hh / 2 - ph / 2),
        left: l,
        width: pw,
      };
    }
    return {
      position: "absolute",
      top: ht + hh + 12,
      left: Math.max(16, Math.min(centerX, windowSize.w - pw - 16)),
      width: pw,
    };
  };

  // SVG cutout overlay
  const overlay = () => {
    if (!rect) return null;
    const W = document.documentElement.scrollWidth;
    const H = document.documentElement.scrollHeight;
    const hl = rect.left - PAD;
    const ht = rect.top - PAD;
    const hw = rect.width + PAD * 2;
    const hh = rect.height + PAD * 2;
    const r = 14;
    return (
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: W, height: H, pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width={W} height={H} fill="white" />
            <rect x={hl} y={ht} width={hw} height={hh} rx={r} ry={r} fill="black" />
          </mask>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="rgba(0,0,0,0.55)" mask="url(#tour-mask)" />
        {/* Glow ring around element */}
        <rect
          x={hl - 2} y={ht - 2} width={hw + 4} height={hh + 4}
          rx={r + 2} ry={r + 2}
          fill="none"
          stroke="var(--green)"
          strokeWidth="1.5"
          opacity="0.7"
        />
      </svg>
    );
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, overflow: "auto", pointerEvents: "none" }}
    >
      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "all" }} onClick={onDone}>
        {overlay()}
      </div>

      {/* Popover */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          ref={popRef}
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            ...popoverStyle(),
            zIndex: 10000,
            pointerEvents: "all",
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "18px 20px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(61,179,113,0.15)",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 2, background: "linear-gradient(90deg, transparent, var(--green), transparent)", borderRadius: "0 0 2px 2px" }} />

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green)", marginBottom: 4, fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                Step {idx + 1} of {STEPS.length}
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
            {STEPS.map((_, i) => (
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
              {idx === STEPS.length - 1 ? "Done ✓" : <>Next <ChevronRight style={{ width: 14, height: 14 }} /></>}
            </button>
          </div>

          {/* Skip */}
          {idx < STEPS.length - 1 && (
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
