import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATS  = ["All","real_estate","bond","equity","infrastructure","energy","fund","other"];
const RISKS = ["All","low","medium","high"];
const SORTS = ["Most Funded","Highest Yield","Lowest Min. Invest","Newest"];

function fmt(n) {
  if (!n) return "€0";
  if (n >= 1000000) return "€" + (n/1000000).toFixed(1) + "M";
  if (n >= 1000)    return "€" + (n/1000).toFixed(0) + "K";
  return "€" + n;
}

function pct(raised, target) {
  if (!raised || !target) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
}

const riskColor = { low: "#0ECB81", medium: "#F0B90B", high: "#ef4444" };

const ASSET_ICONS = {
  real_estate: "🏢", bond: "📄", equity: "📈",
  infrastructure: "🏭", energy: "⚡", fund: "💼", other: "💎"
};

export default function MarketsPage() {
  const [assets, setAssets]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat]         = useState("All");
  const [risk, setRisk]       = useState("All");
  const [sort, setSort]       = useState("Most Funded");
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetch("/api/assets/index")
      .then(r => r.json())
      .then(d => { setAssets(d.assets || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  let list = assets
    .filter(a => cat  === "All" || a.assetType === cat)
    .filter(a => risk === "All" || a.riskLevel  === risk)
    .filter(a => !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.location?.toLowerCase().includes(search.toLowerCase()));

  if (sort === "Highest Yield")      list = [...list].sort((a,b) => (b.annualYield||0) - (a.annualYield||0));
  if (sort === "Lowest Min. Invest") list = [...list].sort((a,b) => (a.minInvestment||0) - (b.minInvestment||0));
  if (sort === "Most Funded")        list = [...list].sort((a,b) => pct(b.raisedAmount,b.targetRaise) - pct(a.raisedAmount,a.targetRaise));
  if (sort === "Newest")             list = [...list].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <Head><title>Markets — Nextoken Capital</title>
        <style>{`
          @media(max-width:768px){
            .mk-grid{grid-template-columns:1fr !important}
            .mk-filters{flex-direction:column !important}
            .mk-filters>*{width:100% !important;min-width:auto !important}
            .mk-hero-stats{gap:20px !important}
            .mk-card-stats{grid-template-columns:1fr 1fr !important}
            .mk-card-btns{flex-direction:column !important}
          }
          @media(max-width:480px){
            .mk-hero-stats{flex-direction:column !important;gap:12px !important}
          }
        `}</style></Head>
      <Navbar />
      <div style={{ background: "#0B0E11", minHeight: "100vh", paddingTop: "64px" }}>

        {/* Hero */}
        <div style={{ padding: "60px 20px 40px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "inline-block", background: "rgba(240,185,11,0.1)", border: "1px solid rgba(240,185,11,0.2)", borderRadius: "20px", padding: "6px 16px", fontSize: "12px", color: "#F0B90B", fontWeight: "700", marginBottom: "16px", letterSpacing: "1px" }}>
            EU REGULATED · MiCA COMPLIANT · POLYGON BLOCKCHAIN
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: "900", color: "#fff", marginBottom: "14px" }}>
            Tokenized Investment Markets
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", maxWidth: "600px", margin: "0 auto 28px" }}>
            Invest in real-world assets — real estate, bonds, equity and infrastructure — starting from €100.
          </p>
          {/* Stats */}
          <div className="mk-hero-stats" style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
            {[
              ["Total Assets", list.length + " Listed"],
              ["Min Purchase", "€100"],
              ["Avg. Yield", list.length ? (list.reduce((s,a) => s + (a.annualYield||0), 0) / list.length).toFixed(1) + "%" : "—"],
              ["Blockchain", "Polygon"],
            ].map(([k,v]) => (
              <div key={k} style={{ textAlign: "center" }}>
                <div style={{ color: "#F0B90B", fontWeight: "900", fontSize: "20px" }}>{v}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" }}>{k}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px" }}>

          {/* Search + Filters */}
          <div className="mk-filters" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#555" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search assets, location..."
                style={{ width: "100%", background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 12px 10px 36px", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <select value={cat} onChange={e => setCat(e.target.value)}
              style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", outline: "none" }}>
              {CATS.map(c => <option key={c} value={c}>{c === "All" ? "All Types" : c.replace("_"," ").replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
            </select>
            <select value={risk} onChange={e => setRisk(e.target.value)}
              style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", outline: "none" }}>
              {RISKS.map(r => <option key={r} value={r}>{r === "All" ? "All Risk Levels" : r.charAt(0).toUpperCase()+r.slice(1)+" Risk"}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", outline: "none" }}>
              {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Results count */}
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "20px" }}>
            {loading ? "Loading assets..." : `Showing ${list.length} investment${list.length !== 1 ? "s" : ""}`}
          </div>

          {/* Asset Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px", color: "rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
              <div>Loading assets...</div>
            </div>
          ) : list.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              <div style={{ fontSize: "18px", marginBottom: "8px" }}>No assets found</div>
              <div style={{ fontSize: "14px" }}>Try adjusting your filters or check back soon</div>
            </div>
          ) : (
            <div className="mk-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
              {list.map(asset => {
                const progress = pct(asset.raisedAmount, asset.targetRaise);
                const icon = ASSET_ICONS[asset.assetType] || "💎";
                return (
                  <div key={asset._id} style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden", transition: "border-color 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(240,185,11,0.3)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>

                    {/* Image / Banner */}
                    <div style={{ height: "180px", background: "linear-gradient(135deg,#161B22,#0F1318)", position: "relative", overflow: "hidden" }}>
                      {asset.imageUrl ? (
                        <img src={asset.imageUrl} alt={asset.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px" }}>{icon}</div>
                      )}
                      {/* Badges */}
                      <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ background: "rgba(0,0,0,0.75)", color: riskColor[asset.riskLevel] || "#fff", border: "1px solid " + (riskColor[asset.riskLevel] || "#fff"), borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: "700", backdropFilter: "blur(4px)" }}>
                          {(asset.riskLevel || "medium").charAt(0).toUpperCase() + (asset.riskLevel || "medium").slice(1)} Risk
                        </span>
                        {asset.status === "live" && (
                          <span style={{ background: "rgba(14,203,129,0.15)", color: "#0ECB81", border: "1px solid rgba(14,203,129,0.3)", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: "700" }}>● Live</span>
                        )}
                      </div>
                      {/* Type badge */}
                      <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                        <span style={{ background: "rgba(0,0,0,0.75)", color: "rgba(255,255,255,0.7)", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", fontWeight: "600", textTransform: "capitalize", backdropFilter: "blur(4px)" }}>
                          {(asset.assetType || "asset").replace("_"," ")}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "18px" }}>
                      <div style={{ marginBottom: "12px" }}>
                        <h3 style={{ color: "#fff", fontWeight: "800", fontSize: "16px", margin: "0 0 4px" }}>{asset.name}</h3>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>📍 {asset.location || asset.country || "—"}</div>
                      </div>

                      {asset.description && (
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", lineHeight: "1.5", marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {asset.description}
                        </p>
                      )}

                      {/* Key stats */}
                      <div className="mk-card-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                        {[
                          ["Token Price", asset.tokenPrice ? "€" + asset.tokenPrice : "—"],
                          ["Est. Annual Return", asset.annualYield ? asset.annualYield + "%" : "—"],
                          ["Min. Invest",  asset.minInvestment ? "€" + asset.minInvestment : "—"],
                        ].map(([k,v]) => (
                          <div key={k} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "10px 8px", textAlign: "center" }}>
                            <div style={{ color: "#F0B90B", fontWeight: "800", fontSize: "14px" }}>{v}</div>
                            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", marginTop: "2px" }}>{k}</div>
                          </div>
                        ))}
                      </div>

                      {/* Progress bar */}
                      {asset.targetRaise > 0 && (
                        <div style={{ marginBottom: "14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "12px" }}>
                            <span style={{ color: "rgba(255,255,255,0.4)" }}>Funding Progress</span>
                            <span style={{ color: "#F0B90B", fontWeight: "700" }}>{progress}%</span>
                          </div>
                          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                            <div style={{ width: progress + "%", height: "100%", background: "linear-gradient(90deg,#F0B90B,#FFD000)", borderRadius: "4px", transition: "width 0.5s" }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                            <span>Raised: {fmt(asset.raisedAmount)}</span>
                            <span>Target: {fmt(asset.targetRaise)}</span>
                          </div>
                        </div>
                      )}

                      {/* Extra info row */}
                      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                        {asset.investmentTerm && <span>⏱ {asset.investmentTerm}</span>}
                        {asset.totalTokens && <span>🪙 {asset.totalTokens?.toLocaleString()} tokens</span>}
                        {asset.tokenStandard && <span>🔗 {asset.tokenStandard}</span>}
                      </div>

                      {/* Action buttons */}
                      <div className="mk-card-btns" style={{ display: "flex", gap: "8px" }}>
                        <Link href={"/asset/" + asset._id} style={{ flex: 1, background: "#F0B90B", color: "#000", borderRadius: "8px", padding: "11px", textAlign: "center", textDecoration: "none", fontWeight: "800", fontSize: "13px", display: "block" }}>
                          View & Invest
                        </Link>
                        <Link href={"/exchange?asset=" + asset._id} style={{ background: "rgba(255,255,255,0.07)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "11px 16px", textDecoration: "none", fontWeight: "700", fontSize: "13px", display: "block" }}>
                          Trade
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}