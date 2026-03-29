export type Level = "PRC" | "CAF";

export interface Subject {
  id: string; // e.g., 'prc-1', 'caf-5'
  title: string;
  level: Level;
  description: string;
  isAvailable: boolean;
}

export const prcSubjects: Subject[] = [
  {
    id: "prc-1",
    title: "Fundamentals of Accounting",
    level: "PRC",
    description: "Essential accounting principles, theory, and practice questions.",
    isAvailable: true,
  },
  {
    id: "prc-2",
    title: "Quantitative Analysis for Business",
    level: "PRC",
    description: "Key business mathematics and analytical problem-solving concepts.",
    isAvailable: false,
  },
  {
    id: "prc-3",
    title: "Business & Economic Insights",
    level: "PRC",
    description: "Combined concepts from economics and introduction to business.",
    isAvailable: true,
  },
];

export const cafSubjects: Subject[] = [
  {
    id: "caf-1",
    title: "Financial Accounting and Reporting",
    level: "CAF",
    description: "Build strong, advanced accounting fundamentals.",
    isAvailable: false,
  },
  {
    id: "caf-2",
    title: "Taxation Principles and Compliance",
    level: "CAF",
    description: "Master income tax and sales tax compliance.",
    isAvailable: true,
  },
  {
    id: "caf-3",
    title: "Data, Systems and Risks",
    level: "CAF",
    description: "Information technology, digital reporting, and risk management.",
    isAvailable: true,
  },
  {
    id: "caf-4",
    title: "Business Law Dynamics",
    level: "CAF",
    description: "Mercantile and Company Law combined.",
    isAvailable: true,
  },
  {
    id: "caf-5",
    title: "Management Accounting",
    level: "CAF",
    description: "Costing, budgeting, and actionable performance management.",
    isAvailable: true, // Currently available
  },
  {
    id: "caf-6",
    title: "Corporate Reporting",
    level: "CAF",
    description: "Advanced corporate financial reporting standards.",
    isAvailable: false,
  },
  {
    id: "caf-7",
    title: "Business Insights and Analysis",
    level: "CAF",
    description: "Financial analysis and deep decision-making.",
    isAvailable: true,
  },
  {
    id: "caf-8",
    title: "Audit and Assurance Essentials",
    level: "CAF",
    description: "Auditing standards and professional assurance engagements.",
    isAvailable: false,
  },
];

export const allSubjects = [...prcSubjects, ...cafSubjects];
