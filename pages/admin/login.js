import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ROLES = {
  super_admin: { label: "Super Admin", icon: "👑" },
  compliance_admin: { label: "Compliance Admin", icon: "🪪" },
  finance_admin: { label: "Finance Admin", icon: "💰" },
  support_admin: { label: "Support Admin", icon: "💬" },
  audit: { label: "Audit / Read-Only", icon: "📋" },
};

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const login = async (e) => {
    e.preventDefault();
    if (!selectedRole) { setError("Please select your role"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      if (data.employee && data.employee.role !== selectedRole) throw new Error("Account role mismatch");
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmployee", JSON.stringify(data.employee));
      router.push("/admin");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  if (!mounted) return null;
  const inp = { width:"100%",background:"#161B22",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"11px 14px",fontSize:14,color:"#fff",outline:"none",fontFamily:"inherit",boxSizing:"border-box" };
  const lbl = { display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,marginBottom:6 };

  return (
    <>
      <Head><title>Admin Login</title></Head>
      <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"#0B0E11" }}>
        <div style={{ width:"100%",maxWidth:400,background:"#0F1318",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:32 }}>
          <div style={{ textAlign:"center",marginBottom:24 }}>
            <div style={{ fontSize:24,fontWeight:900,color:"#F0B90B" }}>NXT</div>
            <div style={{ fontSize:11,color:"rgba(255,255,255,0.3)",letterSpacing:1 }}>ADMIN PORTAL v3</div>
          </div>
          <div style={{ fontSize:20,fontWeight:800,color:"#fff",marginBottom:4 }}>Admin Sign In</div>
          <div style={{ fontSize:13,color:"rgba(255,255,255,0.38)",marginBottom:20 }}>Select role, then sign in</div>
          {error && <div style={{ background:"rgba(255,77,77,0.1)",border:"1px solid rgba(255,77,77,0.2)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#ff6b6b",marginBottom:16 }}>⚠ {error}</div>}
          <form onSubmit={login}>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Role</label>
              <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} style={{ ...inp, cursor:"pointer" }}>
                <option value="">— Select your role —</option>
                {Object.entries(ROLES).map(([k,r]) => <option key={k} value={k}>{r.icon} {r.label}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={inp} placeholder="admin@nextokencapital.com" />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={inp} placeholder="Your password" />
            </div>
            <button type="submit" disabled={loading||!selectedRole} style={{ width:"100%",padding:13,background:selectedRole?"#F0B90B":"rgba(240,185,11,0.3)",color:"#000",fontSize:14,fontWeight:800,border:"none",borderRadius:8,cursor:selectedRole?"pointer":"not-allowed",fontFamily:"inherit" }}>
              {loading ? "Signing in..." : !selectedRole ? "Select a role first" : "Sign In as " + ROLES[selectedRole].label + " →"}
            </button>
          </form>
          <div style={{ background:"rgba(240,185,11,0.06)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:"12px 14px",fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:20,lineHeight:1.6 }}>🔒 Dashboard adapts to your role. All actions logged.</div>
        </div>
      </div>
    </>
  );
}
