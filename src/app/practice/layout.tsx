import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Free ICAP MCQ Practice – PRC & CAF",
  description:
    "Practice MCQs for all PRC and CAF subjects. Topical drills, random mocks, marathon mode, and flagging — all free. Built for ICAP students in Pakistan.",
  keywords: [
    "ICAP MCQ practice",
    "PRC MCQs free",
    "CAF MCQs",
    "management accounting MCQ",
    "financial accounting MCQ Pakistan",
    "taxation MCQ ICAP",
    "audit MCQ ICAP",
    "CAF-5 MCQ",
    "PRC-1 MCQ",
  ],
  alternates: {
    canonical: "https://thecahub.com/practice",
  },
  openGraph: {
    title: "Free ICAP MCQ Practice – PRC & CAF | The CA Hub",
    description:
      "Topical drills, random mocks, and marathon mode for all PRC and CAF subjects. Hand-picked questions, instant explanations. Totally free.",
    url: "https://thecahub.com/practice",
    images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: "ICAP MCQ Practice – The CA Hub" }],
  },
};

export default function PracticeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
