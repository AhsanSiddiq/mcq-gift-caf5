const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\a93cea6b-fbd7-4ca2-9466-79a67fcb40a9\\.system_generated\\logs\\overview.txt';
const logData = fs.readFileSync(logPath, 'utf8');

// The user message starts with: "now back to prc 3\n\nagain this is business portion\n\n{"
const startIndex = logData.lastIndexOf('now back to prc 3');
if (startIndex === -1) {
  console.log("Could not find start index.");
  process.exit(1);
}

// Find the first { after the start index
const firstBraceIndex = logData.indexOf('{', startIndex);
if (firstBraceIndex === -1) {
  console.log("Could not find first brace.");
  process.exit(1);
}

// We need to extract until the specific end of the JSON block
const endToken = '"chapterTitle": "Human Resource Strategies",\n    "question": "A newly hired software engineer spends their first two days learning about the company\'s culture, office rules, and safety regulations before beginning their actual job duties. What is this familiarization process called?",\n    "options": [\n      "A) Downsizing",\n      "B) Job rotation",\n      "C) Formal recruitment",\n      "D) Induction / Orientation"\n    ],\n    "correctAnswer": "D) Induction / Orientation",\n    "explanation": "Induction (or orientation) is the process of familiarizing new employees with the organization\'s rules, culture, and regulations so they can integrate smoothly into the workplace."\n  }';

const endIndex = logData.lastIndexOf(endToken);
if (endIndex === -1) {
  console.log("Could not find end index.");
  process.exit(1);
}

const extractedJsonRegexStr = logData.substring(firstBraceIndex, endIndex + endToken.length);

// Parse the extracted text as a JSON array by wrapping it in []
let finalJsonStr = '[' + extractedJsonRegexStr + ']';

try {
  const parsedItems = JSON.parse(finalJsonStr);
  console.log(`Successfully parsed ${parsedItems.length} items`);
  fs.writeFileSync('e:\\CMA\\MCQ Gift\\mcq-gift\\scripts\\data\\prc3-batch3.json', JSON.stringify(parsedItems, null, 2));
  console.log('Saved to prc3-batch3.json');
} catch (e) {
  console.error("JSON parse error:", e);
}
