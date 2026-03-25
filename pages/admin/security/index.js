import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

const S = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MEDIUM: "#3b82f6", LOW: "#22c55e" };

export default function SecurityDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push("/admin/login"); return; }
    fetch("/api/admin/security/dashboard", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  const card = (label, value, color, sub) => (
    <div style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 24px", flex: 1, minWidth: 180 }}>
      <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{sub}</div>}
    </div>
  );

  const navBtn = (href, label, emoji) => (
    <button onClick={() => router.push(href)} style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px", cursor: "pointer", textAlign: "left", transition: "all .15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#F0B90B"} onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{label}</div>
    </button>
  );

  const s = data?.stats || {};

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 220, padding: "32px 40px", flex: 1, color: "#fff" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>🔐 Security Center</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>Real-time security monitoring for Nextoken Capital</p>

        {loading ? <div style={{ color: "rgba(255,255,255,0.3)" }}>Loading...</div> : (
          <>
            <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
              {card("Active Alerts", s.activeAlerts || 0, s.criticalAlerts > 0 ? "#ef4444" : "#22c55e", s.criticalAlerts > 0 ? s.criticalAlerts + " critical" : "All clear")}
              {card("Pending Approvals", s.pendingApprovals || 0, "#f59e0b", "Awaiting second admin")}
              {card("Logins Today", s.todayLogins || 0, "#3b82f6", (s.failedLogins || 0) + " failed")}
              {card("Actions Today", s.todayActions || 0, "#8b5cf6", (s.weekActions || 0) + " this week")}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
              {navBtn("/admin/security/alerts", "Security Alerts", "🚨")}
              {navBtn("/admin/security/audit", "Audit Trail", "📋")}
              {navBtn("/admin/security/approvals", "Dual Approvals", "✅")}
              {navBtn("/admin/security/logins", "Login History", "🔑")}
            </div>

            {/* Recent Alerts */}
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F0B90B", marginBottom: 12 }}>Recent Alerts</h2>
            <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 28 }}>
              {(data.recentAlerts || []).length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No active alerts — all clear ✅</div>
              ) : (data.recentAlerts || []).map((a, i) => (
                <div key={a._id} style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: S[a.severity?.toUpperCase()] || "#3b82f6", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{a.description}</div>
                  </div>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: S[a.severity?.toUpperCase()] + "20", color: S[a.severity?.toUpperCase()], fontWeight: 700, textTransform: "uppercase" }}>{a.severity}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{new Date(a.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Recent Audit */}
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F0B90B", marginBottom: 12 }}>Recent Admin Actions</h2>
            <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              {(data.recentLogs || []).length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No actions logged yet</div>
              ) : (data.recentLogs || []).map(l => (
                <div key={l._id} style={{ padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
                  <span style={{ color: l.result === "success" ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{l.result === "success" ? "✓" : "✗"}</span>
                  <span style={{ fontWeight: 600, color: "#F0B90B", minWidth: 100 }}>{l.adminName}</span>
                  <span style={{ color: "rgba(255,255,255,0.6)", flex: 1 }}>{l.action}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{new Date(l.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
