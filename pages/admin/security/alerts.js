import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

const S = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: "#3b82f6", LOW: "#22c55e" };

export default function SecurityAlerts() {
  const router = useRouter();
  const [data, setData] = useState({ alerts: [], counts: {} });
  const [filter, setFilter] = useState("active");
  const [loading, setLoading] = useState(true);

  const load = (status) => {
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push("/admin/login"); return; }
    setLoading(true);
    fetch("/api/admin/security/alerts?status=" + status, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setData).finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const resolveAlert = (id, status) => {
    const token = localStorage.getItem("adminToken");
    const note = prompt("Add a note (optional):");
    fetch("/api/admin/security/alerts", {
      method: "PATCH",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ alertId: id, status, note }),
    }).then(() => load(filter));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 220, padding: "32px 40px", flex: 1, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>🚨 Security Alerts</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              {data.counts.active || 0} active • {data.counts.critical || 0} critical
            </p>
          </div>
          <button onClick={() => router.push("/admin/security")} style={{ background: "rgba(240,185,11,0.1)", border: "1px solid rgba(240,185,11,0.2)", color: "#F0B90B", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            ← Back to Security
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["active", "investigating", "resolved", "dismissed", "all"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filter === s ? "rgba(240,185,11,0.15)" : "rgba(255,255,255,0.04)",
              color: filter === s ? "#F0B90B" : "rgba(255,255,255,0.4)",
              border: filter === s ? "1px solid rgba(240,185,11,0.3)" : "1px solid rgba(255,255,255,0.06)",
            }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>

        {loading ? <div style={{ color: "rgba(255,255,255,0.3)" }}>Loading...</div> : (
          <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
            {data.alerts.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No alerts matching filter</div>
            ) : data.alerts.map(a => (
              <div key={a._id} style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: S[a.severity?.toUpperCase()], boxShadow: "0 0 8px " + (S[a.severity?.toUpperCase()] || "") + "40" }} />
                  <span style={{ fontSize: 15, fontWeight: 700, flex: 1 }}>{a.title}</span>
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 4, background: S[a.severity?.toUpperCase()] + "20", color: S[a.severity?.toUpperCase()], fontWeight: 700, textTransform: "uppercase" }}>{a.severity}</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8, marginLeft: 22 }}>{a.description}</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginLeft: 22 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{a.type} • {a.sourceIp || "N/A"} • {new Date(a.createdAt).toLocaleString()}</span>
                  {a.status === "active" && (
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                      <button onClick={() => resolveAlert(a._id, "investigating")} style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Investigate</button>
                      <button onClick={() => resolveAlert(a._id, "resolved")} style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Resolve</button>
                      <button onClick={() => resolveAlert(a._id, "dismissed")} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>Dismiss</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
