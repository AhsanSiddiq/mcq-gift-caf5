export interface Faq { q: string; a: string }

/** Visible FAQ list + matching FAQPage JSON-LD (server component). */
export default function FaqSection({ faqs, title = "Frequently asked questions" }: { faqs: Faq[]; title?: string }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <h2 id="faq-title" className="font-display font-bold text-2xl sm:text-3xl mb-6" style={{ color: "var(--text-1)" }}>{title}</h2>
      <div className="space-y-2">
        {faqs.map(f => (
          <details key={f.q} className="group rounded-xl px-4 py-3" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
            <summary className="cursor-pointer list-none flex items-start justify-between gap-3 font-semibold text-sm sm:text-base" style={{ color: "var(--text-1)" }}>
              <span>{f.q}</span>
              <span aria-hidden="true" className="transition-transform group-open:rotate-45 text-lg leading-none" style={{ color: "var(--green)" }}>+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
