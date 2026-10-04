import Link from "next/link";
import { FileText, Mail, MessagesSquare } from "lucide-react";

const ITEMS = [
  { id: "cv", href: "/cv-maker", label: "CV Maker", Icon: FileText },
  { id: "letter", href: "/cv-maker/cover-letter", label: "Cover Letter", Icon: Mail },
  { id: "interview", href: "/cv-maker/interview-prep", label: "Interview Prep", Icon: MessagesSquare },
] as const;

/** Tabs linking the three career-suite tools. */
export default function CareerNav({ active }: { active: (typeof ITEMS)[number]["id"] }) {
  return (
    <nav aria-label="Career suite" className="mb-6 -mx-1 overflow-x-auto no-scrollbar">
      <ul className="flex gap-1.5 px-1 w-max">
        {ITEMS.map(({ id, href, label, Icon }) => {
          const on = id === active;
          return (
            <li key={id}>
              <Link href={href} aria-current={on ? "page" : undefined}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full whitespace-nowrap transition-colors"
                style={{
                  background: on ? "var(--green)" : "var(--bg-2)",
                  color: on ? "#fff" : "var(--text-2)",
                  border: `1px solid ${on ? "var(--green)" : "var(--border)"}`,
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  minHeight: 36,
                }}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
