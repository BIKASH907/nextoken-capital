import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import InvestmentPayment from "../../components/InvestmentPayment";

export default function AssetDetail() {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;
  const [asset, setAsset]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [units, setUnits]         = useState(1);
  const [tab, setTab]             = useState("overview");
  const [msg, setMsg]             = useState("");
  const [msgType, setMsgType]     = useState("error");
  const [showWidget, setShowWidget] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch("/api/assets/" + id)
      .then(r => r.json())
      .then(d => {
        const a = d.asset || d;
        setAsset(a);
        const price = a.tokenPrice || 0;
        const minInvest = a.minInvestment || 100;
        if (price > 0) setUnits(Math.max(1, Math.ceil(minInvest / price)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ background: "#0B0E11", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>
      Loading asset...
    </div>
  );

  if (!asset) return (
    <div style={{ background: "#0B0E11", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
      Asset not found.&nbsp;<Link href="/marketplace" style={{ color: "#F0B90B" }}>Back to Markets</Link>
    </div>
  );

  const riskColor = { low: "#0ECB81", medium: "#f59e0b", high: "#ef4444" };
  const price     = asset.tokenPrice || 0;
  const yield_    = asset.targetROI || asset.annualYield || 0;
  const minInvest = asset.minInvestment || 100;
  const minUnits  = price > 0 ? Math.max(1, Math.ceil(minInvest / price)) : 1;
  const supply    = asset.tokenSupply || asset.totalTokens || 0;
  const term      = asset.term ? asset.term + " months" : asset.investmentTerm || "—";
  const total     = (price * units).toFixed(2);
  const annReturn = ((parseFloat(total) * yield_) / 100).toFixed(2);
  const docs      = asset.documents || [];
  const funded    = asset.targetRaise > 0 ? Math.min(100, Math.round(((asset.raisedAmount || 0) / asset.targetRaise) * 100)) : 0;

  const msgColors = {
    success: { bg: "#062015", border: "#065f46", color: "#0ECB81", icon: "✅" },
    error:   { bg: "#2d0a0a", border: "#7f1d1d", color: "#ef4444", icon: "❌" },
    warn:    { bg: "#2d1f00", border: "#5a3e00", color: "#F0B90B", icon: "⚠️" },
  };
  const mc = msgColors[msgType] || msgColors.error;

  return (
    <>
      <Head><title>{asset.name} — Nextoken Capital</title>
        <style>{`
          @media(max-width:768px){
            .asset-layout{grid-template-columns:1fr !important}
            .asset-sidebar{position:relative !important;top:auto !important}
            .asset-badges{gap:6px !important}
            .asset-info-grid{grid-template-columns:1fr !important}
            .asset-fin-grid{grid-template-columns:1fr !important}
            .asset-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch}
            .asset-tabs button{white-space:nowrap;font-size:12px !important;padding:10px 12px !important}
            .asset-unit-picks{flex-wrap:wrap !important}
          }
        `}</style></Head>
      <Navbar />
      <div style={{ background: "#0B0E11", minHeight: "100vh", paddingTop: 64 }}>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px 0" }}>
          <Link href="/marketplace" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>← Back to Markets</Link>
        </div>

        <div className="asset-layout" style={{ maxWidth: 1200, margin: "0 auto", padding: 20, display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>

          {/* ── LEFT ── */}
          <div>
            {/* Hero Image */}
            <div style={{ height: 320, background: "#0F1318", borderRadius: 14, overflow: "hidden", marginBottom: 20, border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {asset.imageUrl ? (
                <img src={asset.imageUrl} alt={asset.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
              ) : null}
              <div style={{ display: asset.imageUrl ? "none" : "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", fontSize: 80, color: "rgba(255,255,255,0.15)" }}>
                🏢
              </div>
            </div>

            {/* Badges + Title */}
            <div style={{ marginBottom: 20 }}>
              <div className="asset-badges" style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(240,185,11,0.1)", color: "#F0B90B", border: "1px solid rgba(240,185,11,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>
                  {(asset.assetType || "asset").replace(/_/g, " ")}
                </span>
                <span style={{ background: (riskColor[asset.riskLevel] || "#888") + "20", color: riskColor[asset.riskLevel] || "#888", border: "1px solid " + (riskColor[asset.riskLevel] || "#888"), borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>
                  {(asset.riskLevel || "medium")} Risk
                </span>
                {asset.status === "live" && (
                  <span style={{ background: "rgba(34,197,94,0.1)", color: "#0ECB81", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>● Live</span>
                )}
              </div>
              <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 28, margin: "0 0 6px" }}>{asset.name}</h1>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                📍 {asset.location || asset.country || "—"} · Issued by {asset.issuerName || "—"}
              </div>
            </div>

            {/* Tabs */}
            <div className="asset-tabs" style={{ display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 20 }}>
              {["overview", "financials", "documents"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", borderBottom: tab === t ? "2px solid #F0B90B" : "2px solid transparent", color: tab === t ? "#F0B90B" : "rgba(255,255,255,0.4)", padding: "10px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700, textTransform: "capitalize", fontFamily: "inherit" }}>
                  {t}
                </button>
              ))}
            </div>

            {/* OVERVIEW */}
            {tab === "overview" && (
              <div>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: 14, marginBottom: 20 }}>
                  {asset.description || "No description provided."}
                </p>
                <div className="asset-info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    ["Token Symbol",    asset.ticker || "—"],
                    ["Token Standard",  asset.tokenStandard || "ERC-3643"],
                    ["Total Supply",    supply.toLocaleString() + " tokens"],
                    ["Investment Term", term],
                    ["Yield Frequency", asset.yieldFrequency || "—"],
                    ["Eligibility",     (asset.eligibility || "—").replace(/_/g, " ")],
                    ["Country",         asset.country || "—"],
                    ["Currency",        asset.currency || "EUR"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 14 }}>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{k}</div>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, textTransform: "capitalize" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FINANCIALS */}
            {tab === "financials" && (
              <div>
                <div className="asset-fin-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  {[
                    ["Token Price",    price > 0 ? "€" + price : "—",                                     "#F0B90B"],
                    ["Annual Yield",   yield_ + "%",                                                        "#0ECB81"],
                    ["Min Investment", "€" + minInvest,                                                     "#3b82f6"],
                    ["Target Raise",   asset.targetRaise ? "€" + asset.targetRaise.toLocaleString() : "—", "#fff"],
                    ["Raised So Far",  "€" + (asset.raisedAmount || 0).toLocaleString(),                   "#fff"],
                    ["Total Supply",   supply.toLocaleString() + " tokens",                                 "#fff"],
                    ["Term",           term,                                                                 "#fff"],
                    ["Investors",      (asset.investorCount || 0).toString(),                               "#fff"],
                  ].map(([k, v, c]) => (
                    <div key={k} style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 14 }}>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{k}</div>
                      <div style={{ color: c, fontWeight: 700, fontSize: 18 }}>{v}</div>
                    </div>
                  ))}
                </div>
                {asset.targetRaise > 0 && (
                  <div style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>Funding Progress</span>
                      <span style={{ color: "#F0B90B", fontWeight: 700 }}>{funded}%</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 4, height: 8 }}>
                      <div style={{ width: funded + "%", height: "100%", background: "linear-gradient(90deg,#F0B90B,#FFD000)", borderRadius: 4 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                      <span>€{(asset.raisedAmount || 0).toLocaleString()} raised</span>
                      <span>€{(asset.targetRaise || 0).toLocaleString()} target</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DOCUMENTS */}
            {tab === "documents" && (
              <div>
                {docs.length === 0 ? (
                  <div style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                    <div>No documents uploaded yet</div>
                  </div>
                ) : docs.map((doc, i) => (
                  <div key={i} style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 16, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>📎 {doc.name || "Document " + (i + 1)}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 3, textTransform: "capitalize" }}>{doc.type || "document"}</div>
                    </div>
                    {doc.url
                      ? <a href={doc.url} target="_blank" rel="noreferrer" style={{ background: "rgba(240,185,11,0.1)", color: "#F0B90B", border: "1px solid rgba(240,185,11,0.2)", borderRadius: 6, padding: "8px 16px", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>Download ↗</a>
                      : <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>No file</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Invest Panel ── */}
          <div style={{ position: "sticky", top: 84, height: "fit-content" }}>

            {showWidget ? (
              /* LiFi Payment Widget */
              <div style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 }}>
                <InvestmentPayment
                  asset={asset}
                  units={units}
                  onBack={() => setShowWidget(false)}
                  onSuccess={data => {
                    setShowWidget(false);
                    setMsgType("success");
                    setMsg(data.message);
                  }}
                />
              </div>
            ) : (
              /* Normal Invest Panel */
              <>
                <div style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, marginBottom: 12 }}>

                  {/* Price */}
                  <div style={{ color: "#F0B90B", fontSize: 32, fontWeight: 900, marginBottom: 2 }}>
                    {price > 0 ? "€" + price : "Price TBD"}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 16 }}>
                    per token · Annual yield: {yield_}%
                  </div>

                  {/* Min investment notice */}
                  <div style={{ background: "rgba(240,185,11,0.06)", border: "1px solid rgba(240,185,11,0.15)", borderRadius: 8, padding: "8px 12px", marginBottom: 16, fontSize: 12, color: "#F0B90B" }}>
                    Min investment: <strong>€{minInvest}</strong>
                    {price > 0 && <span> = {minUnits} token{minUnits > 1 ? "s" : ""}</span>}
                  </div>

                  {/* Units input */}
                  <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Number of Tokens</label>
                  <input type="number" min={minUnits} value={units}
                    onChange={e => setUnits(Math.max(minUnits, parseInt(e.target.value) || minUnits))}
                    style={{ width: "100%", background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: 12, borderRadius: 8, fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 8, fontFamily: "inherit" }} />

                  {/* Quick picks */}
                  <div className="asset-unit-picks" style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                    {[minUnits, minUnits * 2, minUnits * 5, minUnits * 10, minUnits * 25].map(n => (
                      <button key={n} onClick={() => setUnits(n)}
                        style={{ flex: 1, background: units === n ? "#F0B90B" : "rgba(255,255,255,0.05)", color: units === n ? "#000" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 0", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>
                        {n}
                      </button>
                    ))}
                  </div>

                  {/* Summary */}
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 14, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>{units} tokens × €{price}</span>
                      <span style={{ color: "#fff" }}>€{total}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>Est. annual return ({yield_}%)</span>
                      <span style={{ color: "#0ECB81", fontWeight: 700 }}>€{annReturn}</span>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 15 }}>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Total</span>
                      <span style={{ color: "#F0B90B", fontWeight: 900, fontSize: 20 }}>€{total}</span>
                    </div>
                  </div>

                  {/* Invest Button */}
                  <button
                    onClick={() => {
                      if (!price) { setMsgType("error"); setMsg("Asset price not set yet"); return; }
                      setShowWidget(true);
                    }}
                    style={{ width: "100%", background: "#F0B90B", color: "#000", border: "none", borderRadius: 8, padding: 14, fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: 10, fontFamily: "inherit" }}>
                    Invest €{total} — Pay with Any Crypto
                  </button>

                  <Link href={"/exchange?asset=" + id}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 700, display: "block", textAlign: "center", textDecoration: "none" }}>
                    Trade on Exchange
                  </Link>

                  {/* Supported chains */}
                  <div style={{ marginTop: 14, display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
                    {["ETH", "Polygon", "Arbitrum", "BSC", "Base", "Optimism"].map(c => (
                      <span key={c} style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "2px 8px", fontSize: 10, color: "#555", fontWeight: 600 }}>{c}</span>
                    ))}
                  </div>

                  {/* Message */}
                  {msg && (
                    <div style={{ marginTop: 12, padding: 12, background: mc.bg, border: "1px solid " + mc.border, borderRadius: 8, color: mc.color, fontSize: 13, lineHeight: 1.5 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{mc.icon} {msgType === "error" ? "Error" : msgType === "warn" ? "Action Required" : "Success"}</div>
                      <div>{msg}</div>
                      {msgType === "warn" && msg.includes("KYC") && (
                        <Link href="/kyc" style={{ display: "inline-block", marginTop: 8, background: "#F0B90B", color: "#000", borderRadius: 6, padding: "6px 14px", textDecoration: "none", fontSize: 12, fontWeight: 800 }}>
                          🪪 Complete KYC
                        </Link>
                      )}
                    </div>
                  )}

                  <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                    🔒 KYC required · EU regulated · Polygon blockchain
                  </div>
                </div>

                {/* Quick stats */}
                <div style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16 }}>
                  {[
                    ["Symbol",   asset.ticker || "—"],
                    ["Supply",   supply.toLocaleString() + " tokens"],
                    ["Min",      "€" + minInvest],
                    ["Term",     term],
                    ["Standard", asset.tokenStandard || "ERC-3643"],
                    ["Chain",    "Polygon"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>{k}</span>
                      <span style={{ color: "#fff", fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
        <Footer />
      </div>
    </>
  );
}