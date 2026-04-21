#!/bin/bash
set -e
MSG=${1:-"fix: force-dynamic in root layout to prevent Convex SSG prerendering crash"}
echo "▶ Committing..."
git add -A && git status --short && git commit -m "$MSG"
echo "▶ Pushing..."
git push origin main
echo "✅ Pushed — monitor: https://vercel.com/dashboard"
echo "▶ Deploying Convex..."
npx convex deploy
echo "✅ Done! https://guarujaguias.com.br"
