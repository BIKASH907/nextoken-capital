import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const s = { width:"100%",background:"#161B22",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"11px 14px",fontSize:14,color:"#fff",outline:"none",fontFamily:"inherit",boxSizing:"border-box" };

  return (
    <>
      <Head><title>Forgot Password — Nextoken Capital</title></Head>
      <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"#0B0E11" }}>
        <div style={{ width:"100%",maxWidth:400,background:"#0F1318",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:32 }}>
          <div style={{ textAlign:"center",marginBottom:24 }}>
            <div style={{ fontSize:24,fontWeight:900,color:"#F0B90B" }}>NXT</div>
            <div style={{ fontSize:11,color:"rgba(255,255,255,0.3)",letterSpacing:1 }}>NEXTOKEN CAPITAL</div>
          </div>

          {sent ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:48,marginBottom:16 }}>📧</div>
              <h2 style={{ fontSize:18,fontWeight:800,color:"#fff",marginBottom:8 }}>Check Your Email</h2>
              <p style={{ fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:20 }}>
                If an account exists for <strong style={{ color:"#F0B90B" }}>{email}</strong>, we have sent a password reset link. It expires in 30 minutes.
              </p>
              <button onClick={() => router.push("/login")} style={{ width:"100%",padding:12,background:"#F0B90B",color:"#000",fontSize:14,fontWeight:700,border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit" }}>Back to Login</button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize:18,fontWeight:800,color:"#fff",marginBottom:4 }}>Forgot Password</h2>
              <p style={{ fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20 }}>Enter your email and we will send a reset link</p>

              {error && <div style={{ background:"rgba(255,77,77,0.1)",border:"1px solid rgba(255,77,77,0.2)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#ff6b6b",marginBottom:16 }}>⚠ {error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,marginBottom:6 }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={s} placeholder="your@email.com" />
                </div>
                <button type="submit" disabled={loading} style={{ width:"100%",padding:13,background:"#F0B90B",color:"#000",fontSize:14,fontWeight:800,border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",opacity:loading?0.5:1 }}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <div style={{ textAlign:"center",marginTop:16 }}>
                <button onClick={() => router.push("/login")} style={{ background:"none",border:"none",color:"#F0B90B",fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>← Back to Login</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
