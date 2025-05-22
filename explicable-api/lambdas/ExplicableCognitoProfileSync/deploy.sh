#!/bin/bash

set -e

ZIP_NAME="function.zip"
LAMBDA_NAME="ExplicableCognitoProfileSync"

echo "🔄 Installing dependencies..."
npm install --omit=dev

echo "📦 Zipping Lambda..."
zip -r $ZIP_NAME handler.mjs node_modules package.json > /dev/null

echo "🚀 Deploying to Lambda function: $LAMBDA_NAME"
aws lambda update-function-code \
  --function-name $LAMBDA_NAME \
  --zip-file fileb://$ZIP_NAME \
  --region us-east-2

echo "✅ Deployment complete."
