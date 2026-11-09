import { blogs } from "@/data/blogs";
import Breadcrumbs from "@/components/Breadcrumbs";
import { blogContext } from "@/lib/related";
import { QUAL_GROUPS } from "@/lib/navigation";
import BlogList from "./BlogList";

export const metadata = {
  alternates: { canonical: "https://www.thecahub.com/blog" },
  title: "CA Hub Blog - Student Success Strategies",
  description: "Unfiltered, no-nonsense strategies and advice on how to survive and conquer your Chartered Accountancy journey.",
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen pb-24 pt-28 px-4 sm:px-8" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs className="mb-10" items={[{ name: "Home", href: "/" }, { name: "Articles", href: "/blog" }]} />
        <h1 className="font-display font-bold mb-4" style={{ fontSize: "clamp(2rem,4vw,3rem)", color: "var(--text-1)" }}>The Editorial</h1>
        <p className="text-lg mb-12" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", maxWidth: "600px" }}>
          Strategies, unfiltered advice, and hard truths for CA students navigating the toughest exams of their lives.
        </p>

        <BlogList
          filters={QUAL_GROUPS.map((g) => ({ id: g.body, label: g.short }))}
          posts={blogs.map((b) => ({
            slug: b.slug, title: b.title, excerpt: b.excerpt, tag: b.tag, date: b.date, readTime: b.readTime,
            bodies: blogContext(b).bodies,
          }))}
        />
      </div>
    </div>
  );
}
