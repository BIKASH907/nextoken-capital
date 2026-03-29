// pages/api/monerium/callback.js
import connectDB from "../../../lib/db";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const API_BASE = MONERIUM_ENV === "production" ? "https://api.monerium.app" : "https://api.monerium.dev";

export default async function handler(req, res) {
  const { code, error: authError } = req.query;
  if (authError) return res.redirect("/dashboard/issuer?monerium=error&reason=" + encodeURIComponent(authError));
  if (!code) return res.redirect("/dashboard/issuer?monerium=error&reason=no_code");

  try {
    await connectDB();
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.redirect("/login?redirect=/dashboard/issuer");

    const userId = session.id || session.sub || session.user?.id;
    const user = await User.findById(userId);
    if (!user) return res.redirect("/dashboard/issuer?monerium=error&reason=user_not_found");

    const redirectUri = process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URI ||
      `${process.env.NEXTAUTH_URL || "https://nextokencapital.com"}/api/monerium/callback`;

    const tokenRes = await fetch(`${API_BASE}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID,
        client_secret: process.env.MONERIUM_CLIENT_SECRET,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      console.error("Monerium token exchange failed:", await tokenRes.text());
      return res.redirect("/dashboard/issuer?monerium=error&reason=token_exchange_failed");
    }

    const tokens = await tokenRes.json();

    await User.findByIdAndUpdate(userId, {
      $set: {
        "monerium.accessToken": tokens.access_token,
        "monerium.refreshToken": tokens.refresh_token,
        "monerium.expiresAt": new Date(Date.now() + (tokens.expires_in || 3600) * 1000),
        "monerium.profileId": tokens.profile || null,
        "monerium.connectedAt": new Date(),
      },
    });

    return res.redirect("/dashboard/issuer?monerium=success");
  } catch (err) {
    console.error("Monerium callback error:", err);
    return res.redirect("/dashboard/issuer?monerium=error&reason=" + encodeURIComponent(err.message));
  }
}