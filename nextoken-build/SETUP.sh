#!/bin/bash
# ════════════════════════════════════════════════════════════
# NEXTOKEN CAPITAL — Full Integration Setup Script
# Run this from your project root: D:/New folder/nextoken-capital
# ════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════"
echo "  NEXTOKEN CAPITAL — INTEGRATION SETUP"
echo "═══════════════════════════════════════════════"

# ─── STEP 1: Install new dependencies ────────────────────
echo ""
echo "📦 Installing dependencies..."
npm install ethers@6 @openzeppelin/contracts --save
npm install hardhat @nomicfoundation/hardhat-toolbox --save-dev

# ─── STEP 2: Create directory structure ──────────────────
echo ""
echo "📁 Creating directories..."
mkdir -p lib
mkdir -p pages/api/auth/monerium
mkdir -p pages/api/issuer
mkdir -p pages/api/admin
mkdir -p pages/issuer
mkdir -p pages/dashboard
mkdir -p pages/admin
mkdir -p components
mkdir -p contracts
mkdir -p scripts

# ─── STEP 3: Copy files ─────────────────────────────────
# NOTE: Replace SOURCE_PATH with where you downloaded the files
echo ""
echo "📄 Copy these files to your project:"
echo ""
echo "  lib/monerium.js                         ← Monerium API + OAuth"
echo "  pages/api/auth/monerium/connect.js      ← Start OAuth flow"
echo "  pages/api/auth/monerium/callback.js     ← OAuth callback"
echo "  pages/api/issuer/onboard.js             ← Issuer registration"
echo "  pages/api/issuer/dashboard.js           ← Issuer data API"
echo "  pages/api/issuer/redeem-eure.js         ← EURe → EUR withdrawal"
echo "  pages/api/admin/approve-asset.js        ← Approve + deploy to chain"
echo "  pages/api/admin/assets.js               ← Admin asset list"
echo "  pages/api/contract-stats.js             ← Live contract stats"
echo "  pages/issuer/onboard.js                 ← 5-step onboarding page"
echo "  pages/dashboard/issuer.js               ← Issuer dashboard"
echo "  pages/admin/assets.js                   ← Admin asset management"
echo "  components/UniversalInvestment.js       ← Multi-token invest component"
echo "  contracts/NextokenUniversalEscrow.sol   ← Smart contract"
echo "  scripts/deploy-universal-escrow.js      ← Deploy script"
echo "  .env.example                            ← Environment template"
echo "  vercel.json                             ← Cron config"

# ─── STEP 4: Add environment variables ──────────────────
echo ""
echo "🔐 Add these to your .env.local:"
echo ""
echo "  ESCROW_CONTRACT_ADDRESS=          # After deployment"
echo "  NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS="
echo "  ADMIN_PRIVATE_KEY=                # Your admin wallet"
echo "  TREASURY_WALLET=                  # Treasury address"
echo "  TREASURY_IBAN=                    # Your company IBAN"
echo "  MONERIUM_CLIENT_ID=              # From monerium.app"
echo "  MONERIUM_CLIENT_SECRET=          # From monerium.app"
echo "  MONERIUM_ENV=sandbox             # Change to production when ready"
echo "  MONERIUM_REDIRECT_URI=https://nextokencapital.com/api/auth/monerium/callback"
echo "  POLYGONSCAN_API_KEY=             # For contract verification"
echo "  CRON_SECRET=                     # Random string for auto-redeem"

# ─── STEP 5: Deploy smart contract ──────────────────────
echo ""
echo "🔗 Deploy smart contract to Polygon:"
echo ""
echo "  npx hardhat compile"
echo "  npx hardhat run scripts/deploy-universal-escrow.js --network polygon"
echo ""
echo "  Then add the contract address to .env.local"

# ─── STEP 6: Git commands ───────────────────────────────
echo ""
echo "📤 Git commands to commit and push:"
echo ""
echo "  cd D:/New\\ folder/nextoken-capital"
echo ""
echo "  git add lib/monerium.js"
echo "  git add pages/api/auth/monerium/connect.js"
echo "  git add pages/api/auth/monerium/callback.js"
echo "  git add pages/api/issuer/onboard.js"
echo "  git add pages/api/issuer/dashboard.js"
echo "  git add pages/api/issuer/redeem-eure.js"
echo "  git add pages/api/admin/approve-asset.js"
echo "  git add pages/api/admin/assets.js"
echo "  git add pages/api/contract-stats.js"
echo "  git add pages/issuer/onboard.js"
echo "  git add pages/dashboard/issuer.js"
echo "  git add pages/admin/assets.js"
echo "  git add components/UniversalInvestment.js"
echo "  git add contracts/NextokenUniversalEscrow.sol"
echo "  git add scripts/deploy-universal-escrow.js"
echo "  git add vercel.json"
echo "  git add .env.example"
echo ""
echo "  git commit -m 'feat: universal escrow with Monerium, issuer onboarding, admin panel'"
echo "  git push origin main"
echo ""
echo "═══════════════════════════════════════════════"
echo "  DEPLOYMENT ORDER"
echo "═══════════════════════════════════════════════"
echo ""
echo "  1. Create Monerium sandbox account → get credentials"
echo "  2. Add all env vars to .env.local"
echo "  3. Deploy contract: npx hardhat run scripts/deploy-universal-escrow.js --network polygon"
echo "  4. Add contract address to .env.local"
echo "  5. git add + commit + push"
echo "  6. Vercel auto-deploys"
echo "  7. Test issuer onboarding flow"
echo "  8. Test admin approval flow"
echo "  9. Test investment flow"
echo "  10. Test EURe redemption"
echo "  11. Switch MONERIUM_ENV to production"
echo "  12. Re-deploy contract to mainnet"
echo "  13. Launch!"
echo ""
echo "═══════════════════════════════════════════════"
