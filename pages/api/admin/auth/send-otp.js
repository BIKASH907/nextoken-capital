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
