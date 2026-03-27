import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address:         { type: String, unique: true, sparse: true, lowercase: true },
  chainId:         { type: Number, default: 1 },
  chainName:       { type: String, default: "Ethereum" },
  walletType:      { type: String, enum: ["metamask","walletconnect","coinbase","ledger","other"], default: "metamask" },
  isWhitelisted:   { type: Boolean, default: false },
  whitelistedAt:   { type: Date },
  whitelistedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  whitelistTxHash: { type: String },
  isActive:        { type: Boolean, default: true },
  isPrimary:       { type: Boolean, default: false },
  label:           { type: String },
  nonce:           { type: String },
  lastUsed:        { type: Date },
  createdAt:       { type: Date, default: Date.now },
});

WalletSchema.index({ userId: 1 });
WalletSchema.index({ address: 1 }, { sparse: true });
WalletSchema.index({ isWhitelisted: 1 });

export default mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);