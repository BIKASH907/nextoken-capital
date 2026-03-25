import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../../components/AdminSidebar";

export default function FraudDashboard() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240,padding:"28px 36px",flex:1,color:"#fff" }}>
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🚫 Fraud Detection System</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:24 }}>Real-time fraud monitoring combining anti-fraud engine, transaction monitoring, and withdrawal protection.</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:28 }}>
          {[{l:"Velocity Checks",v:"Active",c:"#22c55e"},{l:"Impossible Travel",v:"Active",c:"#22c55e"},{l:"Device Trust",v:"Active",c:"#22c55e"}].map((s,i) => (
            <div key={i} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px",textAlign:"center" }}>
              <div style={{ fontSize:22,fontWeight:800,color:s.c }}>{s.v}</div>
              <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          {[
            {h:"/admin/security/fraud/suspicious-activity",l:"🔍 Suspicious Activity",d:"Flagged transactions and users requiring review"},
            {h:"/admin/security/fraud/blocked-transactions",l:"🚫 Blocked Transactions",d:"Automatically blocked high-risk transactions"},
            {h:"/admin/security/fraud/withdrawal-protection",l:"💸 Withdrawal Protection",d:"Whitelist, cooling periods, and limits"},
          ].map((n,i) => (
            <button key={i} onClick={()=>router.push(n.h)} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px 20px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:"#fff",transition:"border-color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#F0B90B40"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
              <div style={{ fontSize:14,fontWeight:700,marginBottom:4 }}>{n.l}</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>{n.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
