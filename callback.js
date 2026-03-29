// pages/api/monerium/callback.js
// Handles the OAuth redirect from Monerium after user authorizes
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { exchangeCodeForTokens } from "../../../lib/monerium";

export default async function handler(req, res) {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect("/tokenize?monerium=error&reason=" + encodeURIComponent(error));
  }

  if (!code) {
    return res.redirect("/tokenize?monerium=error&reason=no_code");
  }

  try {
    await connectDB();
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.redirect("/login?redirect=/tokenize");
    }

    // Exchange authorization code for tokens
    const redirectUri =
      process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URI ||
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/monerium/callback`;

    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // Save Monerium tokens to user record
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          "monerium.accessToken": tokens.access_token,
          "monerium.refreshToken": tokens.refresh_token,
          "monerium.expiresAt": new Date(Date.now() + tokens.expires_in * 1000),
          "monerium.profileId": tokens.profile || null,
          "monerium.connectedAt": new Date(),
        },
      }
    );

    return res.redirect("/tokenize?monerium=success");
  } catch (err) {
    console.error("Monerium callback error:", err);
    return res.redirect("/tokenize?monerium=error&reason=" + encodeURIComponent(err.message));
  }
}
