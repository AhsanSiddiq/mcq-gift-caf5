import ToolShell, { toolMetadata, type Faq } from "../_components/ToolShell";
import { B, Example, Formula, H3, P, UL } from "../_components/prose";
import RatiosCalculator from "./RatiosCalculator";

const SLUG = "financial-ratios-calculator";
export const metadata = toolMetadata(SLUG);

const faqs: Faq[] = [
  {
    q: "What is a good current ratio?",
    a: "There is no universal benchmark. Around 1.5 to 2 is often called comfortable, but supermarkets can operate safely below 1 because they sell inventory for cash before suppliers are due, while manufacturers usually need more. Always compare with the industry and with the same company's previous years.",
  },
  {
    q: "What is the difference between ROCE and ROE?",
    a: "ROCE measures the operating return on all long-term capital (equity plus debt), using profit before interest and tax, so it is independent of how the business is financed. ROE measures the return to shareholders only, using profit after interest and tax. Higher gearing can increase ROE even when ROCE is unchanged, because shareholders benefit when borrowed money earns more than it costs.",
  },
  {
    q: "Should I use year-end or average balances?",
    a: "Average balances, (opening + closing) ÷ 2, are more accurate for efficiency and return ratios because profit is earned over the whole year. Exams often only give year-end figures, or ask you to use them, and this calculator uses whatever you enter. Be consistent across years and companies.",
  },
  {
    q: "How do I calculate gearing?",
    a: "There are two common versions. Debt ÷ equity, or debt ÷ (debt + equity), where debt is interest-bearing borrowings. ACCA FR and FM commonly use debt ÷ equity, or debt ÷ (debt + equity) with market values in FM. Some definitions include lease liabilities and preference shares in debt. State the definition you use.",
  },
  {
    q: "Why is the cash conversion cycle important?",
    a: "It measures how many days cash is tied up between paying suppliers and collecting from customers: inventory days + receivable days − payable days. A longer cycle needs more working-capital finance (overdraft or equity), while a shorter or negative cycle frees cash.",
  },
  {
    q: "How do I write a good ratio interpretation in the exam?",
    a: "Do not just say that a ratio has gone up or down. Explain why, using information from the scenario (a new contract, a price rise, a revaluation, a new loan), say what it means for the user of the accounts, and link related ratios together. For example, a higher gross margin combined with a lower asset turnover may reflect a move upmarket.",
  },
];

export default function Page() {
  return (
    <ToolShell slug={SLUG} faqs={faqs} calculator={<RatiosCalculator />}>
      <P>
        Ratio analysis turns raw financial statements into comparable measures of performance and position. A profit of 90,000 means little on its own, but a
        9% net margin can be compared with competitors, with last year, or with the industry average. The calculator groups 16 standard ratios into the four
        families that ACCA FR, ICAP CAF, ICAEW Accounting and US CMA Part 2 examiners test.
      </P>

      <H3>Liquidity: can the business pay its short-term debts?</H3>
      <Formula>{`Current ratio = Current assets ÷ Current liabilities
Quick ratio   = (Current assets − Inventory) ÷ Current liabilities`}</Formula>

      <H3>Profitability: how well does it turn sales and capital into profit?</H3>
      <Formula>{`Gross margin = Gross profit ÷ Revenue
Operating margin = PBIT ÷ Revenue
ROCE = PBIT ÷ (Equity + Non-current debt)
ROE  = Profit after tax ÷ Equity`}</Formula>
      <P>ROCE breaks down into operating margin × asset turnover, which shows whether a change in return comes from pricing and costs or from how hard the assets are worked.</P>

      <H3>Efficiency: how quickly does working capital turn over?</H3>
      <Formula>{`Inventory days  = Inventory ÷ Cost of sales × 365
Receivable days = Trade receivables ÷ Revenue × 365
Payable days    = Trade payables ÷ Cost of sales × 365`}</Formula>

      <H3>Gearing: how much financial risk is there?</H3>
      <Formula>{`Gearing        = Debt ÷ (Debt + Equity)
Interest cover = PBIT ÷ Interest expense`}</Formula>

      <Example>
        <p>The example figures loaded in the calculator describe a company with revenue of 1,000,000:</p>
        <UL>
          <li><B>Current ratio</B> 250,000 ÷ 125,000 = 2.0x, and <B>quick ratio</B> (250,000 − 120,000) ÷ 125,000 = 1.04x. Liquidity is healthy even without selling inventory.</li>
          <li><B>Gross margin</B> 400,000 ÷ 1,000,000 = 40%, and <B>operating margin</B> 15%.</li>
          <li><B>ROCE</B> 150,000 ÷ (500,000 + 250,000) = 20%. That equals the 15% operating margin × 1.33 turnover of capital employed.</li>
          <li><B>Inventory days</B> 120,000 ÷ 600,000 × 365 = 73 days, and <B>receivable days</B> 100,000 ÷ 1,000,000 × 365 = 36.5 days.</li>
          <li><B>Gearing</B> 250,000 ÷ 750,000 = 33.3%, and <B>interest cover</B> 150,000 ÷ 30,000 = 5x. That is moderate debt, comfortably serviced.</li>
        </UL>
        <p>Change any input and every ratio and interpretation updates instantly. Try halving operating profit to see interest cover fall into the danger zone.</p>
      </Example>

      <H3>Limitations to mention</H3>
      <P>
        Ratios rely on historical figures, can be distorted by year-end window dressing, seasonal trade or different accounting policies (such as revaluations
        or depreciation methods), and need a meaningful comparator. In exam answers, pair each calculation with a reason drawn from the scenario.
      </P>
    </ToolShell>
  );
}
