import type { Metadata } from "next";
import CVMaker from "./CVMaker";

export const metadata: Metadata = {
  title: "CA Induction CV Maker – Free Big 4 Ready CV",
  description:
    "Build a professional ICAP induction CV in minutes. The exact two-column format Big 4 and audit firms expect — with all HOC, education, course, and experience sections. Free, instant PDF download.",
  keywords: [
    "CA induction CV",
    "ICAP CV maker",
    "CA CV Pakistan",
    "Big 4 CV template",
    "audit internship CV Pakistan",
    "ICAP student CV",
    "CA articleship CV",
    "HOC CA CV",
    "PRC CAF CV",
  ],
  alternates: {
    canonical: "https://thecahub.com/cv-maker",
  },
  openGraph: {
    title: "CA Induction CV Maker – Free Big 4 Ready | The CA Hub",
    description:
      "Build a Big 4-ready ICAP induction CV instantly. The exact format recruiting partners expect. Free PDF download, no sign-up.",
    url: "https://thecahub.com/cv-maker",
    images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: "CA Induction CV Maker – The CA Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CA Induction CV Maker – Free | The CA Hub",
    description: "Build a Big 4-ready ICAP induction CV instantly. Free PDF download.",
    images: ["/CAHub.png"],
  },
};


export default function CVMakerPage() {
  return <CVMaker />;
}
