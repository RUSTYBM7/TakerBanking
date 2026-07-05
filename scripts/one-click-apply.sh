#!/bin/bash
# One-click Supabase schema apply + redeploy
# Usage: SUPABASE_DB_PASSWORD="<your-password>" bash scripts/one-click-apply.sh
#
# This will:
#  1. Set SUPABASE_DB_PASSWORD on the Vercel project
#  2. Trigger a build that runs prebuild → apply-supabase-schema.mjs
#  3. The schema + smoke tests run inside Vercel's build environment
#  4. Vercel deploys the new build to orbitpaybank.online
#  5. Vercel emails you the build log

set -e

if [ -z "$SUPABASE_DB_PASSWORD" ]; then
  echo "❌ Set SUPABASE_DB_PASSWORD first:"
  echo "   export SUPABASE_DB_PASSWORD='your-supabase-db-password'"
  echo "   bash scripts/one-click-apply.sh"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "🔐 Step 1/4: Setting SUPABASE_DB_PASSWORD on Vercel project (user-portal)..."
vercel env add SUPABASE_DB_PASSWORD production --token "${VERCEL_TOKEN}" <<<"$SUPABASE_DB_PASSWORD" 2>&1 | tail -2 || \
  vercel env rm SUPABASE_DB_PASSWORD production --token "${VERCEL_TOKEN}" --yes 2>&1 | tail -1
vercel env add SUPABASE_DB_PASSWORD production --token "${VERCEL_TOKEN}" <<<"$SUPABASE_DB_PASSWORD" 2>&1 | tail -2

echo ""
echo "🔐 Step 2/4: Setting SUPABASE_DB_PASSWORD on Vercel project (admin-portal)..."
cd admin-portal
vercel env add SUPABASE_DB_PASSWORD production --token "${VERCEL_TOKEN}" <<<"$SUPABASE_DB_PASSWORD" 2>&1 | tail -2 || \
  vercel env rm SUPABASE_DB_PASSWORD production --token "${VERCEL_TOKEN}" --yes 2>&1 | tail -1
vercel env add SUPABASE_DB_PASSWORD production --token "${VERCEL_TOKEN}" <<<"$SUPABASE_DB_PASSWORD" 2>&1 | tail -2

cd "$REPO_ROOT"

echo ""
echo "🚀 Step 3/4: Triggering redeploy with build env (schema applies during prebuild)..."
vercel deploy --prod --yes --build-env "SUPABASE_DB_PASSWORD=$SUPABASE_DB_PASSWORD" --token "${VERCEL_TOKEN}" 2>&1 | tail -5

echo ""
echo "🚀 Step 4/4: Triggering admin portal redeploy..."
cd admin-portal
vercel deploy --prod --yes --build-env "SUPABASE_DB_PASSWORD=$SUPABASE_DB_PASSWORD" --token "${VERCEL_TOKEN}" 2>&1 | tail -5

cd "$REPO_ROOT"

echo ""
echo "✅ Done! Check the deployment logs in your Vercel dashboard:"
echo "   https://vercel.com/dashboard"
echo ""
echo "The schema should have been applied by the prebuild step."
echo "Check by visiting: https://orbitpaybank.online/ (the app should connect to Supabase)"