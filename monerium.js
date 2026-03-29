// lib/monerium.js
// Monerium SDK wrapper for Nextoken Capital
// Handles OAuth, IBAN linking, and order placement on Polygon

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const API_BASE =
  MONERIUM_ENV === "production"
    ? "https://api.monerium.app"
    : "https://api.monerium.dev";
const APP_BASE =
  MONERIUM_ENV === "production"
    ? "https://monerium.app"
    : "https://sandbox.monerium.dev";

export const MONERIUM_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID || "",
  redirectUri:
    process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URI ||
    "http://localhost:3000/api/monerium/callback",
  apiBase: API_BASE,
  appBase: APP_BASE,
  env: MONERIUM_ENV,
  // EURe on Polygon mainnet
  eurTokenAddress: "0x18ec0A6E18E5bc3784fDd3a3634b31245ab704F6",
  chain: "polygon",
};

// ─── Server-side helpers (used in API routes) ───────────────────────────────

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
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Monerium token exchange failed: ${err}`);
  }
  return res.json(); // { access_token, refresh_token, expires_in, profile }
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
  if (!res.ok) throw new Error("Monerium token refresh failed");
  return res.json();
}

export async function getProfile(accessToken) {
  const res = await fetch(`${API_BASE}/profiles`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.monerium.api-v2+json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch Monerium profile");
  return res.json();
}

export async function getIBANs(accessToken) {
  const res = await fetch(`${API_BASE}/ibans`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.monerium.api-v2+json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch IBANs");
  return res.json();
}

export async function requestIBAN(accessToken, { address, chain = "polygon" }) {
  const res = await fetch(`${API_BASE}/ibans`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.monerium.api-v2+json",
    },
    body: JSON.stringify({ address, chain }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to request IBAN: ${err}`);
  }
  return res.json();
}

export async function linkAddress(accessToken, { address, message, signature, chain = "polygon" }) {
  const res = await fetch(`${API_BASE}/addresses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.monerium.api-v2+json",
    },
    body: JSON.stringify({ address, message, signature, chain }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to link address: ${err}`);
  }
  return res.json();
}

export async function getBalances(accessToken) {
  const res = await fetch(`${API_BASE}/balances`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.monerium.api-v2+json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch balances");
  return res.json();
}

export async function getOrders(accessToken) {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.monerium.api-v2+json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

// Generate the OAuth authorization URL
export function getAuthorizationUrl({ state, codeChallenge }) {
  const params = new URLSearchParams({
    client_id: MONERIUM_CONFIG.clientId,
    redirect_uri: MONERIUM_CONFIG.redirectUri,
    response_type: "code",
    state: state || "",
  });
  if (codeChallenge) {
    params.set("code_challenge", codeChallenge);
    params.set("code_challenge_method", "S256");
  }
  return `${API_BASE}/auth?${params.toString()}`;
}
