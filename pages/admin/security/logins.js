import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function LoginHistory() {
  const router = useRouter();
  const [data, setData] = useState({ attempts: [], stats: {}, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push("/admin/login"); return; }
    setLoading(true);
    fetch("/api/admin/security/login-history?page=" + page + "&limit=50", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, [page]);

  const s = data.stats;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 220, padding: "32px 40px", flex: 1, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>🔑 Login History</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{data.total} total login attempts</p>
          </div>
          <button onClick={() => router.push("/admin/security")} style={{ background: "rgba(240,185,11,0.1)", border: "1px solid rgba(240,185,11,0.2)", color: "#F0B90B", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back</button>
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {[
            { l: "Logins Today", v: s.totalToday || 0, c: "#3b82f6" },
            { l: "Failed Today", v: s.failedToday || 0, c: s.failedToday > 5 ? "#ef4444" : "#22c55e" },
            { l: "Unique IPs (24h)", v: s.uniqueIPs || 0, c: "#8b5cf6" },
            { l: "New Devices (24h)", v: s.newDevices || 0, c: s.newDevices > 0 ? "#f59e0b" : "#22c55e" },
          ].map((c, i) => (
            <div key={i} style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 20px", flex: 1 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: c.c }}>{c.v}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{c.l}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 200px 130px 120px 80px 160px", padding: "10px 20px", background: "rgba(255,255,255,0.03)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
            <span>Ok</span><span>Email</span><span>IP</span><span>Device</span><span>New?</span><span>Time</span>
          </div>
          {loading ? <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Loading...</div> : data.attempts.map(a => (
            <div key={a._id} style={{ display: "grid", gridTemplateColumns: "60px 200px 130px 120px 80px 160px", padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, alignItems: "center" }}>
              <span style={{ color: a.success ? "#22c55e" : "#ef4444", fontWeight: 700, fontSize: 16 }}>{a.success ? "✓" : "✗"}</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{a.email}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{a.ip}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{a.device || "—"}</span>
              <span>{a.isNewDevice ? <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 11 }}>NEW</span> : "—"}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{new Date(a.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {data.pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: "6px 14px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", fontSize: 12 }}>← Prev</button>
            <span style={{ padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Page {page} of {data.pages}</span>
            <button disabled={page >= data.pages} onClick={() => setPage(p => p + 1)} style={{ padding: "6px 14px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", fontSize: 12 }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
