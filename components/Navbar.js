import { useState } from "react";
import Link from 'next/link';

export default function Navbar() {
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const toggleWallet = () => setShowWalletOptions(!showWalletOptions);

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Branding */}
        <Link href="/" style={styles.logoContainer}>
          <div style={styles.nxtBox}>NXT</div>
          <div style={styles.logoText}>
            <div style={styles.brandMain}>NEXTOKEN</div>
            <div style={styles.brandSub}>CAPITAL</div>
          </div>
        </Link>

        {/* Full Navigation Links from Image */}
        <div style={styles.links}>
          <Link href="/markets" style={styles.navLink}>Markets</Link>
          <Link href="/exchange" style={styles.navLink}>Exchange</Link>
          <Link href="/bonds" style={styles.navLink}>Bonds</Link>
          <Link href="/equity-ipo" style={styles.navLink}>Equity & IPO</Link>
          <Link href="/tokenize" style={styles.navLink}>Tokenize</Link>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <Link href="/login" style={styles.loginBtn}>Log In</Link>
          <div style={{ position: "relative" }}>
            <button onClick={toggleWallet} style={styles.connectBtn}>Connect Wallet</button>
            
            {showWalletOptions && (
              <div style={styles.walletDropdown}>
                <div style={styles.walletOption} onClick={() => alert("Connecting MetaMask...")}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" width="20" alt="MetaMask" /> MetaMask
                </div>
                <div style={styles.walletOption} onClick={() => alert("Connecting WalletConnect...")}>
                  <img src="https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg" width="20" alt="WalletConnect" /> WalletConnect
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: "#05060a", borderBottom: "1px solid #1a1b23", padding: "15px 0", position: "sticky", top: 0, zIndex: 1000 },
  container: { display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", margin: "0 auto", padding: "0 40px" },
  logoContainer: { display: "flex", alignItems: "center", textDecoration: "none", color: "white", gap: "12px" },
  nxtBox: { background: "#F0B90B", color: "black", padding: "4px 8px", fontWeight: "900", borderRadius: "4px", fontSize: "16px" },
  brandMain: { fontSize: "18px", fontWeight: "bold", letterSpacing: "1px", color: "white" },
  brandSub: { fontSize: "10px", color: "#F0B90B", fontWeight: "bold", marginTop: "-2px" },
  links: { display: "flex", gap: "30px" },
  navLink: { color: "#848e9c", textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "0.2s" },
  actions: { display: "flex", alignItems: "center", gap: "20px" },
  loginBtn: { color: "white", textDecoration: "none", fontSize: "14px", border: "1px solid #333", padding: "8px 20px", borderRadius: "8px" },
  connectBtn: { background: "#F0B90B", color: "black", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
  walletDropdown: { position: "absolute", top: "50px", right: 0, background: "#1e2026", borderRadius: "8px", padding: "10px", width: "200px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" },
  walletOption: { display: "flex", alignItems: "center", gap: "10px", color: "white", padding: "10px", cursor: "pointer", borderRadius: "4px", fontSize: "14px", transition: "0.2s" }
};
