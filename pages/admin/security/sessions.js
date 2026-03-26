import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";
export default function SessionsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [sessions, setSessions] = useState([]);
  const [msg, setMsg] = useState("");
  useEffect(() => { const t = localStorage.getItem("adminToken"); if (!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if (token) load(); }, [token]);
  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => fetch("/api/admin/security/sessions", { headers }).then(r => r.json()).then(d => setSessions(d.sessions || []));
  const revoke = async (id) => { await fetch("/api/admin/security/sessions", { method: "POST", headers, body: JSON.stringify({ action: "revoke", sessionId: id }) }); setMsg("Revoked"); load(); };
  const revokeAll = async () => { if (!confirm("Revoke ALL?")) return; await fetch("/api/admin/security/sessions", { method: "POST", headers, body: JSON.stringify({ action: "revoke_all" }) }); setMsg("All revoked"); load(); };
  return (
    <AdminShell title="Session Management" subtitle="View and revoke active sessions.">
      {msg && <div style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#22c55e", marginBottom:16 }}>{msg}</div>}
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}><span style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>{sessions.length} session(s)</span><button onClick={revokeAll} style={{ padding:"6px 14px", borderRadius:6, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Revoke All</button></div>
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        {sessions.length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No sessions</div> : sessions.map((s, i) => (
          <div key={i} style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div><div style={{ fontSize:13, fontWeight:600 }}>IP: {s.ip}</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>{new Date(s.lastActivity).toLocaleString()}</div></div>
            <button onClick={() => revoke(s._id)} style={{ padding:"4px 12px", borderRadius:4, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>Revoke</button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
