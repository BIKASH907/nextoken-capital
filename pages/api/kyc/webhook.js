
import crypto from "crypto";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { sendKycApprovedEmail, sendKycRejectedEmail } from "../../../lib/email";

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => data += chunk);
    req.on("end",  () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody  = await getRawBody(req);
  const secret   = process.env.SUMSUB_SECRET_KEY || "";
  const digest   = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = req.headers["x-payload-digest"];

  if (digest !== received) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const payload = JSON.parse(rawBody);
  const { applicantId, reviewStatus, reviewResult } = payload;

  await connectDB();
  const user = await User.findOne({ kycApplicantId: applicantId });
  if (!user) return res.status(200).end();

  if (reviewStatus === "completed" && reviewResult?.reviewAnswer === "GREEN") {
    await User.findByIdAndUpdate(user._id, { kycStatus: "approved" });
    await sendKycApprovedEmail({ email: user.email, firstName: user.firstName });
  } else if (reviewStatus === "completed" && reviewResult?.reviewAnswer === "RED") {
    await User.findByIdAndUpdate(user._id, { kycStatus: "rejected" });
    await sendKycRejectedEmail({ email: user.email, firstName: user.firstName });
  }

  return res.status(200).end();
}
