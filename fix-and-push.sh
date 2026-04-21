#!/bin/bash
# ============================================================
#  Guarujá Guias — Fix export type error in upload route
#  Usage: chmod +x fix-and-push.sh && ./fix-and-push.sh
# ============================================================
set -e

MSG=${1:-"fix: remove invalid cfImageUrl export from Next.js route handler"}

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   🌊  Guarujá Guias — Apply Fix #3        ║"
echo "╚══════════════════════════════════════════╝"
echo ""

echo "▶ [1/3] Committing..."
git add -A
git status --short
git commit -m "$MSG"

echo ""
echo "▶ [2/3] Pushing to GitHub..."
git push origin main
echo "✅ Vercel will auto-deploy — monitor: https://vercel.com/dashboard"

echo ""
echo "▶ [3/3] Deploying Convex..."
npx convex deploy
echo "✅ Convex deployed"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  🚀  Done! https://guarujaguias.com.br    ║"
echo "╚══════════════════════════════════════════╝"
