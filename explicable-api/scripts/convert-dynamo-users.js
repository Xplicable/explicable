// scripts/convert-dynamo-users.js

import fs from "fs";

// Load raw DynamoDB JSON from backup
const raw = JSON.parse(fs.readFileSync("users-backup.json", "utf8"));

// Convert DynamoDB types (e.g., { "S": "value" } or { "N": "123" }) to plain values
const converted = raw.Items.map((item) => {
  const flat = {};
  for (const key in item) {
    const val = item[key];
    if ("S" in val) flat[key] = val.S;
    else if ("N" in val) flat[key] = Number(val.N);
    else if ("BOOL" in val) flat[key] = val.BOOL;
    else if ("M" in val) flat[key] = val.M; // Leave nested maps untouched
    else flat[key] = val;
  }
  return flat;
});

// Write to a new plain JSON file
fs.writeFileSync("users-plain.json", JSON.stringify(converted, null, 2));
console.log(`✅ Converted ${converted.length} users to plain JSON`);
