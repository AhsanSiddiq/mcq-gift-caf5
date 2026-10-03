import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with The CA Hub — questions, MCQ contributions, corrections and partnership enquiries.",
  alternates: { canonical: "https://www.thecahub.com/contact" },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
