const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const SUBJECT_ID = 'prc-2';

async function importBatch3() {
    console.log('Starting PRC 2 Batch 3 import (5 parts, ~105 MCQs)...');

    const batchParts = ['p1', 'p2', 'p3', 'p4', 'p5'];
    let totalImported = 0;

    for (const part of batchParts) {
        const filePath = path.join(process.cwd(), 'scripts', 'data', `prc2-batch3-${part}.json`);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found, skipping: ${filePath}`);
            continue;
        }
        const mcqs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`Processing batch3-${part} (${mcqs.length} MCQs)...`);

        for (const q of mcqs) {
            const qId = crypto.randomUUID();

            const { error: qError } = await supabase.from('questions').insert({
                id: qId,
                level: 'prc',
                subject_id: SUBJECT_ID,
                topic: q.chapterTitle,
                chapter: q.chapter,
                question_text: q.question,
                explanation: q.explanation,
                difficulty: 'Medium',
                is_active: true,
            });

            if (qError) {
                console.error(`Error inserting question ${q.id}:`, qError.message);
                continue;
            }

            const cleanCorrect = q.correctAnswer.trim();
            const opts = q.options.map((opt) => {
                const key = opt.substring(0, 1);
                const text = opt.includes(') ') ? opt.split(') ').slice(1).join(') ').trim() : opt.substring(3).trim();
                return {
                    question_id: qId,
                    option_key: key,
                    option_text: text,
                    is_correct: opt.trim() === cleanCorrect,
                };
            });

            const { error: optError } = await supabase.from('options').insert(opts);

            if (optError) {
                console.error(`Error inserting options for ${q.id}:`, optError.message);
            } else {
                totalImported++;
                if (totalImported % 10 === 0) console.log(`  Progress: ${totalImported} imported...`);
            }
        }
        console.log(`  Finished batch3-${part}. Running total: ${totalImported}`);
    }

    console.log(`\n✅ Done! Successfully imported ${totalImported} MCQs for PRC 2 Batch 3.`);
}

importBatch3().catch(console.error);
