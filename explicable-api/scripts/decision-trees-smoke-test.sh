#!/usr/bin/env bash
set -euo pipefail

# 1) Load any vars from .env (auto-exported)
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# 2) Fail fast if missing
: "${EXPLICABLE_API_KEY:?Need EXPLICABLE_API_KEY in your env/.env}"
: "${EXPLICABLE_BASE_URL:?Need EXPLICABLE_BASE_URL in your env/.env}"

# 3) Smoke tests
echo "▶️ 1) Filter by owner_id=1001 (OwnerCreatedAtIndex)"
curl -iG \
  -H "x-api-key: $EXPLICABLE_API_KEY" \
  "$EXPLICABLE_BASE_URL/decisionTrees" \
  --data-urlencode "owner_id=1001"



# ─── 2) Validate that our two needed variables are set ────────────────────────
: "${EXPLICABLE_API_KEY:?Need to set EXPLICABLE_API_KEY (in your env or in .env)}"
: "${EXPLICABLE_BASE_URL:?Need to set EXPLICABLE_BASE_URL (in your env or in .env)}"

# ─── 3) Run the five smoke-tests ─────────────────────────────────────────────
echo "▶️ 1) Filter by owner_id=1001 (OwnerCreatedAtIndex)"
curl -iG \
  -H "x-api-key: $EXPLICABLE_API_KEY" \
  "$EXPLICABLE_BASE_URL/decisionTrees" \
  --data-urlencode "owner_id=1001"

echo -e "\n\n▶️ 2) Filter by publication_status=approved (StatusUpdatedAtIndex)"
curl -iG \
  -H "x-api-key: $EXPLICABLE_API_KEY" \
  "$EXPLICABLE_BASE_URL/decisionTrees" \
  --data-urlencode "publication_status=approved"

echo -e "\n\n▶️ 3) Sort by created_at descending (CreatedAtIndex)"
curl -iG \
  -H "x-api-key: $EXPLICABLE_API_KEY" \
  "$EXPLICABLE_BASE_URL/decisionTrees" \
  --data-urlencode "sortBy=created_at" \
  --data-urlencode "sortOrder=desc"

echo -e "\n\n▶️ 4) Combined filter owner_id=1001 + publication_status=draft (scan fallback)"
curl -iG \
  -H "x-api-key: $EXPLICABLE_API_KEY" \
  "$EXPLICABLE_BASE_URL/decisionTrees" \
  --data-urlencode "owner_id=1001" \
  --data-urlencode "publication_status=draft"

echo -e "\n\n▶️ 5) Pagination test (limit=2)"
resp=$(
  curl -sG \
    -H "x-api-key: $EXPLICABLE_API_KEY" \
    "$EXPLICABLE_BASE_URL/decisionTrees" \
    --data-urlencode "limit=2"
)
echo "$resp" | jq .

LK=$(echo "$resp" | jq -r .lastKey)
if [[ -n "$LK" && "$LK" != "null" ]]; then
  echo -e "\n\n▶️ Pagination follow-up page:"
  curl -iG \
    -H "x-api-key: $EXPLICABLE_API_KEY" \
    "$EXPLICABLE_BASE_URL/decisionTrees" \
    --data-urlencode "limit=2" \
    --data-urlencode "lastKey=$LK"
else
  echo "✅ No more pages."
fi
