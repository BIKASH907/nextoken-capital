import mongoose from "mongoose";
const SupportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userEmail: { type: String, required: true },
  userName: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["open","replied","closed"], default: "open" },
  adminReply: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.models.SupportTicket || mongoose.model("SupportTicket", SupportTicketSchema);
