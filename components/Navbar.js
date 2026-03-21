import { useState, useEffect } from "react";
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link href="/" style={styles.logoContainer}>
          <div style={styles.nxtBox}>NXT</div>
          <div style={styles.logoDivider}></div>
          <div style={styles.logoText}>
            <div style={styles.brandMain}>NEXTOKEN</div>
            <div style={styles.brandSub}>CAPITAL</div>
          </div>
        </Link>
        
        <div style={styles.navLinks}>
          <Link href="/markets" style={styles.link}>Markets</Link>
          <Link href="/exchange" style={styles.link}>Exchange</Link>
          <Link href="/bonds" style={styles.link}>Bonds</Link>
          <Link href="/equity" style={styles.link}>Equity & IPO</Link>
          <Link href="/tokenize" style={styles.link}>Tokenize</Link>
        </div>

        <div style={styles.authLinks}>
          {!isLoggedIn ? (
            <>
              <Link href="/login" style={styles.loginBtn}>Log In</Link>
              <button style={styles.walletBtn} onClick={() => alert("Coming soon!")}>
                Connect Wallet
              </button>
            </>
          ) : (
            <button style={styles.walletBtn} onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: "#05060a", borderBottom: "1px solid #222", position: "sticky", top: 0, zIndex: 1000, width: "100%", height: "80px", display: "flex", alignItems: "center" },
  container: { padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1600px", margin: "0 auto", width: "100%" },
  logoContainer: { display: "flex", alignItems: "center", textDecoration: "none" },
  nxtBox: { color: "#F0B90B", fontSize: "26px", fontWeight: "900", marginRight: "12px" },
  logoDivider: { height: "30px", width: "1px", background: "#333", marginRight: "12px" },
  logoText: { display: "flex", flexDirection: "column" },
  brandMain: { color: "#fff", fontSize: "16px", fontWeight: "bold", lineHeight: "1", letterSpacing: "1px" },
  brandSub: { color: "#F0B90B", fontSize: "10px", fontWeight: "bold", marginTop: "2px", letterSpacing: "2px" },
  navLinks: { display: "flex", gap: "25px" },
  link: { color: "#999", textDecoration: "none", fontSize: "14px", fontWeight: "500" },
  authLinks: { display: "flex", gap: "15px", alignItems: "center" },
  loginBtn: { color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: "600", border: "1px solid #333", padding: "10px 24px", borderRadius: "8px" },
  walletBtn: { background: "#F0B90B", color: "#000", padding: "11px 24px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }
};
