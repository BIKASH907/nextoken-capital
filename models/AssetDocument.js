import mongoose from "mongoose";
const AssetDocumentSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true, index: true },
  issuerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, enum: ["photos","legal","financial","operational","compliance","technical"], required: true },
  docType: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number },
  mimeType: { type: String },
  visibility: { type: String, enum: ["public","investors_only","admin_only"], default: "admin_only" },
  status: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  reviewedBy: { type: String },
  reviewedAt: { type: Date },
  reviewNote: { type: String },
  version: { type: Number, default: 1 },
}, { timestamps: true });
AssetDocumentSchema.index({ assetId: 1, category: 1 });
export default mongoose.models.AssetDocument || mongoose.model("AssetDocument", AssetDocumentSchema);
