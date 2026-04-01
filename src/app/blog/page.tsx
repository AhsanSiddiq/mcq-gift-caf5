import Link from "next/link";
import { blogs } from "@/data/blogs";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata = {
  title: "CA Hub Blog - Student Success Strategies",
  description: "Unfiltered, no-nonsense strategies and advice on how to survive and conquer your Chartered Accountancy journey.",
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen pb-24 pt-28 px-4 sm:px-8" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold mb-10 transition-colors" style={{ color: "var(--text-3)", textDecoration: "none" }}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-display font-bold mb-4" style={{ fontSize: "clamp(2rem,4vw,3rem)", color: "var(--text-1)" }}>The Editorial</h1>
        <p className="text-lg mb-12" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", maxWidth: "600px" }}>
          Strategies, unfiltered advice, and hard truths for CA students navigating the toughest exams of their lives.
        </p>

        <div className="grid gap-6">
          {blogs.map((b) => (
            <Link key={b.slug} href={`/blog/${b.slug}`}
              className="p-6 sm:p-8 rounded-2xl block transition-all hover:-translate-y-1"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", textDecoration: "none" }}>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(61,179,113,0.1)", color: "var(--green)" }}>{b.tag}</span>
                <span className="text-sm" style={{ color: "var(--text-3)" }}>{b.date} • {b.readTime}</span>
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl mb-3" style={{ color: "var(--text-1)" }}>{b.title}</h2>
              <p className="text-base mb-6 leading-relaxed" style={{ color: "var(--text-2)" }}>{b.excerpt}</p>
              <div className="flex items-center gap-2 text-sm font-bold" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                Read Article <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
