const fs = require("fs");

const code = `import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handle(e) {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setError("Invalid credentials. Please try again.");
  }

  return (
    <div style={{ minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif", display:"flex" }}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .spin { animation: spin 1s linear infinite; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation: fadeUp 0.35s ease both; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse { animation: pulse 2s infinite; }
        input:focus { border-color:#F0B90B !important; outline:none; }
      \`}</style>

      {/* LEFT PANEL */}
      <div style={{ width:420, flexShrink:0, background:"#0a0a12", borderRight:"1px solid rgba(255,255,255,0.07)", padding:"48px 40px", display:"flex", flexDirection:"column", justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 500px 600px at -80px 300px,rgba(240,185,11,0.09) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <Link href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none", marginBottom:48 }}>
            <span style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:900, color:"#F0B90B", letterSpacing:2 }}>NXT</span>
            <div style={{ width:1, height:22, background:"rgba(240,185,11,0.25)" }} />
            <div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:13, fontWeight:800, letterSpacing:"0.2em", color:"#F0B90B" }}>NEXTOKEN</div>
              <div style={{ fontSize:9, letterSpacing:"0.2em", color:"#8a9bb8", textTransform:"uppercase" }}>CAPITAL</div>
            </div>
          </Link>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:20, border:"1px solid rgba(240,185,11,0.25)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:24 }}>
            <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
            Regulated Platform
          </div>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:30, fontWeight:800, color:"#e8e8f0", lineHeight:1.2, margin:"0 0 14px" }}>
            Welcome back to<br /><span style={{ color:"#F0B90B" }}>Nextoken Capital</span>
          </h2>
          <p style={{ fontSize:14, color:"#8a9bb8", lineHeight:1.75, marginBottom:32 }}>
            Access your tokenized portfolio, track investments, and discover new opportunities across 180+ countries.
          </p>
          {[
            { icon:"🔒", t:"Bank-Grade Security",    d:"End-to-end encrypted. 2FA supported." },
            { icon:"🌍", t:"180+ Countries",         d:"Invest from anywhere in the world."   },
            { icon:"📈", t:"Live Portfolio",         d:"Real-time tracking of all holdings."  },
            { icon:"⚡", t:"Instant Access",         d:"Login and trade in seconds."          },
          ].map(f => (
            <div key={f.t} style={{ display:"flex", gap:12, marginBottom:16 }}>
              <span style={{ fontSize:18, flexShrink:0, marginTop:2 }}>{f.icon}</span>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", margin:"0 0 2px" }}>{f.t}</p>
                <p style={{ fontSize:12, color:"#8a9bb8", margin:0 }}>{f.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ position:"relative", zIndex:1, borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:20, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
          {[{v:"12,400+",l:"Investors"},{v:"EUR 140M+",l:"Assets"},{v:"180+",l:"Countries"}].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:800, color:"#F0B90B" }}>{s.v}</div>
              <div style={{ fontSize:11, color:"#8a9bb8" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
        <div className="fu" style={{ width:"100%", maxWidth:420 }}>
          <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, color:"#e8e8f0", margin:"0 0 6px" }}>Sign in</h1>
          <p style={{ fontSize:14, color:"#8a9bb8", marginBottom:28 }}>
            New to Nextoken?{" "}
            <Link href="/register" style={{ color:"#F0B90B", fontWeight:600, textDecoration:"none" }}>Create a free account →</Link>
          </p>

          {/* Social Login */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", color:"#b0b0c8", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px", borderRadius:10, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
              🔗 Connect Wallet
            </button>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize:12, color:"#8a9bb8" }}>or continue with email</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
          </div>

          <form onSubmit={handle}>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11.5, fontWeight:600, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>Email address</label>
              <input type="email" required placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                style={{ width:"100%", padding:"13px 16px", borderRadius:10, background:"#0d0d14", border:"1.5px solid rgba(255,255,255,0.10)", color:"#e8e8f0", fontSize:14, fontFamily:"inherit", transition:"border-color 0.15s" }} />
            </div>
            <div style={{ marginBottom:8 }}>
              <label style={{ fontSize:11.5, fontWeight:600, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:6 }}>Password</label>
              <div style={{ position:"relative" }}>
                <input type={showPw?"text":"password"} required placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                  style={{ width:"100%", padding:"13px 48px 13px 16px", borderRadius:10, background:"#0d0d14", border:"1.5px solid rgba(255,255,255,0.10)", color:"#e8e8f0", fontSize:14, fontFamily:"inherit", transition:"border-color 0.15s" }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#8a9bb8", cursor:"pointer", fontSize:17 }}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <div style={{ textAlign:"right", marginBottom:18 }}>
              <Link href="/forgot-password" style={{ fontSize:12.5, color:"#F0B90B", textDecoration:"none", fontWeight:600 }}>Forgot password?</Link>
            </div>
            {error && (
              <div style={{ padding:"12px 16px", borderRadius:10, border:"1px solid rgba(239,68,68,0.25)", background:"rgba(239,68,68,0.08)", color:"#f87171", fontSize:13, marginBottom:14 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width:"100%", padding:"14px 0", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", opacity:loading?0.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {loading ? (
                <><div className="spin" style={{ width:18, height:18, border:"2.5px solid rgba(0,0,0,0.25)", borderTop:"2.5px solid #000", borderRadius:"50%" }} /> Signing in...</>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Security note */}
          <div style={{ marginTop:20, padding:"14px 16px", borderRadius:12, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", display:"flex", gap:10 }}>
            <span style={{ fontSize:18, flexShrink:0 }}>🛡</span>
            <div>
              <p style={{ fontSize:12.5, fontWeight:700, color:"#e8e8f0", margin:"0 0 3px" }}>Secure Login</p>
              <p style={{ fontSize:12, color:"#8a9bb8", margin:0, lineHeight:1.6 }}>
                Supervised by Bank of Lithuania. Nextoken will NEVER ask for your seed phrase or private key.
              </p>
            </div>
          </div>

          {/* Footer links */}
          <div style={{ marginTop:24, display:"flex", justifyContent:"center", gap:20 }}>
            {[["Terms","/terms"],["Privacy","/privacy"],["Help","/help"]].map(([l,h]) => (
              <Link key={l} href={h} style={{ fontSize:12, color:"#8a9bb8", textDecoration:"none" }}>{l}</Link>
            ))}
          </div>
          <p style={{ textAlign:"center", fontSize:11.5, color:"#8a9bb8", marginTop:10, opacity:0.6 }}>
            © 2026 Nextoken Capital UAB · Lithuania
          </p>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync("pages/login.js", code, "utf8");
console.log("Done! pages/login.js — " + code.length + " chars");