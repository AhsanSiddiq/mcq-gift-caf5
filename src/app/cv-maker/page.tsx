import type { Metadata } from "next";
import CVMaker from "./CVMaker";
import FaqSection, { type Faq } from "./FaqSection";

export const metadata: Metadata = {
  title: "CA Induction CV Maker – Free Big 4 Ready CV",
  description:
    "Build a professional induction CV in minutes for ICAP, ACCA, ICAI, CIMA, ICAEW and CMA. Five Big 4-ready templates, ATS-friendly mode, live A4 preview and a free, text-selectable PDF download.",
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
    "ACCA student CV",
    "CA articleship resume India",
    "ATS friendly accounting CV",
  ],
  alternates: {
    canonical: "https://www.thecahub.com/cv-maker",
  },
  openGraph: {
    title: "CA Induction CV Maker – Free Big 4 Ready | The CA Hub",
    description:
      "Build a Big 4-ready induction CV instantly — ICAP, ACCA, ICAI, CIMA, ICAEW and CMA. Five templates, ATS mode, free PDF download, no sign-up.",
    url: "https://www.thecahub.com/cv-maker",
    images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: "CA Induction CV Maker – The CA Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CA Induction CV Maker – Free | The CA Hub",
    description: "Build a Big 4-ready induction CV instantly. Five templates, ATS mode, free PDF download.",
    images: ["/CAHub.png"],
  },
};

const FAQS: Faq[] = [
  { q: "Is the CA Hub CV maker really free?", a: "Yes. There is no sign-up, no watermark and no paywall. Fill in your details and download the PDF." },
  { q: "Which qualifications does it support?", a: "ICAP (PRC, CAF, CFAP), ACCA, ICAI (CA Foundation, Inter, Final), CIMA, ICAEW and US CMA. Pick your body in the Qualification step to get the right stages, registration number label and paper list." },
  { q: "What is ATS-friendly mode?", a: "Many firms use online application portals (applicant tracking systems) that read your CV automatically. ATS mode switches to a plain single-column layout with standard headings and produces a real-text PDF those systems can parse reliably." },
  { q: "Is my data saved?", a: "Your CV autosaves in this browser on this device only. Nothing is uploaded to our servers. Use the reset button to clear it." },
  { q: "My CV runs onto a second page — is that a problem?", a: "Students applying for articleship or induction should aim for one page. The live preview marks where page two starts; try Compact spacing, the Compact template, or hide sections you don't need. If you do need two pages, the PDF breaks pages cleanly between lines." },
  { q: "Can I write a cover letter from my CV?", a: "Yes. The Cover Letter tool can import the CV you built here and draft a tailored letter for a specific firm and role, which you can edit, copy or download as a PDF." },
];

export default function CVMakerPage() {
  return (
    <>
      <CVMaker />
      <FaqSection faqs={FAQS} title="CV maker FAQs" />
    </>
  );
}
