"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  bodyId: string;
  bodyShort: string;
  /** Level names offered in the optional select. */
  levels: string[];
  /** What launches first, e.g. "ACCA BT/MA/FA" — used in the success message. */
  launchLabel: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function WaitlistForm({ bodyId, bodyShort, levels, launchLabel }: Props) {
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!EMAIL_RE.test(clean)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean, body_id: bodyId, level: level || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "done") {
    return (
      <div
        role="status"
        className="rounded-2xl p-5 sm:p-6 flex items-start gap-3"
        style={{ background: "color-mix(in srgb, var(--green) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--green) 35%, transparent)" }}
      >
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--green)" }} />
        <div>
          <p className="font-bold" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            You&apos;re on the list
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
            We&apos;ll email you the moment {launchLabel} banks go live.
          </p>
        </div>
      </div>
    );
  }

  const fieldStyle: React.CSSProperties = {
    background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-1)",
    borderRadius: 12, padding: "12px 14px", fontSize: 15, width: "100%", outline: "none",
    fontFamily: "var(--font-inter), sans-serif",
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor="waitlist-email">Email address</label>
        <input
          id="waitlist-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...fieldStyle, flex: 2 }}
        />
        {levels.length > 0 && (
          <>
            <label className="sr-only" htmlFor="waitlist-level">Level (optional)</label>
            <select
              id="waitlist-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={{ ...fieldStyle, flex: 1, color: level ? "var(--text-1)" : "var(--text-3)" }}
            >
              <option value="">Level (optional)</option>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        style={{ background: "var(--green)", fontFamily: "var(--font-inter), sans-serif", boxShadow: "0 4px 20px color-mix(in srgb, var(--green) 30%, transparent)" }}
      >
        {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
        Notify me when {bodyShort} launches
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm" style={{ color: "#ef4444", fontFamily: "var(--font-inter), sans-serif" }}>{error}</p>
      )}
      <p className="text-xs" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>
        One email when it&apos;s ready. No spam — see our <Link href="/privacy-policy" style={{ color: "var(--text-2)", textDecoration: "underline" }}>privacy policy</Link>.
      </p>
    </form>
  );
}
