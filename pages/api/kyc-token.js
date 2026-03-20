import crypto from "crypto";

export default async function handler(req, res) {
  const SUMSUB_SECRET = process.env.SUMSUB_SECRET_KEY;
  const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN;

  const userId = "user-" + Date.now();
  const ts = Math.floor(Date.now() / 1000);

  const signature = crypto
    .createHmac("sha256", SUMSUB_SECRET)
    .update(ts.toString())
    .digest("hex");

  try {
    const response = await fetch(
      `https://api.sumsub.com/resources/accessTokens?userId=${userId}`,
      {
        method: "POST",
        headers: {
          "X-App-Token": SUMSUB_APP_TOKEN,
          "X-App-Access-Ts": ts,
          "X-App-Access-Sig": signature,
        },
      }
    );

    const data = await response.json();

    res.status(200).json({ token: data.token });
  } catch (err) {
    res.status(500).json({ error: "Failed to create token" });
  }
}