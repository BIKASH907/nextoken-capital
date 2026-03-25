import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ROLES, ROLE_NAV } from "../lib/rbac";

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

  const role = employee?.role || "support_admin";
  const roleInfo = ROLES[role] || ROLES.support_admin;
  const nav = ROLE_NAV[role] || ROLE_NAV.support_admin;

  const isActive = (href) => {
    if (href === "/admin") return router.pathname === "/admin";
    return router.pathname.startsWith(href);
  };

  return (
    <div style={{ position:"fixed", top:0, left:0, width:230, height:"100vh", background:"#0F1318", borderRight:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", zIndex:100, overflowY:"auto" }}>
      {/* Logo */}
      <div style={{ padding:"18px 16px 14px" }}>
        <div style={{ fontSize:20, fontWeight:900, color:"#F0B90B", marginBottom:2 }}>NXT</div>
        <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", letterSpacing:2 }}>ADMIN PORTAL v3</div>
      </div>

      {/* Role Badge */}
      <div style={{ margin:"0 12px 12px", padding:"8px 10px", borderRadius:8, background:roleInfo.color+"12", border:"1px solid "+roleInfo.color+"25" }}>
        <div style={{ fontSize:12, fontWeight:700, color:roleInfo.color }}>{roleInfo.icon} {roleInfo.label}</div>
        <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", marginTop:2, lineHeight:1.4 }}>{roleInfo.description}</div>
      </div>

      {/* Navigation */}
      <div style={{ flex:1, padding:"0 8px" }}>
        {nav.map(sec => (
          <div key={sec.section} style={{ marginBottom:14 }}>
            <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.2)", letterSpacing:1.5, padding:"6px 8px 3px", textTransform:"uppercase" }}>{sec.section}</div>
            {sec.items.map(n => (
              <button key={n.href} onClick={() => router.push(n.href)} style={{
                display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:7, fontSize:12.5,
                fontWeight: isActive(n.href) ? 700 : 500, width:"100%", textAlign:"left",
                cursor:"pointer", marginBottom:1, border:"none",
                color: isActive(n.href) ? "#F0B90B" : "rgba(255,255,255,0.45)",
                background: isActive(n.href) ? "rgba(240,185,11,0.1)" : "transparent",
                borderLeft: isActive(n.href) ? "3px solid #F0B90B" : "3px solid transparent",
                fontFamily:"inherit", transition:"all .12s",
              }}>
                <span style={{ fontSize:13 }}>{n.icon}</span> {n.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* User Info */}
      <div style={{ padding:"10px 12px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        {employee && (
          <div style={{ padding:"8px 10px", borderRadius:7, background:"rgba(255,255,255,0.04)", marginBottom:6 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{employee.firstName} {employee.lastName}</div>
            <div style={{ fontSize:10, color:roleInfo.color, marginTop:1 }}>{roleInfo.label}</div>
          </div>
        )}
        <button onClick={logout} style={{ width:"100%", padding:"7px 10px", borderRadius:7, background:"rgba(255,77,77,0.08)", border:"1px solid rgba(255,77,77,0.15)", color:"#ff6b6b", fontSize:11, fontWeight:600, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
