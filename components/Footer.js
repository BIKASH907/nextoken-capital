import Link from "next/link";

export default function Footer() {
  const columnTitleStyle = {
    color: "#fff",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    marginBottom: "24px",
    textTransform: "uppercase"
  };

  const linkStyle = {
    color: "#6e7686",
    textDecoration: "none",
    fontSize: "14px",
    display: "block",
    marginBottom: "14px",
    transition: "color 0.2s"
  };

  return (
    <footer style={{ backgroundColor: "#05060a", padding: "80px 40px 40px", borderTop: "1px solid #141721" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        {/* TOP SECTION: LOGO + COLUMNS */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr", gap: "40px", marginBottom: "80px" }}>
          
          {/* Brand & Badge Area */}
          <div style={{ paddingRight: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ color: "#f5c15a", fontSize: "24px", fontWeight: "900" }}>NXT</span>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
                <span style={{ fontWeight: "800", fontSize: "14px", letterSpacing: "1.5px", color: "#fff" }}>NEXTOKEN</span>
                <span style={{ fontSize: "10px", color: "#6e7686", letterSpacing: "1.5px", marginTop: "2px" }}>CAPITAL</span>
              </div>
            </div>
            
            <p style={{ color: "#6e7686", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
              The regulated infrastructure for <br /> tokenized real-world assets.
            </p>

            {/* Lithuania Badge - Exact Match */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              background: "rgba(255, 255, 255, 0.02)", 
              border: "1px solid #1a1d26", 
              padding: "12px 16px", 
              borderRadius: "10px", 
              width: "fit-content" 
            }}>
              <span style={{ color: "#fff", fontWeight: "700", fontSize: "12px" }}>LT</span>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
                <span style={{ fontSize: "9px", color: "#6e7686", fontWeight: "600", letterSpacing: "0.5px" }}>MONITORED BY</span>
                <span style={{ fontSize: "13px", color: "#fff", fontWeight: "600" }}>Bank of Lithuania</span>
              </div>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 style={columnTitleStyle}>Products</h4>
            <Link href="/markets" style={linkStyle}>Markets</Link>
            <Link href="/exchange" style={linkStyle}>Exchange</Link>
            <Link href="/bonds" style={linkStyle}>Bonds</Link>
            <Link href="/equity-ipo" style={linkStyle}>Equity & IPO</Link>
            <Link href="/tokenize" style={linkStyle}>Tokenize</Link>
          </div>

          {/* Company Column */}
          <div>
            <h4 style={columnTitleStyle}>Company</h4>
            <Link href="/about" style={linkStyle}>About Us</Link>
            <Link href="/careers" style={linkStyle}>Careers</Link>
            <Link href="/press" style={linkStyle}>Press</Link>
            <Link href="/blog" style={linkStyle}>Blog</Link>
          </div>

          {/* Legal Column */}
          <div>
            <h4 style={columnTitleStyle}>Legal</h4>
            <Link href="/terms" style={linkStyle}>Terms of Service</Link>
            <Link href="/privacy" style={linkStyle}>Privacy Policy</Link>
            <Link href="/risk" style={linkStyle}>Risk Disclosure</Link>
            <Link href="/aml" style={linkStyle}>AML Policy</Link>
          </div>

          {/* Support Column */}
          <div>
            <h4 style={columnTitleStyle}>Support</h4>
            <Link href="/help" style={linkStyle}>Help Center</Link>
            <Link href="/contact" style={linkStyle}>Contact Us</Link>
            <Link href="/api" style={linkStyle}>API Docs</Link>
            <Link href="/status" style={linkStyle}>Status</Link>
          </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT & RISK */}
        <div style={{ borderTop: "1px solid #141721", paddingTop: "30px", color: "#404654", fontSize: "12px" }}>
          <p style={{ marginBottom: "8px" }}>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
          <p>Risk warning: Investing in tokenized assets involves risk. Past performance is not indicative of future results.</p>
        </div>

      </div>
    </footer>
  );
}