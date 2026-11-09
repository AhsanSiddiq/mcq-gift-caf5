import type { Paper } from "../pastPapers";

/*
 * ICAI CA Intermediate Paper 4: Cost and Management Accounting (new scheme).
 * Indexed from ICAI's official suggested answers for September 2026, May 2026
 * and January 2026 (each reproduces the question requirements and marks), the
 * September 2026 question paper (text PDF) and ICAI's January 2026 examiners'
 * comments. The May and January question-paper PDFs are scanned images, so
 * question-paper page links are given only for September 2026.
 * All descriptions and practice material are our own.
 */

const M = "/ca-inter/ca-inter-cma/mcqs";
const CDN = "https://resource.cdn.icai.org/";
const RULES = "Part I: 15 compulsory MCQs (30 marks). Part II: Q1 compulsory; answer any four of Q2–Q6 (14 marks each).";

export const icaiInterCma: Paper = {
  slug: "icai-ca-inter-cma",
  body: "icai",
  level: "CA-INTER",
  code: "CA Inter Paper 4",
  title: "Cost and Management Accounting",
  scheme: "New scheme",
  officialUrl: "https://www.icai.org/post/question-papers-intermediate-course",
  format: "Written exam · 100 marks · 3 hours · Part I: 30 marks of MCQs (OMR) · Part II: 70 marks, Q1 compulsory plus any four of Q2–Q6",
  mcqHub: M,
  keywords: ["CA Inter costing past papers", "CA Inter CMA question paper", "CA Inter cost and management accounting suggested answers", "ICAI CA Inter paper 4 past papers", "CA Inter CMA topic wise past papers", "CA Inter costing RTP MTP"],
  overview: [
    "CA Intermediate Paper 4 under ICAI's new scheme has 30 marks of case-based and standalone MCQs (Part I) and 70 marks of descriptive questions (Part II). In Part II, Question 1 is compulsory and candidates pick four of the remaining five, so a topic can appear without every candidate attempting it.",
    "Across the three sittings indexed here, the MCQ cases rotated between costing systems (ABC, process, overheads) and planning tools (budgets, EOQ, CVP), while Part II consistently mixed a cost sheet, standard costing variances, a reconciliation or service-costing question and one theory question.",
  ],
  notes: [
    "Marks in the topical index include optional questions (Q2–Q6), so each sitting shows 114 marks set against 100 marks attempted.",
    "ICAI published examiners' comments for January 2026; we could not find comments for May or September 2026 on ICAI's suggested-answers pages, so those analyses are marked unavailable.",
    "The May 2026 and January 2026 question papers on ICAI's site are scanned images; their topics are indexed from ICAI's suggested answers, which restate each question.",
  ],
  resources: [
    { label: "ICAI question papers – Intermediate", url: "https://www.icai.org/post/question-papers-intermediate-course" },
    { label: "ICAI suggested answers – Intermediate", url: "https://www.icai.org/post/suggested-answer-intermediate" },
    { label: "ICAI BoS Knowledge Portal: RTPs", url: "https://boslive.icai.org/education_content_rtp.php" },
    { label: "ICAI BoS Knowledge Portal: Mock Test Papers (MTPs)", url: "https://boslive.icai.org/education_content_modelTestPapers.php" },
  ],
  areas: [
    { id: "standard", label: "Standard costing and variances", mcq: `${M}/chapter-12-standard-costing` },
    { id: "overheads", label: "Overheads and cost allocation", mcq: `${M}/chapter-4-overheads-absorption-costing-method` },
    { id: "marginal", label: "Marginal costing and CVP", mcq: `${M}/chapter-13-marginal-costing` },
    { id: "budgets", label: "Budgets and budgetary control", mcq: `${M}/chapter-14-budgets-and-budgetary-control` },
    { id: "material", label: "Material cost and inventory control", mcq: `${M}/chapter-2-material-cost` },
    { id: "employee", label: "Employee cost and incentives", mcq: `${M}/chapter-3-employee-cost-and-direct-expenses` },
    { id: "process", label: "Process and operation costing", mcq: `${M}/chapter-9-process-and-operation-costing` },
    { id: "cost-sheet", label: "Cost sheet", mcq: `${M}/chapter-6-cost-sheet` },
    { id: "abc", label: "Activity-based costing", mcq: `${M}/chapter-5-activity-based-costing` },
    { id: "systems", label: "Cost accounting systems and reconciliation", mcq: `${M}/chapter-7-cost-accounting-systems` },
    { id: "batch-job", label: "Unit, batch and job costing", mcq: `${M}/chapter-8-unit-batch-and-job-costing` },
    { id: "service", label: "Service costing", mcq: `${M}/chapter-11-service-costing` },
    { id: "joint", label: "Joint products and by-products", mcq: `${M}/chapter-10-joint-products-and-by-products` },
    { id: "intro", label: "Introduction to cost and management accounting", mcq: `${M}/chapter-1-introduction-to-cost-and-management-accounting` },
  ],
  sittings: [
    {
      slug: "september-2026",
      name: "September 2026",
      date: "2026-09-08",
      paperUrl: `${CDN}94186bos-aps4903-int-sep2026-p4.pdf`,
      answersUrl: `${CDN}94856bos-aps6590-sep2026-sa4.pdf`,
      rules: RULES,
      questions: [
        {
          n: 0, format: "MCQ", page: 2, answerPage: 1,
          summary: "Fifteen 2-mark MCQs: a customer-profitability ABC case, a raw-material purchase budget case, and standalone items on process costing, Halsey bonus, FIFO issues, overtime premium and machine capacity.",
          parts: [
            { area: "abc", marks: 10, label: "MCQs 1–5" }, { area: "budgets", marks: 10, label: "MCQs 6–10" },
            { area: "process", marks: 2, label: "MCQ 11" }, { area: "employee", marks: 2, label: "MCQ 12" },
            { area: "material", marks: 2, label: "MCQ 13" }, { area: "employee", marks: 2, label: "MCQ 14" },
            { area: "overheads", marks: 2, label: "MCQ 15" },
          ],
        },
        {
          n: 1, format: "Numerical", page: 10, answerPage: 8,
          summary: "Product ranking under a limiting factor with marginal costing, EOQ and annual ordering cost, and reciprocal service department apportionment.",
          parts: [{ area: "marginal", marks: 7, label: "(a)" }, { area: "material", marks: 4, label: "(b)" }, { area: "overheads", marks: 3, label: "(c)" }],
        },
        {
          n: 2, format: "Numerical", page: 12, answerPage: 12, optional: true,
          summary: "Wages budget with production, labour hours and overtime for two products, and a job cost sheet using overhead rates derived from last year's costs.",
          parts: [{ area: "budgets", marks: 7, label: "(a)" }, { area: "batch-job", marks: 7, label: "(b)" }],
        },
        {
          n: 3, format: "Numerical", page: 15, answerPage: 17, optional: true,
          summary: "Reconciliation of cost and financial profit, and cost per passenger-kilometre and fare for an intercity bus contract.",
          parts: [{ area: "systems", marks: 7, label: "(a)" }, { area: "service", marks: 7, label: "(b)" }],
          walkthrough: {
            approach: [
              "Reconciliation: start from one profit (usually cost) and list every item treated differently in the other set of books.",
              "For each item ask: does it make financial profit higher or lower than cost profit? Add or deduct accordingly.",
              "Typical differences: under/over-absorbed overheads, different inventory valuations, purely financial income and expenses, notional costs charged only in cost accounts.",
              "Service costing: build the annual operating quantity first (vehicles × trips × distance × occupancy × days), then total cost per period, then cost per unit and the fare with the required margin.",
            ],
            rules: [
              "Over-absorption in cost accounts means cost profit is understated relative to actual: add it to reach financial profit (and deduct under-absorption).",
              "Items appearing only in financial accounts (dividends received, interest on investments, losses on sale of assets, preliminary expenses) are adjusted in full.",
              "Notional charges (interest on capital, notional rent) appear only in cost accounts: add them back to reach financial profit.",
              "Passenger-km = distance × passengers carried; check whether the question gives occupancy as a percentage of seats.",
            ],
            layout: { head: ["Reconciliation statement", "₹"], rows: [["Profit as per cost accounts", ""], ["Add: items increasing financial profit", ""], ["Less: items reducing financial profit", ""], ["Profit as per financial accounts", ""]] },
            mistakes: [
              "Adding and deducting the same item the wrong way round; write 'financial higher or lower?' beside each item.",
              "Reconciling stock differences on opening and closing stock in the same direction (they work in opposite directions).",
              "Service costing: forgetting idle days or occupancy when computing the operating quantity.",
            ],
            example: {
              title: "Reconciling cost and financial profit",
              scenario: [
                "A manufacturer's cost accounts show a profit of ₹4,50,000. In the financial accounts: actual factory overheads exceeded the amount absorbed in cost accounts by ₹30,000; closing stock was valued ₹20,000 lower than in cost accounts; dividends received were ₹15,000; preliminary expenses of ₹10,000 were written off. The cost accounts include notional interest on capital of ₹25,000.",
              ],
              required: "Calculate the profit as per financial accounts.",
              solution: [
                { table: { head: ["Item", "₹"], rows: [["Profit as per cost accounts", "4,50,000"], ["Add: dividends received (financial only)", "15,000"], ["Add: notional interest (cost only)", "25,000"], ["Less: under-absorbed factory overheads", "(30,000)"], ["Less: lower closing stock in financial books", "(20,000)"], ["Less: preliminary expenses written off", "(10,000)"], ["Profit as per financial accounts", "4,30,000"]] } },
              ],
              answer: "₹4,30,000.",
            },
          },
        },
        {
          n: 4, format: "Numerical", page: 17, answerPage: 22, optional: true,
          summary: "Labour variances for three grades of worker including revised standard hours, and the input quantity and output cost in a FIFO process.",
          parts: [{ area: "standard", marks: 9, label: "(a)" }, { area: "process", marks: 5, label: "(b)" }],
        },
        {
          n: 5, format: "Numerical", page: 19, answerPage: 27, optional: true,
          summary: "Selected cost sheet figures from partial data, and blanket versus departmental overhead rates for pricing a job with under/over recovery.",
          parts: [{ area: "cost-sheet", marks: 7, label: "(a)" }, { area: "overheads", marks: 7, label: "(b)" }],
        },
        {
          n: 6, format: "Written", answerPage: 33, optional: true,
          summary: "Classifying listed costs, short answers on accounting for by-products and NRV-based joint cost apportionment, and either cost sheet treatment of unusual items or bill of materials vs material requisition.",
          parts: [{ area: "intro", marks: 5, label: "(a)" }, { area: "joint", marks: 5, label: "(b)" }, { area: "cost-sheet", marks: 4, label: "(c) or alternative" }],
          alsoTests: ["material"],
        },
      ],
    },
    {
      slug: "may-2026",
      name: "May 2026",
      date: "2026-05-15",
      dateLabel: "May 2026",
      paperUrl: `${CDN}92190bos-aps4903-int-may2026-p4.pdf`,
      answersUrl: `${CDN}92875bos-sa-int-may2026-p4.pdf`,
      rules: RULES,
      questions: [
        {
          n: 0, format: "MCQ", answerPage: 1,
          summary: "Fifteen 2-mark MCQs: an inter-process profit case, a machine hour rate case, and standalone items on re-order quantity, worker earnings, job costing, bus operating cost and break-even from two years' results.",
          parts: [
            { area: "process", marks: 10, label: "MCQs 1–5" }, { area: "overheads", marks: 10, label: "MCQs 6–10" },
            { area: "material", marks: 2, label: "MCQ 11" }, { area: "employee", marks: 2, label: "MCQ 12" },
            { area: "batch-job", marks: 2, label: "MCQ 13" }, { area: "service", marks: 2, label: "MCQ 14" },
            { area: "marginal", marks: 2, label: "MCQ 15" },
          ],
        },
        {
          n: 1, format: "Numerical", answerPage: 8,
          summary: "Batch cost per unit for a special order, material variances, and reconciliation of a cost-accounts loss with financial accounts.",
          parts: [{ area: "batch-job", marks: 5, label: "(a)" }, { area: "standard", marks: 5, label: "(b)" }, { area: "systems", marks: 4, label: "(c)" }],
        },
        {
          n: 2, format: "Numerical", answerPage: 12, optional: true,
          summary: "Cost sheet for a textile product, and profit at changed capacity levels using contribution analysis.",
          parts: [{ area: "cost-sheet", marks: 7, label: "(a)" }, { area: "marginal", marks: 7, label: "(b)" }],
        },
        {
          n: 3, format: "Numerical", answerPage: 16, optional: true,
          summary: "Joint products with further processing across two departments, and fixed overhead variances.",
          parts: [{ area: "joint", marks: 8, label: "(a)" }, { area: "standard", marks: 6, label: "(b)" }],
        },
        {
          n: 4, format: "Numerical", answerPage: 20, optional: true,
          summary: "Sales budget by product and channel with budgeted vs actual comparison, and labour turnover under three methods.",
          parts: [{ area: "budgets", marks: 9, label: "(a)" }, { area: "employee", marks: 5, label: "(b)" }],
        },
        {
          n: 5, format: "Numerical", answerPage: 23, optional: true,
          summary: "Product profit under traditional absorption versus activity-based costing, and profit, P/V ratio, break-even and fixed cost from margin-of-safety data.",
          parts: [{ area: "abc", marks: 10, label: "(a)" }, { area: "marginal", marks: 4, label: "(b)" }],
          walkthrough: {
            approach: [
              "Traditional: total production overheads ÷ total direct labour (or machine) hours gives one rate; apply hours per unit.",
              "ABC: for each activity pool, rate = pool cost ÷ total driver quantity; charge each product its driver usage × rate.",
              "Divide each product's overhead by units produced (not sold) to get overhead per unit, then rebuild unit cost and profit on units sold.",
              "Compare and explain why the low-volume or complex product absorbs more under ABC.",
            ],
            rules: [
              "Volume-based rates spread batch- and product-level costs in proportion to volume, which under-costs low-volume, complex products.",
              "ABC traces overheads through cost drivers that reflect what causes the cost (set-ups, inspections, orders).",
              "Inventory is valued at production cost per unit; profit uses units sold.",
            ],
            mistakes: [
              "Dividing activity costs by units sold instead of units produced.",
              "Using one driver for all pools.",
              "Not explaining the difference between the two results when asked to comment.",
            ],
            example: {
              title: "Traditional vs ABC overhead per unit",
              scenario: [
                "Two products: P (1,000 units, 2 labour hours each) and Q (500 units, 2 labour hours each). Overheads ₹1,20,000: set-up costs ₹60,000 (P 5 set-ups, Q 15) and inspection costs ₹60,000 (P 10 inspections, Q 30). Traditionally overheads are absorbed on labour hours.",
              ],
              required: "Compare overhead per unit under both methods.",
              solution: [
                { table: { head: ["Working", "P", "Q"], rows: [["Traditional: ₹1,20,000 ÷ 3,000 hours = ₹40/hour × 2", "₹80", "₹80"], ["Set-ups: ₹60,000 ÷ 20 = ₹3,000 each", "₹15,000", "₹45,000"], ["Inspections: ₹60,000 ÷ 40 = ₹1,500 each", "₹15,000", "₹45,000"], ["ABC total", "₹30,000", "₹90,000"], ["ABC per unit", "₹30", "₹180"]] } },
              ],
              answer: "P falls from ₹80 to ₹30 per unit and Q rises from ₹80 to ₹180: Q drives most set-ups and inspections despite its lower volume.",
            },
          },
        },
        {
          n: 6, format: "Written", answerPage: 28, optional: true,
          summary: "Theory: the demand-pull (JIT) inventory system, cost control versus cost reduction, and either biometric attendance systems or spoiled and defective work.",
          parts: [{ area: "material", marks: 5, label: "(a)" }, { area: "intro", marks: 5, label: "(b)" }, { area: "employee", marks: 4, label: "(c) or alternative" }],
          alsoTests: ["batch-job"],
        },
      ],
    },
    {
      slug: "january-2026",
      name: "January 2026",
      date: "2026-01-15",
      dateLabel: "January 2026",
      paperUrl: `${CDN}90301bos-aps3856-int-jan2026-p4.pdf`,
      answersUrl: `${CDN}91202bos-aps4356-sa-int-p4.pdf`,
      commentsUrl: `${CDN}91582bos-aps4356-int-ec-g2.pdf`,
      rules: RULES,
      themes: [
        "Performance was strongest on incentive-plan earnings, cost classification and the material and labour variances question.",
        "Joint products, the reconciliation of cost and financial profit, service costing, overhead absorption and budgetary control ratios were below average, often because one early figure (a by-product credit, normal capacity, standard hours) was wrong and carried through.",
        "The process costing question with an accidental abnormal loss and the theory parts on ABC and budgetary control were rated poor.",
      ],
      questions: [
        {
          n: 0, format: "MCQ", answerPage: 1,
          summary: "Fifteen 2-mark MCQs: a multi-product CVP case, an EOQ case for two materials, and standalone items on labour variances, job overhead recovery, operator requirements, LIFO issues and machine spare parts.",
          parts: [
            { area: "marginal", marks: 10, label: "MCQs 1–5" }, { area: "material", marks: 10, label: "MCQs 6–10" },
            { area: "standard", marks: 2, label: "MCQ 11" }, { area: "overheads", marks: 2, label: "MCQ 12" },
            { area: "employee", marks: 2, label: "MCQ 13" }, { area: "material", marks: 2, label: "MCQ 14" },
            { area: "overheads", marks: 2, label: "MCQ 15" },
          ],
        },
        {
          n: 1, format: "Numerical", answerPage: 8, commentsPage: 1,
          summary: "Allocating a shared packaging cost across four products, joint costs with a by-product and a further-processing decision, and Halsey and Rowan earnings.",
          parts: [{ area: "overheads", marks: 5, label: "(a)" }, { area: "joint", marks: 5, label: "(b)" }, { area: "employee", marks: 4, label: "(c)" }],
        },
        {
          n: 2, format: "Numerical", answerPage: 12, commentsPage: 1, optional: true,
          summary: "Full cost sheet working back to raw material consumed and sales, and a process account with normal waste, an accidental abnormal loss and damaged containers.",
          parts: [{ area: "cost-sheet", marks: 9, label: "(a)" }, { area: "process", marks: 5, label: "(b)" }],
          walkthrough: {
            approach: [
              "Lay out the cost sheet skeleton first: materials consumed, prime cost, factory cost, cost of production, cost of goods sold, cost of sales, profit, sales.",
              "Where a figure is missing, work backwards from the next known total.",
              "Adjust work-in-progress at factory cost and finished goods after cost of production.",
              "If profit is a percentage of sales, sales = cost of sales ÷ (1 − margin).",
            ],
            rules: [
              "Raw material consumed = opening stock + purchases (incl. carriage inwards) − closing stock.",
              "Opening and closing WIP adjust works cost; opening and closing finished goods adjust cost of production.",
              "Production-related administration belongs in cost of production; selling and distribution sits below cost of goods sold.",
            ],
            layout: { head: ["Cost sheet", "₹"], rows: [["Raw materials consumed", ""], ["Direct wages and direct expenses", ""], ["Prime cost", ""], ["Factory overheads ± WIP", ""], ["Works cost", ""], ["Production administration", ""], ["Cost of production ± finished goods", ""], ["Cost of goods sold", ""], ["Selling and distribution", ""], ["Cost of sales", ""], ["Profit", ""], ["Sales", ""]] },
            mistakes: [
              "Deriving raw material consumed from cost of production instead of the materials data (examiners' point).",
              "Adjusting WIP after cost of production, or finished goods before it.",
              "Computing profit as a percentage of cost when it is given on sales.",
            ],
            example: {
              title: "Cost sheet from partial data",
              scenario: [
                "Raw materials: opening ₹50,000, purchases ₹4,00,000, closing ₹60,000. Direct wages ₹2,00,000; direct expenses ₹30,000. Factory overheads ₹1,50,000. WIP: opening ₹40,000, closing ₹50,000. Production administration ₹20,000. Finished goods: opening ₹60,000, closing ₹90,000. Selling and distribution ₹50,000. Profit is 20% of sales.",
              ],
              required: "Prepare the cost sheet and find sales.",
              solution: [
                { table: { head: ["Cost sheet", "₹"], rows: [["Raw materials consumed: 50,000 + 4,00,000 − 60,000", "3,90,000"], ["Direct wages + direct expenses", "2,30,000"], ["Prime cost", "6,20,000"], ["Factory overheads", "1,50,000"], ["Add opening WIP / less closing WIP", "(10,000)"], ["Works cost", "7,60,000"], ["Production administration", "20,000"], ["Cost of production", "7,80,000"], ["Add opening / less closing finished goods", "(30,000)"], ["Cost of goods sold", "7,50,000"], ["Selling and distribution", "50,000"], ["Cost of sales", "8,00,000"], ["Profit: 8,00,000 × 20/80", "2,00,000"], ["Sales", "10,00,000"]] } },
              ],
              answer: "Sales ₹10,00,000; profit ₹2,00,000.",
            },
          },
        },
        {
          n: 3, format: "Numerical", answerPage: 17, commentsPage: 1, optional: true,
          summary: "Service costing for loan-application processing at a bank branch, and batch costing for a training course with break-even fee and minimum batch fill.",
          parts: [{ area: "service", marks: 8, label: "(a)" }, { area: "batch-job", marks: 6, label: "(b)" }],
        },
        {
          n: 4, format: "Numerical", answerPage: 20, commentsPage: 1, optional: true,
          summary: "Material, labour and variable overhead variances, and a cost sheet with fixed overheads absorbed at normal capacity reconciled to financial profit.",
          parts: [{ area: "standard", marks: 7, label: "(a)" }, { area: "systems", marks: 7, label: "(b)" }],
        },
        {
          n: 5, format: "Numerical", answerPage: 23, commentsPage: 1, optional: true,
          summary: "Machine-shop overhead with operator and machine hours, capacity and activity ratios, and opportunity cost when choosing between two products.",
          parts: [{ area: "overheads", marks: 6, label: "(a)" }, { area: "budgets", marks: 5, label: "(b)" }, { area: "marginal", marks: 3, label: "(c)" }],
        },
        {
          n: 6, format: "Written", answerPage: 28, commentsPage: 2, optional: true,
          summary: "Theory: classifying expenses by function and variability, choosing an incentive scheme for stated conditions, and either the suitability of ABC or the components of budgetary control.",
          parts: [{ area: "intro", marks: 5, label: "(a)" }, { area: "employee", marks: 5, label: "(b)" }, { area: "abc", marks: 4, label: "(c) or alternative" }],
          alsoTests: ["budgets"],
        },
      ],
    },
  ],
};
