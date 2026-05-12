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

// ---------------------------------------------------------------------------
// Convenience aliases / additional helpers used by issuer endpoints.
// ---------------------------------------------------------------------------

// Alias so callers can `import { refreshToken } from '@/lib/monerium'`.
export const refreshToken = refreshAccessToken;

/**
 * Returns the EURe (EUR-pegged Monerium token) balance for an address.
 * Reads on-chain balance from the Polygon EURe contract.
 */
export async function getEUReBalance(address) {
  if (!address) throw new Error("getEUReBalance: address required");
  const { ethers } = await import("ethers");
  const RPC = process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-rpc.com";
  const provider = new ethers.JsonRpcProvider(RPC);
  const erc20Abi = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];
  const c = new ethers.Contract(MONERIUM_CONFIG.eurTokenPolygon, erc20Abi, provider);
  const [raw, dec] = await Promise.all([c.balanceOf(address), c.decimals().catch(() => 18)]);
  return ethers.formatUnits(raw, dec);
}

/**
 * Burn EURe at Monerium and send EUR to the user's linked bank IBAN.
 *
 * @param {string} accessToken  Monerium OAuth access token
 * @param {object} opts
 * @param {string} opts.amount   Decimal amount in EUR (string, e.g. "100.00")
 * @param {string} opts.iban     Destination IBAN
 * @param {string} [opts.memo]   Optional memo / reference
 * @returns The Monerium order response.
 */
export async function redeemToEUR(accessToken, { amount, iban, memo } = {}) {
  if (!accessToken) throw new Error("redeemToEUR: accessToken required");
  if (!amount || !iban) throw new Error("redeemToEUR: amount and iban required");
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kind: "redeem",
      amount: String(amount),
      currency: "eur",
      counterpart: { identifier: { standard: "iban", iban } },
      memo: memo || "Nextoken Capital withdrawal",
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Monerium redeem failed (${res.status}): ${errText}`);
  }
  return res.json();
}
