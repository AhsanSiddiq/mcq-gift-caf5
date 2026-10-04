"use client";

import { useId, useState, type ReactNode } from "react";
import { Check, Copy, Download, Plus, Trash2 } from "lucide-react";

/* ── Number parsing & formatting ─────────────────────────────── */

/** Parses user input such as "1,250.50" or "  12 ". Returns NaN for empty/invalid input. */
export function num(s: string): number {
  const cleaned = s.replace(/[,\s]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return NaN;
  return Number(cleaned);
}

const nf = (dp: number) => new Intl.NumberFormat("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const cache = new Map<number, Intl.NumberFormat>();

export function fmt(n: number | null | undefined, dp = 2): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "–";
  if (!cache.has(dp)) cache.set(dp, nf(dp));
  const v = Math.abs(n) < 0.5 * Math.pow(10, -dp) ? 0 : n; // avoid "-0.00"
  return cache.get(dp)!.format(v);
}

export const fmtPct = (n: number | null | undefined, dp = 2) => (n === null || n === undefined || !Number.isFinite(n) ? "–" : `${fmt(n * 100, dp)}%`);

/* ── Layout ──────────────────────────────────────────────────── */

const heading = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" } as const;

export function Panel({ title, children, className = "", actions }: { title?: string; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={`rounded-2xl p-4 sm:p-6 min-w-0 ${className}`} style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {title && <h2 className="font-bold text-lg" style={heading}>{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

/** Two-column calculator layout: inputs on the left, results on the right (stacked on mobile). */
export function CalcGrid({ inputs, results }: { inputs: ReactNode; results: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] items-start">
      <Panel title="Inputs">{inputs}</Panel>
      <div className="flex flex-col gap-5 min-w-0" aria-live="polite">{results}</div>
    </div>
  );
}

/* ── Inputs ──────────────────────────────────────────────────── */

const inputStyle = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  color: "var(--text-1)",
} as const;

const inputClass =
  "w-full h-12 rounded-xl px-3.5 text-base font-semibold outline-none transition-shadow focus:ring-2 focus:ring-[var(--green)] focus:border-transparent";

export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
  placeholder?: string;
}) {
  const id = useId();
  const invalid = value.trim() !== "" && Number.isNaN(num(value));
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-2)" }}>
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none" style={{ color: "var(--text-3)" }} aria-hidden>
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid || undefined}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={inputClass}
          style={{ ...inputStyle, paddingLeft: prefix ? "2.1rem" : undefined, paddingRight: suffix ? "3.2rem" : undefined, borderColor: invalid ? "#f87171" : undefined }}
        />
        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none" style={{ color: "var(--text-3)" }} aria-hidden>
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-xs mt-1.5" style={{ color: "var(--text-3)", lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-2)" }}>
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className={`${inputClass} cursor-pointer`} style={inputStyle}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Segmented control implemented as a native radio group (keyboard and screen-reader friendly). */
export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const name = useId();
  return (
    <fieldset className="min-w-0">
      <legend className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-2)" }}>
        {label}
      </legend>
      <div className="grid gap-1 p-1 rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--border)", gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => {
          const on = o.value === value;
          return (
            <label
              key={o.value}
              className="relative flex items-center justify-center text-center rounded-lg px-1.5 py-2.5 min-h-11 text-[13px] font-bold cursor-pointer transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--green)]"
              style={{ background: on ? "var(--green)" : "transparent", color: on ? "#fff" : "var(--text-2)", lineHeight: 1.25 }}
            >
              <input type="radio" name={name} value={o.value} checked={on} onChange={() => onChange(o.value)} className="sr-only" />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-5 h-5 shrink-0 cursor-pointer"
        style={{ accentColor: "var(--green)" }}
      />
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-sm font-semibold" style={{ color: "var(--text-1)" }}>{label}</span>
        {hint && <span className="block text-xs mt-0.5" style={{ color: "var(--text-3)", lineHeight: 1.5 }}>{hint}</span>}
      </label>
    </div>
  );
}

export function SmallButton({ onClick, children, label, variant = "ghost" }: { onClick: () => void; children: ReactNode; label?: string; variant?: "ghost" | "danger" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center gap-1.5 rounded-xl min-h-11 min-w-11 px-3 text-sm font-bold cursor-pointer transition-colors hover:brightness-125"
      style={{ background: "var(--bg-3)", color: variant === "danger" ? "var(--text-3)" : "var(--text-1)", border: "1px solid var(--border)" }}
    >
      {children}
    </button>
  );
}

export function AddRowButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full inline-flex items-center justify-center gap-2 rounded-xl min-h-12 px-4 text-sm font-bold cursor-pointer transition-colors"
      style={{ border: "1.5px dashed color-mix(in srgb, var(--green) 55%, transparent)", color: "var(--green)", background: "transparent" }}
    >
      <Plus className="w-4 h-4" aria-hidden /> {children}
    </button>
  );
}

export function RemoveButton({ onClick, label, disabled }: { onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center rounded-xl w-12 h-12 shrink-0 cursor-pointer transition-colors hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ background: "var(--bg)", color: "var(--text-3)", border: "1px solid var(--border)" }}
    >
      <Trash2 className="w-4 h-4" aria-hidden />
    </button>
  );
}

/* ── Results ─────────────────────────────────────────────────── */

export function Stat({ label, value, sub, highlight = false }: { label: string; value: ReactNode; sub?: ReactNode; highlight?: boolean }) {
  return (
    <div
      className="rounded-2xl p-4 min-w-0"
      style={{
        background: highlight ? "color-mix(in srgb, var(--green) 12%, var(--bg-2))" : "var(--bg-2)",
        border: highlight ? "1px solid color-mix(in srgb, var(--green) 45%, transparent)" : "1px solid var(--border)",
      }}
    >
      <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: highlight ? "var(--green)" : "var(--text-3)" }}>
        {label}
      </p>
      <p className="font-bold break-words" style={{ ...heading, fontSize: highlight ? "clamp(1.5rem,4vw,1.9rem)" : "1.3rem", lineHeight: 1.15 }}>
        {value}
      </p>
      {sub && <p className="text-xs mt-1.5" style={{ color: "var(--text-3)", lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">{children}</div>;
}

export function Notice({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "info" }) {
  const color = tone === "error" ? "#f87171" : "var(--gold)";
  return (
    <div role={tone === "error" ? "alert" : "note"} className="rounded-2xl p-4 text-sm font-semibold" style={{ background: `color-mix(in srgb, ${color} 10%, var(--bg-2))`, border: `1px solid color-mix(in srgb, ${color} 40%, transparent)`, color: "var(--text-1)", lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

/* ── Tables with CSV export / copy ───────────────────────────── */

export interface Column<R> {
  key: keyof R & string;
  label: string;
  /** Display formatter. Defaults to 2 decimal places for numbers. */
  format?: (v: R[keyof R], row: R) => string;
  /** Value written to CSV / clipboard. Defaults to the raw number rounded to 4 dp. */
  raw?: (v: R[keyof R], row: R) => string | number;
  align?: "left" | "right";
}

function cellRaw<R>(c: Column<R>, row: R): string {
  const v = row[c.key];
  if (c.raw) return String(c.raw(v, row));
  if (typeof v === "number") return Number.isFinite(v) ? String(Math.round(v * 10000) / 10000) : "";
  return String(v ?? "");
}

function csvEscape(s: string) {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function DataTable<R>({
  title,
  columns,
  rows,
  filename,
  caption,
  footer,
  rowHighlight,
  maxHeight,
}: {
  title: string;
  columns: Column<R>[];
  rows: R[];
  filename: string;
  caption?: string;
  /** Pre-formatted totals row, keyed by column */
  footer?: Partial<Record<keyof R & string, string>>;
  rowHighlight?: (row: R) => boolean;
  /** Scroll the body vertically above this height (px) */
  maxHeight?: number;
}) {
  const [copied, setCopied] = useState(false);
  const footRaw = (c: Column<R>) => {
    const v = footer?.[c.key] ?? "";
    return /^-?[\d,]+(\.\d+)?%?$/.test(v) ? v.replace(/,/g, "") : v;
  };

  const toDelimited = (sep: string, esc: (s: string) => string) =>
    [
      columns.map((c) => esc(c.label)).join(sep),
      ...rows.map((r) => columns.map((c) => esc(cellRaw(c, r))).join(sep)),
      ...(footer ? [columns.map((c) => esc(footRaw(c))).join(sep)] : []),
    ].join("\n");

  const download = () => {
    const blob = new Blob([toDelimited(",", csvEscape)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toDelimited("\t", (s) => s));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const display = (c: Column<R>, r: R) => {
    const v = r[c.key];
    if (c.format) return c.format(v, r);
    return typeof v === "number" ? fmt(v) : String(v ?? "");
  };

  return (
    <Panel
      title={title}
      actions={
        <div className="flex gap-2">
          <SmallButton onClick={copy} label="Copy table (pastes into Excel or Sheets)">
            {copied ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </SmallButton>
          <SmallButton onClick={download} label="Download table as CSV">
            <Download className="w-4 h-4" aria-hidden /> <span>CSV</span>
          </SmallButton>
        </div>
      }
    >
      <div
        className="overflow-auto -mx-4 sm:mx-0 rounded-none sm:rounded-xl"
        style={{ border: "1px solid var(--border)", maxHeight, overscrollBehaviorX: "contain" }}
        tabIndex={0}
        role="region"
        aria-label={`${title} (scrollable)`}
      >
        <table className="w-full text-sm border-collapse" style={{ fontVariantNumeric: "tabular-nums" }}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="sticky top-0 z-[1]" style={{ background: "var(--bg-3)" }}>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`px-3 py-3 font-bold text-xs uppercase tracking-wider whitespace-nowrap ${c.align === "left" ? "text-left" : "text-right"}`}
                  style={{ color: "var(--text-2)" }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const hi = rowHighlight?.(r);
              return (
                <tr key={i} style={{ borderTop: "1px solid var(--border)", background: hi ? "color-mix(in srgb, var(--green) 12%, transparent)" : undefined }}>
                  {columns.map((c, j) => (
                    <td key={c.key} className={`px-3 py-2.5 whitespace-nowrap ${c.align === "left" ? "text-left" : "text-right"}`} style={{ color: j === 0 ? "var(--text-1)" : "var(--text-2)", fontWeight: j === 0 || hi ? 600 : 400 }}>
                      {display(c, r)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          {footer && (
            <tfoot>
              <tr style={{ borderTop: "2px solid var(--border)", background: "var(--bg-3)" }}>
                {columns.map((c) => (
                  <td key={c.key} className={`px-3 py-3 whitespace-nowrap font-bold ${c.align === "left" ? "text-left" : "text-right"}`} style={{ color: "var(--text-1)" }}>
                    {footer[c.key] ?? ""}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </Panel>
  );
}
