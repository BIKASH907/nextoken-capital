#!/bin/bash
# ============================================================================
#  NEXTOKEN CAPITAL — Monerium + Issuer Dashboard Complete Fix
#  Run from: D:/New folder/nextoken-capital
# ============================================================================
set -e
echo ""
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║  NEXTOKEN × MONERIUM — FULL INTEGRATION FIX             ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
echo ""

# ─── 1. ADD MONERIUM ENV VARS ───────────────────────────────────────────────
echo "[1/8] Adding Monerium environment variables..."

# Check if already added
if grep -q "MONERIUM_CLIENT_ID" .env.local 2>/dev/null; then
  echo "  → Monerium vars already in .env.local, updating..."
  sed -i '/NEXT_PUBLIC_MONERIUM_CLIENT_ID/d' .env.local
  sed -i '/MONERIUM_CLIENT_SECRET/d' .env.local
  sed -i '/MONERIUM_CLIENT_ID=/d' .env.local
  sed -i '/NEXT_PUBLIC_MONERIUM_REDIRECT_URI/d' .env.local
  sed -i '/NEXT_PUBLIC_MONERIUM_ENV/d' .env.local
fi

cat >> .env.local << 'ENVEOF'

# ─── Monerium (EU Licensed EMI — EURe on Polygon) ───
NEXT_PUBLIC_MONERIUM_CLIENT_ID=3d985d3e-2b88-11f1-bf8b-66d0696d39b9
MONERIUM_CLIENT_ID=3d9989df-2b88-11f1-bf8b-66d0696d39b9
MONERIUM_CLIENT_SECRET=9188695202bb40fc8c18c6f494ec5688b26068d975f939a09111912d8279d74f
NEXT_PUBLIC_MONERIUM_REDIRECT_URI=https://nextokencapital.com/api/monerium/callback
NEXT_PUBLIC_MONERIUM_ENV=sandbox
ENVEOF

echo "  ✓ .env.local updated"

# ─── 2. CLEAN UP JUNK FILES ─────────────────────────────────────────────────
echo "[2/8] Cleaning up misplaced files..."

rm -f "MoneriumConnect (1).js" "MoneriumConnect.js" "PATCH-tokenize.js" \
      "SETUP-GUIDE.md" "callback.js" "dashboard.js" "deploy-escrow.js" \
      "index (3).js" "issuer.js" "monerium.js" "files (1).zip" 2>/dev/null

rm -rf nextoken-build 2>/dev/null
rm -rf pages/api/auth/monerium 2>/dev/null

echo "  ✓ Junk cleaned"

# ─── 3. CREATE lib/monerium.js ──────────────────────────────────────────────
echo "[3/8] Writing lib/monerium.js..."

cat > lib/monerium.js << 'EOF'
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
EOF

echo "  ✓ lib/monerium.js"

# ─── 4. CREATE pages/api/monerium/callback.js ───────────────────────────────
echo "[4/8] Writing pages/api/monerium/callback.js..."

mkdir -p pages/api/monerium

cat > pages/api/monerium/callback.js << 'EOF'
// pages/api/monerium/callback.js
// Handles Monerium OAuth redirect — exchanges code, saves tokens to User
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const API_BASE = MONERIUM_ENV === "production" ? "https://api.monerium.app" : "https://api.monerium.dev";

export default async function handler(req, res) {
  const { code, error: authError } = req.query;
  if (authError) return res.redirect("/dashboard/issuer?tab=bank&monerium=error&reason=" + encodeURIComponent(authError));
  if (!code) return res.redirect("/dashboard/issuer?tab=bank&monerium=error&reason=no_code");

  try {
    await connectDB();
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) return res.redirect("/login?redirect=/dashboard/issuer");

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
      const errText = await tokenRes.text();
      console.error("Monerium token exchange failed:", errText);
      return res.redirect("/dashboard/issuer?tab=bank&monerium=error&reason=token_exchange_failed");
    }

    const tokens = await tokenRes.json();

    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          "monerium.accessToken": tokens.access_token,
          "monerium.refreshToken": tokens.refresh_token,
          "monerium.expiresAt": new Date(Date.now() + (tokens.expires_in || 3600) * 1000),
          "monerium.profileId": tokens.profile || null,
          "monerium.connectedAt": new Date(),
        },
      }
    );

    return res.redirect("/dashboard/issuer?tab=bank&monerium=success");
  } catch (err) {
    console.error("Monerium callback error:", err);
    return res.redirect("/dashboard/issuer?tab=bank&monerium=error&reason=" + encodeURIComponent(err.message));
  }
}
EOF

echo "  ✓ pages/api/monerium/callback.js"

# ─── 5. CREATE pages/api/monerium/index.js ──────────────────────────────────
echo "[5/8] Writing pages/api/monerium/index.js..."

cat > pages/api/monerium/index.js << 'EOF'
// pages/api/monerium/index.js
// GET: connection status, IBANs, balances
// POST: link address, request IBAN, get orders
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const API_BASE = MONERIUM_ENV === "production" ? "https://api.monerium.app" : "https://api.monerium.dev";
const V2 = { Accept: "application/vnd.monerium.api-v2+json" };

async function mFetch(path, token, opts = {}) {
  const r = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, ...V2, ...(opts.headers || {}) },
  });
  if (!r.ok) throw new Error(`Monerium ${path}: ${r.status}`);
  return r.json();
}

async function getValidToken(user) {
  if (!user.monerium?.accessToken) return null;
  // Refresh if expiring within 5 minutes
  if (user.monerium.expiresAt && new Date(user.monerium.expiresAt) < new Date(Date.now() + 300000)) {
    if (!user.monerium.refreshToken) return null;
    try {
      const r = await fetch(`${API_BASE}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: user.monerium.refreshToken,
          client_id: process.env.MONERIUM_CLIENT_ID || process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID,
          client_secret: process.env.MONERIUM_CLIENT_SECRET,
        }),
      });
      if (!r.ok) return null;
      const t = await r.json();
      user.monerium.accessToken = t.access_token;
      user.monerium.refreshToken = t.refresh_token;
      user.monerium.expiresAt = new Date(Date.now() + t.expires_in * 1000);
      await user.save();
      return t.access_token;
    } catch { return null; }
  }
  return user.monerium.accessToken;
}

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  // ── GET ───────────────────────────────────────────────────────
  if (req.method === "GET") {
    const token = await getValidToken(user);
    if (!token) return res.json({ connected: false, ibans: [], balances: [], profile: null });

    try {
      const [profile, ibans, balances] = await Promise.allSettled([
        mFetch("/profiles", token),
        mFetch("/ibans", token),
        mFetch("/balances", token),
      ]);
      return res.json({
        connected: true,
        connectedAt: user.monerium?.connectedAt,
        profile: profile.status === "fulfilled" ? profile.value : null,
        ibans: ibans.status === "fulfilled" ? ibans.value : [],
        balances: balances.status === "fulfilled" ? balances.value : [],
      });
    } catch (err) {
      return res.json({ connected: false, error: err.message });
    }
  }

  // ── POST ──────────────────────────────────────────────────────
  if (req.method === "POST") {
    const token = await getValidToken(user);
    if (!token) return res.status(401).json({ error: "Monerium not connected" });

    const { action, address, message, signature, chain } = req.body;
    try {
      if (action === "link_address") {
        const result = await mFetch("/addresses", token, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address,
            message: message || "I hereby declare that I am the address owner.",
            signature,
            chain: chain || "polygon",
          }),
        });
        return res.json({ success: true, data: result });
      }

      if (action === "request_iban") {
        const result = await mFetch("/ibans", token, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, chain: chain || "polygon" }),
        });
        await User.findOneAndUpdate(
          { email: session.user.email },
          { $set: { "monerium.iban": result.iban, "monerium.ibanAddress": address } }
        );
        return res.json({ success: true, data: result });
      }

      if (action === "get_orders") {
        const orders = await mFetch("/orders", token);
        return res.json({ success: true, data: orders });
      }

      return res.status(400).json({ error: "Unknown action" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
EOF

echo "  ✓ pages/api/monerium/index.js"

# ─── 6. CREATE components/MoneriumConnect.js ─────────────────────────────────
echo "[6/8] Writing components/MoneriumConnect.js..."

cat > components/MoneriumConnect.js << 'EOF'
// components/MoneriumConnect.js
// Bank connection widget — OAuth + Link Wallet + IBAN
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const API_BASE = MONERIUM_ENV === "production" ? "https://api.monerium.app" : "https://api.monerium.dev";

export default function MoneriumConnect({ walletAddress, onIBANReceived }) {
  const { data: session } = useSession();
  const [status, setStatus] = useState("loading");
  const [ibans, setIbans] = useState([]);
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState("");
  const [linking, setLinking] = useState(false);
  const [requestingIBAN, setRequestingIBAN] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/monerium");
      const data = await res.json();
      if (data.connected) {
        setIbans(data.ibans || []);
        setBalances(data.balances || []);
        setStatus(data.ibans?.length > 0 ? "has_iban" : "connected");
        if (data.ibans?.length > 0 && onIBANReceived) onIBANReceived(data.ibans[0]);
      } else {
        setStatus("disconnected");
      }
    } catch { setStatus("disconnected"); }
  }, [onIBANReceived]);

  useEffect(() => { if (session) checkStatus(); }, [session, checkStatus]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("monerium") === "success") {
      checkStatus();
      window.history.replaceState({}, "", window.location.pathname);
    } else if (params.get("monerium") === "error") {
      setError(params.get("reason") || "Connection failed");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [checkStatus]);

  const connectMonerium = () => {
    const clientId = process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URI ||
      `${window.location.origin}/api/monerium/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      state: "nextoken_issuer",
    });
    window.location.href = `${API_BASE}/auth?${params.toString()}`;
  };

  const linkWallet = async () => {
    if (!walletAddress) { setError("Connect MetaMask first"); return; }
    setLinking(true); setError("");
    try {
      const message = "I hereby declare that I am the address owner.";
      const signature = await window.ethereum.request({
        method: "personal_sign", params: [message, walletAddress],
      });
      const res = await fetch("/api/monerium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "link_address", address: walletAddress, message, signature, chain: "polygon" }),
      });
      const data = await res.json();
      if (data.success) await checkStatus();
      else setError(data.error || "Failed to link wallet");
    } catch (err) { setError(err.message); }
    setLinking(false);
  };

  const doRequestIBAN = async () => {
    if (!walletAddress) { setError("Connect wallet first"); return; }
    setRequestingIBAN(true); setError("");
    try {
      const res = await fetch("/api/monerium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_iban", address: walletAddress, chain: "polygon" }),
      });
      const data = await res.json();
      if (data.success) await checkStatus();
      else setError(data.error || "Failed to request IBAN");
    } catch (err) { setError(err.message); }
    setRequestingIBAN(false);
  };

  const card = { background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:24, marginBottom:24 };
  const badgeStyle = (c) => ({ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:`${c}15`, color:c, border:`1px solid ${c}30` });
  const btnStyle = (bg, fg, off) => ({ padding:"12px 24px", borderRadius:8, border:"none", background:off?"#1e242c":bg, color:off?"rgba(255,255,255,0.3)":fg, fontSize:14, fontWeight:700, cursor:off?"not-allowed":"pointer", fontFamily:"inherit", width:"100%", transition:"all 0.2s" });

  if (!session) return null;

  return (
    <div style={card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>🏦 Bank Account Connection</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>Powered by Monerium · EU Licensed EMI · SEPA + EURe on Polygon</div>
        </div>
        <div style={badgeStyle(status==="has_iban"?"#22c55e":status==="connected"?"#3b82f6":"#6b7280")}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:status==="has_iban"?"#22c55e":status==="connected"?"#3b82f6":"#6b7280" }} />
          {status==="has_iban"?"IBAN Active":status==="connected"?"Connected":status==="loading"?"Checking...":"Not Connected"}
        </div>
      </div>

      {error && (
        <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#ef4444", marginBottom:16 }}>
          {error} <span onClick={() => setError("")} style={{ float:"right", cursor:"pointer", opacity:0.6 }}>x</span>
        </div>
      )}

      {status === "disconnected" && (
        <div>
          <div style={{ background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:10, padding:16, marginBottom:16, fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.7 }}>
            <strong style={{ color:"#3b82f6" }}>How it works:</strong> Connect your Monerium account to get a personal <strong style={{ color:"#fff" }}>IBAN</strong> linked to your Polygon wallet. Investors send EUR via SEPA — automatically converted to <strong style={{ color:"#F0B90B" }}>EURe</strong> tokens on Polygon.
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12, marginBottom:20 }}>
            {[{i:"🔗",t:"1. Connect",d:"Authorize Monerium"},{i:"👛",t:"2. Link Wallet",d:"Sign to verify"},{i:"🏦",t:"3. Get IBAN",d:"Personal IBAN"}].map((s,j) => (
              <div key={j} style={{ background:"#0d1117", borderRadius:8, padding:"14px 12px", textAlign:"center", border:"1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{s.i}</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{s.t}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{s.d}</div>
              </div>
            ))}
          </div>
          <button onClick={connectMonerium} style={btnStyle("#3b82f6","#fff",false)}>Connect Monerium Account</button>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", textAlign:"center", marginTop:10 }}>
            Monerium is a licensed EU Electronic Money Institution. Funds protected under EU e-money regulations.
          </div>
        </div>
      )}

      {status === "connected" && (
        <div>
          <div style={{ background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:10, padding:14, marginBottom:16, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
            Monerium connected. Link your wallet and request an IBAN.
          </div>
          {walletAddress ? (
            <div>
              <div style={{ background:"#0d1117", borderRadius:8, padding:"12px 16px", marginBottom:16, border:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(240,185,11,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>W</div>
                <div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Polygon Wallet</div>
                  <div style={{ fontSize:13, fontFamily:"monospace", color:"#F0B90B" }}>{walletAddress.slice(0,8)}...{walletAddress.slice(-6)}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <button onClick={linkWallet} disabled={linking} style={btnStyle("#8b5cf6","#fff",linking)}>{linking?"Signing...":"1. Link Wallet"}</button>
                <button onClick={doRequestIBAN} disabled={requestingIBAN} style={btnStyle("#F0B90B","#000",requestingIBAN)}>{requestingIBAN?"Requesting...":"2. Request IBAN"}</button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:20, color:"rgba(255,255,255,0.4)", fontSize:13 }}>Connect MetaMask first.</div>
          )}
        </div>
      )}

      {status === "has_iban" && (
        <div>
          {ibans.map((ib,i) => (
            <div key={i} style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Your Personal IBAN</div>
              <div style={{ background:"rgba(240,185,11,0.06)", border:"1px solid rgba(240,185,11,0.2)", borderRadius:10, padding:"16px 20px", fontFamily:"monospace", fontSize:16, fontWeight:700, color:"#F0B90B", letterSpacing:"1.5px", textAlign:"center" }}>
                {ib.iban || ib}
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:6, textAlign:"center" }}>EUR sent here becomes EURe on Polygon automatically</div>
            </div>
          ))}
          {balances.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:10, marginBottom:16 }}>
              {balances.map((b,i) => (
                <div key={i} style={{ background:"#0d1117", borderRadius:8, padding:"12px 16px", border:"1px solid rgba(255,255,255,0.04)", textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:800, color:"#22c55e" }}>{parseFloat(b.amount||0).toLocaleString()} EUR</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>EURe Balance</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:10, padding:14, fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>
            <strong style={{ color:"#22c55e" }}>Bank active.</strong> Investors pay via SEPA to your IBAN. Funds auto-tokenized as EURe on Polygon. Send EURe back to convert to EUR via SEPA.
          </div>
        </div>
      )}

      {status === "loading" && (
        <div style={{ textAlign:"center", padding:30, color:"rgba(255,255,255,0.3)", fontSize:13 }}>Checking Monerium connection...</div>
      )}
    </div>
  );
}
EOF

echo "  ✓ components/MoneriumConnect.js"

# ─── 7. CREATE pages/api/issuer/dashboard.js ─────────────────────────────────
echo "[7/8] Writing pages/api/issuer/dashboard.js..."

mkdir -p pages/api/issuer

cat > pages/api/issuer/dashboard.js << 'EOF'
// pages/api/issuer/dashboard.js
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: "User not found" });

  try {
    const mongoose = require("mongoose");
    const Asset = mongoose.models.Asset || mongoose.model("Asset", new mongoose.Schema({}, { strict: false, collection: "assets" }));
    const Investment = mongoose.models.Investment || mongoose.model("Investment", new mongoose.Schema({}, { strict: false, collection: "investments" }));

    const assets = await Asset.find({ issuerId: user._id }).sort({ createdAt: -1 }).lean();
    const assetIds = assets.map(a => a._id);
    const investments = await Investment.find({ assetId: { $in: assetIds } }).lean();

    // Try to get user info for investors
    const investorIds = [...new Set(investments.map(i => i.userId?.toString()).filter(Boolean))];
    let investorMap = {};
    if (investorIds.length > 0) {
      const investors = await User.find({ _id: { $in: investorIds } }).select("name email").lean();
      investors.forEach(u => { investorMap[u._id.toString()] = { name: u.name, email: u.email }; });
    }

    const assetsWithData = assets.map(a => {
      const inv = investments.filter(i => i.assetId?.toString() === a._id.toString());
      const uniqueInvestors = [...new Set(inv.map(i => i.userId?.toString()).filter(Boolean))];
      return {
        ...a,
        raised: inv.reduce((s, i) => s + (i.amount || i.totalInvested || 0), 0),
        investorCount: uniqueInvestors.length,
        investors: inv.map(i => ({
          userId: i.userId,
          name: investorMap[i.userId?.toString()]?.name || "",
          email: investorMap[i.userId?.toString()]?.email || "",
          tokens: i.tokens || i.units || 0,
          amount: i.amount || i.totalInvested || 0,
        })),
      };
    });

    const totalRaised = assetsWithData.reduce((s, a) => s + a.raised, 0);
    const allInvestorIds = [...new Set(investments.map(i => i.userId?.toString()).filter(Boolean))];

    return res.json({
      assets: assetsWithData,
      distributions: [],
      stats: {
        totalAssets: assets.length,
        liveAssets: assets.filter(a => a.status === "live" || a.approvalStatus === "live").length,
        totalRaised,
        totalInvestors: allInvestorIds.length,
        totalInvestments: investments.length,
        totalDistributed: 0,
      },
    });
  } catch (err) {
    console.error("Issuer dashboard error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
EOF

echo "  ✓ pages/api/issuer/dashboard.js"

# ─── 8. VERIFY FILES ────────────────────────────────────────────────────────
echo "[8/8] Verifying..."
echo ""

FILES=(
  "lib/monerium.js"
  "components/MoneriumConnect.js"
  "pages/api/monerium/callback.js"
  "pages/api/monerium/index.js"
  "pages/api/issuer/dashboard.js"
  "pages/dashboard/issuer.js"
)

ALL_OK=true
for f in "${FILES[@]}"; do
  SIZE=$(wc -c < "$f" 2>/dev/null || echo "0")
  if [ "$SIZE" -gt "100" ]; then
    echo "  ✓ $f ($SIZE bytes)"
  else
    echo "  ✗ $f — MISSING or EMPTY!"
    ALL_OK=false
  fi
done

echo ""
if $ALL_OK; then
  echo "  ╔═══════════════════════════════════════════════════════════╗"
  echo "  ║  ✅ ALL FILES READY                                      ║"
  echo "  ║                                                           ║"
  echo "  ║  IMPORTANT: In Monerium portal, add this Redirect URI:   ║"
  echo "  ║  https://nextokencapital.com/api/monerium/callback       ║"
  echo "  ║                                                           ║"
  echo "  ║  Now run:                                                 ║"
  echo "  ║  git add -A && git commit -m 'feat: monerium full'       ║"
  echo "  ║  git push && npx vercel --prod                           ║"
  echo "  ╚═══════════════════════════════════════════════════════════╝"
else
  echo "  ⚠️  Some files are missing. Check errors above."
fi
