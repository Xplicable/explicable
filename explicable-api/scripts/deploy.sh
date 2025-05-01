#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# ───── Deployment Config ────────────────────────────────────────────────
AWS_PROFILE="explicable-deployer"
STAGE="dev"
REGION="us-east-2"

# ───── Deploy via Serverless ────────────────────────────────────────────
echo "🚀 Deploying 'explicable-api' using profile '$AWS_PROFILE'..."
sls deploy --stage "$STAGE" --region "$REGION" --aws-profile "$AWS_PROFILE"
echo "✅ Deployment completed."

# ───── Fetch API Gateway ID ─────────────────────────────────────────────
echo "🔎 Fetching API Gateway ID..."
API_ID=$(aws apigateway get-rest-apis \
  --region "$REGION" \
  --profile "$AWS_PROFILE" \
  --query "items[?name=='explicable-api-dev'].id" \
  --output text)

if [ -z "$API_ID" ]; then
  echo "❌ Could not find API Gateway ID. Check if the API name matches 'explicable-api-dev'."
  exit 1
fi

# ───── Build Base URL ───────────────────────────────────────────────────
EXPLICABLE_BASE_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com/${STAGE}"

# ───── Fetch API Key ID ─────────────────────────────────────────────────
echo "🔎 Fetching API Key ID..."
API_KEY_ID=$(aws apigateway get-api-keys \
  --region "$REGION" \
  --profile "$AWS_PROFILE" \
  --query "items[?name=='explicable-api-key'].id" \
  --output text)

if [ -z "$API_KEY_ID" ]; then
  echo "❌ Could not find API Key. Check if the API key name matches 'explicable-api-key'."
  exit 1
fi

# ───── Fetch API Key Value ──────────────────────────────────────────────
echo "🔎 Fetching API Key value..."
EXPLICABLE_API_KEY=$(aws apigateway get-api-key \
  --api-key "$API_KEY_ID" \
  --region "$REGION" \
  --profile "$AWS_PROFILE" \
  --include-value \
  --query "value" \
  --output text)

# ───── Output Deployment Info ───────────────────────────────────────────
echo ""
echo "🎯 Deployment Information:"
echo "EXPLICABLE_BASE_URL=${EXPLICABLE_BASE_URL}"
echo "EXPLICABLE_API_KEY=${EXPLICABLE_API_KEY}"
echo ""

# ───── Optional: Write to .env file ─────────────────────────────────────
# Uncomment below to overwrite .env automatically
# echo "AWS_REGION=$REGION" > .env
# echo "EXPLICABLE_BASE_URL=$EXPLICABLE_BASE_URL" >> .env
# echo "EXPLICABLE_API_KEY=$EXPLICABLE_API_KEY" >> .env
# echo "✅ .env file updated."
