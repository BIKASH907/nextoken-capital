// pages/api/monerium/connect.js
// Redirects issuer to Monerium OAuth
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const MONERIUM_AUTH = MONERIUM_ENV === "production"
  ? "https://monerium.app"
  : "https://sandbox.monerium.dev";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.redirect("/login");

  const clientId = process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URI ||
    `${process.env.NEXTAUTH_URL || "https://nextokencapital.com"}/api/monerium/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state: req.query.issuerId || session.user.email,
  });

  return res.redirect(`${MONERIUM_AUTH}/auth?${params.toString()}`);
}