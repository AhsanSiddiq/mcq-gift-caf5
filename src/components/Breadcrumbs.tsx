import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const SITE_URL = "https://www.thecahub.com";

export interface Crumb {
  name: string;
  /** Site-relative path. Omit on the last crumb (the current page) if you like; it is not linked. */
  href: string;
  /** Shorter label shown on screen (the full name still goes into JSON-LD). */
  short?: string;
}

/**
 * Visible breadcrumb trail plus matching BreadcrumbList JSON-LD.
 * The last crumb is the current page. Pass jsonLd={false} when the page already emits its own.
 */
export default function Breadcrumbs({ items, jsonLd = true, className = "mb-6" }: { items: Crumb[]; jsonLd?: boolean; className?: string }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.href === "/" ? "" : c.href}`,
    })),
  };
  const last = items.length - 1;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      )}
      <nav aria-label="Breadcrumb" className={`text-sm ${className}`} style={{ color: "var(--text-3)" }}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 min-w-0">
          {items.map((c, i) => (
            <li key={`${c.href}-${i}`} className="flex items-center gap-1.5 min-w-0">
              {i === last ? (
                <span aria-current="page" className="block truncate max-w-[70vw] sm:max-w-[28rem]" style={{ color: "var(--text-2)" }}>
                  {c.short ?? c.name}
                </span>
              ) : (
                <>
                  <Link
                    prefetch={false}
                    href={c.href}
                    className="block truncate max-w-[40vw] sm:max-w-[16rem] no-underline hover:underline underline-offset-2"
                    style={{ color: "var(--text-3)" }}
                  >
                    {c.short ?? c.name}
                  </Link>
                  <ChevronRight aria-hidden className="w-3.5 h-3.5 shrink-0 opacity-60" />
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
