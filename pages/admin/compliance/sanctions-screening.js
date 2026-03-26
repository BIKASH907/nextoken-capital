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
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>🔍 Sanctions Screening</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:28 }}>Real-time screening against EU, UN, OFAC sanctions lists.</p>

        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Real-time screening on every transaction and user registration</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>EU sanctions list: Updated automatically</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>UN sanctions list: Updated automatically</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>OFAC (US) sanctions list: Updated automatically</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Automated PEP (Politically Exposed Person) checks on all users</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Address screening: All wallet addresses checked before transactions</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Automatic blocking of flagged users with compliance notification</div>
      </div>
    </div>
  );
}
