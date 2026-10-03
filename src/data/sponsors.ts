/**
 * Paid placements sold via /advertise. Add a sponsor here when a deal closes;
 * an empty list shows a house ad inviting academies to advertise.
 */
export interface Sponsor {
  id: string;
  name: string;
  tagline: string;
  url: string; // include utm params so the sponsor can see the traffic
  cta: string;
  /** Limit to levels (e.g. ["CAF"]); omit to show everywhere. */
  levels?: ("PRC" | "CAF")[];
  /** ISO date after which the placement stops showing. */
  until: string;
}

export const SPONSORS: Sponsor[] = [];

export function activeSponsor(level?: string): Sponsor | undefined {
  const now = Date.now();
  return SPONSORS.find(
    (s) => new Date(s.until).getTime() > now && (!s.levels || !level || s.levels.includes(level.toUpperCase() as "PRC" | "CAF"))
  );
}
