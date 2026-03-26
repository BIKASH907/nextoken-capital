import mongoose from "mongoose";
const OrderBookSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  assetName: String,
  side: { type: String, enum: ["bid","ask"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  units: { type: Number, required: true },
  filledUnits: { type: Number, default: 0 },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number },
  fee: { type: Number, default: 0 },
  status: { type: String, enum: ["open","partial","filled","cancelled"], default: "open" },
  matchedWith: [{ orderId: String, units: Number, price: Number, at: Date, txHash: String }],
  expiresAt: { type: Date },
}, { timestamps: true });
OrderBookSchema.index({ assetId: 1, side: 1, pricePerUnit: 1, status: 1 });
export default mongoose.models.OrderBook || mongoose.model("OrderBook", OrderBookSchema);
