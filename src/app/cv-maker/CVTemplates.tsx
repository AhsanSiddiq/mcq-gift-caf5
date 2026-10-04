/* eslint-disable @next/next/no-img-element -- CV photos are user-uploaded data URLs rendered into the PDF */
import React from "react";
import {
  type CVData, type SectionId, atsBlocks, filled, hasSectionContent, headline, qualOf, qualSummary, visibleSections,
} from "./cvData";

/*
 * CV templates. Everything renders inside a 794px-wide (210mm) sheet with inline styles only:
 * html2canvas (PDF export) can't read Tailwind v4's oklch colours, and inline px sizes keep
 * the preview and the PDF identical. Sections render in the CV's chosen order.
 *
 * Elements marked data-pdf-heading are kept with the content that follows them when the
 * PDF exporter chooses page breaks.
 */

export const A4_W = 794;
export const A4_H = 1123;

// At 96 dpi: 1mm ≈ 3.78px, so 10px ≈ 7.5pt. Print-readable body sizes (~9-11pt).
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
  section: "var(--gap-section)",
  entry: "var(--gap-entry)",
  bullet: "var(--gap-bullet)",
};

export const getGaps = (s?: "compact" | "normal" | "relaxed") => {
  if (s === "compact") return { section: 12, entry: 10, bullet: 2 };
  if (s === "relaxed") return { section: 22, entry: 18, bullet: 6 };
  return { section: 16, entry: 13, bullet: 4 }; // normal
};

function rootStyle(cv: CVData, extra: React.CSSProperties = {}): React.CSSProperties {
  const gaps = getGaps(cv.spacing);
  return {
    fontFamily: cv.fontFamily,
    background: "#ffffff",
    color: "#1a1a1a",
    "--cv-accent": cv.themeColor,
    "--gap-section": `${gaps.section}px`,
    "--gap-entry": `${gaps.entry}px`,
    "--gap-bullet": `${gaps.bullet}px`,
    width: A4_W,
    minHeight: A4_H,
    boxSizing: "border-box",
    margin: "0 auto",
    position: "relative",
    ...extra,
  } as React.CSSProperties;
}

const rowBetween: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "2px 8px" };

/* ══════════ Shared atoms (Classic / Executive — unchanged look) ══════════ */

function SectionHead({ title, side = "right" }: { title: string; side?: "left" | "right" }) {
  const isRight = side === "right";
  return (
    <div data-pdf-heading="" style={{
      fontFamily: "'Arial Black','Arial',sans-serif",
      fontWeight: 900,
      fontSize: isRight ? SZ.sectionR : SZ.sectionL,
      letterSpacing: isRight ? 1.8 : 1.5,
      textTransform: "uppercase",
      paddingBottom: 4,
      marginBottom: 8,
      borderBottom: isRight ? "2.5px solid var(--cv-accent)" : "1.5px solid var(--cv-accent)",
      color: "var(--cv-accent)",
    }}>
      {title}
    </div>
  );
}

function Bullet({ text, size = SZ.body, mark = "•" }: { text: string; size?: number; mark?: string }) {
  return (
    <div style={{ display: "flex", gap: 7, marginBottom: GAP.bullet }}>
      <span style={{ fontSize: size, color: "#444", flexShrink: 0, marginTop: 1 }}>{mark}</span>
      <span style={{ fontSize: size, lineHeight: 1.55, color: "#222" }}>{text}</span>
    </div>
  );
}

const achievementsTitle = (cv: CVData, long = true) =>
  filled.work(cv).length ? (long ? "Accomplishments & Achievements" : "Accomplishments") : "Projects & Extracurriculars";

/* ══════════ CLASSIC (original two-column) ══════════ */

const CLASSIC_SIDEBAR: SectionId[] = ["qualification", "certifications", "skills", "languages", "references"];

function classicSection(cv: CVData, s: SectionId, side: "left" | "right"): React.ReactNode {
  const q = qualOf(cv);
  switch (s) {
    case "qualification":
      return (
        <div style={{ marginBottom: GAP.section, padding: "8px 10px", background: "#f4f4f4", borderLeft: "3.5px solid #1a1a1a" }}>
          {cv.crn && <p style={{ fontSize: SZ.subHead, fontWeight: 700, marginBottom: 3 }}>{q.idLabel}: {cv.crn}</p>}
          {cv.papersCleared && <p style={{ fontSize: SZ.body, color: "#333", lineHeight: 1.5 }}>{cv.papersCleared}</p>}
          {!!cv.papersPassed?.length && <p style={{ fontSize: SZ.small, color: "#333", lineHeight: 1.5, marginTop: 3 }}><b>Passed:</b> {cv.papersPassed.join(", ")}</p>}
        </div>
      );
    case "certifications":
      return (
        <div style={{ marginBottom: GAP.section }}>
          <SectionHead title="Certifications" side={side} />
          {filled.list(cv.certifications).map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 7 }}>
              <span style={{ fontSize: SZ.body, color: "#333", flexShrink: 0, marginTop: 1 }}>■</span>
              <span style={{ fontSize: SZ.body, lineHeight: 1.5, color: "#222" }}>{c}</span>
            </div>
          ))}
        </div>
      );
    case "skills": {
      const block = (title: string, items: string[]) => items.length > 0 && (
        <div style={{ marginBottom: GAP.section }}>
          <SectionHead title={title} side={side} />
          {items.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: SZ.body, color: "#555", flexShrink: 0 }}>▸</span>
              <span style={{ fontSize: SZ.body, color: "#222", lineHeight: 1.5 }}>{e}</span>
            </div>
          ))}
        </div>
      );
      return <>{block("IT & Technical", filled.list(cv.expertise))}{block("Core Skills", filled.list(cv.skills))}</>;
    }
    case "languages":
      return (
        <div style={{ marginBottom: GAP.section }}>
          <SectionHead title="Languages" side={side} />
          {filled.list(cv.languages).map((l, i) => <p key={i} style={{ fontSize: SZ.body, color: "#222", marginBottom: 5, lineHeight: 1.4 }}>{l}</p>)}
        </div>
      );
    case "references":
      return (
        <div style={{ marginBottom: GAP.section }}>
          <SectionHead title="References" side={side} />
          <p style={{ fontSize: SZ.body, color: "#555", fontStyle: "italic", lineHeight: 1.5 }}>{cv.references}</p>
        </div>
      );
    case "profile":
      return (
        <div style={{ marginBottom: GAP.section }}>
          <SectionHead title="Professional Profile" side={side} />
          <p style={{ fontSize: SZ.body, lineHeight: 1.65, color: "#222", textAlign: "justify" }}>{cv.profile}</p>
        </div>
      );
    case "education":
      return (
        <div style={{ marginBottom: GAP.section }}>
          <SectionHead title="Education" side={side} />
          {filled.education(cv).map((ed, i) => (
            <div key={i} style={{ marginBottom: GAP.entry }}>
              <div style={{ ...rowBetween, marginBottom: 2 }}>
                <span style={{ fontSize: SZ.entryHead, fontWeight: 700 }}>{ed.level}</span>
                {ed.years && <span style={{ fontSize: SZ.small, color: "#555", fontStyle: "italic", whiteSpace: "nowrap" }}>{ed.years}</span>}
              </div>
              {ed.institution && <p style={{ fontSize: SZ.subHead, color: "#444", marginBottom: 3 }}>{ed.institution}</p>}
              {ed.grade && <Bullet text={ed.grade} />}
            </div>
          ))}
        </div>
      );
    case "experience":
      return (
        <div style={{ marginBottom: GAP.section }}>
          <SectionHead title="Work Experience" side={side} />
          {filled.work(cv).map((w, i) => (
            <div key={i} style={{ marginBottom: GAP.entry }}>
              <div style={{ ...rowBetween, marginBottom: 2 }}>
                <span style={{ fontSize: SZ.entryHead, fontWeight: 700 }}>{w.company}</span>
                <span style={{ fontSize: SZ.small, color: "#555", fontStyle: "italic" }}>{w.period}</span>
              </div>
              {w.role && <p style={{ fontSize: SZ.subHead, color: "#444", marginBottom: 5 }}>{w.role}</p>}
              {filled.list(w.bullets).map((b, j) => <Bullet key={j} text={b} />)}
            </div>
          ))}
        </div>
      );
    case "courses":
      return (
        <div style={{ marginBottom: GAP.section }}>
          <SectionHead title="Courses & Training" side={side} />
          {filled.courses(cv).map((c, i) => (
            <div key={i} style={{ ...rowBetween, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: SZ.subHead, fontWeight: 700, color: "#1a1a1a" }}>{c.name}</span>
                {c.provider && <span style={{ fontSize: SZ.small, color: "#555" }}>{" — "}{c.provider}</span>}
              </div>
              {c.year && <span style={{ fontSize: SZ.small, color: "#777", fontStyle: "italic", whiteSpace: "nowrap" }}>{c.year}</span>}
            </div>
          ))}
        </div>
      );
    case "achievements":
      return (
        <div style={{ marginBottom: GAP.section }}>
          <SectionHead title={achievementsTitle(cv)} side={side} />
          {filled.list(cv.accomplishments).map((a, i) => <div key={i} style={{ marginBottom: 7 }}><Bullet text={a} /></div>)}
        </div>
      );
  }
}

function ClassicCV({ cv, order }: { cv: CVData; order: SectionId[] }) {
  // Profile sits full-width under the header when it comes first (the original layout).
  const topProfile = order[0] === "profile";
  const rest = topProfile ? order.slice(1) : order;
  const left = rest.filter(s => CLASSIC_SIDEBAR.includes(s));
  const right = rest.filter(s => !CLASSIC_SIDEBAR.includes(s));
  return (
    <div data-cv-root="" style={rootStyle(cv, { padding: "13mm 15mm 12mm 15mm", display: "flex", flexDirection: "column" })}>
      <div style={{ paddingBottom: 12, marginBottom: 13, borderBottom: "3px solid var(--cv-accent)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
          {cv.photo && (
            <img src={cv.photo} alt="" style={{ width: 84, height: 84, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0, border: "2px solid #ccc" }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Arial Black','Arial',sans-serif", fontSize: SZ.name, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2.5, lineHeight: 1.1, marginBottom: 5, wordBreak: "break-word" }}>
              {cv.name || "YOUR FULL NAME"}
            </div>
            <div style={{ fontSize: SZ.stage, fontWeight: 400, color: "#444", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }}>
              {headline(cv)}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
              {cv.phone && <span style={{ fontSize: SZ.contact, color: "#333" }}>Tel: {cv.phone}</span>}
              {cv.email && <span style={{ fontSize: SZ.contact, color: "#333" }}>Email: {cv.email}</span>}
              {cv.linkedin && <span style={{ fontSize: SZ.contact, color: "#333" }}>LinkedIn: {cv.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>

      {topProfile && classicSection(cv, "profile", "right")}

      <div style={{ display: "flex", gap: 18, flex: 1 }}>
        <div style={{ width: "34%", flexShrink: 0 }}>
          {left.map(s => <React.Fragment key={s}>{classicSection(cv, s, "left")}</React.Fragment>)}
        </div>
        <div style={{ flex: 1 }}>
          {right.map(s => <React.Fragment key={s}>{classicSection(cv, s, "right")}</React.Fragment>)}
        </div>
      </div>
    </div>
  );
}

/* ══════════ EXECUTIVE (original single-column) ══════════ */

function executiveSection(cv: CVData, s: SectionId): React.ReactNode {
  switch (s) {
    case "profile":
      return (
        <div style={{ marginBottom: 16 }}>
          <SectionHead title="Professional Profile" side="left" />
          <p style={{ fontSize: SZ.body, lineHeight: 1.6, color: "#222", textAlign: "justify" }}>{cv.profile}</p>
        </div>
      );
    case "qualification":
      // Stage / ID / highlights are already in the header; only the papers list adds information.
      return !!cv.papersPassed?.length && (
        <div style={{ marginBottom: 16 }}>
          <SectionHead title="Papers Passed" side="left" />
          <p style={{ fontSize: SZ.body, color: "#222" }}>{cv.papersPassed.join(" · ")}</p>
        </div>
      );
    case "experience":
      return (
        <div style={{ marginBottom: 16 }}>
          <SectionHead title="Professional Experience" side="left" />
          {filled.work(cv).map((w, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: SZ.entryHead, fontWeight: 700 }}>{w.company}</span>
                <span style={{ fontSize: SZ.small, color: "#555", fontStyle: "italic" }}>{w.period}</span>
              </div>
              {w.role && <p style={{ fontSize: SZ.subHead, fontStyle: "italic", marginBottom: 3, color: "#444" }}>{w.role}</p>}
              {filled.list(w.bullets).map((b, j) => <Bullet key={j} text={b} />)}
            </div>
          ))}
        </div>
      );
    case "education":
      return (
        <div style={{ marginBottom: 16 }}>
          <SectionHead title="Education & Qualifications" side="left" />
          {filled.education(cv).map((ed, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: SZ.entryHead, fontWeight: 700 }}>{ed.level} {ed.institution && <span style={{ fontWeight: 400 }}>— {ed.institution}</span>}</span>
                <span style={{ fontSize: SZ.small, color: "#555", fontStyle: "italic" }}>{ed.years}</span>
              </div>
              {ed.grade && <p style={{ fontSize: SZ.body, color: "#333", marginTop: 1 }}>{ed.grade}</p>}
            </div>
          ))}
        </div>
      );
    case "courses":
      return (
        <div style={{ flex: 1 }}>
          <SectionHead title="Courses & Training" side="left" />
          {filled.courses(cv).map((c, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: SZ.subHead }}>{c.name}</span>
              {c.provider && <span style={{ fontSize: SZ.small, color: "#555" }}> — {c.provider}</span>}
            </div>
          ))}
        </div>
      );
    case "skills":
      return (
        <div style={{ flex: 1 }}>
          <SectionHead title="Skills & Expertise" side="left" />
          {filled.list(cv.expertise).length > 0 && <div style={{ marginBottom: 4 }}><strong>Technical:</strong> {filled.list(cv.expertise).join(", ")}</div>}
          {filled.list(cv.skills).length > 0 && <div><strong>Soft Skills:</strong> {filled.list(cv.skills).join(", ")}</div>}
        </div>
      );
    case "achievements":
      return (
        <div style={{ marginBottom: 16 }}>
          <SectionHead title={achievementsTitle(cv, false)} side="left" />
          {filled.list(cv.accomplishments).map((a, i) => <div key={i} style={{ marginBottom: 4 }}><Bullet text={a} /></div>)}
        </div>
      );
    case "certifications":
      return (
        <div style={{ marginBottom: 16 }}>
          <SectionHead title="Certifications" side="left" />
          {filled.list(cv.certifications).map((c, i) => <Bullet key={i} text={c} />)}
        </div>
      );
    case "languages":
      return (
        <div style={{ marginBottom: 16 }}>
          <SectionHead title="Languages" side="left" />
          <p style={{ fontSize: SZ.body }}>{filled.list(cv.languages).join(" · ")}</p>
        </div>
      );
    case "references":
      return (
        <div style={{ marginBottom: 16 }}>
          <SectionHead title="References" side="left" />
          <p style={{ fontSize: SZ.body, fontStyle: "italic", color: "#555" }}>{cv.references}</p>
        </div>
      );
  }
}

function ExecutiveCV({ cv, order }: { cv: CVData; order: SectionId[] }) {
  // Courses + Skills sit side by side when adjacent (the original layout).
  const blocks: React.ReactNode[] = [];
  for (let i = 0; i < order.length; i++) {
    const s = order[i], n = order[i + 1];
    const pair = (s === "courses" && n === "skills") || (s === "skills" && n === "courses");
    if (pair) {
      blocks.push(<div key={s + n} style={{ display: "flex", gap: 20, marginBottom: 16 }}>{executiveSection(cv, s)}{executiveSection(cv, n)}</div>);
      i++;
    } else if (s === "courses" || s === "skills") {
      blocks.push(<div key={s} style={{ display: "flex", marginBottom: 16 }}>{executiveSection(cv, s)}</div>);
    } else {
      blocks.push(<React.Fragment key={s}>{executiveSection(cv, s)}</React.Fragment>);
    }
  }
  return (
    <div data-cv-root="" style={rootStyle(cv, { padding: "15mm 18mm", fontSize: 10 })}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontFamily: "'Arial Black','Arial',sans-serif", color: "var(--cv-accent)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>{cv.name}</h1>
        <div style={{ fontSize: SZ.small, color: "#333", display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
          {cv.phone && <span>{cv.phone}</span>}
          {cv.phone && cv.email && <span>|</span>}
          {cv.email && <span>{cv.email}</span>}
          {cv.linkedin && <><span>|</span><span>{cv.linkedin}</span></>}
        </div>
        {(cv.icapStage || cv.papersCleared) && <div style={{ fontStyle: "italic", color: "#444" }}>{qualSummary(cv)}</div>}
        <div style={{ borderBottom: "1.5px solid var(--cv-accent)", marginTop: 8 }} />
      </div>
      {blocks}
    </div>
  );
}

/* ══════════ MODERN ══════════ */

const MODERN_SIDE: SectionId[] = ["qualification", "skills", "certifications", "languages", "references"];

function ModernHead({ title }: { title: string }) {
  return (
    <div data-pdf-heading="" style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: "var(--cv-accent)" }}>{title}</div>
      <div style={{ width: 28, height: 2.5, background: "var(--cv-accent)", marginTop: 4, borderRadius: 2 }} />
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {items.map((x, i) => (
        <span key={i} style={{ fontSize: SZ.tag, lineHeight: 1.3, padding: "3px 7px", borderRadius: 4, background: "#ffffff", border: "1px solid #d9dce1", color: "#222" }}>{x}</span>
      ))}
    </div>
  );
}

function modernSection(cv: CVData, s: SectionId): React.ReactNode {
  const q = qualOf(cv);
  const wrap = (title: string, body: React.ReactNode) => <div style={{ marginBottom: GAP.section }}><ModernHead title={title} />{body}</div>;
  switch (s) {
    case "profile": return wrap("Profile", <p style={{ fontSize: SZ.body, lineHeight: 1.65, color: "#2a2a2a" }}>{cv.profile}</p>);
    case "qualification":
      return wrap(q.label, (
        <div style={{ fontSize: SZ.body, color: "#222", lineHeight: 1.5 }}>
          <div style={{ fontWeight: 700 }}>{cv.icapStage}</div>
          {cv.crn && <div>{q.idLabel}: {cv.crn}</div>}
          {q.hasFts && cv.fts && <div>FTS: {cv.fts}</div>}
          {cv.papersCleared && <div style={{ marginTop: 3 }}>{cv.papersCleared}</div>}
          {!!cv.papersPassed?.length && <div style={{ marginTop: 6 }}><Chips items={cv.papersPassed} /></div>}
        </div>
      ));
    case "education":
      return wrap("Education", filled.education(cv).map((ed, i) => (
        <div key={i} style={{ marginBottom: GAP.entry }}>
          <div style={rowBetween}>
            <span style={{ fontSize: SZ.entryHead, fontWeight: 700 }}>{ed.level}</span>
            {ed.years && <span style={{ fontSize: SZ.small, color: "#666", whiteSpace: "nowrap" }}>{ed.years}</span>}
          </div>
          {ed.institution && <div style={{ fontSize: SZ.subHead, color: "var(--cv-accent)", marginTop: 1 }}>{ed.institution}</div>}
          {ed.grade && <div style={{ fontSize: SZ.body, color: "#333", marginTop: 2 }}>{ed.grade}</div>}
        </div>
      )));
    case "experience":
      return wrap("Experience", filled.work(cv).map((w, i) => (
        <div key={i} style={{ marginBottom: GAP.entry }}>
          <div style={rowBetween}>
            <span style={{ fontSize: SZ.entryHead, fontWeight: 700 }}>{w.role || w.company}</span>
            <span style={{ fontSize: SZ.small, color: "#666", whiteSpace: "nowrap" }}>{w.period}</span>
          </div>
          {w.role && <div style={{ fontSize: SZ.subHead, color: "var(--cv-accent)", marginBottom: 4, marginTop: 1 }}>{w.company}</div>}
          {filled.list(w.bullets).map((b, j) => <Bullet key={j} text={b} />)}
        </div>
      )));
    case "courses":
      return wrap("Courses & Training", filled.courses(cv).map((c, i) => (
        <div key={i} style={{ ...rowBetween, marginBottom: 6 }}>
          <span style={{ fontSize: SZ.body, flex: 1 }}><b>{c.name}</b>{c.provider && <span style={{ color: "#555" }}> · {c.provider}</span>}</span>
          {c.year && <span style={{ fontSize: SZ.small, color: "#666" }}>{c.year}</span>}
        </div>
      )));
    case "achievements": return wrap(achievementsTitle(cv, false), filled.list(cv.accomplishments).map((a, i) => <Bullet key={i} text={a} />));
    case "skills":
      return (
        <>
          {filled.list(cv.expertise).length > 0 && wrap("Technical", <Chips items={filled.list(cv.expertise)} />)}
          {filled.list(cv.skills).length > 0 && wrap("Core Skills", <Chips items={filled.list(cv.skills)} />)}
        </>
      );
    case "certifications": return wrap("Certifications", filled.list(cv.certifications).map((c, i) => <Bullet key={i} text={c} mark="✓" />));
    case "languages": return wrap("Languages", filled.list(cv.languages).map((l, i) => <div key={i} style={{ fontSize: SZ.body, marginBottom: 3 }}>{l}</div>));
    case "references": return wrap("References", <p style={{ fontSize: SZ.body, color: "#555", fontStyle: "italic" }}>{cv.references}</p>);
  }
}

function ModernCV({ cv, order }: { cv: CVData; order: SectionId[] }) {
  const topProfile = order[0] === "profile";
  const rest = topProfile ? order.slice(1) : order;
  const side = rest.filter(s => MODERN_SIDE.includes(s));
  const main = rest.filter(s => !MODERN_SIDE.includes(s));
  const contacts = [cv.phone, cv.email, cv.linkedin].filter(Boolean);
  return (
    <div data-cv-root="" style={rootStyle(cv, { padding: 0 })}>
      <div style={{ background: "var(--cv-accent)", color: "#ffffff", padding: "11mm 15mm 9mm", display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 0.5, lineHeight: 1.1, wordBreak: "break-word" }}>{cv.name || "Your Full Name"}</div>
          <div style={{ fontSize: 11.5, letterSpacing: 1.8, textTransform: "uppercase", opacity: 0.85, marginTop: 6 }}>{headline(cv)}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 16px", marginTop: 10, fontSize: SZ.contact, opacity: 0.95 }}>
            {contacts.map((c, i) => <span key={i}>{c}</span>)}
          </div>
        </div>
        {cv.photo && <img src={cv.photo} alt="" style={{ width: 86, height: 86, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "3px solid rgba(255,255,255,0.85)", flexShrink: 0 }} />}
      </div>
      <div style={{ padding: "8mm 15mm 12mm" }}>
        {topProfile && modernSection(cv, "profile")}
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>{main.map(s => <React.Fragment key={s}>{modernSection(cv, s)}</React.Fragment>)}</div>
          {side.length > 0 && (
            <div style={{ width: "34%", flexShrink: 0, background: "#f4f5f7", borderRadius: 6, padding: "12px 12px 2px", alignSelf: "flex-start" }}>
              {side.map(s => <React.Fragment key={s}>{modernSection(cv, s)}</React.Fragment>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════ COMPACT ══════════ */

const C = { body: 9.5, small: 9, head: 10.5 };

function compactSection(cv: CVData, s: SectionId): React.ReactNode {
  const q = qualOf(cv);
  const titles: Record<SectionId, string> = {
    profile: "Profile", qualification: q.label, education: "Education", experience: "Experience", courses: "Courses",
    skills: "Skills", certifications: "Certifications", languages: "Languages", achievements: filled.work(cv).length ? "Achievements" : "Activities", references: "References",
  };
  let body: React.ReactNode;
  const line = (label: string, text: string) => <div style={{ fontSize: C.body, lineHeight: 1.5 }}><b>{label}:</b> {text}</div>;
  const dot = (text: string, i: number) => (
    <div key={i} style={{ display: "flex", gap: 6, fontSize: C.body, lineHeight: 1.5, marginBottom: GAP.bullet }}>
      <span style={{ color: "var(--cv-accent)" }}>•</span><span>{text}</span>
    </div>
  );
  switch (s) {
    case "profile": body = <p style={{ fontSize: C.body, lineHeight: 1.55 }}>{cv.profile}</p>; break;
    case "qualification":
      body = (
        <>
          {line("Stage", cv.icapStage)}
          {cv.crn && line(q.idLabel, cv.crn)}
          {q.hasFts && cv.fts && line("FTS", cv.fts)}
          {!!cv.papersPassed?.length && line("Passed", cv.papersPassed.join(", "))}
          {cv.papersCleared && <div style={{ fontSize: C.body }}>{cv.papersCleared}</div>}
        </>
      );
      break;
    case "education":
      body = filled.education(cv).map((e, i) => (
        <div key={i} style={{ marginBottom: 4 }}>
          <div style={rowBetween}>
            <span style={{ fontSize: C.body }}><b>{e.level}</b>{e.institution && <> — {e.institution}</>}</span>
            <span style={{ fontSize: C.small, color: "#666" }}>{e.years}</span>
          </div>
          {e.grade && <div style={{ fontSize: C.small, color: "#444" }}>{e.grade}</div>}
        </div>
      ));
      break;
    case "experience":
      body = filled.work(cv).map((w, i) => (
        <div key={i} style={{ marginBottom: GAP.entry }}>
          <div style={rowBetween}>
            <span style={{ fontSize: C.body }}><b>{w.company}</b>{w.role && <> — <i>{w.role}</i></>}</span>
            <span style={{ fontSize: C.small, color: "#666" }}>{w.period}</span>
          </div>
          {filled.list(w.bullets).map(dot)}
        </div>
      ));
      break;
    case "courses":
      body = filled.courses(cv).map((c, i) => (
        <div key={i} style={{ ...rowBetween, fontSize: C.body, lineHeight: 1.5 }}>
          <span><b>{c.name}</b>{c.provider && <> — {c.provider}</>}</span><span style={{ fontSize: C.small, color: "#666" }}>{c.year}</span>
        </div>
      ));
      break;
    case "skills":
      body = <>{filled.list(cv.expertise).length > 0 && line("Technical", filled.list(cv.expertise).join(" · "))}{filled.list(cv.skills).length > 0 && line("Core", filled.list(cv.skills).join(" · "))}</>;
      break;
    case "certifications": body = filled.list(cv.certifications).map(dot); break;
    case "languages": body = <div style={{ fontSize: C.body }}>{filled.list(cv.languages).join(" · ")}</div>; break;
    case "achievements": body = filled.list(cv.accomplishments).map(dot); break;
    case "references": body = <div style={{ fontSize: C.body, fontStyle: "italic", color: "#555" }}>{cv.references}</div>; break;
  }
  return (
    <div style={{ display: "flex", gap: 14, paddingTop: 7, marginBottom: `calc(${GAP.section} - 7px)`, borderTop: "1px solid #e3e3e3" }}>
      <div data-pdf-heading="" style={{ width: 92, flexShrink: 0, fontSize: C.head, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--cv-accent)", lineHeight: 1.4 }}>{titles[s]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>{body}</div>
    </div>
  );
}

function CompactCV({ cv, order }: { cv: CVData; order: SectionId[] }) {
  return (
    <div data-cv-root="" style={rootStyle(cv, { padding: "11mm 13mm 10mm" })}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, paddingBottom: 8, marginBottom: 10, borderBottom: "2.5px solid var(--cv-accent)" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--cv-accent)", lineHeight: 1.1, wordBreak: "break-word" }}>{cv.name || "Your Full Name"}</div>
          <div style={{ fontSize: 10.5, color: "#444", marginTop: 4, letterSpacing: 0.6 }}>{headline(cv)}</div>
        </div>
        <div style={{ textAlign: "right", fontSize: C.small, color: "#333", lineHeight: 1.55, flexShrink: 0 }}>
          {cv.phone && <div>{cv.phone}</div>}
          {cv.email && <div>{cv.email}</div>}
          {cv.linkedin && <div>{cv.linkedin}</div>}
        </div>
      </div>
      {order.map(s => <React.Fragment key={s}>{compactSection(cv, s)}</React.Fragment>)}
    </div>
  );
}

/* ══════════ ELEGANT ══════════ */

const SERIF = "'Georgia','Times New Roman',serif";

function ElegantHead({ title }: { title: string }) {
  return (
    <div data-pdf-heading="" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{ flex: 1, height: 1, background: "var(--cv-accent)", opacity: 0.5 }} />
      <div style={{ fontFamily: SERIF, fontSize: 11.5, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--cv-accent)" }}>{title}</div>
      <div style={{ flex: 1, height: 1, background: "var(--cv-accent)", opacity: 0.5 }} />
    </div>
  );
}

function elegantSection(cv: CVData, s: SectionId): React.ReactNode {
  const q = qualOf(cv);
  const wrap = (title: string, body: React.ReactNode) => <div style={{ marginBottom: GAP.section }}><ElegantHead title={title} />{body}</div>;
  const entry = (title: React.ReactNode, right: string, sub?: string) => (
    <>
      <div style={rowBetween}><span style={{ fontFamily: SERIF, fontSize: 11.5, fontWeight: 700 }}>{title}</span><span style={{ fontSize: SZ.small, fontStyle: "italic", color: "#555" }}>{right}</span></div>
      {sub && <div style={{ fontSize: SZ.subHead, fontStyle: "italic", color: "#444", marginBottom: 3 }}>{sub}</div>}
    </>
  );
  switch (s) {
    case "profile": return wrap("Profile", <p style={{ fontSize: SZ.body, lineHeight: 1.7, textAlign: "center", color: "#2a2a2a", padding: "0 6mm" }}>{cv.profile}</p>);
    case "qualification":
      return wrap("Professional Qualification", (
        <div style={{ textAlign: "center", fontSize: SZ.body, lineHeight: 1.6 }}>
          <div><b>{q.full}</b></div>
          <div>{[cv.icapStage, cv.crn && `${q.idLabel} ${cv.crn}`, q.hasFts && cv.fts && `FTS ${cv.fts}`].filter(Boolean).join("  ·  ")}</div>
          {cv.papersCleared && <div style={{ fontStyle: "italic" }}>{cv.papersCleared}</div>}
          {!!cv.papersPassed?.length && <div style={{ color: "#444" }}>Papers passed: {cv.papersPassed.join(", ")}</div>}
        </div>
      ));
    case "education": return wrap("Education", filled.education(cv).map((e, i) => <div key={i} style={{ marginBottom: GAP.entry }}>{entry(e.level, e.years, [e.institution, e.grade].filter(Boolean).join(" — "))}</div>));
    case "experience": return wrap("Experience", filled.work(cv).map((w, i) => <div key={i} style={{ marginBottom: GAP.entry }}>{entry(w.company, w.period, w.role)}{filled.list(w.bullets).map((b, j) => <Bullet key={j} text={b} mark="–" />)}</div>));
    case "courses": return wrap("Courses & Training", filled.courses(cv).map((c, i) => <div key={i} style={{ ...rowBetween, fontSize: SZ.body, marginBottom: 4 }}><span><b>{c.name}</b>{c.provider && <i style={{ color: "#555" }}>, {c.provider}</i>}</span><span style={{ fontStyle: "italic", color: "#555" }}>{c.year}</span></div>));
    case "achievements": return wrap(filled.work(cv).length ? "Achievements" : "Activities & Achievements", filled.list(cv.accomplishments).map((a, i) => <Bullet key={i} text={a} mark="–" />));
    case "skills":
      return wrap("Skills", (
        <div style={{ fontSize: SZ.body, lineHeight: 1.6 }}>
          {filled.list(cv.expertise).length > 0 && <div><b>Technical — </b>{filled.list(cv.expertise).join(", ")}</div>}
          {filled.list(cv.skills).length > 0 && <div><b>Professional — </b>{filled.list(cv.skills).join(", ")}</div>}
        </div>
      ));
    case "certifications": return wrap("Certifications", filled.list(cv.certifications).map((c, i) => <Bullet key={i} text={c} mark="–" />));
    case "languages": return wrap("Languages", <div style={{ fontSize: SZ.body, textAlign: "center" }}>{filled.list(cv.languages).join("  ·  ")}</div>);
    case "references": return wrap("References", <div style={{ fontSize: SZ.body, textAlign: "center", fontStyle: "italic" }}>{cv.references}</div>);
  }
}

function ElegantCV({ cv, order }: { cv: CVData; order: SectionId[] }) {
  const contacts = [cv.phone, cv.email, cv.linkedin].filter(Boolean);
  return (
    <div data-cv-root="" style={rootStyle(cv, { padding: "15mm 18mm 13mm" })}>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontFamily: SERIF, fontSize: 28, letterSpacing: 3, textTransform: "uppercase", color: "var(--cv-accent)", lineHeight: 1.15 }}>{cv.name || "Your Full Name"}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 12, color: "#444", marginTop: 5 }}>{headline(cv)}</div>
        <div style={{ borderTop: "1px solid var(--cv-accent)", borderBottom: "1px solid var(--cv-accent)", padding: "5px 0", marginTop: 10, fontSize: SZ.contact, color: "#333", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2px 14px" }}>
          {contacts.map((c, i) => <span key={i}>{c}</span>)}
        </div>
      </div>
      {order.map(s => <React.Fragment key={s}>{elegantSection(cv, s)}</React.Fragment>)}
    </div>
  );
}

/* ══════════ ATS-FRIENDLY ══════════ */

function ATSCV({ cv }: { cv: CVData }) {
  const blocks = atsBlocks(cv);
  const contacts = [cv.phone, cv.email, cv.linkedin].filter(Boolean).join(" | ");
  const base: React.CSSProperties = { fontSize: 10.5, lineHeight: 1.42, color: "#000" };
  return (
    <div data-cv-root="" style={rootStyle(cv, { fontFamily: "Arial, Helvetica, sans-serif", padding: "14mm 15mm", color: "#000" })}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{cv.name || "Your Full Name"}</div>
      {cv.icapStage && <div style={{ ...base, fontSize: 11.5, marginTop: 2 }}>{cv.icapStage}</div>}
      {contacts && <div style={{ ...base, marginTop: 2 }}>{contacts}</div>}
      {blocks.map(b => (
        <div key={b.heading} style={{ marginTop: `calc(${GAP.section} - 4px)` }}>
          <div data-pdf-heading="" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #000", paddingBottom: 2, marginBottom: 6 }}>{b.heading}</div>
          {b.items.map((it, i) => {
            if (it.t === "para") return <p key={i} style={{ ...base, marginBottom: 4 }}>{it.text}</p>;
            if (it.t === "line") return <p key={i} style={{ ...base }}>{it.label && <b>{it.label}: </b>}{it.text}</p>;
            if (it.t === "bullet") return <div key={i} style={{ ...base, display: "flex", gap: 8, paddingLeft: 4 }}><span>•</span><span>{it.text}</span></div>;
            return <div key={i} style={{ ...base, display: "flex", justifyContent: "space-between", gap: 12, marginTop: i ? 6 : 0 }}><b>{it.title}</b>{it.right && <span>{it.right}</span>}</div>;
          })}
        </div>
      ))}
    </div>
  );
}

/* ══════════ Entry point ══════════ */

export function CVPreview({ cv }: { cv: CVData }) {
  if (cv.atsMode) return <ATSCV cv={cv} />;
  const order = visibleSections(cv).filter(s => hasSectionContent(cv, s) || (s === "qualification" && cv.layout !== "classic" && cv.layout !== "executive" && !!cv.icapStage));
  switch (cv.layout) {
    case "executive": return <ExecutiveCV cv={cv} order={order} />;
    case "modern": return <ModernCV cv={cv} order={order} />;
    case "compact": return <CompactCV cv={cv} order={order} />;
    case "elegant": return <ElegantCV cv={cv} order={order} />;
    default: return <ClassicCV cv={cv} order={order} />;
  }
}
