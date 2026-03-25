import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function Page() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240,padding:"28px 36px",flex:1,color:"#fff",maxWidth:1100 }}>
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🔭 SIEM & Threat Intelligence</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:28 }}>Centralized SIEM, correlation rules, SOAR, threat hunting, red team.</p>

        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Centralized SIEM (Elastic/Splunk) aggregating all log sources</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Correlation rules: Failed login + VPN + escalation = critical alert</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Threat intelligence feeds via STIX/TAXII for IOCs</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>SOAR automated playbooks: Auto-block IPs, isolate endpoints</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>24/7 SOC coverage: Internal team + managed SOC after-hours</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Monthly threat hunting using MITRE ATT&CK framework</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Annual red team engagement by external security firm</div>
      </div>
    </div>
  );
}
