/**
 * Articleship / audit trainee / Big 4 induction interview bank.
 * Each answer outline is a structure to adapt, not a script to memorise.
 */

export type InterviewCategory = "competency" | "technical" | "firm" | "situational";

export interface InterviewQuestion {
  id: string;
  category: InterviewCategory;
  q: string;
  /** What the interviewer is really testing and how to approach it. */
  approach: string;
  /** Model-answer outline. */
  outline: string[];
  /** Common mistake to avoid. */
  avoid?: string;
}

export const CATEGORIES: { id: InterviewCategory; label: string; blurb: string }[] = [
  { id: "competency", label: "Competency", blurb: "Motivation, teamwork, pressure and self-awareness — answer with real examples (STAR)." },
  { id: "technical", label: "Technical", blurb: "Basic IFRS, double entry and audit concepts at CAF / Applied Skills / Inter level." },
  { id: "firm", label: "Firm knowledge", blurb: "Why audit, why this firm, and what the job actually involves." },
  { id: "situational", label: "Situational", blurb: "Judgement calls you'll face on your first engagements — ethics, clients and seniors." },
];

export const QUESTIONS: InterviewQuestion[] = [
  /* ───────── Competency ───────── */
  {
    id: "tell-me-about-yourself",
    category: "competency",
    q: "Tell me about yourself.",
    approach: "This is your 60–90 second pitch and it sets the tone. They want a clear, relevant story — not your life history or a recital of your CV.",
    outline: [
      "Present: where you are now — qualification stage and your strongest result (e.g. CAF cleared at first attempt).",
      "Past: one or two experiences that shaped you — an internship, tutoring, a family business, a society role — with one concrete outcome.",
      "Future: why you're applying for this role at this firm now, and what you want to learn in the first year.",
      "Close by linking back to the role: \"…which is why I'm excited about starting my training in your audit team.\"",
    ],
    avoid: "Starting with your school years or reading out your CV line by line.",
  },
  {
    id: "why-accountancy",
    category: "competency",
    q: "Why did you choose chartered accountancy?",
    approach: "They are testing whether your motivation will survive long exam sittings and busy seasons. Give a genuine reason backed by something you did.",
    outline: [
      "A specific trigger: a subject you enjoyed, a mentor, seeing a family business's finances, an internship moment.",
      "What you like about the work itself: problem-solving, seeing how businesses really operate, the trust attached to the profession.",
      "The long-term view: the qualification's breadth and the options it opens — and that you're committed to finishing it.",
    ],
    avoid: "Answers that are only about salary, status or \"my parents wanted me to\".",
  },
  {
    id: "strengths",
    category: "competency",
    q: "What are your greatest strengths?",
    approach: "Pick two or three strengths that matter for audit (accuracy, organisation, communication, learning quickly) and prove each one with evidence.",
    outline: [
      "Name the strength in plain words.",
      "Give a short example that proves it, ideally with a number (\"reconciled 14 bank accounts monthly with zero unexplained differences\").",
      "Link it to the trainee role: why it will help on an audit engagement.",
    ],
    avoid: "A long list of adjectives with no evidence behind them.",
  },
  {
    id: "weakness",
    category: "competency",
    q: "What is your biggest weakness?",
    approach: "They want self-awareness and evidence that you work on yourself. Choose a real but non-fatal weakness and show what you are doing about it.",
    outline: [
      "A genuine, specific weakness (e.g. hesitating to ask questions early, over-checking work, public speaking).",
      "The impact it has had — briefly and honestly.",
      "The concrete steps you've taken (e.g. setting a 20-minute rule before asking for help, volunteering to present).",
      "Evidence of improvement.",
    ],
    avoid: "Disguised strengths like \"I'm a perfectionist\" or \"I work too hard\" — interviewers hear them all day.",
  },
  {
    id: "teamwork",
    category: "competency",
    q: "Tell me about a time you worked in a team to achieve something.",
    approach: "Audit is team work under deadlines. Use STAR (Situation, Task, Action, Result) and make your personal contribution clear.",
    outline: [
      "Situation: the team, the goal and the deadline in one or two sentences.",
      "Task: your specific responsibility.",
      "Action: what you did — use \"I\", not only \"we\". Include how you coordinated with others or handled a disagreement.",
      "Result: the outcome, ideally measurable, and what you learnt about working in teams.",
    ],
  },
  {
    id: "pressure",
    category: "competency",
    q: "Describe a time you worked under pressure or to a tight deadline.",
    approach: "Busy season and exam leave clash every year. They want to see prioritisation, calm and communication — not heroics.",
    outline: [
      "Set the scene: competing demands (e.g. mock exams while working in the family business at year-end).",
      "How you prioritised: lists, breaking work down, agreeing what mattered most.",
      "How you communicated: telling people early when something was at risk.",
      "Result and the habit you kept afterwards.",
    ],
    avoid: "Stories where you simply stayed up all night and got lucky.",
  },
  {
    id: "mistake",
    category: "competency",
    q: "Tell me about a mistake you made and how you handled it.",
    approach: "Honesty and ownership matter more than the mistake. In audit, hiding an error is far worse than making one.",
    outline: [
      "A real, moderate mistake (a calculation error, a missed instruction, a late submission).",
      "How you noticed it and that you owned it — told the right person promptly.",
      "How you fixed it.",
      "What you changed so it doesn't happen again (a checklist, reviewing your own work before submitting).",
    ],
    avoid: "Claiming you've never made a mistake, or blaming someone else.",
  },
  {
    id: "attention-to-detail",
    category: "competency",
    q: "Give an example of when your attention to detail made a difference.",
    approach: "Accuracy is the core trainee skill. Show a method, not just a claim.",
    outline: [
      "Context: a task where small errors mattered (accounts, data entry, a report, exam working papers).",
      "The detail you caught and how — tie-outs, cross-checks, reasonableness checks.",
      "The consequence avoided or value added.",
      "How you build checking into your normal routine.",
    ],
  },
  {
    id: "initiative",
    category: "competency",
    q: "Tell me about a time you showed initiative.",
    approach: "Firms want trainees who improve things without being asked — while still respecting the process.",
    outline: [
      "A problem or inefficiency you noticed.",
      "What you proposed or built (an Excel tracker, a study group, a new filing system) and how you got buy-in.",
      "The measurable result (time saved, errors reduced, people helped).",
    ],
  },
  {
    id: "studies-and-work",
    category: "competency",
    q: "How will you balance your exams with the demands of training?",
    approach: "A very real concern for firms — failed attempts mean lost exam leave and staffing problems. Show a realistic plan.",
    outline: [
      "Acknowledge the challenge honestly.",
      "Your plan: a fixed weekly study timetable, using exam leave well, early starts, question practice on weekends.",
      "Evidence it works: how you managed previous sittings (first-attempt passes, studying alongside other commitments).",
      "Commitment to communicating early with your manager about exam dates.",
    ],
  },
  {
    id: "five-years",
    category: "competency",
    q: "Where do you see yourself in five years?",
    approach: "They are checking ambition and whether you'll stay through training. Keep it realistic and tied to the firm.",
    outline: [
      "Qualified, with your exams completed.",
      "Experienced in a sector or service line you are interested in, and supervising junior trainees.",
      "Still developing within the profession — ideally framed around this firm.",
    ],
    avoid: "Saying you plan to leave for industry or abroad as soon as you qualify.",
  },

  /* ───────── Technical ───────── */
  {
    id: "audit-purpose",
    category: "technical",
    q: "What is the purpose of an external audit?",
    approach: "A classic opener. Use the standard wording, then show you understand why it matters.",
    outline: [
      "To express an independent opinion on whether the financial statements give a true and fair view (or present fairly, in all material respects) in accordance with the applicable financial reporting framework.",
      "It provides reasonable — not absolute — assurance that the statements are free from material misstatement, whether due to fraud or error.",
      "It adds credibility for shareholders and other users who rely on financial statements prepared by management.",
      "Management, not the auditor, is responsible for preparing the financial statements and for internal control.",
    ],
    avoid: "Saying the purpose of an audit is to find fraud.",
  },
  {
    id: "materiality",
    category: "technical",
    q: "What is materiality and how is it set?",
    approach: "Show you know the concept and the practical benchmarks.",
    outline: [
      "A misstatement is material if it, individually or in aggregate, could reasonably be expected to influence the economic decisions of users of the financial statements.",
      "It is a matter of professional judgement, considering both size (quantitative) and nature (qualitative — e.g. related-party transactions, directors' pay).",
      "Overall materiality is often set using benchmarks such as around 5% of profit before tax, 0.5–1% of revenue or 1–2% of total assets, depending on the entity.",
      "Performance materiality is set lower, to reduce the risk that uncorrected and undetected misstatements add up to more than overall materiality.",
    ],
  },
  {
    id: "audit-risk",
    category: "technical",
    q: "Explain the audit risk model.",
    approach: "Know the three components and how the auditor controls detection risk.",
    outline: [
      "Audit risk = inherent risk × control risk × detection risk.",
      "Inherent risk: susceptibility of an assertion to material misstatement before controls (e.g. complex estimates, cash-heavy businesses).",
      "Control risk: the risk that the client's internal controls fail to prevent or detect a misstatement.",
      "Inherent and control risk together form the risk of material misstatement, which the auditor assesses but cannot change.",
      "Detection risk is the risk the auditor's own procedures miss a misstatement; the auditor lowers it by doing more or better substantive work when assessed risks are high.",
    ],
  },
  {
    id: "assertions",
    category: "technical",
    q: "What are financial statement assertions? Give examples.",
    approach: "Assertions drive every audit test. Give the main ones and pair each with a test.",
    outline: [
      "Assertions are management's implicit claims about the items in the financial statements.",
      "Existence / occurrence — e.g. attend the inventory count; vouch sales from the ledger back to invoices and dispatch notes.",
      "Completeness — e.g. trace dispatch notes forward into the sales ledger; search for unrecorded liabilities after year-end.",
      "Accuracy, valuation and allocation — e.g. test inventory at lower of cost and net realisable value.",
      "Cut-off — check transactions either side of year-end are in the correct period.",
      "Rights and obligations — e.g. inspect title deeds, check for pledged assets.",
      "Classification and presentation — correct accounts, disclosures in line with the framework.",
    ],
    avoid: "Mixing up the direction of testing: vouching from the ledger to documents tests existence; tracing from documents to the ledger tests completeness.",
  },
  {
    id: "controls-vs-substantive",
    category: "technical",
    q: "What is the difference between tests of controls and substantive procedures?",
    approach: "A trainee does both from week one. Define each with an example.",
    outline: [
      "Tests of controls check whether a control operated effectively throughout the period — e.g. inspect purchase invoices for evidence of authorisation; re-perform a bank reconciliation review.",
      "Substantive procedures detect material misstatements directly in balances, transactions and disclosures.",
      "Substantive procedures are either analytical procedures (comparing expectations with recorded amounts, e.g. gross margin trends) or tests of detail (e.g. bank confirmations, vouching additions to invoices).",
      "Where controls are reliable, the auditor can reduce the extent of substantive testing — but some substantive work is always required for material areas.",
    ],
  },
  {
    id: "audit-opinions",
    category: "technical",
    q: "What types of audit opinion are there?",
    approach: "Know the four opinions and what drives each one.",
    outline: [
      "Unmodified: the financial statements give a true and fair view.",
      "Qualified (\"except for\"): misstatements, or an inability to obtain sufficient appropriate evidence, are material but not pervasive.",
      "Adverse: misstatements are both material and pervasive.",
      "Disclaimer of opinion: the auditor cannot obtain sufficient appropriate evidence and the possible effects are material and pervasive.",
      "Bonus: an Emphasis of Matter paragraph draws attention to something properly disclosed (e.g. a material uncertainty) without modifying the opinion.",
    ],
  },
  {
    id: "going-concern",
    category: "technical",
    q: "What is going concern and what would you look at as an auditor?",
    approach: "Explain the basis of preparation, then list practical indicators and procedures.",
    outline: [
      "Financial statements are normally prepared on the assumption the entity will continue to operate for the foreseeable future (at least 12 months from the reporting date under IAS 1).",
      "Warning signs: net current liabilities, recurring losses, negative operating cash flows, breaches of loan covenants, loss of a key customer or licence, overdue tax payments.",
      "Procedures: review cash-flow forecasts and test their assumptions, review loan agreements and covenant compliance, read board minutes, check post year-end trading and bank support letters.",
      "If a material uncertainty exists and is adequately disclosed, the report includes a separate 'Material Uncertainty Related to Going Concern' section.",
    ],
  },
  {
    id: "three-statements",
    category: "technical",
    q: "What are the main financial statements and how do they link?",
    approach: "Show you understand the connections, not just the names.",
    outline: [
      "Statement of financial position (assets, liabilities, equity at a point in time).",
      "Statement of profit or loss and other comprehensive income (performance over the period).",
      "Statement of cash flows (operating, investing and financing cash flows).",
      "Statement of changes in equity, plus the notes.",
      "Links: profit flows into retained earnings in equity; the cash flow statement explains the movement in cash on the balance sheet; depreciation reduces profit and asset carrying amounts but is added back in operating cash flows.",
    ],
  },
  {
    id: "depreciation-entry",
    category: "technical",
    q: "A company buys a machine for 1,000,000 on credit and depreciates it straight-line over 5 years. What are the entries in year 1?",
    approach: "Basic double entry under pressure. Talk through it calmly; state assumptions (no residual value, full year's charge).",
    outline: [
      "On purchase: Dr Property, plant and equipment 1,000,000; Cr Payables 1,000,000.",
      "Year-end depreciation (1,000,000 ÷ 5 = 200,000): Dr Depreciation expense 200,000; Cr Accumulated depreciation 200,000.",
      "Carrying amount at the end of year 1: 800,000.",
      "When the supplier is paid: Dr Payables; Cr Bank. Cash flow impact appears in investing activities when paid.",
    ],
  },
  {
    id: "provisions-contingencies",
    category: "technical",
    q: "What is the difference between a provision and a contingent liability (IAS 37)?",
    approach: "Use the three recognition criteria.",
    outline: [
      "A provision is recognised when there is a present obligation (legal or constructive) from a past event, an outflow of resources is probable, and a reliable estimate can be made.",
      "A contingent liability is a possible obligation that depends on uncertain future events, or a present obligation where the outflow is not probable or cannot be measured reliably.",
      "Contingent liabilities are not recognised; they are disclosed unless the possibility of outflow is remote.",
      "Example: a lawsuit the company will probably lose → provision; one it will possibly lose → disclose as a contingent liability.",
    ],
  },
  {
    id: "ifrs15",
    category: "technical",
    q: "Briefly explain the IFRS 15 five-step model.",
    approach: "Revenue is a presumed fraud risk in audits, so this comes up often. List the steps cleanly.",
    outline: [
      "1. Identify the contract with the customer.",
      "2. Identify the separate performance obligations in the contract.",
      "3. Determine the transaction price.",
      "4. Allocate the transaction price to the performance obligations (based on relative stand-alone selling prices).",
      "5. Recognise revenue when (or as) each performance obligation is satisfied — at a point in time or over time.",
    ],
  },
  {
    id: "inventory",
    category: "technical",
    q: "How is inventory valued, and how would you audit it?",
    approach: "Pair the IAS 2 rule with practical procedures — inventory count attendance is a classic trainee task.",
    outline: [
      "IAS 2: inventory is measured at the lower of cost and net realisable value; cost includes purchase and conversion costs to bring it to its present location and condition.",
      "NRV = estimated selling price less costs to complete and sell.",
      "Audit: attend the year-end count (observe procedures, perform test counts from floor to sheets and sheets to floor), test cut-off, check cost to purchase invoices, and test NRV by reviewing post year-end selling prices and slow-moving items.",
    ],
  },
  {
    id: "ifrs16",
    category: "technical",
    q: "How does a lessee account for a lease under IFRS 16?",
    approach: "Keep it to the core model and the exemptions.",
    outline: [
      "At commencement the lessee recognises a right-of-use asset and a lease liability.",
      "The lease liability is the present value of the lease payments not yet paid, discounted at the rate implicit in the lease or the incremental borrowing rate.",
      "The right-of-use asset is depreciated; interest is charged on the liability, which is reduced by payments.",
      "Optional exemptions: short-term leases (12 months or less) and leases of low-value assets can be expensed on a straight-line basis.",
    ],
  },
  {
    id: "independence-threats",
    category: "technical",
    q: "What threats to auditor independence do you know?",
    approach: "Name the five threats from the code of ethics and give one example and one safeguard for each if asked.",
    outline: [
      "Self-interest — e.g. a financial interest in a client, or fee dependence.",
      "Self-review — e.g. auditing figures your firm prepared.",
      "Advocacy — e.g. promoting the client's position in a dispute.",
      "Familiarity — e.g. a long association with the client or a close relative working there.",
      "Intimidation — e.g. threats to replace the auditor over a disagreement.",
      "Safeguards include rotating staff, independent review, removing the individual from the team, or declining the work.",
    ],
  },
  {
    id: "professional-scepticism",
    category: "technical",
    q: "What does professional scepticism mean in practice?",
    approach: "Show you understand it as a mindset applied to evidence, not distrust of people.",
    outline: [
      "An attitude that includes a questioning mind, alertness to conditions that may indicate misstatement, and critical assessment of audit evidence.",
      "In practice: corroborating management's explanations with evidence, noticing contradictory documents, and not accepting less persuasive evidence because the client is friendly or the deadline is close.",
      "Example: a manager says a large old receivable is recoverable — you check after-date cash receipts and correspondence rather than taking it at face value.",
    ],
  },

  /* ───────── Firm knowledge ───────── */
  {
    id: "why-this-firm",
    category: "firm",
    q: "Why do you want to train with our firm?",
    approach: "The most important question to prepare specifically. Generic praise could apply to any firm — give two or three reasons that are true only of this one.",
    outline: [
      "Something specific you researched: a sector strength, a service line, a training programme, a recent initiative or award.",
      "A personal connection: a conversation at a campus drive, an open day, a current trainee you spoke to.",
      "Fit: how their training and client mix match what you want to learn.",
    ],
    avoid: "\"Because you are a Big 4 firm with a good reputation\" — every applicant says it.",
  },
  {
    id: "why-audit",
    category: "firm",
    q: "Why audit rather than tax, advisory or industry?",
    approach: "They want to know you'll commit to audit for the training period.",
    outline: [
      "Exposure: you see many businesses and industries in a short time.",
      "Foundation: audit builds the core skills — understanding financial statements, controls and risk — that every later career path relies on.",
      "Responsibility: the public-interest role of audit and the trust it carries.",
      "Optionally, that you're open to specialising later once you have that foundation.",
    ],
  },
  {
    id: "trainee-day",
    category: "firm",
    q: "What do you think an audit trainee does day to day?",
    approach: "Show realistic expectations — firms worry about trainees who expect glamour.",
    outline: [
      "Working at client sites or remotely in a small engagement team under a senior.",
      "Typical tasks: bank and receivables confirmations, vouching and tracing samples, inventory count attendance, fixed-asset testing, documenting work on audit software.",
      "Lots of communication: requesting documents, following up with client staff, clearing review notes from seniors.",
      "Busy season peaks with long hours, alongside exam study.",
    ],
  },
  {
    id: "big4-names",
    category: "firm",
    q: "Who are the Big 4, and how are they represented locally?",
    approach: "Basic market awareness. Know the global names and your country's member firms.",
    outline: [
      "Globally: Deloitte, PwC, EY and KPMG.",
      "Know the local member firm names where you're applying — e.g. in Pakistan: A. F. Ferguson & Co. (PwC), Yousuf Adil (Deloitte), EY Ford Rhodes and KPMG Taseer Hadi & Co.",
      "Mention mid-tier networks too (e.g. Grant Thornton, BDO, RSM, Crowe, Baker Tilly) to show you understand the wider market.",
      "Check the current names on each firm's website before your interview — member-firm names do change.",
    ],
  },
  {
    id: "service-lines",
    category: "firm",
    q: "What service lines does a firm like ours offer?",
    approach: "Show you understand how the firm is organised and earns its fees.",
    outline: [
      "Audit and assurance (statutory audits, reviews, other assurance).",
      "Tax (compliance and advisory).",
      "Advisory / consulting (deals and transactions, risk, technology, forensic, restructuring).",
      "Link back to your role: as an audit trainee you'll mostly support assurance engagements, but you'll see how other lines support clients.",
    ],
  },
  {
    id: "profession-challenges",
    category: "firm",
    q: "What challenges or trends do you see in the accounting profession right now?",
    approach: "Pick two trends and give a short, thoughtful view on each — commercial awareness counts.",
    outline: [
      "Technology: data analytics and AI let auditors test whole populations rather than samples — and change what trainees spend time on.",
      "Sustainability reporting: ISSB standards (IFRS S1 and S2) and growing demand for assurance over ESG information.",
      "Audit quality and regulation: stronger regulator inspections, independence rules and public scrutiny after corporate failures.",
      "Talent: retention of trainees and flexible working.",
      "Give your own view on one of them and what it means for a new trainee.",
    ],
  },
  {
    id: "mid-tier-vs-big4",
    category: "firm",
    q: "What is the difference between training at a Big 4 and a mid-tier firm?",
    approach: "Be balanced. Don't criticise either — you may be talking to someone who trained at the other.",
    outline: [
      "Big 4: larger and often listed or multinational clients, more structured training programmes, specialised teams, global network.",
      "Mid-tier: broader exposure earlier, smaller teams, more client contact and often wider responsibility per trainee.",
      "Explain why this firm's model suits your learning goals.",
    ],
  },
  {
    id: "questions-for-us",
    category: "firm",
    q: "Do you have any questions for us?",
    approach: "Always have two or three thoughtful questions ready. It is part of the assessment.",
    outline: [
      "About the work: \"What kind of clients and industries would a first-year trainee typically work on?\"",
      "About development: \"How does the firm support trainees through exam leave and study?\"",
      "About the interviewer: \"What did you enjoy most about your own first year here?\"",
      "Leave salary and leave entitlements for HR or the offer stage.",
    ],
    avoid: "Saying \"No, I think you've covered everything.\"",
  },

  /* ───────── Situational ───────── */
  {
    id: "client-not-cooperating",
    category: "situational",
    q: "The client's accountant keeps delaying the documents you need and your deadline is close. What do you do?",
    approach: "Tests professionalism, communication and escalation. Stay polite and keep your senior informed.",
    outline: [
      "Make the request clear and in writing: a specific list with a reasonable deadline.",
      "Follow up politely in person, understand the reason for the delay and offer to work around their schedule.",
      "Keep working on other areas so time isn't wasted.",
      "Escalate early to your senior if it threatens the deadline — they can raise it with the client's management.",
    ],
    avoid: "Going around the accountant to their boss yourself, or quietly accepting incomplete evidence.",
  },
  {
    id: "error-by-senior",
    category: "situational",
    q: "You think you've found an error in work done by your senior. What would you do?",
    approach: "Tests confidence balanced with respect. Audit quality depends on people speaking up.",
    outline: [
      "Re-check your own work first to make sure you understand the point.",
      "Raise it privately with the senior, framed as a question: \"I may be missing something, but…\".",
      "Bring the evidence and listen to their explanation.",
      "If it's a real error and isn't corrected, it needs to be raised with the manager — audit quality comes first.",
    ],
  },
  {
    id: "asked-to-skip",
    category: "situational",
    q: "Your senior asks you to sign off a test as complete without doing all of it because time is short. What do you do?",
    approach: "A direct integrity test. The answer is clear — deliver it respectfully.",
    outline: [
      "Do not document work that wasn't performed — that is misleading the file and a serious ethical breach.",
      "Explain the concern calmly and offer solutions: work extra hours, ask for help, or reduce the sample only if the methodology properly allows it.",
      "If pressure continues, raise it with the manager or the firm's ethics contact.",
    ],
    avoid: "\"I'd do it because the senior knows best.\"",
  },
  {
    id: "friend-at-client",
    category: "situational",
    q: "You're assigned to an audit and discover a close relative works in the client's finance team. What do you do?",
    approach: "Tests your understanding of independence (a familiarity / self-interest threat).",
    outline: [
      "Tell your senior or manager immediately, before doing any work on the area.",
      "The firm will assess the threat and apply safeguards — usually removing you from the engagement or from the relevant area.",
      "Never discuss the audit with the relative.",
    ],
  },
  {
    id: "gift-offer",
    category: "situational",
    q: "At the end of fieldwork the client offers you an expensive gift. How do you respond?",
    approach: "Gifts and hospitality create self-interest and familiarity threats.",
    outline: [
      "Politely decline anything that isn't trivial and inconsequential.",
      "Follow the firm's gifts and hospitality policy and tell your senior.",
      "Thank the client warmly — declining can be done without offending anyone.",
    ],
  },
  {
    id: "conflicting-deadlines",
    category: "situational",
    q: "Two seniors on different engagements both need your work by the same deadline. What do you do?",
    approach: "Tests prioritisation and transparency.",
    outline: [
      "Clarify exactly what each needs and when — sometimes deadlines are more flexible than they look.",
      "Tell both seniors about the clash early rather than missing one deadline silently.",
      "If they can't resolve it, ask the manager or scheduling team to set the priority.",
      "Deliver on what was agreed and keep both updated.",
    ],
  },
  {
    id: "dont-know-how",
    category: "situational",
    q: "You've been given a task you don't know how to do and everyone looks busy. What do you do?",
    approach: "They want trainees who try first, then ask smart questions — not those who stay stuck for hours.",
    outline: [
      "Re-read the instructions and look at last year's file, templates and firm guidance.",
      "Spend a reasonable amount of time trying, and note specifically what you're unsure about.",
      "Ask a concise question at a good moment, with your attempt ready to show.",
      "Write down the answer so you don't need to ask twice.",
    ],
  },
  {
    id: "suspicious-transaction",
    category: "situational",
    q: "While vouching expenses you notice several round-sum payments to a supplier you can't find any information about. What do you do?",
    approach: "Tests scepticism and correct escalation — not playing detective.",
    outline: [
      "Document exactly what you found: amounts, dates, approvals and what's missing.",
      "Tell your senior promptly; do not accuse anyone or raise it with client staff yourself.",
      "The engagement team will decide on further procedures (e.g. reviewing supplier master data, approvals, bank details) and any reporting obligations.",
      "Keep it confidential.",
    ],
    avoid: "Ignoring it because the amounts are individually small, or confronting the client.",
  },
  {
    id: "exam-vs-busy-season",
    category: "situational",
    q: "Your exams fall right in the middle of busy season and your manager asks you to delay your study leave. How do you handle it?",
    approach: "Tests maturity: you value both your exams and your team.",
    outline: [
      "Plan ahead: share your exam dates and study-leave plan as early as possible.",
      "Understand the team's pressure and offer practical help — e.g. finishing key sections before leave, a clean handover, being reachable for quick queries.",
      "Be clear and respectful that your exam leave is important for your progression, and check the firm's training rules on study leave.",
      "Agree a plan with the manager rather than simply refusing or simply giving in.",
    ],
  },
];
