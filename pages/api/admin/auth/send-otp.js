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
          to: employee.notificationEmail || email,
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
