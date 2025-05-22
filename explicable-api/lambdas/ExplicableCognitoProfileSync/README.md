# Cognito Post Confirmation Lambda

This Lambda function is triggered by AWS Cognito **PostConfirmation** events. It is used to populate the `Users` table in DynamoDB with user attributes obtained during sign-up or federated login (e.g., via Google).

---

## 📦 What It Does

- Reads user attributes from `event.request.userAttributes`
- Upserts the following fields into the DynamoDB `Users` table:
  - `email`
  - `email_verified`
  - `first_name` (from `given_name`)
  - `last_name` (from `family_name`)
  - `username` (derived from email)
  - `profile_photo_url`
  - `updated_at` (timestamp)
- Logs each operation to CloudWatch

---

## 🧠 Requirements

- ✅ A DynamoDB table named `Users` with `user_id` as the primary key
- ✅ The Lambda must have `PutItem`/`UpdateItem` permissions on the table
- ✅ Environment variable `AWS_REGION` must be set

---

## 🛠 Environment Variables

| Variable     | Description                |
|--------------|----------------------------|
| `AWS_REGION` | AWS region (e.g., `us-east-2`) |

---

## 📁 Project Structure

