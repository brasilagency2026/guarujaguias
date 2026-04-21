#!/bin/bash
set -e
MSG=${1:-"fix: remove all @convex-dev/auth imports, use Clerk ctx.auth.getUserIdentity()"}
echo "▶ Committing..."
git add -A && git status --short && git commit -m "$MSG"
echo "▶ Pushing to GitHub..."
git push origin main
echo "✅ Pushed — Vercel will auto-deploy"
echo "▶ Deploying Convex..."
npx convex deploy
echo "✅ Done! https://guarujaguias.com.br"
