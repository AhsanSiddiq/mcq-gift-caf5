"use client";
import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Sparkles, Loader2, Copy, Download, FileText, Check, AlertTriangle, Wand2, RotateCcw } from "lucide-react";
import CareerNav from "../CareerNav";
import { type QualBodyId, QUAL_BODIES, QUAL_BODY_IDS, filled, loadSavedCV, qualOf } from "../cvData";
import { letterPdf } from "../pdf";

const AUTH_KEY = "mcq_gift_auth_v1";
const DRAFT_KEY = "cahub_cover_letter_v1";

const ROLES = [
  { id: "articleship", label: "Articleship / training contract", short: "Articleship" },
  { id: "audit-trainee", label: "Audit trainee / associate", short: "Audit Trainee" },
  { id: "big4-induction", label: "Big 4 induction", short: "Big 4 Trainee Induction" },
  { id: "graduate", label: "Graduate role", short: "Graduate Programme" },
] as const;
type RoleId = (typeof ROLES)[number]["id"];

interface Form {
  applicantName: string; email: string; phone: string; linkedin: string;
  qualBody: QualBodyId; stage: string; papers: string;
  role: RoleId; firmName: string; firmCity: string; recipient: string;
  strengths: string; experience: string; whyFirm: string;
}

const EMPTY: Form = {
  applicantName: "", email: "", phone: "", linkedin: "",
  qualBody: "icap", stage: "CAF Qualified", papers: "",
  role: "articleship", firmName: "", firmCity: "", recipient: "",
  strengths: "", experience: "", whyFirm: "",
};

/** Same limits as the API route. */
const MAX: Partial<Record<keyof Form, number>> = {
  applicantName: 80, firmName: 100, firmCity: 60, recipient: 80, stage: 100, papers: 300, strengths: 900, experience: 700, whyFirm: 500,
  email: 120, phone: 40, linkedin: 120,
};

const API_BODY: Record<QualBodyId, string> = { icap: "ICAP", acca: "ACCA", icai: "ICAI", cima: "CIMA", icaew: "ICAEW", cma: "US CMA" };

function formFromCV(): Partial<Form> | null {
  const cv = loadSavedCV();
  if (!cv || !cv.name) return null;
  const q = qualOf(cv);
  const work = filled.work(cv).slice(0, 2).map(w => `${w.role ? w.role + " at " : ""}${w.company} (${w.period}): ${filled.list(w.bullets).slice(0, 2).join("; ")}`);
  const strengths = [
    ...filled.list(cv.accomplishments).slice(0, 2),
    filled.list(cv.expertise).length ? `Technical: ${filled.list(cv.expertise).slice(0, 4).join(", ")}` : "",
    filled.list(cv.skills).length ? `Skills: ${filled.list(cv.skills).slice(0, 4).join(", ")}` : "",
  ].filter(Boolean).join(". ");
  return {
    applicantName: cv.name, email: cv.email, phone: cv.phone, linkedin: cv.linkedin,
    qualBody: q.id, stage: cv.icapStage,
    papers: [cv.papersPassed?.length ? cv.papersPassed.join(", ") : "", cv.papersCleared].filter(Boolean).join(" — "),
    strengths: strengths.slice(0, 900),
    experience: work.join("\n").slice(0, 700),
  };
}

const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** Offline fallback: a solid, editable letter assembled from the inputs (no AI). */
function templateLetter(f: Form): string {
  const q = QUAL_BODIES[f.qualBody];
  const roleText = f.role === "articleship"
    ? (f.qualBody === "icap" ? "a training (articleship) position under ICAP's Firm Training Scheme" : f.qualBody === "icai" ? "articleship" : "a trainee position")
    : f.role === "audit-trainee" ? "an audit trainee position" : f.role === "big4-induction" ? "your trainee induction" : "your graduate programme";
  const firm = f.firmName || "your firm";
  const firstSentence = (s: string) => s.split(/(?<=[.!?])\s+/)[0].replace(/[.!?]+$/, "");
  const paras = [
    `Dear ${f.recipient || "Hiring Team"},`,
    `I am applying for ${roleText} at ${firm}${f.firmCity ? ` in ${f.firmCity}` : ""}. ${f.whyFirm ? `${firstSentence(f.whyFirm)}, and I would value the chance to build my career in that environment.` : `${firm}'s reputation for quality work and structured training is exactly the environment in which I want to begin my career.`}`,
    `I am ${/^[AEIOU]/.test(q.label) ? "an" : "a"} ${q.label} student${f.stage ? ` (${f.stage})` : ""}${f.papers ? `; my exam record so far: ${f.papers.replace(/\s*\|\s*/g, ", ")}` : ""}. My studies have given me a sound grounding in financial reporting, audit and taxation, and I am keen to apply that knowledge to real client work under close supervision.`,
    f.experience ? `Alongside my studies I have gained practical experience: ${f.experience.replace(/\n+/g, "; ")}. This taught me to work accurately to deadlines and to communicate clearly with the people I support.` : "",
    f.strengths ? `The strengths I would bring to your team include ${lowerFirst(f.strengths.replace(/\n+/g, "; ").replace(/\.$/, ""))}. I take ownership of my work, ask questions early, and check details carefully before passing anything on.` : "",
    `I would welcome the opportunity to discuss how I can contribute to ${firm}. My CV is attached, and I am available for an interview at your convenience. Thank you for considering my application.`,
    `Yours sincerely,\n${f.applicantName || "Your Name"}`,
  ];
  return paras.filter(Boolean).join("\n\n");
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-2)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>{label}</span>
        {required && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.12)", color: "#F87171" }}>Required</span>}
      </span>
      {children}
      {hint && <span className="block text-xs mt-1" style={{ color: "var(--text-3)" }}>{hint}</span>}
    </label>
  );
}

const inputCls = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2";
const inputStyle: React.CSSProperties = { background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif", "--tw-ring-color": "var(--green)" } as React.CSSProperties;

function CoverLetterInner({ hydrated }: { hydrated: boolean }) {
  const [form, setForm] = useState<Form>(() => {
    if (!hydrated) return EMPTY;
    try { const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); if (d?.form) return { ...EMPTY, ...d.form }; } catch { /* ignore */ }
    return EMPTY;
  });
  const [letter, setLetter] = useState<string>(() => {
    if (!hydrated) return "";
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null")?.letter ?? ""; } catch { return ""; }
  });
  const [cvAvailable] = useState(() => hydrated && !!formFromCV());
  const [aiStatus, setAiStatus] = useState<"checking" | "on" | "off">("checking");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upgrade, setUpgrade] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState<"ai" | "template" | "">("");

  useEffect(() => {
    let alive = true;
    fetch("/api/cover-letter").then(r => r.json()).then(d => alive && setAiStatus(d.enabled ? "on" : "off")).catch(() => alive && setAiStatus("off"));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, letter })); } catch { /* ignore */ } }, 400);
    return () => clearTimeout(t);
  }, [form, letter]);

  const upd = <K extends keyof Form>(k: K, v: Form[K]) => setForm(p => ({ ...p, [k]: v }));
  const q = QUAL_BODIES[form.qualBody];
  const role = ROLES.find(r => r.id === form.role)!;
  const date = useMemo(() => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), []);
  const recipientLines = [form.recipient, form.recipient ? "" : "The Recruitment Team", form.firmName, form.firmCity].filter(Boolean);
  const subject = `Re: Application for ${role.short}${form.firmName ? ` – ${form.firmName}` : ""}`;
  const contact = [form.phone, form.email, form.linkedin].filter(Boolean);

  const missing = [!form.applicantName.trim() && "your name", form.firmName.trim().length < 2 && "the firm name", form.strengths.trim().length < 10 && "your key strengths (10+ characters)"].filter(Boolean) as string[];

  const importCV = () => {
    const f = formFromCV();
    if (f) { setForm(p => ({ ...p, ...f })); setNotice("Imported your name, contact details, qualification, strengths and experience from your CV. Check them below."); }
  };

  const buildFromTemplate = (why?: string) => {
    setLetter(templateLetter(form));
    setSource("template");
    setNotice(why ?? "Built from our template — edit it to make it yours.");
  };

  const generate = async () => {
    setError(""); setUpgrade(false); setNotice("");
    if (missing.length) { setError(`Please add ${missing.join(", ")}.`); return; }
    if (aiStatus === "off") { buildFromTemplate("The AI writer isn't available right now, so we built your letter from our template. Edit it freely below."); return; }
    setLoading(true);
    let auth: { email?: string; token?: string } = {};
    try { auth = JSON.parse(localStorage.getItem(AUTH_KEY) || "{}"); } catch { /* ignore */ }
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName: form.applicantName, qualBody: API_BODY[form.qualBody], stage: form.stage, papers: form.papers,
          role: form.role, firmName: form.firmName, firmCity: form.firmCity, recipient: form.recipient,
          strengths: form.strengths, experience: form.experience, whyFirm: form.whyFirm,
          email: auth.email, token: auth.token,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.letter) {
        setLetter(data.letter);
        setSource("ai");
        setNotice(typeof data.remaining === "number" ? `AI draft ready. ${data.remaining} AI letter${data.remaining === 1 ? "" : "s"} left today.` : "AI draft ready.");
      } else if (res.status === 503 || data.code === "ai_unavailable") {
        setAiStatus("off");
        buildFromTemplate("The AI writer isn't available right now, so we built your letter from our template. Edit it freely below.");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setUpgrade(!!data.upgrade);
      }
    } catch {
      setError("Network error — please try again, or build the letter from our template.");
    } finally {
      setLoading(false);
    }
  };

  const fullText = () => [form.applicantName, contact.join(" | "), "", date, "", ...recipientLines, "", subject, "", letter].join("\n");

  const copy = async () => {
    try { await navigator.clipboard.writeText(fullText()); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { setError("Couldn't copy automatically — select the text and copy it."); }
  };

  const downloadPdf = async () => {
    try {
      const pdf = await letterPdf({ name: form.applicantName, contact, date, recipient: recipientLines, subject, body: letter });
      pdf.save(`${(form.applicantName || "My").replace(/\s+/g, "_")}_Cover_Letter.pdf`);
    } catch (e) {
      console.error(e);
      setError("Could not create the PDF. Please try again.");
    }
  };

  const words = letter.trim() ? letter.trim().split(/\s+/).length : 0;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="px-4 sm:px-8 md:px-16 pt-24 sm:pt-[110px] pb-6 sm:pb-10" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <CareerNav active="letter" />
          <div className="max-w-2xl">
            <h1 className="font-display font-bold mb-3 leading-[1.1] tracking-tight" style={{ fontSize: "clamp(1.9rem,6vw,3.2rem)", color: "var(--text-1)" }}>
              AI Cover Letter <span style={{ color: "var(--green)" }}>for articleship &amp; Big 4</span>
            </h1>
            <p className="text-sm sm:text-base" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.65 }}>
              Tell us the firm, the role and what makes you strong. Get a tailored one-page letter you can edit, copy or download as a PDF. Works for ICAP, ACCA, ICAI, CIMA, ICAEW and CMA students.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 grid lg:grid-cols-[minmax(0,440px)_1fr] gap-6">
        {/* ── Inputs ── */}
        <form className="rounded-2xl p-4 sm:p-5 space-y-4 h-fit" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
          onSubmit={e => { e.preventDefault(); generate(); }}>
          {aiStatus === "off" && (
            <div role="status" className="flex gap-2.5 rounded-xl p-3 text-xs" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", color: "#d97706" }}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span><b>AI writer is offline right now.</b> You can still build a strong letter from our template using your details, then edit, copy or download it.</span>
            </div>
          )}
          {cvAvailable && (
            <button type="button" onClick={importCV} className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl"
              style={{ background: "color-mix(in srgb, var(--green) 10%, transparent)", color: "var(--green)", border: "1px solid color-mix(in srgb, var(--green) 30%, transparent)", cursor: "pointer" }}>
              <FileText className="w-4 h-4" /> Use details from my CV
            </button>
          )}

          <Field label="Firm name" required>
            <input className={inputCls} style={inputStyle} value={form.firmName} maxLength={MAX.firmName} onChange={e => upd("firmName", e.target.value)} placeholder="e.g. A. F. Ferguson & Co. (PwC)" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input className={inputCls} style={inputStyle} value={form.firmCity} maxLength={MAX.firmCity} onChange={e => upd("firmCity", e.target.value)} placeholder="Karachi" />
            </Field>
            <Field label="Addressed to">
              <input className={inputCls} style={inputStyle} value={form.recipient} maxLength={MAX.recipient} onChange={e => upd("recipient", e.target.value)} placeholder="Ms Sara Khan" />
            </Field>
          </div>

          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-2)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>Role</legend>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => {
                const on = form.role === r.id;
                return (
                  <button key={r.id} type="button" aria-pressed={on} onClick={() => upd("role", r.id)} className="text-xs font-semibold px-3 py-2.5 rounded-xl text-left"
                    style={{ background: on ? "var(--green)" : "var(--bg-3)", color: on ? "#fff" : "var(--text-2)", border: "1px solid var(--border)", cursor: "pointer", minHeight: 44 }}>
                    {r.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Field label="Your name" required>
            <input className={inputCls} style={inputStyle} value={form.applicantName} maxLength={MAX.applicantName} onChange={e => upd("applicantName", e.target.value)} placeholder="Ali Hassan Qureshi" autoComplete="name" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <input className={inputCls} style={inputStyle} type="email" value={form.email} maxLength={MAX.email} onChange={e => upd("email", e.target.value)} placeholder="you@email.com" autoComplete="email" />
            </Field>
            <Field label="Phone">
              <input className={inputCls} style={inputStyle} value={form.phone} maxLength={MAX.phone} onChange={e => upd("phone", e.target.value)} placeholder="+92 300 1234567" autoComplete="tel" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Qualification">
              <select className={inputCls} style={inputStyle} value={form.qualBody} onChange={e => { const id = e.target.value as QualBodyId; setForm(p => ({ ...p, qualBody: id, stage: QUAL_BODIES[id].stages.includes(p.stage) ? p.stage : QUAL_BODIES[id].stages[0] })); }}>
                {QUAL_BODY_IDS.map(id => <option key={id} value={id}>{QUAL_BODIES[id].label}</option>)}
              </select>
            </Field>
            <Field label="Stage">
              <select className={inputCls} style={inputStyle} value={form.stage} onChange={e => upd("stage", e.target.value)}>
                {!q.stages.includes(form.stage) && <option value={form.stage}>{form.stage}</option>}
                {q.stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Papers passed / exam highlights" hint="e.g. All 8 CAF papers, first attempt; 80%+ in Audit">
            <input className={inputCls} style={inputStyle} value={form.papers} maxLength={MAX.papers} onChange={e => upd("papers", e.target.value)} placeholder={q.papersPlaceholder} />
          </Field>
          <Field label="Key strengths" required hint={`${form.strengths.length}/${MAX.strengths} — concrete beats generic: results, skills, examples.`}>
            <textarea className={inputCls + " resize-y"} style={inputStyle} rows={4} value={form.strengths} maxLength={MAX.strengths} onChange={e => upd("strengths", e.target.value)} placeholder="First-attempt passes in FR and Audit; advanced Excel (pivot tables, XLOOKUP); led a 6-person team for a college business competition" />
          </Field>
          <Field label="Experience & activities" hint={`${form.experience.length}/${MAX.experience}`}>
            <textarea className={inputCls + " resize-y"} style={inputStyle} rows={3} value={form.experience} maxLength={MAX.experience} onChange={e => upd("experience", e.target.value)} placeholder="Accounts intern at a family business: bank reconciliations and GST filing; tutored 12 students" />
          </Field>
          <Field label="Why this firm?" hint="One genuine reason — a service line, sector, training approach or someone you spoke to.">
            <textarea className={inputCls + " resize-y"} style={inputStyle} rows={2} value={form.whyFirm} maxLength={MAX.whyFirm} onChange={e => upd("whyFirm", e.target.value)} placeholder="Its banking audit practice and the structured training I heard about at the campus drive" />
          </Field>

          {error && (
            <p role="alert" className="text-sm px-3 py-2 rounded-lg" style={{ background: "rgba(248,113,113,0.12)", color: "#F87171" }}>
              {error} {upgrade && <Link href="/pro" className="underline font-bold">See Pro</Link>}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <button type="submit" disabled={loading || aiStatus === "checking"} className="flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl text-white disabled:opacity-60"
              style={{ background: "var(--green)", cursor: loading ? "wait" : "pointer", minHeight: 48 }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing your letter…</>
                : aiStatus === "off" ? <><Wand2 className="w-4 h-4" /> Build my letter</>
                : <><Sparkles className="w-4 h-4" /> {letter ? "Regenerate with AI" : "Write my letter with AI"}</>}
            </button>
            {aiStatus === "on" && (
              <button type="button" onClick={() => { if (missing.length) { setError(`Please add ${missing.join(", ")}.`); return; } setError(""); buildFromTemplate(); }} className="text-sm font-semibold py-3 px-4 rounded-xl"
                style={{ background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)", cursor: "pointer" }}>
                Use template
              </button>
            )}
          </div>
          {aiStatus === "on" && <p className="text-xs" style={{ color: "var(--text-3)" }}>3 free AI letters a day · 30 with Pro. Your details are only used to write this letter and aren&apos;t stored.</p>}
        </form>

        {/* ── Letter ── */}
        <section aria-label="Your cover letter" className="min-w-0">
          {notice && <p role="status" className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "color-mix(in srgb, var(--green) 10%, transparent)", color: "var(--green)" }}>{notice}</p>}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-3)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              {letter ? `Your letter · ${words} words${source === "ai" ? " · AI draft" : source === "template" ? " · template" : ""}` : "Preview"}
            </p>
            {letter && (
              <div className="flex gap-2">
                <button type="button" onClick={copy} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl" style={{ background: "var(--bg-2)", color: "var(--text-1)", border: "1px solid var(--border)", cursor: "pointer", minHeight: 40 }}>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied" : "Copy"}
                </button>
                <button type="button" onClick={downloadPdf} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl text-white" style={{ background: "var(--green)", cursor: "pointer", minHeight: 40 }}>
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button type="button" aria-label="Clear letter" onClick={() => { setLetter(""); setSource(""); setNotice(""); }} className="p-2 rounded-xl" style={{ background: "var(--bg-2)", color: "var(--text-3)", border: "1px solid var(--border)", cursor: "pointer" }}>
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl p-3 sm:p-6" style={{ background: "#e8e8e8", border: "1px solid var(--border)" }}>
            <article className="mx-auto bg-white shadow-xl rounded-sm" style={{ maxWidth: 680, padding: "clamp(20px, 6vw, 56px)", color: "#1a1a1a", fontFamily: "Arial, Helvetica, sans-serif" }}>
              <div style={{ borderBottom: "1.5px solid #1a1a1a", paddingBottom: 8, marginBottom: 18 }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{form.applicantName || "Your Name"}</div>
                <div style={{ fontSize: 12, color: "#444", marginTop: 2, wordBreak: "break-word" }}>{contact.join("  |  ") || "phone  |  email"}</div>
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                <p style={{ marginBottom: 12 }}>{date}</p>
                <div style={{ marginBottom: 12 }}>{recipientLines.length ? recipientLines.map((l, i) => <div key={i}>{l}</div>) : <div style={{ color: "#999" }}>The Recruitment Team<br />Firm name</div>}</div>
                <p style={{ fontWeight: 700, marginBottom: 12 }}>{subject}</p>
                {letter ? (
                  <textarea aria-label="Letter text (editable)" value={letter} onChange={e => setLetter(e.target.value)}
                    className="w-full focus:outline-none rounded"
                    style={{ fontFamily: "inherit", fontSize: "inherit", lineHeight: 1.6, color: "#1a1a1a", background: "transparent", border: "1px dashed #d4d4d4", padding: 6, minHeight: 520, resize: "vertical", fieldSizing: "content" } as React.CSSProperties} />
                ) : (
                  <div style={{ color: "#9a9a9a", border: "1px dashed #d4d4d4", borderRadius: 4, padding: 16, minHeight: 260 }}>
                    <p>Your tailored letter will appear here. You can edit every word before copying or downloading it.</p>
                    <p style={{ marginTop: 10 }}>Tip: firms read hundreds of letters during the induction season. One specific reason for choosing their firm and one concrete result beat a page of adjectives.</p>
                  </div>
                )}
              </div>
            </article>
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--text-3)" }}>
            Always check names, firm details and facts before sending. Next: <Link href="/cv-maker/interview-prep" className="underline" style={{ color: "var(--green)" }}>practise the interview questions firms ask</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}

const noopSubscribe = () => () => {};

/** Server + first client render use empty state; after hydration we remount once with the saved draft. */
export default function CoverLetter() {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return <CoverLetterInner key={hydrated ? "client" : "server"} hydrated={hydrated} />;
}
