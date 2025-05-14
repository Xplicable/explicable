// normalize-nodes.cjs
const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('nodes-backup.json', 'utf8'));
const flat = raw.Items.map(item => {
  const flatItem = {};
  for (const key in item) {
    const val = item[key];
    flatItem[key] = val.S ?? val.N ?? val.BOOL ?? val.M ?? val.L ?? null;
  }
  return flatItem;
});

fs.writeFileSync('nodes-flat.json', JSON.stringify(flat, null, 2));
console.log(`✅ Flattened ${flat.length} items to nodes-flat.json`);
