import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ROLES = {
  super_admin: { label: "Super Admin", icon: "crown" },
  compliance_admin: { label: "Compliance Admin", icon: "id" },
  finance_admin: { label: "Finance Admin", icon: "money" },
  support_admin: { label: "Support Admin", icon: "chat" },
  audit: { label: "Audit / Read-Only", icon: "list" },
};

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mothers maiden name?",
  "What was your childhood nickname?",
  "What is the name of your favorite teacher?",
  "What was the make of your first car?",
];

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // OTP flow
  const [step, setStep] = useState("credentials"); // credentials | otp | security_setup
  const [otp, setOtp] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [newSecurityQuestion, setNewSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [newSecurityAnswer, setNewSecurityAnswer] = useState("");
  const [hasSecurityQuestion, setHasSecurityQuestion] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Step 1: Submit credentials
  const submitCredentials = async (e) => {
    e.preventDefault();
    if (!selectedRole) { setError("Please select your role"); return; }
    setError(""); setLoading(true);

    try {
      // For Super Admin: send OTP first
      if (selectedRole === "super_admin") {
        const res = await fetch("/api/admin/auth/send-otp", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role: selectedRole }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");

        setHasSecurityQuestion(data.hasSecurityQuestion);
        if (data.needsSecurityQuestion) {
          setStep("security_setup");
        } else {
          setStep("otp");
        }
      } else {
        // Other roles: direct login
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
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  // Step 2: Verify OTP (+ security answer if set)
  const verifyOTP = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, securityAnswer }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.securityQuestion) setSecurityQuestion(data.securityQuestion);
        throw new Error(data.error);
      }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmployee", JSON.stringify(data.employee));
      router.push("/admin");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  // Step 2b: Set security question (first login) + verify OTP
  const setupSecurity = async (e) => {
    e.preventDefault();
    if (!newSecurityAnswer.trim()) { setError("Security answer is required"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newSecurityQuestion, newSecurityAnswer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
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

          {error && <div style={{ background:"rgba(255,77,77,0.1)",border:"1px solid rgba(255,77,77,0.2)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#ff6b6b",marginBottom:16 }}>{error}</div>}

          {/* ═══ STEP 1: Credentials ═══ */}
          {step === "credentials" && (
            <>
              <div style={{ fontSize:20,fontWeight:800,color:"#fff",marginBottom:4 }}>Admin Sign In</div>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.38)",marginBottom:20 }}>Select role, then sign in</div>
              <form onSubmit={submitCredentials}>
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>Role</label>
                  <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} style={{ ...inp, cursor:"pointer" }}>
                    <option value="">-- Select your role --</option>
                    {Object.entries(ROLES).map(([k,r]) => <option key={k} value={k}>{r.label}</option>)}
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
                  {loading ? "Verifying..." : !selectedRole ? "Select a role first" : selectedRole === "super_admin" ? "Continue (OTP will be sent)" : "Sign In as " + ROLES[selectedRole].label}
                </button>
              </form>
            </>
          )}

          {/* ═══ STEP 2: OTP + Security Answer ═══ */}
          {step === "otp" && (
            <>
              <div style={{ fontSize:20,fontWeight:800,color:"#fff",marginBottom:4 }}>Verify Your Identity</div>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.38)",marginBottom:20 }}>Enter the 6-digit code sent to <strong style={{ color:"#F0B90B" }}>{email}</strong></div>
              <form onSubmit={verifyOTP}>
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>OTP Code</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} required maxLength={6} placeholder="000000" style={{ ...inp, fontSize:24, fontWeight:800, letterSpacing:8, textAlign:"center" }} autoFocus />
                </div>
                {hasSecurityQuestion && (
                  <div style={{ marginBottom:16 }}>
                    <label style={lbl}>Security Question</label>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginBottom:8, background:"rgba(255,255,255,0.04)", padding:"8px 12px", borderRadius:6 }}>{securityQuestion || "Answer will be requested after OTP verification"}</div>
                    <input type="text" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} placeholder="Your answer" style={inp} />
                  </div>
                )}
                <button type="submit" disabled={loading || otp.length !== 6} style={{ width:"100%",padding:13,background:otp.length===6?"#F0B90B":"rgba(240,185,11,0.3)",color:"#000",fontSize:14,fontWeight:800,border:"none",borderRadius:8,cursor:otp.length===6?"pointer":"not-allowed",fontFamily:"inherit" }}>
                  {loading ? "Verifying..." : "Verify and Sign In"}
                </button>
                <button type="button" onClick={() => { setStep("credentials"); setOtp(""); setError(""); }} style={{ width:"100%", marginTop:10, padding:10, background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"rgba(255,255,255,0.4)", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Back to Login</button>
              </form>
            </>
          )}

          {/* ═══ STEP 2b: Set Security Question (first login) ═══ */}
          {step === "security_setup" && (
            <>
              <div style={{ fontSize:20,fontWeight:800,color:"#fff",marginBottom:4 }}>Set Up Security</div>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.38)",marginBottom:8 }}>First time Super Admin login. Enter OTP and set your security question.</div>
              <div style={{ background:"rgba(240,185,11,0.06)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:16,lineHeight:1.6 }}>OTP sent to <strong style={{ color:"#F0B90B" }}>{email}</strong>. This question will be asked on every login.</div>
              <form onSubmit={setupSecurity}>
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>OTP Code</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} required maxLength={6} placeholder="000000" style={{ ...inp, fontSize:24, fontWeight:800, letterSpacing:8, textAlign:"center" }} autoFocus />
                </div>
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>Security Question</label>
                  <select value={newSecurityQuestion} onChange={e => setNewSecurityQuestion(e.target.value)} style={{ ...inp, cursor:"pointer" }}>
                    {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={lbl}>Your Answer</label>
                  <input type="text" value={newSecurityAnswer} onChange={e => setNewSecurityAnswer(e.target.value)} required style={inp} placeholder="Your answer (case-insensitive)" />
                </div>
                <button type="submit" disabled={loading || otp.length !== 6 || !newSecurityAnswer.trim()} style={{ width:"100%",padding:13,background:(otp.length===6 && newSecurityAnswer.trim())?"#F0B90B":"rgba(240,185,11,0.3)",color:"#000",fontSize:14,fontWeight:800,border:"none",borderRadius:8,cursor:(otp.length===6 && newSecurityAnswer.trim())?"pointer":"not-allowed",fontFamily:"inherit" }}>
                  {loading ? "Setting up..." : "Set Security and Sign In"}
                </button>
              </form>
            </>
          )}

          <div style={{ background:"rgba(240,185,11,0.06)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:"12px 14px",fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:20,lineHeight:1.6 }}>
            {selectedRole === "super_admin" ? "Super Admin requires Email OTP + Security Question verification." : "Dashboard adapts to your role. All actions logged."}
          </div>
        </div>
      </div>
    </>
  );
}
