import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, linkStyle, SUPPORT_EMAIL } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.thecahub.com/terms" },
  title: "Terms of Service | The CA Hub",
  description: "Terms of Service for The CA Hub — free practice, Pro subscriptions, payments and acceptable use.",
};

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="October 2026">
      <Section n={1} title="About us and acceptance">
        <p>
          The CA Hub (<strong>thecahub.com</strong>) is an online exam-preparation service for accountancy students, operated by
          Muhammad Ahsan Siddiq (&quot;we&quot;, &quot;us&quot;). By accessing or using the site you agree to these Terms of
          Service. If you do not agree, please do not use the service.
        </p>
      </Section>

      <Section n={2} title="The service">
        <p>
          We provide MCQ question banks, timed mock exams, a daily challenge, an AI tutor, study articles and career tools for
          students of ICAP, ACCA, ICAI, CIMA, ICAEW, IMA (US CMA) and similar qualifications. Core practice is free. We are an
          independent provider and are <strong>not affiliated with or endorsed by any professional body</strong>; their names
          are used only to describe the exams our material helps you prepare for. All content is for educational purposes and
          is not professional accounting, tax or legal advice.
        </p>
      </Section>

      <Section n={3} title="Accounts">
        <p>
          Some features require you to sign in with your email address using a one-time code. You are responsible for keeping
          access to your email secure and for activity on your account. One Pro purchase is for one person; please don&apos;t share
          accounts.
        </p>
      </Section>

      <Section n={4} title="Paid plans (The CA Hub Pro)">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>What you get:</strong> unlimited timed mock exams, a higher daily AI-tutor allowance, an ad-free experience and
            early access to new question banks, as described on our <Link href="/pro" className="underline" style={linkStyle}>pricing page</Link>.
          </li>
          <li>
            <strong>Plans and prices:</strong> a monthly subscription that renews automatically each month until cancelled, and a
            one-time exam-sitting pass that gives access for the stated period and does not renew. Prices are shown in your local
            currency before you pay and may include applicable taxes.
          </li>
          <li>
            <strong>Cancellation:</strong> you can cancel a subscription at any time; access continues until the end of the paid
            period and no further charges are made.
          </li>
          <li>
            <strong>Refunds:</strong> every plan has a 14-day money-back guarantee — see our{" "}
            <Link href="/refund-policy" className="underline" style={linkStyle}>Refund Policy</Link>.
          </li>
          <li>
            <strong>Price changes:</strong> we may change prices for future billing periods and will tell subscribers by email
            before a change takes effect.
          </li>
        </ul>
      </Section>

      <Section n={5} title="Payments and our reseller">
        <p>
          Our order process is conducted by our online reseller <strong>Paddle.com</strong>. Paddle.com is the Merchant of Record
          for all our card and online orders. Paddle provides all customer service inquiries and handles returns for those
          orders, and its <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className="underline" style={linkStyle}>buyer terms</a> also
          apply to your purchase. In some countries we also accept local payment methods (such as JazzCash, Easypaisa or bank
          transfer), which we process ourselves; Pro is activated once we have confirmed the payment.
        </p>
      </Section>

      <Section n={6} title="Intellectual property">
        <p>
          All content on the platform — including questions, explanations, articles and software — belongs to The CA Hub or its
          licensors unless otherwise credited. You may use it for your own personal study. You may not copy, scrape, resell or
          redistribute it without our written permission.
        </p>
      </Section>

      <Section n={7} title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>use the service for any unlawful purpose;</li>
          <li>scrape, copy or extract content or data in bulk, including through the AI tutor;</li>
          <li>attempt to hack, overload, reverse-engineer or disrupt the service;</li>
          <li>misrepresent your identity, or share or resell your Pro access.</li>
        </ul>
        <p className="mt-2">We may suspend accounts that break these rules.</p>
      </Section>

      <Section n={8} title="Accuracy and the AI tutor">
        <p>
          We work hard to keep questions accurate and current, but syllabuses, standards and tax laws change and mistakes happen.
          AI-tutor explanations are generated automatically and may contain errors. Always confirm with your professional body&apos;s
          official study material. You can report a problem through our <Link href="/contact" className="underline" style={linkStyle}>contact page</Link>.
        </p>
      </Section>

      <Section n={9} title="Advertising and sponsors">
        <p>Free pages may show advertising (for example Google AdSense) and clearly labelled sponsor placements. Pro members do not see display ads.</p>
      </Section>

      <Section n={10} title="Limitation of liability">
        <p>
          The service is provided &quot;as is&quot;. To the extent permitted by law, we are not liable for exam results, academic
          outcomes, decisions made based on our content, or any indirect or consequential loss. Our total liability for any claim
          is limited to the amount you paid us in the 12 months before the claim. Nothing in these terms limits rights you have
          under consumer law that cannot be excluded.
        </p>
      </Section>

      <Section n={11} title="Changes and termination">
        <p>
          We may update these terms; the &quot;last updated&quot; date shows the current version, and we will email Pro members about
          material changes. You may stop using the service at any time.
        </p>
      </Section>

      <Section n={12} title="Governing law and contact">
        <p>
          These terms are governed by the laws of Pakistan, without affecting mandatory consumer protections in your country.
          Questions? Email <a href={`mailto:${SUPPORT_EMAIL}`} className="underline" style={linkStyle}>{SUPPORT_EMAIL}</a>. See also our{" "}
          <Link href="/privacy-policy" className="underline" style={linkStyle}>Privacy Policy</Link>.
        </p>
      </Section>
    </LegalPage>
  );
}
