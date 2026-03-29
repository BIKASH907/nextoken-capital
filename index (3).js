// pages/api/monerium/index.js
// GET: fetch connection status, IBANs, balances
// POST: link address, request IBAN, place order
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import {
  getProfile,
  getIBANs,
  getBalances,
  linkAddress,
  requestIBAN,
  refreshAccessToken,
  getOrders,
} from "../../../lib/monerium";

async function getValidToken(user) {
  if (!user.monerium?.accessToken) return null;

  // Check if token is expired (with 5-min buffer)
  if (user.monerium.expiresAt && new Date(user.monerium.expiresAt) < new Date(Date.now() + 300000)) {
    try {
      const tokens = await refreshAccessToken(user.monerium.refreshToken);
      user.monerium.accessToken = tokens.access_token;
      user.monerium.refreshToken = tokens.refresh_token;
      user.monerium.expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
      await user.save();
    } catch (e) {
      console.error("Token refresh failed:", e);
      return null;
    }
  }
  return user.monerium.accessToken;
}

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  // ─── GET: Status + IBANs + Balances ──────────────────────────
  if (req.method === "GET") {
    const token = await getValidToken(user);
    if (!token) {
      return res.json({
        connected: false,
        ibans: [],
        balances: [],
        profile: null,
      });
    }

    try {
      const [profile, ibans, balances] = await Promise.allSettled([
        getProfile(token),
        getIBANs(token),
        getBalances(token),
      ]);

      return res.json({
        connected: true,
        connectedAt: user.monerium?.connectedAt,
        profile: profile.status === "fulfilled" ? profile.value : null,
        ibans: ibans.status === "fulfilled" ? ibans.value : [],
        balances: balances.status === "fulfilled" ? balances.value : [],
      });
    } catch (err) {
      console.error("Monerium GET error:", err);
      return res.json({ connected: false, error: err.message });
    }
  }

  // ─── POST: Actions ───────────────────────────────────────────
  if (req.method === "POST") {
    const token = await getValidToken(user);
    if (!token) return res.status(401).json({ error: "Monerium not connected" });

    const { action, address, message, signature, chain } = req.body;

    try {
      switch (action) {
        case "link_address": {
          const result = await linkAddress(token, {
            address,
            message: message || "I hereby declare that I am the address owner.",
            signature,
            chain: chain || "polygon",
          });
          return res.json({ success: true, data: result });
        }

        case "request_iban": {
          const result = await requestIBAN(token, {
            address,
            chain: chain || "polygon",
          });
          // Save IBAN to user record
          await User.findOneAndUpdate(
            { email: session.user.email },
            {
              $set: {
                "monerium.iban": result.iban,
                "monerium.ibanAddress": address,
                "monerium.ibanChain": chain || "polygon",
              },
            }
          );
          return res.json({ success: true, data: result });
        }

        case "get_orders": {
          const orders = await getOrders(token);
          return res.json({ success: true, data: orders });
        }

        default:
          return res.status(400).json({ error: "Unknown action" });
      }
    } catch (err) {
      console.error("Monerium POST error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
