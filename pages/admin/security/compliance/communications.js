import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../../components/AdminSidebar";

export default function Page() {
  const router = useRouter();
  useEffect(() => { if(!localStorage.getItem("adminToken")) router.push("/admin/login"); }, []);

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240,padding:"28px 36px",flex:1,color:"#fff",maxWidth:1100 }}>
        <h1 style={{ fontSize:24,fontWeight:800,marginBottom:4 }}>📧 Communication Security</h1>
        <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:28 }}>Anti-phishing codes, DMARC/DKIM/SPF, secure in-app messaging.</p>

        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Anti-phishing code: Personal code in every official email to investors</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>No sensitive data in emails: Never passwords, balances, or account numbers</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>Secure in-app messaging for all support communication</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>DMARC (reject policy): Blocks email spoofing of nextokencapital.com</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>DKIM signing: Cryptographic verification of email authenticity</div>
        <div style={{ background:"#161b22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"12px 16px",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}><span style={{ color:"#22c55e",marginRight:8 }}>✓</span>SPF records: Only authorized servers can send from our domain</div>
      </div>
    </div>
  );
}
