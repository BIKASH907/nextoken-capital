import { useState, useEffect } from "react";
import Link from 'next/link';
import { ethers } from "ethers";

export default function Navbar() {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: "eth_requestAccounts" 
        });
        setAccount(accounts[0]);
      } catch (err) {
        console.error("User denied connection");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link href="/" style={styles.logoContainer}>
          <div style={styles.nxtBox}>NXT</div>
          <div style={styles.logoText}>
            <div style={styles.brandMain}>NEXTOKEN</div>
            <div style={styles.brandSub}>CAPITAL</div>
          </div>
        </Link>
        
        <div style={styles.actions}>
          <Link href="/login">
            <button style={styles.loginBtn}>Log In</button>
          </Link>
          <button onClick={connectWallet} style={styles.connectBtn}>
            {account ? `${account.substring(0,6)}...${account.substring(38)}` : "Connect Wallet"}
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: "#05060a", borderBottom: "1px solid #1a1b1f", padding: "15px 0" },
  container: { display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto", padding: "0 20px" },
  logoContainer: { display: "flex", alignItems: "center", textDecoration: "none", gap: "10px" },
  nxtBox: { background: "#F0B90B", color: "black", fontWeight: "bold", padding: "4px 8px", borderRadius: "4px" },
  logoText: { display: "flex", flexDirection: "column" },
  brandMain: { color: "white", fontSize: "18px", fontWeight: "bold", letterSpacing: "1px" },
  brandSub: { color: "#F0B90B", fontSize: "10px", fontWeight: "bold", marginTop: "-4px" },
  actions: { display: "flex", gap: "15px" },
  loginBtn: { background: "transparent", color: "white", border: "1px solid #333", padding: "8px 20px", borderRadius: "6px", cursor: "pointer" },
  connectBtn: { background: "#F0B90B", color: "black", border: "none", padding: "8px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }
};
