export default function Home() {
  return (
    <div style={{ background: "#05060a", color: "white", fontFamily: "sans-serif", minHeight: "100vh" }}>
      
      <main>
        {/* --- Hero Section --- */}
        <section style={styles.heroSection}>
          <div style={styles.contentBox}>
            <h4 style={styles.eyebrow}>CAPITAL SOLUTIONS FOR MODERN MARKETS</h4>
            
            <h1 style={styles.mainHeadline}>
              Connecting Investors,<br />
              Opportunities, and <br />
              <span style={{ color: "#F0B90B" }}>Financial Access</span>
            </h1>
            
            <p style={styles.description}>
              Nextoken Capital delivers a modern platform experience for market access, 
              capital solutions, investment visibility, and structured financial services.
            </p>

            <div style={styles.buttonGroup}>
              <button style={styles.primaryButton}>Explore Markets</button>
              <button style={styles.secondaryButton}>Tokenize Assets</button>
            </div>
          </div>
        </section>

        {/* --- "Ready to Tokenize" Section (From Image) --- */}
        <section style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>Ready to tokenize the world?</h2>
          <p style={styles.ctaSub}>Join 12,400+ investors and issuers on the platform.</p>
          <button style={styles.ctaButton}>Create Free Account</button>
        </section>
      </main>

      {/* --- Institutional Footer Section (From Image) --- */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          
          {/* Brand & Regulatory Section */}
          <div style={styles.footerBrand}>
            <div style={styles.footerLogoGroup}>
              <div style={styles.nxtBox}>NXT</div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "16px", letterSpacing: "1px" }}>NEXTOKEN</div>
                <div style={{ fontSize: "10px", color: "#F0B90B", fontWeight: "bold" }}>CAPITAL</div>
              </div>
            </div>
            <p style={styles.footerTagline}>The regulated infrastructure for tokenized real-world assets.</p>
            
            <div style={styles.monitorBadge}>
              <span style={{ fontSize: "10px", color: "#848e9c", display: "block", marginBottom: "4px" }}>MONITORED BY</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ background: "#333", padding: "2px 4px", borderRadius: "2px", fontSize: "10px" }}>LT</span>
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>Bank of Lithuania</span>
              </div>
            </div>
          </div>

          {/* Footer Navigation Grid */}
          <div style={styles.footerLinksGrid}>
            <div style={styles.footerCol}>
              <h4 style={styles.footerColTitle}>PRODUCTS</h4>
              <a href="/markets" style={styles.footerLink}>Markets</a>
              <a href="/exchange" style={styles.footerLink}>Exchange</a>
              <a href="/bonds" style={styles.footerLink}>Bonds</a>
              <a href="/equity-ipo" style={styles.footerLink}>Equity & IPO</a>
              <a href="/tokenize" style={styles.footerLink}>Tokenize</a>
            </div>
            
            <div style={styles.footerCol}>
              <h4 style={styles.footerColTitle}>COMPANY</h4>
              <a href="/about" style={styles.footerLink}>About Us</a>
              <a href="/careers" style={styles.footerLink}>Careers</a>
              <a href="/press" style={styles.footerLink}>Press</a>
              <a href="/blog" style={styles.footerLink}>Blog</a>
            </div>
            
            <div style={styles.footerCol}>
              <h4 style={styles.footerColTitle}>LEGAL</h4>
              <a href="/terms" style={styles.footerLink}>Terms of Service</a>
              <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
              <a href="/risk" style={styles.footerLink}>Risk Disclosure</a>
              <a href="/aml" style={styles.footerLink}>AML Policy</a>
            </div>
            
            <div style={styles.footerCol}>
              <h4 style={styles.footerColTitle}>SUPPORT</h4>
              <a href="/help" style={styles.footerLink}>Help Center</a>
              <a href="/contact" style={styles.footerLink}>Contact Us</a>
              <a href="/api" style={styles.footerLink}>API Docs</a>
              <a href="/status" style={styles.footerLink}>Status</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.copyrightBar}>
          <p>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
          <p style={{ marginTop: "8px", color: "#444" }}>
            Risk warning: Investing in tokenized assets involves risk. Past performance is not indicative of future results.
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  heroSection: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "140px 20px", textAlign: "center" },
  contentBox: { maxWidth: "950px" },
  eyebrow: { color: "#F0B90B", fontSize: "14px", fontWeight: "700", letterSpacing: "3px", marginBottom: "24px", textTransform: "uppercase" },
  mainHeadline: { fontSize: "82px", fontWeight: "800", lineHeight: "1.05", letterSpacing: "-2px", marginBottom: "32px" },
  description: { fontSize: "20px", color: "#a0a0a0", lineHeight: "1.6", maxWidth: "750px", margin: "0 auto 48px auto" },
  buttonGroup: { display: "flex", gap: "20px", justifyContent: "center" },
  primaryButton: { background: "#F0B90B", color: "#000", padding: "18px 42px", borderRadius: "10px", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer" },
  secondaryButton: { background: "rgba(255,255,255,0.03)", color: "#fff", padding: "18px 42px", borderRadius: "10px", border: "1px solid #333", fontSize: "16px", fontWeight: "bold", cursor: "pointer" },

  // CTA Section
  ctaSection: { padding: "100px 20px", textAlign: "center", borderTop: "1px solid #1a1b23", background: "radial-gradient(circle at center, #111 0%, #05060a 100%)" },
  ctaTitle: { fontSize: "48px", fontWeight: "800", marginBottom: "16px" },
  ctaSub: { fontSize: "18px", color: "#848e9c", marginBottom: "40px" },
  ctaButton: { background: "#F0B90B", color: "#000", padding: "20px 50px", borderRadius: "12px", fontSize: "18px", fontWeight: "bold", border: "none", cursor: "pointer", boxShadow: "0 0 30px rgba(240, 185, 11, 0.2)" },

  // Footer Styles
  footer: { background: "#05060a", padding: "80px 0 40px 0", borderTop: "1px solid #1a1b23" },
  footerContainer: { maxWidth: "1400px", margin: "0 auto", padding: "0 40px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "60px" },
  footerBrand: { maxWidth: "320px" },
  footerLogoGroup: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" },
  nxtBox: { background: "#F0B90B", color: "black", padding: "4px 8px", fontWeight: "900", borderRadius: "4px", fontSize: "16px" },
  footerTagline: { color: "#848e9c", fontSize: "15px", lineHeight: "1.6", marginBottom: "32px" },
  monitorBadge: { border: "1px solid #1a1b23", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", display: "inline-block" },
  footerLinksGrid: { display: "flex", gap: "80px", flexWrap: "wrap" },
  footerCol: { display: "flex", flexDirection: "column", gap: "12px" },
  footerColTitle: { fontSize: "14px", fontWeight: "bold", color: "white", marginBottom: "12px", letterSpacing: "1px" },
  footerLink: { color: "#848e9c", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" },
  copyrightBar: { maxWidth: "1400px", margin: "60px auto 0 auto", padding: "40px 40px 0 40px", borderTop: "1px solid #1a1b23", fontSize: "12px", color: "#444" }
};