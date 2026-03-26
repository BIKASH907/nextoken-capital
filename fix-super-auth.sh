#!/bin/bash
# Super Admin: Email OTP + Security Question + Functional Config
# Run: chmod +x fix-super-auth.sh && ./fix-super-auth.sh
set -e

echo "  🔐 Building Super Admin verification + functional config..."

# ═══════════════════════════════════════
# 1. SystemConfig Model
# ═══════════════════════════════════════
cat > models/SystemConfig.js << 'EOF'
import mongoose from "mongoose";

const SystemConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  label: { type: String },
  category: { type: String },
  updatedBy: { type: String },
  updatedByName: { type: String },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.SystemConfig || mongoose.model("SystemConfig", SystemConfigSchema);
EOF

echo "  ✓ SystemConfig model"

# ═══════════════════════════════════════
# 2. SystemConfig API
# ═══════════════════════════════════════
cat > pages/api/admin/system-config.js << 'EOF'
import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import SystemConfig from "../../../models/SystemConfig";
import { logAudit } from "../../../lib/auditLog";

const DEFAULTS = {
  daily_withdrawal_limit: { value: 5000, label: "Daily Withdrawal Limit", category: "withdrawal" },
  large_withdrawal_threshold: { value: 25000, label: "Large Withdrawal Threshold", category: "withdrawal" },
  dual_approval_threshold: { value: 10000, label: "Dual-Approval Threshold", category: "withdrawal" },
  whitelist_cooling_period: { value: 24, label: "Whitelist Cooling Period (hours)", category: "withdrawal" },
  session_timeout: { value: 15, label: "Admin Session Timeout (minutes)", category: "session" },
  max_login_attempts: { value: 5, label: "Max Login Attempts", category: "session" },
  lockout_duration: { value: 60, label: "Lockout Duration (minutes)", category: "session" },
  api_key_rotation: { value: 90, label: "API Key Rotation (days)", category: "session" },
};

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const configs = await SystemConfig.find().lean();
    const result = {};
    for (const [key, def] of Object.entries(DEFAULTS)) {
      const saved = configs.find(c => c.key === key);
      result[key] = saved ? { ...def, ...saved, value: saved.value } : { key, ...def };
    }
    return res.json({ configs: result });
  }

  if (req.method === "POST") {
    if (req.admin.role !== "super_admin") {
      return res.status(403).json({ error: "Only Super Admin can modify system configuration" });
    }

    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ error: "Key and value required" });
    if (!DEFAULTS[key]) return res.status(400).json({ error: "Invalid config key" });

    const adminId = req.admin?.sub || req.admin?.id;
    const adminName = req.admin?.firstName || req.admin?.email || "Admin";

    const old = await SystemConfig.findOne({ key });
    const oldValue = old?.value ?? DEFAULTS[key].value;

    await SystemConfig.findOneAndUpdate(
      { key },
      { value, label: DEFAULTS[key].label, category: DEFAULTS[key].category, updatedBy: adminId, updatedByName: adminName, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    await logAudit({
      action: "system_config_changed", category: "system", admin: req.admin,
      targetType: "config", targetId: key, targetName: DEFAULTS[key].label,
      statusBefore: String(oldValue), statusAfter: String(value),
      details: { key, oldValue, newValue: value },
      req, severity: "critical",
    });

    return res.json({ success: true, message: DEFAULTS[key].label + " updated to " + value });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export default requireAdmin(handler);
EOF

echo "  ✓ SystemConfig API"

# ═══════════════════════════════════════
# 3. Updated Config Page (functional edits)
# ═══════════════════════════════════════
cat > pages/admin/security/config.js << 'EOF'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "../../../components/AdminSidebar";

export default function SystemConfiguration() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);

  useEffect(() => { if (token) load(); }, [token]);

  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const load = () => {
    fetch("/api/admin/system-config", { headers }).then(r => r.json()).then(d => setConfigs(d.configs || {})).finally(() => setLoading(false));
  };

  const save = async (key) => {
    setMsg("");
    const val = isNaN(editValue) ? editValue : Number(editValue);
    const res = await fetch("/api/admin/system-config", { method: "POST", headers, body: JSON.stringify({ key, value: val }) });
    const d = await res.json();
    setMsg(res.ok ? "Saved: " + d.message : "Error: " + d.error);
    setEditing(null);
    load();
  };

  const categories = {
    withdrawal: { label: "WITHDRAWAL LIMITS", color: "#F0B90B" },
    session: { label: "SESSION AND AUTH", color: "#F0B90B" },
  };

  const formatValue = (key, val) => {
    if (["daily_withdrawal_limit", "large_withdrawal_threshold", "dual_approval_threshold"].includes(key)) return "EUR " + Number(val).toLocaleString();
    if (key === "whitelist_cooling_period") return val + " hours";
    if (key === "session_timeout" || key === "lockout_duration") return val + " minutes";
    if (key === "api_key_rotation") return val + " days";
    if (key === "max_login_attempts") return String(val);
    return String(val);
  };

  const descriptions = {
    daily_withdrawal_limit: "Per investor per day",
    large_withdrawal_threshold: "Triggers compliance review",
    dual_approval_threshold: "Requires second admin",
    whitelist_cooling_period: "After adding new destination",
    session_timeout: "Auto-logout on inactivity",
    max_login_attempts: "Before account lockout",
    lockout_duration: "Or manual Super Admin unlock",
    api_key_rotation: "Automatic key rotation period",
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0e14" }}>
      <AdminSidebar />
      <div style={{ marginLeft:240, padding:"28px 36px", flex:1, color:"#fff", maxWidth:900 }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>System Configuration</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:24 }}>Super Admin only. All changes are logged to the audit trail.</p>

        {msg && <div style={{ background:"rgba(240,185,11,0.08)", border:"1px solid rgba(240,185,11,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#F0B90B", marginBottom:16 }}>{msg}</div>}

        {loading ? <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", padding:40 }}>Loading...</div> : (
          Object.entries(categories).map(([catKey, cat]) => (
            <div key={catKey} style={{ marginBottom:28 }}>
              <div style={{ fontSize:12, fontWeight:700, color:cat.color, letterSpacing:1, marginBottom:12 }}>{cat.label}</div>
              <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                {Object.entries(configs).filter(([k, c]) => c.category === catKey).map(([key, conf], i) => (
                  <div key={key} style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600 }}>{conf.label}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{descriptions[key] || ""}</div>
                      {conf.updatedByName && <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", marginTop:4 }}>Last updated by {conf.updatedByName} at {new Date(conf.updatedAt).toLocaleString()}</div>}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      {editing === key ? (
                        <>
                          <input value={editValue} onChange={e => setEditValue(e.target.value)} style={{ width:100, background:"#0a0e14", border:"1px solid rgba(240,185,11,0.3)", borderRadius:6, padding:"6px 10px", color:"#F0B90B", fontSize:14, fontWeight:700, outline:"none", textAlign:"right", fontFamily:"inherit" }} autoFocus />
                          <button onClick={() => save(key)} style={{ padding:"5px 12px", borderRadius:5, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Save</button>
                          <button onClick={() => setEditing(null)} style={{ padding:"5px 12px", borderRadius:5, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize:16, fontWeight:700, color:"#F0B90B" }}>{formatValue(key, conf.value)}</span>
                          <button onClick={() => { setEditing(key); setEditValue(String(conf.value)); }} style={{ padding:"5px 12px", borderRadius:5, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Edit</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
EOF

echo "  ✓ Functional config page"

# ═══════════════════════════════════════
# 4. Email OTP API for Super Admin
# ═══════════════════════════════════════
cat > pages/api/admin/auth/send-otp.js << 'EOF'
import dbConnect from "../../../../lib/db";
import Employee from "../../../../models/Employee";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();
  const { email, password, role } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const employee = await Employee.findOne({ email: email.toLowerCase() });
  if (!employee) return res.status(401).json({ error: "Invalid credentials" });
  if (!employee.isActive) return res.status(403).json({ error: "Account disabled" });

  const valid = await bcrypt.compare(password, employee.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  if (role && employee.role !== role) {
    return res.status(403).json({ error: "Account role is " + employee.role + ", not " + role });
  }

  // Only Super Admin needs OTP
  if (employee.role !== "super_admin") {
    return res.status(400).json({ error: "OTP only required for Super Admin" });
  }

  // Check if security question is set
  const needsSecurityQuestion = !employee.securityQuestion || !employee.securityAnswer;

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  employee.loginOTP = otp;
  employee.loginOTPExpires = otpExpires;
  await employee.save();

  // Send OTP via Resend
  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Nextoken Capital <noreply@nextokencapital.com>",
          to: email,
          subject: "Your Login OTP - Nextoken Admin",
          html: "<div style='font-family:system-ui;max-width:400px;margin:0 auto;padding:20px'><h2 style='color:#F0B90B'>Nextoken Capital</h2><p>Your Super Admin login OTP:</p><div style='font-size:32px;font-weight:900;letter-spacing:8px;color:#F0B90B;padding:20px;background:#0F1318;border-radius:12px;text-align:center'>" + otp + "</div><p style='color:#666;font-size:13px;margin-top:16px'>Expires in 10 minutes. If you did not request this, contact security immediately.</p></div>",
        }),
      });
    }
  } catch (err) {
    console.error("OTP email error:", err);
  }

  // Log OTP in dev
  if (process.env.NODE_ENV === "development") {
    console.log("OTP for " + email + ": " + otp);
  }

  return res.json({
    success: true,
    message: "OTP sent to " + email,
    needsSecurityQuestion,
    hasSecurityQuestion: !needsSecurityQuestion,
  });
}
EOF

echo "  ✓ Email OTP API"

# ═══════════════════════════════════════
# 5. Verify OTP + Security Question API
# ═══════════════════════════════════════
cat > pages/api/admin/auth/verify-otp.js << 'EOF'
import dbConnect from "../../../../lib/db";
import Employee from "../../../../models/Employee";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();
  const { email, otp, securityAnswer, newSecurityQuestion, newSecurityAnswer } = req.body;

  if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

  const employee = await Employee.findOne({ email: email.toLowerCase() });
  if (!employee) return res.status(401).json({ error: "Invalid credentials" });

  // Verify OTP
  if (!employee.loginOTP || employee.loginOTP !== otp) {
    return res.status(401).json({ error: "Invalid OTP code" });
  }
  if (!employee.loginOTPExpires || new Date() > employee.loginOTPExpires) {
    return res.status(401).json({ error: "OTP expired. Please request a new one." });
  }

  // If setting security question for first time
  if (newSecurityQuestion && newSecurityAnswer) {
    employee.securityQuestion = newSecurityQuestion;
    employee.securityAnswer = newSecurityAnswer.toLowerCase().trim();
  }
  // If verifying existing security question
  else if (employee.securityQuestion && employee.securityAnswer) {
    if (!securityAnswer) {
      return res.status(400).json({ error: "Security answer required", securityQuestion: employee.securityQuestion });
    }
    if (securityAnswer.toLowerCase().trim() !== employee.securityAnswer) {
      return res.status(401).json({ error: "Incorrect security answer" });
    }
  }

  // Clear OTP
  employee.loginOTP = undefined;
  employee.loginOTPExpires = undefined;
  employee.lastLogin = new Date();
  employee.loginCount = (employee.loginCount || 0) + 1;
  await employee.save();

  // Generate JWT
  const token = jwt.sign(
    { id: employee._id, email: employee.email, role: employee.role, firstName: employee.firstName },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({
    token,
    employee: {
      id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      role: employee.role,
    },
  });
}
EOF

echo "  ✓ Verify OTP + Security Question API"

# ═══════════════════════════════════════
# 6. Update Employee model with OTP + Security fields
# ═══════════════════════════════════════
cat > models/Employee.js << 'EOF'
import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  role: { type: String, enum: ["super_admin", "compliance_admin", "finance_admin", "support_admin", "audit"], required: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 },

  // Email OTP
  loginOTP: { type: String },
  loginOTPExpires: { type: Date },

  // Security Question
  securityQuestion: { type: String },
  securityAnswer: { type: String },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
EOF

echo "  ✓ Employee model with OTP + security question"

# ═══════════════════════════════════════
# 7. Updated Login Page with OTP flow for Super Admin
# ═══════════════════════════════════════
cat > pages/admin/login.js << 'EOF'
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
EOF

echo "  ✓ Login page with Super Admin OTP flow"

echo ""
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║  DONE: SUPER ADMIN VERIFICATION + FUNCTIONAL CONFIG      ║"
echo "  ║                                                           ║"
echo "  ║  SUPER ADMIN LOGIN FLOW:                                  ║"
echo "  ║    1. Enter email + password                              ║"
echo "  ║    2. 6-digit OTP sent to email (10 min expiry)           ║"
echo "  ║    3. First login: Set security question + answer         ║"
echo "  ║    4. Subsequent logins: Answer security question         ║"
echo "  ║                                                           ║"
echo "  ║  OTHER ROLES: Direct login (no OTP needed)                ║"
echo "  ║                                                           ║"
echo "  ║  SYSTEM CONFIG:                                           ║"
echo "  ║    Edit buttons now functional (saves to MongoDB)         ║"
echo "  ║    Every change logged to audit trail                     ║"
echo "  ║    Shows who last updated and when                        ║"
echo "  ║                                                           ║"
echo "  ║  RUN:                                                     ║"
echo "  ║    git add -A && git commit -m 'feat: super admin auth'   ║"
echo "  ║    git push && npx vercel --prod                          ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
