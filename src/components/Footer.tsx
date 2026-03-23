import Link from "next/link";
import Image from "next/image";

const NAV = [
  {
    heading: "Tools",
    links: [
      { label: "CA Roadmap", href: "/#path" },
      { label: "MCQ Practice", href: "/practice" },
      { label: "Induction CV Maker", href: "/cv-maker" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "The Story", href: "/about" },
      { label: "Articles", href: "/#articles" },
      { label: "Get the Guide", href: "/#capture" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
];


export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-10">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-5">
              <div className="w-20 h-20 relative" style={{ filter: "var(--logo-filter, none)" }}>
                <Image src="/CAHubNoBG.png" alt="The CA Hub" fill className="object-contain object-left" />
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-6 max-w-[240px]" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
              Every ICAP subject. Free forever. MCQ practice, CV tools, and everything you need to clear on your first attempt.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(61,179,113,0.08)", border: "1px solid rgba(61,179,113,0.2)" }}>
              <span className="relative flex w-[6px] h-[6px]">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75" style={{ background: "var(--green)", animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span className="relative rounded-full w-[6px] h-[6px]" style={{ background: "var(--green)" }} />
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>Live &amp; Free</span>
            </div>
          </div>

          {/* Nav columns */}
          {NAV.map(({ heading, links }) => (
            <div key={heading}>
              <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "var(--text-3)", fontFamily: "var(--font-space-grotesk), sans-serif", marginBottom: 18 }}>
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="link-hover text-sm"
                      style={{
                        color: l.label.includes("✓") ? "var(--green)" : l.label.includes("Coming Soon") ? "var(--text-3)" : "var(--text-2)",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: l.label.includes("✓") ? 600 : 400,
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border)", marginBottom: 28 }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left mb-6">
          <p style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>
            © {year} The CA Hub · Muhammad Ahsan Siddiq
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="link-hover" style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>Privacy</Link>
            <span style={{ color: "var(--border)" }}>·</span>
            <Link href="/terms" className="link-hover" style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>Terms</Link>
            <span style={{ color: "var(--border)" }}>·</span>
            <Link href="/contact" className="link-hover" style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>Contact</Link>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>
            Built for the 90% who were told they weren&apos;t good enough.
          </p>
        </div>

        {/* Clarity Disclosure */}
        <div className="text-center md:text-left mt-8 pt-6 border-t border-[var(--border)]">
          <p style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.6 }}>
            We improve our products and advertising by using Microsoft Clarity to see how you use our website. By using our site, you agree that we and Microsoft can collect and use this data. Our <Link href="/privacy-policy" className="underline hover:text-[var(--text-2)]">privacy statement</Link> has more details.
          </p>
        </div>

      </div>
    </footer>
  );
}
