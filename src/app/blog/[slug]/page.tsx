import { blogs } from "@/data/blogs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from 'next';

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
    openGraph: {
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

  return (
    <div className="min-h-screen pb-24 pt-28 px-4 sm:px-8" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold mb-10 transition-colors" style={{ color: "var(--text-3)", textDecoration: "none" }}>
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(61,179,113,0.08)", color: "var(--green)", border: "1px solid rgba(61,179,113,0.3)" }}>{blog.tag}</span>
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
            .prose p { margin-bottom: 1.5rem; }
            .prose ul { padding-left: 1.5rem; margin-bottom: 1.5rem; list-style-type: disc; }
            .prose li { margin-bottom: 0.5rem; }
            .prose strong { color: var(--text-1); font-weight: 700; }
          ` }} />
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
        
        <div className="mt-20 pt-10 border-t flex flex-col items-center justify-center text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-xl font-bold mb-4 font-display" style={{ color: "var(--text-1)" }}>Apply these strategies today.</p>
          <Link href="/practice" className="shimmer-btn inline-flex items-center gap-2 font-bold rounded-full px-8 py-4 text-white text-sm" style={{ boxShadow: "0 8px 32px rgba(61,179,113,0.3)" }}>
            Start Practicing Free
          </Link>
        </div>
      </div>
    </div>
  );
}
