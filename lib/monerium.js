// lib/monerium.js — Monerium helper for Nextoken Capital
const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const API_BASE = MONERIUM_ENV === "production" ? "https://api.monerium.app" : "https://api.monerium.dev";

export const MONERIUM_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID || "",
  redirectUri: process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URI || "",
  apiBase: API_BASE,
  env: MONERIUM_ENV,
  eurTokenPolygon: "0x18ec0A6E18E5bc3784fDd3a3634b31245ab704F6",
  chain: "polygon",
};

export async function exchangeCodeForTokens(code, redirectUri) {
  const res = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.MONERIUM_CLIENT_ID || process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID,
      client_secret: process.env.MONERIUM_CLIENT_SECRET,
      redirect_uri: redirectUri,
    }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${await res.text()}`);
  return res.json();
}

export async function refreshAccessToken(refreshToken) {
  const res = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.MONERIUM_CLIENT_ID || process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID,
      client_secret: process.env.MONERIUM_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error("Token refresh failed");
  return res.json();
}

export function getAuthorizationUrl(state) {
  const params = new URLSearchParams({
    client_id: MONERIUM_CONFIG.clientId,
    redirect_uri: MONERIUM_CONFIG.redirectUri,
    response_type: "code",
    state: state || "nextoken",
  });
  return `${API_BASE}/auth?${params.toString()}`;
}
