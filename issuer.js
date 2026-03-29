// pages/dashboard/issuer.js
// Issuer Dashboard — Nextoken Capital
// Matches platform design: #0D1117 bg, #F0B90B gold accent, #161b22 cards
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MoneriumConnect from "../../components/MoneriumConnect";

export default function IssuerDashboard() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState({ assets: [], stats: {}, distributions: [], investors: [] });
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const [iban, setIban] = useState(null);

  // ─── Form state for Create Asset ────────────────────────────
  const [form, setForm] = useState({
    name: "", type: "Bond", totalValue: "", tokenSupply: "",
    interestRate: "", duration: "", minInvestment: "100", description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  // ─── Auth guard ──────────────────────────────────────────────
  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/login");
  }, [authStatus, router]);

  // ─── Connect wallet ──────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts[0]) setWalletAddress(accounts[0]);
      }).catch(() => {});
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) { alert("Install MetaMask"); return; }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0] || "");
    } catch (e) {
      console.error(e);
    }
  };

  // ─── Fetch data ──────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/issuer/dashboard");
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { if (session) fetchData(); }, [session, fetchData]);

  // ─── Create asset ────────────────────────────────────────────
  const createAsset = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg("");
    try {
      const res = await fetch("/api/assets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          totalValue: parseFloat(form.totalValue),
          tokenSupply: parseInt(form.tokenSupply),
          interestRate: parseFloat(form.interestRate),
          duration: parseInt(form.duration),
          minInvestment: parseFloat(form.minInvestment),
          walletAddress,
          iban: iban?.iban || null,
        }),
      });
      if (res.ok) {
        setFormMsg("Asset created as draft. Submitted for compliance review.");
        setForm({ name: "", type: "Bond", totalValue: "", tokenSupply: "", interestRate: "", duration: "", minInvestment: "100", description: "" });
        fetchData();
      } else {
        const err = await res.json();
        setFormMsg("Error: " + (err.error || "Failed to create"));
      }
    } catch (err) {
      setFormMsg("Error: " + err.message);
    }
    setSubmitting(false);
  };

  // ─── Distribution form ───────────────────────────────────────
  const [distForm, setDistForm] = useState({ assetId: "", profit: "", proof: "" });
  const [distMsg, setDistMsg] = useState("");

  const submitDistribution = async (e) => {
    e.preventDefault();
    setDistMsg("");
    try {
      const res = await fetch("/api/issuer/distributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(distForm),
      });
      if (res.ok) {
        setDistMsg("Distribution submitted for approval.");
        setDistForm({ assetId: "", profit: "", proof: "" });
        fetchData();
      } else {
        const err = await res.json();
        setDistMsg("Error: " + (err.error || "Failed"));
      }
    } catch (err) {
      setDistMsg("Error: " + err.message);
    }
  };

  // ─── Styles ──────────────────────────────────────────────────
  const S = {
    page: { minHeight: "100vh", background: "#0D1117", color: "#fff", fontFamily: "'Inter','Segoe UI',sans-serif" },
    container: { maxWidth: 1200, margin: "0 auto", padding: "24px 20px 60px" },
    heading: { fontSize: 28, fontWeight: 800, marginBottom: 4 },
    subheading: { fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 32 },
    tabBar: {
      display: "flex", gap: 4, marginBottom: 28, flexWrap: "wrap",
      background: "#161b22", borderRadius: 10, padding: 4,
      border: "1px solid rgba(255,255,255,0.06)",
    },
    tabBtn: (active) => ({
      padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer",
      fontFamily: "inherit", fontSize: 13, fontWeight: active ? 700 : 500,
      background: active ? "rgba(240,185,11,0.12)" : "transparent",
      color: active ? "#F0B90B" : "rgba(255,255,255,0.4)",
      transition: "all 0.2s",
    }),
    card: {
      background: "#161b22", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: 24, marginBottom: 20,
    },
    statCard: (color) => ({
      background: "#161b22", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10, padding: "18px 20px", textAlign: "center", flex: 1, minWidth: 150,
    }),
    statValue: (color) => ({ fontSize: 26, fontWeight: 800, color }),
    statLabel: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 },
    input: {
      width: "100%", padding: "12px 16px", background: "#0d1117",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
      color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none",
      boxSizing: "border-box",
    },
    select: {
      width: "100%", padding: "12px 16px", background: "#0d1117",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
      color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none",
      boxSizing: "border-box", appearance: "none",
    },
    label: { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "block" },
    btnPrimary: (disabled) => ({
      padding: "14px 28px", borderRadius: 8, border: "none",
      background: disabled ? "#1e242c" : "#F0B90B", color: disabled ? "rgba(255,255,255,0.3)" : "#000",
      fontSize: 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit", width: "100%", transition: "all 0.2s",
    }),
    badge: (color) => ({
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 10, fontWeight: 700, background: `${color}15`, color, border: `1px solid ${color}30`,
    }),
    tableHead: {
      display: "grid", padding: "10px 16px", fontSize: 10, fontWeight: 700,
      color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 0.5,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    },
    tableRow: {
      display: "grid", padding: "14px 16px", fontSize: 13, alignItems: "center",
      borderBottom: "1px solid rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.7)",
    },
  };

  const statusColor = (s) => ({
    draft: "#6b7280", pending_compliance: "#f59e0b", pending_finance: "#f59e0b",
    live: "#22c55e", sold_out: "#3b82f6", suspended: "#ef4444",
    pending: "#f59e0b", approved: "#22c55e", rejected: "#ef4444", completed: "#3b82f6",
  }[s] || "#6b7280");

  const stats = data.stats || {};
  const liveAssets = (data.assets || []).filter((a) => a.status === "live");

  const tabs = [
    { k: "overview", l: "Overview" },
    { k: "create", l: "Create Asset" },
    { k: "offerings", l: "Offerings" },
    { k: "bank", l: "Bank & Wallet" },
    { k: "distributions", l: "Distributions" },
    { k: "investors", l: "Investors" },
  ];

  if (authStatus === "loading" || loading) {
    return (
      <div style={S.page}>
        <Navbar />
        <div style={{ ...S.container, textAlign: "center", paddingTop: 100 }}>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <Head><title>Issuer Dashboard — Nextoken Capital</title></Head>
      <Navbar />

      <div style={S.container}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={S.heading}>Issuer Dashboard</div>
            <div style={S.subheading}>
              Manage your tokenized assets, track investments, and distribute profits.
            </div>
          </div>
          {walletAddress ? (
            <div style={{
              background: "#161b22", borderRadius: 8, padding: "8px 14px",
              border: "1px solid rgba(255,255,255,0.06)", fontSize: 12,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ color: "rgba(255,255,255,0.4)" }}>Polygon</span>
              <span style={{ fontFamily: "monospace", color: "#F0B90B" }}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          ) : (
            <button onClick={connectWallet} style={{
              padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(240,185,11,0.3)",
              background: "rgba(240,185,11,0.08)", color: "#F0B90B", fontSize: 13,
              fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              Connect Wallet
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={S.tabBar}>
          {tabs.map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} style={S.tabBtn(tab === t.k)}>
              {t.l}
            </button>
          ))}
        </div>

        {/* ═══════ OVERVIEW ═══════ */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              {[
                { l: "Total Assets", v: stats.totalAssets || 0, c: "#8b5cf6" },
                { l: "Live Assets", v: stats.liveAssets || 0, c: "#22c55e" },
                { l: "Total Raised", v: "€" + (stats.totalRaised || 0).toLocaleString(), c: "#F0B90B" },
                { l: "Total Investors", v: stats.totalInvestors || 0, c: "#3b82f6" },
                { l: "Distributed", v: "€" + (stats.totalDistributed || 0).toLocaleString(), c: "#22c55e" },
              ].map((s, i) => (
                <div key={i} style={S.statCard(s.c)}>
                  <div style={S.statValue(s.c)}>{s.v}</div>
                  <div style={S.statLabel}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Recent Assets */}
            <div style={S.card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                Recent Assets
              </div>
              {(data.assets || []).length === 0 ? (
                <div style={{ textAlign: "center", padding: 30, color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                  No assets yet. Go to &quot;Create Asset&quot; to list your first offering.
                </div>
              ) : (
                (data.assets || []).slice(0, 5).map((a, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                        {a.type} · €{(a.totalValue || 0).toLocaleString()}
                      </div>
                    </div>
                    <span style={S.badge(statusColor(a.status || a.approvalStatus))}>
                      {(a.status || a.approvalStatus || "draft").replace(/_/g, " ")}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Connection Status */}
            <div style={S.card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                Payment Setup
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{
                  background: "#0d1117", borderRadius: 8, padding: 16,
                  border: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: walletAddress ? "#22c55e" : "#ef4444" }}>
                    {walletAddress ? "✅ Wallet Connected" : "❌ Wallet Not Connected"}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                    {walletAddress ? `${walletAddress.slice(0, 10)}...` : "Connect MetaMask to receive crypto payments"}
                  </div>
                </div>
                <div style={{
                  background: "#0d1117", borderRadius: 8, padding: 16,
                  border: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: iban ? "#22c55e" : "#f59e0b" }}>
                    {iban ? "✅ Bank Account Linked" : "⏳ No Bank Account"}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                    {iban ? `IBAN: ${iban.iban?.slice(0, 8)}...` : "Set up in Bank & Wallet tab"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ CREATE ASSET ═══════ */}
        {tab === "create" && (
          <div style={S.card}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
              Create New Asset
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>
              Submit for Compliance → Finance → Admin → Live on marketplace
            </div>

            <form onSubmit={createAsset}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>Asset Name</label>
                  <input style={S.input} placeholder="e.g. Baltic Green Bond 2027" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={S.label}>Asset Type</label>
                  <select style={S.select} value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {["Bond", "Equity", "Real Estate", "Fund", "Infrastructure", "Commodity"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>Total Value (EUR)</label>
                  <input style={S.input} type="number" placeholder="500000" value={form.totalValue}
                    onChange={(e) => setForm({ ...form, totalValue: e.target.value })} required />
                </div>
                <div>
                  <label style={S.label}>Token Supply</label>
                  <input style={S.input} type="number" placeholder="50000" value={form.tokenSupply}
                    onChange={(e) => setForm({ ...form, tokenSupply: e.target.value })} required />
                </div>
                <div>
                  <label style={S.label}>Interest Rate (%)</label>
                  <input style={S.input} type="number" step="0.1" placeholder="7.5" value={form.interestRate}
                    onChange={(e) => setForm({ ...form, interestRate: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>Duration (months)</label>
                  <input style={S.input} type="number" placeholder="36" value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
                </div>
                <div>
                  <label style={S.label}>Min Investment (EUR)</label>
                  <input style={S.input} type="number" placeholder="100" value={form.minInvestment}
                    onChange={(e) => setForm({ ...form, minInvestment: e.target.value })} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={S.label}>Description</label>
                <textarea style={{ ...S.input, minHeight: 100, resize: "vertical" }}
                  placeholder="Describe the asset, expected returns, and use of proceeds..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>

              {walletAddress && (
                <div style={{
                  background: "rgba(240,185,11,0.06)", border: "1px solid rgba(240,185,11,0.15)",
                  borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "rgba(255,255,255,0.5)",
                  marginBottom: 16,
                }}>
                  <strong style={{ color: "#F0B90B" }}>Issuer Wallet:</strong>{" "}
                  <span style={{ fontFamily: "monospace" }}>{walletAddress}</span>
                  {iban && <span> · <strong style={{ color: "#22c55e" }}>IBAN:</strong> {iban.iban}</span>}
                </div>
              )}

              <button type="submit" disabled={submitting} style={S.btnPrimary(submitting)}>
                {submitting ? "Creating..." : "Create Asset (Draft)"}
              </button>

              {formMsg && (
                <div style={{
                  marginTop: 12, padding: "10px 14px", borderRadius: 8, fontSize: 13,
                  background: formMsg.startsWith("Error") ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                  color: formMsg.startsWith("Error") ? "#ef4444" : "#22c55e",
                  border: `1px solid ${formMsg.startsWith("Error") ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                }}>
                  {formMsg}
                </div>
              )}
            </form>
          </div>
        )}

        {/* ═══════ OFFERINGS ═══════ */}
        {tab === "offerings" && (
          <div style={S.card}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 20 }}>
              Your Offerings
            </div>

            {(data.assets || []).length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                No offerings yet.
              </div>
            ) : (
              <div>
                <div style={{ ...S.tableHead, gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1fr 0.8fr" }}>
                  <span>Asset</span><span>Type</span><span>Target</span>
                  <span>Raised</span><span>Investors</span><span>Status</span>
                </div>
                {(data.assets || []).map((a, i) => (
                  <div key={i} style={{ ...S.tableRow, gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1fr 0.8fr" }}>
                    <span style={{ fontWeight: 600, color: "#fff" }}>{a.name}</span>
                    <span>{a.type}</span>
                    <span style={{ color: "#F0B90B" }}>€{(a.totalValue || 0).toLocaleString()}</span>
                    <span style={{ color: "#22c55e" }}>€{(a.raised || 0).toLocaleString()}</span>
                    <span>{a.investorCount || 0}</span>
                    <span style={S.badge(statusColor(a.status || a.approvalStatus))}>
                      {(a.status || a.approvalStatus || "draft").replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════ BANK & WALLET ═══════ */}
        {tab === "bank" && (
          <div>
            {/* Wallet Section */}
            <div style={S.card}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                👛 Polygon Wallet
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
                Receives investment funds from the escrow smart contract
              </div>

              {walletAddress ? (
                <div style={{
                  background: "#0d1117", borderRadius: 10, padding: "16px 20px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Connected Address</div>
                    <div style={{ fontSize: 15, fontFamily: "monospace", color: "#F0B90B", fontWeight: 700 }}>
                      {walletAddress}
                    </div>
                  </div>
                  <div style={S.badge("#22c55e")}>● Connected</div>
                </div>
              ) : (
                <button onClick={connectWallet} style={S.btnPrimary(false)}>
                  Connect MetaMask
                </button>
              )}

              <div style={{
                fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 12, lineHeight: 1.6,
              }}>
                This wallet receives the issuer&apos;s share (after commission) from the NextokenEscrowSplitter
                smart contract on Polygon. Investors pay → contract splits → your wallet receives.
              </div>
            </div>

            {/* Monerium Bank Connection */}
            <MoneriumConnect
              walletAddress={walletAddress}
              onIBANReceived={(ibanData) => setIban(ibanData)}
            />

            {/* Payment Flow Diagram */}
            <div style={S.card}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
                How Payments Work
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: 8, alignItems: "center" }}>
                {[
                  { icon: "👤", title: "Investor", desc: "Sends POL or EUR" },
                  { icon: "→" },
                  { icon: "📜", title: "Escrow Contract", desc: "Auto-splits payment" },
                  { icon: "→" },
                  { icon: "🏦", title: "Your Wallet/IBAN", desc: "Receives funds" },
                ].map((item, i) => (
                  item.title ? (
                    <div key={i} style={{
                      background: "#0d1117", borderRadius: 10, padding: "16px 12px",
                      textAlign: "center", border: "1px solid rgba(255,255,255,0.04)",
                    }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{item.title}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{item.desc}</div>
                    </div>
                  ) : (
                    <div key={i} style={{ textAlign: "center", fontSize: 20, color: "#F0B90B", fontWeight: 700 }}>
                      {item.icon}
                    </div>
                  )
                ))}
              </div>
              <div style={{
                marginTop: 16, background: "rgba(240,185,11,0.06)",
                border: "1px solid rgba(240,185,11,0.15)", borderRadius: 8,
                padding: "10px 14px", fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6,
              }}>
                <strong style={{ color: "#F0B90B" }}>Commission:</strong> 0.25% is automatically deducted
                by the escrow contract and sent to Nextoken Capital treasury. The remaining 99.75% goes
                directly to your wallet. All transactions are on-chain and verifiable on PolygonScan.
              </div>
            </div>
          </div>
        )}

        {/* ═══════ DISTRIBUTIONS ═══════ */}
        {tab === "distributions" && (
          <div>
            {/* Submit Distribution */}
            <div style={S.card}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                Submit Profit Distribution
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
                Compliance → Finance → Admin → Auto-distribute to all investors
              </div>

              <form onSubmit={submitDistribution}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={S.label}>Select Asset</label>
                    <select style={S.select} value={distForm.assetId}
                      onChange={(e) => setDistForm({ ...distForm, assetId: e.target.value })} required>
                      <option value="">Choose asset...</option>
                      {liveAssets.map((a) => (
                        <option key={a._id} value={a._id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Total Profit (EUR)</label>
                    <input style={S.input} type="number" placeholder="10000" value={distForm.profit}
                      onChange={(e) => setDistForm({ ...distForm, profit: e.target.value })} required />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={S.label}>Proof Document URL</label>
                  <input style={S.input} placeholder="https://..." value={distForm.proof}
                    onChange={(e) => setDistForm({ ...distForm, proof: e.target.value })} />
                </div>
                <button type="submit" style={S.btnPrimary(false)}>
                  Submit for Approval
                </button>
                {distMsg && (
                  <div style={{
                    marginTop: 12, padding: "10px 14px", borderRadius: 8, fontSize: 13,
                    background: distMsg.startsWith("Error") ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
                    color: distMsg.startsWith("Error") ? "#ef4444" : "#22c55e",
                  }}>
                    {distMsg}
                  </div>
                )}
              </form>
            </div>

            {/* Distribution History */}
            <div style={S.card}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                Distribution History
              </div>
              {(data.distributions || []).length === 0 ? (
                <div style={{ textAlign: "center", padding: 30, color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                  No distributions yet.
                </div>
              ) : (
                <div>
                  <div style={{ ...S.tableHead, gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
                    <span>Asset</span><span>Profit</span><span>Investors</span><span>Date</span><span>Status</span>
                  </div>
                  {(data.distributions || []).map((d, i) => (
                    <div key={i} style={{ ...S.tableRow, gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
                      <span style={{ fontWeight: 600, color: "#fff" }}>{d.assetName || "—"}</span>
                      <span style={{ color: "#F0B90B" }}>€{(d.profit || 0).toLocaleString()}</span>
                      <span>{d.investorCount || 0}</span>
                      <span style={{ fontSize: 11 }}>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—"}</span>
                      <span style={S.badge(statusColor(d.status))}>{d.status || "pending"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════ INVESTORS ═══════ */}
        {tab === "investors" && (
          <div style={S.card}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
              Your Investors
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
              Breakdown by asset
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <div style={S.statCard("#3b82f6")}>
                <div style={S.statValue("#3b82f6")}>{stats.totalInvestors || 0}</div>
                <div style={S.statLabel}>Total Investors</div>
              </div>
              <div style={S.statCard("#F0B90B")}>
                <div style={S.statValue("#F0B90B")}>{stats.totalInvestments || 0}</div>
                <div style={S.statLabel}>Total Investments</div>
              </div>
            </div>

            {(data.assets || []).filter((a) => a.investorCount > 0).length === 0 ? (
              <div style={{ textAlign: "center", padding: 30, color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                No investors yet. Investors will appear here once your assets go live.
              </div>
            ) : (
              (data.assets || []).filter((a) => a.investorCount > 0).map((a, ai) => (
                <div key={ai} style={{ marginBottom: 20 }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 16px", background: "#0d1117", borderRadius: "10px 10px 0 0",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{a.name}</div>
                    <span style={S.badge("#3b82f6")}>{a.investorCount} investors</span>
                  </div>
                  <div style={{
                    border: "1px solid rgba(255,255,255,0.06)", borderTop: "none",
                    borderRadius: "0 0 10px 10px", overflow: "hidden",
                  }}>
                    <div style={{ ...S.tableHead, gridTemplateColumns: "2fr 1fr 1fr" }}>
                      <span>Investor</span><span>Tokens</span><span>Invested</span>
                    </div>
                    {(a.investors || []).map((inv, ii) => (
                      <div key={ii} style={{ ...S.tableRow, gridTemplateColumns: "2fr 1fr 1fr" }}>
                        <span>{inv.name || inv.email || inv.userId?.toString().slice(-8)}</span>
                        <span style={{ color: "#F0B90B" }}>{inv.tokens || inv.units || 0}</span>
                        <span style={{ color: "#22c55e" }}>€{(inv.amount || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
