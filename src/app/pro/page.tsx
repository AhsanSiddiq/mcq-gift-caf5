import type { Metadata } from "next";
import { getVisitorRegion } from "@/lib/region";
import ProCheckout from "./ProCheckout";

export const metadata: Metadata = {
  title: "The CA Hub Pro – Unlimited Timed Exams, Ad-Free",
  description:
    "Go Pro: unlimited timed exam simulators, a completely ad-free site and early access to new exam banks. Priced locally for your country. Practice stays free for everyone.",
  alternates: { canonical: "https://www.thecahub.com/pro" },
  openGraph: {
    title: "The CA Hub Pro",
    description: "Unlimited timed exam simulators and an ad-free CA Hub, priced for your country.",
    url: "https://www.thecahub.com/pro",
    images: [{ url: "/CAHub.png", width: 1200, height: 630, alt: "The CA Hub Pro" }],
  },
};

export default async function ProPage() {
  const region = await getVisitorRegion();

  const paymentDetails: Record<string, string | undefined> = {
    JazzCash: process.env.NEXT_PUBLIC_PAY_JAZZCASH || "0329-2090999 (Muhammad Ahsan Siddiq)",
    Easypaisa: process.env.NEXT_PUBLIC_PAY_EASYPAISA,
    "Bank transfer": process.env.NEXT_PUBLIC_PAY_BANK,
    bKash: process.env.NEXT_PUBLIC_PAY_BKASH,
  };
  // Only offer local rails the owner has configured an account for
  const localRails = (region.prices.localRails ?? []).filter((r) => paymentDetails[r]);

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <p className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "var(--gold)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          The CA Hub Pro
        </p>
        <h1 className="font-bold mb-4"
          style={{ fontSize: "clamp(2rem,5vw,3.25rem)", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1.1 }}>
          Practice is free. <br />
          <span style={{ color: "var(--green)" }}>Exam day is where Pro pays off.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mb-12"
          style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.7 }}>
          Every MCQ, topical drill and random mock stays free, always. Pro adds unlimited timed exam simulators, removes every ad,
          and gets you first access to each new exam bank as we expand beyond {region.body.short === "ICAP" ? "ICAP" : "our first markets"}.
          Prices are set for {region.country ? "your country" : "your region"}.
        </p>

        <ProCheckout
          prices={region.prices}
          localRails={localRails}
          paymentDetails={Object.fromEntries(localRails.map((r) => [r, paymentDetails[r]!]))}
          tutor={!!(process.env.OPENAI_API_KEY || process.env.NVIDIA_API_KEY || process.env.ANTHROPIC_API_KEY)}
          paddle={{
            clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
            env: process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox" ? "sandbox" : "production",
            monthlyPriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_MONTHLY,
            sittingPriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_SITTING,
          }}
        />
      </div>
    </main>
  );
}
