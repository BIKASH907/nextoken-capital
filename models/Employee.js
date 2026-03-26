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
