import type { Metadata } from "next";
import type { ReactNode } from "react";
import { allSubjects } from "@/data/subjects";

const BASE_URL = "https://thecahub.com";

const SUBJECT_META: Record<string, { desc: string; keywords: string[] }> = {
  // PRC
  "prc-1": {
    desc: "Practice PRC-1 Fundamentals of Accounting MCQs for ICAP. Topical drills and random mocks with instant explanations. Free.",
    keywords: ["PRC-1 MCQ", "fundamentals of accounting MCQ", "ICAP PRC MCQ", "PRC-1 practice questions"],
  },
  "prc-2": {
    desc: "Practice PRC-2 Quantitative Analysis for Business MCQs for ICAP. Chapter-by-chapter drills and random mocks. Free.",
    keywords: ["PRC-2 MCQ", "quantitative analysis MCQ", "ICAP PRC-2", "business math MCQ Pakistan"],
  },
  "prc-3": {
    desc: "Practice PRC-3 Business & Economic Insights MCQs for ICAP. Topical and random practice with explanations. Free.",
    keywords: ["PRC-3 MCQ", "business economic insights MCQ", "ICAP PRC-3 practice"],
  },
  // CAF
  "caf-1": {
    desc: "Practice CAF-1 Financial Accounting and Reporting MCQs for ICAP. Chapter drills, random mocks, marathon mode. Free.",
    keywords: ["CAF-1 MCQ", "financial accounting MCQ ICAP", "CAF-1 practice questions", "ICAP FAR MCQ"],
  },
  "caf-2": {
    desc: "Practice CAF-2 Taxation Principles and Compliance MCQs for ICAP. Chapter-by-chapter and random quiz. Free.",
    keywords: ["CAF-2 MCQ", "taxation MCQ ICAP", "tax MCQ Pakistan CA", "CAF-2 practice"],
  },
  "caf-3": {
    desc: "Practice CAF-3 Data, Systems and Risks MCQs for ICAP. Topical drills and mocks with instant explanations. Free.",
    keywords: ["CAF-3 MCQ", "data systems risks MCQ", "ICAP DSR MCQ", "CAF-3 practice questions"],
  },
  "caf-4": {
    desc: "Practice CAF-4 Business Law Dynamics MCQs for ICAP. Chapter drills, random mocks, marathon mode. Free.",
    keywords: ["CAF-4 MCQ", "business law MCQ ICAP", "corporate law MCQ Pakistan", "CAF-4 practice"],
  },
  "caf-5": {
    desc: "Practice CAF-5 Management Accounting MCQs for ICAP. Target costing, budgeting, marginal costing — topical and random. Free.",
    keywords: [
      "CAF-5 MCQ",
      "management accounting MCQ ICAP",
      "CAF-5 practice questions",
      "target costing MCQ",
      "budgeting MCQ ICAP",
      "marginal costing MCQ",
    ],
  },
  "caf-6": {
    desc: "Practice CAF-6 Corporate Reporting MCQs for ICAP. Chapter-by-chapter and random practice with explanations. Free.",
    keywords: ["CAF-6 MCQ", "corporate reporting MCQ ICAP", "CAF-6 practice questions"],
  },
  "caf-7": {
    desc: "Practice CAF-7 Business Insights and Analysis MCQs for ICAP. Topical drills and random mocks. Free.",
    keywords: ["CAF-7 MCQ", "business insights analysis MCQ", "ICAP BIA MCQ", "CAF-7 practice"],
  },
  "caf-8": {
    desc: "Practice CAF-8 Audit and Assurance Essentials MCQs for ICAP. Evidence, risk, reporting — topical and random quiz. Free.",
    keywords: ["CAF-8 MCQ", "audit assurance MCQ ICAP", "audit MCQ Pakistan", "CAF-8 practice questions"],
  },
};

type Props = { params: Promise<{ level: string; subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level, subject } = await params;
  const subjectId = subject.toLowerCase();

  const subjectData = allSubjects.find((s) => s.id === subjectId);
  const extra = SUBJECT_META[subjectId];

  const title = subjectData
    ? `${subjectData.id.toUpperCase()} ${subjectData.title} MCQ Practice`
    : `${subjectId.toUpperCase()} MCQ Practice`;

  const description =
    extra?.desc ??
    `Free MCQ practice for ${subjectData?.title ?? subjectId} — ICAP ${level.toUpperCase()} level. Topical, random, and marathon modes with explanations.`;

  const url = `${BASE_URL}/${level}/${subjectId}`;

  return {
    title,
    description,
    keywords: extra?.keywords ?? ["ICAP MCQ", "CA MCQ Pakistan", subjectId],
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | The CA Hub`,
      description,
      url,
      images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: `${title} – The CA Hub` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | The CA Hub`,
      description,
      images: ["/CAHub.png"],
    },
  };
}

export default function SubjectLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
