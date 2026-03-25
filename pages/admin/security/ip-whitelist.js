import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function IPWhitelist() {
  const router = useRouter();
  const [newIp, setNewIp] = useState("");

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:230, padding:"28px 36px", flex:1, color:"#fff" }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>🌐 IP Whitelist</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:28 }}>Only approved IPs can access the admin panel.</p>

        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          <input value={newIp} onChange={e => setNewIp(e.target.value)} placeholder="Enter IP address (e.g., 1.2.3.4)" style={{ flex:1, background:"#161b22", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 14px", color:"#fff", fontSize:13, outline:"none", fontFamily:"inherit" }} />
          <button style={{ background:"#F0B90B", color:"#000", border:"none", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Add IP</button>
        </div>

        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
          {[
            { ip:"0.0.0.0/0", label:"All IPs (Development)", status:"active" },
          ].map((item, i) => (
            <div key={i} style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:600, fontFamily:"monospace" }}>{item.ip}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{item.label}</div>
              </div>
              <span style={{ fontSize:11, padding:"4px 12px", borderRadius:5, background:"rgba(34,197,94,0.1)", color:"#22c55e", fontWeight:700 }}>Active</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop:20, background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:10, padding:"16px 20px", fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.7 }}>
          <strong style={{ color:"#3b82f6" }}>Geo-Fencing Active:</strong> Admin logins are restricted to EU countries (Lithuania, Germany, France, Netherlands, Estonia, Latvia). Logins from outside the EU are automatically blocked.
        </div>
      </div>
    </div>
  );
}
