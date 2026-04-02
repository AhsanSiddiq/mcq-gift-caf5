const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. URL:', !!supabaseUrl, 'Key:', !!supabaseKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('subject_id', 'prc-2');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Total PRC-2 questions in DB: ${count}`);

    // Get chapter breakdown
    const { data, error: e2 } = await supabase
        .from('questions')
        .select('chapter_number, chapter_title')
        .eq('subject_id', 'prc-2')
        .order('chapter_number');

    if (e2) { console.error('Error:', e2); return; }

    const chapMap = {};
    for (const q of data || []) {
        const k = q.chapter_number;
        if (!chapMap[k]) chapMap[k] = { title: q.chapter_title, count: 0 };
        chapMap[k].count++;
    }

    console.log('\nChapter breakdown:');
    for (const [ch, info] of Object.entries(chapMap).sort((a, b) => Number(a[0]) - Number(b[0]))) {
        console.log(`  Ch ${ch} (${info.title}): ${info.count} questions`);
    }
}

check().catch(console.error);
