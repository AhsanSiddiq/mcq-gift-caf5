import { STANDARDS_REVIEWED } from "@/data/standards";

const reviewed = new Date(`${STANDARDS_REVIEWED}T00:00:00Z`).toLocaleDateString("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Shared disclaimer shown on every Standards Hub page. */
export default function StandardsDisclaimer() {
  return (
    <aside
      className="rounded-2xl p-5 text-sm leading-relaxed"
      style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}
      aria-label="Disclaimer"
    >
      <p className="font-bold mb-2" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
        Disclaimer
      </p>
      <p>
        These are independent study summaries written in our own words for exam revision. They simplify the
        standards, are not a substitute for the authoritative text, and must not be relied on for preparing financial
        statements or professional advice. The CA Hub is not affiliated with or endorsed by the IFRS Foundation.
        IFRS® and IAS® are trademarks of the IFRS Foundation. Always check the current standards and effective dates at{" "}
        <a
          href="https://www.ifrs.org/issued-standards/list-of-standards/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--green)", textDecoration: "underline" }}
        >
          ifrs.org
        </a>
        . Last reviewed {reviewed}.
      </p>
    </aside>
  );
}
