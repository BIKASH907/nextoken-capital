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
  mfaEnabled: { type: Boolean, default: false },
  mfaMethod: { type: String, default: "none" },
  mfaSecret: { type: String },
  securityAnswer: { type: String },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
