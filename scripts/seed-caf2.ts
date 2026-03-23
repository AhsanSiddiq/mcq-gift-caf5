import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const subjectId = 'caf-2';
const subjectName = 'Tax Practices'; // Assuming standard name

const data = [
  // Chap 1 - System of Taxation in Pakistan (Grid A)
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "Which of the following is NOT a characteristic of a tax?",
    explanation: "Tax payment is not voluntary in nature, and its imposition does not depend on the will of the person taxed. It is an enforced contribution levied by the state.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "It is generally payable in cash or via banking channels.", is_correct: false },
      { option_key: 'B', option_text: "It is a voluntary contribution made to the state by its citizens.", is_correct: true },
      { option_key: 'C', option_text: "It is an enforced contribution whose imposition is not dependent on the will of the taxpayer.", is_correct: false },
      { option_key: 'D', option_text: "It is levied by the law-making body of the state.", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "Which of the following situations best represents the use of taxation as a non-revenue objective?",
    explanation: "While taxes primarily finance government expenditures, providing exemptions to software exports serves the non-revenue objective of promoting the software industry and economic development.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Taxing the salary income of an individual to finance general government operations.", is_correct: false },
      { option_key: 'B', option_text: "Collecting custom duties to pay for the salaries of government officials.", is_correct: false },
      { option_key: 'C', option_text: "Providing tax exemptions to software exports to promote the software industry.", is_correct: true },
      { option_key: 'D', option_text: "Levying income tax on business profits.", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "According to Adam Smith's Canons of Taxation, which principle states that taxes should not be expensive to collect and should not discourage business activities?",
    explanation: "The Canon of Economy dictates that taxes should not be expensive to collect and should not discourage business.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Canon of Equality", is_correct: false },
      { option_key: 'B', option_text: "Canon of Economy", is_correct: true },
      { option_key: 'C', option_text: "Canon of Certainty", is_correct: false },
      { option_key: 'D', option_text: "Canon of Convenience", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "Which principle of taxation holds that individuals should be taxed in proportion to the advantages they receive from government programs and projects?",
    explanation: "The Benefit Principle holds that individuals should be taxed in proportion to the benefits they receive from the government, paying taxes for the direct benefit of government programs they utilize.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "The Ability-to-Pay Principle", is_correct: false },
      { option_key: 'B', option_text: "The Equal-Distribution Principle", is_correct: false },
      { option_key: 'C', option_text: "The Benefit Principle", is_correct: true },
      { option_key: 'D', option_text: "The Progressive Principle", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "A tax system that requires the same percentage of income from all taxpayers, applying the same rate across low, middle, and high-income earners, is known as:",
    explanation: "A proportional tax, also known as a flat tax, requires the same percentage of income from all taxpayers regardless of their earnings.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "A regressive tax", is_correct: false },
      { option_key: 'B', option_text: "A progressive tax", is_correct: false },
      { option_key: 'C', option_text: "A proportional (flat) tax", is_correct: true },
      { option_key: 'D', option_text: "A wealth tax", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "Under the Income Tax Ordinance, 2001, any amount transferred otherwise than through banking channels is deemed as income. What is the primary objective of this specific tax law?",
    explanation: "Deeming amounts transferred outside of banking channels as income aims to achieve the objective of \"Documentation of economy\".",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Promotion of research and developments", is_correct: false },
      { option_key: 'B', option_text: "Fair distribution of wealth", is_correct: false },
      { option_key: 'C', option_text: "Documentation of the economy", is_correct: true },
      { option_key: 'D', option_text: "Promotion of exports", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "Which of the following is considered a direct tax under the Pakistani taxation system?",
    explanation: "Direct taxes primarily comprise Income Tax and Capital Value Tax, which are levied directly on income, wealth, or transactions like the transfer of immovable property. Sales Tax, Custom Duty, and Federal Excise Duty are indirect taxes.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Sales Tax", is_correct: false },
      { option_key: 'B', option_text: "Federal Excise Duty", is_correct: false },
      { option_key: 'C', option_text: "Custom Duty", is_correct: false },
      { option_key: 'D', option_text: "Capital Value Tax", is_correct: true },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "Which of the following accurately describes a core characteristic of indirect taxes?",
    explanation: "Indirect taxes are imposed on the sale or consumption of goods and services, and the tax burden is shifted from the supplier or seller to the end consumer as part of the purchase price.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "The burden of the tax cannot be shifted to another person or entity.", is_correct: false },
      { option_key: 'B', option_text: "It is levied directly on the net income or wealth of an individual.", is_correct: false },
      { option_key: 'C', option_text: "The tax burden is transferred from the supplier or seller to the end consumer.", is_correct: true },
      { option_key: 'D', option_text: "It is an enforced contribution utilized solely for equal wealth distribution.", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "In the history of tax laws in the sub-continent, when was the first formal Income Tax Act introduced by the British Empire?",
    explanation: "The British Empire introduced the first formal Income Tax Act of 1860 in an effort to end the budgetary deficit faced due to the war of independence of 1857.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "1857", is_correct: false },
      { option_key: 'B', option_text: "1860", is_correct: true },
      { option_key: 'C', option_text: "1886", is_correct: false },
      { option_key: 'D', option_text: "1922", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "The definition of \"agricultural income,\" which remains largely similar in the modern Income Tax Ordinance 2001, was first introduced in which of the following legislations?",
    explanation: "The Income Tax Act of 1886 was a general income tax that introduced the definition of \"agricultural income,\" which is almost the same as in the Income Tax Ordinance 2001.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Income Tax Act of 1860", is_correct: false },
      { option_key: 'B', option_text: "Super Tax Act of 1917", is_correct: false },
      { option_key: 'C', option_text: "Income Tax Act of 1886", is_correct: true },
      { option_key: 'D', option_text: "Income Tax Act of 1922", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "Which principle of a \"sound tax system\" requires that the sources of revenue, taken as a whole, should be sufficient to meet the expenditures of the government and capable of expanding or contracting in response to public needs?",
    explanation: "Fiscal adequacy dictates that the sources of revenue should be sufficient to meet government expenditures and capable of expanding or contracting annually in response to variations in public expenditures.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Administrative Feasibility", is_correct: false },
      { option_key: 'B', option_text: "Fiscal Adequacy", is_correct: true },
      { option_key: 'C', option_text: "Theoretical Justice", is_correct: false },
      { option_key: 'D', option_text: "Compatibility with Economic Goals", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "Under the Pakistani tax system, which tax is levied on a limited number of goods produced or manufactured, and services provided in Pakistan, but allows all exports to be subject to a zero percent rate?",
    explanation: "Federal Excise duties are levied on a limited number of goods produced and services provided in Pakistan, with all exports subject to a zero percent Federal Excise Duty.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Federal Excise Duty", is_correct: true },
      { option_key: 'B', option_text: "Capital Value Tax", is_correct: false },
      { option_key: 'C', option_text: "Custom Duty", is_correct: false },
      { option_key: 'D', option_text: "Direct Income Tax", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 1,
    chapterTitle: "System of Taxation in Pakistan",
    question_text: "Which kind of tax takes a larger percentage from a high-income earner than it does from a low-income earner, aligning with the principle that a rich man should pay more than a poor man?",
    explanation: "A progressive tax takes a larger percentage from high-income earners than from low-income earners, meaning the more one earns, the more tax they have to pay.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Regressive tax", is_correct: false },
      { option_key: 'B', option_text: "Proportional tax", is_correct: false },
      { option_key: 'C', option_text: "Flat tax", is_correct: false },
      { option_key: 'D', option_text: "Progressive tax", is_correct: true },
    ]
  },

  // Chap 2 Constitutional Provisions on Taxes (Grid A)
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "Under the Constitution of Pakistan, tax can only be levied by or under the authority of:",
    explanation: "The Constitution of Pakistan provides that tax shall only be levied by or under the authority of an Act of Majlis-e-Shoora (Parliament).",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "The President of Pakistan", is_correct: false },
      { option_key: 'B', option_text: "The Federal Board of Revenue", is_correct: false },
      { option_key: 'C', option_text: "Act of Majlis-e-Shoora (Parliament)", is_correct: true },
      { option_key: 'D', option_text: "The Prime Minister", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "According to the Constitution of Pakistan, all revenues received and loans raised by the Federal Government shall form part of:",
    explanation: "All revenues received by the Federal Government, all loans raised, and all monies received in repayment of any loan form part of the Federal Consolidated Fund.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "The Public Account of the Federation", is_correct: false },
      { option_key: 'B', option_text: "The Federal Consolidated Fund", is_correct: true },
      { option_key: 'C', option_text: "The State Bank Reserve Fund", is_correct: false },
      { option_key: 'D', option_text: "The National Finance Commission Fund", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "Monies received by or deposited with the Supreme Court of Pakistan are credited to:",
    explanation: "Monies received by or deposited with the Supreme Court, or any other court established under the Federation's authority, are credited to the Public Account of the Federation.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "The Federal Consolidated Fund", is_correct: false },
      { option_key: 'B', option_text: "The Prime Minister's Relief Fund", is_correct: false },
      { option_key: 'C', option_text: "The Public Account of the Federation", is_correct: true },
      { option_key: 'D', option_text: "The Federal Board of Revenue Account", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "Which of the following is NOT an expenditure charged upon the Federal Consolidated Fund?",
    explanation: "Expenditures charged upon the Federal Consolidated Fund include the remuneration of the President, Judges of the Supreme Court and Islamabad High Court, Chief Election Commissioner, Auditor-General, and debt charges, but do not specifically list the general salaries of FBR employees.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Remuneration payable to the President", is_correct: false },
      { option_key: 'B', option_text: "Administrative expenses of the Supreme Court", is_correct: false },
      { option_key: 'C', option_text: "Remuneration payable to the Judges of the Supreme Court", is_correct: false },
      { option_key: 'D', option_text: "Salaries of the general employees of the Federal Board of Revenue", is_correct: true },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "The statement of the estimated receipts and expenditure of the Federal Government for a financial year, laid before the National Assembly, is known as:",
    explanation: "The Federal Government must lay before the National Assembly a statement of the estimated receipts and expenditure for every financial year, which is referred to as the Annual Budget Statement.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "The Federal Financial Statement", is_correct: false },
      { option_key: 'B', option_text: "The National Finance Award", is_correct: false },
      { option_key: 'C', option_text: "The Annual Budget Statement", is_correct: true },
      { option_key: 'D', option_text: "The Schedule of Authorized Expenditure", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "Who is required by the Constitution to authenticate the schedule of authorized expenditure by his/her signature?",
    explanation: "The Prime Minister shall authenticate by his signature a schedule specifying the grants made by the National Assembly and the sums required to meet the expenditure charged upon the Federal Consolidated Fund.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "The President", is_correct: false },
      { option_key: 'B', option_text: "The Minister of Finance", is_correct: false },
      { option_key: 'C', option_text: "The Prime Minister", is_correct: true },
      { option_key: 'D', option_text: "The Speaker of the National Assembly", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "Who has the constitutional authority to constitute the National Finance Commission (NFC) at intervals not exceeding five years?",
    explanation: "Within six months of the commencing day and thereafter at intervals not exceeding five years, the President shall constitute a National Finance Commission.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "The Prime Minister", is_correct: false },
      { option_key: 'B', option_text: "The President", is_correct: true },
      { option_key: 'C', option_text: "The Minister of Finance", is_correct: false },
      { option_key: 'D', option_text: "The Chief Justice of Pakistan", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "Which of the following is a primary duty of the National Finance Commission?",
    explanation: "It is the duty of the National Finance Commission to make recommendations to the President regarding the distribution of the net proceeds of taxes between the Federation and the Provinces.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "To approve the Annual Budget Statement", is_correct: false },
      { option_key: 'B', option_text: "To make recommendations regarding the distribution of net proceeds of taxes between the Federation and the Provinces", is_correct: true },
      { option_key: 'C', option_text: "To authorize expenditure from the Federal Consolidated Fund", is_correct: false },
      { option_key: 'D', option_text: "To authenticate the schedule of authorized expenditure", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "According to Article 160 of the Constitution, what is the rule regarding the share of the Provinces in the National Finance Commission (NFC) Award?",
    explanation: "The Constitution dictates that the share of the Provinces in each Award of the National Finance Commission shall not be less than the share given to the Provinces in the previous Award.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "It must be exactly equal to the Federal Government's share.", is_correct: false },
      { option_key: 'B', option_text: "It is determined solely by the population of each province.", is_correct: false },
      { option_key: 'C', option_text: "It shall not be less than the share given to the Provinces in the previous Award.", is_correct: true },
      { option_key: 'D', option_text: "It is completely at the discretion of the President with no minimum limit.", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "According to the Constitution, the net proceeds of the Federal duty of excise on natural gas levied at the well-head shall be paid to:",
    explanation: "The net proceeds of the Federal duty of excise on natural gas levied at the well-head shall not form part of the Federal Consolidated Fund and must be paid to the Province in which the well-head is situated.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "The Federal Consolidated Fund", is_correct: false },
      { option_key: 'B', option_text: "The Public Account of the Federation", is_correct: false },
      { option_key: 'C', option_text: "The Province in which the well-head of natural gas is situated", is_correct: true },
      { option_key: 'D', option_text: "The National Finance Commission", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "Under the Federal Legislative List of the Constitution of Pakistan, the Federal Government has the power to impose taxes on:",
    explanation: "Entry 47 of the Federal Legislative List empowers the Federation to legislate on \"Taxes on income other than agricultural income\".",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "All types of income including agricultural income", is_correct: false },
      { option_key: 'B', option_text: "Agricultural income only", is_correct: false },
      { option_key: 'C', option_text: "Income other than agricultural income", is_correct: true },
      { option_key: 'D', option_text: "Transfer of immovable property", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "According to the Federal Legislative List, the Federal Government can legislate and impose taxes on the sales and purchases of goods. However, it CANNOT impose sales tax on:",
    explanation: "Entry 49 of the Federal Legislative List gives the Federation the power to impose taxes on the sales and purchases of goods imported, exported, produced, manufactured, or consumed, except sales tax on services.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Goods imported into Pakistan", is_correct: false },
      { option_key: 'B', option_text: "Goods manufactured in Pakistan", is_correct: false },
      { option_key: 'C', option_text: "Goods exported from Pakistan", is_correct: false },
      { option_key: 'D', option_text: "Services", is_correct: true },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "A Provincial Assembly may impose taxes on persons engaged in professions, trades, or employments. According to the Constitution, such a tax shall NOT be regarded as:",
    explanation: "A Provincial Assembly may impose taxes on persons engaged in professions, trades, callings, or employments, and no such Act of the Assembly shall be regarded as imposing a tax on income.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "A provincial tax", is_correct: false },
      { option_key: 'B', option_text: "An indirect tax", is_correct: false },
      { option_key: 'C', option_text: "A tax on income", is_correct: true },
      { option_key: 'D', option_text: "A professional tax", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "Under the Constitution, which of the following statements is true regarding the taxation of government property or income?",
    explanation: "The Federal Government shall not, in respect of its property or income, be liable to taxation under any Act of a Provincial Assembly.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "The Federal Government is liable to pay provincial taxes on its property.", is_correct: false },
      { option_key: 'B', option_text: "The Federal Government is exempt from taxation under any Act of a Provincial Assembly in respect of its property or income.", is_correct: true },
      { option_key: 'C', option_text: "A Provincial Government is liable to pay Federal taxes on its income earned within the province.", is_correct: false },
      { option_key: 'D', option_text: "Local governments can tax the Federal Consolidated Fund.", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 2,
    chapterTitle: "Constitutional Provisions on Taxes",
    question_text: "Does the Majlis-e-Shoora (Parliament) have the power to levy tax on the income of a corporation owned or controlled by a Provincial Government?",
    explanation: "Majlis-e-Shoora (Parliament) has the power to make a law to provide for the levy and recovery of a tax on the income of a corporation, company, or institution owned or controlled by the Federal or a Provincial Government, regardless of the ultimate destination of such income.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "No, provincial corporations are completely exempt from federal taxes.", is_correct: false },
      { option_key: 'B', option_text: "Yes, Parliament has the power to levy tax on such corporations regardless of the ultimate destination of their income.", is_correct: true },
      { option_key: 'C', option_text: "Yes, but only if the Provincial Assembly passes a resolution allowing it.", is_correct: false },
      { option_key: 'D', option_text: "No, only the respective Provincial Assembly can tax its own corporations.", is_correct: false },
    ]
  },

  // Chap 3 - Ethics (Grid A)
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "A tax practitioner advises a corporate client on a cross-border transaction involving complex international tax treaties without consulting any subject-matter experts, leading to double taxation for the client. Which fundamental ethical principle has been most clearly breached?",
    explanation: "Tax practitioners have a duty to maintain their professional knowledge and skill at a level that ensures competent service, and advising without the requisite technical expertise breaches the principle of professional competence and due care.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Integrity", is_correct: false },
      { option_key: 'B', option_text: "Confidentiality", is_correct: false },
      { option_key: 'C', option_text: "Professional competence and due care", is_correct: true },
      { option_key: 'D', option_text: "Objectivity", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "A manager at a tax consultancy firm instructs his subordinate to ignore certain undocumented expenses while preparing a client's income tax return, stating that it is not their responsibility since it is not an audit engagement. By knowingly ignoring adjustments that render the return materially false, the manager is primarily breaching which principle?",
    explanation: "The principle of integrity imposes an obligation on all chartered accountants to be straightforward and honest. Knowingly ignoring required adjustments that make a tax return materially false is a breach of integrity and professional behavior.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Confidentiality", is_correct: false },
      { option_key: 'B', option_text: "Objectivity", is_correct: false },
      { option_key: 'C', option_text: "Integrity", is_correct: true },
      { option_key: 'D', option_text: "Professional competence", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "Your audit firm is requested to prepare calculations of current and deferred tax liabilities for an audit client that is classified as a Public Interest Entity (PIE). The calculations will be used to prepare accounting entries that are material to the financial statements. According to the ICAP Code of Ethics, what is the appropriate response?",
    explanation: "A firm shall not prepare tax calculations of current and deferred tax liabilities for a PIE audit client if the entries are material to the financial statements, except in emergency or highly unusual situations.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Accept the engagement but assign a different team to prepare the calculations.", is_correct: false },
      { option_key: 'B', option_text: "Accept the engagement if the client's management approves the calculations.", is_correct: false },
      { option_key: 'C', option_text: "The firm shall not prepare these tax calculations unless it is an emergency situation.", is_correct: true },
      { option_key: 'D', option_text: "Accept the engagement because tax calculations do not create a self-review threat.", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "Mr. A earned a turnover of Rs. 10 million, kept it as cash in his bank locker, and completely hid it from the tax authorities. Mr. C earned Rs. 10 million but legally utilized deductions to reduce his net taxable income to Rs. 3 million. Which of the following accurately describes their actions?",
    explanation: "Hiding income from tax authorities is a blatant fraud and constitutes tax evasion, whereas utilizing legally permissible deductions to reduce taxable income constitutes tax avoidance.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Both Mr. A and Mr. C committed tax evasion.", is_correct: false },
      { option_key: 'B', option_text: "Mr. A committed tax evasion, while Mr. C practiced tax avoidance.", is_correct: true },
      { option_key: 'C', option_text: "Mr. A practiced tax avoidance, while Mr. C committed tax evasion.", is_correct: false },
      { option_key: 'D', option_text: "Both Mr. A and Mr. C practiced tax avoidance.", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "Under the Utilitarian approach to tax compliance, which of the following is the primary motivation for citizens to pay taxes?",
    explanation: "Utilitarianism aims for the greatest total happiness across the population, ensuring that resources are distributed widely enough for most people to enjoy them, which motivates compliance.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Ensuring the greatest total happiness and maximum satisfaction of desires across the population.", is_correct: true },
      { option_key: 'B', option_text: "Following the absolute duty to respect other people's property rights.", is_correct: false },
      { option_key: 'C', option_text: "Fulfilling the virtue of independence and avoiding subsidies.", is_correct: false },
      { option_key: 'D', option_text: "Paying for the direct benefit of specific government programs utilized by the taxpayer.", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "Which of the following is NOT one of the four established pillars of tax administration designed to safeguard the interests of taxpayers and avoid the abuse of power?",
    explanation: "The four pillars of tax administration are Fairness, Transparency, Equity, and Accountability. Economy is a Canon of Taxation, not a pillar of tax administration.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Fairness", is_correct: false },
      { option_key: 'B', option_text: "Transparency", is_correct: false },
      { option_key: 'C', option_text: "Economy", is_correct: true },
      { option_key: 'D', option_text: "Accountability", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "A wealthy business owner uses complex, offshore financial strategies to avoid paying taxes in his home country. How would a \"Virtue Ethicist\" most likely view this aggressive tax avoidance?",
    explanation: "A virtue ethicist would disapprove of such behavior because exploiting rules to redistribute disadvantages away from oneself is not virtuous and harms others by shifting the tax burden onto them.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "They would not condemn it, as it complies with the strict letter of the law.", is_correct: false },
      { option_key: 'B', option_text: "They would approve of it because it maximizes the individual's personal happiness.", is_correct: false },
      { option_key: 'C', option_text: "They would disapprove because exploiting rules to shift the tax burden onto others is not morally right or virtuous.", is_correct: true },
      { option_key: 'D', option_text: "They would view it strictly as illegal tax evasion.", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "Which principle for structuring discretion in tax administration ensures that the criteria and past decisions utilized by tax authorities are accessible and consistent?",
    explanation: "\"Open precedents\" is one of the seven principles for structuring discretion, aimed at avoiding the abusive use of power by ensuring past decisions are visible and consistently applied.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Open precedents", is_correct: true },
      { option_key: 'B', option_text: "Selective application of law", is_correct: false },
      { option_key: 'C', option_text: "Confidentiality", is_correct: false },
      { option_key: 'D', option_text: "Best judgment assessment", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "Providing routine tax return preparation services to an audit client, which involves drafting information based on historical transactions to be submitted to tax authorities, generally creates which type of threat?",
    explanation: "Providing tax return preparation services, which principally involves the analysis and presentation of historical information under existing tax law, does not usually create a threat to independence.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "An insurmountable advocacy threat", is_correct: false },
      { option_key: 'B', option_text: "An insurmountable self-review threat", is_correct: false },
      { option_key: 'C', option_text: "It does not usually create a threat", is_correct: true },
      { option_key: 'D', option_text: "An intimidation threat", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "A taxpayer faces intimidation from a senior partner to ignore a material tax adjustment. Which of the following is an appropriate safeguard to reduce this threat to an acceptable level?",
    explanation: "Safeguards against such intimidation threats include discussing the matter, informing appropriate authorities, refusing to implement the proposals, seeking legal advice, or ultimately resigning.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Comply with the senior partner to protect the firm's client relationship.", is_correct: false },
      { option_key: 'B', option_text: "Discuss the matter with the partner, seek legal advice, or consider resigning if the threat cannot be reduced.", is_correct: true },
      { option_key: 'C', option_text: "Implement the proposal but attach a hidden disclaimer in the working papers.", is_correct: false },
      { option_key: 'D', option_text: "Delete the client's file to avoid association with the return.", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "Which canon of taxation dictates that a government should collect taxes from multiple sources rather than relying heavily on a single source to avoid inequity and revenue uncertainty?",
    explanation: "The Canon of Diversity states that the government should collect taxes from different sources; relying on a single source can result in inequity and uncertainty.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Canon of Elasticity", is_correct: false },
      { option_key: 'B', option_text: "Canon of Simplicity", is_correct: false },
      { option_key: 'C', option_text: "Canon of Productivity", is_correct: false },
      { option_key: 'D', option_text: "Canon of Diversity", is_correct: true },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "The Federal Board of Revenue (FBR) has the power to attach bank accounts to recover tax. If a taxpayer's entire business would collapse from immediate recovery, forcing them into bankruptcy instead of allowing installment payments, which pillar of tax administration is most at risk of being ignored?",
    explanation: "Equity demands that tax administrators do not achieve their objectives in an irrational manner, balancing revenue collection with the continuation and prosperity of the taxpayer's business.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Accountability", is_correct: false },
      { option_key: 'B', option_text: "Transparency", is_correct: false },
      { option_key: 'C', option_text: "Equity", is_correct: true },
      { option_key: 'D', option_text: "Secrecy", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "To determine what is ethically good for an individual and society, the philosopher Aristotle stated that it is necessary to possess three virtues of practical wisdom. These are:",
    explanation: "Aristotle believed that to determine what is ethically good, one must possess the three virtues of practical wisdom: temperance, courage, and justice.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Fairness, transparency, and accountability", is_correct: false },
      { option_key: 'B', option_text: "Temperance, courage, and justice", is_correct: true },
      { option_key: 'C', option_text: "Integrity, objectivity, and confidentiality", is_correct: false },
      { option_key: 'D', option_text: "Equity, certainty, and economy", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "A deontologist ethical approach to tax compliance is best described by which of the following?",
    explanation: "Deontology bases ethics on the idea of absolute duty and obligation, arguing that taxes must be paid as a matter of obligation for the use of public facilities.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Tax compliance is based on the absolute duty and obligation to respect rules and pay for social resources used.", is_correct: true },
      { option_key: 'B', option_text: "Taxes should be paid only if they maximize the total happiness of the population.", is_correct: false },
      { option_key: 'C', option_text: "Tax payment is determined solely by evaluating the economic benefit received by the individual.", is_correct: false },
      { option_key: 'D', option_text: "Taxes are an unvirtuous exploitation of property and should always be avoided.", is_correct: false },
    ]
  },
  {
    topic: "Grid A",
    chapter: 3,
    chapterTitle: "Ethics",
    question_text: "An individual engages in \"aggressive tax planning,\" finding legal loopholes to minimize their tax bill without committing fraud. According to the text, a Deontologist might view this behavior by concluding that:",
    explanation: "A deontologist might not positively favor tax avoidance but might not condemn it either, because they easily argue for a duty to obey the law, which the tax planner takes care to do.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "It is highly virtuous because it encourages independence.", is_correct: false },
      { option_key: 'B', option_text: "It is completely unacceptable because it reduces total societal happiness.", is_correct: false },
      { option_key: 'C', option_text: "They might not condemn it, as the individual is technically still fulfilling their duty to obey the letter of the law.", is_correct: true },
      { option_key: 'D', option_text: "It is synonymous with illegal tax evasion.", is_correct: false },
    ]
  },

  // Chap 4 Basic Concepts of Taxation (Grid B)
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "ABC Ltd. shifted its tax year from the normal tax year (ending June 30, 2026) to a special tax year ending September 30. What is the period from July 1, 2026, to September 30, 2026, called under the Income Tax Ordinance, 2001?",
    explanation: "Where the tax year of a person changes as a result of an order by the Commissioner, the period between the end of the last tax year prior to change and the date on which the changed tax year commences shall be treated as a \"transitional tax year\".",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Normal tax year", is_correct: false },
      { option_key: 'B', option_text: "Special tax year", is_correct: false },
      { option_key: 'C', option_text: "Transitional tax year", is_correct: true },
      { option_key: 'D', option_text: "Intervening tax year", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "If a company is allowed to adopt a special tax year spanning from 1st April 2025 to 31st March 2026, how will this tax year be denoted?",
    explanation: "A special tax year is denoted by the calendar year relevant to the normal tax year in which the closing date of the special tax year falls. Since March 31, 2026, falls within the normal tax year of July 1, 2025, to June 30, 2026, it is denoted as Tax Year 2026.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Tax Year 2025", is_correct: false },
      { option_key: 'B', option_text: "Tax Year 2026", is_correct: true },
      { option_key: 'C', option_text: "Tax Year 2027", is_correct: false },
      { option_key: 'D', option_text: "Transitional Tax Year", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "Mr. X received a dividend of Rs. 100,000, which was subject to a Zakat deduction of Rs. 10,000 under the Zakat and Ushr Ordinance, 1980. How will this Zakat be treated for tax purposes?",
    explanation: "Where Zakat has been deducted out of the profit on debt or dividend (which is chargeable under the head \"Income from Other Sources\"), such Zakat shall not be deducted out of total income as a standard deductible allowance, but rather it shall be allowed as a deduction while computing the income from other sources.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "It will be deducted from his total income under Part IX (Deductible Allowances).", is_correct: false },
      { option_key: 'B', option_text: "It will be deducted directly out of the dividend income under the head \"Income from Other Sources\".", is_correct: true },
      { option_key: 'C', option_text: "It will be carried forward to the next tax year.", is_correct: false },
      { option_key: 'D', option_text: "It will not be allowed as a deduction at all.", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "Mr. Ali, an individual with a taxable income of Rs. 1,400,000, paid tuition fees for his two children amounting to Rs. 400,000 during the tax year. What is the maximum deductible allowance for education expenses he can claim?",
    explanation: "The allowance cannot exceed the lesser of: (a) 5% of tuition fee (Rs. 20,000); (b) 25% of taxable income (Rs. 350,000); or (c) Rs. 60,000 x number of children (Rs. 120,000). The lesser amount is Rs. 20,000.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Rs. 100,000", is_correct: false },
      { option_key: 'B', option_text: "Rs. 350,000", is_correct: false },
      { option_key: 'C', option_text: "Rs. 20,000", is_correct: true },
      { option_key: 'D', option_text: "Rs. 120,000", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "Under Section 80 of the Income Tax Ordinance, 2001, which of the following is specifically included in the definition of a \"Company\" and NOT treated as an Association of Persons (AOP)?",
    explanation: "The definition of an Association of Persons includes a firm, a Hindu undivided family, and any artificial juridical person. A trust, however, is specifically included within the definition of a \"Company\" for tax purposes.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "A firm", is_correct: false },
      { option_key: 'B', option_text: "A Hindu undivided family", is_correct: false },
      { option_key: 'C', option_text: "An artificial juridical person", is_correct: false },
      { option_key: 'D', option_text: "A trust", is_correct: true },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "Which of the following entities qualifies as a \"Public Company\" for tax purposes?",
    explanation: "A public company includes a company in which not less than 50% of the shares are held by a foreign Government, or a foreign company owned by a foreign Government.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "A company where 40% of the shares are held by the Federal Government.", is_correct: false },
      { option_key: 'B', option_text: "A private company with an annual turnover exceeding Rs. 500 million.", is_correct: false },
      { option_key: 'C', option_text: "A company in which a foreign government holds 50% or more of the shares.", is_correct: true },
      { option_key: 'D', option_text: "A company whose shares were delisted from the stock exchange before the end of the tax year.", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "Mr. Sameel, a citizen of Pakistan, stayed in Pakistan for 150 days during the tax year 2026. He spent the rest of the year travelling for leisure, did not stay in any other single country for more than 182 days, and is not a tax resident of any other country. What is his residential status in Pakistan for the tax year 2026?",
    explanation: "A citizen of Pakistan who is not present in any other country for more than 182 days during the tax year, or is not a resident taxpayer of any other country, shall be treated as a resident individual in Pakistan, regardless of whether their physical stay in Pakistan was less than 183 days.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Non-resident", is_correct: false },
      { option_key: 'B', option_text: "Resident individual", is_correct: true },
      { option_key: 'C', option_text: "Transitional resident", is_correct: false },
      { option_key: 'D', option_text: "Foreign resident", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "For an Association of Persons (AOP) to be considered a resident in Pakistan for a tax year, the control and management of its affairs must be situated:",
    explanation: "An AOP shall be a resident association of persons for a tax year if the control and management of the affairs of the association is situated wholly or partly in Pakistan at any time in the year. (Note: For a company to be resident based on control, it must be wholly in Pakistan).",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Wholly in Pakistan at any time in the year.", is_correct: false },
      { option_key: 'B', option_text: "Wholly or partly in Pakistan at any time in the year.", is_correct: true },
      { option_key: 'C', option_text: "Wholly outside Pakistan.", is_correct: false },
      { option_key: 'D', option_text: "For at least 183 days in Pakistan.", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "Which of the following is a core characteristic of income falling under the Final Tax Regime (FTR)?",
    explanation: "Under the FTR (Gross income basis), expenses related to earning the income cannot be deducted, tax credits cannot be applied, and losses are not considered. The tax deducted at source is treated as the final tax liability.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Deductible allowances can be claimed against it.", is_correct: false },
      { option_key: 'B', option_text: "Losses from other business heads can be set off against it.", is_correct: false },
      { option_key: 'C', option_text: "The tax deducted at source is considered the final tax liability, and no expenses are allowed as deductions.", is_correct: true },
      { option_key: 'D', option_text: "It is added to the total income to calculate the applicable slab rate for normal tax.", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "Omega (Pvt.) Limited extended a loan of Rs. 2.5 million to one of its shareholders on 30 June 2026. The company's accumulated profits on that date were Rs. 1.8 million. What amount will be treated as a \"dividend\" for the shareholder?",
    explanation: "Any advance or loan made to a shareholder by a private company is treated as a dividend to the extent to which the company possesses accumulated profits. Thus, Rs. 1.8 million will be treated as a dividend.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Rs. 2.5 million", is_correct: false },
      { option_key: 'B', option_text: "Rs. 1.8 million", is_correct: true },
      { option_key: 'C', option_text: "Rs. 0.7 million", is_correct: false },
      { option_key: 'D', option_text: "Nil", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "ABC & Co., an AOP, has an annual turnover of Rs. 116 million and a computed tax liability under the normal tax regime (NTR) of Rs. 164,000 for tax year 2026. The minimum tax under section 113 (1.25% of turnover) calculates to Rs. 1,450,000. What is the tax payable by the AOP, and what is the treatment of the difference?",
    explanation: "The AOP must pay the higher of the minimum tax or the normal tax (Rs. 1,450,000). The excess of minimum tax paid over the actual normal tax payable (Rs. 1,286,000) shall be carried forward for adjustment against tax liability for the two immediately succeeding tax years.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Tax payable is Rs. 164,000; no difference is carried forward.", is_correct: false },
      { option_key: 'B', option_text: "Tax payable is Rs. 1,450,000; the difference of Rs. 1,286,000 is ignored.", is_correct: false },
      { option_key: 'C', option_text: "Tax payable is Rs. 1,450,000; the difference of Rs. 1,286,000 can be carried forward for adjustment against future tax liabilities for up to two tax years.", is_correct: true },
      { option_key: 'D', option_text: "Tax payable is Rs. 1,614,000.", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "A woman enterprise (a sole proprietorship owned by a woman) launched in August 2021 generates profits under the head 'Income from Business'. If the enterprise is unable to fulfill all the criteria required to claim the 100% start-up tax credit under Section 65F, what alternative tax relief is it entitled to?",
    explanation: "The tax payable by a woman enterprise on profits and gains chargeable under the head 'Income from Business' shall be reduced by 25% if the enterprise is unable to claim the 100% tax credit available under Section 65F.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "100% exemption on all indirect taxes.", is_correct: false },
      { option_key: 'B', option_text: "A 50% tax reduction on its business income.", is_correct: false },
      { option_key: 'C', option_text: "A 25% tax reduction on the tax payable on its business income.", is_correct: true },
      { option_key: 'D', option_text: "No tax relief is available.", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "XYZ Ltd. sold a second-hand asset to an associated company. The written-down value of the asset was Rs. 350,000, and the sale price recorded in their internal books was Rs. 200,000. However, the open market value of the asset at the time of sale was determined to be Rs. 250,000. What value will be considered for tax purposes?",
    explanation: "The Fair Market Value (FMV) of any property, asset, or service at a particular time shall be the price it would ordinarily fetch on sale or supply in the open market. Therefore, the FMV of Rs. 250,000 will be adopted.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "Rs. 200,000", is_correct: false },
      { option_key: 'B', option_text: "Rs. 250,000", is_correct: true },
      { option_key: 'C', option_text: "Rs. 350,000", is_correct: false },
      { option_key: 'D', option_text: "Rs. 550,000", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "A debtor of Mr. Bashir directly paid Rs. 35,000 to Mr. Bashir's supplier to settle one of Mr. Bashir's business liabilities. The payment was made on Mr. Bashir's direct instructions. How will this Rs. 35,000 be treated under Section 69 of the Income Tax Ordinance, 2001?",
    explanation: "Section 69 states that a person shall be treated as having received an amount if it is applied on behalf of the person or at the instruction of the person. Thus, it is treated as received by him.",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "It will not be treated as a receipt since Bashir did not physically receive the cash.", is_correct: false },
      { option_key: 'B', option_text: "It will be treated as having been received by Bashir since it was applied on his behalf.", is_correct: true },
      { option_key: 'C', option_text: "It will be treated as a capital receipt and exempt from tax.", is_correct: false },
      { option_key: 'D', option_text: "It will be treated as a deductible allowance.", is_correct: false },
    ]
  },
  {
    topic: "Grid B",
    chapter: 4,
    chapterTitle: "Basic Concepts of Taxation",
    question_text: "Mr. XYZ received a consultancy fee of US $500 on 14 April 2026. He held onto the dollars and later exchanged them into Pakistani Rupees on 20 April 2026. According to Section 71, which exchange rate must be used to convert the US $500 into Rupees for computing his taxable income?",
    explanation: "If an amount is in a foreign currency, it shall be converted to the Rupee at the State Bank of Pakistan rate applying on the date the amount is taken into account for the purposes of the Ordinance (i.e., the date of receipt, 14 April 2026).",
    difficulty: "Medium",
    options: [
      { option_key: 'A', option_text: "The exchange rate prevailing on the last day of the tax year (30 June 2026).", is_correct: false },
      { option_key: 'B', option_text: "The exchange rate on the date the dollars were physically exchanged at the bank (20 April 2026).", is_correct: false },
      { option_key: 'C', option_text: "The State Bank of Pakistan rate applying on the date the amount was taken into account/received (14 April 2026).", is_correct: true },
      { option_key: 'D', option_text: "The average State Bank exchange rate for the entire tax year.", is_correct: false },
    ]
  }
];

import * as crypto from 'crypto';

async function seed() {
  console.log('Seeding CAF-2 MCQs...');

  let successCount = 0;

  for (const q of data) {
    const { options, ...questionData } = q;
    const qId = crypto.randomUUID();
    
    // Insert Question
    const { data: insertedQuestion, error: qError } = await supabase
      .from('questions')
      .insert({
        id: qId,
        level: 'caf',
        subject_id: subjectId,
        topic: questionData.topic,
        chapter: questionData.chapter,
        question_text: questionData.question_text,
        explanation: questionData.explanation,
        difficulty: questionData.difficulty,
        is_active: true
      })
      .select()
      .single();

    if (qError) {
      console.error('Error inserting question:', qError);
      continue;
    }

    // Insert Options
    const optionsToInsert = options.map(opt => ({
      question_id: insertedQuestion.id,
      option_key: opt.option_key,
      option_text: opt.option_text,
      is_correct: opt.is_correct
    }));

    const { error: oError } = await supabase
      .from('options')
      .insert(optionsToInsert);

    if (oError) {
      console.error('Error inserting options for question', insertedQuestion.id, ':', oError);
    } else {
      successCount++;
    }
  }

  console.log('Successfully seeded ' + successCount + ' questions for CAF-2.');
}

seed().catch(console.error);
