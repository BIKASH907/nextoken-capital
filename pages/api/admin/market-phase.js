import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Asset from "../../../lib/models/Asset";
import { logAudit } from "../../../lib/auditLog";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const assets = await Asset.find().select("name marketPhase soldUnits tokenSupply status approvalStatus lastTradedPrice discoveryPrice").lean();
    return res.json({ assets });
  }

  if (req.method === "POST") {
    const { assetId, phase } = req.body;
    if (!assetId || !phase) return res.status(400).json({ error: "assetId and phase required" });
    if (!["primary_active","price_discovery","secondary_active"].includes(phase)) return res.status(400).json({ error: "Invalid phase" });

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ error: "Not found" });

    const oldPhase = asset.marketPhase;
    asset.marketPhase = phase;
    if (phase === "secondary_active") asset.tradingStartDate = new Date();
    await asset.save();

    await logAudit({ action: "market_phase_change", category: "system", admin: req.admin, targetType: "asset", targetId: assetId, details: { from: oldPhase, to: phase }, req, severity: "critical" });

    return res.json({ success: true, message: asset.name + ": " + oldPhase + " → " + phase });
  }
  return res.status(405).end();
}
export default requireAdmin(handler);
