/** Loan and lease amortisation. Pure functions. */

export interface AmortisationInput {
  principal: number;
  /** Nominal annual rate as a decimal, e.g. 0.06 */
  annualRate: number;
  years: number;
  periodsPerYear: number;
  /** Lease-style: payments made at the start of each period (annuity due). */
  inAdvance?: boolean;
  /** Balloon / guaranteed residual value still owed at the end of the final period. */
  balloon?: number;
}

export interface AmortisationRow {
  period: number;
  opening: number;
  payment: number;
  interest: number;
  principal: number;
  closing: number;
}

export interface AmortisationResult {
  payment: number;
  periods: number;
  periodicRate: number;
  rows: AmortisationRow[];
  totalPaid: number;
  totalInterest: number;
  error?: string;
}

/** Level payment that amortises `principal` down to `balloon` over n periods at periodic rate r. */
export function levelPayment(principal: number, r: number, n: number, inAdvance = false, balloon = 0): number {
  if (n <= 0) return 0;
  if (r === 0) return (principal - balloon) / n;
  const pvBalloon = balloon / Math.pow(1 + r, n);
  const annuityFactor = (1 - Math.pow(1 + r, -n)) / r;
  const pmt = (principal - pvBalloon) / annuityFactor;
  return inAdvance ? pmt / (1 + r) : pmt;
}

export function amortise(input: AmortisationInput): AmortisationResult {
  const { principal, annualRate, years, periodsPerYear, inAdvance = false, balloon = 0 } = input;
  const n = Math.round(years * periodsPerYear);
  const r = annualRate / periodsPerYear;
  const fail = (error: string): AmortisationResult => ({ payment: 0, periods: n, periodicRate: r, rows: [], totalPaid: 0, totalInterest: 0, error });
  if (!(principal > 0)) return fail("Enter an amount borrowed greater than zero.");
  if (!(annualRate >= 0)) return fail("Interest rate cannot be negative.");
  if (!(n >= 1) || n > 1200) return fail("The term must give between 1 and 1,200 payments.");
  if (!(balloon >= 0) || balloon >= principal) return fail("Balloon / residual must be zero or more and less than the amount borrowed.");

  const payment = levelPayment(principal, r, n, inAdvance, balloon);
  const rows: AmortisationRow[] = [];
  let bal = principal;
  for (let k = 1; k <= n; k++) {
    const opening = bal;
    // In advance: the payment is made first, so interest accrues only on what remains outstanding for the period.
    const interest = inAdvance ? (opening - payment) * r : opening * r;
    const principalPart = payment - interest;
    bal = opening - principalPart;
    if (k === n && Math.abs(bal - balloon) < 1e-6 * principal) bal = balloon; // tidy floating-point drift
    rows.push({ period: k, opening, payment, interest, principal: principalPart, closing: bal });
  }
  const totalPaid = payment * n + balloon;
  return { payment, periods: n, periodicRate: r, rows, totalPaid, totalInterest: totalPaid - principal };
}
