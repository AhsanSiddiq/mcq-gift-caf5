import { resolveSubject } from "@/lib/questionBank";
import { OG_SIZE, renderOg } from "@/lib/ogImage";

export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ level: string; subject: string }> }) {
  const { level, subject } = await params;
  const s = resolveSubject(level, subject);
  return renderOg({
    eyebrow: s ? `ICAP ${s.level} · Question bank` : "ICAP MCQs",
    title: s ? `${s.id.toUpperCase()} ${s.title} MCQs` : "MCQs with answers",
    subtitle: "Chapter-wise questions with answers & explanations",
  });
}
