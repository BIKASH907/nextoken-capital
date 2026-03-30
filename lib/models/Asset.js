// lib/models/Asset.js
import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
  // Basic Info
  name:          { type: String, required: true },
  ticker:        { type: String, required: true, uppercase: true }, // e.g. "VPOP"
  description:   { type: String },
  assetType:     { type: String, enum: [
    "real_estate","bond","equity","energy","fund","commodity","infrastructure","other"
  ], required: true },
  category:      { type: String }, // e.g. "Commercial", "Green", "Residential"

  // Location
  location:      { type: String }, // e.g. "Berlin, Germany"
  country:       { type: String },

  // Financial
  targetRaise:   { type: Number, required: true },  // EUR total raise target
  raisedAmount:  { type: Number, default: 0 },      // EUR raised so far
  soldUnits:     { type: Number, default: 0 },
  minInvestment: { type: Number, default: 100 },    // EUR minimum
  maxInvestment: { type: Number },                  // EUR maximum (optional)
  targetROI:     { type: Number },                  // % annual
  term:          { type: Number },                  // months
  yieldFrequency:{ type: String, enum: ["monthly","quarterly","annual","at_maturity"] },
  currency:      { type: String, default: "EUR" },

  // Token
  tokenStandard: { type: String, enum: ["ERC-3643","ERC-1400","ERC-20"], default: "ERC-3643" },
  tokenSupply:   { type: Number },
  tokenPrice:    { type: Number },                  // EUR per token
  contractAddress: { type: String, lowercase: true },
  chainId:       { type: Number, default: 1 },

  // Risk
  riskLevel:     { type: String, enum: ["low","medium","high"], default: "medium" },
  riskRating:    { type: String }, // e.g. "BBB+"

  // Status
  status:        { type: String, enum: [
    "draft",       // not yet published
    "review",      // under compliance review
    "approved",    // approved, not yet live
    "live",        // accepting investments
    "closing",     // closing soon (>80% funded)
    "closed",      // fully funded
    "completed",   // term ended, returns paid
    "cancelled",   // cancelled
  ], default: "draft" },

  // Dates
  launchDate:    { type: Date },
  closingDate:   { type: Date },
  maturityDate:  { type: Date },

  // Media
  imageUrl:      { type: String },
  documents:     [{ name: String, url: String, type: String }],

  // Compliance
  eligibility:   { type: String, enum: [
    "eu_verified","accredited","retail_verified","private_placement"
  ], default: "eu_verified" },
  isinCode:      { type: String },
  prospectusUrl: { type: String },

  // Issuer
  issuerId:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  issuerName:    { type: String },

  // Counts
  investorCount: { type: Number, default: 0 },

  // Admin
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date, default: Date.now },
});

AssetSchema.index({ status: 1 });
AssetSchema.index({ assetType: 1 });
AssetSchema.index({ ticker: 1 });

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
