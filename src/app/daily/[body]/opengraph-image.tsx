import { OG_SIZE, renderOg } from "@/lib/ogImage";
import { dailyNumber, dailySubject, todayPKT } from "@/lib/daily";
import { getBody } from "@/data/regions";
import { subjectCode, type BodyId } from "@/data/subjects";

export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 600;

export default async function Image({ params }: { params: Promise<{ body: string }> }) {
  const { body } = await params;
  const date = todayPKT();
  const s = dailySubject(date, body as BodyId);
  return renderOg({
    eyebrow: `${getBody(body)?.short ?? ""} Daily Challenge #${dailyNumber(date)}`,
    title: "10 MCQs. Once a day.",
    subtitle: s ? `Today: ${subjectCode(s)} ${s.title}` : "Keep your streak alive",
  });
}
