import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });
  try {
    const client = await clientPromise;
    if (!client) return res.status(500).json({ error: "DB not connected" });
    const user = await client.db().collection("users").findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    res.status(200).json({ success: true, user: { email: user.email, name: user.name } });
  } catch (e) { res.status(500).json({ error: e.message }); }
}
