#!/bin/bash
# ============================================================
#  Quick fix push — copies fixed files then pushes to GitHub
#  Run from the project root: ./fix-and-push.sh
# ============================================================

set -e
MSG=${1:-"fix: correct import paths and add convex _generated stubs"}

echo ""
echo "▶ Applying fixes..."

# The fixes are already in the right places if you downloaded
# and replaced the files manually. This script just commits & pushes.

# Make sure convex/_generated/ is NOT in .gitignore
if grep -q "convex/_generated" .gitignore 2>/dev/null; then
  echo "⚠️  Removing convex/_generated from .gitignore..."
  # Remove the line from .gitignore
  grep -v "convex/_generated" .gitignore > .gitignore.tmp
  mv .gitignore.tmp .gitignore
  echo "✅ .gitignore updated"
fi

# Stage everything including convex/_generated/
git add -A
git status --short

echo ""
echo "▶ Committing: $MSG"
git commit -m "$MSG"

echo ""
echo "▶ Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Done! Vercel will pick up the changes automatically."
echo "   Monitor build at: https://vercel.com/dashboard"
echo ""
echo "▶ Now deploy Convex backend:"
echo "   npx convex deploy"
echo ""
