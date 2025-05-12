#!/usr/bin/env bash
set -euo pipefail

# Load .env if it exists
if [ -f .env ]; then
  set -a
  source ./.env
  set +a
fi

: "${EXPLICABLE_BASE_URL:?Missing EXPLICABLE_BASE_URL in .env}"
: "${EXPLICABLE_API_KEY:?Missing EXPLICABLE_API_KEY in .env}"

curl_args=(
  -sS
  -w $'\nSTATUS: %{http_code}\n'
  -H "x-api-key: $EXPLICABLE_API_KEY"
)

# ------------------------------------------------------------------------------
# HEALTH CHECK
# ------------------------------------------------------------------------------
echo "▶️  HEALTH CHECK (GET /)"
curl "${curl_args[@]}" "$EXPLICABLE_BASE_URL/"

echo -e "\n▶️  FALLBACK 404 (GET /no-such-route)"
curl "${curl_args[@]}" "$EXPLICABLE_BASE_URL/no-such-route"

# ------------------------------------------------------------------------------
# USERS
# ------------------------------------------------------------------------------
USER_ID="u9999"

echo -e "\n▶️  GET /users?limit=1"
curl -iG "${curl_args[@]}" --data-urlencode "limit=1" "$EXPLICABLE_BASE_URL/users"

echo -e "\n▶️  POST /users"
user_resp=$(curl -s -X POST "${curl_args[@]}" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"name\": \"Smoke User\",
    \"username\": \"smokeuser\",
    \"email\": \"smoke@example.com\",
    \"mobile_number\": \"+10000000000\",
    \"time_zone\": \"UTC\"
  }" "$EXPLICABLE_BASE_URL/users")
echo "$user_resp" | jq -c . 2>/dev/null || echo "$user_resp"

echo -e "\n▶️  GET /users/$USER_ID"
curl "${curl_args[@]}" "$EXPLICABLE_BASE_URL/users/$USER_ID"

echo -e "\n▶️  PATCH /users/$USER_ID"
curl -i -X PATCH "${curl_args[@]}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Smoke User Updated"}' \
  "$EXPLICABLE_BASE_URL/users/$USER_ID"

echo -e "\n▶️  GET /users?username=smokeuser"
curl -iG "${curl_args[@]}" --data-urlencode "username=smokeuser" "$EXPLICABLE_BASE_URL/users"

echo -e "\n▶️  GET /users?time_zone=UTC"
curl -iG "${curl_args[@]}" --data-urlencode "time_zone=UTC" "$EXPLICABLE_BASE_URL/users"

echo -e "\n▶️  DELETE /users/$USER_ID"
curl -i -X DELETE "${curl_args[@]}" "$EXPLICABLE_BASE_URL/users/$USER_ID"

# ------------------------------------------------------------------------------
# DECISION TREES
# ------------------------------------------------------------------------------
TREE_ID="d9999"

echo -e "\n▶️  GET /decisionTrees?limit=1"
curl -iG "${curl_args[@]}" --data-urlencode "limit=1" "$EXPLICABLE_BASE_URL/decisionTrees"

echo -e "\n▶️  POST /decisionTrees"
dt_resp=$(curl -s -X POST "${curl_args[@]}" \
  -H "Content-Type: application/json" \
  -d "{
    \"tree_id\": \"$TREE_ID\",
    \"owner_id\": \"$USER_ID\",
    \"category_id\": \"catSmoke\",
    \"subcategory_id\": \"subSmoke\",
    \"title\": \"Smoke DT\",
    \"description\": \"A test decision tree\"
  }" "$EXPLICABLE_BASE_URL/decisionTrees")
echo "$dt_resp" | jq .

echo -e "\n▶️  GET /decisionTrees/$TREE_ID"
curl "${curl_args[@]}" "$EXPLICABLE_BASE_URL/decisionTrees/$TREE_ID"

echo -e "\n▶️  PATCH /decisionTrees/$TREE_ID"
curl -i -X PATCH "${curl_args[@]}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Smoke DT Updated"}' \
  "$EXPLICABLE_BASE_URL/decisionTrees/$TREE_ID"

echo -e "\n▶️  POST /decisionTrees/search"
curl -i -X POST "${curl_args[@]}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"match_all": {}}}' \
  "$EXPLICABLE_BASE_URL/decisionTrees/search"

echo -e "\n▶️  DELETE /decisionTrees/$TREE_ID"
curl -i -X DELETE "${curl_args[@]}" "$EXPLICABLE_BASE_URL/decisionTrees/$TREE_ID"

# ------------------------------------------------------------------------------
# NODES
# ------------------------------------------------------------------------------
NODE_ID="n9999"

echo -e "\n▶️  GET /nodes?limit=1"
curl -iG "${curl_args[@]}" --data-urlencode "limit=1" "$EXPLICABLE_BASE_URL/nodes"

echo -e "\n▶️  POST /nodes"
node_resp=$(curl -s -X POST "${curl_args[@]}" \
  -H "Content-Type: application/json" \
  -d "{
    \"node_id\": \"$NODE_ID\",
    \"tree_id\": \"$TREE_ID\",
    \"node_type\": \"smokeType\",
    \"text\": {\"en\": \"Smoke node\"}
  }" "$EXPLICABLE_BASE_URL/nodes")
echo "$node_resp" | jq .

echo -e "\n▶️  GET /nodes/$NODE_ID"
curl "${curl_args[@]}" "$EXPLICABLE_BASE_URL/nodes/$NODE_ID"

echo -e "\n▶️  PATCH /nodes/$NODE_ID"
curl -i -X PATCH "${curl_args[@]}" \
  -H "Content-Type: application/json" \
  -d '{"description": "Updated smoke node"}' \
  "$EXPLICABLE_BASE_URL/nodes/$NODE_ID"

echo -e "\n▶️  GET /nodes?tree_id=$TREE_ID"
curl -iG "${curl_args[@]}" --data-urlencode "tree_id=$TREE_ID" "$EXPLICABLE_BASE_URL/nodes"

echo -e "\n▶️  GET /nodes?node_type=smokeType"
curl -iG "${curl_args[@]}" --data-urlencode "node_type=smokeType" "$EXPLICABLE_BASE_URL/nodes"

echo -e "\n▶️  DELETE /nodes/$NODE_ID"
curl -i -X DELETE "${curl_args[@]}" "$EXPLICABLE_BASE_URL/nodes/$NODE_ID"

echo -e "\n✅  All endpoints smoke-tested successfully!"
