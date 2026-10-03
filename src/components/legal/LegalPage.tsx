import Link from "next/link";

/** Shared shell for the legal pages (terms, privacy, refunds). */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--green)" }}>Legal</p>
      <h1 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: "var(--text-1)" }}>{title}</h1>
      <p className="text-sm mb-12" style={{ color: "var(--text-3)" }}>Last updated: {updated}</p>
      <div className="space-y-8" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.7 }}>
        {children}
      </div>
      <nav className="mt-16 pt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ borderTop: "1px solid var(--border)" }}>
        <Link href="/pro" style={{ color: "var(--green)" }}>Pricing</Link>
        <Link href="/terms" style={{ color: "var(--green)" }}>Terms of Service</Link>
        <Link href="/privacy-policy" style={{ color: "var(--green)" }}>Privacy Policy</Link>
        <Link href="/refund-policy" style={{ color: "var(--green)" }}>Refund Policy</Link>
        <Link href="/contact" style={{ color: "var(--green)" }}>Contact</Link>
      </nav>
    </main>
  );
}

export function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>{n}. {title}</h2>
      {children}
    </section>
  );
}

export const linkStyle = { color: "var(--green)" } as const;
export const SUPPORT_EMAIL = "ahsansiddiq01@gmail.com";
