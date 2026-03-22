
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.kycStatus !== "approved") {
    return res.status(403).json({ error: "KYC verification required before investing" });
  }

  const { amount, currency = "eur", assetName, paymentMethod = "card" } = req.body;
  if (!amount || amount < 100) {
    return res.status(400).json({ error: "Minimum investment is EUR 100" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(amount * 100),
      currency,
      payment_method_types: paymentMethod === "sepa" ? ["sepa_debit"] : ["card"],
      metadata: {
        userId:    session.user.id,
        assetName,
        userEmail: session.user.email,
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: "Payment setup failed" });
  }
}
