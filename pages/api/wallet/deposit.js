import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Wallet from "../../../models/Wallet";
import { notify } from "../../../lib/notify";
import { getAuthUser } from "../../../lib/getUser";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await connectDB();
  const user = await getAuthUser(req, res);
  if (!user) return res.status(401).json({ error: "Please login" });

  const { amount, action, currency, method } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: "Valid amount required" });

  let wallet = await Wallet.findOne({ userId: user._id });
  if (!wallet) wallet = await Wallet.create({ userId: user._id });

  if (action === "deposit") {
    if (amount < 10) return res.status(400).json({ error: "Minimum deposit: EUR 10" });

    // Stripe payment intent
    if (method === "card" && process.env.STRIPE_SECRET_KEY) {
      try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const intent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), currency: (currency || "eur").toLowerCase(),
          metadata: { userId: user._id.toString(), type: "deposit" },
        });
        return res.json({ clientSecret: intent.client_secret, intentId: intent.id, method: "card" });
      } catch(e) { return res.status(500).json({ error: "Payment failed: " + e.message }); }
    }

    // SEPA
    if (method === "sepa") {
      return res.json({
        method: "sepa",
        bankDetails: { name: "Nextoken Capital UAB", iban: "LT60 xxxx xxxx xxxx xxxx", bic: "REVOLT21", reference: "NXT-" + user._id.toString().slice(-8).toUpperCase(), amount, currency: currency || "EUR" },
        message: "Transfer using the reference. Credited in 1-2 days.",
      });
    }

    // Direct (demo/dev)
    wallet.availableBalance += Number(amount);
    wallet.transactions.push({ type: "deposit", amount: Number(amount), status: "completed", description: "Deposit EUR " + amount + " via " + (method || "direct") });
    await wallet.save();
    await notify(user._id, "system", "Deposit Received", "EUR " + amount + " added to your wallet", "/dashboard");
    return res.json({ success: true, balance: wallet.availableBalance, message: "EUR " + amount + " deposited" });
  }

  if (action === "withdraw") {
    // 0.3% withdrawal fee (min EUR 2, max EUR 50)
    let withdrawFee = Math.round(Number(amount) * 0.003 * 100) / 100;
    if (withdrawFee < 2) withdrawFee = 2;
    if (withdrawFee > 50) withdrawFee = 50;
    const totalDeduct = Number(amount) + withdrawFee;

    if (wallet.availableBalance < totalDeduct) return res.status(400).json({ error: "Insufficient balance. Need EUR " + totalDeduct.toFixed(2) + " (EUR " + amount + " + EUR " + withdrawFee.toFixed(2) + " fee)" });
    if (amount > 5000) return res.status(400).json({ error: "Daily limit: EUR 5,000" });

    wallet.availableBalance -= totalDeduct;
    wallet.transactions.push({ type: "withdrawal", amount: -Number(amount), status: "pending", description: "Withdrawal EUR " + amount + " (fee: EUR " + withdrawFee.toFixed(2) + ", pending review)" });
    await wallet.save();

    // Credit fee to platform wallet
    try {
      const { creditPlatformWallet } = await import("../../../lib/platformWallet.mjs").catch(() => require("../../../lib/platformWallet"));
      await creditPlatformWallet(withdrawFee, "Withdrawal fee: EUR " + amount + " withdrawal", "wfee-" + Date.now(), "Withdrawal");
    } catch(e) {
      // Fallback: just record the fee
      const Fee = (await import("../../../models/Fee")).default;
      await Fee.create({ type: "withdrawal", amount: withdrawFee, userId: user._id.toString(), description: "0.3% withdrawal fee on EUR " + amount });
    }

    await notify(user._id, "system", "Withdrawal Submitted", "EUR " + amount + " withdrawal pending review (fee: EUR " + withdrawFee.toFixed(2) + ")", "/dashboard");
    return res.json({ success: true, balance: wallet.availableBalance, fee: withdrawFee, message: "Withdrawal submitted. Fee: EUR " + withdrawFee.toFixed(2) });
  }

  return res.status(400).json({ error: "Action: deposit or withdraw" });
}
