import Link from "next/link";

export default function Footer() {
  const columnTitleStyle = {
    fontSize: "0.75rem",
    fontWeight: "800",
    marginBottom: "24px",
    color: "#ffffff",
    letterSpacing: "1px",
    textTransform: "uppercase"
  };

  const linkStyle = {
    display: "block",
    color: "#6e7686",
    textDecoration: "none",
    fontSize: "0.9rem",
    marginBottom: "12px"
  };

  return (
    <footer style={{ backgroundColor: "#05060a", padding: "80px 20px 40px", color: "#ffffff", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) 2fr", gap: "60px", marginBottom: "60px" }}>
          
          {/* --- LEFT COLUMN: BRAND --- */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <span style={{ color: "#f5c15a", fontSize: "2rem", fontWeight: "900", letterSpacing: "-1px" }}>NXT</span>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
                <span style={{ fontWeight: "800", fontSize: "0.9rem", letterSpacing: "2px" }}>NEXTOKEN</span>
                <span style={{ fontSize: "0.75rem", color: "#6e7686", letterSpacing: "2px" }}>CAPITAL</span>
              </div>
            </div>
            
            <p style={{ color: "#6e7686", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "24px" }}>
              The regulated infrastructure for <br />
              tokenized real-world assets.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "12px 18px", borderRadius: "12px", width: "fit-content" }}>
              <div style={{ fontWeight: "bold", fontSize: "0.8rem", opacity: "0.8" }}>LT</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.6rem", color: "#6e7686", fontWeight: "600", letterSpacing: "0.5px" }}>MONITORED BY</span>
                <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>Bank of Lithuania</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMNS: LINKS --- */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            <div className="link-group">
              <h4 style={columnTitleStyle}>PRODUCTS</h4>
              <Link href="/markets" style={linkStyle}>Markets</Link>
              <Link href="/exchange" style={linkStyle}>Exchange</Link>
              <Link href="/bonds" style={linkStyle}>Bonds</Link>
              <Link href="/equity-ipo" style={linkStyle}>Equity & IPO</Link>
              <Link href="/tokenize" style={linkStyle}>Tokenize</Link>
            </div>

            <div className="link-group">
              <h4 style={columnTitleStyle}>COMPANY</h4>
              <Link href="/about" style={linkStyle}>About Us</Link>
              <Link href="/careers" style={linkStyle}>Careers</Link>
              <Link href="/press" style={linkStyle}>Press</Link>
              <Link href="/blog" style={linkStyle}>Blog</Link>
            </div>

            <div className="link-group">
              <h4 style={columnTitleStyle}>LEGAL</h4>
              <Link href="/terms" style={linkStyle}>Terms of Service</Link>
              <Link href="/privacy" style={linkStyle}>Privacy Policy</Link>
              <Link href="/risk" style={linkStyle}>Risk Disclosure</Link>
              <Link href="/aml" style={linkStyle}>AML Policy</Link>
            </div>

            <div className="link-group">
              <h4 style={columnTitleStyle}>SUPPORT</h4>
              <Link href="/help" style={linkStyle}>Help Center</Link>
              <Link href="/contact" style={linkStyle}>Contact Us</Link>
              <Link href="/api" style={linkStyle}>API Docs</Link>
              <Link href="/status" style={linkStyle}>Status</Link>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "32px", color: "#404654", fontSize: "0.8rem", lineHeight: "1.6" }}>
          <p>© {new Date().getFullYear()} Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
          <p style={{ marginTop: "8px" }}>
            Risk warning: Investing in tokenized assets involves risk. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  );
}