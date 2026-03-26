import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";
export default function IPWhitelistPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [ips, setIps] = useState([]);
  const [newIp, setNewIp] = useState("");
  const [label, setLabel] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => { const t = localStorage.getItem("adminToken"); if (!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if (token) load(); }, [token]);
  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => fetch("/api/admin/security/ip-whitelist", { headers }).then(r => r.json()).then(d => setIps(d.ips || []));
  const add = async () => { if (!newIp) return; const r = await fetch("/api/admin/security/ip-whitelist", { method: "POST", headers, body: JSON.stringify({ action: "add", ip: newIp, label }) }); const d = await r.json(); setMsg(r.ok ? d.message : d.error); setNewIp(""); setLabel(""); load(); };
  const remove = async (ip) => { await fetch("/api/admin/security/ip-whitelist", { method: "POST", headers, body: JSON.stringify({ action: "remove", ip }) }); setMsg("Removed"); load(); };
  const inp = { background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"8px 12px", color:"#fff", fontSize:13, outline:"none", fontFamily:"inherit" };
  return (
    <AdminShell title="IP Whitelist" subtitle="Restrict admin access to specific IPs. All changes audit logged.">
      {msg && <div style={{ background:"rgba(240,185,11,0.08)", border:"1px solid rgba(240,185,11,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#F0B90B", marginBottom:16 }}>{msg}</div>}
      <div style={{ display:"flex", gap:8, marginBottom:20, alignItems:"center" }}>
        <input value={newIp} onChange={e => setNewIp(e.target.value)} placeholder="IP (e.g. 192.168.1.1)" style={{ ...inp, width:200 }} />
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (Office)" style={{ ...inp, width:150 }} />
        <button onClick={add} style={{ padding:"8px 16px", borderRadius:6, background:"#F0B90B", color:"#000", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Add</button>
      </div>
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
        {ips.length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No IPs. All allowed.</div> : ips.map((ip, i) => (
          <div key={i} style={{ padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div><span style={{ fontFamily:"monospace", fontWeight:600 }}>{ip.ip}</span>{ip.label && <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginLeft:10 }}>{ip.label}</span>}<div style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>By {ip.addedBy}</div></div>
            <button onClick={() => remove(ip.ip)} style={{ padding:"4px 12px", borderRadius:4, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>Remove</button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
