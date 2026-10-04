/** Net present value, internal rate of return and payback. Pure functions. Cash flow index = year (0 = today). */

export function npv(rate: number, flows: number[]): number {
  return flows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);
}

export interface IrrResult {
  /** Primary IRR (the root closest to 10%), as a decimal; null when none exists. */
  irr: number | null;
  /** Every root found between −99% and +1,000,000%. */
  roots: number[];
  signChanges: number;
  message?: string;
}

export function countSignChanges(flows: number[]): number {
  let changes = 0;
  let prev = 0;
  for (const cf of flows) {
    if (cf === 0) continue;
    const s = Math.sign(cf);
    if (prev !== 0 && s !== prev) changes++;
    prev = s;
  }
  return changes;
}

function bisect(f: (r: number) => number, lo: number, hi: number): number {
  let flo = f(lo);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (fm === 0 || hi - lo < 1e-12) return mid;
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Solves NPV(r) = 0 numerically. Scans a dense grid of rates for sign changes, then refines each bracket by bisection,
 * so it is robust where Newton–Raphson diverges, and it reports multiple IRRs for non-conventional cash flows.
 */
export function irr(flows: number[]): IrrResult {
  const signChanges = countSignChanges(flows);
  if (signChanges === 0) {
    return { irr: null, roots: [], signChanges, message: "No IRR exists: the cash flows need at least one outflow and one inflow." };
  }
  const f = (r: number) => npv(r, flows);
  const roots: number[] = [];
  // Grid in log-space of (1 + r): from −99% up to +1,000,000%
  const step = 0.005;
  let prevR = Math.exp(Math.log(0.01)) - 1;
  let prevV = f(prevR);
  for (let x = Math.log(0.01) + step; x <= Math.log(10001); x += step) {
    const r = Math.exp(x) - 1;
    const v = f(r);
    if (Number.isFinite(v) && Number.isFinite(prevV)) {
      if (v === 0) roots.push(r);
      else if (prevV !== 0 && Math.sign(v) !== Math.sign(prevV)) roots.push(bisect(f, prevR, r));
    }
    prevR = r;
    prevV = v;
  }
  if (roots.length === 0) {
    return { irr: null, roots, signChanges, message: "No IRR found: NPV never reaches zero at any discount rate between −99% and +1,000,000%." };
  }
  const primary = roots.reduce((best, r) => (Math.abs(r - 0.1) < Math.abs(best - 0.1) ? r : best), roots[0]);
  return {
    irr: primary,
    roots,
    signChanges,
    message:
      roots.length > 1
        ? `These cash flows change sign ${signChanges} times and have ${roots.length} IRRs, so IRR is unreliable here. Decide using NPV (or MIRR).`
        : undefined,
  };
}

/** Modified IRR: outflows discounted at `financeRate`, inflows compounded to the end at `reinvestRate`. */
export function mirr(flows: number[], financeRate: number, reinvestRate: number): number | null {
  const n = flows.length - 1;
  if (n < 1) return null;
  let pvOut = 0;
  let fvIn = 0;
  flows.forEach((cf, t) => {
    if (cf < 0) pvOut += cf / Math.pow(1 + financeRate, t);
    else fvIn += cf * Math.pow(1 + reinvestRate, n - t);
  });
  if (pvOut >= 0 || fvIn <= 0) return null;
  return Math.pow(fvIn / -pvOut, 1 / n) - 1;
}

/** Years until cumulative (optionally discounted) cash flow turns non-negative, interpolating within the year. */
export function payback(flows: number[], rate?: number): number | null {
  if (flows.length === 0 || flows[0] >= 0) return null;
  let cum = 0;
  for (let t = 0; t < flows.length; t++) {
    const cf = rate === undefined ? flows[t] : flows[t] / Math.pow(1 + rate, t);
    const before = cum;
    cum += cf;
    if (t > 0 && before < 0 && cum >= 0) return t - 1 + -before / cf;
  }
  return null;
}

export interface NpvRow {
  year: number;
  cashFlow: number;
  factor: number;
  presentValue: number;
  cumulativePV: number;
}

export function npvSchedule(rate: number, flows: number[]): NpvRow[] {
  let cum = 0;
  return flows.map((cf, t) => {
    const factor = 1 / Math.pow(1 + rate, t);
    const pv = cf * factor;
    cum += pv;
    return { year: t, cashFlow: cf, factor, presentValue: pv, cumulativePV: cum };
  });
}
