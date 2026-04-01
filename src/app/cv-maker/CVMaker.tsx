"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Download, Eye, ChevronLeft, ChevronRight, X, Mail, RefreshCw, ArrowUp, ArrowDown, Palette, Type } from "lucide-react";

const LS_KEY = "cahub_cv_v1";

/* ── Types ─────────────────────────────────────────── */
interface WorkExp { company: string; role: string; period: string; bullets: string[]; }
interface Education { level: string; institution: string; grade: string; years: string; }
interface Course { name: string; provider: string; year: string; }
interface CVData {
  themeColor: string;
  fontFamily: string;
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
function Inp({ value, onChange, placeholder, type = "text", disabled }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
      style={{ background: disabled ? "var(--bg-3)" : "var(--bg)", border: "1px solid var(--border)", color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}
      onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
      onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
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
    <div className="rounded-xl p-3 mb-4 text-xs space-y-1" style={{ background: "rgba(61,179,113,0.06)", border: "1px solid rgba(61,179,113,0.15)", color: "var(--text-2)" }}>
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
      <button onClick={() => onChange([...items, ""])} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl" style={{ color: "var(--green)", background: "rgba(61,179,113,0.08)", border: "1px solid rgba(61,179,113,0.15)" }}>
        <Plus className="w-4 h-4" /> Add
      </button>
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
  section: 16,   // between sections
  entry: 13,     // between entries within a section
  bullet: 4,     // between bullet lines
  line: 2,       // between label lines
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

function CVPreview({ cv }: { cv: CVData }) {
  return (
    <div
      id="cv-preview"
      style={{
        fontFamily: cv.fontFamily,
        background: "#ffffff",
        color: "#1a1a1a",
        "--cv-accent": cv.themeColor,
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
              {cv.phone && <span style={{ fontSize: SZ.contact, color: "#333" }}>📞 {cv.phone}</span>}
              {cv.email && <span style={{ fontSize: SZ.contact, color: "#333" }}>✉ {cv.email}</span>}
              {cv.linkedin && <span style={{ fontSize: SZ.contact, color: "#333" }}>🔗 {cv.linkedin}</span>}
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
  const [showDlModal, setShowDlModal] = useState(false);
  const [dlEmail, setDlEmail] = useState("");
  const [dlSending, setDlSending] = useState(false);
  const [dlSent, setDlSent] = useState(false);

  // Auto-save on every change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(cv)); } catch {}
  }, [cv]);

  const set = (field: keyof CVData, value: unknown) => setCv(p => ({ ...p, [field]: value }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("photo", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const doPrint = () => {
    const el = document.getElementById("cv-preview");
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>${cv.name || "CV"}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box}body{background:#fff}@page{size:A4;margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
      </head><body>${el.outerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  const handlePrint = () => setShowDlModal(true);

  const handleDlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dlEmail) { doPrint(); setShowDlModal(false); return; }
    setDlSending(true);
    try {
      await fetch("/api/cv-emails", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: dlEmail, name: cv.name }) });
    } catch {}
    setDlSending(false);
    setDlSent(true);
    setTimeout(() => { doPrint(); setShowDlModal(false); setDlSent(false); setDlEmail(""); }, 900);
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
                    <div key={j} className="flex gap-2">
                      <Inp value={b} onChange={v => { const buls = w.bullets.map((x, k) => k === j ? v : x); setWork(i, "bullets", buls); }} placeholder="Prepared monthly bank reconciliations..." />
                      {w.bullets.length > 1 && <button onClick={() => setWork(i, "bullets", w.bullets.filter((_, k) => k !== j))} className="p-2 rounded-xl shrink-0" style={{ color: "#F87171", background: "rgba(248,113,113,0.08)" }}><Trash2 className="w-3.5 h-3.5" /></button>}
                    </div>
                  ))}
                  <button onClick={() => setWork(i, "bullets", [...w.bullets, ""])} className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ color: "var(--green)", background: "rgba(61,179,113,0.08)" }}><Plus className="w-3 h-3" /> Add bullet</button>
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
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>First impressions matter.</p>
            <p>Your CV is visually scanned in 6 seconds. Pick a clean, professional ATS-friendly font and a subtle accent color.</p>
          </Tip>
          
          <div>
            <FieldLabel>CV Font (ATS-Friendly)</FieldLabel>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { name: "Arial (Modern)", val: "'Arial','Helvetica Neue',sans-serif" },
                { name: "Garamond (Classic)", val: "'Garamond','EB Garamond',serif" },
                { name: "Georgia (Elegant)", val: "'Georgia',serif" },
                { name: "Trebuchet MS (Clean)", val: "'Trebuchet MS',sans-serif" },
              ].map(f => (
                <button key={f.val} onClick={() => set("fontFamily", f.val)}
                  className="px-4 py-3 rounded-xl text-sm transition-all text-left flex items-center justify-between"
                  style={{ fontFamily: f.val, background: cv.fontFamily === f.val ? "rgba(61,179,113,0.08)" : "var(--bg-3)", border: `1px solid ${cv.fontFamily === f.val ? "var(--green)" : "var(--border)"}`, color: "var(--text-1)" }}>
                  <span>{f.name}</span>
                  {cv.fontFamily === f.val && <span className="text-xs" style={{ color: "var(--green)" }}>✓</span>}
                </button>
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
                <button key={c.hex} onClick={() => set("themeColor", c.hex)}
                  title={c.name}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer"
                  style={{ background: c.hex, border: cv.themeColor === c.hex ? "3px solid var(--green)" : "3px solid transparent", transform: cv.themeColor === c.hex ? "scale(1.15)" : "scale(1)" }}>
                  {cv.themeColor === c.hex && <span style={{ color: "#fff", fontSize: 14 }}>✓</span>}
                </button>
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
      <div className="px-5 sm:px-8 md:px-16 pt-20 sm:pt-24 pb-7 sm:pb-10 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-2)" }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>Free Tool</p>
          <h1 className="font-display font-bold mb-2" style={{ fontSize: "clamp(1.6rem,5vw,3rem)", color: "var(--text-1)" }}>CA Induction CV Maker</h1>
          <p className="text-sm sm:text-base" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", maxWidth: 560 }}>
            Built for ICAP students applying to audit &amp; advisory firms. The exact two-column format that recruiting partners expect. Covers every section that matters — HOCs, education, experience, courses, skills. Free. Always.
          </p>
          {/* Demo notice */}
          <div className="mt-4 flex items-start gap-3 rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(61,179,113,0.08)", border: "1px solid rgba(61,179,113,0.2)", color: "var(--text-2)", maxWidth: 620 }}>
            <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>💡</span>
            <span><strong style={{ color: "var(--green)" }}>Sample CV loaded.</strong> Replace Ali&apos;s info with yours step by step, then hit Download PDF. Takes under 5 minutes.</span>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="flex flex-col xl:flex-row gap-6">

          {/* ── FORM ── */}
          <div className="xl:w-[460px] shrink-0">
            <div className="rounded-2xl" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>

              {/* Form top bar: step pills + Start Fresh */}
              <div className="flex items-center gap-2 px-2 pt-2 pb-0" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex gap-1 flex-1 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" as const }}>
                {STEPS.map((s, i) => (
                  <button key={s.id} onClick={() => setStep(i)}
                    className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all"
                    style={{ background: i === step ? "var(--green)" : i < step ? "rgba(61,179,113,0.12)" : "transparent", color: i === step ? "#fff" : i < step ? "var(--green)" : "var(--text-3)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                    {i < step ? "✓" : `${i + 1}.`} {s.label}
                  </button>
                ))}
                </div>
                <button onClick={() => { if (cv.name !== "") { setCv(DEFAULT); localStorage.removeItem(LS_KEY); setRestored(false); } else { setCv(DEMO); } }}
                  title={cv.name !== "" ? "Clear and start fresh" : "Load sample CV"}
                  className="shrink-0 flex items-center gap-1 text-xs font-bold px-3 py-1.5 mb-2 rounded-lg whitespace-nowrap transition-all"
                  style={{ background: cv.name !== "" ? "rgba(248,113,113,0.1)" : "rgba(61,179,113,0.1)", color: cv.name !== "" ? "#f87171" : "var(--green)", border: `1px solid ${cv.name !== "" ? "rgba(248,113,113,0.2)" : "rgba(61,179,113,0.2)"}`, cursor: "pointer" }}>
                  {cv.name !== "" ? <><RefreshCw className="w-3 h-3" /> Start Fresh</> : <>📋 Sample</>}
                </button>
              </div>
              {/* Restored banner */}
              {restored && (
                <div className="mx-4 mt-3 flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(61,179,113,0.08)", border: "1px solid rgba(61,179,113,0.2)", color: "var(--green)" }}>
                  <span>✅ Restored your last session</span>
                  <button onClick={() => setRestored(false)} style={{ background: "none", border: "none", color: "var(--green)", cursor: "pointer" }}><X className="w-3 h-3" /></button>
                </div>
              )}
              {/* Progress bar */}
              <div style={{ height: 3, background: "var(--bg-3)", margin: "0 0 0 0" }}>
                <div style={{ height: "100%", background: "var(--green)", width: `${((step + 1) / STEPS.length) * 100}%`, transition: "width 0.3s ease", borderRadius: 2 }} />
              </div>
              {/* Step content */}
              <div className="p-4 sm:p-5 overflow-y-auto" style={{ maxHeight: "65vh" }}>
                <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>{STEPS[step].label}</h3>
                <p className="text-xs mb-5" style={{ color: "var(--text-3)" }}>Step {step + 1} of {STEPS.length}</p>
                {renderStep()}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center p-4 gap-3" style={{ borderTop: "1px solid var(--border)" }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-30"
                  style={{ background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)", cursor: step === 0 ? "not-allowed" : "pointer" }}>
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button onClick={() => setStep(s => s + 1)}
                    className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-xl text-white"
                    style={{ background: "var(--green)", border: "none", cursor: "pointer", boxShadow: "0 2px 14px rgba(61,179,113,0.3)" }}>
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-1.5">
                    <p className="text-xs font-semibold" style={{ color: "var(--green)" }}>🎉 Your CV is ready!</p>
                    <button onClick={handlePrint}
                      className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-xl text-white"
                      style={{ background: "var(--green)", border: "none", cursor: "pointer", boxShadow: "0 2px 14px rgba(61,179,113,0.3)" }}>
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile CTAs */}
            <div className="xl:hidden flex gap-3 mt-4">
              <button onClick={() => setShowPreview(true)}
                className="flex-1 flex items-center justify-center gap-2 font-bold rounded-xl py-3.5 text-sm text-white"
                style={{ background: "var(--green)", boxShadow: "0 2px 14px rgba(61,179,113,0.3)", cursor: "pointer" }}>
                <Eye className="w-4 h-4" /> Preview My CV
              </button>
              <button onClick={handlePrint}
                className="flex items-center justify-center gap-2 font-bold rounded-xl py-3.5 px-5 text-sm"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-1)", cursor: "pointer" }}>
                <Download className="w-4 h-4" /> PDF
              </button>
            </div>

            {/* Progress indicator on mobile */}
            <div className="xl:hidden mt-4 flex items-center gap-2 justify-center">
              {STEPS.map((_, i) => (
                <button key={i} onClick={() => setStep(i)}
                  style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? "var(--green)" : i < step ? "rgba(61,179,113,0.4)" : "var(--bg-3)", transition: "all 0.3s", border: "none", cursor: "pointer", padding: 0 }} />
              ))}
            </div>
          </div>

          {/* ── PREVIEW (desktop only) ── */}
          <div className="hidden xl:block flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-3)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>Live Preview</p>
              <button onClick={handlePrint} className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg text-white"
                style={{ background: "var(--green)", border: "none", cursor: "pointer", boxShadow: "0 2px 12px rgba(61,179,113,0.25)" }}>
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: "#d8d8d8", padding: "16px", border: "1px solid var(--border)" }}>
              <div className="overflow-x-auto flex justify-center">
                <ScaledPreview cv={cv} scale={0.72} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile fullscreen preview modal ── */}
      {showPreview && (
        <div className="xl:hidden fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.9)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border)" }}>
            <p className="text-sm font-bold" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>CV Preview</p>
            <div className="flex items-center gap-2">
              <button onClick={handlePrint} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg text-white"
                style={{ background: "var(--green)", cursor: "pointer" }}>
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
              <button onClick={() => setShowPreview(false)} className="p-2 rounded-lg"
                style={{ background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)", cursor: "pointer" }}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-auto p-3" style={{ background: "#cccccc" }}>
            <div className="flex justify-center">
              <ScaledPreview cv={cv} scale={0.42} />
            </div>
            <p className="text-center text-xs mt-3 pb-4" style={{ color: "#666" }}>
              Pinch to zoom · This is exactly how your PDF will look
            </p>
          </div>
        </div>
      )}

      {/* ── Download Email Modal ── */}
      {showDlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => { setShowDlModal(false); doPrint(); }}>
          <div className="max-w-sm w-full rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}
            onClick={e => e.stopPropagation()}>
            {dlSent ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-bold text-lg" style={{ color: "var(--text-1)" }}>Sent! Downloading now...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl flex items-center justify-center" style={{ width: 44, height: 44, background: "rgba(61,179,113,0.12)", color: "var(--green)" }}><Mail className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk),sans-serif" }}>Get a copy to your inbox</h3>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>Optional — we&apos;ll mail you a reminder link</p>
                  </div>
                </div>
                <form onSubmit={handleDlSubmit} className="flex flex-col gap-3">
                  <input type="email" value={dlEmail} onChange={e => setDlEmail(e.target.value)} placeholder="your@email.com (optional)"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-1)" }} />
                  <button type="submit" disabled={dlSending}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-sm text-white cursor-pointer"
                    style={{ background: "var(--green)", border: "none" }}>
                    <Download className="w-4 h-4" />{dlSending ? "Sending..." : dlEmail ? "Send & Download PDF" : "Download PDF"}
                  </button>
                  <button type="button" onClick={() => { setShowDlModal(false); doPrint(); }}
                    className="text-center text-xs cursor-pointer" style={{ color: "var(--text-3)", background: "none", border: "none" }}>
                    Skip — just download
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
