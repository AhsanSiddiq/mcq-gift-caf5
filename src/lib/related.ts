import { allSubjects, subjectBody, type BodyId, type Level, type Subject } from "@/data/subjects";
import { TOOLS, type ToolMeta } from "@/data/tools";
import type { BlogPost } from "@/data/blogs";
import { paperCode } from "@/lib/navigation";

/**
 * Works out what a blog post is about (qualification, papers, calculators) from its tag, title and text,
 * so the end of each post can point to the right question banks, tools and articles.
 */

const BODY_RX: [BodyId, RegExp][] = [
  ["icap", /\bICAP\b|\bPRC\b|\bCAF\b|\bCFAP\b|Pakistan/],
  ["icai", /\bICAI\b|CA Foundation|CA Inter|\bIndia/],
  ["acca", /\bACCA\b/],
  ["cima", /\bCIMA\b/],
  ["icaew", /\bICAEW\b/],
  ["ima", /US CMA|\bIMA\b/],
];

const TAG_BODY: Record<string, BodyId> = {
  ACCA: "acca",
  CIMA: "cima",
  ICAEW: "icaew",
  "US CMA": "ima",
  "CA Foundation": "icai",
  "CA Intermediate": "icai",
  "ICAP Updates": "icap",
  Admissions: "icap",
};

const LEVEL_RX: [Level, RegExp][] = [
  ["PRC", /\bPRC\b/],
  ["CAF", /\bCAF\b/],
  ["CA-FOUNDATION", /CA Foundation/],
  ["CA-INTER", /CA Inter/],
];

const TOOL_RX: Record<string, RegExp> = {
  "npv-irr-calculator": /\bnpv\b|\birr\b|net present value|discounted cash/g,
  "wacc-calculator": /\bwacc\b|cost of capital/g,
  "financial-ratios-calculator": /\bratios?\b|gearing|liquidity/g,
  "eoq-calculator": /\beoq\b|economic order quantity|reorder level/g,
  "break-even-calculator": /break-?even|\bcvp\b|contribution margin|margin of safety/g,
  "depreciation-calculator": /depreciation/g,
  "loan-amortization-calculator": /amorti[sz]|lease liabilit/g,
  "compound-interest-calculator": /compound interest|annuit|time value of money|future value/g,
};

export interface BlogContext {
  bodies: BodyId[];
  subjects: Subject[];
  tools: ToolMeta[];
}

const live = allSubjects.filter((s) => s.isAvailable);

export function blogContext(b: BlogPost): BlogContext {
  const head = `${b.title} ${b.excerpt}`;

  // Qualifications named in the title/excerpt, else implied by the tag
  let bodies = BODY_RX.filter(([, rx]) => rx.test(head)).map(([id]) => id);
  const tagBody = TAG_BODY[b.tag];
  if (tagBody) bodies = [tagBody, ...bodies.filter((x) => x !== tagBody)];

  // Papers named in the title: "CAF-5", "ACCA MA", "BA1", "Part 1", "Quantitative Aptitude"…
  let subjects: Subject[] = [];
  if (/BA1\s*[–-]\s*BA4/.test(b.title)) subjects = live.filter((s) => subjectBody(s) === "cima");
  else {
    subjects = live.filter((s) => {
      const body = subjectBody(s);
      if (new RegExp(`\\b${s.id}\\b`, "i").test(b.title)) return true;
      if (!bodies.includes(body)) return false;
      const code = paperCode(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${code}\\b`).test(b.title) || b.title.toLowerCase().includes(s.title.toLowerCase());
    });
  }

  // Otherwise: the level named in the title (e.g. all PRC papers), else the first papers of each qualification
  // A post about every qualification is general advice: let the reader pick (handled by the page)
  if (bodies.length > 3) subjects = [];
  else if (subjects.length === 0) {
    const levels = LEVEL_RX.filter(([, rx]) => rx.test(b.title)).map(([l]) => l);
    subjects = levels.length
      ? live.filter((s) => levels.includes(s.level))
      : bodies.flatMap((body) => live.filter((s) => subjectBody(s) === body).slice(0, bodies.length > 2 ? 2 : bodies.length > 1 ? 3 : 4));
  }
  subjects = subjects.slice(0, 6);

  // Calculators: keyword hits in the article, plus tools that practise the same papers
  const text = `${b.title} ${b.content}`.toLowerCase();
  const ids = new Set(subjects.map((s) => s.id));
  const scored = TOOLS.map((t) => {
    const rx = TOOL_RX[t.slug];
    const hits = rx ? (text.match(rx)?.length ?? 0) : 0;
    const overlap = t.practise.filter((id) => ids.has(id)).length;
    // One passing mention is not enough unless the tool also covers the post's papers
    return { t, score: hits >= 2 || (hits === 1 && overlap > 0) ? hits * 2 + overlap : 0 };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.t);
  const tools = scored.slice(0, 3);

  return { bodies, subjects, tools };
}

/** Up to `n` other posts, ranked by shared papers, qualification and tag. */
export function relatedPosts(b: BlogPost, all: BlogPost[], n = 3): BlogPost[] {
  const me = blogContext(b);
  const mySubjects = new Set(me.subjects.map((s) => s.id));
  return all
    .filter((x) => x.slug !== b.slug)
    .map((x, i) => {
      const c = blogContext(x);
      const score =
        c.subjects.filter((s) => mySubjects.has(s.id)).length * 4 +
        c.bodies.filter((id) => me.bodies.includes(id)).length * 3 +
        (x.tag === b.tag ? 2 : 0);
      return { x, score, i };
    })
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, n)
    .map((r) => r.x);
}
