import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | The CA Hub",
  description: "Privacy Policy for The CA Hub — how we collect, use, and protect your data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--green)" }}>Legal</p>
      <h1 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: "var(--text-1)" }}>Privacy Policy</h1>
      <p className="text-sm mb-12" style={{ color: "var(--text-3)" }}>Last updated: March 2026</p>

      <div className="prose prose-sm md:prose-base max-w-none space-y-8" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>1. Who We Are</h2>
          <p>The CA Hub (<strong>thecahub.com</strong>) is a free educational platform for ICAP CA students, built and operated by Muhammad Ahsan Siddiq. Our mission is to make high-quality CA exam resources accessible to every student in Pakistan.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>2. Information We Collect</h2>
          <p>We collect the following information:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Email address</strong> — if you voluntarily subscribe to our newsletter or guides.</li>
            <li><strong>Usage data</strong> — anonymous analytics data such as pages visited, time on page, and browser type, collected via Google Analytics and Google AdSense.</li>
            <li><strong>Quiz progress</strong> — stored locally in your browser (localStorage) to track your practice sessions. We do not send this to our servers.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To send you requested resources, guides, or newsletters (email only).</li>
            <li>To improve the platform based on anonymous usage patterns.</li>
            <li>To display relevant advertisements via Google AdSense.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>4. Google AdSense and Cookies</h2>
          <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this or other websites. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--green)" }}>Google Ad Settings</a>.</p>
          <p className="mt-2">Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits. These cookies do not store personally identifiable information.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>5. Data Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share anonymous, aggregated data with analytics providers (Google Analytics) for platform improvement purposes only.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>6. Data Retention</h2>
          <p>Email addresses are retained until you unsubscribe. You can request deletion of your email from our list at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>7. Your Rights</h2>
          <p>You have the right to access, correct, or delete any personal data we hold about you. To exercise these rights, contact us at <a href="mailto:ahsansiddiq01@gmail.com" className="underline" style={{ color: "var(--green)" }}>ahsansiddiq01@gmail.com</a>.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. We will notify subscribers of any significant changes. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-3" style={{ color: "var(--text-1)" }}>9. Contact</h2>
          <p>For any privacy-related questions, email us at <a href="mailto:ahsansiddiq01@gmail.com" className="underline" style={{ color: "var(--green)" }}>ahsansiddiq01@gmail.com</a>.</p>
        </section>
      </div>
    </main>
  );
}
