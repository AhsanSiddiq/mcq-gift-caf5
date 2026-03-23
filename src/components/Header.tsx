"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Sun, Moon, BookOpen } from "lucide-react";
import { allSubjects } from "@/data/subjects";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "CA Roadmap",   href: "/#path" },
  { label: "MCQ Practice", href: "/practice" },
  { label: "CV Maker",     href: "/cv-maker" },
  { label: "About",        href: "/#story" },
  { label: "Blogs",        href: "/#articles" },
];

export default function Header() {
  const params    = useParams();
  const subjectId = params?.subject as string;
  const currentSubject = allSubjects.find(s => s.id === subjectId);

  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Force-scroll even when URL hash hasn't changed */
  const scrollToHash = (href: string) => {
    const hash = href.split("#")[1];
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const glass = {
    background:          "rgba(10,10,11,0.75)",
    backdropFilter:      "blur(28px) saturate(180%)",
    WebkitBackdropFilter:"blur(28px) saturate(180%)",
    border:              "1px solid rgba(255,255,255,0.09)",
    boxShadow:           "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
  };
  const glassLight = {
    background:          "rgba(250,250,249,0.82)",
    backdropFilter:      "blur(28px) saturate(180%)",
    WebkitBackdropFilter:"blur(28px) saturate(180%)",
    border:              "1px solid rgba(0,0,0,0.09)",
    boxShadow:           "0 8px 40px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
  };
  const currentGlass = theme === "dark" ? glass : glassLight;

  /* Logo filter: white silhouette in dark, original in light */
  const logoFilter = theme === "dark" ? "brightness(0) invert(1)" : "none";

  return (
    <>
      <motion.header
        className="fixed z-50 left-0 right-0"
        style={{ top: 0 }}
        animate={scrolled ? { top: 12, left: 16, right: 16 } : { top: 0, left: 0, right: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="mx-auto w-full flex items-center justify-between gap-4"
          animate={
            scrolled
              ? { borderRadius: 9999, paddingLeft: 16, paddingRight: 16, height: 58, maxWidth: 1060 }
              : { borderRadius: 0,    paddingLeft: isMobile ? 20 : 40, paddingRight: isMobile ? 20 : 40, height: isMobile ? 60 : 76, maxWidth: 9999 }
          }
          style={scrolled ? currentGlass : { background: "transparent", border: "1px solid transparent" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* ── LOGO ─────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <motion.div
              className="relative"
              animate={scrolled ? { width: 44, height: 44 } : { width: isMobile ? 52 : 70, height: isMobile ? 52 : 70 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ flexShrink: 0 }}
            >
              <Image
                src="/CAHubNoBG.png"
                alt="The CA Hub"
                fill
                className="object-contain transition-all duration-400"
                style={{ filter: logoFilter, transition: "filter 0.4s ease" }}
                priority
              />
            </motion.div>

            {/* Byline - only shown when NOT in pill mode */}
            <motion.div
              className="hidden sm:flex flex-col leading-none"
              animate={scrolled ? { opacity: 0, x: -10, width: 0, overflow: "hidden" } : { opacity: 1, x: 0, width: "auto" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
              <span style={{
                fontSize: 10, fontWeight: 700, color: "var(--green)",
                letterSpacing: "0.2em", textTransform: "uppercase",
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}>
                by Muhammad Ahsan Siddiq
              </span>
            </motion.div>
          </Link>

          {/* ── DESKTOP NAV ──────────────────────── */}
          {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => scrollToHash(l.href)}
                style={{
                  fontSize: 13, fontWeight: 500, color: "var(--text-2)",
                  padding: "7px 14px", borderRadius: 8,
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  transition: "color 0.2s, background 0.2s", textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text-1)"; e.currentTarget.style.background = "var(--surface)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-2)"; e.currentTarget.style.background = "transparent"; }}
              >
                {l.label}
              </Link>
            ))}
            {currentSubject && (
              <span className="ml-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
                style={{ background: "rgba(61,179,113,0.12)", color: "var(--green)", border: "1px solid rgba(61,179,113,0.2)", fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}>
                {currentSubject.id.toUpperCase()}
              </span>
            )}
          </nav>
          )}

          {/* ── RIGHT ────────────────────────────── */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              style={{ width: 36, height: 36, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "transform 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.18 }}>
                    <Sun className="w-[15px] h-[15px]" style={{ color: "#F5A623" }} strokeWidth={2.2} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.18 }}>
                    <Moon className="w-[15px] h-[15px]" style={{ color: "#1B2A4A" }} strokeWidth={2.2} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* MCQ CTA - desktop only */}
            {!isMobile && (
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 font-bold rounded-full text-white"
                style={{
                  background: "var(--green)", fontSize: 13, padding: "9px 20px",
                  letterSpacing: "0.01em", fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                  textDecoration: "none", whiteSpace: "nowrap",
                  boxShadow: "0 4px 20px rgba(61,179,113,0.35)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px) scale(1.03)"; e.currentTarget.style.background = "#2E9960"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(61,179,113,0.45)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "var(--green)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(61,179,113,0.35)"; }}
              >
                <BookOpen className="w-4 h-4" strokeWidth={2.2} />
                Practice MCQs Free
              </Link>
            )}

            {/* Hamburger - mobile only */}
            {isMobile && (
              <button
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  width: 36, height: 36, borderRadius: 10,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 5, cursor: "pointer",
                }}
              >
                <span style={{ width: 18, height: 1.5, background: "var(--text-1)", borderRadius: 2, transition: "transform 0.3s", transform: open ? "rotate(45deg) translateY(6.5px)" : "none", display: "block" }} />
                <span style={{ width: 18, height: 1.5, background: "var(--text-1)", borderRadius: 2, transition: "opacity 0.3s", opacity: open ? 0 : 1, display: "block" }} />
                <span style={{ width: 18, height: 1.5, background: "var(--text-1)", borderRadius: 2, transition: "transform 0.3s", transform: open ? "rotate(-45deg) translateY(-6.5px)" : "none", display: "block" }} />
              </button>
            )}
          </div>
        </motion.div>
      </motion.header>

      {/* ── MOBILE MENU ─────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-40 left-4 right-4 rounded-2xl overflow-hidden"
            style={{ top: 88, ...currentGlass }}
          >
            <div className="p-5 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => { scrollToHash(l.href); setOpen(false); }}
                  style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)", padding: "11px 16px", borderRadius: 10, fontFamily: "var(--font-space-grotesk), system-ui, sans-serif", textDecoration: "none", display: "block", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--surface)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {l.label}
                </Link>
              ))}
              <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
              <Link
                href="/caf/caf-5"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 font-bold rounded-full text-white justify-center"
                style={{ background: "var(--green)", fontSize: 14, padding: "13px 24px", fontFamily: "var(--font-space-grotesk), system-ui, sans-serif", textDecoration: "none", boxShadow: "0 4px 20px rgba(61,179,113,0.3)" }}
              >
                <BookOpen className="w-4 h-4" strokeWidth={2.2} />
                Practice MCQs Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
