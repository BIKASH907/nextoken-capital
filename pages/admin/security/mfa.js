import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";
export default function MFAPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [mfa, setMfa] = useState({});
  const [secret, setSecret] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { const t = localStorage.getItem("adminToken"); if (!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if (token) load(); }, [token]);
  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => fetch("/api/admin/security/mfa", { headers }).then(r => r.json()).then(setMfa);
  const generate = async () => { const r = await fetch("/api/admin/security/mfa", { method: "POST", headers, body: JSON.stringify({ action: "generate_secret" }) }); setSecret(await r.json()); };
  const toggle = async (e) => { const r = await fetch("/api/admin/security/mfa", { method: "POST", headers, body: JSON.stringify({ action: e ? "enable" : "disable" }) }); const d = await r.json(); setMsg(d.message); setSecret(null); load(); };
  return (
    <AdminShell title="Multi-Factor Authentication" subtitle="Secure your account with TOTP.">
      {msg && <div style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#22c55e", marginBottom:16 }}>{msg}</div>}
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20, marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div><div style={{ fontSize:16, fontWeight:700 }}>MFA Status</div><div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{mfa.mfaEnabled ? "Enabled ("+mfa.mfaMethod+")" : "Disabled"}</div></div>
        <span style={{ fontSize:12, padding:"4px 12px", borderRadius:6, background:mfa.mfaEnabled?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", color:mfa.mfaEnabled?"#22c55e":"#ef4444", fontWeight:700 }}>{mfa.mfaEnabled ? "ACTIVE" : "INACTIVE"}</span>
      </div>
      {!mfa.mfaEnabled && !secret && <button onClick={generate} style={{ padding:"10px 24px", background:"#F0B90B", color:"#000", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Setup Google Authenticator</button>}
      {secret && <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20 }}><div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:16 }}>Enter this secret in Google Authenticator:<br/><strong style={{ color:"#F0B90B", fontFamily:"monospace", fontSize:18 }}>{secret.secret}</strong></div><button onClick={() => toggle(true)} style={{ padding:"10px 24px", background:"#22c55e", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Enable MFA</button></div>}
      {mfa.mfaEnabled && <button onClick={() => toggle(false)} style={{ padding:"10px 20px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Disable MFA</button>}
    </AdminShell>
  );
}
