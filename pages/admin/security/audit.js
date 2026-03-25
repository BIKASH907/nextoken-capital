import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function AuditTrail() {
  const router = useRouter();
  const [data, setData] = useState({ logs: [], total: 0 });
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push("/admin/login"); return; }
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 50 });
    if (category) params.set("category", category);
    fetch("/api/admin/security/audit-logs?" + params, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, category]);

  const cats = ["", "auth", "kyc", "transaction", "config", "user", "contract", "system"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 220, padding: "32px 40px", flex: 1, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>📋 Audit Trail</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{data.total} total entries • Immutable hash-chain log</p>
          </div>
          <button onClick={() => router.push("/admin/security")} style={{ background: "rgba(240,185,11,0.1)", border: "1px solid rgba(240,185,11,0.2)", color: "#F0B90B", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {cats.map(c => (
            <button key={c || "all"} onClick={() => { setCategory(c); setPage(1); }} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: category === c ? "rgba(240,185,11,0.15)" : "rgba(255,255,255,0.04)",
              color: category === c ? "#F0B90B" : "rgba(255,255,255,0.4)",
              border: category === c ? "1px solid rgba(240,185,11,0.3)" : "1px solid rgba(255,255,255,0.06)",
            }}>{c || "All"}</button>
          ))}
        </div>

        <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 120px 1fr 140px 80px 160px", padding: "10px 20px", background: "rgba(255,255,255,0.03)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            <span>Status</span><span>Admin</span><span>Action</span><span>Category</span><span>Severity</span><span>Time</span>
          </div>
          {loading ? <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</div> : data.logs.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No logs found</div>
          ) : data.logs.map(l => (
            <div key={l._id} style={{ display: "grid", gridTemplateColumns: "60px 120px 1fr 140px 80px 160px", padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, alignItems: "center" }}>
              <span style={{ color: l.result === "success" ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{l.result === "success" ? "✓" : "✗"}</span>
              <span style={{ color: "#F0B90B", fontWeight: 600 }}>{l.adminName}</span>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>{l.action}</span>
              <span style={{ fontSize: 11 }}><span style={{ background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4 }}>{l.category}</span></span>
              <span style={{ fontSize: 10, color: l.severity === "critical" ? "#ef4444" : l.severity === "high" ? "#f59e0b" : "rgba(255,255,255,0.3)" }}>{l.severity}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{new Date(l.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {data.pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: "6px 14px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", fontSize: 12, opacity: page <= 1 ? 0.3 : 1 }}>← Prev</button>
            <span style={{ padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Page {page} of {data.pages}</span>
            <button disabled={page >= data.pages} onClick={() => setPage(p => p + 1)} style={{ padding: "6px 14px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", fontSize: 12, opacity: page >= data.pages ? 0.3 : 1 }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
