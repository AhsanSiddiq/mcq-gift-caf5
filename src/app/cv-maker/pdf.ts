"use client";
/*
 * PDF export for the career suite (client only).
 *
 * Designed templates: html2canvas renders the sheet at up to 3x, the image is sliced into A4
 * pages at "safe" break points (never through a line of text, never right after a heading),
 * and an invisible text layer is laid over each page so the PDF is selectable, searchable and
 * readable by applicant-tracking systems.
 *
 * ATS mode and cover letters: real vector text drawn with jsPDF (tiny, crisp, fully parseable).
 */
import type { jsPDF as JsPDF } from "jspdf";
import { type CVData, atsBlocks } from "./cvData";

export const A4_W = 794; // CSS px at 96 dpi
export const A4_H = 1123;
/** Top/bottom margin applied to continuation pages (~12mm). */
const PAGE_MARGIN = 45;
const PT_W = 595.28;
const PT_H = 841.89;
const PX_TO_PT = PT_W / A4_W;

interface Box { top: number; bottom: number }
interface TextRun { text: string; x: number; top: number; w: number; h: number; size: number; bold: boolean; italic: boolean }
export interface Layout { lines: Box[]; headings: Box[]; runs: TextRun[]; contentBottom: number; height: number }

/** Map text to what the built-in PDF fonts (WinAnsi) can encode. */
export function pdfSafe(s: string): string {
  return s
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”‟″]/g, '"')
    .replace(/[‐‑‒−]/g, "-")
    .replace(/[■▪▸▶‣⁃]/g, "•")
    .replace(/✓|✔/g, "•")
    .replace(/ /g, " ")
    .replace(/[^\x20-\x7E -ÿ–—•…€™]/g, "");
}

/**
 * Measure the rendered sheet: every line fragment of text (for safe page breaks and the
 * invisible text layer) plus headings. Coordinates are unscaled CSS px from the sheet's top-left.
 */
export function measureLayout(root: HTMLElement): Layout {
  const rootRect = root.getBoundingClientRect();
  const scale = rootRect.width / A4_W || 1;
  const rel = (r: DOMRect) => ({ x: (r.left - rootRect.left) / scale, top: (r.top - rootRect.top) / scale, w: r.width / scale, h: r.height / scale });

  const runs: TextRun[] = [];
  const lines: Box[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const text = node.data;
    if (!text.trim() || !node.parentElement) continue;
    const cs = getComputedStyle(node.parentElement);
    const size = parseFloat(cs.fontSize) || 10;
    const bold = parseInt(cs.fontWeight, 10) >= 600;
    const italic = cs.fontStyle === "italic";
    const upper = cs.textTransform === "uppercase";
    let cur: TextRun | null = null;
    const words = text.matchAll(/\S+/g);
    for (const m of words) {
      range.setStart(node, m.index!);
      range.setEnd(node, m.index! + m[0].length);
      const r = range.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const b = rel(r);
      const word = upper ? m[0].toUpperCase() : m[0];
      if (cur && Math.abs(b.top - cur.top) < 2) {
        cur.text += " " + word;
        cur.w = b.x + b.w - cur.x;
      } else {
        if (cur) runs.push(cur);
        cur = { text: word, x: b.x, top: b.top, w: b.w, h: b.h, size, bold, italic };
      }
    }
    if (cur) runs.push(cur);
  }
  for (const r of runs) lines.push({ top: r.top, bottom: r.top + r.h });
  root.querySelectorAll("img").forEach(img => {
    const b = rel(img.getBoundingClientRect());
    if (b.h) lines.push({ top: b.top, bottom: b.top + b.h });
  });
  const headings: Box[] = [];
  root.querySelectorAll<HTMLElement>("[data-pdf-heading]").forEach(el => {
    const b = rel(el.getBoundingClientRect());
    headings.push({ top: b.top, bottom: b.top + b.h });
  });
  const contentBottom = lines.reduce((m, l) => Math.max(m, l.bottom), 0);
  return { lines, headings, runs, contentBottom, height: Math.max(root.scrollHeight, root.offsetHeight, A4_H) };
}

/** [start, end] slices of the sheet, one per PDF page. */
export function paginate(layout: Layout): [number, number][] {
  const { lines, headings, contentBottom } = layout;
  const slices: [number, number][] = [];
  let start = 0;
  for (let page = 0; page < 12; page++) {
    const first = page === 0;
    // Page 1 already carries the template's own margins; later pages get PAGE_MARGIN top + bottom.
    const limit = first ? A4_H - 24 : start + A4_H - 2 * PAGE_MARGIN;
    if (contentBottom <= limit) {
      slices.push([start, first ? A4_H : Math.min(start + A4_H - PAGE_MARGIN, contentBottom + 18)]);
      break;
    }
    let cut = first ? A4_H - PAGE_MARGIN : limit;
    for (let guard = 0; guard < 200; guard++) {
      const straddle = lines.find(l => l.top < cut && l.bottom > cut);
      // A heading stranded at the bottom of a page moves to the next page with its content.
      const orphan = headings.find(h => h.top < cut && h.bottom > cut - 30 && !lines.some(l => l.top >= h.bottom - 1 && l.bottom <= cut));
      const target = straddle ? straddle.top - 3 : orphan ? orphan.top - 3 : null;
      if (target === null) break;
      cut = target;
    }
    if (cut <= start + 150) cut = first ? A4_H - PAGE_MARGIN : limit; // unbreakable block: hard cut
    slices.push([start, cut]);
    start = cut;
  }
  return slices;
}

/** Page break positions (sheet px) for the live preview. */
export const breaksOf = (slices: [number, number][]) => slices.slice(1).map(s => s[0]);

async function newDoc(): Promise<JsPDF> {
  const { jsPDF } = await import("jspdf");
  return new jsPDF({ orientation: "portrait", unit: "pt", format: "a4", compress: true });
}

const nextFrame = () => new Promise<void>(r => requestAnimationFrame(() => r()));

/** Raster + invisible text layer PDF of a rendered CV sheet. */
export async function cvToPdf(root: HTMLElement, meta: { title: string }): Promise<JsPDF> {
  await nextFrame(); await nextFrame(); await nextFrame();
  const layout = measureLayout(root);
  const slices = paginate(layout);
  const height = Math.ceil(Math.max(layout.height, slices[slices.length - 1][1]));
  // ~3x for crisp text; capped so the canvas stays inside mobile Safari's ~16.7M pixel limit.
  const scale = Math.max(1.5, Math.min(3, Math.sqrt(14_000_000 / (A4_W * height))));

  const { default: html2canvas } = await import("html2canvas");
  const resolveVars = (el: HTMLElement) => {
    for (const p of ["--cv-accent", "--gap-section", "--gap-entry", "--gap-bullet"]) {
      const val = getComputedStyle(el).getPropertyValue(p).trim();
      if (val) el.style.setProperty(p, val);
    }
  };
  const canvas = await html2canvas(root, {
    scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: "#ffffff",
    width: A4_W,
    height,
    windowWidth: A4_W,
    windowHeight: height,
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
    onclone: (_doc: Document, el: HTMLElement) => {
      resolveVars(el);
      el.querySelectorAll<HTMLElement>("*").forEach(resolveVars);
      el.style.background = "#ffffff";
      el.style.opacity = "1";
    },
  });

  // Blank-canvas guard (html2canvas returns an empty canvas when the element wasn't painted)
  const probe = canvas.getContext("2d")?.getImageData(Math.floor(canvas.width / 2), Math.floor(40 * scale), 1, 1).data;
  if (probe && probe[3] === 0) throw new Error("blank canvas");

  const pdf = await newDoc();
  pdf.setProperties({ title: meta.title, subject: "Curriculum Vitae", creator: "The CA Hub CV Maker (thecahub.com)" });
  const pageCanvas = document.createElement("canvas");
  pageCanvas.width = Math.round(A4_W * scale);
  pageCanvas.height = Math.round(A4_H * scale);
  const ctx = pageCanvas.getContext("2d")!;

  slices.forEach(([start, end], i) => {
    const offset = i === 0 ? 0 : PAGE_MARGIN;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    const sh = Math.min(end, height) - start;
    ctx.drawImage(canvas, 0, Math.round(start * scale), canvas.width, Math.round(sh * scale), 0, Math.round(offset * scale), canvas.width, Math.round(sh * scale));
    if (i > 0) pdf.addPage();
    pdf.addImage(pageCanvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, PT_W, PT_H, undefined, "FAST");

    // Invisible, selectable text exactly over the painted words
    for (const run of layout.runs) {
      const mid = run.top + run.h / 2;
      if (mid < start || mid >= end) continue;
      const text = pdfSafe(run.text);
      if (!text.trim()) continue;
      const font = run.bold && run.italic ? "bolditalic" : run.bold ? "bold" : run.italic ? "italic" : "normal";
      pdf.setFont("helvetica", font);
      const fontPt = run.size * PX_TO_PT;
      pdf.setFontSize(fontPt);
      const natural = pdf.getTextWidth(text);
      const target = run.w * PX_TO_PT;
      const baseline = (run.top - start + offset) * PX_TO_PT + (run.h / 2) * PX_TO_PT + fontPt * 0.33;
      pdf.text(text, run.x * PX_TO_PT, baseline, {
        renderingMode: "invisible",
        horizontalScale: natural > 0 ? Math.max(0.3, Math.min(3, target / natural)) : 1,
      });
    }
  });
  return pdf;
}

/* ── Vector text layouts ── */

interface Writer { pdf: JsPDF; y: number; margin: number; width: number }

function ensure(w: Writer, h: number) {
  if (w.y + h > PT_H - w.margin) {
    w.pdf.addPage();
    w.y = w.margin;
  }
}

function para(w: Writer, text: string, opts: { size?: number; style?: string; indent?: number; gap?: number; lineHeight?: number } = {}) {
  const { size = 10, style = "normal", indent = 0, gap = 0, lineHeight = 1.3 } = opts;
  w.pdf.setFont("helvetica", style);
  w.pdf.setFontSize(size);
  const lines: string[] = w.pdf.splitTextToSize(pdfSafe(text), w.width - indent);
  const lh = size * lineHeight;
  for (const line of lines) {
    ensure(w, lh);
    w.pdf.text(line, w.margin + indent, w.y + size);
    w.y += lh;
  }
  w.y += gap;
}

/** Plain, single-column, real-text CV for applicant tracking systems. */
export async function atsPdf(cv: CVData): Promise<JsPDF> {
  const pdf = await newDoc();
  pdf.setProperties({ title: `${cv.name || "CV"} – CV`, subject: "Curriculum Vitae", creator: "The CA Hub CV Maker (thecahub.com)" });
  const w: Writer = { pdf, y: 36, margin: 40, width: PT_W - 80 };
  para(w, cv.name || "Your Full Name", { size: 18, style: "bold", gap: 2 });
  if (cv.icapStage) para(w, cv.icapStage, { size: 11 });
  const contacts = [cv.phone, cv.email, cv.linkedin].filter(Boolean).join(" | ");
  if (contacts) para(w, contacts, { size: 10 });
  for (const block of atsBlocks(cv)) {
    w.y += 6;
    ensure(w, 32);
    para(w, block.heading.toUpperCase(), { size: 11, style: "bold" });
    pdf.setLineWidth(0.6);
    pdf.line(w.margin, w.y, w.margin + w.width, w.y);
    w.y += 4;
    block.items.forEach((it, i) => {
      if (it.t === "para") para(w, it.text, { gap: 2 });
      else if (it.t === "line") para(w, it.label ? `${it.label}: ${it.text}` : it.text);
      else if (it.t === "bullet") {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        ensure(w, 14);
        pdf.text("•", w.margin + 4, w.y + 10);
        para(w, it.text, { indent: 16 });
      } else {
        if (i) w.y += 3;
        ensure(w, 14);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        const right = pdfSafe(it.right ?? "");
        const rw = right ? pdf.getTextWidth(right) + 12 : 0;
        if (right) pdf.text(right, w.margin + w.width, w.y + 10, { align: "right" });
        const save = w.width;
        w.width -= rw;
        para(w, it.title, { style: "bold" });
        w.width = save;
      }
    });
  }
  return pdf;
}

export interface LetterPdfInput { name: string; contact: string[]; date: string; recipient: string[]; subject: string; body: string }

/** One-page (overflow-safe) cover letter with real text. */
export async function letterPdf(l: LetterPdfInput): Promise<JsPDF> {
  const pdf = await newDoc();
  pdf.setProperties({ title: `${l.name || "Cover"} – Cover Letter`, subject: l.subject, creator: "The CA Hub Cover Letter Builder (thecahub.com)" });
  const w: Writer = { pdf, y: 56, margin: 62, width: PT_W - 124 };
  para(w, l.name || "Your Name", { size: 17, style: "bold" });
  if (l.contact.length) para(w, l.contact.join("  |  "), { size: 9.5 });
  w.y += 4;
  pdf.setLineWidth(0.8);
  pdf.line(w.margin, w.y, w.margin + w.width, w.y);
  w.y += 18;
  para(w, l.date, { size: 10.5, gap: 10 });
  for (const r of l.recipient.filter(Boolean)) para(w, r, { size: 10.5 });
  w.y += 10;
  if (l.subject) para(w, l.subject, { size: 10.5, style: "bold", gap: 10 });
  const paragraphs = l.body.replace(/\r/g, "").split(/\n\s*\n/);
  for (const p of paragraphs) {
    const lines = p.split("\n");
    for (const line of lines) para(w, line, { size: 10.5, lineHeight: 1.45 });
    w.y += 8;
  }
  return pdf;
}
