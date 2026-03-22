// pages/api/investments/create.js
import { getSession } from "../../../lib/session";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getSession(req);
  if (!session) return res.status(401).json({ error: "You must be logged in to invest." });

  const { assetId, assetName, assetSymbol, amount, tokenPrice, quantity } = req.body;

  if (!assetId || !amount || amount < 100) {
    return res.status(400).json({ error: "Minimum investment is EUR 100." });
  }

  // KYC gate — must be approved before investing
  if (session.kycStatus !== "approved") {
    return res.status(403).json({
      error: "KYC verification required before investing.",
      kycRequired: true,
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db("nextoken");

    const investment = {
      userId:      session.userId,
      assetId,
      assetName,
      assetSymbol: assetSymbol || assetId,
      amount:      parseFloat(amount),
      tokenPrice:  parseFloat(tokenPrice || 10),
      quantity:    parseInt(quantity || Math.floor(amount / (tokenPrice || 10))),
      status:      "active",      // active | matured | sold
      createdAt:   new Date(),
      updatedAt:   new Date(),
      returns:     0,
      currentValue: parseFloat(amount),
    };

    const result = await db.collection("investments").insertOne(investment);

    // Update user portfolio totals
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      {
        $inc: {
          "portfolio.totalInvested": parseFloat(amount),
          "portfolio.totalValue":    parseFloat(amount),
        },
        $set: { updatedAt: new Date() },
      }
    );

    return res.status(201).json({
      success: true,
      investmentId: result.insertedId.toString(),
      message: `Successfully invested €${amount} in ${assetName}.`,
    });
  } catch (e) {
    console.error("Investment error:", e);
    return res.status(500).json({ error: "Investment failed. Please try again." });
  }
}