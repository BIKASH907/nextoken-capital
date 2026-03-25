import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function SystemConfig() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    try {
      const emp = JSON.parse(localStorage.getItem("adminEmployee"));
      setEmployee(emp);
      if (emp?.role !== "super_admin") router.push("/admin");
    } catch(e) { router.push("/admin/login"); }
  }, []);

  const configs = [
    { section:"WITHDRAWAL LIMITS", items:[
      { label:"Daily Withdrawal Limit", value:"EUR 5,000", desc:"Per investor per day" },
      { label:"Large Withdrawal Threshold", value:"EUR 25,000", desc:"Triggers compliance review" },
      { label:"Dual-Approval Threshold", value:"EUR 10,000", desc:"Requires second admin" },
      { label:"Whitelist Cooling Period", value:"24 hours", desc:"After adding new destination" },
    ]},
    { section:"SESSION & AUTH", items:[
      { label:"Admin Session Timeout", value:"15 minutes", desc:"Auto-logout on inactivity" },
      { label:"Max Login Attempts", value:"5", desc:"Before account lockout" },
      { label:"Lockout Duration", value:"60 minutes", desc:"Or manual Super Admin unlock" },
      { label:"API Key Rotation", value:"90 days", desc:"Auto-rotate interval" },
    ]},
    { section:"RETENTION & COMPLIANCE", items:[
      { label:"Audit Log Retention", value:"10 years", desc:"Exceeds EU AML 7yr minimum" },
      { label:"Login History Retention", value:"2 years", desc:"All login attempts" },
      { label:"KYC Document Storage", value:"Encrypted", desc:"AES-256, separate storage" },
      { label:"GDPR Export", value:"Enabled", desc:"Investors can download their data" },
    ]},
    { section:"BLOCKCHAIN", items:[
      { label:"Multi-Sig Threshold", value:"3 of 5", desc:"Treasury fund movements" },
      { label:"Hot Wallet Limit", value:"EUR 50,000", desc:"Auto-sweep to cold storage" },
      { label:"Contract Upgrade Timelock", value:"48 hours", desc:"Delay before execution" },
      { label:"Emergency Pause", value:"Enabled", desc:"Circuit breaker for all tokens" },
    ]},
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:230, padding:"28px 36px", flex:1, color:"#fff" }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>⚙️ System Configuration</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:28 }}>Super Admin only — changes require dual-approval and are logged.</p>

        {configs.map((section, si) => (
          <div key={si} style={{ marginBottom:28 }}>
            <h2 style={{ fontSize:13, fontWeight:700, color:"#F0B90B", letterSpacing:1, marginBottom:12 }}>{section.section}</h2>
            <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
              {section.items.map((item, i) => (
                <div key={i} style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{item.label}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{item.desc}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:"#F0B90B" }}>{item.value}</span>
                    <button style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:5, padding:"4px 10px", color:"rgba(255,255,255,0.4)", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:10, padding:"16px 20px", fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.7 }}>
          <strong style={{ color:"#ef4444" }}>⚠ Warning:</strong> All configuration changes require dual-approval (second Super Admin must confirm). Changes are logged to the immutable audit trail with SHA-256 hash chain. Unauthorized modifications are automatically flagged.
        </div>
      </div>
    </div>
  );
}
