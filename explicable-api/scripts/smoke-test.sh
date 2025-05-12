#!/bin/bash

set -e

# Load .env variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env file not found in current directory"
  exit 1
fi

echo "🔹 Smoke Test: Starting Explicable API Checks"
echo ""

# Check required variables
if [ -z "$EXPLICABLE_BASE_URL" ] || [ -z "$EXPLICABLE_API_KEY" ]; then
  echo "❌ EXPLICABLE_BASE_URL or EXPLICABLE_API_KEY is not set."
  exit 1
fi

# --------------------------
# Create test user
# --------------------------
echo "📤 Creating test user..."
curl -s -X POST "$EXPLICABLE_BASE_URL/users" \
  -H "x-api-key: $EXPLICABLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1001,
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "mobile_number": "+1234567890",
    "time_zone": "America/Los_Angeles"
  }' | jq

# --------------------------
# Create decision tree
# --------------------------
echo ""
echo "📤 Creating test decision tree..."
TREE_RESPONSE=$(curl -s -X POST "$EXPLICABLE_BASE_URL/decisionTrees" \
  -H "x-api-key: $EXPLICABLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": 1001,
    "category_id": "cat001",
    "subcategory_id": "sub001",
    "title": "Hello Search",
    "description": "This is a test"
  }')

echo "$TREE_RESPONSE" | jq
TREE_ID=$(echo "$TREE_RESPONSE" | jq -r '.tree_id')

# --------------------------
# Search Decision Trees
# --------------------------
echo ""
echo "🔍 Smoke Testing Decision Tree Search Endpoint"

SEARCH_RESPONSE=$(curl -s -X POST "$EXPLICABLE_BASE_URL/decisionTrees/search" \
  -H "x-api-key: $EXPLICABLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "query": { "match_all": {} } }')

echo "Raw search response:"
echo "$SEARCH_RESPONSE" | jq

# ✅ Check for flattened 'hits' array
EXPECTED_TITLE="Hello Search"

echo ""
echo "🔍 Verifying search hit structure and match..."

HITS_TYPE=$(echo "$SEARCH_RESPONSE" | jq -r '.hits | type')
HIT_COUNT=$(echo "$SEARCH_RESPONSE" | jq '.hits | length')
MATCHING_TITLE=$(echo "$SEARCH_RESPONSE" | jq -r --arg title "$EXPECTED_TITLE" '.hits[] | select(.title == $title) | .title')

if [ "$HITS_TYPE" = "array" ] && [ -n "$MATCHING_TITLE" ]; then
  echo "✅ Search returned $HIT_COUNT hits, and at least one title matched '$EXPECTED_TITLE'."
else
  echo "❌ ERROR: Search response is invalid or did not return expected content."
  exit 1
fi

# --------------------------
# Cleanup
# --------------------------
echo ""
echo "🧹 Deleting test tree..."
curl -s -X DELETE "$EXPLICABLE_BASE_URL/decisionTrees/$TREE_ID" \
  -H "x-api-key: $EXPLICABLE_API_KEY" | jq

echo "🧹 Deleting test user..."
curl -s -X DELETE "$EXPLICABLE_BASE_URL/users/1001" \
  -H "x-api-key: $EXPLICABLE_API_KEY" | jq

# --------------------------
# Done
# --------------------------
echo ""
echo "✅ All smoke tests completed successfully."
read -p "Press Enter to close..."
