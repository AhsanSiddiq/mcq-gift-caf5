"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export interface BlogCard {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  bodies: string[];
}

/** Article list with a qualification filter. All cards stay in the HTML; the filter only hides them. */
export default function BlogList({ posts, filters }: { posts: BlogCard[]; filters: { id: string; label: string }[] }) {
  const [active, setActive] = useState<string>("all");
  const visible = (p: BlogCard) => active === "all" || p.bodies.includes(active);
  const count = posts.filter(visible).length;

  return (
    <>
      <div role="group" aria-label="Filter by qualification" className="flex flex-wrap gap-2 mb-8">
        {[{ id: "all", label: "All" }, ...filters].map((f) => {
          const on = f.id === active;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(f.id)}
              className="rounded-full px-4 py-2 text-sm font-bold cursor-pointer"
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                background: on ? "var(--green)" : "var(--surface)",
                color: on ? "#fff" : "var(--text-1)",
                border: `1px solid ${on ? "var(--green)" : "var(--border)"}`,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">{count} articles</p>

      <div className="grid gap-6">
        {posts.map((b) => (
          <Link key={b.slug} href={`/blog/${b.slug}`}
            className={`${visible(b) ? "block" : "hidden"} p-6 sm:p-8 rounded-2xl transition-all hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", textDecoration: "none" }}>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "color-mix(in srgb, var(--green) 10%, transparent)", color: "var(--green)" }}>{b.tag}</span>
              <span className="text-sm" style={{ color: "var(--text-3)" }}>{b.date} • {b.readTime}</span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl mb-3" style={{ color: "var(--text-1)" }}>{b.title}</h2>
            <p className="text-base mb-6 leading-relaxed" style={{ color: "var(--text-2)" }}>{b.excerpt}</p>
            <div className="flex items-center gap-2 text-sm font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              Read article <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
