import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";
import ClearSigningModal from "../../../components/ClearSigningModal";
import { buildClearTransaction } from "../../../lib/transactionVerify";

export default function WalletSecurity() {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);
  const [demoTx, setDemoTx] = useState(null);

  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  const openDemo = () => {
    const tx = buildClearTransaction({
      type: "Token Transfer",
      amount: "500",
      token: "NXT-RE001 (Berlin Office Token)",
      destination: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
      destinationLabel: "Verified investor wallet (KYC approved)",
      contract: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "0x7B0a6cEA53cE2dee2793F548573F2F3f42f93B41",
      functionName: "transfer(address,uint256)",
      fee: "~0.002 MATIC (~EUR 0.01)",
      network: "Polygon (MATIC)",
    });
    setDemoTx(tx);
    setShowDemo(true);
  };

  return (
    <AdminShell title="👛 Wallet Integration Security" subtitle="WalletConnect v2, clear signing, ownership verification, contract allowlist.">
      <button onClick={openDemo} style={{ padding:"12px 24px", background:"#F0B90B", color:"#000", border:"none", borderRadius:8, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit", marginBottom:28 }}>
        🔐 Preview Clear Signing Modal (Demo)
      </button>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 }}>
        {[
          { t:"WalletConnect v2", d:"Secure connections with session management. QR or deep link. Auto-disconnect on timeout.", s:"Integrated", c:"#22c55e" },
          { t:"Clear Signing", d:"Human-readable details before signing. Amount, token, destination ALWAYS visible.", s:"Enforced", c:"#22c55e" },
          { t:"Ownership Verification", d:"Cryptographic proof of wallet ownership. Challenge-response signature required.", s:"Active", c:"#22c55e" },
          { t:"Contract Allowlist", d:"Wallet can ONLY interact with verified Nextoken contracts. Unknown blocked.", s:"Enforced", c:"#22c55e" },
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

      <h2 style={{ fontSize:16, fontWeight:700, color:"#ef4444", marginBottom:12 }}>Mandatory Before Every Signing</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:28 }}>
        {[
          { f:"Amount", d:"Exact tokens or currency", i:"💰" },
          { f:"Token", d:"Full name and symbol", i:"🪙" },
          { f:"Destination", d:"Full wallet address", i:"📍" },
        ].map((r,i) => (
          <div key={i} style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:8, padding:"14px 16px" }}>
            <div style={{ fontSize:20, marginBottom:6 }}>{r.i}</div>
            <div style={{ fontSize:13, fontWeight:700, color:"#ef4444" }}>{r.f}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{r.d}</div>
          </div>
        ))}
      </div>

      {[
        "No hidden contract calls: Every function displayed in plain text",
        "No proxy redirects: Transaction goes directly to displayed contract",
        "No additional approvals: Only shown transaction is executed",
        "Transaction simulation: Dry-run before signing",
        "Spending limits: Per-wallet daily limits",
        "Session expiry: WalletConnect auto-expires after 24 hours",
        "Multi-wallet support with individual permissions",
        "Revoke anytime: One-click disconnect",
      ].map((d,i) => (
        <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
          <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
        </div>
      ))}

      {showDemo && demoTx && (
        <ClearSigningModal transaction={demoTx} onConfirm={() => { alert("Transaction would be submitted"); setShowDemo(false); }} onCancel={() => setShowDemo(false)} loading={false} />
      )}
    </AdminShell>
  );
}
