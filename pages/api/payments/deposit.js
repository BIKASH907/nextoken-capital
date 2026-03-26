import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Wallet from "../../../models/Wallet";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const { amount, currency, method } = req.body;
  if (!amount || amount < 10) return res.status(400).json({ error: "Minimum deposit: EUR 10" });

  // Stripe card payment
  if (method === "card" && stripe) {
    try {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), currency: (currency || "eur").toLowerCase(),
        metadata: { userId: user._id.toString(), type: "deposit" },
      });
      return res.json({ clientSecret: intent.client_secret, intentId: intent.id });
    } catch(e) { return res.status(500).json({ error: "Payment failed: " + e.message }); }
  }

  // SEPA bank transfer (manual)
  if (method === "sepa") {
    return res.json({
      success: true, method: "sepa",
      bankDetails: {
        name: "Nextoken Capital UAB",
        iban: "LT60 xxxx xxxx xxxx xxxx",
        bic: "REVOLT21",
        reference: "NXT-" + user._id.toString().slice(-8).toUpperCase(),
        amount, currency: currency || "EUR",
      },
      message: "Transfer the amount using the reference. Funds credited within 1-2 business days.",
    });
  }

  // Direct wallet top-up (demo/dev mode)
  let wallet = await Wallet.findOne({ userId: user._id });
  if (!wallet) wallet = await Wallet.create({ userId: user._id });
  wallet.availableBalance += Number(amount);
  wallet.transactions.push({ type: "deposit", amount: Number(amount), status: "completed", description: "Deposit EUR " + amount + " via " + (method || "direct") });
  await wallet.save();
  return res.json({ success: true, balance: wallet.availableBalance });
}
