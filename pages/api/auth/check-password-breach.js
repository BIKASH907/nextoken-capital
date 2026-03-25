import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password required" });

  try {
    const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" },
    });
    const text = await response.text();

    const lines = text.split("\n");
    let breached = false;
    let count = 0;

    for (const line of lines) {
      const [hashSuffix, hashCount] = line.split(":");
      if (hashSuffix.trim() === suffix) {
        breached = true;
        count = parseInt(hashCount.trim(), 10);
        break;
      }
    }

    return res.json({ breached, count, message: breached ? `This password has appeared in ${count.toLocaleString()} data breaches. Choose a different password.` : "Password not found in any known breaches." });
  } catch (err) {
    return res.json({ breached: false, count: 0, message: "Could not check password." });
  }
}
