import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function DualApprovals() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
    fetch("/api/admin/security/approvals", { headers: { Authorization: "Bearer " + t } })
      .then(r => r.json()).then(d => setApprovals(d.approvals || [])).finally(() => setLoading(false));
  }, []);

  const act = async (id, action) => {
    await fetch("/api/admin/security/approvals", {
      method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ approvalId: id, action }),
    });
    setApprovals(prev => prev.map(a => a._id === id ? { ...a, status: action === "approve" ? "approved" : "rejected" } : a));
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, padding:"28px 36px", flex:1, color:"#fff", maxWidth:1100 }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>✅ Dual-Approval (Four-Eyes Principle)</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:24 }}>Critical actions require two separate admins to approve.</p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
          {[
            { l:"Pending", v:approvals.filter(a=>a.status==="pending").length, c:"#f59e0b" },
            { l:"Approved", v:approvals.filter(a=>a.status==="approved").length, c:"#22c55e" },
            { l:"Rejected", v:approvals.filter(a=>a.status==="rejected").length, c:"#ef4444" },
          ].map((s,i) => (
            <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px", textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Actions Requiring Dual-Approval</h2>
        {[
          "Withdrawals above EUR 10,000",
          "New asset/token listing approval",
          "Smart contract deployment or upgrade",
          "KYC override or manual verification approval",
          "Fee structure changes",
          "Role permission changes",
          "System configuration changes",
        ].map((d,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", marginBottom:6, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            <span style={{ color:"#f59e0b", marginRight:8 }}>⚡</span>{d}
          </div>
        ))}

        <h2 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginTop:28, marginBottom:12 }}>Pending Approvals</h2>
        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
          {loading ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>Loading...</div>
          : approvals.filter(a=>a.status==="pending").length === 0 ? (
            <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No pending approvals — all clear ✅</div>
          ) : approvals.filter(a=>a.status==="pending").map(a => (
            <div key={a._id} style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:600 }}>{a.action}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 }}>Requested by {a.requestedBy} · {new Date(a.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={() => act(a._id, "approve")} style={{ padding:"6px 14px", borderRadius:6, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Approve</button>
                <button onClick={() => act(a._id, "reject")} style={{ padding:"6px 14px", borderRadius:6, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
