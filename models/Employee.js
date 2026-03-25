import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["super_admin", "compliance_admin", "finance_admin", "support_admin", "audit"],
    required: true,
    default: "support_admin",
  },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String },
  isActive: { type: Boolean, default: true },
  isLocked: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lastLogin: { type: Date },
  lastLoginIp: { type: String },
  approvedIPs: [String],
  createdBy: { type: String },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
