/** Financial ratio analysis with one-line interpretations. Pure functions. */

export interface RatioInputs {
  revenue: number;
  costOfSales: number;
  /** Profit before interest and tax (operating profit) */
  operatingProfit: number;
  /** Profit for the year (after tax) */
  netProfit: number;
  interestExpense: number;
  inventory: number;
  receivables: number;
  cash: number;
  currentAssets: number;
  currentLiabilities: number;
  payables: number;
  totalAssets: number;
  equity: number;
  /** Interest-bearing non-current borrowings */
  longTermDebt: number;
}

export type RatioGroup = "Liquidity" | "Profitability" | "Efficiency" | "Gearing";
export type RatioUnit = "x" | "%" | "days";

export interface Ratio {
  key: string;
  group: RatioGroup;
  name: string;
  formula: string;
  /** Percentages as decimals (0.25 = 25%); null when undefined (e.g. division by zero) */
  value: number | null;
  unit: RatioUnit;
  interpretation: string;
}

const div = (a: number, b: number): number | null => (b === 0 || !Number.isFinite(a) || !Number.isFinite(b) ? null : a / b);
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

type Interp = (v: number) => string;

const interp: Record<string, Interp> = {
  current: (v) =>
    v < 1 ? "Below 1: current liabilities exceed current assets, so short-term obligations could be hard to meet."
    : v < 1.5 ? "Adequate but thin cover. The business relies on converting inventory and receivables promptly."
    : v <= 3 ? "Comfortable short-term liquidity: current assets cover current liabilities with room to spare."
    : "Very high. Liquidity is safe, but cash or inventory may be tied up inefficiently.",
  quick: (v) =>
    v < 0.7 ? "Weak acid test: without selling inventory the business cannot cover its current liabilities."
    : v < 1 ? "Slightly below 1. Acceptable where inventory turns quickly (e.g. retail), otherwise worth watching."
    : v <= 2 ? "Healthy: liquid assets alone cover current liabilities."
    : "Very high liquid balances. Consider whether surplus cash could be invested or returned.",
  cashRatio: (v) =>
    v < 0.2 ? "Little cash relative to short-term debts. Liquidity depends on collecting receivables."
    : v <= 1 ? "Reasonable cash buffer against current liabilities."
    : "Cash alone covers all current liabilities. Very safe, possibly over-cautious.",
  gross: (v) =>
    v < 0 ? "Negative: goods are sold for less than they cost. Pricing or purchasing needs urgent review."
    : v < 0.2 ? "Low gross margin, typical of high-volume, low-price sectors such as supermarkets."
    : v < 0.5 ? "Moderate gross margin. Compare with the sector and prior years for pricing or cost changes."
    : "High gross margin, suggesting strong pricing power or low direct costs.",
  operating: (v) =>
    v < 0 ? "Operating loss: overheads exceed gross profit."
    : v < 0.05 ? "Thin operating margin. Small cost increases could wipe out profit."
    : v < 0.15 ? "Reasonable operating margin for many industries."
    : "Strong operating margin: overheads are well controlled relative to sales.",
  net: (v) =>
    v < 0 ? "Loss-making after interest and tax."
    : v < 0.05 ? "Low net margin. Little profit is left for shareholders from each sale."
    : v < 0.15 ? "Healthy net margin."
    : "Very strong net margin.",
  roce: (v) =>
    v < 0 ? "Negative return: capital employed is generating operating losses."
    : v < 0.1 ? "Low return on capital, possibly below the cost of capital. Compare with WACC."
    : v < 0.2 ? "Sound return on capital employed."
    : "Excellent return on capital employed.",
  roe: (v) =>
    v < 0 ? "Negative return for shareholders."
    : v < 0.1 ? "Modest return to equity holders. Compare with their required return (cost of equity)."
    : v < 0.2 ? "Good return on shareholders' funds."
    : "High ROE. Check how much of it comes from gearing rather than operating performance.",
  assetTurnover: (v) =>
    v < 0.5 ? "Low: the business needs a large asset base per unit of revenue (common in capital-intensive sectors)."
    : v < 1.5 ? "Moderate efficiency in generating revenue from assets."
    : "High asset turnover: assets are being worked hard to generate sales.",
  inventoryDays: (v) =>
    v < 30 ? "Inventory turns over quickly, under a month on hand."
    : v < 90 ? "Inventory held for 1 to 3 months. Compare with the sector and prior years."
    : "Slow-moving inventory. Risk of obsolescence and cash tied up in stock.",
  receivableDays: (v) =>
    v < 30 ? "Customers pay quickly: strong credit control or mainly cash sales."
    : v <= 60 ? "Typical credit period. Check it against the stated credit terms."
    : "Slow collection. Credit control may be weak and bad-debt risk is higher.",
  payableDays: (v) =>
    v < 30 ? "Suppliers are paid quickly. The business may be missing out on free credit."
    : v <= 60 ? "Normal supplier credit period."
    : "Suppliers are paid slowly. That helps cash flow but may signal liquidity strain or damage supplier relations.",
  ccc: (v) =>
    v < 0 ? "Negative cycle: suppliers effectively finance operations (common in retail)."
    : v < 60 ? "Short cash conversion cycle, so little working capital is needed."
    : "Long cash conversion cycle. Significant working-capital financing is needed.",
  debtEquity: (v) =>
    v < 0.5 ? "Low gearing: financed mainly by equity, so financial risk is low."
    : v <= 1 ? "Moderate gearing."
    : "High gearing: debt exceeds equity, so interest commitments and financial risk are elevated.",
  gearing: (v) =>
    v < 0.3 ? "Low gearing. There may be spare borrowing capacity."
    : v <= 0.5 ? "Moderate gearing, typical for many established companies."
    : "Highly geared: more than half of long-term finance is debt.",
  interestCover: (v) =>
    v < 1.5 ? "Dangerously low: operating profit barely covers interest."
    : v < 3 ? "Thin interest cover. A fall in profit could threaten interest payments."
    : v < 8 ? "Comfortable interest cover."
    : "Very strong interest cover. Debt service is not a concern.",
};

export function computeRatios(i: RatioInputs): Ratio[] {
  const grossProfit = i.revenue - i.costOfSales;
  const capitalEmployed = i.equity + i.longTermDebt;
  const invDays = div(i.inventory * 365, i.costOfSales);
  const recDays = div(i.receivables * 365, i.revenue);
  const payDays = div(i.payables * 365, i.costOfSales);
  const ccc = invDays !== null && recDays !== null && payDays !== null ? invDays + recDays - payDays : null;

  const defs: Omit<Ratio, "interpretation">[] = [
    { key: "current", group: "Liquidity", name: "Current ratio", formula: "Current assets ÷ Current liabilities", value: div(i.currentAssets, i.currentLiabilities), unit: "x" },
    { key: "quick", group: "Liquidity", name: "Quick (acid-test) ratio", formula: "(Current assets − Inventory) ÷ Current liabilities", value: div(i.currentAssets - i.inventory, i.currentLiabilities), unit: "x" },
    { key: "cashRatio", group: "Liquidity", name: "Cash ratio", formula: "Cash ÷ Current liabilities", value: div(i.cash, i.currentLiabilities), unit: "x" },
    { key: "gross", group: "Profitability", name: "Gross profit margin", formula: "(Revenue − Cost of sales) ÷ Revenue", value: div(grossProfit, i.revenue), unit: "%" },
    { key: "operating", group: "Profitability", name: "Operating profit margin", formula: "PBIT ÷ Revenue", value: div(i.operatingProfit, i.revenue), unit: "%" },
    { key: "net", group: "Profitability", name: "Net profit margin", formula: "Profit after tax ÷ Revenue", value: div(i.netProfit, i.revenue), unit: "%" },
    { key: "roce", group: "Profitability", name: "Return on capital employed (ROCE)", formula: "PBIT ÷ (Equity + Non-current debt)", value: div(i.operatingProfit, capitalEmployed), unit: "%" },
    { key: "roe", group: "Profitability", name: "Return on equity (ROE)", formula: "Profit after tax ÷ Equity", value: div(i.netProfit, i.equity), unit: "%" },
    { key: "assetTurnover", group: "Efficiency", name: "Asset turnover", formula: "Revenue ÷ Total assets", value: div(i.revenue, i.totalAssets), unit: "x" },
    { key: "inventoryDays", group: "Efficiency", name: "Inventory holding period", formula: "Inventory ÷ Cost of sales × 365", value: invDays, unit: "days" },
    { key: "receivableDays", group: "Efficiency", name: "Receivables collection period", formula: "Trade receivables ÷ Revenue × 365", value: recDays, unit: "days" },
    { key: "payableDays", group: "Efficiency", name: "Payables payment period", formula: "Trade payables ÷ Cost of sales × 365", value: payDays, unit: "days" },
    { key: "ccc", group: "Efficiency", name: "Cash conversion cycle", formula: "Inventory days + Receivable days − Payable days", value: ccc, unit: "days" },
    { key: "debtEquity", group: "Gearing", name: "Debt-to-equity", formula: "Non-current debt ÷ Equity", value: div(i.longTermDebt, i.equity), unit: "x" },
    { key: "gearing", group: "Gearing", name: "Gearing (debt ÷ capital employed)", formula: "Non-current debt ÷ (Debt + Equity)", value: div(i.longTermDebt, capitalEmployed), unit: "%" },
    { key: "interestCover", group: "Gearing", name: "Interest cover", formula: "PBIT ÷ Interest expense", value: div(i.operatingProfit, i.interestExpense), unit: "x" },
  ];

  return defs.map((d) => ({
    ...d,
    interpretation:
      d.value === null
        ? d.key === "interestCover"
          ? "No interest expense, so the business has no debt service to cover."
          : "Not available: the denominator is zero. Check your inputs."
        : interp[d.key](d.value),
  }));
}

export function formatRatio(r: Pick<Ratio, "value" | "unit">): string {
  if (r.value === null) return "n/a";
  if (r.unit === "%") return pct(r.value);
  if (r.unit === "days") return `${r.value.toFixed(0)} days`;
  return `${r.value.toFixed(2)}x`;
}
