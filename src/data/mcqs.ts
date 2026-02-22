export type MCQ = {
  id: string;
  chapter: number;
  chapterTitle: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export const mcqs: MCQ[] = [
  // Chapter 1: Inventory Valuation
  {
    id: "c1q1",
    chapter: 1,
    chapterTitle: "Inventory Valuation",
    question: "During the material procurement process, which document is prepared by the Store / Warehouse and sent to the Procurement / Purchase Department to initiate the buying process?",
    options: [
      "A) Material Requisition",
      "B) Purchase Order",
      "C) Goods Received Note",
      "D) Purchase Requisition"
    ],
    correctAnswer: "D) Purchase Requisition",
    explanation: "The Store / Warehouse raises a Purchase Requisition to the Procurement / Purchase Department when stock needs to be replenished. A Material Requisition is raised by Production to the Store, and a Purchase Order is raised by Procurement to the Supplier."
  },
  {
    id: "c1q2",
    chapter: 1,
    chapterTitle: "Inventory Valuation",
    question: "Which of the following documents is used to record the transfer of raw materials from the warehouse to the production department?",
    options: [
      "A) Goods Dispatch Note (GDN)",
      "B) Goods Issue Note (GIN)",
      "C) Goods Received Note (GRN)",
      "D) Material Requisition"
    ],
    correctAnswer: "B) Goods Issue Note (GIN)",
    explanation: "When the store issues raw materials to the production department for manufacturing, the warehouse prepares a Goods Issue Note (GIN)."
  },
  {
    id: "c1q3",
    chapter: 1,
    chapterTitle: "Inventory Valuation",
    question: "What is the primary purpose of maintaining a \"bin card\" by the storekeeper?",
    options: [
      "A) To record the financial value of the inventory in the general ledger.",
      "B) To track the net realizable value of the stock.",
      "C) To record the quantities of items received and issued, while maintaining a running balance.",
      "D) To issue a formal request to the supplier for new materials."
    ],
    correctAnswer: "C) To record the quantities of items received and issued, while maintaining a running balance.",
    explanation: "A bin card is maintained for each raw material item by the storekeeper. It only tracks quantities (receipts, issues, and a running balance) to help ensure stock does not fall below the re-order level."
  },
  {
    id: "c1q4",
    chapter: 1,
    chapterTitle: "Inventory Valuation",
    question: "According to IAS 2, at what value should an entity carry its inventories in the financial statements at the end of a reporting period?",
    options: [
      "A) At the lower of historical cost or replacement cost",
      "B) At the lower of cost or net realisable value",
      "C) Strictly at historical cost",
      "D) At the higher of cost or net realisable value"
    ],
    correctAnswer: "B) At the lower of cost or net realisable value",
    explanation: "According to IAS 2, an entity is required to evaluate its inventories at the end of each reporting period and value them at the lower of cost or Net Realisable Value (NRV)."
  },
  {
    id: "c1q5",
    chapter: 1,
    chapterTitle: "Inventory Valuation",
    question: "How is the Net Realisable Value (NRV) of an inventory item calculated?",
    options: [
      "A) Estimated selling price plus estimated cost to complete.",
      "B) Estimated selling price less estimated cost to complete and estimated selling expenses.",
      "C) Original purchase price less accumulated depreciation.",
      "D) Current replacement cost less estimated selling expenses."
    ],
    correctAnswer: "B) Estimated selling price less estimated cost to complete and estimated selling expenses.",
    explanation: "Net realisable value is defined as the estimated selling price in the ordinary course of business less the estimated cost of completion and the estimated cost necessary to make the sale."
  },
  {
    id: "c1q6",
    chapter: 1,
    chapterTitle: "Inventory Valuation",
    question: "A manufacturing company has partially completed Work-in-Process (WIP) inventory. The historical cost incurred to date is Rs. 16,000. The estimated final selling price of the completed product is Rs. 14,000. It will cost an additional Rs. 1,500 to complete the product, and selling costs will be Rs. 200. At what value should this WIP inventory be recorded?",
    options: [
      "A) Rs. 16,000",
      "B) Rs. 14,000",
      "C) Rs. 12,300",
      "D) Rs. 12,500"
    ],
    correctAnswer: "C) Rs. 12,300",
    explanation: "Inventory must be valued at the lower of Cost (Rs. 16,000) or NRV. NRV = Estimated Selling Price (14,000) - Cost to Complete (1,500) - Selling Cost (200) = Rs. 12,300. Since NRV (12,300) is lower than Cost (16,000), it should be valued at Rs. 12,300."
  },
  {
    id: "c1q7",
    chapter: 1,
    chapterTitle: "Inventory Valuation",
    question: "In a manufacturing account, how is \"Prime Cost\" calculated?",
    options: [
      "A) Direct materials consumed + Direct labour + Factory overheads",
      "B) Purchases of raw materials + Direct labour",
      "C) Cost of materials consumed + Direct labour + Other direct expenses",
      "D) Total production cost + Opening Work in Process"
    ],
    correctAnswer: "C) Cost of materials consumed + Direct labour + Other direct expenses",
    explanation: "In the manufacturing account format, Prime Cost represents the total of all direct costs, which includes the cost of materials consumed, direct labour (wages), and other direct expenses."
  },
  {
    id: "c1q8",
    chapter: 1,
    chapterTitle: "Inventory Valuation",
    question: "Which of the following formulas correctly calculates the \"Cost of Goods Manufactured\"?",
    options: [
      "A) Prime Cost + Factory Overheads + Opening WIP – Closing WIP",
      "B) Prime Cost + Factory Overheads + Opening Finished Goods – Closing Finished Goods",
      "C) Cost of materials consumed + Direct labour + Factory Overheads",
      "D) Sales Revenue – Gross Profit"
    ],
    correctAnswer: "A) Prime Cost + Factory Overheads + Opening WIP – Closing WIP",
    explanation: "The Cost of Goods Manufactured is derived by taking the Prime Cost, adding Factory Overheads (which gives the total manufacturing cost), and then adjusting for the movement in Work in Progress (adding Opening WIP and deducting Closing WIP)."
  },
  {
    id: "c1q9",
    chapter: 1,
    chapterTitle: "Inventory Valuation",
    question: "In the absence of specific information regarding inventory valuation policy in a manufacturing scenario, which basis is generally assumed for closing inventory valuation?",
    options: [
      "A) Last-In-First-Out (LIFO)",
      "B) First-In-First-Out (FIFO)",
      "C) Weighted Average Cost (AVCO)",
      "D) Standard Cost"
    ],
    correctAnswer: "B) First-In-First-Out (FIFO)",
    explanation: "The study text explicitly states that in the absence of specific information, we always assume the \"first in-first out\" (FIFO) basis for closing inventory valuation."
  },
  {
    id: "c1q10",
    chapter: 1,
    chapterTitle: "Inventory Valuation",
    question: "A business has Opening Finished Goods of Rs. 160,000. During the period, the Cost of Goods Manufactured is calculated as Rs. 967,000. If the Closing Finished Goods are valued at Rs. 120,000, what is the Cost of Goods Sold?",
    options: [
      "A) Rs. 1,127,000",
      "B) Rs. 1,007,000",
      "C) Rs. 967,000",
      "D) Rs. 1,247,000"
    ],
    correctAnswer: "B) Rs. 1,007,000",
    explanation: "Cost of Goods Sold = Opening Finished Goods + Cost of Goods Manufactured - Closing Finished Goods. Calculation: Rs. 160,000 + Rs. 967,000 - Rs. 120,000 = Rs. 1,007,000."
  },

  // Chapter 2: Overheads
  {
    id: "c2q1",
    chapter: 2,
    chapterTitle: "Overheads",
    question: "In cost accounting, which of the following equations correctly defines 'Conversion Costs'?",
    options: [
      "A) Direct Material + Direct Labour",
      "B) Direct Labour + Manufacturing Overheads",
      "C) Prime Cost + Factory Overheads",
      "D) Direct Material + Factory Overheads"
    ],
    correctAnswer: "B) Direct Labour + Manufacturing Overheads",
    explanation: "Manufacturing expenses generally comprise direct materials, direct labour, and production overheads. Material + Labour equals 'Prime Costs', while Labour + Overhead equals 'Conversion Costs' (the cost to convert raw materials into finished goods)."
  },
  {
    id: "c2q2",
    chapter: 2,
    chapterTitle: "Overheads",
    question: "As production volume changes, a specific cost remains constant in total but fluctuates on a per-unit basis. This cost behavior classifies the expense as a:",
    options: [
      "A) Step-fixed cost",
      "B) Semi-variable cost",
      "C) Variable cost",
      "D) Fixed cost"
    ],
    correctAnswer: "D) Fixed cost",
    explanation: "Fixed costs remain constant in total regardless of activity levels. However, because the total cost is spread over an increasing or decreasing number of units, the fixed cost per unit fluctuates (decreases as volume rises)."
  },
  {
    id: "c2q3",
    chapter: 2,
    chapterTitle: "Overheads",
    question: "When apportioning production overheads across different departments, which of the following bases is the most appropriate for distributing 'Factory Rent'?",
    options: [
      "A) Number of employees",
      "B) Equipment cost / Book value of machinery",
      "C) Floor area occupied",
      "D) Direct labour hours"
    ],
    correctAnswer: "C) Floor area occupied",
    explanation: "Overhead apportionment requires a logical basis linking the cost to the department. Factory rent is apportioned based on the physical space (floor area) occupied by each department."
  },
  {
    id: "c2q4",
    chapter: 2,
    chapterTitle: "Overheads",
    question: "The process of distributing the accumulated costs of service departments to the production departments based on the services provided is known as:",
    options: [
      "A) Primary allocation",
      "B) Secondary apportionment (Re-apportionment)",
      "C) Blanket absorption",
      "D) Direct expense tracing"
    ],
    correctAnswer: "B) Secondary apportionment (Re-apportionment)",
    explanation: "The initial distribution of overheads to all departments (production and service) is primary apportionment. The subsequent transfer of service department costs to production departments is termed secondary apportionment or re-apportionment."
  },
  {
    id: "c2q5",
    chapter: 2,
    chapterTitle: "Overheads",
    question: "Which method of overhead re-apportionment fully recognizes the mutual services provided by two service departments to each other by utilizing algebraic formulas?",
    options: [
      "A) Direct Allocation Method",
      "B) Step-down Method",
      "C) Simultaneous Equation Method",
      "D) Repeated Distribution Method"
    ],
    correctAnswer: "C) Simultaneous Equation Method",
    explanation: "When service departments provide services to production departments and also to each other, the simultaneous equation method (or algebraic method) is used to mutually allocate costs before charging them to production."
  },
  {
    id: "c2q6",
    chapter: 2,
    chapterTitle: "Overheads",
    question: "Total factory depreciation for the year is budgeted at Rs. 150,000. The total equipment cost for Department A, B, and C is Rs. 200,000, Rs. 500,000, and Rs. 300,000 respectively. What amount of depreciation should be apportioned to Department B?",
    options: [
      "A) Rs. 30,000",
      "B) Rs. 50,000",
      "C) Rs. 75,000",
      "D) Rs. 150,000"
    ],
    correctAnswer: "C) Rs. 75,000",
    explanation: "Depreciation is apportioned based on the book value or equipment cost of the machines in each department. Total equipment cost = 200k + 500k + 300k = Rs. 1,000,000. Department B's share = (500,000 / 1,000,000) × Rs. 150,000 = Rs. 75,000."
  },
  {
    id: "c2q7",
    chapter: 2,
    chapterTitle: "Overheads",
    question: "When a single overhead absorption rate is calculated for the entire factory by summing all overhead costs and dividing by the total factory base (e.g., total labour hours), regardless of departmental boundaries, this rate is known as a:",
    options: [
      "A) Departmental rate",
      "B) Simultaneous rate",
      "C) Blanket rate",
      "D) Predetermined specific rate"
    ],
    correctAnswer: "C) Blanket rate",
    explanation: "A blanket rate sums up the overhead costs and labour/machine hours of all departments and evenly distributes the overheads factory-wide, ignoring the individual usage intensities of separate departments."
  },
  {
    id: "c2q8",
    chapter: 2,
    chapterTitle: "Overheads",
    question: "A production department has budgeted factory overheads of Rs. 360,000 and expects to work 8,000 direct labour hours. What is the overhead absorption rate (OAR) per direct labour hour?",
    options: [
      "A) Rs. 45.00",
      "B) Rs. 36.00",
      "C) Rs. 40.00",
      "D) Rs. 28.80"
    ],
    correctAnswer: "A) Rs. 45.00",
    explanation: "The Overhead Absorption Rate (OAR) is calculated as Budgeted Factory Overheads divided by Budgeted Base (Direct Labour Hours). Calculation: Rs. 360,000 / 8,000 hours = Rs. 45.00 per hour."
  },
  {
    id: "c2q9",
    chapter: 2,
    chapterTitle: "Overheads",
    question: "A company absorbs overheads at a predetermined rate of Rs. 25 per machine hour. During the period, actual machine hours worked were 4,000 hours and actual factory overheads incurred were Rs. 105,000. What is the under or over-absorbed overhead for the period?",
    options: [
      "A) Rs. 5,000 Over-absorbed",
      "B) Rs. 5,000 Under-absorbed",
      "C) Rs. 100,000 Applied",
      "D) Rs. 15,000 Under-absorbed"
    ],
    correctAnswer: "B) Rs. 5,000 Under-absorbed",
    explanation: "Applied Overheads = Actual Hours × Pre-determined Rate = 4,000 hours × Rs. 25 = Rs. 100,000. Since Actual Overheads (Rs. 105,000) are greater than Applied Overheads (Rs. 100,000), the overheads are Under-absorbed by Rs. 5,000."
  },
  {
    id: "c2q10",
    chapter: 2,
    chapterTitle: "Overheads",
    question: "Service Department X's total costs (x) are Rs. 16,500 plus 20% of Service Department Y's costs. Department Y's total costs (y) are Rs. 10,600 plus 10% of Department X's costs. Which of the following correctly represents the equation setup to find Department X's total costs under the simultaneous equation method?",
    options: [
      "A) x = 16,500 + 0.1(10,600 + 0.2x)",
      "B) x = 16,500 + 0.2(10,600 + 0.1x)",
      "C) y = 10,600 + 0.2(16,500 + 0.1y)",
      "D) x = 16,500 + 10,600"
    ],
    correctAnswer: "B) x = 16,500 + 0.2(10,600 + 0.1x)",
    explanation: "The equations are: x = 16,500 + 0.2y y = 10,600 + 0.1x To solve for x, you substitute 'y' into the first equation: x = 16,500 + 0.2(10,600 + 0.1x)."
  },

  // Chapter 3: Activity Based Costing
  {
    id: "c3q1",
    chapter: 3,
    chapterTitle: "Activity Based Costing",
    question: "Under Activity-Based Costing (ABC), which of the following is the most appropriate cost driver for apportioning \"Materials handling / Materials Management cost\"?",
    options: [
      "A) Number of production runs",
      "B) Machine hours",
      "C) Number of material requisitions or weight/volume of materials consumed",
      "D) Number of customer orders"
    ],
    correctAnswer: "C) Number of material requisitions or weight/volume of materials consumed",
    explanation: "According to the ABC guidelines in the text, material handling and management costs are driven by the frequency of moving materials (number of requisitions) or the physical characteristics of the materials (weight/volume)."
  },
  {
    id: "c3q2",
    chapter: 3,
    chapterTitle: "Activity Based Costing",
    question: "Which of the following best describes the primary difference between Activity-Based Costing (ABC) and traditional overhead absorption?",
    options: [
      "A) ABC uses a single blanket overhead rate based on direct labour hours for the entire factory.",
      "B) ABC assigns overheads to products using multiple cost pools and their specific cost drivers, rather than relying solely on production volume bases.",
      "C) ABC only allocates variable overheads to products and treats fixed overheads as period costs.",
      "D) ABC is only used for non-production administrative overheads."
    ],
    correctAnswer: "B) ABC assigns overheads to products using multiple cost pools and their specific cost drivers, rather than relying solely on production volume bases.",
    explanation: "Traditional costing often uses a single volume-based rate (like labour hours) which can distort product costs. ABC identifies multiple specific activities (cost pools) and assigns costs based on the actual consumption of those activities (cost drivers)."
  },
  {
    id: "c3q3",
    chapter: 3,
    chapterTitle: "Activity Based Costing",
    question: "According to the study text, what is the most appropriate cost driver for allocating \"Quality Control / Quality Inspection cost\"?",
    options: [
      "A) Total number of machine hours",
      "B) Total number of batches",
      "C) Total number of inspection hours or number of quality inspections",
      "D) Total number of orders dispatched"
    ],
    correctAnswer: "C) Total number of inspection hours or number of quality inspections",
    explanation: "The text explicitly links Quality Control / Quality Inspection costs to the \"Total Number of inspection hours\" or \"Number of quality inspections\" as the driving factor."
  },
  {
    id: "c3q4",
    chapter: 3,
    chapterTitle: "Activity Based Costing",
    question: "A manufacturing company incurs a total \"Machining cost pool\" of Rs. 36,000. If the total machine hours utilized during the period are 22,500, what is the ABC overhead absorption rate per cost driver?",
    options: [
      "A) Rs. 1.60 per machine hour",
      "B) Rs. 0.625 per machine hour",
      "C) Rs. 16.00 per machine hour",
      "D) Rs. 1.50 per machine hour"
    ],
    correctAnswer: "A) Rs. 1.60 per machine hour",
    explanation: "The rate per cost driver is calculated by dividing the total cost pool by the total cost driver volume. Rs. 36,000 / 22,500 machine hours = Rs. 1.60 per machine hour."
  },
  {
    id: "c3q5",
    chapter: 3,
    chapterTitle: "Activity Based Costing",
    question: "Which of the following is the correct cost driver to allocate \"Production scheduling cost\"?",
    options: [
      "A) Total number of batches",
      "B) Total number of production runs",
      "C) Total number of orders dispatched",
      "D) Total machine hours"
    ],
    correctAnswer: "B) Total number of production runs",
    explanation: "According to the study text's mapping of activity cost pools to cost drivers, production scheduling costs are driven by the \"Total Number of production runs\"."
  },
  {
    id: "c3q6",
    chapter: 3,
    chapterTitle: "Activity Based Costing",
    question: "Giga Incorporations incurs a total \"Paint stirring and quality control\" overhead of Rs. 50,000. This cost is driven by the number of batches. Product G-101 requires 10 batches, Product G-102 requires 8 batches, and Product G-103 requires 6 batches. How much of this overhead should be allocated to Product G-101?",
    options: [
      "A) Rs. 16,667",
      "B) Rs. 12,500",
      "C) Rs. 20,833",
      "D) Rs. 50,000"
    ],
    correctAnswer: "C) Rs. 20,833",
    explanation: "Total batches = 10 + 8 + 6 = 24 batches. Product G-101's share of the batches is 10/24. Allocation = (10 / 24) × Rs. 50,000 = Rs. 20,833."
  },
  {
    id: "c3q7",
    chapter: 3,
    chapterTitle: "Activity Based Costing",
    question: "Continuing from the previous scenario, if Product G-101 is allocated Rs. 20,833 for paint stirring and the company produces exactly 500 units of G-101, what is the unit cost for this specific activity?",
    options: [
      "A) Rs. 20.83",
      "B) Rs. 41.67",
      "C) Rs. 83.33",
      "D) Rs. 52.08"
    ],
    correctAnswer: "B) Rs. 41.67",
    explanation: "The unit cost is calculated by dividing the total activity cost allocated to the product by the number of units produced. Rs. 20,833 / 500 units = Rs. 41.666 (rounded to Rs. 41.67)."
  },
  {
    id: "c3q8",
    chapter: 3,
    chapterTitle: "Activity Based Costing",
    question: "When applying Activity-Based Costing, which cost driver should logically be used to assign \"Machine set-up costs\" to various products?",
    options: [
      "A) Number of machine hours",
      "B) Number of direct labour hours",
      "C) Number of units produced",
      "D) Total number of batches or set-ups"
    ],
    correctAnswer: "D) Total number of batches or set-ups",
    explanation: "Machine set-up costs are incurred every time a machine is prepared for a new batch of production, regardless of how many units are in that batch. Therefore, the \"Total number of batches\" or \"set-ups\" is the correct driver."
  },
  {
    id: "c3q9",
    chapter: 3,
    chapterTitle: "Activity Based Costing",
    question: "A factory has total set-up costs of Rs. 24,000. The factory manufactures three products: X, Y, and Z. The number of set-ups required during the period were 20 for Product X, 40 for Product Y, and 20 for Product Z. What amount of set-up cost should be charged to Product Y?",
    options: [
      "A) Rs. 6,000",
      "B) Rs. 12,000",
      "C) Rs. 8,000",
      "D) Rs. 24,000"
    ],
    correctAnswer: "B) Rs. 12,000",
    explanation: "Total number of set-ups for the factory = 20 + 40 + 20 = 80 set-ups. Product Y requires 40 set-ups. Product Y's allocation = (40 / 80) × Rs. 24,000 = Rs. 12,000."
  },
  {
    id: "c3q10",
    chapter: 3,
    chapterTitle: "Activity Based Costing",
    question: "What is the recommended cost driver for assigning \"Ordering costs\"?",
    options: [
      "A) Total number of customer's orders",
      "B) Total number of orders dispatched",
      "C) Total number of production runs",
      "D) Weight or volume of materials consumed"
    ],
    correctAnswer: "A) Total number of customer's orders",
    explanation: "Based on the cost driver table in the study text, ordering costs are strictly driven by the \"Total Number of customer's orders\"."
  },
  // Chapter 4: Labour Costing
  {
    id: "c4q1",
    chapter: 4,
    chapterTitle: "Labour Costing",
    question: "How is \"indirect labour\" defined and classified in cost accounting?",
    options: [
      "A) Labour that can be readily charged to a specific cost unit and is part of prime cost.",
      "B) Labour that cannot be readily charged to a specific cost unit and is treated as part of factory overheads.",
      "C) Administrative staff salaries that are charged directly to the cost of goods sold.",
      "D) Overtime premium paid to direct workers specifically requested by a customer."
    ],
    correctAnswer: "B) Labour that cannot be readily charged to a specific cost unit and is treated as part of factory overheads.",
    explanation: "The study text defines indirect labour as cost that cannot be readily charged to or recognized with any cost unit or specific job. Therefore, it is treated as part of the factory (production) overheads."
  },
  {
    id: "c4q2",
    chapter: 4,
    chapterTitle: "Labour Costing",
    question: "A worker takes 30 minutes to produce one unit of a product. In an 8-hour shift, the worker produces 20 units. What is the worker's labour efficiency ratio?",
    options: [
      "A) 80%",
      "B) 125%",
      "C) 120%",
      "D) 110.5%"
    ],
    correctAnswer: "B) 125%",
    explanation: "Labour Efficiency = (Standard hours / Actual hours) × 100. Time Allowed (Standard hours) = 30 minutes / 60 minutes × 20 units = 10 hours. Actual hours taken = 8 hours. Efficiency = (10 hours / 8 hours) × 100 = 125%."
  },
  {
    id: "c4q3",
    chapter: 4,
    chapterTitle: "Labour Costing",
    question: "Which of the following best distinguishes \"Labour Productivity\" from \"Labour Efficiency\"?",
    options: [
      "A) Productivity focuses on minimizing waste, while efficiency focuses on maximizing sales.",
      "B) Productivity emphasizes the utilization of labour hours, while efficiency emphasizes the volume of output.",
      "C) Productivity focuses on the quantity or volume of output produced, while efficiency focuses on the utilization of resources within a given time frame.",
      "D) There is no difference; the two terms are entirely interchangeable in cost accounting."
    ],
    correctAnswer: "C) Productivity focuses on the quantity or volume of output produced, while efficiency focuses on the utilization of resources within a given time frame.",
    explanation: "According to the detailed differentiation in the text, productivity emphasizes the quantity/volume of output produced in relation to labour input, whereas efficiency measures how effectively/efficiently workers utilize time to generate a given quantity."
  },
  {
    id: "c4q4",
    chapter: 4,
    chapterTitle: "Labour Costing",
    question: "Under a \"High day-rate system\" of wage incentives, how is the employee rewarded?",
    options: [
      "A) The employee receives a fixed percentage of the company's monthly profit.",
      "B) The target to qualify for a bonus is set in terms of units, but the bonus is awarded as a higher hourly time rate.",
      "C) The employee is paid strictly on a piece-rate basis with no guaranteed minimum wage.",
      "D) The employee receives a bonus equivalent to 50% of the time saved on a job."
    ],
    correctAnswer: "B) The target to qualify for a bonus is set in terms of units, but the bonus is awarded as a higher hourly time rate.",
    explanation: "Under a high day-rate system, employees get paid at a higher than average hourly rate provided they produce a given amount. The target is set in units, whereas the reward (bonus) is given in terms of an increased time rate."
  },
  {
    id: "c4q5",
    chapter: 4,
    chapterTitle: "Labour Costing",
    question: "A factory standard assumes a worker will produce 20 units per hour. The standard wage rate is Rs. 30 per hour. During an 8-hour shift, a worker produces 180 units. If the company operates a premium bonus plan where the worker receives 50% of the time saved, what are the total earnings of the worker for that day?",
    options: [
      "A) Rs. 240",
      "B) Rs. 270",
      "C) Rs. 255",
      "D) Rs. 300"
    ],
    correctAnswer: "C) Rs. 255",
    explanation: "Standard units for 8 hours = 8 × 20 = 160 units. Actual units produced = 180 units. Extra units = 180 - 160 = 20 units. Time saved = 20 units / 20 units per hour = 1 hour saved. Basic Pay = 8 hours × Rs. 30 = Rs. 240. Bonus = 50% × 1 hour saved × Rs. 30 = Rs. 15. Total Earnings = 240 + 15 = Rs. 255."
  },
  {
    id: "c4q6",
    chapter: 4,
    chapterTitle: "Labour Costing",
    question: "Under Variant 2 of the Guaranteed Minimum Wage plan, an employee receives a basic guaranteed wage for standard output, plus:",
    options: [
      "A) A variable piece-rate for all units produced during the period.",
      "B) A variable piece-rate strictly for the extra units produced above the standard output.",
      "C) An overtime premium for working unsocial hours.",
      "D) A high day-rate applied to all hours worked in the week."
    ],
    correctAnswer: "B) A variable piece-rate strictly for the extra units produced above the standard output.",
    explanation: "Under Variant 2 of the Guaranteed Minimum Wage scheme, the employee gets a guaranteed minimum basic wage for standard output and earns an additional piece-rate amount strictly for the extra units produced above the threshold."
  },
  {
    id: "c4q7",
    chapter: 4,
    chapterTitle: "Labour Costing",
    question: "According to the Learning Curve theory, what happens when the cumulative output or production doubles?",
    options: [
      "A) The total time required to produce the batch is reduced by exactly half.",
      "B) The cumulative average time per unit is reduced by a constant percentage.",
      "C) The incremental time required for the next unit increases at a constant percentage.",
      "D) The variable overhead cost per unit is reduced to zero."
    ],
    correctAnswer: "B) The cumulative average time per unit is reduced by a constant percentage.",
    explanation: "The core assumption of the learning curve theory is that every time cumulative output doubles, the cumulative average time per unit falls to a constant percentage of the previous cumulative average time."
  },
  {
    id: "c4q8",
    chapter: 4,
    chapterTitle: "Labour Costing",
    question: "If the first unit of output requires 100 hours to manufacture and an 80% learning curve effect applies, what is the total time required to produce the first 4 units?",
    options: [
      "A) 320 hours",
      "B) 256 hours",
      "C) 64 hours",
      "D) 80 hours"
    ],
    correctAnswer: "B) 256 hours",
    explanation: "1 unit = 100 hours cumulative average time. 2 units = 100 × 80% = 80 hours cumulative average time. 4 units (doubling again) = 80 × 80% = 64 hours cumulative average time. Total time for 4 units = 4 units × 64 hours = 256 hours."
  },
  {
    id: "c4q9",
    chapter: 4,
    chapterTitle: "Labour Costing",
    question: "In the learning curve formula Y=ax^b, what does the variable \"x\" represent?",
    options: [
      "A) The learning curve factor (or index)",
      "B) The cumulative average time per unit",
      "C) The time taken for the first unit of output",
      "D) The cumulative number of units produced"
    ],
    correctAnswer: "D) The cumulative number of units produced",
    explanation: "In the algebraic formula Y=ax^b , 'Y' is cumulative average time, 'a' is time for the first unit, 'b' is the learning curve index, and 'x' is the cumulative number of units produced."
  },
  {
    id: "c4q10",
    chapter: 4,
    chapterTitle: "Labour Costing",
    question: "When an entity operates an integrated accounting system, what is the correct journal entry to allocate direct labour costs to the production process?",
    options: [
      "A) Debit: Salaries & Wages Control / Credit: Work in Process Control",
      "B) Debit: Production Overhead Control / Credit: Salaries & Wages Control",
      "C) Debit: Work in Process Control / Credit: Salaries & Wages Control",
      "D) Debit: Cash / Credit: Accrued Salaries & Wages"
    ],
    correctAnswer: "C) Debit: Work in Process Control / Credit: Salaries & Wages Control",
    explanation: "When transferring direct labour costs to production, the cost is charged to Work in Progress. The journal entry is to Debit the Work in Process Control account and Credit the Salaries & Wages Control account."
  },

  // Chapter 5: Cost Flow in Production
  {
    id: "c5q1",
    chapter: 5,
    chapterTitle: "Cost Flow in Production",
    question: "According to the study text, what is the fundamental definition of \"Accounting\"?",
    options: [
      "A) The physical tracking and valuation of a company's raw material inventory.",
      "B) A process strictly limited to calculating the tax liability and statutory obligations of an organization.",
      "C) A systematic process of identifying, recording, measuring, classifying, verifying, summarizing, interpreting and communicating financial information to provide insights into an organisation's financial performance.",
      "D) The mathematical method of calculating economic order quantities and safety stocks."
    ],
    correctAnswer: "C) A systematic process of identifying, recording, measuring, classifying, verifying, summarizing, interpreting and communicating financial information to provide insights into an organisation's financial performance.",
    explanation: "The study text explicitly defines accounting as a systematic process of identifying, recording, measuring, classifying, verifying, summarizing, interpreting and communicating financial information to provide insights into an organisation's financial performance and position for various stakeholders."
  },
  {
    id: "c5q2",
    chapter: 5,
    chapterTitle: "Cost Flow in Production",
    question: "In an accounting system where a business maintains separate records that are kept in agreement or are readily reconcilable, which ledger is maintained by the head office specifically to generate external reports?",
    options: [
      "A) The Cost Ledger",
      "B) The General Ledger",
      "C) The Factory Ledger",
      "D) The Work-in-Process Ledger"
    ],
    correctAnswer: "B) The General Ledger",
    explanation: "Under a system where records are kept separate, it is convenient to think of the business split into two entities. The head office maintains the general ledger, which is used to generate external financial reports."
  },
  {
    id: "c5q3",
    chapter: 5,
    chapterTitle: "Cost Flow in Production",
    question: "When a business operates with a separate general ledger at the head office and a separate cost ledger at the factory, this system of cost bookkeeping is known as:",
    options: [
      "A) An Integrated Accounting System",
      "B) A Single-entry System",
      "C) An Interlocking Accounting System",
      "D) A Just-in-Time System"
    ],
    correctAnswer: "C) An Interlocking Accounting System",
    explanation: "A system that maintains separate records (a general ledger at head office for financial accounting and a cost/factory ledger at the factory for management accounting) which are kept in agreement or reconciled is known as an Interlocking Accounting system."
  },
  {
    id: "c5q4",
    chapter: 5,
    chapterTitle: "Cost Flow in Production",
    question: "Based on the cost flow of production, what is the initial journal entry to record the payment of wages to factory workers before the costs are allocated to production?",
    options: [
      "A) Debit: Work in Process Control / Credit: Cash",
      "B) Debit: Production Overheads Control / Credit: Cash",
      "C) Debit: Salaries & Wages Control / Credit: Cash",
      "D) Debit: Cost of Sales / Credit: Salaries & Wages Control"
    ],
    correctAnswer: "C) Debit: Salaries & Wages Control / Credit: Cash",
    explanation: "When wages are initially paid, the cost is captured in a control account. The entry is to Debit the Salaries & Wages Control account and Credit Cash/Bank."
  },
  {
    id: "c5q5",
    chapter: 5,
    chapterTitle: "Cost Flow in Production",
    question: "A factory incurs a total payroll cost of Rs. 96,000. Out of this, Rs. 90,000 relates to direct labour working directly on the products, and Rs. 6,000 relates to indirect labour (e.g., factory supervisors). What is the correct journal entry to allocate these costs into the production flow?",
    options: [
      "A) Debit: Work in Process Control 96,000 / Credit: Salaries & Wages Control 96,000",
      "B) Debit: Work in Process Control 90,000, Debit: Production Overheads Control 6,000 / Credit: Salaries & Wages Control 96,000",
      "C) Debit: Salaries & Wages Control 96,000 / Credit: Work in Process Control 90,000, Credit: Production Overheads Control 6,000",
      "D) Debit: Production Overheads Control 96,000 / Credit: Cash 96,000"
    ],
    correctAnswer: "B) Debit: Work in Process Control 90,000, Debit: Production Overheads Control 6,000 / Credit: Salaries & Wages Control 96,000",
    explanation: "Direct labour costs (Rs. 90,000) are charged directly to production (WIP Control). Indirect labour costs (Rs. 6,000) cannot be traced to specific units and are therefore charged to the Production Overheads Control account. The total is credited out of the Salaries & Wages Control account."
  },
  {
    id: "c5q6",
    chapter: 5,
    chapterTitle: "Cost Flow in Production",
    question: "When direct raw materials are issued from the warehouse to the factory floor for manufacturing a specific product, which account is debited in the cost ledger?",
    options: [
      "A) Cost of Sales Account",
      "B) Production Overheads Control Account",
      "C) Finished Goods Control Account",
      "D) Work in Process (WIP) Control Account"
    ],
    correctAnswer: "D) Work in Process (WIP) Control Account",
    explanation: "Direct materials issued to the factory floor become part of the ongoing production process. Therefore, their cost is debited to the Work in Process (WIP) Control account."
  },
  {
    id: "c5q7",
    chapter: 5,
    chapterTitle: "Cost Flow in Production",
    question: "If raw materials are issued from the store but are to be used as general factory supplies (indirect materials) rather than for a specific product, which account should be debited?",
    options: [
      "A) Work in Process (WIP) Control",
      "B) Production Overheads Control",
      "C) Administrative Overheads Control",
      "D) Cost of Goods Sold"
    ],
    correctAnswer: "B) Production Overheads Control",
    explanation: "Indirect materials (like lubricants or cleaning supplies) cannot be traced directly to a specific product. Therefore, when they are issued from the store, they are debited to the Production Overheads Control account instead of WIP."
  },
  {
    id: "c5q8",
    chapter: 5,
    chapterTitle: "Cost Flow in Production",
    question: "When factory overheads are applied (absorbed) into the cost of production based on a predetermined overhead absorption rate, what is the corresponding double entry?",
    options: [
      "A) Debit: Work in Process (WIP) Control / Credit: Production Overheads Control",
      "B) Debit: Production Overheads Control / Credit: Work in Process (WIP) Control",
      "C) Debit: Finished Goods Control / Credit: Production Overheads Control",
      "D) Debit: Cost of Sales / Credit: Production Overheads Control"
    ],
    correctAnswer: "A) Debit: Work in Process (WIP) Control / Credit: Production Overheads Control",
    explanation: "Absorbed factory overheads are added to the cost of production. The entry transfers the cost out of the Production Overheads pool (Credit) and charges it to the active production account (Debit WIP Control)."
  },
  {
    id: "c5q9",
    chapter: 5,
    chapterTitle: "Cost Flow in Production",
    question: "When the production of a batch of goods is fully completed on the factory floor, the total cost of these completed units must be transferred out of the production account. What is the correct journal entry for this transfer?",
    options: [
      "A) Debit: Cost of Sales / Credit: Finished Goods Control",
      "B) Debit: Work in Process (WIP) Control / Credit: Finished Goods Control",
      "C) Debit: Finished Goods Control / Credit: Work in Process (WIP) Control",
      "D) Debit: Sales / Credit: Work in Process (WIP) Control"
    ],
    correctAnswer: "C) Debit: Finished Goods Control / Credit: Work in Process (WIP) Control",
    explanation: "When goods are finished, they physically move from the factory floor to the finished goods warehouse. In accounting, this is reflected by transferring the accumulated cost out of WIP Control (Credit) and into the Finished Goods Control inventory account (Debit)."
  },
  {
    id: "c5q10",
    chapter: 5,
    chapterTitle: "Cost Flow in Production",
    question: "In an interlocking accounting system, the cost ledger does not maintain cash or bank accounts. Therefore, whenever a financial transaction occurs (like purchasing raw materials on credit), which account is used in the cost ledger to complete the double entry?",
    options: [
      "A) Cost of Sales Account",
      "B) General Ledger Adjustment Account (or Cost Ledger Control Account)",
      "C) Suspense Account",
      "D) Payables Control Account"
    ],
    correctAnswer: "B) General Ledger Adjustment Account (or Cost Ledger Control Account)",
    explanation: "In an interlocking system, the cost ledger only tracks cost flows (materials, labour, overheads). It does not have personal accounts (debtors/creditors) or real accounts (cash/bank). To make the cost ledger self-balancing when an external financial transaction occurs, a \"General Ledger Adjustment Account\" is used to complete the double entry."
  },

  // Chapter 6: Job and Service Costing
  {
    id: "c6q1",
    chapter: 6,
    chapterTitle: "Job and Service Costing",
    question: "Which of the following situations is the most appropriate for applying \"Job Costing\"?",
    options: [
      "A) A company producing identical units of sugar continuously through a standardized chemical process.",
      "B) A business entity carrying out separate tasks or contracts to meet specific customer orders and requirements.",
      "C) A company producing joint products and by-products from a single raw material input.",
      "D) A factory mass-producing thousands of identical plastic bottles for inventory."
    ],
    correctAnswer: "B) A business entity carrying out separate tasks or contracts to meet specific customer orders and requirements.",
    explanation: "According to the text, job costing is a basic cost accounting method applicable where work consists of separate contracts, jobs, or batches, and where each job is carried out to the customer's specific instructions or requirements."
  },
  {
    id: "c6q2",
    chapter: 6,
    chapterTitle: "Job and Service Costing",
    question: "How should the cost of \"rectification work\" (correcting sub-standard work) be treated in a job costing system if the occurrence is frequent and considered a normal part of the manufacturing process?",
    options: [
      "A) It should be charged directly to the specific job as a direct expense.",
      "B) It should be charged entirely to the administrative overheads.",
      "C) It should be treated as a general production overhead.",
      "D) It should be deducted from the sales revenue of the specific job."
    ],
    correctAnswer: "C) It should be treated as a general production overhead.",
    explanation: "The text states that rectification work is treated as a production overhead if it is regarded as a normal part of the work and is of a recurring nature. It is only charged as a direct cost if it is infrequent and directly attributable to a specific job."
  },
  {
    id: "c6q3",
    chapter: 6,
    chapterTitle: "Job and Service Costing",
    question: "What is the primary purpose of a \"Job Order Cost Sheet\" (or Job Cost Card)?",
    options: [
      "A) To act as a purchase requisition for buying raw materials for the factory.",
      "B) To record the daily attendance and standard wage rate of all factory workers.",
      "C) To record all manufacturing costs (direct and indirect) and absorbed non-manufacturing costs for a specific job.",
      "D) To strictly record only the prime costs associated with a customer's order."
    ],
    correctAnswer: "C) To record all manufacturing costs (direct and indirect) and absorbed non-manufacturing costs for a specific job.",
    explanation: "A job order cost sheet or card is a form prepared for a job that records all manufacturing costs (both direct and indirect) and also non-manufacturing costs absorbed to that specific job."
  },
  {
    id: "c6q4",
    chapter: 6,
    chapterTitle: "Job and Service Costing",
    question: "In a job costing system, what is the correct double entry to record the issuance of direct materials from the store to a specific job (e.g., Job 123)?",
    options: [
      "A) Debit: Materials Control / Credit: Work in Process - Job 123",
      "B) Debit: Production Overhead Control / Credit: Materials Control",
      "C) Debit: Cost of Sales / Credit: Materials Control",
      "D) Debit: Work in Process - Job 123 / Credit: Materials Control"
    ],
    correctAnswer: "D) Debit: Work in Process - Job 123 / Credit: Materials Control",
    explanation: "When direct materials are issued to a specific job, their cost becomes part of the active production for that job. Therefore, the WIP account for the specific job is debited, and the Materials Control account is credited."
  },
  {
    id: "c6q5",
    chapter: 6,
    chapterTitle: "Job and Service Costing",
    question: "If materials are issued from the store to be used as general maintenance supplies on the factory floor (indirect materials) rather than for a specific job, what is the correct journal entry?",
    options: [
      "A) Debit: Production Overhead Control / Credit: Materials Control",
      "B) Debit: Work in Process - Job 123 / Credit: Materials Control",
      "C) Debit: Materials Control / Credit: Accounts Payable",
      "D) Debit: Administrative Overheads / Credit: Materials Control"
    ],
    correctAnswer: "A) Debit: Production Overhead Control / Credit: Materials Control",
    explanation: "Indirect materials cannot be traced to a specific job. Therefore, when they are issued, they are debited to the Production Overhead Control account instead of the WIP account."
  },
  {
    id: "c6q6",
    chapter: 6,
    chapterTitle: "Job and Service Costing",
    question: "When production overheads are absorbed into the cost of a specific job based on a predetermined rate, which account is credited?",
    options: [
      "A) Finished Goods Control Account",
      "B) Work in Process Control Account",
      "C) Production Overhead Control Account",
      "D) General Ledger Adjustment Account"
    ],
    correctAnswer: "C) Production Overhead Control Account",
    explanation: "To absorb overheads into a job, the entry transfers the cost out of the overhead pool and into production. The correct entry is Debit: Work in process (Job XYZ) and Credit: Production overhead control."
  },
  {
    id: "c6q7",
    chapter: 6,
    chapterTitle: "Job and Service Costing",
    question: "A specific job (Job 453) incurs direct materials of Rs. 10,000, direct labour of Rs. 6,000, and direct expenses of Rs. 4,000. Production overheads are charged at 150% of direct labour cost. What is the total production cost of the job?",
    options: [
      "A) Rs. 20,000",
      "B) Rs. 29,000",
      "C) Rs. 26,000",
      "D) Rs. 35,000"
    ],
    correctAnswer: "B) Rs. 29,000",
    explanation: "Prime Cost = Direct Materials (10,000) + Direct Labour (6,000) + Direct Expenses (4,000) = Rs. 20,000. Absorbed Overheads = 150% of Direct Labour (6,000) = Rs. 9,000. Total Production Cost = Prime Cost (20,000) + Absorbed Overheads (9,000) = Rs. 29,000."
  },
  {
    id: "c6q8",
    chapter: 6,
    chapterTitle: "Job and Service Costing",
    question: "When a job is completed and the goods are transferred to the finished goods warehouse awaiting the customer's disposition, what is the correct journal entry?",
    options: [
      "A) Debit: Cost of Sales / Credit: Work in Process",
      "B) Debit: Accounts Receivable / Credit: Sales",
      "C) Debit: Finished Goods / Credit: Work in Process",
      "D) Debit: Work in Process / Credit: Finished Goods"
    ],
    correctAnswer: "C) Debit: Finished Goods / Credit: Work in Process",
    explanation: "When a job is completed and sent to the finished goods store before delivery, the cost is transferred out of the production account into inventory. The entry is to Debit: Finished Goods and Credit: Work in process."
  },
  {
    id: "c6q9",
    chapter: 6,
    chapterTitle: "Job and Service Costing",
    question: "Which of the following is a specific defining characteristic of \"Service Costing\" compared to traditional product costing?",
    options: [
      "A) The cost of direct materials consumed is usually the largest component of total cost.",
      "B) The output is tangible and can be easily stored for future sale.",
      "C) The output is often intangible, and services are characterized by simultaneity, perishability, and heterogeneity.",
      "D) Service costing strictly relies on standard costing variances for billing customers."
    ],
    correctAnswer: "C) The output is often intangible, and services are characterized by simultaneity, perishability, and heterogeneity.",
    explanation: "The study text explicitly notes that service organizations do not make or sell tangible goods, and specific characteristics of services include intangibility, simultaneity, perishability, and heterogeneity. Furthermore, direct materials are usually a relatively small component of the cost."
  },
  {
    id: "c6q10",
    chapter: 6,
    chapterTitle: "Job and Service Costing",
    question: "A hotel operates 80 standard twin-bedded rooms and is fully occupied for 350 days a year. The total running costs for the year are Rs. 3,360,000. Which of the following would be the most appropriate and useful composite cost unit for this service business?",
    options: [
      "A) Cost per guest",
      "B) Cost per meal served",
      "C) Cost per room/day",
      "D) Cost per square foot of hotel space"
    ],
    correctAnswer: "C) Cost per room/day",
    explanation: "In service costing, finding a logical unit cost is challenging. For a hotel, the text provides the example that the most useful composite measure of the cost of providing the service is the \"cost per room/day\"."
  },

  // Chapter 7: Process Costing
  {
    id: "c7q1",
    chapter: 7,
    chapterTitle: "Process Costing",
    question: "Process costing is most appropriate for which of the following types of manufacturing environments?",
    options: [
      "A) A business carrying out separate, unique contracts for specific customers.",
      "B) A continuous production environment where the output of one process becomes the input of the next process until the product is fully completed.",
      "C) A business that only provides intangible services.",
      "D) A factory that builds customized luxury yachts."
    ],
    correctAnswer: "B) A continuous production environment where the output of one process becomes the input of the next process until the product is fully completed.",
    explanation: "Process costing is used where production is a continuous process; the output of one process becomes the input to the next until a finished product is fully completed."
  },
  {
    id: "c7q2",
    chapter: 7,
    chapterTitle: "Process Costing",
    question: "How is the scrap value of a \"Normal Loss\" treated when calculating the cost per equivalent unit of good output?",
    options: [
      "A) It is ignored completely to ensure conservative inventory valuation.",
      "B) It is added to the total process costs before dividing by the expected output.",
      "C) It is deducted from the total process costs before dividing by the expected units of output.",
      "D) It is credited directly to the Statement of Profit or Loss as other income."
    ],
    correctAnswer: "C) It is deducted from the total process costs before dividing by the expected units of output.",
    explanation: "The formula for the cost of good output requires that the expected scrap value of the normal loss is deducted from the total process costs before dividing by the expected output."
  },
  {
    id: "c7q3",
    chapter: 7,
    chapterTitle: "Process Costing",
    question: "Which of the following is the correct formula for calculating the per unit cost of good output in a process with normal loss and scrap recovery?",
    options: [
      "A) Total process costs / Actual units of output",
      "B) (Total process costs − Scrap value of normal loss) / Expected units of output",
      "C) (Total process costs + Scrap value of normal loss) / Total input units",
      "D) Total process costs / (Total input units - Actual loss)"
    ],
    correctAnswer: "B) (Total process costs − Scrap value of normal loss) / Expected units of output",
    explanation: "The study text explicitly states the formula for the per-unit cost of good output is: Total process costs − Scrap value of the normal loss, divided by the Expected units of output."
  },
  {
    id: "c7q4",
    chapter: 7,
    chapterTitle: "Process Costing",
    question: "A production process has an input of 2,000 litres. The normal loss is estimated at 10% of the input. If the actual good output is 1,700 litres, what is the abnormal loss or gain?",
    options: [
      "A) 300 litres Abnormal Loss",
      "B) 100 litres Abnormal Gain",
      "C) 100 litres Abnormal Loss",
      "D) 200 litres Normal Loss"
    ],
    correctAnswer: "C) 100 litres Abnormal Loss",
    explanation: "Input = 2,000 litres. Normal loss = 10% of 2,000 = 200 litres. Expected output = 1,800 litres. Since actual output is 1,700 litres, the difference between expected output (1,800) and actual output (1,700) is a 100-litre Abnormal Loss."
  },
  {
    id: "c7q5",
    chapter: 7,
    chapterTitle: "Process Costing",
    question: "At what value is an \"Abnormal Loss\" or \"Abnormal Gain\" recorded in the main process account?",
    options: [
      "A) At the estimated scrap value of the units.",
      "B) At the same calculated cost per equivalent unit as the normal good output.",
      "C) At the cost of direct materials only.",
      "D) At zero value, as it is written off directly to the profit and loss account."
    ],
    correctAnswer: "B) At the same calculated cost per equivalent unit as the normal good output.",
    explanation: "Abnormal losses and gains are valued at the same cost per unit as the finished good output produced during the period."
  },
  {
    id: "c7q6",
    chapter: 7,
    chapterTitle: "Process Costing",
    question: "If the actual loss in a manufacturing process is less than the expected normal loss, the resulting difference is known as:",
    options: [
      "A) Normal gain",
      "B) Equivalent unit surplus",
      "C) Abnormal gain",
      "D) Standard yield variance"
    ],
    correctAnswer: "C) Abnormal gain",
    explanation: "An abnormal gain arises when the actual loss in a process is less than the expected normal loss, resulting in more good output than anticipated."
  },
  {
    id: "c7q7",
    chapter: 7,
    chapterTitle: "Process Costing",
    question: "Under the First-In-First-Out (FIFO) method of process costing, how are the equivalent units for opening Work-in-Progress (WIP) calculated for the current period?",
    options: [
      "A) By taking 100% of the opening WIP units regardless of their completion stage.",
      "B) By taking the total units of opening WIP multiplied by the percentage of work already done in the previous period.",
      "C) By taking the total units of opening WIP multiplied by the percentage of work required to finish them in the current period.",
      "D) Opening WIP is completely ignored in the FIFO equivalent units schedule."
    ],
    correctAnswer: "C) By taking the total units of opening WIP multiplied by the percentage of work required to finish them in the current period.",
    explanation: "Under the FIFO method, the cost valuation distinguishes between items started in the previous period and finished in the current period. The equivalent units for opening WIP only account for the work needed to finish the units in the current period."
  },
  {
    id: "c7q8",
    chapter: 7,
    chapterTitle: "Process Costing",
    question: "When applying the Weighted Average method of process costing, how is the cost per equivalent unit calculated?",
    options: [
      "A) By dividing only the current period's costs by the current period's equivalent units.",
      "B) By adding the cost of opening WIP to the current period costs, and dividing this total by the weighted average equivalent units.",
      "C) By separating the cost of opening WIP from current costs and calculating two different rates.",
      "D) By deducting the scrap value of abnormal loss from the opening WIP costs."
    ],
    correctAnswer: "B) By adding the cost of opening WIP to the current period costs, and dividing this total by the weighted average equivalent units.",
    explanation: "The weighted average method merges the cost of the opening WIP with the costs added during the current period, establishing a single average cost per equivalent unit for the period."
  },
  {
    id: "c7q9",
    chapter: 7,
    chapterTitle: "Process Costing",
    question: "In a continuous process where direct materials are added completely at the very beginning of the process, what is the degree of completion for materials in the closing Work-in-Progress (WIP)?",
    options: [
      "A) 0%",
      "B) 50%",
      "C) 100%",
      "D) It depends on the conversion completion percentage."
    ],
    correctAnswer: "C) 100%",
    explanation: "If materials are added entirely at the beginning of the process (as is common in the first process), all units in closing WIP are 100% complete with respect to direct materials, even if conversion is only partially complete."
  },
  {
    id: "c7q10",
    chapter: 7,
    chapterTitle: "Process Costing",
    question: "How is the cost of finished goods calculated to be transferred out of a process account?",
    options: [
      "A) Total equivalent units transferred out multiplied by the total cost per equivalent unit.",
      "B) Total physical input units multiplied by the material cost per unit.",
      "C) The sum of direct materials and direct labour only.",
      "D) Total process costs minus the cost of opening WIP."
    ],
    correctAnswer: "A) Total equivalent units transferred out multiplied by the total cost per equivalent unit.",
    explanation: "The cost assigned to units transferred to finished goods (or the next process) is calculated by taking the number of fully completed units transferred out and multiplying them by the total cost per equivalent unit (material + conversion)."
  },
  // Chapter 8: Joint and By-Product Costing
  {
    id: "c8q1",
    chapter: 8,
    chapterTitle: "Joint and By-Product Costing",
    question: "In a manufacturing process where multiple products are produced from a single raw material, what is the term used to describe the exact stage in the production process where the individual products become separately identifiable?",
    options: [
      "A) The break-even point",
      "B) The split-off point",
      "C) The margin of safety",
      "D) The further processing point"
    ],
    correctAnswer: "B) The split-off point",
    explanation: "The split-off point is defined as the exact stage in the manufacturing process where the joint products and by-products can be individually identified and separated from one another."
  },
  {
    id: "c8q2",
    chapter: 8,
    chapterTitle: "Joint and By-Product Costing",
    question: "Which of the following is the primary distinguishing factor between a \"Joint Product\" and a \"By-Product\"?",
    options: [
      "A) Joint products require further processing, while by-products are always sold at the split-off point.",
      "B) Joint products are produced intentionally, while by-products are produced entirely by accident.",
      "C) Joint products have a relatively high sales value compared to each other, while a by-product has a relatively minor sales value compared to the main products.",
      "D) Joint products incur joint costs, whereas by-products only incur separate further processing costs."
    ],
    correctAnswer: "C) Joint products have a relatively high sales value compared to each other, while a by-product has a relatively minor sales value compared to the main products.",
    explanation: "The primary distinction between joint products and by-products is their relative sales value. Joint products are the main objectives of the process with significant sales value, whereas by-products are incidental outputs with a relatively minor sales value."
  },
  {
    id: "c8q3",
    chapter: 8,
    chapterTitle: "Joint and By-Product Costing",
    question: "When a by-product is generated in a joint process and it has a measurable net realizable value (NRV), what is the most common accounting treatment for this NRV?",
    options: [
      "A) It is added to the total joint production costs before allocation.",
      "B) It is credited directly to the Statement of Profit or Loss as \"Other Income\" without affecting production costs.",
      "C) It is deducted from the total joint manufacturing costs before those costs are allocated to the main joint products.",
      "D) It is allocated proportionately to the joint products based on their physical weights."
    ],
    correctAnswer: "C) It is deducted from the total joint manufacturing costs before those costs are allocated to the main joint products.",
    explanation: "The standard accounting treatment for a by-product with a measurable sales value is to deduct its Net Realisable Value (NRV) from the total joint costs of the process. The remaining net joint costs are then allocated to the main joint products."
  },
  {
    id: "c8q4",
    chapter: 8,
    chapterTitle: "Joint and By-Product Costing",
    question: "Which of the following is NOT a recognized method for allocating joint costs to joint products at the split-off point?",
    options: [
      "A) Physical measurement (units, weight, or volume) basis",
      "B) Sales value at split-off point basis",
      "C) Net Realisable Value (NRV) basis",
      "D) First-In-First-Out (FIFO) equivalent units basis"
    ],
    correctAnswer: "D) First-In-First-Out (FIFO) equivalent units basis",
    explanation: "FIFO equivalent units is a method used in Process Costing to value Work-in-Progress (WIP), not a method for allocating joint costs. Joint costs are apportioned using physical measurement, sales value at split-off, or the NRV method."
  },
  {
    id: "c8q5",
    chapter: 8,
    chapterTitle: "Joint and By-Product Costing",
    question: "A company is deciding whether to sell a joint product at the split-off point or to process it further. In making this decision, how should the joint costs incurred before the split-off point be treated?",
    options: [
      "A) They should be treated as relevant incremental costs.",
      "B) They should be treated as sunk costs and ignored in the decision.",
      "C) They should be allocated strictly based on the final sales value after further processing.",
      "D) They should be treated as opportunity costs."
    ],
    correctAnswer: "B) They should be treated as sunk costs and ignored in the decision.",
    explanation: "When deciding whether to process a joint product further, joint costs already incurred up to the split-off point are past, sunk costs. The decision must be based solely on whether the incremental revenue from further processing exceeds the incremental costs of further processing."
  },
  {
    id: "c8q6",
    chapter: 8,
    chapterTitle: "Joint and By-Product Costing",
    question: "Company XYZ produces two joint products, Alpha and Beta, from a single process. The total joint costs incurred are Rs. 300,000. The process yields 15,000 kg of Alpha and 10,000 kg of Beta. If joint costs are allocated based on physical output (weight), what amount of joint cost is allocated to Product Beta?",
    options: [
      "A) Rs. 150,000",
      "B) Rs. 120,000",
      "C) Rs. 180,000",
      "D) Rs. 100,000"
    ],
    correctAnswer: "B) Rs. 120,000",
    explanation: "Total physical weight = 15,000 kg + 10,000 kg = 25,000 kg. Product Beta's share = 10,000 kg / 25,000 kg = 40%. Joint cost allocated to Beta = 40% × Rs. 300,000 = Rs. 120,000."
  },
  {
    id: "c8q7",
    chapter: 8,
    chapterTitle: "Joint and By-Product Costing",
    question: "When applying the Net Realisable Value (NRV) method to allocate joint costs, how is the NRV of a joint product calculated?",
    options: [
      "A) Final selling price multiplied by the number of units produced.",
      "B) Final sales value minus any further processing costs and selling expenses.",
      "C) Sales value at the split-off point minus joint costs allocated.",
      "D) Total production costs minus the scrap value of normal loss."
    ],
    correctAnswer: "B) Final sales value minus any further processing costs and selling expenses.",
    explanation: "Under the NRV method of joint cost allocation, the hypothetical value of the product at the split-off point is found by taking the ultimate final selling price and working backwards by subtracting the costs required to complete and sell the product (further processing and selling costs)."
  },
  {
    id: "c8q8",
    chapter: 8,
    chapterTitle: "Joint and By-Product Costing",
    question: "Product X is a joint product that can be sold at the split-off point for Rs. 50 per unit. Alternatively, it can be processed further at an additional cost of Rs. 15 per unit and then sold for Rs. 70 per unit. What is the incremental profit or loss per unit from further processing?",
    options: [
      "A) Rs. 5 per unit profit",
      "B) Rs. 20 per unit profit",
      "C) Rs. 5 per unit loss",
      "D) Rs. 55 per unit profit"
    ],
    correctAnswer: "A) Rs. 5 per unit profit",
    explanation: "Incremental Revenue = Final Sales Price (Rs. 70) - Sales Price at split-off (Rs. 50) = Rs. 20. Incremental Cost = Further processing cost = Rs. 15. Incremental Profit = Incremental Revenue (Rs. 20) - Incremental Cost (Rs. 15) = Rs. 5 profit per unit. Therefore, it should be processed further."
  },
  {
    id: "c8q9",
    chapter: 8,
    chapterTitle: "Joint and By-Product Costing",
    question: "A process produces three joint products. Product M has a sales value at the split-off point of Rs. 400,000, Product N has a sales value of Rs. 500,000, and Product O has a sales value of Rs. 100,000. Total joint costs are Rs. 600,000. Using the sales value at split-off method, how much joint cost is allocated to Product M?",
    options: [
      "A) Rs. 200,000",
      "B) Rs. 240,000",
      "C) Rs. 300,000",
      "D) Rs. 400,000"
    ],
    correctAnswer: "B) Rs. 240,000",
    explanation: "Total Sales Value at split-off = 400,000 + 500,000 + 100,000 = Rs. 1,000,000. Product M's proportion = 400,000 / 1,000,000 = 40%. Joint cost allocated to M = 40% × Rs. 600,000 = Rs. 240,000."
  },
  {
    id: "c8q10",
    chapter: 8,
    chapterTitle: "Joint and By-Product Costing",
    question: "What is the fundamental nature of \"Joint Costs\" prior to the split-off point?",
    options: [
      "A) They can be easily and directly traced to individual final products.",
      "B) They are entirely variable costs that change with the sales mix.",
      "C) They are indivisible costs that cannot be directly traced to any single joint product without using an arbitrary allocation base.",
      "D) They represent the specific costs of packaging the final products for the consumer."
    ],
    correctAnswer: "C) They are indivisible costs that cannot be directly traced to any single joint product without using an arbitrary allocation base.",
    explanation: "Joint costs are incurred for the process as a whole. Because the products are not separately identifiable before the split-off point, these costs cannot be directly traced to individual products and must be apportioned using a logical base."
  },

  // Chapter 9: Marginal Costing and Absorption Costing
  {
    id: "c9q1",
    chapter: 9,
    chapterTitle: "Marginal Costing and Absorption Costing",
    question: "What is the fundamental difference between marginal costing and absorption costing?",
    options: [
      "A) The treatment of variable production overheads",
      "B) The treatment of fixed production overheads",
      "C) The treatment of variable selling and administration costs",
      "D) The treatment of direct labour costs"
    ],
    correctAnswer: "B) The treatment of fixed production overheads",
    explanation: "The core difference between the two costing methods lies in how they handle fixed production overheads. Absorption costing includes them in the product cost (and thus inventory), while marginal costing treats them strictly as a period cost."
  },
  {
    id: "c9q2",
    chapter: 9,
    chapterTitle: "Marginal Costing and Absorption Costing",
    question: "Under a marginal costing system, how are fixed production overheads treated in the financial period they are incurred?",
    options: [
      "A) They are capitalized into the closing inventory valuation.",
      "B) They are treated as a product cost and only expensed when the goods are sold.",
      "C) They are treated as a period cost and written off entirely in the Statement of Profit or Loss.",
      "D) They are apportioned based on direct labour hours and added to the prime cost."
    ],
    correctAnswer: "C) They are treated as a period cost and written off entirely in the Statement of Profit or Loss.",
    explanation: "In marginal costing, fixed production overheads are not attached to units of production. Instead, the total actual fixed production overhead incurred is treated as a period cost and deducted in full from the total contribution margin."
  },
  {
    id: "c9q3",
    chapter: 9,
    chapterTitle: "Marginal Costing and Absorption Costing",
    question: "In an absorption costing income statement, how are variable selling and administration expenses accounted for?",
    options: [
      "A) They are included in the cost of goods manufactured.",
      "B) They are included in the valuation of closing inventory.",
      "C) They are treated as a period cost and deducted from the gross profit.",
      "D) They are deducted directly from sales to arrive at the gross profit."
    ],
    correctAnswer: "C) They are treated as a period cost and deducted from the gross profit.",
    explanation: "Under absorption costing, only manufacturing/production costs are included in the cost of sales to arrive at Gross Profit. All non-production costs, including variable selling and administration, are period costs deducted from Gross Profit."
  },
  {
    id: "c9q4",
    chapter: 9,
    chapterTitle: "Marginal Costing and Absorption Costing",
    question: "When a company's production volume exceeds its sales volume during a specific period, how will the net profit compare between the two costing methods?",
    options: [
      "A) Marginal costing will report a higher net profit than absorption costing.",
      "B) Absorption costing will report a higher net profit than marginal costing.",
      "C) Both methods will report exactly the same net profit.",
      "D) The profit difference depends entirely on the variable cost per unit."
    ],
    correctAnswer: "B) Absorption costing will report a higher net profit than marginal costing.",
    explanation: "When production exceeds sales, inventory levels increase. Under absorption costing, a portion of the current period's fixed production overheads is deferred (carried forward) in the closing inventory valuation, reducing the cost of sales and thereby resulting in a higher profit compared to marginal costing."
  },
  {
    id: "c9q5",
    chapter: 9,
    chapterTitle: "Marginal Costing and Absorption Costing",
    question: "Which of the following components are included in the valuation of closing inventory under absorption costing?",
    options: [
      "A) Direct materials, direct labour, and variable production overheads only.",
      "B) Prime cost, variable production overheads, and fixed production overheads.",
      "C) Prime cost, variable production overheads, and variable selling overheads.",
      "D) Total production costs and total administrative costs."
    ],
    correctAnswer: "B) Prime cost, variable production overheads, and fixed production overheads.",
    explanation: "Absorption costing charges all production costs to the product. This includes direct materials and direct labour (Prime Cost), variable production overheads, and a fair share of fixed production overheads."
  },
  {
    id: "c9q6",
    chapter: 9,
    chapterTitle: "Marginal Costing and Absorption Costing",
    question: "A company had an opening inventory of 4,000 units and a closing inventory of 6,000 units. The fixed overhead absorption rate (OAR) is Rs. 15 per unit. If the net profit calculated under marginal costing is Rs. 120,000, what will be the net profit under absorption costing?",
    options: [
      "A) Rs. 150,000",
      "B) Rs. 90,000",
      "C) Rs. 120,000",
      "D) Rs. 180,000"
    ],
    correctAnswer: "A) Rs. 150,000",
    explanation: "The difference in profit is calculated by the change in inventory units multiplied by the fixed OAR. Change in inventory = Closing (6,000) - Opening (4,000) = +2,000 units. Profit Difference = 2,000 units × Rs. 15 = Rs. 30,000. Since inventory increased (Production > Sales), Absorption Profit is higher. Absorption Profit = Marginal Profit (120,000) + Difference (30,000) = Rs. 150,000."
  },
  {
    id: "c9q7",
    chapter: 9,
    chapterTitle: "Marginal Costing and Absorption Costing",
    question: "In a marginal costing income statement, what is deducted from Sales Revenue to arrive at the \"Contribution Margin\"?",
    options: [
      "A) Variable production costs only",
      "B) Cost of goods sold",
      "C) All variable costs (including production, selling, and administration)",
      "D) Fixed production overheads"
    ],
    correctAnswer: "C) All variable costs (including production, selling, and administration)",
    explanation: "In a standard marginal costing format, Contribution Margin is derived by subtracting all variable costs (both manufacturing variable costs and non-manufacturing variable selling/admin costs) from the sales revenue."
  },
  {
    id: "c9q8",
    chapter: 9,
    chapterTitle: "Marginal Costing and Absorption Costing",
    question: "Which of the following situations will require an adjustment for \"under or over-absorbed overheads\" in the income statement?",
    options: [
      "A) When using Marginal Costing, and actual production matches budgeted production.",
      "B) When using Absorption Costing, and actual activity levels or actual fixed costs differ from the budgeted estimates.",
      "C) When using Marginal Costing, and actual fixed costs exceed budgeted fixed costs.",
      "D) When sales volume is greater than the production volume."
    ],
    correctAnswer: "B) When using Absorption Costing, and actual activity levels or actual fixed costs differ from the budgeted estimates.",
    explanation: "Absorption costing uses a pre-determined overhead absorption rate (OAR). If actual overheads differ from budgeted overheads, or actual production differs from budgeted production, it creates an under or over-absorption of fixed overheads which must be adjusted in the income statement. Marginal costing does not use fixed OARs, so this adjustment does not exist there."
  },
  {
    id: "c9q9",
    chapter: 9,
    chapterTitle: "Marginal Costing and Absorption Costing",
    question: "When reconciling marginal costing profit to absorption costing profit, which of the following formulas correctly calculates the difference in profit?",
    options: [
      "A) (Opening Inventory Units - Closing Inventory Units) × Variable Cost per unit",
      "B) (Closing Inventory Units - Opening Inventory Units) × Fixed Overhead Absorption Rate per unit",
      "C) Total fixed production overheads divided by actual units produced",
      "D) Expected Sales minus Actual Sales"
    ],
    correctAnswer: "B) (Closing Inventory Units - Opening Inventory Units) × Fixed Overhead Absorption Rate per unit",
    explanation: "The absolute difference between marginal and absorption profit is solely driven by the amount of fixed overhead trapped in inventory. This is calculated by multiplying the difference in physical inventory units by the standard Fixed Overhead Absorption Rate (OAR) per unit."
  },
  {
    id: "c9q10",
    chapter: 9,
    chapterTitle: "Marginal Costing and Absorption Costing",
    question: "When comparing absorption costing with marginal costing, under which specific condition will the net profit reported by both methods be exactly the same?",
    options: [
      "A) When production volume is greater than sales volume.",
      "B) When sales volume is greater than production volume.",
      "C) When there is no opening or closing inventory (Production volume equals Sales volume).",
      "D) When fixed production overheads are higher than variable production overheads."
    ],
    correctAnswer: "C) When there is no opening or closing inventory (Production volume equals Sales volume).",
    explanation: "If a company sells exactly what it produces in a period, inventory levels do not change. Consequently, all fixed production overheads incurred in that period are charged to the income statement in both methods, resulting in identical net profits."
  },

  // Chapter 10: Standard Costing
  {
    id: "c10q1",
    chapter: 10,
    chapterTitle: "Standard Costing",
    question: "How is a \"Standard Cost\" fundamentally defined in management accounting?",
    options: [
      "A) The actual historical cost incurred in the previous financial period.",
      "B) A pre-determined cost of producing a single cost unit or rendering a service.",
      "C) The total budgeted manufacturing cost for the entire factory.",
      "D) The estimated selling price minus the target profit margin."
    ],
    correctAnswer: "B) A pre-determined cost of producing a single cost unit or rendering a service.",
    explanation: "The study text explicitly defines a standard cost as a pre-determined cost of producing a cost unit. It is usually expressed as a standard cost per unit of production or per unit of service rendered."
  },
  {
    id: "c10q2",
    chapter: 10,
    chapterTitle: "Standard Costing",
    question: "Which type of performance standard assumes perfect operating conditions with absolutely no allowance for wastage, inefficiencies, or machine breakdowns?",
    options: [
      "A) Attainable standard",
      "B) Current standard",
      "C) Basic standard",
      "D) Ideal standard"
    ],
    correctAnswer: "D) Ideal standard",
    explanation: "Ideal standards assume perfect working conditions, meaning no allowances are made for normal waste, spoilage, machine breakdowns, or idle time. They are rarely used in practice because they are practically unattainable."
  },
  {
    id: "c10q3",
    chapter: 10,
    chapterTitle: "Standard Costing",
    question: "Which type of performance standard is most widely used because it is most likely to motivate employees by setting challenging but achievable targets?",
    options: [
      "A) Basic standard",
      "B) Ideal standard",
      "C) Attainable standard",
      "D) Current standard"
    ],
    correctAnswer: "C) Attainable standard",
    explanation: "Attainable standards are based on challenging but achievable targets. They include allowances for normal waste and idle time. They are the most likely to motivate employees to improve performance."
  },
  {
    id: "c10q4",
    chapter: 10,
    chapterTitle: "Standard Costing",
    question: "A company's finished product requires a net weight of 4.5 kg of direct material. However, the production process normally suffers a 10% material loss during processing. What is the standard quantity of raw material input required per unit?",
    options: [
      "A) 4.05 kg",
      "B) 4.50 kg",
      "C) 4.95 kg",
      "D) 5.00 kg"
    ],
    correctAnswer: "D) 5.00 kg",
    explanation: "To find the input quantity when there is a normal loss, you divide the net output required by the yield percentage. Since normal loss is 10%, the yield is 90% (or 0.90). Standard Input = 4.5 kg / 0.90 = 5.00 kg."
  },
  {
    id: "c10q5",
    chapter: 10,
    chapterTitle: "Standard Costing",
    question: "When establishing the standard direct labour time required to manufacture a new product, which of the following techniques is commonly used by management?",
    options: [
      "A) Time and motion studies",
      "B) Simultaneous equation method",
      "C) Economic Order Quantity (EOQ) modeling",
      "D) Repeated distribution method"
    ],
    correctAnswer: "A) Time and motion studies",
    explanation: "Standard labour hours for a task are usually established through direct observation and measurement of workers performing the task, a technique known as time and motion studies."
  },
  {
    id: "c10q6",
    chapter: 10,
    chapterTitle: "Standard Costing",
    question: "A worker takes 4 hours of active production time to complete one unit of a product. If normal idle time (for breaks and setup) is expected to be 20% of the total hours paid, what is the standard labour hours that should be charged for one unit?",
    options: [
      "A) 4.80 hours",
      "B) 3.20 hours",
      "C) 5.00 hours",
      "D) 4.20 hours"
    ],
    correctAnswer: "C) 5.00 hours",
    explanation: "The active production time represents the productive hours. If idle time is 20% of total time paid, then productive time is 80% of total time paid. 4 hours = 80% of total hours. Total standard hours = 4 hours / 0.80 = 5.00 hours."
  },
  {
    id: "c10q7",
    chapter: 10,
    chapterTitle: "Standard Costing",
    question: "Which of the following best describes a \"Basic Standard\" in standard costing?",
    options: [
      "A) A standard based on current conditions that is updated every single month.",
      "B) A standard that is kept unchanged over a long period of time, primarily used to show long-term trends in prices and efficiency.",
      "C) A standard that reflects short-term temporary expectations due to a crisis.",
      "D) A standard used strictly for purchasing indirect materials."
    ],
    correctAnswer: "B) A standard that is kept unchanged over a long period of time, primarily used to show long-term trends in prices and efficiency.",
    explanation: "Basic standards are long-term standards that remain unaltered over a period of years. Their primary purpose is to help management track long-term trends in efficiency and price changes over time."
  },
  {
    id: "c10q8",
    chapter: 10,
    chapterTitle: "Standard Costing",
    question: "How is the standard fixed overhead absorption rate calculated when deriving the standard cost card of a product?",
    options: [
      "A) Actual fixed overheads divided by actual activity level",
      "B) Budgeted fixed overheads divided by actual activity level",
      "C) Budgeted fixed overheads divided by budgeted level of activity",
      "D) Actual fixed overheads divided by budgeted level of activity"
    ],
    correctAnswer: "C) Budgeted fixed overheads divided by budgeted level of activity",
    explanation: "In standard costing, fixed overheads are incorporated into the unit cost using a predetermined overhead absorption rate. This rate is calculated by dividing the budgeted fixed production overheads by the budgeted level of activity (e.g., budgeted labour hours or machine hours)."
  },
  {
    id: "c10q9",
    chapter: 10,
    chapterTitle: "Standard Costing",
    question: "When setting a standard cost for direct materials, which of the following factors should the purchasing department normally incorporate into the standard price?",
    options: [
      "A) Only the highest quality material available in the market, regardless of cost.",
      "B) The most competitive expected price at the required quality, incorporating expected bulk purchase discounts.",
      "C) The historical price paid when the company first opened.",
      "D) The expected selling price of the final product."
    ],
    correctAnswer: "B) The most competitive expected price at the required quality, incorporating expected bulk purchase discounts.",
    explanation: "Standard price information is derived assuming the procurement department has made a reasonable search for suppliers. The standard price should reflect the most competitive price at the required quality, taking into account expected purchase volumes and available trade/bulk discounts."
  },
  {
    id: "c10q10",
    chapter: 10,
    chapterTitle: "Standard Costing",
    question: "If a company introduces a new complex product and expects a 90% learning curve to apply to the workforce, how should this effect be incorporated into standard costing?",
    options: [
      "A) By reducing the standard material price for future batches.",
      "B) By increasing the standard fixed overhead absorption rate over time.",
      "C) By adjusting the standard labour efficiency (hours required) for successive batches until a steady state is reached.",
      "D) By steadily reducing the standard hourly wage rate paid to the workers."
    ],
    correctAnswer: "C) By adjusting the standard labour efficiency (hours required) for successive batches until a steady state is reached.",
    explanation: "The learning curve theory dictates that as workers repeat a new and complex task, they become faster, reducing the average time required per unit. Therefore, standard labour efficiency (hours) cannot be static at the beginning; it must be adjusted downwards for successive batches until the learning effect ceases (steady state)."
  },

  // Chapter 11: Variance Analysis
  {
    id: "c11q1",
    chapter: 11,
    chapterTitle: "Variance Analysis",
    question: "What does the \"total direct material cost variance\" essentially represent in standard costing?",
    options: [
      "A) The difference between the budgeted material cost for the period and the actual material cost incurred.",
      "B) The difference between the actual quantity of material used and the standard quantity of material allowed.",
      "C) The difference between the actual material cost incurred and the standard material cost of the actual production.",
      "D) The difference between the standard price of materials and the actual price paid to suppliers."
    ],
    correctAnswer: "C) The difference between the actual material cost incurred and the standard material cost of the actual production.",
    explanation: "Total direct material variance is defined in the study text as the difference between the actual material cost in producing units in the period and the standard material cost of producing those actual units."
  },
  {
    id: "c11q2",
    chapter: 11,
    chapterTitle: "Variance Analysis",
    question: "A company's standard material price is Rs. 8.00 per kg. During the month, it purchased and consumed 50,000 kgs of material at an actual price of Rs. 7.80 per kg. What is the direct material price variance?",
    options: [
      "A) Rs. 10,000 Favourable",
      "B) Rs. 10,000 Adverse",
      "C) Rs. 400,000 Favourable",
      "D) Rs. 390,000 Adverse"
    ],
    correctAnswer: "A) Rs. 10,000 Favourable",
    explanation: "Material Price Variance = (Standard Price – Actual Price) × Actual Quantity. Calculation: (Rs. 8.00 – Rs. 7.80) × 50,000 kgs = Rs. 0.20 × 50,000 = Rs. 10,000. Because the actual price paid was less than the standard price, the variance is Favourable."
  },
  {
    id: "c11q3",
    chapter: 11,
    chapterTitle: "Variance Analysis",
    question: "Product X has a standard labour requirement of 4 hours per unit at a standard rate of Rs. 50 per hour. During the period, 1,000 units were produced using 4,050 actual hours. What is the direct labour efficiency variance?",
    options: [
      "A) Rs. 2,500 Favourable",
      "B) Rs. 2,000 Adverse",
      "C) Rs. 2,500 Adverse",
      "D) Rs. 50,000 Favourable"
    ],
    correctAnswer: "C) Rs. 2,500 Adverse",
    explanation: "Labour Efficiency Variance = (Standard Hours allowed for actual production – Actual Hours worked) × Standard Rate. Standard hours for 1,000 units = 1,000 × 4 = 4,000 hours. Calculation: (4,000 hours – 4,050 hours) × Rs. 50 = (50 hours) × 50 = Rs. 2,500. Because actual hours exceeded standard hours, the variance is Adverse."
  },
  {
    id: "c11q4",
    chapter: 11,
    chapterTitle: "Variance Analysis",
    question: "Under an absorption costing system, how is the \"fixed production overhead volume variance\" calculated?",
    options: [
      "A) (Actual fixed overheads incurred – Budgeted fixed overheads)",
      "B) (Actual production volume in units – Budgeted production volume in units) × Standard fixed overhead absorption rate per unit",
      "C) (Actual hours worked – Budgeted hours) × Standard fixed overhead absorption rate per hour",
      "D) Budgeted fixed overheads – Applied fixed overheads"
    ],
    correctAnswer: "B) (Actual production volume in units – Budgeted production volume in units) × Standard fixed overhead absorption rate per unit",
    explanation: "The fixed overhead volume variance measures the difference between the actual units produced and the budgeted units, evaluated at the standard fixed overhead absorption rate per unit."
  },
  {
    id: "c11q5",
    chapter: 11,
    chapterTitle: "Variance Analysis",
    question: "The fixed production overhead volume variance can be further sub-divided into which of the following two variances?",
    options: [
      "A) Expenditure variance and Efficiency variance",
      "B) Capacity variance and Expenditure variance",
      "C) Mix variance and Yield variance",
      "D) Capacity variance and Efficiency variance"
    ],
    correctAnswer: "D) Capacity variance and Efficiency variance",
    explanation: "The study text explicitly states that the fixed production overhead volume variance can be further analyzed and sub-divided into two variances: capacity variance and efficiency variance."
  },
  {
    id: "c11q6",
    chapter: 11,
    chapterTitle: "Variance Analysis",
    question: "When preparing an operating statement to reconcile budgeted profit with actual profit under a standard marginal costing system, how must the sales volume variance be valued?",
    options: [
      "A) At standard profit per unit",
      "B) At actual profit per unit",
      "C) At standard contribution margin per unit",
      "D) At actual selling price per unit"
    ],
    correctAnswer: "C) At standard contribution margin per unit",
    explanation: "Under a standard marginal costing system, fixed costs are treated as a period expense and are not absorbed into unit costs. Therefore, the sales volume variance is calculated using the standard contribution margin per unit, rather than the standard profit per unit used in absorption costing."
  },
  {
    id: "c11q7",
    chapter: 11,
    chapterTitle: "Variance Analysis",
    question: "When a manufacturing process requires a blend of two or more raw materials, the overall material usage variance can be further analyzed by splitting it into which two sub-variances?",
    options: [
      "A) Price and Mix variances",
      "B) Capacity and Efficiency variances",
      "C) Mix and Yield variances",
      "D) Expenditure and Volume variances"
    ],
    correctAnswer: "C) Mix and Yield variances",
    explanation: "When a product requires a mix of different materials, the total material usage variance can be split into a material mix variance (measuring the cost impact of changing the proportions) and a material yield variance (measuring the impact of the total quantity input versus output)."
  },
  {
    id: "c11q8",
    chapter: 11,
    chapterTitle: "Variance Analysis",
    question: "A company uses a standard costing system. The standard material cost is Rs. 40 per kg. For a given period, the material usage variance was Rs. 306,000 Adverse. If the standard quantity allowed for the actual production was 242,350 kgs, what was the actual quantity of material used?",
    options: [
      "A) 234,700 kgs",
      "B) 242,350 kgs",
      "C) 257,650 kgs",
      "D) 250,000 kgs"
    ],
    correctAnswer: "D) 250,000 kgs",
    explanation: "This is a \"working backwards\" calculation. Material Usage Variance = (Standard Quantity – Actual Quantity) × Standard Price. –306,000 (Adverse is negative) = (242,350 – AQ) × 40 –306,000 / 40 = 242,350 – AQ –7,650 = 242,350 – AQ AQ = 242,350 + 7,650 = 250,000 kgs."
  },
  {
    id: "c11q9",
    chapter: 11,
    chapterTitle: "Variance Analysis",
    question: "During a period, workers were paid for 4,200 total hours, but the actual active production time was only 4,100 hours due to unexpected machine breakdowns. If the standard labour rate is Rs. 100 per hour, what is the idle time variance?",
    options: [
      "A) Rs. 10,000 Adverse",
      "B) Rs. 10,000 Favourable",
      "C) Rs. 410,000 Adverse",
      "D) Rs. 420,000 Favourable"
    ],
    correctAnswer: "A) Rs. 10,000 Adverse",
    explanation: "Idle time variance is calculated by taking the difference between hours paid and hours worked (the idle hours) and multiplying by the standard labour rate. Idle hours = 4,200 paid – 4,100 worked = 100 hours. 100 hours × Rs. 100 = Rs. 10,000. Idle time variance is always an Adverse variance."
  },
  {
    id: "c11q10",
    chapter: 11,
    chapterTitle: "Variance Analysis",
    question: "A factory budgeted its fixed production overheads at Rs. 168,000 for the period. The actual fixed overheads incurred were Rs. 170,000. What is the fixed production overhead expenditure variance?",
    options: [
      "A) Rs. 2,000 Favourable",
      "B) Rs. 14,000 Adverse",
      "C) Rs. 2,000 Adverse",
      "D) Rs. 170,000 Adverse"
    ],
    correctAnswer: "C) Rs. 2,000 Adverse",
    explanation: "The fixed production overhead expenditure variance is simply the difference between the budgeted fixed overhead expenditure and the actual fixed overhead expenditure. Rs. 168,000 (Budgeted) – Rs. 170,000 (Actual) = Rs. 2,000 Adverse (because actual spending was higher)."
  },
  // Chapter 12: Target Costing
  {
    id: "c12q1",
    chapter: 12,
    chapterTitle: "Target Costing",
    question: "How is a \"Target Cost\" mathematically derived for a product?",
    options: [
      "A) Expected Manufacturing Cost plus Target Profit Margin",
      "B) Target Sales Price minus Minimum Gross Profit Margin",
      "C) Target Sales Price plus Minimum Gross Profit Margin",
      "D) Expected Full Cost minus Target Cost Gap"
    ],
    correctAnswer: "B) Target Sales Price minus Minimum Gross Profit Margin",
    explanation: "According to the target costing methodology demonstrated in the study text, the target cost is calculated by taking the expected sales price and subtracting the minimum required gross profit margin."
  },
  {
    id: "c12q2",
    chapter: 12,
    chapterTitle: "Target Costing",
    question: "Which of the following best defines the \"Target Cost Gap\"?",
    options: [
      "A) The difference between the target selling price and the target profit.",
      "B) The difference between the expected cost per unit and the target cost per unit.",
      "C) The difference between the target selling price and the expected cost per unit.",
      "D) The difference between actual sales revenue and budgeted sales revenue."
    ],
    correctAnswer: "B) The difference between the expected cost per unit and the target cost per unit.",
    explanation: "The target cost gap is defined as the difference between the currently expected cost per unit (what it will cost to make the product under current conditions) and the target cost per unit (what it must cost to achieve the target profit)."
  },
  {
    id: "c12q3",
    chapter: 12,
    chapterTitle: "Target Costing",
    question: "A company plans to sell a new product (NP8) at a target sales price of Rs. 70 per unit. The company requires a minimum gross profit margin of 30%. What is the target cost for this product?",
    options: [
      "A) Rs. 49",
      "B) Rs. 21",
      "C) Rs. 91",
      "D) Rs. 55"
    ],
    correctAnswer: "A) Rs. 49",
    explanation: "Target Cost = Sales Price – Minimum Gross Profit Margin. Gross Profit = 30% of Rs. 70 = Rs. 21. Target Cost = Rs. 70 – Rs. 21 = Rs. 49."
  },
  {
    id: "c12q4",
    chapter: 12,
    chapterTitle: "Target Costing",
    question: "Continuing from the previous scenario, if the company calculates that the expected full cost per unit of product NP8 will be Rs. 55, what is the size of the target cost gap?",
    options: [
      "A) Rs. 15",
      "B) Rs. 21",
      "C) Rs. 6",
      "D) Rs. 0"
    ],
    correctAnswer: "C) Rs. 6",
    explanation: "The target cost gap is calculated by subtracting the target cost from the expected cost. Expected cost (Rs. 55) – Target cost (Rs. 49) = Target cost gap of Rs. 6."
  },
  {
    id: "c12q5",
    chapter: 12,
    chapterTitle: "Target Costing",
    question: "When estimating the total expected cost of a product to compare against the target cost, which of the following costs should be included?",
    options: [
      "A) Only direct materials and direct labour.",
      "B) Only manufacturing costs (prime costs and production overheads).",
      "C) Manufacturing costs, plus non-manufacturing costs such as marketing, distribution, and after-sales service.",
      "D) Variable costs only."
    ],
    correctAnswer: "C) Manufacturing costs, plus non-manufacturing costs such as marketing, distribution, and after-sales service.",
    explanation: "The study text illustrates that when establishing the full expected cost of a product for target costing, both manufacturing costs (materials, labour, machinery) and non-manufacturing costs (marketing, distribution, after-sales service) are accumulated."
  },
  {
    id: "c12q6",
    chapter: 12,
    chapterTitle: "Target Costing",
    question: "A company is evaluating its existing cost structure against its target cost. The current total expected cost of the product is Rs. 91,000 per unit, while the target cost has been calculated as Rs. 78,350 per unit. What does the difference of Rs. 12,650 represent?",
    options: [
      "A) The target profit margin.",
      "B) The target cost gap that needs to be eliminated.",
      "C) The sunk cost of the product.",
      "D) The incremental revenue."
    ],
    correctAnswer: "B) The target cost gap that needs to be eliminated.",
    explanation: "The difference between the existing/expected cost (Rs. 91,000) and the calculated target cost (Rs. 78,350) represents the target cost gap (Rs. 12,650) which the company must find a way to eliminate to achieve its desired profitability."
  },
  {
    id: "c12q7",
    chapter: 12,
    chapterTitle: "Target Costing",
    question: "In calculating the total expected cost for target costing purposes, how should estimated \"rework costs\" and expected \"warranty costs\" be treated?",
    options: [
      "A) They should be completely ignored as they are abnormal losses.",
      "B) They should be deducted from the target selling price.",
      "C) They should be included as part of the total expected cost of the product.",
      "D) They should be treated as a separate target cost gap."
    ],
    correctAnswer: "C) They should be included as part of the total expected cost of the product.",
    explanation: "Based on the cost accumulation schedules provided in the study text, rework costs and warranty costs are factored directly into the expected cost profile of the product before comparing it to the target cost."
  },
  {
    id: "c12q8",
    chapter: 12,
    chapterTitle: "Target Costing",
    question: "A business is launching a new digital game. The target profit margin is set at 30% of the target selling price. The target selling price is Rs. 10,000. If the expected manufacturing costs are Rs. 3,319 and the expected non-manufacturing costs are Rs. 1,270, what is the target cost gap?",
    options: [
      "A) Rs. 3,000",
      "B) Rs. 2,411",
      "C) Rs. 7,000",
      "D) Rs. 0 (There is no cost gap)"
    ],
    correctAnswer: "D) Rs. 0 (There is no cost gap)",
    explanation: "Target Cost = Target Selling Price (10,000) - Target Profit (30% of 10,000 = 3,000) = Rs. 7,000. Total Expected Cost = Manufacturing (3,319) + Non-manufacturing (1,270) = Rs. 4,589. Since the Expected Cost (4,589) is already lower than the Target Cost (7,000), there is no target cost gap. (This uses the cost elements provided in the text)."
  },
  {
    id: "c12q9",
    chapter: 12,
    chapterTitle: "Target Costing",
    question: "What is the primary objective of identifying a Target Cost Gap during the product development phase?",
    options: [
      "A) To increase the target selling price until the gap is closed.",
      "B) To reduce the target profit margin so the shareholders expect less return.",
      "C) To highlight the amount of expected cost that must be reduced or eliminated (e.g., through value engineering or process improvement) before the product is launched.",
      "D) To calculate the break-even point in units."
    ],
    correctAnswer: "C) To highlight the amount of expected cost that must be reduced or eliminated (e.g., through value engineering or process improvement) before the product is launched.",
    explanation: "The fundamental purpose of calculating a target cost gap is to identify exactly how much cost must be stripped out of the product's design, materials, or production process to ensure the product yields the required profit margin at the competitive market price."
  },
  {
    id: "c12q10",
    chapter: 12,
    chapterTitle: "Target Costing",
    question: "If a company successfully redesigns its product and streamlines its manufacturing process so that the expected full cost of the product falls exactly equal to the calculated target cost, what is the resulting target cost gap?",
    options: [
      "A) It is equal to the target profit margin.",
      "B) It is zero.",
      "C) It is negative.",
      "D) It is equal to the target selling price."
    ],
    correctAnswer: "B) It is zero.",
    explanation: "The target cost gap is mathematically Expected Cost - Target Cost. If the company reduces its expected cost so that it perfectly matches the target cost, the formula yields exactly zero, meaning the product is ready to launch and will hit its profit targets."
  },

  // Chapter 13: Cost-Volume-Profit (CVP) Analysis
  {
    id: "c13q1",
    chapter: 13,
    chapterTitle: "Cost-Volume-Profit (CVP) Analysis",
    question: "According to the study text, what is the fundamental purpose of Cost-Volume-Profit (CVP) analysis?",
    options: [
      "A) To allocate overhead costs accurately among different production departments.",
      "B) To study the interrelationships between cost, volume, and profit at different levels of activity.",
      "C) To calculate the standard cost and identify material and labour variances.",
      "D) To track the physical flow of raw materials in a continuous production process."
    ],
    correctAnswer: "B) To study the interrelationships between cost, volume, and profit at different levels of activity.",
    explanation: "The study text defines CVP analysis as an application of marginal costing concepts that is specifically used to show how costs and profits change with changes in the volume of activity, forming a study of interrelationships between cost, volume, and profit."
  },
  {
    id: "c13q2",
    chapter: 13,
    chapterTitle: "Cost-Volume-Profit (CVP) Analysis",
    question: "Which of the following formulas correctly calculates the Break-Even Point in terms of Sales Revenue?",
    options: [
      "A) Total Fixed Costs ÷ Contribution Margin per unit",
      "B) Total Fixed Costs ÷ Contribution to Sales (C/S) Ratio",
      "C) Total Variable Costs ÷ Contribution Margin per unit",
      "D) (Total Fixed Costs + Target Profit) ÷ Contribution to Sales (C/S) Ratio"
    ],
    correctAnswer: "B) Total Fixed Costs ÷ Contribution to Sales (C/S) Ratio",
    explanation: "To find the break-even point in units, you divide fixed costs by contribution per unit. To find the break-even point directly in Sales Revenue, you divide the Total Fixed Costs by the C/S Ratio (Contribution / Sales)."
  },
  {
    id: "c13q3",
    chapter: 13,
    chapterTitle: "Cost-Volume-Profit (CVP) Analysis",
    question: "Entity E has monthly expected sales of Rs. 128,000. If the margin of safety is given as 6.25%, what is the break-even sales revenue for the entity?",
    options: [
      "A) Rs. 136,000",
      "B) Rs. 8,000",
      "C) Rs. 120,000",
      "D) Rs. 126,000"
    ],
    correctAnswer: "C) Rs. 120,000",
    explanation: "The Margin of Safety is the difference between actual/expected sales and break-even sales. Margin of Safety in Rs = 6.25% of Expected Sales (128,000) = Rs. 8,000. Break-even Sales = Expected Sales - Margin of Safety = 128,000 - 8,000 = Rs. 120,000."
  },
  {
    id: "c13q4",
    chapter: 13,
    chapterTitle: "Cost-Volume-Profit (CVP) Analysis",
    question: "A company plans to sell its product for Rs. 53 per unit. The expected variable cost is Rs. 21 per unit, and the total fixed costs for the year are Rs. 220,000. If the company wishes to achieve a target profit of Rs. 40,000, how many units must it sell?",
    options: [
      "A) 8,125 units",
      "B) 6,875 units",
      "C) 4,150 units",
      "D) 12,380 units"
    ],
    correctAnswer: "A) 8,125 units",
    explanation: "Contribution per unit = Selling Price (53) - Variable Cost (21) = Rs. 32. To find target sales units: (Fixed Costs + Target Profit) ÷ Contribution per unit. (220,000 + 40,000) ÷ 32 = 260,000 ÷ 32 = 8,125 units."
  },
  {
    id: "c13q5",
    chapter: 13,
    chapterTitle: "Cost-Volume-Profit (CVP) Analysis",
    question: "On a conventional Break-Even Chart, how is the \"Total Fixed Costs\" line typically drawn?",
    options: [
      "A) As a straight line starting from the origin (0,0) and sloping upwards.",
      "B) As a straight line starting from the origin but curving downwards as volume increases.",
      "C) As a horizontal line parallel to the x-axis, starting at the level of total fixed costs on the y-axis.",
      "D) It is not drawn on a conventional break-even chart; only the PV chart shows fixed costs."
    ],
    correctAnswer: "C) As a horizontal line parallel to the x-axis, starting at the level of total fixed costs on the y-axis.",
    explanation: "On a break-even chart, fixed costs remain constant regardless of the volume. Therefore, the line is drawn horizontally parallel to the activity (x) axis, starting from the total fixed cost value on the y-axis."
  },
  {
    id: "c13q6",
    chapter: 13,
    chapterTitle: "Cost-Volume-Profit (CVP) Analysis",
    question: "On a Profit-Volume (PV) chart, what does the y-intercept (the point where the profit line crosses the vertical axis at zero sales volume) represent?",
    options: [
      "A) The break-even point",
      "B) The margin of safety",
      "C) The maximum total contribution margin",
      "D) The total fixed costs (represented as a maximum loss)"
    ],
    correctAnswer: "D) The total fixed costs (represented as a maximum loss)",
    explanation: "On a Profit-Volume (PV) chart, if sales volume is zero, the company earns zero contribution and therefore incurs a loss exactly equal to its total fixed costs. This is represented by the y-intercept below the zero-profit line."
  },
  {
    id: "c13q7",
    chapter: 13,
    chapterTitle: "Cost-Volume-Profit (CVP) Analysis",
    question: "When applying CVP analysis to a multi-product company, what crucial assumption must be made to calculate a single, overall break-even point?",
    options: [
      "A) All products must have exactly the same selling price.",
      "B) All products must have the same contribution margin per unit.",
      "C) The sales mix (the proportion in which the different products are sold) remains constant.",
      "D) Fixed costs must be entirely apportioned to each individual product based on labour hours."
    ],
    correctAnswer: "C) The sales mix (the proportion in which the different products are sold) remains constant.",
    explanation: "In multi-product CVP analysis, an aggregate or weighted average contribution margin is calculated. This is only valid under the strict assumption that the proportion (mix) in which the different products are sold remains constant."
  },
  {
    id: "c13q8",
    chapter: 13,
    chapterTitle: "Cost-Volume-Profit (CVP) Analysis",
    question: "If a company successfully reduces its total fixed costs while maintaining the same selling price and variable cost per unit, what will be the effect on the break-even point and the margin of safety?",
    options: [
      "A) Break-even point will increase, Margin of safety will decrease.",
      "B) Break-even point will decrease, Margin of safety will increase.",
      "C) Break-even point will decrease, Margin of safety will decrease.",
      "D) Both will remain entirely unchanged."
    ],
    correctAnswer: "B) Break-even point will decrease, Margin of safety will increase.",
    explanation: "A reduction in fixed costs means fewer units need to be sold to cover them, hence the break-even point decreases. Because the break-even point is lower, the cushion between expected sales and break-even sales (the margin of safety) becomes larger."
  },
  {
    id: "c13q9",
    chapter: 13,
    chapterTitle: "Cost-Volume-Profit (CVP) Analysis",
    question: "Solvent Limited sells Product A and Product B in a standard ratio of 2:1. The contribution margin is Rs. 10 for Product A and Rs. 20 for Product B. What is the weighted average contribution margin per unit of the mix?",
    options: [
      "A) Rs. 15.00",
      "B) Rs. 30.00",
      "C) Rs. 13.33",
      "D) Rs. 10.00"
    ],
    correctAnswer: "C) Rs. 13.33",
    explanation: "The bundle/mix consists of 2 units of A and 1 unit of B (Total 3 units). Contribution of 2 units of A = 2 × 10 = Rs. 20. Contribution of 1 unit of B = 1 × 20 = Rs. 20. Total contribution of the mix (3 units) = Rs. 40. Weighted average contribution per unit = Rs. 40 ÷ 3 units = Rs. 13.33 per unit."
  },
  {
    id: "c13q10",
    chapter: 13,
    chapterTitle: "Cost-Volume-Profit (CVP) Analysis",
    question: "What does the \"Margin of Safety\" fundamentally indicate to management?",
    options: [
      "A) The exact amount of variable costs that can be saved without affecting quality.",
      "B) The maximum possible profit a company can earn if it operates at full 100% capacity.",
      "C) The percentage or amount by which budgeted or actual sales can fall before the company begins to incur a financial loss.",
      "D) The point where total sales revenue exactly equals total variable costs."
    ],
    correctAnswer: "C) The percentage or amount by which budgeted or actual sales can fall before the company begins to incur a financial loss.",
    explanation: "The margin of safety represents the \"buffer\" a business has. It is calculated as budgeted/actual sales minus break-even sales, indicating how much sales can drop before reaching the break-even point where losses start."
  },

  // Chapter 14: Relevant Costs
  {
    id: "c14q1",
    chapter: 14,
    chapterTitle: "Relevant Costs",
    question: "According to the principles of decision-making, which of the following best defines a \"Relevant Cost\"?",
    options: [
      "A) A past cost that has already been incurred and recorded in the financial statements.",
      "B) A future cash flow arising as a direct consequence of a decision.",
      "C) A non-cash expense such as depreciation or amortization.",
      "D) A general fixed overhead that is apportioned to all departments."
    ],
    correctAnswer: "B) A future cash flow arising as a direct consequence of a decision.",
    explanation: "The study text clearly defines a relevant cost as a future cash flow that arises as a direct consequence of a specific decision. Past (sunk) costs, non-cash items, and committed costs are not relevant."
  },
  {
    id: "c14q2",
    chapter: 14,
    chapterTitle: "Relevant Costs",
    question: "In relevant costing, what term is used to describe \"a benefit that will be lost by taking a specific course of action\"?",
    options: [
      "A) Sunk cost",
      "B) Avoidable cost",
      "C) Incremental cost",
      "D) Opportunity cost"
    ],
    correctAnswer: "D) Opportunity cost",
    explanation: "An opportunity cost is the value of a benefit sacrificed or lost when one course of action is chosen over the next best alternative. It is a critical component of relevant costing."
  },
  {
    id: "c14q3",
    chapter: 14,
    chapterTitle: "Relevant Costs",
    question: "A company has 1,000 kg of Material X in inventory, which was purchased last year for Rs. 50 per kg. This material is in continuous and regular use by the company. If Material X is used for a new special one-off contract, what is its relevant cost per unit?",
    options: [
      "A) The original purchase price of Rs. 50 per kg.",
      "B) The current replacement cost of purchasing new material from the market.",
      "C) The current disposal/scrap value of the material.",
      "D) Nil, because the material is already owned and paid for."
    ],
    correctAnswer: "B) The current replacement cost of purchasing new material from the market.",
    explanation: "When a material is in continuous/regular use, any units taken from inventory for a special job will simply have to be replaced to meet the ongoing regular demand. Therefore, the relevant cost is the current replacement price."
  },
  {
    id: "c14q4",
    chapter: 14,
    chapterTitle: "Relevant Costs",
    question: "A specific job requires 50 kg of a special material, \"Wire-D\". The supplier only sells this material in minimum batch sizes of 60 kg at a price of Rs. 10 per kg. The remaining 10 kg will have no alternative use for the company and cannot be sold for scrap. What is the relevant cost of this material for the special job?",
    options: [
      "A) Rs. 500",
      "B) Rs. 600",
      "C) Rs. 100",
      "D) Rs. 0"
    ],
    correctAnswer: "B) Rs. 600",
    explanation: "The supplier mandates a minimum order of 60 kg. Since the remaining 10 kg has no alternative use or scrap value, the entire cash outflow caused by the decision to accept the job is the cost of the full 60 kg (60 kg × Rs. 10 = Rs. 600)."
  },
  {
    id: "c14q5",
    chapter: 14,
    chapterTitle: "Relevant Costs",
    question: "A new contract requires 200 hours of direct labour in Department 1. The workforce in this department is paid a fixed weekly wage of Rs. 16 per hour. Currently, Department 1 has spare labour capacity (idle time) and there are no plans to lay off any workers. What is the relevant cost of labour for this contract in Department 1?",
    options: [
      "A) Rs. 3,200",
      "B) Rs. 0",
      "C) Rs. 1,600",
      "D) Rs. 4,800"
    ],
    correctAnswer: "B) Rs. 0",
    explanation: "The workers are paid a fixed wage regardless of whether they are working or idle. Because the department has spare capacity, putting them to work on the new contract incurs no additional cash flow. Thus, the relevant cost is zero."
  },
  {
    id: "c14q6",
    chapter: 14,
    chapterTitle: "Relevant Costs",
    question: "A special order requires 900 hours of labour. The factory is working at full capacity. To complete the order, management must divert workers from their normal regular production. For regular production, workers are paid Rs. 15 per hour and generate a contribution margin of Rs. 5 per hour. What is the relevant opportunity cost per hour of diverting these workers to the special order?",
    options: [
      "A) Rs. 5 per hour",
      "B) Rs. 15 per hour",
      "C) Rs. 20 per hour",
      "D) Rs. 10 per hour"
    ],
    correctAnswer: "C) Rs. 20 per hour",
    explanation: "When labour is at full capacity and must be diverted from other work, the company loses the contribution from that regular work (Rs. 5) AND still has to pay the workers for their time (Rs. 15). The total opportunity cost is Rs. 15 + Rs. 5 = Rs. 20 per hour."
  },
  {
    id: "c14q7",
    chapter: 14,
    chapterTitle: "Relevant Costs",
    question: "Which of the following costs should ALWAYS be treated as irrelevant when evaluating a short-term pricing decision for a special order?",
    options: [
      "A) Variable production overheads",
      "B) Incremental material costs",
      "C) Sunk costs and absorbed general fixed overheads",
      "D) Specific fixed costs incurred solely for the special order"
    ],
    correctAnswer: "C) Sunk costs and absorbed general fixed overheads",
    explanation: "Sunk costs are past costs that cannot be changed. Absorbed general fixed overheads are arbitrary allocations of costs that will be incurred regardless of the decision. Both are completely irrelevant to short-term decision making."
  },
  {
    id: "c14q8",
    chapter: 14,
    chapterTitle: "Relevant Costs",
    question: "A company holds raw materials in inventory that are no longer in regular use. The material can be sold for a scrap value of Rs. 1.50 per kg. Alternatively, it can be modified and used as a substitute for another material on a different project, saving the company Rs. 2.00 per kg. If the material is used on a new special contract, what is its relevant cost?",
    options: [
      "A) Rs. 1.50 per kg",
      "B) Rs. 2.00 per kg",
      "C) Rs. 3.50 per kg",
      "D) Rs. 0.50 per kg"
    ],
    correctAnswer: "B) Rs. 2.00 per kg",
    explanation: "When a material is no longer in regular use, its relevant cost is the highest alternative value the company could obtain from it. It can either be sold for Rs. 1.50 or used to save Rs. 2.00. Since Rs. 2.00 is the higher benefit being sacrificed by using it on the new contract, Rs. 2.00 is the relevant cost."
  },
  {
    id: "c14q9",
    chapter: 14,
    chapterTitle: "Relevant Costs",
    question: "A technical advisor is paid Rs. 400 per hour. He is currently working at full capacity. If the company accepts a new contract, he will need to dedicate 8 hours to it. Since he cannot be diverted from his regular work, he will have to work overtime to complete the new contract, for which he is paid a 50% premium above his usual rate. What is the total relevant cost of his time for the new contract?",
    options: [
      "A) Rs. 3,200",
      "B) Rs. 1,600",
      "C) Rs. 4,800",
      "D) Rs. 0"
    ],
    correctAnswer: "C) Rs. 4,800",
    explanation: "The advisor's normal rate is Rs. 400. With a 50% premium, the overtime rate is Rs. 600 per hour (400 + 200). Since 8 hours are required, the incremental cash outflow is 8 hours × Rs. 600 = Rs. 4,800."
  },
  {
    id: "c14q10",
    chapter: 14,
    chapterTitle: "Relevant Costs",
    question: "When evaluating whether to make a component in-house or buy it from an external supplier (Make or Buy decision), which of the following costs represents an \"avoidable cost\" that is relevant to the decision?",
    options: [
      "A) The depreciation on the factory building.",
      "B) The general head office administrative salaries apportioned to the factory.",
      "C) The variable manufacturing costs and specific fixed overheads that would be saved if production is stopped.",
      "D) The original cost of the machinery used to make the component."
    ],
    correctAnswer: "C) The variable manufacturing costs and specific fixed overheads that would be saved if production is stopped.",
    explanation: "Avoidable costs are costs that can be saved if a particular activity is discontinued. In a make-or-buy decision, the relevant costs of making the item are the variable costs and specific fixed costs that the company will avoid if it chooses to buy externally."
  },

  // Chapter 15: Decision Making Techniques
  {
    id: "c15q1",
    chapter: 15,
    chapterTitle: "Decision Making Techniques",
    question: "When a manufacturing company is operating at full capacity and faces a single scarce resource (such as limited machine hours or raw materials), in what order should it rank its products to maximize overall profitability?",
    options: [
      "A) By highest selling price per unit",
      "B) By highest contribution margin per unit",
      "C) By highest contribution margin per unit of the limiting factor",
      "D) By lowest variable production cost per unit"
    ],
    correctAnswer: "C) By highest contribution margin per unit of the limiting factor",
    explanation: "The study text highlights that when a single limiting factor (like machine hours or material) restricts production, the profit-maximizing production plan is established by ranking the products based on the contribution margin they generate per unit of the limiting factor consumed."
  },
  {
    id: "c15q2",
    chapter: 15,
    chapterTitle: "Decision Making Techniques",
    question: "In a \"Make or Buy\" (outsourcing) decision, which of the following costs is generally considered relevant when calculating the financial impact of manufacturing the component in-house?",
    options: [
      "A) General allocated administrative overheads",
      "B) Depreciation of the existing factory machinery used to make the component",
      "C) Variable production costs and directly attributable avoidable fixed costs",
      "D) The sunk cost of the raw materials already in general inventory"
    ],
    correctAnswer: "C) Variable production costs and directly attributable avoidable fixed costs",
    explanation: "In a make-or-buy decision, the relevant costs of manufacturing in-house are those that would be saved if the item were outsourced. This includes variable costs and any specific fixed costs (like hiring a specific supervisor) that are directly attributable and avoidable. General overheads and depreciation are irrelevant."
  },
  {
    id: "c15q3",
    chapter: 15,
    chapterTitle: "Decision Making Techniques",
    question: "According to short-term decision-making principles, under what specific circumstance should a company shut down a product line or a department?",
    options: [
      "A) If the product's total sales revenue is less than its total apportioned general overheads.",
      "B) If the specific, directly attributable fixed costs saved by closing the department exceed the lost contribution margin.",
      "C) If the product is generating a net loss after absorbing all head office fixed costs.",
      "D) If the product has a lower gross profit margin than the company's average."
    ],
    correctAnswer: "B) If the specific, directly attributable fixed costs saved by closing the department exceed the lost contribution margin.",
    explanation: "The text states that a product or department should be withdrawn if the savings from closure exceed the benefits of continuing. Therefore, if the avoidable fixed costs saved are greater than the contribution margin that will be lost, the department should be shut down."
  },
  {
    id: "c15q4",
    chapter: 15,
    chapterTitle: "Decision Making Techniques",
    question: "When a company produces joint products and is deciding whether to sell a product at the split-off point or to process it further, which of the following represents the correct financial rule?",
    options: [
      "A) The product should be processed further if its total sales revenue exceeds the total joint costs.",
      "B) The product should be processed further if the incremental revenue from further processing exceeds the incremental cost of further processing.",
      "C) The joint costs incurred prior to the split-off point must be treated as relevant costs in the further processing decision.",
      "D) The product must always be processed further if the final selling price is higher than the split-off selling price."
    ],
    correctAnswer: "B) The product should be processed further if the incremental revenue from further processing exceeds the incremental cost of further processing.",
    explanation: "Joint costs incurred before the split-off point are sunk and irrelevant. A further processing decision relies entirely on comparing the extra (incremental) revenue generated by further processing against the extra (incremental) costs of that further processing."
  },
  {
    id: "c15q5",
    chapter: 15,
    chapterTitle: "Decision Making Techniques",
    question: "A company manufactures multiple products using a scarce machine hour resource. It cannot meet total market demand and must outsource the production of one of its products to an external supplier. What is the optimal strategy for determining which product to outsource first?",
    options: [
      "A) Outsource the product with the highest variable cost.",
      "B) Outsource the product with the lowest total contribution margin.",
      "C) Outsource the product that has the lowest extra cost of external purchase per scarce machine hour saved.",
      "D) Outsource the product with the highest external purchase price."
    ],
    correctAnswer: "C) Outsource the product that has the lowest extra cost of external purchase per scarce machine hour saved.",
    explanation: "When dealing with a limiting factor and a make-or-buy option, the company must evaluate the cost penalty of buying externally versus making internally. The optimal ranking for outsourcing is based on finding the lowest extra cost incurred per unit of the limiting factor saved."
  },
  {
    id: "c15q6",
    chapter: 15,
    chapterTitle: "Decision Making Techniques",
    question: "A company has spare manufacturing capacity and receives a special one-off order at a price slightly below its normal selling price. Which of the following statements is true regarding the financial evaluation of this order?",
    options: [
      "A) The order should be rejected immediately to protect the normal market price.",
      "B) General fixed production overheads must be fully absorbed into the special order to calculate its true profitability.",
      "C) The order should be accepted if the incremental revenue exceeds the incremental variable costs and any specific fixed costs caused directly by the order.",
      "D) The spare capacity has an opportunity cost that must always be charged to the order."
    ],
    correctAnswer: "C) The order should be accepted if the incremental revenue exceeds the incremental variable costs and any specific fixed costs caused directly by the order.",
    explanation: "When there is spare capacity, no regular sales are displaced (no opportunity cost). Fixed costs remain unchanged and are therefore irrelevant. The order should be accepted if the extra revenue covers the extra (variable and specific fixed) costs, yielding a positive incremental contribution."
  },
  {
    id: "c15q7",
    chapter: 15,
    chapterTitle: "Decision Making Techniques",
    question: "Product X sells for Rs. 150 per unit and has a variable cost of Rs. 90 per unit. It takes 3 direct labour hours to produce one unit of Product X. If direct labour hours are the company's single limiting factor, what is the contribution per limiting factor for Product X?",
    options: [
      "A) Rs. 150 per hour",
      "B) Rs. 60 per hour",
      "C) Rs. 30 per hour",
      "D) Rs. 20 per hour"
    ],
    correctAnswer: "D) Rs. 20 per hour",
    explanation: "Contribution Margin per unit = Selling Price (Rs. 150) - Variable Cost (Rs. 90) = Rs. 60. Limiting factor = 3 labour hours per unit. Contribution per limiting factor = Rs. 60 / 3 hours = Rs. 20 per hour."
  },
  {
    id: "c15q8",
    chapter: 15,
    chapterTitle: "Decision Making Techniques",
    question: "Component Z can be manufactured in-house with a variable cost of Rs. 45 per unit. An external supplier has offered to provide Component Z for Rs. 50 per unit. If the company completely outsources the component, it can avoid Rs. 30,000 in specific fixed overheads. What is the net financial impact of outsourcing 5,000 units of Component Z?",
    options: [
      "A) Net loss of Rs. 25,000",
      "B) Net savings of Rs. 5,000",
      "C) Net savings of Rs. 30,000",
      "D) Net loss of Rs. 5,000"
    ],
    correctAnswer: "B) Net savings of Rs. 5,000",
    explanation: "Cost to Make internally = Variable costs (5,000 units × Rs. 45) + Specific Fixed Costs (Rs. 30,000) = Rs. 255,000. Cost to Buy externally = 5,000 units × Rs. 50 = Rs. 250,000. Since buying costs Rs. 250,000 and making costs Rs. 255,000, outsourcing results in a net savings of Rs. 5,000."
  },
  {
    id: "c15q9",
    chapter: 15,
    chapterTitle: "Decision Making Techniques",
    question: "Department M generates a total contribution margin of Rs. 100,000 but reports a net loss of Rs. 20,000 after absorbing Rs. 120,000 of fixed costs. If Department M is shut down, Rs. 90,000 of these fixed costs will continue to be incurred (unavoidable apportioned general costs). From a purely financial perspective, should Department M be shut down?",
    options: [
      "A) Yes, because it is making an accounting net loss of Rs. 20,000.",
      "B) Yes, because shutting it down will save Rs. 120,000 in fixed costs.",
      "C) No, because shutting it down will cause the company's overall profit to decrease by Rs. 70,000.",
      "D) No, because shutting it down will cause the overall profit to decrease by Rs. 100,000."
    ],
    correctAnswer: "C) No, because shutting it down will cause the company's overall profit to decrease by Rs. 70,000.",
    explanation: "Contribution margin lost if closed = Rs. 100,000. Fixed costs saved if closed = Total fixed costs (120,000) - Unavoidable costs (90,000) = Rs. 30,000 avoidable fixed costs. Net financial impact = 100,000 lost contribution - 30,000 saved fixed costs = Rs. 70,000 net decrease in total company profit."
  },
  {
    id: "c15q10",
    chapter: 15,
    chapterTitle: "Decision Making Techniques",
    question: "In the context of decision-making, what is a \"sunk cost\"?",
    options: [
      "A) A future cost that can be avoided by choosing a different alternative.",
      "B) A cost that has already been incurred as a result of past decisions and cannot be altered by future decisions.",
      "C) The benefit forgone when one course of action is chosen over another.",
      "D) A fixed cost that increases step-by-step with production volume."
    ],
    correctAnswer: "B) A cost that has already been incurred as a result of past decisions and cannot be altered by future decisions.",
    explanation: "Sunk costs are historical costs that have already been paid or committed to. Because they cannot be changed by any current or future decision, they are always totally irrelevant in short-term decision-making scenarios."
  },

  // Chapter 16: Inventory Management
  {
    id: "c16q1",
    chapter: 16,
    chapterTitle: "Inventory Management",
    question: "What is the primary objective of using the Economic Order Quantity (EOQ) model in inventory management?",
    options: [
      "A) To maximize the total quantity of inventory held in the warehouse.",
      "B) To calculate the exact safety stock required to eliminate all stock-outs.",
      "C) To minimize the sum of total annual holding costs and total annual ordering costs.",
      "D) To minimize the purchase price per unit of raw material."
    ],
    correctAnswer: "C) To minimize the sum of total annual holding costs and total annual ordering costs.",
    explanation: "The fundamental principle of the EOQ model is to find the perfect balance (the optimal order size) where the total annual costs of placing orders and the total annual costs of holding the inventory are minimized."
  },
  {
    id: "c16q2",
    chapter: 16,
    chapterTitle: "Inventory Management",
    question: "Which of the following costs is typically classified as an inventory \"holding cost\" (or carrying cost)?",
    options: [
      "A) The administrative cost of processing a supplier's invoice.",
      "B) The delivery and transportation costs of receiving goods from a supplier.",
      "C) The opportunity cost of capital tied up in the inventory.",
      "D) The cost of lost sales due to a stock-out."
    ],
    correctAnswer: "C) The opportunity cost of capital tied up in the inventory.",
    explanation: "Holding costs (or carrying costs) include expenses associated with storing inventory, such as warehouse rent, insurance, deterioration, and importantly, the opportunity cost (financing cost or interest) of the capital that is tied up in the stock."
  },
  {
    id: "c16q3",
    chapter: 16,
    chapterTitle: "Inventory Management",
    question: "Replica Limited has an annual demand of 162,000 units for a specialized component. The cost of placing one order is Rs. 27,000, and the annual holding cost per unit is Rs. 300. What is the Economic Order Quantity (EOQ) for this component?",
    options: [
      "A) 2,700 units",
      "B) 5,400 units",
      "C) 10,800 units",
      "D) 300 units"
    ],
    correctAnswer: "B) 5,400 units",
    explanation: "The EOQ formula is: sqrt((2 * Co * D) / Ch). In this case: sqrt((2 * 27,000 * 162,000) / 300) = sqrt(8,748,000,000 / 300) = sqrt(29,160,000) = 5,400 units."
  },
  {
    id: "c16q4",
    chapter: 16,
    chapterTitle: "Inventory Management",
    question: "Saturn Limited imports raw materials with the following usage and lead time parameters: Maximum usage is 5,000 units per month, minimum usage is 3,000 units per month, maximum lead time is 4 months, and minimum lead time is 2 months. Using the standard formula, what should be the Re-order Level (ROL) for this raw material?",
    options: [
      "A) 11,250 units",
      "B) 20,000 units",
      "C) 15,000 units",
      "D) 8,000 units"
    ],
    correctAnswer: "B) 20,000 units",
    explanation: "The standard formula for establishing a Re-order Level to prevent stock-outs under maximum expected conditions is: Maximum Usage × Maximum Lead Time. Calculation: 5,000 units × 4 months = 20,000 units."
  },
  {
    id: "c16q5",
    chapter: 16,
    chapterTitle: "Inventory Management",
    question: "Why do manufacturing companies maintain a \"Safety Stock\" (buffer stock)?",
    options: [
      "A) To increase the total number of orders placed in a year.",
      "B) To protect the business against stock-outs caused by unpredictable fluctuations in demand or delays in lead time.",
      "C) To take advantage of bulk purchase discounts offered by suppliers.",
      "D) To reduce the total holding costs of the warehouse."
    ],
    correctAnswer: "B) To protect the business against stock-outs caused by unpredictable fluctuations in demand or delays in lead time.",
    explanation: "Safety stock acts as a buffer. If demand during the lead time is higher than average, or if the supplier takes longer than average to deliver, the safety stock ensures production does not halt."
  },
  {
    id: "c16q6",
    chapter: 16,
    chapterTitle: "Inventory Management",
    question: "If a company's average weekly demand for a component is 90 units, the expected lead time is 2 weeks, and management has decided to maintain a safety stock of 50 units, what is the appropriate Re-order Level?",
    options: [
      "A) 180 units",
      "B) 230 units",
      "C) 140 units",
      "D) 90 units"
    ],
    correctAnswer: "B) 230 units",
    explanation: "When a safety stock is maintained, the Re-order Level is calculated as: (Average Demand × Average Lead Time) + Safety Stock. Calculation: (90 units × 2 weeks) + 50 units = 180 + 50 = 230 units."
  },
  {
    id: "c16q7",
    chapter: 16,
    chapterTitle: "Inventory Management",
    question: "When evaluating whether to accept a bulk purchase discount from a supplier, which of the following financial trade-offs must be assessed?",
    options: [
      "A) The decrease in total holding costs against the increase in total ordering costs.",
      "B) The savings in purchase price and ordering costs against the increase in total holding costs.",
      "C) The reduction in safety stock against the increase in the cost per unit.",
      "D) The increase in stock-out costs against the decrease in holding costs."
    ],
    correctAnswer: "B) The savings in purchase price and ordering costs against the increase in total holding costs.",
    explanation: "Buying in bulk reduces the unit purchase price and decreases the number of orders placed per year (saving ordering costs). However, because larger quantities arrive at once, the average inventory increases, which drives up holding costs. The decision relies on calculating if the savings outweigh the extra holding costs."
  },
  {
    id: "c16q8",
    chapter: 16,
    chapterTitle: "Inventory Management",
    question: "If a company uses the Economic Order Quantity (EOQ) model and also maintains a permanent safety stock, how is the \"average inventory level\" calculated for the year?",
    options: [
      "A) (EOQ ÷ 2) + Safety Stock",
      "B) EOQ + Safety Stock",
      "C) (Maximum Inventory Level + Minimum Inventory Level) ÷ 2",
      "D) Re-order Level - Safety Stock"
    ],
    correctAnswer: "A) (EOQ ÷ 2) + Safety Stock",
    explanation: "Under the EOQ model, average cycle inventory is half of the order quantity (EOQ/2). If a company also holds a permanent safety stock, this baseline amount is added to the average cycle stock to find the total average inventory level throughout the year."
  },
  {
    id: "c16q9",
    chapter: 16,
    chapterTitle: "Inventory Management",
    question: "Which of the following is an example of an \"ordering cost\" in inventory management?",
    options: [
      "A) Insurance premiums paid on the warehouse contents.",
      "B) Clerical and administrative costs of preparing and issuing a purchase order.",
      "C) Deterioration and obsolescence of stored raw materials.",
      "D) Variable overheads incurred during production."
    ],
    correctAnswer: "B) Clerical and administrative costs of preparing and issuing a purchase order.",
    explanation: "Ordering costs are the costs incurred every time an order is placed. This includes administrative costs, phone calls, documentation, expediting, and goods receiving/inspection costs."
  },
  {
    id: "c16q10",
    chapter: 16,
    chapterTitle: "Inventory Management",
    question: "Which of the following is a practical limitation or underlying assumption of the basic Economic Order Quantity (EOQ) model?",
    options: [
      "A) It assumes that the purchase price per unit remains constant regardless of the order size.",
      "B) It assumes that customer demand is highly seasonal and unpredictable.",
      "C) It assumes that lead times fluctuate wildly from order to order.",
      "D) It assumes that holding costs decrease proportionately as inventory levels rise."
    ],
    correctAnswer: "A) It assumes that the purchase price per unit remains constant regardless of the order size.",
    explanation: "The basic EOQ model relies on several rigid assumptions to work smoothly: demand is known and constant, lead time is known and constant, and the purchase price per unit does not change (i.e., it ignores bulk discounts)."
  },
  // Chapter 17: Mixed Practice Challenge I
  {
    id: "c17q1",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Standard Costing & Learning Curve) A company is introducing a new product and standard costs must be set. The first unit is expected to take 100 labour hours. The workforce is expected to follow an 80% learning curve. The standard labour rate is Rs. 50 per hour. During the first month, the company produces exactly 4 units, but the total actual labour hours worked were 270 hours. What is the Labour Efficiency Variance for the month?",
    options: [
      "A) Rs. 700 Adverse",
      "B) Rs. 2,500 Adverse",
      "C) Rs. 700 Favourable",
      "D) Rs. 500 Adverse"
    ],
    correctAnswer: "A) Rs. 700 Adverse",
    explanation: "Calculate the standard time for 4 units using the learning curve: Y=ax^b. b for 80% = log(0.8)/log(2)=-0.3219. Y=100*4^-0.3219 = 100*0.64 = 64 hours (Cumulative average time per unit). Total standard hours allowed for 4 units = 64*4 = 256 hours. Actual hours taken = 270 hours. Variance = (Standard Hours - Actual Hours) * Standard Rate = (256 - 270) * Rs. 50 = -Rs. 700 (Adverse, as actual time exceeded standard)."
  },
  {
    id: "c17q2",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Relevant Costing & Joint Products) Products Alpha and Beta are joint products emerging at a split-off point with total joint costs of Rs. 200,000. Product Alpha can be sold at the split-off point for Rs. 100,000. Alternatively, it can be processed further and sold for Rs. 125,000. The further processing department incurs costs of Rs. 40,000, which includes Rs. 10,000 of general factory overheads absorbed based on machine hours. What is the financially optimal decision regarding Product Alpha?",
    options: [
      "A) Process further, as it yields an incremental profit of Rs. 15,000.",
      "B) Sell at split-off, as further processing yields an incremental loss of Rs. 5,000.",
      "C) Process further, as the final sales value exceeds the relevant processing costs by Rs. 85,000.",
      "D) Sell at split-off, as the joint costs allocated to Alpha exceed its final sales value."
    ],
    correctAnswer: "B) Sell at split-off, as further processing yields an incremental loss of Rs. 5,000.",
    explanation: "Joint costs (Rs. 200,000) are sunk and irrelevant. Incremental Revenue = Rs. 125,000 (Final) - Rs. 100,000 (Split-off) = Rs. 25,000. Incremental Cost = Total further processing (Rs. 40,000) - Absorbed general overheads (Rs. 10,000 non-cash/unavoidable) = Rs. 30,000 relevant cost. Incremental Profit = 25,000 - 30,000 = (Rs. 5,000) Loss. It is better to sell at split-off."
  },
  {
    id: "c17q3",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(CVP Analysis & Limiting Factor) A company produces two products, X and Y. Product X yields a contribution of Rs. 40 per unit and requires 2 machine hours. Product Y yields a contribution of Rs. 50 per unit and requires 5 machine hours. Fixed costs are Rs. 100,000. Market demand for both products is unlimited, but the factory is restricted to a maximum of 4,000 machine hours. If the company aims to maximize profit, what will be the net financial result?",
    options: [
      "A) Net Profit of Rs. 80,000",
      "B) Net Profit of Rs. 60,000",
      "C) Net Loss of Rs. 20,000",
      "D) Net Loss of Rs. 60,000"
    ],
    correctAnswer: "C) Net Loss of Rs. 20,000",
    explanation: "Rank by limiting factor (Machine Hours). X: Rs. 40 / 2 hrs = Rs. 20 per hour. Y: Rs. 50 / 5 hrs = Rs. 10 per hour. Produce X to maximize profit. 4,000 hours / 2 hrs = 2,000 units of X. Total Contribution = 2,000 units * Rs. 40 = Rs. 80,000. Net Profit = Contribution (80,000) - Fixed Costs (100,000) = (Rs. 20,000) Loss."
  },
  {
    id: "c17q4",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Marginal vs. Absorption Costing & Inventory Flow) A manufacturing firm has no opening inventory. During the year, it produced 10,000 units and sold 8,000 units. The variable production cost is Rs. 50 per unit, and total fixed production overheads are Rs. 200,000. If the net profit calculated under the marginal costing system is Rs. 150,000, what would be the net profit under an absorption costing system?",
    options: [
      "A) Rs. 190,000",
      "B) Rs. 110,000",
      "C) Rs. 150,000",
      "D) Rs. 250,000"
    ],
    correctAnswer: "A) Rs. 190,000",
    explanation: "Fixed Overhead Absorption Rate (OAR) = Rs. 200,000 / 10,000 units = Rs. 20 per unit. Inventory change = Production (10,000) - Sales (8,000) = +2,000 units. Difference in profit = Change in inventory * OAR = 2,000 * Rs. 20 = Rs. 40,000. Because production > sales, Absorption Profit is higher. Absorption Profit = Marginal Profit (150,000) + 40,000 = Rs. 190,000."
  },
  {
    id: "c17q5",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Target Costing & Pricing) A company intends to launch a new product with a highly competitive target selling price of Rs. 500. The board of directors mandates a target profit margin of 20% on cost. Currently, the expected actual cost to manufacture the product is Rs. 430. What is the Target Cost Gap?",
    options: [
      "A) Rs. 30.00",
      "B) Rs. 13.33",
      "C) Rs. 16.67",
      "D) Rs. 0 (The expected cost is below the target cost)"
    ],
    correctAnswer: "B) Rs. 13.33",
    explanation: "The required margin is 20% on cost, meaning Sales = Cost * 1.20. Target Cost = Target Sales / 1.20 = Rs. 500 / 1.20 = Rs. 416.67. Cost Gap = Expected Cost (Rs. 430) - Target Cost (416.67) = Rs. 13.33."
  },
  {
    id: "c17q6",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Process Costing & Abnormal Loss) In Process 1, 5,000 kg of materials were input at a total cost of Rs. 50,000. Conversion costs incurred were Rs. 30,000. The normal loss is strictly estimated at 10% of the input, and the scrap value of the loss is Rs. 5 per kg. At the end of the period, the actual good output was exactly 4,400 kg. What is the value of the abnormal loss to be charged to the costing P&L?",
    options: [
      "A) Rs. 1,722",
      "B) Rs. 1,777",
      "C) Rs. 2,222",
      "D) Rs. 500"
    ],
    correctAnswer: "A) Rs. 1,722",
    explanation: "Normal loss = 10% of 5,000 = 500 kg. Expected output = 4,500 kg. Total Cost = 50k (Mat) + 30k (Conv) = Rs. 80,000. Scrap of normal loss = 500 * 5 = Rs. 2,500. Net Cost = 80,000 - 2,500 = Rs. 77,500. Cost per Equivalent Unit = 77,500 / 4,500 expected units = Rs. 17.222/kg. Actual output is 4,400, meaning Abnormal Loss is 100 kg. Value = 100 kg * 17.222 = Rs. 1,722."
  },
  {
    id: "c17q7",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Inventory Management & Safety Stock) A company’s annual demand for a component is 120,000 units (assume 12 equal months). The cost of placing an order is Rs. 500, and the annual holding cost per unit is Rs. 1.20. The supplier’s lead time is strictly 1 month. If management decides to hold a safety stock of 2,000 units to hedge against demand spikes, what is the Re-Order Level (ROL)?",
    options: [
      "A) 10,000 units",
      "B) 12,000 units",
      "C) 7,000 units",
      "D) 2,000 units"
    ],
    correctAnswer: "B) 12,000 units",
    explanation: "Average monthly demand = 120,000 / 12 = 10,000 units. Re-Order Level (ROL) = (Average Demand * Average Lead Time) + Safety Stock. ROL = (10,000 * 1 month) + 2,000 = 12,000 units."
  },
  {
    id: "c17q8",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Overheads & Simultaneous Equations) Service Department X incurs initial overheads of Rs. 40,000 and receives 20% of Service Department Y's costs. Service Department Y incurs initial overheads of Rs. 30,000 and receives 10% of Service Department X's costs. Using the simultaneous equation method, what are the total overheads of Department X before final apportionment to production?",
    options: [
      "A) Rs. 46,000",
      "B) Rs. 46,939",
      "C) Rs. 45,800",
      "D) Rs. 47,200"
    ],
    correctAnswer: "B) Rs. 46,939",
    explanation: "Equation 1: X = 40,000 + 0.2Y. Equation 2: Y = 30,000 + 0.1X. Substitute Y into Equation 1: X = 40,000 + 0.2(30,000 + 0.1X). X = 40,000 + 6,000 + 0.02X. 0.98X = 46,000. X = 46,000 / 0.98 = Rs. 46,938.77 (rounded to 46,939)."
  },
  {
    id: "c17q9",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Variance Analysis: Mix & Yield) A product requires a standard mix of two materials: 60% of Material A (Std price Rs. 10/kg) and 40% of Material B (Std price Rs. 15/kg). During the period, 1,000 kg of materials were input into the process in the following actual mix: 700 kg of Material A and 300 kg of Material B. What is the Material Mix Variance?",
    options: [
      "A) Rs. 500 Favourable",
      "B) Rs. 500 Adverse",
      "C) Rs. 1,000 Favourable",
      "D) Rs. 1,500 Favourable"
    ],
    correctAnswer: "A) Rs. 500 Favourable",
    explanation: "Standard mix for actual input (1,000 kg): Mat A = 600 kg, Mat B = 400 kg. Actual mix used: Mat A = 700 kg, Mat B = 300 kg. Difference: Mat A used 100 kg MORE (Adverse). Mat B used 100 kg LESS (Favourable). Variance A = -100 kg * Rs. 10 = -Rs. 1,000. Variance B = +100 kg * Rs. 15 = +Rs. 1,500. Net Mix Variance = 1,500 (Fav) - 1,000 (Adv) = Rs. 500 Favourable. (Because they used more of the cheaper material)."
  },
  {
    id: "c17q10",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Relevant Costing & Non-Continuous Materials) A special contract requires 500 kg of Material Z. The company currently holds 300 kg of Material Z in inventory, purchased years ago at Rs. 12/kg. Material Z is no longer in regular use and has no alternative use other than being sold as scrap for Rs. 10/kg. The current market replacement cost of Material Z is Rs. 15/kg. What is the total relevant material cost for the 500 kg needed for this contract?",
    options: [
      "A) Rs. 7,500",
      "B) Rs. 6,600",
      "C) Rs. 6,000",
      "D) Rs. 4,500"
    ],
    correctAnswer: "C) Rs. 6,000",
    explanation: "Total needed is 500 kg. For the 300 kg in inventory (no alternative use), the relevant cost is the opportunity cost of lost scrap value: 300 kg * Rs. 10 = Rs. 3,000. For the remaining 200 kg, the company must buy it at replacement cost: 200 kg * Rs. 15 = Rs. 3,000. Total relevant cost = 3,000 + 3,000 = Rs. 6,000."
  },
  {
    id: "c17q11",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(ABC vs. Traditional Costing) A factory uses traditional absorption based on machine hours. Total overheads are Rs. 500,000 and total machine hours are 10,000. Under an ABC analysis, it is discovered that Rs. 200,000 of the total overhead is strictly driven by machine setups (total factory setups = 200), and the remaining Rs. 300,000 is driven by machine hours. Product K uses 2,000 machine hours and requires 50 setups. What is the difference in the overhead allocated to Product K when shifting from Traditional to ABC?",
    options: [
      "A) Rs. 10,000 higher under ABC",
      "B) Rs. 10,000 lower under ABC",
      "C) Rs. 20,000 higher under ABC",
      "D) No difference"
    ],
    correctAnswer: "A) Rs. 10,000 higher under ABC",
    explanation: "Under Traditional: Blanket Rate = 500k / 10k hrs = Rs. 50/hr. K's allocation = 2,000 hrs * 50 = Rs. 100,000. Under ABC: Setup Rate = 200,000 / 200 = Rs. 1,000/setup. Machine Rate = 300,000 / 10,000 = Rs. 30/hr. K's allocation = (50 setups * 1,000) + (2,000 hrs * 30) = 50,000 + 60,000 = Rs. 110,000. Difference = 110k (ABC) - 100k (Trad) = Rs. 10,000 higher under ABC."
  },
  {
    id: "c17q12",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Decision Making: Make or Buy with Limiting Factor) A company lacks sufficient machine hours to meet demand and must outsource one of its components. Component A costs Rs. 40 to make (requiring 2 machine hours) and Rs. 50 to buy. Component B costs Rs. 60 to make (requiring 4 machine hours) and Rs. 75 to buy. To minimize the financial penalty, which component should be outsourced first?",
    options: [
      "A) Component A, because its external purchase price is lower.",
      "B) Component A, because it saves more machine hours.",
      "C) Component B, because the extra cost per machine hour saved is lower.",
      "D) Component B, because the absolute savings to make is higher."
    ],
    correctAnswer: "C) Component B, because the extra cost per machine hour saved is lower.",
    explanation: "Extra cost to buy Component A = 50 - 40 = Rs. 10. Savings = 2 hours. Extra cost per hour saved = 10 / 2 = Rs. 5/hr. Extra cost to buy Component B = 75 - 60 = Rs. 15. Savings = 4 hours. Extra cost per hour saved = 15 / 4 = Rs. 3.75/hr. Outsourcing B yields a smaller financial penalty per scarce hour saved."
  },
  {
    id: "c17q13",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(CVP Analysis & Multi-Product Break-even) A company sells a fixed bundle of 2 units of Product A and 1 unit of Product B. Product A has a selling price of Rs. 50 and a variable cost of Rs. 30. Product B has a selling price of Rs. 100 and a variable cost of Rs. 60. Total fixed costs are Rs. 200,000. If the company is currently generating Rs. 1,200,000 in total sales revenue, what is its Margin of Safety (in percentage)?",
    options: [
      "A) 41.67%",
      "B) 60.00%",
      "C) 58.33%",
      "D) 75.00%"
    ],
    correctAnswer: "C) 58.33%",
    explanation: "Contribution of bundle (2A + 1B) = 2(50-30) + 1(100-60) = 40 + 40 = Rs. 80. Revenue of bundle = 2(50) + 1(100) = Rs. 200. C/S Ratio = 80 / 200 = 40%. Break-even Sales = Fixed Costs (200k) / 0.40 = Rs. 500,000. Margin of Safety % = (Actual Sales - BE Sales) / Actual Sales = (1.2m - 0.5m) / 1.2m = 700k / 1.2m = 58.33%."
  },
  {
    id: "c17q14",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Standard Costing: Working Backwards) A company uses standard absorption costing. Budgeted fixed overheads were Rs. 300,000 and budgeted production was 15,000 units. The actual fixed overheads incurred were Rs. 310,000. If the Fixed Production Overhead Volume Variance was Rs. 20,000 Adverse, what was the actual number of units produced?",
    options: [
      "A) 14,000 units",
      "B) 16,000 units",
      "C) 15,500 units",
      "D) 13,500 units"
    ],
    correctAnswer: "A) 14,000 units",
    explanation: "Standard OAR = Budgeted Fixed OH / Budgeted Units = 300,000 / 15,000 = Rs. 20 per unit. Volume Variance = (Actual Units - Budgeted Units) * OAR. -20,000 (Adverse) = (Actual Units - 15,000) * 20. -1,000 = Actual Units - 15,000. Actual Units = 14,000."
  },
  {
    id: "c17q15",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Process Costing: FIFO Equivalent Units) At the start of the month, Work-In-Process was 2,000 units (60% complete as to conversion). During the month, 10,000 units were started. At the end of the month, 3,000 units remained in WIP (40% complete as to conversion). Assuming FIFO is used and materials are added at the beginning of the process, what are the Equivalent Units of Production for conversion costs?",
    options: [
      "A) 9,000 units",
      "B) 8,200 units",
      "C) 9,400 units",
      "D) 10,000 units"
    ],
    correctAnswer: "A) 9,000 units",
    explanation: "Under FIFO, equivalent units evaluate work done in the current period. Total output = 2,000 (Op) + 10,000 (Started) - 3,000 (Cl) = 9,000 units completed. Completed from Op WIP = 2,000 units * 40% (remaining to finish) = 800 EU. Started & Completed = 7,000 units * 100% = 7,000 EU. Closing WIP = 3,000 units * 40% (completed this period) = 1,200 EU. Total Conversion EU = 800 + 7,000 + 1,200 = 9,000 units."
  },
  {
    id: "c17q16",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Job Costing & Absorption) A specific job incurs prime costs of Rs. 60,000. It requires 500 direct labour hours in Department A and 300 machine hours in Department B. Department A absorbs overheads at Rs. 25 per labour hour, and Department B absorbs overheads at Rs. 40 per machine hour. Administrative overheads are strictly absorbed at 20% of the total factory (production) cost. What is the total cost of the job?",
    options: [
      "A) Rs. 101,400",
      "B) Rs. 84,500",
      "C) Rs. 108,000",
      "D) Rs. 96,500"
    ],
    correctAnswer: "A) Rs. 101,400",
    explanation: "Prime Cost = Rs. 60,000. Absorbed Overheads Dept A = 500 * 25 = Rs. 12,500. Absorbed Overheads Dept B = 300 * 40 = Rs. 12,000. Total Factory Cost = 60,000 + 12,500 + 12,000 = Rs. 84,500. Administrative Overheads = 20% of 84,500 = Rs. 16,900. Total Job Cost = 84,500 + 16,900 = Rs. 101,400."
  },
  {
    id: "c17q17",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Labour Costing: Premium Bonus Plan) A factory sets a standard time of 30 minutes to produce one unit. The standard basic wage is Rs. 80 per hour. An employee produces 100 units in a 40-hour work week. Under a premium bonus scheme, the employee is paid a bonus equal to 50% of the time saved, valued at the basic hourly rate. What is the total labour cost per unit produced by this employee?",
    options: [
      "A) Rs. 32.00",
      "B) Rs. 36.00",
      "C) Rs. 40.00",
      "D) Rs. 28.00"
    ],
    correctAnswer: "B) Rs. 36.00",
    explanation: "Standard time allowed for 100 units = 100 * 0.5 hours = 50 hours. Actual time taken = 40 hours. Time saved = 10 hours. Basic pay = 40 hours * Rs. 80 = Rs. 3,200. Bonus = 50% * 10 hours saved * Rs. 80 = Rs. 400. Total Earnings = 3,200 + 400 = Rs. 3,600. Labour Cost per unit = Rs. 3,600 / 100 units = Rs. 36.00."
  },
  {
    id: "c17q18",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Decision Making: Shut Down) Product Line Z generates sales revenue of Rs. 200,000 and incurs variable costs of Rs. 140,000. It is allocated Rs. 100,000 in fixed costs, resulting in a net loss of Rs. 40,000. If Product Line Z is shut down, Rs. 30,000 of its fixed costs (specific supervisor salaries) can be completely avoided, but the remaining Rs. 70,000 (general factory rent) must still be absorbed by other products. What is the true financial impact on the company of shutting down Product Z?",
    options: [
      "A) Profit increases by Rs. 40,000",
      "B) Profit increases by Rs. 30,000",
      "C) Profit decreases by Rs. 30,000",
      "D) Profit decreases by Rs. 60,000"
    ],
    correctAnswer: "C) Profit decreases by Rs. 30,000",
    explanation: "Contribution margin currently generated by Z = Sales (200,000) - VC (140,000) = Rs. 60,000. If Z is dropped, the company loses 60,000 in contribution but saves 30,000 in avoidable fixed costs. The remaining 70,000 fixed costs stay. Net impact = 60,000 lost cash inflow vs 30,000 saved cash outflow = Net profit decreases by Rs. 30,000."
  },
  {
    id: "c17q19",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Relevant Costing: Special Order Pricing with Spare Capacity Constraints) A factory produces 10,000 units currently (maximum capacity is 15,000 units). The regular selling price is Rs. 100, and variable costs are Rs. 60 per unit. A customer offers a special order for 6,000 units. To accept this entire order, the company must sacrifice some of its regular sales. What is the absolute minimum price per unit the company must charge for the special order to break even on the decision?",
    options: [
      "A) Rs. 60.00",
      "B) Rs. 66.67",
      "C) Rs. 100.00",
      "D) Rs. 75.00"
    ],
    correctAnswer: "B) Rs. 66.67",
    explanation: "Capacity is 15,000. Current is 10,000. Spare is 5,000. Special order is for 6,000 units. Thus, 1,000 units of regular sales must be sacrificed. Relevant Variable Cost for order = 6,000 units * Rs. 60 = Rs. 360,000. Opportunity cost of lost sales = 1,000 units * Contribution (100 - 60) = Rs. 40,000. Total Relevant Cost = 360,000 + 40,000 = Rs. 400,000. Minimum Price = 400,000 / 6,000 units = Rs. 66.67."
  },
  {
    id: "c17q20",
    chapter: 17,
    chapterTitle: "Mixed Practice Challenge I",
    question: "(Cost Flow & Interlocking Ledgers) In an interlocking cost ledger system, the opening balance of Raw Materials was Rs. 20,000. During the month, Rs. 100,000 of raw materials were purchased. At month-end, physical inventory was Rs. 15,000. During the month, Rs. 10,000 was issued as indirect materials to the factory floor, and a fire destroyed Rs. 5,000 worth of materials (abnormal loss). What is the total debit to the Work in Process (WIP) Control account for direct materials issued?",
    options: [
      "A) Rs. 105,000",
      "B) Rs. 90,000",
      "C) Rs. 95,000",
      "D) Rs. 85,000"
    ],
    correctAnswer: "B) Rs. 90,000",
    explanation: "Total raw materials removed from the store = Opening (20k) + Purchases (100k) - Closing (15k) = Rs. 105,000. Out of this 105k, Rs. 10,000 goes to Production Overheads (Indirect) and Rs. 5,000 goes to Abnormal Loss. Direct materials charged to WIP = Total (105k) - Indirect (10k) - Abnormal (5k) = Rs. 90,000."
  },
  // Chapter 18: Mixed Practice Challenge II
  {
    id: "c18q1",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Target Costing & Learning Curve) A company is developing a new specialized product with a target selling price of Rs. 2,000 per unit. The company requires a profit margin of 25% on sales. The first batch of 50 units will take 200 labour hours in total. The workforce is expected to follow a 90% learning curve (index = -0.152) until the 4th batch is completed. If the standard labour rate is Rs. 150 per hour and other variable costs total Rs. 800 per unit, what is the expected target cost gap for the first 4 batches (200 units)?",
    options: [
      "A) Rs. 54,000",
      "B) Rs. 4,200",
      "C) Rs. 21,200",
      "D) Rs. 0 (Expected cost is below target cost)"
    ],
    correctAnswer: "D) Rs. 0 (Expected cost is below target cost)",
    explanation: "Target Revenue for 200 units = 200 * Rs. 2,000 = Rs. 400,000. Target Profit (25% on sales) = Rs. 100,000. Total Target Cost = Rs. 300,000. Expected Cost Calculation: Learning curve for 4 batches (200 units): Y=ax^b. Y=200 hours*4^-0.152 = 200*0.81 = 162 hours per batch. Total expected hours for 4 batches = 162*4 = 648 hours. Labour cost = 648 hours*Rs. 150 = Rs. 97,200. Variable costs = 200 units*Rs. 800 = Rs. 160,000. Total Expected Cost = 97,200 + 160,000 = Rs. 257,200. Since expected cost (257,200) is lower than Target Cost (300,000), there is NO gap."
  },
  {
    id: "c18q2",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(CVP Analysis & Multi-Product Limiting Factor) Gamma Ltd produces two products, G1 and G2. G1 has a selling price of Rs. 150, variable cost of Rs. 90, and requires 3 machine hours. G2 has a selling price of Rs. 200, variable cost of Rs. 120, and requires 5 machine hours. Total fixed costs are Rs. 300,000. The maximum market demand is 8,000 units for G1 and 6,000 units for G2. If maximum machine hours available are 39,000, what is the maximum net profit Gamma Ltd can achieve?",
    options: [
      "A) Rs. 360,000",
      "B) Rs. 420,000",
      "C) Rs. 120,000",
      "D) Rs. 60,000"
    ],
    correctAnswer: "B) Rs. 420,000",
    explanation: "Rank products by CM per limiting factor. G1 CM = 60; CM/hr = 60/3 = Rs. 20/hr. G2 CM = 80; CM/hr = 80/5 = Rs. 16/hr. Priority: G1 first. G1 demand = 8,000 units * 3 hrs = 24,000 hrs. Remaining hours = 39,000 - 24,000 = 15,000 hrs. G2 production = 15,000 / 5 = 3,000 units. Total CM = (8,000 * 60) + (3,000 * 80) = 480k + 240k = Rs. 720,000. Net Profit = 720k - Fixed Costs (300k) = Rs. 420,000."
  },
  {
    id: "c18q3",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Marginal/Absorption Costing & Variance Analysis) Budgeted fixed overheads for the year were Rs. 500,000 based on a budgeted capacity of 25,000 units. Actual production was 22,000 units, while actual sales were 20,000 units. The net profit calculated under Marginal Costing was Rs. 350,000. The Fixed Overhead Expenditure Variance was Rs. 15,000 Favourable. What would be the net profit under Absorption Costing?",
    options: [
      "A) Rs. 390,000",
      "B) Rs. 310,000",
      "C) Rs. 405,000",
      "D) Rs. 375,000"
    ],
    correctAnswer: "A) Rs. 390,000",
    explanation: "OAR = 500k / 25k = Rs. 20/unit. Change in inventory = Production (22k) - Sales (20k) = +2,000 units. Profit diff = 2,000 * 20 = Rs. 40,000. Since inventory increased, Absorption profit is higher. Absorption Profit = 350k + 40k = Rs. 390,000. (Expenditure variance is a distractor for profit reconciliation)."
  },
  {
    id: "c18q4",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Relevant Costing & Inventory Valuation) A special contract requires 800 kg of Material Alpha. The company has 500 kg of Alpha in inventory, originally purchased for Rs. 40/kg. Alpha is used regularly in normal production. An additional 300 kg must be purchased. The current market replacement price is Rs. 55/kg. The inventory could be sold as scrap for Rs. 20/kg. What is the relevant cost of Material Alpha for this special contract?",
    options: [
      "A) Rs. 44,000",
      "B) Rs. 36,500",
      "C) Rs. 26,500",
      "D) Rs. 16,000"
    ],
    correctAnswer: "A) Rs. 44,000",
    explanation: "Since Material Alpha is in regular use, any quantity taken from inventory must be replaced for normal production. Therefore, historical cost and scrap value are irrelevant. The entire 800 kg must be valued at the current replacement cost: 800 kg * Rs. 55 = Rs. 44,000."
  },
  {
    id: "c18q5",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Relevant Costing & Labour Shortage) A special order requires 500 hours of skilled labour. The workforce is currently operating at full capacity. To execute this order, workers must be diverted from normal production where they earn a contribution margin of Rs. 60 per hour. The standard wage rate is Rs. 150 per hour. Alternatively, the company can hire temporary workers at Rs. 180 per hour, but they will require an existing supervisor to spend 50 hours overseeing them. The supervisor is paid Rs. 250 per hour and has spare capacity. What is the lowest relevant cost of labour for this special order?",
    options: [
      "A) Rs. 105,000",
      "B) Rs. 90,000",
      "C) Rs. 102,500",
      "D) Rs. 75,000"
    ],
    correctAnswer: "B) Rs. 90,000",
    explanation: "Option 1 (Divert): CM lost + Wages = (60+150)*500 = Rs. 105,000. Option 2 (Temp): Temp wages = 500*180 = Rs. 90,000. The supervisor's cost is sunk as they have spare capacity. Lowest cost = Rs. 90,000."
  },
  {
    id: "c18q6",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Inventory Management & Quantity Discounts) The annual demand for a raw material is 30,000 units. The ordering cost is Rs. 800 per order, and the holding cost is Rs. 12 per unit per year. The basic purchase price is Rs. 50 per unit. The supplier offers a 2% discount if the company orders in batches of 5,000 units. What is the net financial impact (savings or extra cost) of accepting the discount offer compared to ordering at the Economic Order Quantity (EOQ)?",
    options: [
      "A) Net savings of Rs. 8,400",
      "B) Net savings of Rs. 19,200",
      "C) Extra cost of Rs. 6,000",
      "D) Net savings of Rs. 25,200"
    ],
    correctAnswer: "B) Net savings of Rs. 19,200",
    explanation: "EOQ = sqrt(2*30,000*800/12) = 2,000 units. Total cost at EOQ: (30k/2k)*800 + (2k/2)*12 + 30k*50 = 12k + 12k + 1.5m = 1,524,000. Total cost at 5,000 batch: (30k/5k)*800 + (5k/2)*12 + 30k*49 = 4,800 + 30k + 1.47m = 1,504,800. Net savings = 1,524,000 - 1,504,800 = Rs. 19,200."
  },
  {
    id: "c18q7",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Process Costing: Weighted Average & Variances) Opening WIP is 2,000 units (40% complete for conversion) valued at Rs. 12,000 for conversion. During the month, 12,000 units were started. Conversion costs incurred were Rs. 96,400. Closing WIP is 3,000 units (60% complete for conversion). Normal loss is 10% of total input (1,400 units). What is the cost per equivalent unit for conversion using the Weighted Average method?",
    options: [
      "A) Rs. 8.03",
      "B) Rs. 9.51",
      "C) Rs. 9.19",
      "D) Rs. 10.04"
    ],
    correctAnswer: "B) Rs. 9.51",
    explanation: "Total output = 2,000+12,000-1,400-3,000 = 9,600 units. EU (Conv) = 9,600 (Completed) + 1,800 (Cl WIP: 3,000*60%) = 11,400. Total Conv Cost = 12,000 + 96,400 = 108,400. Cost per EU = 108,400 / 11,400 = Rs. 9.51."
  },
  {
    id: "c18q8",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Joint Products & By-Products with NRV) A joint process incurs Rs. 400,000 and yields 10,000 kg of M, 5,000 kg of N, and 2,000 kg of By-product B (NRV Rs. 10/kg). NRV of M is Rs. 50/kg at split-off. N needs Rs. 20/kg further processing to sell for Rs. 80/kg. Using NRV method, what Joint Cost is allocated to Product N?",
    options: [
      "A) Rs. 114,000",
      "B) Rs. 142,500",
      "C) Rs. 126,667",
      "D) Rs. 150,000"
    ],
    correctAnswer: "B) Rs. 142,500",
    explanation: "Net Joint Cost = 400,000 - (2,000*10) = 380,000. NRV(M) = 10k*50 = 500k. NRV(N) = 5k*(80-20) = 300k. Total NRV = 800k. Allocation to N = (300k/800k)*380,000 = Rs. 142,500."
  },
  {
    id: "c18q9",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Job Costing & Interlocking Ledgers) Opening WIP was Rs. 40,000. During the period, materials of Rs. 150,000 and labour of Rs. 90,000 were charged. Overheads are applied at 120% of direct labour. Completed jobs transferred to finished goods were Rs. 320,000. What is the closing balance of the WIP Control Account?",
    options: [
      "A) Rs. 50,000",
      "B) Rs. 68,000",
      "C) Rs. 108,000",
      "D) Rs. 120,000"
    ],
    correctAnswer: "B) Rs. 68,000",
    explanation: "Total Debits = 40k (Op) + 150k (Mat) + 90k (Lab) + 108k (OH: 120% of 90k) = 388,000. Closing WIP = 388k - 320k (Transferred) = Rs. 68,000."
  },
  {
    id: "c18q10",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(CVP Analysis: Target Profit after Tax) A company sells for Rs. 800 (VC Rs. 480). Fixed costs are Rs. 1,500,000. Tax rate 30%. How many units must be sold for a profit after tax of Rs. 1,050,000?",
    options: [
      "A) 4,688 units",
      "B) 7,969 units",
      "C) 9,375 units",
      "D) 8,500 units"
    ],
    correctAnswer: "C) 9,375 units",
    explanation: "Target PBT = 1,050,000 / 0.7 = 1,500,000. CM per unit = 800 - 480 = 320. Units = (1.5m Fixed + 1.5m PBT) / 320 = 9,375 units."
  },
  {
    id: "c18q11",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Standard Costing: Missing Figures & Yield Variance) A chemical process mixes Material X (Std: 60%, Rs. 20/kg) and Material Y (Std: 40%, Rs. 30/kg). Standard yield is 90% of input. During the period, 10,000 kg were input, producing 8,800 kg of good output. What is the Material Yield Variance?",
    options: [
      "A) Rs. 4,800 Adverse",
      "B) Rs. 5,280 Adverse",
      "C) Rs. 4,400 Adverse",
      "D) Rs. 4,800 Favourable"
    ],
    correctAnswer: "A) Rs. 4,800 Adverse",
    explanation: "Standard Yield for 10,000 kg input = 9,000 kg. Actual Yield = 8,800 kg. Yield Variance = (8,800 - 9,000) * Std Mix Cost per input kg. Std Mix Cost = (0.6*20 + 0.4*30) = Rs. 24/kg input. Variance = 200 kg * 24 = Rs. 4,800 Adverse."
  },
  {
    id: "c18q12",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Decision Making: Shut Down) Dept Z contribution Rs. 200,000. It is allocated Rs. 280,000 fixed overheads (Rs. 150,000 avoidable). What is the net impact on overall profit if Z is shut down?",
    options: [
      "A) Profit will increase by Rs. 80,000",
      "B) Profit will decrease by Rs. 50,000",
      "C) Profit will decrease by Rs. 200,000",
      "D) Profit will increase by Rs. 150,000"
    ],
    correctAnswer: "B) Profit will decrease by Rs. 50,000",
    explanation: "Impact = Contribution lost vs Avoidable Fixed Costs saved = 200,000 lost - 150,000 saved = Rs. 50,000 decrease."
  },
  {
    id: "c18q13",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Labour Variances & High Day-Rate) Std labour rate Rs. 100/hr, 2 hrs per unit. New rate Rs. 120/hr. In first month, 5,000 units produced using 9,000 actual hours. What are the Labour Efficiency and Rate Variances?",
    options: [
      "A) Efficiency: 100,000 Fav / Rate: 180,000 Adv",
      "B) Efficiency: 120,000 Fav / Rate: 180,000 Adv",
      "C) Efficiency: 100,000 Fav / Rate: 100,000 Adv",
      "D) Efficiency: 120,000 Adv / Rate: 180,000 Fav"
    ],
    correctAnswer: "A) Efficiency: 100,000 Fav / Rate: 180,000 Adv",
    explanation: "Efficiency = (10,000 Std hrs - 9,000 Act hrs) * 100 = 100,000 Fav. Rate = (100 Std - 120 Act) * 9,000 = 180,000 Adv."
  },
  {
    id: "c18q14",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Activity-Based Costing & Product Profitability) Total OH Rs. 800,000 (Inspection: 300k, 600 total; Machine: 500k, 10,000 total). Product Omega uses 2,000 MH and 250 inspections. What is the difference (ABC - Traditional)?",
    options: [
      "A) ABC allocates Rs. 65,000 more to Omega",
      "B) ABC allocates Rs. 125,000 more to Omega",
      "C) ABC allocates Rs. 35,000 less to Omega",
      "D) No difference"
    ],
    correctAnswer: "A) ABC allocates Rs. 65,000 more to Omega",
    explanation: "Traditional: (800k/10k)*2k = 160,000. ABC: (300k/600)*250 + (500k/10k)*2k = 125,000 + 100,000 = 225,000. Diff = 225k - 160k = Rs. 65,000 higher under ABC."
  },
  {
    id: "c18q15",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Relevant Costing & Further Processing under Capacity Constraints) Joint Product Alpha sells for Rs. 50 at split-off or Rs. 80 as Super-Alpha (incremental processing Rs. 25, 2 machine hours). Opportunity cost of MH is Rs. 4/hr (loss of contribution). Should Alpha be processed further?",
    options: [
      "A) Yes, because incremental revenue (Rs. 30) exceeds incremental processing cost (Rs. 25).",
      "B) Yes, because the net benefit is Rs. 5 per unit.",
      "C) No, because total relevant incremental cost (Rs. 33) exceeds incremental revenue (Rs. 30).",
      "D) No, because joint costs must be allocated first."
    ],
    correctAnswer: "C) No, because total relevant incremental cost (Rs. 33) exceeds incremental revenue (Rs. 30).",
    explanation: "Incremental Revenue = 80 - 50 = Rs. 30. Total Incremental Cost = VC (25) + Opp Cost (2 hrs * 4 = 8) = Rs. 33. Since cost (33) > revenue (30), the processing results in a net loss of Rs. 3 per unit."
  },
  {
    id: "c18q16",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Inventory Management: Safety Stock & Lead Time Probabilities) Consumption is 100 units/day. Lead time is normally 5 days (60%), 6 days (30%), or 7 days (10%). If ROL is set at maximum expected demand, what is the average buffer (safety) stock held?",
    options: [
      "A) 200 units",
      "B) 150 units",
      "C) 700 units",
      "D) 0 units"
    ],
    correctAnswer: "B) 150 units",
    explanation: "ROL = Max Demand during Lead Time = 100 * 7 = 700 units. Average Lead Time = (5*0.6 + 6*0.3 + 7*0.1) = 5.5 days. Average Demand during LT = 100 * 5.5 = 550 units. Safety Stock = ROL - Avg Demand during LT = 700 - 550 = 150 units."
  },
  {
    id: "c18q17",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Simultaneous Equations & Factory Overheads) Dept P costs = Rs. 100,000 + 10% Q. Dept Q costs = Rs. 80,000 + 20% P. What is the total cost of Dept P?",
    options: [
      "A) Rs. 108,000",
      "B) Rs. 110,204",
      "C) Rs. 102,040",
      "D) Rs. 180,000"
    ],
    correctAnswer: "B) Rs. 110,204",
    explanation: "P = 100k + 0.1Q; Q = 80k + 0.2P. P = 100k + 0.1(80k + 0.2P) = 108k + 0.02P. 0.98P = 108,000. P = 110,204."
  },
  {
    id: "c18q18",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Standard Costing: Working Backwards for Material Price) Price Variance is Rs. 12,000 Adverse. Usage Variance is Rs. 8,000 Favourable. Std cost for actual production was Rs. 200,000 (Std Qty = 10,000 kg). What was the actual price paid per kg?",
    options: [
      "A) Rs. 18.75",
      "B) Rs. 21.25",
      "C) Rs. 20.00",
      "D) Rs. 19.20"
    ],
    correctAnswer: "B) Rs. 21.25",
    explanation: "Std Price (SP) = 200k/10k = Rs. 20. Usage Variance = (10k - AQ) * 20 = 8,000 Fav -> 400 = 10k - AQ -> AQ = 9,600 kg. Price Variance = (20 - AP) * 9,600 = -12,000 Adv -> -1.25 = 20 - AP -> AP = Rs. 21.25."
  },
  {
    id: "c18q19",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(CVP Analysis: Margin of Safety Ratio) C/S ratio 40%. Fixed costs Rs. 600,000. Operating at Margin of Safety of 25%. What is the actual sales revenue?",
    options: [
      "A) Rs. 2,000,000",
      "B) Rs. 1,500,000",
      "C) Rs. 2,400,000",
      "D) Rs. 1,875,000"
    ],
    correctAnswer: "A) Rs. 2,000,000",
    explanation: "BE Sales = 600k / 0.4 = 1,500,000. MoS % = (Actual - BE) / Actual. 0.25 = (Actual - 1.5m) / Actual -> 0.75 Actual = 1.5m -> Actual Sales = Rs. 2,000,000."
  },
  {
    id: "c18q20",
    chapter: 18,
    chapterTitle: "Mixed Practice Challenge II",
    question: "(Make or Buy & Shutdown Combination) VC to make Rs. 40. Buy price Rs. 48. Making internally incurs avoidable fixed costs of Rs. 60,000 and lost rental income of Rs. 50,000. At what volume is the company indifferent?",
    options: [
      "A) 7,500 units",
      "B) 11,000 units",
      "C) 13,750 units",
      "D) 6,000 units"
    ],
    correctAnswer: "C) 13,750 units",
    explanation: "48Q (Buy) = 40Q (Make) + 60,000 (Fixed) + 50,000 (Opp Cost). 8Q = 110,000. Q = 13,750 units."
  }
];
