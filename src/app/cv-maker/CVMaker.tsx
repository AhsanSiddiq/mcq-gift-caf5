"use client";
import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { Plus, Trash2, Download, Eye, EyeOff, ChevronLeft, ChevronRight, X, RefreshCw, ArrowUp, ArrowDown, Sparkles, CheckCircle2, Play, ScanText, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CVTour } from "./CVTour";
import CareerNav from "./CareerNav";
import {
  type CVData, type Education, type WorkExp, type Course, type SectionId, type QualBodyId,
  LS_KEY, DEMO, DEFAULT, QUAL_BODIES, QUAL_BODY_IDS, BASE_EDU_PRESETS, SECTION_LABELS, TEMPLATES,
  qualOf, normalizeCV, sectionOrder, hiddenSections,
} from "./cvData";
import { CVPreview, A4_W, A4_H } from "./CVTemplates";
import { atsPdf, breaksOf, cvToPdf, measureLayout, paginate } from "./pdf";


const STEPS = [
  { id: "personal", label: "Personal" },
  { id: "ca", label: "Qualification" },
  { id: "education", label: "Education" },
  { id: "profile", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "courses", label: "Courses" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "appearance", label: "Appearance" },
];

/* ── UI helpers ── */

const WEAK_VERBS_CRITICAL = ["helped", "worked", "did", "made", "was", "got", "took"];
const getWeakVerbWarning = (str: string) => {
  const firstWord = str.trim().split(" ")[0]?.toLowerCase();
  if (firstWord && WEAK_VERBS_CRITICAL.includes(firstWord)) {
    return `"${firstWord}" is a weak verb. Try: Facilitated, Executed, Navigated, or Orchestrated.`;
  }
  return null;
};
const formatBullet = (s: string) => {
  let text = s.trim();
  if (!text) return text;
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!/[.\!?]$/.test(text)) text += ".";
  return text;
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-2)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>{children}</span>
      {required
        ? <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.12)", color: "#F87171" }}>Required</span>
        : <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--bg-3)", color: "var(--text-3)" }}>Optional</span>}
    </div>
  );
}
function Inp({ value, onChange, placeholder, type = "text", disabled, onBlur }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean; onBlur?: () => void }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
      style={{ background: disabled ? "var(--bg-3)" : "var(--bg)", border: "1px solid var(--border)", color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}
      onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
      onBlur={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        if (onBlur) onBlur();
      }}
    />
  );
}
function Txta({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none transition-all"
      style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}
      onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
      onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
    />
  );
}
function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs mt-1.5" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>{children}</p>;
}
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3 mb-4 text-xs space-y-1" style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
      {children}
    </div>
  );
}
function ListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Inp value={item} onChange={v => { const n = [...items]; n[i] = v; onChange(n); }} placeholder={placeholder} />
          {items.length > 1 && <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-2.5 rounded-xl shrink-0" style={{ color: "#F87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}><Trash2 className="w-4 h-4" /></button>}
        </div>
      ))}
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onChange([...items, ""])} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl" style={{ color: "var(--green)", background: "color-mix(in srgb, var(--green) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 15%, transparent)", cursor: "pointer" }}>
        <Plus className="w-4 h-4" /> Add
      </motion.button>
    </div>
  );
}

/* ── Live ATS Scorer ── */
function getCVScore(cv: CVData) {
  let score = 20; // Base score
  if (cv.name && cv.phone && cv.email) score += 10;
  if (cv.profile.length > 30) score += 15;
  if (cv.education.length > 0 && cv.education[0].institution) score += 10;
  const validExp = cv.workExp.filter(w => w.company);
  if (validExp.length > 0) {
    score += 15;
    if (validExp.some(w => w.bullets.some(b => /\d/.test(b) || /%/.test(b)))) score += 10; // Numbers/Metrics
  }
  if (cv.courses.filter(c => c.name).length > 0) score += 5;
  if (cv.skills.filter(s => s).length > 2) score += 5;
  if (cv.accomplishments.filter(a => a).length > 0) score += 10;
  return Math.min(100, score);
}

function ATSScoreRing({ score }: { score: number }) {
  const isHigh = score >= 80;
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl transition-all" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path className="opacity-20" stroke="var(--green)" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <motion.path stroke="var(--green)" strokeWidth="3" strokeDasharray={`${score}, 100`} fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: `${score}, 100` }} transition={{ duration: 1, ease: "easeOut" }} />
        </svg>
        <span className="absolute text-xs font-bold font-space-grotesk" style={{ color: "var(--green)" }}>{score}%</span>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1" style={{ color: "var(--text-3)" }}>ATS Scanner</p>
        <p className="text-sm font-semibold leading-none" style={{ color: isHigh ? "var(--green)" : "var(--text-1)" }}>{isHigh ? "Big-4 Ready 🚀" : "Keep Building..."}</p>
      </div>
    </div>
  );
}

interface PageInfo { breaks: number[]; height: number }

/* ── Scaled live A4 preview with page-break markers (zero phantom whitespace below) ── */
function ScaledPreview({ cv, scale, pages }: { cv: CVData; scale: number; pages: PageInfo }) {
  const h = Math.max(A4_H, pages.height);
  return (
    <div style={{ width: A4_W * scale, height: h * scale, overflow: "hidden", position: "relative", flexShrink: 0, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.18)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, transformOrigin: "top left", transform: `scale(${scale})`, width: A4_W }}>
        <CVPreview cv={cv} />
      </div>
      {pages.breaks.map((b, i) => (
        <div key={b} aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: b * scale, borderTop: "2px dashed #ef4444", pointerEvents: "none" }}>
          <span style={{ position: "absolute", right: 6, top: 3, fontSize: 10, fontWeight: 700, color: "#fff", background: "#ef4444", borderRadius: 4, padding: "1px 6px", fontFamily: "var(--font-inter), sans-serif" }}>Page {i + 2}</span>
        </div>
      ))}
    </div>
  );
}

/** Width of an element, tracked with ResizeObserver. */
function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/* ══════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════ */
function CVMakerInner({ hydrated }: { hydrated: boolean }) {
  const [cv, setCv] = useState<CVData>(() => {
    if (!hydrated) return DEMO;
    try { const s = localStorage.getItem(LS_KEY); return s ? normalizeCV(JSON.parse(s)) : DEMO; } catch { return DEMO; }
  });
  const [step, setStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [restored, setRestored] = useState(() => {
    if (!hydrated) return false;
    try { return !!localStorage.getItem(LS_KEY); } catch { return false; }
  });
  const [mobileScale, setMobileScale] = useState(0.42);
  const [showTour, setShowTour] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [pages, setPages] = useState<PageInfo>({ breaks: [], height: A4_H });
  const [deskRef, deskWidth] = useWidth<HTMLDivElement>();
  const [mobRef, mobWidth] = useWidth<HTMLDivElement>();
  const refEl = useRef<HTMLDivElement>(null);

  const startTour = () => setShowTour(true);
  const openPreview = () => {
    setMobileScale(Math.min(0.6, (window.innerWidth - 32) / A4_W));
    setShowPreview(true);
  };

  useEffect(() => {
    if (!hydrated) return;
    let seen = true;
    try { seen = !!localStorage.getItem("cahub_cv_tour_seen"); } catch { /* storage blocked */ }
    if (seen) return;
    const t = setTimeout(() => setShowTour(true), 1200);
    return () => clearTimeout(t);
  }, [hydrated]);

  // Track page breaks of the off-screen reference sheet (the same element the PDF is made from)
  useEffect(() => {
    const el = refEl.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const root = el.firstElementChild as HTMLElement | null;
        if (!root) return;
        const layout = measureLayout(root);
        const breaks = breaksOf(paginate(layout));
        const height = breaks.length ? Math.max(layout.height, layout.contentBottom + 40) : A4_H;
        setPages(prev => (prev.height === height && prev.breaks.join() === breaks.join() ? prev : { breaks, height }));
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const mo = new MutationObserver(measure);
    mo.observe(el, { subtree: true, childList: true, characterData: true, attributes: true });
    return () => { ro.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  // ATS mode downloads a text PDF laid out by jsPDF, so count its pages directly.
  const [atsPages, setAtsPages] = useState(1);
  useEffect(() => {
    if (!cv.atsMode) return;
    let alive = true;
    const t = setTimeout(() => { atsPdf(cv).then(pdf => alive && setAtsPages(pdf.getNumberOfPages())).catch(() => {}); }, 400);
    return () => { alive = false; clearTimeout(t); };
  }, [cv]);
  const pageCount = cv.atsMode ? atsPages : pages.breaks.length + 1;

  const [dlSending, setDlSending] = useState(false);
  const [dlError, setDlError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);

  // Auto-save on every change (only once the saved CV has been restored)
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(cv));
        setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } catch {
        setSavedAt(null);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [cv, hydrated]);

  const set = (field: keyof CVData, value: unknown) => {
    if (field === "layout" || field === "fontFamily" || field === "themeColor" || field === "spacing" || field === "atsMode") {
      setRendering(true);
      setTimeout(() => setRendering(false), 450);
    }
    setCv(p => ({ ...p, [field]: value }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("photo", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const generatePDF = async (filename: string): Promise<boolean> => {
    // ATS mode: real vector text, nothing to render
    if (cv.atsMode) {
      try {
        (await atsPdf(cv)).save(filename);
        return true;
      } catch (err) {
        console.error("PDF Generation Error:", err);
        return false;
      }
    }
    const holder = refEl.current;
    const root = holder?.firstElementChild as HTMLElement | null;
    if (!holder || !root) return false;

    // Bring the sheet into the viewport. CRITICAL: opacity must be > 0 (even 0.001)
    // because html2canvas skips truly invisible elements, producing a blank canvas.
    const savedStyle = holder.style.cssText;
    holder.style.cssText = `position:fixed;top:0;left:0;width:${A4_W}px;z-index:-9999;opacity:0.001;pointer-events:none;`;
    try {
      const pdf = await cvToPdf(root, { title: `${cv.name || "CV"} – CV` });
      // jsPDF's .save() uses an octet-stream download, which avoids Android Chrome routing
      // PDF blob URLs through the print spooler ("There was a problem printing the page").
      pdf.save(filename);
      return true;
    } catch (err) {
      console.error("PDF Generation Error:", err);
      return false;
    } finally {
      holder.style.cssText = savedStyle;
    }
  };

  /* ── Qualification + section helpers ── */
  const qual = qualOf(cv);
  const changeBody = (id: QualBodyId) => {
    const b = QUAL_BODIES[id];
    setCv(p => ({
      ...p,
      qualBody: id,
      icapStage: b.stages.includes(p.icapStage) ? p.icapStage : b.stages[0],
      papersPassed: [],
    }));
  };
  const togglePaper = (code: string) => {
    const cur = cv.papersPassed ?? [];
    set("papersPassed", cur.includes(code) ? cur.filter(c => c !== code) : [...cur, code]);
  };
  const order = sectionOrder(cv);
  const hidden = hiddenSections(cv);
  const moveSection = (i: number, dir: -1 | 1) => {
    const n = [...order];
    const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    set("sectionOrder", n);
  };
  const toggleSection = (s: SectionId) => set("hiddenSections", hidden.includes(s) ? hidden.filter(x => x !== s) : [...hidden, s]);

  const handlePrint = async () => {
    setDlSending(true);
    setDlError(null);
    // Yield so React can update button state before heavy canvas work
    await new Promise<void>(r => setTimeout(r, 100));
    const filename = `${cv.name ? cv.name.replace(/\s+/g, "_") : "My"}_CA_Hub_CV.pdf`;
    try {
      const ok = await generatePDF(filename);
      if (!ok) {
        setDlError("Could not generate PDF. Please try Chrome or Firefox on desktop.");
      }
    } catch {
      setDlError("Download failed. Please try again.");
    }
    setDlSending(false);
  };



  const setEdu = (i: number, field: keyof Education, val: string) => {
    const n = [...cv.education]; n[i] = { ...n[i], [field]: val }; set("education", n);
  };
  const setWork = (i: number, field: keyof WorkExp, val: string | string[]) => {
    const n = [...cv.workExp]; (n[i] as unknown as Record<string, unknown>)[field] = val; set("workExp", n);
  };
  const setCourse = (i: number, field: keyof Course, val: string) => {
    const n = [...cv.courses]; n[i] = { ...n[i], [field]: val }; set("courses", n);
  };

  /* ── Step renders ── */
  const renderStep = () => {
    switch (step) {
      /* ── Personal ── */
      case 0: return (
        <div className="space-y-4">
          <div>
            <FieldLabel required>Full Name</FieldLabel>
            <Inp value={cv.name} onChange={v => set("name", v)} placeholder="e.g. Ali Hassan Qureshi" />
          </div>
          <div>
            <FieldLabel>Profile Photo</FieldLabel>
            <label className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer text-sm" style={{ border: "2px dashed var(--border)", color: "var(--text-2)", background: cv.photo ? "color-mix(in srgb, var(--green) 5%, transparent)" : "transparent" }}>
              <span>{cv.photo ? "✓ Photo uploaded — tap to change" : "Tap to upload passport photo"}</span>
              {cv.photo && <img src={cv.photo} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />}
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
            <Hint>Optional. Face should be clearly visible. Professional attire recommended.</Hint>
          </div>
          <div>
            <FieldLabel required>Phone</FieldLabel>
            <Inp value={cv.phone} onChange={v => set("phone", v)} placeholder="+92 300 1234567" />
          </div>
          <div>
            <FieldLabel required>Email</FieldLabel>
            <Inp value={cv.email} onChange={v => set("email", v)} placeholder="your@email.com" type="email" />
          </div>
          <div>
            <FieldLabel>LinkedIn</FieldLabel>
            <Inp value={cv.linkedin} onChange={v => set("linkedin", v)} placeholder="linkedin.com/in/yourname" />
            <Hint>If you don&apos;t have one, skip it or create a LinkedIn profile first.</Hint>
          </div>
        </div>
      );

      /* ── CA Info ── */
      case 1: return (
        <div className="space-y-4">
          <div>
            <FieldLabel required>Professional Body</FieldLabel>
            <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Professional body">
              {QUAL_BODY_IDS.map(id => {
                const on = (cv.qualBody ?? "icap") === id;
                return (
                  <button key={id} type="button" role="radio" aria-checked={on} onClick={() => changeBody(id)}
                    className="text-xs font-bold px-2 py-2.5 rounded-xl transition-colors"
                    style={{ background: on ? "var(--green)" : "var(--bg-3)", color: on ? "#fff" : "var(--text-2)", border: "1px solid var(--border)", cursor: "pointer" }}>
                    {QUAL_BODIES[id].label}
                  </button>
                );
              })}
            </div>
            <Hint>{qual.full}</Hint>
          </div>
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>What shows on your CV header</p>
            <p>{qual.hasFts ? "Your stage + FTS number appear" : "Your stage appears"} under your name — e.g. <em>&quot;{qual.hasFts ? "CAF Qualified | FTS 42" : qual.stages[1] ?? qual.stages[0]}&quot;</em></p>
          </Tip>
          <div>
            <FieldLabel required>Your {qual.label} Stage</FieldLabel>
            <select value={cv.icapStage} onChange={e => set("icapStage", e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}>
              {!qual.stages.includes(cv.icapStage) && cv.icapStage && <option value={cv.icapStage}>{cv.icapStage}</option>}
              {qual.stages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {qual.id === "icap" && <Hint>Old scheme: choose AFC. New scheme: PRC → CAF → CFAP.</Hint>}
          </div>
          {qual.hasFts && (
            <div>
              <FieldLabel>FTS Number</FieldLabel>
              <Inp value={cv.fts} onChange={v => set("fts", v)} placeholder="e.g. 67" />
              <Hint>FTS = Firm Training Scheme. Check your ICAP registration letter. Skip if not yet assigned.</Hint>
            </div>
          )}
          <div>
            <FieldLabel>{qual.idLabel}</FieldLabel>
            <Inp value={cv.crn} onChange={v => set("crn", v)} placeholder={qual.idPlaceholder} />
            <Hint>{qual.idHint}</Hint>
          </div>
          <div>
            <FieldLabel>Papers Passed</FieldLabel>
            <div className="space-y-2.5">
              {qual.papers.map(g => (
                <div key={g.group}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-3)" }}>{g.group}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {g.items.map(pp => {
                      const on = (cv.papersPassed ?? []).includes(pp.code);
                      return (
                        <button key={pp.code} type="button" title={pp.name} aria-pressed={on} onClick={() => togglePaper(pp.code)}
                          className="text-[11px] px-2.5 py-1.5 rounded-full transition-colors"
                          style={{ background: on ? "var(--green)" : "var(--bg-3)", color: on ? "#fff" : "var(--text-2)", border: "1px solid var(--border)", cursor: "pointer" }}>
                          {on ? "✓ " : ""}{pp.code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <Hint>Tap each paper you have passed. Leave blank to show only the highlight below.</Hint>
          </div>
          <div>
            <FieldLabel>Exam Highlight</FieldLabel>
            <Inp value={cv.papersCleared} onChange={v => set("papersCleared", v)} placeholder={qual.papersPlaceholder} />
            <Hint>One line on your strongest result — first attempts, merits and distinctions get noticed.</Hint>
          </div>
        </div>
      );

      /* ── Education ── */
      case 2: return (
        <div className="space-y-4">
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>Add ALL your qualifications</p>
            <p>{qual.label} first, then latest schooling going upward — school, college, A-Levels, degree. Include everything.</p>
          </Tip>
          {cv.education.map((ed, i) => (
            <div key={i} className="rounded-2xl p-4 space-y-3" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
                  {i === 0 ? `1st — ${qual.label} Qualification (top)` : `Qualification ${i + 1}`}
                </span>
                <div className="flex items-center gap-1.5">
                  {i > 0 && <button onClick={() => { const cols = [...cv.education]; const temp = cols[i-1]; cols[i-1] = cols[i]; cols[i] = temp; set("education", cols); }} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"><ArrowUp className="w-3.5 h-3.5" /></button>}
                  {i < cv.education.length - 1 && <button onClick={() => { const cols = [...cv.education]; const temp = cols[i+1]; cols[i+1] = cols[i]; cols[i] = temp; set("education", cols); }} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"><ArrowDown className="w-3.5 h-3.5" /></button>}
                  {i >= 1 && <button onClick={() => set("education", cv.education.filter((_, j) => j !== i))} className="p-1.5 rounded-lg" style={{ color: "#F87171", background: "rgba(248,113,113,0.08)" }}><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
              </div>
              <div>
                <FieldLabel required={i === 0}>Level / Name</FieldLabel>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[...BASE_EDU_PRESETS, ...qual.eduPresets, "Other"].map(p => (
                    <button key={p} onClick={() => setEdu(i, "level", p === "Other" ? "" : p)}
                      className="text-xs px-2.5 py-1 rounded-full transition-colors"
                      style={{ background: ed.level === p ? "var(--green)" : "var(--bg-3)", color: ed.level === p ? "#fff" : "var(--text-2)", border: "1px solid var(--border)" }}>
                      {p}
                    </button>
                  ))}
                </div>
                <Inp value={ed.level} onChange={v => setEdu(i, "level", v)} placeholder="Or type a custom name..." />
              </div>
              <div>
                <FieldLabel>School / College / Board</FieldLabel>
                <Inp value={ed.institution} onChange={v => setEdu(i, "institution", v)} placeholder="e.g. Punjab College or Federal Board" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Grade / Mark</FieldLabel>
                  <Inp value={ed.grade} onChange={v => setEdu(i, "grade", v)} placeholder="87% or A or A+" />
                </div>
                <div>
                  <FieldLabel>Years</FieldLabel>
                  <Inp value={ed.years} onChange={v => setEdu(i, "years", v)} placeholder="2022 – 2024" />
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => set("education", [...cv.education, { level: "", institution: "", grade: "", years: "" }])}
            className="flex items-center gap-2 w-full justify-center font-semibold py-3 rounded-xl text-sm"
            style={{ border: "2px dashed var(--border)", color: "var(--text-2)" }}>
            <Plus className="w-4 h-4" /> Add Another Qualification
          </button>
        </div>
      );

      /* ── Profile ── */
      case 3: return (
        <div className="space-y-4">
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>Your profile in 3–4 sentences:</p>
            <p>• Who you are ({qual.label} stage)</p>
            <p>• What you&apos;re looking for (audit trainee / training firm)</p>
            <p>• 1 strong fact (e.g. first attempt, distinction, something impressive)</p>
            <p>• <strong>Never start with</strong>: &quot;I am passionate about...&quot; — be direct</p>
          </Tip>
          <div>
            <FieldLabel>Professional Profile</FieldLabel>
            <Txta value={cv.profile} onChange={v => set("profile", v)} rows={6}
              placeholder="CAF Qualified ICAP student seeking an audit trainee position. Cleared all 8 papers on first attempt..." />
            {(() => {
              const words = cv.profile.trim().split(/\s+/).filter(Boolean).length;
              const ok = words >= 50 && words <= 80;
              const color = words === 0 ? "var(--text-3)" : ok ? "var(--green)" : "#f59e0b";
              return (
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>Aim for 50–80 words. Recruiters read this first.</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: "var(--bg-3)", color }}>{words} words{ok ? " ✓" : ""}</span>
                </div>
              );
            })()}
          </div>
        </div>
      );


      /* ── Work Experience ── */
      case 4: return (
        <div className="space-y-4">
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>No experience? Still add something:</p>
            <p>• Family business assistant • Freelance tutoring • Internship (even unpaid)</p>
            <p>• Shop assistant • Online freelancing • Excel project for anyone</p>
            <p>Start each bullet with an action verb: <em>Prepared, Assisted, Developed, Managed...</em></p>
          </Tip>
          {cv.workExp.map((w, i) => (
            <div key={i} className="rounded-2xl p-4 space-y-3" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>Experience {i + 1}</span>
                <div className="flex items-center gap-1.5">
                  {i > 0 && <button onClick={() => { const w = [...cv.workExp]; const t = w[i-1]; w[i-1] = w[i]; w[i] = t; set("workExp", w); }} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"><ArrowUp className="w-3.5 h-3.5" /></button>}
                  {i < cv.workExp.length - 1 && <button onClick={() => { const w = [...cv.workExp]; const t = w[i+1]; w[i+1] = w[i]; w[i] = t; set("workExp", w); }} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"><ArrowDown className="w-3.5 h-3.5" /></button>}
                  {i > 0 && <button onClick={() => set("workExp", cv.workExp.filter((_, j) => j !== i))} className="p-1.5 rounded-lg" style={{ color: "#F87171", background: "rgba(248,113,113,0.08)" }}><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel required={i === 0}>Company / Place</FieldLabel><Inp value={w.company} onChange={v => setWork(i, "company", v)} placeholder="Company or &quot;Self-Employed&quot;" /></div>
                <div><FieldLabel>Period</FieldLabel><Inp value={w.period} onChange={v => setWork(i, "period", v)} placeholder="Jun 2023 – Dec 2023" /></div>
              </div>
              <div><FieldLabel>Your Role</FieldLabel><Inp value={w.role} onChange={v => setWork(i, "role", v)} placeholder="e.g. Accounts Intern, Private Tutor" /></div>
              <div>
                <FieldLabel>Bullet Points (what you did)</FieldLabel>
                <div className="space-y-2">
                  {w.bullets.map((b, j) => (
                    <div key={j} className="flex flex-col gap-1.5 w-full">
                      <div className="flex gap-2">
                        <Inp value={b} onChange={v => { const buls = w.bullets.map((x, k) => k === j ? v : x); setWork(i, "bullets", buls); }} 
                             onBlur={() => { const buls = w.bullets.map((x, k) => k === j ? formatBullet(x) : x); setWork(i, "bullets", buls); }}
                             placeholder="Prepared monthly bank reconciliations..." />
                        {w.bullets.length > 1 && <button onClick={() => setWork(i, "bullets", w.bullets.filter((_, k) => k !== j))} className="p-2 rounded-xl shrink-0" style={{ color: "#F87171", background: "rgba(248,113,113,0.08)" }}><Trash2 className="w-3.5 h-3.5" /></button>}
                      </div>
                      <AnimatePresence>
                        {getWeakVerbWarning(b) && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[10px] ml-2 font-bold tracking-wide" style={{ color: "#f59e0b" }}>
                            ⚠️ {getWeakVerbWarning(b)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                  <button onClick={() => setWork(i, "bullets", [...w.bullets, ""])} className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ color: "var(--green)", background: "color-mix(in srgb, var(--green) 8%, transparent)" }}><Plus className="w-3 h-3" /> Add bullet</button>
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: "var(--green)" }}><Sparkles className="w-3 h-3" /> Smart Suggestions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Reconciled bank statements", "Prepared financial drafts", "Vouched invoices", "Assisted in audit planning", "Managed client correspondence"].map(sg => (
                        <button key={sg} onClick={() => setWork(i, "bullets", w.bullets.filter(Boolean).concat(sg))} className="text-[11px] px-2.5 py-1 rounded-full transition-colors cursor-pointer" style={{ background: "color-mix(in srgb, var(--green) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 20%, transparent)", color: "var(--text-1)" }}>
                          + {sg}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => set("workExp", [...cv.workExp, { company: "", role: "", period: "", bullets: [""] }])}
            className="flex items-center gap-2 w-full justify-center font-semibold py-3 rounded-xl text-sm"
            style={{ border: "2px dashed var(--border)", color: "var(--text-2)" }}>
            <Plus className="w-4 h-4" /> Add Another Experience
          </button>
        </div>
      );

      /* ── Courses & Training ── */
      case 5: return (
        <div className="space-y-4">
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>{qual.courseTip.title}</p>
            {qual.courseTip.lines.map((l, k) => <p key={k}>{l}</p>)}
          </Tip>
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>Other courses worth adding:</p>
            <p>• <strong>Exam coaching classes</strong> – if you attended a full prep course at any institute, list it (name the course, not the institute)</p>
            <p>• <strong>MS Excel / Financial Modelling</strong> – CFI, Udemy, Coursera</p>
            <p>• <strong>QuickBooks / Xero / Sage</strong> – accounting software</p>
            <p>• <strong>AML Awareness</strong> – Anti-Money Laundering (free online, very relevant)</p>
            <p>• Any short course, workshop, or bootcamp — add it all</p>
          </Tip>
          {cv.courses.map((c, i) => (
            <div key={i} className="rounded-2xl p-4 space-y-3" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>Course {i + 1}</span>
                <div className="flex items-center gap-1.5">
                  {i > 0 && <button onClick={() => { const c = [...cv.courses]; const t = c[i-1]; c[i-1] = c[i]; c[i] = t; set("courses", c); }} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"><ArrowUp className="w-3.5 h-3.5" /></button>}
                  {i < cv.courses.length - 1 && <button onClick={() => { const c = [...cv.courses]; const t = c[i+1]; c[i+1] = c[i]; c[i] = t; set("courses", c); }} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"><ArrowDown className="w-3.5 h-3.5" /></button>}
                  {i > 0 && <button onClick={() => set("courses", cv.courses.filter((_, j) => j !== i))} className="p-1.5 rounded-lg" style={{ color: "#F87171", background: "rgba(248,113,113,0.08)" }}><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
              </div>
              <div>
                <FieldLabel>Course Name</FieldLabel>
                <Inp value={c.name} onChange={v => setCourse(i, "name", v)} placeholder="e.g. Presentation & Personal Effectiveness (PPE)" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel>Provider</FieldLabel><Inp value={c.provider} onChange={v => setCourse(i, "provider", v)} placeholder={`e.g. ${qual.label}`} /></div>
                <div><FieldLabel>Year</FieldLabel><Inp value={c.year} onChange={v => setCourse(i, "year", v)} placeholder="2024" /></div>
              </div>
            </div>
          ))}
          <button onClick={() => set("courses", [...cv.courses, { name: "", provider: "", year: "" }])}
            className="flex items-center gap-2 w-full justify-center font-semibold py-3 rounded-xl text-sm"
            style={{ border: "2px dashed var(--border)", color: "var(--text-2)" }}>
            <Plus className="w-4 h-4" /> Add Another Course
          </button>
        </div>
      );

      /* ── Skills ── */
      case 6: return (
        <div className="space-y-5">
          <div>
            <FieldLabel>IT &amp; Technical Skills</FieldLabel>
            <Hint>Software you actually use — be specific. Bad: &quot;Computer&quot;. Good: &quot;MS Excel (VLOOKUP, PivotTables)&quot;</Hint>
            <div className="mt-2"><ListEditor items={cv.expertise} onChange={v => set("expertise", v)} placeholder="e.g. MS Excel (Advanced)" /></div>
          </div>
          <div>
            <FieldLabel>Certifications</FieldLabel>
            <Hint>HOC completions, professional certifications, any credentialed course — list them here</Hint>
            <div className="mt-2"><ListEditor items={cv.certifications} onChange={v => set("certifications", v)} placeholder="e.g. PPE – ICAP Hands-On Course (Completed)" /></div>
          </div>
          <div>
            <FieldLabel>Soft Skills</FieldLabel>
            <Hint>Be honest — only list skills you can actually back up in an interview</Hint>
            <div className="mt-2"><ListEditor items={cv.skills} onChange={v => set("skills", v)} placeholder="e.g. Attention to Detail" /></div>
          </div>
          <div>
            <FieldLabel>Languages</FieldLabel>
            <div className="mt-2"><ListEditor items={cv.languages} onChange={v => set("languages", v)} placeholder="e.g. English (Fluent)" /></div>
          </div>
          <div>
            <FieldLabel>References</FieldLabel>
            <Inp value={cv.references} onChange={v => set("references", v)} placeholder="Available on request" />
            <Hint>Usually just &quot;Available on request&quot; — you&apos;ll share names later if asked</Hint>
          </div>
        </div>
      );

      /* ── Achievements ── */
      case 7: return (
        <div className="space-y-4">
          <Tip>
            <p className="font-bold mb-1.5" style={{ color: "var(--green)" }}>This section separates you from 100 other candidates:</p>
            <p>• First attempt or distinction in {qual.label} exams (huge deal)</p>
            <p>• Certificate of Merit / prize — school board or {qual.label}</p>
            <p>• Debates, sports, student council, model UN</p>
            <p>• Tutoring, community work, volunteer activities</p>
            <p>• Apps, websites, Excel tools you built</p>
            <p>• Scholarships or competitive exam results</p>
          </Tip>
          <div>
            <FieldLabel>Accomplishments &amp; Achievements</FieldLabel>
            <div className="mt-2"><ListEditor items={cv.accomplishments} onChange={v => set("accomplishments", v)} placeholder={qual.id === "icap" ? "e.g. Cleared all 8 CAF papers in first attempt" : "e.g. Passed FR and AA at first attempt with 70%+"} /></div>
          </div>
        </div>
      );

      /* ── Appearance ── */
      case 8: return (
        <div className="space-y-6">
            <p className="text-xs" style={{ color: "var(--text-2)" }}>Pick a clean layout and subtle accent colour. Your CV is scanned visually in the first 6 seconds.</p>

          {(!cv.workExp[0] || !cv.workExp[0].company) && cv.layout === "classic" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-4 mb-6 flex gap-3 text-sm border" style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.3)", color: "#d97706" }}>
              <span className="shrink-0 pt-0.5">💡</span>
              <div>
                <p className="font-bold mb-1">Junior Profile Detected</p>
                <p>We noticed you have no work experience yet. The &quot;Classic&quot; layout might leave a large empty gap on the right. We highly recommend a single-column layout — <b>Executive</b>, <b>Compact</b> or <b>Elegant</b> — for a perfectly balanced look!</p>
              </div>
            </motion.div>
          )}

          <div>
            <FieldLabel>CV Layout Template</FieldLabel>
            <div className="grid grid-cols-2 gap-3 mt-2" id="tour-layouts">
              {TEMPLATES.map(t => {
                const on = cv.layout === t.id;
                return (
                  <motion.button key={t.id}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => set("layout", t.id)}
                    aria-pressed={on}
                    className="px-4 py-3 rounded-xl text-sm transition-all text-left relative overflow-hidden"
                    style={{ background: on ? "color-mix(in srgb, var(--green) 8%, transparent)" : "var(--bg-3)", border: `1px solid ${on ? "var(--green)" : "var(--border)"}`, color: "var(--text-1)", cursor: "pointer", opacity: cv.atsMode ? 0.55 : 1 }}>
                    <div className="font-bold mb-1 flex justify-between items-center gap-1">
                      <span>{t.name}{t.isNew && <span className="ml-1.5 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: "var(--green)", color: "#fff" }}>New</span>}</span>
                      {on && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} />}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-3)" }}>{t.blurb}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: cv.atsMode ? "color-mix(in srgb, var(--green) 8%, transparent)" : "var(--bg-3)", border: `1px solid ${cv.atsMode ? "var(--green)" : "var(--border)"}` }}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={!!cv.atsMode} onChange={e => set("atsMode", e.target.checked)} className="mt-1 w-4 h-4 shrink-0" style={{ accentColor: "var(--green)" }} />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--text-1)" }}><ScanText className="w-4 h-4" style={{ color: "var(--green)" }} /> ATS-friendly mode</span>
                <span className="block text-xs mt-1" style={{ color: "var(--text-2)" }}>Plain single column, standard headings, no photo or graphics — and the PDF is real text that online application portals (Workday, Taleo, SuccessFactors) can read. Use it for online applications; use a designed template for email and walk-ins.</span>
              </span>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <FieldLabel>Section Order</FieldLabel>
              {(cv.sectionOrder || cv.hiddenSections) && (
                <button type="button" onClick={() => setCv(p => ({ ...p, sectionOrder: undefined, hiddenSections: undefined }))}
                  className="flex items-center gap-1 text-[11px] font-bold mb-1.5" style={{ color: "var(--green)", cursor: "pointer" }}>
                  <RotateCcw className="w-3 h-3" /> Template default
                </button>
              )}
            </div>
            <Hint>Move sections up or down and hide what you don&apos;t need. Two-column templates keep side-panel sections in their column.</Hint>
            <ul className="mt-2 space-y-1.5" id="tour-sections">
              {order.map((s, i) => {
                const off = hidden.includes(s);
                return (
                  <li key={s} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--bg)", border: "1px solid var(--border)", opacity: off ? 0.5 : 1 }}>
                    <span className="text-[10px] font-bold w-4 text-center" style={{ color: "var(--text-3)" }}>{i + 1}</span>
                    <span className="flex-1 text-sm" style={{ color: "var(--text-1)", textDecoration: off ? "line-through" : "none" }}>{SECTION_LABELS[s]}</span>
                    <button type="button" aria-label={`Move ${SECTION_LABELS[s]} up`} disabled={i === 0} onClick={() => moveSection(i, -1)} className="p-2 rounded-lg disabled:opacity-25" style={{ color: "var(--text-2)", cursor: "pointer" }}><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button type="button" aria-label={`Move ${SECTION_LABELS[s]} down`} disabled={i === order.length - 1} onClick={() => moveSection(i, 1)} className="p-2 rounded-lg disabled:opacity-25" style={{ color: "var(--text-2)", cursor: "pointer" }}><ArrowDown className="w-3.5 h-3.5" /></button>
                    <button type="button" aria-label={off ? `Show ${SECTION_LABELS[s]}` : `Hide ${SECTION_LABELS[s]}`} onClick={() => toggleSection(s)} className="p-2 rounded-lg" style={{ color: off ? "var(--text-3)" : "var(--green)", cursor: "pointer" }}>
                      {off ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <FieldLabel>Layout Spacing (Pinch-to-Fit)</FieldLabel>
            <Hint>Adjust this if your CV is spilling onto a second page or looks too empty.</Hint>
            <div className="flex rounded-xl p-1 mt-2" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }} id="tour-spacing">
              {["compact", "normal", "relaxed"].map(sp => (
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  key={sp} onClick={() => set("spacing", sp as CVData["spacing"])}
                  className="flex-1 py-2.5 text-sm font-bold capitalize rounded-lg transition-all"
                  style={{ background: (cv.spacing || "normal") === sp ? "var(--bg)" : "transparent", color: (cv.spacing || "normal") === sp ? "var(--green)" : "var(--text-3)", boxShadow: (cv.spacing || "normal") === sp ? "0 2px 8px rgba(0,0,0,0.05)" : "none", border: (cv.spacing || "normal") === sp ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
                  {sp}
                </motion.button>
              ))}
            </div>
          </div>

          
          <div>
            <FieldLabel>CV Font (ATS-Friendly)</FieldLabel>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { name: "Arial (Modern)", val: "'Arial','Helvetica Neue',sans-serif" },
                { name: "Garamond (Classic)", val: "'Garamond','EB Garamond',serif" },
                { name: "Georgia (Elegant)", val: "'Georgia',serif" },
                { name: "Trebuchet MS (Clean)", val: "'Trebuchet MS',sans-serif" },
              ].map(f => (
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  key={f.val} onClick={() => set("fontFamily", f.val)}
                  className="px-4 py-3 rounded-xl text-sm transition-all text-left flex items-center justify-between"
                  style={{ fontFamily: f.val, background: cv.fontFamily === f.val ? "color-mix(in srgb, var(--green) 8%, transparent)" : "var(--bg-3)", border: `1px solid ${cv.fontFamily === f.val ? "var(--green)" : "var(--border)"}`, color: "var(--text-1)", cursor: "pointer" }}>
                  <span>{f.name}</span>
                  {cv.fontFamily === f.val && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>Accent Color</FieldLabel>
            <Hint>Used for your name and section headings. Keep it dark and professional so it prints well.</Hint>
            <div className="flex flex-wrap gap-4 mt-3">
              {[
                { name: "Classic Black", hex: "#1a1a1a" },
                { name: "Navy Blue", hex: "#1e3a8a" },
                { name: "Forest Green", hex: "#064e3b" },
                { name: "Deep Charcoal", hex: "#334155" },
                { name: "Midnight Purple", hex: "#312e81" },
              ].map(c => (
                <motion.button 
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  key={c.hex} onClick={() => set("themeColor", c.hex)}
                  title={c.name}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer relative"
                  style={{ background: c.hex, border: cv.themeColor === c.hex ? "3px solid var(--green)" : "3px solid transparent" }}>
                  {cv.themeColor === c.hex && (
                    <motion.span layoutId="color-check" style={{ color: "#fff", fontSize: 14 }}>✓</motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  const deskScale = deskWidth ? Math.min(0.95, (deskWidth - 34) / A4_W) : 0.72;
  const mobScale = mobWidth ? Math.min(0.9, (mobWidth - 26) / A4_W) : 0.42;

  /* ══════════════════════════════════════
     RENDER
     ══════════════════════════════════════ */
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── Page header ── */}
      <div className="px-5 sm:px-8 md:px-16 pt-24 sm:pt-[110px] pb-8 sm:pb-12" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <CareerNav active="cv" />
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: "color-mix(in srgb, var(--green) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 30%, transparent)" }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--green)" }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk)" }}>Built for Big 4 Induction</span>
            </div>
            <h1 className="font-display font-bold mb-4 leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem,6vw,3.8rem)", color: "var(--text-1)" }}>
              Craft a CV that{" "}
              <span style={{ color: "var(--green)" }}>Partners cannot ignore.</span>
            </h1>
            <p className="text-sm sm:text-base mb-6" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.65 }}>
              Built for ICAP, ACCA, ICAI, CIMA, ICAEW and CMA students applying for articleship, audit trainee and Big 4 roles. Five templates, an ATS-friendly mode and a crisp, text-selectable PDF — no login, no cost. Your progress saves automatically on this device.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={startTour} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-2)", cursor: "pointer" }}>
                <Play className="w-4 h-4" /> Take the Tour
              </button>
              {cv.name !== "" && (
                <div className="inline-flex items-start gap-2 rounded-xl px-4 py-2.5 text-sm" style={{ background: "color-mix(in srgb, var(--green) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 20%, transparent)", color: "var(--text-2)" }}>
                  <span style={{ color: "var(--green)" }}><CheckCircle2 className="w-4 h-4 mt-0.5" /></span>
                  <span>The optimal workflow: Edit the loaded sample step by step.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 pb-28 lg:pb-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── FORM ── */}
          <div className="w-full lg:w-[460px] shrink-0" id="tour-form">
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>

              {/* Form top bar: step pills + Start Fresh */}
              <div className="flex items-center gap-2 px-2 pt-2 pb-0" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex gap-1 flex-1 overflow-x-auto pb-2 scroll-smooth no-scrollbar" id="tour-steps"
                  style={{
                    scrollbarWidth: "none" as const,
                    WebkitOverflowScrolling: "touch"
                  }}>
                  {STEPS.map((s, i) => (
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      key={s.id} onClick={() => setStep(i)}
                      className="shrink-0 text-[11px] font-bold px-3 py-2 rounded-xl whitespace-nowrap transition-all relative overflow-hidden"
                      style={{
                        minHeight: 36,
                        background: step === i ? "var(--green)" : i < step ? "color-mix(in srgb, var(--green) 10%, transparent)" : "transparent",
                        color: step === i ? "#fff" : i < step ? "var(--green)" : "var(--text-3)",
                        fontFamily: "var(--font-space-grotesk), sans-serif",
                      }}>
                      {i < step ? "✓" : `${i + 1}.`} {s.label}
                      {step === i && <motion.div layoutId="pill-glow" className="absolute inset-0 bg-white/10" />}
                    </motion.button>
                  ))}
                </div>
                <motion.button whileTap={{ scale: 0.95 }}
                  onClick={() => { if (cv.name !== "") { setCv(DEFAULT); localStorage.removeItem(LS_KEY); setRestored(false); } else { setCv(DEMO); } }}
                  title={cv.name !== "" ? "Clear and start fresh" : "Load sample CV"}
                  className="shrink-0 flex items-center gap-1 text-xs font-bold px-3 py-2 mb-2 rounded-xl whitespace-nowrap transition-all"
                  style={{ minHeight: 36, background: cv.name !== "" ? "rgba(248,113,113,0.1)" : "var(--bg-3)", color: cv.name !== "" ? "#f87171" : "var(--text-3)", border: "1px solid var(--border)", cursor: "pointer" }}>
                  <RefreshCw className="w-3 h-3" />
                </motion.button>
              </div>

              {/* Restored banner */}
              {restored && (
                <div className="mx-4 mt-3 mb-3 flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: "color-mix(in srgb, var(--green) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 20%, transparent)", color: "var(--green)" }}>
                  <span>✅ Restored your last session</span>
                  <button onClick={() => setRestored(false)} style={{ background: "none", border: "none", color: "var(--green)", cursor: "pointer" }}><X className="w-3 h-3" /></button>
                </div>
              )}

              {/* Progress bar */}
              <div style={{ height: 3, background: "var(--bg-3)" }}>
                <motion.div
                  style={{ height: "100%", background: "var(--green)", borderRadius: 2 }}
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>

              {/* Step content */}
              <div className="p-4 sm:p-5 overflow-y-auto" style={{ maxHeight: "calc(100svh - 340px)", minHeight: 240 }}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>{STEPS[step].label}</h3>
                  <div className="flex items-center gap-2">
                    {savedAt && <span className="text-[10px] font-semibold" style={{ color: "var(--text-3)" }} aria-live="polite">Saved {savedAt}</span>}
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: "var(--bg-3)", color: "var(--text-3)" }}>{step + 1}/{STEPS.length}</span>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18, ease: "easeOut" }}>
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center p-3 sm:p-4 gap-3" style={{ borderTop: "1px solid var(--border)" }}>
                <motion.button whileTap={{ scale: 0.96 }}
                  onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl disabled:opacity-30"
                  style={{ background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)", cursor: step === 0 ? "not-allowed" : "pointer", minHeight: 44 }}>
                  <ChevronLeft className="w-4 h-4" /> Back
                </motion.button>
                {step < STEPS.length - 1 ? (
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(s => s + 1)}
                    className="flex items-center gap-2 text-sm font-bold px-8 py-3 rounded-xl text-white"
                    style={{ background: "var(--green)", border: "none", cursor: "pointer", minHeight: 44 }}>
                    Next <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <div className="flex flex-col items-end gap-1.5">
                    <p className="text-xs font-semibold" style={{ color: "var(--green)" }}>🎉 Your CV is ready!</p>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={handlePrint}
                      className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl text-white"
                      style={{ background: "var(--green)", border: "none", cursor: "pointer", minHeight: 44 }}
                      id="tour-download">
                      <Download className="w-4 h-4" /> Download PDF
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── PREVIEW (desktop only, lg+) ── */}
          <div className="hidden lg:flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-3)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>Live Preview</p>
              <div className="flex items-center gap-2">
                <div id="tour-ats-target"><ATSScoreRing score={getCVScore(cv)} /></div>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={handlePrint}
                  id="tour-download-btn"
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl text-white"
                  style={{ background: "var(--green)", border: "none", cursor: "pointer" }}>
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </motion.button>
              </div>
            </div>
            {dlError && <p className="text-xs mb-2 px-3 py-2 rounded-lg" role="alert" style={{ background: "rgba(248,113,113,0.12)", color: "#F87171" }}>{dlError}</p>}
            <p className="text-xs mb-2" style={{ color: "var(--text-3)" }}>
              A4 · {pageCount} page{pageCount > 1 ? "s" : ""}{cv.atsMode ? " · ATS mode (text PDF)" : ""}
              {pageCount > 1 && " — red lines show where each new page starts. Try Compact spacing or the Compact template to fit one page."}
            </p>
            <div ref={deskRef} className="rounded-2xl overflow-hidden relative flex-1" style={{ background: "#e8e8e8", padding: "16px", border: "1px solid var(--border)" }}>
              <div className="flex justify-center">
                <AnimatePresence mode="wait">
                  {rendering ? (
                    <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="rounded shadow-xl bg-white" style={{ width: A4_W * deskScale, height: A4_H * deskScale }}>
                      <div className="p-10 space-y-4">
                        <div className="h-10 w-1/2 bg-gray-100 rounded animate-pulse mx-auto" />
                        <div className="h-4 w-2/3 bg-gray-50 rounded animate-pulse mx-auto" />
                        <div className="pt-20 space-y-6">
                          {[1,2,3,4,5].map(i => <div key={i} className="h-3 w-full bg-gray-50 rounded animate-pulse" />)}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="cv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      <ScaledPreview cv={cv} scale={deskScale} pages={pages} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── Inline live preview (mobile / tablet) ── */}
        <section className="lg:hidden mt-6" aria-label="Live CV preview">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-3)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>Live A4 Preview</p>
            <span className="text-xs" style={{ color: "var(--text-3)" }}>{pageCount} page{pageCount > 1 ? "s" : ""} · ATS {getCVScore(cv)}%</span>
          </div>
          <div ref={mobRef} className="rounded-2xl p-3 flex justify-center" style={{ background: "#e8e8e8", border: "1px solid var(--border)" }}>
            {mobWidth > 0 && <ScaledPreview cv={cv} scale={mobScale} pages={pages} />}
          </div>
        </section>
      </div>

      {/* ── Mobile Sticky Bottom Bar (lg and below) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", padding: "10px 16px", paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}>
        <div className="flex flex-col gap-2 max-w-lg mx-auto">
          {dlError && (
            <div className="text-xs text-center px-3 py-2 rounded-lg" style={{ background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
              {dlError}
            </div>
          )}
          <div className="flex items-center gap-3">
            {/* Preview button */}
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={openPreview}
              className="flex-1 flex items-center justify-center gap-2 font-bold rounded-xl py-3 text-sm"
              style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-2)", cursor: "pointer" }}>
              <Eye className="w-4 h-4" /> Preview CV
            </motion.button>
            {/* Download button */}
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={handlePrint}
              disabled={dlSending}
              id="tour-download-btn-mobile"
              className="flex items-center gap-2 font-bold rounded-xl py-3 px-6 text-sm text-white"
              style={{ background: "var(--green)", border: "none", cursor: dlSending ? "not-allowed" : "pointer", opacity: dlSending ? 0.7 : 1 }}>
              <Download className="w-4 h-4" /> {dlSending ? "Building..." : "PDF"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Mobile fullscreen preview modal ── */}
      {showPreview && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col" style={{ height: "100svh", background: "rgba(0,0,0,0.9)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border)" }}>
            <p className="text-sm font-bold" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>CV Live Preview</p>
            <div className="flex items-center gap-2">
              <motion.button whileTap={{ scale: 0.9 }} onClick={handlePrint} disabled={dlSending} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg text-white"
                style={{ background: "var(--green)", cursor: dlSending ? "not-allowed" : "pointer", opacity: dlSending ? 0.7 : 1 }}>
                <Download className="w-3.5 h-3.5" /> {dlSending ? "Saving..." : "Download"}
              </motion.button>
              <button onClick={() => setShowPreview(false)} className="p-2 rounded-lg"
                style={{ background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)", cursor: "pointer" }}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-auto p-3" style={{ background: "#cccccc" }}>
            <div className="flex justify-center min-h-full items-center">
              <AnimatePresence mode="wait">
                {rendering ? (
                  <motion.div key="skeleton-mob" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="bg-white rounded shadow-2xl" style={{ width: A4_W * mobileScale, height: A4_H * mobileScale }}>
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse mx-auto" />
                      <div className="h-10 w-full bg-gray-50 rounded" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="cv-mob" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ScaledPreview cv={cv} scale={mobileScale} pages={pages} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-center text-xs mt-3 pb-4" style={{ color: "#666" }}>
              Pinch to zoom · This is exactly how your PDF will look
            </p>
          </div>
        </div>
      )}

      {/* Email Modal removed for direct download */}

      {/* ── Custom Tour ── */}
      {showTour && (
        <CVTour onDone={() => {
          localStorage.setItem("cahub_cv_tour_seen", "true");
          setShowTour(false);
        }} />
      )}
      {/* ── Hidden Reference for PDF Generation ── */}
      {/* Must stay laid out off-screen (not display:none / opacity:0) so it can be measured
          for page breaks and captured by html2canvas. Natural height = multi-page safe. */}
      <div
        ref={refEl}
        aria-hidden="true"
        style={{ position: "absolute", left: -9999, top: 0, width: A4_W, pointerEvents: "none", zIndex: -1 }}
      >
        <CVPreview cv={cv} />
      </div>
    </div>
  );
}

const noopSubscribe = () => () => {};

/**
 * Server + first client render use the sample CV; right after hydration we remount once with the
 * CV saved in localStorage. Avoids a hydration mismatch for returning users.
 */
export default function CVMaker() {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return <CVMakerInner key={hydrated ? "client" : "server"} hydrated={hydrated} />;
}
