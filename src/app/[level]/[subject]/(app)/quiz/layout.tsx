import type { Metadata } from "next";
import type { ReactNode } from "react";
import { allSubjects, subjectCode } from "@/data/subjects";

const BASE_URL = "https://www.thecahub.com";

type Props = { params: Promise<{ level: string; subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level, subject } = await params;
  const subjectId = subject.toLowerCase();
  const subjectData = allSubjects.find((s) => s.id === subjectId);

  const title = subjectData
    ? `${subjectCode(subjectData)} ${subjectData.title} Quiz`
    : `${subjectId.toUpperCase()} MCQ Quiz`;

  const description = `Start an MCQ quiz for ${subjectData?.title ?? subjectId}. Topical, random, or marathon mode — all free, all explained.`;
  const url = `${BASE_URL}/${level}/${subjectId}/quiz`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // No index for quiz routes — they have dynamic params and no canonical content per URL
    robots: { index: false, follow: true },
  };
}

export default function QuizLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
