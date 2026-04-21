#!/bin/bash
set -e
MSG=${1:-"fix: remove unused Google import from convex/auth.ts"}
echo "▶ Committing..."
git add -A && git status --short && git commit -m "$MSG"
echo "▶ Pushing..."
git push origin main
echo "✅ Pushed — monitor: https://vercel.com/dashboard"
echo "▶ Deploying Convex..."
npx convex deploy
echo "✅ Done! https://guarujaguias.com.br"
