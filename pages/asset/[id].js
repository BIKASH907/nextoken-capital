import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AssetDetail() {
  const router  = useRouter();
  const { id }  = router.query;
  const [asset, setAsset]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [units, setUnits]   = useState(1);
  const [tab, setTab]       = useState("overview");
  const [msg, setMsg]       = useState("");

  useEffect(() => {
    if (!id) return;
    fetch("/api/assets/" + id)
      .then(r => r.json())
      .then(d => { setAsset(d.asset || d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleInvest() {
    const res = await fetch("/api/investments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId: id, units })
    });
    const data = await res.json();
    if (res.ok) setMsg("✅ Investment submitted successfully!");
    else if (res.status === 401) router.push("/login");
    else setMsg("❌ " + (data.error || "Failed"));
  }

  if (loading) return (
    <div style={{ background: "#0B0E11", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
      Loading...
    </div>
  );

  if (!asset) return (
    <div style={{ background: "#0B0E11", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
      Asset not found. <Link href="/markets" style={{ color: "#F0B90B", marginLeft: "8px" }}>Back to Markets</Link>
    </div>
  );

  const riskColor = { low: "#0ECB81", medium: "#F0B90B", high: "#FF4D4D" };
  const total = (parseFloat(asset.tokenPrice || 0) * units).toFixed(2);
  const docs   = asset.documents || [];

  return (
    <>
      <Head><title>{asset.name} — Nextoken Capital</title></Head>
      <Navbar />
      <div style={{ background: "#0B0E11", minHeight: "100vh", paddingTop: "64px" }}>

        {/* Back */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 20px 0" }}>
          <Link href="/markets" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none" }}>← Back to Markets</Link>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px" }}>

          {/* LEFT */}
          <div>
            {/* Hero image */}
            <div style={{ height: "320px", background: "#0F1318", borderRadius: "14px", overflow: "hidden", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.07)" }}>
              {asset.imageUrl
                ? <img src={asset.imageUrl} alt={asset.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px" }}>🏢</div>}
            </div>

            {/* Title */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(240,185,11,0.1)", color: "#F0B90B", border: "1px solid rgba(240,185,11,0.2)", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: "700", textTransform: "capitalize" }}>
                  {(asset.assetType || "asset").replace("_"," ")}
                </span>
                <span style={{ background: "rgba(0,0,0,0.3)", color: riskColor[asset.riskLevel] || "#fff", border: "1px solid " + (riskColor[asset.riskLevel] || "#555"), borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: "700" }}>
                  {(asset.riskLevel || "medium").charAt(0).toUpperCase() + (asset.riskLevel || "medium").slice(1)} Risk
                </span>
                {asset.status === "live" && (
                  <span style={{ background: "rgba(14,203,129,0.1)", color: "#0ECB81", border: "1px solid rgba(14,203,129,0.2)", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: "700" }}>● Live</span>
                )}
              </div>
              <h1 style={{ color: "#fff", fontWeight: "900", fontSize: "28px", margin: "0 0 6px" }}>{asset.name}</h1>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>📍 {asset.location || asset.country || "—"} · Issued by {asset.issuerName || "—"}</div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "20px" }}>
              {["overview","financials","documents"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", borderBottom: tab === t ? "2px solid #F0B90B" : "2px solid transparent", color: tab === t ? "#F0B90B" : "rgba(255,255,255,0.4)", padding: "10px 18px", cursor: "pointer", fontSize: "13px", fontWeight: "700", textTransform: "capitalize" }}>{t}</button>
              ))}
            </div>

            {/* Overview */}
            {tab === "overview" && (
              <div>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.7", fontSize: "14px", marginBottom: "20px" }}>
                  {asset.description || "No description provided."}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    ["Token Symbol",    asset.ticker || asset.tokenSymbol || "—"],
                    ["Token Standard",  asset.tokenStandard || "ERC-3643"],
                    ["Total Supply",    asset.totalTokens?.toLocaleString() || "—"],
                    ["Investment Term", asset.investmentTerm || "—"],
                    ["Yield Frequency", asset.yieldFrequency || "—"],
                    ["Eligibility",     asset.eligibility || "—"],
                    ["Country",         asset.country || "—"],
                    ["ISIN",            asset.isin || "—"],
                  ].map(([k,v]) => (
                    <div key={k} style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "14px" }}>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>{k}</div>
                      <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px", textTransform: "capitalize" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financials */}
            {tab === "financials" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    ["Target Raise",    asset.targetRaise ? "€" + asset.targetRaise?.toLocaleString() : "—"],
                    ["Raised So Far",   asset.raisedAmount ? "€" + asset.raisedAmount?.toLocaleString() : "—"],
                    ["Token Price",     asset.tokenPrice ? "€" + asset.tokenPrice : "—"],
                    ["Min Investment",  asset.minInvestment ? "€" + asset.minInvestment : "—"],
                    ["Annual Yield",    asset.annualYield ? asset.annualYield + "%" : "—"],
                    ["Max Investment",  asset.maxInvestment ? "€" + asset.maxInvestment : "Unlimited"],
                    ["Valuation",       asset.valuation ? "€" + asset.valuation?.toLocaleString() : "—"],
                    ["IRR Projection",  asset.projectedIRR ? asset.projectedIRR + "%" : "—"],
                  ].map(([k,v]) => (
                    <div key={k} style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "14px" }}>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>{k}</div>
                      <div style={{ color: "#F0B90B", fontWeight: "700", fontSize: "16px" }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                {asset.targetRaise > 0 && (
                  <div style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px", marginTop: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Funding Progress</span>
                      <span style={{ color: "#F0B90B", fontWeight: "700" }}>{Math.min(100, Math.round(((asset.raisedAmount||0)/asset.targetRaise)*100))}%</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "4px", height: "8px" }}>
                      <div style={{ width: Math.min(100, Math.round(((asset.raisedAmount||0)/asset.targetRaise)*100)) + "%", height: "100%", background: "linear-gradient(90deg,#F0B90B,#FFD000)", borderRadius: "4px" }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Documents */}
            {tab === "documents" && (
              <div>
                {docs.length === 0 ? (
                  <div style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>📂</div>
                    <div>No documents uploaded yet</div>
                  </div>
                ) : docs.map((doc, i) => (
                  <div key={i} style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>📎 {doc.name || "Document " + (i+1)}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "3px", textTransform: "capitalize" }}>{doc.type || "document"}</div>
                    </div>
                    {doc.url
                      ? <a href={doc.url} target="_blank" rel="noreferrer" style={{ background: "rgba(240,185,11,0.1)", color: "#F0B90B", border: "1px solid rgba(240,185,11,0.2)", borderRadius: "6px", padding: "8px 16px", textDecoration: "none", fontSize: "13px", fontWeight: "700" }}>Download ↗</a>
                      : <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>No file</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Invest panel */}
          <div style={{ position: "sticky", top: "84px", height: "fit-content" }}>
            <div style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px", marginBottom: "12px" }}>
              <div style={{ color: "#F0B90B", fontSize: "28px", fontWeight: "900", marginBottom: "4px" }}>
                €{asset.tokenPrice || "—"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "20px" }}>per token · Annual yield: {asset.annualYield ? asset.annualYield + "%" : "—"}</div>

              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "7px" }}>Number of Tokens</label>
              <input type="number" min="1" value={units} onChange={e => setUnits(Math.max(1, parseInt(e.target.value)||1))}
                style={{ width: "100%", background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "12px", borderRadius: "8px", fontSize: "16px", outline: "none", boxSizing: "border-box", marginBottom: "8px" }} />

              {/* Quick picks */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
                {[1,5,10,25,50].map(n => (
                  <button key={n} onClick={() => setUnits(n)} style={{ flex: 1, background: units === n ? "#F0B90B" : "rgba(255,255,255,0.05)", color: units === n ? "#000" : "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px 0", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}>{n}</button>
                ))}
              </div>

              {/* Total */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>{units} × €{asset.tokenPrice}</span>
                  <span style={{ color: "#fff" }}>€{total}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>Est. Annual Return</span>
                  <span style={{ color: "#0ECB81", fontWeight: "700" }}>€{((parseFloat(total) * (asset.annualYield||0)) / 100).toFixed(2)}</span>
                </div>
              </div>

              <button onClick={handleInvest}
                style={{ width: "100%", background: "#F0B90B", color: "#000", border: "none", borderRadius: "8px", padding: "14px", fontSize: "15px", fontWeight: "900", cursor: "pointer", marginBottom: "10px" }}>
                Invest €{total}
              </button>

              <Link href={"/exchange?asset=" + asset._id}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "block", textAlign: "center", textDecoration: "none" }}>
                Trade on Exchange
              </Link>

              {msg && (
                <div style={{ marginTop: "12px", padding: "12px", background: msg.startsWith("✅") ? "#052e16" : "#2d0a0a", border: "1px solid " + (msg.startsWith("✅") ? "#065f46" : "#7f1d1d"), borderRadius: "8px", color: msg.startsWith("✅") ? "#4ade80" : "#f87171", fontSize: "13px", textAlign: "center" }}>
                  {msg}
                </div>
              )}

              <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", textAlign: "center", marginTop: "12px", lineHeight: "1.5" }}>
                🔒 KYC required to invest · EU regulated · Polygon blockchain
              </div>
            </div>

            {/* Asset quick stats */}
            <div style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "16px" }}>
              {[
                ["Token Symbol",  asset.ticker || asset.tokenSymbol || "—"],
                ["Total Tokens",  asset.totalTokens?.toLocaleString() || "—"],
                ["Min Invest",    asset.minInvestment ? "€" + asset.minInvestment : "—"],
                ["Term",          asset.investmentTerm || "—"],
                ["Standard",      asset.tokenStandard || "ERC-3643"],
              ].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "13px" }}>
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>{k}</span>
                  <span style={{ color: "#fff", fontWeight: "600" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}