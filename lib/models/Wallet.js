// lib/models/Wallet.js
import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address:         { type: String, required: true, unique: true, lowercase: true },
  chainId:         { type: Number, default: 1 }, // 1=Ethereum, 137=Polygon, 80001=Mumbai
  chainName:       { type: String, default: "Ethereum" },
  walletType:      { type: String, enum: ["metamask","walletconnect","coinbase","ledger","other"], default: "metamask" },
  isWhitelisted:   { type: Boolean, default: false },
  whitelistedAt:   { type: Date },
  whitelistedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin who whitelisted
  whitelistTxHash: { type: String }, // on-chain tx hash
  isActive:        { type: Boolean, default: true },
  isPrimary:       { type: Boolean, default: false },
  label:           { type: String }, // user-given name e.g. "My MetaMask"
  nonce:           { type: String }, // for signature verification
  lastUsed:        { type: Date },
  createdAt:       { type: Date, default: Date.now },
});

WalletSchema.index({ userId: 1 });
WalletSchema.index({ address: 1 });
WalletSchema.index({ isWhitelisted: 1 });

export default mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
