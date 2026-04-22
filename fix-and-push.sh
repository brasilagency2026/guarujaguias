#!/bin/bash
set -e
MSG=${1:-"fix: pin @clerk/nextjs to v4 for convex/react-clerk compatibility, fix UseAuth type conflict"}

echo "▶ [1/4] Installing correct Clerk version..."
# Remove conflicting v5 packages
npm uninstall @clerk/clerk-react @clerk/types 2>/dev/null || true
# Install Clerk v4 (compatible with convex/react-clerk)
npm install @clerk/nextjs@^4.29.12
echo "✅ Clerk v4 installed"

echo ""
echo "▶ [2/4] Committing..."
git add -A && git status --short && git commit -m "$MSG"

echo ""
echo "▶ [3/4] Pushing to GitHub..."
git push origin main
echo "✅ Pushed — Vercel will auto-deploy"

echo ""
echo "▶ [4/4] Deploying Convex..."
npx convex deploy
echo "✅ Done! https://guarujaguias.com.br"
