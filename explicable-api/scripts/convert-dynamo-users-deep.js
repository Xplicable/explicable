// scripts/convert-dynamo-users-deep.js

import fs from "fs";

function unwrap(value) {
  if ("S" in value) return value.S;
  if ("N" in value) return Number(value.N);
  if ("BOOL" in value) return value.BOOL;
  if ("NULL" in value) return null;
  if ("L" in value) return value.L.map(unwrap);
  if ("M" in value) {
    const obj = {};
    for (const key in value.M) {
      obj[key] = unwrap(value.M[key]);
    }
    return obj;
  }
  return value; // fallback, in case of unrecognized type
}

const raw = JSON.parse(fs.readFileSync("users-backup.json", "utf8"));

const converted = raw.Items.map((item) => {
  const flat = {};
  for (const key in item) {
    flat[key] = unwrap(item[key]);
  }
  return flat;
});

fs.writeFileSync("users-plain-deep.json", JSON.stringify(converted, null, 2));
console.log(`✅ Deep-converted ${converted.length} users to users-plain-deep.json`);
