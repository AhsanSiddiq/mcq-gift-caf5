const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Map: chapter number -> correct topic name
const CORRECTIONS = {
  2:  'Coordinate System and Its Application',
  4:  'Linear Programming',
  5:  'Financial Mathematics',
  6:  'Discounted Cash Flows',
  11: 'Probability Concepts',
  12: 'Probability Distributions',
};

async function fixChapterNames() {
  for (const [chapter, correctTopic] of Object.entries(CORRECTIONS)) {
    const chapterNum = Number(chapter);
    const { data, error, count } = await supabase
      .from('questions')
      .update({ topic: correctTopic })
      .eq('subject_id', 'prc-2')
      .eq('chapter', chapterNum)
      .select('id');

    if (error) {
      console.error(`❌ Chapter ${chapter}: ${error.message}`);
    } else {
      console.log(`✅ Chapter ${chapter} → "${correctTopic}" — ${data.length} rows updated`);
    }
  }
  console.log('\nDone. Verifying...');

  const { data } = await supabase
    .from('questions')
    .select('chapter, topic')
    .eq('subject_id', 'prc-2');

  const map = {};
  data.forEach(r => { if (!map[r.chapter]) map[r.chapter] = r.topic; });
  Object.keys(map).sort((a, b) => Number(a) - Number(b)).forEach(c =>
    console.log(`  Chapter ${c}: ${map[c]}`)
  );
}

fixChapterNames().catch(console.error);
