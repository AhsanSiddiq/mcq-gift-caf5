import { NextResponse, type NextRequest } from "next/server";
import { COUNTRY_COOKIE } from "@/data/regions";

/**
 * Edge proxy (Next 16's renamed middleware).
 *
 * Only job: remember the visitor's IP country in a cookie so server and client
 * code can suggest the right exam body. It never redirects — every existing
 * URL (including the Pakistani SEO pages) keeps resolving exactly as before.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (request.cookies.has(COUNTRY_COOKIE)) return response;

  const geo = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry");
  const country = geo?.trim().toUpperCase();
  if (country && /^[A-Z]{2}$/.test(country) && country !== "XX" && country !== "T1") {
    response.cookies.set(COUNTRY_COOKIE, country, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  // Skip Next internals, API routes and any request for a static file (has an extension).
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
