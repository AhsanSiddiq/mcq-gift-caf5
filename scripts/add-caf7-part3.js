const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'data', 'caf7-bia.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const newQuestions = [
  {
    "id": "c11q1",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "A newly appointed CEO insists that all department heads must justify every single rupee of their proposed budget for the next year from scratch, rather than simply adding a percentage increase to last year's spending. Which budgeting approach is the CEO implementing?",
    "options": [
      "A) Incremental budgeting",
      "B) Zero-based budgeting",
      "C) Rolling budgets",
      "D) Flexible budgeting"
    ],
    "correctAnswer": "B) Zero-based budgeting",
    "explanation": "Zero-based budgeting (ZBB) requires managers to build their budgets from zero and justify every proposed expense, rather than using the previous year's budget as a starting base. It aims to eliminate historical inefficiencies."
  },
  {
    "id": "c11q2",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "Which of the following is a classic behavioral consequence of 'top-down' (imposed) budgeting rather than 'bottom-up' (participative) budgeting?",
    "options": [
      "A) Lower level managers may deliberately build 'budgetary slack' into their estimates",
      "B) Lower level managers may feel demotivated and lack commitment to targets they had no part in setting",
      "C) The budgeting process becomes excessively time-consuming and drawn out",
      "D) The budget becomes too easily achievable because targets are set too low"
    ],
    "correctAnswer": "B) Lower level managers may feel demotivated and lack commitment to targets they had no part in setting",
    "explanation": "In a top-down budgeting approach, targets are imposed by senior management. A major drawback is that operational managers often feel demotivated and lack ownership of the budget because they were excluded from the target-setting process."
  },
  {
    "id": "c11q3",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "A manufacturing firm is preparing its cash budget for the next quarter. Which of the following items must be explicitly EXCLUDED from the cash budget?",
    "options": [
      "A) Repayment of the principal amount of a bank loan",
      "B) Payment of quarterly dividends to shareholders",
      "C) The annual depreciation charge on factory machinery",
      "D) Advance payments made to raw material suppliers"
    ],
    "correctAnswer": "C) The annual depreciation charge on factory machinery",
    "explanation": "A cash budget only records actual cash inflows and outflows. Depreciation is an accounting allocation of cost and represents a non-cash expense; therefore, it must never be included in a cash budget."
  },
  {
    "id": "c11q4",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "A company decides to update its annual budget continuously by adding a new budget month at the end of each month that passes, ensuring management always has a full 12-month forecast ahead of them. This technique is known as:",
    "options": [
      "A) Zero-based budgeting",
      "B) Rolling budgeting",
      "C) Incremental budgeting",
      "D) Master budgeting"
    ],
    "correctAnswer": "B) Rolling budgeting",
    "explanation": "A rolling budget is continuously updated by adding a new accounting period (e.g., a month or quarter) as the earliest period expires. This ensures the business always plans for a full year ahead, adapting to current trends."
  },
  {
    "id": "c11q5",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "A department manager intentionally overestimates the expected costs of a new project and underestimates the expected sales revenues to ensure the final targets are easy to achieve. In managerial accounting, this practice is referred to as:",
    "options": [
      "A) Goal congruence",
      "B) Budgetary slack",
      "C) Responsibility accounting",
      "D) Zero-based budgeting"
    ],
    "correctAnswer": "B) Budgetary slack",
    "explanation": "Budgetary slack (or padding) occurs when managers intentionally understate expected revenues or overstate expected expenses to create a 'cushion,' making their budget targets easier to achieve and maximizing their chances of earning bonuses."
  },
  {
    "id": "c11q6",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "When preparing a master budget, which functional budget must usually be prepared first because all other budgets are derived from it?",
    "options": [
      "A) The production budget",
      "B) The cash budget",
      "C) The raw materials purchase budget",
      "D) The sales budget"
    ],
    "correctAnswer": "D) The sales budget",
    "explanation": "Assuming there are no resource constraints, the sales budget is the foundation of the entire master budget. Production levels, raw material purchases, and cash flows are all ultimately dependent on the expected volume of sales."
  },
  {
    "id": "c11q7",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "Which of the following is a primary difficulty faced by Non-Profit Organizations (NPOs), such as charities, when attempting to prepare their annual budgets?",
    "options": [
      "A) They are legally prohibited from holding cash reserves",
      "B) They have unpredictable revenue streams because donations and grants fluctuate",
      "C) They are not allowed to use incremental budgeting techniques",
      "D) They do not incur any fixed administrative costs"
    ],
    "correctAnswer": "B) They have unpredictable revenue streams because donations and grants fluctuate",
    "explanation": "NPOs generally rely on donations, grants, and fundraising, which are highly volatile and unpredictable. This unpredictability in revenue makes accurate budgeting and financial forecasting extremely difficult compared to commercial businesses."
  },
  {
    "id": "c11q8",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "In the context of zero-based budgeting (ZBB), what is a 'decision package'?",
    "options": [
      "A) A document identifying all possible services and their specific costs, which management ranks in order of importance",
      "B) The final authorization given by the Board of Directors to approve the budget",
      "C) A continuous update of cash flow forecasts for the next twelve months",
      "D) The software used to consolidate functional budgets into the master budget"
    ],
    "correctAnswer": "A) A document identifying all possible services and their specific costs, which management ranks in order of importance",
    "explanation": "In ZBB, a decision package is a comprehensive document that identifies a specific activity or level of service, calculates its cost, and evaluates its benefits. Management then ranks these packages to allocate limited funds."
  },
  {
    "id": "c11q9",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "A business sets a budget based on the assumption it will produce 10,000 units. However, it actually produces 12,000 units. To fairly evaluate the production manager's cost control performance, the original budget should be adjusted to reflect the costs expected for 12,000 units. This adjusted budget is known as a:",
    "options": [
      "A) Fixed budget",
      "B) Rolling budget",
      "C) Flexed (Flexible) budget",
      "D) Master budget"
    ],
    "correctAnswer": "C) Flexed (Flexible) budget",
    "explanation": "A flexed budget adjusts the original budgeted revenues and variable costs to reflect the actual volume of activity achieved. This provides a fair benchmark for performance evaluation and variance analysis."
  },
  {
    "id": "c11q10",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "The concept of 'Goal Congruence' in budgeting refers to:",
    "options": [
      "A) Ensuring that the total budgeted expenses exactly match the total budgeted revenues",
      "B) Aligning the personal and departmental goals of managers with the overall strategic goals of the organization",
      "C) Using the exact same budgeting methodology across all departments",
      "D) Eliminating all budgetary slack before the master budget is finalized"
    ],
    "correctAnswer": "B) Aligning the personal and departmental goals of managers with the overall strategic goals of the organization",
    "explanation": "Goal congruence is achieved when the budgeting and performance measurement systems encourage individual managers to act in ways that simultaneously achieve their own personal/departmental objectives and the overall goals of the company."
  },
  {
    "id": "c11q11",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "A firm adopts a budgeting approach where next year's budget is prepared simply by taking this year's actual results and adding a 5% allowance for inflation. What is the major flaw of this approach?",
    "options": [
      "A) It is excessively time-consuming to prepare",
      "B) It carries forward past inefficiencies and wasteful spending into the new budget",
      "C) It forces managers to justify every expense from scratch",
      "D) It requires complex mathematical models to implement"
    ],
    "correctAnswer": "B) It carries forward past inefficiencies and wasteful spending into the new budget",
    "explanation": "This describes incremental budgeting. Its biggest flaw is that it assumes historical spending was necessary and efficient. Therefore, any past waste or inefficiencies are automatically funded again and carried forward into future periods."
  },
  {
    "id": "c11q12",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "Which of the following is typically the LAST schedule to be prepared in the master budgeting process?",
    "options": [
      "A) The sales budget",
      "B) The raw materials purchase budget",
      "C) The budgeted statement of financial position (balance sheet)",
      "D) The production budget"
    ],
    "correctAnswer": "C) The budgeted statement of financial position (balance sheet)",
    "explanation": "The budgeted statement of financial position is the final step in the master budget process. It requires the closing balances from the cash budget, the budgeted income statement, and all functional budgets to be completed first."
  },
  {
    "id": "c11q13",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "A business discovers that its ability to sell goods is practically unlimited, but it is severely restricted by a global shortage of a specific raw material. In budgeting terminology, this restricted raw material is known as the:",
    "options": [
      "A) Sunk cost",
      "B) Principal budget factor (or limiting factor)",
      "C) Flexible variance",
      "D) Base decision package"
    ],
    "correctAnswer": "B) Principal budget factor (or limiting factor)",
    "explanation": "The principal budget factor (or limiting factor) is the specific constraint that restricts the organization's expansion or operations. When a limiting factor exists (like a material shortage), it must dictate the starting point of the entire budgeting process."
  },
  {
    "id": "c11q14",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "A company is preparing its cash budget. Sales are Rs. 1,000,000 per month. 20% of sales are for cash. For the credit sales, 50% are collected in the month following the sale, and 50% are collected two months after the sale. What will be the total cash collected in Month 3 from sales?",
    "options": [
      "A) Rs. 1,000,000",
      "B) Rs. 800,000",
      "C) Rs. 600,000",
      "D) Rs. 200,000"
    ],
    "correctAnswer": "A) Rs. 1,000,000",
    "explanation": "In Month 3: Cash sales = 200,000. Month 2 credit sales collected (800,000 x 50%) = 400,000. Month 1 credit sales collected (800,000 x 50%) = 400,000. Total = 200,000 + 400,000 + 400,000 = Rs. 1,000,000."
  },
  {
    "id": "c11q15",
    "chapter": 11,
    "chapterTitle": "Budgeting",
    "question": "Which of the following describes 'Responsibility Accounting'?",
    "options": [
      "A) An accounting system where all costs are centralized and controlled exclusively by the CEO",
      "B) A system where costs, revenues, and investments are traced to the specific individual manager who has control over them",
      "C) A method of calculating the exact environmental footprint of an organization",
      "D) A regulatory requirement to report budget variances to the government"
    ],
    "correctAnswer": "B) A system where costs, revenues, and investments are traced to the specific individual manager who has control over them",
    "explanation": "Responsibility accounting is a system that identifies specific responsibility centers (cost centers, profit centers, investment centers) and holds the individual manager accountable only for the variances and items they can actually control."
  },
  {
    "id": "c12q1",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "What is the standard formula used to calculate a company's Cash Operating Cycle?",
    "options": [
      "A) Inventory Days + Trade Payable Days - Trade Receivable Days",
      "B) Inventory Days + Trade Receivable Days - Trade Payable Days",
      "C) Trade Receivable Days + Trade Payable Days - Inventory Days",
      "D) Current Assets - Current Liabilities"
    ],
    "correctAnswer": "B) Inventory Days + Trade Receivable Days - Trade Payable Days",
    "explanation": "The cash operating cycle measures the time between paying cash for inventory and receiving cash from customers. It is calculated by adding inventory holding days and receivable collection days, and then subtracting the payable deferral days."
  },
  {
    "id": "c12q2",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "A rapidly expanding retail business is facing severe cash shortages. It is frequently delaying payments to its suppliers, relying heavily on its bank overdraft, and its current ratio has fallen to 0.8. This company is displaying classic symptoms of:",
    "options": [
      "A) Over-capitalization",
      "B) Overtrading (Under-capitalization)",
      "C) Efficient working capital management",
      "D) Debt securitization"
    ],
    "correctAnswer": "B) Overtrading (Under-capitalization)",
    "explanation": "Overtrading occurs when a business tries to support too large a volume of trade with too little long-term capital. Symptoms include a heavy reliance on overdrafts, deteriorating liquidity ratios, and an inability to pay suppliers on time."
  },
  {
    "id": "c12q3",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "When assessing a company's short-term liquidity, why is the Quick Ratio (Acid Test Ratio) often considered a more severe and accurate test than the Current Ratio?",
    "options": [
      "A) Because it excludes trade payables from the calculation",
      "B) Because it assumes all short-term debt will be converted to long-term debt",
      "C) Because it excludes inventory, which is often the least liquid of the current assets",
      "D) Because it only includes cash balances and ignores trade receivables"
    ],
    "correctAnswer": "C) Because it excludes inventory, which is often the least liquid of the current assets",
    "explanation": "The Quick Ratio excludes inventory from current assets because inventory can take a significant amount of time to sell and convert into cash. Therefore, removing it provides a stricter test of the company's immediate ability to pay its debts."
  },
  {
    "id": "c12q4",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "A company sells its outstanding trade receivables to a third-party financial institution. The agreement stipulates that if any of the customers default on their payments, the financial institution bears the loss and cannot demand the money back from the company. This arrangement is known as:",
    "options": [
      "A) Invoice discounting",
      "B) Recourse factoring",
      "C) Non-recourse factoring",
      "D) Securitization"
    ],
    "correctAnswer": "C) Non-recourse factoring",
    "explanation": "In non-recourse factoring, the factor (the financial institution) assumes the risk of bad debts. If a customer defaults, the factor bears the loss, providing the selling company with complete protection against credit risk."
  },
  {
    "id": "c12q5",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "A company adopts an aggressive working capital financing policy. Which of the following best describes this policy?",
    "options": [
      "A) Financing all non-current assets and a large portion of fluctuating current assets with long-term debt and equity",
      "B) Financing all fluctuating current assets and a portion of permanent current assets with short-term finance",
      "C) Financing non-current assets with short-term overdrafts to minimize interest costs",
      "D) Holding massive cash reserves to protect against unexpected economic shocks"
    ],
    "correctAnswer": "B) Financing all fluctuating current assets and a portion of permanent current assets with short-term finance",
    "explanation": "An aggressive working capital policy relies heavily on cheaper (but riskier) short-term finance. Under this policy, short-term finance is used to fund all fluctuating current assets and a portion of the permanent current assets."
  },
  {
    "id": "c12q6",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "According to economic theory, there are three primary motives for a business to hold cash. Which motive relates to holding cash to take advantage of sudden, unexpected investment opportunities or favourable market price drops?",
    "options": [
      "A) The transactions motive",
      "B) The precautionary motive",
      "C) The speculative motive",
      "D) The profitability motive"
    ],
    "correctAnswer": "C) The speculative motive",
    "explanation": "The speculative motive involves holding cash to be in a position to exploit unexpected opportunities, such as purchasing discounted raw materials or acquiring a struggling competitor at a bargain price."
  },
  {
    "id": "c12q7",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "A business decides to drastically increase its trade payable days from 30 days to 75 days by delaying payments to its suppliers. While this will improve the company's cash flow in the short term, what is the most likely negative consequence?",
    "options": [
      "A) The cash operating cycle will significantly lengthen",
      "B) The company will lose the trust of its suppliers, potentially resulting in delayed deliveries or suppliers refusing to offer future credit",
      "C) The company's quick ratio will immediately increase",
      "D) Trade receivable days will automatically increase"
    ],
    "correctAnswer": "B) The company will lose the trust of its suppliers, potentially resulting in delayed deliveries or suppliers refusing to offer future credit",
    "explanation": "Artificially extending payable days effectively forces suppliers to act as a source of free finance. This severely damages supplier relationships, risking supply chain disruptions, loss of goodwill, and the withdrawal of future credit facilities."
  },
  {
    "id": "c12q8",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "Which of the following factors is LEAST likely to influence the required level of working capital investment in a company?",
    "options": [
      "A) The length of the working capital cycle",
      "B) The company's risk management strategy and desired inventory buffers",
      "C) The industry's standard credit terms and payment practices",
      "D) The depreciation method used for valuing the company's factory machinery"
    ],
    "correctAnswer": "D) The depreciation method used for valuing the company's factory machinery",
    "explanation": "Depreciation is a non-cash expense related to long-term non-current assets. It has absolutely no direct impact on the day-to-day cash flows or the short-term working capital cycle (inventory, receivables, payables) of the business."
  },
  {
    "id": "c12q9",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "A firm has an average inventory of Rs. 400,000, average trade receivables of Rs. 300,000, and average trade payables of Rs. 200,000. If its annual Cost of Sales is Rs. 2,000,000, what is its Inventory Turnover Period (assuming a 365-day year)?",
    "options": [
      "A) 73 days",
      "B) 55 days",
      "C) 37 days",
      "D) 91 days"
    ],
    "correctAnswer": "A) 73 days",
    "explanation": "Inventory Turnover Period (Inventory Days) = (Average Inventory / Cost of Sales) * 365. Calculation: (400,000 / 2,000,000) * 365 = 73 days."
  },
  {
    "id": "c12q10",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "A company holds massive amounts of inventory 'just in case', has extremely relaxed credit terms allowing customers 90 days to pay, and keeps millions in idle cash in a zero-interest bank account. This company is most likely suffering from:",
    "options": [
      "A) Overtrading",
      "B) Over-capitalization",
      "C) Capital rationing",
      "D) Securitization"
    ],
    "correctAnswer": "B) Over-capitalization",
    "explanation": "Over-capitalization occurs when a company has too much working capital tied up in idle cash, excessive inventory, and slow-paying receivables. While it means low risk of insolvency, it results in extremely poor returns on investment and lost profitability."
  },
  {
    "id": "c12q11",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "If a company successfully implements a 'Just-In-Time' (JIT) inventory management system, what will be the most immediate and direct impact on its working capital metrics?",
    "options": [
      "A) Trade payable days will significantly increase",
      "B) Inventory holding days will dramatically decrease",
      "C) Trade receivable days will drop to zero",
      "D) The quick ratio will fall below 0.5"
    ],
    "correctAnswer": "B) Inventory holding days will dramatically decrease",
    "explanation": "JIT involves purchasing raw materials exactly when they are needed for production and producing goods exactly when they are needed for sale. This virtually eliminates the need for holding stock, drastically reducing inventory holding days."
  },
  {
    "id": "c12q12",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "When a company calculates its Work-in-Process (WIP) inventory valuation for working capital purposes, how should non-cash items like factory depreciation be treated?",
    "options": [
      "A) They must be added to the raw material cost at 100% completion",
      "B) They must be completely excluded from the calculation",
      "C) They must be included in conversion costs at a 50% completion rate",
      "D) They must be discounted back to their present value"
    ],
    "correctAnswer": "B) They must be completely excluded from the calculation",
    "explanation": "Working capital calculations dictate the actual cash required to finance operations. Depreciation is a non-cash expense and does not represent funds tied up in the daily operating cycle, so it must be stripped out of overheads before valuing WIP."
  },
  {
    "id": "c12q13",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "A supplier offers terms of '2/10, net 30'. What does this mean for the purchasing company?",
    "options": [
      "A) The company must pay a 2% penalty if it pays after 10 days, with the final limit being 30 days",
      "B) The company can take a 2% cash discount if it pays within 10 days; otherwise, the full net amount is due within 30 days",
      "C) The company will receive a 10% discount if it pays within 2 days",
      "D) The company is required to pay 2/10ths of the invoice within 30 days"
    ],
    "correctAnswer": "B) The company can take a 2% cash discount if it pays within 10 days; otherwise, the full net amount is due within 30 days",
    "explanation": "This is standard credit term terminology. '2/10, net 30' means the buyer can deduct 2% from the invoice amount if payment is made within 10 days. If the discount is not taken, the full (net) invoice amount is due within 30 days."
  },
  {
    "id": "c12q14",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "Which of the following is a primary disadvantage of financing working capital entirely through short-term debt (such as an overdraft) rather than long-term debt?",
    "options": [
      "A) Short-term debt is generally more expensive than long-term debt",
      "B) Short-term debt requires shareholders to surrender voting rights",
      "C) Short-term debt carries high renewal risk and subjects the company to fluctuating, volatile interest rates",
      "D) Short-term debt cannot be used to pay for raw materials"
    ],
    "correctAnswer": "C) Short-term debt carries high renewal risk and subjects the company to fluctuating, volatile interest rates",
    "explanation": "Short-term debt (like overdrafts) can be withdrawn by the bank at any time (renewal risk) and is subject to variable interest rates, exposing the company to significant liquidity and market risks if economic conditions tighten."
  },
  {
    "id": "c12q15",
    "chapter": 12,
    "chapterTitle": "Working Capital Management",
    "question": "In working capital management, the 'Matching Principle' (or Hedging Principle) suggests that a firm should finance:",
    "options": [
      "A) All assets exclusively with short-term bank overdrafts",
      "B) Short-term fluctuating assets with short-term finance, and permanent current assets and non-current assets with long-term finance",
      "C) All current assets solely with equity finance",
      "D) Its inventory entirely through early settlement discounts"
    ],
    "correctAnswer": "B) Short-term fluctuating assets with short-term finance, and permanent current assets and non-current assets with long-term finance",
    "explanation": "The matching principle is a moderate approach to working capital financing. It states that the maturity of the funding should match the life of the asset being funded. Short-term needs get short-term debt; long-term and permanent assets get long-term debt/equity."
  },
  {
    "id": "c13q1",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "A company commissioned a market research study last year for Rs. 5 million to determine if a new product would be successful. The company is now calculating the Net Present Value (NPV) to decide whether to build the factory. How should the Rs. 5 million research cost be treated in the NPV calculation?",
    "options": [
      "A) Included as a cash outflow in Year 0",
      "B) Amortized over the life of the project",
      "C) Excluded entirely, as it is a sunk cost",
      "D) Included as an opportunity cost"
    ],
    "correctAnswer": "C) Excluded entirely, as it is a sunk cost",
    "explanation": "Relevant costing principles dictate that only future, incremental cash flows are included in an investment appraisal. The research study was paid for in the past regardless of the decision made today, making it a sunk cost that must be ignored."
  },
  {
    "id": "c13q2",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "If a company accepts a new project, it must use a warehouse it currently owns. The company currently rents this warehouse to a tenant for Rs. 1 million a year. If the project proceeds, the tenant will be evicted. In the project's NPV calculation, the lost rent is considered:",
    "options": [
      "A) A sunk cost",
      "B) An opportunity cost and must be deducted from the project's cash flows",
      "C) A non-cash expense and should be ignored",
      "D) A committed cost"
    ],
    "correctAnswer": "B) An opportunity cost and must be deducted from the project's cash flows",
    "explanation": "An opportunity cost is the benefit lost by taking one course of action instead of the next best alternative. Because the company loses the Rs. 1 million rental income by undertaking the project, it is a relevant cash outflow for the project appraisal."
  },
  {
    "id": "c13q3",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "Which of the following is a major theoretical weakness of the Payback Period method for investment appraisal?",
    "options": [
      "A) It completely ignores the time value of money and any cash flows that occur after the payback point is reached",
      "B) It is too complex for non-financial managers to understand",
      "C) It strictly focuses on accounting profits rather than cash flows",
      "D) It assumes cash flows are reinvested at the internal rate of return"
    ],
    "correctAnswer": "A) It completely ignores the time value of money and any cash flows that occur after the payback point is reached",
    "explanation": "The Payback Period's greatest flaws are that it treats a rupee received in Year 1 the same as a rupee received in Year 4 (ignoring discounting), and it completely ignores how much wealth the project generates after the initial investment is recovered."
  },
  {
    "id": "c13q4",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "A project requires an initial investment of Rs. 100,000. It is expected to generate an Internal Rate of Return (IRR) of 15%. The company's cost of capital (WACC) is 12%. According to the IRR decision rule, the company should:",
    "options": [
      "A) Reject the project because 12% is lower than 15%",
      "B) Accept the project because the IRR (15%) is greater than the company's cost of capital (12%)",
      "C) Delay the project until the cost of capital reaches 15%",
      "D) Recalculate the project using the payback period before deciding"
    ],
    "correctAnswer": "B) Accept the project because the IRR (15%) is greater than the company's cost of capital (12%)",
    "explanation": "The IRR is the discount rate that yields an NPV of zero. The standard decision rule is to accept the project if its IRR is strictly greater than the target required rate of return (cost of capital), as it will increase shareholder wealth."
  },
  {
    "id": "c13q5",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "When capital is strictly limited at Time 0, a company cannot undertake all projects with a positive NPV. To maximize shareholder wealth across divisible projects, the company should rank the projects based on their:",
    "options": [
      "A) Internal Rate of Return (IRR)",
      "B) Payback Period",
      "C) Profitability Index (PI)",
      "D) Equivalent Annual Cost (EAC)"
    ],
    "correctAnswer": "C) Profitability Index (PI)",
    "explanation": "Under single-period capital rationing, if projects are divisible, the optimal way to allocate limited funds is to rank projects by their Profitability Index (NPV divided by Initial Investment). This identifies the projects that generate the most value per rupee invested."
  },
  {
    "id": "c13q6",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "How is an investment in 'Working Capital' treated at the end of a project's life in a standard Net Present Value (NPV) calculation?",
    "options": [
      "A) It is treated as a sunk cost and written off",
      "B) It is added to the tax allowable depreciation",
      "C) It is assumed to be fully recovered and is treated as a cash inflow in the final year",
      "D) It is treated as a continuing cash outflow into perpetuity"
    ],
    "correctAnswer": "C) It is assumed to be fully recovered and is treated as a cash inflow in the final year",
    "explanation": "Working capital (inventory and receivables) is tied up during the project but is not 'consumed' like machinery. At the end of the project, inventory is sold and receivables are collected, meaning 100% of the working capital investment is recovered as a cash inflow."
  },
  {
    "id": "c13q7",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "A company is comparing two different machines that produce the exact same output but have different useful lives. Machine A lasts 3 years, and Machine B lasts 5 years. Which DCF technique must be used to properly compare and select the most cost-effective machine?",
    "options": [
      "A) Profitability Index (PI)",
      "B) Internal Rate of Return (IRR)",
      "C) Equivalent Annual Cost (EAC)",
      "D) Discounted Payback Period"
    ],
    "correctAnswer": "C) Equivalent Annual Cost (EAC)",
    "explanation": "When deciding between assets with different useful economic lives (asset replacement cycles), comparing their raw NPVs is unfair. You must calculate the Equivalent Annual Cost (EAC) by dividing each machine's NPV of costs by its respective annuity factor."
  },
  {
    "id": "c13q8",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "A business faces a choice between two mutually exclusive projects. Project X has an NPV of Rs. 50,000 and an IRR of 18%. Project Y has an NPV of Rs. 70,000 and an IRR of 14%. The company's cost of capital is 10%. Which project should the company accept?",
    "options": [
      "A) Project X, because its IRR is higher",
      "B) Project Y, because its absolute NPV is higher",
      "C) Both projects, because their IRRs exceed the cost of capital",
      "D) Neither project, because the results conflict"
    ],
    "correctAnswer": "B) Project Y, because its absolute NPV is higher",
    "explanation": "When NPV and IRR give conflicting rankings for mutually exclusive projects, the NPV rule must always prevail. NPV measures the absolute increase in shareholder wealth (Rs. 70,000), which is the primary objective of financial management."
  },
  {
    "id": "c13q9",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "In an NPV calculation involving taxation, how should the accounting depreciation of machinery be treated?",
    "options": [
      "A) It should be deducted from cash flows as a regular cash outflow",
      "B) It should be added to the project's revenues",
      "C) It must be ignored entirely as it is a non-cash item, but the tax savings (tax shield) generated by tax allowable depreciation must be included as a cash inflow",
      "D) It must be discounted at the risk-free rate"
    ],
    "correctAnswer": "C) It must be ignored entirely as it is a non-cash item, but the tax savings (tax shield) generated by tax allowable depreciation must be included as a cash inflow",
    "explanation": "Accounting depreciation is a non-cash allocation and is excluded from DCF analysis. However, tax authorities grant 'tax-allowable depreciation,' which reduces the company's tax bill. This tax saving is a real cash benefit and must be recorded as an inflow."
  },
  {
    "id": "c13q10",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "When dealing with inflation in an NPV calculation, what is the fundamental rule for matching cash flows to discount rates?",
    "options": [
      "A) Money (nominal) cash flows must be discounted at the real cost of capital",
      "B) Real cash flows must be discounted at the money (nominal) cost of capital",
      "C) Money (nominal) cash flows must be discounted at the money (nominal) cost of capital",
      "D) Inflation should be ignored entirely unless it exceeds 10%"
    ],
    "correctAnswer": "C) Money (nominal) cash flows must be discounted at the money (nominal) cost of capital",
    "explanation": "The fundamental rule for consistency in investment appraisal under inflation is to match like with like. If you inflate the specific cash flows (money cash flows), you must discount them using a rate that also includes inflation (the money/nominal cost of capital)."
  },
  {
    "id": "c13q11",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "A company is forced to reject a highly profitable project because its internal Board of Directors has imposed a strict limit on the capital expenditure budget for the year, prioritizing stability over rapid expansion. This scenario is an example of:",
    "options": [
      "A) Hard capital rationing",
      "B) Soft capital rationing",
      "C) The asset replacement cycle",
      "D) Bootstrapping"
    ],
    "correctAnswer": "B) Soft capital rationing",
    "explanation": "Soft capital rationing occurs when the limits on investment funds are imposed internally by the company's own management or board of directors. Hard capital rationing occurs when the restrictions are imposed externally by financial markets or banks."
  },
  {
    "id": "c13q12",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "What does a 'Perpetuity Factor' allow a financial analyst to calculate?",
    "options": [
      "A) The exact date a project will break even",
      "B) The present value of an equal, regular cash flow that continues forever into infinity",
      "C) The inflation-adjusted cost of raw materials",
      "D) The tax shield on a machine's disposal value"
    ],
    "correctAnswer": "B) The present value of an equal, regular cash flow that continues forever into infinity",
    "explanation": "A perpetuity is an annuity that goes on forever. The perpetuity factor (calculated as 1 / r) allows an analyst to take a constant annual cash flow expected to last into infinity and express it as a single, finite present value today."
  },
  {
    "id": "c13q13",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "A business is evaluating a project. General fixed overheads of the head office, amounting to Rs. 200,000, have been allocated to this specific project by the accounting department. In the NPV calculation, this allocated overhead should be:",
    "options": [
      "A) Treated as a relevant cash outflow in Year 1",
      "B) Capitalized as part of the initial investment",
      "C) Completely ignored, as general allocated overheads are not incremental cash flows",
      "D) Deducted from the working capital requirement"
    ],
    "correctAnswer": "C) Completely ignored, as general allocated overheads are not incremental cash flows",
    "explanation": "Under relevant costing principles, apportioned or allocated general fixed overheads are ignored because they are incurred by the company regardless of whether the project is accepted or rejected. They do not represent new, incremental cash outflows."
  },
  {
    "id": "c13q14",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "At the end of a project's life, a machine is sold for Rs. 50,000. Its remaining Tax Written Down Value (WDV) is Rs. 80,000. Under the tax rules for capital allowances, this transaction will trigger:",
    "options": [
      "A) A balancing charge, resulting in a tax payment",
      "B) A balancing allowance, resulting in a tax saving",
      "C) A capital gains tax on the Rs. 30,000 difference",
      "D) No tax consequence, as it offsets the working capital recovery"
    ],
    "correctAnswer": "B) A balancing allowance, resulting in a tax saving",
    "explanation": "When an asset is sold for less than its Tax WDV, the company has not claimed enough tax depreciation over the asset's life. The tax authority grants a 'balancing allowance' for the shortfall (Rs. 30,000), generating a tax saving (inflow) in the final year."
  },
  {
    "id": "c13q15",
    "chapter": 13,
    "chapterTitle": "Introduction to Project Appraisal",
    "question": "A project requires an initial investment of Rs. 40,000. It generates cash inflows of Rs. 15,000 in Year 1, Rs. 20,000 in Year 2, and Rs. 10,000 in Year 3. Assuming cash flows arise evenly throughout the year, what is the exact Payback Period?",
    "options": [
      "A) 2.0 years",
      "B) 3.0 years",
      "C) 2.5 years",
      "D) 1.5 years"
    ],
    "correctAnswer": "C) 2.5 years",
    "explanation": "By the end of Year 2, Rs. 35,000 has been recovered (15,000 + 20,000), leaving a shortfall of Rs. 5,000. In Year 3, Rs. 10,000 is generated. The time required in Year 3 is 5,000 / 10,000 = 0.5 years. Total payback period = 2.5 years."
  }
];

const aiRegex = /\s*\[[\d,\s-]+\]/g;
const cleanExplanations = (qs) => qs.map(q => ({
  ...q,
  explanation: q.explanation.replace(aiRegex, '').trim()
}));

const allData = [...cleanExplanations(data), ...cleanExplanations(newQuestions)];
fs.writeFileSync(file, JSON.stringify(allData, null, 2));
console.log(`Combined JSON created with ${allData.length} questions.`);
