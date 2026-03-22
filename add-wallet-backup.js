const fs = require("fs");

// ── 1. FORGOT PASSWORD PAGE ──
const forgotPw = `import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [sent,  setSent]      = useState(false);
  const [loading, setLoading] = useState(false);

  async function handle(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  }

  const S = {
    page: { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px" },
    box:  { width:"100%", maxWidth:420, background:"#0d0d14", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:36 },
  };

  return (
    <div style={S.page}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        input:focus { border-color:#F0B90B !important; outline:none; }
      \`}</style>

      <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", marginBottom:28 }}>
        <span style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:900, color:"#F0B90B", letterSpacing:2 }}>NXT</span>
        <div style={{ width:1, height:20, background:"rgba(240,185,11,0.25)" }} />
        <span style={{ fontFamily:"Syne,sans-serif", fontSize:12, fontWeight:800, letterSpacing:"0.2em", color:"#F0B90B" }}>NEXTOKEN CAPITAL</span>
      </Link>

      <div style={S.box}>
        {sent ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>📧</div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#e8e8f0", margin:"0 0 10px" }}>Check your inbox</h2>
            <p style={{ fontSize:14, color:"#8a9bb8", lineHeight:1.7, marginBottom:24 }}>
              If an account exists for <strong style={{ color:"#F0B90B" }}>{email}</strong>, we sent a password reset link. Check your spam folder too.
            </p>
            <div style={{ padding:14, borderRadius:10, background:"rgba(240,185,11,0.06)", border:"1px solid rgba(240,185,11,0.2)", marginBottom:20 }}>
              <p style={{ fontSize:12.5, color:"#F0B90B", fontWeight:600, margin:"0 0 4px" }}>Link expires in 30 minutes</p>
              <p style={{ fontSize:12, color:"#8a9bb8", margin:0 }}>For security, reset links are single-use only.</p>
            </div>
            <Link href="/register" style={{ display:"block", padding:"12px 0", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, textDecoration:"none", textAlign:"center" }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:24 }}>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#e8e8f0", margin:"0 0 8px" }}>Reset your password</h2>
              <p style={{ fontSize:14, color:"#8a9bb8", lineHeight:1.7 }}>Enter your email address and we will send you a secure reset link.</p>
            </div>
            <form onSubmit={handle}>
              <label style={{ fontSize:11.5, fontWeight:600, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>Email address</label>
              <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width:"100%", padding:"12px 16px", borderRadius:10, background:"#12121c", border:"1.5px solid rgba(255,255,255,0.10)", color:"#e8e8f0", fontSize:14, fontFamily:"inherit", marginBottom:16 }} />
              <button type="submit" disabled={loading}
                style={{ width:"100%", padding:"13px 0", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:"pointer", fontFamily:"inherit", opacity:loading?0.6:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {loading ? (
                  <><div style={{ width:16, height:16, border:"2px solid rgba(0,0,0,0.3)", borderTop:"2px solid #000", borderRadius:"50%", animation:"spin 1s linear infinite" }} /> Sending...</>
                ) : "Send Reset Link"}
              </button>
            </form>
            <div style={{ marginTop:20, padding:14, borderRadius:10, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize:12.5, fontWeight:700, color:"#e8e8f0", margin:"0 0 6px" }}>🔐 Also connected a wallet?</p>
              <p style={{ fontSize:12, color:"#8a9bb8", margin:"0 0 8px", lineHeight:1.6 }}>Your Web3 wallet is separate from your email password. Use your recovery phrase to restore wallet access.</p>
              <Link href="/register" style={{ fontSize:12.5, color:"#F0B90B", textDecoration:"none", fontWeight:600 }}>← Back to login</Link>
            </div>
            <style>{\`@keyframes spin { to { transform: rotate(360deg); } }\`}</style>
          </>
        )}
      </div>

      <p style={{ fontSize:12, color:"#8a9bb8", marginTop:24, textAlign:"center" }}>
        Remember your password?{" "}
        <Link href="/register" style={{ color:"#F0B90B", textDecoration:"none", fontWeight:600 }}>Sign In</Link>
      </p>
    </div>
  );
}
`;

fs.writeFileSync("pages/forgot-password.js", forgotPw, "utf8");
console.log("Created: pages/forgot-password.js");

// ── 2. PATCH REGISTER PAGE — Add wallet backup step ──
let reg = fs.readFileSync("pages/register.js", "utf8");

// Find Step 3 (Security) and add wallet backup warning after the 2FA section
const walletBackupSection = `
                    {/* WALLET BACKUP GUIDE */}
                    <div style={{ padding:16, borderRadius:14, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.05)", marginBottom:16 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                        <span style={{ fontSize:20 }}>🔐</span>
                        <p style={{ fontSize:13.5, fontWeight:700, color:"#F0B90B", margin:0 }}>Wallet Backup Guide</p>
                      </div>
                      <p style={{ fontSize:12, color:"#8a9bb8", margin:"0 0 10px", lineHeight:1.65 }}>
                        If you connect a Web3 wallet, protect your assets by following these steps:
                      </p>
                      {[
                        { icon:"📝", t:"Write it down", d:"Write your 12 or 24-word recovery phrase on physical paper. Never store it digitally or take a screenshot." },
                        { icon:"🔒", t:"Store securely", d:"Keep backups in a secure, fireproof location. Consider a safety deposit box for large holdings." },
                        { icon:"⚠️", t:"Never share it", d:"Your recovery phrase gives full access to your wallet. Nextoken will NEVER ask for it." },
                        { icon:"🚨", t:"Lost phrase = lost assets", d:"If you lose your recovery phrase, your crypto assets cannot be recovered by anyone — including us." },
                      ].map(item => (
                        <div key={item.t} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                          <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{item.icon}</span>
                          <div>
                            <p style={{ fontSize:12.5, fontWeight:700, color:"#e8e8f0", margin:"0 0 2px" }}>{item.t}</p>
                            <p style={{ fontSize:11.5, color:"#8a9bb8", margin:0, lineHeight:1.55 }}>{item.d}</p>
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop:10, padding:"8px 12px", borderRadius:8, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)" }}>
                        <p style={{ fontSize:12, color:"#f87171", fontWeight:600, margin:0 }}>
                          🛡 Nextoken will NEVER ask for your seed phrase, private key, or wallet password.
                        </p>
                      </div>
                    </div>`;

// Insert wallet backup before the Checkbox section in Step 3
const insertBefore = `                    <Checkbox checked={agree}`;
if (reg.includes(insertBefore)) {
  reg = reg.replace(insertBefore, walletBackupSection + "\n                    " + insertBefore.trim());
  fs.writeFileSync("pages/register.js", reg, "utf8");
  console.log("Patched: pages/register.js — wallet backup guide added to Step 3");
} else {
  console.log("WARNING: Could not find insertion point in register.js — manual edit needed");
}

console.log("\nAll done!");
console.log("- pages/forgot-password.js  ← new page");
console.log("- pages/register.js         ← patched with wallet backup");