import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function WalletSecurity() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, padding:"28px 36px", flex:1, color:"#fff", maxWidth:1100 }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>👛 Wallet Integration Security</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:28 }}>WalletConnect v2, ownership verification, clear signing, permission management.</p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 }}>
          {[
            { t:"WalletConnect v2", d:"Secure wallet connections with session management. QR code or deep link authentication. Auto-disconnect on timeout.", s:"Integrated", c:"#22c55e" },
            { t:"Clear Signing", d:"Human-readable transaction details shown before signing. No raw hex data. Investors see exactly what they approve.", s:"Active", c:"#22c55e" },
            { t:"Ownership Verification", d:"Cryptographic proof of wallet ownership required before linking. Sign a challenge message to verify control.", s:"Active", c:"#22c55e" },
            { t:"Permission Management", d:"Granular wallet permissions. Revoke access anytime. Multi-wallet support with individual scopes.", s:"Active", c:"#22c55e" },
          ].map((r,i) => (
            <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"18px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:15, fontWeight:700 }}>{r.t}</span>
                <span style={{ fontSize:10, padding:"3px 10px", borderRadius:4, background:r.c+"15", color:r.c, fontWeight:700 }}>{r.s}</span>
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.7 }}>{r.d}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Transaction Signing Flow</h2>
        {[
          "1. Investor initiates transaction (buy tokens, withdraw, transfer)",
          "2. Platform builds transaction with human-readable summary",
          "3. Clear signing display: Shows asset name, amount, recipient, fees in plain text",
          "4. Investor reviews details in their wallet app (MetaMask, WalletConnect)",
          "5. Investor signs with private key — platform never has access to keys",
          "6. Transaction submitted to blockchain with confirmation tracking",
          "7. Post-transaction: Receipt with txn hash, block confirmation, and audit log entry",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.7 }}>
            <span style={{ color:"#3b82f6", marginRight:8 }}>→</span>{d}
          </div>
        ))}

        <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginTop:28, marginBottom:12 }}>Security Controls</h2>
        {[
          "Multi-wallet support: Investors can link multiple wallets with individual permissions",
          "Revoke anytime: One-click disconnect/revoke wallet access from dashboard",
          "Session expiry: WalletConnect sessions auto-expire after 24 hours of inactivity",
          "Approved contracts only: Wallet can only interact with verified Nextoken contracts",
          "Transaction simulation: Dry-run transactions before signing to preview outcomes",
          "Spending limits: Per-wallet daily transaction limits configurable by investor",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
          </div>
        ))}
      </div>
    </div>
  );
}
