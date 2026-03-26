import mongoose from "mongoose";
const FeeSchema = new mongoose.Schema({
  type: { type: String, enum: ["trading","listing","management","custody","compliance","withdrawal"], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "EUR" },
  assetId: String, assetName: String,
  userId: String, userName: String,
  orderId: String, txHash: String,
  status: { type: String, enum: ["collected","pending","refunded"], default: "collected" },
}, { timestamps: true });
export default mongoose.models.Fee || mongoose.model("Fee", FeeSchema);
