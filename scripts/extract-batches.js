const fs = require('fs');
const path = require('path');

const overviewFile = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\fa64de90-e6f6-4d94-9bea-22c906f9b95b\\.system_generated\\logs\\overview.txt';

try {
  const content = fs.readFileSync(overviewFile, 'utf8');
  console.log("Loaded overview.txt. Length:", content.length);

  // Look for Batch 2 markers
  const b2Index = content.indexOf('batch 2');
  if (b2Index === -1) {
    console.log("Could not find 'batch 2' marker");
    process.exit(1);
  }

  // Find the JSON array inside batch 2
  const arrayStart = content.indexOf('[', b2Index);
  let arrayEnd = -1;
  let braces = 0;
  let started = false;

  for (let i = arrayStart; i < content.length; i++) {
    if (content[i] === '[') {
      braces++;
      started = true;
    } else if (content[i] === ']') {
      braces--;
    }
    
    if (started && braces === 0) {
      arrayEnd = i + 1;
      break;
    }
  }

  if (arrayEnd !== -1) {
    let rawJsonStr = content.substring(arrayStart, arrayEnd);
    console.log("Found JSON array for Batch 2. Length:", rawJsonStr.length);
    if (!rawJsonStr.trim().endsWith(']')) {
       rawJsonStr += ']';
    }
    fs.writeFileSync('scripts/data/batch2_extracted.json', rawJsonStr);
    console.log('Successfully saved to scripts/data/batch2_extracted.json');
    try {
       JSON.parse(rawJsonStr);
       console.log("JSON is perfectly valid!");
    } catch(e) {
       console.log("JSON parse error (likely truncated in logs too):", e.message);
    }
  } else {
    // maybe truncated?
    let rawJsonStr = content.substring(arrayStart);
    console.log("Could not find end of array. Length extracted:", rawJsonStr.length);
    fs.writeFileSync('scripts/data/batch2_extracted.txt', rawJsonStr);
    console.log("Saved raw text instead.");
  }
} catch (e) {
  console.error("Error:", e);
}
