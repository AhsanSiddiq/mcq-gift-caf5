import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "My Progress – Accuracy, Weak Chapters & Mistakes Review",
  description:
    "Your personal MCQ dashboard: questions answered, accuracy by subject, weakest chapters, daily streak and a one-click review of every question you got wrong.",
  alternates: { canonical: "https://www.thecahub.com/dashboard" },
  // Personal, browser-specific page — nothing for search engines here.
  robots: { index: false, follow: true },
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <DashboardClient />
    </main>
  );
}
