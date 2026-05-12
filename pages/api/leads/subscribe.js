// Lead capture endpoint with rate limiting, honeypot, and basic email validation.
import clientPromise from "../../../lib/mongodb";
import { rateLimit, getClientIp } from "../../../lib/rateLimit";

// Simple RFC-5322-ish check; sufficient for filter.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Rate limit: max 5 submissions per IP per minute.
  const ip = getClientIp(req);
  const rl = rateLimit(`leads:${ip}`, 5, 60_000);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(Math.ceil((rl.resetAt - Date.now()) / 1000)));
    return res.status(429).json({ error: "Too many submissions. Please try again shortly." });
  }

  const { email, intent, source, website } = req.body || {};

  // Honeypot: if the hidden `website` field is filled, it's a bot. Pretend success.
  if (website) return res.status(200).json({ ok: true });

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (intent && !["investor", "issuer", "institution", "partner"].includes(intent)) {
    return res.status(400).json({ error: "Invalid intent" });
  }

  const doc = {
    email: email.trim().toLowerCase().slice(0, 255),
    intent: String(intent || "unknown").slice(0, 32),
    source: String(source || "unknown").slice(0, 64),
    createdAt: new Date(),
    userAgent: String(req.headers["user-agent"] || "").slice(0, 512),
    ip,
  };

  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("leads").insertOne(doc);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[leads.subscribe] db unavailable:", e?.message);
    console.error("[leads.subscribe] received:", { ...doc, email: "***" });
    return res.status(200).json({ ok: true, persisted: false });
  }
}
