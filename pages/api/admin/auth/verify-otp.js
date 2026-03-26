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
