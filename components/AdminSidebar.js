import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ROLES, ROLE_NAV } from "../lib/rbac";

export default function AdminSidebar() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  useEffect(() => { try { setEmployee(JSON.parse(localStorage.getItem("adminEmployee"))); } catch(e) {} }, []);

  const logout = () => { localStorage.removeItem("adminToken"); localStorage.removeItem("adminEmployee"); router.push("/admin/login"); };
  const role = employee?.role || "support_admin";
  const ri = ROLES[role] || ROLES.support_admin;
  const nav = ROLE_NAV[role] || ROLE_NAV.support_admin;
  const isActive = (h) => h==="/admin" ? router.asPath==="/admin" : router.asPath.startsWith(h);
  const toggle = (s) => setCollapsed(p => ({...p,[s]:!p[s]}));

  return (
    <div style={{ position:"fixed",top:0,left:0,width:240,height:"100vh",background:"#0F1318",borderRight:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",zIndex:100,overflowY:"auto" }}>
      <div style={{ padding:"16px 14px 10px" }}>
        <div style={{ fontSize:20,fontWeight:900,color:"#F0B90B" }}>NXT</div>
        <div style={{ fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:2 }}>ADMIN PORTAL v3</div>
      </div>
      <div style={{ margin:"0 10px 10px",padding:"7px 10px",borderRadius:7,background:ri.color+"12",border:"1px solid "+ri.color+"20" }}>
        <div style={{ fontSize:11,fontWeight:700,color:ri.color }}>{ri.icon} {ri.label}</div>
      </div>
      <div style={{ flex:1,padding:"0 6px" }}>
        {nav.map(sec => (
          <div key={sec.section} style={{ marginBottom:10 }}>
            <div onClick={() => toggle(sec.section)} style={{ fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.2)",letterSpacing:1.2,padding:"6px 8px 3px",cursor:"pointer",display:"flex",justifyContent:"space-between",userSelect:"none" }}>
              <span>{sec.section}</span>
              <span style={{ fontSize:8 }}>{collapsed[sec.section] ? "▸" : "▾"}</span>
            </div>
            {!collapsed[sec.section] && sec.items.map(n => (
              <button key={n.href} onClick={() => router.push(n.href)} style={{
                display:"flex",alignItems:"center",gap:7,padding:"6px 10px",borderRadius:6,fontSize:12,
                fontWeight:isActive(n.href)?700:400,width:"100%",textAlign:"left",cursor:"pointer",marginBottom:1,border:"none",
                color:isActive(n.href)?"#F0B90B":"rgba(255,255,255,0.4)",
                background:isActive(n.href)?"rgba(240,185,11,0.1)":"transparent",
                borderLeft:isActive(n.href)?"2px solid #F0B90B":"2px solid transparent",
                fontFamily:"inherit",transition:"all .1s",
              }}><span style={{ fontSize:12 }}>{n.icon}</span>{n.label}</button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding:"8px 10px",borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        {employee && <div style={{ padding:"6px 8px",borderRadius:6,background:"rgba(255,255,255,0.04)",marginBottom:6 }}>
          <div style={{ fontSize:11,fontWeight:700,color:"#fff" }}>{employee.firstName} {employee.lastName}</div>
          <div style={{ fontSize:9,color:ri.color }}>{ri.label}</div>
        </div>}
        <button onClick={logout} style={{ width:"100%",padding:"6px 8px",borderRadius:6,background:"rgba(255,77,77,0.08)",border:"1px solid rgba(255,77,77,0.15)",color:"#ff6b6b",fontSize:10,fontWeight:600,cursor:"pointer",textAlign:"left",fontFamily:"inherit" }}>Sign Out</button>
      </div>
    </div>
  );
}
