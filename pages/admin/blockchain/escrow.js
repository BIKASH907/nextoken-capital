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
