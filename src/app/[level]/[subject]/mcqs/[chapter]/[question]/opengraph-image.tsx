import { OG_SIZE, renderOg } from "@/lib/ogImage";
import { clip, resolveQuestion, type QuestionParams } from "./resolve";

export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 86400;

export default async function Image({ params }: { params: QuestionParams }) {
  const r = await resolveQuestion(params).catch(() => null);
  return renderOg({
    eyebrow: r ? `${r.code} · Chapter ${r.meta.chapter} · Q${r.idx + 1}` : "MCQ",
    title: r ? clip(r.q.question, 90) : "MCQ with answer",
    subtitle: r ? "MCQ with answer & explanation" : "Free practice with explanations",
  });
}
