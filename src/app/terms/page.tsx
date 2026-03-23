import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | The CA Hub",
  description: "Terms of Use for The CA Hub — the rules governing your use of our platform.",
};

export default function Terms() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--green)" }}>Legal</p>
      <h1 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: "var(--text-1)" }}>Terms of Use</h1>
      <p className="text-sm mb-12" style={{ color: "var(--text-3)" }}>Last updated: March 2026</p>

      <div className="space-y-8" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>1. Acceptance</h2>
          <p>By accessing or using The CA Hub, you agree to be bound by these Terms of Use. If you do not agree, please do not use the platform.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>2. Educational Purpose</h2>
          <p>The CA Hub provides free educational content, MCQ practice tools, and study resources for ICAP CA exam students. All content is for educational and informational purposes only. It does not constitute professional accounting or legal advice.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>3. Intellectual Property</h2>
          <p>All content on this platform — including MCQs, explanations, guides, and written materials — is the original work of Muhammad Ahsan Siddiq and The CA Hub unless otherwise credited. You may not reproduce, copy, or redistribute this content for commercial purposes without written permission.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Use the platform for any unlawful purpose.</li>
            <li>Scrape, copy, or extract content or data in bulk.</li>
            <li>Attempt to reverse-engineer, hack, or disrupt the platform.</li>
            <li>Misrepresent your identity or affiliation.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>5. Accuracy of Content</h2>
          <p>We strive for accuracy in all MCQs and explanations. However, CA curricula and ICAP standards change over time. We make no guarantee that all content is current or error-free. Always verify with official ICAP study materials.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>6. Advertisements</h2>
          <p>The CA Hub is free to use and is supported by advertising via Google AdSense. By using this site, you consent to the display of these advertisements.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>7. Limitation of Liability</h2>
          <p>The CA Hub is provided "as is." We are not liable for any exam results, academic outcomes, decisions made based on content found here, or any indirect, incidental, or consequential damages arising from use of this platform.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>8. Changes</h2>
          <p>We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>9. Contact</h2>
          <p>Questions about these terms? Email <a href="mailto:ahsansiddiq01@gmail.com" className="underline" style={{ color: "var(--green)" }}>ahsansiddiq01@gmail.com</a>.</p>
        </section>
      </div>
    </main>
  );
}
