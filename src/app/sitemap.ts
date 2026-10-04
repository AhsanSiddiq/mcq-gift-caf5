import type { MetadataRoute } from "next";
import { EXAM_BODIES } from "@/data/regions";
import { allSubjects } from "@/data/subjects";
import { blogs } from "@/data/blogs";
import { getAllQuestionRefs, getChapters, questionSlug } from "@/lib/questionBank";
import { dailyBodies } from "@/lib/daily";
import { standards } from "@/data/standards";
import { TOOLS } from "@/data/tools";

export const revalidate = 86400;

const BASE_URL = "https://www.thecahub.com";

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
    { url: `${BASE_URL}/refund-policy`,           priority: 0.3,  changeFrequency: "yearly"  as const },
    { url: `${BASE_URL}/tools/study-planner`,     priority: 0.9,  changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/cv-maker/cover-letter`,   priority: 0.85, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/cv-maker/interview-prep`, priority: 0.85, changeFrequency: "monthly" as const },
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

  const bodyDailyPages = dailyBodies()
    .filter((b) => b !== "icap")
    .map((b) => ({ url: `${BASE_URL}/daily/${b}`, priority: 0.8, changeFrequency: "daily" as const }));

  const blogPages = [
    { url: `${BASE_URL}/blog`, priority: 0.7, changeFrequency: "weekly" as const },
    ...blogs.map((b) => ({ url: `${BASE_URL}/blog/${b.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
  ];

  // Crawlable question banks: one index per subject + one page per chapter + one page per question.
  // All question URLs come from a single (paged) query, fetched alongside the chapter lists.
  const liveSubjects = allSubjects.filter((sub) => sub.isAvailable);
  const [chapterLists, questionRefs] = await Promise.all([
    Promise.all(liveSubjects.map((sub) => getChapters(sub.id).catch(() => []))),
    getAllQuestionRefs().catch(() => []),
  ]);

  const chapterBase = new Map<string, string>(); // "subjectId:chapter" -> chapter URL
  const bankPages = liveSubjects.flatMap((sub, i) => {
    const base = `${BASE_URL}/${sub.level.toLowerCase()}/${sub.id}/mcqs`;
    return [
      { url: base, priority: 0.85, changeFrequency: "weekly" as const },
      ...chapterLists[i].map((c) => {
        const url = `${base}/${c.slug}`;
        chapterBase.set(`${sub.id}:${c.chapter}`, url);
        return { url, priority: 0.8, changeFrequency: "weekly" as const };
      }),
    ];
  });

  const questionPages = questionRefs.flatMap((q) => {
    const chapterUrl = chapterBase.get(`${q.subjectId}:${q.chapter}`);
    return chapterUrl
      ? [{ url: `${chapterUrl}/${questionSlug(q.id, q.question)}`, priority: 0.6, changeFrequency: "monthly" as const }]
      : [];
  });

  // IFRS & IAS Standards Hub
  const standardsPages = [
    { url: `${BASE_URL}/standards`, priority: 0.85, changeFrequency: "monthly" as const },
    ...standards.map((s) => ({ url: `${BASE_URL}/standards/${s.slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
  ];

  // Free calculators hub + one page per tool
  const toolPages = [
    { url: `${BASE_URL}/tools`, priority: 0.9, changeFrequency: "monthly" as const },
    ...TOOLS.map((t) => ({ url: `${BASE_URL}/tools/${t.slug}`, priority: 0.85, changeFrequency: "monthly" as const })),
  ];

  return [...staticPages, ...examPages, ...prcPages, ...cafPages, ...bankPages, ...bodyDailyPages, ...blogPages, ...questionPages, ...standardsPages, ...toolPages].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
