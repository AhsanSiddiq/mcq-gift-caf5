import ToolShell, { toolMetadata, type Faq } from "../_components/ToolShell";
import { B, Example, Formula, H3, P, UL } from "../_components/prose";
import LoanCalculator from "./LoanCalculator";

const SLUG = "loan-amortization-calculator";
export const metadata = toolMetadata(SLUG);

const faqs: Faq[] = [
  {
    q: "What is an amortisation schedule?",
    a: "It is a table showing, for every payment, the opening balance, the interest charged, the part of the payment that reduces the balance (principal), and the closing balance. With a level payment, early payments are mostly interest. As the balance falls, more of each payment goes to principal.",
  },
  {
    q: "How is the loan payment calculated?",
    a: "The level payment is the amount whose present value at the periodic interest rate equals the amount borrowed: PMT = P × r ÷ (1 − (1 + r)^−n), where r is the rate per period and n the number of payments. For payments in advance, divide that result by (1 + r).",
  },
  {
    q: "How does this relate to IFRS 16 lease accounting?",
    a: "Under IFRS 16 the lessee recognises a lease liability at the present value of the lease payments. Each period, interest is charged on the outstanding liability (debit finance cost, credit liability) and the payment reduces it. That is exactly the schedule above. For leases paid in advance, tick 'Payments in advance': the first payment reduces the liability before any interest accrues.",
  },
  {
    q: "How do I split the liability into current and non-current?",
    a: "The non-current liability is the balance outstanding after the payments due in the next 12 months. For annual payments in arrears, it is the closing balance at the end of next year. The current portion is today's closing balance minus that figure. Read both figures straight from the schedule.",
  },
  {
    q: "What does a balloon payment do?",
    a: "A balloon (or guaranteed residual value) is a lump sum still owed at the end. Because part of the debt is not repaid through the regular instalments, each payment is lower, but total interest is higher because the balance stays larger for longer.",
  },
  {
    q: "Is the rate I enter an APR or an effective rate?",
    a: "Enter the nominal annual rate. The calculator divides it by the number of payments per year to get the periodic rate, and shows the effective annual rate it implies. For example, 8% with monthly payments is 0.6667% a month, which compounds to 8.30% a year.",
  },
];

export default function Page() {
  return (
    <ToolShell slug={SLUG} faqs={faqs} calculator={<LoanCalculator />}>
      <P>
        A repayment loan or lease is an <B>annuity</B>: a series of equal payments whose present value equals the amount borrowed. Each payment covers the
        interest that has built up on the outstanding balance, and the rest reduces the balance. The same mechanics drive mortgages, car finance, bank term
        loans and IFRS 16 lease liabilities, so this calculator covers all of them.
      </P>

      <H3>The payment formula</H3>
      <Formula label="Level payment (in arrears)">{`PMT = P × r ÷ [1 − (1 + r)^−n]
r = annual rate ÷ payments per year,  n = years × payments per year`}</Formula>
      <P>
        With a balloon <i>B</i> still owed at the end, only the present value of the balloon is deducted first: PMT = (P − B ÷ (1 + r)ⁿ) × r ÷ [1 − (1 + r)^−n].
        When payments are made at the start of each period (annuity due, typical of leases), the payment is the arrears figure divided by (1 + r).
      </P>

      <H3>Building each row of the schedule</H3>
      <Formula label="Each period">{`Interest   = Opening balance × r          (arrears)
Interest   = (Opening balance − Payment) × r   (in advance)
Principal  = Payment − Interest
Closing    = Opening − Principal`}</Formula>
      <P>
        Total interest is everything you pay minus the amount borrowed. It rises with the rate and the term, and falls if you pay more often or put down a
        larger deposit.
      </P>

      <Example>
        <p>
          <B>Loan in arrears:</B> 250,000 borrowed at 8% a year over 5 years, repaid monthly. r = 8% ÷ 12 = 0.6667% and n = 60.
        </p>
        <UL>
          <li>PMT = 250,000 × 0.006667 ÷ (1 − 1.006667^−60) = <B>5,069.10 a month</B>.</li>
          <li>Month 1 interest = 250,000 × 0.6667% = 1,666.67, so principal repaid = 5,069.10 − 1,666.67 = 3,402.43 and the balance falls to 246,597.57.</li>
          <li>Total repaid = 60 × 5,069.10 = 304,145.91, so <B>total interest = 54,145.91</B>.</li>
        </UL>
        <p>
          <B>Lease in advance:</B> a lease liability of 50,000 at 7% with 4 annual payments in advance. The payment is 13,795.71. Interest for year 1 is charged on
          50,000 − 13,795.71 = 36,204.29, giving 2,534.30, so the liability at the end of year 1 is 38,738.59.
        </p>
      </Example>

      <H3>Exam tips</H3>
      <UL>
        <li>In IFRS 16 questions, check whether payments are in advance or in arrears. It changes both the liability and every interest figure.</li>
        <li>Use the cumulative annuity factor from the tables (for example 3.993 for 5 years at 8%) to get the initial liability: payment × factor.</li>
        <li>Initial direct costs and lease incentives adjust the right-of-use asset, not the liability schedule.</li>
      </UL>
    </ToolShell>
  );
}
