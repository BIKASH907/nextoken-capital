import React from 'react';
import Link from 'next/link';

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
    marginBottom: "14px"
  };

  return (
    <footer style={{ backgroundColor: "#05060a", padding: "80px 40px 40px", borderTop: "1px solid #141721" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr", gap: "40px", marginBottom: "80px" }}>
          
          {/* Brand & Badge */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ color: "#f5c15a", fontSize: "24px", fontWeight: "900" }}>NXT</span>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
                <span style={{ fontWeight: "800", fontSize: "14px", color: "#fff" }}>NEXTOKEN</span>
                <span style={{ fontSize: "10px", color: "#6e7686" }}>CAPITAL</span>
              </div>
            </div>
            <p style={{ color: "#6e7686", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
              The regulated infrastructure for <br /> tokenized real-world assets.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid #1a1d26", padding: "12px 16px", borderRadius: "10px", width: "fit-content" }}>
              <span style={{ color: "#fff", fontWeight: "700", fontSize: "12px" }}>LT</span>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
                <span style={{ fontSize: "9px", color: "#6e7686", fontWeight: "600" }}>MONITORED BY</span>
                <span style={{ fontSize: "13px", color: "#fff", fontWeight: "600" }}>Bank of Lithuania</span>
              </div>
            </div>
          </div>

          {/* Columns */}
          <div>
            <h4 style={columnTitleStyle}>Products</h4>
            <Link href="/markets" style={linkStyle}>Markets</Link>
            <Link href="/bonds" style={linkStyle}>Bonds</Link>
            <Link href="/tokenize" style={linkStyle}>Tokenize</Link>
          </div>
          <div>
            <h4 style={columnTitleStyle}>Company</h4>
            <Link href="/about" style={linkStyle}>About Us</Link>
            <Link href="/blog" style={linkStyle}>Blog</Link>
          </div>
          <div>
            <h4 style={columnTitleStyle}>Legal</h4>
            <Link href="/privacy" style={linkStyle}>Privacy Policy</Link>
            <Link href="/aml" style={linkStyle}>AML Policy</Link>
          </div>
          <div>
            <h4 style={columnTitleStyle}>Support</h4>
            <Link href="/contact" style={linkStyle}>Contact Us</Link>
            <Link href="/status" style={linkStyle}>Status</Link>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #141721", paddingTop: "30px", color: "#404654", fontSize: "12px" }}>
          <p>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
        </div>
      </div>
    </footer>
  );
}