import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function DevSecOpsDashboard() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240,padding:"28px 36px",flex:1,color:"#fff" }}>
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🔧 DevSecOps Dashboard</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:24 }}>Infrastructure security, CI/CD pipeline, monitoring, backup, and incident response.</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
          {[
            {h:"/admin/devsecops/waf",l:"🛡️ WAF & DDoS",d:"Firewall, rate limiting, DDoS mitigation"},
            {h:"/admin/devsecops/containers",l:"📦 Container Security",d:"Distroless, signing, runtime protection"},
            {h:"/admin/devsecops/dns",l:"🌍 DNS & Domain",d:"DNSSEC, CAA, subdomain monitoring"},
            {h:"/admin/devsecops/certificates",l:"📜 Certificates",d:"Auto-renewal, CT monitoring, PKI"},
            {h:"/admin/devsecops/secrets",l:"🗝️ Secret Management",d:"HSM, Vault, key rotation"},
            {h:"/admin/devsecops/siem",l:"🔭 SIEM & Threat Intel",d:"Log aggregation, correlation, SOAR"},
            {h:"/admin/devsecops/backup",l:"💾 Backup & DR",d:"3-2-1 backups, WORM, multi-region"},
            {h:"/admin/devsecops/incident-response",l:"🆘 Incident Response",d:"Playbooks, auto-containment, drills"},
          ].map((n,i) => (
            <button key={i} onClick={()=>router.push(n.h)} style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px 20px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",color:"#fff",transition:"border-color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#06b6d440"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
              <div style={{ fontSize:14,fontWeight:700,marginBottom:4 }}>{n.l}</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>{n.d}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
