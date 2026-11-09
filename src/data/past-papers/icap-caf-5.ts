import type { Paper } from "../pastPapers";

/*
 * ICAP CAF-5 Management Accounting (Education Scheme 2025).
 * Indexed from the official question papers and examiners' comments for
 * Spring 2026 and Autumn 2026 (read in full). All descriptions, approaches and
 * worked examples are our own; no ICAP text, figures or answers are reproduced.
 */

const M = "/caf/caf-5/mcqs";
const QP = "https://icap.org.pk/view/?add=per/students/exam/caf/question-papers/CAF-5/2026/&file=";
const EC = "https://icap.org.pk/view/?add=per/students/exam/caf/examiner-comments/CAF-5/2026/&file=";
const SA = "https://student.icap.org.pk/education-scheme-2025/suggested-answer/caf/caf-5/";
const LOGIN = "Suggested answers and marking plans sit in ICAP's student area (CRN login required).";

export const icapCaf5: Paper = {
  slug: "icap-caf-5",
  body: "icap",
  level: "CAF",
  code: "CAF-5",
  title: "Management Accounting",
  scheme: "Education Scheme 2025",
  officialUrl: "https://icap.org.pk/past-papers/caf/caf-5/",
  syllabusUrl: "https://student.icap.org.pk/viewfile/?add=students/scheme2025/caf/&file=CAF-Syllabus.pdf",
  format: "Written exam · 100 marks · 3 hours 15 minutes (incl. 15 minutes reading) · Section A short questions + Section B long questions",
  mcqHub: M,
  keywords: ["ICAP CAF-5 past papers", "CAF-5 management accounting past papers", "CAF 5 MA past papers with solutions", "CAF-5 topical past papers", "ICAP cost accounting past papers", "CAF-5 examiners comments"],
  overview: [
    "CAF-5 Management Accounting is the old CAF-3 Cost and Management Accounting paper moved to a new number under the 2025 scheme. Both 2026 papers had nine compulsory questions: a 10-mark MCQ block with part-marks (1 to 2.5 marks each), five Section A questions of 5 to 10 marks, then three Section B questions of 13 to 18 marks.",
    "Decision-making questions are the paper's weak spot. Spring 2026's 18-mark make-or-buy question had a 4% pass rate and Autumn 2026's 18-mark product-discontinuation question 10%. Practise building a full relevant-cost comparison under each option, not just a contribution line.",
  ],
  grid: [
    { id: "A", label: "Costs associated with production", min: 35, max: 45 },
    { id: "B", label: "Cost flow (process, joint products, target costing, variances)", min: 20, max: 30 },
    { id: "C", label: "Cost management, planning and decisions", min: 30, max: 40 },
  ],
  notes: [
    "Only two sittings exist under the 2025 scheme so far. The examiners note that this paper moved from CAF-3 to CAF-5, so legacy CAF-3 CMA papers are useful practice but are not part of this index.",
  ],
  resources: [
    { label: "CAF syllabus (Spring 2027)", url: "https://student.icap.org.pk/viewfile/?add=students/scheme2025/caf/&file=CAF-Syllabus.pdf" },
    { label: "CAF-5 examiners' comments (all sittings)", url: "https://icap.org.pk/students/education-and-training/education-scheme-2025/examiner-comments/caf/caf-5/" },
    { label: "CAF-5 suggested answers", url: SA, note: "ICAP student login required" },
  ],
  areas: [
    { id: "decision", label: "Decision making and relevant costs", grid: "C", mcq: `${M}/chapter-15-decision-making-techniques` },
    { id: "cvp", label: "Cost-volume-profit analysis", grid: "C", mcq: `${M}/chapter-13-cost-volume-profit-cvp-analysis` },
    { id: "variances", label: "Standard costing and variances", grid: "B", mcq: `${M}/chapter-11-variance-analysis` },
    { id: "overheads", label: "Overhead allocation and absorption", grid: "A", mcq: `${M}/chapter-2-overheads` },
    { id: "joint", label: "Joint and by-products", grid: "B", mcq: `${M}/chapter-8-joint-and-by-product-costing` },
    { id: "marginal", label: "Marginal and absorption costing", grid: "A", mcq: `${M}/chapter-9-marginal-costing-and-absorption-costing` },
    { id: "inv-valuation", label: "Inventory valuation", grid: "A", mcq: `${M}/chapter-1-inventory-valuation` },
    { id: "labour", label: "Labour costing and learning curve", grid: "A", mcq: `${M}/chapter-4-labour-costing` },
    { id: "job", label: "Job costing", grid: "A", mcq: `${M}/chapter-6-job-and-service-costing` },
    { id: "inv-mgmt", label: "EOQ, safety stock and reorder levels", grid: "C", mcq: `${M}/chapter-16-inventory-management` },
    { id: "cost-flow", label: "Cost classification and manufacturing accounts", grid: "A", mcq: `${M}/chapter-5-cost-flow-in-production` },
    { id: "abc", label: "Activity-based costing", grid: "A", mcq: `${M}/chapter-3-activity-based-costing` },
    { id: "process", label: "Process costing", grid: "B", mcq: `${M}/chapter-7-process-costing` },
    { id: "target", label: "Target costing", grid: "B", mcq: `${M}/chapter-12-target-costing` },
  ],
  sittings: [
    {
      slug: "spring-2026",
      name: "Spring 2026",
      date: "2026-03-05",
      paperUrl: `${QP}CAF-5-MA-Spring-2026.pdf`,
      commentsUrl: `${EC}CAF-5-Spring-2026.pdf`,
      answersUrl: SA,
      answersNote: LOGIN,
      passRate: 33,
      themes: [
        "The overall result fell, mainly because of the 18-mark make-or-buy question (Q8), which only about 4% passed.",
        "First-attempt candidates did noticeably better (50%) than the overall figure, which the examiners attribute partly to the paper's move from CAF-3.",
        "Recurring errors: ignoring yields and normal losses when working out material needs, using the wrong apportionment basis for overheads, and computing variances that were not asked for.",
      ],
      questions: [
        {
          n: 1, format: "MCQ", page: 1, commentsPage: 1, passRate: 47,
          summary: "Seven MCQs (10 marks) on product cost elements, the abnormal loss entry, safety stock, CVP assumptions, a learning curve total, landed cost of an import and NRV-based joint cost allocation.",
          parts: [
            { area: "cost-flow", marks: 1, label: "(i)" }, { area: "process", marks: 1, label: "(ii)" },
            { area: "inv-mgmt", marks: 1, label: "(iii)" }, { area: "cvp", marks: 1, label: "(iv)" },
            { area: "labour", marks: 1.5, label: "(v)" }, { area: "inv-valuation", marks: 2, label: "(vi)" },
            { area: "joint", marks: 2.5, label: "(vii)" },
          ],
          walkthrough: {
            approach: [
              "Items carry 1 to 2.5 marks: budget roughly 2 minutes per mark and do the higher-mark calculations carefully on the rough page.",
              "For learning curves, compute the cumulative average time for the total units, then multiply by the units.",
              "For joint products, check whether any product is processed further before split-off values are used.",
            ],
            rules: [
              "Learning curve: cumulative average time per unit = time for first unit × (cumulative units)^b, where b = log(learning rate) ÷ log 2.",
              "Landed cost includes purchase price, non-refundable duties and inward freight; adjustable (refundable) taxes are excluded.",
              "NRV at split-off for a product processed further = final sales value − further processing costs.",
              "Abnormal losses are valued like good output and written off to profit or loss.",
            ],
            mistakes: [
              "Multiplying the first-unit time by the learning rate per unit rather than applying the doubling rule.",
              "Loading an adjustable income tax into inventory cost.",
              "Allocating joint costs on final sales value when a product is processed further.",
            ],
            example: {
              title: "Learning curve total",
              scenario: [
                "The first unit of a new product takes 50 labour hours. An 85% learning curve applies (b = −0.2345).",
              ],
              required: "Calculate the total hours for the first 20 units.",
              solution: [
                { table: { head: ["Working", "Value"], rows: [["Cumulative average time: 50 × 20^−0.2345", "24.77 hours"], ["Total for 20 units: 24.77 × 20", "495.4 hours"]] } },
              ],
              answer: "About 495 hours (versus 1,000 hours with no learning).",
            },
          },
        },
        {
          n: 2, format: "Numerical", page: 2, commentsPage: 1, passRate: 83,
          summary: "EOQ for a raw material where output yield, financing cost, variable and fixed storage, delivery charges and procurement costs must be sorted into ordering and holding costs.",
          parts: [{ area: "inv-mgmt", marks: 6 }],
          walkthrough: {
            approach: [
              "Convert sales into material demand, grossing up for yield or normal loss.",
              "Ordering cost per order: only costs that vary with the number of orders (procurement processing, fixed charge per delivery).",
              "Holding cost per unit per year: costs that vary with stock held (financing on purchase price, storage charged per unit per period).",
              "Leave out fixed monthly charges and per-kg transport (they don't change with order size) and safety stock (it doesn't affect EOQ).",
              "EOQ = √(2 × annual demand × ordering cost ÷ holding cost per unit).",
            ],
            rules: [
              "EOQ balances ordering cost against holding cost; only incremental costs belong in each.",
              "Safety stock raises average inventory and holding cost but does not change EOQ.",
            ],
            mistakes: [
              "Not grossing up demand for yield (examiners' point).",
              "Putting per-kg transport in ordering cost, or leaving the per-consignment delivery charge out.",
              "Including the fixed monthly storage charge in holding cost.",
            ],
            example: {
              title: "EOQ with yield and mixed costs",
              scenario: [
                "Budgeted output is 270,000 kg and each kg of material yields 0.9 kg of output. Material costs Rs 200/kg plus Rs 8/kg transport. Finance cost is 12% a year on the purchase price. Warehouse charges are Rs 0.50/kg per month plus a flat Rs 20,000 a month. Each order costs Rs 6,000 to process and each delivery has a fixed charge of Rs 9,000. Safety stock is 10,000 kg.",
              ],
              required: "Calculate the EOQ.",
              solution: [
                { table: { head: ["Working", "Value"], rows: [["Annual demand: 270,000 ÷ 0.9", "300,000 kg"], ["Ordering cost: 6,000 + 9,000", "Rs 15,000 per order"], ["Holding cost: 12% × 200 + 0.50 × 12", "Rs 30 per kg per year"], ["EOQ: √(2 × 300,000 × 15,000 ÷ 30)", "17,321 kg"]] } },
                { text: "Excluded: transport per kg, the flat Rs 20,000 monthly charge and safety stock." },
              ],
              answer: "EOQ ≈ 17,321 kg.",
            },
          },
        },
        {
          n: 3, format: "Numerical", page: 3, commentsPage: 1, passRate: 13,
          summary: "Maximum material price for a new product to hit a profit target, allowing for lost sales of existing products, freed labour hours, overtime above normal capacity, process loss and new supervisors.",
          parts: [{ area: "decision", marks: 10 }], alsoTests: ["labour"],
          walkthrough: {
            approach: [
              "Work backwards: required profit increase + all other incremental costs + lost contribution = revenue − maximum material cost.",
              "Lost contribution: reduce both sales and variable costs of the existing products.",
              "Labour: total hours needed; hours freed and spare normal capacity are paid at normal rate; the rest at the overtime rate.",
              "Material quantity: gross up output for normal loss.",
              "Fixed costs: include only new ones (annualise monthly salaries).",
            ],
            rules: [
              "Relevant costs are future, incremental cash flows caused by the decision.",
              "Opportunity cost (lost contribution) is relevant when resources or sales are displaced.",
              "Normal loss increases the input needed for a given output.",
            ],
            mistakes: [
              "Cutting the existing products' sales without cutting their costs (examiners' point).",
              "Ignoring hours freed by lower production of existing products, or pricing every hour at normal rate.",
              "Monthly supervisor salaries not converted to a year.",
            ],
            example: {
              title: "Maximum material price for a new product",
              scenario: [
                "A company could launch a product selling 1,000,000 kg at Rs 150/kg. Each kg needs 1 kg of material input with a 4% normal loss of input, and 0.04 labour hours. Labour costs Rs 250/hour normally and 150% of that above normal capacity; variable overhead is Rs 500 per hour worked.",
                "The launch would reduce existing contribution by Rs 6m and free 5,000 normal hours; another 10,000 normal hours are currently spare. Four supervisors would be hired at Rs 150,000 a month. Management wants profit to rise by Rs 30m.",
              ],
              required: "Calculate the maximum price per kg of material input.",
              solution: [
                { table: { head: ["Working", "Rs m"], rows: [["Revenue: 1,000,000 × 150", "150.000"], ["Labour normal: 15,000 h × 250", "(3.750)"], ["Labour overtime: (40,000 − 15,000) × 375", "(9.375)"], ["Variable overhead: 40,000 × 500", "(20.000)"], ["Supervisors: 4 × 150,000 × 12", "(7.200)"], ["Lost contribution", "(6.000)"], ["Target profit increase", "(30.000)"], ["Maximum total material cost", "73.675"]] } },
                { text: "Material input = 1,000,000 ÷ 0.96 = 1,041,667 kg." },
              ],
              answer: "Maximum ≈ Rs 70.73 per kg (73,675,000 ÷ 1,041,667).",
            },
          },
        },
        {
          n: 4, format: "Numerical", page: 3, commentsPage: 2, passRate: 74,
          summary: "Two-product break-even sales and margin of safety for next year after price, volume, cost inflation and labour-hour reallocation changes.",
          parts: [{ area: "cvp", marks: 10 }],
          walkthrough: {
            approach: [
              "Get units and cost per unit for each product from the current results.",
              "Project next year product by product: new price, new volume (including units made with freed hours), new unit costs.",
              "Total contribution ÷ total sales = weighted C/S ratio; break-even sales = fixed costs ÷ C/S ratio.",
              "Margin of safety % = (budgeted sales − break-even sales) ÷ budgeted sales.",
            ],
            rules: [
              "Multi-product break-even assumes a constant sales mix.",
              "Labour hours freed from one product can be used for another only if the question says so; convert hours into units with hours per unit.",
            ],
            mistakes: [
              "Changing prices but forgetting the volume changes, or the knock-on effect on variable costs (examiners' point).",
              "Margin of safety computed as break-even ÷ budget.",
            ],
            example: {
              title: "Break-even after a price change",
              scenario: [
                "Product P: 10,000 units at Rs 80, variable cost Rs 50, 2 hours per unit. Product Q: 8,000 units at Rs 100, variable cost Rs 70, 2 hours per unit. Fixed costs Rs 400,000.",
                "Next year Q's price rises 10% and its volume falls 5%; the hours freed are used to make more P. Costs are unchanged.",
              ],
              required: "Calculate next year's break-even sales and margin of safety.",
              solution: [
                { table: { head: ["Product", "Units", "Sales (Rs)", "Contribution (Rs)"], rows: [["Q: 7,600 × 110 / × 40", "7,600", "836,000", "304,000"], ["P: 10,000 + 800 h ÷ 2 = 10,400", "10,400", "832,000", "312,000"], ["Total", "", "1,668,000", "616,000"]] } },
                { text: "C/S ratio = 616,000 ÷ 1,668,000 = 36.93%. Break-even = 400,000 ÷ 0.3693 = Rs 1,083,117." },
              ],
              answer: "Break-even ≈ Rs 1.08m; margin of safety = (1,668,000 − 1,083,117) ÷ 1,668,000 ≈ 35.1%.",
            },
          },
        },
        {
          n: 5, format: "Numerical", page: 4, commentsPage: 2, passRate: 65,
          summary: "Overhead allocation to three production departments with machine-hour and area bases, then reapportionment of two service departments by simultaneous equations.",
          parts: [{ area: "overheads", marks: 9 }],
          walkthrough: {
            approach: [
              "Build total machine hours per department: units × hours per unit for each product, then add.",
              "Allocate each overhead on its stated basis (machine hours, area, percentages).",
              "Set up the two simultaneous equations for the service departments and solve.",
              "Reapportion the solved totals to production departments using their percentages; check the grand total is unchanged.",
            ],
            rules: [
              "Simultaneous equations: S1 = own overhead + share of S2; S2 = own overhead + share of S1.",
              "Repeated distribution gives the same answer but only use it if allowed.",
            ],
            mistakes: [
              "Apportioning on hours per unit instead of total machine hours (examiners' point).",
              "Using repeated distribution when simultaneous equations were required.",
              "Not checking that total overhead after reapportionment equals total before.",
            ],
            example: {
              title: "Reciprocal service departments",
              scenario: [
                "After allocation: production X Rs 50,000, production Y Rs 40,000, service S1 Rs 20,000, service S2 Rs 15,000. S1 serves X 50%, Y 30%, S2 20%. S2 serves X 40%, Y 40%, S1 20%.",
              ],
              required: "Reapportion service costs using simultaneous equations.",
              solution: [
                { text: "S1 = 20,000 + 0.2 S2; S2 = 15,000 + 0.2 S1. Substituting: S1 = 23,000 + 0.04 S1, so S1 = 23,958.33 and S2 = 19,791.67." },
                { table: { head: ["Department", "Rs"], rows: [["X: 50,000 + 0.5 × 23,958.33 + 0.4 × 19,791.67", "69,895.83"], ["Y: 40,000 + 0.3 × 23,958.33 + 0.4 × 19,791.67", "55,104.17"], ["Total (check)", "125,000.00"]] } },
              ],
              answer: "X Rs 69,896; Y Rs 55,104.",
            },
          },
        },
        {
          n: 6, format: "Numerical", page: 4, commentsPage: 2, passRate: 25,
          summary: "Closing inventory for two products under FIFO with missing units, damaged units that can be sold as-is or repaired, post-year-end price rises and selling costs tied to sales value.",
          parts: [{ area: "inv-valuation", marks: 9 }],
          walkthrough: {
            approach: [
              "Fix quantities: physical units, less any units found missing (abnormal loss), split into good and damaged.",
              "Cost per unit under FIFO: closing units come from the latest production.",
              "NRV for good units: current selling price less proportional selling costs.",
              "Damaged units: compare NRV as-is with NRV after repair and use the higher.",
              "Value each group at the lower of cost and NRV, then total.",
            ],
            rules: [
              "IAS 2 / costing: inventory at the lower of cost and NRV, item by item or group by group.",
              "Use selling prices in force at the reporting date.",
              "Missing units are written off as abnormal loss, not valued.",
            ],
            mistakes: [
              "Using last year's prices for NRV (examiners' point).",
              "Using the damaged as-is price in the repaired-sale option.",
              "Leaving missing units in the count.",
            ],
            example: {
              title: "Damaged units: repair or sell as-is",
              scenario: [
                "Records show 10,000 units at FIFO cost Rs 4,000 each, but 150 are missing (abnormal). The 9,850 on hand include 200 damaged units. From the reporting date the price is Rs 5,000. Selling costs are 4% of sales value. Damaged units sell for Rs 3,200 as they are, or for full price after Rs 900 of repairs.",
              ],
              required: "Value closing inventory.",
              solution: [
                { table: { head: ["Group", "NRV per unit", "Value"], rows: [["Good: 5,000 × 96% = 4,800 > cost", "4,800", "9,650 × 4,000 = Rs 38,600,000"], ["Damaged as-is: 3,200 × 96%", "3,072", ""], ["Damaged repaired: 4,800 − 900", "3,900", "200 × 3,900 = Rs 780,000"], ["Closing inventory", "", "Rs 39,380,000"]] } },
              ],
              answer: "Rs 39.38m; the 150 missing units (Rs 0.6m) go to profit or loss as abnormal loss.",
            },
          },
        },
        {
          n: 7, format: "Numerical", page: 5, commentsPage: 2, passRate: 41,
          summary: "Full marginal-costing profit and loss account for a single product with FIFO WIP equivalent units, stores consumption, part-fixed labour and mixed overheads.",
          parts: [{ area: "marginal", marks: 13 }], alsoTests: ["process"],
          walkthrough: {
            approach: [
              "Split every cost into variable and fixed, line by line, using the percentages given.",
              "Calculate variable cost per equivalent unit (FIFO) for material and conversion.",
              "Value opening and closing WIP and finished goods at variable production cost only.",
              "Lay out the account: sales, variable cost of sales, variable selling costs, contribution, fixed costs, profit.",
            ],
            rules: [
              "Marginal costing: inventories carry variable production cost only; all fixed production overhead is a period cost.",
              "Stores and spares consumed are factory overhead, not direct material.",
              "Depreciation and salaried staff are fixed unless told otherwise.",
            ],
            layout: { head: ["Marginal costing P&L", "Rs"], rows: [["Sales", ""], ["Opening FG at marginal cost", ""], ["Variable cost of goods manufactured", ""], ["Less closing FG", ""], ["Variable cost of sales", ""], ["Variable selling and admin", ""], ["Contribution", ""], ["Fixed production overhead", ""], ["Fixed selling and admin", ""], ["Net profit", ""]] },
            mistakes: [
              "Presenting scattered calculations instead of a statement (examiners' point).",
              "Treating depreciation or salaried indirect labour as variable.",
              "Putting fixed or selling costs into inventory values.",
            ],
            example: {
              title: "Marginal costing with WIP",
              scenario: [
                "Variable production costs this year: material Rs 4,000,000 and conversion Rs 2,500,000; FIFO equivalent units are 100,000 for both, so Rs 65 per unit. Opening WIP (2,000 units, 50% complete) cost Rs 60,000; closing WIP is 4,000 units 25% complete. 100,000 units were completed. Opening finished goods 5,000 units at Rs 62; closing 7,000 units. Sales 98,000 units at Rs 120; variable selling cost Rs 5 per unit sold. Fixed production overhead Rs 1,500,000; fixed admin Rs 800,000.",
              ],
              required: "Prepare the marginal-costing profit statement.",
              solution: [
                { table: { head: ["Marginal costing P&L", "Rs"], rows: [["Sales: 98,000 × 120", "11,760,000"], ["Opening FG", "310,000"], ["Cost of goods manufactured: 60,000 + 6,500,000 − 65,000", "6,495,000"], ["Less closing FG: 7,000 × 65", "(455,000)"], ["Variable cost of sales", "(6,350,000)"], ["Variable selling: 98,000 × 5", "(490,000)"], ["Contribution", "4,920,000"], ["Fixed production overhead", "(1,500,000)"], ["Fixed admin", "(800,000)"], ["Net profit", "2,620,000"]] } },
                { text: "Closing WIP = 4,000 × 25% × 65 = Rs 65,000." },
              ],
              answer: "Net profit Rs 2,620,000.",
            },
          },
        },
        {
          n: 8, format: "Mixed", page: 6, commentsPage: 2, passRate: 4,
          summary: "Make-or-buy for one of three components of an assembled product when labour is the binding constraint, using next year's inflated costs, plus non-financial factors.",
          parts: [{ area: "decision", marks: 15, label: "(a)" }, { area: "decision", marks: 3, label: "(b)" }],
          walkthrough: {
            approach: [
              "Rebuild variable cost per component and per assembled unit for next year (apply each inflation rate to the right cost).",
              "Work out labour hours per component unit and per finished product, including assembly.",
              "Option 1 (make): output is limited by labour hours.",
              "Option 2 (buy): the freed hours let you make more finished units; compute the new output (check any demand limit).",
              "Compare total contribution (or profit) under each option, then add non-financial factors.",
            ],
            rules: [
              "Under a binding constraint, outsourcing is worth it if the contribution earned from the freed resource exceeds the extra cost of buying.",
              "Fixed overheads that continue either way are not relevant.",
              "Non-financial factors: supplier reliability and quality, loss of know-how, confidentiality, effect on staff, dependency.",
            ],
            mistakes: [
              "Including fixed overheads in the variable cost of making (examiners' point).",
              "Using the same sales volume in both options, ignoring the extra units the freed hours allow.",
              "Forgetting assembly hours or the number of components per finished unit.",
              "Listing financial factors in the non-financial part.",
            ],
            example: {
              title: "Buying in to release labour",
              scenario: [
                "Product P sells for Rs 2,500 and needs 3 units of component K plus assembly. Making one K costs Rs 310 variable (incl. 1 labour hour). Assembly needs 2 labour hours and Rs 650 of other variable cost per P. A supplier offers K at Rs 330. Labour is limited to 50,000 hours; demand for P is 14,000 units. Labour is paid only for hours worked; fixed costs are unchanged.",
              ],
              required: "Should the company make or buy K?",
              solution: [
                { table: { head: ["", "Make K", "Buy K"], rows: [["Hours per P", "3 + 2 = 5", "2"], ["Units of P possible", "50,000 ÷ 5 = 10,000", "min(25,000, 14,000) = 14,000"], ["Variable cost per P", "3 × 310 + 650 = 1,580", "3 × 330 + 650 = 1,640"], ["Contribution per P", "920", "860"], ["Total contribution", "Rs 9.20m", "Rs 12.04m"]] } },
              ],
              answer: "Buy: contribution rises by Rs 2.84m because the freed hours make 4,000 more units, despite the higher unit cost.",
            },
          },
        },
        {
          n: 9, format: "Numerical", page: 7, commentsPage: 3, passRate: 34,
          summary: "Variances for a two-material product under FIFO pricing: material price, mix and yield; variable overhead expenditure and efficiency; fixed overhead expenditure, efficiency and capacity.",
          parts: [{ area: "variances", marks: 6, label: "(a)" }, { area: "variances", marks: 4, label: "(b)" }, { area: "variances", marks: 5, label: "(c)" }],
          walkthrough: {
            approach: [
              "Price materials issued using the stated inventory method (FIFO layers) to get actual cost of the quantity used.",
              "Price variance on quantity used: actual quantity × (standard price − actual price).",
              "Mix: actual total quantity in standard proportions vs actual quantities, at standard prices.",
              "Yield: standard quantity for actual output vs actual total quantity, at the standard average price per kg.",
              "Overheads: expenditure (budget vs actual), efficiency (standard hours vs actual hours × rate), capacity (actual hours vs budgeted hours × fixed rate).",
            ],
            rules: [
              "Mix + yield = usage variance.",
              "Fixed overhead efficiency + capacity = volume variance.",
              "Only compute what is asked: usage or labour variances earn nothing here.",
            ],
            mistakes: [
              "Computing the price variance on purchases instead of usage (examiners' point).",
              "Computing usage instead of yield, or both.",
              "Wrong formulas for fixed overhead efficiency and capacity.",
            ],
            example: {
              title: "Mix, yield and fixed overhead variances",
              scenario: [
                "Standard per unit: M1 3 kg at Rs 50 and M2 2 kg at Rs 30 (5 kg, Rs 210). Output 1,000 units used M1 3,300 kg at Rs 52 and M2 1,900 kg at Rs 29.",
                "Fixed overhead budget Rs 360,000 for 12,000 hours (Rs 30/hour). Actual fixed overhead Rs 375,000, actual hours 12,500, standard hours for actual output 12,200.",
              ],
              required: "Calculate price, mix and yield variances and the three fixed overhead variances.",
              solution: [
                { table: { head: ["Variance", "Working", "Rs"], rows: [["Price M1", "3,300 × (50 − 52)", "6,600 A"], ["Price M2", "1,900 × (30 − 29)", "1,900 F"], ["Mix M1", "(5,200 × 60% − 3,300) × 50", "9,000 A"], ["Mix M2", "(5,200 × 40% − 1,900) × 30", "5,400 F"], ["Yield", "(5,000 − 5,200) × 42", "8,400 A"], ["FOH expenditure", "360,000 − 375,000", "15,000 A"], ["FOH efficiency", "(12,200 − 12,500) × 30", "9,000 A"], ["FOH capacity", "(12,500 − 12,000) × 30", "15,000 F"]] } },
              ],
              answer: "Price Rs 4,700 A; mix Rs 3,600 A; yield Rs 8,400 A (usage Rs 12,000 A). Fixed overhead total Rs 9,000 A = under-absorption (366,000 absorbed vs 375,000 incurred).",
            },
          },
        },
      ],
    },
    {
      slug: "autumn-2026",
      name: "Autumn 2026",
      date: "2026-08-20",
      paperUrl: `${QP}CAF-5-MA-Autumn-2026.pdf`,
      commentsUrl: `${EC}CAF-5-Autumn-2026.pdf`,
      answersUrl: SA,
      answersNote: LOGIN,
      passRate: 38,
      themes: [
        "The pass rate improved, but the decision-making question (Q9, product discontinuation) was again the weakest at 10%.",
        "The examiners stress that the decision-making area needs far more practice, as weak performance there has persisted.",
        "Typical slips: wrong account titles in job-costing entries, wrong basis for overhead allocation between departments, and not following the question's growth and inflation assumptions product by product.",
      ],
      questions: [
        {
          n: 1, format: "MCQ", page: 1, commentsPage: 1, passRate: 53,
          summary: "Seven MCQs (10 marks) on EOQ sensitivity, batch set-up cost attribution, outsourcing under a labour limit, absorption vs marginal statements, reciprocal service costs and ABC limitations.",
          parts: [
            { area: "inv-mgmt", marks: 1, label: "(i)" }, { area: "abc", marks: 1.5, label: "(ii)" },
            { area: "decision", marks: 2, label: "(iii)" }, { area: "marginal", marks: 1, label: "(iv)" },
            { area: "overheads", marks: 2.5, label: "(v)" }, { area: "marginal", marks: 1, label: "(vi)" },
            { area: "abc", marks: 1, label: "(vii)" },
          ],
          walkthrough: {
            approach: [
              "Sensitivity items: write the formula and plug in index numbers (1.06, 1.08) rather than full data.",
              "Outsourcing under a constraint: rank by extra cost of buying per limiting-factor hour saved; outsource the lowest.",
              "'Always' statements about absorption vs marginal profit are usually false; check what happens when inventory falls.",
            ],
            rules: [
              "EOQ = √(2DCo ÷ Ch): EOQ moves with √(Co ÷ Ch).",
              "Batch-level costs (set-ups) are driven by the number of batches, not units.",
              "Absorption profit exceeds marginal profit only when inventory rises.",
            ],
            mistakes: [
              "Adding percentage changes in EOQ inputs instead of taking the square root of the ratio.",
              "Allocating set-up costs on units produced.",
            ],
            example: {
              title: "EOQ sensitivity",
              scenario: [
                "Case 1: ordering cost per order rises 21%, holding cost unchanged. Case 2: ordering cost rises 8% and holding cost per unit rises 20%. Demand is unchanged in both.",
              ],
              required: "Calculate the percentage change in EOQ in each case.",
              solution: [
                { table: { head: ["Case", "Working", "Change"], rows: [["1", "√1.21 = 1.10", "+10%"], ["2", "√(1.08 ÷ 1.20) = √0.90 = 0.9487", "−5.1%"]] } },
              ],
              answer: "+10% and about −5.1%.",
            },
          },
        },
        {
          n: 2, format: "Numerical", page: 2, commentsPage: 1, passRate: 38,
          summary: "Journal entries for a month of job costing: materials, labour and absorbed overhead charged to two jobs, a material transfer between jobs, completion, and rejected units treated as abnormal loss.",
          parts: [{ area: "job", marks: 9 }],
          walkthrough: {
            approach: [
              "List each event and decide which control accounts it touches (stores, wages, overhead control, WIP – job, finished goods, P&L).",
              "Charge direct materials and direct labour to WIP for the specific job; absorb overhead at the predetermined rate on actual hours.",
              "Material moved between jobs: debit the receiving job, credit the giving job.",
              "On completion: total the job (opening WIP + all charges − transfers out), then split good units to finished goods and rejects to abnormal loss, net of scrap proceeds.",
            ],
            rules: [
              "Direct costs are debited to 'WIP – Job X', not to a raw material or expense account.",
              "Overhead incurred goes to overhead control; overhead absorbed is credited to it.",
              "Abnormal loss is valued at full job cost per unit, with scrap proceeds credited against it.",
            ],
            mistakes: [
              "Debiting 'raw material – Job X' instead of 'WIP – Job X', or omitting job numbers (examiners' point).",
              "Forgetting opening WIP or the transfer out when costing the completed job.",
              "Sending the whole job cost to finished goods without separating the rejected units.",
            ],
            example: {
              title: "Completing a job with rejects",
              scenario: [
                "Job 501 (500 units) had opening WIP of Rs 1,200,000. This month: materials issued Rs 900,000; 3,000 direct labour hours at Rs 400; overhead absorbed at Rs 300 per hour. Unused materials of Rs 50,000 were returned to stores. On completion 20 units were rejected as abnormal loss and sold as scrap for Rs 6,000.",
              ],
              required: "Calculate the job cost and give the completion entries.",
              solution: [
                { table: { head: ["Working", "Rs"], rows: [["Opening WIP", "1,200,000"], ["Materials", "900,000"], ["Labour: 3,000 × 400", "1,200,000"], ["Overhead: 3,000 × 300", "900,000"], ["Materials returned", "(50,000)"], ["Total job cost", "4,150,000"], ["Cost per unit: ÷ 500", "8,300"]] } },
                { table: { head: ["Entry", "Dr", "Cr", "Rs"], rows: [["Good units", "Finished goods", "WIP – Job 501", "3,984,000"], ["Rejected units", "Abnormal loss", "WIP – Job 501", "166,000"], ["Scrap sale", "Cash", "Abnormal loss", "6,000"], ["Write-off", "Profit or loss", "Abnormal loss", "160,000"]] } },
              ],
              answer: "Job cost Rs 4.15m; finished goods Rs 3.984m; net abnormal loss Rs 160,000.",
            },
          },
        },
        {
          n: 3, format: "Numerical", page: 3, commentsPage: 2, passRate: 46,
          summary: "Working backwards from given variances to standard and actual material prices, standard hours, standard variable overhead per unit and the sales volume profit variance.",
          parts: [{ area: "variances", marks: 10 }],
          walkthrough: {
            approach: [
              "Write each variance formula and mark which pieces are known.",
              "Solve the usage variance first to get the standard price; then the price variance gives the actual price.",
              "Labour rate variance ÷ rate difference gives actual hours; the efficiency information then gives standard hours.",
              "Standard variable overhead per unit = rate per hour × standard hours per unit.",
              "Sales volume profit variance = change in units × standard profit per unit (not contribution, under absorption costing).",
            ],
            rules: [
              "Usage variance = (SQ − AQ) × SP. Price variance = (SP − AP) × AQ.",
              "Under absorption costing, sales volume variance uses standard profit; under marginal costing, standard contribution.",
            ],
            mistakes: [
              "Adding a favourable price variance to the standard price instead of deducting it (examiners' point).",
              "Using the overhead rate per hour as the cost per unit.",
              "Using actual figures in the sales volume variance.",
            ],
            example: {
              title: "Variances in reverse",
              scenario: [
                "A product's material price variance was Rs 60,000 F and usage variance Rs 60,000 A. 30,000 kg were used, 2,000 kg more than standard for the 4,000 units made. Labour: rate variance Rs 36,000 A, actual rate Rs 212 vs standard Rs 200; standard 0.8 hours per unit. Variable overhead is Rs 40 per standard hour. Fixed overhead is Rs 25 per unit. Standard selling price Rs 600. Budgeted sales were 3,600 units; actual sales 4,000.",
              ],
              required: "Find the standard and actual material prices, actual labour hours and the sales volume profit variance.",
              solution: [
                { table: { head: ["Working", "Result"], rows: [["Standard price: 60,000 ÷ 2,000 kg", "Rs 30/kg"], ["Actual price: 30 − 60,000 ÷ 30,000", "Rs 28/kg"], ["Actual hours: 36,000 ÷ (212 − 200)", "3,000 hours"], ["Standard material per unit: 28,000 ÷ 4,000 = 7 kg × 30", "Rs 210"], ["Standard profit: 600 − 210 − 160 − 32 − 25", "Rs 173"], ["Sales volume profit variance: 400 × 173", "Rs 69,200 F"]] } },
              ],
              answer: "Standard Rs 30/kg, actual Rs 28/kg, 3,000 hours, sales volume profit variance Rs 69,200 F.",
            },
          },
        },
        {
          n: 4, format: "Numerical", page: 4, commentsPage: 2, passRate: 67,
          summary: "Budgeted overheads from a predetermined rate and budgeted hours for two products, under/over-absorption against actual overheads, and the closing journal entry.",
          parts: [{ area: "overheads", marks: 5 }],
          walkthrough: {
            approach: [
              "Budgeted overheads = budgeted units × budgeted hours per unit × rate, per product.",
              "Applied overheads = actual units × actual hours per unit × rate.",
              "Compare applied with actual incurred: applied lower = under-absorbed.",
              "Journal: under-absorbed is debited to P&L (or cost of sales) and credited to overhead control.",
            ],
            rules: [
              "Under/over-absorption compares absorbed with actual overhead, never budget with actual.",
            ],
            mistakes: [
              "Not calculating budgeted overheads even though it was asked (examiners' point).",
              "Crossing actual hours with budget units or vice versa.",
              "Reversing the debit and credit in the closing entry.",
            ],
            example: {
              title: "Under-absorption",
              scenario: [
                "Rate Rs 400 per labour hour. Budget: X 10,000 units × 2 hours, Y 5,000 units × 1.2 hours. Actual: X 10,500 units × 1.9 hours, Y 5,200 units × 1.25 hours. Actual overhead Rs 10.9m.",
              ],
              required: "Calculate budgeted overheads and the under/over-absorption, with the entry.",
              solution: [
                { table: { head: ["Working", "Value"], rows: [["Budgeted hours: 20,000 + 6,000", "26,000"], ["Budgeted overheads: 26,000 × 400", "Rs 10,400,000"], ["Actual hours: 19,950 + 6,500", "26,450"], ["Applied: 26,450 × 400", "Rs 10,580,000"], ["Actual", "Rs 10,900,000"], ["Under-absorbed", "Rs 320,000"]] } },
              ],
              answer: "Dr Profit or loss (cost of sales) Rs 320,000; Cr Factory overhead control Rs 320,000.",
            },
          },
        },
        {
          n: 5, format: "Numerical", page: 4, commentsPage: 3, passRate: 74,
          summary: "Statement of cost of goods manufactured for a furniture maker, allocating freight, rent, utilities and fixed costs between manufacturing and non-manufacturing areas.",
          parts: [{ area: "cost-flow", marks: 7 }],
          walkthrough: {
            approach: [
              "Allocate shared costs first: freight by weight, rent by area, utilities and fixed costs by the given ratios.",
              "Direct materials consumed = opening + purchases + freight − closing.",
              "Indirect materials consumed go to factory overhead.",
              "Add direct labour and factory overhead; adjust for WIP to reach cost of goods manufactured.",
              "Leave finished goods and admin/selling costs out of the COGM statement.",
            ],
            rules: [
              "Prime cost = direct materials + direct labour (+ direct expenses).",
              "Supervisors' salaries and material store costs are factory overhead; the finished goods warehouse and offices are not manufacturing costs.",
            ],
            layout: { head: ["Cost of goods manufactured", "Rs"], rows: [["Direct materials consumed", ""], ["Direct labour", ""], ["Prime cost", ""], ["Factory overhead", ""], ["Total manufacturing cost", ""], ["Add opening WIP / less closing WIP", ""], ["Cost of goods manufactured", ""]] },
            mistakes: [
              "Indirect materials in prime cost or supervisors as direct labour (examiners' point).",
              "Admin costs or finished goods inventories inside the statement.",
            ],
            example: {
              title: "COGM with shared costs",
              scenario: [
                "Rs '000: direct materials opening 8,000, purchases 70,000, freight on them 2,000, closing 9,000. Indirect materials opening 500, purchases 3,000, freight 500, closing 700. Direct labour 20,000. Supervisors 4,000. Rent 10,000 split by area: production 60%, direct material store 15%, finished goods warehouse 10%, offices 10%, indirect material store 5%. Utilities 6,000, 90% production. WIP opening 5,000, closing 6,200.",
              ],
              required: "Prepare the statement of cost of goods manufactured.",
              solution: [
                { table: { head: ["Rs '000", ""], rows: [["Direct materials: 8,000 + 70,000 + 2,000 − 9,000", "71,000"], ["Direct labour", "20,000"], ["Prime cost", "91,000"], ["Indirect materials: 500 + 3,000 + 500 − 700", "3,300"], ["Supervisors", "4,000"], ["Rent: 80% (production + both material stores)", "8,000"], ["Utilities: 90%", "5,400"], ["Factory overhead", "20,700"], ["Total manufacturing cost", "111,700"], ["Opening WIP", "5,000"], ["Closing WIP", "(6,200)"], ["Cost of goods manufactured", "110,500"]] } },
              ],
              answer: "Rs 110.5m.",
            },
          },
        },
        {
          n: 6, format: "Numerical", page: 5, commentsPage: 3, passRate: 64,
          summary: "Accept-or-reject a special order made in batches, with labour hours on a learning curve that stops improving and material wastage that falls batch by batch, tested against a minimum contribution margin.",
          parts: [{ area: "labour", marks: 8 }], alsoTests: ["decision"],
          walkthrough: {
            approach: [
              "Strip wastage out of the first batch's material cost to find the base cost, then rebuild each batch with its own wastage rate.",
              "Learning curve on batches: cumulative average per batch × batches, then take differences to get each batch's time.",
              "Once learning stops, later batches take the same time as the last 'learning' batch.",
              "Total revenue, variable costs, contribution, then compare the margin with the policy minimum.",
            ],
            rules: [
              "Cost including x% wastage ÷ (1 + x%) = cost before wastage.",
              "Reducing the wastage rate by 10% means applying it to the wastage percentage, not to the whole material cost.",
            ],
            mistakes: [
              "Multiplying by 95% instead of dividing by 105% to remove wastage (examiners' point).",
              "Applying the learning curve to batches after it was said to stop.",
              "Not computing the contribution margin % before concluding.",
            ],
            example: {
              title: "Special order with learning and wastage",
              scenario: [
                "An order for 4,000 units at Rs 20,000 each would be made in 8 batches of 500. Batch 1 takes 2,000 hours; an 85% learning curve applies (b = −0.2345) up to batch 4, and later batches take as long as batch 4. Labour costs Rs 500/hour; variable overhead Rs 300/hour. Material is Rs 15,000 per unit before wastage; wastage is 5% in batch 1 and falls by 20% each batch until batch 3, then stays at that rate. The company needs at least a 25% contribution margin.",
              ],
              required: "Should the order be accepted?",
              solution: [
                { table: { head: ["Labour", "Hours"], rows: [["Batches 1–4: 4 × 2,000 × 4^−0.2345", "5,780.0"], ["Batch 4 alone: 5,780.0 − 3 × 2,000 × 3^−0.2345", "1,142.5"], ["Batches 5–8: 4 × 1,142.5", "4,570.0"], ["Total hours", "10,350.0"]] } },
                { table: { head: ["Order", "Rs m"], rows: [["Revenue: 4,000 × 20,000", "80.00"], ["Material: 7.5m per batch × (8 + 0.05 + 0.04 + 6 × 0.032)", "(62.12)"], ["Labour: 10,350 × 500", "(5.18)"], ["Variable overhead: 10,350 × 300", "(3.11)"], ["Contribution", "9.60"], ["Contribution margin", "12.0%"]] } },
              ],
              answer: "Reject: a 12% margin is below the 25% minimum.",
            },
          },
        },
        {
          n: 7, format: "Numerical", page: 5, commentsPage: 3, passRate: 26,
          summary: "Closing inventory cost for two final products from a two-department process with joint products allocated on NRV, a by-product credited to joint cost, and blending in fixed ratios.",
          parts: [{ area: "joint", marks: 15 }], alsoTests: ["overheads"],
          walkthrough: {
            approach: [
              "Allocate shared overhead between departments on the stated driver (e.g. labour hours = labour cost ÷ rate).",
              "Department 1 joint cost = materials + labour + overhead − by-product proceeds.",
              "NRV at split-off for each joint product; the one processed further uses final value less further costs.",
              "Allocate joint cost, then build department 2 cost: transferred-in joint product, other inputs, labour, overhead.",
              "Cost per kg of each final product × closing kg.",
            ],
            rules: [
              "By-product net realisable value is usually credited to the joint process.",
              "Products used inside department 2 are transferred at their allocated joint cost per kg.",
              "Normal losses have no cost of their own; they raise the cost per good kg.",
            ],
            mistakes: [
              "Allocating joint cost on quantities instead of NRV (examiners' point).",
              "Valuing the final product at the joint cost of its input only, ignoring department 2 costs.",
              "Allocating overhead on wage rates instead of hours worked.",
            ],
            example: {
              title: "Joint products with a by-product and further processing",
              scenario: [
                "Department 1 processes inputs costing Rs 6,000,000 with conversion costs of Rs 2,000,000. Output: J 40,000 kg (sells at Rs 150/kg at split-off), K 45,000 kg (no market; processed further), by-product B 10,000 kg (sold for Rs 300,000), and 5,000 kg normal loss. Department 2 turns all of K into 45,000 kg of L at a further Rs 1,800,000; L sells at Rs 200/kg. Closing inventories: J 5,000 kg, L 9,000 kg.",
              ],
              required: "Value closing inventories of J and L.",
              solution: [
                { table: { head: ["Working", "Rs"], rows: [["Net joint cost: 8,000,000 − 300,000", "7,700,000"], ["NRV of J: 40,000 × 150", "6,000,000"], ["NRV of K: 45,000 × 200 − 1,800,000", "7,200,000"], ["J share: 7.7m × 6.0 ÷ 13.2", "3,500,000 (Rs 87.50/kg)"], ["K share: 7.7m × 7.2 ÷ 13.2", "4,200,000"], ["L cost: 4,200,000 + 1,800,000", "6,000,000 (Rs 133.33/kg)"]] } },
              ],
              answer: "J: 5,000 × 87.50 = Rs 437,500. L: 9,000 × 133.33 = Rs 1,200,000.",
            },
          },
        },
        {
          n: 8, format: "Numerical", page: 6, commentsPage: 4, passRate: 49,
          summary: "Next year's break-even sales and margin of safety for two variants with different volume growth, price rises, a special material, wage and productivity changes, and split fixed/variable overheads.",
          parts: [{ area: "cvp", marks: 18 }],
          walkthrough: {
            approach: [
              "Recover this year's units per product from sales and prices (watch whether quantities are per product or combined).",
              "Recover per-unit costs, separating common and special materials, and fixed from variable overheads.",
              "Project product by product: new volume × new price; each cost with its own inflation and efficiency factor.",
              "Total contribution, C/S ratio, then break-even = projected fixed costs ÷ C/S ratio; margin of safety on next year's sales.",
            ],
            rules: [
              "Variable overheads that follow labour hours change with both volume and hours per unit.",
              "Variable operating expenses that follow revenue change with projected revenue.",
              "Inflation applies to fixed costs; volume does not.",
            ],
            mistakes: [
              "Growing prices but not volumes, or applying both growth rates to total sales (examiners' point).",
              "Applying both material inflation rates to total material cost.",
              "Using this year's sales in the margin of safety.",
            ],
            example: {
              title: "Two-variant forecast",
              scenario: [
                "This year: 500 Basic at Rs 100,000 and 500 Deluxe at Rs 150,000. Per unit: general material Rs 40,000 (both); Deluxe also uses a special part of Rs 10,000; labour Rs 10,000; variable overhead Rs 6,000 (follows labour hours). Fixed factory costs Rs 18m; fixed operating costs Rs 15m.",
                "Next year: volumes +4% (Basic) and +10% (Deluxe); prices +8%; general material +5%; special part +20%; wage rate +15% but hours per unit −5%; overhead inflation +10%; fixed factory +10%; fixed operating +8%.",
              ],
              required: "Calculate break-even sales and margin of safety.",
              solution: [
                { table: { head: ["Working", "Rs m"], rows: [["Sales: 520 × 108,000 + 550 × 162,000", "145.26"], ["General material: 1,070 × 42,000", "(44.94)"], ["Special part: 550 × 12,000", "(6.60)"], ["Labour: 1,070 × 10,000 × 1.15 × 0.95", "(11.69)"], ["Variable overhead: 1,070 × 6,000 × 1.10 × 0.95", "(6.71)"], ["Contribution", "75.32"], ["Fixed costs: 19.8 + 16.2", "36.00"]] } },
                { text: "C/S ratio = 75.32 ÷ 145.26 = 51.85%. Break-even = 36.00 ÷ 0.5185 = Rs 69.43m." },
              ],
              answer: "Break-even ≈ Rs 69.4m; margin of safety ≈ 52.2% of forecast sales.",
            },
          },
        },
        {
          n: 9, format: "Numerical", page: 7, commentsPage: 4, passRate: 10,
          summary: "Revised operating profit under three options for a product facing a cheaper rival (keep price, cut price, discontinue), with a volume-based supplier discount, overtime, idle-time pay and labour-driven overheads.",
          parts: [{ area: "decision", marks: 18 }],
          walkthrough: {
            approach: [
              "Rebuild the base budget: units, hours per unit, material at gross and net of discount, labour split normal/overtime, variable vs fixed overhead.",
              "For each option, recompute volume, hours, labour (normal, overtime, idle), gross purchases and the discount rate that applies, variable overhead.",
              "Fixed overheads and operating expenses stay unless the question says otherwise.",
              "Present a side-by-side operating profit table and recommend.",
            ],
            rules: [
              "When a discount depends on a purchase threshold, gross up net purchases to test the threshold, then apply the new rate to all purchases.",
              "Workers who cannot be laid off still cost money when idle: include idle hours at the idle rate.",
              "Variable overhead that follows hours worked falls with production.",
            ],
            mistakes: [
              "Using the wrong decline percentage for the 'keep price' option (examiners' point).",
              "Not grossing up purchases before testing the discount threshold, or keeping the higher discount after falling below it.",
              "Leaving out idle labour pay, or giving contribution when operating profit was asked.",
            ],
            example: {
              title: "Discontinue or keep a product",
              scenario: [
                "Budget: M 10,000 units at Rs 3,000; N 20,000 units at Rs 5,000. Materials net of an 8% discount: M Rs 9m, N Rs 30m; the discount drops to 3% if gross purchases fall below Rs 40m. Each unit takes 2 labour hours; normal capacity 55,000 hours at Rs 300, overtime Rs 400; idle hours are paid at Rs 200 because workers cannot be laid off. Variable overhead Rs 200 per hour worked; fixed factory overhead Rs 12m; operating expenses Rs 20m.",
              ],
              required: "Compare operating profit if M is kept at budget volume, sold at half volume, or discontinued.",
              solution: [
                { table: { head: ["Rs m", "Keep M", "M at 50%", "Drop M"], rows: [["Sales", "130.000", "115.000", "100.000"], ["Gross purchases", "42.391", "37.500", "32.609"], ["Materials (net of 8% / 3%)", "(39.000)", "(36.375)", "(31.630)"], ["Labour worked", "(18.500)", "(15.000)", "(12.000)"], ["Idle labour", "–", "(1.000)", "(3.000)"], ["Variable overhead", "(12.000)", "(10.000)", "(8.000)"], ["Fixed overhead + operating", "(32.000)", "(32.000)", "(32.000)"], ["Operating profit", "28.500", "20.625", "13.370"]] } },
                { text: "Keep M: 60,000 hours = 55,000 normal + 5,000 overtime. Half M: 50,000 hours, 5,000 idle. Drop M: 40,000 hours, 15,000 idle." },
              ],
              answer: "Keep M (Rs 28.5m). Dropping it loses its contribution, the volume discount and pays 15,000 idle hours.",
            },
          },
        },
      ],
    },
  ],
};
