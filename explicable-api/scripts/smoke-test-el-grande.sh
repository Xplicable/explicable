#!/usr/bin/env bash
set -euo pipefail

# ─── Load .env ────────────────────────────────────────────────────────────────
if [[ -f .env ]]; then
  set -a; source .env; set +a
else
  echo "❌ .env file not found"
  exit 1
fi

: "${EXPLICABLE_BASE_URL:?Must set EXPLICABLE_BASE_URL}"
: "${EXPLICABLE_API_KEY:?Must set EXPLICABLE_API_KEY}"

curl_args=(-sS -H "x-api-key: $EXPLICABLE_API_KEY")
failures=0

# ─── Reusable status checker ──────────────────────────────────────────────────
check() {
  local label="$1"
  local method="$2"
  local url="$3"
  local data="${4:-}"
  local expected="${5:-2}"  # Default to any 2xx
  local extra_args=()
  local status

  echo -e "\n▶️  $label ($method $url)"

  if [[ -n "$data" ]]; then
    extra_args=(-H "Content-Type: application/json" -d "$data")
    status=$(curl -o /dev/null -w "%{http_code}" -X "$method" "${curl_args[@]}" "${extra_args[@]}" "$url")
  else
    status=$(curl -o /dev/null -w "%{http_code}" -X "$method" "${curl_args[@]}" "$url")
  fi

  if [[ "$expected" == "2" && "$status" =~ ^2 ]]; then
    echo "✅ STATUS: $status"
  elif [[ "$status" == "$expected" ]]; then
    echo "✅ STATUS: $status (as expected)"
  else
    echo "❌ STATUS: $status (expected $expected)"
    failures=$((failures + 1))
  fi
}

# ─── Health + fallback ────────────────────────────────────────────────────────
check "Health check" GET "$EXPLICABLE_BASE_URL/"
check "Fallback route (should 404)" GET "$EXPLICABLE_BASE_URL/no-such-route" "" 404

# ─── Users CRUD ───────────────────────────────────────────────────────────────
USER_ID=9999
check "Create user" POST "$EXPLICABLE_BASE_URL/users" \
  '{"user_id":9999,"name":"Smoke User","username":"smokeuser","email":"smoke@example.com","mobile_number":"+10000000000","time_zone":"UTC"}' 201

check "Get user" GET "$EXPLICABLE_BASE_URL/users/$USER_ID"
check "Update user" PATCH "$EXPLICABLE_BASE_URL/users/$USER_ID" \
  '{"name":"Smoke User Updated"}'
check "Delete user" DELETE "$EXPLICABLE_BASE_URL/users/$USER_ID"

# ─── DecisionTrees CRUD + Search ──────────────────────────────────────────────
check "List decision trees" GET "$EXPLICABLE_BASE_URL/decisionTrees?limit=1"

TREE_ID=$(curl -s -X POST "${curl_args[@]}" \
  -H "Content-Type: application/json" \
  -d '{"owner_id":9999,"category_id":"catSmoke","subcategory_id":"subSmoke","title":"Smoke DT","description":"desc"}' \
  "$EXPLICABLE_BASE_URL/decisionTrees" | jq -r .tree_id)

check "Get tree" GET "$EXPLICABLE_BASE_URL/decisionTrees/$TREE_ID"
check "Update tree" PATCH "$EXPLICABLE_BASE_URL/decisionTrees/$TREE_ID" \
  '{"title":"Updated Smoke DT"}'
check "Search trees" POST "$EXPLICABLE_BASE_URL/decisionTrees/search" \
  '{"query":{"match_all":{}}}'
check "Delete tree" DELETE "$EXPLICABLE_BASE_URL/decisionTrees/$TREE_ID"

# ─── Nodes CRUD + Queries ─────────────────────────────────────────────────────
check "List nodes" GET "$EXPLICABLE_BASE_URL/nodes?limit=1"

NODE_ID=$(curl -s -X POST "${curl_args[@]}" \
  -H "Content-Type: application/json" \
  -d '{"tree_id":"'"$TREE_ID"'","node_type":"smokeType","text":{"en":"Smoke node"}}' \
  "$EXPLICABLE_BASE_URL/nodes" | jq -r .node_id)

check "Get node" GET "$EXPLICABLE_BASE_URL/nodes/$NODE_ID"
check "Update node" PATCH "$EXPLICABLE_BASE_URL/nodes/$NODE_ID" \
  '{"description":"Updated smoke node"}'
check "List nodes by tree" GET "$EXPLICABLE_BASE_URL/nodes?tree_id=$TREE_ID"
check "List nodes by type" GET "$EXPLICABLE_BASE_URL/nodes?node_type=smokeType"
check "Delete node" DELETE "$EXPLICABLE_BASE_URL/nodes/$NODE_ID"

# ─── Summary ──────────────────────────────────────────────────────────────────
echo
if (( failures == 0 )); then
  echo "✅ EL GRANDE SMOKE TEST PASSED"
  exit 0
else
  echo "❌ $failures failure(s) in smoke test"
  exit 1
fi
