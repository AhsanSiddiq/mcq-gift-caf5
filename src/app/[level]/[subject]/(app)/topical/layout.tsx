import type { Metadata } from "next";
import type { ReactNode } from "react";
import { allSubjects } from "@/data/subjects";

const BASE_URL = "https://thecahub.com";

type Props = { params: Promise<{ level: string; subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level, subject } = await params;
  const subjectId = subject.toLowerCase();
  const subjectData = allSubjects.find((s) => s.id === subjectId);

  const title = subjectData
    ? `${subjectData.id.toUpperCase()} ${subjectData.title} – Chapter Selection`
    : `${subjectId.toUpperCase()} Topical Practice`;

  const description = `Practice ${subjectData?.title ?? subjectId} chapter by chapter. Pick a topic and drill MCQs until you master it. Free ICAP practice.`;
  const url = `${BASE_URL}/${level}/${subjectId}/topical`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | The CA Hub`,
      description,
      url,
      images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: `${title} – The CA Hub` }],
    },
  };
}

export default function TopicalLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
