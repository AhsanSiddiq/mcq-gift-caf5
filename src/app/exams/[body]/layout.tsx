import type { ReactNode } from "react";
import { getBody } from "@/data/regions";
import { SITE_URL } from "@/components/Breadcrumbs";

/**
 * BreadcrumbList JSON-LD for the exam hubs (Home › Exams › ICAI). Lives in a layout so the hub page
 * itself (owned separately) stays untouched; the page keeps its own visible "All exams" link.
 */
export default async function ExamHubLayout({ children, params }: { children: ReactNode; params: Promise<{ body: string }> }) {
  const { body } = await params;
  const b = getBody(body);
  const ld = b && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Exams", item: `${SITE_URL}/exams` },
      { "@type": "ListItem", position: 3, name: `${b.short} exams`, item: `${SITE_URL}/exams/${b.id}` },
    ],
  };
  return (
    <>
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />}
      {children}
    </>
  );
}
