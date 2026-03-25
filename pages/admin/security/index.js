import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function SecurityDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    fetch("/api/admin/security/dashboard", { headers:{ Authorization:"Bearer "+t } })
      .then(r=>r.json()).then(setData).catch(()=>{});
  }, []);
  const s = data?.stats || {};
  const card = (l,v,c,sub) => (
    <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"20px 24px",flex:1,minWidth:160 }}>
      <div style={{ fontSize:32,fontWeight:800,color:c }}>{v}</div>
      <div style={{ fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:4 }}>{l}</div>
      {sub && <div style={{ fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:2 }}>{sub}</div>}
    </div>
  );
  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240,padding:"28px 36px",flex:1,color:"#fff" }}>
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🔐 Security Dashboard</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:24 }}>Real-time security overview</p>
        <div style={{ display:"flex",gap:14,marginBottom:28,flexWrap:"wrap" }}>
          {card("Active Alerts",s.activeAlerts||0,s.criticalAlerts>0?"#ef4444":"#22c55e",s.criticalAlerts>0?s.criticalAlerts+" critical":"All clear")}
          {card("Pending Approvals",s.pendingApprovals||0,"#f59e0b","Awaiting 2nd admin")}
          {card("Logins Today",s.todayLogins||0,"#3b82f6",(s.failedLogins||0)+" failed")}
          {card("Actions Today",s.todayActions||0,"#8b5cf6",(s.weekActions||0)+" this week")}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:28 }}>
          {[
            {h:"/admin/security/alerts",l:"🚨 Security Alerts",d:"Active threats & incidents"},
            {h:"/admin/security/audit",l:"📋 Audit Trail",d:"Immutable action log"},
            {h:"/admin/security/fraud",l:"🚫 Fraud System",d:"Anti-fraud monitoring"},
            {h:"/admin/security/compliance",l:"🛡️ Compliance",d:"Sanctions & monitoring"},
            {h:"/admin/devsecops",l:"🔧 DevSecOps",d:"Infrastructure security"},
            {h:"/admin/security/mfa",l:"🔒 MFA Settings",d:"Authentication methods"},
          ].map((n,i) => (
            <button key={i} onClick={()=>router.push(n.h)} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px 20px",cursor:"pointer",textAlign:"left",transition:"border-color .15s",fontFamily:"inherit",color:"#fff" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#F0B90B40"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
              <div style={{ fontSize:15,fontWeight:700,marginBottom:4 }}>{n.l}</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>{n.d}</div>
            </button>
          ))}
        </div>
        <h2 style={{ fontSize:14,fontWeight:700,color:"#F0B90B",marginBottom:10 }}>Recent Alerts</h2>
        <div style={{ background:"#161b22",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",padding:20 }}>
          {(data?.recentAlerts||[]).length===0 ? <div style={{ textAlign:"center",color:"rgba(255,255,255,0.3)" }}>No active alerts ✅</div>
          : (data?.recentAlerts||[]).map(a => (
            <div key={a._id} style={{ padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:10,alignItems:"center" }}>
              <span style={{ width:8,height:8,borderRadius:"50%",background:a.severity==="critical"?"#ef4444":"#f59e0b" }}/>
              <span style={{ fontSize:13,flex:1 }}>{a.title}</span>
              <span style={{ fontSize:10,color:"rgba(255,255,255,0.25)" }}>{new Date(a.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
