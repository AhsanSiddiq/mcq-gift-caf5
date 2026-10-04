/** Cost–volume–profit (break-even) analysis. Pure functions. */

export interface CvpInput {
  price: number;
  variableCost: number;
  fixedCosts: number;
  /** Budgeted / expected sales volume in units */
  budgetUnits: number;
  targetProfit: number;
}

export interface CvpResult {
  contributionPerUnit: number;
  cmRatio: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  budgetRevenue: number;
  budgetContribution: number;
  budgetProfit: number;
  marginOfSafetyUnits: number;
  marginOfSafetyRevenue: number;
  marginOfSafetyPct: number;
  targetUnits: number;
  targetRevenue: number;
  /** Degree of operating leverage = contribution / profit (undefined when profit ≤ 0) */
  operatingLeverage?: number;
  error?: string;
}

export function cvp(i: CvpInput): CvpResult {
  const c = i.price - i.variableCost;
  const base: CvpResult = {
    contributionPerUnit: c, cmRatio: 0, breakEvenUnits: 0, breakEvenRevenue: 0, budgetRevenue: 0, budgetContribution: 0, budgetProfit: 0,
    marginOfSafetyUnits: 0, marginOfSafetyRevenue: 0, marginOfSafetyPct: 0, targetUnits: 0, targetRevenue: 0,
  };
  if (!(i.price > 0)) return { ...base, error: "Enter a selling price greater than zero." };
  if (!(i.variableCost >= 0) || !(i.fixedCosts >= 0)) return { ...base, error: "Costs cannot be negative." };
  if (c <= 0) return { ...base, error: "Selling price must exceed variable cost per unit. Otherwise every sale loses money and there is no break-even point." };

  const cmRatio = c / i.price;
  const breakEvenUnits = i.fixedCosts / c;
  const budgetUnits = Math.max(0, i.budgetUnits || 0);
  const budgetContribution = budgetUnits * c;
  const budgetProfit = budgetContribution - i.fixedCosts;
  const mosUnits = budgetUnits - breakEvenUnits;
  const targetUnits = (i.fixedCosts + (i.targetProfit || 0)) / c;
  return {
    contributionPerUnit: c,
    cmRatio,
    breakEvenUnits,
    breakEvenRevenue: i.fixedCosts / cmRatio,
    budgetRevenue: budgetUnits * i.price,
    budgetContribution,
    budgetProfit,
    marginOfSafetyUnits: mosUnits,
    marginOfSafetyRevenue: mosUnits * i.price,
    marginOfSafetyPct: budgetUnits > 0 ? mosUnits / budgetUnits : 0,
    targetUnits,
    targetRevenue: targetUnits * i.price,
    operatingLeverage: budgetProfit > 0 ? budgetContribution / budgetProfit : undefined,
  };
}

export interface CvpRow { units: number; revenue: number; variableCosts: number; fixedCosts: number; totalCosts: number; profit: number }

/** Profit at a range of volumes from 0 to `maxUnits`, in `steps` equal steps. */
export function cvpTable(i: CvpInput, maxUnits: number, steps = 10): CvpRow[] {
  const rows: CvpRow[] = [];
  for (let s = 0; s <= steps; s++) {
    const units = Math.round((maxUnits * s) / steps);
    const revenue = units * i.price;
    const variableCosts = units * i.variableCost;
    const totalCosts = variableCosts + i.fixedCosts;
    rows.push({ units, revenue, variableCosts, fixedCosts: i.fixedCosts, totalCosts, profit: revenue - totalCosts });
  }
  return rows;
}
