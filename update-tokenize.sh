#!/bin/bash
set -euo pipefail
GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
log() { echo -e "${CYAN}[nextoken]${NC} $1"; }
ok()  { echo -e "${GREEN}  ✔${NC} $1"; }

cd "$(dirname "$0")"

log "Updating tokenize page content..."

# ── Hero section ─────────────────────────────────────────────────────────────
sed -i "s|Asset Tokenization|Digital Asset Representation|" pages/tokenize.js
ok "Badge: Asset Tokenization → Digital Asset Representation"

sed -i "s|Tokenize Your <em>Real-World Asset</em>|Represent Your <em>Real-World Asset</em> Digitally|" pages/tokenize.js
ok "Hero title updated"

sed -i "s|Turn illiquid real-world assets into digital securities and open them to 1,000+ verified investors across 180+ countries.|Tokenization introduces a structured way to represent real-world assets digitally. Present your opportunity in a more accessible and standardized format to 1,000+ verified participants across 180+ countries.|" pages/tokenize.js
ok "Hero paragraph updated"

# ── Badges ───────────────────────────────────────────────────────────────────
sed -i "s|⏱️ 6–12 Week Process|📋 Structure Transparency|" pages/tokenize.js
ok "Badge updated"

# ── Steps section ────────────────────────────────────────────────────────────
sed -i "s|Tokenization Process|Representation Process|" pages/tokenize.js
sed -i "s|From Asset to Token in 5 Steps|From Asset to Digital Listing in 5 Steps|" pages/tokenize.js
ok "Steps header updated"

sed -i "s|Complete our online form with asset details, valuation, and legal structure.|Submit your asset details, structure, and documentation for review.|" pages/tokenize.js
sed -i "s|Our team reviews your asset for MiCA, AML, and regulatory compliance.|Our team reviews your submission for clarity, completeness, and regulatory alignment.|" pages/tokenize.js
sed -i "s|We structure the token as an ERC-3643 security token with full transfer controls.|Define how participation is represented using standardized digital structures.|" pages/tokenize.js
sed -i "s|Tokens are minted and listed on the Nextoken Capital platform for investors.|Your asset listing is published on the Nextoken marketplace for verified participants.|" pages/tokenize.js
sed -i "s|Your asset is live on the marketplace. Traders can browse, invest, and trade on the exchange.|Your listing is live. Participants can browse, evaluate, and engage with your opportunity.|" pages/tokenize.js
ok "Steps content updated"

# Rename steps
sed -i 's|title:"Submit Application"|title:"Submit Details"|' pages/tokenize.js
sed -i 's|title:"Compliance Review"|title:"Structure Review"|' pages/tokenize.js
sed -i 's|title:"Legal Structuring"|title:"Define Representation"|' pages/tokenize.js
sed -i 's|title:"Token Issuance"|title:"Publish Listing"|' pages/tokenize.js
sed -i 's|title:"Live on Platform"|title:"Live on Marketplace"|' pages/tokenize.js
ok "Step titles updated"

# ── Asset types section ──────────────────────────────────────────────────────
sed -i "s|What Can Be Tokenized?|What Can Be Represented?|" pages/tokenize.js
sed -i "s|Select the type of asset you want to tokenize. We support all major real-world asset classes.|Select the type of asset you want to list. You may choose to describe your asset using a tokenized structure.|" pages/tokenize.js
ok "Asset types header updated"

# ── FAQ updates ──────────────────────────────────────────────────────────────
sed -i 's|What types of assets can be tokenized?|What types of assets can be listed?|' pages/tokenize.js
sed -i "s|We support real estate, corporate bonds, company equity, renewable energy projects, funds, and other real-world assets with a clear legal ownership structure and verifiable valuation.|We support real estate, corporate bonds, company equity, renewable energy projects, funds, and other real-world assets. Asset owners define how participation is represented, including any digital structure.|" pages/tokenize.js

sed -i 's|What is the minimum asset value?|What is the minimum listing value?|' pages/tokenize.js
sed -i "s|We currently accept assets with a minimum valuation of EUR 500,000. For smaller assets, we recommend our pooled fund structure.|We currently accept listings with a minimum asset valuation of EUR 500,000. Asset owners are responsible for clearly defining ownership structure and participation rights.|" pages/tokenize.js

sed -i "s|How long does the process take?|How long does the listing process take?|" pages/tokenize.js
sed -i "s|The full tokenization process typically takes 6–12 weeks from application submission to going live on the platform, depending on asset complexity and jurisdiction.|The listing process typically takes 6–12 weeks from submission to going live, depending on asset complexity and jurisdiction. This includes structure review and compliance alignment.|" pages/tokenize.js

sed -i "s|We charge a one-time structuring fee of 1.5–3% of asset value plus annual platform fees of 0.5%. A full fee schedule is provided during the compliance review stage.|We charge a one-time structuring fee of 1.5–3% of asset value plus annual platform fees of 0.5%. Nextoken Capital does not issue or manage tokens. All structures are defined independently by asset owners.|" pages/tokenize.js

sed -i "s|No. We accept asset issuers from 70+ jurisdictions. The asset itself must comply with EU law if it is to be offered to EU investors.|No. We accept asset owners from 70+ jurisdictions. Tokenized representations may be subject to regulatory requirements depending on jurisdiction. Users are responsible for understanding compliance obligations.|" pages/tokenize.js

sed -i "s|Your asset appears on the Nextoken platform where verified investors can invest. You retain asset management control while investors hold digital ownership tokens.|Your listing appears on the Nextoken marketplace where verified participants can evaluate and engage. You retain asset management control. All published content remains the responsibility of the asset owner.|" pages/tokenize.js

sed -i "s|What happens after tokenization?|What happens after listing?|" pages/tokenize.js
ok "FAQ content updated"

# ── Form section ─────────────────────────────────────────────────────────────
sed -i "s|Apply to Tokenize|Submit Your Listing|" pages/tokenize.js
sed -i "s|Submit your application and our compliance team will get back to you within 2 business days.|Describe your asset and define how participation is represented. Our team will review within 2 business days.|" pages/tokenize.js
sed -i "s|Submit Application →|Submit for Review →|" pages/tokenize.js
ok "Form text updated"

# ── Why section ──────────────────────────────────────────────────────────────
sed -i "s|Why Nextoken Capital?|Structure \& Transparency|" pages/tokenize.js
sed -i "s|The regulated choice for tokenization|Asset owners are responsible for defining clear structures|" pages/tokenize.js
sed -i "s|We are the only EU-regulated tokenization platform in Lithuania with active Bank of Lithuania EMI and MiCA CASP authorizations.|Nextoken Capital provides a neutral marketplace environment. We do not issue, manage, or validate token structures. All representations must comply with applicable laws and regulations.|" pages/tokenize.js
ok "Why section updated"

# Update why cards
sed -i 's|title:"Fully Regulated"|title:"Neutral Marketplace"|' pages/tokenize.js
sed -i "s|EMI and MiCA CASP licenses from the Bank of Lithuania — not a grey-market platform.|A neutral platform where asset owners define their own structures independently. EU-regulated infrastructure.|" pages/tokenize.js

sed -i "s|All tokens issued under ERC-3643 with full transfer controls and investor whitelisting.|Digital representation standard with transfer controls. Structures are defined by asset owners, not the platform.|" pages/tokenize.js

sed -i 's|title:"1,000+ Investors"|title:"1,000+ Participants"|' pages/tokenize.js
sed -i "s|Instant access to a verified investor base in 180+ countries from day one.|Access to a verified participant base across 180+ countries. Tokenization does not imply liquidity or guaranteed participation.|" pages/tokenize.js

sed -i "s|Real-time cap tables, on-chain settlement, and full audit trail for every transaction.|Clear listing format with structured details. Verification badges indicate identity checks only, not validation of structure.|" pages/tokenize.js
sed -i 's|title:"On-chain Transparency"|title:"Structure Clarity"|' pages/tokenize.js

sed -i "s|Legal structuring, token issuance, investor onboarding, and secondary market — all in one platform.|Listing creation, participant onboarding, and marketplace access — all in one platform. All content responsibility lies with asset owners.|" pages/tokenize.js
sed -i 's|title:"End-to-end Service"|title:"Marketplace Access"|' pages/tokenize.js
ok "Why cards updated"

# ── CTA section ──────────────────────────────────────────────────────────────
sed -i "s|Ready to tokenize your asset?|Ready to list your asset?|" pages/tokenize.js
sed -i "s|Submit your application today and our team will be in touch within 2 business days.|Define your asset structure and submit for review. Our team will respond within 2 business days.|" pages/tokenize.js
sed -i "s|Apply Now →|Submit Listing →|" pages/tokenize.js
ok "CTA updated"

# ── Success message ──────────────────────────────────────────────────────────
sed -i "s|Application Received!|Listing Submitted!|" pages/tokenize.js
sed -i "s|Thank you! Our team will review your application and contact you within 2 business days.|Thank you! Our team will review your submission and contact you within 2 business days. Nextoken Capital does not validate or enforce token structures.|" pages/tokenize.js
ok "Success message updated"

# ── Deploy ───────────────────────────────────────────────────────────────────
log "Deploying..."
rm -f add-transactions.sh patch-features.sh
git add -A
git commit -m "content: tokenize page — marketplace-aligned positioning

Key changes (content only, no CSS/layout/navbar/footer changes):
  - 'Tokenize Your Asset' → 'Represent Your Asset Digitally'
  - 'Asset Tokenization' → 'Digital Asset Representation'
  - Steps renamed: Submit Details → Structure Review → Define Representation → Publish → Live
  - FAQs updated to emphasize asset owner responsibility
  - Why section → Structure & Transparency (neutral marketplace language)
  - Added disclaimers: platform does not issue/manage/validate tokens
  - All structures defined independently by asset owners
  - Verification badges = identity checks only, not structure validation
  - Tokenization = representation layer, not ownership alteration"

git push origin main
vercel --prod

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Tokenize page content updated!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  Key messaging:"
echo -e "    ✅ Tokenization = digital representation, not ownership change"
echo -e "    ✅ Platform is neutral — does not issue/manage/validate tokens"
echo -e "    ✅ Asset owners define structures independently"
echo -e "    ✅ Verification = identity only, not endorsement"
echo -e "    ✅ No promotional or misleading claims"
echo -e "    ✅ Marketplace identity stays clear and safe"
echo ""
