import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";
export default function ComplianceDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [stats, setStats] = useState({});
  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if(token) fetch("/api/admin/stats", { headers:{ Authorization:"Bearer "+token } }).then(r=>r.json()).then(setStats); }, [token]);
  const card = (l,v,c,href) => <div onClick={()=>router.push(href)} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"18px 22px", flex:1, cursor:"pointer", minWidth:180 }}><div style={{ fontSize:24, fontWeight:800, color:c }}>{v}</div><div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div></div>;
  return (
    <AdminShell title="Compliance Dashboard" subtitle="KYC, AML, sanctions, and regulatory overview.">
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        {card("KYC Queue", stats.pendingKyc||0, "#f59e0b", "/admin/compliance/kyc")}
        {card("Total Users", stats.totalUsers||0, "#3b82f6", "/admin/users")}
        {card("Approved KYC", stats.approvedKyc||0, "#22c55e", "/admin/compliance/kyc")}
      </div>
      <h3 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Quick Links</h3>
      {[{l:"KYC/KYB Queue",h:"/admin/compliance/kyc",d:"Review identity verifications"},{l:"Sanctions Screening",h:"/admin/compliance/sanctions-screening",d:"EU/UN/OFAC screening"},{l:"Transaction Monitor",h:"/admin/compliance/transaction-monitor",d:"Suspicious activity rules"},{l:"Issuer EDD",h:"/admin/compliance/issuer-edd",d:"Enhanced due diligence"},{l:"Data Protection",h:"/admin/compliance/data-protection",d:"GDPR compliance"},{l:"Communications",h:"/admin/compliance/communications",d:"Anti-phishing, DMARC"}].map((item,i) => (
        <div key={i} onClick={()=>router.push(item.h)} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 20px", marginBottom:6, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div><div style={{ fontSize:14, fontWeight:600 }}>{item.l}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{item.d}</div></div>
          <span style={{ color:"rgba(255,255,255,0.2)", fontSize:16 }}>→</span>
        </div>
      ))}
    </AdminShell>
  );
}
