import { getSigner, getToken } from "../../../lib/blockchain";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const jwt = require("jsonwebtoken");
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try { jwt.verify(token, process.env.JWT_SECRET || "nextoken-capital-jwt-secret-2024"); }
  catch { return res.status(401).json({ error: "Invalid token" }); }

  const { contractAddress, action } = req.body; // action: "pause" or "unpause"

  try {
    const signer = getSigner();
    const tokenContract = getToken(contractAddress, signer);

    let tx;
    if (action === "pause") {
      tx = await tokenContract.pause();
    } else {
      tx = await tokenContract.unpause();
    }
    const receipt = await tx.wait();

    return res.status(200).json({
      success: true,
      txHash: receipt.hash,
      action,
      paused: action === "pause",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Pause failed" });
  }
}
