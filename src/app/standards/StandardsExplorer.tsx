"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export interface StandardCard {
  code: string;
  title: string;
  slug: string;
  area: string;
  areaLabel: string;
  objective: string;
}

interface Props {
  items: StandardCard[];
  areas: { id: string; label: string }[];
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

export default function StandardsExplorer({ items, areas }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return items;
    // Match "ias16" as well as "ias 16"
    const compact = q.replace(/\s/g, "");
    return items.filter((s) => {
      const hay = norm(`${s.code} ${s.title} ${s.objective} ${s.areaLabel}`);
      return hay.includes(q) || s.code.toLowerCase().replace(/\s/g, "").includes(compact);
    });
  }, [items, query]);

  return (
    <div>
      <label htmlFor="standards-search" className="sr-only">Search standards</label>
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-10"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
      >
        <Search className="w-5 h-5 shrink-0" style={{ color: "var(--text-3)" }} aria-hidden />
        <input
          id="standards-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search: IAS 16, leases, revenue…"
          className="w-full min-w-0 bg-transparent outline-none text-base"
          style={{ color: "var(--text-1)" }}
          autoComplete="off"
        />
        {query && (
          <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-3)" }} aria-live="polite">
            {filtered.length} found
          </span>
        )}
      </div>

      {filtered.length === 0 && (
        <p className="text-base mb-10" style={{ color: "var(--text-2)" }}>
          No standards match &ldquo;{query}&rdquo;. Try a number like &ldquo;IFRS 9&rdquo; or a topic like &ldquo;inventory&rdquo;.
        </p>
      )}

      {areas.map((area) => {
        const group = filtered.filter((s) => s.area === area.id);
        if (group.length === 0) return null;
        return (
          <section key={area.id} className="mb-12" aria-labelledby={`area-${area.id}`}>
            <h2
              id={`area-${area.id}`}
              className="font-bold text-xl sm:text-2xl mb-5"
              style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              {area.label}
              <span className="ml-2 text-sm font-semibold" style={{ color: "var(--text-3)" }}>{group.length}</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((s) => (
                <Link
                  key={s.slug}
                  href={`/standards/${s.slug}`}
                  className="group flex flex-col rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}
                  >
                    {s.code}
                  </span>
                  <span
                    className="font-bold text-lg leading-snug mb-2"
                    style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}
                  >
                    {s.title}
                  </span>
                  <span className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--text-2)" }}>
                    {s.objective}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--green)" }}>
                    Read summary <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
