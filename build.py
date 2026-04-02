import sys

path = r'e:\CMA\MCQ Gift\mcq-gift\src\app\cv-maker\CVMaker.tsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Imports and layout typing
code = code.replace(
    'import { Plus, Trash2, Download, Eye, ChevronLeft, ChevronRight, X, Mail, RefreshCw, ArrowUp, ArrowDown, Palette, Type } from "lucide-react";',
    'import { Plus, Trash2, Download, Eye, ChevronLeft, ChevronRight, X, Mail, RefreshCw, ArrowUp, ArrowDown, Palette, Type, LayoutTemplate, Sparkles, CheckCircle2 } from "lucide-react";\nimport { motion, AnimatePresence } from "framer-motion";'
)
code = code.replace('fontFamily: string;', 'fontFamily: string;\n  layout: "classic" | "executive";')
code = code.replace('fontFamily: "\'Arial\',\'Helvetica Neue\',sans-serif",', 'fontFamily: "\'Arial\',\'Helvetica Neue\',sans-serif",\n  layout: "classic",')

# 2. ATS Score function before CVPreview
score_func = """
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

"""
code = code.replace('function CVPreview({ cv }: { cv: CVData }) {', score_func + 'function CVPreview({ cv }: { cv: CVData }) {')

# 3. Add Executive Layout
executive_layout = """
  if (cv.layout === "executive") {
    return (
      <div id="cv-preview" style={{ fontFamily: cv.fontFamily, background: "#fff", color: "#1a1a1a", "--cv-accent": cv.themeColor } as any} className="w-[210mm] min-h-[297mm] p-[15mm_18mm] box-border mx-auto relative text-[10px]">
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
            <SectionHead title="Accomplishments" side="left" />
            {cv.accomplishments.filter(Boolean).map((a, i) => (
              <div key={i} className="mb-1"><Bullet text={a} /></div>
            ))}
          </div>
        )}
      </div>
    );
  }
"""
code = code.replace(
    'function CVPreview({ cv }: { cv: CVData }) {',
    'function CVPreview({ cv }: { cv: CVData }) {\n' + executive_layout
)

# 4. Appearance step -> Add layout toggle
appearance_str = """      /* ── Appearance ── */
      case 8: return (
        <div className="space-y-6">
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>First impressions matter.</p>
            <p>Your CV is visually scanned in 6 seconds. Pick a clean, professional layout and subtle accent color.</p>
          </Tip>

          <div>
            <FieldLabel>CV Layout Template</FieldLabel>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button onClick={() => set("layout", "classic")}
                className="px-4 py-3 rounded-xl text-sm transition-all text-left relative overflow-hidden"
                style={{ background: cv.layout === "classic" ? "rgba(61,179,113,0.08)" : "var(--bg-3)", border: `1px solid ${cv.layout === "classic" ? "var(--green)" : "var(--border)"}`, color: "var(--text-1)" }}>
                <div className="font-bold mb-1 flex justify-between items-center">Classic (2-Col) {cv.layout === "classic" && <CheckCircle2 className="w-4 h-4 text-green-500" />}</div>
                <div className="text-xs text-gray-500">Industry standard split design</div>
              </button>
              <button onClick={() => set("layout", "executive")}
                className="px-4 py-3 rounded-xl text-sm transition-all text-left relative overflow-hidden"
                style={{ background: cv.layout === "executive" ? "rgba(61,179,113,0.08)" : "var(--bg-3)", border: `1px solid ${cv.layout === "executive" ? "var(--green)" : "var(--border)"}`, color: "var(--text-1)" }}>
                <div className="font-bold mb-1 flex justify-between items-center">Executive (1-Col) {cv.layout === "executive" && <CheckCircle2 className="w-4 h-4 text-green-500" />}</div>
                <div className="text-xs text-gray-500">Elite single-column styling</div>
              </button>
            </div>
          </div>
"""
code = code.replace(
    '''      /* ── Appearance ── */
      case 8: return (
        <div className="space-y-6">
          <Tip>
            <p className="font-bold mb-1" style={{ color: "var(--green)" }}>First impressions matter.</p>
            <p>Your CV is visually scanned in 6 seconds. Pick a clean, professional ATS-friendly font and a subtle accent color.</p>
          </Tip>''',
    appearance_str
)

# 5. Framer motion transitions inside renderStep
code = code.replace(
    '{renderStep()}',
    '<AnimatePresence mode="wait">\n                  <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>\n                    {renderStep()}\n                  </motion.div>\n                </AnimatePresence>'
)

# 6. Hero aesthetic overhaul (Glassmorphism + Neon)
old_hero = '''      {/* ── Page header ── */}
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
      </div>'''

new_hero = '''      {/* ── Page header (DREAM AESTHETIC) ── */}
      <div className="relative px-5 sm:px-8 md:px-16 pt-24 sm:pt-[110px] pb-10 sm:pb-[60px] overflow-hidden" style={{ background: "linear-gradient(to bottom, var(--bg) 0%, var(--bg-2) 100%)", borderBottom: "1px solid var(--border)" }}>
        {/* Glow meshes */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: "rgba(61,179,113,0.1)", border: "1px solid rgba(61,179,113,0.3)" }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--green)" }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk)" }}>Built for Big 4 Induction</span>
            </div>
            <h1 className="font-display font-bold mb-4 leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem,6vw,3.8rem)", color: "var(--text-1)" }}>
              Craft a CV that <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Partners cannot ignore.</span>
            </h1>
            <p className="text-sm sm:text-base mb-6" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.6 }}>
              Experience the pinnacle of CV building. Engineered exclusively for CA trainees, featuring dynamic ATS scoring and pristine MBB-tier printable layouts. 100% free forever.
            </p>
            {/* Demo notice */}
            {cv.name !== "" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-start gap-2 rounded-xl px-4 py-3 text-sm backdrop-blur-md shadow-sm" style={{ background: "rgba(61,179,113,0.05)", border: "1px solid rgba(61,179,113,0.2)", color: "var(--text-2)" }}>
                <span className="pt-0.5" style={{ color: "var(--green)" }}><CheckCircle2 className="w-4 h-4" /></span>
                <span>The optimal workflow: Edit the loaded sample step by step.</span>
              </motion.div>
            )}
          </div>
          
          <div className="hidden md:block pb-2">
            <ATSScoreRing score={getCVScore(cv)} />
          </div>
        </div>
      </div>'''
code = code.replace(old_hero, new_hero)

# 7. Form box glassmorphism
code = code.replace(
    '<div className="rounded-2xl" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>',
    '<div className="rounded-2xl shadow-xl backdrop-blur-xl relative overflow-hidden" style={{ background: "rgba(var(--bg-2-rgb), 0.7)", border: "1px solid rgba(var(--border-rgb), 0.5)", borderColor: "var(--border)" }}>\n              {/* Top glow line */}\n              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />'
)

# 8. Render Mobile ATS Score too
code = code.replace(
    '{/* Form top bar: step pills + Start Fresh */}',
    '<div className="md:hidden p-4 border-b border-[var(--border)]"><ATSScoreRing score={getCVScore(cv)} /></div>\n              {/* Form top bar: step pills + Start Fresh */}'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print("CV Maker completely rewritten safely")
