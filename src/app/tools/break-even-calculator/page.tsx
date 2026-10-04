import ToolShell, { toolMetadata, type Faq } from "../_components/ToolShell";
import { B, Example, Formula, H3, P, UL } from "../_components/prose";
import BreakEvenCalculator from "./BreakEvenCalculator";

const SLUG = "break-even-calculator";
export const metadata = toolMetadata(SLUG);

const faqs: Faq[] = [
  {
    q: "What is the break-even point?",
    a: "It is the level of sales at which total revenue equals total costs, so profit is exactly zero. Below it the business makes a loss, above it a profit. In units it is fixed costs ÷ contribution per unit, and in revenue it is fixed costs ÷ C/S ratio.",
  },
  {
    q: "What is the difference between the contribution margin ratio and the C/S ratio?",
    a: "Nothing. They are the same ratio under different names. ACCA and CIMA call it the contribution to sales (C/S) or profit/volume (P/V) ratio. US texts and the US CMA call it the contribution margin ratio. It is contribution ÷ sales, the share of each sale left over to cover fixed costs and then provide profit.",
  },
  {
    q: "How do I calculate the margin of safety?",
    a: "Margin of safety = budgeted sales − break-even sales. It can be given in units, revenue, or as a percentage of budgeted sales. It tells you how far sales can fall before the business starts making a loss. A higher margin of safety means lower risk.",
  },
  {
    q: "How many units do I need to sell to reach a target profit?",
    a: "Required units = (fixed costs + target profit) ÷ contribution per unit. For required revenue, divide by the C/S ratio instead. If the target is an after-tax profit, first gross it up: pre-tax target = after-tax target ÷ (1 − tax rate).",
  },
  {
    q: "What is the degree of operating leverage?",
    a: "Operating leverage = contribution ÷ profit, which is also 1 ÷ margin of safety %. It measures how sensitive profit is to a change in sales. With leverage of 4, a 10% rise in sales volume increases profit by 40%, and a 10% fall reduces it by 40%.",
  },
  {
    q: "What assumptions does CVP analysis make?",
    a: "Selling price and variable cost per unit are constant, fixed costs do not change within the relevant range, a single product (or a constant sales mix) is sold, and production equals sales so inventory does not change. Real cost behaviour is rarely this tidy, so treat the results as a planning approximation.",
  },
];

export default function Page() {
  return (
    <ToolShell slug={SLUG} faqs={faqs} calculator={<BreakEvenCalculator />}>
      <P>
        Cost-volume-profit (CVP) analysis looks at how profit changes as sales volume changes. It rests on one idea, <B>contribution</B>. Every unit sold earns
        its selling price less its variable cost. That contribution first pays for the period&apos;s fixed costs, and once they are covered, every further
        unit adds its full contribution to profit. The break-even point is where total contribution exactly equals fixed costs.
      </P>

      <H3>Core formulas</H3>
      <Formula label="Contribution">{`Contribution per unit = Selling price − Variable cost per unit
C/S ratio (CM ratio)   = Contribution per unit ÷ Selling price`}</Formula>
      <Formula label="Break-even">{`Break-even units   = Fixed costs ÷ Contribution per unit
Break-even revenue = Fixed costs ÷ C/S ratio`}</Formula>
      <Formula label="Margin of safety & target profit">{`Margin of safety (units) = Budgeted units − Break-even units
Margin of safety %       = MOS units ÷ Budgeted units
Units for target profit  = (Fixed costs + Target profit) ÷ Contribution per unit`}</Formula>

      <Example>
        <p>
          A product sells for <B>25</B> and costs <B>15</B> per unit in variable costs. Monthly fixed costs are <B>60,000</B>, budgeted sales are{" "}
          <B>8,000 units</B>, and management wants a profit of <B>30,000</B>.
        </p>
        <UL>
          <li>Contribution per unit = 25 − 15 = 10, and the C/S ratio = 10 ÷ 25 = 40%.</li>
          <li>Break-even = 60,000 ÷ 10 = <B>6,000 units</B>, or 60,000 ÷ 0.40 = <B>150,000 revenue</B>.</li>
          <li>Margin of safety = 8,000 − 6,000 = 2,000 units, which is <B>25%</B> of budget (50,000 of revenue).</li>
          <li>Budgeted profit = 8,000 × 10 − 60,000 = 20,000, so operating leverage = 80,000 ÷ 20,000 = 4 (and 1 ÷ 25% = 4).</li>
          <li>Target profit volume = (60,000 + 30,000) ÷ 10 = <B>9,000 units</B>, or 225,000 of revenue.</li>
        </UL>
        <p>The profit table under the calculator shows the same story: a loss below 6,000 units and 10 of extra profit for every unit above it.</p>
      </Example>

      <H3>Multi-product break-even</H3>
      <P>
        With several products sold in a fixed mix, use a weighted average C/S ratio: total contribution ÷ total revenue for the standard mix. Break-even revenue is
        then fixed costs ÷ weighted C/S ratio. If the mix changes, so does the break-even point. Shifting sales towards higher-margin products lowers it. This
        is a favourite ACCA PM and CIMA exam twist.
      </P>
    </ToolShell>
  );
}
