import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'scripts', 'caf4-bl.json');
const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Business Law: Chapters 1-15
const blQuestions = questions.filter((q: any) => q.chapter <= 15);

// Company Law: Chapters 16-25
const clQuestions = questions.filter((q: any) => q.chapter > 15).map((q: any) => ({
  ...q,
  chapter: q.chapter - 15 // Re-number 16-25 as 1-10
}));

fs.writeFileSync(
  path.join(process.cwd(), 'scripts', 'caf4-bl-portion.json'),
  JSON.stringify(blQuestions, null, 2)
);

fs.writeFileSync(
  path.join(process.cwd(), 'scripts', 'caf4-cl-portion.json'),
  JSON.stringify(clQuestions, null, 2)
);

console.log(`Split complete:`);
console.log(`Business Law: ${blQuestions.length} questions`);
console.log(`Company Law: ${clQuestions.length} questions`);
