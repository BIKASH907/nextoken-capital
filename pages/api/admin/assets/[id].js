// pages/api/admin/assets/[id].js — edit, delete, publish single asset
import { connectDB } from "../../../../lib/mongodb";
import Asset from "../../../../lib/models/Asset";
import { requireAdmin } from "../../../../lib/adminAuth";

async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  // GET single
  if (req.method === "GET") {
    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    return res.status(200).json({ asset });
  }

  // PUT — update
  if (req.method === "PUT") {
    const asset = await Asset.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    return res.status(200).json({ asset });
  }

  // PATCH — publish/unpublish/status change
  if (req.method === "PATCH") {
    const { status, contractAddress } = req.body;
    const update = { updatedAt: new Date() };
    if (status) {
      update.status = status;
      if (status === "live") update.launchDate = new Date();
    }
    if (contractAddress) update.contractAddress = contractAddress.toLowerCase();
    const asset = await Asset.findByIdAndUpdate(id, update, { new: true });
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    return res.status(200).json({ asset });
  }

  // DELETE
  if (req.method === "DELETE") {
    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    if (asset.status === "live" || asset.status === "closing") {
      return res.status(400).json({ error: "Cannot delete a live asset. Close it first." });
    }
    await Asset.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).end();
}

export default requireAdmin(handler, "operations");
