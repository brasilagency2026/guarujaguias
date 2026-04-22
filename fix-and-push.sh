#!/bin/bash
set -e
MSG=${1:-"fix: cast ptBR localization as any to bypass Clerk type version conflict"}
echo "▶ Committing..."
git add -A && git status --short && git commit -m "$MSG"
echo "▶ Pushing..."
git push origin main
echo "✅ Pushed — Vercel will auto-deploy"
echo "▶ Deploying Convex..."
npx convex deploy
echo "✅ Done! https://guarujaguias.com.br"
