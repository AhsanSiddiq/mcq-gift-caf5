/** Depreciation schedules: straight-line, reducing balance and sum-of-the-years'-digits. Pure functions. */

export type DepreciationMethod = "straight-line" | "reducing-balance" | "sum-of-years";

export interface DepreciationRow {
  year: number;
  opening: number;
  depreciation: number;
  accumulated: number;
  closing: number;
}

export interface DepreciationResult {
  rows: DepreciationRow[];
  depreciableAmount: number;
  totalDepreciation: number;
  /** Rate actually applied for reducing balance (decimal), else undefined */
  rate?: number;
  error?: string;
}

/** Rate that takes `cost` down to `residual` in exactly `life` years: 1 − (RV / cost)^(1/n). */
export function impliedReducingBalanceRate(cost: number, residual: number, life: number): number {
  if (cost <= 0 || life <= 0) return 0;
  if (residual <= 0) return 1;
  return 1 - Math.pow(residual / cost, 1 / life);
}

export function depreciationSchedule(
  method: DepreciationMethod,
  cost: number,
  residual: number,
  life: number,
  /** Reducing-balance rate as a decimal. If omitted (or 0) the implied rate is used. */
  rate?: number,
): DepreciationResult {
  const empty = (error: string): DepreciationResult => ({ rows: [], depreciableAmount: 0, totalDepreciation: 0, error });
  if (!(cost > 0)) return empty("Enter a cost greater than zero.");
  if (!(residual >= 0)) return empty("Residual value cannot be negative.");
  if (residual >= cost) return empty("Residual value must be less than cost.");
  const n = Math.round(life);
  if (!(n >= 1) || n > 100) return empty("Useful life must be a whole number of years between 1 and 100.");

  const depreciable = cost - residual;
  const rows: DepreciationRow[] = [];
  let nbv = cost;
  let acc = 0;
  let appliedRate: number | undefined;

  if (method === "reducing-balance") {
    appliedRate = rate !== undefined && rate > 0 ? rate : impliedReducingBalanceRate(cost, residual, n);
    if (!(appliedRate > 0 && appliedRate <= 1)) return empty("Reducing-balance rate must be between 0% and 100%.");
  }
  const syd = (n * (n + 1)) / 2;

  for (let y = 1; y <= n; y++) {
    let dep: number;
    if (method === "straight-line") dep = depreciable / n;
    else if (method === "sum-of-years") dep = (depreciable * (n - y + 1)) / syd;
    else dep = nbv * appliedRate!;
    // Never depreciate below residual value
    dep = Math.min(dep, Math.max(0, nbv - residual));
    const opening = nbv;
    nbv -= dep;
    acc += dep;
    rows.push({ year: y, opening, depreciation: dep, accumulated: acc, closing: nbv });
  }
  return { rows, depreciableAmount: depreciable, totalDepreciation: acc, rate: appliedRate };
}
