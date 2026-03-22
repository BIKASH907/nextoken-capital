const fs = require("fs");

const code = `import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handle(e) {
    e.preventDefault();
    if (!email.trim() || !/\\S+@\\S+\\.\\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setSent(true);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        input:focus { border-color:#F0B90B !important; outline:none; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation: fadeUp 0.35s ease both; }
      \`}</style>

      {/* Logo */}
      <Link href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none", marginBottom:32 }}>
        <span style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:900, color:"#F0B90B", letterSpacing:2 }}>NXT</span>
        <div style={{ width:1, height:22, background:"rgba(240,185,11,0.25)" }} />
        <div>
          <div style={{ fontFamily:"Syne,sans-serif", fontSize:13, fontWeight:800, letterSpacing:"0.2em", color:"#F0B90B" }}>NEXTOKEN</div>
          <div style={{ fontSize:9, letterSpacing:"0.2em", color:"#8a9bb8", textTransform:"uppercase" }}>CAPITAL</div>
        </div>
      </Link>

      {/* Card */}
      <div className="fu" style={{ width:"100%", maxWidth:420, background:"#0d0d14", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"36px 32px" }}>

        {sent ? (
          /* ── SUCCESS STATE ── */
          <div style={{ textAlign:"center" }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(34,197,94,0.10)", border:"1px solid rgba(34,197,94,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 20px" }}>📧</div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#e8e8f0", margin:"0 0 10px" }}>Check your inbox</h2>
            <p style={{ fontSize:14, color:"#8a9bb8", lineHeight:1.7, marginBottom:20 }}>
              If an account exists for <strong style={{ color:"#F0B90B" }}>{email}</strong>, we sent a password reset link. Check your spam folder too.
            </p>
            <div style={{ padding:"14px 16px", borderRadius:12, background:"rgba(240,185,11,0.06)", border:"1px solid rgba(240,185,11,0.2)", marginBottom:20, textAlign:"left" }}>
              <p style={{ fontSize:12.5, fontWeight:700, color:"#F0B90B", margin:"0 0 5px" }}>⏱ Link expires in 30 minutes</p>
              <p style={{ fontSize:12, color:"#8a9bb8", margin:0, lineHeight:1.6 }}>For security, reset links are single-use only. Request a new one if it expires.</p>
            </div>
            <Link href="/register" style={{ display:"block", padding:"13px 0", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, textDecoration:"none", textAlign:"center", marginBottom:12 }}>
              Back to Sign In
            </Link>
            <button onClick={() => { setSent(false); setEmail(""); }}
              style={{ width:"100%", padding:"11px 0", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#8a9bb8", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
              Use a different email
            </button>
          </div>

        ) : (
          /* ── FORM STATE ── */
          <>
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:"#e8e8f0", margin:"0 0 8px" }}>Reset your password</h2>
              <p style={{ fontSize:14, color:"#8a9bb8", lineHeight:1.7 }}>Enter your email address and we will send you a secure link to reset your password.</p>
            </div>

            <form onSubmit={handle}>
              <label style={{ fontSize:11.5, fontWeight:600, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>
                Email address *
              </label>
              <input
                type="email" required
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                style={{ width:"100%", padding:"13px 16px", borderRadius:10, background:"#12121c", border:"1.5px solid "+(error?"#ef4444":"rgba(255,255,255,0.10)"), color:"#e8e8f0", fontSize:14, fontFamily:"inherit", marginBottom:8, transition:"border-color 0.15s" }}
              />
              {error && <p style={{ fontSize:12, color:"#ef4444", margin:"0 0 12px" }}>⚠ {error}</p>}

              <button type="submit" disabled={loading}
                style={{ width:"100%", padding:"13px 0", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", opacity:loading?0.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:8 }}>
                {loading ? (
                  <><div className="spin" style={{ width:18, height:18, border:"2.5px solid rgba(0,0,0,0.25)", borderTop:"2.5px solid #000", borderRadius:"50%" }} /> Sending reset link...</>
                ) : "Send Reset Link →"}
              </button>
            </form>

            {/* Wallet note */}
            <div style={{ marginTop:20, padding:"14px 16px", borderRadius:12, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", margin:"0 0 6px" }}>🔐 Connected a Web3 wallet?</p>
              <p style={{ fontSize:12.5, color:"#8a9bb8", margin:"0 0 8px", lineHeight:1.6 }}>
                Your wallet is separate from your email password. To restore wallet access, use your <strong style={{ color:"#F0B90B" }}>12 or 24-word recovery phrase</strong> — Nextoken cannot recover it for you.
              </p>
              <p style={{ fontSize:12, color:"#8a9bb8", margin:0, opacity:0.7 }}>Nextoken will NEVER ask for your seed phrase.</p>
            </div>

            <p style={{ textAlign:"center", fontSize:13, color:"#8a9bb8", marginTop:20 }}>
              Remember your password?{" "}
              <Link href="/register" style={{ color:"#F0B90B", fontWeight:600, textDecoration:"none" }}>Sign In →</Link>
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop:28, display:"flex", gap:20 }}>
        {[["Terms","/terms"],["Privacy","/privacy"],["Help","/help"]].map(([l,h]) => (
          <Link key={l} href={h} style={{ fontSize:12, color:"#8a9bb8", textDecoration:"none" }}>{l}</Link>
        ))}
      </div>
      <p style={{ fontSize:11.5, color:"#8a9bb8", marginTop:10, opacity:0.6 }}>
        © 2026 Nextoken Capital UAB · Regulated by Bank of Lithuania
      </p>
    </div>
  );
}
`;

fs.writeFileSync("pages/forgot-password.js", code, "utf8");
console.log("Done! pages/forgot-password.js — " + code.length + " chars");