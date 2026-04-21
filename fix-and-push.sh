#!/bin/bash
set -e
MSG=${1:-"feat: replace @convex-dev/auth with Clerk for authentication"}

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   🌊  Guarujá Guias — Clerk Auth Setup    ║"
echo "╚══════════════════════════════════════════╝"
echo ""

echo "▶ [1/5] Installing Clerk packages..."
npm install @clerk/nextjs@^5.7.2 @clerk/clerk-react@^5.15.0
npm uninstall @convex-dev/auth @auth/core 2>/dev/null || true
echo "✅ Packages updated"

echo ""
echo "▶ [2/5] Check .env.local has Clerk keys..."
if ! grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" .env.local 2>/dev/null; then
  echo "⚠️  WARNING: Add Clerk keys to .env.local before deploying!"
  echo "   Get them at: https://dashboard.clerk.com"
  echo "   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_..."
  echo "   CLERK_SECRET_KEY=sk_live_..."
fi

echo ""
echo "▶ [3/5] Configure Convex to accept Clerk JWT..."
echo "   Run this in Convex Dashboard → Settings → Environment Variables:"
echo "   CLERK_JWT_ISSUER_DOMAIN = https://YOUR-CLERK-DOMAIN.clerk.accounts.dev"
echo ""
read -p "   Press ENTER when Convex JWT is configured..."

echo ""
echo "▶ [4/5] Committing and pushing..."
git add -A && git status --short
git commit -m "$MSG"
git push origin main
echo "✅ Pushed — Vercel will auto-deploy"

echo ""
echo "▶ [5/5] Deploying Convex backend..."
npx convex deploy
echo "✅ Convex deployed"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  🚀  Done! https://guarujaguias.com.br    ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "📋 Also add to Vercel Environment Variables:"
echo "   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "   CLERK_SECRET_KEY"
echo ""
