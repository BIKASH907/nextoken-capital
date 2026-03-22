
import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assetName:    { type: String, required: true },
  assetType:    { type: String },
  ticker:       { type: String },
  amount:       { type: Number, required: true },
  tokens:       { type: Number },
  tokenPrice:   { type: Number },
  currency:     { type: String, default: "EUR" },
  paymentMethod:{ type: String, enum: ["card","sepa","crypto"] },
  stripePaymentId: { type: String },
  status:       { type: String, enum: ["pending","confirmed","failed","refunded"], default: "pending" },
  createdAt:    { type: Date, default: Date.now },
});

export default mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);
