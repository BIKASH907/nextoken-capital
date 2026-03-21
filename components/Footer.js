export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brandCol}>
          <div style={styles.logoGroup}>
            <div style={styles.nxtBox}>NXT</div>
            <div>
               <div style={{fontWeight: 'bold', fontSize: '16px'}}>NEXTOKEN</div>
               <div style={{fontSize: '10px', color: '#F0B90B'}}>CAPITAL</div>
            </div>
          </div>
          <p style={styles.tagline}>The regulated infrastructure for tokenized real-world assets.</p>
          <div style={styles.badge}>
            <span style={{color: '#848e9c', fontSize: '10px'}}>MONITORED BY</span>
            <div style={{fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}>
              <span style={{background: '#333', padding: '2px 4px', borderRadius: '2px'}}>LT</span> Bank of Lithuania
            </div>
          </div>
        </div>

        <div style={styles.linkGrid}>
          <div style={styles.col}>
            <h4 style={styles.colTitle}>PRODUCTS</h4>
            <a href="/markets" style={styles.link}>Markets</a>
            <a href="/exchange" style={styles.link}>Exchange</a>
            <a href="/bonds" style={styles.link}>Bonds</a>
          </div>
          <div style={styles.col}>
            <h4 style={styles.colTitle}>COMPANY</h4>
            <a href="/about" style={styles.link}>About Us</a>
            <a href="/careers" style={styles.link}>Careers</a>
          </div>
          <div style={styles.col}>
            <h4 style={styles.colTitle}>LEGAL</h4>
            <a href="/terms" style={styles.link}>Terms of Service</a>
            <a href="/privacy" style={styles.link}>Privacy Policy</a>
          </div>
          <div style={styles.col}>
            <h4 style={styles.colTitle}>SUPPORT</h4>
            <a href="/help" style={styles.link}>Help Center</a>
            <a href="/contact" style={styles.link}>Contact Us</a>
          </div>
        </div>
      </div>
      <div style={styles.bottomBar}>
        <p>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
        <p style={{marginTop: '5px', color: '#444'}}>Risk warning: Investing in tokenized assets involves risk.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: "#05060a", color: "white", padding: "80px 0 40px", borderTop: "1px solid #1a1b23" },
  container: { maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", padding: "0 40px" },
  brandCol: { maxWidth: "300px" },
  logoGroup: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
  nxtBox: { background: "#F0B90B", color: "black", padding: "2px 6px", fontWeight: "bold", borderRadius: "3px" },
  tagline: { color: "#848e9c", fontSize: "14px", lineHeight: "1.6", marginBottom: "30px" },
  badge: { border: "1px solid #333", padding: "15px", borderRadius: "12px", background: "rgba(255,255,255,0.02)" },
  linkGrid: { display: "flex", gap: "80px" },
  colTitle: { fontSize: "14px", fontWeight: "bold", marginBottom: "20px", color: "white" },
  link: { display: "block", color: "#848e9c", textDecoration: "none", fontSize: "14px", marginBottom: "12px" },
  bottomBar: { maxWidth: "1400px", margin: "60px auto 0", padding: "40px 40px 0", borderTop: "1px solid #1a1b23", color: "#444", fontSize: "12px" }
};
