"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Download, Eye, ChevronLeft, ChevronRight, X, Mail, RefreshCw, ArrowUp, ArrowDown, Palette, Type, LayoutTemplate, Sparkles, CheckCircle2, Play, FileDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { CVTour } from "./CVTour";


const LS_KEY = "cahub_cv_v1";

/* ── Types ─────────────────────────────────────────── */
interface WorkExp { company: string; role: string; period: string; bullets: string[]; }
interface Education { level: string; institution: string; grade: string; years: string; }
interface Course { name: string; provider: string; year: string; }
interface CVData {
  themeColor: string;
  fontFamily: string;
  layout: "classic" | "executive";
  spacing?: "compact" | "normal" | "relaxed";
  name: string; phone: string; email: string; linkedin: string; photo: string;
  icapStage: string; crn: string; fts: string; papersCleared: string;
  profile: string;
  education: Education[];
  workExp: WorkExp[];
  courses: Course[];
  expertise: string[]; certifications: string[]; skills: string[]; languages: string[];
  accomplishments: string[];
  references: string;
}

/* ── DEMO DATA (generic fictional student) ── */
const DEMO: CVData = {
  themeColor: "#1a1a1a",
  fontFamily: "'Arial','Helvetica Neue',sans-serif",
  layout: "classic",
  spacing: "normal",
  name: "Ali Hassan Qureshi",
  phone: "+92 321 5556677",
  email: "ali.hassan@email.com",
  linkedin: "linkedin.com/in/alihassanqureshi",
  photo: "",
  icapStage: "CAF Qualified",
  crn: "182743",
  fts: "67",
  papersCleared: "All 8 CAF Papers | First Attempt",
  profile:
    "CAF Qualified ICAP student seeking an audit trainee position at a Big-4 or mid-tier firm. Cleared all eight CAF papers on first attempt and earned 80%+ in four papers including Financial Reporting and Audit. Equipped with solid grounding in IFRS, ISAs, and corporate taxation. Eager to translate academic knowledge into practical client-facing work under structured articleship.",
  education: [
    { level: "CAF | ICAP", institution: "ICAP", grade: "All 8 Papers | First Attempt | 80%+ in FR & Audit", years: "2022 – 2024" },
    { level: "Inter (HSSC) – Pre-Engineering", institution: "Punjab College, Lahore", grade: "Grade: A | 85%", years: "2020 – 2022" },
    { level: "Matric (SSC)", institution: "City Grammar School, Lahore", grade: "Grade: A+ | 92%", years: "2018 – 2020" },
  ],
  workExp: [
    {
      company: "Siddiqui & Sons (Family Business)",
      role: "Accounts & Finance Intern",
      period: "Apr 2023 – Oct 2023",
      bullets: [
        "Maintained double-entry books, reconciled monthly bank statements for Rs. 3M+ turnover",
        "Prepared tax invoices and assisted in quarterly GST filing on FBR IRIS portal",
        "Developed Excel dashboards for weekly sales tracking, reducing reporting time by 40%",
      ],
    },
    {
      company: "Self-Employed",
      role: "Private Tutor – Accounts & Economics",
      period: "2021 – 2023",
      bullets: [
        "Tutored 12 O-Level and Matric students, maintaining 100% pass rate",
        "2 students scored distinctions in Edexcel O-Level Accounts (Grade A*)",
      ],
    },
  ],
  courses: [
    { name: "Presentation & Personal Effectiveness (PPE)", provider: "ICAP – Hands-On Course", year: "2024" },
    { name: "MS Office for Business", provider: "ICAP – Hands-On Course", year: "2024" },
    { name: "Data Analytics & FinTech", provider: "ICAP – Hands-On Course", year: "2024" },
    { name: "Advanced MS Excel & Financial Modelling", provider: "CFI (Online)", year: "2023" },
  ],
  expertise: ["MS Excel (Advanced)", "QuickBooks Desktop", "FBR IRIS Portal", "Financial Modelling", "SAP (Basic)"],
  certifications: ["PPE – ICAP Hands-On Course (Completed)", "MS Office for Business – ICAP HOC (Completed)"],
  skills: ["Analytical Thinking", "Attention to Detail", "Team Collaboration", "Problem-Solving", "Time Management", "Business Communication"],
  languages: ["English (Fluent)", "Urdu (Native)", "Punjabi (Conversational)"],
  accomplishments: [
    "Cleared all 8 CAF papers in first attempt – top 15% nationally in Financial Reporting",
    "Certificate of Merit – Board of Intermediate Education, Lahore (2022)",
    "1st Place, Inter-School Business Plan Competition, Punjab College (2021)",
    "Student Council Secretary, City Grammar School (2019 – 2020)",
    "Volunteer, Edhi Foundation – monthly food distribution drive (2021 – present)",
  ],
  references: "Available on request",
};

const DEFAULT: CVData = {
  themeColor: "#1a1a1a",
  fontFamily: "'Arial','Helvetica Neue',sans-serif",
  layout: "classic",
  spacing: "normal",
  name: "", phone: "", email: "", linkedin: "", photo: "",
  icapStage: "CAF Qualified", crn: "", fts: "", papersCleared: "",
  profile: "",
  education: [
    { level: "CAF | ICAP", institution: "ICAP", grade: "", years: "" },
    { level: "", institution: "", grade: "", years: "" },
  ],
  workExp: [{ company: "", role: "", period: "", bullets: [""] }],
  courses: [{ name: "", provider: "", year: "" }],
  expertise: [""], certifications: [""], skills: ["Attention to Detail", "Adaptability", "Team Collaboration"],
  languages: ["English", "Urdu"],
  accomplishments: [""],
  references: "Available on request",
};

const ICAP_STAGES = [
  "PRC Student", "PRC Qualified",
  "AFC Student (Old Scheme)", "AFC Qualified (Old Scheme)",
  "CAF Student", "CAF Student (Result Awaited)", "CAF Qualified",
  "CFAP Student", "CFAP Student (Result Awaited)", "CFAP Qualified",
  "ACA – Qualified Chartered Accountant",
];
const EDU_PRESETS = ["Matric (SSC)", "Inter (HSSC)", "O-Levels", "A-Levels", "Bachelor's", "Master's", "CAF | ICAP", "CFAP | ICAP", "AFC | ICAP (Old Scheme)", "Other"];
const STEPS = [
  { id: "personal", label: "Personal" },
  { id: "ca", label: "CA Info" },
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
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onChange([...items, ""])} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl" style={{ color: "var(--green)", background: "rgba(61,179,113,0.08)", border: "1px solid rgba(61,179,113,0.15)", cursor: "pointer" }}>
        <Plus className="w-4 h-4" /> Add
      </motion.button>
    </div>
  );
}

/* ══════════════════════════════════════
   CV PREVIEW  — full A4, fills the page
   ══════════════════════════════════════ */

// Sizes in px — these render inside a 794px-wide (210mm) container.
// At 96 dpi: 1mm ≈ 3.78px, so 10px ≈ 2.6mm ≈ 7.5pt.
// We target proper readable print sizes (~9-11pt body).
const SZ = {
  name: 30,
  stage: 11.5,
  contact: 10,
  sectionR: 11,   // right-col section headings
  sectionL: 10,   // left-col section headings
  entryHead: 11,  // company / qualification bold title
  subHead: 10,    // role / institution line
  body: 10,       // bullet text
  small: 9.5,     // labels, dates
  tag: 9,         // skill tags
};

const GAP = {
  section: "var(--gap-section)",   // between sections
  entry: "var(--gap-entry)",       // between entries within a section
  bullet: "var(--gap-bullet)",     // between bullet lines
  line: 2,                         // between label lines
};

const getGaps = (s?: "compact" | "normal" | "relaxed") => {
  if (s === "compact") return { section: 12, entry: 10, bullet: 2 };
  if (s === "relaxed") return { section: 22, entry: 18, bullet: 6 };
  return { section: 16, entry: 13, bullet: 4 }; // normal
};

function SectionHead({ title, side = "right" }: { title: string; side?: "left" | "right" }) {
  const isRight = side === "right";
  return (
    <div style={{
      fontFamily: "'Arial Black','Arial',sans-serif",
      fontWeight: 900,
      fontSize: isRight ? SZ.sectionR : SZ.sectionL,
      letterSpacing: isRight ? 1.8 : 1.5,
      textTransform: "uppercase" as const,
      paddingBottom: 4,
      marginBottom: 8,
      borderBottom: isRight ? "2.5px solid var(--cv-accent)" : "1.5px solid var(--cv-accent)",
      color: "var(--cv-accent)",
    }}>
      {title}
    </div>
  );
}

/* ── Bullet row helper ── */
function Bullet({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", gap: 7, marginBottom: GAP.bullet }}>
      <span style={{ fontSize: SZ.body, color: "#444", flexShrink: 0, marginTop: 1 }}>•</span>
      <span style={{ fontSize: SZ.body, lineHeight: 1.55, color: "#222" }}>{text}</span>
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

function CVPreview({ cv }: { cv: CVData }) {
  const gaps = getGaps(cv.spacing);

  if (cv.layout === "executive") {
    return (
      <div id="cv-preview" style={{ fontFamily: cv.fontFamily, background: "#fff", color: "#1a1a1a", "--cv-accent": cv.themeColor, "--gap-section": `${gaps.section}px`, "--gap-entry": `${gaps.entry}px`, "--gap-bullet": `${gaps.bullet}px` } as React.CSSProperties} className="w-[210mm] min-h-[297mm] p-[15mm_18mm] box-border mx-auto relative text-[10px]">
        {/* Name & Contact */}
        <div className="text-center mb-5">
          <h1 style={{ fontSize: 26, fontFamily: "'Arial Black','Arial',sans-serif", color: "var(--cv-accent)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>{cv.name}</h1>
          <div style={{ fontSize: SZ.small, color: "#333", display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
            {cv.phone && <span>{cv.phone}</span>}
            {cv.phone && cv.email && <span>|</span>}
            {cv.email && <span>{cv.email}</span>}
            {cv.linkedin && <><span>|</span><span>{cv.linkedin}</span></>}
          </div>
          {(cv.icapStage || cv.papersCleared) && (
            <div style={{ fontStyle: "italic", color: "#444" }}>
              {cv.icapStage} {cv.crn && `(CRN: ${cv.crn})`} {cv.fts && `| FTS: ${cv.fts}`} {cv.papersCleared && `— ${cv.papersCleared}`}
            </div>
          )}
          <div style={{ borderBottom: "1.5px solid var(--cv-accent)", marginTop: 8 }} />
        </div>

        {/* Profile */}
        {cv.profile && (
          <div className="mb-4">
            <SectionHead title="Professional Profile" side="left" />
            <p style={{ fontSize: SZ.body, lineHeight: 1.6, color: "#222", textAlign: "justify" }}>{cv.profile}</p>
          </div>
        )}

        {/* Work Exp */}
        {cv.workExp.some(w => w.company) && (
          <div className="mb-4">
            <SectionHead title="Professional Experience" side="left" />
            {cv.workExp.filter(w => w.company).map((w, i) => (
              <div key={i} className="mb-3">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: SZ.entryHead, fontWeight: 700 }}>{w.company}</span>
                  <span style={{ fontSize: SZ.small, color: "#555", fontStyle: "italic" }}>{w.period}</span>
                </div>
                {w.role && <p style={{ fontSize: SZ.subHead, fontStyle: "italic", marginBottom: 3, color: "#444" }}>{w.role}</p>}
                {w.bullets.filter(Boolean).map((b, j) => <Bullet key={j} text={b} />)}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {cv.education.filter(e => e.level || e.institution).length > 0 && (
          <div className="mb-4">
            <SectionHead title="Education & Qualifications" side="left" />
            {cv.education.filter(e => e.level || e.institution).map((ed, i) => (
              <div key={i} className="mb-2">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: SZ.entryHead, fontWeight: 700 }}>{ed.level} {ed.institution && <span style={{fontWeight: 400}}>— {ed.institution}</span>}</span>
                  <span style={{ fontSize: SZ.small, color: "#555", fontStyle: "italic" }}>{ed.years}</span>
                </div>
                {ed.grade && <p style={{ fontSize: SZ.body, color: "#333", marginTop: 1 }}>{ed.grade}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Courses Grid */}
        <div style={{ display: "flex", gap: "20px" }}>
          {cv.courses.filter(c => c.name).length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionHead title="Courses & Training" side="left" />
              {cv.courses.filter(c => c.name).map((c, i) => (
                <div key={i} className="mb-1.5">
                  <span style={{ fontWeight: 700, fontSize: SZ.subHead }}>{c.name}</span>
                  {c.provider && <span style={{ fontSize: SZ.small, color: "#555" }}> — {c.provider}</span>}
                </div>
              ))}
            </div>
          )}
          {(cv.expertise.length > 0 || cv.skills.length > 0) && (
            <div style={{ flex: 1 }}>
              <SectionHead title="Skills & Expertise" side="left" />
              {cv.expertise.filter(Boolean).length > 0 && (
                <div className="mb-1"><strong>Technical:</strong> {cv.expertise.filter(Boolean).join(", ")}</div>
              )}
              {cv.skills.filter(Boolean).length > 0 && (
                <div><strong>Soft Skills:</strong> {cv.skills.filter(Boolean).join(", ")}</div>
              )}
            </div>
          )}
        </div>

        {/* Achievements */}
        {cv.accomplishments.filter(Boolean).length > 0 && (
          <div className="mt-4">
            <SectionHead title={cv.workExp.some(w => w.company) ? "Accomplishments" : "Projects & Extracurriculars"} side="left" />
            {cv.accomplishments.filter(Boolean).map((a, i) => (
              <div key={i} className="mb-1"><Bullet text={a} /></div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      id="cv-preview"
      style={{
        fontFamily: cv.fontFamily,
        background: "#ffffff",
        color: "#1a1a1a",
        "--cv-accent": cv.themeColor,
        "--gap-section": `${gaps.section}px`,
        "--gap-entry": `${gaps.entry}px`,
        "--gap-bullet": `${gaps.bullet}px`,
        width: "210mm",
        minHeight: "297mm",
        padding: "13mm 15mm 12mm 15mm",
        boxSizing: "border-box",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
      } as React.CSSProperties}
    >
      {/* ═══ HEADER ═══ */}
      <div style={{ paddingBottom: 12, marginBottom: 13, borderBottom: "3px solid var(--cv-accent)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
          {cv.photo && (
            <img src={cv.photo} alt="" style={{ width: 84, height: 84, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0, border: "2px solid #ccc" }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Arial Black','Arial',sans-serif", fontSize: SZ.name, fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: 2.5, lineHeight: 1.1, marginBottom: 5, wordBreak: "break-word" as const }}>
              {cv.name || "YOUR FULL NAME"}
            </div>
            <div style={{ fontSize: SZ.stage, fontWeight: 400, color: "#444", letterSpacing: 2.5, textTransform: "uppercase" as const, marginBottom: 8 }}>
              {cv.icapStage}{cv.fts ? ` | FTS ${cv.fts}` : ""}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "4px 20px" }}>
              {cv.phone && <span style={{ fontSize: SZ.contact, color: "#333" }}>Tel: {cv.phone}</span>}
              {cv.email && <span style={{ fontSize: SZ.contact, color: "#333" }}>Email: {cv.email}</span>}
              {cv.linkedin && <span style={{ fontSize: SZ.contact, color: "#333" }}>LinkedIn: {cv.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ PROFILE — full width ═══ */}
      {cv.profile && (
        <div style={{ marginBottom: GAP.section }}>
          <SectionHead title="Professional Profile" side="right" />
          <p style={{ fontSize: SZ.body, lineHeight: 1.65, color: "#222", textAlign: "justify" as const }}>{cv.profile}</p>
        </div>
      )}

      {/* ═══ TWO COLUMNS ═══ */}
      <div style={{ display: "flex", gap: 18, flex: 1 }}>

        {/* ── LEFT SIDEBAR – 34% ── */}
        <div style={{ width: "34%", flexShrink: 0 }}>

          {/* ICAP ID */}
          {(cv.crn || cv.papersCleared) && (
            <div style={{ marginBottom: GAP.section, padding: "8px 10px", background: "#f4f4f4", borderLeft: "3.5px solid #1a1a1a" }}>
              {cv.crn && <p style={{ fontSize: SZ.subHead, fontWeight: 700, marginBottom: 3 }}>CRN: {cv.crn}</p>}
              {cv.papersCleared && <p style={{ fontSize: SZ.body, color: "#333", lineHeight: 1.5 }}>{cv.papersCleared}</p>}
            </div>
          )}

          {/* CERTIFICATIONS */}
          {cv.certifications.filter(Boolean).length > 0 && (
            <div style={{ marginBottom: GAP.section }}>
              <SectionHead title="Certifications" side="left" />
              {cv.certifications.filter(Boolean).map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 7 }}>
                  <span style={{ fontSize: SZ.body, color: "#333", flexShrink: 0, marginTop: 1 }}>■</span>
                  <span style={{ fontSize: SZ.body, lineHeight: 1.5, color: "#222" }}>{c}</span>
                </div>
              ))}
            </div>
          )}

          {/* IT & TECHNICAL */}
          {cv.expertise.filter(Boolean).length > 0 && (
            <div style={{ marginBottom: GAP.section }}>
              <SectionHead title="IT & Technical" side="left" />
              {cv.expertise.filter(Boolean).map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: SZ.body, color: "#555", flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: SZ.body, color: "#222", lineHeight: 1.5 }}>{e}</span>
                </div>
              ))}
            </div>
          )}

          {/* SOFT SKILLS */}
          {cv.skills.filter(Boolean).length > 0 && (
            <div style={{ marginBottom: GAP.section }}>
              <SectionHead title="Core Skills" side="left" />
              {cv.skills.filter(Boolean).map((sk, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: SZ.body, color: "#555", flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: SZ.body, color: "#222", lineHeight: 1.5 }}>{sk}</span>
                </div>
              ))}
            </div>
          )}

          {/* LANGUAGES */}
          {cv.languages.filter(Boolean).length > 0 && (
            <div style={{ marginBottom: GAP.section }}>
              <SectionHead title="Languages" side="left" />
              {cv.languages.filter(Boolean).map((l, i) => (
                <p key={i} style={{ fontSize: SZ.body, color: "#222", marginBottom: 5, lineHeight: 1.4 }}>{l}</p>
              ))}
            </div>
          )}

          {/* REFERENCES */}
          {cv.references && (
            <div>
              <SectionHead title="References" side="left" />
              <p style={{ fontSize: SZ.body, color: "#555", fontStyle: "italic", lineHeight: 1.5 }}>{cv.references}</p>
            </div>
          )}
        </div>

        {/* ── RIGHT MAIN COLUMN ── */}
        <div style={{ flex: 1 }}>

          {/* EDUCATION */}
          {cv.education.filter(e => e.level || e.institution).length > 0 && (
            <div style={{ marginBottom: GAP.section }}>
              <SectionHead title="Education" side="right" />
              {cv.education.filter(e => e.level || e.institution).map((ed, i) => (
                <div key={i} style={{ marginBottom: GAP.entry }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" as const, gap: "2px 8px", marginBottom: 2 }}>
                    <span style={{ fontSize: SZ.entryHead, fontWeight: 700 }}>{ed.level}</span>
                    {ed.years && <span style={{ fontSize: SZ.small, color: "#555", fontStyle: "italic" as const, whiteSpace: "nowrap" as const }}>{ed.years}</span>}
                  </div>
                  {ed.institution && <p style={{ fontSize: SZ.subHead, color: "#444", marginBottom: 3 }}>{ed.institution}</p>}
                  {ed.grade && <Bullet text={ed.grade} />}
                </div>
              ))}
            </div>
          )}

          {/* WORK EXPERIENCE */}
          {cv.workExp.some(w => w.company) && (
            <div style={{ marginBottom: GAP.section }}>
              <SectionHead title="Work Experience" side="right" />
              {cv.workExp.filter(w => w.company).map((w, i) => (
                <div key={i} style={{ marginBottom: GAP.entry }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" as const, gap: "2px 8px", marginBottom: 2 }}>
                    <span style={{ fontSize: SZ.entryHead, fontWeight: 700 }}>{w.company}</span>
                    <span style={{ fontSize: SZ.small, color: "#555", fontStyle: "italic" as const }}>{w.period}</span>
                  </div>
                  {w.role && <p style={{ fontSize: SZ.subHead, color: "#444", marginBottom: 5 }}>{w.role}</p>}
                  {w.bullets.filter(Boolean).map((b, j) => <Bullet key={j} text={b} />)}
                </div>
              ))}
            </div>
          )}

          {/* COURSES & TRAINING */}
          {cv.courses.filter(c => c.name).length > 0 && (
            <div style={{ marginBottom: GAP.section }}>
              <SectionHead title="Courses & Training" side="right" />
              {cv.courses.filter(c => c.name).map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, flexWrap: "wrap" as const, gap: "2px 8px" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: SZ.subHead, fontWeight: 700, color: "#1a1a1a" }}>{c.name}</span>
                    {c.provider && <span style={{ fontSize: SZ.small, color: "#555" }}>{" — "}{c.provider}</span>}
                  </div>
                  {c.year && <span style={{ fontSize: SZ.small, color: "#777", fontStyle: "italic" as const, whiteSpace: "nowrap" as const }}>{c.year}</span>}
                </div>
              ))}
            </div>
          )}

          {/* ACCOMPLISHMENTS */}
          {cv.accomplishments.filter(Boolean).length > 0 && (
            <div>
              <SectionHead title="Accomplishments & Achievements" side="right" />
              {cv.accomplishments.filter(Boolean).map((a, i) => (
                <div key={i} style={{ marginBottom: 7 }}>
                  <Bullet text={a} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Scaled preview (zero phantom whitespace below) ── */
function ScaledPreview({ cv, scale }: { cv: CVData; scale: number }) {
  const A4_W = 794;
  const A4_H = 1123;
  return (
    <div style={{ width: A4_W * scale, height: A4_H * scale, overflow: "hidden", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 0, left: 0, transformOrigin: "top left", transform: `scale(${scale})`, width: A4_W, height: A4_H }}>
        <CVPreview cv={cv} />
      </div>
    </div>
  );
}


/* ══════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════ */
export default function CVMaker() {
  const [cv, setCv] = useState<CVData>(() => {
    if (typeof window === "undefined") return DEMO;
    try { const s = localStorage.getItem(LS_KEY); return s ? { ...DEMO, ...JSON.parse(s) } : DEMO; } catch { return DEMO; }
  });
  const [step, setStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [restored, setRestored] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(LS_KEY);
  });
  const [mobileScale, setMobileScale] = useState(0.42);
  const [showTour, setShowTour] = useState(false);

  const startTour = () => setShowTour(true);

  useEffect(() => {
    if (showPreview && typeof window !== "undefined") {
      setMobileScale(Math.min(0.42, (window.innerWidth - 32) / 794));
    }
  }, [showPreview, setMobileScale]);


  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("cahub_cv_tour_seen")) {
      setTimeout(() => setShowTour(true), 1200);
    }
  }, []);



  const [dlSending, setDlSending] = useState(false);
  const [dlError, setDlError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);

  // Auto-save on every change
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(LS_KEY, JSON.stringify(cv)); } catch {}
    }, 500);
    return () => clearTimeout(t);
  }, [cv]);

  const set = (field: keyof CVData, value: unknown) => {
    if (field === "layout" || field === "fontFamily" || field === "themeColor" || field === "spacing") {
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
    const refEl = document.getElementById("cv-pdf-reference");
    if (!refEl) return false;

    // Bring element into viewport. CRITICAL: opacity must be > 0 (even 0.001)
    // because html2canvas skips truly invisible elements, producing a blank
    // canvas that causes the "problem printing a page" error in PDF viewers.
    const savedStyle = refEl.style.cssText;
    refEl.style.cssText =
      "position:fixed;top:0;left:0;width:794px;height:1123px;z-index:-9999;opacity:0.001;pointer-events:none;overflow:hidden;";

    try {
      // Give browser 3 frames to fully paint the repositioned element
      await new Promise<void>(r =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            requestAnimationFrame(() => r())
          )
        )
      );

      // Resolve CSS custom properties (var(--cv-accent) etc.) at paint time
      // so html2canvas sees real colour values, not unresolved variable names.
      const resolveVars = (el: HTMLElement) => {
        const props = [
          "--cv-accent",
          "--gap-section",
          "--gap-entry",
          "--gap-bullet",
        ] as const;
        props.forEach(p => {
          const val = getComputedStyle(el).getPropertyValue(p).trim();
          if (val) el.style.setProperty(p, val);
        });
      };

      const canvas = await html2canvas(refEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        x: 0,
        y: 0,
        onclone: (_doc: Document, clonedEl: HTMLElement) => {
          // Resolve CSS vars on the cloned element so html2canvas can read them
          resolveVars(clonedEl);
          clonedEl.querySelectorAll<HTMLElement>("*").forEach(resolveVars);
          // Force white background and full opacity so canvas is never blank
          clonedEl.style.background = "#ffffff";
          clonedEl.style.opacity = "1";
        },
      });

      refEl.style.cssText = savedStyle;

      // Verify canvas has actual content (not blank due to render failure)
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const px = ctx.getImageData(50, 50, 1, 1).data;
        if (px[3] === 0) {
          console.warn("PDF canvas appears blank — aborting");
          return false;
        }
      }

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      pdf.addImage(imgData, "JPEG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

      // ── Download strategy ──────────────────────────────────────────────
      // Android Chrome intercepts any programmatic click on a PDF blob URL
      // and routes it through the OS print spooler, which shows "There was
      // a problem printing the page."  jsPDF's .save() uses a proper
      // application/octet-stream trick that bypasses the print flow and
      // triggers a true file download on all platforms including Android.
      // ──────────────────────────────────────────────────────────────────
      pdf.save(filename);
      return true;
    } catch (err) {
      refEl.style.cssText = savedStyle;
      console.error("PDF Generation Error:", err);
      return false;
    }
  };

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
            <label className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer text-sm" style={{ border: "2px dashed var(--border)", color: "var(--text-2)", background: cv.photo ? "rgba(61,179,113,0.05)" : "transparent" }}>
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
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>What shows on your CV header</p>
            <p>Your ICAP stage + FTS number appear under your name — e.g. <em>&quot;CAF Qualified | FTS 42&quot;</em></p>
          </Tip>
          <div>
            <FieldLabel required>Your ICAP Stage</FieldLabel>
            <select value={cv.icapStage} onChange={e => set("icapStage", e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}>
              {ICAP_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Hint>Old scheme: choose AFC. New scheme: PRC → CAF → CFAP.</Hint>
          </div>
          <div>
            <FieldLabel>FTS Number</FieldLabel>
            <Inp value={cv.fts} onChange={v => set("fts", v)} placeholder="e.g. 67" />
            <Hint>FTS = Firm Training Scheme. Check your ICAP registration letter. Skip if not yet assigned.</Hint>
          </div>
          <div>
            <FieldLabel>CRN (Registration No.)</FieldLabel>
            <Inp value={cv.crn} onChange={v => set("crn", v)} placeholder="e.g. 182743" />
            <Hint>Your 6-digit ICAP student number. On your exam admit card or student portal.</Hint>
          </div>
          <div>
            <FieldLabel>Papers / Exams Cleared</FieldLabel>
            <Inp value={cv.papersCleared} onChange={v => set("papersCleared", v)} placeholder="All 8 CAF Papers | First Attempt" />
            <Hint>Appears under your CRN. Highlight any strong performance here — firms love this.</Hint>
          </div>
        </div>
      );

      /* ── Education ── */
      case 2: return (
        <div className="space-y-4">
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>Add ALL your qualifications</p>
            <p>ICAP first, then latest schooling going upward. Matric, Inter, O-Levels, A-Levels, Bachelor&apos;s — include everything.</p>
          </Tip>
          {cv.education.map((ed, i) => (
            <div key={i} className="rounded-2xl p-4 space-y-3" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
                  {i === 0 ? "1st — ICAP Qualification (top)" : `Qualification ${i + 1}`}
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
                  {EDU_PRESETS.map(p => (
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
            <p>• Who you are (ICAP stage)</p>
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
                  <button onClick={() => setWork(i, "bullets", [...w.bullets, ""])} className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ color: "var(--green)", background: "rgba(61,179,113,0.08)" }}><Plus className="w-3 h-3" /> Add bullet</button>
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: "var(--green)" }}><Sparkles className="w-3 h-3" /> Smart Suggestions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Reconciled bank statements", "Prepared financial drafts", "Vouched invoices", "Assisted in audit planning", "Managed client correspondence"].map(sg => (
                        <button key={sg} onClick={() => setWork(i, "bullets", w.bullets.filter(Boolean).concat(sg))} className="text-[11px] px-2.5 py-1 rounded-full transition-colors cursor-pointer" style={{ background: "rgba(61,179,113,0.05)", border: "1px solid rgba(61,179,113,0.2)", color: "var(--text-1)" }}>
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
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>ICAP Mandatory Hands-On Courses (HOCs):</p>
            <p>These are <strong>required by ICAP</strong> — list them if you&apos;ve completed them:</p>
            <p>• <strong>Presentation &amp; Personal Effectiveness (PPE)</strong> – mandatory before CFAP</p>
            <p>• <strong>MS Office for Business</strong> – mandatory before CFAP</p>
            <p className="mt-1" style={{ color: "var(--text-3)" }}>ES 2021 students also need: Data Analytics &amp; FinTech</p>
            <p style={{ color: "var(--text-3)" }}>ES 2025 students also need: AI &amp; Data Analytics + Governance &amp; Ethics (at CFAP stage)</p>
          </Tip>
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>Other courses worth adding:</p>
            <p>• <strong>CA coaching classes</strong> – if you attended a full prep course at any institute, list it (name the course, not the institute)</p>
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
                <div><FieldLabel>Provider</FieldLabel><Inp value={c.provider} onChange={v => setCourse(i, "provider", v)} placeholder="e.g. ICAP" /></div>
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
            <p>• First attempt or distinction in ICAP exams (huge deal)</p>
            <p>• Certificate of Merit — Board / ICAP</p>
            <p>• Debates, sports, student council, model UN</p>
            <p>• Tutoring, community work, volunteer activities</p>
            <p>• Apps, websites, Excel tools you built</p>
            <p>• Scholarships or competitive exam results</p>
          </Tip>
          <div>
            <FieldLabel>Accomplishments &amp; Achievements</FieldLabel>
            <div className="mt-2"><ListEditor items={cv.accomplishments} onChange={v => set("accomplishments", v)} placeholder="e.g. Cleared all 8 CAF papers in first attempt" /></div>
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
                <p>We noticed you have no work experience yet. The &quot;Classic&quot; layout might leave a large empty gap on the right. We highly recommend switching to the 1-Column <b>Executive</b> layout for a perfectly balanced look!</p>
              </div>
            </motion.div>
          )}

          <div>
            <FieldLabel>CV Layout Template</FieldLabel>
            <div className="grid grid-cols-2 gap-3 mt-2" id="tour-layouts">
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => set("layout", "classic")}
                className="px-4 py-3 rounded-xl text-sm transition-all text-left relative overflow-hidden"
                style={{ background: cv.layout === "classic" ? "rgba(61,179,113,0.08)" : "var(--bg-3)", border: `1px solid ${cv.layout === "classic" ? "var(--green)" : "var(--border)"}`, color: "var(--text-1)", cursor: "pointer" }}>
                <div className="font-bold mb-1 flex justify-between items-center">Classic (2-Col) {cv.layout === "classic" && <CheckCircle2 className="w-4 h-4 text-green-500" />}</div>
                <div className="text-xs text-gray-500">Industry standard split design</div>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => set("layout", "executive")}
                className="px-4 py-3 rounded-xl text-sm transition-all text-left relative overflow-hidden"
                style={{ background: cv.layout === "executive" ? "rgba(61,179,113,0.08)" : "var(--bg-3)", border: `1px solid ${cv.layout === "executive" ? "var(--green)" : "var(--border)"}`, color: "var(--text-1)", cursor: "pointer" }}>
                <div className="font-bold mb-1 flex justify-between items-center">Executive (1-Col) {cv.layout === "executive" && <CheckCircle2 className="w-4 h-4 text-green-500" />}</div>
                <div className="text-xs text-gray-500">Elite single-column styling</div>
              </motion.button>
            </div>
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
                  style={{ fontFamily: f.val, background: cv.fontFamily === f.val ? "rgba(61,179,113,0.08)" : "var(--bg-3)", border: `1px solid ${cv.fontFamily === f.val ? "var(--green)" : "var(--border)"}`, color: "var(--text-1)", cursor: "pointer" }}>
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

  /* ══════════════════════════════════════
     RENDER
     ══════════════════════════════════════ */
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── Page header ── */}
      <div className="px-5 sm:px-8 md:px-16 pt-24 sm:pt-[110px] pb-8 sm:pb-12" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: "rgba(61,179,113,0.1)", border: "1px solid rgba(61,179,113,0.3)" }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--green)" }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk)" }}>Built for Big 4 Induction</span>
            </div>
            <h1 className="font-display font-bold mb-4 leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem,6vw,3.8rem)", color: "var(--text-1)" }}>
              Craft a CV that{" "}
              <span style={{ color: "var(--green)" }}>Partners cannot ignore.</span>
            </h1>
            <p className="text-sm sm:text-base mb-6" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.65 }}>
              Built for CA students applying to training firms. Fill in your details in 8 minutes and download a clean, print-ready PDF — no login, no cost.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={startTour} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-2)", cursor: "pointer" }}>
                <Play className="w-4 h-4" /> Take the Tour
              </button>
              {cv.name !== "" && (
                <div className="inline-flex items-start gap-2 rounded-xl px-4 py-2.5 text-sm" style={{ background: "rgba(61,179,113,0.06)", border: "1px solid rgba(61,179,113,0.2)", color: "var(--text-2)" }}>
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
                        background: step === i ? "var(--green)" : i < step ? "rgba(61,179,113,0.1)" : "transparent",
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
                <div className="mx-4 mt-3 mb-3 flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(61,179,113,0.08)", border: "1px solid rgba(61,179,113,0.2)", color: "var(--green)" }}>
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
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: "var(--bg-3)", color: "var(--text-3)" }}>{step + 1}/{STEPS.length}</span>
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
            <div className="rounded-2xl overflow-hidden relative flex-1" style={{ background: "#e8e8e8", padding: "16px", border: "1px solid var(--border)" }}>
              <div className="overflow-x-auto flex justify-center">
                <AnimatePresence mode="wait">
                  {rendering ? (
                    <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="rounded shadow-xl bg-white" style={{ width: 794 * 0.72, height: 1123 * 0.72 }}>
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
                      <ScaledPreview cv={cv} scale={0.72} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
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
              onClick={() => setShowPreview(true)}
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
                    className="bg-white rounded shadow-2xl" style={{ width: 794 * mobileScale, height: 1123 * mobileScale }}>
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse mx-auto" />
                      <div className="h-10 w-full bg-gray-50 rounded" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="cv-mob" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ScaledPreview cv={cv} scale={mobileScale} />
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
      {/* Must stay in normal flow off-screen (not display:none / opacity:0) so
          html2canvas can access computed styles and measure dimensions. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: 794,
          pointerEvents: "none",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <div id="cv-pdf-reference" style={{ width: 794, height: 1123, overflow: "hidden" }}>
          <CVPreview cv={cv} />
        </div>
      </div>
    </div>
  );
}
