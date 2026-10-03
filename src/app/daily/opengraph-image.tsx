import { OG_SIZE, renderOg } from "@/lib/ogImage";
import { dailyNumber, dailySubject, todayPKT } from "@/lib/daily";

export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 600;

export default function Image() {
  const date = todayPKT();
  const s = dailySubject(date);
  return renderOg({
    eyebrow: `Daily Challenge #${dailyNumber(date)}`,
    title: "10 CA MCQs. Once a day.",
    subtitle: `Today: ${s.id.toUpperCase()} ${s.title} · keep your streak alive`,
  });
}
