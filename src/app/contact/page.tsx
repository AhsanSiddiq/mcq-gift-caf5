"use client";
import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-24 md:py-32">
      <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--green)" }}>Get in Touch</p>
      <h1 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: "var(--text-1)" }}>Contact</h1>
      <p className="text-lg mb-12" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
        Found an error in an MCQ, want to collaborate, or have a question? Send a message and we will get back to you.
      </p>

      {status === "sent" ? (
        <div className="p-8 rounded-2xl text-center" style={{ background: "rgba(61,179,113,0.08)", border: "1px solid rgba(61,179,113,0.25)" }}>
          <p className="text-2xl mb-3">✅</p>
          <p className="font-bold text-lg mb-2" style={{ color: "var(--text-1)" }}>Message received.</p>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>We will get back to you within 24 to 48 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { id: "name", label: "Your Name", type: "text", placeholder: "Muhammad Ali" },
            { id: "email", label: "Email Address", type: "email", placeholder: "you@email.com" },
            { id: "subject", label: "Subject", type: "text", placeholder: "Question about CAF-5 MCQs" },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-semibold mb-2" style={{ color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}>{label}</label>
              <input
                id={id} type={type} placeholder={placeholder} required
                value={form[id as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
          ))}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}>Message</label>
            <textarea
              id="message" rows={5} placeholder="Write your message here..." required
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none transition-colors"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>
          <button
            type="submit" disabled={status === "sending"}
            className="shimmer-btn w-full font-bold rounded-xl px-6 py-4 text-white"
            style={{ fontSize: 14, fontFamily: "var(--font-space-grotesk), sans-serif", border: "none", cursor: "pointer", opacity: status === "sending" ? 0.7 : 1 }}
          >
            {status === "sending" ? "Sending..." : "Send Message →"}
          </button>
          {status === "error" && (
            <p className="text-sm text-center" style={{ color: "#F87171" }}>
              Something went wrong. Email us directly at{" "}
              <a href="mailto:ahsansiddiq01@gmail.com" className="underline">ahsansiddiq01@gmail.com</a>
            </p>
          )}
        </form>
      )}

      <div className="mt-16 pt-10 border-t" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-1)" }}>Direct email</p>
        <a href="mailto:ahsansiddiq01@gmail.com" className="text-sm" style={{ color: "var(--green)" }}>ahsansiddiq01@gmail.com</a>
        <p className="text-xs mt-4" style={{ color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>We usually respond within 24 to 48 hours.</p>
      </div>
    </main>
  );
}
