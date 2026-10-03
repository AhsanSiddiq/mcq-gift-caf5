import type { MetadataRoute } from "next";
import { EXAM_BODIES } from "@/data/regions";
import { allSubjects } from "@/data/subjects";
import { blogs } from "@/data/blogs";
import { getChapters } from "@/lib/questionBank";

export const revalidate = 86400;

const BASE_URL = "https://thecahub.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages = [
    { url: BASE_URL,                              priority: 1.0,  changeFrequency: "weekly"  as const },
    { url: `${BASE_URL}/practice`,                priority: 0.95, changeFrequency: "weekly"  as const },
    { url: `${BASE_URL}/cv-maker`,                priority: 0.95, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/daily`,                   priority: 0.9,  changeFrequency: "daily"   as const },
    { url: `${BASE_URL}/exams`,                   priority: 0.9,  changeFrequency: "weekly"  as const },
    { url: `${BASE_URL}/pro`,                     priority: 0.8,  changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/advertise`,               priority: 0.5,  changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/about`,                   priority: 0.7,  changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/contact`,                 priority: 0.6,  changeFrequency: "yearly"  as const },
    { url: `${BASE_URL}/privacy-policy`,          priority: 0.3,  changeFrequency: "yearly"  as const },
    { url: `${BASE_URL}/terms`,                   priority: 0.3,  changeFrequency: "yearly"  as const },
  ];

  // PRC subjects
  const prcSubjects = ["prc-1", "prc-2", "prc-3"];
  // CAF subjects
  const cafSubjects = ["caf-1", "caf-2", "caf-3", "caf-4", "caf-5", "caf-6", "caf-7", "caf-8"];

  const prcPages = prcSubjects.flatMap((sub) => [
    { url: `${BASE_URL}/prc/${sub}`,          priority: 0.85, changeFrequency: "weekly"  as const },
    { url: `${BASE_URL}/prc/${sub}/topical`,  priority: 0.8,  changeFrequency: "weekly"  as const },
  ]);

  const cafPages = cafSubjects.flatMap((sub) => [
    { url: `${BASE_URL}/caf/${sub}`,          priority: 0.85, changeFrequency: "weekly"  as const },
    { url: `${BASE_URL}/caf/${sub}/topical`,  priority: 0.8,  changeFrequency: "weekly"  as const },
  ]);

  // Global exam-body landing pages (live + waitlist)
  const examPages = EXAM_BODIES.map((b) => ({
    url: `${BASE_URL}/exams/${b.id}`,
    priority: b.status === "live" ? 0.85 : 0.7,
    changeFrequency: "weekly" as const,
  }));

  const blogPages = [
    { url: `${BASE_URL}/blog`, priority: 0.7, changeFrequency: "weekly" as const },
    ...blogs.map((b) => ({ url: `${BASE_URL}/blog/${b.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
  ];

  // Crawlable question banks: one index per subject + one page per chapter
  const bankPages = (
    await Promise.all(
      allSubjects.map(async (sub) => {
        const base = `${BASE_URL}/${sub.level.toLowerCase()}/${sub.id}/mcqs`;
        const chapters = await getChapters(sub.id).catch(() => []);
        return [
          { url: base, priority: 0.85, changeFrequency: "weekly" as const },
          ...chapters.map((c) => ({ url: `${base}/${c.slug}`, priority: 0.8, changeFrequency: "weekly" as const })),
        ];
      })
    )
  ).flat();

  return [...staticPages, ...examPages, ...prcPages, ...cafPages, ...bankPages, ...blogPages].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
