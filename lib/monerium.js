// lib/monerium.js
// Monerium API Integration with OAuth for Nextoken Capital
// Handles: OAuth flow, account linking, IBAN, EURe minting/redemption

const MONERIUM_API = process.env.MONERIUM_ENV === 'production'
  ? 'https://api.monerium.app'
  : 'https://api.monerium.dev';

const MONERIUM_AUTH = process.env.MONERIUM_ENV === 'production'
  ? 'https://monerium.app'
  : 'https://sandbox.monerium.dev';

// ─── OAuth ──────────────────────────────────────────────────

/**
 * Generate OAuth authorization URL for issuer to connect Monerium
 * Redirect issuer to this URL — they log in / sign up on Monerium
 * Then Monerium redirects back to your callback URL with a code
 */
function getOAuthURL(state) {
  const params = new URLSearchParams({
    client_id: process.env.MONERIUM_CLIENT_ID,
    redirect_uri: process.env.MONERIUM_REDIRECT_URI,
    response_type: 'code',
    scope: 'orders:read orders:write accounts:read',
    state: state, // Pass issuerId or session token
  });
  return `${MONERIUM_AUTH}/authorize?${params.toString()}`;
}

/**
 * Exchange OAuth code for access token
 * Called in your callback route after Monerium redirects back
 */
async function exchangeCode(code) {
  const res = await fetch(`${MONERIUM_API}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.MONERIUM_CLIENT_ID,
      client_secret: process.env.MONERIUM_CLIENT_SECRET,
      redirect_uri: process.env.MONERIUM_REDIRECT_URI,
      code,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  return data; // { access_token, refresh_token, expires_in, profile }
}

/**
 * Refresh an expired token
 */
async function refreshToken(refresh_token) {
  const res = await fetch(`${MONERIUM_API}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.MONERIUM_CLIENT_ID,
      client_secret: process.env.MONERIUM_CLIENT_SECRET,
      refresh_token,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Refresh failed: ${JSON.stringify(data)}`);
  return data;
}

// ─── Client Credentials (for server-side calls) ────────────

let serverToken = null;
let serverTokenExpiry = 0;

async function getServerToken() {
  if (serverToken && Date.now() < serverTokenExpiry) return serverToken;

  const res = await fetch(`${MONERIUM_API}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.MONERIUM_CLIENT_ID,
      client_secret: process.env.MONERIUM_CLIENT_SECRET,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Server auth failed: ${JSON.stringify(data)}`);

  serverToken = data.access_token;
  serverTokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return serverToken;
}

// ─── API Helper ─────────────────────────────────────────────

async function apiCall(method, path, body = null, accessToken = null) {
  const token = accessToken || await getServerToken();
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${MONERIUM_API}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Monerium ${method} ${path}: ${JSON.stringify(err)}`);
  }
  return res.json();
}

// ─── Profile & Accounts ────────────────────────────────────

async function getProfile(profileId, accessToken) {
  return apiCall('GET', `/profiles/${profileId}`, null, accessToken);
}

async function getAccounts(profileId, accessToken) {
  return apiCall('GET', `/profiles/${profileId}/accounts`, null, accessToken);
}

async function linkWallet(profileId, walletAddress, accessToken) {
  return apiCall('POST', `/profiles/${profileId}/accounts`, {
    chain: 'polygon',
    address: walletAddress,
    currency: 'eur',
  }, accessToken);
}

// ─── IBAN ───────────────────────────────────────────────────

async function requestIBAN(profileId, accessToken) {
  return apiCall('POST', `/profiles/${profileId}/ibans`, {
    currency: 'eur',
  }, accessToken);
}

async function getIBANs(profileId, accessToken) {
  return apiCall('GET', `/profiles/${profileId}/ibans`, null, accessToken);
}

// ─── Orders (Mint & Redeem) ─────────────────────────────────

async function redeemToEUR(profileId, walletAddress, amount, iban, name, accessToken) {
  return apiCall('POST', '/orders', {
    profile: profileId,
    kind: 'redeem',
    currency: 'eur',
    amount: amount.toString(),
    chain: 'polygon',
    address: walletAddress,
    counterpart: {
      identifier: { iban },
      details: { name },
    },
  }, accessToken);
}

async function getOrders(profileId, accessToken) {
  return apiCall('GET', `/profiles/${profileId}/orders`, null, accessToken);
}

async function getOrder(orderId, accessToken) {
  return apiCall('GET', `/orders/${orderId}`, null, accessToken);
}

// ─── Balance ────────────────────────────────────────────────

async function getEUReBalance(profileId, walletAddress, accessToken) {
  const accounts = await getAccounts(profileId, accessToken);
  const polygonAccount = accounts.find(
    a => a.chain === 'polygon' && a.address?.toLowerCase() === walletAddress?.toLowerCase()
  );
  return polygonAccount ? parseFloat(polygonAccount.balance || '0') : 0;
}

module.exports = {
  getOAuthURL,
  exchangeCode,
  refreshToken,
  getServerToken,
  getProfile,
  getAccounts,
  linkWallet,
  requestIBAN,
  getIBANs,
  redeemToEUR,
  getOrders,
  getOrder,
  getEUReBalance,
  MONERIUM_API,
  MONERIUM_AUTH,
};
