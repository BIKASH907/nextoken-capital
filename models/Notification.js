import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["buy_completed","sell_completed","distribution_received","kyc_approved","kyc_rejected","suspicious_activity","price_alert","system","welcome"], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });
export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
