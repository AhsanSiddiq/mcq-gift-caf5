import type { Metadata } from "next";
import { Megaphone, CalendarDays, Briefcase, BookOpen } from "lucide-react";
import AdvertiseForm from "./AdvertiseForm";

export const metadata: Metadata = {
  title: "Advertise to ICAP CA Students – Sponsorships",
  description:
    "Reach ICAP PRC and CAF students where they study every day. Sponsored placements on subject pages, the daily challenge and the CA induction CV maker.",
  alternates: { canonical: "https://thecahub.com/advertise" },
};

const PACKAGES = [
  {
    icon: BookOpen,
    name: "Featured Academy",
    price: "Rs 25,000 / month",
    desc: "Your academy on every PRC or CAF subject page and question bank — exactly where students decide where to take classes.",
  },
  {
    icon: CalendarDays,
    name: "Daily Challenge Partner",
    price: "Rs 15,000 / month",
    desc: "“Today’s challenge is brought to you by…” on the daily 10-question challenge that students share in WhatsApp groups.",
  },
  {
    icon: Briefcase,
    name: "Hiring Spotlight",
    price: "Rs 30,000 / intake",
    desc: "For audit firms recruiting trainees: a featured card on the CA induction CV maker during the induction season.",
  },
  {
    icon: Megaphone,
    name: "Launch Announcement",
    price: "Custom",
    desc: "New batch, scholarship test or open day? A one-off placement across the site for the week that matters.",
  },
];

export default function AdvertisePage() {
  const heading = { color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" };
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          Advertise
        </p>
        <h1 className="font-bold mb-4" style={{ ...heading, fontSize: "clamp(2rem,5vw,3rem)", lineHeight: 1.1 }}>
          Reach CA students <span style={{ color: "var(--green)" }}>while they study.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mb-12" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
          The CA Hub is where ICAP PRC and CAF students drill thousands of MCQs, take timed mocks and build their induction CVs —
          built by ICAP&apos;s first 6-paper CFAP gold medalist. Sponsorships are clearly labelled, limited to one partner per slot,
          and only for academies, firms and services that genuinely help students.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {PACKAGES.map(({ icon: Icon, name, price, desc }) => (
            <div key={name} className="rounded-2xl p-6" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
              <Icon className="w-6 h-6 mb-3" style={{ color: "var(--green)" }} />
              <p className="font-bold text-lg" style={heading}>{name}</p>
              <p className="text-sm font-bold mb-2" style={{ color: "var(--gold)" }}>{price}</p>
              <p className="text-sm" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-bold text-2xl mb-3" style={heading}>Founding partner rates</h2>
            <p className="text-sm mb-3" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
              The first partners lock in these rates for 12 months as the platform expands beyond ICAP to ACCA and other bodies.
              We share monthly click reports with every partner (all links carry UTM tags so you can verify them in your own analytics).
            </p>
            <p className="text-sm" style={{ color: "var(--text-3)", lineHeight: 1.7 }}>
              We don&apos;t accept ads for paper leaks, guaranteed-pass schemes, or anything that misleads students.
            </p>
          </div>
          <AdvertiseForm />
        </div>
      </div>
    </main>
  );
}
