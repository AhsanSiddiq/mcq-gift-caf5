import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, linkStyle, SUPPORT_EMAIL } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.thecahub.com/refund-policy" },
  title: "Refund Policy | The CA Hub",
  description: "Refund Policy for The CA Hub Pro — 14-day money-back guarantee on all paid plans.",
};

export default function RefundPolicy() {
  return (
    <LegalPage title="Refund Policy" updated="October 2026">
      <Section n={1} title="14-day money-back guarantee">
        <p>
          If you are not happy with The CA Hub Pro for any reason, you can ask for a <strong>full refund within 14 days</strong> of
          your purchase. This applies to every paid plan — the monthly subscription and the one-time exam-sitting pass —
          whatever payment method you used. You don&apos;t need to give a reason.
        </p>
      </Section>

      <Section n={2} title="Card and online payments (Paddle)">
        <p>
          Card, PayPal and other online payments are processed by our reseller <strong>Paddle.com</strong>, who is the Merchant of
          Record for those orders. Refunds are issued by Paddle to the original payment method, normally within 5–10 business
          days of approval. You can also contact Paddle directly through the link in your receipt email or at{" "}
          <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="underline" style={linkStyle}>paddle.net</a>.
        </p>
      </Section>

      <Section n={3} title="Local payments (JazzCash, Easypaisa, bank transfer)">
        <p>
          If you paid by mobile wallet or bank transfer, we refund the full amount to the same wallet or account within 7 business
          days of your request. Please include the transaction ID you submitted at checkout.
        </p>
      </Section>

      <Section n={4} title="Cancelling a subscription">
        <p>
          You can cancel a monthly subscription at any time from your Paddle receipt email or by contacting us. Cancelling stops all
          future renewals; you keep Pro access until the end of the period you have already paid for. After the 14-day window,
          partial months are not refunded, except where the law of your country requires it.
        </p>
      </Section>

      <Section n={5} title="How to request a refund">
        <p>
          Email <a href={`mailto:${SUPPORT_EMAIL}`} className="underline" style={linkStyle}>{SUPPORT_EMAIL}</a> or use our{" "}
          <Link href="/contact" className="underline" style={linkStyle}>contact form</Link> with the email address you used to
          buy Pro. We reply within 2 business days. Once a refund is processed, Pro access on that email ends.
        </p>
      </Section>

      <Section n={6} title="Your statutory rights">
        <p>This policy does not affect any rights you have under consumer-protection law in your country.</p>
      </Section>
    </LegalPage>
  );
}
