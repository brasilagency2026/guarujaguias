#!/bin/bash
set -e
MSG=${1:-"fix: delete corrupted package-lock.json and regenerate clean"}

echo "▶ [1/5] Removing corrupted package-lock.json..."
rm -f package-lock.json
echo "✅ Removed"

echo ""
echo "▶ [2/5] Cleaning npm cache..."
npm cache clean --force
echo "✅ Cache cleaned"

echo ""
echo "▶ [3/5] Fresh install..."
npm install
echo "✅ Installed clean"

echo ""
echo "▶ [4/5] Committing..."
git add -A && git status --short && git commit -m "$MSG"
git push origin main
echo "✅ Pushed — Vercel will auto-deploy with fresh package-lock.json"

echo ""
echo "▶ [5/5] Deploying Convex..."
npx convex deploy
echo "✅ Done! https://guarujaguias.com.br"
