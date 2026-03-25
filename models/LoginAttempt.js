import mongoose from "mongoose";

const LoginAttemptSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  ip: { type: String, required: true, index: true },
  userAgent: { type: String },
  success: { type: Boolean, required: true },
  reason: { type: String },
  country: { type: String },
  device: { type: String },
  isNewDevice: { type: Boolean, default: false },
  isNewCountry: { type: Boolean, default: false },
}, { timestamps: true });

LoginAttemptSchema.index({ email: 1, createdAt: -1 });
LoginAttemptSchema.index({ ip: 1, createdAt: -1 });

export default mongoose.models.LoginAttempt || mongoose.model("LoginAttempt", LoginAttemptSchema);
