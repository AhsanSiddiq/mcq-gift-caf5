import type { Paper } from "../pastPapers";

/*
 * ICAP CAF-1 Financial Accounting and Reporting (Education Scheme 2025).
 * Indexed from the official question papers and examiners' comments for
 * Spring 2026 and Autumn 2026 (read in full). Descriptions, approaches and
 * worked examples are our own; no ICAP text, figures or answers are reproduced.
 */

const M = "/caf/caf-1/mcqs";
const QP = "https://icap.org.pk/view/?add=per/students/exam/caf/question-papers/CAF-1/2026/&file=";
const EC = "https://icap.org.pk/view/?add=per/students/exam/caf/examiner-comments/CAF-1/2026/&file=";
const SA = "https://student.icap.org.pk/education-scheme-2025/suggested-answer/caf/caf-1/";
const LOGIN = "Suggested answers and marking plans sit in ICAP's student area (CRN login required).";

export const icapCaf1: Paper = {
  slug: "icap-caf-1",
  body: "icap",
  level: "CAF",
  code: "CAF-1",
  title: "Financial Accounting and Reporting",
  scheme: "Education Scheme 2025",
  officialUrl: "https://icap.org.pk/past-papers/caf/caf-1/",
  syllabusUrl: "https://student.icap.org.pk/viewfile/?add=students/scheme2025/caf/&file=CAF-Syllabus.pdf",
  format: "Written exam · 100 marks · 3 hours 15 minutes (incl. 15 minutes reading) · Section A short questions + Section B long questions",
  mcqHub: M,
  keywords: ["ICAP CAF-1 past papers", "CAF-1 FAR past papers", "CAF 1 past papers with solutions", "CAF-1 topical past papers", "FAR past papers ICAP", "CAF-1 examiners comments"],
  overview: [
    "CAF-1 Financial Accounting and Reporting replaced FAR-1 under ICAP's 2025 Education Scheme. Both 2026 papers followed the same shape: nine compulsory questions, a 10-mark MCQ block, five short Section A questions of 6 to 10 marks, then three long Section B questions worth 15 to 20 marks each.",
    "The long questions are where the paper is won or lost. In both sittings the 20-mark 'prepare the statements from a trial balance' question had the lowest pass rate in the paper (9% and 12%), so practising complete, balanced statements with referenced workings is the single best use of revision time.",
  ],
  grid: [
    { id: "A", label: "Preparation of statements of financial position and profit or loss", min: 30, max: 40 },
    { id: "B", label: "Statements of changes in equity and cash flows (incl. IAS 8, ratios)", min: 30, max: 40 },
    { id: "C", label: "Accounting for non-current assets", min: 25, max: 35 },
  ],
  notes: [
    "IAS 38 Intangible Assets carried 15 marks in Spring 2026 (Q7). The Spring 2027 CAF syllabus lists IAS 38 under CAF-6 and not in CAF-1's examinable knowledge reference, so check the current syllabus before revising it for CAF-1.",
    "Only two sittings exist under the 2025 scheme so far. Older FAR-1 papers (2019–2025) are on ICAP's legacy past-papers page but cover a different syllabus, so they are not mixed into this index.",
  ],
  resources: [
    { label: "CAF syllabus (Spring 2027)", url: "https://student.icap.org.pk/viewfile/?add=students/scheme2025/caf/&file=CAF-Syllabus.pdf" },
    { label: "CAF-1 examiners' comments (all sittings)", url: "https://icap.org.pk/students/education-and-training/education-scheme-2025/examiner-comments/caf/caf-1/" },
    { label: "CAF-1 suggested answers", url: SA, note: "ICAP student login required" },
    { label: "Legacy FAR-1 past papers (2021 scheme)", url: "https://icap.org.pk/past-examination-papers/caf/caf-1/" },
  ],
  areas: [
    { id: "fs-prep", label: "Preparing the SOFP and SOPL (IAS 1)", grid: "A", mcq: `${M}/chapter-11-ias-1-presentation-of-financial-statements`, standard: "ias-1-presentation-of-financial-statements" },
    { id: "ppe", label: "Property, plant and equipment (IAS 16)", grid: "C", mcq: `${M}/chapter-3-ias-16-property-plant-and-equipment`, standard: "ias-16-property-plant-and-equipment" },
    { id: "cashflow", label: "Statement of cash flows (IAS 7)", grid: "B", mcq: `${M}/chapter-14-ias-7-statement-of-cash-flows`, standard: "ias-7-statement-of-cash-flows" },
    { id: "soce", label: "Equity transactions and SOCE", grid: "B", mcq: `${M}/chapter-8-statement-of-changes-in-equity` },
    { id: "borrowing", label: "Borrowing costs (IAS 23)", grid: "C", mcq: `${M}/chapter-2-ias-23-borrowing-costs`, standard: "ias-23-borrowing-costs" },
    { id: "framework", label: "Conceptual and regulatory framework", grid: "A", mcq: `${M}/chapter-9-conceptual-and-regulatory-framework` },
    { id: "intangibles", label: "Intangible assets (IAS 38)", grid: "C", mcq: `${M}/chapter-6-ias-38-intangible-assets`, standard: "ias-38-intangible-assets" },
    { id: "npo", label: "Not-for-profit organisations (ASNPO)", grid: "A", mcq: `${M}/chapter-13-accounting-for-npos` },
    { id: "ip", label: "Investment property (IAS 40)", grid: "C", mcq: `${M}/chapter-4-ias-40-investment-property`, standard: "ias-40-investment-property" },
    { id: "impairment", label: "Impairment of assets (IAS 36)", grid: "C", mcq: `${M}/chapter-5-ias-36-impairment-of-assets`, standard: "ias-36-impairment-of-assets" },
    { id: "grants", label: "Government grants (IAS 20)", grid: "C", mcq: `${M}/chapter-1-ias-20-government-assistance-and-grants`, standard: "ias-20-government-grants" },
    { id: "ias8", label: "Policies, estimates and errors (IAS 8)", grid: "B", mcq: `${M}/chapter-10-ias-8-accounting-policies-estimates-and-errors`, standard: "ias-8-accounting-policies-changes-in-accounting-estimates-and-errors" },
    { id: "ratios", label: "Ratio analysis and working capital", grid: "B" },
    { id: "agriculture", label: "Agriculture (IAS 41)", grid: "C", mcq: `${M}/chapter-7-ias-41-agriculture`, standard: "ias-41-agriculture" },
    { id: "incomplete", label: "Incomplete records", grid: "A", mcq: `${M}/chapter-12-incomplete-records` },
  ],
  sittings: [
    {
      slug: "spring-2026",
      name: "Spring 2026",
      date: "2026-03-02",
      paperUrl: `${QP}CAF-1-FAR-Spring-2026.pdf`,
      commentsUrl: `${EC}CAF-1-Spring-2026.pdf`,
      answersUrl: SA,
      answersNote: LOGIN,
      passRate: 32,
      themes: [
        "The 20-mark financial statements question (Q8) sank the result: only 9% passed it, and many scripts showed adjustments on one side of the double entry only.",
        "Candidates did well on short computational questions that resembled past papers but struggled where the testing angle was new.",
        "Missing workings and poor time allocation cost partial marks, especially in the long questions attempted last.",
        "Not-for-profit accounting and the IAS 7 discussion question both saw over a third of candidates score zero.",
      ],
      questions: [
        {
          n: 1, format: "MCQ", page: 1, commentsPage: 1, passRate: 72,
          summary: "Ten one-mark MCQs: capital maintenance and measurement bases, incomplete-records profit and inventory loss, depreciation changes and components, grant repayment, bearer plants, redeemable preference shares and profit vs cash.",
          parts: [
            { area: "framework", marks: 1, label: "(i)" }, { area: "framework", marks: 1, label: "(ii)" },
            { area: "incomplete", marks: 1, label: "(iii)" }, { area: "incomplete", marks: 1, label: "(iv)" },
            { area: "ppe", marks: 1, label: "(v)" }, { area: "ppe", marks: 1, label: "(vi)" },
            { area: "grants", marks: 1, label: "(vii)" }, { area: "agriculture", marks: 1, label: "(viii)" },
            { area: "soce", marks: 1, label: "(ix)" }, { area: "cashflow", marks: 1, label: "(x)" },
          ],
          walkthrough: {
            approach: [
              "Do the MCQ block first but cap it at about 18 minutes (10 marks of a 180-minute paper).",
              "For calculation items, work the number on the rough page before looking at the options; distractors are built from the usual slips.",
              "For theory items, translate each option into 'which standard and which paragraph idea' and eliminate the ones that belong to another standard.",
              "Mark answers on the first page of the script as instructed; an unmarked MCQ scores nothing.",
            ],
            rules: [
              "Net assets method: profit = closing net assets − opening net assets + drawings − capital introduced.",
              "A revised residual value or useful life is a change in estimate: spread the remaining depreciable amount over the remaining life.",
              "Significant components with different lives are depreciated separately (IAS 16 component approach).",
              "Repayment of a government grant is a change in accounting estimate under IAS 20, applied prospectively.",
              "Bearer plants are IAS 16 assets; produce growing on them stays in IAS 41.",
              "A preference share the issuer must redeem is a financial liability under IAS 32, whatever its legal name.",
            ],
            mistakes: [
              "Mixing up which capital-introduced and drawings adjustments add and which subtract in the net assets method.",
              "Recalculating depreciation from the original cost after a change in estimate instead of from the carrying amount.",
              "Treating every 'share' as equity. Look at whether the issuer can avoid paying cash.",
            ],
            example: {
              title: "Profit from incomplete records",
              scenario: [
                "A sole trader kept no ledger. At 1 January 2025 assets were Rs 650,000 and liabilities Rs 150,000. At 31 December 2025 assets were Rs 820,000 and liabilities Rs 190,000.",
                "During the year the owner withdrew Rs 90,000 and introduced Rs 40,000 of new capital.",
              ],
              required: "Calculate profit for 2025.",
              solution: [
                { table: { head: ["Working", "Rs"], rows: [["Closing net assets (820,000 − 190,000)", "630,000"], ["Less opening net assets (650,000 − 150,000)", "(500,000)"], ["Increase in net assets", "130,000"], ["Add back drawings", "90,000"], ["Less capital introduced", "(40,000)"], ["Profit for the year", "180,000"]] } },
              ],
              answer: "Profit = Rs 180,000.",
            },
          },
        },
        {
          n: 2, format: "Numerical", page: 2, commentsPage: 1, passRate: 50,
          summary: "Journal entries for property moving between owner-occupation and investment property under the fair value model, including a multi-unit property and a land/building split.",
          parts: [{ area: "ip", marks: 10 }], alsoTests: ["ppe"],
          walkthrough: {
            approach: [
              "Draw a timeline for each property: date acquired, each change in use, the year-end. Mark which standard governs each stretch.",
              "Under IAS 16 (owner-occupied), charge depreciation right up to the transfer date before doing anything else.",
              "At the transfer to investment property (fair value model), restate to fair value and treat the difference as an IAS 16 revaluation.",
              "After the transfer, stop depreciating. Fair value changes go to profit or loss.",
              "For a property split into separately lettable units, account for each unit on its own; split owner-occupied units into land and building.",
              "If an investment property comes back into own use, its fair value at that date becomes deemed cost for IAS 16.",
            ],
            rules: [
              "IAS 40: transfers happen only when there is evidence of a change in use; intention alone is not enough.",
              "Owner-occupied → investment property at fair value: any increase up to that date is a revaluation surplus (OCI), any decrease goes to profit or loss unless reversing an earlier surplus.",
              "Investment property at fair value → owner-occupied: fair value at the date of change is the deemed cost; depreciate over the remaining life.",
              "Portions that could be sold or leased separately are accounted for separately.",
              "Land is not depreciated.",
            ],
            layout: { head: ["Date", "Debit", "Credit", "Rs m"], rows: [["Up to change of use", "Depreciation expense", "Accumulated depreciation", "…"], ["Change of use", "Accumulated depreciation", "Property, plant and equipment", "…"], ["Change of use", "Investment property (fair value)", "PPE / revaluation surplus (OCI)", "…"], ["Year-end", "Fair value loss (P&L)", "Investment property", "…"]] },
            mistakes: [
              "Skipping depreciation for the months before the transfer (the examiners flagged this).",
              "Sending a fall in fair value after the transfer to revaluation surplus instead of profit or loss, or continuing to depreciate the investment property.",
              "Depreciating land, or using the full original life for a unit brought into own use part-way through.",
            ],
            example: {
              title: "Building leased out, unit brought back into use",
              scenario: [
                "Saman Ltd bought an office building on 1 January 2021 for Rs 600m, depreciated straight-line over 20 years with nil residual value (cost model). On 1 October 2025 it was let to a third party; fair value that day was Rs 540m and at 31 December 2025 Rs 520m. Saman uses the fair value model for investment property.",
                "Separately, a shop unit held as investment property (fair value Rs 290m at 1 January 2025) was taken into Saman's own use on 1 July 2025 when its fair value was Rs 300m. 30% of value is land; the building has 25 years of life left.",
              ],
              required: "Give the 2025 journal entries for both properties.",
              solution: [
                { text: "Office building: depreciation to 30 September 2025 = 600 ÷ 20 × 9/12 = Rs 22.5m. Accumulated depreciation at transfer = 600 ÷ 20 × 4.75 years = Rs 142.5m, so carrying amount = Rs 457.5m." },
                { table: { head: ["Entry", "Dr", "Cr", "Rs m"], rows: [["Depreciation Jan–Sep", "Depreciation expense", "Accumulated depreciation", "22.5"], ["Remove asset at transfer", "Accumulated depreciation", "PPE – building", "142.5"], ["Recognise investment property", "Investment property", "PPE – building", "457.5"], ["Uplift to fair value (IAS 16 revaluation)", "Investment property", "Revaluation surplus (OCI)", "82.5"], ["Year-end fall 540 → 520", "Fair value loss (P&L)", "Investment property", "20.0"]] } },
                { text: "Shop unit: fair value gain up to the date of change goes to profit or loss (300 − 290 = Rs 10m). Deemed cost Rs 300m: land Rs 90m, building Rs 210m. Depreciation 1 July–31 December = 210 ÷ 25 × 6/12 = Rs 4.2m." },
                { table: { head: ["Entry", "Dr", "Cr", "Rs m"], rows: [["Gain to 1 July", "Investment property", "Fair value gain (P&L)", "10.0"], ["Transfer at deemed cost", "PPE – land 90 / building 210", "Investment property", "300.0"], ["Depreciation Jul–Dec", "Depreciation expense", "Accumulated depreciation", "4.2"]] } },
              ],
              answer: "Office: depreciation Rs 22.5m, surplus Rs 82.5m in OCI, fair value loss Rs 20m in P&L. Shop: gain Rs 10m in P&L, then depreciation Rs 4.2m on the Rs 210m building.",
            },
          },
        },
        {
          n: 3, format: "Numerical", page: 3, commentsPage: 2, passRate: 77,
          summary: "Second impairment test on a plant previously written down: value in use from declining inflows and rising costs, fair value less costs of disposal, and the resulting loss.",
          parts: [{ area: "impairment", marks: 8 }],
          walkthrough: {
            approach: [
              "Roll the carrying amount forward: cost, depreciation to the first impairment, the impairment, then revised depreciation on the reduced amount over the remaining life.",
              "Value in use: list only operating inflows and outflows for the remaining life, add the end-of-life disposal proceeds, and discount at the pre-tax rate.",
              "Fair value less costs of disposal: take the price and deduct only incremental disposal costs (fees, transfer taxes). Ignore reorganisation or under-utilisation losses.",
              "Recoverable amount is the higher of the two; the loss is carrying amount minus recoverable amount (never negative).",
            ],
            rules: [
              "IAS 36: recoverable amount = higher of fair value less costs of disposal and value in use.",
              "Value-in-use cash flows exclude financing (loan repayments, interest) and income tax, and use a pre-tax discount rate.",
              "Cash flows cover the asset's remaining useful life in its current condition.",
              "After an impairment, future depreciation is based on the reduced carrying amount.",
            ],
            mistakes: [
              "Continuing to depreciate on original cost after the first impairment.",
              "Putting loan repayments or interest into value in use, or using the post-tax rate (both flagged by the examiners).",
              "Projecting more years than the asset has left.",
            ],
            example: {
              title: "Second impairment test",
              scenario: [
                "A machine cost Rs 900m on 1 January 2022: 6-year life, residual value Rs 60m, straight-line. At 31 December 2023 it was impaired by Rs 50m (life and residual unchanged).",
                "At 31 December 2025 it is tested again. Remaining life 2 years. Net operating cash flows: 2026 inflows Rs 200m, outflows Rs 90m; 2027 inflows Rs 190m, outflows Rs 99m; disposal proceeds at end-2027 Rs 60m. A loan instalment of Rs 150m falls due in 2027. Pre-tax rate 10%, post-tax 7%.",
                "A buyer offers Rs 240m now; legal fees would be Rs 5m and transfer tax Rs 3m. Reorganising the line after a sale would cost Rs 12m.",
              ],
              required: "Calculate the impairment loss at 31 December 2025.",
              solution: [
                { table: { head: ["Carrying amount", "Rs m"], rows: [["Cost", "900.0"], ["Depreciation 2022–2023: (900 − 60) ÷ 6 × 2", "(280.0)"], ["Impairment 2023", "(50.0)"], ["Carrying amount 31 Dec 2023", "570.0"], ["Depreciation 2024–2025: (570 − 60) ÷ 4 × 2", "(255.0)"], ["Carrying amount 31 Dec 2025", "315.0"]] } },
                { table: { head: ["Value in use (10%)", "Cash flow", "Factor", "PV"], rows: [["2026: 200 − 90", "110.0", "0.9091", "100.0"], ["2027: 190 − 99 + 60", "151.0", "0.8264", "124.8"], ["Value in use", "", "", "224.8"]] } },
                { text: "The loan instalment is financing and is excluded. Fair value less costs of disposal = 240 − 5 − 3 = Rs 232m (the Rs 12m reorganisation cost is not a cost of disposal)." },
              ],
              answer: "Recoverable amount = Rs 232m (higher than VIU of Rs 224.8m). Impairment loss = 315 − 232 = Rs 83m.",
            },
          },
        },
        {
          n: 4, format: "Numerical", page: 4, commentsPage: 2, passRate: 31,
          summary: "Borrowing costs on a warehouse funded in a set order (specific loan, investments, running finance), with surplus fund income, a government grant and a suspension of work.",
          parts: [{ area: "borrowing", marks: 8 }], alsoTests: ["grants"],
          walkthrough: {
            approach: [
              "Build a funding table: each payment date, amount, and which source paid for it, following the order the question gives.",
              "Specific loan: interest for the capitalisation period less income earned on funds not yet spent.",
              "Own funds (e.g. investments drawn down) carry no borrowing cost; they only push general borrowing later.",
              "General or running-finance funding: amount × rate × months used, stopping during any suspension and at completion.",
              "Reduce the general borrowing balance from the date any grant or other receipt was used to repay it.",
            ],
            rules: [
              "IAS 23: capitalise borrowing costs directly attributable to a qualifying asset from the date expenditure, borrowing costs and activities have all started.",
              "Deduct investment income earned on temporarily surplus specific funds.",
              "Suspend capitalisation during extended periods when active development stops (a management decision to pause, for example).",
              "Stop capitalising when substantially all activities to get the asset ready are complete.",
            ],
            mistakes: [
              "Ignoring the drawdown of the company's own investments, which overstates the general borrowing used (examiners' point).",
              "Forgetting that a grant used to repay the running finance reduces the balance from that date.",
              "Capitalising interest during the paused period.",
            ],
            example: {
              title: "Order of funding with a suspension",
              scenario: [
                "Work on a qualifying plant ran from 1 January to 31 December 2025, except for August 2025 when management paused it to redesign the layout. Payments: 1 March Rs 400m, 1 July Rs 500m, 1 November Rs 300m.",
                "Funding order: a specific loan of Rs 600m at 12% drawn on 1 March (surplus kept on deposit at 8%), then a running finance facility at 15%.",
              ],
              required: "Calculate borrowing costs to capitalise for 2025.",
              solution: [
                { text: "Capitalisation runs 1 March to 31 December, excluding August: 9 months for the specific loan." },
                { table: { head: ["Working", "Rs m"], rows: [["Specific loan: 600 × 12% × 9/12", "54.00"], ["Less deposit income: surplus 200 × 8% × 4/12 (Mar–Jun)", "(5.33)"], ["Running finance on 1 July payment: 300 × 15% × 5/12 (Jul, Sep–Dec)", "18.75"], ["Running finance on 1 Nov payment: 300 × 15% × 2/12", "7.50"], ["Borrowing costs capitalised", "74.92"]] } },
                { text: "The 1 July payment of Rs 500m used the remaining Rs 200m of the specific loan and Rs 300m of running finance." },
              ],
              answer: "Capitalise Rs 74.92m.",
            },
          },
        },
        {
          n: 5, format: "Written", page: 4, commentsPage: 2, passRate: 29,
          summary: "Discussion of four NPO transactions under ICAP's ASNPO using the deferral method: an endowment with partly restricted income, a capital contribution, a debt-repayment contribution and donated supplies.",
          parts: [{ area: "npo", marks: 8 }],
          walkthrough: {
            approach: [
              "Classify each receipt: unrestricted, externally restricted for future expenses, restricted for capital assets, or endowment.",
              "Apply the deferral method rule for that class, then say where it appears (revenue, deferred contributions, or directly in net assets).",
              "For restricted capital contributions, explain the subsequent release in line with depreciation.",
              "Give a reason for every treatment; 'discuss' means a conclusion plus the rule that drives it.",
            ],
            rules: [
              "Unrestricted contributions: revenue when received or receivable.",
              "Restricted contributions for future-period expenses: deferred and recognised as revenue when the related expenses are incurred.",
              "Restricted contributions for depreciable capital assets: deferred and recognised as revenue on the same basis as the asset's depreciation.",
              "Endowment contributions: recognised directly as increases in net assets, not revenue. Investment income the donor requires to be added to the endowment also goes directly to net assets.",
              "Contributed materials may be recognised at fair value when it can be reasonably estimated and the materials are used in normal operations and would otherwise have been bought.",
              "A contribution restricted to repaying debt follows what the debt financed: current expenses (revenue now), future expenses (deferred) or capital assets (deferred and amortised).",
            ],
            mistakes: [
              "Taking an endowment to income, or not splitting investment income between the endowment and operations (examiners' point).",
              "Deferring a capital contribution but never explaining its release to revenue.",
              "One-line answers with no reasoning.",
            ],
            example: {
              title: "Deferral method in practice",
              scenario: [
                "A charitable hospital uses ASNPO and the deferral method. During 2025: (a) it received Rs 3m restricted to buying an ambulance, bought on 1 April 2025 and depreciated over 5 years; (b) it received a Rs 10m endowment, earned Rs 0.8m on it, and the donor requires 40% of earnings to be added to the endowment; (c) a supplier donated medicines worth Rs 0.5m that the hospital would otherwise have bought; (d) it received Rs 1.2m restricted to repaying a loan that financed X-ray equipment depreciated over 6 years.",
              ],
              required: "State the 2025 accounting for each item.",
              solution: [
                { table: { head: ["Item", "Treatment", "2025 effect"], rows: [["(a) Ambulance", "Deferred capital contribution; released as depreciation is charged", "Revenue 3 × 1/5 × 9/12 = Rs 0.45m; deferred balance Rs 2.55m"], ["(b) Endowment", "Principal direct to endowment net assets", "Net assets +Rs 10m (no revenue)"], ["(b) Income", "40% restricted to endowment, 60% unrestricted", "Rs 0.32m direct to endowment; Rs 0.48m revenue"], ["(c) Medicines", "May be recognised at fair value (estimable, used in operations, would be bought)", "Revenue and expense Rs 0.5m"], ["(d) Loan repayment", "Debt financed a capital asset, so treat like a capital contribution", "Deferred; released over the X-ray equipment's depreciation pattern"]] } },
              ],
              answer: "Only Rs 0.45m (ambulance), Rs 0.48m (investment income), Rs 0.5m (medicines, if recognised) and the year's release on item (d) reach revenue. The endowment and the restricted income go straight to net assets.",
            },
          },
        },
        {
          n: 6, format: "Written", page: 5, commentsPage: 3, passRate: 20,
          summary: "Email-style reply on IAS 7: direct vs indirect method, cash flows with a classification choice, maximising operating cash flow, and consistency of the chosen policy.",
          parts: [{ area: "cashflow", marks: 6 }],
          walkthrough: {
            approach: [
              "Answer every question the email asks, in the order asked, using short headed paragraphs.",
              "Methods: explain what each method starts from and shows, not just their names.",
              "List all four items with a choice (interest paid, interest received, dividends paid, dividends received) and the allowed headings for each.",
              "For the 'maximise operating cash flow' request, pick the heading for each item that keeps outflows out of and inflows in operating activities.",
              "Close by explaining that the choice is an accounting policy that must be applied consistently.",
            ],
            rules: [
              "Direct method shows major classes of gross cash receipts and payments; indirect method starts from profit and adjusts for non-cash items and working capital. IAS 7 encourages the direct method.",
              "Interest and dividends paid: operating or financing. Interest and dividends received: operating or investing. Classify consistently from period to period.",
              "Taxes on income are operating unless specifically identified with investing or financing.",
              "Changing the classification later is a change in accounting policy under IAS 8, allowed only if it gives reliable and more relevant information.",
              "Heads-up: IFRS 18's amendments to IAS 7 (periods from 1 January 2027) remove most of these choices for entities without a specified main business activity. Check which version your sitting examines.",
            ],
            mistakes: [
              "Listing only interest and dividends paid and forgetting the receipts (examiners' point).",
              "Not answering the CEO's 'maximise' and 'year-by-year flexibility' points.",
              "Saying there are two methods without explaining the difference.",
            ],
            example: {
              title: "How classification changes operating cash flow",
              scenario: [
                "Profit before tax Rs 500m includes depreciation Rs 80m, interest expense Rs 60m, interest income Rs 20m and dividend income Rs 10m. Working capital increased by Rs 40m. Cash paid: interest Rs 55m, tax Rs 100m, dividends Rs 70m. Cash received: interest Rs 18m, dividends Rs 10m.",
              ],
              required: "Calculate net cash from operating activities under (A) the choices that maximise it and (B) the choices that minimise it.",
              solution: [
                { table: { head: ["Line", "A (Rs m)", "B (Rs m)"], rows: [["Profit before tax", "500", "500"], ["Depreciation", "80", "80"], ["Interest expense", "60", "60"], ["Interest and dividend income", "(30)", "(30)"], ["Increase in working capital", "(40)", "(40)"], ["Cash generated from operations", "570", "570"], ["Tax paid", "(100)", "(100)"], ["Interest received / dividends received", "28", "–"], ["Interest paid", "–", "(55)"], ["Dividends paid", "–", "(70)"], ["Net cash from operating activities", "498", "345"]] } },
              ],
              answer: "Operating cash flow is Rs 498m with receipts in operating and payments in financing, versus Rs 345m the other way round. The chosen policy must then be applied every year.",
            },
          },
        },
        {
          n: 7, format: "Numerical", page: 5, commentsPage: 3, passRate: 46,
          summary: "Intangible assets note covering an internally developed app (phase split and start of amortisation), ERP software costs, and a licence bought on deferred terms with a renewal option.",
          parts: [{ area: "intangibles", marks: 15 }],
          walkthrough: {
            approach: [
              "Development project: time-apportion each cost line and keep only the part incurred after all recognition criteria were met.",
              "Software bought: include the price, non-refundable taxes and directly attributable configuration; exclude hardware (IAS 16), training and post-go-live costs.",
              "Deferred payment: cost is the cash price equivalent; the difference is interest.",
              "Useful life: consider renewal options at insignificant cost and management's intention, then compare with the residual value pattern.",
              "Amortise from the date the asset is available for use, not the date it is first used.",
              "Present the note: cost and accumulated amortisation, opening, additions, amortisation, closing.",
            ],
            rules: [
              "IAS 38: research is expensed; development is capitalised only from when all six criteria are demonstrated. Costs expensed earlier cannot be reinstated.",
              "Directly attributable costs only; training, selling and general overheads are expensed.",
              "Amortisation begins when the asset is available for use.",
              "If payment is deferred beyond normal credit terms, cost is the cash price equivalent.",
              "Renewal periods count towards useful life only if renewal is supported by evidence and its cost is not significant.",
            ],
            layout: { head: ["Intangible assets note", "App", "Software", "Licence", "Total"], rows: [["Cost: additions", "", "", "", ""], ["Amortisation for the year", "", "", "", ""], ["Closing carrying amount", "", "", "", ""], ["Useful life / method", "", "", "", ""]] },
            mistakes: [
              "Capitalising design or salary costs incurred before the criteria were met (examiners' point).",
              "Starting amortisation from first use instead of availability for use.",
              "Including servers in the intangible, or treating 'perpetual' software as indefinite-life despite expected obsolescence.",
              "Ignoring a cheap renewal option when setting the licence's life.",
            ],
            example: {
              title: "Development costs and a deferred-payment licence",
              scenario: [
                "Kiran Ltd (year-end 31 December 2025) spent Rs 8m on research January–March 2025 and Rs 24m on development April–September 2025, incurred evenly. All IAS 38 criteria were met on 1 June 2025. Staff training cost Rs 2m. The software was available for use on 1 October 2025 (life 4 years) but used from 1 November 2025.",
                "On 1 January 2025 Kiran bought a 5-year licence: Rs 30m paid immediately and Rs 40m due on 31 December 2026. The cash price was Rs 63m.",
              ],
              required: "Calculate the cost, amortisation and carrying amount of each intangible at 31 December 2025.",
              solution: [
                { table: { head: ["Item", "Software (Rs m)", "Licence (Rs m)"], rows: [["Cost", "24 × 4/6 = 16.0", "63.0"], ["Amortisation 2025", "16 ÷ 4 × 3/12 = 1.0", "63 ÷ 5 = 12.6"], ["Carrying amount", "15.0", "50.4"]] } },
                { text: "Research (Rs 8m), development April–May (Rs 8m) and training (Rs 2m) are expensed. The Rs 7m difference between Rs 70m paid and the Rs 63m cash price is finance cost over the credit period, not licence cost." },
              ],
              answer: "Total cost Rs 79m, amortisation Rs 13.6m, carrying amount Rs 65.4m.",
            },
          },
        },
        {
          n: 8, format: "Numerical", page: 6, commentsPage: 3, passRate: 9,
          summary: "Prepare the SOPL and OCI and the SOFP from a trial balance with adjustments for an unrecorded return, rent, deposit interest, an asset disposal, a building revaluation and doubtful debts.",
          parts: [{ area: "fs-prep", marks: 20 }], alsoTests: ["ppe"],
          walkthrough: {
            approach: [
              "Set up both statement formats first, then a numbered working for every adjustment.",
              "For each adjustment write the double entry before touching the statements, so both sides land.",
              "Cross-check: the SOFP must balance. If it doesn't, scan your workings for one-sided entries.",
              "Leave 35–40 minutes for this question; attempting it last with 15 minutes left is how most candidates failed it.",
            ],
            rules: [
              "Accruals basis: expenses belong to the period that benefits; part-paid contracts need both a prepayment and an accrual review.",
              "Interest income accrues over time; remove any receipt wrongly booked to revenue.",
              "Disposal: remove cost and accumulated depreciation; recognise proceeds receivable and the gain or loss.",
              "Revaluation increase reverses an earlier loss through profit or loss first; any excess goes to OCI.",
              "Allowance for doubtful debts: charge only the movement in the allowance.",
            ],
            layout: { head: ["Adjustment", "Dr", "Cr", "P&L effect", "SOFP effect"], rows: [["1", "", "", "", ""], ["2", "", "", "", ""], ["…", "", "", "", ""]] },
            mistakes: [
              "Adjusting profit without the matching asset, liability or equity entry (examiners' main point).",
              "Treating a rent prepayment as the whole year's expense and missing the accrued part.",
              "Not reversing deposit interest booked to sales, or missing the final months' accrued interest.",
              "Crediting the whole revaluation gain to surplus when part reverses an earlier P&L loss.",
              "Charging the full closing allowance rather than the movement.",
            ],
            example: {
              title: "Four year-end adjustments",
              scenario: [
                "Draft figures at 31 December 2025 (Rs m): (1) A rent contract for 1 October 2025–30 September 2026 costs Rs 36m a year; 30% (Rs 10.8m) was paid in advance and recorded as a prepayment, the rest is due at the end of the contract. (2) A Rs 100m deposit was placed on 1 July 2025 at 10% a year, interest paid half-yearly; nothing is recorded. (3) Land carried at Rs 180m after an earlier revaluation loss of Rs 15m charged to P&L is revalued to Rs 210m. (4) The allowance for doubtful debts is Rs 6m; receivables are Rs 200m, of which Rs 15m needs a specific Rs 3m allowance, and a 4% general allowance applies to the rest.",
              ],
              required: "Calculate the effect of each adjustment.",
              solution: [
                { table: { head: ["Adjustment", "Double entry", "P&L", "SOFP"], rows: [["(1) Rent", "Dr Rent expense 9.0 / Cr Prepayment 9.0", "Expense 36 × 3/12 = 9.0", "Prepayment 10.8 − 9.0 = 1.8"], ["(2) Interest", "Dr Interest receivable 5.0 / Cr Interest income 5.0", "Income 100 × 10% × 6/12 = 5.0", "Receivable 5.0"], ["(3) Land", "Dr Land 30 / Cr P&L 15, Cr Revaluation surplus 15", "Gain 15.0", "Land 210; surplus 15"], ["(4) Allowance", "Dr Impairment expense 4.4 / Cr Allowance 4.4", "Expense 4.4", "Allowance 3 + 4% × 185 = 10.4"]] } },
              ],
              answer: "Profit increases by 5.0 + 15.0 − 9.0 − 4.4 = Rs 6.6m; OCI Rs 15m; every entry also moves a balance sheet line.",
            },
          },
        },
        {
          n: 9, format: "Numerical", page: 7, commentsPage: 4, passRate: 22,
          summary: "SOCE with comparatives: dividends declared vs recommended, interim dividend, bonus issue from share premium, rights issue with costs, a change in depreciation method and prior-period errors.",
          parts: [{ area: "soce", marks: 15 }], alsoTests: ["ias8"],
          walkthrough: {
            approach: [
              "Sort every item into: prior-period error (restate), change in estimate (prospective), or current-year equity transaction.",
              "Work out the error effect on each year's profit and on opening retained earnings of the earliest year shown.",
              "Build the SOCE with columns for share capital, share premium and retained earnings, rows year by year, with 'as previously reported', 'restatement' and 'restated' lines.",
              "Dividends: only those declared and approved in the year; use the number of shares in issue when declared.",
              "Rights issue: shares at par to share capital, excess to premium, issue costs deducted from premium.",
            ],
            rules: [
              "IAS 8: correct material prior-period errors retrospectively by restating comparatives and opening equity.",
              "A change in depreciation method is a change in estimate: apply prospectively from the current year.",
              "An inventory overstatement at the end of year 1 overstates year 1 profit and understates year 2 profit by the same amount.",
              "IAS 10: dividends declared after the reporting date are not liabilities at that date.",
              "Transaction costs of an equity issue are deducted from equity.",
            ],
            layout: { head: ["", "Share capital", "Share premium", "Retained earnings"], rows: [["Balance 1 Jan Y1 as reported", "", "", ""], ["Restatement", "", "", ""], ["Restated balance", "", "", ""], ["Profit (restated)", "", "", ""], ["Dividends", "", "", ""], ["Balance 31 Dec Y1", "", "", ""], ["Bonus / rights / profit / dividends Y2", "", "", ""], ["Balance 31 Dec Y2", "", "", ""]] },
            mistakes: [
              "Presenting opening balances without the restatement line (examiners' point).",
              "Treating a late start of depreciation as a change in estimate (it is an error) and the method change as an error (it is an estimate).",
              "Pricing rights shares at market value, or leaving issue costs out of premium.",
              "Reversing an inventory error in the wrong year.",
            ],
            example: {
              title: "SOCE with an inventory error and share issues",
              scenario: [
                "Noor Ltd: at 1 January 2024 share capital Rs 1,000m (100m shares of Rs 10), share premium Rs 300m, retained earnings Rs 600m. 2024 profit was reported as Rs 150m, but closing inventory at 31 December 2024 was overstated by Rs 10m. A dividend of Re 1 per share for 2023 was declared in April 2024.",
                "In 2025: a 1-for-5 bonus issue from share premium in March; a 1-for-4 rights issue at Rs 12 in October with costs of Rs 3m; draft profit Rs 220m (before fixing the error); an interim dividend of Re 0.50 per share declared in December.",
              ],
              required: "Prepare the SOCE for 2025 with comparatives.",
              solution: [
                { text: "Error: 2024 profit falls by Rs 10m to Rs 140m. 2025 cost of sales used the overstated opening inventory, so 2025 profit rises by Rs 10m to Rs 230m. Shares: 100m + 20m bonus = 120m; rights 30m; 150m at the dividend date." },
                { table: { head: ["Rs m", "Share capital", "Share premium", "Retained earnings"], rows: [["1 January 2024", "1,000", "300", "600"], ["Profit 2024 (restated)", "", "", "140"], ["Final dividend 2023 (100m × Re 1)", "", "", "(100)"], ["31 December 2024 (restated)", "1,000", "300", "640"], ["Bonus issue 1:5", "200", "(200)", ""], ["Rights issue 1:4 at Rs 12", "300", "60", ""], ["Rights issue costs", "", "(3)", ""], ["Profit 2025", "", "", "230"], ["Interim dividend (150m × Re 0.50)", "", "", "(75)"], ["31 December 2025", "1,500", "157", "795"]] } },
                { text: "In the published SOCE, show the 31 December 2024 retained earnings as Rs 650m previously reported, less Rs 10m restatement." },
              ],
              answer: "Closing equity: share capital Rs 1,500m, share premium Rs 157m, retained earnings Rs 795m.",
            },
          },
        },
      ],
    },
    {
      slug: "autumn-2026",
      name: "Autumn 2026",
      date: "2026-08-17",
      paperUrl: `${QP}CAF-1-FAR-Autumn-2026.pdf`,
      commentsUrl: `${EC}CAF-1-Autumn-2026.pdf`,
      answersUrl: SA,
      answersNote: LOGIN,
      passRate: 35,
      themes: [
        "The pass rate rose again, but the trial-balance statements question (Q8) was once more the weakest, at 12%.",
        "Theory questions on measurement bases and on IAS 8 disclosures were often skipped or answered superficially; around half of candidates scored nothing on measurement bases.",
        "Final figures without workings again limited partial credit; the examiners recommend a referenced, systematic approach to adjustments.",
      ],
      questions: [
        {
          n: 1, format: "MCQ", page: 1, commentsPage: 1, passRate: 57,
          summary: "Nine MCQs (10 marks): club subscription income, preference shares in the SOCE, produce after harvest, interest cover, impairment indicators, interim dividends, the IFRS Interpretations Committee, bearer assets and gearing effects.",
          parts: [
            { area: "npo", marks: 2, label: "(i)" }, { area: "soce", marks: 1, label: "(ii)" },
            { area: "agriculture", marks: 1, label: "(iii)" }, { area: "ratios", marks: 1, label: "(iv)" },
            { area: "impairment", marks: 1, label: "(v)" }, { area: "soce", marks: 1, label: "(vi)" },
            { area: "framework", marks: 1, label: "(vii)" }, { area: "agriculture", marks: 1, label: "(viii)" },
            { area: "ratios", marks: 1, label: "(ix)" },
          ],
          walkthrough: {
            approach: [
              "Note the marks per item: one item here carried 2 marks, so give it proportionally more time.",
              "Ratio items: write the formula, then decide whether the event touches the numerator, the denominator or neither.",
              "Classification items (IAS 16 vs IAS 41, liability vs equity): apply the definition rather than the label in the question.",
            ],
            rules: [
              "Subscription income = cash received − arrears brought forward received − advance for next year + advance brought forward + arrears carried forward.",
              "Interest cover uses total interest incurred, including interest capitalised.",
              "A bonus issue moves amounts within equity; a rights issue adds cash and equity. Neither adds debt.",
              "Agricultural produce is IAS 41 up to harvest and IAS 2 afterwards; bearer plants are IAS 16; bearer animals stay in IAS 41.",
              "A dividend declared and properly authorised before the year-end is a liability at the year-end.",
            ],
            mistakes: [
              "Treating dairy cattle as bearer plants (only plants get IAS 16 treatment).",
              "Using only the expensed interest in interest cover.",
              "Saying a rights issue has no effect on gearing: equity rises, so gearing falls.",
            ],
            example: {
              title: "Club subscription income",
              scenario: [
                "A sports club had subscriptions in arrears of Rs 20,000 and received in advance of Rs 12,000 at 1 January 2025. Cash received in 2025 was Rs 500,000, including all Rs 20,000 of the opening arrears and Rs 25,000 paid in advance for 2026. Arrears at 31 December 2025 are Rs 30,000, all collectible.",
              ],
              required: "Calculate subscription income for 2025.",
              solution: [
                { table: { head: ["Working", "Rs"], rows: [["Cash received", "500,000"], ["Less opening arrears collected", "(20,000)"], ["Less received in advance for 2026", "(25,000)"], ["Add opening advance now earned", "12,000"], ["Add closing arrears", "30,000"], ["Subscription income", "497,000"]] } },
              ],
              answer: "Rs 497,000.",
            },
          },
        },
        {
          n: 2, format: "Numerical", page: 3, commentsPage: 1, passRate: 61,
          summary: "Borrowing costs on a production facility funded by a specific loan and two general loans, with a strike stoppage and a completion date before final finishing work.",
          parts: [{ area: "borrowing", marks: 7 }],
          walkthrough: {
            approach: [
              "Fix the capitalisation window: start when physical work (not just preliminary design) and borrowing are both under way; end at substantial completion.",
              "Subtract any extended stoppage from the window.",
              "Specific loan: interest for the window less temporary investment income.",
              "General borrowings: work out the weighted capitalisation rate, then apply it to the amounts not funded by the specific loan, for the months each was outstanding in the window.",
            ],
            rules: [
              "IAS 23: capitalisation rate = general borrowing costs ÷ weighted average general borrowings outstanding.",
              "Activities that start capitalisation include technical and administrative work before physical construction, such as obtaining permits.",
              "Suspend capitalisation for extended periods when active development stops.",
              "Cease when substantially all activities are complete; minor decorative work does not extend the period.",
            ],
            mistakes: [
              "Using 12, 11 or 9.5 months for the specific loan instead of the actual window (examiners' point).",
              "Capitalising up to the date decorative work finished.",
              "Applying the general rate to the whole payment instead of the part exceeding the specific loan.",
            ],
            example: {
              title: "Specific and general borrowings with a stoppage",
              scenario: [
                "Construction of a qualifying warehouse started on 1 March 2025; work stopped for all of July 2025 because of a strike. The warehouse was substantially complete on 31 October 2025; painting continued until 30 November 2025.",
                "Payments: 1 March Rs 200m, 1 June Rs 300m, 1 September Rs 250m. A specific loan of Rs 300m at 9% was drawn on 1 March; unused specific funds earned Rs 3m. General borrowings outstanding all year: Rs 400m at 8% and Rs 600m at 11%.",
              ],
              required: "Calculate borrowing costs to capitalise.",
              solution: [
                { text: "Window: 1 March–31 October less July = 7 months. Capitalisation rate = (32 + 66) ÷ 1,000 = 9.8%." },
                { table: { head: ["Working", "Rs m"], rows: [["Specific: 300 × 9% × 7/12", "15.75"], ["Less investment income", "(3.00)"], ["General on 1 June payment beyond specific funds: 200 × 9.8% × 4/12 (Jun, Aug–Oct)", "6.53"], ["General on 1 September payment: 250 × 9.8% × 2/12", "4.08"], ["Total capitalised", "23.37"]] } },
              ],
              answer: "Capitalise about Rs 23.37m.",
            },
          },
        },
        {
          n: 3, format: "Numerical", page: 3, commentsPage: 2, passRate: 77,
          summary: "Three years of journal entries for a plant bought with a deferred-income grant: availability-for-use date, a later component that extends life, and partial repayment of the grant.",
          parts: [{ area: "grants", marks: 8 }], alsoTests: ["ppe"],
          walkthrough: {
            approach: [
              "Start depreciation and grant release on the date the asset is available for use.",
              "When a component is added, add its cost to the carrying amount and spread the new total over the revised remaining life.",
              "Release the deferred grant over the same pattern; a change in life changes the release too.",
              "On repayment, debit the unamortised deferred income first; any excess goes to profit or loss.",
            ],
            rules: [
              "IAS 20: grants related to assets are presented as deferred income (or deducted from the asset) and released over the asset's life.",
              "Repayment of an asset-related grant reduces the deferred income balance; a shortfall is expensed immediately.",
              "IAS 16: depreciation begins when the asset is available for use, which may be after installation if regulatory approval is needed.",
              "Changes in useful life and grant repayments are changes in estimate, applied prospectively.",
            ],
            mistakes: [
              "Starting depreciation at purchase or at installation instead of availability for use (examiners' point).",
              "Changing the depreciation life but leaving the grant release on the old life.",
              "Charging the grant repayment straight to profit or loss.",
            ],
            example: {
              title: "Grant repayment on an asset-related grant",
              scenario: [
                "A machine costing Rs 300m was bought on 1 January 2024 and was available for use on 1 March 2024. Life 5 years, residual Rs 20m. A related grant of Rs 60m is held as deferred income. In January 2025, Rs 15m of the grant became repayable and was paid.",
              ],
              required: "Calculate depreciation and grant income for 2024 and 2025.",
              solution: [
                { table: { head: ["Working", "2024 (Rs m)", "2025 (Rs m)"], rows: [["Depreciation: (300 − 20) ÷ 5 = 56 a year", "56 × 10/12 = 46.67", "56.00"], ["Grant income: 60 ÷ 5 × 10/12", "10.00", ""], ["Deferred income after 2024", "50.00", ""], ["Repayment debited to deferred income", "", "(15.00)"], ["Remaining 35 over 50 months: 35 × 12/50", "", "8.40"]] } },
              ],
              answer: "2024: depreciation Rs 46.67m, grant income Rs 10m. 2025: depreciation Rs 56m, grant income Rs 8.4m; no P&L charge for the repayment because it was less than the deferred balance.",
            },
          },
        },
        {
          n: 4, format: "Written", page: 4, commentsPage: 2, passRate: 26,
          summary: "Explain how assets and liabilities are measured under each measurement basis in the Conceptual Framework.",
          parts: [{ area: "framework", marks: 8 }],
          walkthrough: {
            approach: [
              "Use a two-column structure: each basis, then how it measures an asset and how it measures a liability.",
              "Cover historical cost and all three current value bases: fair value, value in use / fulfilment value, and current cost.",
              "For each, say whether it is entry or exit based, whether it is entity-specific, and how transaction costs are treated.",
            ],
            rules: [
              "Historical cost (asset): cost incurred to acquire it including transaction costs, updated for consumption and impairment. (Liability): consideration received less transaction costs, updated for interest and payments.",
              "Fair value: price to sell an asset or transfer a liability in an orderly market transaction at the measurement date; market-participant view; transaction costs not deducted.",
              "Value in use (assets) and fulfilment value (liabilities): present value of entity-specific cash flows, including the present value of transaction costs expected on disposal or fulfilment.",
              "Current cost (asset): cost of an equivalent asset at the measurement date, including transaction costs at that date. (Liability): consideration that would be received for an equivalent liability, less transaction costs.",
            ],
            layout: { head: ["Basis", "Asset", "Liability"], rows: [["Historical cost", "", ""], ["Fair value", "", ""], ["Value in use / fulfilment value", "", ""], ["Current cost", "", ""]] },
            mistakes: [
              "Covering only historical cost and fair value (examiners' point).",
              "Describing assets but never liabilities.",
              "Confusing current cost (entry) with fair value (exit).",
            ],
            example: {
              title: "One machine, four measurements",
              scenario: [
                "A machine bought three years ago for Rs 100m has a depreciated historical cost of Rs 70m. A similar used machine would cost Rs 85m to buy today plus Rs 2m of delivery and installation. In an orderly sale the machine would fetch Rs 78m before Rs 1m of selling costs. The present value of the cash flows the entity expects from using and then selling it, after the present value of selling costs, is Rs 82m.",
              ],
              required: "State the machine's measurement under each basis.",
              solution: [
                { table: { head: ["Basis", "Measurement", "Why"], rows: [["Historical cost", "Rs 70m", "Original cost less depreciation"], ["Current cost", "Rs 87m", "Entry price today including transaction costs"], ["Fair value", "Rs 78m", "Exit price; selling costs not deducted"], ["Value in use", "Rs 82m", "Entity-specific PV, after PV of disposal costs"]] } },
              ],
              answer: "Rs 70m, Rs 87m, Rs 78m and Rs 82m respectively; the bases answer different questions, which is why the Framework lets standards choose.",
            },
          },
        },
        {
          n: 5, format: "Written", page: 4, commentsPage: 2, passRate: 26,
          summary: "IAS 8 disclosure notes for a change in depreciation method on a building and a change of inventory cost formula with three years of values.",
          parts: [{ area: "ias8", marks: 8 }],
          walkthrough: {
            approach: [
              "Classify each change: depreciation method = estimate; cost formula = policy.",
              "Estimate: compute the current-year effect (new charge minus old charge) and state it is applied prospectively.",
              "Policy: compute the effect on each prior year's profit and on opening retained earnings of the earliest period presented.",
              "Write the notes in disclosure form: nature, reason, line items affected, amounts for current and prior periods, and the opening equity adjustment.",
            ],
            rules: [
              "IAS 8: a change in depreciation method is a change in accounting estimate, applied prospectively; disclose nature and amount of the effect on the current period (and future periods if practicable).",
              "A voluntary change in policy is applied retrospectively; disclose nature, reasons, the adjustment for each line item and for basic/diluted EPS for current and prior periods, and the amount relating to periods before those presented.",
              "Inventory: a lower opening inventory increases that year's profit; a lower closing inventory reduces it.",
            ],
            mistakes: [
              "Answering with workings only and no disclosure note (examiners' point).",
              "Stating 'retrospective' or 'prospective' without amounts.",
              "Excluding land from the depreciable amount only in one of the two methods.",
            ],
            example: {
              title: "Estimate change and policy change together",
              scenario: [
                "A building costing Rs 400m (land Rs 100m) bought on 1 January 2023 was depreciated straight-line over 25 years, nil residual. From 2025 management switches to 8% reducing balance.",
                "The company also moves inventory from FIFO to weighted average. Closing inventory (Rs m): 2023 FIFO 200 / WA 190; 2024 FIFO 230 / WA 236; 2025 FIFO 250 / WA 245.",
              ],
              required: "Quantify the amounts the 2025 notes must disclose.",
              solution: [
                { table: { head: ["Estimate change", "Rs m"], rows: [["Building carrying amount 1 Jan 2025: 300 − 12 × 2", "276.00"], ["Reducing balance charge 2025: 276 × 8%", "22.08"], ["Straight-line charge 2025", "12.00"], ["Increase in 2025 depreciation", "10.08"]] } },
                { table: { head: ["Policy change", "2024 (Rs m)", "2025 (Rs m)"], rows: [["Opening inventory lower / (higher)", "+10", "−6"], ["Closing inventory higher / (lower)", "+6", "−5"], ["Effect on profit", "+16", "−11"]] } },
                { text: "Retained earnings at 1 January 2024 fall by Rs 10m (the 2023 closing difference)." },
              ],
              answer: "Disclose: depreciation up Rs 10.08m in 2025 (prospective); 2024 profit restated up Rs 16m, 2025 profit Rs 11m lower than under FIFO, opening 2024 retained earnings down Rs 10m.",
            },
          },
        },
        {
          n: 6, format: "Mixed", page: 4, commentsPage: 2, passRate: 43,
          summary: "Cash operating cycle from sales, mark-up and balances, then four short-term window-dressing steps that would flatter it at year-end.",
          parts: [{ area: "ratios", marks: 4, label: "(a)" }, { area: "ratios", marks: 4, label: "(b)" }],
          walkthrough: {
            approach: [
              "Derive cost of sales from sales and mark-up, and purchases from cost of sales adjusted for the inventory movement.",
              "Inventory days = inventory ÷ cost of sales × 365; receivable days = receivables ÷ credit sales × 365; payable days = payables ÷ credit purchases × 365.",
              "Cycle = inventory days + receivable days − payable days. State whether you used closing or average balances.",
              "For window-dressing, give actions possible in the last week or two: they must be temporary and quick.",
            ],
            rules: [
              "Exclude cash sales from the receivables denominator.",
              "Payables relate to purchases, not cost of sales; adjust for the change in inventory.",
              "Window dressing: delaying payments to suppliers, chasing receivables or offering early-payment discounts, deferring purchases, running down inventory before the count.",
            ],
            mistakes: [
              "Using total sales for receivable days or cost of sales for payable days (examiners' point).",
              "Suggesting long-term process improvements when the question asks for steps in the final week or two.",
            ],
            example: {
              title: "Cash operating cycle",
              scenario: [
                "Sales Rs 800m, of which 20% cash; mark-up 25% on cost. Inventory: opening Rs 80m, closing Rs 100m. Closing receivables Rs 96m, closing payables Rs 70m. All purchases are on credit.",
              ],
              required: "Calculate the cash operating cycle on closing balances.",
              solution: [
                { table: { head: ["Working", "Value"], rows: [["Cost of sales: 800 ÷ 1.25", "Rs 640m"], ["Credit sales: 800 × 80%", "Rs 640m"], ["Purchases: 640 + 100 − 80", "Rs 660m"], ["Inventory days: 100 ÷ 640 × 365", "57.0"], ["Receivable days: 96 ÷ 640 × 365", "54.8"], ["Payable days: 70 ÷ 660 × 365", "(38.7)"], ["Cash operating cycle", "73.1 days"]] } },
              ],
              answer: "About 73 days.",
            },
          },
        },
        {
          n: 7, format: "Numerical", page: 5, commentsPage: 3, passRate: 59,
          summary: "Statement of cash flows (indirect method) from two balance sheets and notes on PPE, capital work-in-progress, investment property, impairment, interest, tax and dividends.",
          parts: [{ area: "cashflow", marks: 16 }],
          walkthrough: {
            approach: [
              "Reconcile every non-current asset and liability with a T-account or movement table before starting the statement.",
              "Find the missing figure in each reconciliation (often depreciation or cash paid).",
              "Separate operating adjustments into 'adjustments for non-cash items' and 'changes in working capital'.",
              "Strip capital payables and interest payable out of the working capital lines.",
              "Classify interest and dividends exactly as the question's policy says.",
            ],
            rules: [
              "IAS 7: transfers from CWIP to PPE are not cash flows; cash paid for capital expenditure is.",
              "Gains on disposal are deducted in operating activities; proceeds go under investing.",
              "Tax paid = opening liability + expense − closing liability (adjust for deferred tax if present).",
            ],
            layout: { head: ["Statement of cash flows", "Rs m"], rows: [["Profit before tax", ""], ["Adjustments for: depreciation, impairment, gains, interest", ""], ["Changes in working capital", ""], ["Cash generated from operations", ""], ["Tax paid", ""], ["Investing activities", ""], ["Financing activities", ""], ["Net change in cash", ""]] },
            mistakes: [
              "Showing the CWIP transfer as the cash outflow (examiners' point).",
              "Leaving the capital creditor or the change in interest payable inside working capital changes.",
              "Classifying interest or dividends against the stated policy.",
            ],
            example: {
              title: "Reconciling PPE, interest and tax",
              scenario: [
                "PPE carrying amount: opening Rs 500m, closing Rs 560m. Depreciation Rs 70m. A machine with carrying amount Rs 30m was sold for Rs 40m. Capital creditors: opening Rs 15m (paid this year), closing Rs 20m. Interest expense Rs 40m; interest payable fell from Rs 8m to Rs 5m. Tax expense Rs 60m; tax payable rose from Rs 25m to Rs 30m.",
              ],
              required: "Calculate cash paid for PPE, interest paid and tax paid.",
              solution: [
                { table: { head: ["Working", "Rs m"], rows: [["Additions: 560 − 500 + 70 + 30", "160"], ["Less unpaid at year-end", "(20)"], ["Add opening creditor paid", "15"], ["Cash paid for PPE", "155"], ["Interest paid: 8 + 40 − 5", "43"], ["Tax paid: 25 + 60 − 30", "55"]] } },
                { text: "Gain on disposal Rs 10m is deducted in operating activities; proceeds Rs 40m go to investing." },
              ],
              answer: "PPE Rs 155m, interest Rs 43m, tax Rs 55m.",
            },
          },
        },
        {
          n: 8, format: "Numerical", page: 6, commentsPage: 3, passRate: 12,
          summary: "SOPL and SOFP from a trial balance with a suspense account, inventory write-down, loan interest accrual and current portion, capitalised interest, an unrecorded drop-shipment sale and depreciation allocation.",
          parts: [{ area: "fs-prep", marks: 20 }], alsoTests: ["borrowing", "ppe"],
          walkthrough: {
            approach: [
              "Clear the suspense account first: list what has been posted to it and where each item belongs.",
              "Then work down the notes in order, writing the double entry for each.",
              "Split loans into current and non-current portions; accrue any missing interest instalments.",
              "Compute depreciation after capital adjustments (e.g. installation costs moved out of expenses).",
              "Prepare both statements in full, with notes referenced to workings.",
            ],
            rules: [
              "IAS 2: write inventory down to NRV (selling price less costs to complete and sell); the write-down goes through cost of sales.",
              "IAS 23: eligible interest is capitalised into CWIP, not expensed.",
              "IAS 1: the part of a loan due within 12 months is a current liability.",
              "Directly attributable installation costs are part of PPE cost.",
            ],
            mistakes: [
              "Assuming the interest charged in the TB is the full year when one instalment is still unpaid (examiners' point).",
              "Reducing inventory for a write-down without increasing cost of sales.",
              "Not decoding the suspense account, so supplies purchased are never allocated.",
            ],
            example: {
              title: "Clearing a suspense account",
              scenario: [
                "A trial balance shows a suspense credit of Rs 52m. It holds the proceeds of a rights issue of 4m shares at Rs 15 (par Rs 10) and supplies bought for Rs 8m. Half the supplies were used by the sales team, a quarter in building a CWIP asset, and a quarter are unused. Separately, monthly loan interest of Rs 5m is paid on the first day of the following month; 11 payments (Rs 55m) were recorded. Goods costing Rs 50m can be sold for Rs 45m after Rs 7m of repairs.",
              ],
              required: "Give the entries needed.",
              solution: [
                { table: { head: ["Item", "Dr", "Cr", "Rs m"], rows: [["Rights issue", "Suspense", "Share capital 40 / Share premium 20", "60"], ["Supplies", "Distribution costs 4 / CWIP 2 / Inventory 2", "Suspense", "8"], ["Interest accrual", "Finance cost", "Accrued interest", "5"], ["NRV write-down: 50 − (45 − 7)", "Cost of sales", "Inventory", "12"]] } },
                { text: "Suspense: credit 52 + debit 60 − credit 8 = nil." },
              ],
              answer: "Suspense clears to nil; finance cost becomes Rs 60m; inventory falls by Rs 12m through cost of sales.",
            },
          },
        },
        {
          n: 9, format: "Numerical", page: 7, commentsPage: 3, passRate: 45,
          summary: "Notes on PPE and investment property: a revalued production facility with changing residual values, and a multi-unit building split between own use and letting under the fair value model.",
          parts: [{ area: "ppe", marks: 15 }], alsoTests: ["ip"],
          walkthrough: {
            approach: [
              "Revalued asset: roll forward each year (depreciation, then revaluation) using the revised residual value from the revaluation date.",
              "Split revaluation movements: increases to OCI unless they reverse a previous P&L loss; decreases against any surplus first, then P&L.",
              "Multi-unit building: allocate cost per unit, then land/building within the owner-occupied units.",
              "Write the notes with the required headings: measurement basis, useful lives, gross and net amounts, reconciliation, revaluation details.",
            ],
            rules: [
              "IAS 16: revaluations must be kept up to date; under the elimination method, accumulated depreciation is eliminated against gross carrying amount.",
              "Residual value and useful life are reviewed at least annually; changes are estimates.",
              "IAS 40: investment property at fair value is not depreciated; gains and losses go to P&L. Disclose the reconciliation of opening to closing carrying amount.",
            ],
            mistakes: [
              "Leaving out basic disclosures such as measurement basis and useful lives (examiners' point).",
              "Depreciating land within the building cost.",
              "Forgetting the investment property note altogether.",
            ],
            example: {
              title: "Revalued facility and a part-let building",
              scenario: [
                "A facility bought on 1 July 2023 for Rs 330m (15-year life, residual Rs 30m) is revalued to Rs 315m at 31 December 2024 (residual unchanged) and to Rs 260m at 31 December 2025 (residual now Rs 25m). No revaluation was needed at 31 December 2023. Surplus is not transferred to retained earnings.",
                "On 1 September 2025 the company bought four identical units for Rs 400m (25% land). Two are used as offices (building life 20 years), two are held for rent. The fair value of each rented unit rose by Rs 1.5m a month.",
              ],
              required: "Calculate the figures for the 2025 notes.",
              solution: [
                { table: { head: ["Facility", "Rs m"], rows: [["Carrying amount 31 Dec 2024 before revaluation: 330 − 20 × 1.5", "300.00"], ["Revaluation surplus 2024 (OCI)", "15.00"], ["Depreciation 2025: (315 − 30) ÷ 13.5", "21.11"], ["Carrying amount before 2025 revaluation", "293.89"], ["Decrease to 260", "33.89"], ["… against surplus (OCI)", "15.00"], ["… to P&L", "18.89"]] } },
                { table: { head: ["Units", "PPE (Rs m)", "Investment property (Rs m)"], rows: [["Cost (2 units each)", "200 (land 50, building 150)", "200"], ["Depreciation Sep–Dec: 150 ÷ 20 × 4/12", "2.5", "–"], ["Fair value gain: 1.5 × 2 units × 4 months", "–", "12"], ["31 December 2025", "197.5", "212"]] } },
              ],
              answer: "Facility: OCI −Rs 15m, P&L −Rs 18.89m, closing Rs 260m. Offices Rs 197.5m in PPE; investment property Rs 212m with a Rs 12m gain.",
            },
          },
        },
      ],
    },
  ],
};
