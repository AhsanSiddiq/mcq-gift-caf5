/**
 * Sanity tests against textbook values. Run with:  npx tsx src/lib/calculators/calculators.test.ts
 */
import assert from "node:assert/strict";
import { depreciationSchedule, impliedReducingBalanceRate } from "./depreciation";
import { irr, mirr, npv, payback } from "./npv";
import { amortise, levelPayment } from "./loan";
import { cvp } from "./cvp";
import { eoq, eoqWithDiscounts, inventoryCost } from "./eoq";
import { computeRatios } from "./ratios";
import { capm, wacc } from "./wacc";
import { annuityFV, annuityPV, effectiveAnnualRate, futureValue, growthSchedule, perpetuityPV, presentValue } from "./tvm";

let passed = 0;
const close = (actual: number | null | undefined, expected: number, tol = 0.01, msg = "") => {
  assert.ok(actual !== null && actual !== undefined && Math.abs(actual - expected) <= tol, `${msg}: expected ${expected}, got ${actual}`);
  passed++;
};

// ── Depreciation ────────────────────────────────────────────────
{
  const sl = depreciationSchedule("straight-line", 10000, 1000, 5);
  close(sl.rows[0].depreciation, 1800, 1e-9, "SL annual charge");
  close(sl.rows[4].closing, 1000, 1e-9, "SL ends at residual");

  const syd = depreciationSchedule("sum-of-years", 10000, 1000, 5);
  close(syd.rows[0].depreciation, 3000, 1e-9, "SYD year 1 (5/15 × 9,000)");
  close(syd.rows[4].depreciation, 600, 1e-9, "SYD year 5 (1/15 × 9,000)");
  close(syd.totalDepreciation, 9000, 1e-9, "SYD total");

  const rb = depreciationSchedule("reducing-balance", 10000, 0, 3, 0.2);
  close(rb.rows[0].depreciation, 2000, 1e-9, "RB 20% year 1");
  close(rb.rows[1].depreciation, 1600, 1e-9, "RB 20% year 2");
  close(rb.rows[2].closing, 5120, 1e-9, "RB 20% NBV after 3 years");

  const implied = impliedReducingBalanceRate(10000, 1000, 5);
  close(implied, 0.369043, 1e-6, "Implied RB rate 1 − (0.1)^(1/5)");
  close(depreciationSchedule("reducing-balance", 10000, 1000, 5).rows[4].closing, 1000, 1e-6, "Implied RB ends at residual");
  assert.ok(depreciationSchedule("straight-line", 1000, 2000, 5).error, "residual > cost rejected");
  passed++;
}

// ── NPV / IRR ───────────────────────────────────────────────────
{
  close(npv(0.1, [-1000, 500, 500, 500]), 243.43, 0.01, "NPV of 3-year 500 annuity at 10%");
  close(irr([-100, 110]).irr, 0.1, 1e-9, "IRR single period");
  // Wikipedia "Internal rate of return" worked example → 5.96%
  close(irr([-123400, 36200, 54800, 48100]).irr, 0.0596, 0.0001, "IRR Wikipedia example");
  close(irr([-10000, 3000, 4200, 6800]).irr, 0.1634, 0.0001, "IRR textbook example 16.34%");
  // Non-conventional: −100, +230, −132 has IRRs of 10% and 20%
  const multi = irr([-100, 230, -132]);
  assert.equal(multi.roots.length, 2, "two IRRs found");
  close(multi.roots[0], 0.1, 1e-6, "multiple IRR root 1");
  close(multi.roots[1], 0.2, 1e-6, "multiple IRR root 2");
  assert.equal(irr([-100, -50]).irr, null, "all outflows → no IRR");
  assert.equal(irr([100, 50]).irr, null, "all inflows → no IRR");
  // Sign change but NPV never zero: −100, +300, −300 (NPV < 0 for all r > −100%)
  assert.equal(irr([-100, 300, -300]).irr, null, "no real root");
  close(payback([-1000, 300, 400, 500]), 2.6, 1e-9, "simple payback 2.6 years");
  close(mirr([-1000, 500, 500, 500], 0.1, 0.1), 0.1829, 0.0001, "MIRR (1,655 / 1,000)^(1/3) − 1");
  passed += 5;
}

// ── Loan amortisation ───────────────────────────────────────────
{
  close(levelPayment(200000, 0.06 / 12, 360), 1199.10, 0.01, "30-year 6% mortgage on 200,000");
  close(levelPayment(10000, 0.05, 3), 3672.09, 0.01, "3-year annual loan at 5%");
  const a = amortise({ principal: 10000, annualRate: 0.05, years: 3, periodsPerYear: 1 });
  close(a.rows[0].interest, 500, 1e-9, "year 1 interest");
  close(a.rows[2].closing, 0, 1e-6, "fully amortised");
  close(a.totalInterest, 1016.26, 0.01, "total interest");
  const lease = amortise({ principal: 10000, annualRate: 0.05, years: 3, periodsPerYear: 1, inAdvance: true });
  close(lease.payment, 3497.22, 0.01, "lease in advance payment");
  close(lease.rows[2].closing, 0, 1e-6, "lease fully amortised");
  const balloon = amortise({ principal: 10000, annualRate: 0.05, years: 3, periodsPerYear: 1, balloon: 2000 });
  close(balloon.rows[2].closing, 2000, 1e-6, "balloon outstanding at end");
  close(amortise({ principal: 1200, annualRate: 0, years: 1, periodsPerYear: 12 }).payment, 100, 1e-9, "0% loan");
}

// ── CVP ─────────────────────────────────────────────────────────
{
  const r = cvp({ price: 20, variableCost: 12, fixedCosts: 40000, budgetUnits: 6000, targetProfit: 16000 });
  close(r.breakEvenUnits, 5000, 1e-9, "BEP units");
  close(r.breakEvenRevenue, 100000, 1e-6, "BEP revenue");
  close(r.cmRatio, 0.4, 1e-9, "CM ratio");
  close(r.marginOfSafetyUnits, 1000, 1e-9, "MOS units");
  close(r.marginOfSafetyPct, 1 / 6, 1e-9, "MOS %");
  close(r.targetUnits, 7000, 1e-9, "target profit units");
  close(r.operatingLeverage, 6, 1e-9, "DOL = 48,000 / 8,000");
  assert.ok(cvp({ price: 10, variableCost: 12, fixedCosts: 100, budgetUnits: 10, targetProfit: 0 }).error, "negative contribution rejected");
  passed++;
}

// ── EOQ ─────────────────────────────────────────────────────────
{
  close(eoq(20000, 50, 2), 1000, 1e-9, "EOQ √(2×50×20,000/2)");
  const c = inventoryCost(1000, 20000, 50, 2);
  close(c.orderingCost, 1000, 1e-9, "ordering cost = holding cost at EOQ");
  close(c.holdingCost, 1000, 1e-9, "holding cost");
  const opts = eoqWithDiscounts({ annualDemand: 20000, orderCost: 50, basePrice: 10, holdingPct: 0.2, tiers: [{ minQty: 2000, price: 9.8 }] });
  close(opts[0].total, 202000, 1e-6, "no-discount total cost");
  close(opts[1].total, 198460, 1e-6, "discount at 2,000 units total cost");
  assert.ok(opts[1].best, "discount chosen");
  passed++;
}

// ── Ratios ──────────────────────────────────────────────────────
{
  const rs = computeRatios({
    revenue: 1000, costOfSales: 600, operatingProfit: 150, netProfit: 90, interestExpense: 30,
    inventory: 120, receivables: 100, cash: 30, currentAssets: 250, currentLiabilities: 125, payables: 60,
    totalAssets: 1000, equity: 500, longTermDebt: 250,
  });
  const v = (k: string) => rs.find((r) => r.key === k)!.value;
  close(v("current"), 2, 1e-9, "current ratio");
  close(v("quick"), 1.04, 1e-9, "quick ratio");
  close(v("gross"), 0.4, 1e-9, "gross margin");
  close(v("roce"), 0.2, 1e-9, "ROCE 150 / 750");
  close(v("inventoryDays"), 73, 1e-9, "inventory days");
  close(v("receivableDays"), 36.5, 1e-9, "receivable days");
  close(v("interestCover"), 5, 1e-9, "interest cover");
  close(v("gearing"), 1 / 3, 1e-9, "gearing");
}

// ── WACC / CAPM ─────────────────────────────────────────────────
{
  close(capm(0.04, 1.2, 0.09), 0.1, 1e-9, "CAPM 4% + 1.2 × 5%");
  const w = wacc({ equityValue: 600, debtValue: 400, costOfEquity: 0.12, costOfDebt: 0.08, taxRate: 0.3 });
  close(w.wacc, 0.0944, 1e-9, "WACC 0.6×12% + 0.4×8%×0.7");
  close(w.afterTaxCostOfDebt, 0.056, 1e-9, "after-tax Kd");
}

// ── Time value of money ─────────────────────────────────────────
{
  close(futureValue(1000, 0.1, 3), 1331, 1e-6, "FV 1,000 at 10% for 3 years");
  close(presentValue(1331, 0.1, 3), 1000, 1e-6, "PV 1,331");
  close(futureValue(1000, 0.12, 1, 12), 1126.83, 0.01, "monthly compounding");
  close(effectiveAnnualRate(0.12, 12), 0.126825, 1e-6, "EAR 12% monthly");
  close(annuityPV(100, 0.1, 5), 379.08, 0.01, "PV annuity factor 3.791");
  close(annuityFV(100, 0.1, 5), 610.51, 0.01, "FV annuity");
  close(annuityPV(100, 0.1, 5, true), 416.99, 0.01, "PV annuity due");
  close(perpetuityPV(100, 0.1), 1000, 1e-9, "perpetuity");
  close(perpetuityPV(100, 0.1, 0.02), 1250, 1e-9, "growing perpetuity");
  assert.ok(Number.isNaN(perpetuityPV(100, 0.05, 0.05)), "r ≤ g → NaN");
  const g = growthSchedule(1000, 0.1, 3, 1, 100);
  close(g[2].closing, 1331 + 331, 1e-6, "lump sum + contributions");
  passed++;
}

console.log(`All ${passed} calculator checks passed.`);
