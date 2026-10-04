import ToolShell, { toolMetadata, type Faq } from "../_components/ToolShell";
import { B, Example, Formula, H3, P, UL } from "../_components/prose";
import EoqCalculator from "./EoqCalculator";

const SLUG = "eoq-calculator";
export const metadata = toolMetadata(SLUG);

const faqs: Faq[] = [
  {
    q: "What is the EOQ formula?",
    a: "EOQ = √(2 × Co × D ÷ Ch), where Co is the cost of placing one order, D is annual demand in units, and Ch is the cost of holding one unit in inventory for a year. Make sure D and Ch cover the same period. If demand is monthly, the holding cost must be monthly too.",
  },
  {
    q: "Why are ordering cost and holding cost equal at the EOQ?",
    a: "Annual ordering cost (D/Q × Co) falls as the order size rises, while annual holding cost (Q/2 × Ch) rises. Total cost is lowest where the two curves cross, which is where they are equal. That is a quick way to check your answer in an exam.",
  },
  {
    q: "How do quantity discounts affect the EOQ?",
    a: "Calculate the EOQ, then for each discount level compare total annual cost, including the purchase cost, at the EOQ and at the minimum quantity needed for each discount. The cheaper price saves purchase cost and means fewer orders, but larger orders raise holding cost. Choose the quantity with the lowest total. If holding cost is a percentage of price, recalculate Ch at each discounted price.",
  },
  {
    q: "What costs are included in the holding cost?",
    a: "The cost of capital tied up in inventory (often the biggest part, so it is commonly quoted as a percentage of the unit price), plus storage space, insurance, handling, deterioration and obsolescence. Include only costs that vary with the amount of inventory held.",
  },
  {
    q: "What assumptions does the EOQ model make?",
    a: "Demand is known and constant, the lead time is constant, the purchase price does not change with order size (unless you model discounts), the whole order arrives at once, there are no stockouts, and ordering and holding costs are constant per order and per unit. If inventory is produced gradually rather than delivered at once, use the economic batch quantity (EBQ) instead.",
  },
  {
    q: "What is the reorder level?",
    a: "EOQ tells you how much to order. The reorder level tells you when. With certain demand it is usage per day × lead time in days. With uncertain demand, add buffer (safety) inventory: maximum usage × maximum lead time.",
  },
];

export default function Page() {
  return (
    <ToolShell slug={SLUG} faqs={faqs} calculator={<EoqCalculator />}>
      <P>
        Every inventory policy trades off two costs. Ordering in <B>small batches</B> keeps average inventory low, so holding costs are low, but means placing
        many orders, each with its own administration, delivery and inspection cost. Ordering in <B>large batches</B> means few orders but a lot of capital and
        warehouse space tied up in stock. The economic order quantity (EOQ) is the batch size that minimises the total of the two.
      </P>

      <H3>The formulas</H3>
      <Formula label="Economic order quantity">{`EOQ = √( 2 × Co × D ÷ Ch )`}</Formula>
      <Formula label="Annual costs at order size Q">{`Number of orders  = D ÷ Q
Ordering cost     = (D ÷ Q) × Co
Holding cost      = (Q ÷ 2) × Ch        (average inventory = Q ÷ 2)
Total annual cost = Purchase cost (D × price) + Ordering cost + Holding cost`}</Formula>
      <P>
        Average inventory is Q ÷ 2 because stock falls steadily from Q to zero between deliveries. If the business keeps buffer stock, add buffer × Ch to holding
        cost. The buffer does not change the EOQ itself.
      </P>

      <Example>
        <p>
          A retailer sells <B>12,000 units</B> a year. Each order costs <B>150</B> to place, units cost <B>12</B>, and holding cost is <B>20%</B> of the purchase
          price a year, so Ch = 2.40.
        </p>
        <UL>
          <li>EOQ = √(2 × 150 × 12,000 ÷ 2.40) = √1,500,000 = <B>1,225 units</B>.</li>
          <li>Orders per year = 12,000 ÷ 1,224.7 = 9.8, roughly one every 37 days.</li>
          <li>Ordering cost = 9.8 × 150 = 1,470, and holding cost = 1,224.7 ÷ 2 × 2.40 = 1,470. They are equal, as expected.</li>
          <li>Total cost including purchases = 144,000 + 1,470 + 1,470 = <B>146,939</B>.</li>
        </UL>
        <p>
          <B>With discounts:</B> the supplier offers 11.70 for orders of 2,000 or more and 11.40 for 5,000 or more. At 5,000 units: purchases 136,800 + ordering
          (2.4 × 150) 360 + holding (2,500 × 2.28) 5,700 = <B>142,860</B>. At 2,000 units the total is 143,640. Ordering 5,000 is cheapest, saving 4,079 a
          year. Switch on discounts in the calculator to reproduce this.
        </p>
      </Example>

      <H3>Where EOQ appears in exams</H3>
      <P>
        EOQ is tested in ACCA MA and FM (working capital management), ICAP CAF-5, CIMA BA2, ICAI Cost &amp; Management Accounting and US CMA Part 1. Typical
        traps include mixing monthly and annual figures, forgetting purchase cost when comparing discounts, and using the wrong holding cost after the price
        changes.
      </P>
    </ToolShell>
  );
}
