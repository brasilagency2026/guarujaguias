#!/bin/bash
# ============================================================
#  Guarujá Guias — Fix import paths + push + convex deploy
#  Usage: chmod +x fix-and-push.sh && ./fix-and-push.sh
# ============================================================
set -e

MSG=${1:-"fix: correct import paths for minisite slug page and webhook route"}

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   🌊  Guarujá Guias — Apply Fixes         ║"
echo "╚══════════════════════════════════════════╝"
echo ""

echo "▶ [1/3] Committing fixed files..."
git add -A
git status --short
git commit -m "$MSG"

echo ""
echo "▶ [2/3] Pushing to GitHub (Vercel will auto-deploy)..."
git push origin main
echo "✅ Pushed — monitor: https://vercel.com/dashboard"

echo ""
echo "▶ [3/3] Deploying Convex backend to production..."
npx convex deploy
echo "✅ Convex deployed"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  🚀  Done! Site: https://guarujaguias.com.br  ║"
echo "╚══════════════════════════════════════════╝"
echo ""
