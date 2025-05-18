// delete-user-by-email.mjs
import { CognitoIdentityProviderClient, ListUsersCommand, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const REGION = process.env.AWS_REGION;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

// ✅ Get email from command-line args
const emailArg = process.argv[2];

if (!emailArg) {
  console.error("❌ Please provide an email as an argument.");
  console.error("Usage: node scripts/delete-user-by-email.mjs user@example.com");
  process.exit(1);
}

const client = new CognitoIdentityProviderClient({ region: REGION });

async function deleteUserByEmail(email) {
  try {
    // Step 1: Look up user by email
    const listCommand = new ListUsersCommand({
      UserPoolId: USER_POOL_ID,
      Filter: `email = "${email}"`,
      Limit: 1
    });

    const listResult = await client.send(listCommand);
    const user = listResult.Users?.[0];

    if (!user) {
      console.log(`❌ No user found with email: ${email}`);
      return;
    }

    const username = user.Username;

    // Step 2: Delete user by Cognito Username
    const deleteCommand = new AdminDeleteUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: username
    });

    await client.send(deleteCommand);
    console.log(`✅ Deleted user "${username}" (email: ${email}) from Cognito.`);
  } catch (err) {
    console.error("❌ Error deleting user:", err);
  }
}

deleteUserByEmail(emailArg);
