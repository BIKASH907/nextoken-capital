#!/bin/bash
# ============================================================================
#  Nextoken Capital — Final Marketplace Language Polish
#  
#  Surgical text replacements across all pages.
#  Changes ~15 specific strings. Zero structural/style changes.
#
#  Usage:
#    cd "D:/New folder/nextoken-capital"
#    chmod +x polish-content.sh
#    ./polish-content.sh
# ============================================================================

set -euo pipefail
GREEN='\033[0;32m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
log() { echo -e "${CYAN}[nextoken]${NC} $1"; }
ok()  { echo -e "${GREEN}  ✔${NC} $1"; }

log "Polishing marketplace language across all pages..."

# ── pages/about.js ───────────────────────────────────────────────────────────
if [ -f pages/about.js ]; then
  sed -i \
    -e 's/The Regulated Infrastructure for <em>Tokenized Capital<\/em>/The Regulated Marketplace for <em>Tokenized Assets<\/em>/g' \
    -e 's/Nextoken Capital is building the foundation for the next generation of capital markets/Nextoken Capital is the regulated marketplace for the next generation of tokenized assets/g' \
    -e 's/Create your free account and start investing in tokenized real-world assets today/Create your free account and start trading tokenized real-world assets on our marketplace today/g' \
    -e 's/Join the future of capital markets/Join the marketplace/g' \
    pages/about.js
  ok "pages/about.js"
fi

# ── pages/markets.js ─────────────────────────────────────────────────────────
if [ -f pages/markets.js ]; then
  sed -i \
    -e 's/Investment Opportunities/Marketplace Listings/g' \
    -e 's/Explore Premium Tokenized Markets/Explore the Tokenized Asset Marketplace/g' \
    -e 's/Access curated real-world asset opportunities across/Browse curated tokenized listings across/g' \
    -e 's/Start building your portfolio today/Start trading on the marketplace today/g' \
    -e 's/Create your account to access tokenized investment opportunities/Create your account to trade tokenized assets on our marketplace/g' \
    -e 's/View Opportunity/View Listing/g' \
    pages/markets.js
  ok "pages/markets.js"
fi

# ── pages/exchange.js ────────────────────────────────────────────────────────
if [ -f pages/exchange.js ]; then
  sed -i \
    -e 's/Buy and sell security tokens on the regulated secondary market/Buy and sell tokenized assets on the regulated Nextoken marketplace/g' \
    pages/exchange.js
  ok "pages/exchange.js"
fi

# ── pages/bonds.js ───────────────────────────────────────────────────────────
if [ -f pages/bonds.js ]; then
  sed -i \
    -e 's/Invest in tokenized bond securities on Nextoken Capital/Trade tokenized bond securities on the Nextoken marketplace/g' \
    -e 's/High-yield digital bond listings open for subscription right now/Digital bond listings live on the marketplace right now/g' \
    pages/bonds.js
  ok "pages/bonds.js"
fi

# ── pages/equity-ipo.js ─────────────────────────────────────────────────────
if [ -f pages/equity-ipo.js ]; then
  sed -i \
    -e 's/Invest in tokenized equity and blockchain IPOs on Nextoken Capital/Trade tokenized equity and blockchain IPOs on the Nextoken marketplace/g' \
    -e 's/Join 1,000+ investors and issuers building the future of capital markets on Nextoken/Join 1,000+ traders and issuers on the Nextoken marketplace/g' \
    pages/equity-ipo.js
  ok "pages/equity-ipo.js"
fi

# ── pages/tokenize.js ────────────────────────────────────────────────────────
if [ -f pages/tokenize.js ]; then
  sed -i \
    -e 's/Turn illiquid real-world assets into digital securities and open them to 1,000+ verified investors/Turn illiquid real-world assets into tradable digital tokens and list them on our marketplace for 1,000+ verified traders/g' \
    -e 's/Your asset is live. Investors can browse, invest, and trade in secondary market/Your asset is live on the marketplace. Traders can browse, invest, and trade on the exchange/g' \
    pages/tokenize.js
  ok "pages/tokenize.js"
fi

# ── pages/compliance.js ─────────────────────────────────────────────────────
if [ -f pages/compliance.js ]; then
  sed -i \
    -e 's/Compliance is not a checkbox. It is our infrastructure/Compliance is not a checkbox. It is our marketplace infrastructure/g' \
    pages/compliance.js
  ok "pages/compliance.js"
fi

# ── pages/fees.js ────────────────────────────────────────────────────────────
if [ -f pages/fees.js ]; then
  sed -i \
    -e 's/Transparent fee schedule for Nextoken Capital. See all charges for investing, trading/Transparent marketplace fee schedule. See all charges for trading/g' \
    pages/fees.js
  ok "pages/fees.js"
fi

# ── Git commit ───────────────────────────────────────────────────────────────
if [ -d ".git" ]; then
  log "Staging changes..."
  git add -A
  git commit -m "content: polish marketplace language across all pages

Surgical text replacements (no structural changes):
  - about.js: 'infrastructure for capital' → 'marketplace for assets'
  - markets.js: 'Investment Opportunities' → 'Marketplace Listings'
  - exchange.js: 'secondary market' → 'Nextoken marketplace'
  - bonds.js: 'Invest in' → 'Trade'
  - equity-ipo.js: 'investors' → 'traders'
  - tokenize.js: 'investors' → 'marketplace traders'
  - compliance.js: added 'marketplace' to infrastructure line
  - fees.js: 'investing' → 'trading'

Zero CSS/layout/structural changes."

  ok "Committed"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  All pages polished! Marketplace language consistent.${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}npm run dev${NC}              — preview"
echo -e "  ${CYAN}git push -u origin HEAD${NC}  — push"
echo ""
