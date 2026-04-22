#!/bin/bash
set -e
MSG=${1:-"feat: events agenda on homepage, remove stats bar, events dashboard with R\$100 featured payment"}
echo "▶ Committing..."
git add -A && git status --short && git commit -m "$MSG"
echo "▶ Pushing..."
git push origin main
echo "✅ Pushed — Vercel will auto-deploy"
echo "▶ Deploying Convex..."
npx convex deploy
echo "✅ Done! https://guarujaguias.com.br"
