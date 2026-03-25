import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import LoginAttempt from "../../../../models/LoginAttempt";

async function handler(req, res) {
  await dbConnect();

  const { email, page = 1, limit = 50, success } = req.query;
  const filter = {};
  if (email) filter.email = email;
  if (success !== undefined) filter.success = success === "true";

  const total = await LoginAttempt.countDocuments(filter);
  const attempts = await LoginAttempt.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();

  const stats = {
    totalToday: await LoginAttempt.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    failedToday: await LoginAttempt.countDocuments({ success: false, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    uniqueIPs: (await LoginAttempt.distinct("ip", { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })).length,
    newDevices: await LoginAttempt.countDocuments({ isNewDevice: true, createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
  };

  return res.json({ attempts, total, stats, page: Number(page), pages: Math.ceil(total / limit) });
}

export default requireAdmin(handler, "compliance");
