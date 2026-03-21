import { useState, useEffect } from "react";
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated on mount
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Correct Branding */}
        <Link href="/" style={styles.logo}>
          NEXTOKEN <span style={{ color: "#fff", fontWeight: "300" }}>CAPITAL</span>
        </Link>
        
        <div style={styles.navLinks}>
          <Link href="/" style={styles.link}>Home</Link>
          <Link href="/markets" style={styles.link}>Markets</Link>
          <Link href="/exchange" style={styles.link}>Exchange</Link>
          <Link href="/bonds" style={styles.link}>Bonds</Link>
          <Link href="/equity" style={styles.link}>Equity</Link>
          
          {/* Dashboard hidden until login */}
          {isLoggedIn && (
            <Link href="/dashboard" style={styles.link}>Dashboard</Link>
          )}
        </div>

        <div style={styles.authLinks}>
          <button style={styles.walletBtn} onClick={() => alert("Wallet Integration Coming Soon")}>
            Connect Wallet
          </button>
          
          {!isLoggedIn ? (
            <Link href="/login" style={styles.loginBtn}>Login</Link>
          ) : (
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: "#05060a", borderBottom: "1px solid #222", position: "sticky", top: 0, zIndex: 1000, width: "100%" },
  container: { padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", margin: "0 auto" },
  logo: { color: "#F0B90B", fontSize: "20px", fontWeight: "bold", textDecoration: "none", letterSpacing: "1px" },
  navLinks: { display: "flex", gap: "25px" },
  link: { color: "#ccc", textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "0.2s" },
  authLinks: { display: "flex", gap: "20px", alignItems: "center" },
  walletBtn: { background: "transparent", border: "1px solid #F0B90B", color: "#F0B90B", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  loginBtn: { color: "#000", background: "#F0B90B", padding: "8px 20px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "bold" },
  logoutBtn: { background: "none", border: "none", color: "#ff4d4d", cursor: "pointer", fontSize: "14px" }
};
