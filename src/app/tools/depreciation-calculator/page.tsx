import ToolShell, { toolMetadata, type Faq } from "../_components/ToolShell";
import { B, Example, Formula, H3, P, UL } from "../_components/prose";
import DepreciationCalculator from "./DepreciationCalculator";

const SLUG = "depreciation-calculator";
export const metadata = toolMetadata(SLUG);

const faqs: Faq[] = [
  {
    q: "What is the difference between straight-line and reducing balance depreciation?",
    a: "Straight-line charges the same amount every year: (cost − residual value) ÷ useful life. Reducing balance applies a fixed percentage to the carrying amount at the start of each year, so the charge is highest in year one and falls every year. Both write the asset down to the same residual value. They only differ in timing.",
  },
  {
    q: "Is residual value deducted under the reducing balance method?",
    a: "No. The reducing-balance percentage is applied to the full carrying amount (cost less accumulated depreciation), not to cost less residual value. The residual value is built into the rate itself: rate = 1 − (residual ÷ cost)^(1/n). If an exam gives you the rate directly, just apply it to the opening carrying amount each year.",
  },
  {
    q: "How do I calculate double-declining balance depreciation?",
    a: "Double-declining balance is reducing balance at twice the straight-line rate. For a 5-year asset the straight-line rate is 20%, so the double-declining rate is 40%. Select 'Reducing balance' and enter 40 as the rate. Many US textbooks switch to straight-line in the later years so the asset reaches residual value exactly.",
  },
  {
    q: "What is the sum-of-the-years'-digits method?",
    a: "It is an accelerated method. Add the years of the asset's life (for 5 years: 1+2+3+4+5 = 15, or n(n+1)/2). Each year's charge is the remaining life at the start of the year divided by that sum, times the depreciable amount. So year 1 is 5/15, year 2 is 4/15, and so on.",
  },
  {
    q: "Which depreciation method should a company use under IAS 16?",
    a: "IAS 16 requires the method that best reflects the pattern in which the asset's economic benefits are consumed. Straight-line suits assets used evenly over time, such as buildings. Reducing balance suits assets that lose value or productivity fastest when new, such as vehicles and IT equipment. The method is reviewed at least each year end, and any change is a change in accounting estimate, applied prospectively.",
  },
  {
    q: "Is depreciation charged in the year of purchase?",
    a: "This calculator assumes a full year's charge in every year of the life. In practice, and in many exam questions, depreciation is time-apportioned from the date the asset is available for use, for example 9/12 of the annual charge for an asset bought on 1 April with a 31 December year end. Read the question's policy carefully.",
  },
];

export default function Page() {
  return (
    <ToolShell slug={SLUG} faqs={faqs} calculator={<DepreciationCalculator />}>
      <P>
        Depreciation spreads the cost of a non-current asset over the periods that benefit from using it. Under IAS 16 <i>Property, Plant and Equipment</i>,
        the <B>depreciable amount</B> (cost less residual value) is allocated on a systematic basis over the asset&apos;s <B>useful life</B>. The total charged
        is the same whichever method you choose. The method only changes <i>when</i> the expense hits profit or loss.
      </P>

      <H3>Straight-line method</H3>
      <P>The same charge every year. It is simple, and it is the default for assets that are used evenly over time.</P>
      <Formula label="Straight-line">Annual depreciation = (Cost − Residual value) ÷ Useful life</Formula>

      <H3>Reducing (declining) balance method</H3>
      <P>
        A fixed percentage is applied to the opening carrying amount, also called net book value (NBV), each year. Because the base shrinks, the charge falls every
        year. If you leave the rate blank, the calculator uses the rate that lands exactly on residual value at the end of the life. Enter your own rate,
        such as 25% or a double-declining 40%, to match an exam question.
      </P>
      <Formula label="Reducing balance">{`Depreciation (year t) = Opening NBV × Rate
Rate that reaches residual value = 1 − (Residual ÷ Cost)^(1 ÷ n)`}</Formula>

      <H3>Sum-of-the-years&apos;-digits (SYD)</H3>
      <P>Another accelerated method, common in US GAAP and US CMA questions. It produces a charge that falls by the same amount every year.</P>
      <Formula label="SYD">{`SYD = n(n + 1) ÷ 2
Depreciation (year t) = (n − t + 1) ÷ SYD × (Cost − Residual value)`}</Formula>

      <Example>
        <p>
          A machine costs <B>50,000</B>, has a residual value of <B>5,000</B> and a useful life of <B>5 years</B>. The depreciable amount is 45,000.
        </p>
        <UL>
          <li><B>Straight-line:</B> 45,000 ÷ 5 = 9,000 a year. NBV falls 50,000 → 41,000 → 32,000 → 23,000 → 14,000 → 5,000.</li>
          <li><B>Reducing balance at 40%:</B> year 1 = 50,000 × 40% = 20,000; year 2 = 30,000 × 40% = 12,000; year 3 = 18,000 × 40% = 7,200. The charge is capped so NBV never falls below the 5,000 residual.</li>
          <li><B>Reducing balance (implied rate):</B> 1 − (5,000 ÷ 50,000)^(1/5) = 36.90%, giving year 1 depreciation of 18,452 and exactly 5,000 left after year 5.</li>
          <li><B>SYD:</B> sum of digits = 15. Charges are 5/15, 4/15, 3/15, 2/15 and 1/15 of 45,000: 15,000, 12,000, 9,000, 6,000 and 3,000.</li>
        </UL>
        <p>All three methods charge 45,000 in total. Accelerated methods simply move more of it into the early years.</p>
      </Example>

      <H3>Exam tips</H3>
      <UL>
        <li>Check whether the question wants a full-year charge in the year of acquisition or a monthly (pro-rata) charge.</li>
        <li>On disposal, profit or loss = proceeds − carrying amount at the disposal date. The schedule above gives you the carrying amount at each year end.</li>
        <li>A change in useful life or method is a change in estimate (IAS 8). Depreciate the <i>remaining</i> carrying amount over the <i>remaining</i> life. Do not restate prior years.</li>
      </UL>
    </ToolShell>
  );
}
