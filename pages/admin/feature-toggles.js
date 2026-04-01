import { useState, useEffect } from "react";
import AdminShell from "../../components/admin/AdminShell";

export default function FeatureToggles() {
  const [toggles, setToggles] = useState({ exchange: false, equityIpo: false, secondaryMarket: false });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

  useEffect(() => {
    fetch("/api/admin/feature-toggles", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(d => { if (d.exchange !== undefined) setToggles(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggle = async (feature) => {
    const newVal = !toggles[feature];
    setToggles(prev => ({ ...prev, [feature]: newVal }));
    const r = await fetch("/api/admin/feature-toggles", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ feature, enabled: newVal })
    });
    const d = await r.json();
    if (d.success) setMsg(feature + " " + (newVal ? "enabled" : "disabled"));
    else setMsg("Error: " + d.error);
    setTimeout(() => setMsg(""), 3000);
  };

  const S = {
    card: { background:"#0F1318", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:20, marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" },
    label: { fontSize:15, fontWeight:700 },
    desc: { fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:2 },
    toggle: (on) => ({ width:48, height:26, borderRadius:13, background:on?"#F0B90B":"rgba(255,255,255,0.1)", cursor:"pointer", position:"relative", transition:"background .2s", border:"none", padding:0 }),
    dot: (on) => ({ position:"absolute", top:3, left:on?25:3, width:20, height:20, borderRadius:"50%", background:on?"#0B0E11":"rgba(255,255,255,0.3)", transition:"left .2s" }),
    msg: { padding:"10px 16px", background:"rgba(14,203,129,0.1)", border:"1px solid rgba(14,203,129,0.2)", borderRadius:8, color:"#0ECB81", fontSize:13, marginBottom:16 },
  };

  const features = [
    { key:"exchange", name:"Secondary Market / Exchange", desc:"Enable peer-to-peer token trading on the Exchange page. When off, shows 'Coming Soon' banner." },
    { key:"equityIpo", name:"Equity & IPO", desc:"Enable equity and IPO token offerings. When off, shows 'Coming Soon' banner." },
    { key:"secondaryMarket", name:"Secondary Market Trading", desc:"Enable buy/sell order matching on the secondary market. When off, order placement is disabled." },
  ];

  return (
    <AdminShell title="Feature Toggles" subtitle="Enable or disable platform features">
      {loading ? <div style={{color:"rgba(255,255,255,0.3)"}}>Loading...</div> : (
        <div style={{maxWidth:600}}>
          {msg && <div style={S.msg}>{msg}</div>}
          {features.map(f => (
            <div key={f.key} style={S.card}>
              <div>
                <div style={S.label}>{f.name}</div>
                <div style={S.desc}>{f.desc}</div>
              </div>
              <button onClick={() => toggle(f.key)} style={S.toggle(toggles[f.key])}>
                <div style={S.dot(toggles[f.key])} />
              </button>
            </div>
          ))}
          <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:20}}>Changes take effect immediately. No rebuild required.</div>
        </div>
      )}
    </AdminShell>
  );
}