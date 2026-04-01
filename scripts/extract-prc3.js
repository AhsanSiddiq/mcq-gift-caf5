const fs = require('fs');
const path = require('path');

function getTxtFiles(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getTxtFiles(fullPath));
      } else if (file.endsWith('.txt') || file.endsWith('.log')) {
        results.push(fullPath);
      }
    });
  } catch (e) {}
  return results;
}

const searchDir = "C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\";
const files = getTxtFiles(searchDir);

let allQuestions = [];
let seenIds = new Set();

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    let objStart = content.indexOf('{');
    while (objStart !== -1) {
      let bracketCount = 0;
      let objEnd = -1;
      let inString = false;
      let escapeNext = false;

      for (let i = objStart; i < content.length; i++) {
        const char = content[i];
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        if (char === '"') {
          inString = !inString;
        }
        
        if (!inString) {
          if (char === '{') bracketCount++;
          if (char === '}') bracketCount--;
          if (bracketCount === 0) {
            objEnd = i;
            break;
          }
        }
      }

      if (objEnd !== -1) {
        const jsonStr = content.substring(objStart, objEnd + 1);
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.id && parsed.question && Array.isArray(parsed.options)) {
            if (!seenIds.has(parsed.id)) {
              if (
                    parsed.chapterTitle === "Nature of Business" || 
                    parsed.chapterTitle === "Ownership of Business" ||
                    parsed.chapterTitle === "Organization of Business" ||
                    parsed.chapterTitle === "Sources of Business Finance" ||
                    parsed.chapterTitle === "Information Systems" ||
                    parsed.chapterTitle === "Business Ethics" ||
                    parsed.chapterTitle === "Concepts of Branding and Marketing" ||
                    parsed.chapterTitle === "Human Resource Strategies"
              ) {
                allQuestions.push(parsed);
                seenIds.add(parsed.id);
              }
            }
          }
        } catch (e) {
          // invalid json snippet, ignore
        }
        objStart = content.indexOf('{', objStart + 1);
      } else {
        break;
      }
    }
  } catch(e) {}
});

// Clean AI patterns if any
allQuestions = allQuestions.map(q => {
  if (q.explanation) {
    q.explanation = q.explanation.replace(/\s*\[[\d,\s-]+\]/g, '').trim();
  }
  return q;
});

console.log(`Extracted ${allQuestions.length} valid PRC 3 Business questions.`);
const outPath = path.join(__dirname, 'data', 'prc3-biz.json');
fs.writeFileSync(outPath, JSON.stringify(allQuestions, null, 2));
console.log(`Saved to ${outPath}`);
