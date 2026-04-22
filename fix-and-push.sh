#!/bin/bash
set -e
MSG=${1:-"fix: upgrade Next.js to 14.2.28 and use Clerk v5 with useAuth cast"}

echo "▶ [1/4] Installing updated packages..."
npm install next@14.2.28 @clerk/nextjs@^5.7.2
npm uninstall @clerk/clerk-react 2>/dev/null || true
echo "✅ Packages updated"

echo ""
echo "▶ [2/4] Committing..."
git add -A && git status --short && git commit -m "$MSG"

echo ""
echo "▶ [3/4] Pushing to GitHub..."
git push origin main
echo "✅ Pushed — Vercel will auto-deploy"

echo ""
echo "▶ [4/4] Deploying Convex..."
npx convex deploy
echo "✅ Done! https://guarujaguias.com.br"
