import mongoose from "mongoose";

const WithdrawalWhitelistSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ["bank", "wallet"], required: true },
  address: { type: String, required: true },
  label: { type: String },
  status: { type: String, enum: ["pending", "active", "removed"], default: "pending" },
  activatesAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
  addedBy: { type: String },
}, { timestamps: true });

export default mongoose.models.WithdrawalWhitelist || mongoose.model("WithdrawalWhitelist", WithdrawalWhitelistSchema);
