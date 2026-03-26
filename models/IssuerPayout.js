import mongoose from "mongoose";
const IssuerPayoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  payoutMethod: { type: String, enum: ["bank","metamask","usdc","eurc","paypal"], required: true },
  // Bank (SEPA)
  bankName: String, iban: String, bic: String, accountHolder: String,
  // Crypto
  walletAddress: String, walletNetwork: { type: String, default: "polygon" },
  // PayPal
  paypalEmail: String,
  // Status
  verified: { type: Boolean, default: false },
  verifiedAt: Date,
}, { timestamps: true });
export default mongoose.models.IssuerPayout || mongoose.model("IssuerPayout", IssuerPayoutSchema);
