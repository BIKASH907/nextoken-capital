// Lead capture endpoint — appends submissions to MongoDB if available,
// otherwise logs to stderr. Returns 200 either way so the form succeeds.
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, intent, source } = req.body || {};
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Invalid email" });

  const doc = {
    email: String(email).trim().toLowerCase(),
    intent: String(intent || "unknown"),
    source: String(source || "unknown"),
    createdAt: new Date(),
    userAgent: req.headers["user-agent"] || "",
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
  };

  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("leads").insertOne(doc);
    return res.status(200).json({ ok: true });
  } catch (e) {
    // DB unavailable — don't punish the user; log and accept.
    console.error("[leads.subscribe] db unavailable:", e?.message);
    console.error("[leads.subscribe] received:", doc);
    return res.status(200).json({ ok: true, persisted: false });
  }
}
