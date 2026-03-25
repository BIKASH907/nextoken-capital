import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function DualApprovals() {
  const router = useRouter();
  const [data, setData] = useState({ requests: [], pendingCount: 0 });
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  const load = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push("/admin/login"); return; }
    setLoading(true);
    fetch("/api/admin/security/approvals?status=" + filter, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const act = (id, action) => {
    const token = localStorage.getItem("adminToken");
    const note = prompt(action === "approve" ? "Approval note (optional):" : "Rejection reason:");
    fetch("/api/admin/security/approvals", {
      method: "PATCH",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: id, action, note }),
    }).then(r => r.json()).then(d => {
      if (d.error) alert(d.error);
      else load();
    });
  };

  const TYPE_LABELS = { withdrawal_large: "💰 Large Withdrawal", token_listing: "🪙 Token Listing", contract_deploy: "📄 Contract Deploy", contract_upgrade: "🔄 Contract Upgrade", kyc_override: "🪪 KYC Override", fee_change: "💲 Fee Change", role_change: "👤 Role Change", system_config: "⚙️ System Config" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 220, padding: "32px 40px", flex: 1, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>✅ Dual Approvals</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{data.pendingCount} pending • Four-eyes principle</p>
          </div>
          <button onClick={() => router.push("/admin/security")} style={{ background: "rgba(240,185,11,0.1)", border: "1px solid rgba(240,185,11,0.2)", color: "#F0B90B", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["pending", "approved", "rejected", "expired", "all"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filter === s ? "rgba(240,185,11,0.15)" : "rgba(255,255,255,0.04)",
              color: filter === s ? "#F0B90B" : "rgba(255,255,255,0.4)",
              border: filter === s ? "1px solid rgba(240,185,11,0.3)" : "1px solid rgba(255,255,255,0.06)",
            }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>

        <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
          {loading ? <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</div> : data.requests.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No requests found</div>
          ) : data.requests.map(r => (
            <div key={r._id} style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{TYPE_LABELS[r.type] || r.type}</span>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 700, background: r.status === "pending" ? "rgba(245,158,11,0.15)" : r.status === "approved" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: r.status === "pending" ? "#f59e0b" : r.status === "approved" ? "#22c55e" : "#ef4444" }}>{r.status.toUpperCase()}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Requested by: <span style={{ color: "#F0B90B" }}>{r.requestedByName}</span></div>
              {r.approvedByName && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{r.status === "approved" ? "Approved" : "Rejected"} by: <span style={{ color: "#22c55e" }}>{r.approvedByName}</span></div>}
              {r.payload && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4, fontFamily: "monospace", background: "rgba(255,255,255,0.03)", padding: "6px 10px", borderRadius: 6 }}>{JSON.stringify(r.payload, null, 2)}</div>}
              {r.status === "pending" && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={() => act(r._id, "approve")} style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", padding: "6px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✓ Approve</button>
                  <button onClick={() => act(r._id, "reject")} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "6px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✗ Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
