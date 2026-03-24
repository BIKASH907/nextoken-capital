#!/bin/bash
# ============================================================================
#  Nextoken Capital — CONTENT-ONLY Replacement Script
#
#  Changes ONLY text strings inside your existing components.
#  Does NOT touch: CSS, styles, layout, structure, classes, animations.
#
#  Usage:
#    cd "D:/New folder/nextoken-capital"
#    chmod +x update-content.sh
#    ./update-content.sh
#
#  To update a single component:
#    ./update-content.sh hero
#    ./update-content.sh services
#    ./update-content.sh stats
#    ./update-content.sh trust
#    ./update-content.sh footer
#    ./update-content.sh all        (default)
# ============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'
YELLOW='\033[1;33m'; BOLD='\033[1m'; NC='\033[0m'

log()  { echo -e "${CYAN}[nextoken]${NC} $1"; }
ok()   { echo -e "${GREEN}  ✔${NC} $1"; }
warn() { echo -e "${YELLOW}  ⚠${NC} $1"; }
err()  { echo -e "${RED}  ✖${NC} $1"; exit 1; }

# ── Pre-flight ───────────────────────────────────────────────────────────────
[ -f "package.json" ] || err "Run this from your project root (where package.json is)."
[ -d "components" ] || err "components/ directory not found."

# ── Git branch ───────────────────────────────────────────────────────────────
if [ -d ".git" ]; then
  BRANCH="content/marketplace-rebrand-$(date +%Y-%m-%d)"
  git checkout -b "$BRANCH" 2>/dev/null || warn "Branch $BRANCH already exists, continuing"
  log "Git branch: ${BOLD}${BRANCH}${NC}"
fi

TARGET="${1:-all}"

# ============================================================================
#  HERO — components/Hero.js
#  ONLY text changes: heroLabel, heroTitle, heroText, button labels
#  CSS module classes UNCHANGED
# ============================================================================
update_hero() {
log "Updating: ${BOLD}Hero.js${NC} (content only)"

cat > components/Hero.js << 'ENDOFFILE'
import styles from "../styles/Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>The Regulated RWA Marketplace</p>
          <h1 className={styles.heroTitle}>
            Real-World Assets, Reimagined. Trade Tokenized Securities 24/7.
          </h1>
          <p className={styles.heroText}>
            Nextoken Capital is a structured digital marketplace for tokenized real-world
            assets — from bonds and equities to real estate and commodities. Issue, trade,
            and settle with institutional-grade security and MiCA compliance.
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn}>Explore Marketplace</button>
            <button className={styles.secondaryBtn}>List an Asset</button>
          </div>
        </div>
      </div>
    </section>
  );
}
ENDOFFILE
ok "components/Hero.js"
}

# ============================================================================
#  SERVICES SECTION — components/ServicesSection.js
#  ONLY text changes: sectionLabel, sectionTitle, sectionText, card titles/text
#  CSS module classes + ServiceCard component UNCHANGED
# ============================================================================
update_services() {
log "Updating: ${BOLD}ServicesSection.js${NC} (content only)"

cat > components/ServicesSection.js << 'ENDOFFILE'
import ServiceCard from "./ServiceCard";
import styles from "../styles/ServicesSection.module.css";

export default function ServicesSection() {
  const services = [
    {
      title: "Tokenized Bonds",
      text: "Trade sovereign and corporate bonds as digital tokens with instant settlement and transparent pricing on-chain.",
    },
    {
      title: "Fractional Real Estate",
      text: "Access residential and commercial property shares starting from €100 — global real estate, fractionalized and liquid.",
    },
    {
      title: "Equity & IPO",
      text: "Participate in blockchain-native IPOs and trade equity tokens of high-growth European ventures on our secondary market.",
    },
    {
      title: "Commodity Tokens",
      text: "Invest in digitized agricultural and industrial commodities with full traceability and regulated custody.",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Marketplace</p>
          <h2 className={styles.sectionTitle}>Trade Real-World Assets On-Chain</h2>
          <p className={styles.sectionText}>
            A curated selection of yield-bearing tokenized assets. Each listing undergoes
            a rigorous 5-point verification process before reaching our exchange.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              text={service.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
ENDOFFILE
ok "components/ServicesSection.js"
}

# ============================================================================
#  STATS SECTION — components/StatsSection.js
#  ONLY text changes: stat numbers and labels
#  CSS module classes UNCHANGED
# ============================================================================
update_stats() {
log "Updating: ${BOLD}StatsSection.js${NC} (content only)"

cat > components/StatsSection.js << 'ENDOFFILE'
import styles from "../styles/StatsSection.module.css";

export default function StatsSection() {
  const stats = [
    { number: "0.25%", text: "Trading Fee" },
    { number: "24/7", text: "Market Access" },
    { number: "T+0", text: "Settlement Time" },
    { number: "MiCA", text: "EU Compliant" },
  ];

  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {stats.map((item) => (
            <div key={item.text} className={styles.statCard}>
              <h3 className={styles.statNumber}>{item.number}</h3>
              <p className={styles.statText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
ENDOFFILE
ok "components/StatsSection.js"
}

# ============================================================================
#  TRUST SECTION — components/TrustSection.js
#  ONLY text changes: sectionLabel, sectionTitleLight, sectionTextLight
#  CSS module classes UNCHANGED
# ============================================================================
update_trust() {
log "Updating: ${BOLD}TrustSection.js${NC} (content only)"

cat > components/TrustSection.js << 'ENDOFFILE'
import styles from "../styles/TrustSection.module.css";

export default function TrustSection() {
  return (
    <section className={styles.trustSection}>
      <div className={styles.container}>
        <div className={styles.trustBox}>
          <p className={styles.sectionLabel}>Why Nextoken Capital</p>
          <h2 className={styles.sectionTitleLight}>
            Security First. Compliance Built-In. Trust Automated.
          </h2>
          <p className={styles.sectionTextLight}>
            MiCA-compliant infrastructure with institutional custody, AI-powered KYC/AML,
            and audited smart contracts. Your assets are protected by multi-signature vaults
            and regulated custodians — not promises.
          </p>
        </div>
      </div>
    </section>
  );
}
ENDOFFILE
ok "components/TrustSection.js"
}

# ============================================================================
#  FOOTER — components/Footer.js
#  ONLY text changes: column title, tagline, risk warning
#  ALL CSS (inline <style>) UNCHANGED — copied verbatim from your original
# ============================================================================
update_footer() {
log "Updating: ${BOLD}Footer.js${NC} (content only)"

cat > components/Footer.js << 'ENDOFFILE'
import Link from "next/link";

export default function Footer() {
  const cols = [
    { title: "MARKETPLACE", links: [
      { href: "/markets", label: "All Markets" },
      { href: "/exchange", label: "Exchange" },
      { href: "/bonds", label: "Bonds" },
      { href: "/equity-ipo", label: "Equity & IPO" },
      { href: "/tokenize", label: "Tokenize Asset" },
    ]},
    { title: "COMPANY", links: [
      { href: "/about", label: "About Us" },
      { href: "/careers", label: "Careers" },
      { href: "/press", label: "Press" },
      { href: "/blog", label: "Blog" },
    ]},
    { title: "LEGAL", links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/risk", label: "Risk Disclosure" },
      { href: "/aml", label: "AML Policy" },
      { href: "/fees", label: "Fees & Pricing" },
    ]},
    { title: "SUPPORT", links: [
      { href: "/help", label: "Help Center" },
      { href: "/contact", label: "Contact Us" },
      { href: "/api", label: "API Docs" },
      { href: "/status", label: "System Status" },
    ]},
  ];

  return (
    <>
      <style>{`
        .footer { background:#05060a; border-top:1px solid rgba(255,255,255,0.07); padding:60px 20px 32px; }
        .footer-inner { max-width:1280px; margin:0 auto; }
        .footer-top { display:grid; grid-template-columns:1.6fr repeat(4,1fr); gap:48px; margin-bottom:48px; }
        .footer-brand-logo { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .footer-nxt { font-size:20px; font-weight:900; color:#F0B90B; }
        .footer-line { width:1px; height:28px; background:rgba(255,255,255,0.15); }
        .footer-brand-text { display:flex; flex-direction:column; line-height:1.1; }
        .footer-brand-text .bt1 { font-size:11px; font-weight:800; color:#fff; letter-spacing:2px; }
        .footer-brand-text .bt2 { font-size:9px; color:rgba(255,255,255,0.4); letter-spacing:3px; }
        .footer-tagline { font-size:13px; color:rgba(255,255,255,0.4); line-height:1.7; margin-bottom:20px; max-width:200px; }
        .footer-badge { display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:8px; background:rgba(240,185,11,0.06); border:1px solid rgba(240,185,11,0.2); }
        .footer-badge-label { font-size:10px; color:rgba(255,255,255,0.45); display:block; }
        .footer-badge-value { font-size:11px; font-weight:700; color:#F0B90B; display:block; }
        .footer-col-title { font-size:11px; font-weight:700; color:rgba(255,255,255,0.3); letter-spacing:2px; text-transform:uppercase; margin-bottom:16px; }
        .footer-col a { display:block; font-size:13px; color:rgba(255,255,255,0.5); text-decoration:none; margin-bottom:10px; transition:color .15s; }
        .footer-col a:hover { color:#fff; }
        .footer-bottom { border-top:1px solid rgba(255,255,255,0.06); padding-top:28px; }
        .footer-copy { font-size:12px; color:rgba(255,255,255,0.28); }
        .footer-risk { font-size:11px; color:rgba(255,255,255,0.18); line-height:1.7; margin-top:18px; }
        @media(max-width:1024px){ .footer-top{ grid-template-columns:1fr 1fr 1fr; gap:32px; } .footer-brand{ grid-column:1/-1; } }
        @media(max-width:640px){ .footer-top{ grid-template-columns:1fr 1fr; gap:24px; } .footer-brand{ grid-column:1/-1; } }
      `}</style>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-brand-logo">
                <span className="footer-nxt">NXT</span>
                <div className="footer-line" />
                <div className="footer-brand-text">
                  <span className="bt1">NEXTOKEN</span>
                  <span className="bt2">CAPITAL</span>
                </div>
              </div>
              <p className="footer-tagline">The regulated marketplace for tokenized real-world assets.</p>
              <div className="footer-badge">
                <span>🏛️</span>
                <div>
                  <span className="footer-badge-label">MONITORED BY</span>
                  <span className="footer-badge-value">Bank of Lithuania</span>
                </div>
              </div>
            </div>
            {cols.map((col) => (
              <div key={col.title} className="footer-col">
                <div className="footer-col-title">{col.title}</div>
                {col.links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
            <p className="footer-risk">Risk warning: Trading tokenized assets involves risk including potential loss of capital. Past performance is not indicative of future results. Nextoken Capital is a marketplace platform — we do not provide financial advice or manage funds.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
ENDOFFILE
ok "components/Footer.js"
}

# ============================================================================
#  ROUTER
# ============================================================================

case "$TARGET" in
  all)
    update_hero
    update_services
    update_stats
    update_trust
    update_footer
    ;;
  hero)     update_hero ;;
  services) update_services ;;
  stats)    update_stats ;;
  trust)    update_trust ;;
  footer)   update_footer ;;
  *)        err "Unknown: $TARGET. Options: all, hero, services, stats, trust, footer" ;;
esac

# ── Git commit ───────────────────────────────────────────────────────────────
if [ -d ".git" ]; then
  log "Staging changes..."
  git add -A

  git commit -m "content: rebrand from investment company to marketplace

Components updated (content only — zero UI/style changes):
  - Hero.js: 'Capital Solutions' → 'The Regulated RWA Marketplace'
  - ServicesSection.js: generic services → Bonds, Real Estate, Equity, Commodities
  - StatsSection.js: vague words → 0.25% fee, 24/7, T+0 settlement, MiCA
  - TrustSection.js: 'Professional Design' → 'Security First. Compliance Built-In.'
  - Footer.js: 'PRODUCTS' → 'MARKETPLACE', stronger risk disclaimer

Untouched: Navbar, AuthModal, Dashboard, Chatbot, AdminLayout,
  ServiceCard, all CSS modules, all inline styles, all animations."

  ok "Committed successfully"
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Done! Your site now reads like a marketplace.${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BOLD}What changed (text only):${NC}"
echo ""
echo -e "    HERO:"
echo -e "      Before: 'Capital Solutions for Modern Markets'"
echo -e "      After:  'The Regulated RWA Marketplace'"
echo ""
echo -e "    SERVICES:"
echo -e "      Before: Market Access, Capital Solutions, Equity & IPO, Client Support"
echo -e "      After:  Tokenized Bonds, Fractional Real Estate, Equity & IPO, Commodity Tokens"
echo ""
echo -e "    STATS:"
echo -e "      Before: 24/7 Platform Access, Global Investor Reach, Secure Infrastructure, Fast Onboarding"
echo -e "      After:  0.25% Trading Fee, 24/7 Market Access, T+0 Settlement, MiCA EU Compliant"
echo ""
echo -e "    TRUST:"
echo -e "      Before: 'Professional Design. Clear Structure. Trusted Experience.'"
echo -e "      After:  'Security First. Compliance Built-In. Trust Automated.'"
echo ""
echo -e "    FOOTER:"
echo -e "      Before: 'PRODUCTS' column, 'infrastructure for tokenized real-world assets'"
echo -e "      After:  'MARKETPLACE' column, 'marketplace for tokenized real-world assets' + stronger disclaimer"
echo ""
echo -e "  ${BOLD}NOT changed:${NC} Navbar, wallet modal, dashboard, chatbot, admin, all CSS, all styles"
echo ""
echo -e "  ${CYAN}npm run dev${NC}              — preview"
echo -e "  ${CYAN}git push -u origin HEAD${NC}  — push"
echo ""
