// scripts/import-users-to-dynamo.js

import fs from "fs";
import AWS from "aws-sdk";

// Load clean user data
const users = JSON.parse(fs.readFileSync("../users-plain-deep.json", "utf8"));

// Configure DynamoDB
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });

async function importUsers() {
  for (const user of users) {
    const params = {
      TableName: "Users",
        Item: {
        ...user,
        user_id: String(user.user_id), // ✅ force to string
        created_at: user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
        }
    };

    try {
      await ddb.put(params).promise();
      console.log(`✅ Imported user: ${user.user_id}`);
    } catch (err) {
      console.error(`❌ Failed to import user ${user.user_id}:`, err.message);
    }
  }
}

importUsers();
