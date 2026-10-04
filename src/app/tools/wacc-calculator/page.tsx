import ToolShell, { toolMetadata, type Faq } from "../_components/ToolShell";
import { B, Example, Formula, H3, P, UL } from "../_components/prose";
import WaccCalculator from "./WaccCalculator";

const SLUG = "wacc-calculator";
export const metadata = toolMetadata(SLUG);

const faqs: Faq[] = [
  {
    q: "Why use market values rather than book values in WACC?",
    a: "WACC should reflect the return investors require today on what their claims are worth today. Book values are historical and often far from current values, especially for equity. Use book values only when market values are not available, and say so in your answer.",
  },
  {
    q: "Why is the cost of debt multiplied by (1 − tax rate)?",
    a: "Interest is tax-deductible, so each unit of interest paid reduces the company's tax bill by the tax rate. The effective cost of debt to the company is therefore Kd × (1 − t). This tax shield is one reason debt is usually cheaper than equity. Preference dividends and ordinary dividends are paid out of post-tax profit and get no relief.",
  },
  {
    q: "How do I calculate the cost of equity with CAPM?",
    a: "Ke = Rf + β(Rm − Rf). Rf is the risk-free rate (usually a government bond yield), β measures the share's systematic risk relative to the market, and (Rm − Rf) is the equity risk premium. With Rf 4%, β 1.2 and Rm 9%, Ke = 4% + 1.2 × 5% = 10%. If the question gives the market risk premium directly, do not subtract Rf again.",
  },
  {
    q: "Can I use the dividend growth model instead of CAPM?",
    a: "Yes. Ke = D₀(1 + g) ÷ P₀ + g, using the ex-dividend share price. Work it out separately and enter it as the cost of equity. The two models often give different answers. CAPM considers only systematic risk, while the dividend growth model depends heavily on the growth estimate.",
  },
  {
    q: "When is it wrong to use WACC as the discount rate?",
    a: "WACC is only appropriate when a new project has the same business risk as the company's existing operations and is financed without materially changing gearing. For a project in a different industry, or one that changes the capital structure significantly, use a risk-adjusted rate (for example, a project-specific beta found by ungearing and regearing a proxy company's beta) or the APV method.",
  },
  {
    q: "What is the yield to maturity of debt?",
    a: "For redeemable debt, Kd is the IRR of the investor's cash flows: pay today's market price, receive interest each year and the redemption amount at the end. For the company's cost, use after-tax interest in that IRR. For irredeemable debt, Kd = interest × (1 − t) ÷ market value.",
  },
];

export default function Page() {
  return (
    <ToolShell slug={SLUG} faqs={faqs} calculator={<WaccCalculator />}>
      <P>
        The weighted average cost of capital (WACC) is the average return a company must pay its providers of finance, with each source weighted by its share of
        total market value. It is the <B>hurdle rate</B> for investment appraisal. A project with the same risk as the existing business adds value only if it
        earns more than WACC, which is why WACC is the discount rate in the NPV of a typical project.
      </P>

      <H3>The formula</H3>
      <Formula label="WACC">{`WACC = (E ÷ V) × Ke + (D ÷ V) × Kd × (1 − t) [+ (P ÷ V) × Kp]
V = E + D [+ P]`}</Formula>
      <P>
        E, D and P are the <i>market</i> values of equity, debt and preference shares. Ke is the cost of equity, Kd the pre-tax cost of debt, Kp the cost of
        preference shares and t the corporate tax rate. Debt is cheaper for two reasons: lenders take less risk than shareholders, and interest attracts tax
        relief.
      </P>

      <H3>Cost of equity using CAPM</H3>
      <Formula label="Capital asset pricing model">{`Ke = Rf + β × (Rm − Rf)`}</Formula>
      <P>
        Switch on CAPM in the calculator to derive Ke from the risk-free rate, the equity beta and the expected market return. The beta must be the{" "}
        <i>equity</i> (geared) beta for the company&apos;s current capital structure.
      </P>

      <Example>
        <p>
          A company&apos;s shares are worth <B>6,000,000</B> and its loan notes <B>4,000,000</B> at market value. The cost of equity is 12%, the pre-tax cost of debt is 8%
          and tax is 30%.
        </p>
        <UL>
          <li>V = 6,000,000 + 4,000,000 = 10,000,000, so the weights are 60% equity and 40% debt.</li>
          <li>After-tax cost of debt = 8% × (1 − 0.30) = 5.6%.</li>
          <li>WACC = 0.60 × 12% + 0.40 × 5.6% = 7.20% + 2.24% = <B>9.44%</B>.</li>
        </UL>
        <p>
          Using CAPM instead, with Rf 4%, β 1.2 and Rm 9%: Ke = 4% + 1.2 × (9% − 4%) = 10%, giving WACC = 0.60 × 10% + 0.40 × 5.6% = <B>8.24%</B>.
        </p>
      </Example>

      <H3>Common exam errors</H3>
      <UL>
        <li>Using nominal (book) values of loan notes rather than market values.</li>
        <li>Forgetting the tax shield on debt, or applying it to preference shares.</li>
        <li>Using a cum-dividend share price. Remove the imminent dividend first.</li>
        <li>Using WACC to appraise a project whose risk differs from the company&apos;s existing business.</li>
      </UL>
    </ToolShell>
  );
}
