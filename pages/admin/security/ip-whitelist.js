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
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🌐 IP Whitelist</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:28 }}>Only approved IP addresses can access the admin panel.</p>

        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Pre-approved IP addresses for admin access</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>VPN-only access enforcement</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Geo-fencing: EU countries only (LT, DE, FR, NL, EE, LV)</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Real-time IP blocking for suspicious sources</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Automatic blocking of Tor/VPN/proxy for admin routes</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>IP change notifications to Super Admin</div>
      </div>
    </div>
  );
}
