// Lambda handler for Post Confirmation (Cognito User Pool Trigger)
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION });

export const handler = async (event) => {
  // ✅ Debug: log the incoming event from Cognito
  console.log("EVENT:", JSON.stringify(event, null, 2));

  // Extract attributes from event (works for federated and local users)
  const userAttributes = event.request.userAttributes || {};

  // Get values
  const { email, email_verified, given_name, family_name, picture, sub } = userAttributes;
  const user_id = sub; // sub is the Cognito (or Google) UUID

  // ✅ Upsert user info into DynamoDB Users table
  if (user_id && email) {
    try {
      const now = new Date().toISOString();
      await ddb.send(new UpdateItemCommand({
        TableName: "Users",
        Key: { user_id: { S: user_id } },
        UpdateExpression: `
          SET email = :email,
              email_verified = :email_verified,
              first_name = :first_name,
              last_name = :last_name,
              username = :username,
              profile_photo_url = :picture,
              updated_at = :now
        `,
        ExpressionAttributeValues: {
          ":email": { S: email },
          ":email_verified": { BOOL: email_verified === "true" || email_verified === true },
          ":first_name": { S: given_name || "" },
          ":last_name": { S: family_name || "" },
          ":username": { S: email.split("@")[0] },
          ":picture": { S: picture || "" },
          ":now": { S: new Date().toISOString() }
        },
        ReturnValues: "NONE"
      }));
      console.log(`✅ User ${user_id} upserted to DynamoDB`);
    } catch (err) {
      console.error("❌ Error upserting user in DynamoDB:", err);
    }
  } else {
    console.warn("⚠️ Missing user_id or email — DynamoDB not updated.");
  }

  // Must return event
  return event;
};
