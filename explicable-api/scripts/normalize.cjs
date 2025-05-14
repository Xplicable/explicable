// normalize-decisionTrees.js
const fs = require('fs');

// Load backup from file
const raw = JSON.parse(fs.readFileSync('decisionTrees-backup.json', 'utf8'));

// Flatten DynamoDB wire-format fields
const flat = raw.Items.map(item => {
  const flatItem = {};
  for (const key in item) {
    const val = item[key];
    flatItem[key] = val.S ?? val.N ?? val.BOOL ?? val.M ?? val.L ?? null;
  }
  return flatItem;
});

// Save as normalized
fs.writeFileSync('decisionTrees-flat.json', JSON.stringify(flat, null, 2));
console.log(`✅ Flattened ${flat.length} items to decisionTrees-flat.json`);
