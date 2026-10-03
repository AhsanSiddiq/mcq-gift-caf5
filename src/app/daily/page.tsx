import type { Metadata } from "next";
import { getSubjectMCQs } from "@/lib/questionBank";
import { DAILY_SIZE, dailyNumber, dailySubject, seededPick, todayPKT } from "@/lib/daily";
import DailyChallenge from "./DailyChallenge";

// Re-evaluated every 10 minutes so the puzzle rolls over shortly after midnight PKT.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Daily CA MCQ Challenge – 10 Questions a Day",
  description:
    "A new 10-question ICAP MCQ challenge every day, rotating through PRC and CAF subjects. Keep your streak alive and share your score with your study group.",
  alternates: { canonical: "https://www.thecahub.com/daily" },
  openGraph: {
    title: "The CA Hub Daily Challenge",
    description: "10 MCQs a day. Same questions for everyone. How long can you keep your streak?",
    url: "https://www.thecahub.com/daily",
  },
};

export default async function DailyPage() {
  const date = todayPKT();
  const subject = dailySubject(date);
  const pool = await getSubjectMCQs(subject.id);
  const questions = seededPick(pool, DAILY_SIZE, `${date}:${subject.id}`);

  return (
    <main className="min-h-screen">
      <DailyChallenge
        date={date}
        number={dailyNumber(date)}
        subject={{ id: subject.id, title: subject.title, level: subject.level.toLowerCase() }}
        questions={questions}
      />
    </main>
  );
}
