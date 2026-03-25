import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function ActiveSessions() {
  const router = useRouter();

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:230, padding:"28px 36px", flex:1, color:"#fff" }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>🖥️ Session & Login Security</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:28 }}>Active sessions, timeout settings, and device management.</p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
          {[
            { label:"Session Timeout", value:"15 min", desc:"Auto-logout after inactivity", color:"#f59e0b" },
            { label:"Login Attempts", value:"5 max", desc:"Lock after 5 failures", color:"#ef4444" },
            { label:"Geo-Fencing", value:"EU Only", desc:"Block non-EU logins", color:"#3b82f6" },
          ].map((s,i) => (
            <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"18px 20px", textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginTop:4 }}>{s.label}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize:16, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Security Settings</h2>
        {[
          { label:"IP Whitelisting", desc:"Admin panel accessible only from pre-approved IP addresses or VPN", enabled:true },
          { label:"Device Fingerprinting", desc:"Track and approve specific devices for admin access", enabled:true },
          { label:"Admin URL Obfuscation", desc:"Non-guessable admin path instead of /admin", enabled:false },
          { label:"Concurrent Session Limit", desc:"Only 1 active session per admin account", enabled:true },
        ].map((s,i) => (
          <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"14px 20px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600 }}>{s.label}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{s.desc}</div>
            </div>
            <span style={{ fontSize:11, padding:"4px 12px", borderRadius:5, background:s.enabled?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.04)", color:s.enabled?"#22c55e":"rgba(255,255,255,0.3)", fontWeight:700 }}>
              {s.enabled ? "✓ Enabled" : "○ Disabled"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
