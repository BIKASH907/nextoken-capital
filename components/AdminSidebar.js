import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminSidebar() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    try { setEmployee(JSON.parse(localStorage.getItem("adminEmployee"))); } catch(e) {}
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmployee");
    router.push("/admin/login");
  };

  const sections = [
    { label: "OVERVIEW", items: [
      { href: "/admin", label: "Dashboard", icon: "🏠" },
      { href: "/admin/users", label: "Users", icon: "👥" },
      { href: "/admin/assets", label: "Assets", icon: "🏢" },
    ]},
    { label: "COMPLIANCE", items: [
      { href: "/admin/kyc", label: "KYC/KYB Queue", icon: "🪪" },
      { href: "/admin/travel-rule", label: "Travel Rule", icon: "✈️" },
    ]},
    { label: "ASSET MANAGEMENT", items: [
      { href: "/admin/listings-mod", label: "Listing Moderation", icon: "✅" },
      { href: "/admin/registry", label: "Shareholder Registry", icon: "📊" },
      { href: "/admin/contracts", label: "Smart Contracts", icon: "🔗" },
      { href: "/admin/vault", label: "Document Vault", icon: "📁" },
    ]},
    { label: "FINANCIAL", items: [
      { href: "/admin/treasury", label: "Treasury & Revenue", icon: "💰" },
      { href: "/admin/transactions", label: "Transactions", icon: "💳" },
      { href: "/admin/market", label: "Market Data", icon: "📈" },
    ]},
    { label: "RISK & SECURITY", items: [
      { href: "/admin/security", label: "Security Center", icon: "🔐" },
      { href: "/admin/security/alerts", label: "Security Alerts", icon: "🚨" },
      { href: "/admin/security/audit", label: "Audit Trail", icon: "📋" },
      { href: "/admin/security/approvals", label: "Dual Approvals", icon: "✅" },
      { href: "/admin/security/logins", label: "Login History", icon: "🔑" },
      { href: "/admin/compliance", label: "AML Monitoring", icon: "🛡️" },
    ]},
    { label: "SUPPORT", items: [
      { href: "/admin/support", label: "Support Tickets", icon: "💬" },
      { href: "/admin/reports", label: "Reports", icon: "📄" },
    ]},
  ];

  const isActive = (href) => {
    if (href === "/admin") return router.pathname === "/admin";
    return router.pathname.startsWith(href);
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: 220, height: "100vh", background: "#0F1318", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", zIndex: 100, overflowY: "auto" }}>
      <div style={{ padding: "20px 16px 12px" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F0B90B", marginBottom: 4 }}>NXT</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>ADMIN PORTAL v2</div>
      </div>

      <div style={{ flex: 1, padding: "0 12px" }}>
        {sections.map(sec => (
          <div key={sec.label} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: 1.5, padding: "8px 8px 4px", textTransform: "uppercase" }}>{sec.label}</div>
            {sec.items.map(n => (
              <button key={n.href} onClick={() => router.push(n.href)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8,
                fontSize: 13, fontWeight: isActive(n.href) ? 700 : 500, width: "100%", textAlign: "left",
                cursor: "pointer", marginBottom: 2, border: "none", transition: "all .15s",
                color: isActive(n.href) ? "#F0B90B" : "rgba(255,255,255,0.45)",
                background: isActive(n.href) ? "rgba(240,185,11,0.1)" : "transparent",
                borderLeft: isActive(n.href) ? "3px solid #F0B90B" : "3px solid transparent",
              }}>
                <span style={{ fontSize: 14 }}>{n.icon}</span> {n.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {employee && (
          <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{employee.firstName} {employee.lastName}</div>
            <div style={{ fontSize: 11, color: "#F0B90B", marginTop: 2 }}>{employee.role}</div>
          </div>
        )}
        <button onClick={logout} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.15)", color: "#ff6b6b", fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
