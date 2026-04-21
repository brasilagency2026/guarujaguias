#!/bin/bash
# ============================================================
#  Guarujá Guias — Deploy Script
#  Usage:
#    chmod +x deploy.sh
#    ./deploy.sh "sua mensagem de commit"
# ============================================================

set -e  # stop on any error

MSG=${1:-"fix: build errors and update files"}

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   🌊  Guarujá Guias — Deploy Script       ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── STEP 1: Generate Convex types locally ──────────────────
echo "▶ [1/4] Generating Convex types..."
npx convex dev --once
echo "✅ Convex types generated"
echo ""

# ── STEP 2: Run local build check ─────────────────────────
echo "▶ [2/4] Checking Next.js build..."
npm run build
echo "✅ Build OK"
echo ""

# ── STEP 3: Git commit & push ─────────────────────────────
echo "▶ [3/4] Pushing to GitHub..."
git add -A
git status --short
git commit -m "$MSG"
git push origin main
echo "✅ Pushed to GitHub (Vercel will auto-deploy)"
echo ""

# ── STEP 4: Deploy Convex to production ───────────────────
echo "▶ [4/4] Deploying Convex backend to production..."
npx convex deploy
echo "✅ Convex deployed"
echo ""

echo "╔══════════════════════════════════════════╗"
echo "║  🚀  Deploy complete!                     ║"
echo "║                                           ║"
echo "║  Vercel:  https://guarujaguias.com.br     ║"
echo "║  Convex:  https://dashboard.convex.dev    ║"
echo "╚══════════════════════════════════════════╝"
echo ""
