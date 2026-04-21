#!/bin/bash
set -e
MSG=${1:-"fix: remove invalid style prop from GuarujaMap usage in MapPageClient"}
echo "▶ Committing..."
git add -A && git status --short && git commit -m "$MSG"
echo "▶ Pushing..."
git push origin main
echo "✅ Pushed — monitor: https://vercel.com/dashboard"
echo "▶ Deploying Convex..."
npx convex deploy
echo "✅ Done! https://guarujaguias.com.br"
