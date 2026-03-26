import mongoose from "mongoose";
const OrderBookSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  assetName: String,
  side: { type: String, enum: ["bid","ask"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  units: { type: Number, required: true },
  filledUnits: { type: Number, default: 0 },
  remainingUnits: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number },
  fee: { type: Number, default: 0 },
  status: { type: String, enum: ["open","partial","filled","cancelled","expired"], default: "open" },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7*24*60*60*1000) },
  trades: [{ tradeId: String, units: Number, price: Number, at: Date }],
}, { timestamps: true });
OrderBookSchema.index({ assetId: 1, side: 1, status: 1, pricePerUnit: 1 });
OrderBookSchema.index({ expiresAt: 1 });
export default mongoose.models.OrderBook || mongoose.model("OrderBook", OrderBookSchema);
