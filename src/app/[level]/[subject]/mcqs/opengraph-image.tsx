import { resolveSubject } from "@/lib/questionBank";
import { LEVEL_LABEL, subjectCode } from "@/data/subjects";
import { OG_SIZE, renderOg } from "@/lib/ogImage";

export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ level: string; subject: string }> }) {
  const { level, subject } = await params;
  const s = resolveSubject(level, subject);
  return renderOg({
    eyebrow: s ? `${LEVEL_LABEL[s.level]} · Question bank` : "MCQs",
    title: s ? `${subjectCode(s)} ${s.title} MCQs` : "MCQs with answers",
    subtitle: "Chapter-wise questions with answers & explanations",
  });
}
