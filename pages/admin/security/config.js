import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function SystemConfiguration() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);

  useEffect(() => { if (token) load(); }, [token]);

  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => {
    fetch("/api/admin/system-config", { headers }).then(r => r.json()).then(d => setConfigs(d.configs || {})).finally(() => setLoading(false));
  };

  const save = async (key) => {
    setMsg("");
    const val = isNaN(editValue) ? editValue : Number(editValue);
    const res = await fetch("/api/admin/system-config", { method: "POST", headers, body: JSON.stringify({ key, value: val }) });
    const d = await res.json();
    setMsg(res.ok ? "Saved: " + d.message : "Error: " + d.error);
    setEditing(null);
    load();
  };

  const categories = {
    withdrawal: { label: "WITHDRAWAL LIMITS", color: "#F0B90B" },
    session: { label: "SESSION AND AUTH", color: "#F0B90B" },
  };

  const formatValue = (key, val) => {
    if (["daily_withdrawal_limit", "large_withdrawal_threshold", "dual_approval_threshold"].includes(key)) return "EUR " + Number(val).toLocaleString();
    if (key === "whitelist_cooling_period") return val + " hours";
    if (key === "session_timeout" || key === "lockout_duration") return val + " minutes";
    if (key === "api_key_rotation") return val + " days";
    if (key === "max_login_attempts") return String(val);
    return String(val);
  };

  const descriptions = {
    daily_withdrawal_limit: "Per investor per day",
    large_withdrawal_threshold: "Triggers compliance review",
    dual_approval_threshold: "Requires second admin",
    whitelist_cooling_period: "After adding new destination",
    session_timeout: "Auto-logout on inactivity",
    max_login_attempts: "Before account lockout",
    lockout_duration: "Or manual Super Admin unlock",
    api_key_rotation: "Automatic key rotation period",
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, padding:"28px 36px", flex:1, color:"#fff", maxWidth:900 }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>System Configuration</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:24 }}>Super Admin only. All changes are logged to the audit trail.</p>

        {msg && <div style={{ background:"rgba(240,185,11,0.08)", border:"1px solid rgba(240,185,11,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#F0B90B", marginBottom:16 }}>{msg}</div>}

        {loading ? <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", padding:40 }}>Loading...</div> : (
          Object.entries(categories).map(([catKey, cat]) => (
            <div key={catKey} style={{ marginBottom:28 }}>
              <div style={{ fontSize:12, fontWeight:700, color:cat.color, letterSpacing:1, marginBottom:12 }}>{cat.label}</div>
              <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                {Object.entries(configs).filter(([k, c]) => c.category === catKey).map(([key, conf], i) => (
                  <div key={key} style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600 }}>{conf.label}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{descriptions[key] || ""}</div>
                      {conf.updatedByName && <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", marginTop:4 }}>Last updated by {conf.updatedByName} at {new Date(conf.updatedAt).toLocaleString()}</div>}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      {editing === key ? (
                        <>
                          <input value={editValue} onChange={e => setEditValue(e.target.value)} style={{ width:100, background:"#0a0e14", border:"1px solid rgba(240,185,11,0.3)", borderRadius:6, padding:"6px 10px", color:"#F0B90B", fontSize:14, fontWeight:700, outline:"none", textAlign:"right", fontFamily:"inherit" }} autoFocus />
                          <button onClick={() => save(key)} style={{ padding:"5px 12px", borderRadius:5, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Save</button>
                          <button onClick={() => setEditing(null)} style={{ padding:"5px 12px", borderRadius:5, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize:16, fontWeight:700, color:"#F0B90B" }}>{formatValue(key, conf.value)}</span>
                          <button onClick={() => { setEditing(key); setEditValue(String(conf.value)); }} style={{ padding:"5px 12px", borderRadius:5, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Edit</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
