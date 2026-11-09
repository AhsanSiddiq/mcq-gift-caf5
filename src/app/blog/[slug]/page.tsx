import { blogs } from "@/data/blogs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CalendarDays } from "lucide-react";
import type { Metadata } from 'next';
import AdSlot from "@/components/AdSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedBanks from "@/components/RelatedBanks";
import ToolIcon from "@/app/tools/_components/ToolIcon";
import { blogContext, relatedPosts } from "@/lib/related";
import { QUAL_GROUPS, bodyShort, dailyHrefFor, examHubHref } from "@/lib/navigation";
import { subjectCode } from "@/data/subjects";

const heading = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" } as const;
const card = { background: "var(--bg-2)", border: "1px solid var(--border)", textDecoration: "none" } as const;

export function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find(b => b.slug === slug);
  if (!blog) return { title: "Not Found" };
  return {
    title: `${blog.title} | The CA Hub Blog`,
    description: blog.excerpt,
    alternates: { canonical: `https://www.thecahub.com/blog/${blog.slug}` },
    openGraph: {
      url: `https://www.thecahub.com/blog/${blog.slug}`,
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: blog.date,
      authors: ['The CA Hub Editorial'],
    }
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find(b => b.slug === slug);
  if (!blog) return notFound();
  const ctx = blogContext(blog);
  const related = relatedPosts(blog, blogs);
  const mainBody = ctx.bodies[0];
  const banksTitle =
    ctx.subjects.length === 1 ? `Practise ${subjectCode(ctx.subjects[0])} MCQs` : "Practise with free MCQs";

  return (
    <div className="min-h-screen pb-24 pt-28 px-4 sm:px-8" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs
          className="mb-10"
          items={[
            { name: "Home", href: "/" },
            { name: "Articles", href: "/blog" },
            { name: blog.title, short: blog.tag, href: `/blog/${blog.slug}` },
          ]}
        />
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "color-mix(in srgb, var(--green) 8%, transparent)", color: "var(--green)", border: "1px solid color-mix(in srgb, var(--green) 30%, transparent)" }}>{blog.tag}</span>
          </div>
          <h1 className="font-display font-bold tracking-tight mb-6" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--text-1)", lineHeight: 1.1 }}>
            {blog.title}
          </h1>
          <p className="text-sm font-semibold mb-8" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>
            The CA Hub Editorial &nbsp;&nbsp;•&nbsp;&nbsp; {blog.date} &nbsp;&nbsp;•&nbsp;&nbsp; {blog.readTime}
          </p>
        </div>

        <div 
          className="prose prose-invert max-w-none" 
          style={{ color: "var(--text-2)", fontSize: "1.1rem", lineHeight: 1.8, fontFamily: "var(--font-inter), sans-serif" }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            .prose h2 {
              color: var(--text-1);
              font-family: var(--font-space-grotesk), sans-serif;
              font-size: 1.6rem;
              margin-top: 2.5rem;
              margin-bottom: 1rem;
              font-weight: 700;
            }
            .prose h3 {
              color: var(--text-1);
              font-family: var(--font-space-grotesk), sans-serif;
              font-size: 1.25rem;
              margin-top: 1.75rem;
              margin-bottom: 0.75rem;
              font-weight: 700;
            }
            .prose p { margin-bottom: 1.5rem; }
            .prose ul { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
            .prose li { margin-bottom: 0.5rem; }
            .prose strong { color: var(--text-1); font-weight: 700; }
            .prose .table-wrap { overflow-x: auto; margin-bottom: 1.5rem; }
            .prose table { width: 100%; border-collapse: collapse; font-size: 0.95rem; line-height: 1.5; }
            .prose th, .prose td { border: 1px solid var(--border); padding: 0.5rem 0.75rem; text-align: left; vertical-align: top; }
            .prose th { color: var(--text-1); font-weight: 700; }
          ` }} />
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        <AdSlot />
        
        <div className="mt-16 pt-10 border-t flex flex-col gap-10" style={{ borderColor: "var(--border)" }}>
          {ctx.subjects.length > 0 ? (
            <RelatedBanks
              subjects={ctx.subjects}
              columns={2}
              title={banksTitle}
              intro="Chapter-wise questions with answers and explanations. Read them free, then take a quiz."
            />
          ) : (
            <section aria-labelledby="pick-h" className="rounded-2xl p-5 sm:p-6" style={card}>
              <h2 id="pick-h" className="font-bold text-lg sm:text-xl mb-1" style={heading}>Practise for your exam</h2>
              <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>Pick your qualification to see its papers and free MCQ banks.</p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUAL_GROUPS.map((g) => (
                  <li key={g.body}>
                    <Link href={g.hub} className="flex items-center justify-between gap-2 rounded-xl px-3.5 py-3" style={{ background: "var(--bg-3)", border: "1px solid var(--border)", textDecoration: "none" }}>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold" style={heading}>{g.short}</span>
                        <span className="block text-xs" style={{ color: "var(--text-3)" }}>{g.note}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="tools-h">
            <h2 id="tools-h" className="font-bold text-lg sm:text-xl mb-4" style={heading}>Free tools for this</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {ctx.tools.map((t) => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`} className="flex items-start gap-3 rounded-2xl p-4 h-full" style={card}>
                    <ToolIcon name={t.icon} className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--green)" }} />
                    <span className="min-w-0">
                      <span className="block font-bold text-sm" style={heading}>{t.h1.replace(/ \(.*\)$/, "")}</span>
                      <span className="block text-xs mt-0.5" style={{ color: "var(--text-3)", lineHeight: 1.5 }}>{t.blurb}</span>
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tools/study-planner" className="flex items-start gap-3 rounded-2xl p-4 h-full" style={card}>
                  <CalendarCheck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--green)" }} aria-hidden />
                  <span className="min-w-0">
                    <span className="block font-bold text-sm" style={heading}>Smart Study Planner</span>
                    <span className="block text-xs mt-0.5" style={{ color: "var(--text-3)", lineHeight: 1.5 }}>A day-by-day plan to your exam date, with revision and mock days.</span>
                  </span>
                </Link>
              </li>
              {mainBody && (
                <li>
                  <Link href={dailyHrefFor(mainBody)} className="flex items-start gap-3 rounded-2xl p-4 h-full" style={card}>
                    <CalendarDays className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--green)" }} aria-hidden />
                    <span className="min-w-0">
                      <span className="block font-bold text-sm" style={heading}>{bodyShort(mainBody)} daily challenge</span>
                      <span className="block text-xs mt-0.5" style={{ color: "var(--text-3)", lineHeight: 1.5 }}>10 questions a day, the same for everyone.</span>
                    </span>
                  </Link>
                </li>
              )}
            </ul>
            {mainBody && (
              <Link href={examHubHref(mainBody)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--green)", textDecoration: "none" }}>
                {bodyShort(mainBody)} exam guide <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </section>

          {related.length > 0 && (
            <section aria-labelledby="related-h">
              <h2 id="related-h" className="font-bold text-lg sm:text-xl mb-4" style={heading}>Related articles</h2>
              <ul className="grid gap-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} className="flex items-center justify-between gap-4 rounded-2xl p-4 sm:p-5" style={card}>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--green)" }}>{r.tag} · {r.readTime}</span>
                        <span className="block font-bold text-sm sm:text-base" style={heading}>{r.title}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--green)" }} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/blog" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--text-2)", textDecoration: "none" }}>
                All articles <ArrowRight className="w-4 h-4" />
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
