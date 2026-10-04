import ToolShell, { toolMetadata, type Faq } from "../_components/ToolShell";
import { B, Example, Formula, H3, P, UL } from "../_components/prose";
import NpvIrrCalculator from "./NpvIrrCalculator";

const SLUG = "npv-irr-calculator";
export const metadata = toolMetadata(SLUG);

const faqs: Faq[] = [
  {
    q: "What is a good NPV?",
    a: "Any positive NPV means the project earns more than the cost of capital and adds that amount to shareholder wealth in today's money. Zero means it earns exactly the required return. Negative means it destroys value. Between mutually exclusive projects, choose the one with the highest positive NPV.",
  },
  {
    q: "How is IRR calculated?",
    a: "IRR is the discount rate at which NPV equals zero. There is no algebraic formula for more than a couple of periods, so it is found by trial and error. Exams use linear interpolation between two rates: IRR ≈ a + NPVa ÷ (NPVa − NPVb) × (b − a). This calculator solves it numerically to many decimal places by scanning for where NPV changes sign and narrowing in by bisection.",
  },
  {
    q: "Why does the calculator say there is no IRR?",
    a: "An IRR only exists if NPV crosses zero. If every cash flow is negative (or every one positive), NPV never reaches zero at any rate. Some non-conventional patterns, such as −100, +300, −300, also stay negative at every rate even though the signs change. In those cases rely on NPV.",
  },
  {
    q: "Why are there two IRRs?",
    a: "Each time the cash flows change sign there can be another IRR (Descartes' rule of signs). A project with a large closing outflow, such as decommissioning or environmental clean-up, often has two. With multiple IRRs the accept/reject rule breaks down, so use NPV, or MIRR, which always gives a single answer.",
  },
  {
    q: "NPV and IRR give different rankings. Which should I trust?",
    a: "NPV. IRR assumes cash flows are reinvested at the IRR itself and ignores the scale of the project, so a small project can show a higher IRR yet add less value. When mutually exclusive projects conflict, the project with the higher NPV at the company's cost of capital maximises shareholder wealth.",
  },
  {
    q: "Are cash flows assumed to occur at the end of each year?",
    a: "Yes. Year 0 is today (undiscounted) and every later flow is discounted as if received at the end of that year, which is the standard exam convention. For a flow arising at the start of year 2, enter it in year 1.",
  },
];

export default function Page() {
  return (
    <ToolShell slug={SLUG} faqs={faqs} calculator={<NpvIrrCalculator />}>
      <P>
        Net present value (NPV) and internal rate of return (IRR) are the two core discounted cash flow (DCF) techniques in capital budgeting. Both recognise that
        money received later is worth less than money today, because today&apos;s cash could be invested to earn a return. NPV answers <i>how much value</i> a
        project adds. IRR answers <i>what return</i> it earns.
      </P>

      <H3>Net present value</H3>
      <P>
        Each cash flow is multiplied by a discount factor for its year, and the results are added up. Year 0 (the initial investment) has a factor of 1. If NPV is
        positive at the company&apos;s cost of capital, the project should be accepted.
      </P>
      <Formula label="NPV">{`NPV = Σ CFₜ ÷ (1 + r)ᵗ   for t = 0 … n
Discount factor = 1 ÷ (1 + r)ᵗ`}</Formula>

      <H3>Internal rate of return</H3>
      <P>
        IRR is the rate that makes NPV exactly zero. Accept a conventional project (outflow first, then inflows) when IRR exceeds the cost of capital. The
        calculator scans rates from −99% upwards, finds every point where NPV changes sign, and refines each root by bisection, so it also detects{" "}
        <B>multiple IRRs</B> and cases with <B>no IRR</B> instead of returning a misleading number.
      </P>
      <Formula label="IRR (exam interpolation)">{`NPV(IRR) = 0
IRR ≈ a + [NPVa ÷ (NPVa − NPVb)] × (b − a)`}</Formula>

      <H3>MIRR, profitability index and payback</H3>
      <UL>
        <li><B>MIRR</B> assumes inflows are reinvested at the cost of capital rather than at the IRR: (FV of inflows ÷ PV of outflows)^(1/n) − 1.</li>
        <li><B>Profitability index</B> = PV of future cash flows ÷ initial investment. Use it to rank projects when capital is rationed. Above 1 means a positive NPV.</li>
        <li><B>Payback</B> counts how long it takes to recover the outlay, assuming cash arrives evenly through each year. <B>Discounted payback</B> does the same with present values.</li>
      </UL>

      <Example>
        <p>
          A project costs <B>100,000</B> and returns 30,000, 40,000, 50,000 and 20,000 over four years. The cost of capital is <B>10%</B>.
        </p>
        <UL>
          <li>Discount factors at 10%: 0.9091, 0.8264, 0.7513, 0.6830.</li>
          <li>Present values: 27,273 + 33,058 + 37,566 + 13,660 = 111,557.</li>
          <li><B>NPV = 111,557 − 100,000 = +11,557</B>, so accept.</li>
          <li>At 15% NPV is +644, and at 20% it is negative, so IRR lies just above 15%. Solved exactly, <B>IRR = 15.32%</B>, comfortably above 10%.</li>
          <li>Payback: 30,000 + 40,000 = 70,000 after two years, and the remaining 30,000 comes from year 3&apos;s 50,000, giving 2 + 30/50 = <B>2.6 years</B>.</li>
        </UL>
        <p>Load the &ldquo;Multiple IRRs&rdquo; example above (−100, +230, −132) to see a project with IRRs of both 10% and 20%.</p>
      </Example>
    </ToolShell>
  );
}
