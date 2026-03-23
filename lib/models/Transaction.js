// lib/models/Transaction.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  investmentId:  { type: mongoose.Schema.Types.ObjectId, ref: "Investment" },
  walletAddress: { type: String, lowercase: true },
  txHash:        { type: String, unique: true, sparse: true }, // on-chain hash
  txType:        { type: String, enum: [
    "investment",      // user invests EUR
    "token_mint",      // ERC-3643 token minted to wallet
    "token_transfer",  // token transfer between wallets
    "token_burn",      // token redeemed/burned
    "yield_payment",   // yield/return paid out
    "refund",          // investment refunded
    "fee",             // platform fee collected
    "whitelist",       // wallet whitelisted on-chain
  ], required: true },
  status: { type: String, enum: [
    "pending",    // created, not yet submitted
    "submitted",  // sent to blockchain
    "confirmed",  // mined/confirmed
    "failed",     // reverted or error
    "cancelled",  // cancelled before submission
  ], default: "pending" },
  amount:        { type: Number },           // EUR amount
  tokenAmount:   { type: Number },           // token quantity
  tokenSymbol:   { type: String },           // e.g. "VPOP"
  contractAddress: { type: String, lowercase: true },
  fromAddress:   { type: String, lowercase: true },
  toAddress:     { type: String, lowercase: true },
  chainId:       { type: Number, default: 1 },
  blockNumber:   { type: Number },
  gasUsed:       { type: String },
  gasPrice:      { type: String },
  confirmations: { type: Number, default: 0 },
  errorMessage:  { type: String },
  metadata:      { type: mongoose.Schema.Types.Mixed }, // extra data
  createdAt:     { type: Date, default: Date.now },
  confirmedAt:   { type: Date },
});

TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ txHash: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ txType: 1 });
TransactionSchema.index({ walletAddress: 1 });

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
