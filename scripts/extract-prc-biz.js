const fs = require('fs');
const path = require('path');

const logFile = "C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\a93cea6b-fbd7-4ca2-9466-79a67fcb40a9\\.system_generated\\logs\\overview.txt";
const logContent = fs.readFileSync(logFile, 'utf8');

// Find the last occurrence of "now prc 2 in this we need to do like caf 4"
const userMsgIndex = logContent.lastIndexOf("now prc 2 in this we need to do like caf 4");
if (userMsgIndex === -1) {
    console.error("Could not find user message in logs.");
    process.exit(1);
}

const afterMsg = logContent.substring(userMsgIndex);
// Extract everything inside the outermost array brackets [...]
const startBracket = afterMsg.indexOf('[');
const endBracket = afterMsg.lastIndexOf(']');

if (startBracket === -1 || endBracket === -1) {
    // If it's not enclosed in [], let's find the first { and last } and wrap in []
    const firstBrace = afterMsg.indexOf('{');
    const lastBrace = afterMsg.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonStr = '[' + afterMsg.substring(firstBrace, lastBrace + 1) + ']';
        try {
            const parsed = JSON.parse(jsonStr);
            const outFile = path.join(__dirname, 'data', 'prc-business.json');
            fs.writeFileSync(outFile, JSON.stringify(parsed, null, 2));
            console.log(`Successfully extracted and saved ${parsed.length} questions to ${outFile}`);
        } catch (e) {
            console.error("Failed to parse extracted JSON:", e);
        }
    } else {
        console.error("Could not find JSON structure in user message.");
    }
} else {
    // Has brackets
    const jsonStr = afterMsg.substring(startBracket, endBracket + 1);
    try {
        const parsed = JSON.parse(jsonStr);
        const outFile = path.join(__dirname, 'data', 'prc-business.json');
        fs.writeFileSync(outFile, JSON.stringify(parsed, null, 2));
        console.log(`Successfully extracted and saved ${parsed.length} questions to ${outFile}`);
    } catch (e) {
        console.error("Failed to parse extracted JSON:", e);
    }
}
