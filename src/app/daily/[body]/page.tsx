import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubjectMCQs } from "@/lib/questionBank";
import { DAILY_SIZE, dailyBodies, dailyNumber, dailySubject, seededPick, todayPKT } from "@/lib/daily";
import { getBody } from "@/data/regions";
import type { BodyId } from "@/data/subjects";
import { subjectCode } from "@/data/subjects";
import DailyChallenge from "../DailyChallenge";

export const revalidate = 600;
export const dynamicParams = false;

type Props = { params: Promise<{ body: string }> };

export function generateStaticParams() {
  return dailyBodies().filter((b) => b !== "icap").map((body) => ({ body }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { body } = await params;
  const b = getBody(body);
  if (!b) return {};
  const title = `Daily ${b.short} MCQ Challenge – 10 Questions a Day`;
  const description = `A free daily 10-question ${b.short} quiz rotating through every live paper. Same questions for everyone — keep your streak and share your score.`;
  return {
    title,
    description,
    alternates: { canonical: `https://www.thecahub.com/daily/${b.id}` },
    openGraph: { title, description, url: `https://www.thecahub.com/daily/${b.id}` },
  };
}

export default async function BodyDailyPage({ params }: Props) {
  const { body } = await params;
  if (!dailyBodies().includes(body as BodyId) || body === "icap") notFound();
  const date = todayPKT();
  const subject = dailySubject(date, body as BodyId);
  const pool = await getSubjectMCQs(subject.id);
  const questions = seededPick(pool, DAILY_SIZE, `${date}:${subject.id}`);
  return (
    <main className="min-h-screen">
      <DailyChallenge
        body={body}
        date={date}
        number={dailyNumber(date)}
        subject={{ id: subject.id, code: subjectCode(subject), title: subject.title, level: subject.level.toLowerCase() }}
        questions={questions}
      />
    </main>
  );
}
