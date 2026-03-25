import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const { token, email } = router.query;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const s = { width:"100%",background:"#161B22",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"11px 14px",fontSize:14,color:"#fff",outline:"none",fontFamily:"inherit",boxSizing:"border-box" };

  return (
    <>
      <Head><title>Reset Password — Nextoken Capital</title></Head>
      <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"#0B0E11" }}>
        <div style={{ width:"100%",maxWidth:400,background:"#0F1318",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:32 }}>
          <div style={{ textAlign:"center",marginBottom:24 }}>
            <div style={{ fontSize:24,fontWeight:900,color:"#F0B90B" }}>NXT</div>
            <div style={{ fontSize:11,color:"rgba(255,255,255,0.3)",letterSpacing:1 }}>NEXTOKEN CAPITAL</div>
          </div>

          {done ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:48,marginBottom:16 }}>✅</div>
              <h2 style={{ fontSize:18,fontWeight:800,color:"#22c55e",marginBottom:8 }}>Password Reset Successfully</h2>
              <p style={{ fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:20 }}>You can now log in with your new password.</p>
              <button onClick={() => router.push("/login")} style={{ width:"100%",padding:12,background:"#F0B90B",color:"#000",fontSize:14,fontWeight:700,border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit" }}>Go to Login</button>
            </div>
          ) : !token || !email ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:48,marginBottom:16 }}>⚠️</div>
              <h2 style={{ fontSize:18,fontWeight:800,color:"#ef4444",marginBottom:8 }}>Invalid Reset Link</h2>
              <p style={{ fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:20 }}>This link is invalid or expired. Please request a new one.</p>
              <button onClick={() => router.push("/forgot-password")} style={{ width:"100%",padding:12,background:"#F0B90B",color:"#000",fontSize:14,fontWeight:700,border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit" }}>Request New Link</button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize:18,fontWeight:800,color:"#fff",marginBottom:4 }}>Set New Password</h2>
              <p style={{ fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20 }}>Enter a new password for <strong style={{ color:"#F0B90B" }}>{email}</strong></p>

              {error && <div style={{ background:"rgba(255,77,77,0.1)",border:"1px solid rgba(255,77,77,0.2)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#ff6b6b",marginBottom:16 }}>⚠ {error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,marginBottom:6 }}>New Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} style={s} placeholder="Minimum 8 characters" />
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,marginBottom:6 }}>Confirm Password</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={s} placeholder="Repeat password" />
                </div>
                <button type="submit" disabled={loading} style={{ width:"100%",padding:13,background:"#F0B90B",color:"#000",fontSize:14,fontWeight:800,border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",opacity:loading?0.5:1 }}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
