// lib/models/Investment.js  (UPDATED — replaces existing file)
import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema({
  // Relations
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assetId:         { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },

  // Asset info (snapshot at time of investment)
  assetName:       { type: String, required: true },
  assetType:       { type: String },
  ticker:          { type: String },

  // Financial
  amount:          { type: Number, required: true },  // EUR invested
  tokens:          { type: Number },                  // tokens received
  tokenPrice:      { type: Number },                  // EUR per token at time of purchase
  currency:        { type: String, default: "EUR" },
  expectedROI:     { type: Number },                  // % at time of investment
  term:            { type: Number },                  // months

  // Payment
  paymentMethod:   { type: String, enum: ["card","sepa","crypto","bank_transfer"] },
  stripePaymentId: { type: String },
  stripeSessionId: { type: String },

  // Status
  status:          { type: String, enum: [
    "pending",     // payment initiated
    "confirmed",   // payment confirmed, awaiting token mint
    "minted",      // tokens minted to wallet
    "active",      // investment active, earning yield
    "matured",     // term ended
    "redeemed",    // tokens burned, capital returned
    "failed",      // payment failed
    "refunded",    // investment refunded
  ], default: "pending" },

  // Blockchain
  walletAddress:     { type: String, lowercase: true },
  contractAddress:   { type: String, lowercase: true },
  chainId:           { type: Number, default: 1 },
  mintTxHash:        { type: String },  // token mint transaction
  paymentTxHash:     { type: String },  // on-chain payment (if crypto)

  // Returns
  yieldPaid:         { type: Number, default: 0 },   // total EUR yield paid
  yieldPayments:     [{ amount: Number, date: Date, txHash: String }],
  nextYieldDate:     { type: Date },

  // Admin
  notes:             { type: String },
  reviewedBy:        { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  reviewedAt:        { type: Date },

  createdAt:         { type: Date, default: Date.now },
  updatedAt:         { type: Date, default: Date.now },
});

InvestmentSchema.index({ userId: 1 });
InvestmentSchema.index({ assetId: 1 });
InvestmentSchema.index({ status: 1 });
InvestmentSchema.index({ walletAddress: 1 });

export default mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);
