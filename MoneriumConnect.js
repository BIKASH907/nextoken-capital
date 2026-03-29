// components/MoneriumConnect.js
// Bank connection widget for issuers on the tokenize page
// Handles: OAuth → Link Wallet → Get IBAN → Show status
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || "sandbox";
const API_BASE = MONERIUM_ENV === "production" ? "https://api.monerium.app" : "https://api.monerium.dev";

export default function MoneriumConnect({ walletAddress, onIBANReceived }) {
  const { data: session } = useSession();
  const [status, setStatus] = useState("loading"); // loading, disconnected, connected, has_iban
  const [ibans, setIbans] = useState([]);
  const [balances, setBalances] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [linking, setLinking] = useState(false);
  const [requestingIBAN, setRequestingIBAN] = useState(false);

  // Check connection status on mount
  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/monerium");
      const data = await res.json();
      if (data.connected) {
        setProfile(data.profile);
        setIbans(data.ibans || []);
        setBalances(data.balances || []);
        setStatus(data.ibans?.length > 0 ? "has_iban" : "connected");
        if (data.ibans?.length > 0 && onIBANReceived) {
          onIBANReceived(data.ibans[0]);
        }
      } else {
        setStatus("disconnected");
      }
    } catch {
      setStatus("disconnected");
    }
  }, [onIBANReceived]);

  useEffect(() => {
    if (session) checkStatus();
  }, [session, checkStatus]);

  // Check URL params for callback result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const moneriumResult = params.get("monerium");
    if (moneriumResult === "success") {
      checkStatus();
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    } else if (moneriumResult === "error") {
      setError(params.get("reason") || "Connection failed");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [checkStatus]);

  // Step 1: Start OAuth flow
  const connectMonerium = () => {
    const clientId = process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID;
    const redirectUri =
      process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URI ||
      `${window.location.origin}/api/monerium/callback`;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      state: "nextoken_tokenize",
    });

    window.location.href = `${API_BASE}/auth?${params.toString()}`;
  };

  // Step 2: Link wallet address
  const linkWallet = async () => {
    if (!walletAddress) {
      setError("Connect your MetaMask wallet first");
      return;
    }
    setLinking(true);
    setError("");
    try {
      // Request signature from MetaMask
      const message = "I hereby declare that I am the address owner.";
      const ethereum = window.ethereum;
      if (!ethereum) throw new Error("MetaMask not found");

      const signature = await ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress],
      });

      const res = await fetch("/api/monerium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "link_address",
          address: walletAddress,
          message,
          signature,
          chain: "polygon",
        }),
      });
      const data = await res.json();
      if (data.success) {
        await checkStatus();
      } else {
        setError(data.error || "Failed to link wallet");
      }
    } catch (err) {
      setError(err.message || "Wallet linking failed");
    } finally {
      setLinking(false);
    }
  };

  // Step 3: Request IBAN for the linked address
  const requestIBAN = async () => {
    if (!walletAddress) {
      setError("Connect your wallet first");
      return;
    }
    setRequestingIBAN(true);
    setError("");
    try {
      const res = await fetch("/api/monerium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_iban",
          address: walletAddress,
          chain: "polygon",
        }),
      });
      const data = await res.json();
      if (data.success) {
        await checkStatus();
      } else {
        setError(data.error || "Failed to request IBAN");
      }
    } catch (err) {
      setError(err.message || "IBAN request failed");
    } finally {
      setRequestingIBAN(false);
    }
  };

  // ─── Styles ──────────────────────────────────────────────────
  const card = {
    background: "#161b22",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  };

  const badge = (color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    background: `${color}15`,
    color: color,
    border: `1px solid ${color}30`,
  });

  const btn = (bg, color, disabled) => ({
    padding: "12px 24px",
    borderRadius: 8,
    border: "none",
    background: disabled ? "#1e242c" : bg,
    color: disabled ? "rgba(255,255,255,0.3)" : color,
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
    width: "100%",
  });

  const ibanBox = {
    background: "rgba(240,185,11,0.06)",
    border: "1px solid rgba(240,185,11,0.2)",
    borderRadius: 10,
    padding: "16px 20px",
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: 700,
    color: "#F0B90B",
    letterSpacing: "1.5px",
    textAlign: "center",
  };

  if (!session) return null;

  return (
    <div style={card}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
            🏦 Bank Account Connection
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            Powered by Monerium · EU Licensed EMI · SEPA + EURe on Polygon
          </div>
        </div>
        <div style={badge(
          status === "has_iban" ? "#22c55e" :
          status === "connected" ? "#3b82f6" : "#6b7280"
        )}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: status === "has_iban" ? "#22c55e" :
              status === "connected" ? "#3b82f6" : "#6b7280",
          }} />
          {status === "has_iban" ? "IBAN Active" :
           status === "connected" ? "Connected" :
           status === "loading" ? "Checking..." : "Not Connected"}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 12,
          color: "#ef4444",
          marginBottom: 16,
        }}>
          ⚠️ {error}
          <span
            onClick={() => setError("")}
            style={{ float: "right", cursor: "pointer", opacity: 0.6 }}
          >✕</span>
        </div>
      )}

      {/* Step 1: Connect Monerium */}
      {status === "disconnected" && (
        <div>
          <div style={{
            background: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.15)",
            borderRadius: 10,
            padding: 16,
            marginBottom: 16,
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7,
          }}>
            <strong style={{ color: "#3b82f6" }}>How it works:</strong> Connect your Monerium account
            to receive a personal <strong style={{ color: "#fff" }}>IBAN</strong> linked to your
            Polygon wallet. Investors can send EUR via SEPA bank transfer, which is
            automatically converted to <strong style={{ color: "#F0B90B" }}>EURe</strong> tokens
            on Polygon. You can also withdraw EURe back to any bank account.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { icon: "🔗", title: "1. Connect", desc: "Authorize with Monerium" },
              { icon: "👛", title: "2. Link Wallet", desc: "Sign to verify ownership" },
              { icon: "🏦", title: "3. Get IBAN", desc: "Receive your personal IBAN" },
            ].map((step, i) => (
              <div key={i} style={{
                background: "#0d1117",
                borderRadius: 8,
                padding: "14px 12px",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.04)",
              }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{step.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{step.title}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{step.desc}</div>
              </div>
            ))}
          </div>

          <button onClick={connectMonerium} style={btn("#3b82f6", "#fff", false)}>
            Connect Monerium Account
          </button>

          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 10 }}>
            Monerium is a licensed EU Electronic Money Institution. Your funds are protected under EU e-money regulations.
          </div>
        </div>
      )}

      {/* Step 2: Link wallet */}
      {status === "connected" && (
        <div>
          <div style={{
            background: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.15)",
            borderRadius: 10,
            padding: 14,
            marginBottom: 16,
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.6,
          }}>
            ✅ Monerium connected. Next, link your Polygon wallet and request an IBAN.
          </div>

          {walletAddress ? (
            <div>
              <div style={{
                background: "#0d1117", borderRadius: 8, padding: "12px 16px", marginBottom: 16,
                border: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: "rgba(240,185,11,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}>👛</div>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Polygon Wallet</div>
                  <div style={{
                    fontSize: 13, fontFamily: "monospace", color: "#F0B90B",
                  }}>{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button onClick={linkWallet} disabled={linking} style={btn("#8b5cf6", "#fff", linking)}>
                  {linking ? "Signing..." : "1. Link Wallet"}
                </button>
                <button onClick={requestIBAN} disabled={requestingIBAN} style={btn("#F0B90B", "#000", requestingIBAN)}>
                  {requestingIBAN ? "Requesting..." : "2. Request IBAN"}
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: 20,
              color: "rgba(255,255,255,0.4)", fontSize: 13,
            }}>
              Connect MetaMask first, then link your wallet here.
            </div>
          )}
        </div>
      )}

      {/* Step 3: IBAN Active */}
      {status === "has_iban" && (
        <div>
          {/* IBAN Display */}
          {ibans.map((iban, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                Your Personal IBAN
              </div>
              <div style={ibanBox}>
                {iban.iban || iban}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6, textAlign: "center" }}>
                EUR sent to this IBAN → automatically becomes EURe on Polygon
              </div>
            </div>
          ))}

          {/* Balance */}
          {balances.length > 0 && (
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16,
            }}>
              {balances.map((bal, i) => (
                <div key={i} style={{
                  background: "#0d1117", borderRadius: 8, padding: "12px 16px",
                  border: "1px solid rgba(255,255,255,0.04)", textAlign: "center",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#22c55e" }}>
                    €{parseFloat(bal.amount || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                    {(bal.currency || "eur").toUpperCase()}e Balance
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info */}
          <div style={{
            background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.15)",
            borderRadius: 10,
            padding: 14,
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7,
          }}>
            <strong style={{ color: "#22c55e" }}>Bank connection active.</strong> Investors can now pay
            via SEPA bank transfer to your IBAN. Funds are automatically tokenized as EURe on Polygon
            and appear in your wallet. To withdraw, send EURe from your wallet — Monerium converts it
            back to EUR and sends it to any bank account via SEPA.
          </div>
        </div>
      )}

      {/* Loading */}
      {status === "loading" && (
        <div style={{ textAlign: "center", padding: 30, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          Checking Monerium connection...
        </div>
      )}
    </div>
  );
}
