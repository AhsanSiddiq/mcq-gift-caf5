"use client";

import dynamic from "next/dynamic";
import type { CatalogSubject } from "./catalog";

/**
 * The planner depends on "today" and on localStorage, so it renders only in the browser
 * (no hydration mismatch, no flash of the empty form for returning visitors).
 */
const StudyPlanner = dynamic(() => import("./StudyPlanner"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-4 animate-pulse" aria-busy="true" aria-label="Loading planner">
      <div className="rounded-3xl h-40" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }} />
      <div className="rounded-3xl h-72" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }} />
    </div>
  ),
});

export default function PlannerLoader({ catalog }: { catalog: CatalogSubject[] }) {
  return <StudyPlanner catalog={catalog} />;
}
