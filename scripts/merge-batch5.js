const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'data');
const parts = ['prc3-batch5-part1.json', 'prc3-batch5-part2.json'];

let allData = [];

for (const part of parts) {
  const filePath = path.join(dir, part);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  allData = allData.concat(data);
}

fs.writeFileSync(path.join(dir, 'prc3-batch5.json'), JSON.stringify(allData, null, 2));
console.log(`Merged ${allData.length} questions into prc3-batch5.json`);
