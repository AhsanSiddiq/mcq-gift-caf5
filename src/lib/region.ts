import { cookies, headers } from "next/headers";
import {
  BODY_COOKIE,
  COUNTRY_COOKIE,
  defaultBodyForCountry,
  getBody,
  priceBookForCountry,
  type ExamBody,
  type PriceBook,
} from "@/data/regions";

/**
 * Resolve the visitor's country on the server.
 * Order: explicit cookie (set by proxy / switcher) → Vercel / Cloudflare geo headers.
 */
export async function getVisitorCountry(): Promise<string | undefined> {
  const jar = await cookies();
  const fromCookie = jar.get(COUNTRY_COOKIE)?.value;
  if (fromCookie) return fromCookie.toUpperCase();

  const h = await headers();
  const geo = h.get("x-vercel-ip-country") || h.get("cf-ipcountry");
  return geo && geo !== "XX" ? geo.toUpperCase() : undefined;
}

export interface VisitorRegion {
  country?: string;
  body: ExamBody;
  /** True when the body came from the visitor's own choice rather than IP. */
  chosen: boolean;
  prices: PriceBook;
}

export async function getVisitorRegion(): Promise<VisitorRegion> {
  const country = await getVisitorCountry();
  const jar = await cookies();
  const chosenBody = getBody(jar.get(BODY_COOKIE)?.value);
  const body = chosenBody ?? getBody(defaultBodyForCountry(country))!;
  return { country, body, chosen: !!chosenBody, prices: priceBookForCountry(country) };
}
