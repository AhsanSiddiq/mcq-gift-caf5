# Question bank JSON spec (global expansion)

File: scripts/data/global/<subject_id>.json

{
  "subject_id": "acca-fa",
  "questions": [
    {
      "id": "acca-fa-c01-q001",          // <subject_id>-c<chapter 2 digits>-q<3 digits>, unique
      "chapter": 1,                       // integer, 1..N following the syllabus order
      "topic": "The context and purpose of financial reporting", // chapter title, identical for every question in the chapter
      "question_text": "…",               // plain text; use \n for line breaks; no HTML, no markdown
      "options": { "A": "…", "B": "…", "C": "…", "D": "…" },
      "correct": "B",                     // exactly one of A-D
      "explanation": "…",                 // 2-6 sentences; for numericals show the full working
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}

Quality rules (non-negotiable):
- 100% ORIGINAL wording and numbers. Never copy or closely paraphrase questions from the exam body, Kaplan, BPP, OpenTuition or any publisher (copyright).
- Exactly one defensibly correct option. Distractors must be plausible (common mistakes), never joke answers, never "all of the above"/"none of the above".
- Every calculation must be worked step by step in the explanation and RE-COMPUTED by you before writing. Round consistently and state the rounding.
- Spread the correct letter roughly evenly across A-D.
- No time-sensitive facts (current rates, budgets, latest amendments, named office holders). Concepts and standards only.
- Accounting content follows IFRS / IAS terminology as examined by that body; ICAI content follows ICAI syllabus terminology.
- Mix: ~35% easy, ~45% medium, ~20% hard. Mix of conceptual and numerical as the real paper does.
- Valid JSON (UTF-8). Validate with: node -e "JSON.parse(require('fs').readFileSync(process.argv[1]))" <file>
