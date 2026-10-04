/**
 * IFRS & IAS Standards Hub — exam-focused summaries written in our own words.
 *
 * These are study notes, not the standards themselves. They intentionally
 * simplify; where a rule has many exceptions we state it at a general level.
 * Always check the authoritative text at https://www.ifrs.org.
 */

export type StandardArea =
  | "presentation"
  | "assets"
  | "liabilities"
  | "revenue"
  | "group"
  | "instruments"
  | "other";

export const AREA_LABEL: Record<StandardArea, string> = {
  presentation: "Presentation & disclosure",
  assets: "Assets",
  liabilities: "Liabilities & leases",
  revenue: "Revenue & income",
  group: "Group accounts",
  instruments: "Financial instruments",
  other: "Other standards",
};

export const AREA_ORDER: StandardArea[] = [
  "presentation",
  "assets",
  "liabilities",
  "revenue",
  "group",
  "instruments",
  "other",
];

export interface Definition {
  term: string;
  meaning: string;
}

export interface RuleGroup {
  heading: string;
  points: string[];
}

export interface WorkedExample {
  title: string;
  scenario: string;
  steps: string[];
  answer: string;
}

export interface Standard {
  /** Display code, e.g. "IAS 16" */
  code: string;
  family: "IAS" | "IFRS";
  number: number;
  title: string;
  slug: string;
  area: StandardArea;
  /** One-line objective, in our own words */
  objective: string;
  /** Important status notes (new standards, recent amendments, replacements) */
  status?: string[];
  scope: string[];
  definitions: Definition[];
  rules: RuleGroup[];
  disclosures: string[];
  traps: string[];
  example?: WorkedExample;
  /** Codes of related standards, e.g. ["IAS 36", "IFRS 16"] */
  related: string[];
  /** Subject ids from src/data/subjects.ts whose MCQ banks test this standard */
  banks: string[];
}

/** Date the summaries were last reviewed (ISO). */
export const STANDARDS_REVIEWED = "2026-10-04";

// Common bank groupings (subject ids from src/data/subjects.ts)
const INTRO = ["caf-1", "acca-fa", "cima-ba3", "icaew-acc"];
const CORE = ["caf-1", "acca-fa", "acca-fr", "caf-6", "cima-ba3", "icaew-acc"];
const ADV = ["caf-6", "acca-fr", "ca-inter-aa"];

const IFRS18_NOTE =
  "IFRS 18 Presentation and Disclosure in Financial Statements was issued in April 2024 and is effective for annual reporting periods beginning on or after 1 January 2027 (earlier application permitted). It replaces IAS 1, carrying many IAS 1 requirements forward while adding new ones on the structure of the income statement.";

export const standards: Standard[] = [
  /* ───────────────────────── IAS ───────────────────────── */
  {
    code: "IAS 1",
    family: "IAS",
    number: 1,
    title: "Presentation of Financial Statements",
    slug: "ias-1-presentation-of-financial-statements",
    area: "presentation",
    objective:
      "Sets the overall framework for general purpose financial statements: what a complete set contains, the general principles behind them and minimum line items.",
    status: [
      IFRS18_NOTE,
      "Until IFRS 18 applies (or is adopted early), IAS 1 remains the standard in force, so exams set before the 2027 changeover still test IAS 1.",
      "Amendments effective from 1 January 2024 clarify that a liability is non-current only if, at the reporting date, the entity has a right to defer settlement for at least 12 months; covenants that must be met only after the reporting date do not affect that classification but must be disclosed.",
    ],
    scope: [
      "Applies to all general purpose financial statements prepared under IFRS Accounting Standards.",
      "Does not set recognition or measurement rules for specific transactions; those come from the other standards.",
      "Condensed interim reports are covered by IAS 34, although the general features in IAS 1 still apply.",
    ],
    definitions: [
      { term: "Complete set of financial statements", meaning: "Statement of financial position, statement of profit or loss and other comprehensive income, statement of changes in equity, statement of cash flows and notes, all with comparatives. A third statement of financial position is needed when a policy is applied retrospectively or items are restated or reclassified and the effect is material." },
      { term: "Material", meaning: "Information is material if leaving it out, misstating it or obscuring it could reasonably be expected to influence decisions that primary users make based on the financial statements." },
      { term: "Other comprehensive income (OCI)", meaning: "Income and expense items that other standards require or permit to be kept out of profit or loss, such as revaluation gains and remeasurements of defined benefit plans." },
      { term: "Reclassification adjustment", meaning: "An amount previously recognised in OCI that is moved ('recycled') to profit or loss in the current period." },
    ],
    rules: [
      {
        heading: "General features",
        points: [
          "Fair presentation and an explicit, unreserved statement of compliance with IFRS.",
          "Going concern basis unless management intends to, or has no realistic alternative but to, liquidate or stop trading; material uncertainties must be disclosed.",
          "Accrual basis for everything except cash flow information.",
          "Each material class of similar items presented separately; immaterial items may be aggregated.",
          "No offsetting of assets and liabilities, or income and expenses, unless a standard requires or permits it.",
          "Report at least annually, with comparative information and consistent presentation from period to period.",
        ],
      },
      {
        heading: "Statement of financial position",
        points: [
          "Classify assets and liabilities as current and non-current, unless a liquidity-order presentation is more reliable and relevant (common for banks).",
          "An asset is current if it is expected to be realised or consumed in the normal operating cycle, held mainly for trading, expected to be realised within 12 months, or is unrestricted cash.",
          "A liability is current if it is expected to be settled in the normal operating cycle, held mainly for trading, due within 12 months, or the entity has no right at the reporting date to defer settlement for at least 12 months.",
          "Management's intention or expectation to refinance or settle early does not change classification; what matters is the right existing at the reporting date.",
        ],
      },
      {
        heading: "Profit or loss and OCI",
        points: [
          "Present one combined statement or two statements (profit or loss, then comprehensive income).",
          "Group OCI items into those that may be reclassified to profit or loss later and those that will not.",
          "Analyse expenses by nature or by function, whichever is more reliable and relevant; if by function, disclose additional information on the nature of expenses (including depreciation and employee benefits).",
          "No item may be presented as 'extraordinary'.",
        ],
      },
    ],
    disclosures: [
      "Material accounting policy information (not every policy).",
      "Judgements management made in applying policies that most affect amounts recognised.",
      "Major sources of estimation uncertainty that carry a significant risk of material adjustment within the next year.",
      "Capital management objectives, policies and processes.",
      "Dividends proposed or declared before the financial statements are authorised but not recognised.",
    ],
    traps: [
      "A loan in breach of covenants at the year end is current, even if the lender agrees a waiver after the year end (unless the grace period was agreed by the reporting date and runs for at least 12 months).",
      "Intent to refinance a loan due within 12 months does not make it non-current.",
      "Revaluation surplus movements are OCI that will not be reclassified; exchange differences on foreign operations will be reclassified on disposal.",
      "Departing from a standard is allowed only in extremely rare cases where compliance would be so misleading it conflicts with the Conceptual Framework's objective.",
    ],
    related: ["IFRS 18", "IAS 7", "IAS 8", "IAS 10"],
    banks: CORE,
  },
  {
    code: "IAS 2",
    family: "IAS",
    number: 2,
    title: "Inventories",
    slug: "ias-2-inventories",
    area: "assets",
    objective:
      "Explains how to determine the cost of inventories, how to expense it, and when to write inventories down to net realisable value.",
    scope: [
      "Goods held for sale, work in progress, and materials or supplies used in production or in rendering services.",
      "Excludes financial instruments and biological assets/agricultural produce at the point of harvest (IAS 41).",
      "Commodity broker-traders and producers of agricultural and mineral products measuring at net realisable value or fair value less costs to sell are outside the measurement rules.",
    ],
    definitions: [
      { term: "Inventories", meaning: "Assets held for sale in the ordinary course of business, in the process of production for such sale, or materials and supplies to be consumed in production or rendering services." },
      { term: "Net realisable value (NRV)", meaning: "Estimated selling price in the ordinary course of business, less estimated costs of completion and estimated costs needed to make the sale. It is entity-specific, unlike fair value." },
    ],
    rules: [
      {
        heading: "Measurement",
        points: [
          "Measure at the lower of cost and NRV, normally item by item (similar or related items may be grouped).",
          "Cost includes purchase price, import duties and non-recoverable taxes, transport and handling, less trade discounts and rebates.",
          "Conversion costs include direct labour plus a systematic allocation of fixed and variable production overheads.",
          "Fixed production overheads are allocated on normal capacity; unallocated overheads from low production are expensed. In periods of abnormally high production the per-unit amount is reduced so inventory is not above cost.",
          "Exclude abnormal waste, storage costs (unless necessary in the production process before a further stage), administrative overheads not related to production, and selling costs.",
        ],
      },
      {
        heading: "Cost formulas",
        points: [
          "Use specific identification for items that are not ordinarily interchangeable or are produced for specific projects.",
          "Otherwise use FIFO or weighted average cost, applied consistently to inventories of similar nature and use.",
          "LIFO is not permitted.",
          "Standard cost or the retail method may be used if the result approximates cost.",
        ],
      },
      {
        heading: "Expense recognition",
        points: [
          "The carrying amount is expensed when the related revenue is recognised.",
          "Write-downs to NRV and losses are expensed in the period they occur.",
          "A write-down is reversed (up to original cost) if NRV later increases because circumstances change.",
        ],
      },
    ],
    disclosures: [
      "Accounting policies and cost formula used.",
      "Total carrying amount, analysed into suitable classifications (e.g. raw materials, WIP, finished goods).",
      "Amount expensed in the period, write-downs, and any reversals with the reason.",
      "Carrying amount of inventories pledged as security.",
    ],
    traps: [
      "Selling costs reduce NRV but are never added to cost.",
      "The lower of cost and NRV comparison is item by item, not total cost versus total NRV.",
      "Raw materials are not written down if the finished goods they go into are expected to sell at or above cost.",
      "Idle-capacity overheads go to profit or loss, not inventory.",
      "Information about selling prices after the year end is usually an adjusting event under IAS 10.",
    ],
    example: {
      title: "Lower of cost and NRV",
      scenario:
        "An entity holds 1,000 units costing $50 each. At the year end each unit needs further work costing $8 and can then be sold for $60, with selling commission of $5 per unit.",
      steps: [
        "NRV per unit = 60 − 8 − 5 = $47.",
        "Cost per unit = $50, which is higher than NRV.",
        "Write-down = (50 − 47) × 1,000 = $3,000, recognised as an expense.",
      ],
      answer: "Inventory is carried at $47,000 (1,000 × $47).",
    },
    related: ["IAS 10", "IAS 41", "IFRS 15", "IAS 23"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IAS 7",
    family: "IAS",
    number: 7,
    title: "Statement of Cash Flows",
    slug: "ias-7-statement-of-cash-flows",
    area: "presentation",
    objective:
      "Requires a statement showing how cash and cash equivalents changed during the period, classified into operating, investing and financing activities.",
    status: [
      "Amendments effective from 1 January 2024 added disclosures about supplier finance arrangements.",
      "IFRS 18 (effective 1 January 2027) makes consequential amendments: operating profit becomes the starting point for the indirect method, and for most entities the current choices on where to classify interest and dividends are removed. Check the amended text when you move to IFRS 18-based syllabuses.",
    ],
    scope: [
      "All entities presenting financial statements under IFRS must include a statement of cash flows.",
    ],
    definitions: [
      { term: "Cash", meaning: "Cash on hand and demand deposits." },
      { term: "Cash equivalents", meaning: "Short-term, highly liquid investments that are readily convertible to known amounts of cash and carry an insignificant risk of changes in value; typically maturing within about three months of acquisition." },
      { term: "Operating activities", meaning: "The main revenue-producing activities and other activities that are not investing or financing." },
      { term: "Investing activities", meaning: "Acquiring and disposing of long-term assets and other investments not included in cash equivalents." },
      { term: "Financing activities", meaning: "Activities that change the size and composition of contributed equity and borrowings." },
    ],
    rules: [
      {
        heading: "Presentation",
        points: [
          "Operating cash flows may use the direct method (gross receipts and payments, encouraged) or the indirect method (profit adjusted for non-cash items and working capital changes).",
          "Investing and financing cash flows are shown gross by major class; netting is allowed only in limited cases (e.g. high-turnover, short-maturity items).",
          "Bank overdrafts repayable on demand that form part of cash management may be included in cash and cash equivalents.",
          "Under IAS 7 as currently written, interest and dividends paid or received are classified consistently as operating, investing or financing (choices exist for most entities). Income tax cash flows are operating unless specifically identified with investing or financing.",
          "Non-cash transactions (e.g. acquiring an asset through a lease, converting debt to equity) are excluded from the statement and disclosed elsewhere.",
          "Cash flows on obtaining or losing control of subsidiaries are investing activities, shown net of cash acquired or disposed of.",
        ],
      },
    ],
    disclosures: [
      "Components of cash and cash equivalents and a reconciliation to the statement of financial position.",
      "Reconciliation of changes in liabilities arising from financing activities (cash and non-cash changes).",
      "Significant cash balances not available for use by the group.",
      "Information about supplier finance arrangements (terms, carrying amounts, payment due date ranges).",
    ],
    traps: [
      "Depreciation, impairment and losses on disposal are added back in the indirect method; gains on disposal are deducted, and the full sale proceeds go to investing.",
      "An increase in receivables or inventory is deducted; an increase in payables is added.",
      "Acquiring a right-of-use asset under a lease is non-cash; the later principal repayments are financing cash flows.",
      "Equity-accounted profits are non-cash; dividends received from associates are the cash flow.",
    ],
    example: {
      title: "Indirect method",
      scenario:
        "Profit before tax $500k; depreciation $80k; receivables up $30k; inventory down $20k; trade payables up $15k; tax paid $100k.",
      steps: [
        "Start with profit before tax: 500.",
        "Add back depreciation: +80 → 580.",
        "Receivables increased: −30 → 550. Inventory decreased: +20 → 570. Payables increased: +15 → 585.",
        "Cash generated from operations = 585; less tax paid 100.",
      ],
      answer: "Net cash from operating activities = $485k.",
    },
    related: ["IAS 1", "IFRS 18", "IFRS 16", "IFRS 10"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IAS 8",
    family: "IAS",
    number: 8,
    title: "Accounting Policies, Changes in Accounting Estimates and Errors",
    slug: "ias-8-accounting-policies-changes-in-accounting-estimates-and-errors",
    area: "presentation",
    objective:
      "Sets the rules for selecting and changing accounting policies, and for accounting for changes in estimates and correcting prior period errors.",
    status: [
      "IFRS 18 makes consequential amendments to IAS 8 that apply from 1 January 2027: the standard is retitled 'Basis of Preparation of Financial Statements', and some general requirements previously in IAS 1 are moved into it. The core rules on policies, estimates and errors summarised here are carried forward, but check the amended text for the detail.",
      "Amendments effective from 2023 introduced a definition of accounting estimates and clarified how they differ from accounting policies.",
    ],
    scope: [
      "Selecting and applying accounting policies.",
      "Accounting for changes in policies, changes in estimates and corrections of prior period errors.",
      "Tax effects of corrections and of retrospective adjustments are dealt with under IAS 12.",
    ],
    definitions: [
      { term: "Accounting policies", meaning: "The specific principles, bases, conventions, rules and practices an entity applies in preparing and presenting financial statements." },
      { term: "Accounting estimates", meaning: "Monetary amounts in the financial statements that are subject to measurement uncertainty, such as useful lives, expected credit losses and provisions." },
      { term: "Prior period errors", meaning: "Omissions or misstatements in prior financial statements from failing to use, or misusing, reliable information that was available and could reasonably have been obtained (e.g. mathematical mistakes, misapplied policies, oversights, fraud)." },
      { term: "Retrospective application", meaning: "Applying a new policy as if it had always been applied." },
      { term: "Prospective application", meaning: "Applying a change from the date of the change onwards, in current and future periods." },
    ],
    rules: [
      {
        heading: "Accounting policies",
        points: [
          "Where a standard applies, use it. Where none applies, management uses judgement, looking first to standards dealing with similar issues, then the Conceptual Framework, and may consider other standard-setters' pronouncements that do not conflict.",
          "Apply policies consistently for similar transactions.",
          "Change a policy only if required by a standard or if the change gives reliable and more relevant information.",
          "Voluntary changes are applied retrospectively: restate comparatives and adjust opening retained earnings of the earliest period presented, unless impracticable.",
          "Applying a policy to transactions that are new or differ in substance is not a change in policy.",
        ],
      },
      {
        heading: "Estimates and errors",
        points: [
          "Changes in estimates are applied prospectively, in the period of change and future periods if affected.",
          "A change in measurement technique (e.g. a different depreciation method) is a change in estimate unless it corrects an error.",
          "Material prior period errors are corrected retrospectively by restating comparatives (or opening balances of the earliest period presented), unless impracticable.",
          "If it is hard to tell whether a change is a policy or an estimate, treat it as a change in estimate.",
        ],
      },
    ],
    disclosures: [
      "Nature of a policy change, reasons, and the adjustment for each line item affected.",
      "Nature and amount of a change in estimate affecting the current period (and future periods, if practicable).",
      "Nature of a prior period error and the correction for each line item and prior period presented.",
      "New standards issued but not yet effective, with known or reasonably estimable impact.",
    ],
    traps: [
      "Changing depreciation method or useful life is a change in estimate (prospective), not a policy change.",
      "Changing from the cost model to the revaluation model under IAS 16/IAS 38 is a change in policy, but it is dealt with as a revaluation under those standards rather than retrospectively under IAS 8.",
      "Errors are corrected through opening retained earnings, not the current year's profit or loss.",
      "Using hindsight to estimate past amounts is not allowed when restating.",
    ],
    example: {
      title: "Change in useful life (change in estimate)",
      scenario:
        "A machine cost $100,000 and was being depreciated straight-line over 10 years with nil residual value. At the start of year 5 the remaining useful life is revised to 4 years.",
      steps: [
        "Carrying amount after 4 years = 100,000 − (4 × 10,000) = $60,000.",
        "Change in estimate → prospective: spread the carrying amount over the revised remaining life.",
        "New annual depreciation = 60,000 ÷ 4 = $15,000.",
      ],
      answer: "Charge $15,000 a year from year 5; prior years are not restated.",
    },
    related: ["IAS 1", "IFRS 18", "IAS 10", "IAS 16"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IAS 10",
    family: "IAS",
    number: 10,
    title: "Events after the Reporting Period",
    slug: "ias-10-events-after-the-reporting-period",
    area: "presentation",
    objective:
      "Sets out when financial statements should be adjusted for events after the reporting date, and what to disclose about the date of authorisation and such events.",
    scope: [
      "Events, favourable and unfavourable, between the end of the reporting period and the date the financial statements are authorised for issue.",
    ],
    definitions: [
      { term: "Adjusting events", meaning: "Events that give evidence of conditions that existed at the end of the reporting period." },
      { term: "Non-adjusting events", meaning: "Events that are indicative of conditions that arose after the reporting period." },
      { term: "Date of authorisation", meaning: "The date the financial statements are authorised for issue (e.g. by the board). Events after this date are outside IAS 10." },
    ],
    rules: [
      {
        heading: "Recognition",
        points: [
          "Adjust the amounts recognised for adjusting events.",
          "Do not adjust for non-adjusting events; disclose material ones.",
          "Dividends declared after the reporting period are not a liability at the reporting date; disclose them in the notes.",
          "If management decides after the year end to liquidate or stop trading, or has no realistic alternative, the going concern basis must not be used.",
        ],
      },
      {
        heading: "Typical adjusting events",
        points: [
          "Settlement of a court case confirming a present obligation at the reporting date.",
          "Customer bankruptcy confirming a receivable was impaired at the year end.",
          "Sale of inventory after the year end giving evidence of NRV at the year end.",
          "Determining the cost of assets bought, or proceeds of assets sold, before the year end.",
          "Discovery of fraud or errors showing the financial statements are incorrect.",
        ],
      },
      {
        heading: "Typical non-adjusting events",
        points: [
          "A fall in the market value of investments after the year end.",
          "Destruction of a plant by fire after the year end.",
          "Major business combinations, disposals, share issues or announced restructurings after the year end.",
          "Changes in tax rates or laws enacted or announced after the reporting period.",
        ],
      },
    ],
    disclosures: [
      "Date the financial statements were authorised for issue and who authorised them (and whether owners can amend them).",
      "For each material non-adjusting event: its nature and an estimate of its financial effect, or a statement that no estimate can be made.",
      "Update disclosures about conditions at the reporting date for new information received.",
    ],
    traps: [
      "The key question is when the condition arose, not when you found out about it.",
      "A fire after the year end is non-adjusting, but if it is so severe that the entity is no longer a going concern, the whole basis of preparation changes.",
      "Dividends declared after the year end are never recognised as liabilities at the year end.",
    ],
    related: ["IAS 1", "IAS 37", "IAS 2", "IAS 8"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IAS 12",
    family: "IAS",
    number: 12,
    title: "Income Taxes",
    slug: "ias-12-income-taxes",
    area: "liabilities",
    objective:
      "Prescribes how to account for current and deferred tax on profits, using the balance-sheet liability method for deferred tax.",
    status: [
      "Amendments effective from 2023 narrowed the initial recognition exemption so it does not apply to transactions that give rise to equal taxable and deductible temporary differences (e.g. many leases and decommissioning obligations).",
      "May 2023 amendments introduced a temporary mandatory exception from recognising and disclosing deferred taxes arising from the OECD Pillar Two global minimum tax rules, with related disclosures.",
    ],
    scope: [
      "Domestic and foreign taxes based on taxable profits, including withholding taxes payable by a subsidiary, associate or joint arrangement on distributions.",
      "Does not cover government grants (IAS 20) or investment tax credits in detail.",
    ],
    definitions: [
      { term: "Current tax", meaning: "Income tax payable or recoverable on the taxable profit or loss for a period." },
      { term: "Tax base", meaning: "The amount attributed to an asset or liability for tax purposes." },
      { term: "Temporary difference", meaning: "The difference between the carrying amount of an asset or liability and its tax base." },
      { term: "Taxable temporary difference", meaning: "One that will result in taxable amounts in future periods, giving a deferred tax liability (e.g. carrying amount of an asset above its tax base)." },
      { term: "Deductible temporary difference", meaning: "One that will result in deductible amounts in future, giving a deferred tax asset (e.g. a provision deductible only when paid)." },
    ],
    rules: [
      {
        heading: "Current tax",
        points: [
          "Recognise unpaid current tax as a liability; overpayments as an asset.",
          "Measure at the amount expected to be paid or recovered, using rates enacted or substantively enacted by the reporting date.",
          "Under/over provisions from prior years are adjusted in the current year's tax charge (they are changes in estimate, not errors, unless they result from an error).",
        ],
      },
      {
        heading: "Deferred tax",
        points: [
          "Recognise a deferred tax liability for all taxable temporary differences, except those from the initial recognition of goodwill and certain initial recognition cases outside business combinations.",
          "Recognise a deferred tax asset for deductible temporary differences, unused tax losses and credits only to the extent it is probable that future taxable profit will be available.",
          "Measure using rates expected to apply when the difference reverses, based on rates enacted or substantively enacted at the reporting date.",
          "Deferred tax is never discounted.",
          "Recognise tax in the same place as the underlying item: profit or loss, OCI or equity (e.g. tax on a revaluation surplus goes to OCI).",
          "In a business combination, deferred tax on fair value adjustments affects the goodwill calculation.",
        ],
      },
    ],
    disclosures: [
      "Major components of the tax expense (current, deferred, prior-year adjustments).",
      "A reconciliation between tax expense and accounting profit multiplied by the applicable rate (or a rate reconciliation).",
      "Deferred tax balances by type of temporary difference and unused losses.",
      "Deductible differences and losses for which no deferred tax asset is recognised.",
    ],
    traps: [
      "Tax base, not 'tax written-down value' of liabilities, drives the calculation: for an accrued expense deductible on payment, the tax base is nil.",
      "Deferred tax on revaluations goes to OCI, not profit or loss.",
      "A history of recent losses is strong evidence against recognising a deferred tax asset.",
      "Do not discount deferred tax, even for long-dated differences.",
    ],
    example: {
      title: "Deferred tax on accelerated tax depreciation",
      scenario:
        "Plant has a carrying amount of $800k and a tax base of $600k at the year end. The tax rate is 25%. The opening deferred tax liability was $30k.",
      steps: [
        "Taxable temporary difference = 800 − 600 = $200k.",
        "Closing deferred tax liability = 200 × 25% = $50k.",
        "Movement = 50 − 30 = $20k increase, charged to profit or loss.",
      ],
      answer: "Deferred tax liability $50k; deferred tax expense $20k.",
    },
    related: ["IAS 16", "IFRS 3", "IAS 37", "IAS 8"],
    banks: ADV,
  },
  {
    code: "IAS 16",
    family: "IAS",
    number: 16,
    title: "Property, Plant and Equipment",
    slug: "ias-16-property-plant-and-equipment",
    area: "assets",
    objective:
      "Sets out when to recognise property, plant and equipment, how to measure it initially and subsequently, and how to depreciate and derecognise it.",
    status: [
      "Amendments effective from 2022 require proceeds from selling items produced while an asset is being brought to its intended use to be recognised in profit or loss, not deducted from cost.",
    ],
    scope: [
      "Tangible items held for use in production or supply of goods or services, for rental to others or for administration, and expected to be used for more than one period.",
      "Includes bearer plants. Excludes assets held for sale (IFRS 5), biological assets other than bearer plants (IAS 41), mineral rights and exploration assets, and investment property measured at fair value (IAS 40).",
    ],
    definitions: [
      { term: "Depreciable amount", meaning: "Cost (or revalued amount) less residual value." },
      { term: "Residual value", meaning: "The estimated amount the entity would currently obtain from disposal, after disposal costs, if the asset were already of the age and condition expected at the end of its useful life." },
      { term: "Useful life", meaning: "The period the asset is expected to be available for use, or the number of units of production expected from it." },
    ],
    rules: [
      {
        heading: "Recognition",
        points: [
          "Recognise when it is probable that future economic benefits will flow to the entity and cost can be measured reliably.",
          "Significant parts with different useful lives are depreciated separately (component accounting), e.g. an aircraft's engines and body.",
          "Day-to-day servicing is expensed; replacement parts meeting the criteria are capitalised and the replaced part derecognised.",
          "Major inspections can be capitalised as a component and depreciated until the next inspection.",
        ],
      },
      {
        heading: "Initial measurement (cost)",
        points: [
          "Purchase price including import duties and non-refundable taxes, after deducting trade discounts and rebates.",
          "Directly attributable costs of bringing the asset to the location and condition needed: site preparation, delivery, installation, professional fees, and testing.",
          "Initial estimate of dismantling and site restoration costs, where an obligation exists (measured under IAS 37, usually at present value).",
          "Excluded: administration and general overheads, staff training, advertising, costs of opening a new facility, relocation costs, and initial operating losses.",
          "Borrowing costs on qualifying assets are capitalised under IAS 23.",
        ],
      },
      {
        heading: "Subsequent measurement",
        points: [
          "Choose the cost model or the revaluation model as a policy for each entire class of assets.",
          "Revaluations must be kept up to date so carrying amount does not differ materially from fair value.",
          "Revaluation increases go to OCI (revaluation surplus), except to the extent they reverse a previous decrease recognised in profit or loss.",
          "Revaluation decreases go to profit or loss, except to the extent of any surplus held for that asset, which is reduced first through OCI.",
          "The surplus may be transferred to retained earnings as the asset is used (excess depreciation) or on disposal; this is never recycled through profit or loss.",
        ],
      },
      {
        heading: "Depreciation and derecognition",
        points: [
          "Depreciate the depreciable amount systematically over the useful life, starting when the asset is available for use.",
          "Land usually has an unlimited life and is not depreciated; land and buildings are accounted for separately.",
          "Review residual value, useful life and depreciation method at least at each financial year end; changes are changes in estimate (IAS 8).",
          "On disposal, the gain or loss (proceeds less carrying amount) goes to profit or loss; it is not revenue.",
        ],
      },
    ],
    disclosures: [
      "Measurement bases, depreciation methods, and useful lives or rates for each class.",
      "Reconciliation of carrying amounts from opening to closing (additions, disposals, depreciation, revaluations, impairments).",
      "For revalued classes: effective date, whether an independent valuer was used, and the carrying amount under the cost model.",
      "Restrictions on title and assets pledged as security; contractual commitments to acquire PPE.",
    ],
    traps: [
      "Staff training and opening ceremonies are never part of cost.",
      "Depreciation starts when the asset is available for use, not when it is first used.",
      "Revaluing one building means revaluing the whole class.",
      "A revaluation loss first uses up that same asset's surplus; it cannot be offset against another asset's surplus.",
      "Changing useful life is prospective, not a prior-year restatement.",
    ],
    example: {
      title: "Cost and depreciation",
      scenario:
        "A machine has a list price of $100,000 with a 5% trade discount. Delivery costs $2,000, installation $3,000 and staff training $1,500. The present value of an obligation to dismantle it is $5,000. Useful life 10 years, residual value $5,000, straight-line.",
      steps: [
        "Purchase price after discount = 100,000 × 95% = $95,000.",
        "Add delivery 2,000 + installation 3,000 + dismantling 5,000 = $105,000. Training is expensed.",
        "Annual depreciation = (105,000 − 5,000) ÷ 10 = $10,000.",
      ],
      answer: "Initial cost $105,000; depreciation $10,000 a year.",
    },
    related: ["IAS 36", "IAS 23", "IAS 37", "IAS 40", "IFRS 16", "IAS 20"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IAS 19",
    family: "IAS",
    number: 19,
    title: "Employee Benefits",
    slug: "ias-19-employee-benefits",
    area: "liabilities",
    objective:
      "Requires an entity to recognise a liability when employees have provided service for benefits to be paid later, and an expense when the entity consumes that service.",
    scope: [
      "All employee benefits except share-based payments (IFRS 2).",
      "Covers short-term benefits, post-employment benefits (pensions), other long-term benefits and termination benefits.",
    ],
    definitions: [
      { term: "Defined contribution plan", meaning: "A plan where the entity pays fixed contributions and has no further obligation if the fund is insufficient; actuarial and investment risk fall on the employee." },
      { term: "Defined benefit plan", meaning: "Any post-employment plan that is not defined contribution; the entity bears the actuarial and investment risk." },
      { term: "Net defined benefit liability (asset)", meaning: "Present value of the defined benefit obligation less the fair value of plan assets, adjusted for any asset ceiling." },
      { term: "Remeasurements", meaning: "Actuarial gains and losses, the return on plan assets excluding amounts in net interest, and changes in the asset ceiling effect." },
    ],
    rules: [
      {
        heading: "Short-term benefits",
        points: [
          "Recognise undiscounted cost as service is rendered (wages, paid leave, bonuses).",
          "Accumulating paid absences are recognised as service builds entitlement; non-accumulating ones when the absence occurs.",
          "Profit-sharing and bonuses are recognised when there is a legal or constructive obligation and a reliable estimate.",
        ],
      },
      {
        heading: "Defined contribution plans",
        points: [
          "Expense the contribution payable for the period's service; accrue any unpaid amount.",
        ],
      },
      {
        heading: "Defined benefit plans",
        points: [
          "Measure the obligation using the projected unit credit method and actuarial assumptions.",
          "Discount using market yields on high-quality corporate bonds (or government bonds where no deep market exists) at the reporting date.",
          "Service cost (current service cost, past service cost, settlement gains or losses) goes to profit or loss.",
          "Net interest on the net liability or asset (using the discount rate) goes to profit or loss.",
          "Remeasurements go to OCI and are never reclassified to profit or loss.",
          "Past service cost from plan amendments or curtailments is recognised immediately, not spread.",
          "A net surplus is limited to the asset ceiling (economic benefits available as refunds or reduced contributions).",
        ],
      },
      {
        heading: "Other benefits",
        points: [
          "Other long-term benefits (e.g. long-service leave) are measured like defined benefit plans, but remeasurements go to profit or loss.",
          "Termination benefits are recognised at the earlier of when the offer can no longer be withdrawn and when related restructuring costs are recognised under IAS 37.",
        ],
      },
    ],
    disclosures: [
      "Characteristics of defined benefit plans and the risks they expose the entity to.",
      "Reconciliations of the obligation, plan assets and the net liability.",
      "Significant actuarial assumptions and a sensitivity analysis.",
      "Amount, timing and uncertainty of future cash flows.",
    ],
    traps: [
      "Remeasurements go to OCI for post-employment plans, but to profit or loss for other long-term benefits.",
      "Interest is calculated on the net liability, using the discount rate; the 'expected return' concept no longer exists.",
      "Contributions paid and benefits paid out are not expenses; benefits paid reduce both the obligation and plan assets.",
    ],
    example: {
      title: "Net defined benefit liability",
      scenario:
        "Opening obligation $1,000k, plan assets $800k. Discount rate 5%. Current service cost $120k. Employer contributions $150k paid at the year end. Actuary's closing net liability is $220k.",
      steps: [
        "Opening net liability = 1,000 − 800 = $200k.",
        "Net interest = 200 × 5% = $10k (profit or loss).",
        "Expected closing net liability = 200 + 120 + 10 − 150 = $180k.",
        "Actual closing net liability is $220k, so the remeasurement loss = $40k (OCI).",
      ],
      answer: "Profit or loss charge $130k (120 + 10); OCI loss $40k; closing liability $220k.",
    },
    related: ["IFRS 2", "IAS 37", "IAS 24", "IAS 1"],
    banks: ADV,
  },
  {
    code: "IAS 20",
    family: "IAS",
    number: 20,
    title: "Accounting for Government Grants and Disclosure of Government Assistance",
    slug: "ias-20-government-grants",
    area: "revenue",
    objective:
      "Explains when and how to recognise government grants and what to disclose about other forms of government assistance.",
    scope: [
      "Grants from government (including government agencies and similar bodies), and disclosure of other government assistance.",
      "Excludes government assistance provided through income tax benefits and grants for biological assets at fair value less costs to sell (IAS 41).",
    ],
    definitions: [
      { term: "Government grant", meaning: "Assistance by government in the form of transfers of resources in return for past or future compliance with conditions relating to operating activities." },
      { term: "Grants related to assets", meaning: "Grants whose main condition is that the entity buys, builds or otherwise acquires long-term assets." },
      { term: "Grants related to income", meaning: "Grants other than those related to assets." },
      { term: "Forgivable loan", meaning: "A loan where the lender undertakes to waive repayment under prescribed conditions." },
    ],
    rules: [
      {
        heading: "Recognition",
        points: [
          "Recognise only when there is reasonable assurance that the entity will comply with the conditions and that the grant will be received.",
          "Recognise in profit or loss on a systematic basis over the periods in which the related costs are expensed (never directly in equity).",
          "A grant compensating for expenses already incurred, or for immediate financial support with no future costs, is recognised when it becomes receivable.",
          "The benefit of a below-market-rate government loan is treated as a grant: the difference between proceeds and the loan's initial IFRS 9 carrying amount.",
          "Non-monetary grants (e.g. land) are usually measured at fair value; a nominal amount is an alternative.",
        ],
      },
      {
        heading: "Presentation",
        points: [
          "Grants related to assets: either deferred income released over the asset's life, or deducted from the asset's carrying amount (reducing depreciation).",
          "Grants related to income: either presented as other income, or deducted from the related expense.",
          "A grant that becomes repayable is a change in estimate; repay first against any unamortised deferred income, then expense the excess.",
        ],
      },
    ],
    disclosures: [
      "Accounting policy, including presentation method.",
      "Nature and extent of grants recognised and other assistance benefited from.",
      "Unfulfilled conditions and contingencies attached to recognised grants.",
    ],
    traps: [
      "Cash received is not the trigger; reasonable assurance of compliance and receipt is.",
      "A repayment is accounted for prospectively, not as a prior period error.",
      "Under the deferred income method, the asset is depreciated on its full cost.",
    ],
    example: {
      title: "Capital grant – both methods",
      scenario:
        "An entity buys equipment for $100,000 and receives a $20,000 grant towards it. Useful life 5 years, nil residual value.",
      steps: [
        "Deferred income method: depreciation 100,000 ÷ 5 = $20,000; grant released 20,000 ÷ 5 = $4,000 a year to income.",
        "Netting method: asset recorded at 80,000; depreciation 80,000 ÷ 5 = $16,000 a year.",
      ],
      answer: "Net charge is $16,000 a year either way; only the presentation differs.",
    },
    related: ["IAS 16", "IAS 41", "IFRS 9", "IAS 8"],
    banks: [...INTRO, "acca-fr", "ca-inter-aa"],
  },
  {
    code: "IAS 21",
    family: "IAS",
    number: 21,
    title: "The Effects of Changes in Foreign Exchange Rates",
    slug: "ias-21-effects-of-changes-in-foreign-exchange-rates",
    area: "other",
    objective:
      "Sets out how to include foreign currency transactions and foreign operations in the financial statements, and how to translate them into a presentation currency.",
    status: [
      "Amendments effective from 1 January 2025 ('Lack of Exchangeability') explain how to assess whether a currency can be exchanged into another and how to estimate a spot rate when it cannot.",
    ],
    scope: [
      "Foreign currency transactions and balances (other than derivatives within IFRS 9), translation of foreign operations on consolidation or equity accounting, and translation into a presentation currency.",
      "Hedge accounting is dealt with in IFRS 9.",
    ],
    definitions: [
      { term: "Functional currency", meaning: "The currency of the primary economic environment in which the entity operates — mainly the currency that drives its sales prices and costs." },
      { term: "Presentation currency", meaning: "The currency in which the financial statements are presented." },
      { term: "Monetary items", meaning: "Units of currency held and assets and liabilities to be received or paid in a fixed or determinable number of currency units (e.g. receivables, payables, loans)." },
      { term: "Foreign operation", meaning: "A subsidiary, associate, joint arrangement or branch whose activities are based or conducted in a country or currency other than the reporting entity's." },
    ],
    rules: [
      {
        heading: "Individual transactions",
        points: [
          "Initially record at the spot rate on the transaction date (an average rate may be used if rates do not fluctuate significantly).",
          "At each reporting date, retranslate monetary items at the closing rate.",
          "Non-monetary items at historical cost stay at the historical rate; those at fair value use the rate at the date fair value was measured.",
          "Exchange differences on monetary items go to profit or loss, including those on settlement.",
          "If a gain or loss on a non-monetary item goes to OCI (e.g. a revaluation), its exchange component also goes to OCI.",
        ],
      },
      {
        heading: "Translating a foreign operation",
        points: [
          "Assets and liabilities, including goodwill and fair value adjustments, at the closing rate.",
          "Income and expenses at the rates on the transaction dates (an average rate is often used as an approximation).",
          "Resulting exchange differences go to OCI and accumulate in equity; they are reclassified to profit or loss on disposal of the foreign operation.",
          "Exchange differences on a monetary item forming part of the net investment in a foreign operation go to OCI in the consolidated statements.",
        ],
      },
    ],
    disclosures: [
      "Exchange differences recognised in profit or loss, and net differences in OCI with a reconciliation.",
      "Functional currency and, if different, the presentation currency and reason for the difference.",
      "Any change in functional currency and the reason.",
    ],
    traps: [
      "Inventory and PPE at cost are not retranslated at the closing rate.",
      "Goodwill on acquiring a foreign subsidiary is retranslated at the closing rate each year.",
      "Functional currency is a matter of fact, not choice; it changes only when underlying conditions change, and the change is prospective.",
    ],
    example: {
      title: "Foreign currency payable",
      scenario:
        "An entity with a $ functional currency buys goods on credit for €10,000 when €1 = $1.20. At the year end the invoice is unpaid and €1 = $1.25.",
      steps: [
        "Initial recognition: inventory and payable at 10,000 × 1.20 = $12,000.",
        "Payable is monetary: retranslate at closing rate 10,000 × 1.25 = $12,500.",
        "Exchange loss = $500 to profit or loss. Inventory (non-monetary) stays at $12,000.",
      ],
      answer: "Payable $12,500; exchange loss $500; inventory $12,000.",
    },
    related: ["IFRS 9", "IFRS 10", "IAS 28", "IAS 1"],
    banks: ADV,
  },
  {
    code: "IAS 23",
    family: "IAS",
    number: 23,
    title: "Borrowing Costs",
    slug: "ias-23-borrowing-costs",
    area: "assets",
    objective:
      "Requires borrowing costs directly attributable to acquiring, constructing or producing a qualifying asset to be included in its cost; other borrowing costs are expensed.",
    scope: [
      "Interest and other costs incurred in connection with borrowing funds, including interest on lease liabilities and certain exchange differences.",
      "Optional exemption for qualifying assets measured at fair value and for inventories produced in large quantities on a repetitive basis.",
    ],
    definitions: [
      { term: "Qualifying asset", meaning: "An asset that necessarily takes a substantial period of time to get ready for its intended use or sale (e.g. a factory, power station or investment property under construction)." },
      { term: "Capitalisation rate", meaning: "The weighted average cost of the entity's general borrowings outstanding during the period, used for funds borrowed generally." },
    ],
    rules: [
      {
        heading: "Capitalisation",
        points: [
          "Specific borrowings: capitalise the actual borrowing costs incurred, less any investment income on temporary investment of those funds.",
          "General borrowings: apply the capitalisation rate to expenditure on the asset; the amount capitalised cannot exceed total borrowing costs incurred.",
          "Start capitalising when expenditure and borrowing costs are being incurred and activities to prepare the asset are under way.",
          "Suspend during extended periods when active development is paused (not for normal, expected delays).",
          "Stop when substantially all activities needed to prepare the asset are complete.",
          "Assets ready for use when acquired, and financial assets, are not qualifying assets.",
        ],
      },
    ],
    disclosures: [
      "Amount of borrowing costs capitalised in the period.",
      "Capitalisation rate used for general borrowings.",
    ],
    traps: [
      "Investment income earned on temporarily invested specific borrowings reduces the amount capitalised.",
      "Capitalisation continues during temporary delays that are part of the normal process (e.g. waiting for concrete to set).",
      "Once the asset is complete, further interest is expensed even if the asset is not yet in use.",
    ],
    example: {
      title: "Specific borrowing",
      scenario:
        "An entity borrows $1,000,000 at 8% on 1 January to build a factory. Construction runs all year. Surplus funds earned $10,000 of interest while temporarily invested.",
      steps: [
        "Interest incurred = 1,000,000 × 8% = $80,000.",
        "Less investment income = $10,000.",
      ],
      answer: "Capitalise $70,000 as part of the factory's cost.",
    },
    related: ["IAS 16", "IAS 2", "IAS 38", "IAS 40", "IFRS 9"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IAS 24",
    family: "IAS",
    number: 24,
    title: "Related Party Disclosures",
    slug: "ias-24-related-party-disclosures",
    area: "presentation",
    objective:
      "Ensures financial statements draw attention to the possibility that results and position have been affected by related parties and by transactions and balances with them.",
    scope: [
      "Identifying related party relationships and transactions, outstanding balances (including commitments), and the disclosures required.",
      "Applies to consolidated, separate and individual financial statements; intragroup transactions are eliminated on consolidation.",
    ],
    definitions: [
      { term: "Related party (person)", meaning: "A person, or close member of that person's family, who has control, joint control or significant influence over the entity, or is a member of key management personnel of the entity or its parent." },
      { term: "Related party (entity)", meaning: "Includes members of the same group, associates and joint ventures (of the entity or of a group member), post-employment benefit plans for employees, entities controlled or jointly controlled by a related person, and entities providing key management services." },
      { term: "Key management personnel (KMP)", meaning: "People with authority and responsibility for planning, directing and controlling the entity's activities, directly or indirectly, including directors." },
      { term: "Close family members", meaning: "Family members who may be expected to influence, or be influenced by, the person in dealings with the entity — for example a spouse or domestic partner, children and dependants." },
    ],
    rules: [
      {
        heading: "Identification",
        points: [
          "Look at the substance of the relationship, not just its legal form.",
          "Not related simply because: two entities share a director or other KMP; two venturers share joint control of a joint venture; they are providers of finance, trade unions, utilities or government departments in normal dealings; or a single customer or supplier is economically dependent on the entity.",
          "A government-related entity has a partial exemption from detailed disclosure of transactions with the government and other entities related to the same government.",
        ],
      },
    ],
    disclosures: [
      "Parent–subsidiary relationships, whether or not there were transactions, including the name of the parent and ultimate controlling party.",
      "KMP compensation in total and by category: short-term, post-employment, other long-term, termination and share-based payment.",
      "For transactions: nature of the relationship, amounts, outstanding balances and terms, allowances for doubtful debts and related expense.",
      "Saying related-party transactions were on arm's length terms is only allowed if that can be substantiated.",
    ],
    traps: [
      "Transactions must be disclosed even if no price was charged.",
      "A shared director alone does not make two entities related.",
      "The parent relationship must be disclosed even with no transactions.",
    ],
    related: ["IFRS 10", "IAS 28", "IFRS 11", "IAS 19"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IAS 27",
    family: "IAS",
    number: 27,
    title: "Separate Financial Statements",
    slug: "ias-27-separate-financial-statements",
    area: "group",
    objective:
      "Sets out how to account for investments in subsidiaries, joint ventures and associates when an entity prepares separate (single-entity) financial statements.",
    scope: [
      "Separate financial statements that an entity chooses, or is required by local law, to present.",
      "Does not say which entities must prepare separate statements, and does not cover consolidation (IFRS 10).",
    ],
    definitions: [
      { term: "Separate financial statements", meaning: "Statements presented by an entity in which it may account for investments in subsidiaries, joint ventures and associates at cost, under IFRS 9, or using the equity method." },
    ],
    rules: [
      {
        heading: "Measurement",
        points: [
          "Account for each category of investment at cost, in accordance with IFRS 9, or using the equity method (IAS 28), applied consistently to each category.",
          "Investments classified as held for sale follow IFRS 5 (when measured at cost).",
          "Dividends from a subsidiary, joint venture or associate are recognised in profit or loss when the right to receive them is established (unless the equity method is used, when they reduce the investment).",
          "Certain group reorganisations that set up a new parent may allow the new parent to measure cost at its share of the original parent's equity.",
        ],
      },
    ],
    disclosures: [
      "The fact that the statements are separate statements and the reason they are prepared, if not required by law.",
      "A list of significant investees: name, principal place of business, ownership interest and method used.",
      "If consolidated statements are not prepared because of the exemption, details of the parent whose consolidated statements are publicly available.",
    ],
    traps: [
      "IAS 27 is about the parent's own accounts — not consolidation.",
      "The equity method is allowed in separate statements as an accounting policy choice.",
    ],
    related: ["IFRS 10", "IAS 28", "IFRS 9", "IFRS 12"],
    banks: ADV,
  },
  {
    code: "IAS 28",
    family: "IAS",
    number: 28,
    title: "Investments in Associates and Joint Ventures",
    slug: "ias-28-investments-in-associates-and-joint-ventures",
    area: "group",
    objective:
      "Prescribes accounting for investments in associates and sets out the equity method for both associates and joint ventures.",
    scope: [
      "All entities that are investors with joint control of, or significant influence over, an investee.",
      "Venture capital organisations, mutual funds and similar entities may instead measure these investments at fair value through profit or loss under IFRS 9.",
    ],
    definitions: [
      { term: "Associate", meaning: "An entity over which the investor has significant influence." },
      { term: "Significant influence", meaning: "The power to participate in financial and operating policy decisions without control or joint control. Holding 20% or more of voting power is presumed to give significant influence, and less than 20% presumed not to, unless clearly shown otherwise." },
      { term: "Equity method", meaning: "Initially recognise the investment at cost, then adjust it for the investor's share of the investee's post-acquisition profit or loss and OCI, less distributions received." },
    ],
    rules: [
      {
        heading: "Equity method",
        points: [
          "Investment = cost + share of post-acquisition retained profits and OCI − impairment − dividends received.",
          "Share of profit or loss goes to profit or loss; share of OCI goes to OCI.",
          "Eliminate unrealised profits on transactions between investor and associate to the extent of the investor's interest.",
          "Use the associate's most recent financial statements, aligned to the investor's policies; a reporting date gap of more than three months is not allowed.",
          "Goodwill is included in the carrying amount and is not tested separately; the whole investment is tested for impairment under IAS 36 when there are indicators.",
          "Stop recognising losses once the investment reaches zero, unless the investor has obligations or has made payments on the associate's behalf.",
          "On losing significant influence, measure any retained interest at fair value and recognise the gain or loss in profit or loss.",
        ],
      },
      {
        heading: "Evidence of significant influence",
        points: [
          "Board representation; participation in policy-making (including dividends); material transactions; interchange of managerial personnel; provision of essential technical information.",
        ],
      },
    ],
    disclosures: [
      "Disclosure requirements are in IFRS 12.",
    ],
    traps: [
      "Associates are not consolidated line by line; only one line in the statement of financial position and one in profit or loss.",
      "Unrealised profit is eliminated only to the investor's percentage, not 100% as with subsidiaries.",
      "Dividends received reduce the investment; they are not income in the group statements.",
      "20% is a presumption — board representation can create significant influence below it.",
    ],
    example: {
      title: "Carrying amount of an associate",
      scenario:
        "An investor buys 30% of an associate for $500,000. In the first year the associate makes a profit of $200,000 and pays dividends of $50,000. At the year end the associate holds goods bought from the investor that include $20,000 of profit.",
      steps: [
        "Share of profit = 30% × 200,000 = $60,000.",
        "Dividends received = 30% × 50,000 = $15,000 (reduces the investment).",
        "Unrealised profit to eliminate = 30% × 20,000 = $6,000.",
        "Investment = 500,000 + 60,000 − 15,000 − 6,000.",
      ],
      answer: "Investment in associate = $539,000 (one common approach deducts the unrealised profit from the investment when the investor is the seller).",
    },
    related: ["IFRS 10", "IFRS 11", "IFRS 12", "IAS 27", "IAS 36"],
    banks: ADV,
  },
  {
    code: "IAS 32",
    family: "IAS",
    number: 32,
    title: "Financial Instruments: Presentation",
    slug: "ias-32-financial-instruments-presentation",
    area: "instruments",
    objective:
      "Sets out how to classify financial instruments as financial liabilities or equity from the issuer's perspective, and when financial assets and liabilities can be offset.",
    scope: [
      "All financial instruments, except interests in subsidiaries, associates and joint ventures, employee benefit plans, insurance contracts and most share-based payment transactions.",
    ],
    definitions: [
      { term: "Financial instrument", meaning: "A contract that gives rise to a financial asset of one entity and a financial liability or equity instrument of another." },
      { term: "Financial liability", meaning: "Broadly, a contractual obligation to deliver cash or another financial asset, or to exchange financial instruments on potentially unfavourable terms (plus certain contracts settled in own equity)." },
      { term: "Equity instrument", meaning: "A contract evidencing a residual interest in the assets of an entity after deducting all of its liabilities." },
      { term: "Compound instrument", meaning: "A non-derivative instrument containing both a liability and an equity component, such as a convertible bond." },
    ],
    rules: [
      {
        heading: "Liability or equity",
        points: [
          "Classify on substance: if the issuer has a contractual obligation it cannot avoid to deliver cash, it is a liability.",
          "Preference shares redeemable mandatorily, or at the holder's option, are liabilities; their 'dividends' are finance costs.",
          "Non-redeemable preference shares with discretionary dividends are equity.",
          "Compound instruments are split: the liability component is the present value of contractual cash flows at the market rate for similar debt without conversion; equity is the residual.",
          "The split is made at issue and is not revised later.",
          "Treasury shares (own shares bought back) are deducted from equity; no gain or loss is recognised on them.",
          "Transaction costs of an equity transaction are deducted from equity.",
        ],
      },
      {
        heading: "Offsetting",
        points: [
          "Offset a financial asset and liability only if there is a currently legally enforceable right to set off and an intention to settle net or simultaneously.",
        ],
      },
    ],
    disclosures: [
      "Disclosure requirements are mainly in IFRS 7.",
    ],
    traps: [
      "Legal form ('shares') does not decide classification — substance does.",
      "The equity component of a convertible is the residual after valuing the liability, not the other way round.",
      "Interest on the liability component uses the market rate (effective rate), not the coupon rate.",
    ],
    example: {
      title: "Convertible bond split",
      scenario:
        "An entity issues a 3-year convertible bond at its $10,000 par value with a 5% annual coupon paid in arrears. Similar debt without conversion rights carries 8%.",
      steps: [
        "PV of coupons = 500 × 2.5771 (3-year annuity at 8%) = $1,289.",
        "PV of principal = 10,000 × 0.7938 = $7,938.",
        "Liability component = 1,289 + 7,938 = $9,227.",
        "Equity component = 10,000 − 9,227 = $773.",
      ],
      answer: "Liability $9,227 (then amortised cost at 8%); equity $773.",
    },
    related: ["IFRS 9", "IFRS 7", "IFRS 13", "IAS 33"],
    banks: ADV,
  },
  {
    code: "IAS 33",
    family: "IAS",
    number: 33,
    title: "Earnings per Share",
    slug: "ias-33-earnings-per-share",
    area: "presentation",
    objective:
      "Sets out how to calculate and present basic and diluted earnings per share so performance can be compared between entities and periods.",
    scope: [
      "Entities whose ordinary shares or potential ordinary shares are publicly traded, or that are in the process of listing, and any entity that chooses to disclose EPS.",
    ],
    definitions: [
      { term: "Basic EPS", meaning: "Profit or loss attributable to ordinary equity holders of the parent divided by the weighted average number of ordinary shares outstanding." },
      { term: "Potential ordinary share", meaning: "An instrument that may entitle its holder to ordinary shares, e.g. convertible debt, options and warrants." },
      { term: "Dilution", meaning: "A reduction in EPS (or increase in loss per share) assuming potential ordinary shares are converted." },
    ],
    rules: [
      {
        heading: "Basic EPS",
        points: [
          "Earnings: profit after tax attributable to the parent, less preference dividends on equity-classified preference shares.",
          "Shares issued at full market price are weighted for the time they are outstanding.",
          "Bonus issues (and share splits) are treated as if they occurred at the start of the earliest period presented; comparative EPS is restated.",
          "Rights issues below market price contain a bonus element: apply a bonus fraction (fair value before the issue ÷ theoretical ex-rights price) to shares before the issue, and restate comparatives.",
        ],
      },
      {
        heading: "Diluted EPS",
        points: [
          "Adjust earnings for the after-tax effect of items that would change on conversion (e.g. add back interest on convertible debt, net of tax).",
          "Add the weighted average number of shares that would be issued on conversion.",
          "Options and warrants: only the 'free' element is added — shares under option less the number that could be bought at average market price with the exercise proceeds.",
          "Ignore potential shares that are anti-dilutive (would increase EPS).",
        ],
      },
    ],
    disclosures: [
      "Basic and diluted EPS for profit from continuing operations and for total profit, on the face of the statement of profit or loss, with equal prominence (even if negative).",
      "Earnings and share numbers used, with reconciliations.",
      "Instruments excluded because they are anti-dilutive.",
      "Significant share transactions after the reporting period.",
    ],
    traps: [
      "Do not time-weight a bonus issue — treat it as outstanding for the whole period.",
      "Interest add-back for convertibles is after tax.",
      "Preference dividends on redeemable (liability) preference shares are already in finance costs; do not deduct them again.",
      "Remember to restate the prior-year EPS for bonus issues and the bonus element of rights issues.",
    ],
    example: {
      title: "Weighted average shares",
      scenario:
        "Profit attributable to ordinary shareholders is $1,000,000. On 1 January there were 1,000,000 shares in issue. On 1 July the entity issued 300,000 shares at full market price. The year ends 31 December.",
      steps: [
        "Weighted shares = 1,000,000 + (300,000 × 6/12) = 1,150,000.",
        "Basic EPS = 1,000,000 ÷ 1,150,000.",
      ],
      answer: "Basic EPS ≈ $0.87 (87 cents).",
    },
    related: ["IAS 1", "IFRS 18", "IAS 32", "IFRS 2"],
    banks: ADV,
  },
  {
    code: "IAS 36",
    family: "IAS",
    number: 36,
    title: "Impairment of Assets",
    slug: "ias-36-impairment-of-assets",
    area: "assets",
    objective:
      "Ensures assets are not carried at more than their recoverable amount, and sets out how to recognise and reverse impairment losses.",
    scope: [
      "Most non-financial assets, including PPE, intangibles, goodwill, right-of-use assets, and investments in subsidiaries, associates and joint ventures.",
      "Excludes inventories, contract assets, deferred tax assets, employee benefit assets, financial assets in IFRS 9, investment property at fair value, biological assets at fair value less costs to sell, and assets held for sale.",
    ],
    definitions: [
      { term: "Recoverable amount", meaning: "The higher of fair value less costs of disposal and value in use." },
      { term: "Value in use", meaning: "Present value of the future cash flows expected from the asset or cash-generating unit (CGU), in its current condition." },
      { term: "Cash-generating unit", meaning: "The smallest identifiable group of assets that generates cash inflows largely independent of other assets or groups." },
      { term: "Impairment loss", meaning: "The amount by which carrying amount exceeds recoverable amount." },
    ],
    rules: [
      {
        heading: "When to test",
        points: [
          "Assess at each reporting date whether there is any indication of impairment; if so, estimate recoverable amount.",
          "Test annually regardless of indicators: goodwill, intangibles with indefinite lives, and intangibles not yet available for use.",
          "External indicators: significant fall in market value, adverse changes in technology, markets or law, higher interest rates, market capitalisation below net assets.",
          "Internal indicators: obsolescence or physical damage, plans to discontinue or restructure, worse-than-expected performance.",
        ],
      },
      {
        heading: "Measurement",
        points: [
          "Value in use uses cash flows from the asset in its current condition (excluding uncommitted restructurings and enhancements, and excluding financing and tax), discounted at a pre-tax rate.",
          "Impairment of an asset at cost goes to profit or loss; for a revalued asset it is a revaluation decrease (OCI first, to the extent of that asset's surplus).",
          "Goodwill is allocated to the CGUs expected to benefit from the combination.",
          "A CGU impairment is allocated first to goodwill, then pro rata to other assets in the unit — but no asset is reduced below the highest of its fair value less costs of disposal, value in use and zero.",
        ],
      },
      {
        heading: "Reversals",
        points: [
          "Reverse an impairment of an asset other than goodwill if the estimates used to determine recoverable amount have changed.",
          "The reversed carrying amount cannot exceed what it would have been (net of depreciation) had no impairment been recognised.",
          "Impairment losses on goodwill are never reversed.",
        ],
      },
    ],
    disclosures: [
      "Impairment losses and reversals by class of asset, and where they are presented.",
      "Events and circumstances leading to material losses or reversals.",
      "For CGUs containing significant goodwill or indefinite-life intangibles: key assumptions, discount rates and sensitivity information.",
    ],
    traps: [
      "Recoverable amount is the higher of the two measures, not the lower.",
      "If either measure exceeds carrying amount, there is no impairment — you do not need to calculate the other.",
      "Goodwill absorbs the CGU loss first; current assets like inventory and receivables are outside IAS 36's allocation.",
      "Goodwill impairments can never be reversed.",
    ],
    example: {
      title: "Single asset impairment",
      scenario:
        "A machine has a carrying amount of $1,000k. Its fair value less costs of disposal is $820k and its value in use is $850k.",
      steps: [
        "Recoverable amount = higher of 820 and 850 = $850k.",
        "Impairment = 1,000 − 850 = $150k.",
      ],
      answer: "Recognise a $150k impairment loss in profit or loss (asset at cost); carry the machine at $850k.",
    },
    related: ["IAS 16", "IAS 38", "IFRS 3", "IFRS 5", "IFRS 13"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IAS 37",
    family: "IAS",
    number: 37,
    title: "Provisions, Contingent Liabilities and Contingent Assets",
    slug: "ias-37-provisions-contingent-liabilities-and-contingent-assets",
    area: "liabilities",
    objective:
      "Ensures provisions, contingent liabilities and contingent assets are recognised and measured appropriately and enough information is disclosed about them.",
    status: [
      "Amendments effective from 2022 clarified that the cost of fulfilling a contract (for onerous contract tests) includes both incremental costs and an allocation of other costs that relate directly to the contract.",
    ],
    scope: [
      "All provisions, contingent liabilities and contingent assets, except those from executory contracts (unless onerous) and those covered by another standard (e.g. income taxes, leases, employee benefits, insurance contracts, financial instruments).",
    ],
    definitions: [
      { term: "Provision", meaning: "A liability of uncertain timing or amount." },
      { term: "Constructive obligation", meaning: "An obligation arising from an established pattern of past practice, published policies or a sufficiently specific current statement, creating a valid expectation in others that the entity will meet certain responsibilities." },
      { term: "Contingent liability", meaning: "A possible obligation depending on uncertain future events not wholly within the entity's control, or a present obligation where an outflow is not probable or cannot be measured reliably." },
      { term: "Contingent asset", meaning: "A possible asset from past events whose existence will be confirmed only by uncertain future events not wholly within the entity's control." },
      { term: "Onerous contract", meaning: "A contract where the unavoidable costs of meeting the obligations exceed the economic benefits expected under it." },
    ],
    rules: [
      {
        heading: "Recognition",
        points: [
          "Recognise a provision only when: there is a present obligation (legal or constructive) from a past event; an outflow of resources is probable (more likely than not); and a reliable estimate can be made.",
          "No provision for future operating losses.",
          "Onerous contracts: recognise a provision for the unavoidable costs — the lower of the cost of fulfilling the contract and any penalty for leaving it.",
          "Restructuring provisions need a detailed formal plan and a valid expectation in those affected (plan started or announced) by the reporting date.",
          "Contingent liabilities: not recognised; disclose unless the possibility of outflow is remote.",
          "Contingent assets: not recognised; disclose when an inflow is probable. Recognise the asset only when the inflow is virtually certain (it is then no longer contingent).",
        ],
      },
      {
        heading: "Measurement",
        points: [
          "Best estimate of the expenditure needed to settle the obligation at the reporting date.",
          "Large populations: expected value. Single obligations: the most likely outcome, considering other outcomes.",
          "Discount to present value where the effect is material, using a pre-tax rate; the unwinding is a finance cost.",
          "Reimbursements (e.g. insurance) are recognised as a separate asset only when virtually certain, and cannot exceed the provision.",
          "Review provisions at each reporting date and use them only for the expenditure they were set up for.",
          "Restructuring provisions include only direct costs necessarily caused by the restructuring — not retraining, relocating staff, marketing or new systems.",
        ],
      },
    ],
    disclosures: [
      "For each class of provision: opening and closing amounts, additions, amounts used, unused amounts reversed, and unwinding of discount.",
      "Nature of the obligation, expected timing and uncertainties.",
      "For contingent liabilities (not remote) and probable contingent assets: nature and estimated financial effect where practicable.",
    ],
    traps: [
      "A board decision alone does not create a restructuring obligation before the year end.",
      "Future repairs or refurbishment are not provided for — there is no obligation independent of future actions.",
      "Dismantling costs provided for are also added to the asset's cost under IAS 16.",
      "Probable → provide; possible → disclose; remote → ignore.",
    ],
    example: {
      title: "Warranty provision (expected value)",
      scenario:
        "An entity sells goods with a one-year warranty. If all goods sold had minor defects, repairs would cost $1m; if all had major defects, $4m. It expects 75% of goods to have no defects, 20% minor and 5% major.",
      steps: [
        "Minor: 20% × 1,000,000 = $200,000.",
        "Major: 5% × 4,000,000 = $200,000.",
        "Expected value = 0 + 200,000 + 200,000.",
      ],
      answer: "Provision = $400,000.",
    },
    related: ["IAS 10", "IAS 16", "IFRS 3", "IAS 19", "IFRS 15"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IAS 38",
    family: "IAS",
    number: 38,
    title: "Intangible Assets",
    slug: "ias-38-intangible-assets",
    area: "assets",
    objective:
      "Sets out how to recognise and measure intangible assets not covered by another standard, including internally generated ones such as development costs.",
    scope: [
      "Intangible assets other than financial assets, goodwill acquired in a business combination (IFRS 3), deferred tax, leases within IFRS 16, employee benefit assets, and those covered by other standards.",
    ],
    definitions: [
      { term: "Intangible asset", meaning: "An identifiable non-monetary asset without physical substance." },
      { term: "Identifiable", meaning: "Separable (can be sold, licensed or exchanged) or arising from contractual or other legal rights." },
      { term: "Research", meaning: "Original, planned investigation undertaken to gain new scientific or technical knowledge." },
      { term: "Development", meaning: "Applying research findings to a plan or design for new or substantially improved products or processes before commercial production." },
    ],
    rules: [
      {
        heading: "Recognition",
        points: [
          "Recognise when it is probable that future economic benefits will flow and cost can be measured reliably.",
          "Research costs are always expensed.",
          "Development costs must be capitalised once the entity can demonstrate all of: technical feasibility, intention to complete, ability to use or sell, how it will generate probable future economic benefits, adequate resources to complete, and reliable measurement of the expenditure.",
          "Never recognised when internally generated: goodwill, brands, mastheads, publishing titles, customer lists and similar items.",
          "Expenditure on start-up activities, training, advertising and relocation is expensed.",
          "In a business combination, identifiable intangibles of the acquiree are recognised separately from goodwill, even if the acquiree had not recognised them.",
        ],
      },
      {
        heading: "Measurement",
        points: [
          "Initially at cost.",
          "Subsequently: cost model, or revaluation model only if fair value can be determined by reference to an active market (rare).",
          "Finite life: amortise systematically over useful life, normally with nil residual value; review period and method at least each year end.",
          "Indefinite life (no foreseeable limit to cash flows): no amortisation; test for impairment annually and review the indefinite-life assessment each period.",
          "Expenditure expensed before the criteria were met cannot be reinstated as an asset later.",
        ],
      },
    ],
    disclosures: [
      "For each class: whether lives are finite or indefinite, amortisation methods and rates.",
      "Reconciliation of carrying amounts from opening to closing.",
      "For indefinite-life intangibles: carrying amount and reasons supporting the indefinite life.",
      "Research and development expenditure expensed in the period.",
    ],
    traps: [
      "If you cannot separate research from development, treat it all as research.",
      "Capitalising development is mandatory once all criteria are met — it is not a choice.",
      "Indefinite does not mean infinite; it means no foreseeable limit.",
      "A purchased brand can be recognised; an internally developed one cannot.",
    ],
    example: {
      title: "Development costs",
      scenario:
        "A company spends $300k on a project from January to March and $600k from April to December. All capitalisation criteria were first met on 1 April. The product launches next year.",
      steps: [
        "January–March costs ($300k): criteria not met → expense.",
        "April–December costs ($600k): criteria met → capitalise.",
        "Amortisation starts when the product is available for use (next year).",
      ],
      answer: "Expense $300k; recognise an intangible asset of $600k; no amortisation this year.",
    },
    related: ["IAS 36", "IFRS 3", "IAS 16", "IAS 23"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IAS 40",
    family: "IAS",
    number: 40,
    title: "Investment Property",
    slug: "ias-40-investment-property",
    area: "assets",
    objective:
      "Prescribes how to recognise, measure and disclose property held to earn rentals or for capital appreciation.",
    scope: [
      "Land and buildings (or parts) held by an owner, or by a lessee as a right-of-use asset, to earn rentals or for capital appreciation, including property being built for future use as investment property.",
      "Excludes owner-occupied property (IAS 16), property held for sale in the ordinary course of business (IAS 2), and property leased to others under a finance lease.",
    ],
    definitions: [
      { term: "Investment property", meaning: "Property held to earn rentals, capital appreciation or both, rather than for use in production, supply of goods or services, administration, or sale in the ordinary course of business." },
      { term: "Owner-occupied property", meaning: "Property held for use in production or supply of goods or services, or for administrative purposes." },
    ],
    rules: [
      {
        heading: "Recognition and initial measurement",
        points: [
          "Recognise when future economic benefits are probable and cost can be measured reliably.",
          "Initially measure at cost including transaction costs (e.g. legal fees, property transfer taxes).",
          "If part is owner-occupied and the parts could be sold separately, account for them separately; otherwise it is investment property only if the owner-occupied part is insignificant.",
          "If significant ancillary services are provided (e.g. a hotel), the property is owner-occupied.",
        ],
      },
      {
        heading: "Subsequent measurement",
        points: [
          "Choose the fair value model or the cost model for all investment property.",
          "Fair value model: remeasure at fair value at each reporting date; changes go to profit or loss; no depreciation.",
          "Cost model: follow IAS 16 (depreciate), but disclose fair value.",
          "A change from cost to fair value model is permitted only if it gives more relevant information; the reverse is highly unlikely to qualify.",
        ],
      },
      {
        heading: "Transfers",
        points: [
          "Transfer into or out of investment property only when there is a change in use supported by evidence; a change in management's intentions alone is not enough.",
          "Owner-occupied → investment property at fair value: apply IAS 16 up to the date of change; any difference to fair value at that date is treated like an IAS 16 revaluation (gains to OCI).",
          "Inventory → investment property at fair value: the difference goes to profit or loss.",
          "Investment property at fair value → owner-occupied or inventory: fair value at the date of change becomes deemed cost.",
        ],
      },
    ],
    disclosures: [
      "Model used, and criteria to distinguish investment property where classification is difficult.",
      "Methods and significant assumptions in determining fair value, and whether an independent valuer was used.",
      "Rental income and direct operating expenses.",
      "Reconciliation of carrying amounts; under the cost model, the fair value.",
    ],
    traps: [
      "No depreciation under the fair value model.",
      "Fair value gains on investment property go to profit or loss — not OCI like IAS 16 revaluations.",
      "Property let to a subsidiary is investment property in the parent's own accounts but owner-occupied PPE in the group accounts.",
      "Property held for sale in the ordinary course of business is inventory, not investment property.",
    ],
    example: {
      title: "Fair value model",
      scenario:
        "On 1 January a company buys an office block to rent out for $2,000,000 plus legal fees of $50,000. At 31 December the fair value is $2,300,000. It uses the fair value model.",
      steps: [
        "Initial cost = 2,000,000 + 50,000 = $2,050,000.",
        "Fair value gain = 2,300,000 − 2,050,000 = $250,000 to profit or loss.",
        "No depreciation charged.",
      ],
      answer: "Carrying amount $2,300,000; gain $250,000 in profit or loss.",
    },
    related: ["IAS 16", "IFRS 13", "IFRS 16", "IAS 2", "IFRS 5"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IAS 41",
    family: "IAS",
    number: 41,
    title: "Agriculture",
    slug: "ias-41-agriculture",
    area: "assets",
    objective:
      "Sets out the accounting for agricultural activity — biological assets and agricultural produce at the point of harvest.",
    scope: [
      "Biological assets (except bearer plants), agricultural produce at the point of harvest, and certain government grants related to biological assets.",
      "Excludes land (IAS 16 / IAS 40), bearer plants (IAS 16), intangible assets (IAS 38), and produce after harvest (IAS 2). Produce growing on bearer plants is within IAS 41.",
    ],
    definitions: [
      { term: "Biological asset", meaning: "A living animal or plant." },
      { term: "Agricultural produce", meaning: "The harvested product of biological assets (e.g. milk, wool, picked fruit)." },
      { term: "Bearer plant", meaning: "A living plant used to produce or supply agricultural produce, expected to bear produce for more than one period, and with only a remote chance of being sold as produce (e.g. tea bushes, grape vines)." },
    ],
    rules: [
      {
        heading: "Recognition and measurement",
        points: [
          "Recognise a biological asset when the entity controls it, future benefits are probable and fair value or cost can be measured reliably.",
          "Measure biological assets at fair value less costs to sell on initial recognition and at each reporting date.",
          "Gains and losses on initial recognition and from changes in fair value less costs to sell go to profit or loss.",
          "Agricultural produce is measured at fair value less costs to sell at the point of harvest; that amount becomes its cost under IAS 2.",
          "If fair value cannot be measured reliably on initial recognition (rebuttable presumption), use cost less depreciation and impairment until it can.",
          "An unconditional grant for a biological asset measured at fair value less costs to sell is recognised in profit or loss when it becomes receivable; a conditional one when the conditions are met.",
        ],
      },
    ],
    disclosures: [
      "Aggregate gain or loss arising in the period on initial recognition and from changes in fair value less costs to sell.",
      "Description of each group of biological assets.",
      "Reconciliation of carrying amounts, with changes from physical change and price change encouraged to be shown separately.",
    ],
    traps: [
      "Bearer plants are PPE under IAS 16, but their unharvested produce is IAS 41.",
      "Costs to sell exclude transport costs to market; those are already reflected in fair value.",
      "After harvest, IAS 41 stops and IAS 2 takes over.",
    ],
    example: {
      title: "Dairy herd",
      scenario:
        "A farm holds 100 dairy cows. At the start of the year fair value less costs to sell was $500 per cow; at the year end it is $560 per cow. No cows were bought or sold.",
      steps: [
        "Opening carrying amount = 100 × 500 = $50,000.",
        "Closing carrying amount = 100 × 560 = $56,000.",
      ],
      answer: "Recognise a $6,000 gain in profit or loss; herd carried at $56,000.",
    },
    related: ["IAS 2", "IAS 16", "IAS 20", "IFRS 13"],
    banks: [...INTRO, "acca-fr", "caf-6"],
  },

  /* ───────────────────────── IFRS ───────────────────────── */
  {
    code: "IFRS 1",
    family: "IFRS",
    number: 1,
    title: "First-time Adoption of International Financial Reporting Standards",
    slug: "ifrs-1-first-time-adoption-of-ifrs",
    area: "other",
    objective:
      "Ensures an entity's first IFRS financial statements are a suitable starting point, transparent and comparable, at a cost that does not exceed the benefits.",
    scope: [
      "An entity's first IFRS financial statements, and interim reports for part of that first period.",
      "Applies when the entity makes an explicit and unreserved statement of compliance with IFRS for the first time.",
    ],
    definitions: [
      { term: "Date of transition", meaning: "The beginning of the earliest period for which full comparative IFRS information is presented." },
      { term: "Opening IFRS statement of financial position", meaning: "The statement of financial position at the date of transition." },
      { term: "Deemed cost", meaning: "An amount used as a substitute for cost at a given date (e.g. fair value at transition)." },
    ],
    rules: [
      {
        heading: "General approach",
        points: [
          "Prepare an opening IFRS statement of financial position at the date of transition.",
          "Use the same accounting policies throughout, based on standards effective at the end of the first IFRS reporting period, applied retrospectively.",
          "Recognise all assets and liabilities IFRS requires, derecognise those it does not permit, reclassify items and measure everything under IFRS.",
          "Adjustments are recognised directly in retained earnings (or another equity category) at the date of transition.",
        ],
      },
      {
        heading: "Exceptions and exemptions",
        points: [
          "Mandatory exceptions prohibit retrospective application in certain areas, including estimates (no hindsight), derecognition of financial instruments, hedge accounting and some aspects of non-controlling interests.",
          "Optional exemptions give relief in areas such as past business combinations, using fair value or a previous revaluation as deemed cost, and resetting cumulative translation differences to zero.",
        ],
      },
    ],
    disclosures: [
      "Explanation of how the transition affected financial position, performance and cash flows.",
      "Reconciliations of equity (at the transition date and the end of the latest previous-GAAP period) and of total comprehensive income.",
      "Any impairment losses recognised or reversed in preparing the opening statement of financial position.",
    ],
    traps: [
      "Estimates at transition must be consistent with those under previous GAAP unless they were in error — hindsight is not allowed.",
      "The standards used are those in force at the end of the first IFRS reporting period, not at the transition date.",
      "The first IFRS statements include three statements of financial position (opening, comparative and current).",
    ],
    related: ["IAS 8", "IFRS 3", "IAS 16", "IAS 21"],
    banks: ADV,
  },
  {
    code: "IFRS 2",
    family: "IFRS",
    number: 2,
    title: "Share-based Payment",
    slug: "ifrs-2-share-based-payment",
    area: "other",
    objective:
      "Requires an entity to reflect the effects of share-based payment transactions, including employee share options, in profit or loss and financial position.",
    scope: [
      "Equity-settled transactions (paid in the entity's own equity instruments), cash-settled transactions (cash based on share price), and transactions with a choice of settlement.",
      "Includes group arrangements where another group entity settles. Excludes shares issued in a business combination (IFRS 3).",
    ],
    definitions: [
      { term: "Grant date", meaning: "The date the entity and counterparty agree to the arrangement and share a common understanding of its terms." },
      { term: "Vesting period", meaning: "The period over which all specified vesting conditions are to be satisfied." },
      { term: "Market condition", meaning: "A performance condition linked to the share price (e.g. a target share price or total shareholder return)." },
      { term: "Non-market condition", meaning: "A vesting condition not linked to share price, such as remaining in service or hitting a profit target." },
    ],
    rules: [
      {
        heading: "Equity-settled",
        points: [
          "Dr expense (or asset), Cr equity.",
          "For employees, measure at the fair value of the equity instruments at grant date; this is not remeasured later.",
          "For other parties, measure at the fair value of goods or services received (rebuttable presumption that this is reliable).",
          "Spread the expense over the vesting period.",
          "True-up for non-market conditions: revise the estimated number of instruments expected to vest each period.",
          "Market conditions are reflected in grant-date fair value only; no true-up if they are not met (provided service is rendered).",
          "Modifications that increase fair value add the incremental amount over the remaining period; cancellations accelerate the remaining charge.",
        ],
      },
      {
        heading: "Cash-settled",
        points: [
          "Dr expense, Cr liability.",
          "Remeasure the liability at fair value at each reporting date and at settlement, with changes in profit or loss.",
          "Spread recognition over the vesting period based on service received.",
        ],
      },
    ],
    disclosures: [
      "Nature and extent of arrangements during the period.",
      "How fair value was determined (option pricing model and inputs).",
      "Effect on profit or loss and financial position.",
    ],
    traps: [
      "Equity-settled: grant-date fair value is fixed — never update it for later share price changes.",
      "Cash-settled: use the fair value at each reporting date, so share price movements hit profit or loss.",
      "Employees leaving reduces the expected number vesting; missing a market condition does not.",
    ],
    example: {
      title: "Equity-settled share options",
      scenario:
        "On 1 January Year 1 an entity grants 500 options each to 100 employees, vesting after 3 years' service. Grant-date fair value is $12 per option. At the end of Year 1 it expects 85 employees to stay; at the end of Year 2, 88.",
      steps: [
        "Year 1 cumulative = 85 × 500 × 12 × 1/3 = $170,000 → expense $170,000.",
        "Year 2 cumulative = 88 × 500 × 12 × 2/3 = $352,000.",
        "Year 2 expense = 352,000 − 170,000 = $182,000.",
      ],
      answer: "Expense $170,000 in Year 1 and $182,000 in Year 2, with the credit to equity.",
    },
    related: ["IAS 19", "IAS 32", "IAS 33", "IFRS 13"],
    banks: ADV,
  },
  {
    code: "IFRS 3",
    family: "IFRS",
    number: 3,
    title: "Business Combinations",
    slug: "ifrs-3-business-combinations",
    area: "group",
    objective:
      "Sets out how an acquirer recognises and measures the assets acquired, liabilities assumed, any non-controlling interest and goodwill in a business combination.",
    scope: [
      "Transactions where an acquirer obtains control of one or more businesses.",
      "Excludes formation of a joint arrangement in its own financial statements, acquisitions of assets that are not a business, and combinations of entities under common control.",
    ],
    definitions: [
      { term: "Business", meaning: "An integrated set of activities and assets that includes, at a minimum, an input and a substantive process that together significantly contribute to the ability to create outputs. An optional 'concentration test' can show that an acquisition is of assets rather than a business." },
      { term: "Acquisition date", meaning: "The date the acquirer obtains control." },
      { term: "Goodwill", meaning: "An asset representing future economic benefits from assets that are not individually identified and separately recognised." },
      { term: "Non-controlling interest (NCI)", meaning: "Equity in a subsidiary not attributable, directly or indirectly, to the parent." },
    ],
    rules: [
      {
        heading: "Acquisition method",
        points: [
          "Identify the acquirer and the acquisition date.",
          "Recognise identifiable assets and liabilities at acquisition-date fair value, including intangibles the acquiree never recognised.",
          "Specific exceptions apply, e.g. deferred tax (IAS 12), employee benefits (IAS 19), share-based payments (IFRS 2) and assets held for sale (IFRS 5).",
          "A contingent liability of the acquiree is recognised if it is a present obligation and its fair value is reliable, even if an outflow is not probable.",
          "Do not recognise provisions for the acquirer's planned restructuring or future losses of the acquiree.",
        ],
      },
      {
        heading: "Consideration, NCI and goodwill",
        points: [
          "Consideration is measured at fair value, including contingent consideration (at acquisition-date fair value).",
          "Acquisition-related costs (legal, due diligence) are expensed; costs of issuing debt or equity follow IFRS 9 / IAS 32.",
          "NCI may be measured at fair value (full goodwill) or at its proportionate share of identifiable net assets, chosen per acquisition.",
          "Goodwill = consideration + NCI + fair value of any previously held interest − fair value of identifiable net assets.",
          "A negative result (bargain purchase) is reassessed and, if confirmed, recognised as a gain in profit or loss.",
          "In a step acquisition, the previously held interest is remeasured to fair value with the gain or loss in profit or loss.",
          "Provisional amounts can be adjusted for new information about acquisition-date facts during a measurement period of up to one year.",
          "Later changes in contingent consideration (outside the measurement period): equity-classified is not remeasured; others are remeasured at fair value through profit or loss.",
        ],
      },
    ],
    disclosures: [
      "Name and description of the acquiree, acquisition date, percentage acquired and reasons for the combination.",
      "Fair value of consideration and its components, amounts recognised for each major class of assets and liabilities.",
      "Qualitative factors behind goodwill, and the NCI measurement basis.",
      "Revenue and profit of the acquiree since acquisition, and for the combined entity as if acquired at the start of the year.",
    ],
    traps: [
      "Acquisition costs are expensed, not added to goodwill.",
      "Goodwill is not amortised; it is tested for impairment annually under IAS 36.",
      "Post-acquisition changes in contingent consideration due to events after acquisition do not adjust goodwill.",
      "Bargain purchase gains go to profit or loss immediately — after reassessment.",
    ],
    example: {
      title: "Goodwill on acquisition",
      scenario:
        "P acquires 80% of S for $800,000 cash. The fair value of S's identifiable net assets is $900,000. The fair value of the 20% NCI is $190,000.",
      steps: [
        "Full goodwill (NCI at fair value): 800,000 + 190,000 − 900,000 = $90,000.",
        "Partial goodwill (NCI at share of net assets): NCI = 20% × 900,000 = 180,000; goodwill = 800,000 + 180,000 − 900,000 = $80,000.",
      ],
      answer: "Goodwill is $90,000 under the fair value method or $80,000 under the proportionate method.",
    },
    related: ["IFRS 10", "IAS 36", "IFRS 13", "IAS 38", "IAS 12"],
    banks: ADV,
  },
  {
    code: "IFRS 5",
    family: "IFRS",
    number: 5,
    title: "Non-current Assets Held for Sale and Discontinued Operations",
    slug: "ifrs-5-non-current-assets-held-for-sale-and-discontinued-operations",
    area: "assets",
    objective:
      "Sets out the accounting for assets held for sale and the presentation and disclosure of discontinued operations.",
    scope: [
      "All recognised non-current assets and disposal groups, and assets held for distribution to owners.",
      "Some assets are outside its measurement rules (but within presentation), including deferred tax assets, employee benefit assets, financial assets within IFRS 9, investment property at fair value and biological assets at fair value less costs to sell.",
    ],
    definitions: [
      { term: "Disposal group", meaning: "A group of assets (and directly associated liabilities) to be disposed of together in a single transaction." },
      { term: "Discontinued operation", meaning: "A component that has been disposed of or is held for sale and represents a separate major line of business or geographical area (or is part of a single co-ordinated plan to dispose of one, or is a subsidiary acquired exclusively for resale)." },
      { term: "Costs to sell", meaning: "Incremental costs directly attributable to disposal, excluding finance costs and income tax." },
    ],
    rules: [
      {
        heading: "Held-for-sale criteria",
        points: [
          "Carrying amount will be recovered principally through sale rather than continuing use.",
          "Available for immediate sale in its present condition on usual terms.",
          "Sale is highly probable: management committed to a plan, active programme to find a buyer, marketed at a reasonable price, expected to complete within one year (with limited extensions), and the plan is unlikely to change significantly.",
          "Assets to be abandoned are not held for sale (although an abandoned component may be a discontinued operation).",
        ],
      },
      {
        heading: "Measurement and presentation",
        points: [
          "Measure at the lower of carrying amount and fair value less costs to sell; remeasure the carrying amount under the relevant standards immediately before classification.",
          "Any write-down is an impairment loss in profit or loss; later gains are recognised only up to cumulative losses previously recognised.",
          "Stop depreciating or amortising once classified as held for sale.",
          "Present held-for-sale assets and liabilities separately in the statement of financial position; do not offset them.",
          "Discontinued operations: show a single amount in the statement of profit or loss (post-tax profit or loss plus any post-tax remeasurement or disposal gain or loss), analysed in the notes; restate comparatives.",
        ],
      },
    ],
    disclosures: [
      "Description of the asset or disposal group, facts and circumstances of the sale, and expected timing.",
      "Gains or losses recognised and the segment in which it is presented.",
      "For discontinued operations: revenue, expenses, profit before tax, tax, and net cash flows by activity.",
    ],
    traps: [
      "Meeting the criteria after the year end is a non-adjusting event — do not reclassify at the year end.",
      "No depreciation once held for sale, even if the asset is still in use until sold.",
      "An impairment in a disposal group is allocated first to goodwill, then to non-current assets within IFRS 5's measurement scope.",
      "Comparatives are restated for discontinued operations in profit or loss, but not in the statement of financial position.",
    ],
    example: {
      title: "Measuring an asset held for sale",
      scenario:
        "A building is classified as held for sale. Its carrying amount is $500k; fair value is $460k and costs to sell are $10k.",
      steps: [
        "Fair value less costs to sell = 460 − 10 = $450k.",
        "Lower of 500 and 450 = $450k.",
        "Impairment loss = 500 − 450 = $50k to profit or loss; stop depreciation.",
      ],
      answer: "Carry the building at $450k, shown separately as held for sale.",
    },
    related: ["IAS 16", "IAS 36", "IAS 10", "IFRS 10", "IFRS 18"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IFRS 7",
    family: "IFRS",
    number: 7,
    title: "Financial Instruments: Disclosures",
    slug: "ifrs-7-financial-instruments-disclosures",
    area: "instruments",
    objective:
      "Requires disclosures that let users evaluate how significant financial instruments are to an entity and the nature and extent of the risks arising from them and how they are managed.",
    status: [
      "IFRS 7 has been amended alongside IFRS 9 several times (for example, supplier finance disclosures from 2024 and classification-related amendments effective from 2026). Check the current text for details.",
    ],
    scope: [
      "All entities and all types of financial instruments, with the same exclusions as IAS 32 (e.g. interests in subsidiaries, most employee benefits, share-based payments).",
    ],
    definitions: [
      { term: "Credit risk", meaning: "The risk that one party to a financial instrument causes a loss to the other by failing to meet an obligation." },
      { term: "Liquidity risk", meaning: "The risk that an entity will struggle to meet obligations on its financial liabilities that are settled in cash or another financial asset." },
      { term: "Market risk", meaning: "The risk that fair value or future cash flows fluctuate because of market prices; it comprises currency risk, interest rate risk and other price risk." },
    ],
    rules: [
      {
        heading: "What must be shown",
        points: [
          "Carrying amounts by measurement category (amortised cost, FVOCI, FVTPL).",
          "Items of income, expense, gains and losses by category, including interest and impairment.",
          "Accounting policies, hedge accounting information, and fair values (with the IFRS 13 hierarchy).",
          "Qualitative disclosures: exposure to each risk, how it arises, objectives, policies and processes for managing it.",
          "Quantitative disclosures: summary data on exposures, credit risk (including expected credit loss information), a maturity analysis for liquidity risk, and a sensitivity analysis for each type of market risk.",
          "Transfers of financial assets that are not fully derecognised, and offsetting information.",
        ],
      },
    ],
    disclosures: [
      "IFRS 7 is itself a disclosure standard; the items above are its key requirements.",
    ],
    traps: [
      "IFRS 7 contains disclosures only — classification is in IAS 32 and recognition and measurement in IFRS 9.",
      "Liquidity disclosures use contractual undiscounted cash flows, not carrying amounts.",
    ],
    related: ["IFRS 9", "IAS 32", "IFRS 13"],
    banks: ADV,
  },
  {
    code: "IFRS 9",
    family: "IFRS",
    number: 9,
    title: "Financial Instruments",
    slug: "ifrs-9-financial-instruments",
    area: "instruments",
    objective:
      "Sets the rules for recognising, classifying and measuring financial assets and liabilities, impairment using expected credit losses, derecognition and hedge accounting.",
    status: [
      "Amendments issued in 2024 and effective from 1 January 2026 clarify some classification and derecognition points (for example, assets with ESG-linked features and liabilities settled through electronic payment systems). Check the current text for details.",
    ],
    scope: [
      "Most financial instruments, excluding interests in subsidiaries, associates and joint ventures, lease rights and obligations (largely), employee benefit plans, insurance contracts, and own equity instruments.",
    ],
    definitions: [
      { term: "Amortised cost", meaning: "The amount initially recognised, minus principal repayments, plus or minus cumulative amortisation using the effective interest method, adjusted for any loss allowance." },
      { term: "Effective interest rate", meaning: "The rate that exactly discounts estimated future cash flows to the gross carrying amount of the asset or the amortised cost of the liability." },
      { term: "SPPI test", meaning: "Whether contractual cash flows are solely payments of principal and interest on the principal outstanding." },
      { term: "Expected credit losses (ECL)", meaning: "A probability-weighted estimate of credit losses over the relevant period." },
    ],
    rules: [
      {
        heading: "Initial recognition",
        points: [
          "Recognise when the entity becomes party to the contract.",
          "Measure at fair value plus transaction costs (transaction costs are expensed for items at FVTPL).",
          "Trade receivables without a significant financing component are measured at the transaction price.",
        ],
      },
      {
        heading: "Classifying financial assets",
        points: [
          "Debt instruments at amortised cost: held in a business model to collect contractual cash flows, and SPPI is met.",
          "Debt instruments at FVOCI: business model is both to collect cash flows and to sell, and SPPI is met; gains are recycled to profit or loss on derecognition.",
          "Everything else is at FVTPL.",
          "Equity investments are at FVTPL, but an irrevocable election allows FVOCI for equity not held for trading; those gains are never recycled (dividends still go to profit or loss).",
          "A fair value option to designate at FVTPL is available to remove an accounting mismatch.",
          "Financial assets are reclassified only when the business model changes, prospectively.",
        ],
      },
      {
        heading: "Financial liabilities",
        points: [
          "Mostly measured at amortised cost using the effective interest method.",
          "Held-for-trading liabilities and derivatives are at FVTPL.",
          "For liabilities designated at FVTPL, the change in fair value due to own credit risk generally goes to OCI.",
          "Financial liabilities are never reclassified.",
        ],
      },
      {
        heading: "Impairment (ECL model)",
        points: [
          "Applies to assets at amortised cost, debt at FVOCI, lease receivables, contract assets and certain loan commitments and guarantees.",
          "Stage 1: recognise 12-month ECL; interest on gross carrying amount.",
          "Stage 2: significant increase in credit risk since initial recognition → lifetime ECL; interest on gross carrying amount.",
          "Stage 3: credit-impaired → lifetime ECL; interest on the net (amortised cost) amount.",
          "Simplified approach: always lifetime ECL for trade receivables and contract assets without a significant financing component (a provision matrix is commonly used).",
        ],
      },
      {
        heading: "Derecognition and hedging",
        points: [
          "Derecognise a financial asset when the rights to cash flows expire or it is transferred with substantially all risks and rewards.",
          "Derecognise a financial liability when it is extinguished (discharged, cancelled or expires).",
          "Hedge accounting (fair value, cash flow and net investment hedges) is optional and requires formal designation, documentation and an economic relationship.",
        ],
      },
    ],
    disclosures: [
      "Disclosures are mainly in IFRS 7.",
    ],
    traps: [
      "Finance cost on a liability uses the effective rate, not the coupon rate.",
      "Equity investments cannot be at amortised cost.",
      "FVOCI election for equity: no recycling on disposal — unlike FVOCI debt.",
      "Under the general ECL approach, a new loan starts with a 12-month ECL allowance even if nothing has gone wrong.",
    ],
    example: {
      title: "Amortised cost of a bond liability",
      scenario:
        "An entity issues a bond with a nominal value of $10,000, receiving $9,600 net of costs. The coupon is 5% ($500) paid annually; the effective interest rate is 6%.",
      steps: [
        "Opening amortised cost = $9,600.",
        "Finance cost = 9,600 × 6% = $576 (profit or loss).",
        "Cash paid = $500.",
        "Closing liability = 9,600 + 576 − 500 = $9,676.",
      ],
      answer: "Finance cost $576; liability carried at $9,676 at the end of Year 1.",
    },
    related: ["IAS 32", "IFRS 7", "IFRS 13", "IFRS 15", "IAS 21"],
    banks: ADV,
  },
  {
    code: "IFRS 10",
    family: "IFRS",
    number: 10,
    title: "Consolidated Financial Statements",
    slug: "ifrs-10-consolidated-financial-statements",
    area: "group",
    objective:
      "Establishes control as the basis for consolidation and sets out how to prepare consolidated financial statements.",
    scope: [
      "A parent that controls one or more subsidiaries must present consolidated statements, with limited exemptions (e.g. certain intermediate parents whose parent publishes IFRS consolidated statements).",
      "Investment entities generally measure subsidiaries at fair value through profit or loss rather than consolidating them.",
    ],
    definitions: [
      { term: "Control", meaning: "An investor controls an investee when it has power over it, exposure or rights to variable returns from it, and the ability to use its power to affect those returns. All three must be present." },
      { term: "Power", meaning: "Existing rights that give the current ability to direct the relevant activities (those that significantly affect returns)." },
      { term: "Non-controlling interest", meaning: "Equity in a subsidiary not attributable, directly or indirectly, to the parent." },
    ],
    rules: [
      {
        heading: "Assessing control",
        points: [
          "Voting rights usually indicate power, but a holder of less than 50% can have control (e.g. a dominant holding with dispersed other holders, or contractual arrangements).",
          "Substantive potential voting rights are considered.",
          "Decide whether a decision-maker acts as principal or as an agent for others.",
          "Reassess control when facts and circumstances change.",
        ],
      },
      {
        heading: "Consolidation procedures",
        points: [
          "Combine like items of assets, liabilities, income, expenses and cash flows line by line.",
          "Eliminate the parent's investment against its share of the subsidiary's equity (recognising goodwill under IFRS 3).",
          "Eliminate intragroup balances, transactions, and unrealised profits in full.",
          "Use uniform accounting policies; reporting dates may differ by no more than three months, with adjustments for significant transactions.",
          "Attribute profit and OCI to the parent and NCI, even if NCI goes into deficit.",
          "Changes in ownership that do not lose control are equity transactions — no gain or loss and no change to goodwill.",
          "On loss of control: derecognise the subsidiary's assets, liabilities and NCI, measure any retained interest at fair value, and recognise the gain or loss in profit or loss.",
        ],
      },
    ],
    disclosures: [
      "Disclosure requirements are in IFRS 12.",
    ],
    traps: [
      "Unrealised profit in closing inventory is eliminated in full, even with NCI; when the subsidiary is the seller, NCI shares in the adjustment.",
      "Buying more shares in an existing subsidiary does not create new goodwill.",
      "Control can exist with less than 50% of votes.",
    ],
    example: {
      title: "Unrealised profit in inventory",
      scenario:
        "Parent sells goods costing $40,000 to its subsidiary for $50,000. At the year end half of the goods remain in the subsidiary's inventory.",
      steps: [
        "Total profit on the sale = 50,000 − 40,000 = $10,000.",
        "Unrealised portion = 50% × 10,000 = $5,000.",
        "Eliminate intragroup revenue and cost of sales of $50,000; reduce closing inventory and group profit by $5,000.",
      ],
      answer: "Provision for unrealised profit = $5,000 (parent is the seller, so all against group retained earnings).",
    },
    related: ["IFRS 3", "IFRS 12", "IAS 27", "IAS 28", "IFRS 11"],
    banks: ADV,
  },
  {
    code: "IFRS 11",
    family: "IFRS",
    number: 11,
    title: "Joint Arrangements",
    slug: "ifrs-11-joint-arrangements",
    area: "group",
    objective:
      "Sets out how parties to an arrangement they jointly control determine its type and account for their rights and obligations.",
    scope: [
      "All entities that are a party to a joint arrangement.",
    ],
    definitions: [
      { term: "Joint arrangement", meaning: "An arrangement of which two or more parties have joint control." },
      { term: "Joint control", meaning: "Contractually agreed sharing of control, existing only when decisions about relevant activities require the unanimous consent of the parties sharing control." },
      { term: "Joint operation", meaning: "A joint arrangement where the parties with joint control have rights to the assets and obligations for the liabilities." },
      { term: "Joint venture", meaning: "A joint arrangement where the parties with joint control have rights to the net assets." },
    ],
    rules: [
      {
        heading: "Classification",
        points: [
          "Not structured through a separate vehicle → joint operation.",
          "Structured through a separate vehicle → consider the legal form, contractual terms and other facts and circumstances to decide whether parties have rights to assets and obligations for liabilities (joint operation) or rights to net assets (joint venture).",
        ],
      },
      {
        heading: "Accounting",
        points: [
          "Joint operator: recognise its own assets, liabilities, revenue and expenses, plus its share of those held or incurred jointly — in both individual and consolidated statements.",
          "Joint venturer: use the equity method under IAS 28.",
          "A party that participates but does not have joint control accounts for its interest under the relevant standard (e.g. IAS 28 or IFRS 9).",
        ],
      },
    ],
    disclosures: [
      "Disclosure requirements are in IFRS 12.",
    ],
    traps: [
      "A separate legal entity does not automatically mean joint venture — the rights and obligations decide.",
      "Proportionate consolidation is not used for joint ventures.",
      "Unanimous consent is required for joint control; majority voting among the parties is not joint control.",
    ],
    example: {
      title: "Joint operation",
      scenario:
        "Entity A has a 40% share in a jointly controlled pipeline (a joint operation). The pipeline cost $1,000,000 and generates revenue of $300,000 and expenses of $100,000 for the year.",
      steps: [
        "Share of asset = 40% × 1,000,000 = $400,000.",
        "Share of revenue = 40% × 300,000 = $120,000; share of expenses = 40% × 100,000 = $40,000.",
      ],
      answer: "A recognises a $400,000 asset, $120,000 revenue and $40,000 expenses, line by line.",
    },
    related: ["IAS 28", "IFRS 10", "IFRS 12", "IAS 27"],
    banks: ADV,
  },
  {
    code: "IFRS 12",
    family: "IFRS",
    number: 12,
    title: "Disclosure of Interests in Other Entities",
    slug: "ifrs-12-disclosure-of-interests-in-other-entities",
    area: "group",
    objective:
      "Requires disclosures that help users evaluate the nature of, and risks from, an entity's interests in subsidiaries, joint arrangements, associates and unconsolidated structured entities, and their financial effects.",
    scope: [
      "Entities with interests in subsidiaries, joint arrangements, associates or unconsolidated structured entities.",
      "Generally does not apply to post-employment benefit plans or an entity's separate financial statements (with limited exceptions).",
    ],
    definitions: [
      { term: "Structured entity", meaning: "An entity designed so that voting or similar rights are not the dominant factor in deciding who controls it, e.g. where relevant activities are directed by contract." },
      { term: "Interest in another entity", meaning: "Contractual and non-contractual involvement that exposes an entity to variability of returns from the other entity's performance." },
    ],
    rules: [
      {
        heading: "Key disclosure areas",
        points: [
          "Significant judgements and assumptions in deciding whether the entity has control, joint control or significant influence, and the type of joint arrangement.",
          "Subsidiaries: group composition, NCI share in activities and cash flows (with summarised information for material NCI), significant restrictions, and effects of changes in ownership.",
          "Joint arrangements and associates: nature, extent and financial effects, including summarised financial information for material ones, and related risks and commitments.",
          "Unconsolidated structured entities: nature and extent of interests and the risks they expose the entity to.",
        ],
      },
    ],
    disclosures: [
      "IFRS 12 is itself a disclosure standard; the items above are its main requirements.",
    ],
    traps: [
      "IFRS 12 has no recognition or measurement rules — it only adds disclosures to IFRS 10, IFRS 11 and IAS 28.",
    ],
    related: ["IFRS 10", "IFRS 11", "IAS 28", "IAS 27"],
    banks: ADV,
  },
  {
    code: "IFRS 13",
    family: "IFRS",
    number: 13,
    title: "Fair Value Measurement",
    slug: "ifrs-13-fair-value-measurement",
    area: "other",
    objective:
      "Defines fair value, sets out a single framework for measuring it and requires disclosures about fair value measurements.",
    scope: [
      "Applies when another standard requires or permits fair value measurement or disclosure.",
      "Excludes share-based payments (IFRS 2), leasing transactions (IFRS 16), and measures that resemble but are not fair value, such as net realisable value (IAS 2) and value in use (IAS 36).",
    ],
    definitions: [
      { term: "Fair value", meaning: "An exit price: what would be received to sell an asset, or paid to transfer a liability, in an orderly transaction between market participants at the measurement date." },
      { term: "Principal market", meaning: "The market with the greatest volume and level of activity for the asset or liability." },
      { term: "Most advantageous market", meaning: "The market that maximises the amount received for an asset (or minimises the amount paid for a liability) after transaction and transport costs." },
      { term: "Highest and best use", meaning: "The use of a non-financial asset by market participants that would maximise its value, if physically possible, legally permissible and financially feasible." },
    ],
    rules: [
      {
        heading: "Measurement",
        points: [
          "Use the price in the principal market; if there is none, the most advantageous market.",
          "Fair value is not adjusted for transaction costs, but is adjusted for transport costs if location is a characteristic of the asset.",
          "Use market participant assumptions, not entity-specific ones.",
          "Non-financial assets are measured at their highest and best use, even if the entity uses them differently.",
          "Valuation approaches: market, cost and income approaches; maximise relevant observable inputs and minimise unobservable inputs.",
        ],
      },
      {
        heading: "Fair value hierarchy",
        points: [
          "Level 1: unadjusted quoted prices in active markets for identical items that the entity can access.",
          "Level 2: other inputs that are observable, directly or indirectly (e.g. quoted prices for similar items, observable interest rates).",
          "Level 3: unobservable inputs, based on the best information available.",
          "A measurement is categorised at the lowest level of any input that is significant to it.",
        ],
      },
    ],
    disclosures: [
      "Fair value measurements by level of the hierarchy, and transfers between levels.",
      "Valuation techniques and inputs used for Level 2 and Level 3.",
      "For recurring Level 3 measurements: a reconciliation of opening and closing balances and a narrative of sensitivity to unobservable inputs.",
    ],
    traps: [
      "Fair value is an exit price, not the entry price paid.",
      "Transaction costs are used to identify the most advantageous market but are not deducted in measuring fair value.",
      "Highest and best use applies to non-financial assets only.",
    ],
    example: {
      title: "Principal vs most advantageous market",
      scenario:
        "An asset is sold in two markets. Market A: price $26, transaction costs $3, transport $2. Market B: price $25, transaction costs $1, transport $2.",
      steps: [
        "If Market A is the principal market: fair value = 26 − 2 (transport) = $24.",
        "If there is no principal market, compare net amounts: A = 26 − 3 − 2 = $21; B = 25 − 1 − 2 = $22, so B is most advantageous.",
        "Fair value using Market B = 25 − 2 = $23 (transaction costs not deducted).",
      ],
      answer: "$24 if Market A is principal; otherwise $23 using Market B.",
    },
    related: ["IFRS 9", "IAS 40", "IAS 16", "IFRS 3", "IAS 36"],
    banks: ADV,
  },
  {
    code: "IFRS 15",
    family: "IFRS",
    number: 15,
    title: "Revenue from Contracts with Customers",
    slug: "ifrs-15-revenue-from-contracts-with-customers",
    area: "revenue",
    objective:
      "Sets out a single five-step model for recognising revenue that reflects the transfer of promised goods or services to customers at the amount the entity expects to be entitled to.",
    scope: [
      "All contracts with customers except leases (IFRS 16), insurance contracts, financial instruments (IFRS 9 etc.) and certain non-monetary exchanges between entities in the same line of business.",
    ],
    definitions: [
      { term: "Contract", meaning: "An agreement between two or more parties that creates enforceable rights and obligations." },
      { term: "Performance obligation", meaning: "A promise to transfer a distinct good or service (or a series of substantially the same distinct goods or services)." },
      { term: "Transaction price", meaning: "The consideration the entity expects to be entitled to in exchange for transferring goods or services, excluding amounts collected for third parties (e.g. sales tax)." },
      { term: "Stand-alone selling price", meaning: "The price at which an entity would sell a promised good or service separately to a customer." },
      { term: "Contract asset / contract liability", meaning: "A contract asset is a right to consideration for goods transferred that is conditional on something other than time; a contract liability is an obligation to transfer goods for which consideration has been received or is due." },
    ],
    rules: [
      {
        heading: "The five steps",
        points: [
          "Step 1 – Identify the contract: approved, rights and payment terms identifiable, commercial substance, and collection probable.",
          "Step 2 – Identify performance obligations: each distinct good or service (capable of being distinct and distinct in the context of the contract).",
          "Step 3 – Determine the transaction price, including variable consideration (expected value or most likely amount), constrained to the extent it is highly probable there will be no significant reversal; adjust for significant financing components, non-cash consideration and consideration payable to the customer.",
          "Step 4 – Allocate the price to performance obligations based on relative stand-alone selling prices (estimated where not observable).",
          "Step 5 – Recognise revenue when (or as) each performance obligation is satisfied, i.e. when control transfers.",
        ],
      },
      {
        heading: "Over time or at a point in time",
        points: [
          "Over time if any one applies: the customer simultaneously receives and consumes the benefits; the entity's work creates or enhances an asset the customer controls; or the asset has no alternative use to the entity and it has an enforceable right to payment for work done to date.",
          "Otherwise at a point in time, considering indicators such as right to payment, legal title, physical possession, risks and rewards, and customer acceptance.",
          "Progress over time is measured using output or input methods.",
        ],
      },
      {
        heading: "Contract costs and other points",
        points: [
          "Incremental costs of obtaining a contract (e.g. sales commission) are capitalised if expected to be recovered; a practical expedient allows expensing if amortisation would be one year or less.",
          "Costs to fulfil a contract are capitalised if not covered by another standard and they relate directly to the contract, generate resources and are expected to be recovered.",
          "Principal (gross revenue) vs agent (net commission) depends on whether the entity controls the good or service before transfer.",
          "Assurance-type warranties follow IAS 37; service-type warranties are separate performance obligations.",
        ],
      },
    ],
    disclosures: [
      "Revenue disaggregated into categories showing how economic factors affect it.",
      "Contract balances (receivables, contract assets and liabilities) and significant changes.",
      "Performance obligations and the transaction price allocated to remaining performance obligations.",
      "Significant judgements in applying the standard.",
    ],
    traps: [
      "A sales commission paid only if a contract is won is an incremental cost; bonuses based on overall targets usually are not contract-specific.",
      "Variable consideration is included only to the extent a significant reversal is highly probable not to occur.",
      "Allocating a discount: normally proportionate across all obligations, unless evidence shows it relates to specific ones.",
      "An agent recognises only its commission as revenue.",
    ],
    example: {
      title: "Allocating the transaction price",
      scenario:
        "An entity sells equipment with a two-year service contract for $100,000. Stand-alone selling prices are $90,000 for the equipment and $30,000 for the service. The equipment is delivered on day one.",
      steps: [
        "Total stand-alone selling prices = 90,000 + 30,000 = $120,000.",
        "Equipment = 100,000 × 90/120 = $75,000 → recognise on delivery.",
        "Service = 100,000 × 30/120 = $25,000 → recognise over two years ($12,500 a year).",
      ],
      answer: "Year 1 revenue = 75,000 + 12,500 = $87,500; contract liability $12,500 at the end of Year 1.",
    },
    related: ["IFRS 16", "IFRS 9", "IAS 37", "IAS 2"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IFRS 16",
    family: "IFRS",
    number: 16,
    title: "Leases",
    slug: "ifrs-16-leases",
    area: "liabilities",
    objective:
      "Sets out how lessees and lessors recognise, measure, present and disclose leases, with a single on-balance-sheet model for lessees.",
    status: [
      "Amendments effective from 1 January 2024 specify how a seller-lessee measures the lease liability in a sale and leaseback so that it does not recognise a gain relating to the right of use it retains.",
    ],
    scope: [
      "All leases, including subleases, except leases to explore for or use minerals and similar resources, biological assets within IAS 41, service concession arrangements, certain licences of intellectual property, and some rights under licensing agreements.",
    ],
    definitions: [
      { term: "Lease", meaning: "A contract, or part of one, that conveys the right to control the use of an identified asset for a period in exchange for consideration." },
      { term: "Lease term", meaning: "The non-cancellable period plus periods covered by extension options the lessee is reasonably certain to exercise and termination options it is reasonably certain not to exercise." },
      { term: "Right-of-use asset", meaning: "An asset representing the lessee's right to use the underlying asset for the lease term." },
      { term: "Short-term lease", meaning: "A lease of 12 months or less at commencement with no purchase option." },
    ],
    rules: [
      {
        heading: "Lessee",
        points: [
          "At commencement recognise a right-of-use asset and a lease liability, unless the optional exemptions for short-term leases or low-value assets are used (payments then expensed, usually straight-line).",
          "Lease liability = present value of lease payments not yet paid, discounted at the rate implicit in the lease, or the lessee's incremental borrowing rate if that cannot be readily determined.",
          "Lease payments include fixed payments (less incentives receivable), variable payments that depend on an index or rate, expected residual value guarantee payments, a purchase option price if reasonably certain to be exercised, and termination penalties where the term reflects termination.",
          "Right-of-use asset = initial lease liability + payments made at or before commencement − incentives received + initial direct costs + estimated dismantling/restoration costs.",
          "Subsequently: depreciate the right-of-use asset (over the shorter of lease term and useful life, unless ownership transfers) and unwind the liability using the effective interest method.",
          "Remeasure the liability for changes in lease term, purchase option assessment, residual value guarantees or index-linked payments, adjusting the right-of-use asset.",
        ],
      },
      {
        heading: "Lessor",
        points: [
          "Classify each lease as a finance lease (substantially all risks and rewards of ownership transfer) or an operating lease.",
          "Finance lease: derecognise the asset and recognise a receivable at the net investment in the lease; earn finance income over the term.",
          "Operating lease: keep the asset and recognise lease income, normally straight-line.",
        ],
      },
      {
        heading: "Sale and leaseback",
        points: [
          "If the transfer is a sale under IFRS 15, the seller-lessee measures the right-of-use asset at the proportion of the previous carrying amount relating to the right of use retained, and recognises a gain or loss only on the rights transferred to the buyer-lessor.",
          "If it is not a sale, the seller keeps the asset and accounts for the proceeds as a financial liability under IFRS 9.",
        ],
      },
    ],
    disclosures: [
      "Lessee: depreciation by class, interest on lease liabilities, short-term and low-value lease expense, variable payments, total cash outflow, additions and carrying amounts of right-of-use assets, and a maturity analysis.",
      "Lessor: selling profit or loss, finance income, operating lease income, and maturity analyses of payments receivable.",
    ],
    traps: [
      "Payments in advance (at commencement) are not included in the lease liability, but are added to the right-of-use asset.",
      "Split the lease liability into current and non-current portions.",
      "Interest on the liability is a finance cost; depreciation of the right-of-use asset is an operating expense.",
      "Variable payments linked to sales or usage are expensed as incurred, not included in the liability.",
    ],
    example: {
      title: "Lessee: initial and Year 1 measurement",
      scenario:
        "A lessee leases a machine for 5 years, paying $10,000 annually in arrears. The rate implicit in the lease is 8%. There are no initial direct costs or incentives.",
      steps: [
        "Lease liability = 10,000 × 3.9927 (5-year annuity at 8%) = $39,927; right-of-use asset also $39,927.",
        "Year 1 interest = 39,927 × 8% = $3,194.",
        "Closing liability = 39,927 + 3,194 − 10,000 = $33,121.",
        "Depreciation = 39,927 ÷ 5 = $7,985.",
      ],
      answer: "Year 1 expense = $3,194 interest + $7,985 depreciation; liability $33,121 at the year end.",
    },
    related: ["IFRS 15", "IAS 16", "IFRS 9", "IAS 36", "IAS 40"],
    banks: [...CORE, "ca-inter-aa"],
  },
  {
    code: "IFRS 18",
    family: "IFRS",
    number: 18,
    title: "Presentation and Disclosure in Financial Statements",
    slug: "ifrs-18-presentation-and-disclosure-in-financial-statements",
    area: "presentation",
    objective:
      "Sets general requirements for presenting and disclosing information in financial statements, with more structured income statements and new disclosures on management-defined performance measures.",
    status: [
      IFRS18_NOTE,
      "Before 1 January 2027 most entities still apply IAS 1. On transition, IFRS 18 is applied retrospectively, with comparatives restated.",
      "IFRS 18 also brings consequential amendments to other standards, including IAS 7 (cash flows), IAS 8 (retitled 'Basis of Preparation of Financial Statements') and IAS 33.",
    ],
    scope: [
      "All general purpose financial statements prepared under IFRS Accounting Standards.",
      "Many requirements on the statement of financial position, statement of changes in equity and general features are carried over from IAS 1 with limited changes.",
    ],
    definitions: [
      { term: "Operating category", meaning: "The default category in profit or loss: income and expenses not classified in the investing, financing, income tax or discontinued operations categories." },
      { term: "Investing category", meaning: "Broadly, income and expenses from investments in associates, joint ventures and unconsolidated subsidiaries, and from other assets that generate returns largely independently of the entity's other resources (for entities without a specified main business activity of investing)." },
      { term: "Financing category", meaning: "Broadly, income and expenses from liabilities that arise from raising finance, and interest expense on certain other liabilities." },
      { term: "Management-defined performance measures (MPMs)", meaning: "Subtotals of income and expenses that an entity uses in public communications outside the financial statements to communicate management's view of an aspect of overall financial performance, and that are not specified by IFRS." },
    ],
    rules: [
      {
        heading: "Structure of profit or loss",
        points: [
          "Classify income and expenses into five categories: operating, investing, financing, income taxes and discontinued operations.",
          "Present two new required subtotals: operating profit, and profit before financing and income taxes (in addition to profit or loss).",
          "Entities with specified main business activities (e.g. banks and some investment entities) classify certain items differently, so their operating profit reflects those activities.",
          "Operating expenses are presented by nature, by function or a mix, based on what gives the most useful structured summary; entities presenting by function disclose specified expenses by nature (e.g. depreciation, amortisation, employee benefits) in the notes.",
        ],
      },
      {
        heading: "MPMs and aggregation",
        points: [
          "Disclose MPMs in a single note, explaining why each is useful, how it is calculated and reconciling it to the most similar IFRS-specified subtotal, with tax and NCI effects for each reconciling item.",
          "Enhanced principles on aggregation and disaggregation, based on shared characteristics, and on the roles of primary statements versus notes.",
          "Use of non-descriptive labels such as 'other' is restricted; more informative labels or disclosures are needed.",
        ],
      },
    ],
    disclosures: [
      "MPM note with reconciliations.",
      "Specified expenses by nature when presenting by function.",
      "Disaggregated information in the notes where aggregation in the primary statements would obscure material information.",
    ],
    traps: [
      "IFRS 18 is not yet mandatory in 2026; exams based on IAS 1 remain valid until syllabuses switch.",
      "IFRS 18 changes presentation, not recognition or measurement — profit for the year does not change.",
      "Share of profit of equity-accounted associates and joint ventures is not in operating profit; it sits in the investing category.",
    ],
    example: {
      title: "New subtotals (simplified, general corporate)",
      scenario:
        "Revenue $1,000; cost of sales $600; administrative expenses $150; share of profit of an associate $20; interest on bank borrowings $40; income tax $60.",
      steps: [
        "Operating category: 1,000 − 600 − 150 → operating profit $250.",
        "Investing category: share of associate's profit $20 → profit before financing and income taxes $270.",
        "Financing category: interest on borrowings $40 → profit before tax $230.",
        "Income taxes $60 → profit for the year $170.",
      ],
      answer: "Operating profit $250; profit before financing and income taxes $270; profit $170.",
    },
    related: ["IAS 1", "IAS 7", "IAS 8", "IAS 33"],
    banks: [...CORE, "ca-inter-aa"],
  },
];

/* ───────────────────────── Helpers ───────────────────────── */

export function getStandard(slug: string): Standard | undefined {
  return standards.find((s) => s.slug === slug);
}

export function getStandardByCode(code: string): Standard | undefined {
  return standards.find((s) => s.code === code);
}

export function getAdjacentStandards(slug: string): { prev?: Standard; next?: Standard } {
  const i = standards.findIndex((s) => s.slug === slug);
  if (i < 0) return {};
  return { prev: standards[i - 1], next: standards[i + 1] };
}
