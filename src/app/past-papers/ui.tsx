import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  BODIES,
  PAST_PAPERS_UPDATED,
  fmtDate,
  fmtMarks,
  type BodyId,
  type Table,
  type WorkedExample,
} from "@/data/pastPapers";

export const BASE_URL = "https://www.thecahub.com";
export const heading: CSSProperties = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" };
export const card: CSSProperties = { background: "var(--bg-2)", border: "1px solid var(--border)" };
export const muted: CSSProperties = { color: "var(--text-3)" };
export const link: CSSProperties = { color: "var(--green)", textDecoration: "none" };

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function articleLd(opts: { headline: string; description: string; url: string; about?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline.slice(0, 110),
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    datePublished: PAST_PAPERS_UPDATED,
    dateModified: PAST_PAPERS_UPDATED,
    inLanguage: "en",
    isAccessibleForFree: true,
    ...(opts.about ? { about: { "@type": "Thing", name: opts.about } } : {}),
    author: { "@type": "Organization", name: "The CA Hub Editorial", url: BASE_URL },
    publisher: { "@type": "Organization", name: "The CA Hub", url: BASE_URL, logo: { "@type": "ImageObject", url: `${BASE_URL}/CAHub.png` } },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${BASE_URL}${it.path}` })),
  };
}

export function Crumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-6 flex flex-wrap items-center gap-x-2 gap-y-1" style={muted}>
      {items.map((it, i) => (
        <span key={it.name} className="inline-flex items-center gap-2">
          {i > 0 && <span aria-hidden>/</span>}
          {it.path ? (
            <Link href={it.path} style={{ color: "var(--text-3)", textDecoration: "none" }}>{it.name}</Link>
          ) : (
            <span style={{ color: "var(--text-2)" }}>{it.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
      {children}
    </p>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-bold mb-4" style={{ ...heading, fontSize: "clamp(1.7rem,4.5vw,2.75rem)", lineHeight: 1.12 }}>
      {children}
    </h1>
  );
}

export function Section({ id, title, intro, children }: { id: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 mb-12" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="font-bold text-xl sm:text-2xl mb-3" style={heading}>{title}</h2>
      {intro && <div className="mb-4 max-w-3xl">{intro}</div>}
      {children}
    </section>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-2.5 marker:text-[var(--green)]">
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ul>
  );
}

/** Table that scrolls horizontally inside its own container on small screens. */
export function ScrollTable({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={card} role="region" aria-label={label} tabIndex={0}>
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  );
}

export const th: CSSProperties = { textAlign: "left", padding: "10px 12px", color: "var(--text-1)", fontWeight: 700, borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" };
export const td: CSSProperties = { padding: "10px 12px", borderBottom: "1px solid var(--border)", verticalAlign: "top" };

export function DataTable({ table }: { table: Table }) {
  return (
    <ScrollTable label={table.caption}>
      <thead>
        <tr>{table.head.map((h, i) => <th key={i} style={th}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {table.rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => <td key={j} style={{ ...td, whiteSpace: j === 0 ? "normal" : "nowrap" }}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </ScrollTable>
  );
}

/** Horizontal bar used for marks and pass rates (pure CSS). */
export function Bar({ label, value, max, suffix = "", href, tone = "green" }: { label: ReactNode; value: number; max: number; suffix?: string; href?: string; tone?: "green" | "gold" | "bad" }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  const color = tone === "gold" ? "var(--gold)" : tone === "bad" ? "var(--bad)" : "var(--green)";
  const name = href ? <Link href={href} style={{ color: "var(--text-1)", textDecoration: "none" }}>{label}</Link> : label;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 items-center">
      <span className="text-sm truncate" style={{ color: "var(--text-1)" }}>{name}</span>
      <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-2)" }}>{fmtMarks(value)}{suffix}</span>
      <span className="col-span-2 h-2 rounded-full mt-1.5 mb-3 overflow-hidden" style={{ background: "var(--bg-3)" }} aria-hidden>
        <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </span>
    </div>
  );
}

export function ExtLink({ href, children, strong }: { href: string; children: ReactNode; strong?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 ${strong ? "font-semibold" : ""}`} style={link}>
      {children} <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden />
    </a>
  );
}

export function Example({ ex, collapsible = false }: { ex: WorkedExample; collapsible?: boolean }) {
  const solution = (
    <div className="space-y-4">
      {ex.solution.map((s, i) => (
        <div key={i}>
          {s.text && <p>{s.text}</p>}
          {s.table && <DataTable table={s.table} />}
        </div>
      ))}
      <p className="rounded-xl px-4 py-3 font-semibold" style={{ color: "var(--text-1)", background: "color-mix(in srgb, var(--green) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 30%, transparent)" }}>
        Answer: {ex.answer}
      </p>
    </div>
  );
  return (
    <div className="rounded-2xl p-5" style={card}>
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--green)" }}>Original practice question</p>
      <h3 className="font-bold text-lg mb-3" style={heading}>{ex.title}</h3>
      {ex.scenario.map((p, i) => <p key={i} className="mb-3">{p}</p>)}
      <p className="mb-4"><strong style={{ color: "var(--text-1)" }}>Required:</strong> {ex.required}</p>
      {collapsible ? (
        <details>
          <summary className="cursor-pointer font-semibold mb-3" style={{ color: "var(--green)" }}>Show worked solution</summary>
          {solution}
        </details>
      ) : (
        <>
          <p className="font-bold mb-3" style={heading}>Worked solution</p>
          {solution}
        </>
      )}
    </div>
  );
}

/** Attribution + disclaimer + last-updated, shown on every past-papers page. */
export function Attribution({ body, sourceUrl }: { body: BodyId; sourceUrl?: string }) {
  const b = BODIES[body];
  return (
    <aside className="rounded-2xl p-5 text-sm leading-relaxed mt-4" style={{ ...card, color: "var(--text-2)" }} aria-label="Source and disclaimer">
      <p className="font-semibold mb-2" style={{ color: "var(--text-1)" }}>
        Official papers and answers © {b.owner}; links go to the official source.
      </p>
      <p className="mb-2">
        We do not host or reproduce {b.short} question papers, suggested answers or examiners&apos; reports. This page holds factual
        metadata (sitting, question number, topic, marks, published pass rates), our own descriptions and analysis, and original
        practice questions written with our own numbers. The CA Hub is independent and not affiliated with or endorsed by {b.short}.
        {" "}Source: <ExtLink href={sourceUrl ?? b.officialUrl}>{b.short} past papers</ExtLink>.
      </p>
      <p style={muted}>Last updated {fmtDate(PAST_PAPERS_UPDATED)}.</p>
    </aside>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold rounded-full px-2.5 py-1" style={{ background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)" }}>
      {children}
    </span>
  );
}
