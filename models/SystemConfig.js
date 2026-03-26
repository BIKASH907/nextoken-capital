import mongoose from "mongoose";

const SystemConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  label: { type: String },
  category: { type: String },
  updatedBy: { type: String },
  updatedByName: { type: String },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.SystemConfig || mongoose.model("SystemConfig", SystemConfigSchema);
