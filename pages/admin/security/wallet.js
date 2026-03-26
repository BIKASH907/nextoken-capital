import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";
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
      fee: "~0.002 MATIC (~€0.01)",
      network: "Polygon (MATIC)",
    });
    setDemoTx(tx);
    setShowDemo(true);
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, padding:"28px 36px", flex:1, color:"#fff", maxWidth:1100 }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>👛 Wallet Integration Security</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:28 }}>WalletConnect v2, ownership verification, clear signing, permission management.</p>

        {/* Demo Button */}
        <div style={{ marginBottom:28 }}>
          <button onClick={openDemo} style={{ padding:"12px 24px", background:"#F0B90B", color:"#000", border:"none", borderRadius:8, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>
            🔐 Preview Clear Signing Modal (Demo)
          </button>
          <span style={{ marginLeft:12, fontSize:12, color:"rgba(255,255,255,0.3)" }}>See exactly what investors see before signing</span>
        </div>

        {/* Features */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 }}>
          {[
            { t:"WalletConnect v2", d:"Secure wallet connections with session management. QR code or deep link. Auto-disconnect on timeout.", s:"Integrated", c:"#22c55e" },
            { t:"Clear Signing", d:"Human-readable details shown before signing. Amount, token, destination ALWAYS visible. No raw hex.", s:"Enforced", c:"#22c55e" },
            { t:"Ownership Verification", d:"Cryptographic proof of wallet ownership required before linking. Challenge-response signature.", s:"Active", c:"#22c55e" },
            { t:"Contract Allowlist", d:"Wallet can ONLY interact with verified Nextoken contracts. Unknown contracts blocked.", s:"Enforced", c:"#22c55e" },
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

        {/* Clear Signing Requirements */}
        <h2 style={{ fontSize:16, fontWeight:700, color:"#ef4444", marginBottom:12 }}>⚠ Clear Signing Requirements (Enforced)</h2>
        <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:10, padding:"16px 20px", marginBottom:28 }}>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.8, marginBottom:0 }}>
            Every transaction MUST display these fields before signing. No exceptions:
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:12 }}>
            {[
              { f:"Amount", d:"Exact number of tokens or currency being transferred", i:"💰" },
              { f:"Token", d:"Full token name and symbol (e.g., NXT-RE001 Berlin Office)", i:"🪙" },
              { f:"Destination", d:"Full wallet address + label if known (e.g., verified investor)", i:"📍" },
            ].map((r,i) => (
              <div key={i} style={{ background:"#0a0e14", borderRadius:8, padding:"12px 14px", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize:20, marginBottom:6 }}>{r.i}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"#ef4444", marginBottom:4 }}>{r.f}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.5 }}>{r.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional shown fields */}
        <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Also Displayed Before Signing</h2>
        {[
          "Smart contract address: Exact contract being called (verified against allowlist)",
          "Function name: Human-readable function (e.g., transfer, mint, approve) — no raw hex",
          "Network fee estimate: Estimated gas cost in MATIC and EUR equivalent",
          "Network: Chain name and ID (Polygon Mainnet, Chain 137)",
          "Risk level: Auto-calculated based on amount, destination, and contract verification",
          "Warnings: Any anomalies flagged (new address, high amount, unverified contract)",
          "Checkbox confirmation: User must explicitly confirm they reviewed all details",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
          </div>
        ))}

        {/* Security controls */}
        <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginTop:28, marginBottom:12 }}>Security Controls</h2>
        {[
          "No hidden contract calls: Every function call displayed in plain text before execution",
          "No proxy redirects: Transaction goes directly to the displayed contract address",
          "No additional approvals: Only the shown transaction is executed — no bundled calls",
          "Transaction simulation: Dry-run before signing to preview exact outcomes",
          "Spending limits: Per-wallet daily limits configurable by investor",
          "Session expiry: WalletConnect sessions auto-expire after 24 hours",
          "Multi-wallet support: Investors can link multiple wallets with individual permissions",
          "Revoke anytime: One-click disconnect/revoke wallet access from dashboard",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
          </div>
        ))}
      </div>

      {/* Clear Signing Modal Demo */}
      {showDemo && demoTx && (
        <ClearSigningModal
          transaction={demoTx}
          onConfirm={() => { alert("Transaction would be submitted to Polygon"); setShowDemo(false); }}
          onCancel={() => setShowDemo(false)}
          loading={false}
        />
      )}
    </div>
  );
}
