
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";

function sumsubSign(secret, ts, method, path, body = "") {
  const data = ts + method.toUpperCase() + path + body;
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const userId    = session.user.id;
  const appToken  = process.env.SUMSUB_APP_TOKEN;
  const secretKey = process.env.SUMSUB_SECRET_KEY;

  if (!appToken || !secretKey) {
    return res.status(500).json({ error: "Sumsub not configured" });
  }

  const ts   = Math.floor(Date.now() / 1000).toString();
  const path = "/resources/accessTokens?userId=" + userId + "&levelName=basic-kyc-level";
  const sig  = sumsubSign(secretKey, ts, "POST", path);

  try {
    const response = await fetch("https://api.sumsub.com" + path, {
      method: "POST",
      headers: {
        "X-App-Token":    appToken,
        "X-App-Access-Ts":sig,
        "X-App-Access-Sig":sig,
        "Content-Type":   "application/json",
      },
    });
    const data = await response.json();

    await connectDB();
    await User.findByIdAndUpdate(userId, {
      kycStatus:      "pending",
      kycApplicantId: userId,
    });

    return res.status(200).json({ token: data.token });
  } catch (err) {
    console.error("Sumsub token error:", err);
    return res.status(500).json({ error: "Failed to get KYC token" });
  }
}
