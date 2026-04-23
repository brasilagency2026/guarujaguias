#!/bin/bash
set -e
MSG=${1:-"fix: add events:listForHomepage, listMyEvents, activateFeatured to Convex + update schema"}

echo "▶ [1/3] Committing new Convex files..."
git add -A && git status --short && git commit -m "$MSG"

echo ""
echo "▶ [2/3] Pushing to GitHub..."
git push origin main
echo "✅ Pushed"

echo ""
echo "▶ [3/3] Deploying Convex backend (critical step)..."
npx convex deploy
echo "✅ Convex deployed with new functions!"

echo ""
echo "Done! https://guarujaguias.com.br"
