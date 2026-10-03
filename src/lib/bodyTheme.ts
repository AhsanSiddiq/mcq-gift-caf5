import { BODY_COOKIE, COUNTRY_COOKIE, COUNTRY_DEFAULT_BODY } from "@/data/regions";
import { BODY_THEMES } from "@/data/themes";

/**
 * Decides which qualification the visitor is "in" and exposes it as <html data-body="…">,
 * which drives the accent colour (globals.css) and the home-page variant.
 *
 * Order: the page's own qualification (e.g. /acca/…, /exams/cima) → search bots get ICAP
 * (keeps the ICAP home page fully visible for SEO) → explicit choice cookie → IP-country
 * default → ICAP. Bodies without a live bank resolve to "other" (generic picker home).
 */
export function resolveBodyClient(cfg: {
  paths: Record<string, string>;
  live: string[];
  countryDefault: Record<string, string>;
  bodyCookie: string;
  countryCookie: string;
}): string {
  const seg = location.pathname.split("/").filter(Boolean);
  const first = (seg[0] || "").toLowerCase();
  if ((first === "exams" || first === "daily") && seg[1]) {
    const id = seg[1].toLowerCase();
    return cfg.live.indexOf(id) >= 0 ? id : "other";
  }
  if (first === "daily") return "icap";
  if (cfg.paths[first]) return cfg.paths[first];
  if (/bot|crawl|spider|slurp|lighthouse|mediapartners/i.test(navigator.userAgent)) return "icap";
  const read = (name: string) => {
    const hit = document.cookie.split("; ").find((c) => c.indexOf(name + "=") === 0);
    return hit ? decodeURIComponent(hit.slice(name.length + 1)) : "";
  };
  const chosen = read(cfg.bodyCookie);
  const country = read(cfg.countryCookie).toUpperCase();
  const body = chosen || (country ? cfg.countryDefault[country] || "acca" : "icap");
  return cfg.live.indexOf(body) >= 0 ? body : "other";
}

export const BODY_THEME_CONFIG = {
  paths: { prc: "icap", caf: "icap", acca: "acca", "ca-foundation": "icai", "ca-inter": "icai", cima: "cima", icaew: "icaew", cma: "ima" } as Record<string, string>,
  live: Object.keys(BODY_THEMES),
  countryDefault: COUNTRY_DEFAULT_BODY,
  bodyCookie: BODY_COOKIE,
  countryCookie: COUNTRY_COOKIE,
};

export function applyBodyTheme() {
  document.documentElement.dataset.body = resolveBodyClient(BODY_THEME_CONFIG);
}

/** Inline <head> script so the right colours paint on first frame (no green flash). */
export const BODY_THEME_SCRIPT = `try{document.documentElement.dataset.body=(${resolveBodyClient.toString()})(${JSON.stringify(BODY_THEME_CONFIG)})}catch(e){}`;
