import ToolShell, { toolMetadata, type Faq } from "../_components/ToolShell";
import { B, Example, Formula, H3, P, UL } from "../_components/prose";
import TvmCalculator from "./TvmCalculator";

const SLUG = "compound-interest-calculator";
export const metadata = toolMetadata(SLUG);

const faqs: Faq[] = [
  {
    q: "What is the difference between simple and compound interest?",
    a: "Simple interest is earned only on the original principal: interest = P × r × t. Compound interest is also earned on interest already added, so the balance grows exponentially: FV = P(1 + r)ᵗ. At 8% for 10 years, 10,000 grows to 18,000 with simple interest but 21,589 with annual compounding.",
  },
  {
    q: "How does compounding frequency change the answer?",
    a: "More frequent compounding means interest starts earning interest sooner. 12% compounded monthly is 1% a month, which gives an effective annual rate of (1.01)¹² − 1 = 12.68%. The calculator shows the effective annual rate (EAR) so you can compare offers quoted with different compounding.",
  },
  {
    q: "What is the difference between an ordinary annuity and an annuity due?",
    a: "An ordinary annuity pays at the end of each period, which is the assumption behind the cumulative discount factor tables in ACCA, CIMA and ICAP exams. An annuity due pays at the start of each period, as with rent or lease payments in advance. Every payment arrives one period sooner, so its value is the ordinary annuity × (1 + r).",
  },
  {
    q: "How do I value an annuity that starts in a later year?",
    a: "Value it as if it were an ordinary annuity, which gives its value one period before the first payment, then discount that figure back to today. For payments in years 3 to 7 at 10%, take the 5-year annuity factor (3.791), which values them at the end of year 2, then multiply by the year-2 discount factor (0.826). Alternatively, use the 7-year factor minus the 2-year factor: 4.868 − 1.736 = 3.132.",
  },
  {
    q: "What is a growing perpetuity?",
    a: "A stream of payments that grows at a constant rate g forever. Its value is C₁ ÷ (r − g), where C₁ is next period's payment. This is the Gordon growth (dividend valuation) model used to value shares and to estimate the cost of equity. It only works when r is greater than g.",
  },
  {
    q: "Should I use the tables or the formula in exams?",
    a: "Use the tables provided when the rate and period appear in them, because they are faster and match the examiner's rounding. Use the formula for rates or periods outside the tables, or for non-annual compounding. This calculator shows factors to four decimal places, but table factors are three, so expect small rounding differences.",
  },
];

export default function Page() {
  return (
    <ToolShell slug={SLUG} faqs={faqs} calculator={<TvmCalculator />}>
      <P>
        The <B>time value of money</B> means 1 today is worth more than 1 next year, because today&apos;s money can be invested to earn a return. Almost every
        finance calculation, including loan payments, bond prices, lease liabilities, NPV and share valuation, is built from four formulas. This calculator handles each
        of them, with any compounding frequency.
      </P>

      <H3>1. Compound interest (future value)</H3>
      <Formula>{`FV = PV × (1 + r ÷ m)^(m × t)
EAR = (1 + r ÷ m)^m − 1`}</Formula>
      <P>Here r is the nominal annual rate, m the number of compounding periods per year and t the number of years. Add regular contributions to model savings plans.</P>

      <H3>2. Present value of a single future sum</H3>
      <Formula>{`PV = FV ÷ (1 + r)ᵗ    Discount factor = 1 ÷ (1 + r)ᵗ`}</Formula>

      <H3>3. Annuities (level payments for n periods)</H3>
      <Formula>{`PV (ordinary) = C × [1 − (1 + r)^−n] ÷ r
FV (ordinary) = C × [(1 + r)ⁿ − 1] ÷ r
Annuity due   = ordinary value × (1 + r)`}</Formula>

      <H3>4. Perpetuities (payments forever)</H3>
      <Formula>{`Level:   PV = C ÷ r
Growing: PV = C₁ ÷ (r − g)`}</Formula>

      <Example>
        <UL>
          <li><B>Compound interest:</B> 10,000 invested at 8% a year for 10 years grows to 10,000 × 1.08¹⁰ = <B>21,589.25</B>, earning 11,589.25 of interest. Compounded monthly, it reaches 22,196.40.</li>
          <li><B>Present value:</B> 50,000 receivable in 5 years, discounted at 10%, is worth 50,000 ÷ 1.10⁵ = 50,000 × 0.6209 = <B>31,046.07</B> today.</li>
          <li><B>Annuity:</B> 1,000 a year for 5 years at 10% has a present value of 1,000 × 3.7908 = <B>3,790.79</B> and a future value of 6,105.10. Paid in advance, the PV rises to 4,169.87.</li>
          <li><B>Perpetuity:</B> 1,000 a year forever at 10% is worth 1,000 ÷ 0.10 = <B>10,000</B>. If it grows at 3% a year starting at 1,000 next year, it is worth 1,000 ÷ (0.10 − 0.03) = 14,285.71.</li>
        </UL>
      </Example>

      <P>
        Rule of 72: to estimate how long money takes to double, divide 72 by the percentage rate. At 8% that is about 9 years (exactly 9.01), a handy check on
        any compound-interest answer.
      </P>
    </ToolShell>
  );
}
