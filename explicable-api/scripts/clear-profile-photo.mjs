import { DynamoDBClient, UpdateItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const REGION = process.env.AWS_REGION;
const TABLE_NAME = "Users";
const TARGET_EMAIL = "hardcider601@gmail.com";

const client = new DynamoDBClient({ region: REGION });

async function clearProfilePhoto() {
  try {
    // Step 1: Query to find the user_id based on email
    const query = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "email-index", // assuming you have a GSI on "email"
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: TARGET_EMAIL }
      }
    });

    const result = await client.send(query);
    const user = result.Items?.[0];

    if (!user) {
      console.error(`❌ No user found with email ${TARGET_EMAIL}`);
      return;
    }

    const userId = user.user_id.S;

    // Step 2: Remove the profile_photo_url attribute
    const update = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: { user_id: { S: userId } },
      UpdateExpression: "REMOVE profile_photo_url",
    });

    await client.send(update);
    console.log(`✅ Cleared profile_photo_url for ${TARGET_EMAIL} (user_id: ${userId})`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

clearProfilePhoto();
