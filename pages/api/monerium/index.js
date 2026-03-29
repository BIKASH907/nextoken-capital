// pages/api/monerium/index.js
import connectDB from "../../../lib/db";
import User from "../../../lib/models/User";
import { getToken } from "next-auth/jwt";

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const API_BASE = MONERIUM_ENV === "production" ? "https://api.monerium.app" : "https://api.monerium.dev";
const V2 = { Accept: "application/vnd.monerium.api-v2+json" };

async function mFetch(path, tok, opts = {}) {
  const r = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${tok}`, ...V2, ...(opts.headers || {}) },
  });
  if (!r.ok) throw new Error(`Monerium ${path}: ${r.status}`);
  return r.json();
}

async function getValidMoneriumToken(user) {
  if (!user.monerium?.accessToken) return null;
  if (user.monerium.expiresAt && new Date(user.monerium.expiresAt) < new Date(Date.now() + 300000)) {
    if (!user.monerium.refreshToken) return null;
    try {
      const r = await fetch(`${API_BASE}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: user.monerium.refreshToken,
          client_id: process.env.MONERIUM_CLIENT_ID || process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID,
          client_secret: process.env.MONERIUM_CLIENT_SECRET,
        }),
      });
      if (!r.ok) return null;
      const t = await r.json();
      user.monerium.accessToken = t.access_token;
      user.monerium.refreshToken = t.refresh_token;
      user.monerium.expiresAt = new Date(Date.now() + t.expires_in * 1000);
      await user.save();
      return t.access_token;
    } catch { return null; }
  }
  return user.monerium.accessToken;
}

export default async function handler(req, res) {
  await connectDB();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  let user = token.id ? await User.findById(token.id).catch(() => null) : null;
  if (!user && token.email) {
    user = await User.findOne({ email: token.email.toLowerCase() });
  }
  if (!user) return res.status(404).json({ error: "User not found" });

  if (req.method === "GET") {
    const mToken = await getValidMoneriumToken(user);
    if (!mToken) return res.json({ connected: false, ibans: [], balances: [] });
    try {
      const [ibans, balances] = await Promise.allSettled([
        mFetch("/ibans", mToken),
        mFetch("/balances", mToken),
      ]);
      return res.json({
        connected: true,
        ibans: ibans.status === "fulfilled" ? ibans.value : [],
        balances: balances.status === "fulfilled" ? balances.value : [],
      });
    } catch (err) {
      return res.json({ connected: false, error: err.message });
    }
  }

  if (req.method === "POST") {
    const mToken = await getValidMoneriumToken(user);
    if (!mToken) return res.status(401).json({ error: "Monerium not connected" });
    const { action, address, message, signature, chain } = req.body;
    try {
      if (action === "link_address") {
        const result = await mFetch("/addresses", mToken, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, message: message || "I hereby declare that I am the address owner.", signature, chain: chain || "polygon" }),
        });
        return res.json({ success: true, data: result });
      }
      if (action === "request_iban") {
        const result = await mFetch("/ibans", mToken, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, chain: chain || "polygon" }),
        });
        await User.findByIdAndUpdate(user._id, { $set: { "monerium.iban": result.iban, "monerium.ibanAddress": address } });
        return res.json({ success: true, data: result });
      }
      return res.status(400).json({ error: "Unknown action" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}