import type { Metadata } from "next";
import CoverLetter from "./CoverLetter";
import FaqSection, { type Faq } from "../FaqSection";

const URL = "https://www.thecahub.com/cv-maker/cover-letter";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator for Articleship & Big 4 Induction",
  description:
    "Write a tailored, one-page cover letter for articleship, audit trainee, Big 4 induction or graduate roles. Free AI cover letter generator for ICAP, ACCA, ICAI, CIMA, ICAEW and CMA students — edit, copy or download as PDF.",
  keywords: [
    "articleship cover letter",
    "Big 4 cover letter",
    "audit trainee cover letter",
    "ICAP training cover letter",
    "ACCA trainee cover letter",
    "CA articleship cover letter India",
    "AI cover letter generator accounting",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "AI Cover Letter for Articleship & Big 4 | The CA Hub",
    description: "A tailored one-page cover letter for your target firm in under a minute. Edit, copy or download as PDF.",
    url: URL,
    images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: "AI Cover Letter Generator – The CA Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Cover Letter for Articleship & Big 4 | The CA Hub",
    description: "A tailored one-page cover letter for your target firm. Free for accountancy students.",
    images: ["/CAHub.png"],
  },
};

const FAQS: Faq[] = [
  { q: "Do audit firms still read cover letters for articleship and induction?", a: "Many do, especially when they shortlist from a large pool. A short, specific letter that names the firm, the role and one or two concrete strengths helps you stand out from candidates who only send a CV." },
  { q: "How long should an articleship or Big 4 cover letter be?", a: "One page — roughly 250 to 370 words in four or five short paragraphs. The generator is tuned to that length." },
  { q: "Is the AI cover letter generator free?", a: "Yes. You get 3 AI-written letters a day for free and 30 a day with Pro. If the AI writer is unavailable, you can still build a letter from our template and edit it." },
  { q: "Does it use my CV?", a: "If you have built a CV in the CA Hub CV Maker on this device, you can import your name, contact details, qualification, strengths and experience in one tap. Nothing is uploaded until you ask for an AI draft." },
  { q: "Is my information stored?", a: "No. Your details are sent only to write the letter and are not saved or cached on our servers. Your draft stays in your own browser." },
  { q: "Should I send the AI draft as it is?", a: "Treat it as a strong first draft. Check every fact, add a specific reason for choosing the firm, and make sure it sounds like you before you send it." },
];

export default function CoverLetterPage() {
  return (
    <>
      <CoverLetter />
      <FaqSection faqs={FAQS} title="Cover letter FAQs" />
    </>
  );
}
