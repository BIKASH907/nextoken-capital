#!/usr/bin/env bash
# Deploy i18n changes (Google Translate removed, i18next added) to Vercel production.
# Usage:  bash scripts/deploy.sh "optional commit message"
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

MSG="${1:-feat(i18n): replace Google Translate with i18next + 44 locale dictionaries}"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "== 1/5  status =="
git status --short

echo "== 2/5  stage =="
git add -A

if git diff --cached --quiet; then
  echo "Nothing to commit. Skipping commit step."
else
  echo "== 3/5  commit =="
  git commit -m "$MSG"
fi

echo "== 4/5  push origin/$BRANCH =="
git push origin "$BRANCH"

echo "== 5/5  vercel --prod =="
if ! command -v vercel >/dev/null 2>&1; then
  echo "Installing Vercel CLI globally..."
  npm install -g vercel
fi
vercel pull --yes --environment=production
vercel build --prod
vercel deploy --prebuilt --prod

echo
echo "Done. The site has been pushed to git and a production deployment was triggered on Vercel."
