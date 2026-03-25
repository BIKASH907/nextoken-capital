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
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🖥️ Active Sessions</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:28 }}>Session management, timeouts, device tracking, and geo-fencing.</p>

        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Session timeout: Auto-logout after 15 minutes of inactivity</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>IP whitelisting: Admin panel only from pre-approved IPs or VPN</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Geo-fencing: Block admin logins from outside EU</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Device fingerprinting: Track and approve specific devices</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Login attempt limits: Lock after 5 failures — Super Admin unlock required</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Concurrent session limit: Only 1 active session per admin</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Admin URL obfuscation: Non-guessable admin path</div>
      </div>
    </div>
  );
}
