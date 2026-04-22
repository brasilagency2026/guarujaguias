#!/bin/bash
set -e
MSG=${1:-"fix: add @clerk/localizations package for pt-BR support"}
echo "▶ Installing @clerk/localizations..."
npm install @clerk/localizations@^3.0.0
echo "✅ Installed"
echo "▶ Committing..."
git add -A && git status --short && git commit -m "$MSG"
echo "▶ Pushing..."
git push origin main
echo "✅ Pushed — Vercel will auto-deploy"
echo "▶ Deploying Convex..."
npx convex deploy
echo "✅ Done! https://guarujaguias.com.br"
