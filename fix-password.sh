#!/bin/bash
# Password Management: Change + Forgot + Reset
# Run: chmod +x fix-password.sh && ./fix-password.sh
set -e

echo "  🔑 Building password management..."

# ═══════════════════════════════════════
# 1. API: Change Password (logged in)
# ═══════════════════════════════════════
cat > pages/api/user/change-password.js << 'EOF'
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();

  // Check session (NextAuth for investors/issuers)
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: "Both current and new password required" });
  if (newPassword.length < 8) return res.status(400).json({ error: "New password must be at least 8 characters" });
  if (currentPassword === newPassword) return res.status(400).json({ error: "New password must be different from current" });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!user.password) return res.status(400).json({ error: "Account uses Google sign-in. Password cannot be changed." });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(401).json({ error: "Current password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 12);
  user.passwordChangedAt = new Date();
  await user.save();

  return res.json({ success: true, message: "Password changed successfully" });
}
EOF

echo "  ✓ Change password API"

# ═══════════════════════════════════════
# 2. API: Forgot Password (send reset email)
# ═══════════════════════════════════════
cat > pages/api/auth/forgot-password.js << 'EOF'
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always return success (don't reveal if email exists)
  if (!user) return res.json({ success: true, message: "If an account exists, a reset link has been sent." });

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  await user.save();

  // Build reset URL
  const baseUrl = process.env.NEXTAUTH_URL || "https://nextokencapital.com";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  // Send email via Resend (if configured)
  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Nextoken Capital <noreply@nextokencapital.com>",
          to: email,
          subject: "Reset Your Password — Nextoken Capital",
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
              <h2 style="color:#F0B90B;">Nextoken Capital</h2>
              <p>You requested a password reset. Click the link below to set a new password:</p>
              <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#F0B90B;color:#000;text-decoration:none;border-radius:8px;font-weight:700;">Reset Password</a></p>
              <p style="color:#666;font-size:13px;">This link expires in 30 minutes. If you did not request this, ignore this email.</p>
              <p style="color:#999;font-size:11px;margin-top:20px;">Nextoken Capital UAB — MiCA-compliant tokenized RWA platform</p>
            </div>
          `,
        }),
      });
    }
  } catch (err) {
    console.error("Email send error:", err);
  }

  // Log the URL in development
  if (process.env.NODE_ENV === "development") {
    console.log("Reset URL:", resetUrl);
  }

  return res.json({ success: true, message: "If an account exists, a reset link has been sent." });
}
EOF

echo "  ✓ Forgot password API"

# ═══════════════════════════════════════
# 3. API: Reset Password (using token)
# ═══════════════════════════════════════
cat > pages/api/auth/reset-password.js << 'EOF'
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();
  const { token, email, newPassword } = req.body;

  if (!token || !email || !newPassword) return res.status(400).json({ error: "All fields required" });
  if (newPassword.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    email: email.toLowerCase(),
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired reset link. Please request a new one." });

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.passwordChangedAt = new Date();
  await user.save();

  return res.json({ success: true, message: "Password reset successfully. You can now log in." });
}
EOF

echo "  ✓ Reset password API"

# ═══════════════════════════════════════
# 4. Forgot Password Page (replace existing)
# ═══════════════════════════════════════
cat > pages/forgot-password.js << 'FPEOF'
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
FPEOF

echo "  ✓ Forgot password page"

# ═══════════════════════════════════════
# 5. Reset Password Page (token link)
# ═══════════════════════════════════════
cat > pages/reset-password.js << 'RPEOF'
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
RPEOF

echo "  ✓ Reset password page"

# ═══════════════════════════════════════
# 6. Change Password Page (logged in users)
# ═══════════════════════════════════════
cat > pages/change-password.js << 'CPEOF'
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function ChangePassword() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") return null;
  if (status === "unauthenticated") { router.push("/login"); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPwd !== confirm) { setError("Passwords do not match"); return; }
    if (newPwd.length < 8) { setError("New password must be at least 8 characters"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const s = { width:"100%",background:"#161B22",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"11px 14px",fontSize:14,color:"#fff",outline:"none",fontFamily:"inherit",boxSizing:"border-box" };

  return (
    <>
      <Head><title>Change Password — Nextoken Capital</title></Head>
      <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"#0B0E11" }}>
        <div style={{ width:"100%",maxWidth:400,background:"#0F1318",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:32 }}>
          <div style={{ textAlign:"center",marginBottom:24 }}>
            <div style={{ fontSize:24,fontWeight:900,color:"#F0B90B" }}>NXT</div>
            <div style={{ fontSize:11,color:"rgba(255,255,255,0.3)",letterSpacing:1 }}>NEXTOKEN CAPITAL</div>
          </div>

          {done ? (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:48,marginBottom:16 }}>✅</div>
              <h2 style={{ fontSize:18,fontWeight:800,color:"#22c55e",marginBottom:8 }}>Password Changed</h2>
              <p style={{ fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:20 }}>Your password has been updated successfully.</p>
              <button onClick={() => router.push("/dashboard")} style={{ width:"100%",padding:12,background:"#F0B90B",color:"#000",fontSize:14,fontWeight:700,border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit" }}>Back to Dashboard</button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize:18,fontWeight:800,color:"#fff",marginBottom:4 }}>Change Password</h2>
              <p style={{ fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20 }}>
                Logged in as <strong style={{ color:"#F0B90B" }}>{session?.user?.email}</strong>
              </p>

              {error && <div style={{ background:"rgba(255,77,77,0.1)",border:"1px solid rgba(255,77,77,0.2)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#ff6b6b",marginBottom:16 }}>⚠ {error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,marginBottom:6 }}>Current Password</label>
                  <input type="password" value={current} onChange={e => setCurrent(e.target.value)} required style={s} placeholder="Your current password" />
                </div>
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,marginBottom:6 }}>New Password</label>
                  <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} required minLength={8} style={s} placeholder="Minimum 8 characters" />
                </div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,marginBottom:6 }}>Confirm New Password</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={s} placeholder="Repeat new password" />
                </div>
                <button type="submit" disabled={loading} style={{ width:"100%",padding:13,background:"#F0B90B",color:"#000",fontSize:14,fontWeight:800,border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",opacity:loading?0.5:1 }}>
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </form>
              <div style={{ textAlign:"center",marginTop:16 }}>
                <button onClick={() => router.push("/dashboard")} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>← Back to Dashboard</button>
              </div>
            </>
          )}

          <div style={{ background:"rgba(240,185,11,0.06)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:"12px 14px",fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:20,lineHeight:1.6 }}>
            🔒 Password must be at least 8 characters. Use a mix of letters, numbers, and symbols for best security.
          </div>
        </div>
      </div>
    </>
  );
}
CPEOF

echo "  ✓ Change password page"

echo ""
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║  ✅ PASSWORD MANAGEMENT COMPLETE                         ║"
echo "  ║                                                           ║"
echo "  ║  PAGES:                                                   ║"
echo "  ║    /forgot-password     — Email reset link flow           ║"
echo "  ║    /reset-password      — Set new password (token link)   ║"
echo "  ║    /change-password     — Change password (logged in)     ║"
echo "  ║                                                           ║"
echo "  ║  API ROUTES:                                              ║"
echo "  ║    POST /api/auth/forgot-password — Send reset email      ║"
echo "  ║    POST /api/auth/reset-password  — Reset with token      ║"
echo "  ║    POST /api/user/change-password — Change (logged in)    ║"
echo "  ║                                                           ║"
echo "  ║  RUN:                                                     ║"
echo "  ║    git add -A && git commit -m 'feat: password mgmt'      ║"
echo "  ║    git push && npx vercel --prod                          ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
