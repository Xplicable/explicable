import { DynamoDBClient, DeleteItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const REGION = process.env.AWS_REGION;
const TABLE_NAME = "Users";
const TARGET_EMAIL = process.argv[2]; // e.g., hardcider601@gmail.com
const KEEP_USER_ID = process.argv[3]; // e.g., c10bd570-...

const client = new DynamoDBClient({ region: REGION });

async function deleteExtras() {
  try {
    const scan = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: TARGET_EMAIL }
      }
    });

    const result = await client.send(scan);
    const users = result.Items;

    if (!users || users.length === 0) {
      console.log(`❌ No users found for email ${TARGET_EMAIL}`);
      return;
    }

    let deleted = 0;

    for (const user of users) {
      const userId = user.user_id.S;

      if (userId !== KEEP_USER_ID) {
        await client.send(new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { user_id: { S: userId } }
        }));

        console.log(`🗑 Deleted user_id: ${userId}`);
        deleted++;
      }
    }

    console.log(`✅ Deleted ${deleted} extra user(s). Kept: ${KEEP_USER_ID}`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

deleteExtras();
