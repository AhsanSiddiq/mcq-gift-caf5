/** Time value of money: compound interest, present value, annuities and perpetuities. Pure functions; rates are decimals. */

/** FV = PV(1 + r/m)^(m·t) */
export function futureValue(pv: number, annualRate: number, years: number, compoundsPerYear = 1): number {
  return pv * Math.pow(1 + annualRate / compoundsPerYear, compoundsPerYear * years);
}

/** PV = FV / (1 + r/m)^(m·t) */
export function presentValue(fv: number, annualRate: number, years: number, compoundsPerYear = 1): number {
  return fv / Math.pow(1 + annualRate / compoundsPerYear, compoundsPerYear * years);
}

/** EAR = (1 + r/m)^m − 1 */
export function effectiveAnnualRate(nominal: number, compoundsPerYear: number): number {
  return Math.pow(1 + nominal / compoundsPerYear, compoundsPerYear) - 1;
}

/** Present value of n level payments at periodic rate r. Annuity due (payments at the start) if `due`. */
export function annuityPV(payment: number, r: number, n: number, due = false): number {
  const base = r === 0 ? payment * n : (payment * (1 - Math.pow(1 + r, -n))) / r;
  return due ? base * (1 + r) : base;
}

/** Future value of n level payments at periodic rate r. Annuity due (payments at the start) if `due`. */
export function annuityFV(payment: number, r: number, n: number, due = false): number {
  const base = r === 0 ? payment * n : (payment * (Math.pow(1 + r, n) - 1)) / r;
  return due ? base * (1 + r) : base;
}

/** Level payment that has a present value of `pv` over n periods (the inverse of annuityPV). */
export function annuityPayment(pv: number, r: number, n: number, due = false): number {
  const factor = annuityPV(1, r, n, due);
  return factor === 0 ? NaN : pv / factor;
}

/** Level perpetuity PV = C / r; growing perpetuity (Gordon) PV = C₁ / (r − g). Returns NaN when r ≤ g. */
export function perpetuityPV(firstPayment: number, r: number, growth = 0): number {
  if (r <= growth) return NaN;
  return firstPayment / (r - growth);
}

export interface GrowthRow { year: number; opening: number; contributions: number; interest: number; closing: number }

/** Year-by-year balance for a lump sum plus an optional contribution made at the end of every compounding period. */
export function growthSchedule(pv: number, annualRate: number, years: number, compoundsPerYear = 1, contributionPerPeriod = 0): GrowthRow[] {
  const r = annualRate / compoundsPerYear;
  const rows: GrowthRow[] = [];
  let bal = pv;
  const wholeYears = Math.min(Math.max(0, Math.round(years)), 200);
  for (let y = 1; y <= wholeYears; y++) {
    const opening = bal;
    let interest = 0;
    for (let p = 0; p < compoundsPerYear; p++) {
      const i = bal * r;
      interest += i;
      bal += i + contributionPerPeriod;
    }
    rows.push({ year: y, opening, contributions: contributionPerPeriod * compoundsPerYear, interest, closing: bal });
  }
  return rows;
}
