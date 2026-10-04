/** Registry of the free calculators under /tools. Used by the hub, each tool page, and the sitemap. */

export interface ToolMeta {
  slug: string;
  /** Short name for cards and breadcrumbs */
  name: string;
  /** H1 on the page */
  h1: string;
  /** <title> (the layout appends " – The CA Hub") */
  title: string;
  description: string;
  /** One-line summary for the hub card */
  blurb: string;
  /** Lead paragraph under the H1 */
  intro: string;
  keywords: string[];
  /** Subject ids from src/data/subjects.ts whose MCQ banks cover this topic */
  practise: string[];
  /** Lucide icon name rendered by the hub/shell */
  icon: "TrendingDown" | "LineChart" | "Landmark" | "Target" | "Package" | "Gauge" | "Scale" | "Percent";
}

export const TOOLS: ToolMeta[] = [
  {
    slug: "depreciation-calculator",
    name: "Depreciation",
    h1: "Depreciation Calculator",
    title: "Depreciation Calculator – Straight-Line, Reducing Balance & SYD Schedule",
    description:
      "Free depreciation calculator with a full year-by-year schedule. Compare straight-line, reducing (declining) balance and sum-of-the-years'-digits, then export the table to CSV.",
    blurb: "Straight-line, reducing balance and sum-of-years-digits with a full year-by-year schedule.",
    intro:
      "Enter an asset's cost, residual value and useful life to get the annual depreciation charge, accumulated depreciation and carrying amount for every year. Switch methods to see how each one spreads the same cost over the asset's life.",
    keywords: ["depreciation calculator", "straight line depreciation calculator", "reducing balance depreciation calculator", "declining balance calculator", "sum of years digits calculator", "depreciation schedule"],
    practise: ["prc-1", "caf-1", "acca-fa", "cima-ba3", "icaew-acc"],
    icon: "TrendingDown",
  },
  {
    slug: "npv-irr-calculator",
    name: "NPV & IRR",
    h1: "NPV & IRR Calculator",
    title: "NPV & IRR Calculator – Net Present Value, IRR, MIRR & Payback",
    description:
      "Free NPV and IRR calculator. Add or remove yearly cash flows to get net present value, internal rate of return (solved numerically, including multiple-IRR cases), MIRR and payback.",
    blurb: "Net present value, IRR, MIRR and payback for any cash-flow profile.",
    intro:
      "Type in an investment's cash flows year by year and a discount rate (the cost of capital). You get the NPV, the IRR solved numerically, MIRR, simple and discounted payback, and a discounting table you can copy into your workings.",
    keywords: ["npv calculator", "irr calculator", "net present value calculator", "internal rate of return calculator", "mirr calculator", "discounted payback calculator"],
    practise: ["acca-fm", "ca-inter-fmsm", "cma-p2", "acca-pm", "prc-2"],
    icon: "LineChart",
  },
  {
    slug: "loan-amortization-calculator",
    name: "Loan & lease amortisation",
    h1: "Loan & Lease Amortisation Calculator",
    title: "Loan Amortization Calculator – Repayment Schedule & Total Interest",
    description:
      "Free loan and lease amortisation calculator. Get the periodic payment, total interest and a full schedule splitting each payment into interest and principal, with payments in arrears or in advance and an optional balloon.",
    blurb: "Payment, total interest and a period-by-period amortisation schedule.",
    intro:
      "Work out the level repayment on a loan or lease, then see exactly how much of each payment is interest and how much reduces the balance. Toggle payments in advance for lease-style contracts, or add a balloon or residual value.",
    keywords: ["loan amortization calculator", "amortisation schedule", "loan repayment calculator", "lease calculator", "mortgage amortization schedule", "total interest calculator"],
    practise: ["acca-fr", "caf-1", "acca-fm", "prc-2", "ca-foundation-qa"],
    icon: "Landmark",
  },
  {
    slug: "break-even-calculator",
    name: "Break-even & CVP",
    h1: "Break-even & CVP Calculator",
    title: "Break-even Calculator – CVP Analysis, Margin of Safety & Target Profit",
    description:
      "Free break-even calculator for cost-volume-profit analysis. Find break-even units and revenue, contribution margin ratio, margin of safety, operating leverage and the sales needed for a target profit.",
    blurb: "Break-even point, C/S ratio, margin of safety and target-profit volume.",
    intro:
      "Enter a selling price, variable cost per unit and fixed costs to find the break-even point in units and revenue. Add budgeted sales and a target profit to see your margin of safety and the volume you need to hit that profit.",
    keywords: ["break even calculator", "break even point calculator", "cvp analysis calculator", "contribution margin calculator", "margin of safety calculator", "target profit calculator"],
    practise: ["acca-ma", "acca-pm", "caf-5", "cma-p2", "cima-ba2", "ca-inter-cma"],
    icon: "Target",
  },
  {
    slug: "eoq-calculator",
    name: "EOQ",
    h1: "EOQ Calculator (Economic Order Quantity)",
    title: "EOQ Calculator – Economic Order Quantity with Quantity Discounts",
    description:
      "Free economic order quantity calculator. Get the EOQ, number of orders per year, ordering and holding costs and total annual cost, with optional bulk-purchase quantity discounts.",
    blurb: "Economic order quantity, number of orders and total cost, with quantity discounts.",
    intro:
      "Find the order size that minimises the combined cost of placing orders and holding inventory. Add supplier price breaks to test whether a bulk discount is worth the extra holding cost.",
    keywords: ["eoq calculator", "economic order quantity calculator", "eoq formula", "eoq with quantity discount", "inventory holding cost calculator", "reorder quantity"],
    practise: ["acca-ma", "acca-fm", "caf-5", "cima-ba2", "ca-inter-cma", "cma-p1"],
    icon: "Package",
  },
  {
    slug: "financial-ratios-calculator",
    name: "Financial ratios",
    h1: "Financial Ratios Calculator",
    title: "Financial Ratio Calculator – Liquidity, Profitability, Efficiency & Gearing",
    description:
      "Free financial ratio analysis calculator. Enter figures from the statement of profit or loss and balance sheet to get 16 liquidity, profitability, efficiency and gearing ratios, each with a plain-English interpretation.",
    blurb: "16 liquidity, profitability, efficiency and gearing ratios with interpretations.",
    intro:
      "Enter figures from an income statement and statement of financial position. The calculator works out the key ratios examiners ask for and gives each one a one-line interpretation, so you can practise writing analysis as well as the arithmetic.",
    keywords: ["financial ratio calculator", "ratio analysis calculator", "current ratio calculator", "roce calculator", "gearing ratio calculator", "inventory days calculator"],
    practise: ["acca-fr", "acca-fa", "caf-1", "acca-fm", "cma-p2", "icaew-acc"],
    icon: "Gauge",
  },
  {
    slug: "wacc-calculator",
    name: "WACC",
    h1: "WACC Calculator",
    title: "WACC Calculator – Weighted Average Cost of Capital with CAPM",
    description:
      "Free WACC calculator. Weight the cost of equity, after-tax cost of debt and preference shares by market value. Optionally derive the cost of equity with CAPM from the risk-free rate, beta and market return.",
    blurb: "Weighted average cost of capital with tax shield and optional CAPM.",
    intro:
      "Enter the market values and costs of each source of finance to get a firm's weighted average cost of capital, the discount rate for average-risk projects. Not sure of the cost of equity? Switch on CAPM and derive it from beta.",
    keywords: ["wacc calculator", "weighted average cost of capital calculator", "capm calculator", "cost of equity calculator", "after tax cost of debt", "discount rate calculator"],
    practise: ["acca-fm", "ca-inter-fmsm", "cma-p2"],
    icon: "Scale",
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound interest & annuities",
    h1: "Compound Interest, Present Value & Annuity Calculator",
    title: "Compound Interest Calculator – Future Value, Present Value, Annuity & Perpetuity",
    description:
      "Free time value of money calculator. Compound interest and future value, present value of a future sum, annuities (ordinary and due) and level or growing perpetuities, with a year-by-year growth table.",
    blurb: "Future value, present value, annuities and perpetuities in one place.",
    intro:
      "Every discounting question comes back to four building blocks: compounding a sum forward, discounting it back, valuing a stream of level payments, and valuing a stream that never ends. Pick a mode below and the answer updates as you type.",
    keywords: ["compound interest calculator", "future value calculator", "present value calculator", "annuity calculator", "perpetuity calculator", "time value of money calculator"],
    practise: ["prc-2", "ca-foundation-qa", "acca-fm", "acca-ma", "cma-p2"],
    icon: "Percent",
  },
];

export const getTool = (slug: string): ToolMeta => {
  const t = TOOLS.find((x) => x.slug === slug);
  if (!t) throw new Error(`Unknown tool: ${slug}`);
  return t;
};

export const TOOLS_BASE_URL = "https://www.thecahub.com/tools";
