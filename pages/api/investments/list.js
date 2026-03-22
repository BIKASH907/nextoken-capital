// pages/api/investments/list.js
import { getSession } from "../../../lib/session";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getSession(req);
  if (!session) return res.status(401).json({ error: "Not authenticated." });

  try {
    const client = await clientPromise;
    const db = client.db("nextoken");

    const investments = await db.collection("investments")
      .find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      investments: investments.map(i => ({
        id:           i._id.toString(),
        assetId:      i.assetId,
        assetName:    i.assetName,
        assetSymbol:  i.assetSymbol,
        amount:       i.amount,
        tokenPrice:   i.tokenPrice,
        quantity:     i.quantity,
        currentValue: i.currentValue,
        returns:      i.returns,
        status:       i.status,
        createdAt:    i.createdAt,
      })),
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}