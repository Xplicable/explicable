#!/usr/bin/env bash
set -euo pipefail

# ─── Load .env if present ────────────────────────────────────────────────────
if [[ -f .env ]]; then
  set -a; source .env; set +a
fi

: "${EXPLICABLE_BASE_URL:?Must set EXPLICABLE_BASE_URL}"
: "${EXPLICABLE_API_KEY:?Must set EXPLICABLE_API_KEY}"

failures=0

check() {
  local method=$1 url=$2
  shift 2   # everything else is passed straight to curl

  echo "▶️  $method $url"
  local status
  status=$(
    curl -s -o /dev/null -w "%{http_code}" \
      -H "x-api-key: $EXPLICABLE_API_KEY" \
      -X "$method" \
      "$@" \
      "$url"
  )

  if [[ $status =~ ^2 ]]; then
    echo "✅ STATUS: $status"
  else
    echo "❌ STATUS: $status"
    failures=$((failures + 1))
  fi
}

# ── 1) Public health-check and 404 (no key) ──────────────────────────────────
check GET "$EXPLICABLE_BASE_URL/"
echo "▶️  FALLBACK 403 (no key)"
code=$(curl -s -o /dev/null -w "%{http_code}" "$EXPLICABLE_BASE_URL/no-such-route")
if [[ $code == 403 ]]; then
  echo "✅ STATUS: $code"
else
  echo "❌ STATUS: $code"
  failures=$((failures+1))
fi

# ── 2) Users CRUD ────────────────────────────────────────────────────────────
uid=9999
check POST "$EXPLICABLE_BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{"user_id":9999,"name":"Smoke User","username":"smokeuser","email":"smoke@example.com","mobile_number":"+10000000000","time_zone":"UTC"}'

check GET    "$EXPLICABLE_BASE_URL/users/$uid"
check PATCH  "$EXPLICABLE_BASE_URL/users/$uid" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smoke User Updated"}'
check DELETE "$EXPLICABLE_BASE_URL/users/$uid"

# ── 3) DecisionTrees CRUD + search ───────────────────────────────────────────
check GET "$EXPLICABLE_BASE_URL/decisionTrees?limit=1"

tree_id=$(curl -s -H "x-api-key: $EXPLICABLE_API_KEY" \
             -H "Content-Type: application/json" \
             -X POST -d '{"owner_id":9999,"category_id":"catSmoke","subcategory_id":"subSmoke","title":"Smoke DT","description":"desc"}' \
             "$EXPLICABLE_BASE_URL/decisionTrees" | jq -r .tree_id)

check GET    "$EXPLICABLE_BASE_URL/decisionTrees/$tree_id"
check PATCH  "$EXPLICABLE_BASE_URL/decisionTrees/$tree_id" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Smoke DT"}'
check DELETE "$EXPLICABLE_BASE_URL/decisionTrees/$tree_id"

check POST "$EXPLICABLE_BASE_URL/decisionTrees/search" \
  -H "Content-Type: application/json" \
  -d '{"query":{"match_all":{}}}'

# ── 4) Nodes CRUD and queries ────────────────────────────────────────────────
check GET "$EXPLICABLE_BASE_URL/nodes?limit=1"

node_id=$(curl -s -H "x-api-key: $EXPLICABLE_API_KEY" \
                -H "Content-Type: application/json" \
                -X POST -d '{"tree_id":"'"$tree_id"'","node_type":"smokeType","text":{"en":"Smoke node"}}' \
                "$EXPLICABLE_BASE_URL/nodes" | jq -r .node_id)

check GET    "$EXPLICABLE_BASE_URL/nodes/$node_id"
check PATCH  "$EXPLICABLE_BASE_URL/nodes/$node_id" \
  -H "Content-Type: application/json" \
  -d '{"description":"Updated smoke node"}'
check DELETE "$EXPLICABLE_BASE_URL/nodes/$node_id"

check GET "$EXPLICABLE_BASE_URL/nodes?tree_id=$tree_id"
check GET "$EXPLICABLE_BASE_URL/nodes?node_type=smokeType"

# ── Exit code ────────────────────────────────────────────────────────────────
echo
(( failures == 0 )) && { echo "✅ All smoke checks passed"; exit 0; }
echo "❌ $failures smoke check(s) failed"
exit 1
