import { ethers } from "ethers";
import { getSigner, getToken } from "../../../lib/blockchain";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const jwt = require("jsonwebtoken");
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try { jwt.verify(token, process.env.JWT_SECRET || "nextoken-capital-jwt-secret-2024"); }
  catch { return res.status(401).json({ error: "Invalid token" }); }

  const { contractAddress, recipient, amount } = req.body;

  if (!contractAddress || !recipient || !amount) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const signer = getSigner();
    const tokenContract = getToken(contractAddress, signer);

    // Check if recipient is whitelisted
    const isWhitelisted = await tokenContract.whitelisted(recipient);
    if (!isWhitelisted) {
      return res.status(400).json({ error: "Recipient not whitelisted. Complete KYC first." });
    }

    const tx = await tokenContract.mint(recipient, ethers.parseEther(String(amount)));
    const receipt = await tx.wait();

    return res.status(200).json({
      success: true,
      txHash: receipt.hash,
      recipient,
      amount,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Mint failed" });
  }
}
