#!/bin/bash
# Security questions: all admins, auto-rotate, OTP to account email
# Run: chmod +x fix-security-qa.sh && ./fix-security-qa.sh
set -e

echo "  🔐 Building security questions for all admins..."

# ═══════════════════════════════════════
# 1. Update Employee model with multiple Q&A
# ═══════════════════════════════════════
cat > models/Employee.js << 'EOF'
import mongoose from "mongoose";

const SecurityQASchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { _id: false });

const EmployeeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  role: { type: String, enum: ["super_admin", "compliance_admin", "finance_admin", "support_admin", "audit"], required: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 },

  // Multiple security questions (all set on first login)
  securityQuestions: [SecurityQASchema],
  securitySetupDone: { type: Boolean, default: false },

  // Which question index was last asked (for rotation)
  lastQuestionIndex: { type: Number, default: -1 },

  // Email OTP
  loginOTP: { type: String },
  loginOTPExpires: { type: Date },

  // Legacy fields (keep for backward compat)
  securityQuestion: { type: String },
  securityAnswer: { type: String },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
EOF

echo "  ✓ Employee model with multiple security questions"

# ═══════════════════════════════════════
# 2. Updated send-otp API (all admins get OTP)
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

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  employee.loginOTP = otp;
  employee.loginOTPExpires = otpExpires;

  // Pick next question (auto-rotate)
  let currentQuestion = null;
  let currentQuestionIndex = -1;
  if (employee.securitySetupDone && employee.securityQuestions?.length > 0) {
    currentQuestionIndex = ((employee.lastQuestionIndex ?? -1) + 1) % employee.securityQuestions.length;
    employee.lastQuestionIndex = currentQuestionIndex;
    currentQuestion = employee.securityQuestions[currentQuestionIndex].question;
  }

  await employee.save();

  // Send OTP via Resend to the employee email
  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Nextoken Capital <noreply@nextokencapital.com>",
          to: employee.email,
          subject: "Login OTP - Nextoken Admin",
          html: "<div style='font-family:system-ui;max-width:400px;margin:0 auto;padding:20px'><h2 style='color:#F0B90B'>Nextoken Capital</h2><p>Your admin login OTP:</p><div style='font-size:32px;font-weight:900;letter-spacing:8px;color:#F0B90B;padding:20px;background:#0F1318;border-radius:12px;text-align:center'>" + otp + "</div><p style='color:#666;font-size:13px;margin-top:16px'>Expires in 10 minutes. Do not share this code.</p></div>",
        }),
      });
    }
  } catch (err) {
    console.error("OTP email error:", err);
  }

  if (process.env.NODE_ENV === "development") {
    console.log("OTP for " + email + ": " + otp);
  }

  return res.json({
    success: true,
    message: "OTP sent to " + employee.email,
    needsSecuritySetup: !employee.securitySetupDone,
    securityQuestion: currentQuestion,
    questionIndex: currentQuestionIndex,
  });
}
EOF

echo "  ✓ Send OTP API (all admins, auto-rotate question)"

# ═══════════════════════════════════════
# 3. Updated verify-otp API
# ═══════════════════════════════════════
cat > pages/api/admin/auth/verify-otp.js << 'EOF'
import dbConnect from "../../../../lib/db";
import Employee from "../../../../models/Employee";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();
  const { email, otp, securityAnswer, securityQuestions } = req.body;

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

  // FIRST LOGIN: Set all security questions
  if (!employee.securitySetupDone && securityQuestions) {
    if (!Array.isArray(securityQuestions) || securityQuestions.length < 3) {
      return res.status(400).json({ error: "At least 3 security questions required" });
    }
    for (const qa of securityQuestions) {
      if (!qa.question || !qa.answer || !qa.answer.trim()) {
        return res.status(400).json({ error: "All questions must have answers" });
      }
    }
    employee.securityQuestions = securityQuestions.map(qa => ({
      question: qa.question,
      answer: qa.answer.toLowerCase().trim(),
    }));
    employee.securitySetupDone = true;
    employee.lastQuestionIndex = -1;
  }
  // SUBSEQUENT LOGIN: Verify security answer
  else if (employee.securitySetupDone && employee.securityQuestions?.length > 0) {
    if (!securityAnswer) {
      return res.status(400).json({ error: "Security answer required" });
    }
    const qIndex = employee.lastQuestionIndex ?? 0;
    const expected = employee.securityQuestions[qIndex]?.answer;
    if (!expected || securityAnswer.toLowerCase().trim() !== expected) {
      return res.status(401).json({ error: "Incorrect security answer" });
    }
  }

  // Clear OTP
  employee.loginOTP = undefined;
  employee.loginOTPExpires = undefined;
  employee.lastLogin = new Date();
  employee.loginCount = (employee.loginCount || 0) + 1;
  await employee.save();

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

echo "  ✓ Verify OTP API (setup + rotate)"

# ═══════════════════════════════════════
# 4. Updated login API (non-OTP roles still work)
# ═══════════════════════════════════════
# Keep existing login.js for non-OTP roles (unchanged)

# ═══════════════════════════════════════
# 5. Updated Login Page (all admins get OTP)
# ═══════════════════════════════════════
cat > pages/admin/login.js << 'EOF'
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ROLES = {
  super_admin: { label: "Super Admin" },
  compliance_admin: { label: "Compliance Admin" },
  finance_admin: { label: "Finance Admin" },
  support_admin: { label: "Support Admin" },
  audit: { label: "Audit / Read-Only" },
};

const ALL_QUESTIONS = [
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

  // Steps: credentials | otp | setup
  const [step, setStep] = useState("credentials");
  const [otp, setOtp] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  // First-time setup: all 6 answers
  const [answers, setAnswers] = useState(ALL_QUESTIONS.map(() => ""));

  useEffect(() => { setMounted(true); }, []);

  const submitCredentials = async (e) => {
    e.preventDefault();
    if (!selectedRole) { setError("Please select your role"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/send-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.needsSecuritySetup) {
        setStep("setup");
      } else {
        setSecurityQuestion(data.securityQuestion || "");
        setStep("otp");
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, securityAnswer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmployee", JSON.stringify(data.employee));
      router.push("/admin");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const setupSecurity = async (e) => {
    e.preventDefault();
    const filled = answers.filter(a => a.trim());
    if (filled.length < 6) { setError("Please answer ALL 6 security questions"); return; }
    setError(""); setLoading(true);
    try {
      const securityQuestions = ALL_QUESTIONS.map((q, i) => ({ question: q, answer: answers[i] }));
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, securityQuestions }),
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
        <div style={{ width:"100%",maxWidth:440,background:"#0F1318",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:32 }}>
          <div style={{ textAlign:"center",marginBottom:24 }}>
            <div style={{ fontSize:24,fontWeight:900,color:"#F0B90B" }}>NXT</div>
            <div style={{ fontSize:11,color:"rgba(255,255,255,0.3)",letterSpacing:1 }}>ADMIN PORTAL v3</div>
          </div>

          {error && <div style={{ background:"rgba(255,77,77,0.1)",border:"1px solid rgba(255,77,77,0.2)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#ff6b6b",marginBottom:16 }}>{error}</div>}

          {/* ═══ STEP 1: Credentials ═══ */}
          {step === "credentials" && (
            <>
              <div style={{ fontSize:20,fontWeight:800,color:"#fff",marginBottom:4 }}>Admin Sign In</div>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.38)",marginBottom:20 }}>All admin logins require Email OTP + Security Question</div>
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
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={inp} placeholder="your@email.com" />
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={lbl}>Password</label>
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={inp} />
                </div>
                <button type="submit" disabled={loading||!selectedRole} style={{ width:"100%",padding:13,background:selectedRole?"#F0B90B":"rgba(240,185,11,0.3)",color:"#000",fontSize:14,fontWeight:800,border:"none",borderRadius:8,cursor:selectedRole?"pointer":"not-allowed",fontFamily:"inherit" }}>
                  {loading ? "Verifying..." : !selectedRole ? "Select a role" : "Continue (OTP will be sent)"}
                </button>
              </form>
            </>
          )}

          {/* ═══ STEP 2: OTP + Security Question (rotating) ═══ */}
          {step === "otp" && (
            <>
              <div style={{ fontSize:20,fontWeight:800,color:"#fff",marginBottom:4 }}>Verify Your Identity</div>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.38)",marginBottom:20 }}>OTP sent to <strong style={{ color:"#F0B90B" }}>{email}</strong></div>
              <form onSubmit={verifyOTP}>
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>OTP Code (6 digits)</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} required maxLength={6} placeholder="000000" style={{ ...inp, fontSize:24, fontWeight:800, letterSpacing:8, textAlign:"center" }} autoFocus />
                </div>
                {securityQuestion && (
                  <div style={{ marginBottom:16 }}>
                    <label style={lbl}>Security Question</label>
                    <div style={{ fontSize:14, color:"#F0B90B", marginBottom:8, background:"rgba(240,185,11,0.06)", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(240,185,11,0.15)", fontWeight:600 }}>{securityQuestion}</div>
                    <input type="text" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} required placeholder="Your answer (case-insensitive)" style={inp} />
                  </div>
                )}
                <button type="submit" disabled={loading || otp.length !== 6 || (securityQuestion && !securityAnswer.trim())} style={{ width:"100%",padding:13,background:(otp.length===6)?"#F0B90B":"rgba(240,185,11,0.3)",color:"#000",fontSize:14,fontWeight:800,border:"none",borderRadius:8,cursor:(otp.length===6)?"pointer":"not-allowed",fontFamily:"inherit" }}>
                  {loading ? "Verifying..." : "Verify and Sign In"}
                </button>
                <button type="button" onClick={() => { setStep("credentials"); setOtp(""); setSecurityAnswer(""); setError(""); }} style={{ width:"100%",marginTop:10,padding:10,background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"rgba(255,255,255,0.4)",fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>Back to Login</button>
              </form>
            </>
          )}

          {/* ═══ STEP 2b: First-time Security Setup (ALL 6 questions) ═══ */}
          {step === "setup" && (
            <>
              <div style={{ fontSize:20,fontWeight:800,color:"#fff",marginBottom:4 }}>Security Setup</div>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.38)",marginBottom:8 }}>First login: Enter OTP and set ALL security answers.</div>
              <div style={{ background:"rgba(240,185,11,0.06)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:16,lineHeight:1.6 }}>
                OTP sent to <strong style={{ color:"#F0B90B" }}>{email}</strong>. A random question will be asked each login.
              </div>
              <form onSubmit={setupSecurity}>
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>OTP Code</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} required maxLength={6} placeholder="000000" style={{ ...inp, fontSize:20, fontWeight:800, letterSpacing:6, textAlign:"center" }} autoFocus />
                </div>

                <div style={{ fontSize:12, fontWeight:700, color:"#F0B90B", marginBottom:10 }}>SET YOUR SECURITY ANSWERS</div>
                <div style={{ maxHeight:300, overflowY:"auto", marginBottom:16 }}>
                  {ALL_QUESTIONS.map((q, i) => (
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:4 }}>{i+1}. {q}</div>
                      <input type="text" value={answers[i]} onChange={e => { const a = [...answers]; a[i] = e.target.value; setAnswers(a); }} required placeholder="Your answer" style={{ ...inp, fontSize:13, padding:"8px 12px" }} />
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading || otp.length !== 6 || answers.some(a => !a.trim())} style={{ width:"100%",padding:13,background:(otp.length===6 && answers.every(a=>a.trim()))?"#F0B90B":"rgba(240,185,11,0.3)",color:"#000",fontSize:14,fontWeight:800,border:"none",borderRadius:8,cursor:(otp.length===6 && answers.every(a=>a.trim()))?"pointer":"not-allowed",fontFamily:"inherit" }}>
                  {loading ? "Setting up..." : "Save Security Answers and Sign In"}
                </button>
                <button type="button" onClick={() => { setStep("credentials"); setOtp(""); setError(""); }} style={{ width:"100%",marginTop:10,padding:10,background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"rgba(255,255,255,0.4)",fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>Back</button>
              </form>
            </>
          )}

          <div style={{ background:"rgba(240,185,11,0.06)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:"12px 14px",fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:20,lineHeight:1.6 }}>
            All admin logins require Email OTP + Security Question. Questions rotate automatically each login.
          </div>
        </div>
      </div>
    </>
  );
}
EOF

echo "  ✓ Login page (all admins, setup + rotate)"

# ═══════════════════════════════════════
# 6. Set your pre-defined answers in MongoDB
# ═══════════════════════════════════════
node -r ./dns-fix.js -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://bikash_user2:Nextoken2024@cluster0.zbufj2k.mongodb.net/nextoken').then(async () => {
  await mongoose.connection.db.collection('employees').updateOne(
    { email: 'bikash@nextokencapital.com' },
    { \$set: {
      securityQuestions: [
        { question: 'What was the name of your first pet?', answer: 'sheru' },
        { question: 'What city were you born in?', answer: 'tikapur' },
        { question: 'What is your mothers maiden name?', answer: 'devi' },
        { question: 'What was your childhood nickname?', answer: 'bird' },
        { question: 'What is the name of your favorite teacher?', answer: 'bird' },
        { question: 'What was the make of your first car?', answer: 'nocar' },
      ],
      securitySetupDone: true,
      lastQuestionIndex: -1,
    }}
  );
  const emp = await mongoose.connection.db.collection('employees').findOne({ email: 'bikash@nextokencapital.com' });
  console.log('Set', emp?.securityQuestions?.length, 'questions for', emp?.email);
  process.exit(0);
});
"

echo ""
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║  DONE: SECURITY QUESTIONS FOR ALL ADMINS                  ║"
echo "  ║                                                           ║"
echo "  ║  ALL ADMINS:                                              ║"
echo "  ║    Step 1: Email + Password → OTP sent to their email    ║"
echo "  ║    Step 2 (first login): Set ALL 6 security answers       ║"
echo "  ║    Step 3 (future): OTP + random rotating question        ║"
echo "  ║                                                           ║"
echo "  ║  YOUR ANSWERS (pre-set):                                  ║"
echo "  ║    1. First pet → sheru                                   ║"
echo "  ║    2. City born → tikapur                                 ║"
echo "  ║    3. Mothers maiden name → devi                          ║"
echo "  ║    4. Childhood nickname → bird                           ║"
echo "  ║    5. Favorite teacher → bird                             ║"
echo "  ║    6. First car → nocar                                   ║"
echo "  ║                                                           ║"
echo "  ║  ROTATION: Different question each login automatically    ║"
echo "  ║                                                           ║"
echo "  ║  NEW ADMINS: Must set all 6 answers on first login        ║"
echo "  ║  OTP: Sent to the email set when account was created      ║"
echo "  ║                                                           ║"
echo "  ║  RUN:                                                     ║"
echo "  ║    git add -A && git commit -m 'feat: security qa'        ║"
echo "  ║    git push && npx vercel --prod                          ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
