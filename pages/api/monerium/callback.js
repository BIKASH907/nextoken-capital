// pages/api/monerium/callback.js
import connectDB from "../../../lib/db";
import User from "../../../lib/models/User";
import { getToken } from "next-auth/jwt";

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const API_BASE = MONERIUM_ENV === "production" ? "https://api.monerium.app" : "https://api.monerium.dev";

export default async function handler(req, res) {
  const { code, error: authError } = req.query;
  if (authError) return res.redirect("/dashboard/issuer?monerium=error&reason=" + encodeURIComponent(authError));
  if (!code) return res.redirect("/dashboard/issuer?monerium=error&reason=no_code");

  try {
    await connectDB();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return res.redirect("/login?redirect=/dashboard/issuer");

    let user = token.id ? await User.findById(token.id).catch(() => null) : null;
    if (!user && token.email) {
      user = await User.findOne({ email: token.email.toLowerCase() });
    }
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

    await User.findByIdAndUpdate(user._id, {
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