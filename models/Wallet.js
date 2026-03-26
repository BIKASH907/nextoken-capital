import mongoose from "mongoose";
const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  availableBalance: { type: Number, default: 0 },
  lockedBalance: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  currency: { type: String, default: "EUR" },
  walletAddress: { type: String },
  transactions: [{
    type: { type: String, enum: ["deposit","withdrawal","buy","sell","profit_distribution","fee","refund"] },
    amount: { type: Number },
    assetId: { type: String },
    assetName: { type: String },
    txHash: { type: String },
    status: { type: String, enum: ["pending","completed","failed","cancelled"], default: "pending" },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });
export default mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
