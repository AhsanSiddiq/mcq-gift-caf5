"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, usePathname } from "next/navigation";
import { Sun, Moon, BookOpen, ChevronDown, ArrowRight, BarChart3 } from "lucide-react";
import { allSubjects, subjectCode, type BodyId } from "@/data/subjects";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import RegionSwitcher from "@/components/RegionSwitcher";
import { QUAL_GROUPS, dailyHrefFor, paperCode, subjectHomeHref, type QualGroup } from "@/lib/navigation";

const NAV_LINKS = [
  { label: "Practice",  href: "/practice" },
  { label: "Past Papers", href: "/past-papers" },
  { label: "Daily",     href: "/daily" },
  { label: "Tools",     href: "/tools" },
  { label: "Standards", href: "/standards" },
  { label: "Articles",  href: "/blog" },
  { label: "Pro",       href: "/pro" },
];

const MOBILE_EXTRA = [{ label: "My progress", href: "/dashboard" }];

const font = { fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" } as const;

/** Qualification the visitor is in: the current subject's body, else <html data-body>, else ICAP. */
function initialBody(subjectBody?: BodyId): BodyId {
  if (subjectBody) return subjectBody;
  const b = typeof document !== "undefined" ? document.documentElement.dataset.body : undefined;
  return QUAL_GROUPS.some((g) => g.body === b) ? (b as BodyId) : "icap";
}

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/* ── Papers for one qualification (used by desktop panel and mobile accordion) ── */
function PaperLinks({ group, onNavigate, compact }: { group: QualGroup; onNavigate: () => void; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {group.levels.map((lv) => (
        <div key={lv.level}>
          {lv.label && (
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] mb-1.5" style={{ ...font, color: "var(--text-3)" }}>
              {lv.label}
            </p>
          )}
          <ul className={`grid gap-1 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
            {lv.subjects.map((s) => (
              <li key={s.id} className="min-w-0">
                <Link
                  href={subjectHomeHref(s)}
                  onClick={onNavigate}
                  className="nav-item flex items-baseline gap-2 rounded-lg px-2.5 py-2 min-w-0"
                  style={{ textDecoration: "none" }}
                >
                  <span className="shrink-0 text-xs font-bold" style={{ ...font, color: "var(--green)" }}>{paperCode(s)}</span>
                  <span className="truncate text-[13px]" style={{ color: "var(--text-1)" }}>{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function GroupFooter({ group, onNavigate }: { group: QualGroup; onNavigate: () => void }) {
  const link = "inline-flex items-center gap-1.5 text-[13px] font-semibold no-underline hover:underline underline-offset-2";
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 pt-3 mt-1" style={{ borderTop: "1px solid var(--border)" }}>
      <Link href={group.hub} onClick={onNavigate} className={link} style={{ color: "var(--green)" }}>
        {group.short} exam guide <ArrowRight className="w-3.5 h-3.5" />
      </Link>
      <Link href={dailyHrefFor(group.body)} onClick={onNavigate} className={link} style={{ color: "var(--text-2)" }}>
        {group.short} daily challenge
      </Link>
    </div>
  );
}

export default function Header() {
  const params    = useParams();
  const pathname  = usePathname() ?? "/";
  const subjectId = params?.subject as string;
  const currentSubject = allSubjects.find(s => s.id === subjectId);

  const [scrolled, setScrolled] = useState(false);
  // Menus remember the path they were opened on, so navigating closes them without an effect.
  const [mobileOpenOn, setMobileOpenOn] = useState<string | null>(null);
  const [qualOpenOn,   setQualOpenOn]   = useState<string | null>(null);
  const open     = mobileOpenOn === pathname;
  const qualOpen = qualOpenOn === pathname;
  const [activeBody, setActiveBody] = useState<BodyId>("icap");
  const [mobileBody, setMobileBody] = useState<BodyId | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggle } = useTheme();
  const qualRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const closeAll = useCallback(() => { setQualOpenOn(null); setMobileOpenOn(null); }, []);

  // Escape / outside click closes the qualifications panel
  useEffect(() => {
    if (!qualOpen && !open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeAll(); };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (qualOpen && !qualRef.current?.contains(t) && !panelRef.current?.contains(t)) setQualOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [qualOpen, open, closeAll]);

  const openQual = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!qualOpen) setActiveBody(initialBody(currentSubject?.body ?? (currentSubject ? "icap" : undefined)));
    setQualOpenOn(pathname);
  };
  const scheduleCloseQual = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setQualOpenOn(null), 180);
  };

  const toggleMobile = () => {
    if (open) { setMobileOpenOn(null); return; }
    setMobileBody(null);
    setMobileOpenOn(pathname);
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
  const panelBg = theme === "dark" ? "rgba(17,17,19,0.97)" : "rgba(250,250,249,0.98)";

  /* Logo filter: white silhouette in dark, original in light */
  const logoFilter = theme === "dark" ? "brightness(0) invert(1)" : "none";

  const activeGroup = QUAL_GROUPS.find(g => g.body === activeBody) ?? QUAL_GROUPS[0];
  const inQualification = !!currentSubject || pathname.startsWith("/exams");

  const navLinkStyle = (active: boolean) => ({
    fontSize: 13, fontWeight: active ? 600 : 500,
    color: active ? "var(--text-1)" : "var(--text-2)",
    padding: "7px 9px", borderRadius: 8,
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    textDecoration: "none", whiteSpace: "nowrap" as const,
  });

  return (
    <MotionConfig reducedMotion="user">
      <style>{`
        .nav-item { transition: background 0.15s, color 0.15s; }
        .nav-item:hover, .nav-item:focus-visible { background: var(--surface); color: var(--text-1) !important; }
        @media (prefers-reduced-motion: reduce) { .nav-item { transition: none; } }
      `}</style>
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
          <Link href="/" aria-label="The CA Hub home" className="flex items-center gap-3 shrink-0 group">
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
              className="hidden 2xl:flex flex-col leading-none"
              animate={scrolled ? { opacity: 0, x: -10, width: 0, overflow: "hidden" } : { opacity: 1, x: 0, width: "auto" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
              <span style={{
                fontSize: 10, fontWeight: 700, color: "var(--green)",
                letterSpacing: "0.2em", textTransform: "uppercase", ...font,
              }}>
                by Muhammad Ahsan Siddiq
              </span>
            </motion.div>
          </Link>

          {/* ── DESKTOP NAV ──────────────────────── */}
          {!isMobile && (
          <nav aria-label="Main" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <div ref={qualRef} onMouseEnter={openQual} onMouseLeave={scheduleCloseQual}>
              <button
                type="button"
                className="nav-item inline-flex items-center gap-1"
                aria-expanded={qualOpen}
                aria-controls="qual-panel"
                onClick={() => (qualOpen ? setQualOpenOn(null) : openQual())}
                style={{ ...navLinkStyle(inQualification || qualOpen), background: qualOpen ? "var(--surface)" : "transparent", border: "none", cursor: "pointer" }}
              >
                Qualifications
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.4} style={{ transition: "transform 0.2s", transform: qualOpen ? "rotate(180deg)" : "none" }} />
              </button>

            </div>

            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href) || (l.href === "/daily" && pathname.startsWith("/daily"));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className="nav-item"
                  style={navLinkStyle(active)}
                >
                  {l.label}
                </Link>
              );
            })}
            {currentSubject && (
              <span className="hidden min-[1440px]:inline-block ml-2 px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-bold uppercase tracking-widest"
                style={{ background: "color-mix(in srgb, var(--green) 12%, transparent)", color: "var(--green)", border: "1px solid color-mix(in srgb, var(--green) 20%, transparent)", ...font }}>
                {subjectCode(currentSubject)}
              </span>
            )}
          </nav>
          )}

          {/* ── RIGHT ────────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Exam-body / region switcher - desktop only (mobile copy lives in the menu) */}
            {!isMobile && <RegionSwitcher />}

            {/* My progress */}
            <Link
              href="/dashboard"
              aria-label="My progress"
              title="My progress"
              className="nav-item"
              style={{ width: 36, height: 36, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: isActive(pathname, "/dashboard") ? "var(--green)" : "var(--text-2)" }}
            >
              <BarChart3 className="w-[15px] h-[15px]" strokeWidth={2.2} />
            </Link>

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

            {/* MCQ CTA - wide desktop only */}
            {!isMobile && (
              <Link
                href="/practice"
                className="hidden xl:inline-flex items-center gap-2 font-bold rounded-full text-white"
                style={{
                  background: "var(--green)", fontSize: 13, padding: "9px 18px",
                  letterSpacing: "0.01em", ...font,
                  textDecoration: "none", whiteSpace: "nowrap",
                  boxShadow: "0 4px 20px color-mix(in srgb, var(--green) 35%, transparent)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.background = "var(--green-d)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "var(--green)"; }}
              >
                <BookOpen className="w-4 h-4" strokeWidth={2.2} />
                Start practising
              </Link>
            )}

            {/* Hamburger - mobile only */}
            {isMobile && (
              <button
                onClick={toggleMobile}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
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

      {/* ── QUALIFICATIONS PANEL (desktop) ──────────── */}
      <AnimatePresence>
        {qualOpen && !isMobile && (
          <motion.div
            id="qual-panel"
            ref={panelRef}
            onMouseEnter={openQual}
            onMouseLeave={scheduleCloseQual}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="fixed z-50 left-1/2 -translate-x-1/2 rounded-2xl overflow-hidden"
            style={{
              top: scrolled ? 76 : 72, width: "min(880px, calc(100vw - 32px))",
              background: panelBg, border: "1px solid var(--border)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="grid grid-cols-[200px_minmax(0,1fr)]">
              <ul className="p-2 flex flex-col gap-0.5" style={{ borderRight: "1px solid var(--border)", background: "var(--surface)" }}>
                {QUAL_GROUPS.map((g) => {
                  const sel = g.body === activeGroup.body;
                  return (
                    <li key={g.body}>
                      <Link
                        href={g.hub}
                        onClick={closeAll}
                        onMouseEnter={() => setActiveBody(g.body)}
                        onFocus={() => setActiveBody(g.body)}
                        className="nav-item flex items-center justify-between gap-2 rounded-lg px-3 py-2.5"
                        style={{ textDecoration: "none", background: sel ? "var(--surface)" : "transparent" }}
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-bold" style={{ ...font, color: sel ? "var(--text-1)" : "var(--text-2)" }}>{g.short}</span>
                          <span className="block text-[11px]" style={{ color: "var(--text-3)" }}>{g.note}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: sel ? "var(--green)" : "transparent" }} />
                      </Link>
                    </li>
                  );
                })}
                <li className="mt-1 pt-1" style={{ borderTop: "1px solid var(--border)" }}>
                  <Link href="/exams" onClick={closeAll} className="nav-item block rounded-lg px-3 py-2 text-[13px] font-semibold" style={{ color: "var(--text-2)", textDecoration: "none" }}>
                    All exams
                  </Link>
                </li>
              </ul>
              <div className="p-4 flex flex-col gap-3 min-w-0">
                <p className="text-xs font-semibold" style={{ color: "var(--text-3)" }}>{activeGroup.short} papers with free MCQs</p>
                <PaperLinks group={activeGroup} onNavigate={closeAll} />
                <GroupFooter group={activeGroup} onNavigate={closeAll} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE MENU ─────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-40 left-4 right-4 rounded-2xl overflow-hidden"
            style={{ top: scrolled ? 80 : 68, ...currentGlass, background: panelBg }}
          >
            <nav aria-label="Main" className="p-4 flex flex-col gap-1 overflow-y-auto overscroll-contain" style={{ maxHeight: `calc(100dvh - ${scrolled ? 96 : 84}px)` }}>
              <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ ...font, color: "var(--text-3)" }}>
                Qualifications
              </p>
              <ul className="grid grid-cols-3 gap-1.5 mb-1">
                {QUAL_GROUPS.map((g) => {
                  const sel = mobileBody === g.body;
                  return (
                    <li key={g.body}>
                      <button
                        type="button"
                        aria-expanded={sel}
                        onClick={() => setMobileBody(sel ? null : g.body)}
                        className="w-full rounded-xl px-2 py-2.5 text-center"
                        style={{
                          ...font, fontSize: 13, fontWeight: 700, cursor: "pointer",
                          background: sel ? "color-mix(in srgb, var(--green) 14%, transparent)" : "var(--surface)",
                          border: `1px solid ${sel ? "color-mix(in srgb, var(--green) 45%, transparent)" : "var(--border)"}`,
                          color: "var(--text-1)",
                        }}
                      >
                        {g.short}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {mobileBody && (() => {
                const g = QUAL_GROUPS.find(x => x.body === mobileBody)!;
                return (
                  <div className="rounded-xl p-3 mb-1" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <PaperLinks group={g} onNavigate={closeAll} compact />
                    <GroupFooter group={g} onNavigate={closeAll} />
                  </div>
                );
              })()}

              <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />

              {[...NAV_LINKS, ...MOBILE_EXTRA].map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={closeAll}
                    aria-current={active ? "page" : undefined}
                    className="nav-item"
                    style={{ fontSize: 15, fontWeight: 600, color: active ? "var(--green)" : "var(--text-1)", padding: "10px 12px", borderRadius: 10, ...font, textDecoration: "none", display: "block" }}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
              <div style={{ padding: "0 0 10px" }}>
                <RegionSwitcher variant="inline" onSelect={closeAll} />
              </div>
              <Link
                href="/practice"
                onClick={closeAll}
                className="inline-flex items-center gap-2 font-bold rounded-full text-white justify-center"
                style={{ background: "var(--green)", fontSize: 14, padding: "13px 24px", ...font, textDecoration: "none", boxShadow: "0 4px 20px color-mix(in srgb, var(--green) 30%, transparent)" }}
              >
                <BookOpen className="w-4 h-4" strokeWidth={2.2} />
                Start practising
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
