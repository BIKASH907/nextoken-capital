import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>
          NEXTOKEN <span style={{ color: "#fff", fontWeight: "300" }}>CAPITAL</span>
        </Link>
        
        <div style={styles.navLinks}>
          <Link href="/" style={styles.link}>Home</Link>
          <Link href="/markets" style={styles.link}>Markets</Link>
          <Link href="/exchange" style={styles.link}>Exchange</Link>
          <Link href="/bonds" style={styles.link}>Bonds</Link>
          <Link href="/equity" style={styles.link}>Equity</Link>
          <Link href="/dashboard" style={styles.link}>Dashboard</Link>
        </div>

        <div style={styles.authLinks}>
          <Link href="/login" style={styles.loginBtn}>Login</Link>
          <Link href="/tokenize" style={styles.tokenizeBtn}>Tokenize</Link>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { 
    background: "#05060a", 
    borderBottom: "1px solid #222", 
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%"
  },
  container: {
    padding: "15px 40px",
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    maxWidth: "1400px",
    margin: "0 auto"
  },
  logo: { color: "#F0B90B", fontSize: "20px", fontWeight: "bold", textDecoration: "none", letterSpacing: "1px" },
  navLinks: { display: "flex", gap: "25px" },
  link: { color: "#ccc", textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "0.2s" },
  authLinks: { display: "flex", gap: "20px", alignItems: "center" },
  loginBtn: { color: "#fff", textDecoration: "none", fontSize: "14px" },
  tokenizeBtn: { 
    color: "#000", 
    background: "#F0B90B", 
    padding: "8px 18px", 
    borderRadius: "8px", 
    textDecoration: "none", 
    fontSize: "14px", 
    fontWeight: "bold" 
  }
};
