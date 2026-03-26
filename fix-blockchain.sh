#!/bin/bash
# Create /admin/blockchain/ section
# Run: chmod +x fix-blockchain.sh && ./fix-blockchain.sh
set -e

echo "  ⛓️ Building /admin/blockchain/ section..."

mkdir -p pages/admin/blockchain

# ═══════════════════════════════════════
# 1. Blockchain Dashboard
# ═══════════════════════════════════════
cat > pages/admin/blockchain/index.js << 'EOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";

export default function BlockchainDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);

  const card = (v, l, c) => (
    <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px 20px", textAlign:"center", flex:1, minWidth:140 }}>
      <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div>
    </div>
  );

  return (
    <AdminShell title="⛓️ Blockchain & Web3 Dashboard" subtitle="Wallet security, escrow management, multi-sig, and on-chain monitoring.">
      <div style={{ display:"flex", gap:12, marginBottom:28, flexWrap:"wrap" }}>
        {card("Polygon", "Network", "#8b5cf6")}
        {card("0", "Active Escrows", "#3b82f6")}
        {card("0", "Monitored Wallets", "#f59e0b")}
        {card("0", "Flagged Txns", "#ef4444")}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 }}>
        {[
          { h:"/admin/blockchain/wallet", i:"👛", l:"Wallet Security", d:"WalletConnect v2, clear signing, ownership verification, contract allowlist" },
          { h:"/admin/blockchain/escrow", i:"🏦", l:"Escrow Management", d:"Locked funds, milestone-based release, dual-approval, audit trail" },
          { h:"/admin/blockchain/multisig", i:"🔐", l:"Multi-Signature Access", d:"2 of 3 signatory for issuers, separation of duties, hardware MFA" },
          { h:"/admin/blockchain/onchain", i:"📡", l:"On-Chain Monitoring", d:"Real-time tracking, address screening, MEV protection, anomaly detection" },
        ].map((n,i) => (
          <button key={i} onClick={() => router.push(n.h)} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"20px 22px", cursor:"pointer", textAlign:"left", fontFamily:"inherit", color:"#fff", transition:"border-color .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor="#8b5cf640"} onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>{n.i} {n.l}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>{n.d}</div>
          </button>
        ))}
      </div>

      <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Platform Blockchain Config</h2>
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        {[
          { l:"Network", v:"Polygon (Chain ID: 137)", d:"MATIC mainnet" },
          { l:"Factory Contract", v:process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "Not configured", d:"Token deployment factory" },
          { l:"Yield Distributor", v:process.env.NEXT_PUBLIC_YIELD_DISTRIBUTOR || "Not configured", d:"Dividend/yield distribution" },
          { l:"Token Standard", v:"ERC-3643", d:"Compliant security token" },
          { l:"Multi-Sig Treasury", v:"3 of 5 signatures", d:"All fund movements" },
          { l:"Hot Wallet Limit", v:"EUR 50,000", d:"Auto-sweep to cold storage above this" },
          { l:"Cold Storage", v:"95%+ of assets", d:"Hardware wallets / HSM" },
          { l:"Contract Upgrade Timelock", v:"48 hours", d:"Delay before execution" },
        ].map((item, i) => (
          <div key={i} style={{ padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{item.l}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:1 }}>{item.d}</div>
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:"#8b5cf6", fontFamily:"monospace", maxWidth:300, textAlign:"right", wordBreak:"break-all" }}>{item.v}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
EOF

echo "  ✓ Blockchain dashboard"

# ═══════════════════════════════════════
# 2. Wallet page (copy from security, update imports)
# ═══════════════════════════════════════
cat > pages/admin/blockchain/wallet.js << 'EOF'
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
EOF

echo "  ✓ Blockchain wallet page"

# ═══════════════════════════════════════
# 3. Escrow page (use AdminShell)
# ═══════════════════════════════════════
cat > pages/admin/blockchain/escrow.js << 'EOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";

export default function BlockchainEscrow() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState({ escrows: [], stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/escrow", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  const s = data.stats || {};

  const doAction = async (action, escrowId, milestoneIndex, extra) => {
    await fetch("/api/admin/escrow", {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ action, escrowId, milestoneIndex, ...extra }),
    });
    fetch("/api/admin/escrow", { headers: { Authorization: "Bearer " + token } }).then(r => r.json()).then(setData);
  };

  const msColor = (st) => ({ locked:"#6b7280", pending_review:"#f59e0b", approved:"#3b82f6", released:"#22c55e", rejected:"#ef4444" }[st] || "#6b7280");

  return (
    <AdminShell title="🏦 Escrow Management" subtitle="Locked funds, milestone-based release, dual-approval, full audit trail.">
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
        {[
          { l:"Active Escrows", v:s.active||0, c:"#3b82f6" },
          { l:"Total Locked", v:"€"+(s.totalLocked||0).toLocaleString(), c:"#F0B90B" },
          { l:"Total Released", v:"€"+(s.totalReleased||0).toLocaleString(), c:"#22c55e" },
          { l:"Pending Release", v:"€"+(s.pendingRelease||0).toLocaleString(), c:"#f59e0b" },
        ].map((st,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"14px 20px", flex:1, minWidth:140, textAlign:"center" }}>
            <div style={{ fontSize:24, fontWeight:800, color:st.c }}>{st.v}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{st.l}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:10, padding:"14px 20px", marginBottom:24, fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
        <strong style={{ color:"#ef4444" }}>Escrow Rules:</strong> Funds are <strong style={{ color:"#fff" }}>LOCKED</strong> once activated. Release requires: condition met + evidence + 1st approval + 2nd approval (different admin). Every action logged.
      </div>

      {loading ? <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", padding:40 }}>Loading...</div>
      : data.escrows.length === 0 ? (
        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:40, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>
          No escrows yet. Create one from the Security Escrow page.
          <div style={{ marginTop:12 }}>
            <button onClick={() => router.push("/admin/security/escrow")} style={{ padding:"8px 20px", background:"#F0B90B", color:"#000", border:"none", borderRadius:6, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Go to Escrow Management →</button>
          </div>
        </div>
      ) : data.escrows.map(esc => (
        <div key={esc._id} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:20, marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:700 }}>{esc.assetName}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>Issuer: {esc.issuerName}</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {esc.isLocked && <span style={{ fontSize:10, padding:"4px 8px", borderRadius:4, background:"rgba(239,68,68,0.1)", color:"#ef4444", fontWeight:700 }}>🔒 LOCKED</span>}
              <span style={{ fontSize:10, padding:"4px 8px", borderRadius:4, background:"rgba(34,197,94,0.1)", color:"#22c55e", fontWeight:700 }}>{esc.status}</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
            <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 12px" }}><div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>TOTAL</div><div style={{ fontSize:16, fontWeight:700, color:"#F0B90B" }}>€{esc.totalAmount?.toLocaleString()}</div></div>
            <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 12px" }}><div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>RELEASED</div><div style={{ fontSize:16, fontWeight:700, color:"#22c55e" }}>€{esc.amountReleased?.toLocaleString()}</div></div>
            <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 12px" }}><div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>LOCKED</div><div style={{ fontSize:16, fontWeight:700, color:"#ef4444" }}>€{((esc.amountRaised||0) - (esc.amountReleased||0)).toLocaleString()}</div></div>
          </div>
          {esc.milestones?.map((m, mi) => (
            <div key={mi} style={{ background:"#0a0e14", border:"1px solid rgba(255,255,255,0.06)", borderRadius:6, padding:"8px 12px", marginBottom:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600 }}>{m.title} · €{m.amount?.toLocaleString()}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{m.condition}</div>
              </div>
              <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                <span style={{ fontSize:9, padding:"2px 8px", borderRadius:3, background:msColor(m.status)+"15", color:msColor(m.status), fontWeight:700 }}>{m.status}</span>
                {m.status === "locked" && esc.isLocked && <button onClick={() => { const ev = prompt("Evidence:"); if(ev) doAction("request_release", esc._id, mi, {evidence:ev}); }} style={{ padding:"2px 8px", borderRadius:3, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", color:"#3b82f6", fontSize:9, cursor:"pointer", fontFamily:"inherit" }}>Request</button>}
                {m.status === "pending_review" && <button onClick={() => doAction("first_approve", esc._id, mi)} style={{ padding:"2px 8px", borderRadius:3, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:9, cursor:"pointer", fontFamily:"inherit" }}>1st Approve</button>}
                {m.status === "approved" && <button onClick={() => doAction("second_approve_release", esc._id, mi)} style={{ padding:"2px 8px", borderRadius:3, background:"rgba(240,185,11,0.1)", border:"1px solid rgba(240,185,11,0.2)", color:"#F0B90B", fontSize:9, cursor:"pointer", fontFamily:"inherit" }}>2nd + Release</button>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </AdminShell>
  );
}
EOF

echo "  ✓ Blockchain escrow page"

# ═══════════════════════════════════════
# 4. Multi-Sig page
# ═══════════════════════════════════════
cat > pages/admin/blockchain/multisig.js << 'EOF'
import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";

export default function MultiSig() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <AdminShell title="🔐 Multi-Signature Access" subtitle="2 of 3 authorized signatories required for critical issuer actions.">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
        {[
          { l:"Required Signatures", v:"2 of 3", c:"#F0B90B" },
          { l:"Active Issuers", v:"0", c:"#3b82f6" },
          { l:"Pending Actions", v:"0", c:"#f59e0b" },
        ].map((s,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px", textAlign:"center" }}>
            <div style={{ fontSize:28, fontWeight:800, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Actions Requiring Multi-Sig</h2>
      {[
        "Token issuance: Creating and deploying new security tokens",
        "Distribution changes: Modifying token distribution parameters",
        "Fund withdrawals: Any withdrawal from issuer escrow account",
        "Contract upgrades: Upgrading token smart contracts",
        "Fee changes: Modifying platform fees for the issuance",
        "Investor whitelist: Adding/removing from transfer whitelist",
      ].map((d,i) => (
        <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
          <span style={{ color:"#f59e0b", marginRight:8 }}>⚡</span>{d}
        </div>
      ))}

      <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginTop:28, marginBottom:12 }}>Signatory Controls</h2>
      {[
        "Mandatory hardware MFA (YubiKey/FIDO2) for all issuer accounts",
        "Authorized representative list: Only pre-approved individuals",
        "IP restriction: Issuer panel locked to corporate IP range",
        "Activity notifications: Email + SMS for every action",
        "Session recording: Full action replay in audit log",
        "Separation of duties: Cannot both initiate and approve",
      ].map((d,i) => (
        <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
          <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
        </div>
      ))}
    </AdminShell>
  );
}
EOF

echo "  ✓ Multi-sig page"

# ═══════════════════════════════════════
# 5. On-Chain Monitoring page
# ═══════════════════════════════════════
cat > pages/admin/blockchain/onchain.js << 'EOF'
import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";

export default function OnChainMonitoring() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <AdminShell title="📡 On-Chain Monitoring" subtitle="Real-time blockchain tracking, address screening, MEV protection.">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
        {[
          { l:"Network", v:"Polygon", c:"#8b5cf6" },
          { l:"Monitored Wallets", v:"0", c:"#3b82f6" },
          { l:"Flagged Txns", v:"0", c:"#ef4444" },
        ].map((s,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px", textAlign:"center" }}>
            <div style={{ fontSize:24, fontWeight:800, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Monitoring Features</h2>
      {[
        "Real-time tracking of all platform wallet activity on Polygon",
        "Multi-sig treasury: 3 of 5 signatures for fund movements",
        "Cold storage: 95%+ of crypto in hardware wallets/HSM",
        "Hot wallet limit: EUR 50,000 max — auto-sweep to cold",
        "Address screening: EU/UN/OFAC sanctions check on every txn",
        "Chainalysis/Elliptic integration for risk scoring",
        "MEV protection via Flashbots Protect private mempool",
        "Anomaly detection: Unusual transfer patterns flagged",
        "Contract interaction monitoring: Unauthorized calls alerted",
        "Gas price monitoring: Protection against manipulation",
      ].map((d,i) => (
        <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
          <span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}
        </div>
      ))}

      <h2 style={{ fontSize:14, fontWeight:700, color:"#ef4444", marginTop:28, marginBottom:12 }}>Alert Triggers</h2>
      {[
        "Large transfer above configured threshold",
        "First-time interaction with platform contracts",
        "Any interaction with sanctioned wallet address",
        "Unexpected function calls to token contracts",
        "Multi-hop: Funds through multiple wallets rapidly",
        "Spike in failed transactions (possible attack)",
      ].map((d,i) => (
        <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
          <span style={{ color:"#ef4444", marginRight:8 }}>●</span>{d}
        </div>
      ))}
    </AdminShell>
  );
}
EOF

echo "  ✓ On-chain monitoring page"

# ═══════════════════════════════════════
# 6. Update sidebar with blockchain section
# ═══════════════════════════════════════

# Add BLOCKCHAIN section to super_admin nav
sed -i '/{ section:"DEVSECOPS"/i\
    { section:"BLOCKCHAIN", items:[\
      { href:"/admin/blockchain", label:"Blockchain Dashboard", icon:"⛓️" },\
      { href:"/admin/blockchain/wallet", label:"Wallet Security", icon:"👛" },\
      { href:"/admin/blockchain/escrow", label:"Escrow Management", icon:"🏦" },\
      { href:"/admin/blockchain/multisig", label:"Multi-Sig Access", icon:"🔐" },\
      { href:"/admin/blockchain/onchain", label:"On-Chain Monitor", icon:"📡" },\
    ]},' lib/rbac.js

# Add to finance_admin too (they need escrow access)
sed -i '/finance_admin.*SECURITY/i\
    { section:"BLOCKCHAIN", items:[{ href:"/admin/blockchain", label:"Blockchain", icon:"⛓️" },{ href:"/admin/blockchain/escrow", label:"Escrow", icon:"🏦" }]},' lib/rbac.js

echo "  ✓ Sidebar updated with BLOCKCHAIN section"

echo ""
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║  ✅ /admin/blockchain/ SECTION COMPLETE                   ║"
echo "  ║                                                           ║"
echo "  ║  /admin/blockchain/                                       ║"
echo "  ║    ├── dashboard    (overview, config, stats)             ║"
echo "  ║    ├── wallet       (WalletConnect, clear signing)        ║"
echo "  ║    ├── escrow       (locked funds, milestones)            ║"
echo "  ║    ├── multisig     (2 of 3 signatory)                   ║"
echo "  ║    └── onchain      (monitoring, screening, MEV)          ║"
echo "  ║                                                           ║"
echo "  ║  SIDEBAR:                                                 ║"
echo "  ║    Super Admin → all 5 pages                              ║"
echo "  ║    Finance Admin → dashboard + escrow                     ║"
echo "  ║                                                           ║"
echo "  ║  RUN:                                                     ║"
echo "  ║    git add -A && git commit -m 'feat: blockchain section' ║"
echo "  ║    git push && npx vercel --prod                          ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
