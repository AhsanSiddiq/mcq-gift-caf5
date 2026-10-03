import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, linkStyle, SUPPORT_EMAIL } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.thecahub.com/privacy-policy" },
  title: "Privacy Policy | The CA Hub",
  description: "Privacy Policy for The CA Hub — what we collect, how payments are handled, and your rights.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026">
      <Section n={1} title="Who we are">
        <p>
          The CA Hub (<strong>thecahub.com</strong>) is an exam-preparation platform for accountancy students worldwide, operated
          by Muhammad Ahsan Siddiq, who is the data controller for the information described here.
        </p>
      </Section>

      <Section n={2} title="Information we collect">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Email address</strong>, if you sign in, join a waitlist, subscribe to guides, or buy Pro.</li>
          <li><strong>Practice progress</strong> (answers, scores, flagged questions). This is stored in your browser and, when you sign in, synced to our database so it follows you across devices.</li>
          <li><strong>Payment information.</strong> Card and online payments are handled by Paddle.com, our Merchant of Record — we never see or store your full card details. We receive your email, country, the plan bought and the transaction ID. For local payments (JazzCash, Easypaisa, bank transfer) we store the name, email, amount and transaction reference you submit.</li>
          <li><strong>AI tutor requests.</strong> The question you asked about and, for rate limiting, your email or IP address and a daily usage count. Question text is sent to our AI providers (such as NVIDIA, OpenAI or Anthropic) to generate an explanation; no personal information is included.</li>
          <li><strong>Usage data</strong> such as pages visited, approximate country (from your IP address, used to show local prices and exams), device and browser type, collected through cookies and analytics tools.</li>
          <li><strong>Messages</strong> you send us through the contact or advertising forms.</li>
        </ul>
      </Section>

      <Section n={3} title="How we use it">
        <ul className="list-disc pl-5 space-y-2">
          <li>To provide the service: sign-in, progress sync, Pro access and the AI tutor.</li>
          <li>To process payments, prevent fraud and meet tax and accounting obligations.</li>
          <li>To send emails you asked for (sign-in codes, receipts, guides, launch notices). You can unsubscribe from marketing at any time.</li>
          <li>To improve the platform and, for free users, to show advertising.</li>
        </ul>
      </Section>

      <Section n={4} title="Analytics, cookies and advertising">
        <h3 className="font-bold text-lg mt-2 mb-2" style={{ color: "var(--text-1)" }}>Microsoft Clarity</h3>
        <p>
          We use Microsoft Clarity and Microsoft Advertising to understand how visitors use the site through behavioural metrics,
          heatmaps and session replay, using first- and third-party cookies. See the{" "}
          <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer" className="underline" style={linkStyle}>Microsoft Privacy Statement</a>.
        </p>
        <h3 className="font-bold text-lg mt-6 mb-2" style={{ color: "var(--text-1)" }}>Google Analytics and AdSense</h3>
        <p>
          We use Google Analytics to measure traffic and Google AdSense to show ads to free users. Google uses cookies to serve ads
          based on your prior visits to this and other websites. You can opt out of personalised advertising in{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline" style={linkStyle}>Google Ad Settings</a>.
        </p>
        <h3 className="font-bold text-lg mt-6 mb-2" style={{ color: "var(--text-1)" }}>Our own cookies</h3>
        <p>We set small first-party cookies to remember your country and exam body, and keep your sign-in in browser storage.</p>
      </Section>

      <Section n={5} title="Who we share data with">
        <p>
          We do not sell your personal information. We share it only with service providers that run the platform for us:
          Paddle (payments), Supabase (database), Vercel (hosting), our email provider, our AI providers (question text only),
          and Google and Microsoft (analytics and ads). Some of these providers process data outside your country, under their
          own safeguards.
        </p>
      </Section>

      <Section n={6} title="Retention">
        <p>
          Account and progress data are kept while your account is active and deleted on request. Payment records are kept for as
          long as tax and accounting law requires (normally up to 7 years). Marketing emails stop as soon as you unsubscribe.
        </p>
      </Section>

      <Section n={7} title="Your rights">
        <p>
          You can ask to access, correct, export or delete your personal data, or object to its use, by emailing{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline" style={linkStyle}>{SUPPORT_EMAIL}</a>. We reply within 30 days.
          The service is not directed at children under 13.
        </p>
      </Section>

      <Section n={8} title="Changes">
        <p>We may update this policy; the date above shows the current version, and we will email account holders about significant changes.</p>
      </Section>

      <Section n={9} title="Contact">
        <p>
          Privacy questions: <a href={`mailto:${SUPPORT_EMAIL}`} className="underline" style={linkStyle}>{SUPPORT_EMAIL}</a>. See also our{" "}
          <Link href="/terms" className="underline" style={linkStyle}>Terms of Service</Link> and{" "}
          <Link href="/refund-policy" className="underline" style={linkStyle}>Refund Policy</Link>.
        </p>
      </Section>
    </LegalPage>
  );
}
