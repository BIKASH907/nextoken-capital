import Head from "next/head";
import Link from "next/link";

export default function Home() {

  return (
    <>
      <Head>
        <title>Nextoken Capital</title>
        <meta
          name="description"
          content="Nextoken Capital - Modern capital access, market insights, and financial services."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.page}>

        {/* HERO */}
        <section style={styles.hero}>
          <div style={styles.container}>
            <div style={styles.heroContent}>
              <p style={styles.heroLabel}>Capital Solutions for Modern Markets</p>
              <h1 style={styles.heroTitle}>
                Connecting Investors, Opportunities, and Financial Access
              </h1>
              <p style={styles.heroText}>
                Nextoken Capital delivers a modern platform experience for market access,
                capital solutions, investment visibility, and structured financial services.
              </p>

              <div style={styles.heroButtons}>
                <button style={styles.primaryBtn}>Get Started</button>
                <button style={styles.secondaryBtn}>Explore Services</button>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section style={styles.statsSection}>
          <div style={styles.container}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <h3 style={styles.statNumber}>24/7</h3>
                <p style={styles.statText}>Platform Access</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statNumber}>Global</h3>
                <p style={styles.statText}>Investor Reach</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statNumber}>Secure</h3>
                <p style={styles.statText}>Infrastructure</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statNumber}>Fast</h3>
                <p style={styles.statText}>Client Onboarding</p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeading}>
              <p style={styles.sectionLabel}>Our Services</p>
              <h2 style={styles.sectionTitle}>Built for Access, Clarity, and Confidence</h2>
              <p style={styles.sectionText}>
                A streamlined digital experience designed for clients seeking structured
                financial access and a professional capital platform.
              </p>
            </div>

            <div style={styles.cardsGrid}>
              <div style={styles.serviceCard}>
                <h3 style={styles.cardTitle}>Market Access</h3>
                <p style={styles.cardText}>
                  Access a digital-first environment built to support financial visibility
                  and participation across modern markets.
                </p>
              </div>

              <div style={styles.serviceCard}>
                <h3 style={styles.cardTitle}>Capital Solutions</h3>
                <p style={styles.cardText}>
                  Explore structured opportunities designed to connect capital with
                  business and investor needs.
                </p>
              </div>

              <div style={styles.serviceCard}>
                <h3 style={styles.cardTitle}>Equity & IPO</h3>
                <p style={styles.cardText}>
                  Engage with public and private market opportunities through a clean,
                  modern user experience.
                </p>
              </div>

              <div style={styles.serviceCard}>
                <h3 style={styles.cardTitle}>Client Support</h3>
                <p style={styles.cardText}>
                  Benefit from a platform model focused on transparency, responsiveness,
                  and service continuity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section style={styles.trustSection}>
          <div style={styles.container}>
            <div style={styles.trustBox}>
              <p style={styles.sectionLabel}>Why Nextoken Capital</p>
              <h2 style={styles.sectionTitleLight}>Professional Design. Clear Structure. Trusted Experience.</h2>
              <p style={styles.sectionTextLight}>
                From onboarding to account access, every touchpoint is designed to feel
                consistent, secure, and easy to use across desktop and mobile.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <div style={styles.container}>
            <div style={styles.footerTop}>
              <div style={styles.footerBrandCol}>
                <div style={styles.footerBrand}>Nextoken Capital</div>
                <p style={styles.footerBrandText}>
                  A modern financial platform experience focused on market access,
                  structured capital solutions, and professional client support.
                </p>
              </div>

              <div style={styles.footerGrid}>
                <div>
                  <h4 style={styles.footerTitle}>Product</h4>
                  <ul style={styles.footerList}>
                    <li><Link href="/markets" style={styles.footerLink}>Markets</Link></li>
                    <li><Link href="/exchange" style={styles.footerLink}>Exchange</Link></li>
                    <li><Link href="/bonds" style={styles.footerLink}>Bonds</Link></li>
                    <li><Link href="/equity" style={styles.footerLink}>Equity & IPO</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 style={styles.footerTitle}>Company</h4>
                  <ul style={styles.footerList}>
                    <li><Link href="/about" style={styles.footerLink}>About Us</Link></li>
                    <li><Link href="/contact" style={styles.footerLink}>Contact Us</Link></li>
                    <li><Link href="/careers" style={styles.footerLink}>Careers</Link></li>
                    <li><Link href="/partners" style={styles.footerLink}>Partners</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 style={styles.footerTitle}>Legal</h4>
                  <ul style={styles.footerList}>
                    <li><Link href="/terms" style={styles.footerLink}>Terms of Use</Link></li>
                    <li><Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link></li>
                    <li><Link href="/disclaimer" style={styles.footerLink}>Disclaimer</Link></li>
                    <li><Link href="/compliance" style={styles.footerLink}>Compliance</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 style={styles.footerTitle}>Support</h4>
                  <ul style={styles.footerList}>
                    <li><Link href="/help-center" style={styles.footerLink}>Help Center</Link></li>
                    <li><Link href="/support" style={styles.footerLink}>Support Desk</Link></li>
                    <li><Link href="/faq" style={styles.footerLink}>FAQ</Link></li>
                    <li><Link href="/contact" style={styles.footerLink}>Contact Support</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={styles.footerBottom}>
              <p style={styles.footerBottomText}>
                © {new Date().getFullYear()} Nextoken Capital. All rights reserved.
              </p>

              {/* ONLY keep this exact line if it is legally correct */}
              <p style={styles.footerCompliance}>
                Monitored by the Bank of Lithuania
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

const styles = {
  page: {
    backgroundColor: "#0b0e11",
    color: "#ffffff",
    minHeight: "100vh",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    paddingLeft: "20px",
    paddingRight: "20px",
    boxSizing: "border-box",
  },

  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "rgba(11, 14, 17, 0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  navInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    position: "relative",
  },

  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "#ffffff",
    flexShrink: 0,
  },

  brandMark: {
    fontSize: "24px",
    fontWeight: 800,
    letterSpacing: "1px",
    color: "#f0b90b",
  },

  brandText: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#ffffff",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    flex: 1,
    justifyContent: "center",
  },

  navLinksMobileOpen: {
    position: "absolute",
    top: "72px",
    left: "20px",
    right: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "16px",
    background: "#11161c",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
  },

  navLink: {
    color: "#d1d5db",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 500,
  },

  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },

  loginBtn: {
    background: "transparent",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.18)",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: "pointer",
  },

  registerBtn: {
    background: "#f0b90b",
    color: "#111111",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: 700,
    cursor: "pointer",
  },

  menuButton: {
    display: "none",
    background: "transparent",
    border: "none",
    padding: "6px",
    cursor: "pointer",
    flexDirection: "column",
    gap: "4px",
  },

  menuLine: {
    width: "20px",
    height: "2px",
    background: "#ffffff",
    display: "block",
  },

  hero: {
    paddingTop: "110px",
    paddingBottom: "90px",
    background:
      "radial-gradient(circle at top center, rgba(240,185,11,0.14), transparent 32%), linear-gradient(180deg, #0b0e11 0%, #11161c 100%)",
  },

  heroContent: {
    maxWidth: "760px",
    margin: "0 auto",
    textAlign: "center",
  },

  heroLabel: {
    color: "#f0b90b",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    marginBottom: "18px",
  },

  heroTitle: {
    fontSize: "56px",
    lineHeight: 1.08,
    margin: "0 0 20px",
    fontWeight: 800,
  },

  heroText: {
    margin: "0 auto",
    maxWidth: "680px",
    color: "#b6bec9",
    fontSize: "18px",
    lineHeight: 1.7,
  },

  heroButtons: {
    marginTop: "34px",
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    background: "#f0b90b",
    color: "#111111",
    border: "none",
    borderRadius: "12px",
    padding: "14px 22px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
  },

  secondaryBtn: {
    background: "transparent",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "12px",
    padding: "14px 22px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
  },

  statsSection: {
    paddingBottom: "30px",
    background: "#11161c",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "18px",
  },

  statCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "18px",
    padding: "26px 20px",
    textAlign: "center",
  },

  statNumber: {
    margin: "0 0 8px",
    fontSize: "28px",
    fontWeight: 800,
    color: "#ffffff",
  },

  statText: {
    margin: 0,
    color: "#9ca3af",
    fontSize: "14px",
  },

  section: {
    padding: "90px 0",
    background: "#ffffff",
    color: "#111111",
  },

  sectionHeading: {
    textAlign: "center",
    maxWidth: "760px",
    margin: "0 auto 42px",
  },

  sectionLabel: {
    color: "#f0b90b",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1.1px",
    textTransform: "uppercase",
    marginBottom: "12px",
  },

  sectionTitle: {
    margin: "0 0 14px",
    fontSize: "40px",
    lineHeight: 1.2,
    fontWeight: 800,
    color: "#111111",
  },

  sectionText: {
    margin: 0,
    fontSize: "17px",
    lineHeight: 1.7,
    color: "#5b6470",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "20px",
  },

  serviceCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "28px 22px",
    boxShadow: "0 14px 32px rgba(17, 24, 39, 0.05)",
  },

  cardTitle: {
    margin: "0 0 12px",
    fontSize: "20px",
    fontWeight: 700,
    color: "#111111",
  },

  cardText: {
    margin: 0,
    color: "#5b6470",
    lineHeight: 1.7,
    fontSize: "15px",
  },

  trustSection: {
    padding: "90px 0",
    background:
      "linear-gradient(180deg, #0f1318 0%, #0b0e11 100%)",
  },

  trustBox: {
    maxWidth: "820px",
    margin: "0 auto",
    textAlign: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "42px 28px",
  },

  sectionTitleLight: {
    margin: "0 0 14px",
    fontSize: "38px",
    lineHeight: 1.2,
    fontWeight: 800,
    color: "#ffffff",
  },

  sectionTextLight: {
    margin: 0,
    fontSize: "17px",
    lineHeight: 1.7,
    color: "#b6bec9",
  },

  footer: {
    background: "#0b0e11",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: "56px",
    paddingBottom: "24px",
  },

  footerTop: {
    display: "grid",
    gridTemplateColumns: "1.2fr 2fr",
    gap: "40px",
    paddingBottom: "30px",
  },

  footerBrandCol: {
    maxWidth: "360px",
  },

  footerBrand: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#ffffff",
    marginBottom: "14px",
  },

  footerBrandText: {
    margin: 0,
    color: "#9ca3af",
    lineHeight: 1.8,
    fontSize: "15px",
  },

  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "24px",
  },

  footerTitle: {
    margin: "0 0 16px",
    fontSize: "15px",
    fontWeight: 700,
    color: "#ffffff",
  },

  footerList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: "12px",
  },

  footerLink: {
    color: "#9ca3af",
    textDecoration: "none",
    fontSize: "14px",
  },

  footerBottom: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  footerBottomText: {
    margin: 0,
    color: "#7d8590",
    fontSize: "13px",
  },

  footerCompliance: {
    margin: 0,
    color: "#f0b90b",
    fontSize: "13px",
    fontWeight: 600,
  },
};

if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @media (max-width: 1024px) {
      nav a {
        font-size: 14px;
      }
    }

    @media (max-width: 900px) {
      .hide-mobile {
        display: none !important;
      }
    }

    @media (max-width: 860px) {
      body .stats-grid-fix,
      body .cards-grid-fix,
      body .footer-grid-fix,
      body .footer-top-fix {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 860px) {
      body * {}
    }

    @media (max-width: 860px) {
      div[style*="grid-template-columns: repeat(4, minmax(0, 1fr))"] {
        grid-template-columns: 1fr 1fr !important;
      }
      div[style*="grid-template-columns: 1.2fr 2fr"] {
        grid-template-columns: 1fr !important;
      }
      div[style*="grid-template-columns: repeat(4, minmax(0, 1fr))"][style*="gap: 24px"] {
        grid-template-columns: 1fr 1fr !important;
      }
    }

    @media (max-width: 768px) {
      button[aria-label="Toggle menu"] {
        display: flex !important;
      }

      nav[style] {
        display: none !important;
      }

      nav[style*="position: absolute"] {
        display: flex !important;
      }

      div[style*="justify-content: center"][style*="gap: 24px"] {
        display: none !important;
      }

      h1 {
        font-size: 40px !important;
      }
    }

    @media (max-width: 640px) {
      h1 {
        font-size: 34px !important;
      }

      h2 {
        font-size: 30px !important;
      }

      div[style*="grid-template-columns: repeat(4, minmax(0, 1fr))"] {
        grid-template-columns: 1fr !important;
      }

      div[style*="grid-template-columns: repeat(4, minmax(0, 1fr))"][style*="gap: 24px"] {
        grid-template-columns: 1fr 1fr !important;
      }

      div[style*="padding: 16px 20px"][style*="display: flex"] {
        flex-wrap: wrap;
      }

      span[style*="font-size: 18px"][style*="font-weight: 700"] {
        display: none;
      }
    }

    @media (max-width: 480px) {
      div[style*="grid-template-columns: repeat(4, minmax(0, 1fr))"][style*="gap: 24px"] {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(style);
}