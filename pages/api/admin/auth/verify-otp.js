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
