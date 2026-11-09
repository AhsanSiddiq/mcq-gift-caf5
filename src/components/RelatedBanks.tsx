import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { LEVEL_LABEL, subjectCode, type Subject } from "@/data/subjects";
import { bankHref } from "@/lib/navigation";

const heading = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" } as const;

/**
 * "Practise with MCQs" block: links to chapter-wise question banks.
 * Used on tool, standard and blog pages so the next step looks the same everywhere.
 */
export default function RelatedBanks({
  subjects,
  title = "Test yourself with free MCQs",
  intro = "Exam-style questions with worked answers, chapter by chapter.",
  columns = 1,
  note,
  className = "",
  headingId = "related-banks",
  id,
}: {
  subjects: Subject[];
  title?: string;
  intro?: string;
  /** 1 for a sidebar, 2 for a full-width section */
  columns?: 1 | 2;
  note?: React.ReactNode;
  className?: string;
  headingId?: string;
  id?: string;
}) {
  if (subjects.length === 0) return null;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`rounded-2xl p-5 sm:p-6 ${className}`}
      style={{ background: "var(--bg-2)", border: "1px solid color-mix(in srgb, var(--green) 35%, var(--border))" }}
    >
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--green)" }}>
        <BookOpenCheck className="w-4 h-4" aria-hidden /> Practise this topic
      </p>
      <h2 id={headingId} className="font-bold text-lg sm:text-xl mb-1" style={heading}>
        {title}
      </h2>
      <p className="text-sm mb-4" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>
        {intro}
      </p>
      <ul className={`grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {subjects.map((s) => (
          <li key={s.id} className="min-w-0">
            <Link
              href={bankHref(s)}
              className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 h-full transition-[filter] hover:brightness-110"
              style={{ background: "var(--bg-3)", border: "1px solid var(--border)", textDecoration: "none" }}
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-snug" style={{ color: "var(--text-1)" }}>{subjectCode(s)} {s.title}</span>
                <span className="block text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{LEVEL_LABEL[s.level]} MCQs</span>
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      {note && <div className="mt-4 text-xs" style={{ color: "var(--text-3)" }}>{note}</div>}
    </section>
  );
}
