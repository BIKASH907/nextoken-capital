import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function MFASettings() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    try { setEmployee(JSON.parse(localStorage.getItem("adminEmployee"))); } catch(e) { router.push("/admin/login"); }
  }, []);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:230, padding:"28px 36px", flex:1, color:"#fff" }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>🔒 Multi-Factor Authentication</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:28 }}>Every admin account MUST use MFA. Non-negotiable for a regulated platform.</p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
          {[
            { title:"Hardware Keys (YubiKey/FIDO2)", desc:"Best option. Physical device required. Cannot be phished.", status:"Recommended", color:"#22c55e" },
            { title:"TOTP Authenticator App", desc:"Google Authenticator or Authy. 6-digit rotating codes.", status:employee?.mfaEnabled?"Enabled":"Not Set", color:employee?.mfaEnabled?"#22c55e":"#f59e0b" },
            { title:"SMS-based 2FA", desc:"SIM-swapping attacks make SMS unreliable.", status:"Disabled", color:"#ef4444" },
            { title:"Biometric (Face ID/Fingerprint)", desc:"Secondary to hardware key. For mobile access.", status:"Optional", color:"#3b82f6" },
          ].map((m,i) => (
            <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"18px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ fontSize:15, fontWeight:700 }}>{m.title}</div>
                <span style={{ fontSize:10, padding:"3px 10px", borderRadius:4, background:m.color+"15", color:m.color, fontWeight:700 }}>{m.status}</span>
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background:"rgba(240,185,11,0.06)", border:"1px solid rgba(240,185,11,0.15)", borderRadius:10, padding:"16px 20px", fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
          <strong style={{ color:"#F0B90B" }}>MFA Policy:</strong> All admin accounts require TOTP or hardware key authentication. SMS 2FA is permanently disabled due to SIM-swapping risk. MFA is verified every 15 minutes during active sessions.
        </div>
      </div>
    </div>
  );
}
