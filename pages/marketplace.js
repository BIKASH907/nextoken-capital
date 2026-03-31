import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Marketplace() {
  const router = useRouter();
  const { data: session } = useSession();
  const [assets, setAssets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAssets(); }, []);

  const loadAssets = () => fetch("/api/assets")
    .then(r => r.json())
    .then(d => { setAssets(d.assets || []); setLoading(false); })
    .catch(() => setLoading(false));

  const priceOf = (a) => a.tokenPrice || (a.targetRaise && a.tokenSupply ? Math.round(a.targetRaise / a.tokenSupply) : 100);
  const riskOf  = (a) => (a.targetROI || 0) > 15 ? "High" : (a.targetROI || 0) > 10 ? "Medium" : "Low";
  const riskColor = (r) => ({ High: "#ef4444", Medium: "#f59e0b", Low: "#0ECB81" }[r]);
  const typeIcon  = (t) => ({ real_estate: "🏢", bond: "📜", equity: "📈", fund: "💼", energy: "⚡", commodity: "🪙", infrastructure: "🏗️" }[t] || "📦");
  const soldPct   = (a) => a.soldUnits && a.tokenSupply ? Math.round(a.soldUnits / a.tokenSupply * 100) : 0;

  const types    = ["All", ...new Set(assets.map(a => a.assetType).filter(Boolean))];
  const filtered = filter === "All" ? assets : assets.filter(a => a.assetType === filter);

  return (
    <>
      <Head><title>Marketplace — Nextoken Capital</title>
        <style>{`
          @media(max-width:768px){
            .mp-stats{flex-direction:column !important}
            .mp-grid{grid-template-columns:1fr !important}
            .mp-head h1{font-size:24px !important}
            .mp-filters{gap:4px !important}
            .mp-filters button{padding:5px 10px !important;font-size:11px !important}
          }
          @media(max-width:480px){
            .mp-stats>div{min-width:100% !important}
          }
        `}</style></Head>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#0B0E11", color: "#fff", paddingTop: 70 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>

          {/* HEADER */}
          <div style={{ marginBottom: 28 }}>
            <h1 className="mp-head" style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>Invest in Tokenized Assets</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 600 }}>
              Browse verified real-world assets. Each listing undergoes compliance review, financial verification, and legal structuring before reaching investors.
            </p>
          </div>

          {/* STATS */}
          <div className="mp-stats" style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            {[
              { l: "Listed Assets",   v: assets.length, c: "#F0B90B" },
              { l: "Asset Types",     v: new Set(assets.map(a => a.assetType)).size, c: "#8b5cf6" },
              { l: "Min Purchase",  v: "EUR 100", c: "#0ECB81" },
              { l: "Avg Yield",       v: assets.length ? (assets.reduce((s, a) => s + (a.targetROI || 0), 0) / assets.length).toFixed(1) + "%" : "—", c: "#3b82f6" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 20px", flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* FILTERS */}
          <div className="mp-filters" style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{ padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: filter === t ? "#F0B90B15" : "rgba(255,255,255,0.04)", color: filter === t ? "#F0B90B" : "rgba(255,255,255,0.4)", border: filter === t ? "1px solid #F0B90B30" : "1px solid rgba(255,255,255,0.06)", textTransform: "capitalize" }}>
                {t === "All" ? "All Assets" : t.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          {/* ASSET GRID */}
          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>Loading assets...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>No assets available yet. Check back soon.</div>
          ) : (
            <div className="mp-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
              {filtered.map(a => {
                const risk = riskOf(a);
                const pct  = soldPct(a);
                return (
                  <div key={a._id} onClick={() => router.push("/asset/" + a._id)}
                    style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "border .2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(240,185,11,0.3)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>

                    {/* Image */}
                    {a.imageUrl ? (
                      <img src={a.imageUrl} alt={a.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                    ) : (
                      <div style={{ height: 160, background: "rgba(240,185,11,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>
                        {typeIcon(a.assetType)}
                      </div>
                    )}

                    {/* Top bar */}
                    <div style={{ padding: "14px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{a.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "capitalize", marginTop: 2 }}>
                          {(a.assetType || "").replace(/_/g, " ")} · {a.location || a.country || "EU"}
                        </div>
                      </div>
                      <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 6, background: riskColor(risk) + "20", color: riskColor(risk), fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8 }}>
                        {risk} Risk
                      </span>
                    </div>

                    {/* Body */}
                    <div style={{ padding: "12px 20px 16px" }}>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 14, minHeight: 36 }}>
                        {(a.description || "").slice(0, 120)}{(a.description || "").length > 120 ? "..." : ""}
                      </p>

                      {/* Key metrics */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                        {[
                          { l: "TOKEN PRICE",   v: "EUR " + priceOf(a),          c: "#F0B90B" },
                          { l: "EST. RETURN",  v: (a.targetROI || 0) + "%",     c: "#0ECB81" },
                          { l: "MIN PURCHASE",    v: "EUR " + (a.minInvestment || 100), c: "#3b82f6" },
                        ].map(({ l, v, c }) => (
                          <div key={l} style={{ background: "#0a0e14", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>{l}</div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: c }}>{v}</div>
                          </div>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                          <span>{pct}% funded</span>
                          <span>EUR {(a.targetRaise || 0).toLocaleString()}</span>
                        </div>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                          <div style={{ height: 6, background: "#F0B90B", borderRadius: 3, width: pct + "%", transition: "width .3s" }} />
                        </div>
                      </div>

                      {/* Details row */}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
                        <span>Supply: {(a.tokenSupply || 0).toLocaleString()} tokens</span>
                        <span>Term: {a.term || "—"} months</span>
                        <span>ERC-3643</span>
                      </div>

                      {/* Buttons */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={e => { e.stopPropagation(); if (!session) { router.push("/login"); return; } router.push("/asset/" + a._id); }}
                          style={{ flex: 1, padding: 12, background: "#F0B90B", color: "#000", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                          Buy Now
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); router.push("/exchange?asset=" + a._id); }}
                          style={{ padding: "12px 20px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#8b5cf6", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          Trade
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ background: "rgba(255,255,255,0.02)", padding: "8px 20px", display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                      <span>30-day min hold for profit</span>
                      <span>Non-custodial purchase · Direct to issuer</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* HOW IT WORKS */}
          <div style={{ marginTop: 40, background: "#161b22", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", padding: "30px 24px" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#F0B90B", marginBottom: 16 }}>How It Works</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {[
                { n: "1", t: "Browse Assets",   d: "Explore verified tokenized real-world assets with full documentation." },
                { n: "2", t: "Complete KYC",    d: "Verify your identity via Sumsub. Takes 2-5 minutes." },
                { n: "3", t: "Fund Wallet",     d: "Deposit EUR via card, SEPA, or crypto to your platform wallet." },
                { n: "4", t: "Invest",          d: "Buy tokens from EUR 100. Each token represents fractional ownership." },
                { n: "5", t: "Earn Returns",    d: "Hold 30+ days to receive profit distributions. Trade anytime on exchange." },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F0B90B15", color: "#F0B90B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, margin: "0 auto 10px" }}>{s.n}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.t}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{s.d}</div>
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