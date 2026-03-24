#!/bin/bash
set -euo pipefail
GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
echo -e "${CYAN}[nextoken]${NC} Installing asset owner features..."
[ -f "package.json" ] || { echo "Run from project root!"; exit 1; }

# Files are already extracted to correct paths by tar
echo -e "${GREEN}  ✔${NC} pages/api/upload/document.js"
echo -e "${GREEN}  ✔${NC} pages/api/assets/create.js"
echo -e "${GREEN}  ✔${NC} pages/api/assets/my-listings.js"
echo -e "${GREEN}  ✔${NC} pages/api/assets/stats.js"
echo -e "${GREEN}  ✔${NC} pages/api/assets/submit.js"
echo -e "${GREEN}  ✔${NC} pages/api/assets/update.js"
echo -e "${GREEN}  ✔${NC} pages/issuer-dashboard.js"

echo -e "${CYAN}[nextoken]${NC} Committing and deploying..."
git add -A
git commit -m "feat: full asset owner system

- Asset Owner Dashboard (/issuer-dashboard)
  - Stats: total raised, investors, listings
  - My Listings: status, funding progress, investor count
  - Submit for Review workflow
  - Analytics tab
- Create Listing Modal
  - Full form with all asset fields
  - Document upload to Cloudinary (PDF, JPG, DOCX, XLSX)
  - Up to 20MB per file
- 6 new API routes:
  - POST /api/upload/document
  - POST /api/assets/create
  - GET  /api/assets/my-listings
  - GET  /api/assets/stats
  - PUT  /api/assets/update
  - POST /api/assets/submit"

git push origin main
vercel --prod

echo ""
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Asset Owner System deployed!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo ""
echo -e "  Dashboard: ${CYAN}https://nextokencapital.com/issuer-dashboard${NC}"
echo ""
echo -e "  Make sure .env.local has:"
echo -e "    CLOUDINARY_CLOUD_NAME=xxx"
echo -e "    CLOUDINARY_API_KEY=xxx"
echo -e "    CLOUDINARY_API_SECRET=xxx"
echo ""
