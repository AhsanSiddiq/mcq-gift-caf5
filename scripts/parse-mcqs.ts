import fs from 'fs';
import path from 'path';

function getRawText() {
    const file1 = path.join(__dirname, 'caf3-raw.txt');
    const file2 = path.join(__dirname, 'caf3-raw-part2.txt');
    const file3 = path.join(__dirname, 'caf3-raw-part3.txt');
    
    let text = '';
    if (fs.existsSync(file1)) {
        text += fs.readFileSync(file1, 'utf-8') + '\n\n';
    }
    if (fs.existsSync(file2)) {
        text += fs.readFileSync(file2, 'utf-8') + '\n\n';
    }
    if (fs.existsSync(file3)) {
        text += fs.readFileSync(file3, 'utf-8') + '\n\n';
    }
    return text;
}

const rawText = getRawText();

function parseMCQs(text: string) {
    const chapters = text.split(/Chapter /);
    const allMCQs: any[] = [];
    
    for (const chText of chapters.slice(1)) {
        const lines = chText.trim().split("\n");
        const firstLine = lines[0];
        const chNum = parseInt(firstLine.split(":")[0]);
        const chTitle = firstLine.split(":")[1].trim();
        
        // Split by Q[0-9]+\. or just [0-9]+\. if it's at the start of a line
        const qBlocks = chText.split(/\nQ?\d+\./);
        
        let currentTopic = chTitle;
        
        for (const rawBlock of qBlocks.slice(1)) {
            let qBlock = rawBlock.trim();
            if (!qBlock) continue;

            const potentialTopic = qBlock.match(/Topic:\s*(.*)/);
            if (potentialTopic) {
                currentTopic = potentialTopic[1].trim();
                qBlock = qBlock.replace(/Topic:.*/, '').trim();
            }
            
            const optionsStart = qBlock.match(/\s[A-D]\)/);
            if (!optionsStart) continue;
                 
            let questionText = qBlock.substring(0, optionsStart.index).trim();
            questionText = questionText.replace(/^[\s\n-]+/, '');
            
            const optionsText = qBlock.substring(optionsStart.index!).trim();
            
            const parts = optionsText.split(/([A-D]\))/);
            const options: string[] = [];
            let correctLetter = "";
            let explanation = "";
            
            for (let j = 1; j < parts.length; j += 2) {
                const optLetter = parts[j];
                const optContentAndRest = parts[j+1];
                
                if (optLetter === 'D)') {
                    const ansExplMatch = optContentAndRest.match(/(.*?)Correct Answer:\s*([A-D])\s*Explanation:\s*(.*?)\s*(\.|\s)*$/s);
                    const ansExplMatch2 = optContentAndRest.match(/(.*?)Correct Answer:\s*([A-D])\s*Explanation:\s*(.*)/s);
                    
                    const match = ansExplMatch || ansExplMatch2;
                    
                    if (match) {
                        const optText = match[1].trim();
                        correctLetter = match[2].trim();
                        explanation = match[3].trim().replace(/\s*\.\s*$/, '');
                        options.push(`${optLetter} ${optText}`);
                    } else {
                        options.push(`${optLetter} ${optContentAndRest.trim()}`);
                    }
                } else {
                    options.push(`${optLetter} ${optContentAndRest.trim()}`);
                }
            }

            if (!correctLetter) {
                const ansMatch = qBlock.match(/Correct Answer:\s*([A-D])/);
                if (ansMatch) correctLetter = ansMatch[1];
            }
            
            if (!explanation) {
                 const explMatch = qBlock.match(/Explanation:\s*(.*?)\s*(\.|\s)*$/s);
                 if (explMatch) explanation = explMatch[1].trim();
            }

            let correctAnswerText = "";
            for (const o of options) {
                if (o.startsWith(correctLetter + ")")) {
                    correctAnswerText = o;
                    break;
                }
            }

            allMCQs.push({
                chapter: chNum,
                chapterTitle: currentTopic,
                question: questionText,
                options: options,
                correctAnswer: correctAnswerText,
                explanation: explanation
            });
        }
    }
    
    const chCounts: any = {};
    for (const m of allMCQs) {
        const ch = m.chapter;
        chCounts[ch] = (chCounts[ch] || 0) + 1;
        m.id = `caf3c${ch}q${chCounts[ch]}`;
    }
        
    return allMCQs;
}

const mcqs = parseMCQs(rawText);
fs.writeFileSync(path.join(__dirname, 'caf3-dsr.json'), JSON.stringify(mcqs, null, 2));

const counts: any = {};
for (const m of mcqs) {
    counts[m.chapter] = (counts[m.chapter] || 0) + 1;
}
console.log(`Successfully parsed ${mcqs.length} MCQs.`);
console.table(counts);
