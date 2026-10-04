import type { ReactNode } from "react";

/** Small server-rendered building blocks for the "How it works" articles. */

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-bold text-lg mt-8 mb-3" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-[15px] sm:text-base" style={{ color: "var(--text-2)", lineHeight: 1.8 }}>
      {children}
    </p>
  );
}

export function Formula({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="my-4 rounded-xl px-4 py-3.5 overflow-x-auto" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderLeft: "3px solid var(--green)" }}>
      {label && (
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-3)" }}>
          {label}
        </p>
      )}
      <code className="block whitespace-pre text-[14px] sm:text-[15px] font-semibold" style={{ color: "var(--text-1)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", lineHeight: 1.7 }}>
        {children}
      </code>
    </div>
  );
}

export function Example({ title = "Worked example", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-6 rounded-2xl p-5" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--gold)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
        {title}
      </p>
      <div className="text-[15px] [&_p]:mb-3 [&_p:last-child]:mb-0 [&_li]:mb-1.5" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mb-4 pl-5 list-disc text-[15px] sm:text-base [&_li]:mb-2 marker:text-[var(--green)]" style={{ color: "var(--text-2)", lineHeight: 1.75 }}>
      {children}
    </ul>
  );
}

export function B({ children }: { children: ReactNode }) {
  return <strong style={{ color: "var(--text-1)" }}>{children}</strong>;
}
