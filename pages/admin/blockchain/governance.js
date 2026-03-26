import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";
export default function Governance() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState({ proposals: [], emergencyPause: false });
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => { const t = localStorage.getItem("adminToken"); if (!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if (token) load(); }, [token]);
  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => fetch("/api/admin/governance", { headers }).then(r => r.json()).then(setData).catch(() => {});
  const propose = async () => { if (!title) return; const r = await fetch("/api/admin/governance", { method: "POST", headers, body: JSON.stringify({ action: "propose", title, description: desc }) }); const d = await r.json(); setMsg(d.message); setTitle(""); setDesc(""); load(); };
  const approve = async (id) => { const r = await fetch("/api/admin/governance", { method: "POST", headers, body: JSON.stringify({ action: "approve", proposalId: id }) }); setMsg((await r.json()).message); load(); };
  const togglePause = async () => { const r = await fetch("/api/admin/governance", { method: "POST", headers, body: JSON.stringify({ action: "emergency_pause" }) }); setMsg((await r.json()).message); load(); };
  const inp = { background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"8px 12px", color:"#fff", fontSize:13, outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box" };
  return (
    <AdminShell title="Smart Contract Governance" subtitle="Proposals, multi-sig, emergency pause.">
      {msg && <div style={{ background:"rgba(240,185,11,0.08)", border:"1px solid rgba(240,185,11,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#F0B90B", marginBottom:16 }}>{msg}</div>}
      <div style={{ display:"flex", gap:12, marginBottom:24 }}>
        <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px 20px", flex:1 }}><div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>System</div><div style={{ fontSize:20, fontWeight:800, color:data.emergencyPause?"#ef4444":"#22c55e", marginTop:4 }}>{data.emergencyPause ? "PAUSED" : "ACTIVE"}</div></div>
        <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px 20px", flex:1 }}><div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>Pending</div><div style={{ fontSize:20, fontWeight:800, color:"#F0B90B", marginTop:4 }}>{data.proposals?.filter(p => p.status === "pending").length}</div></div>
        <button onClick={togglePause} style={{ padding:"12px 20px", borderRadius:8, background:data.emergencyPause?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", border:"1px solid "+(data.emergencyPause?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"), color:data.emergencyPause?"#22c55e":"#ef4444", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", alignSelf:"center" }}>{data.emergencyPause ? "Resume" : "Emergency Pause"}</button>
      </div>
      <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20, marginBottom:20 }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>New Proposal</h3>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" style={{ ...inp, marginBottom:8 }} />
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" rows={2} style={{ ...inp, marginBottom:8, resize:"vertical" }} />
        <button onClick={propose} style={{ padding:"8px 20px", background:"#F0B90B", color:"#000", border:"none", borderRadius:7, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Submit (48hr timelock)</button>
      </div>
      {(data.proposals||[]).map((p, i) => (
        <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"14px 20px", marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:14, fontWeight:700 }}>{p.title}</span><span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:p.status==="approved"?"rgba(34,197,94,0.1)":"rgba(240,185,11,0.1)", color:p.status==="approved"?"#22c55e":"#F0B90B", fontWeight:700 }}>{p.status} ({(p.approvals||[]).length}/{p.requiredApprovals})</span></div>
          {p.description && <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:6 }}>{p.description}</div>}
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>By {p.proposedBy} · Timelock: {new Date(p.timelockExpires).toLocaleString()}</div>
          {p.status === "pending" && <button onClick={() => approve(p._id)} style={{ marginTop:8, padding:"4px 14px", borderRadius:5, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Approve</button>}
        </div>
      ))}
    </AdminShell>
  );
}
