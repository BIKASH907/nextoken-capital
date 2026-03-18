import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const allMarkets = [
  {
    id: 1,
    name: "Tokenized Office Building",
    location: "Berlin, Germany",
    category: "Property",
    icon: "🏢",
    roi: "16.4%",
    minInvest: "€500",
    funded: 78,
    total: "€2,400,000",
    raised: "€1,872,000",
    status: "Live",
    term: "36 months",
    risk: "Low",
  },
  {
    id: 2,
    name: "Solar Farm Portfolio",
    location: "Alicante, Spain",
    category: "Energy",
    icon: "☀️",
    roi: "18.2%",
    minInvest: "€250",
    funded: 92,
    total: "€5,000,000",
    raised: "€4,600,000",
    status: "Closing Soon",
    term: "60 months",
    risk: "Low",
  },
  {
    id: 3,
    name: "Logistics Hub",
    location: "Warsaw, Poland",
    category: "Infrastructure",
    icon: "🏭",
    roi: "15.1%",
    minInvest: "€1,000",
    funded: 45,
    total: "€8,000,000",
    raised: "€3,600,000",
    status: "Live",
    term: "48 months",
    risk: "Medium",
  },
  {
    id: 4,
    name: "Residential Complex",
    location: "Lisbon, Portugal",
    category: "Property",
    icon: "🏘️",
    roi: "14.8%",
    minInvest: "€500",
    funded: 60,
    total: "€3,200,000",
    raised: "€1,920,000",
    status: "Live",
    term: "24 months",
    risk: "Low",
  },
  {
    id: 5,
    name: "Wind Energy Project",
    location: "Gdańsk, Poland",
    category: "Energy",
    icon: "💨",
    roi: "17.6%",
    minInvest: "€250",
    funded: 33,
    total: "€6,500,000",
    raised: "€2,145,000",
    status: "Live",
    term: "72 months",
    risk: "Medium",
  },
  {
    id: 6,
    name: "Retail Shopping Centre",
    location: "Amsterdam, Netherlands",
    category: "Commercial",
    icon: "🛍️",
    roi: "13.9%",
    minInvest: "€1,000",
    funded: 88,
    total: "€4,000,000",
    raised: "€3,520,000",
    status: "Closing Soon",
    term: "36 months",
    risk: "Low",
  },
  {
    id: 7,
    name: "Tech Business Park",
    location: "Dublin, Ireland",
    category: "Commercial",
    icon: "💼",
    roi: "15.9%",
    minInvest: "€500",
    funded: 20,
    total: "€10,000,000",
    raised: "€2,000,000",
    status: "Live",
    term: "60 months",
    risk: "Medium",
  },
  {
    id: 8,
    name: "Green Hydrogen Plant",
    location: "Rotterdam, Netherlands",
    category: "Energy",
    icon: "⚗️",
    roi: "18.8%",
    minInvest: "€2,000",
    funded: 15,
    total: "€12,000,000",
    raised: "€1,800,000",
    status: "Live",
    term: "84 months",
    risk: "High",
  },
  {
    id: 9,
    name: "Student Housing Block",
    location: "Prague, Czechia",
    category: "Property",
    icon: "🏠",
    roi: "14.2%",
    minInvest: "€250",
    funded: 71,
    total: "€1,800,000",
    raised: "€1,278,000",
    status: "Live",
    term: "24 months",
    risk: "Low",
  },
];

const categories = ["All", "Property", "Energy", "Infrastructure", "Commercial"];
const riskLevels = ["All", "Low", "Medium", "High"];

const riskColor = { Low: "#35d0b2", Medium: "#ffda7a", High: "#ff6b6b" };
const statusColor = {
  Live: { bg: "rgba(53,208,178,0.12)", border: "rgba(53,208,178,0.3)", text: "#35d0b2" },
  "Closing Soon": { bg: "rgba(255,218,122,0.12)", border: "rgba(255,218,122,0.3)", text: "#ffda7a" },
};

export default function Markets() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [risk, setRisk] = useState("All");
  const [sortBy, setSortBy] = useState("funded");
  const [view, setView] = useState("grid"); // grid | list

  const filtered = allMarkets
    .filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.location.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || m.category === category;
      const matchRisk = risk === "All" || m.risk === risk;
      return matchSearch && matchCat && matchRisk;
    })
    .sort((a, b) => {
      if (sortBy === "roi") return parseFloat(b.roi) - parseFloat(a.roi);
      if (sortBy === "funded") return b.funded - a.funded;
      if (sortBy === "min") return parseInt(a.minInvest.replace(/\D/g, "")) - parseInt(b.minInvest.replace(/\D/g, ""));
      return 0;
    });

  return (
    <>
      <Head>
        <title>Markets — Nextoken Capital</title>
        <meta
          name="description"
          content="Browse all tokenized real-world asset investment opportunities on Nextoken Capital."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="markets-page">
        <div className="sparkle" />

        <div className="container">

          {/* ── PAGE HEADER ── */}
          <div className="pageHeader">
            <div>
              <div className="pageTag">Live Opportunities</div>
              <h1>
                Tokenized <span className="gold">Markets</span>
              </h1>
              <p>
                Browse, filter and invest in real-world asset opportunities —
                property, energy, infrastructure and more.
              </p>
            </div>
            <div className="headerStats">
              <div className="hStat">
                <span className="hStatNum">9</span>
                <span className="hStatLbl">Active Projects</span>
              </div>
              <div className="hStatDiv" />
              <div className="hStat">
                <span className="hStatNum">€50M+</span>
                <span className="hStatLbl">Total Assets</span>
              </div>
              <div className="hStatDiv" />
              <div className="hStat">
                <span className="hStatNum">18.8%</span>
                <span className="hStatLbl">Top ROI</span>
              </div>
            </div>
          </div>

          {/* ── FILTERS ── */}
          <div className="filtersBar">
            <div className="searchWrap">
              <span className="searchIcon">🔍</span>
              <input
                type="text"
                placeholder="Search by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="searchInput"
              />
            </div>

            <div className="filterGroup">
              <label>Category</label>
              <div className="pills">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`pill ${category === c ? "pillActive" : ""}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="filterGroup">
              <label>Risk</label>
              <div className="pills">
                {riskLevels.map((r) => (
                  <button
                    key={r}
                    className={`pill ${risk === r ? "pillActive" : ""}`}
                    onClick={() => setRisk(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="filterGroup">
              <label>Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="selectInput"
              >
                <option value="funded">% Funded</option>
                <option value="roi">Highest ROI</option>
                <option value="min">Min. Investment</option>
              </select>
            </div>

            <div className="viewToggle">
              <button
                className={`viewBtn ${view === "grid" ? "viewActive" : ""}`}
                onClick={() => setView("grid")}
                title="Grid view"
              >
                ▦
              </button>
              <button
                className={`viewBtn ${view === "list" ? "viewActive" : ""}`}
                onClick={() => setView("list")}
                title="List view"
              >
                ☰
              </button>
            </div>
          </div>

          {/* ── RESULTS COUNT ── */}
          <div className="resultsRow">
            <span className="resultsCount">
              Showing <strong>{filtered.length}</strong> of {allMarkets.length} opportunities
            </span>
          </div>

          {/* ── GRID VIEW ── */}
          {view === "grid" && (
            <div className="marketsGrid">
              {filtered.length === 0 && (
                <div className="emptyState">
                  <span>🔍</span>
                  <p>No markets match your filters. Try adjusting your search.</p>
                </div>
              )}
              {filtered.map((m) => (
                <article className="marketCard" key={m.id}>
                  <div className="cardTop">
                    <div className="cardIcon">{m.icon}</div>
                    <div className="cardMeta">
                      <span
                        className="statusBadge"
                        style={{
                          background: statusColor[m.status]?.bg,
                          border: `1px solid ${statusColor[m.status]?.border}`,
                          color: statusColor[m.status]?.text,
                        }}
                      >
                        {m.status}
                      </span>
                      <span
                        className="riskBadge"
                        style={{ color: riskColor[m.risk] }}
                      >
                        ● {m.risk} Risk
                      </span>
                    </div>
                  </div>

                  <h3>{m.name}</h3>
                  <div className="cardLocation">📍 {m.location}</div>
                  <div className="cardCategory">{m.category}</div>

                  <div className="cardStats">
                    <div className="cStat">
                      <span className="cStatVal gold">{m.roi}</span>
                      <span className="cStatLbl">Target ROI</span>
                    </div>
                    <div className="cStat">
                      <span className="cStatVal">{m.minInvest}</span>
                      <span className="cStatLbl">Min. Invest</span>
                    </div>
                    <div className="cStat">
                      <span className="cStatVal">{m.term}</span>
                      <span className="cStatLbl">Term</span>
                    </div>
                  </div>

                  <div className="progressWrap">
                    <div className="progressTop">
                      <span>Funded</span>
                      <span className="progressPct">{m.funded}%</span>
                    </div>
                    <div className="progressBar">
                      <div
                        className="progressFill"
                        style={{ width: `${m.funded}%` }}
                      />
                    </div>
                    <div className="progressBottom">
                      <span>{m.raised} raised</span>
                      <span>{m.total} goal</span>
                    </div>
                  </div>

                  <button
                    className="investBtn"
                    onClick={() => router.push(`/asset/${m.id}`)}
                  >
                    View & Invest →
                  </button>
                </article>
              ))}
            </div>
          )}

          {/* ── LIST VIEW ── */}
          {view === "list" && (
            <div className="listWrap">
              {filtered.length === 0 && (
                <div className="emptyState">
                  <span>🔍</span>
                  <p>No markets match your filters. Try adjusting your search.</p>
                </div>
              )}
              <div className="listHeader">
                <span>Asset</span>
                <span>Category</span>
                <span>ROI</span>
                <span>Min. Invest</span>
                <span>Funded</span>
                <span>Risk</span>
                <span>Status</span>
                <span></span>
              </div>
              {filtered.map((m) => (
                <div className="listRow" key={m.id}>
                  <div className="listAsset">
                    <div className="listIcon">{m.icon}</div>
                    <div>
                      <div className="listName">{m.name}</div>
                      <div className="listLoc">📍 {m.location}</div>
                    </div>
                  </div>
                  <span className="listCat">{m.category}</span>
                  <span className="listRoi gold">{m.roi}</span>
                  <span className="listMin">{m.minInvest}</span>
                  <div className="listFunded">
                    <div className="listBar">
                      <div className="listFill" style={{ width: `${m.funded}%` }} />
                    </div>
                    <span>{m.funded}%</span>
                  </div>
                  <span style={{ color: riskColor[m.risk], fontWeight: 600, fontSize: 13 }}>
                    {m.risk}
                  </span>
                  <span
                    className="statusBadge"
                    style={{
                      background: statusColor[m.status]?.bg,
                      border: `1px solid ${statusColor[m.status]?.border}`,
                      color: statusColor[m.status]?.text,
                    }}
                  >
                    {m.status}
                  </span>
                  <button
                    className="listInvestBtn"
                    onClick={() => router.push(`/asset/${m.id}`)}
                  >
                    Invest →
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── BOTTOM CTA ── */}
          <div className="bottomCta">
            <p>
              Don&apos;t have an account yet?{" "}
              <button className="ctaLink" onClick={() => router.push("/register")}>
                Register free and start investing →
              </button>
            </p>
          </div>

        </div>
      </main>

      <style jsx>{`
        /* ── BASE ── */
        .markets-page {
          min-height: 100vh;
          background:
            radial-gradient(1200px 800px at 10% 5%, rgba(255,187,60,0.15), transparent 55%),
            radial-gradient(1000px 700px at 90% 15%, rgba(58,160,255,0.12), transparent 55%),
            linear-gradient(180deg, #05060a, #0b0d14);
          color: #eef1ff;
          position: relative;
          overflow-x: hidden;
          font-family: "Segoe UI", system-ui, sans-serif;
        }

        .container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 32px 18px 60px;
        }

        .sparkle {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.15;
          background-image:
            radial-gradient(2px 2px at 10% 20%, #fff, transparent 60%),
            radial-gradient(1px 1px at 50% 40%, #fff, transparent 60%),
            radial-gradient(1px 1px at 80% 30%, #fff, transparent 60%),
            radial-gradient(1px 1px at 20% 80%, #fff, transparent 60%),
            radial-gradient(2px 2px at 70% 75%, #fff, transparent 60%);
        }

        /* ── PAGE HEADER ── */
        .pageHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .pageTag {
          display: inline-block;
          margin-bottom: 10px;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,218,122,0.22);
          color: #ffda7a;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          background: rgba(255,255,255,0.03);
        }

        .pageHeader h1 {
          margin: 0 0 8px;
          font-size: 38px;
          font-weight: 900;
          line-height: 1.08;
        }

        .pageHeader p {
          margin: 0;
          color: rgba(238,241,255,0.7);
          font-size: 15px;
          max-width: 480px;
          line-height: 1.55;
        }

        .gold {
          background: linear-gradient(180deg, #ffda7a, #b97b23);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .headerStats {
          display: flex;
          align-items: center;
          gap: 0;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          padding: 14px 20px;
          flex-shrink: 0;
        }

        .hStat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 0 18px;
        }

        .hStatNum {
          font-size: 20px;
          font-weight: 900;
          background: linear-gradient(180deg, #ffda7a, #b97b23);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hStatLbl {
          font-size: 11px;
          color: rgba(238,241,255,0.55);
          white-space: nowrap;
        }

        .hStatDiv {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.1);
        }

        /* ── FILTERS ── */
        .filtersBar {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          flex-wrap: wrap;
          padding: 18px 20px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          margin-bottom: 14px;
        }

        .searchWrap {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .searchIcon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          pointer-events: none;
        }

        .searchInput {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color: #eef1ff;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .searchInput::placeholder {
          color: rgba(238,241,255,0.35);
        }

        .searchInput:focus {
          border-color: rgba(255,218,122,0.4);
        }

        .filterGroup {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filterGroup label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(255,218,122,0.7);
        }

        .pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .pill {
          padding: 7px 13px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          color: rgba(238,241,255,0.75);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
        }

        .pill:hover {
          border-color: rgba(255,218,122,0.35);
          color: #ffda7a;
        }

        .pillActive {
          border-color: rgba(255,218,122,0.5) !important;
          background: rgba(255,218,122,0.12) !important;
          color: #ffda7a !important;
        }

        .selectInput {
          padding: 9px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color: #eef1ff;
          font-size: 13.5px;
          outline: none;
          cursor: pointer;
        }

        .selectInput option {
          background: #0e1018;
        }

        .viewToggle {
          display: flex;
          gap: 6px;
          margin-left: auto;
        }

        .viewBtn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          color: rgba(238,241,255,0.6);
          font-size: 16px;
          cursor: pointer;
          transition: all 0.18s;
          display: grid;
          place-items: center;
        }

        .viewActive {
          border-color: rgba(255,218,122,0.5) !important;
          background: rgba(255,218,122,0.12) !important;
          color: #ffda7a !important;
        }

        /* ── RESULTS ROW ── */
        .resultsRow {
          margin-bottom: 16px;
        }

        .resultsCount {
          font-size: 13px;
          color: rgba(238,241,255,0.5);
        }

        .resultsCount strong {
          color: #ffda7a;
        }

        /* ── GRID VIEW ── */
        .marketsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .marketCard {
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.12);
          background:
            radial-gradient(300px 180px at 80% 10%, rgba(255,193,90,0.13), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
          box-shadow: 0 16px 40px rgba(0,0,0,0.35);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .marketCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 50px rgba(0,0,0,0.45);
          border-color: rgba(255,218,122,0.2);
        }

        .cardTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cardIcon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(255,218,122,0.9), rgba(185,123,35,0.9));
          display: grid;
          place-items: center;
          font-size: 22px;
        }

        .cardMeta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
        }

        .statusBadge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .riskBadge {
          font-size: 11px;
          font-weight: 600;
        }

        .marketCard h3 {
          margin: 0;
          font-size: 15.5px;
          line-height: 1.3;
          font-weight: 700;
        }

        .cardLocation {
          font-size: 12.5px;
          color: rgba(238,241,255,0.55);
        }

        .cardCategory {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 11px;
          font-weight: 600;
          color: rgba(238,241,255,0.7);
          align-self: flex-start;
        }

        .cardStats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .cStat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .cStatVal {
          font-size: 15px;
          font-weight: 800;
          color: #eef1ff;
        }

        .cStatVal.gold {
          background: linear-gradient(180deg, #ffda7a, #b97b23);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .cStatLbl {
          font-size: 10.5px;
          color: rgba(238,241,255,0.45);
          text-align: center;
        }

        /* Progress */
        .progressWrap {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .progressTop {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: rgba(238,241,255,0.55);
        }

        .progressPct {
          font-weight: 700;
          color: #ffda7a;
        }

        .progressBar {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .progressFill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #ffda7a, #f5a623);
          transition: width 0.4s ease;
        }

        .progressBottom {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: rgba(238,241,255,0.4);
        }

        .investBtn {
          width: 100%;
          padding: 11px;
          border-radius: 12px;
          border: 0;
          background: linear-gradient(135deg, #ffda7a, #f5c15a);
          color: #111;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(255,193,90,0.2);
          margin-top: auto;
        }

        .investBtn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(255,193,90,0.3);
        }

        /* ── LIST VIEW ── */
        .listWrap {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
        }

        .listHeader {
          display: grid;
          grid-template-columns: 2.5fr 1fr 0.8fr 0.8fr 1.2fr 0.7fr 1fr 0.8fr;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(255,218,122,0.7);
        }

        .listRow {
          display: grid;
          grid-template-columns: 2.5fr 1fr 0.8fr 0.8fr 1.2fr 0.7fr 1fr 0.8fr;
          gap: 8px;
          padding: 14px 20px;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.01);
          transition: background 0.15s;
        }

        .listRow:last-child {
          border-bottom: none;
        }

        .listRow:hover {
          background: rgba(255,255,255,0.04);
        }

        .listAsset {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .listIcon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255,218,122,0.9), rgba(185,123,35,0.9));
          display: grid;
          place-items: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .listName {
          font-size: 13.5px;
          font-weight: 700;
          line-height: 1.3;
        }

        .listLoc {
          font-size: 11.5px;
          color: rgba(238,241,255,0.5);
          margin-top: 2px;
        }

        .listCat {
          font-size: 12.5px;
          color: rgba(238,241,255,0.65);
        }

        .listRoi {
          font-size: 14px;
          font-weight: 800;
        }

        .listMin {
          font-size: 13px;
          font-weight: 600;
          color: rgba(238,241,255,0.85);
        }

        .listFunded {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .listBar {
          flex: 1;
          height: 5px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .listFill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #ffda7a, #f5a623);
        }

        .listFunded span {
          font-size: 12px;
          font-weight: 700;
          color: #ffda7a;
          white-space: nowrap;
        }

        .listInvestBtn {
          padding: 7px 14px;
          border-radius: 10px;
          border: 0;
          background: linear-gradient(135deg, #ffda7a, #f5c15a);
          color: #111;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }

        .listInvestBtn:hover {
          box-shadow: 0 6px 20px rgba(255,193,90,0.3);
        }

        /* ── EMPTY STATE ── */
        .emptyState {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 60px 20px;
          color: rgba(238,241,255,0.5);
          font-size: 15px;
          text-align: center;
        }

        .emptyState span {
          font-size: 40px;
        }

        /* ── BOTTOM CTA ── */
        .bottomCta {
          margin-top: 32px;
          text-align: center;
          font-size: 15px;
          color: rgba(238,241,255,0.6);
        }

        .ctaLink {
          background: none;
          border: none;
          color: #ffda7a;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.2s;
        }

        .ctaLink:hover {
          opacity: 0.8;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 980px) {
          .marketsGrid {
            grid-template-columns: 1fr 1fr;
          }
          .listHeader,
          .listRow {
            grid-template-columns: 2fr 0.8fr 0.8fr 1fr 0.8fr;
          }
          .listHeader span:nth-child(2),
          .listRow .listCat,
          .listHeader span:nth-child(6),
          .listRow :nth-child(6),
          .listHeader span:nth-child(7),
          .listRow :nth-child(7) {
            display: none;
          }
          .pageHeader {
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .container {
            padding: 24px 14px 48px;
          }
          .marketsGrid {
            grid-template-columns: 1fr;
          }
          .pageHeader h1 {
            font-size: 28px;
          }
          .filtersBar {
            flex-direction: column;
            align-items: stretch;
          }
          .viewToggle {
            margin-left: 0;
          }
          .listWrap {
            overflow-x: auto;
          }
          .listHeader,
          .listRow {
            min-width: 600px;
          }
          .headerStats {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
