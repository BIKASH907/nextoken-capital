// pages/api/kyc/token.js
// Generates a Sumsub access token for the Web SDK
// Called by the /kyc page to initialize the Sumsub widget

import crypto from "crypto";
const { getSession } = require("../../../lib/session");
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";


const SUMSUB_APP_TOKEN  = process.env.SUMSUB_APP_TOKEN;
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;
const SUMSUB_LEVEL_NAME = process.env.SUMSUB_LEVEL_NAME || "basic-kyc-level";
const SUMSUB_BASE_URL   = "https://api.sumsub.com";

// Generate HMAC-SHA256 signature required by Sumsub
function createSignature(ts, method, url, body) {
  const dataToSign = ts + method.toUpperCase() + url + (body ? JSON.stringify(body) : "");
  return crypto
    .createHmac("sha256", SUMSUB_SECRET_KEY)
    .update(dataToSign)
    .digest("hex");
}

async function sumsubRequest(method, url, body = null) {
  const ts = Math.floor(Date.now() / 1000).toString();
  const signature = createSignature(ts, method, url, body);

  const headers = {
    "Accept":           "application/json",
    "Content-Type":     "application/json",
    "X-App-Token":      SUMSUB_APP_TOKEN,
    "X-App-Access-Sig": signature,
    "X-App-Access-Ts":  ts,
  };

  const res = await fetch(SUMSUB_BASE_URL + url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.description || data.message || "Sumsub API error");
  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Must be logged in
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: "Not authenticated. Please log in first." });

  try {
    const userId = session.userId;

    // Get user from DB to use their email as externalUserId
    await connectDB();
  const user = await User.findById(session.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Use userId as the external user ID in Sumsub
    const externalUserId = userId;

    // Create applicant in Sumsub (idempotent — safe to call multiple times)
    let applicantId = user.sumsubApplicantId;
    if (!applicantId) {
      const applicant = await sumsubRequest("POST", "/resources/applicants?levelName=" + SUMSUB_LEVEL_NAME, {
        externalUserId,
        email: user.email,
        fixedInfo: {
          firstName: user.firstName,
          lastName:  user.lastName,
          country:   user.country || undefined,
          dob:       user.dob || undefined,
        },
      });
      applicantId = applicant.id;

      // Save applicant ID to user record
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { sumsubApplicantId: applicantId, updatedAt: new Date() } }
      );
    }

    // Generate access token for the Web SDK
    const tokenData = await sumsubRequest(
      "POST",
      `/resources/accessTokens?userId=${externalUserId}&levelName=${SUMSUB_LEVEL_NAME}`
    );

    return res.status(200).json({
      token:       tokenData.token,
      userId:      externalUserId,
      applicantId,
      levelName:   SUMSUB_LEVEL_NAME,
    });
  } catch (e) {
    console.error("Sumsub token error:", e.message);
    return res.status(500).json({ error: "KYC service unavailable: " + e.message });
  }
}