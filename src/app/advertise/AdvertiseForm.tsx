"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdvertiseForm() {
  const [form, setForm] = useState({ name: "", email: "", org: "", interest: "Featured Academy", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `Sponsorship: ${form.interest} — ${form.org}`,
          message: `Organisation: ${form.org}\nInterested in: ${form.interest}\n\n${form.message}`,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const input = { background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-1)" };

  if (status === "sent") {
    return (
      <div className="rounded-2xl p-6" style={{ background: "rgba(61,179,113,0.08)", border: "1px solid rgba(61,179,113,0.3)", color: "var(--text-1)" }}>
        ✅ Thanks — we&apos;ll reply within one working day with availability and a short proposal.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
      <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl px-4 py-3 text-sm outline-none" style={input} />
      <input required type="email" placeholder="Work email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl px-4 py-3 text-sm outline-none" style={input} />
      <input required placeholder="Academy / firm" value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} className="rounded-xl px-4 py-3 text-sm outline-none" style={input} />
      <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} className="rounded-xl px-4 py-3 text-sm outline-none" style={input}>
        {["Featured Academy", "Daily Challenge Partner", "Hiring Spotlight", "Launch Announcement"].map((o) => <option key={o}>{o}</option>)}
      </select>
      <textarea required rows={4} placeholder="What would you like to promote, and when?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-xl px-4 py-3 text-sm outline-none" style={input} />
      <button type="submit" disabled={status === "sending"} className="rounded-xl px-5 py-3 font-bold text-white cursor-pointer disabled:opacity-60" style={{ background: "var(--green)" }}>
        {status === "sending" ? <Loader2 className="w-4 h-4 inline animate-spin" /> : "Request a proposal"}
      </button>
      {status === "error" && <p className="text-sm" style={{ color: "#f87171" }}>Something went wrong — email thecahub01@gmail.com instead.</p>}
    </form>
  );
}
