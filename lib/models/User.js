
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName:    { type: String, required: true },
  lastName:     { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String },
  accountType:  { type: String, enum: ["investor","issuer"], default: "investor" },
  country:      { type: String },
  phone:        { type: String },
  dob:          { type: String },
  kycStatus:    { type: String, enum: ["none","pending","approved","rejected"], default: "none" },
  kycApplicantId: { type: String },
  role:         { type: String, enum: ["user","admin"], default: "user" },
  isActive:     { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now },
  lastLogin:    { type: Date },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
