import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ROLE_INFO = {
  super_admin: { label: "Super Admin", icon: "👑", color: "#ef4444" },
  compliance_admin: { label: "Compliance Admin", icon: "🪪", color: "#8b5cf6" },
  finance_admin: { label: "Finance Admin", icon: "💰", color: "#f59e0b" },
  support_admin: { label: "Support Admin", icon: "💬", color: "#3b82f6" },
  audit: { label: "Audit / Read-Only", icon: "📋", color: "#22c55e" },
};

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmployee", JSON.stringify(data.employee));
      router.push("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Head><title>Admin Login — Nextoken Capital</title></Head>
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20, background:"#0B0E11" }}>
        <div style={{ width:"100%", maxWidth:420, background:"#0F1318", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:32 }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:24, fontWeight:900, color:"#F0B90B" }}>NXT</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:1, marginTop:2 }}>ADMIN PORTAL v3</div>
          </div>

          <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:4 }}>Admin Sign In</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.38)", marginBottom:20 }}>Role-based access — your dashboard adapts to your permissions</div>

          {/* Role badges */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
            {Object.entries(ROLE_INFO).map(([key, r]) => (
              <span key={key} style={{ fontSize:10, padding:"3px 8px", borderRadius:4, background:r.color+"15", color:r.color, border:"1px solid "+r.color+"30" }}>
                {r.icon} {r.label}
              </span>
            ))}
          </div>

          {error && (
            <div style={{ background:"rgba(255,77,77,0.1)", border:"1px solid rgba(255,77,77,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#ff6b6b", marginBottom:16 }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={login}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@nextokencapital.com" required
                style={{ width:"100%", background:"#161B22", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"11px 14px", fontSize:14, color:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required
                style={{ width:"100%", background:"#161B22", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"11px 14px", fontSize:14, color:"#fff", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width:"100%", padding:13, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", borderRadius:8, cursor:"pointer", fontFamily:"inherit", opacity: loading ? 0.5 : 1 }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={{ background:"rgba(240,185,11,0.06)", border:"1px solid rgba(240,185,11,0.15)", borderRadius:8, padding:"12px 14px", fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:20, lineHeight:1.6 }}>
            🔒 Your dashboard will automatically show only the features your role can access. All actions are logged.
          </div>
        </div>
      </div>
    </>
  );
}
