import { connectDB } from "../../../lib/mongodb";
import SystemConfig from "../../../models/SystemConfig";
import { verifyAdmin } from "../../../lib/adminAuth";

export default async function handler(req, res) {
  await connectDB();
  const admin = await verifyAdmin(req);
  if (!admin) return res.status(404).json({ error: "Not found" });

  if (req.method === "GET") {
    let config = await SystemConfig.findOne({ key: "feature_toggles" });
    if (!config) {
      config = await SystemConfig.create({ key: "feature_toggles", value: { exchange: false, equityIpo: false, secondaryMarket: false } });
    }
    return res.json(config.value);
  }

  if (req.method === "PUT") {
    const { feature, enabled } = req.body;
    const allowed = ["exchange", "equityIpo", "secondaryMarket"];
    if (!allowed.includes(feature)) return res.status(400).json({ error: "Invalid feature" });
    
    let config = await SystemConfig.findOne({ key: "feature_toggles" });
    if (!config) config = await SystemConfig.create({ key: "feature_toggles", value: { exchange: false, equityIpo: false, secondaryMarket: false } });
    config.value[feature] = enabled;
    config.markModified("value");
    await config.save();
    return res.json({ success: true, toggles: config.value });
  }

  return res.status(405).json({ error: "Method not allowed" });
}