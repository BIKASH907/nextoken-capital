import mongoose from "mongoose";
const TradeSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true, index: true },
  assetName: String,
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  buyOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "OrderBook" },
  sellOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "OrderBook" },
  units: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  buyerFee: { type: Number, default: 0 },
  sellerFee: { type: Number, default: 0 },
  txHash: String,
  matchType: { type: String, enum: ["auto","manual"], default: "auto" },
}, { timestamps: true });
TradeSchema.index({ assetId: 1, createdAt: -1 });
export default mongoose.models.Trade || mongoose.model("Trade", TradeSchema);
