
import Stripe from "stripe";
import { connectDB } from "../../../lib/mongodb";
import Investment from "../../../lib/models/Investment";
import { sendInvestmentConfirmationEmail } from "../../../lib/email";
import User from "../../../lib/models/User";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = Buffer.alloc(0);
    req.on("data", chunk => { data = Buffer.concat([data, chunk]); });
    req.on("end",  () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig     = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: "Webhook signature invalid" });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    const { userId, assetName, userEmail } = pi.metadata;
    const amount = pi.amount / 100;
    const tokens = Math.floor(amount / 1.5);

    await connectDB();
    await Investment.create({
      userId,
      assetName,
      amount,
      tokens,
      tokenPrice: 1.5,
      currency:   pi.currency.toUpperCase(),
      paymentMethod: pi.payment_method_types[0] === "sepa_debit" ? "sepa" : "card",
      stripePaymentId: pi.id,
      status: "confirmed",
    });

    const user = await User.findById(userId);
    if (user) {
      await sendInvestmentConfirmationEmail({
        email:     userEmail,
        firstName: user.firstName,
        assetName,
        amount,
        tokens,
      });
    }
  }

  return res.status(200).json({ received: true });
}
