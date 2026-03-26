import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function ComplianceDashboard() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240,padding:"28px 36px",flex:1,color:"#fff" }}>
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🛡️ Compliance Dashboard</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:24 }}>MiCA-compliant monitoring: sanctions, PEP checks, transaction rules, GDPR.</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28 }}>
          {[{l:"Sanctions Lists",v:"EU/UN/OFAC",c:"#ef4444"},{l:"PEP Checks",v:"Automated",c:"#8b5cf6"},{l:"GDPR",v:"Compliant",c:"#22c55e"}].map((s,i) => (
            <div key={i} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px",textAlign:"center" }}>
              <div style={{ fontSize:20,fontWeight:800,color:s.c }}>{s.v}</div>
              <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
          {[
            {h:"/admin/security/compliance/sanctions-screening",l:"🔍 Sanctions Screening",d:"EU/UN/OFAC real-time checks"},
            {h:"/admin/security/compliance/transaction-monitor",l:"📡 Transaction Monitor",d:"Rules engine for suspicious activity"},
            {h:"/admin/security/compliance/issuer-edd",l:"🏛️ Issuer Due Diligence",d:"Corporate KYC and asset verification"},
            {h:"/admin/security/compliance/data-protection",l:"🔏 Data Protection",d:"GDPR compliance and PII encryption"},
            {h:"/admin/security/compliance/privacy",l:"👤 Privacy Engineering",d:"PIAs, consent, retention automation"},
            {h:"/admin/security/compliance/communications",l:"📧 Communications",d:"Anti-phishing, DMARC/DKIM/SPF"},
          ].map((n,i) => (
            <button key={i} onClick={()=>router.push(n.h)} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px 20px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:"#fff",transition:"border-color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#8b5cf640"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
              <div style={{ fontSize:14,fontWeight:700,marginBottom:4 }}>{n.l}</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>{n.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
