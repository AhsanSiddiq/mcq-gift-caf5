import type { MetadataRoute } from "next";

const BASE_URL = "https://thecahub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: BASE_URL,                              priority: 1.0,  changeFrequency: "weekly"  as const },
    { url: `${BASE_URL}/practice`,                priority: 0.95, changeFrequency: "weekly"  as const },
    { url: `${BASE_URL}/cv-maker`,                priority: 0.95, changeFrequency: "monthly" as const },
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

  return [...staticPages, ...prcPages, ...cafPages].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
