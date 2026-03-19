import { useMemo, useState } from "react";
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

const riskColors = {
  Low: "#2dd4bf",
  Medium: "#fbbf24",
  High: "#fb7185",
};

const statusStyles = {
  Live: {
    bg: "rgba(45, 212, 191, 0.12)",
    border: "rgba(45, 212, 191, 0.32)",
    color: "#2dd4bf",
  },
  "Closing Soon": {
    bg: "rgba(251, 191, 36, 0.12)",
    border: "rgba(251, 191, 36, 0.32)",
    color: "#fbbf24",
  },
};

export default function Markets() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [risk, setRisk] = useState("All");
  const [sortBy, setSortBy] = useState("funded");
  const [view, setView] = useState("grid");

  const filteredMarkets = useMemo(() => {
    const result = allMarkets
      .filter((market) => {
        const q = search.toLowerCase().trim();
        const matchSearch =
          market.name.toLowerCase().includes(q) ||
          market.location.toLowerCase().includes(q) ||
          market.category.toLowerCase().includes(q);

        const matchCategory = category === "All" || market.category === category;
        const matchRisk = risk === "All" || market.risk === risk;

        return matchSearch && matchCategory && matchRisk;
      })
      .sort((a, b) => {
        if (sortBy === "roi") return parseFloat(b.roi) - parseFloat(a.roi);
        if (sortBy === "funded") return b.funded - a.funded;
        if (sortBy === "min") {
          return (
            parseInt(a.minInvest.replace(/\D/g, ""), 10) -
            parseInt(b.minInvest.replace(/\D/g, ""), 10)
          );
        }
        return 0;
      });

    return result;
  }, [search, category, risk, sortBy]);

  return (
    <>
      <Head>
        <title>Markets — Nextoken Capital</title>
        <meta
          name="description"
          content="Browse premium tokenized real-world asset investment opportunities on Nextoken Capital."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="marketsPage">
        <div className="backgroundGlow glowOne" />
        <div className="backgroundGlow glowTwo" />
        <div className="noiseLayer" />

        <section className="container">
          <div className="hero">
            <div className="heroLeft">
              <div className="eyebrow">Investment Opportunities</div>
              <h1>
                Explore Premium <span>Tokenized Markets</span>
              </h1>
              <p>
                Access curated real-world asset opportunities across property,
                energy, infrastructure, and commercial sectors with a modern
                digital investment experience.
              </p>
            </div>

            <div className="heroStats">
              <div className="heroStatCard">
                <strong>{allMarkets.length}</strong>
                <span>Active Projects</span>
              </div>
              <div className="heroStatCard">
                <strong>€50M+</strong>
                <span>Total Assets</span>
              </div>
              <div className="heroStatCard">
                <strong>18.8%</strong>
                <span>Highest ROI</span>
              </div>
            </div>
          </div>

          <div className="toolbar">
            <div className="searchBox">
              <span className="searchIcon">⌕</span>
              <input
                type="text"
                placeholder="Search by asset, sector, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="toolbarGrid">
              <div className="filterBlock">
                <label>Category</label>
                <div className="chipWrap">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`chip ${category === item ? "chipActive" : ""}`}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filterBlock">
                <label>Risk Level</label>
                <div className="chipWrap">
                  {riskLevels.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`chip ${risk === item ? "chipActive" : ""}`}
                      onClick={() => setRisk(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filterBlock smallBlock">
                <label>Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="funded">Most Funded</option>
                  <option value="roi">Highest ROI</option>
                  <option value="min">Lowest Min. Invest</option>
                </select>
              </div>

              <div className="filterBlock smallBlock">
                <label>View</label>
                <div className="viewToggle">
                  <button
                    type="button"
                    className={view === "grid" ? "viewActive" : ""}
                    onClick={() => setView("grid")}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    className={view === "list" ? "viewActive" : ""}
                    onClick={() => setView("list")}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="resultsBar">
            <div className="resultsText">
              Showing <strong>{filteredMarkets.length}</strong> of{" "}
              <strong>{allMarkets.length}</strong> opportunities
            </div>
          </div>

          {view === "grid" ? (
            <div className="grid">
              {filteredMarkets.length === 0 ? (
                <div className="emptyState">
                  <div className="emptyIcon">🔍</div>
                  <h3>No matching opportunities</h3>
                  <p>Try changing your filters or search keywords.</p>
                </div>
              ) : (
                filteredMarkets.map((market) => (
                  <article className="card" key={market.id}>
                    <div className="cardTop">
                      <div className="iconBox">{market.icon}</div>

                      <div className="badgeStack">
                        <span
                          className="statusBadge"
                          style={{
                            background: statusStyles[market.status]?.bg,
                            borderColor: statusStyles[market.status]?.border,
                            color: statusStyles[market.status]?.color,
                          }}
                        >
                          {market.status}
                        </span>

                        <span
                          className="riskLabel"
                          style={{ color: riskColors[market.risk] }}
                        >
                          ● {market.risk} Risk
                        </span>
                      </div>
                    </div>

                    <div className="cardBody">
                      <div className="categoryTag">{market.category}</div>
                      <h3>{market.name}</h3>
                      <p className="location">📍 {market.location}</p>

                      <div className="metrics">
                        <div className="metric">
                          <span className="metricValue premium">{market.roi}</span>
                          <span className="metricLabel">Target ROI</span>
                        </div>
                        <div className="metric">
                          <span className="metricValue">{market.minInvest}</span>
                          <span className="metricLabel">Min. Invest</span>
                        </div>
                        <div className="metric">
                          <span className="metricValue">{market.term}</span>
                          <span className="metricLabel">Term</span>
                        </div>
                      </div>

                      <div className="fundingBox">
                        <div className="fundingRow">
                          <span>Funding Progress</span>
                          <strong>{market.funded}%</strong>
                        </div>

                        <div className="progressBar">
                          <div
                            className="progressFill"
                            style={{ width: `${market.funded}%` }}
                          />
                        </div>

                        <div className="fundingMeta">
                          <span>{market.raised} raised</span>
                          <span>{market.total} target</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="primaryButton"
                      onClick={() => router.push(`/asset/${market.id}`)}
                    >
                      View Opportunity
                    </button>
                  </article>
                ))
              )}
            </div>
          ) : (
            <div className="tableWrap">
              {filteredMarkets.length === 0 ? (
                <div className="emptyState">
                  <div className="emptyIcon">🔍</div>
                  <h3>No matching opportunities</h3>
                  <p>Try changing your filters or search keywords.</p>
                </div>
              ) : (
                <>
                  <div className="tableHead">
                    <span>Asset</span>
                    <span>Category</span>
                    <span>ROI</span>
                    <span>Min. Invest</span>
                    <span>Funded</span>
                    <span>Risk</span>
                    <span>Status</span>
                    <span>Action</span>
                  </div>

                  {filteredMarkets.map((market) => (
                    <div className="tableRow" key={market.id}>
                      <div className="assetCell">
                        <div className="tableIcon">{market.icon}</div>
                        <div>
                          <div className="assetName">{market.name}</div>
                          <div className="assetLocation">📍 {market.location}</div>
                        </div>
                      </div>

                      <span>{market.category}</span>
                      <span className="premium strongText">{market.roi}</span>
                      <span>{market.minInvest}</span>

                      <div className="fundedCell">
                        <div className="miniBar">
                          <div
                            className="miniFill"
                            style={{ width: `${market.funded}%` }}
                          />
                        </div>
                        <strong>{market.funded}%</strong>
                      </div>

                      <span
                        className="strongText"
                        style={{ color: riskColors[market.risk] }}
                      >
                        {market.risk}
                      </span>

                      <span
                        className="statusBadge tableBadge"
                        style={{
                          background: statusStyles[market.status]?.bg,
                          borderColor: statusStyles[market.status]?.border,
                          color: statusStyles[market.status]?.color,
                        }}
                      >
                        {market.status}
                      </span>

                      <button
                        className="secondaryButton"
                        onClick={() => router.push(`/asset/${market.id}`)}
                      >
                        Invest
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          <div className="cta">
            <div className="ctaCard">
              <div>
                <h2>Start building your portfolio today</h2>
                <p>
                  Create your account to access tokenized investment opportunities
                  across multiple real-world sectors.
                </p>
              </div>

              <button
                className="ctaButton"
                onClick={() => router.push("/register")}
              >
                Register Now
              </button>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .marketsPage {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(circle at top left, rgba(255, 196, 92, 0.12), transparent 32%),
            radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 28%),
            linear-gradient(180deg, #05070d 0%, #090d16 45%, #06080f 100%);
          color: #eef2ff;
          font-family: Inter, "Segoe UI", system-ui, sans-serif;
        }

        .backgroundGlow {
          position: fixed;
          border-radius: 999px;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.45;
        }

        .glowOne {
          width: 280px;
          height: 280px;
          top: 60px;
          left: -60px;
          background: rgba(245, 158, 11, 0.22);
        }

        .glowTwo {
          width: 320px;
          height: 320px;
          top: 120px;
          right: -80px;
          background: rgba(59, 130, 246, 0.14);
        }

        .noiseLayer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.06;
          background-image:
            radial-gradient(rgba(255,255,255,0.9) 0.7px, transparent 0.7px);
          background-size: 18px 18px;
          z-index: 0;
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 1240px;
          margin: 0 auto;
          padding: 42px 18px 72px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
          align-items: stretch;
          margin-bottom: 28px;
        }

        .heroLeft {
          padding: 34px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.06),
            rgba(255, 255, 255, 0.025)
          );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(18px);
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(251, 191, 36, 0.24);
          background: rgba(255, 255, 255, 0.04);
          color: #fbbf24;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.3px;
          text-transform: uppercase;
        }

        .heroLeft h1 {
          margin: 0 0 14px;
          font-size: 48px;
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .heroLeft h1 span,
        .premium {
          background: linear-gradient(180deg, #ffe08a 0%, #d3922e 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .heroLeft p {
          margin: 0;
          max-width: 680px;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(238, 242, 255, 0.72);
        }

        .heroStats {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .heroStatCard {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 120px;
          padding: 24px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.055),
            rgba(255,255,255,0.02)
          );
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
        }

        .heroStatCard strong {
          font-size: 28px;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .heroStatCard span {
          color: rgba(238, 242, 255, 0.62);
          font-size: 13px;
          font-weight: 600;
        }

        .toolbar {
          margin-bottom: 18px;
          padding: 22px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
        }

        .searchBox {
          position: relative;
          margin-bottom: 18px;
        }

        .searchBox input {
          width: 100%;
          height: 54px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.055);
          color: #eef2ff;
          padding: 0 18px 0 50px;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .searchBox input::placeholder {
          color: rgba(238, 242, 255, 0.36);
        }

        .searchBox input:focus {
          border-color: rgba(251, 191, 36, 0.4);
          box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.08);
        }

        .searchIcon {
          position: absolute;
          top: 50%;
          left: 18px;
          transform: translateY(-50%);
          color: rgba(238, 242, 255, 0.55);
          font-size: 18px;
        }

        .toolbarGrid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 220px 180px;
          gap: 16px;
          align-items: end;
        }

        .filterBlock {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .filterBlock label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(251, 191, 36, 0.76);
        }

        .chipWrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          height: 38px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(238, 242, 255, 0.78);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chip:hover {
          color: #fff;
          border-color: rgba(251, 191, 36, 0.3);
          transform: translateY(-1px);
        }

        .chipActive {
          background: rgba(251, 191, 36, 0.12);
          border-color: rgba(251, 191, 36, 0.4);
          color: #fbbf24;
        }

        .filterBlock select {
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.055);
          color: #eef2ff;
          padding: 0 14px;
          font-size: 14px;
          outline: none;
        }

        .filterBlock select option {
          background: #0e1320;
        }

        .viewToggle {
          display: flex;
          gap: 8px;
        }

        .viewToggle button {
          flex: 1;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(238, 242, 255, 0.8);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .viewToggle button.viewActive {
          background: rgba(251, 191, 36, 0.12);
          border-color: rgba(251, 191, 36, 0.42);
          color: #fbbf24;
        }

        .resultsBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .resultsText {
          color: rgba(238, 242, 255, 0.58);
          font-size: 14px;
        }

        .resultsText strong {
          color: #ffffff;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .card {
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 22px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            radial-gradient(circle at top right, rgba(251, 191, 36, 0.09), transparent 28%),
            linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.022));
          box-shadow: 0 18px 44px rgba(0,0,0,0.28);
          transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
          min-height: 100%;
        }

        .card:hover {
          transform: translateY(-4px);
          border-color: rgba(251, 191, 36, 0.22);
          box-shadow: 0 28px 54px rgba(0,0,0,0.34);
        }

        .cardTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .iconBox {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          font-size: 24px;
          background: linear-gradient(135deg, #ffd977 0%, #c18222 100%);
          box-shadow: 0 12px 24px rgba(251, 191, 36, 0.18);
          flex-shrink: 0;
        }

        .badgeStack {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .statusBadge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 30px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid transparent;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.4px;
          white-space: nowrap;
        }

        .tableBadge {
          width: fit-content;
        }

        .riskLabel {
          font-size: 12px;
          font-weight: 700;
        }

        .cardBody {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .categoryTag {
          display: inline-flex;
          width: fit-content;
          padding: 6px 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(238, 242, 255, 0.72);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .card h3 {
          margin: 0;
          font-size: 20px;
          line-height: 1.28;
          font-weight: 800;
        }

        .location {
          margin: -4px 0 0;
          color: rgba(238, 242, 255, 0.58);
          font-size: 14px;
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .metric {
          padding: 14px 10px;
          border-radius: 16px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.06);
          text-align: center;
        }

        .metricValue {
          display: block;
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .metricLabel {
          display: block;
          font-size: 11px;
          color: rgba(238, 242, 255, 0.48);
          font-weight: 600;
        }

        .fundingBox {
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .fundingRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          color: rgba(238, 242, 255, 0.64);
          font-size: 13px;
        }

        .fundingRow strong {
          color: #ffffff;
          font-size: 14px;
        }

        .progressBar {
          width: 100%;
          height: 8px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255,255,255,0.08);
          margin-bottom: 10px;
        }

        .progressFill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #ffd977 0%, #f59e0b 100%);
        }

        .fundingMeta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(238, 242, 255, 0.5);
          font-size: 12px;
        }

        .primaryButton,
        .secondaryButton,
        .ctaButton {
          border: none;
          cursor: pointer;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .primaryButton {
          height: 50px;
          border-radius: 16px;
          background: linear-gradient(135deg, #ffe08a 0%, #f0ad33 100%);
          color: #101317;
          font-size: 14px;
          box-shadow: 0 14px 28px rgba(245, 158, 11, 0.18);
          margin-top: auto;
        }

        .primaryButton:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 34px rgba(245, 158, 11, 0.24);
        }

        .tableWrap {
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          box-shadow: 0 18px 44px rgba(0,0,0,0.24);
        }

        .tableHead,
        .tableRow {
          display: grid;
          grid-template-columns: 2.3fr 1fr 0.8fr 0.9fr 1.2fr 0.8fr 1fr 0.85fr;
          gap: 14px;
          align-items: center;
          padding: 16px 20px;
        }

        .tableHead {
          background: rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(251, 191, 36, 0.76);
        }

        .tableRow {
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 13px;
          color: rgba(238, 242, 255, 0.82);
        }

        .tableRow:last-child {
          border-bottom: none;
        }

        .tableRow:hover {
          background: rgba(255,255,255,0.035);
        }

        .assetCell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .tableIcon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #ffd977 0%, #c18222 100%);
          display: grid;
          place-items: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .assetName {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.3;
        }

        .assetLocation {
          margin-top: 3px;
          font-size: 12px;
          color: rgba(238, 242, 255, 0.5);
        }

        .fundedCell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .miniBar {
          flex: 1;
          height: 6px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255,255,255,0.08);
        }

        .miniFill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #ffd977 0%, #f59e0b 100%);
        }

        .fundedCell strong,
        .strongText {
          font-weight: 800;
        }

        .secondaryButton {
          height: 40px;
          padding: 0 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ffe08a 0%, #f0ad33 100%);
          color: #101317;
          font-size: 13px;
        }

        .secondaryButton:hover {
          transform: translateY(-1px);
        }

        .emptyState {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 64px 20px;
          border-radius: 24px;
          border: 1px dashed rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.025);
        }

        .emptyIcon {
          font-size: 42px;
          margin-bottom: 10px;
        }

        .emptyState h3 {
          margin: 0 0 8px;
          font-size: 20px;
          color: #ffffff;
        }

        .emptyState p {
          margin: 0;
          color: rgba(238, 242, 255, 0.56);
        }

        .cta {
          margin-top: 34px;
        }

        .ctaCard {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          padding: 28px;
          border-radius: 26px;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            radial-gradient(circle at top right, rgba(251,191,36,0.12), transparent 30%),
            linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
          box-shadow: 0 18px 44px rgba(0,0,0,0.24);
        }

        .ctaCard h2 {
          margin: 0 0 8px;
          font-size: 28px;
          line-height: 1.15;
        }

        .ctaCard p {
          margin: 0;
          color: rgba(238, 242, 255, 0.64);
          font-size: 15px;
          line-height: 1.65;
          max-width: 700px;
        }

        .ctaButton {
          height: 52px;
          padding: 0 22px;
          border-radius: 16px;
          background: linear-gradient(135deg, #ffe08a 0%, #f0ad33 100%);
          color: #101317;
          font-size: 14px;
          white-space: nowrap;
          box-shadow: 0 14px 28px rgba(245, 158, 11, 0.18);
        }

        .ctaButton:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 34px rgba(245, 158, 11, 0.24);
        }

        @media (max-width: 1100px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .heroStats {
            grid-template-columns: repeat(3, 1fr);
          }

          .toolbarGrid {
            grid-template-columns: 1fr 1fr;
          }

          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .tableWrap {
            overflow-x: auto;
          }

          .tableHead,
          .tableRow {
            min-width: 980px;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 28px 14px 56px;
          }

          .heroLeft {
            padding: 24px;
            border-radius: 22px;
          }

          .heroLeft h1 {
            font-size: 34px;
          }

          .heroStats {
            grid-template-columns: 1fr;
          }

          .toolbar {
            padding: 16px;
            border-radius: 20px;
          }

          .toolbarGrid {
            grid-template-columns: 1fr;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .metrics {
            grid-template-columns: 1fr;
          }

          .ctaCard {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .ctaCard h2 {
            font-size: 22px;
          }

          .ctaButton {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}