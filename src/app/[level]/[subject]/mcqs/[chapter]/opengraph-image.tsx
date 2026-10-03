import { getChapters, resolveSubject } from "@/lib/questionBank";
import { subjectCode } from "@/data/subjects";
import { OG_SIZE, renderOg } from "@/lib/ogImage";

export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 86400;

export default async function Image({ params }: { params: Promise<{ level: string; subject: string; chapter: string }> }) {
  const { level, subject, chapter } = await params;
  const s = resolveSubject(level, subject);
  const num = Number(/^chapter-(\d+)/.exec(chapter)?.[1]);
  const meta = s ? (await getChapters(s.id)).find((c) => c.chapter === num) : undefined;
  return renderOg({
    eyebrow: s ? `${subjectCode(s)} · Chapter ${num}` : "MCQs",
    title: meta ? `${meta.topic} MCQs` : "MCQs with answers",
    subtitle: meta ? `${meta.count} questions with answers & explanations` : "Free chapter-wise practice",
  });
}
