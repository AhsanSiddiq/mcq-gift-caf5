/** Weighted average cost of capital and CAPM. Pure functions. All rates as decimals. */

/** CAPM: Ke = Rf + β(Rm − Rf) */
export function capm(riskFree: number, beta: number, marketReturn: number): number {
  return riskFree + beta * (marketReturn - riskFree);
}

export interface WaccInput {
  equityValue: number;
  debtValue: number;
  costOfEquity: number;
  /** Pre-tax cost of debt */
  costOfDebt: number;
  taxRate: number;
  /** Optional preference shares (no tax relief) */
  prefValue?: number;
  costOfPref?: number;
}

export interface WaccResult {
  wacc: number;
  weightEquity: number;
  weightDebt: number;
  weightPref: number;
  afterTaxCostOfDebt: number;
  totalValue: number;
  error?: string;
}

export function wacc(i: WaccInput): WaccResult {
  const pref = Math.max(0, i.prefValue ?? 0);
  const V = i.equityValue + i.debtValue + pref;
  const kdAfterTax = i.costOfDebt * (1 - i.taxRate);
  const zero = { wacc: 0, weightEquity: 0, weightDebt: 0, weightPref: 0, afterTaxCostOfDebt: kdAfterTax, totalValue: V };
  if (!(i.equityValue >= 0) || !(i.debtValue >= 0)) return { ...zero, error: "Market values cannot be negative." };
  if (!(V > 0)) return { ...zero, error: "Enter the market value of at least one source of finance." };
  if (i.taxRate < 0 || i.taxRate >= 1) return { ...zero, error: "Tax rate must be between 0% and 100%." };
  const wE = i.equityValue / V;
  const wD = i.debtValue / V;
  const wP = pref / V;
  return {
    wacc: wE * i.costOfEquity + wD * kdAfterTax + wP * (i.costOfPref ?? 0),
    weightEquity: wE,
    weightDebt: wD,
    weightPref: wP,
    afterTaxCostOfDebt: kdAfterTax,
    totalValue: V,
  };
}
