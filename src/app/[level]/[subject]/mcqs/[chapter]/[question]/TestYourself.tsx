"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type Option = { key: string; text: string; correct: boolean };

/**
 * "Test yourself": pick an option (or click reveal) to see the answer. The answer block is
 * server-rendered children inside a <details>, so it is always in the HTML for crawlers.
 */
export default function TestYourself({ options, children }: { options: Option[]; children: ReactNode }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-3)" }}>
        Test yourself: pick an answer
      </p>
      <ul className="flex flex-col gap-2 mb-5">
        {options.map((o) => {
          const showState = open;
          const isPicked = picked === o.key;
          const good = showState && o.correct;
          const bad = showState && isPicked && !o.correct;
          return (
            <li key={o.key}>
              <button
                type="button"
                onClick={() => {
                  setPicked(o.key);
                  setOpen(true);
                }}
                aria-pressed={isPicked}
                className="w-full text-left rounded-xl px-4 py-3 text-sm flex items-start gap-3 transition-colors"
                style={{
                  background: good ? "rgba(61,179,113,0.12)" : bad ? "rgba(239,68,68,0.10)" : "var(--bg-3)",
                  border: `1px solid ${good ? "var(--green)" : bad ? "#ef4444" : isPicked ? "var(--text-3)" : "var(--border)"}`,
                  color: "var(--text-2)",
                  cursor: "pointer",
                }}
              >
                <strong style={{ color: "var(--text-1)" }}>{o.key})</strong>
                <span className="flex-1 whitespace-pre-line">{o.text}</span>
                {good && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--green)" }} aria-label="Correct answer" />}
                {bad && <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#ef4444" }} aria-label="Incorrect" />}
              </button>
            </li>
          );
        })}
      </ul>
      {open && picked && (
        <p className="text-sm font-bold mb-3" style={{ color: options.find((o) => o.key === picked)?.correct ? "var(--green)" : "#ef4444" }}>
          {options.find((o) => o.key === picked)?.correct ? "Correct, well done!" : "Not quite. See the answer below."}
        </p>
      )}
      <details
        open={open}
        onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
        className="rounded-xl p-4 text-sm"
        style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}
      >
        <summary className="cursor-pointer font-bold" style={{ color: "var(--green)" }}>
          {open ? "Answer & explanation" : "Reveal answer & explanation"}
        </summary>
        <div className="mt-3" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
          {children}
        </div>
      </details>
    </div>
  );
}
