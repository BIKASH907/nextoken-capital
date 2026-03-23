// lib/models/Employee.js
import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  firstName:   { type: String, required: true },
  lastName:    { type: String, required: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: [
    "super_admin",    // full access — everything
    "admin",          // full access except creating other admins
    "compliance",     // KYC review, AML, user management
    "operations",     // asset management, investments
    "support",        // view-only users + investments, can leave notes
    "finance",        // view transactions, generate reports
  ], default: "support" },

  // Granular permissions (override role defaults)
  permissions: {
    users:        { view: Boolean, edit: Boolean, ban: Boolean },
    investments:  { view: Boolean, create: Boolean, edit: Boolean, delete: Boolean },
    assets:       { view: Boolean, create: Boolean, edit: Boolean, delete: Boolean, publish: Boolean },
    kyc:          { view: Boolean, approve: Boolean, reject: Boolean },
    transactions: { view: Boolean, refund: Boolean },
    blockchain:   { view: Boolean, whitelist: Boolean, mint: Boolean },
    employees:    { view: Boolean, create: Boolean, edit: Boolean, delete: Boolean },
    reports:      { view: Boolean, export: Boolean },
  },

  isActive:    { type: Boolean, default: true },
  department:  { type: String },
  phone:       { type: String },
  avatar:      { type: String },
  notes:       { type: String },

  lastLogin:   { type: Date },
  loginCount:  { type: Number, default: 0 },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
});

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
