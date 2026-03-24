// Shared admin shell with extended navigation
// Wraps content with sidebar — does NOT replace existing AdminLayout
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const NAV = [
  { sep: true, label: "OVERVIEW" },
  { href: "/admin", icon: "📊", label: "Dashboard" },
  { href: "/admin/users", icon: "👥", label: "Users" },
  { href: "/admin/assets", icon: "🏢", label: "Assets" },
  { sep: true, label: "COMPLIANCE" },
  { href: "/admin/compliance", icon: "🪪", label: "KYC/KYB Queue" },
  { href: "/admin/travel-rule", icon: "✈️", label: "Travel Rule" },
  { sep: true, label: "ASSET MANAGEMENT" },
  { href: "/admin/listings-mod", icon: "✅", label: "Listing Moderation" },
  { href: "/admin/registry", icon: "📋", label: "Shareholder Registry" },
  { href: "/admin/contracts", icon: "🔗", label: "Smart Contracts" },
  { href: "/admin/vault", icon: "🗄️", label: "Document Vault" },
  { sep: true, label: "FINANCIAL" },
  { href: "/admin/treasury", icon: "💰", label: "Treasury & Revenue" },
  { href: "/admin/market", icon: "📈", label: "Market Data" },
  { sep: true, label: "RISK & SECURITY" },
  { href: "/admin/security", icon: "🛡️", label: "Security Center" },
  { sep: true, label: "REPORTING" },
  { href: "/admin/reports", icon: "📄", label: "Regulatory Reports" },
  { href: "/admin/support", icon: "💬", label: "Support Tickets" },
];

export default function AdminShell({ children, title, subtitle }) {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("adminToken");
    const emp = localStorage.getItem("adminEmployee");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
    try { setEmployee(JSON.parse(emp)); } catch { router.push("/admin/login"); }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmployee");
    router.push("/admin/login");
  };

  if (!mounted || !employee) return <div style={{background:"#0B0E11",minHeight:"100vh"}} />;

  return (
    <>
      <style>{`
        .as-sb{position:fixed;top:0;left:0;width:240px;height:100vh;background:#0F1318;border-right:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;padding:20px 12px;z-index:100;overflow-y:auto}
        .as-sb::-webkit-scrollbar{width:4px}
        .as-sb::-webkit-scrollbar-thumb{background:rgba(240,185,11,0.2);border-radius:2px}
        .as-logo{font-size:20px;font-weight:900;color:#F0B90B;margin-bottom:2px;padding:0 8px}
        .as-logo-sub{font-size:9px;color:rgba(255,255,255,0.25);letter-spacing:2px;margin-bottom:20px;padding:0 8px}
        .as-sep{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.15);padding:14px 8px 6px}
        .as-link{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;font-size:12.5px;font-weight:500;color:rgba(255,255,255,0.45);text-decoration:none;transition:all .15s;margin-bottom:1px}
        .as-link:hover{color:#fff;background:rgba(255,255,255,0.04)}
        .as-link.on{color:#F0B90B;background:rgba(240,185,11,0.08);font-weight:700}
        .as-link-ico{font-size:13px;width:18px;text-align:center;flex-shrink:0}
        .as-bottom{margin-top:auto;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06)}
        .as-user{padding:10px;border-radius:8px;background:rgba(255,255,255,0.03);margin-bottom:8px}
        .as-user-name{font-size:12px;font-weight:700;color:#fff}
        .as-user-role{font-size:10px;color:#F0B90B;margin-top:1px}
        .as-logout{width:100%;padding:8px 10px;border-radius:7px;background:rgba(255,77,77,0.06);border:1px solid rgba(255,77,77,0.12);color:#ff6b6b;font-size:12px;font-weight:600;cursor:pointer;text-align:left;font-family:inherit}
        .as-main{margin-left:240px;padding:28px;min-height:100vh;background:#0B0E11}
        .as-page-title{font-size:22px;font-weight:900;color:#fff;margin-bottom:4px}
        .as-page-sub{font-size:13px;color:rgba(255,255,255,0.35);margin-bottom:24px}
      `}</style>

      <div className="as-sb">
        <div className="as-logo">NXT</div>
        <div className="as-logo-sub">ADMIN PORTAL v2</div>
        {NAV.map((item, i) => item.sep ? (
          <div key={i} className="as-sep">{item.label}</div>
        ) : (
          <Link key={item.href} href={item.href} className={`as-link ${router.pathname === item.href ? "on" : ""}`}>
            <span className="as-link-ico">{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <div className="as-bottom">
          <div className="as-user">
            <div className="as-user-name">{employee.firstName} {employee.lastName}</div>
            <div className="as-user-role">{employee.role}</div>
          </div>
          <button className="as-logout" onClick={logout}>Sign Out</button>
        </div>
      </div>

      <div className="as-main">
        {title && <div className="as-page-title">{title}</div>}
        {subtitle && <div className="as-page-sub">{subtitle}</div>}
        {children}
      </div>
    </>
  );
}
