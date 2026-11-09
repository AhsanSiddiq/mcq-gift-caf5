import type { Paper } from "../pastPapers";

/*
 * ICAP CAF-6 Corporate Reporting (Education Scheme 2025).
 * Indexed from the official question papers and examiners' comments for
 * Spring 2026 and Autumn 2026 (read in full). All descriptions, approaches and
 * worked examples are our own; no ICAP text, figures or answers are reproduced.
 */

const M = "/caf/caf-6/mcqs";
const QP = "https://icap.org.pk/view/?add=per/students/exam/caf/question-papers/CAF-6/2026/&file=";
const EC = "https://icap.org.pk/view/?add=per/students/exam/caf/examiner-comments/CAF-6/2026/&file=";
const SA = "https://student.icap.org.pk/education-scheme-2025/suggested-answer/caf/caf-6/";
const LOGIN = "Suggested answers and marking plans sit in ICAP's student area (CRN login required).";

export const icapCaf6: Paper = {
  slug: "icap-caf-6",
  body: "icap",
  level: "CAF",
  code: "CAF-6",
  title: "Corporate Reporting",
  scheme: "Education Scheme 2025",
  officialUrl: "https://icap.org.pk/past-papers/caf/caf-6/",
  syllabusUrl: "https://student.icap.org.pk/viewfile/?add=students/scheme2025/caf/&file=CAF-Syllabus.pdf",
  format: "Written exam · 100 marks · 3 hours 15 minutes (incl. 15 minutes reading) · Section A short questions + Section B long questions",
  mcqHub: M,
  keywords: ["ICAP CAF-6 past papers", "CAF-6 corporate reporting past papers", "CAF 6 CR past papers with solutions", "CAF-6 topical past papers", "ICAP consolidation past papers", "CAF-6 examiners comments"],
  overview: [
    "CAF-6 Corporate Reporting covers group accounts, the main IFRSs on financial instruments, leases, revenue, tax and EPS, plus Companies Act schedules, ethics and IFRS S1. Both 2026 papers opened with ten one-mark MCQs mostly on segments, foreign currency, sustainability, ethics and the Companies Act, followed by five Section A questions and three long Section B questions.",
    "A consolidation question (17–19 marks) appeared in both sittings, as did leases, EPS, financial instruments with expected credit losses, provisions and events after the reporting period, and income taxes. Discussion questions are where marks leak: the examiners repeatedly ask for the IFRS principle applied to the facts, not a one-line conclusion.",
  ],
  grid: [
    { id: "A", label: "Financial statements and their analysis (groups, associates, EPS, local law)", min: 20, max: 30 },
    { id: "B", label: "Essential transactions, ethics and sustainability (tax, revenue, intangibles)", min: 35, max: 45 },
    { id: "C", label: "Other areas of IFRS (segments, leases, financial instruments, provisions, FX)", min: 30, max: 40 },
  ],
  notes: [
    "Only two sittings exist under the 2025 scheme so far, so 'every sitting' below means both 2026 papers.",
  ],
  resources: [
    { label: "CAF syllabus (Spring 2027)", url: "https://student.icap.org.pk/viewfile/?add=students/scheme2025/caf/&file=CAF-Syllabus.pdf" },
    { label: "CAF-6 examiners' comments (all sittings)", url: "https://icap.org.pk/students/education-and-training/education-scheme-2025/examiner-comments/caf/caf-6/" },
    { label: "CAF-6 suggested answers", url: SA, note: "ICAP student login required" },
  ],
  areas: [
    { id: "consolidation", label: "Consolidation (IFRS 10 / IFRS 3)", grid: "A", mcq: `${M}/chapter-9-consolidation-ifrs-10-ifrs-3`, standard: "ifrs-10-consolidated-financial-statements" },
    { id: "revenue", label: "Revenue (IFRS 15)", grid: "B", mcq: `${M}/chapter-5-ifrs-15-revenue-from-contracts-with-customers`, standard: "ifrs-15-revenue-from-contracts-with-customers" },
    { id: "tax", label: "Income taxes (IAS 12)", grid: "B", mcq: `${M}/chapter-7-ias-12-income-taxes`, standard: "ias-12-income-taxes" },
    { id: "leases", label: "Leases (IFRS 16)", grid: "C", mcq: `${M}/chapter-3-ifrs-16-leases`, standard: "ifrs-16-leases" },
    { id: "provisions", label: "Provisions and events after the reporting period (IAS 37 / IAS 10)", grid: "C", mcq: `${M}/chapter-1-ias-10-ias-37-and-ifric-1`, standard: "ias-37-provisions-contingent-liabilities-and-contingent-assets" },
    { id: "eps", label: "Earnings per share (IAS 33)", grid: "A", mcq: `${M}/chapter-11-ias-33-earnings-per-share`, standard: "ias-33-earnings-per-share" },
    { id: "fin-inst", label: "Financial instruments and ECL (IFRS 9)", grid: "C", mcq: `${M}/chapter-2-financial-instruments`, standard: "ifrs-9-financial-instruments" },
    { id: "intangibles", label: "Intangible assets (IAS 38)", grid: "B", mcq: `${M}/chapter-12-ias-38-intangible-assets`, standard: "ias-38-intangible-assets" },
    { id: "ratios", label: "Analysis and interpretation", grid: "A" },
    { id: "fx", label: "Foreign currency (IAS 21)", grid: "C", mcq: `${M}/chapter-4-ias-21-foreign-currency-transactions`, standard: "ias-21-effects-of-changes-in-foreign-exchange-rates" },
    { id: "segments", label: "Operating segments (IFRS 8)", grid: "C", mcq: `${M}/chapter-6-ifrs-8-operating-segments` },
    { id: "regulatory", label: "Companies Act schedules and local requirements", grid: "A", mcq: `${M}/chapter-8-regulatory-framework-secp-icap-4th-5th-schedule` },
    { id: "ethics", label: "Ethics in financial reporting", grid: "B", mcq: `${M}/chapter-13-ethical-issues-in-financial-reporting` },
    { id: "sustainability", label: "Sustainability reporting (IFRS S1)", grid: "B", mcq: `${M}/chapter-14-esg-and-sustainability` },
    { id: "associates", label: "Associates (IAS 28)", grid: "A", mcq: `${M}/chapter-10-associates-ias-28`, standard: "ias-28-investments-in-associates-and-joint-ventures" },
  ],
  sittings: [
    {
      slug: "spring-2026",
      name: "Spring 2026",
      date: "2026-03-10",
      paperUrl: `${QP}CAF-6-CR-Spring-2026.pdf`,
      commentsUrl: `${EC}CAF-6-Spring-2026.pdf`,
      answersUrl: SA,
      answersNote: LOGIN,
      passRate: 42,
      themes: [
        "The overall pass rate held steady, close to the five-session average, but question results varied widely.",
        "Candidates handled structured, familiar computations well and struggled with discussion and interpretation; the IFRS 15 discussion question had a 3% pass rate.",
        "Generic answers that did not connect the standard to the scenario, and numbers without workings, were the recurring reasons for lost marks.",
      ],
      questions: [
        {
          n: 1, format: "MCQ", page: 1, commentsPage: 1, passRate: 78,
          summary: "Ten one-mark MCQs: functional currency, segment 75% rule, inventory bought in foreign currency, IFRS S1 objective and materiality, Fourth Schedule line items, donation disclosure, two ethics principles and restated EPS.",
          parts: [
            { area: "fx", marks: 1, label: "(i)" }, { area: "segments", marks: 1, label: "(ii)" },
            { area: "fx", marks: 1, label: "(iii)" }, { area: "sustainability", marks: 1, label: "(iv)" },
            { area: "regulatory", marks: 1, label: "(v)" }, { area: "ethics", marks: 1, label: "(vi)" },
            { area: "sustainability", marks: 1, label: "(vii)" }, { area: "regulatory", marks: 1, label: "(viii)" },
            { area: "ethics", marks: 1, label: "(ix)" }, { area: "eps", marks: 1, label: "(x)" },
          ],
          walkthrough: {
            approach: [
              "Most items are recall: know the exact test in each standard (75% external revenue, primary indicators of functional currency, IFRS S1 user focus).",
              "For numerical items, decide monetary vs non-monetary first in foreign currency, and bonus vs error effects in EPS.",
            ],
            rules: [
              "Functional currency: primarily the currency that drives sales prices and the costs of labour and materials; financing and cash retention are secondary indicators.",
              "IFRS 8: add reportable segments until those identified make up at least 75% of external revenue.",
              "IAS 21: inventory is non-monetary and stays at the historical rate; payables are retranslated at closing rate.",
              "IFRS S1: disclose sustainability-related risks and opportunities that could reasonably be expected to affect prospects; materiality is judged by the decisions of primary users of general purpose financial reports.",
              "IAS 33: restate prior-year EPS for a bonus issue and for corrections of prior-period errors.",
            ],
            mistakes: [
              "Picking the currency of costs alone when sales prices are set in another currency.",
              "Retranslating inventory at the closing rate.",
              "Restating prior EPS for the bonus issue but forgetting the error correction (or the reverse).",
            ],
            example: {
              title: "Restating prior-year EPS",
              scenario: [
                "Last year a company reported EPS of Rs 4.00 (earnings Rs 20m, 5m shares). This year it made a 1-for-4 bonus issue. No errors were found.",
              ],
              required: "What comparative EPS appears in this year's statements?",
              solution: [
                { table: { head: ["Working", "Value"], rows: [["Shares adjusted for bonus: 5m × 1.25", "6.25m"], ["Restated EPS: 20 ÷ 6.25", "Rs 3.20"]] } },
              ],
              answer: "Rs 3.20. If a prior-year error had changed last year's earnings, the numerator would be restated too.",
            },
          },
        },
        {
          n: 2, format: "Numerical", page: 3, commentsPage: 1, passRate: 73,
          summary: "Extracts from both the lessor's and lessee's statements for one finance lease, with guaranteed and unguaranteed residual values, initial direct costs and different discount rates.",
          parts: [{ area: "leases", marks: 12 }],
          walkthrough: {
            approach: [
              "Lessor: classify the lease (term vs economic life, PV vs fair value). For a finance lease compute net investment = PV of lease payments + PV of unguaranteed residual, at the implicit rate.",
              "Lessee: discount at the implicit rate if known to the lessee, otherwise the incremental borrowing rate. Include only the amount expected to be paid under a residual value guarantee.",
              "Right-of-use asset = lease liability + lessee's initial direct costs; depreciate over the lease term unless ownership transfers.",
              "Run one-year schedules for each party and split liability/receivable into current and non-current.",
            ],
            rules: [
              "IFRS 16 lessor: finance lease if substantially all risks and rewards transfer; lease term covering the major part of economic life is a key indicator.",
              "Lessor's net investment includes the full residual (guaranteed and unguaranteed).",
              "Lessee's liability includes amounts expected to be payable under residual value guarantees, not the full guarantee.",
              "The implicit rate is defined so that it already reflects the lessor's initial direct costs.",
            ],
            layout: { head: ["Extract", "Lessor", "Lessee"], rows: [["P&L: finance income / interest expense", "", ""], ["P&L: depreciation", "–", ""], ["SOFP: net investment / ROU asset", "", ""], ["SOFP: current and non-current portions", "", ""]] },
            mistakes: [
              "Classifying the lease as operating for the lessor (examiners' point).",
              "Dropping one of the residual value components from the lessor's net investment.",
              "Putting the whole guarantee into the lessee's liability instead of the expected shortfall.",
            ],
            example: {
              title: "Both sides of a finance lease",
              scenario: [
                "A lessor leases equipment for 4 years of its 5-year life from 1 January 2025: Rs 30m a year in arrears. The lessor expects a residual of Rs 12m, of which the lessee guarantees Rs 5m; the lessee expects the asset to be worth Rs 4m, so expects to pay Rs 1m under the guarantee. The implicit rate is 8% (it reflects the lessor's initial direct costs) but is unknown to the lessee, whose borrowing rate is 10%. The lessee's initial direct costs are Rs 0.8m.",
              ],
              required: "Calculate the key 2025 figures for each party.",
              solution: [
                { table: { head: ["Lessor (8%)", "Rs m"], rows: [["PV of rentals: 30 × 3.3121", "99.36"], ["PV of residual: 12 × 0.7350", "8.82"], ["Net investment 1 Jan 2025", "108.18"], ["Finance income 2025: × 8%", "8.65"], ["Net investment 31 Dec 2025: 108.18 + 8.65 − 30", "86.84"], ["… current portion", "23.05"]] } },
                { table: { head: ["Lessee (10%)", "Rs m"], rows: [["PV of rentals: 30 × 3.1699", "95.10"], ["PV of expected guarantee payment: 1 × 0.6830", "0.68"], ["Lease liability 1 Jan 2025", "95.78"], ["Right-of-use asset: + 0.8", "96.58"], ["Depreciation over 4 years", "24.14"], ["Interest 2025", "9.58"], ["Liability 31 Dec 2025: 95.78 + 9.58 − 30", "75.36"], ["… current portion", "22.46"]] } },
              ],
              answer: "Lessor: finance income Rs 8.65m, receivable Rs 86.84m. Lessee: depreciation Rs 24.14m, interest Rs 9.58m, liability Rs 75.36m, ROU asset Rs 72.43m.",
            },
          },
        },
        {
          n: 3, format: "Numerical", page: 3, commentsPage: 2, passRate: 73,
          summary: "Basic and diluted EPS with a rights issue below market price, a later bonus issue, share warrants and convertible bonds issued part-way through the year.",
          parts: [{ area: "eps", marks: 8 }],
          walkthrough: {
            approach: [
              "Basic: time-weight shares; apply the rights bonus fraction (market price ÷ TERP) to periods before the rights issue and the bonus factor to all periods before the bonus issue.",
              "Diluted, options/warrants: only the 'free' shares, = number × (average price − exercise price) ÷ average price.",
              "Diluted, convertibles: add back after-tax interest for the period the bonds were in issue, and add the shares for the same period.",
              "Rank by incremental EPS if there is more than one dilutive instrument; exclude anything anti-dilutive.",
            ],
            rules: [
              "TERP = (market value of old shares + cash raised) ÷ total shares after the rights issue.",
              "A bonus issue is treated as if it happened at the start of the earliest period presented.",
              "Potential shares are included only if dilutive.",
            ],
            mistakes: [
              "Including all warrant shares instead of the free element (examiners' point).",
              "Adding back a full year's interest for bonds issued mid-year, or ignoring tax on it.",
            ],
            example: {
              title: "Rights, bonus, options and convertibles",
              scenario: [
                "Profit Rs 60m. 2,000,000 shares at 1 January. 1 April: 1-for-5 rights issue at Rs 90 when the market price was Rs 120. 1 October: 1-for-10 bonus issue. 200,000 options at Rs 100 outstanding all year (average price Rs 160). 1 July: Rs 100m of 10% convertible bonds issued, convertible at 1 share per 2 bonds of Rs 100. Tax 30%.",
              ],
              required: "Calculate basic and diluted EPS.",
              solution: [
                { table: { head: ["Weighted shares", "Shares"], rows: [["TERP: (5 × 120 + 90) ÷ 6 = 115; rights factor 120 ÷ 115", ""], ["Jan–Mar: 2.0m × 1.0435 × 1.1 × 3/12", "573,913"], ["Apr–Sep: 2.4m × 1.1 × 6/12", "1,320,000"], ["Oct–Dec: 2.64m × 3/12", "660,000"], ["Weighted average", "2,553,913"]] } },
                { table: { head: ["Diluted", "Earnings", "Shares"], rows: [["Basic", "Rs 60.0m", "2,553,913"], ["Options: 200,000 × 60 ÷ 160", "–", "75,000"], ["Convertibles: 500,000 × 6/12; interest 100m × 10% × 6/12 × 70%", "Rs 3.5m", "250,000"], ["Diluted", "Rs 63.5m", "2,878,913"]] } },
              ],
              answer: "Basic EPS ≈ Rs 23.49; diluted EPS ≈ Rs 22.06 (the convertible's incremental EPS of Rs 14 is below basic, so it dilutes).",
            },
          },
        },
        {
          n: 4, format: "Written", page: 3, commentsPage: 2, passRate: 3,
          summary: "Discussion of how two sales incentives (long interest-free credit for retail buyers and a full-refund return right for wholesalers) affect revenue recognition and measurement.",
          parts: [{ area: "revenue", marks: 9 }],
          walkthrough: {
            approach: [
              "For each incentive, name the IFRS 15 concept it raises: significant financing component, variable consideration.",
              "Financing: split credit terms into one year or less (practical expedient) and longer (discount at a rate reflecting the customer's credit). Revenue at cash selling price; the rest is interest over time.",
              "Return right: estimate expected returns; recognise revenue only for goods not expected back, with a refund liability and a right-to-recover asset at cost.",
              "Constrain variable consideration so a significant reversal is highly unlikely. Conclude for each incentive.",
            ],
            rules: [
              "IFRS 15: adjust the transaction price for the time value of money when the financing benefit is significant.",
              "Practical expedient: no adjustment if the period between transfer and payment is one year or less.",
              "Rights of return create variable consideration, estimated with expected value or most likely amount, subject to the constraint.",
              "Revenue is not deferred to the end of the return period; it is recognised net of expected returns.",
            ],
            mistakes: [
              "General statements about IFRS 15 that never mention financing or variable consideration (examiners' point).",
              "Not separating credit periods under and over one year.",
              "Deferring all revenue until the return window closes.",
            ],
            example: {
              title: "Financing component and returns",
              scenario: [
                "(a) Goods with a cash price of Rs 1,000,000 are delivered on 1 January 2025; the customer will pay Rs 1,166,400 on 31 December 2026 (implied rate 8%). (b) 100 units are sold for Rs 5,000 each (cost Rs 3,000) with a 90-day full-refund return right; 6% are expected back.",
              ],
              required: "Show the 2025 accounting.",
              solution: [
                { table: { head: ["Item", "2025 effect"], rows: [["(a) Revenue at delivery", "Rs 1,000,000"], ["(a) Interest income 2025: 1,000,000 × 8%", "Rs 80,000 (Rs 86,400 in 2026)"], ["(b) Revenue: 94 units × 5,000", "Rs 470,000"], ["(b) Refund liability: 6 × 5,000", "Rs 30,000"], ["(b) Right to recover goods: 6 × 3,000", "Rs 18,000"], ["(b) Cost of sales: 94 × 3,000", "Rs 282,000"]] } },
              ],
              answer: "Revenue Rs 1,470,000 plus interest income Rs 80,000; the return right is handled through estimates, not by deferring all revenue.",
            },
          },
        },
        {
          n: 5, format: "Written", page: 4, commentsPage: 2, passRate: 24,
          summary: "Discussion of how three board decisions (deposits into an associate, a short lease turned long, adopting revaluation) move six ratios.",
          parts: [{ area: "ratios", marks: 6 }],
          walkthrough: {
            approach: [
              "For each decision, first state the accounting effect on the statements: which assets, liabilities, equity and P&L lines change.",
              "Then take each ratio and say which part (numerator or denominator) moves and in which direction, and why.",
              "Present as a grid of decisions × ratios with a reason in each cell.",
            ],
            rules: [
              "Equity-accounted associate: non-current asset; share of profit sits below operating profit in many formats.",
              "Long lease: right-of-use asset and lease liability on balance sheet; expense becomes depreciation + interest.",
              "Revaluation: higher assets and equity; higher depreciation lowers profit.",
            ],
            mistakes: [
              "Only stating 'increase' or 'decrease' without reasons (examiners' point).",
              "Missing the higher depreciation after revaluation.",
              "Ignoring balance sheet effects on current ratio, gearing and asset turnover.",
            ],
            example: {
              title: "Revaluation and its ratio effects",
              scenario: [
                "Equity Rs 1,000m, debt Rs 400m, PBIT Rs 200m, revenue Rs 2,000m, interest Rs 40m. The company revalues PPE upwards by Rs 300m, adding Rs 15m a year of depreciation.",
              ],
              required: "Show the effect on gearing, ROCE, asset turnover and interest cover.",
              solution: [
                { table: { head: ["Ratio", "Before", "After"], rows: [["Gearing (debt ÷ equity)", "40.0%", "400 ÷ 1,300 = 30.8%"], ["ROCE (PBIT ÷ (equity + debt))", "200 ÷ 1,400 = 14.3%", "185 ÷ 1,700 = 10.9%"], ["Asset turnover (revenue ÷ capital employed)", "1.43", "1.18"], ["Interest cover", "5.0×", "185 ÷ 40 = 4.6×"]] } },
              ],
              answer: "Gearing looks better; ROCE, asset turnover and interest cover all look worse, with no change in cash.",
            },
          },
        },
        {
          n: 6, format: "Numerical", page: 4, commentsPage: 2, passRate: 27,
          summary: "SOPL/OCI and SOFP extracts with comparatives for bonds held at fair value through OCI whose credit risk rose significantly, with 12-month and lifetime ECL figures.",
          parts: [{ area: "fin-inst", marks: 8 }],
          walkthrough: {
            approach: [
              "Run the amortised cost schedule at the effective rate: opening + interest − coupon.",
              "Pick the right ECL each year: 12-month unless credit risk has increased significantly, then lifetime.",
              "P&L: interest income (EIR) and the change in the loss allowance.",
              "SOFP: the asset at fair value. OCI/reserve: fair value minus gross amortised cost, plus the loss allowance.",
            ],
            rules: [
              "IFRS 9: FVOCI debt uses amortised-cost accounting for P&L (interest, ECL); fair value changes go to OCI.",
              "The loss allowance for FVOCI assets is recognised in OCI and does not reduce the carrying amount in the SOFP.",
              "Charge only the movement in the allowance each year.",
              "On derecognition, the cumulative OCI amount is reclassified to P&L.",
            ],
            mistakes: [
              "Charging the full lifetime ECL instead of the increase (examiners' point).",
              "Not showing the fair value movement in OCI or the reserve in equity.",
            ],
            example: {
              title: "FVOCI bond with a credit downgrade",
              scenario: [
                "On 1 January 2024 a company bought a 5-year bond: face Rs 100m, coupon 8% paid annually, total cost Rs 92.418m including transaction costs; EIR 10%. FVOCI. ECL: 31 December 2024 12-month Rs 1.0m; 31 December 2025 credit risk has risen significantly and lifetime ECL is Rs 3.5m. Fair value: Rs 95m (2024), Rs 90m (2025).",
              ],
              required: "Prepare the 2025 extracts with comparatives.",
              solution: [
                { table: { head: ["Rs m", "2025", "2024"], rows: [["Interest income (EIR)", "9.366", "9.242"], ["Impairment loss", "(2.500)", "(1.000)"], ["OCI: fair value and ECL movement", "(3.866)", "2.340"], ["SOFP: investment at fair value", "90.000", "95.000"], ["Equity: fair value reserve", "(1.526)", "2.340"]] } },
                { text: "Gross amortised cost: 92.418 → 93.660 (2024) → 95.026 (2025). Reserve = FV − amortised cost + allowance: 2024: 95 − 93.660 + 1.0 = 2.340; 2025: 90 − 95.026 + 3.5 = −1.526." },
              ],
              answer: "2025: interest Rs 9.366m, impairment Rs 2.5m, OCI loss Rs 3.866m; asset Rs 90m.",
            },
          },
        },
        {
          n: 7, format: "Written", page: 5, commentsPage: 3, passRate: 35,
          summary: "Discussion of four independent year-end matters for a listed manufacturer: a lawsuit updated after year-end, a possible environmental penalty with prejudicial disclosure, an extended warranty, and a customer's post-year-end bankruptcy.",
          parts: [{ area: "provisions", marks: 15 }], alsoTests: ["fin-inst"],
          walkthrough: {
            approach: [
              "For each matter: was there a present obligation (legal or constructive) at the reporting date from a past event?",
              "Is an outflow probable, and can it be measured reliably? Then provision, contingent liability or nothing.",
              "Events after the reporting date: adjusting if they give evidence about conditions at the reporting date; otherwise non-adjusting.",
              "Quantify where you can and give the reason for each conclusion.",
            ],
            rules: [
              "IAS 37: provision = best estimate of the expenditure needed to settle the obligation at the reporting date, using information available before authorisation.",
              "Contingent liability: possible obligation, or present obligation where outflow is not probable; disclose unless remote.",
              "Seriously prejudicial disclosure: in rare cases, disclose only the general nature of the dispute and why details are withheld.",
              "IAS 10: a customer's bankruptcy after the year-end usually confirms that a receivable was impaired at the year-end (adjusting).",
              "Warranty provision = expected cost for sales to date less repairs already done; a later extension of cover is a non-adjusting event.",
            ],
            mistakes: [
              "Using the original offer or the claim amount instead of the latest best estimate (examiners' point).",
              "Not addressing prejudicial disclosure.",
              "Not deducting warranty costs already incurred; treating the extension as adjusting.",
            ],
            example: {
              title: "Warranty and a bankrupt customer",
              scenario: [
                "A company sold 50,000 units in 2025 with a one-year warranty. Experience: 10% need minor repairs at Rs 200 and 4% major repairs at Rs 1,000. Repairs costing Rs 1.2m were already done on these units in 2025. In February 2026 it extended cover to two years. A Rs 20m receivable had a 25% allowance at 31 December 2025; the customer went bankrupt in January 2026 and only 40% is now recoverable.",
              ],
              required: "Calculate the warranty provision and the receivable adjustment at 31 December 2025.",
              solution: [
                { table: { head: ["Working", "Rs m"], rows: [["Expected minor: 50,000 × 10% × 200", "1.0"], ["Expected major: 50,000 × 4% × 1,000", "2.0"], ["Less already incurred", "(1.2)"], ["Warranty provision", "1.8"], ["Required allowance: 20 × 60%", "12.0"], ["Existing allowance: 20 × 25%", "(5.0)"], ["Additional impairment", "7.0"]] } },
              ],
              answer: "Provision Rs 1.8m; the extension is non-adjusting (disclose if material). Increase the allowance by Rs 7m: the bankruptcy is adjusting.",
            },
          },
        },
        {
          n: 8, format: "Numerical", page: 6, commentsPage: 3, passRate: 42,
          summary: "Consolidated statement of profit or loss for a parent with a subsidiary acquired at the start of the year and an associate acquired mid-year: deferred and share consideration, fair value adjustments, disposal of revalued vehicles, intra-group trading and loan, goodwill impairment.",
          parts: [{ area: "consolidation", marks: 17 }], alsoTests: ["associates"],
          walkthrough: {
            approach: [
              "Time-apportion the subsidiary from the acquisition date and the associate from its acquisition date.",
              "Consideration workings: cash now, deferred cash at present value (unwind interest into finance cost), shares at acquisition-date price. Acquisition costs are expensed.",
              "Fair value adjustments: extra depreciation; on disposal, the group gain or loss uses the group carrying amount.",
              "Eliminate intra-group sales and cost of sales, unrealised profit in closing inventory, intra-group interest.",
              "Goodwill impairment to expenses; share of associate's profit after its own adjustments; split profit between owners and NCI.",
            ],
            rules: [
              "IFRS 3: consideration at acquisition-date fair value; acquisition-related costs expensed.",
              "Unrealised profit: if the subsidiary sold, the adjustment reduces NCI's share too.",
              "Under the proportionate NCI method, goodwill impairment is borne by the parent only.",
              "IAS 28: equity-account the associate from the date significant influence starts.",
            ],
            layout: { head: ["Consolidated SOPL", "Parent", "Sub (× months)", "Adjustments", "Group"], rows: [["Revenue", "", "", "", ""], ["Cost of sales", "", "", "", ""], ["Operating expenses", "", "", "", ""], ["Finance cost", "", "", "", ""], ["Share of associate", "", "", "", ""], ["Attributable to owners / NCI", "", "", "", ""]] },
            mistakes: [
              "Not expensing the acquisition costs taken out of the investment (examiners' point).",
              "Keeping the subsidiary's own gain on selling revalued assets.",
              "Deducting unrealised profit from cost of sales instead of adding it; no unwinding of deferred consideration.",
              "Full-year associate profit; NCI on unadjusted profit.",
            ],
            example: {
              title: "Mid-year acquisition SOPL",
              scenario: [
                "P buys 80% of S on 1 April 2025. Full-year figures (Rs m): P revenue 900, cost of sales 560, operating expenses 150, other income 30, finance cost 40; S revenue 480, cost of sales 300, operating expenses 80, finance cost 20. Consideration includes Rs 121m payable on 31 March 2027 (PV at 10%: Rs 100m); acquisition costs of Rs 6m were capitalised in P's investment. S's plant was Rs 36m above book value with 3 years left (depreciation in cost of sales). After acquisition S sold P goods for Rs 90m at a 25% mark-up; 40% are in P's closing inventory. Goodwill is impaired by Rs 10m. NCI is measured at its share of net assets.",
              ],
              required: "Prepare the consolidated statement of profit or loss.",
              solution: [
                { table: { head: ["Rs m", "Group"], rows: [["Revenue: 900 + 480 × 9/12 − 90", "1,170.0"], ["Cost of sales: 560 + 225 − 90 + PURP 7.2 + extra dep. 9", "(711.2)"], ["Gross profit", "458.8"], ["Operating expenses: 150 + 60 + 6 + 10", "(226.0)"], ["Other income", "30.0"], ["Finance cost: 40 + 15 + unwinding 100 × 10% × 9/12", "(62.5)"], ["Profit for the year", "200.3"], ["NCI: (60 − 9 − 7.2) × 20%", "8.76"], ["Owners of P", "191.54"]] } },
                { text: "PURP = 90 × 25/125 × 40% = 7.2." },
              ],
              answer: "Group profit Rs 200.3m: Rs 191.54m to owners, Rs 8.76m to NCI.",
            },
          },
        },
        {
          n: 9, format: "Numerical", page: 7, commentsPage: 4, passRate: 38,
          summary: "Taxation note with a tax rate reconciliation for a loss-making year, plus deferred tax on each temporary difference: investment property at fair value, rent-free lease income, development costs, PPE, unused losses and a rate cut.",
          parts: [{ area: "tax", marks: 10, label: "(a)" }, { area: "tax", marks: 5, label: "(b)" }],
          walkthrough: {
            approach: [
              "Compute taxable profit/loss: start from accounting result, remove non-taxable and non-deductible items, swap accounting depreciation and amortisation for tax allowances, adjust accruals that are taxed on cash.",
              "List every asset and liability with a different tax base; compute temporary differences.",
              "Measure deferred tax at the rate enacted for when the differences reverse.",
              "Recognise a deferred tax asset on losses only to the extent future use is probable.",
              "Build the reconciliation: accounting profit × rate, then each permanent difference, rate change effect and unrecognised losses.",
            ],
            rules: [
              "IAS 12: use rates enacted or substantively enacted by the reporting date.",
              "Deferred tax assets need probable future taxable profits.",
              "Remeasurement of opening deferred tax for a rate change goes to P&L (or OCI if the item was in OCI).",
            ],
            layout: { head: ["Tax note", "Rs m"], rows: [["Current tax", ""], ["Deferred tax: origination and reversal", ""], ["Deferred tax: rate change", ""], ["Tax expense", ""], ["Reconciliation: accounting profit × rate", ""], ["Permanent differences", ""], ["Rate change / unrecognised losses", ""]] },
            mistakes: [
              "Not removing the fair value gain on investment property from taxable profit (examiners' point).",
              "Measuring closing deferred tax at the old rate when a new rate was enacted before year-end.",
              "Recognising a deferred tax asset on losses that are not expected to be used.",
            ],
            example: {
              title: "Tax note with a rate change",
              scenario: [
                "Profit before tax Rs 200m. Non-deductible expenses Rs 6m; tax-exempt income Rs 10m. Accounting depreciation Rs 30m; tax depreciation Rs 45m. The opening deferred tax liability on PPE was Rs 30m (temporary difference Rs 100m at 30%). Before year-end a cut to 25% from next year was enacted; this year's current tax is still at 30%.",
              ],
              required: "Prepare the tax expense and reconciliation.",
              solution: [
                { table: { head: ["Working", "Rs m"], rows: [["Taxable profit: 200 + 6 − 10 + 30 − 45", "181.00"], ["Current tax at 30%", "54.30"], ["Closing DTL: (100 + 15) × 25%", "28.75"], ["Deferred tax credit: 28.75 − 30.00", "(1.25)"], ["Tax expense", "53.05"]] } },
                { table: { head: ["Reconciliation", "Rs m"], rows: [["200 × 30%", "60.00"], ["Non-deductible: 6 × 30%", "1.80"], ["Exempt income: 10 × 30%", "(3.00)"], ["Rate change on closing temporary difference: 115 × (25% − 30%)", "(5.75)"], ["Tax expense", "53.05"]] } },
              ],
              answer: "Tax expense Rs 53.05m; closing deferred tax liability Rs 28.75m.",
            },
          },
        },
      ],
    },
    {
      slug: "autumn-2026",
      name: "Autumn 2026",
      date: "2026-08-25",
      paperUrl: `${QP}CAF-6-CR-Autumn-2026.pdf`,
      commentsUrl: `${EC}CAF-6-Autumn-2026.pdf`,
      answersUrl: SA,
      answersNote: LOGIN,
      passRate: 44,
      themes: [
        "The pass rate edged up, helped by strong results in the first three questions.",
        "The three-part IFRS 15 question (Q9) was exceptionally weak at 8%: candidates wrote entries without explaining the principle, and mixed up material rights with general promotions.",
        "The examiners ask candidates to analyse the substance of each transaction, explain the treatment and give properly referenced workings for every part of the requirement.",
      ],
      questions: [
        {
          n: 1, format: "MCQ", page: 1, commentsPage: 1, passRate: 71,
          summary: "Ten one-mark MCQs: segments (a cost-centre component and the 75% test), Companies Act schedules and size reclassification, foreign currency advances, IFRS S1 core content and scope, two ethics conflicts and functional currency.",
          parts: [
            { area: "segments", marks: 1, label: "(i)" }, { area: "regulatory", marks: 1, label: "(ii)" },
            { area: "regulatory", marks: 1, label: "(iii)" }, { area: "fx", marks: 1, label: "(iv)" },
            { area: "sustainability", marks: 1, label: "(v)" }, { area: "ethics", marks: 1, label: "(vi)" },
            { area: "ethics", marks: 1, label: "(vii)" }, { area: "sustainability", marks: 1, label: "(viii)" },
            { area: "segments", marks: 1, label: "(ix)" }, { area: "fx", marks: 1, label: "(x)" },
          ],
          walkthrough: {
            approach: [
              "Segments: first ask whether the component is an operating segment at all (does it earn revenues from activities other than incidental ones?) before testing thresholds.",
              "Companies Act items: subsidiaries of listed companies follow the listed-company schedule; size reclassification depends on consecutive-year rules.",
              "Ethics: the Code expects escalation and consultation before resignation or external reporting.",
            ],
            rules: [
              "IFRS 8: corporate headquarters and functions earning only incidental revenue are not operating segments.",
              "IAS 21: advances paid or received for goods or services are non-monetary; they are not retranslated.",
              "IFRS S1 core content: governance, strategy, risk management, metrics and targets.",
            ],
            mistakes: [
              "Calling a cost centre a reportable segment because it passes the 10% asset test.",
              "Retranslating customer or supplier advances at the closing rate.",
            ],
            example: {
              title: "The 75% external revenue test",
              scenario: [
                "Total external revenue is Rs 1,000m. Segments that pass the 10% tests have external revenue of Rs 700m. The largest remaining segments have external revenue of Rs 40m (X) and Rs 30m (Y), neither passing any 10% test.",
              ],
              required: "What must the entity do?",
              solution: [
                { table: { head: ["Step", "External revenue"], rows: [["Identified so far", "700 (70%)"], ["Required", "750 (75%)"], ["Add X", "740 (74%)"], ["Add Y", "770 (77%)"]] } },
              ],
              answer: "Designate X and Y as additional reportable segments until at least 75% is covered, even though neither passes the 10% tests.",
            },
          },
        },
        {
          n: 2, format: "Numerical", page: 3, commentsPage: 1, passRate: 76,
          summary: "Taxation note and reconciliation with a mid-year rate cut applying to the current year, PPE timing differences, a first land revaluation, a non-deductible payment, a temporarily exempt grant and a warranty provision.",
          parts: [{ area: "tax", marks: 10 }],
          walkthrough: {
            approach: [
              "Taxable profit: add back non-deductible items, remove exempt income, replace accounting depreciation with tax depreciation, adjust provisions deductible on payment.",
              "Current tax at the rate that applies to the current year.",
              "Closing temporary differences × new rate; opening balances at the old rate. The difference splits into origination/reversal and rate-change effects.",
              "Deferred tax on a revaluation goes to OCI, even if the gain is taxed only on sale.",
            ],
            rules: [
              "IAS 12: deferred tax on items recognised in OCI is also recognised in OCI.",
              "A gain taxable only on disposal still creates a taxable temporary difference.",
              "Provisions deductible when paid create deductible temporary differences (deferred tax assets).",
            ],
            mistakes: [
              "Applying the rate cut inconsistently between current tax, closing deferred tax and opening balances (examiners' point).",
              "Ignoring deferred tax on the land revaluation, or putting it through P&L.",
            ],
            example: {
              title: "Rate cut plus revaluation",
              scenario: [
                "PBT Rs 300m. Non-deductible costs Rs 10m. Accounting depreciation Rs 40m vs tax Rs 60m; opening PPE temporary difference Rs 80m. Warranty provision: opening Rs 20m, expense Rs 12m, paid Rs 7m (deductible when paid). Land revalued up by Rs 50m. During the year the rate was cut from 30% to 28% for this year onwards.",
              ],
              required: "Calculate current tax, deferred tax and the reconciliation.",
              solution: [
                { table: { head: ["Working", "Rs m"], rows: [["Taxable profit: 300 + 10 + 40 − 60 + 12 − 7", "295.0"], ["Current tax at 28%", "82.6"], ["DTL on PPE: 100 × 28% − 80 × 30%", "4.0 charge"], ["DTA on warranty: 25 × 28% − 20 × 30%", "1.0 credit"], ["Tax expense in P&L", "85.6"], ["Deferred tax on land (OCI): 50 × 28%", "14.0"]] } },
                { table: { head: ["Reconciliation", "Rs m"], rows: [["300 × 28%", "84.0"], ["Non-deductible: 10 × 28%", "2.8"], ["Remeasuring opening net DTL: (80 − 20) × (28% − 30%)", "(1.2)"], ["Tax expense", "85.6"]] } },
              ],
              answer: "P&L tax Rs 85.6m; OCI tax Rs 14m.",
            },
          },
        },
        {
          n: 3, format: "Numerical", page: 3, commentsPage: 2, passRate: 65,
          summary: "Two years of journal entries for a debt instrument at amortised cost, moving from 12-month to lifetime expected credit losses after a significant increase in credit risk.",
          parts: [{ area: "fin-inst", marks: 6 }],
          walkthrough: {
            approach: [
              "Initial cost = fair value + transaction costs.",
              "Each year: interest at EIR on the gross carrying amount (stage 1 and 2), coupon received, then adjust the loss allowance to the required closing figure.",
              "Stage 2 means lifetime ECL even though the asset is not credit-impaired.",
            ],
            rules: [
              "IFRS 9: 12-month ECL while credit risk has not increased significantly; lifetime ECL once it has.",
              "Interest is on the gross amount until the asset is credit-impaired (stage 3), then on the net amount.",
              "Only the change in the allowance hits P&L each year.",
            ],
            mistakes: [
              "Keeping 12-month ECL until the asset is credit-impaired (examiners' point).",
              "Expensing the whole closing allowance rather than the increase.",
            ],
            example: {
              title: "Amortised cost with stage 2 ECL",
              scenario: [
                "On 1 January 2024 a company bought a 5-year bond (face Rs 100m, 7% annual coupon) for Rs 95.007m plus Rs 1.0m costs; EIR 8%. ECL: 31 December 2024 12-month Rs 0.8m; 31 December 2025 significant increase in credit risk, lifetime Rs 3.0m.",
              ],
              required: "Give the 2024 and 2025 journal entries.",
              solution: [
                { table: { head: ["Entry", "Dr", "Cr", "Rs m"], rows: [["1 Jan 2024 purchase", "Investment", "Cash", "96.007"], ["2024 interest: 96.007 × 8%", "Investment", "Interest income", "7.681"], ["2024 coupon", "Cash", "Investment", "7.000"], ["2024 ECL", "Impairment loss", "Loss allowance", "0.800"], ["2025 interest: 96.688 × 8%", "Investment", "Interest income", "7.735"], ["2025 coupon", "Cash", "Investment", "7.000"], ["2025 ECL: 3.0 − 0.8", "Impairment loss", "Loss allowance", "2.200"]] } },
              ],
              answer: "Net carrying amount at 31 December 2025 = 97.423 − 3.0 = Rs 94.423m.",
            },
          },
        },
        {
          n: 4, format: "Written", page: 4, commentsPage: 2, passRate: 63,
          summary: "Explain how four transactions (cumulative equity preference shares with no dividend declared, a rights issue at market price, options below average price, a bonus issue after year-end) affect basic and diluted EPS.",
          parts: [{ area: "eps", marks: 8 }],
          walkthrough: {
            approach: [
              "For each item, answer four boxes: basic numerator, basic denominator, diluted numerator, diluted denominator.",
              "Say 'no effect' explicitly where nothing changes, with the reason.",
            ],
            rules: [
              "Cumulative preference dividends for the period are deducted from earnings whether or not declared.",
              "A rights issue at full market price has no bonus element: just time-weight the new shares.",
              "Options: no effect on basic; diluted adds only the shares deemed issued for nothing.",
              "Bonus issues after the reporting date but before authorisation are applied retrospectively to all periods presented.",
            ],
            layout: { head: ["Transaction", "Basic numerator", "Basic denominator", "Diluted numerator", "Diluted denominator"], rows: [["Preference shares", "", "", "", ""], ["Rights issue", "", "", "", ""], ["Options", "", "", "", ""], ["Bonus after year-end", "", "", "", ""]] },
            mistakes: [
              "Applying a bonus fraction to a rights issue made at market price (examiners' point).",
              "Putting options into basic EPS, or all option shares into diluted EPS.",
              "Ignoring a bonus issue because it came after the year-end.",
            ],
            example: {
              title: "All four effects in numbers",
              scenario: [
                "Profit Rs 50m. Rs 100m of 12% cumulative preference shares (equity) issued at the start of the year; no dividend declared. 10m ordinary shares at the start; 2m more issued on 1 April at full market price. 1m options at Rs 80 (average price Rs 100) all year. A 1-for-10 bonus issue was made after the year-end, before the statements were approved.",
              ],
              required: "Calculate basic and diluted EPS.",
              solution: [
                { table: { head: ["Working", "Value"], rows: [["Earnings: 50 − 12", "Rs 38m"], ["Shares: 10m + 2m × 9/12 = 11.5m; × 1.1", "12.65m"], ["Basic EPS", "Rs 3.00"], ["Option free shares: 1m × 20 ÷ 100 × 1.1", "0.22m"], ["Diluted EPS: 38 ÷ 12.87", "Rs 2.95"]] } },
              ],
              answer: "Basic Rs 3.00; diluted Rs 2.95.",
            },
          },
        },
        {
          n: 5, format: "Numerical", page: 4, commentsPage: 2, passRate: 42,
          summary: "SOPL and SOFP extracts with comparatives for an internally built platform (when capitalisation and amortisation start) and a licence whose life becomes indefinite after a renewal mechanism is introduced.",
          parts: [{ area: "intangibles", marks: 7 }],
          walkthrough: {
            approach: [
              "Development: capitalise only from the date every criterion is met (the last one to be met sets the date).",
              "Exclude allocated general overheads, advertising and training even after that date.",
              "Amortisation starts when the asset is available for use.",
              "Licence: review useful life each year; if renewal at nominal cost is expected indefinitely, stop amortising and test for impairment annually.",
            ],
            rules: [
              "IAS 38: all six criteria must be met before capitalisation starts.",
              "A change from finite to indefinite life is a change in estimate (prospective).",
              "Intangibles with indefinite lives are tested for impairment annually; the cost model does not allow write-ups above cost less amortisation.",
            ],
            mistakes: [
              "Starting capitalisation when most criteria were met rather than all (examiners' point).",
              "Starting amortisation when capitalisation starts.",
              "Continuing to amortise a licence that is now indefinite-life.",
            ],
            example: {
              title: "Development project and indefinite-life licence",
              scenario: [
                "Research January–February 2024 cost Rs 5m. Development March–June 2024 cost Rs 5m a month; all criteria were met on 1 May 2024. July–December 2024 directly attributable costs were Rs 30m, plus Rs 2m of allocated admin overhead and Rs 1m of advertising. The system was available for use on 1 January 2025 (life 4 years).",
                "A licence bought on 1 January 2024 for Rs 36m (6-year term) was amortised in 2024. From 1 January 2025 it can be renewed indefinitely at nominal cost and the company intends to renew. Recoverable amount at 31 December 2025: Rs 40m.",
              ],
              required: "Calculate the 2024 and 2025 figures.",
              solution: [
                { table: { head: ["Rs m", "2025", "2024"], rows: [["Development cost: May–Jun 10 + Jul–Dec 30", "40.0", "40.0"], ["Amortisation", "(10.0)", "–"], ["Expensed in P&L (research, Mar–Apr dev., overhead, advertising)", "–", "18.0"], ["Licence carrying amount", "30.0", "30.0"], ["Licence amortisation", "–", "6.0"]] } },
              ],
              answer: "Platform Rs 30m at end-2025 after Rs 10m amortisation. Licence stays at Rs 30m: no amortisation from 2025, no impairment, no write-up to Rs 40m.",
            },
          },
        },
        {
          n: 6, format: "Written", page: 5, commentsPage: 3, passRate: 42,
          summary: "Provision, disclosure or nothing for three matters: contamination covered by a published policy, a legal requirement the company chose not to meet, and a closure decided before but announced after year-end.",
          parts: [{ area: "provisions", marks: 8 }],
          walkthrough: {
            approach: [
              "Test each matter for a present obligation at the reporting date: legal, or constructive from published policy and past practice.",
              "Ask whether the expenditure can be avoided by future actions; if so, no obligation.",
              "Restructuring needs a detailed formal plan and a valid expectation in those affected before year-end.",
              "If no provision, decide whether disclosure is needed (contingent liability or material non-adjusting event).",
            ],
            rules: [
              "IAS 37: a constructive obligation arises from an established pattern of practice or published policy that creates valid expectations.",
              "No provision for future operating costs or costs avoidable by changing the way the business operates.",
              "A board decision alone does not create a restructuring obligation.",
              "IAS 10: material non-adjusting events are disclosed (nature and estimated effect).",
            ],
            mistakes: [
              "Concluding 'no legal requirement, no provision' and missing the constructive obligation (examiners' point).",
              "Providing for future compliance costs because a law has been enacted.",
              "Not disclosing a material post-year-end restructuring announcement.",
            ],
            example: {
              title: "Three provision decisions",
              scenario: [
                "(a) A retailer has always refunded unhappy customers within 60 days, beyond its legal duty, and advertises this. (b) A new law requires dust filters by 2027; none are fitted yet and the company has not breached the law at year-end. (c) The board decided in December to relocate a plant; staff and suppliers were told in February.",
              ],
              required: "Provision, disclosure, or neither?",
              solution: [
                { table: { head: ["Matter", "Conclusion", "Reason"], rows: [["(a) Refunds", "Provision", "Constructive obligation from published policy and practice; estimate expected refunds"], ["(b) Filters", "Neither for the filter cost", "Expenditure avoidable by future action; no obligation yet. A penalty provision arises only once a breach occurs"], ["(c) Relocation", "Disclose as non-adjusting event", "No valid expectation created before year-end, so no provision"]] } },
              ],
              answer: "Provide for (a); nothing for (b); disclose (c) if material.",
            },
          },
        },
        {
          n: 7, format: "Numerical", page: 5, commentsPage: 3, passRate: 38,
          summary: "Lessee accounting for a machine lease with half-yearly rentals in advance and a purchase option: right-of-use note under the revaluation model, and lease liability movement with current and non-current split.",
          parts: [{ area: "leases", marks: 8, label: "(a)" }, { area: "leases", marks: 6, label: "(b)" }],
          walkthrough: {
            approach: [
              "Lease liability: PV of payments not yet made at commencement (the first rental in advance is paid on day one) plus the purchase option if reasonably certain, at the lessee's rate per period.",
              "ROU asset = liability + payments made at or before commencement + initial direct costs.",
              "Depreciation over useful life if the option is reasonably certain to be exercised.",
              "Revaluation: depreciate first, then compare with fair value. A first decrease goes to P&L; a later increase reverses that loss through P&L first.",
              "Liability schedule by half-year; accrue interest to the year-end; current portion = amount that will be paid off within 12 months, excluding future interest.",
            ],
            rules: [
              "IFRS 16: use the implicit rate only if the lessee can readily determine it; otherwise the incremental borrowing rate.",
              "Purchase options reasonably certain of exercise are lease payments.",
              "The revaluation model may be applied to ROU assets in a class of PPE carried at revaluation.",
            ],
            mistakes: [
              "Using the lessor's implicit rate the lessee did not know, or treating advance rentals as arrears (examiners' point).",
              "Not accruing interest for the last half-year, understating the year-end liability.",
              "Current portion taken as the next two rentals in full.",
            ],
            example: {
              title: "Lease with rentals in advance and a purchase option",
              scenario: [
                "From 1 January 2024 a company leases a machine: five half-yearly rentals of Rs 20m in advance (1 January 2024 to 1 January 2026) and a purchase option of Rs 30m on 30 June 2026 that it will exercise. Rate 4% per half-year. Initial direct costs Rs 2m. Useful life 6 years, residual Rs 5m. Revaluation model: fair value Rs 85m at 31 December 2024 and Rs 75m at 31 December 2025.",
              ],
              required: "Calculate the ROU asset and lease liability figures for 2024 and 2025.",
              solution: [
                { table: { head: ["Lease liability", "Rs m"], rows: [["PV at 1 Jan 2024 of 4 rentals + option", "97.256"], ["Interest 2024", "7.136"], ["Paid 1 Jul 2024", "(20.000)"], ["31 Dec 2024", "84.392"], ["… current (paid off by 1 Jul 2025)", "37.424"], ["… non-current", "46.967"], ["Interest 2025", "4.454"], ["Paid 1 Jan and 1 Jul 2025", "(40.000)"], ["31 Dec 2025 (all current)", "48.846"]] } },
                { table: { head: ["ROU asset", "Rs m"], rows: [["Cost: 97.256 + 20 + 2", "119.256"], ["Depreciation 2024: (119.256 − 5) ÷ 6", "(19.043)"], ["Carrying amount before revaluation", "100.213"], ["Revaluation loss 2024 to P&L", "(15.213)"], ["31 Dec 2024", "85.000"], ["Depreciation 2025: (85 − 5) ÷ 5", "(16.000)"], ["Revaluation gain 2025 to P&L (reverses part of 2024 loss)", "6.000"], ["31 Dec 2025", "75.000"]] } },
              ],
              answer: "Liability Rs 84.392m (2024) and Rs 48.846m (2025); ROU asset Rs 85m and Rs 75m.",
            },
          },
        },
        {
          n: 8, format: "Numerical", page: 6, commentsPage: 3, passRate: 42,
          summary: "Consolidated statement of financial position after a late-year acquisition with contingent consideration and an unrecognised brand, an associate with an asset sale, intra-group inventory and plant, an unrecorded subsidiary dividend and FVOCI investments.",
          parts: [{ area: "consolidation", marks: 19 }], alsoTests: ["associates", "fin-inst"],
          walkthrough: {
            approach: [
              "Net assets at acquisition: share capital, retained earnings at that date, fair value adjustments (including unrecognised intangibles).",
              "Consideration: cash + contingent consideration at acquisition-date fair value (regardless of probability). Later changes go to P&L.",
              "Goodwill = consideration + NCI at fair value − net assets. Negative goodwill is reassessed and then recognised as a gain.",
              "Post-acquisition adjustments: intangible amortisation, unrealised profits (inventory and assets), dividends declared.",
              "Associate: cost + share of post-acquisition profits − share of unrealised profit on sales to it.",
            ],
            rules: [
              "IFRS 3: contingent consideration recognised at fair value at acquisition; remeasurement of a liability through P&L.",
              "A bargain purchase gain is recognised in P&L after reassessing the identification and measurement.",
              "IAS 28: eliminate the investor's share of unrealised profit on upstream and downstream sales.",
            ],
            mistakes: [
              "Leaving out contingent consideration because payment was not probable at acquisition (examiners' point).",
              "Showing a bargain purchase as negative goodwill in assets.",
              "Eliminating unrealised profit on full-year intra-group sales instead of post-acquisition sales only.",
              "Ignoring the subsidiary's declared but unrecorded dividend.",
            ],
            example: {
              title: "Contingent consideration and a bargain purchase",
              scenario: [
                "P acquires 60% of S on 1 July 2025 for Rs 300m cash plus contingent consideration with a fair value of Rs 80m (Rs 95m at 31 December 2025). NCI's fair value is Rs 180m. S's net assets are Rs 550m at book value plus an unrecognised brand worth Rs 50m (5-year life). P also holds 30% of associate A and sold A a machine on 1 October 2025 at a Rs 10m gain (5 years' life left). On 31 December S declared a dividend of Rs 20m, unrecorded by S; P has recorded its Rs 12m receivable.",
              ],
              required: "Calculate goodwill, the contingent consideration effect, the brand amortisation, the associate adjustment and the dividend effect.",
              solution: [
                { table: { head: ["Working", "Rs m"], rows: [["Goodwill: 300 + 80 + 180 − 600", "(40) → bargain purchase gain"], ["Contingent consideration increase (P&L)", "15"], ["Brand amortisation: 50 ÷ 5 × 6/12", "5"], ["Unrealised gain on sale to A: (10 − 10 ÷ 5 × 3/12) × 30%", "2.85"], ["Dividend: S liability", "20 (12 eliminated, 8 owed to NCI)"]] } },
              ],
              answer: "Gain on bargain purchase Rs 40m in P&L after reassessment; contingent consideration liability Rs 95m; reduce the associate by Rs 2.85m; show Rs 8m dividend payable to NCI.",
            },
          },
        },
        {
          n: 9, format: "Numerical", page: 7, commentsPage: 4, passRate: 8,
          summary: "Explanations with dated journal entries for three revenue arrangements: two linked contracts priced off stand-alone values, a shelf-space payment to a customer, and a machine sale with a discounted parts option and a general voucher.",
          parts: [{ area: "revenue", marks: 7, label: "(a)" }, { area: "revenue", marks: 5, label: "(b)" }, { area: "revenue", marks: 6, label: "(c)" }],
          walkthrough: {
            approach: [
              "Combine contracts negotiated as a package; identify the performance obligations.",
              "Allocate the total price by relative stand-alone selling prices.",
              "Payments to a customer that are not for a distinct good or service reduce the transaction price as related revenue is recognised.",
              "An option to buy at a discount the customer would not otherwise get is a material right: allocate part of the price to it and recognise as the option is used or expires. Discounts available to everyone are not.",
              "For each part: explain, then give dated journal entries with workings.",
            ],
            rules: [
              "IFRS 15: combine contracts entered into at or near the same time with the same customer if negotiated as a package.",
              "Allocate on relative stand-alone selling prices, not on contract prices.",
              "Consideration payable to a customer reduces revenue unless it buys a distinct good or service.",
              "Material rights are separate performance obligations.",
            ],
            mistakes: [
              "Recognising revenue on receipt of cash or at contract signing (examiners' point).",
              "Treating a shelf-space payment as an expense, or deducting it all at once.",
              "Treating a general voucher like a material right, or vice versa.",
            ],
            example: {
              title: "Three IFRS 15 arrangements",
              scenario: [
                "(a) A package of goods (SSP Rs 45m) and two years' support (SSP Rs 15m) is sold for Rs 50m in total; goods delivered and support started on 1 November 2025. (b) The company paid a customer Rs 3m on 1 July 2025 for 12 months of display space; it expects Rs 60m of sales to that customer over the 12 months, Rs 20m of which fell in 2025. (c) A machine (SSP Rs 20m) sold for Rs 20m on 1 October 2025 includes an option to buy up to 500 kits at Rs 6,000 (SSP Rs 10,000); 400 are expected to be bought. 100 were bought by year-end.",
              ],
              required: "Calculate 2025 revenue for each.",
              solution: [
                { table: { head: ["Part", "Working", "Rs m"], rows: [["(a) Goods", "50 × 45 ÷ 60", "37.50"], ["(a) Support allocated", "50 × 15 ÷ 60 = 12.5; 2025: × 2/24", "1.04"], ["(b) Revenue reduction", "3 × 20 ÷ 60 (rest is a prepayment)", "(1.00)"], ["(c) Option SSP", "400 × (10,000 − 6,000) = 1.6", ""], ["(c) Machine", "20 × 20 ÷ 21.6", "18.52"], ["(c) Kits", "100 × 6,000 + 1.48 × 100 ÷ 400", "0.97"]] } },
              ],
              answer: "(a) Rs 38.54m with Rs 11.46m deferred; (b) revenue reduced by Rs 1m, Rs 2m prepaid; (c) Rs 19.49m with Rs 1.11m of the option still deferred.",
            },
          },
        },
      ],
    },
  ],
};
