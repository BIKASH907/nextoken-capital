import { useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AccountSecurity() {
  const { data: session } = useSession();
  const [exportMsg, setExportMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const exportData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "export" }) });
      const data = await res.json();
      if (res.ok) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "nextoken-data-export.json"; a.click();
        setExportMsg("Data exported successfully");
      } else setExportMsg(data.error);
    } catch { setExportMsg("Export failed"); }
    setLoading(false);
  };

  const deleteAccount = async () => {
    if (deleteConfirm !== "DELETE MY ACCOUNT") { setDeleteMsg("Type DELETE MY ACCOUNT to confirm"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/user/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", confirmation: deleteConfirm }) });
      const data = await res.json();
      if (res.ok) { setDeleteMsg("Account deleted. Redirecting..."); setTimeout(() => window.location.href = "/", 3000); }
      else setDeleteMsg(data.error);
    } catch { setDeleteMsg("Failed"); }
    setLoading(false);
  };

  const s = {
    page: { minHeight:"100vh",background:"#0B0E11",color:"#fff",fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",paddingTop:100,paddingBottom:60 },
    container: { maxWidth:640,margin:"0 auto",padding:"0 20px" },
    card: { background:"#161B22",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:24,marginBottom:20 },
    title: { fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:.5,marginBottom:12 },
    desc: { fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:16 },
    btn: { padding:"10px 24px",borderRadius:8,fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:"inherit" },
    input: { width:"100%",background:"#0D1117",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 14px",fontSize:14,color:"#fff",outline:"none",fontFamily:"inherit",marginBottom:12 },
    msg: (ok) => ({ padding:"10px 14px",borderRadius:8,fontSize:13,marginTop:10,background:ok?"rgba(14,203,129,0.1)":"rgba(255,77,77,0.1)",border:"1px solid "+(ok?"rgba(14,203,129,0.2)":"rgba(255,77,77,0.2)"),color:ok?"#0ECB81":"#ff6b6b" }),
  };

  return (<>
    <Head><title>Account Security - Nextoken Capital</title></Head>
    <Navbar />
    <div style={s.page}><div style={s.container}>
      <h1 style={{fontSize:28,fontWeight:900,marginBottom:8}}>Account Security & Privacy</h1>
      <p style={{fontSize:14,color:"rgba(255,255,255,0.4)",marginBottom:32}}>Manage your security settings and data privacy rights</p>

      <div style={s.card}>
        <div style={s.title}>Password</div>
        <div style={s.desc}>Change your account password. We recommend using a strong, unique password.</div>
        <button onClick={() => window.location.href="/change-password"} style={{...s.btn,background:"rgba(240,185,11,0.1)",color:"#F0B90B"}}>Change password</button>
      </div>

      <div style={s.card}>
        <div style={s.title}>Two-factor authentication</div>
        <div style={s.desc}>Add an extra layer of security to your account with TOTP-based 2FA.</div>
        <button style={{...s.btn,background:"rgba(59,130,246,0.1)",color:"#3B82F6"}}>Enable 2FA</button>
      </div>

      <div style={s.card}>
        <div style={s.title}>Data export (GDPR Article 20)</div>
        <div style={s.desc}>Download a copy of all your personal data including profile, wallet transactions, and investment history in JSON format.</div>
        <button onClick={exportData} disabled={loading} style={{...s.btn,background:"rgba(14,203,129,0.1)",color:"#0ECB81"}}>{loading ? "Exporting..." : "Export my data"}</button>
        {exportMsg && <div style={s.msg(exportMsg.includes("success"))}>{exportMsg}</div>}
      </div>

      <div style={{...s.card,borderColor:"rgba(255,77,77,0.15)"}}>
        <div style={{...s.title,color:"#ff6b6b"}}>Delete account (GDPR Article 17)</div>
        <div style={s.desc}>Permanently anonymize your account data. This cannot be undone. You must close all active investments and withdraw your balance first.</div>
        <input style={s.input} placeholder='Type "DELETE MY ACCOUNT" to confirm' value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} />
        <button onClick={deleteAccount} disabled={loading || deleteConfirm !== "DELETE MY ACCOUNT"} style={{...s.btn,background:deleteConfirm === "DELETE MY ACCOUNT" ? "rgba(255,77,77,0.15)" : "rgba(255,255,255,0.04)",color:deleteConfirm === "DELETE MY ACCOUNT" ? "#ff6b6b" : "rgba(255,255,255,0.2)"}}>{loading ? "Deleting..." : "Delete my account"}</button>
        {deleteMsg && <div style={s.msg(deleteMsg.includes("deleted"))}>{deleteMsg}</div>}
      </div>

      <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",textAlign:"center",marginTop:24}}>Your rights under GDPR: access, rectification, erasure, restriction, portability, and objection. Contact privacy@nextokencapital.com for any data requests.</div>
    </div></div>
    <Footer />
  </>);
}