const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'data', 'caf7-bia.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const newQuestions = [
  {
    "id": "c6q1",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "In Tucker’s 5-question model for ethical decision-making, the question 'Is it fair?' primarily considers the impact of a decision on:",
    "options": [
      "A) The shareholders and the profitability of the company",
      "B) The legal framework and regulatory authorities",
      "C) All stakeholders, including employees, customers, and the local community",
      "D) The environmental footprint of the organization"
    ],
    "correctAnswer": "C) All stakeholders, including employees, customers, and the local community",
    "explanation": "In Tucker's model, 'Is it fair?' relates to fairness values and assesses whether the decision is equitable and just for all stakeholders involved, not just the shareholders or the company itself."
  },
  {
    "id": "c6q2",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "A CFO discovers that the company's new product has a minor safety defect. Fixing it would cost millions, while ignoring it might only result in a few minor customer complaints. Under Tucker's model, the decision to ignore the defect might pass the 'Is it profitable?' test, but it will most directly fail which other question?",
    "options": [
      "A) Is it sustainable?",
      "B) Is it right?",
      "C) Is it legal?",
      "D) Is it environmentally friendly?"
    ],
    "correctAnswer": "B) Is it right?",
    "explanation": "The question 'Is it right?' relates to personal and corporate moral values. Selling a product with a known safety defect fundamentally violates personal and professional integrity, failing the 'right' test regardless of profitability."
  },
  {
    "id": "c6q3",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "Which of the following represents the first step in the American Accounting Association (AAA) 7-step model for ethical decision making?",
    "options": [
      "A) Identify the major principles, rules, and values",
      "B) Specify the alternatives",
      "C) Determine the facts of the case",
      "D) Define the ethical issues"
    ],
    "correctAnswer": "C) Determine the facts of the case",
    "explanation": "The first step of the AAA model is to establish exactly what has happened or is happening by determining the objective facts of the case before any ethical analysis or alternative generation begins."
  },
  {
    "id": "c6q4",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "An internal auditor identifies a financial irregularity but is threatened with termination if she reports it. In the AAA model, during which step would she consider her professional obligations of 'integrity' and 'objectivity'?",
    "options": [
      "A) Step 2: Define the ethical issues",
      "B) Step 3: Identify the major principles, rules, and values",
      "C) Step 5: Compare values and alternatives",
      "D) Step 6: Assess the consequences"
    ],
    "correctAnswer": "B) Step 3: Identify the major principles, rules, and values",
    "explanation": "Step 3 of the AAA model involves identifying the relevant professional norms, principles, and values (such as the ICAP Code of Ethics principles of integrity and objectivity) that apply to the situation."
  },
  {
    "id": "c6q5",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "According to the ICAP study text, which of the following is the most refined definition of ethics proposed by Trevino and Nelson?",
    "options": [
      "A) A strict set of legal rules enforced by the government",
      "B) The principles, norms, and standards of conduct governing an individual or group",
      "C) The process of maximizing shareholder wealth while avoiding public scandals",
      "D) The personal beliefs a manager uses to dictate corporate strategy"
    ],
    "correctAnswer": "B) The principles, norms, and standards of conduct governing an individual or group",
    "explanation": "Trevino and Nelson define ethics as the principles, norms, and standards of conduct governing an individual or group. This definition focuses practically on observable conduct and behavioral attributes."
  },
  {
    "id": "c6q6",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "In the AAA 7-step model, what is the primary purpose of Step 6: 'Assess the consequences'?",
    "options": [
      "A) To ensure the decision complies with national laws",
      "B) To list all possible actions the decision-maker can take",
      "C) To evaluate both the short-run and long-run, positive and negative implications of each alternative",
      "D) To define the core ethical dilemma facing the organization"
    ],
    "correctAnswer": "C) To evaluate both the short-run and long-run, positive and negative implications of each alternative",
    "explanation": "Step 6 requires the decision-maker to analyze the implications and consequences of each possible alternative in all respects (short and long run, positive and negative) to overcome the human bias of focusing only on short-term benefits."
  },
  {
    "id": "c6q7",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "A factory legally disposes of chemical waste in a nearby river because the country's environmental laws are outdated. However, the waste kills local fish and harms the village's water supply. Under Tucker's model, this action is:",
    "options": [
      "A) Legal but not sustainable or fair",
      "B) Right but not profitable",
      "C) Fair but not legal",
      "D) Sustainable but not right"
    ],
    "correctAnswer": "A) Legal but not sustainable or fair",
    "explanation": "Because the laws are outdated, the action passes the 'Is it legal?' question. However, it fails the 'Is it sustainable?' (environmental values) and 'Is it fair?' (harming local stakeholders) questions."
  },
  {
    "id": "c6q8",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "Under Tucker's 5-question model, the question 'Is it sustainable?' relates directly to which type of values?",
    "options": [
      "A) Market values",
      "B) Legal values",
      "C) Environmental values",
      "D) Personal values"
    ],
    "correctAnswer": "C) Environmental values",
    "explanation": "In Tucker's model, the question 'Is it sustainable?' specifically addresses environmental values and assesses whether the decision promotes sustainable development and ecological preservation."
  },
  {
    "id": "c6q9",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "During an ethical dilemma, a manager writes down three distinct possible courses of action she could take to resolve the issue. Which step of the AAA model is she currently performing?",
    "options": [
      "A) Step 2: Define the ethical issues",
      "B) Step 4: Specify the alternatives",
      "C) Step 5: Match norms, principles, and values to options",
      "D) Step 7: Make the decision"
    ],
    "correctAnswer": "B) Step 4: Specify the alternatives",
    "explanation": "Step 4 of the AAA model is 'Specify the alternatives', which involves brainstorming and listing all the possible distinct courses of action or options available to resolve the dilemma."
  },
  {
    "id": "c6q10",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "Which of the following best distinguishes the American Accounting Association (AAA) model from Tucker’s 5-question model?",
    "options": [
      "A) The AAA model is a brief checklist of questions, while Tucker's model is a detailed step-by-step procedural framework",
      "B) The AAA model focuses heavily on environmental sustainability, while Tucker's model ignores it",
      "C) The AAA model is a 7-step procedural framework for evaluating alternatives against principles, whereas Tucker's is a 5-question checklist assessing a specific decision",
      "D) Tucker's model is exclusively used for accounting errors, while the AAA model is used for general business strategy"
    ],
    "correctAnswer": "C) The AAA model is a 7-step procedural framework for evaluating alternatives against principles, whereas Tucker's is a 5-question checklist assessing a specific decision",
    "explanation": "Tucker's model provides five specific questions to test the viability of a proposed decision. The AAA model provides a comprehensive seven-step process to lay out facts, generate alternatives, and methodically select the best one."
  },
  {
    "id": "c6q11",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "A company decides to launch a controversial advertising campaign that technically complies with broadcasting laws but relies on deceptive half-truths. Under Tucker’s model, the campaign passes the 'legal' test but most clearly fails the:",
    "options": [
      "A) Profitability test",
      "B) Right test",
      "C) Environmental test",
      "D) Feasibility test"
    ],
    "correctAnswer": "B) Right test",
    "explanation": "The 'Is it right?' test appeals to personal and corporate moral values (integrity, honesty). Relying on deceptive half-truths violates basic integrity and honesty, failing the 'right' test."
  },
  {
    "id": "c6q12",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "In Step 5 of the AAA model ('Matching norms, principles, and values to options'), what is the expected outcome of the analysis?",
    "options": [
      "A) Determining the objective facts of the case",
      "B) Seeing which alternatives accord with the ethical norms and which do not",
      "C) Calculating the exact financial loss or gain of the decision",
      "D) Finalizing the decision and implementing it immediately"
    ],
    "correctAnswer": "B) Seeing which alternatives accord with the ethical norms and which do not",
    "explanation": "In Step 5, the norms and principles identified in Step 3 are overlaid onto the alternatives generated in Step 4. The outcome is a clear view of which options align with ethical principles and which violate them."
  },
  {
    "id": "c6q13",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "A CEO refuses to recall a defective product because it would cause a massive drop in quarterly earnings and anger the shareholders. According to Tucker's model, the CEO is heavily prioritizing which question over the others?",
    "options": [
      "A) Is it legal?",
      "B) Is it fair?",
      "C) Is it profitable?",
      "D) Is it sustainable?"
    ],
    "correctAnswer": "C) Is it profitable?",
    "explanation": "The 'Is it profitable?' question deals with market values and short-term/long-term financial benefits for shareholders. The CEO is prioritizing this financial aspect over fairness to customers or doing the right thing."
  },
  {
    "id": "c6q14",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "What is the final step (Step 7) of the American Accounting Association (AAA) ethical decision-making model?",
    "options": [
      "A) Assess the consequences",
      "B) Make the decision",
      "C) Match principles to options",
      "D) Consult the legal department"
    ],
    "correctAnswer": "B) Make the decision",
    "explanation": "After establishing facts, generating alternatives, evaluating them against norms, and assessing their consequences, Step 7 is to finally select the best-fit alternative and 'Make the decision'."
  },
  {
    "id": "c6q15",
    "chapter": 6,
    "chapterTitle": "Ethical Decision Making Models",
    "question": "When applying Tucker’s 5-question model, if a proposed course of action results in a 'No' answer to one of the questions (e.g., it is profitable but not fair), what does this indicate?",
    "options": [
      "A) The action must be immediately executed regardless of the 'No'",
      "B) The action is illegal and will result in prosecution",
      "C) The decision-maker faces an ethical dilemma and must carefully weigh the conflicting values",
      "D) The action will automatically lead to environmental disaster"
    ],
    "correctAnswer": "C) The decision-maker faces an ethical dilemma and must carefully weigh the conflicting values",
    "explanation": "Tucker's model rarely produces a perfect 'Yes' to all five questions. When values conflict (e.g., an action is profitable but not fair), it highlights the core of the ethical dilemma, requiring the decision-maker to justify prioritizing one value over another."
  },
  {
    "id": "c7q1",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "Which of the following best represents the internationally accepted definition of 'Sustainable Development' as outlined in the Brundtland Report?",
    "options": [
      "A) Maximizing short-term corporate profits to ensure the company survives economic recessions",
      "B) Meeting the needs of the present without compromising the ability of future generations to meet their own needs",
      "C) Eliminating all carbon emissions from a business's operations immediately",
      "D) Utilizing natural resources aggressively to accelerate national economic growth"
    ],
    "correctAnswer": "B) Meeting the needs of the present without compromising the ability of future generations to meet their own needs",
    "explanation": "This is the universally accepted definition of sustainable development from the Brundtland Commission, emphasizing a balance between current economic growth and long-term ecological and social preservation."
  },
  {
    "id": "c7q2",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "The 'Triple Bottom Line' concept in corporate sustainability expands traditional reporting by urging companies to focus on three specific dimensions. What are they?",
    "options": [
      "A) Profits, Products, and Performance",
      "B) Policies, Politics, and People",
      "C) People, Planet, and Profit",
      "D) Planning, Processing, and Production"
    ],
    "correctAnswer": "C) People, Planet, and Profit",
    "explanation": "The Triple Bottom Line (TBL) framework recommends that companies commit to focus on social (People) and environmental (Planet) concerns just as much as they do on financial performance (Profit)."
  },
  {
    "id": "c7q3",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "A fast-fashion brand launches an advertising campaign claiming its new clothing line is '100% Eco-Friendly' because the packaging is recyclable. However, the clothes themselves are produced using highly toxic dyes and exploitative labor practices. This deceptive practice is known as:",
    "options": [
      "A) Corporate Social Responsibility",
      "B) Greenwashing",
      "C) Social Footprinting",
      "D) Impact Investing"
    ],
    "correctAnswer": "B) Greenwashing",
    "explanation": "Greenwashing occurs when a company uses deceptive marketing to make the public believe that its products, aims, or policies are environmentally friendly, while in reality, they are not."
  },
  {
    "id": "c7q4",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "In the context of the ESG reporting framework, what does the acronym 'ESG' stand for?",
    "options": [
      "A) Economic, Strategic, and Governance",
      "B) Environmental, Social, and Governance",
      "C) Ethical, Social, and Growth",
      "D) Ecological, Systematic, and Green"
    ],
    "correctAnswer": "B) Environmental, Social, and Governance",
    "explanation": "ESG stands for Environmental, Social, and Governance. It is a framework used by investors and stakeholders to evaluate a company's collective conscientiousness regarding sustainability and ethical factors."
  },
  {
    "id": "c7q5",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "Which of the following Key Performance Indicators (KPIs) would most appropriately measure the 'Social' dimension of a company's ESG performance?",
    "options": [
      "A) The total volume of water recycled during the manufacturing process",
      "B) The percentage of independent directors sitting on the corporate board",
      "C) The employee attrition (turnover) rate and the number of workplace accidents",
      "D) The total metric tons of greenhouse gases emitted annually"
    ],
    "correctAnswer": "C) The employee attrition (turnover) rate and the number of workplace accidents",
    "explanation": "Employee turnover rates, workplace safety (accidents), fair wages, and community engagement all fall squarely under the 'Social' pillar of ESG, which deals with how a company manages relationships with its workforce and society."
  },
  {
    "id": "c7q6",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "A multinational corporation frequently consults with local community leaders and environmental NGOs before building a new factory. Which sustainability principle does this practice best demonstrate?",
    "options": [
      "A) Profit maximization",
      "B) Stakeholder engagement",
      "C) Greenwashing",
      "D) Market segmentation"
    ],
    "correctAnswer": "B) Stakeholder engagement",
    "explanation": "Stakeholder engagement involves actively consulting and communicating with individuals or groups (like local communities and NGOs) who affect or are affected by the organization’s operations."
  },
  {
    "id": "c7q7",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "Which of the following is a classic example of a Key Performance Indicator (KPI) used to measure the 'Governance' aspect of ESG?",
    "options": [
      "A) Executive compensation linked to sustainability targets",
      "B) The amount of renewable energy utilized by the company",
      "C) The number of training hours provided to factory workers",
      "D) The total amount of corporate charitable donations"
    ],
    "correctAnswer": "A) Executive compensation linked to sustainability targets",
    "explanation": "Governance deals with a company’s leadership, executive pay, audits, internal controls, and shareholder rights. Linking executive pay to sustainability targets is a direct governance mechanism."
  },
  {
    "id": "c7q8",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "A textile manufacturer discharges untreated chemical dye into a local river, heavily polluting the water supply of a nearby village. In sustainability terms, this negative environmental impact caused by the business's operations is referred to as:",
    "options": [
      "A) An internal constraint",
      "B) A negative externality",
      "C) A corporate governance failure",
      "D) A social footprint"
    ],
    "correctAnswer": "B) A negative externality",
    "explanation": "A negative externality is a cost that is suffered by a third party (the village) as a result of an economic transaction or operational activity by a business (the factory) that does not pay for that cost."
  },
  {
    "id": "c7q9",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "Why is 'Profit' still considered a crucial pillar within the Triple Bottom Line (People, Planet, Profit) framework for sustainable development?",
    "options": [
      "A) Because environmental laws require companies to report profits",
      "B) Because without financial profitability and economic viability, a business cannot survive long enough to sustain its environmental and social initiatives",
      "C) Because the primary goal of sustainability is to increase executive bonuses",
      "D) Because social initiatives are only legally required for highly profitable companies"
    ],
    "correctAnswer": "B) Because without financial profitability and economic viability, a business cannot survive long enough to sustain its environmental and social initiatives",
    "explanation": "The Economic pillar (Profit) is essential because a business must be financially healthy and profitable to survive, pay its employees, and fund its long-term environmental and social goals."
  },
  {
    "id": "c7q10",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "A company is evaluating the 'Environmental' risks of its new operations in an arid region. Which of the following strategies would be the most effective way to mitigate the risk of 'water scarcity'?",
    "options": [
      "A) Increasing the marketing budget to improve public relations",
      "B) Implementing a rainwater harvesting and water-recycling system in the factory",
      "C) Offering higher wages to the local factory workers",
      "D) Appointing an independent director to the corporate board"
    ],
    "correctAnswer": "B) Implementing a rainwater harvesting and water-recycling system in the factory",
    "explanation": "Implementing water-efficient systems, recycling, and rainwater harvesting are direct, operational mitigations for the environmental risk of water scarcity in a region."
  },
  {
    "id": "c7q11",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "A leading technology company audits its overseas suppliers and discovers that one supplier is using forced child labor. Under the ESG framework, this severe risk falls under which specific category?",
    "options": [
      "A) Environmental risk",
      "B) Social risk",
      "C) Governance risk",
      "D) Economic risk"
    ],
    "correctAnswer": "B) Social risk",
    "explanation": "Human rights violations, child labor, poor working conditions, and exploitation in the supply chain are critical 'Social' risks under the ESG framework."
  },
  {
    "id": "c7q12",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "Which of the following best describes the difference between traditional Corporate Social Responsibility (CSR) and the modern ESG framework?",
    "options": [
      "A) CSR focuses on governance, while ESG focuses only on the environment",
      "B) CSR is usually a qualitative, self-regulated approach to corporate citizenship, whereas ESG provides specific, quantifiable metrics for investors to measure sustainability performance",
      "C) CSR is mandatory by law, whereas ESG is entirely voluntary",
      "D) There is absolutely no difference; the terms are used interchangeably in accounting"
    ],
    "correctAnswer": "B) CSR is usually a qualitative, self-regulated approach to corporate citizenship, whereas ESG provides specific, quantifiable metrics for investors to measure sustainability performance",
    "explanation": "While CSR is often a broader, qualitative corporate culture approach (like philanthropy), ESG focuses on specific, measurable, and quantifiable data (KPIs) that investors use to assess risk and sustainability."
  },
  {
    "id": "c7q13",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "A food packaging company tracks the 'Total metric tons of plastic waste sent to landfills versus the amount recycled' annually. This metric is a Key Performance Indicator (KPI) for which sustainability dimension?",
    "options": [
      "A) Governance",
      "B) Environmental",
      "C) Social",
      "D) Profitability"
    ],
    "correctAnswer": "B) Environmental",
    "explanation": "Waste management, recycling rates, and pollution control are fundamental KPIs used to measure a company's Environmental impact."
  },
  {
    "id": "c7q14",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "If an organization completely ignores sustainability practices and focuses solely on aggressive resource extraction for short-term profit, it is most likely exposing itself to which type of long-term risk?",
    "options": [
      "A) Regulatory risk (fines and tighter laws) and reputational damage",
      "B) Decreased immediate operational costs",
      "C) Increased immediate market share",
      "D) Reduced pressure from environmental NGOs"
    ],
    "correctAnswer": "A) Regulatory risk (fines and tighter laws) and reputational damage",
    "explanation": "Ignoring sustainability exposes a firm to severe regulatory risks (as governments pass stricter laws) and massive reputational damage (as consumers boycott unethical brands), threatening its long-term survival."
  },
  {
    "id": "c7q15",
    "chapter": 7,
    "chapterTitle": "Introduction to Sustainability",
    "question": "A bank has a firm policy of refusing to provide loans to any company involved in the production of controversial weapons or deforestation. This policy is an example of integrating sustainability into:",
    "options": [
      "A) Greenwashing tactics",
      "B) Human resource management",
      "C) Core business and financial strategy",
      "D) Marketing segmentation"
    ],
    "correctAnswer": "C) Core business and financial strategy",
    "explanation": "By tying its core lending and financing decisions to strict ESG criteria, the bank is integrating sustainability directly into its central business and financial strategy."
  },
  {
    "id": "c8q1",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "In Islamic Finance, an arrangement where one party provides the entire financial capital while the other party provides the expertise and management to run the business is called:",
    "options": [
      "A) Musharakah",
      "B) Mudarabah",
      "C) Ijarah",
      "D) Murabaha"
    ],
    "correctAnswer": "B) Mudarabah",
    "explanation": "Mudarabah is a partnership in profit where one party provides capital (Rabb-ul-Maal) and the other party provides labor and management expertise (Mudarib)."
  },
  {
    "id": "c8q2",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "In a Mudarabah contract, if the business suffers a financial loss due to normal business risks (and not due to the manager's negligence), who bears the financial loss?",
    "options": [
      "A) The Mudarib (Manager) only",
      "B) Both the Mudarib and Rabb-ul-Maal equally",
      "C) The Rabb-ul-Maal (Capital Provider) only",
      "D) The loss is shared according to the pre-agreed profit ratio"
    ],
    "correctAnswer": "C) The Rabb-ul-Maal (Capital Provider) only",
    "explanation": "In Mudarabah, the financial loss is borne entirely by the capital provider (Rabb-ul-Maal). The manager (Mudarib) only loses the time and effort they invested in the project."
  },
  {
    "id": "c8q3",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "Which of the following correctly describes a 'Murabaha' transaction in Islamic Finance?",
    "options": [
      "A) A lease agreement where the ownership of the asset is transferred at the end of the term",
      "B) A joint venture where both parties contribute capital and share profits and losses",
      "C) A sale where the seller expressly mentions the actual cost of the commodity and sells it to the buyer by adding a mutually agreed profit margin",
      "D) An interest-free loan provided to a business in distress"
    ],
    "correctAnswer": "C) A sale where the seller expressly mentions the actual cost of the commodity and sells it to the buyer by adding a mutually agreed profit margin",
    "explanation": "Murabaha is a 'cost-plus' financing structure where the seller explicitly discloses the cost of the asset and adds a known, agreed-upon profit mark-up before selling it to the buyer."
  },
  {
    "id": "c8q4",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "An Islamic bank leases machinery to a client under an Ijarah contract. The lessee delays the rental payments and the bank charges a late payment penalty. From a Shariah perspective, what must the bank do with this penalty amount?",
    "options": [
      "A) Record it as additional operating income",
      "B) Distribute it as a bonus to the bank's shareholders",
      "C) Donate the entire penalty amount to a charity, as taking it as income is considered Riba",
      "D) Refund it to the lessee at the end of the lease term"
    ],
    "correctAnswer": "C) Donate the entire penalty amount to a charity, as taking it as income is considered Riba",
    "explanation": "In Islamic finance, a penalty for late payment can be charged to deter default, but the bank cannot recognize this penalty as its own income because it is considered Riba (interest). It must be donated to charity."
  },
  {
    "id": "c8q5",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "Which of the following is a key characteristic of a 'Zero-Coupon Bond'?",
    "options": [
      "A) It pays a floating interest rate that changes every year",
      "B) It is sold at a significant discount to its face value, and the investor’s return is gained entirely through capital appreciation at maturity",
      "C) It provides the investor with the right to convert the bond into ordinary shares",
      "D) It pays high annual interest but the principal is never repaid"
    ],
    "correctAnswer": "B) It is sold at a significant discount to its face value, and the investor’s return is gained entirely through capital appreciation at maturity",
    "explanation": "Zero-coupon bonds do not pay any periodic interest (coupons). Instead, they are issued at a deep discount and redeemed at full face value, providing return through capital appreciation."
  },
  {
    "id": "c8q6",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "Which of the following statements correctly differentiates a 'Rights Issue' from a 'Bonus Issue' of shares?",
    "options": [
      "A) A bonus issue raises fresh cash for the company, while a rights issue does not",
      "B) A rights issue offers shares to the general public, while a bonus issue offers them to existing shareholders",
      "C) A rights issue raises new cash and increases the company's assets, while a bonus issue simply converts existing reserves into share capital without raising new cash",
      "D) A bonus issue is always offered at a premium, while a rights issue is offered at a discount"
    ],
    "correctAnswer": "C) A rights issue raises new cash and increases the company's assets, while a bonus issue simply converts existing reserves into share capital without raising new cash",
    "explanation": "A rights issue requires existing shareholders to pay cash for new shares (increasing company assets). A bonus issue gives free shares to existing shareholders by capitalizing reserves, raising no new cash."
  },
  {
    "id": "c8q7",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "A technology start-up with a high risk of failure but massive growth potential is looking for equity finance. They approach a wealthy individual who is willing to invest personal funds and offer business mentoring. This type of investor is best described as a:",
    "options": [
      "A) Venture Capital Firm",
      "B) Commercial Bank",
      "C) Business Angel",
      "D) Leasing Company"
    ],
    "correctAnswer": "C) Business Angel",
    "explanation": "Business Angels are wealthy individuals who invest their personal capital directly into high-growth start-ups, often providing personal mentoring and business expertise. Venture Capital firms invest pooled institutional money."
  },
  {
    "id": "c8q8",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "In the event of a company going into liquidation, which of the following providers of finance has the lowest priority (i.e., gets paid last) when the company's assets are distributed?",
    "options": [
      "A) Secured bondholders",
      "B) Ordinary shareholders",
      "C) Preference shareholders",
      "D) Unsecured bank lenders"
    ],
    "correctAnswer": "B) Ordinary shareholders",
    "explanation": "Ordinary shareholders hold the ultimate risk in a company. In the event of liquidation, they are the absolute last to be paid, ranking behind secured debt, unsecured debt, and preference shareholders."
  },
  {
    "id": "c8q9",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "A company requires funds to finance its daily working capital needs. It decides to sell its outstanding trade receivables to a third-party financial institution at a discount, passing on the administration of the sales ledger to them. This method of financing is called:",
    "options": [
      "A) Securitization",
      "B) Factoring",
      "C) Overdraft facility",
      "D) Convertible bonds"
    ],
    "correctAnswer": "B) Factoring",
    "explanation": "Factoring involves a business selling its invoices (trade receivables) to a third party (the factor) at a discount for immediate cash, with the factor usually taking over the administration of the sales ledger."
  },
  {
    "id": "c8q10",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "The process of converting existing illiquid assets or future cash flows (such as mortgage repayments) into marketable securities that can be sold to investors for immediate cash is known as:",
    "options": [
      "A) Securitization",
      "B) Factoring",
      "C) Leasing",
      "D) Mudarabah"
    ],
    "correctAnswer": "A) Securitization",
    "explanation": "Securitization is the financial process of pooling illiquid assets (like mortgages or receivables) and repackaging them into interest-bearing securities to sell to investors, raising immediate cash for the originating company."
  },
  {
    "id": "c8q11",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "A company issues 'Convertible Bonds' to raise finance. What specific right does the 'convertible' feature grant to the bondholder?",
    "options": [
      "A) The right to convert the bond into a higher interest rate in the future",
      "B) The right to demand immediate repayment of the principal at any time",
      "C) The right to exchange the bond for a specified number of ordinary shares in the company at a future date",
      "D) The right to convert the bond into a tangible physical asset"
    ],
    "correctAnswer": "C) The right to exchange the bond for a specified number of ordinary shares in the company at a future date",
    "explanation": "Convertible bonds are debt instruments that give the investor the option to convert the bond into a predetermined number of the issuing company's ordinary shares at a future date, instead of receiving cash redemption."
  },
  {
    "id": "c8q12",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "Which of the following is a primary difference between 'Ordinary Shares' and 'Preference Shares'?",
    "options": [
      "A) Ordinary shares pay a fixed, guaranteed dividend, while preference share dividends fluctuate with profits",
      "B) Ordinary shareholders typically have full voting rights on company decisions, whereas preference shareholders generally do not have voting rights",
      "C) Preference shares are always irredeemable, while ordinary shares must be redeemed after a set period",
      "D) Ordinary shareholders rank ahead of preference shareholders in the event of company liquidation"
    ],
    "correctAnswer": "B) Ordinary shareholders typically have full voting rights on company decisions, whereas preference shareholders generally do not have voting rights",
    "explanation": "A key distinction is that ordinary shares carry voting rights giving them control over the company, whereas preference shares usually do not carry voting rights (but have priority for fixed dividends)."
  },
  {
    "id": "c8q13",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "Which source of Islamic Finance represents a joint enterprise or partnership where all partners contribute capital, and profits are shared according to an agreed ratio, but losses are shared strictly in proportion to the capital contributed?",
    "options": [
      "A) Mudarabah",
      "B) Ijarah",
      "C) Musharakah",
      "D) Murabaha"
    ],
    "correctAnswer": "C) Musharakah",
    "explanation": "Musharakah is a joint venture/partnership where all parties provide capital. Shariah rules dictate that profits can be shared in any agreed ratio, but financial losses must be shared strictly according to the proportion of capital invested."
  },
  {
    "id": "c8q14",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "Which of the following represents the most significant advantage of using 'Retained Earnings' as a source of finance for a company's expansion?",
    "options": [
      "A) It forces the company to issue more shares to the public",
      "B) It carries no cost of equity whatsoever",
      "C) It is readily available internally, avoids issue costs, and does not dilute the control of existing shareholders",
      "D) It increases the company's debt-to-equity gearing ratio"
    ],
    "correctAnswer": "C) It is readily available internally, avoids issue costs, and does not dilute the control of existing shareholders",
    "explanation": "Retained earnings are internally generated funds. Using them avoids the high transaction/flotation costs of issuing new shares or debt, and because no new shares are issued, there is no dilution of control for existing owners."
  },
  {
    "id": "c8q15",
    "chapter": 8,
    "chapterTitle": "Sources of Finance",
    "question": "What is the primary difference between a conventional lease and an 'Ijarah' contract in Islamic Finance?",
    "options": [
      "A) In a conventional lease, the lessor owns the asset, but in Ijarah, the lessee owns it immediately",
      "B) In Ijarah, the lessor must retain the risk and ownership responsibilities related to the asset (such as major maintenance and insurance), whereas conventional leases often transfer these to the lessee",
      "C) In Ijarah, rental payments are strictly forbidden",
      "D) In a conventional lease, the asset must be donated to charity at the end of the term"
    ],
    "correctAnswer": "B) In Ijarah, the lessor must retain the risk and ownership responsibilities related to the asset (such as major maintenance and insurance), whereas conventional leases often transfer these to the lessee",
    "explanation": "Under Ijarah, the lessor (owner) cannot completely transfer the risks of ownership to the lessee. The lessor must remain responsible for the structural maintenance and insurance of the asset to justify charging rent."
  },
  {
    "id": "c9q1",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "A company has recently paid a dividend of Rs. 6 per share, which is expected to grow by 9% per annum in the foreseeable future. The shareholders require an annual return of 19% and the next annual dividend will be paid in one year’s time. According to the Dividend Valuation Model (DVM), what would be the market value of each share?",
    "options": [
      "A) Rs. 60.0",
      "B) Rs. 66.7",
      "C) Rs. 65.4",
      "D) Rs. 79.3"
    ],
    "correctAnswer": "C) Rs. 65.4",
    "explanation": "According to DVM: Po = D1 / (Ke - g). First find D1: 6 * 1.09 = 6.54. Then apply the formula: Po = 6.54 / (0.19 - 0.09) = 65.4."
  },
  {
    "id": "c9q2",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "The WACC of a company is 12%, and 50% of its shares are held by the directors. Ignoring taxation, if annual cash profits of the company in perpetuity are Rs. 240 million, what would be the theoretical total market value of the company?",
    "options": [
      "A) Rs. 1 billion",
      "B) Rs. 2 billion",
      "C) Rs. 4 billion",
      "D) Rs. 480 million"
    ],
    "correctAnswer": "B) Rs. 2 billion",
    "explanation": "The market value of an all-equity/constant profit firm can be calculated by capitalizing its earnings: Market Value = Annual Cash Profits / WACC. Rs. 240 million / 0.12 = Rs. 2,000 million (which is Rs. 2 billion)."
  },
  {
    "id": "c9q3",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "When shares are traded 'ex-dividend (XD)', which of the following statements accurately describes the situation?",
    "options": [
      "A) Buyers of shares at XD price are entitled to receive the upcoming dividend payment",
      "B) The XD share price is typically higher than when shares are traded 'cum-dividend'",
      "C) Buyers of shares at XD price are not entitled to receive the upcoming dividend payment",
      "D) The XD share price reflects the immediate anticipation of current year dividends"
    ],
    "correctAnswer": "C) Buyers of shares at XD price are not entitled to receive the upcoming dividend payment",
    "explanation": "When a share is marked 'ex-dividend', it means the seller, not the buyer, will receive the recently declared dividend. Consequently, the XD share price drops to exclude the value of that dividend."
  },
  {
    "id": "c9q4",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "Why is the post-tax cost of debt generally much lower than the cost of equity for a company?",
    "options": [
      "A) Because equity investors demand fixed returns while debt returns fluctuate",
      "B) Because debt is inherently less risky for the investor and interest payments are tax-deductible for the company",
      "C) Because dividends are tax-deductible while interest payments are paid from retained earnings",
      "D) Because debt holders have the lowest priority in the event of company liquidation"
    ],
    "correctAnswer": "B) Because debt is inherently less risky for the investor and interest payments are tax-deductible for the company",
    "explanation": "Debt is less risky for investors because interest is legally guaranteed and they rank higher in liquidation. For the company, debt is cheaper because interest payments shield profits from tax, lowering the effective cost."
  },
  {
    "id": "c9q5",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "When calculating the cost of redeemable debt (like bonds maturing in 5 years), which financial technique must a company use to find the true cost of that debt?",
    "options": [
      "A) Dividend Valuation Model (DVM)",
      "B) Capital Asset Pricing Model (CAPM)",
      "C) Internal Rate of Return (IRR) of the after-tax cash flows",
      "D) Net Present Value (NPV) using a 0% discount rate"
    ],
    "correctAnswer": "C) Internal Rate of Return (IRR) of the after-tax cash flows",
    "explanation": "Redeemable debt involves multiple cash flows over time: initial issue price (inflow), annual interest payments (outflows), and final redemption (outflow). Finding the precise percentage cost of these combined flows requires an IRR calculation."
  },
  {
    "id": "c9q6",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "What does an 'inverse' (downward-sloping) yield curve typically indicate to the financial markets?",
    "options": [
      "A) Markets expect short-term interest rates to rise at some time in the future",
      "B) Markets expect short-term interest rates to fall at some time in the future",
      "C) Inflation is expected to rise sharply",
      "D) Lenders demand higher compensation for long-term lending risks"
    ],
    "correctAnswer": "B) Markets expect short-term interest rates to fall at some time in the future",
    "explanation": "A normal yield curve slopes upwards. When it slopes downwards (inverse), long-term rates are lower than short-term rates, indicating the market anticipates a future decline in overall interest rates."
  },
  {
    "id": "c9q7",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "Which TWO factors primarily justify why an equity investment is considered riskier than an investment in the debt capital of the exact same company?",
    "options": [
      "A) Ordinary shareholders have no voting rights and receive fixed returns",
      "B) Dividends are not a legal obligation and ordinary shareholders rank last in the event of liquidation",
      "C) Interest payments can be missed without consequence, but dividends must be paid",
      "D) Equity investments are strictly short-term while debt is permanent"
    ],
    "correctAnswer": "B) Dividends are not a legal obligation and ordinary shareholders rank last in the event of liquidation",
    "explanation": "Equity is riskier because a company is not legally forced to pay dividends if profits are low, and if the company goes bankrupt, equity holders are paid only after all secured and unsecured creditors have been settled."
  },
  {
    "id": "c9q8",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "The process of calculating a zero-coupon yield curve (spot rates) by sequentially extracting rates from the market prices of existing coupon-bearing bonds is known as:",
    "options": [
      "A) Securitization",
      "B) Bootstrapping",
      "C) Interpolation",
      "D) Factoring"
    ],
    "correctAnswer": "B) Bootstrapping",
    "explanation": "Bootstrapping is a mathematical technique used to derive the spot yield curve for different maturities by starting with short-term zero-coupon bonds and working sequentially up to longer-term coupon bonds."
  },
  {
    "id": "c9q9",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "A company issues a convertible bond. When calculating the cost of this convertible debt for the WACC, the cost is estimated as the higher of the bond's straight-debt IRR and:",
    "options": [
      "A) The risk-free rate of the country",
      "B) The current market price of the company's ordinary shares",
      "C) The IRR of the cash flows assuming conversion into equity takes place at maturity",
      "D) The cost of equity calculated via CAPM"
    ],
    "correctAnswer": "C) The IRR of the cash flows assuming conversion into equity takes place at maturity",
    "explanation": "For convertible bonds, investors will choose whichever option gives them the highest return at maturity (cash redemption or share conversion). The company must calculate the IRR of both scenarios and take the higher rate as its true cost of debt."
  },
  {
    "id": "c9q10",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "How is the cost of irredeemable preference shares calculated?",
    "options": [
      "A) Preference dividend divided by the ex-dividend market price of the preference shares",
      "B) Preference dividend divided by the par value of the preference shares",
      "C) Through an Internal Rate of Return (IRR) calculation over 10 years",
      "D) By taking the risk-free rate and adding a fixed premium"
    ],
    "correctAnswer": "A) Preference dividend divided by the ex-dividend market price of the preference shares",
    "explanation": "Because irredeemable preference shares pay a constant dividend into perpetuity without ever returning the principal, their cost is simply calculated as Kp = D / Po (Dividend divided by the current ex-dividend market value)."
  },
  {
    "id": "c9q11",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "If a company decides to issue new shares to finance a highly risky project (one that completely alters the business's overall risk profile), why should it NOT use its existing Weighted Average Cost of Capital (WACC) to appraise the project?",
    "options": [
      "A) Because WACC only applies to debt financing",
      "B) Because the existing WACC reflects the risk of the company's current operations, not the new higher-risk project",
      "C) Because WACC cannot be calculated if a company issues new shares",
      "D) Because issuing new shares mathematically lowers the cost of equity to zero"
    ],
    "correctAnswer": "B) Because the existing WACC reflects the risk of the company's current operations, not the new higher-risk project",
    "explanation": "A company's current WACC represents its current risk profile. If a new project significantly changes the business risk (which changes the equity Beta), the existing WACC becomes invalid, and a new project-specific discount rate must be calculated."
  },
  {
    "id": "c9q12",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "According to the Capital Asset Pricing Model (CAPM), what happens to a company's Cost of Equity if the Beta of its shares increases from 1.0 to 1.3?",
    "options": [
      "A) The Cost of Equity will decrease because higher beta implies lower risk",
      "B) The Cost of Equity will remain exactly the same as the market return",
      "C) The Cost of Equity will increase because investors will demand a higher return for the increased systematic risk",
      "D) The Cost of Equity will drop to match the risk-free rate"
    ],
    "correctAnswer": "C) The Cost of Equity will increase because investors will demand a higher return for the increased systematic risk",
    "explanation": "Beta measures systematic risk. A beta of 1.3 means the stock is 30% more volatile than the market average. Under CAPM, as risk (Beta) goes up, the required return (Cost of Equity) goes up to compensate investors."
  },
  {
    "id": "c9q13",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "What is the formula used to calculate the cost of equity (Ke) using the Dividend Valuation Model with constant growth?",
    "options": [
      "A) Ke = (Po / D1) + g",
      "B) Ke = (D1 / Po) + g",
      "C) Ke = (D0 / Po) - g",
      "D) Ke = (Po * g) / D1"
    ],
    "correctAnswer": "B) Ke = (D1 / Po) + g",
    "explanation": "The DVM formula rearranged to solve for the cost of equity is Ke = (D1 / Po) + g, where D1 is the expected dividend next year, Po is the current ex-div share price, and g is the constant growth rate."
  },
  {
    "id": "c9q14",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "A company uses the Dividend Valuation Model to value its equity. What happens mathematically to the model if the assumed dividend growth rate (g) is equal to or higher than the investors' required rate of return (Ke)?",
    "options": [
      "A) The share price becomes exactly zero",
      "B) The model becomes mathematically invalid as the denominator becomes zero or negative",
      "C) The share price exactly equals the dividend amount",
      "D) The company automatically shifts to using CAPM instead"
    ],
    "correctAnswer": "B) The model becomes mathematically invalid as the denominator becomes zero or negative",
    "explanation": "In the formula Po = D1 / (Ke - g), if g is equal to or greater than Ke, the denominator becomes zero or negative, yielding an infinite or negative stock price. The model assumes Ke must always be strictly greater than g."
  },
  {
    "id": "c9q15",
    "chapter": 9,
    "chapterTitle": "Cost of Finance",
    "question": "Which of the following is considered a non-cash flow item that is explicitly ignored when calculating the Internal Rate of Return (IRR) of redeemable debt?",
    "options": [
      "A) The annual coupon interest payments",
      "B) The initial issue price or market value of the bond",
      "C) The final premium paid on redemption",
      "D) The annual accounting depreciation of the company's assets"
    ],
    "correctAnswer": "D) The annual accounting depreciation of the company's assets",
    "explanation": "IRR calculations are based strictly on actual cash flows. Accounting depreciation is a non-cash expense and has no place in the direct IRR calculation for the cost of debt."
  },
  {
    "id": "c10q1",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "Which of the following scenarios is a classic example of an operational (pure) risk rather than a strategic (speculative) risk?",
    "options": [
      "A) Launching a new product line that might fail in the market",
      "B) Investing in foreign markets where exchange rates are volatile",
      "C) A fire breaking out at the company’s main manufacturing facility",
      "D) Acquiring a smaller competitor to increase market share"
    ],
    "correctAnswer": "C) A fire breaking out at the company’s main manufacturing facility",
    "explanation": "Pure (operational) risks only offer the possibility of a loss (like a fire, theft, or machinery breakdown). Speculative (strategic) risks offer the possibility of both profit and loss, such as launching a new product."
  },
  {
    "id": "c10q2",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "According to the ISO 31000 risk management framework, which of the following is considered a core principle?",
    "options": [
      "A) Risk management must eliminate all possibility of financial loss",
      "B) Risk management is an integral part of all organizational activities",
      "C) Risk management should only be handled by external auditors",
      "D) Risk management is a one-time event conducted at the start of a project"
    ],
    "correctAnswer": "B) Risk management is an integral part of all organizational activities",
    "explanation": "A key principle of ISO 31000 is that risk management is not a standalone activity; it must be systematically integrated into the governance, strategy, and daily operations of the entire organization."
  },
  {
    "id": "c10q3",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "A company entered into a '3 v 9' Forward Rate Agreement (FRA) to hedge its future borrowings against rising interest rates. What does the term '3 v 9' indicate?",
    "options": [
      "A) The loan amount is Rs. 3 million and the interest rate is 9%",
      "B) The borrowing will start in 3 months and will last for a period of 6 months",
      "C) The borrowing will start in 3 months and will last for a period of 9 months",
      "D) The company will pay a 3% premium for a 9-month hedge"
    ],
    "correctAnswer": "B) The borrowing will start in 3 months and will last for a period of 6 months",
    "explanation": "In FRA terminology, '3 v 9' means the agreement covers an interest period starting in 3 months' time and ending in 9 months' time. Thus, the actual loan/deposit duration being hedged is 6 months."
  },
  {
    "id": "c10q4",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "A company entered into an FRA at 12.4% per annum to hedge its future cash DEPOSITS against falling interest rates. At the settlement date, the actual market KIBOR rate is 13.2% per annum. Who pays whom at settlement?",
    "options": [
      "A) The bank pays the company the interest difference",
      "B) The company pays the bank the interest difference",
      "C) The contract is automatically cancelled because rates rose instead of fell",
      "D) Neither party pays until the end of the 9-month period"
    ],
    "correctAnswer": "B) The company pays the bank the interest difference",
    "explanation": "The company locked in a guaranteed deposit rate of 12.4%. Because the actual market rate rose to 13.2%, the company 'loses' on the FRA (it is forced to accept 12.4% while the market offers 13.2%). Therefore, the company must pay the bank the difference."
  },
  {
    "id": "c10q5",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "A Pakistani textile exporter expects to receive USD 1,000,000 in three months. The exporter is worried that the US Dollar will depreciate against the PKR. To hedge this risk using currency options, the exporter should purchase:",
    "options": [
      "A) A Call option on USD",
      "B) A Put option on USD",
      "C) A Forward Rate Agreement",
      "D) An Interest Rate Swap"
    ],
    "correctAnswer": "B) A Put option on USD",
    "explanation": "A 'Put' option gives the holder the right, but not the obligation, to SELL the underlying currency at a specified strike price. Since the exporter receives USD and needs to sell it for PKR, buying a Put option protects them against the USD falling in value."
  },
  {
    "id": "c10q6",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "Which of the following best distinguishes a commodity futures contract from a commodity forward contract?",
    "options": [
      "A) Futures are customized private agreements, while forwards are traded on public exchanges",
      "B) Futures have standardized contract sizes and terms, while forwards allow complete flexibility in quantity and dates",
      "C) Futures completely eliminate risk, while forwards do not",
      "D) Forward contracts require daily cash settlement, while futures settle only at maturity"
    ],
    "correctAnswer": "B) Futures have standardized contract sizes and terms, while forwards allow complete flexibility in quantity and dates",
    "explanation": "Forwards are Over-The-Counter (OTC) private, highly customizable agreements. Futures are standardized, exchange-traded contracts with fixed lot sizes, strict maturity dates, and daily mark-to-market settlements."
  },
  {
    "id": "c10q7",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "In the context of financial futures contracts, what does the term 'tick' represent?",
    "options": [
      "A) The total premium paid to a broker",
      "B) The minimum allowable price movement for the futures contract",
      "C) The daily interest rate charged by the exchange",
      "D) The exact date the contract expires"
    ],
    "correctAnswer": "B) The minimum allowable price movement for the futures contract",
    "explanation": "A tick is the smallest increment by which a futures price can fluctuate. Exchanges define tick sizes to standardize trading, and every tick movement translates to a specific financial gain or loss for the investor."
  },
  {
    "id": "c10q8",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "A company is highly concerned about the threat of a devastating cyber-attack on its servers. To manage this risk, it purchases a comprehensive cybersecurity insurance policy. Which risk management strategy does this represent?",
    "options": [
      "A) Risk Avoidance",
      "B) Risk Reduction (Mitigation)",
      "C) Risk Transfer (Sharing)",
      "D) Risk Acceptance"
    ],
    "correctAnswer": "C) Risk Transfer (Sharing)",
    "explanation": "Purchasing insurance is the classic example of Risk Transfer. The company pays a premium to transfer the financial burden of the risk to a third party (the insurance company)."
  },
  {
    "id": "c10q9",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "In financial hedging using futures, what is meant by 'basis risk'?",
    "options": [
      "A) The risk that the bank will go bankrupt and fail to honour the contract",
      "B) The risk that the spot price and the futures price will not move exactly together, causing an imperfect hedge",
      "C) The risk that interest rates will remain completely flat",
      "D) The risk of calculating the base currency incorrectly"
    ],
    "correctAnswer": "B) The risk that the spot price and the futures price will not move exactly together, causing an imperfect hedge",
    "explanation": "Basis is the difference between the current spot price and the futures price. Basis risk occurs because these two prices do not always move in perfect synchronization, meaning the future hedge might not perfectly offset the real-world loss."
  },
  {
    "id": "c10q10",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "A corporate treasurer expects to borrow Rs. 50 million in six months' time for a period of three months. To protect against a potential rise in KIBOR, the treasurer decides to use Short-Term Interest Rate (STIR) futures. What is the correct initial position to take?",
    "options": [
      "A) Buy STIR futures contracts now",
      "B) Sell STIR futures contracts now",
      "C) Buy a Put option on the company's shares",
      "D) Sell a Call option on foreign currency"
    ],
    "correctAnswer": "B) Sell STIR futures contracts now",
    "explanation": "Interest rate futures are priced inversely to interest rates (Price = 100 - Interest Rate). If the treasurer fears rates will RISE, he expects the future price to FALL. To profit from a falling price to offset his borrowing costs, he must SELL futures contracts initially."
  },
  {
    "id": "c10q11",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "A business discovers that launching a controversial new product could potentially result in massive lawsuits that would bankrupt the firm. Management decides to completely scrap the product launch. This is an example of:",
    "options": [
      "A) Risk Transfer",
      "B) Risk Avoidance",
      "C) Risk Acceptance",
      "D) Risk Mitigation"
    ],
    "correctAnswer": "B) Risk Avoidance",
    "explanation": "Risk avoidance involves completely avoiding the activity that gives rise to the risk. By scrapping the product launch entirely, the company ensures the risk of lawsuits from that product is zero."
  },
  {
    "id": "c10q12",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "In a structured organizational risk management framework, who holds the ultimate responsibility for setting the overall 'risk appetite' and ensuring a risk-aware culture?",
    "options": [
      "A) The External Auditors",
      "B) The Departmental Floor Managers",
      "C) The Higher Management and Board of Directors",
      "D) The Human Resources Department"
    ],
    "correctAnswer": "C) The Higher Management and Board of Directors",
    "explanation": "Establishing the tone at the top, defining the organization's risk appetite, and ensuring risk awareness dialogue are fundamental responsibilities of the Board of Directors and senior management."
  },
  {
    "id": "c10q13",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "What does the financial acronym 'KIBOR' stand for?",
    "options": [
      "A) Karachi International Banking Operations Rate",
      "B) Karachi Interbank Offered Rate",
      "C) Key Interest Benchmark Over Rate",
      "D) Kingdom Interbank Origin Rate"
    ],
    "correctAnswer": "B) Karachi Interbank Offered Rate",
    "explanation": "KIBOR stands for Karachi Interbank Offered Rate, which is the average interest rate at which banks in Pakistan offer to lend unsecured funds to other banks in the wholesale money market. It is the primary benchmark for corporate lending."
  },
  {
    "id": "c10q14",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "If a company purchases a Call option on an interest rate (an Interest Rate Cap), what protection does the company secure?",
    "options": [
      "A) It guarantees a minimum rate of interest earned on its deposits",
      "B) It guarantees a maximum rate of interest paid on its borrowings",
      "C) It fixes the exchange rate for foreign imports",
      "D) It obligates the company to borrow money regardless of market conditions"
    ],
    "correctAnswer": "B) It guarantees a maximum rate of interest paid on its borrowings",
    "explanation": "An interest rate Call option (Cap) gives a borrower the right to cap their interest rate. If market rates rise above the strike rate, the option pays out, effectively guaranteeing a maximum limit to their borrowing costs."
  },
  {
    "id": "c10q15",
    "chapter": 10,
    "chapterTitle": "Financial Risk Management",
    "question": "Why must the final settlement amount in a Forward Rate Agreement (FRA) be discounted back to present value using the reference rate?",
    "options": [
      "A) Because FRA profits are subject to high corporate taxes",
      "B) Because FRAs are illegal if not discounted",
      "C) Because the FRA cash settlement is paid at the start of the loan period, rather than at the end when normal interest would be due",
      "D) Because banks require an additional profit margin on derivatives"
    ],
    "correctAnswer": "C) Because the FRA cash settlement is paid at the start of the loan period, rather than at the end when normal interest would be due",
    "explanation": "Standard loans charge interest at the END of the borrowing period. However, FRAs settle in cash at the START of the borrowing period. Because the company receives or pays the interest difference early, it must be discounted back to its present value."
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
