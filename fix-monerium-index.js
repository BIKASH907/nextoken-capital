// pages/api/monerium/index.js
// GET: fetch connection status, IBANs, balances
// POST: link address, request IBAN
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const API_BASE = MONERIUM_ENV === "production" ? "https://api.monerium.app" : "https://api.monerium.dev";
const HEADERS_V2 = { Accept: "application/vnd.monerium.api-v2+json" };

async function moneriumFetch(path, token, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, ...HEADERS_V2, ...(opts.headers || {}) },
  });
  if (!res.ok) throw new Error(`Monerium ${path}: ${res.status}`);
  return res.json();
}

async function refreshToken(user) {
  if (!user.monerium?.refreshToken) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: user.monerium.refreshToken,
        client_id: process.env.MONERIUM_CLIENT_ID || process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID,
        client_secret: process.env.MONERIUM_CLIENT_SECRET,
      }),
    });
    if (!res.ok) return null;
    const tokens = await res.json();
    user.monerium.accessToken = tokens.access_token;
    user.monerium.refreshToken = tokens.refresh_token;
    user.monerium.expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
    await user.save();
    return tokens.access_token;
  } catch {
    return null;
  }
}

async function getValidToken(user) {
  if (!user.monerium?.accessToken) return null;
  if (user.monerium.expiresAt && new Date(user.monerium.expiresAt) < new Date(Date.now() + 300000)) {
    return await refreshToken(user);
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
      return res.json({ connected: false, ibans: [], balances: [], profile: null });
    }
    try {
      const [profile, ibans, balances] = await Promise.allSettled([
        moneriumFetch("/profiles", token),
        moneriumFetch("/ibans", token),
        moneriumFetch("/balances", token),
      ]);
      return res.json({
        connected: true,
        connectedAt: user.monerium?.connectedAt,
        profile: profile.status === "fulfilled" ? profile.value : null,
        ibans: ibans.status === "fulfilled" ? ibans.value : [],
        balances: balances.status === "fulfilled" ? balances.value : [],
      });
    } catch (err) {
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
          const result = await moneriumFetch("/addresses", token, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address,
              message: message || "I hereby declare that I am the address owner.",
              signature,
              chain: chain || "polygon",
            }),
          });
          return res.json({ success: true, data: result });
        }

        case "request_iban": {
          const result = await moneriumFetch("/ibans", token, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, chain: chain || "polygon" }),
          });
          await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: { "monerium.iban": result.iban, "monerium.ibanAddress": address, "monerium.ibanChain": chain || "polygon" } }
          );
          return res.json({ success: true, data: result });
        }

        case "get_orders": {
          const orders = await moneriumFetch("/orders", token);
          return res.json({ success: true, data: orders });
        }

        default:
          return res.status(400).json({ error: "Unknown action" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
