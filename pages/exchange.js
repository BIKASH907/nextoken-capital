import { useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const topStats = [
  { label: "Active RWA Listings", value: "124" },
  { label: "Total Platform Volume", value: "€248.6M" },
  { label: "Verified Issuers", value: "38" },
  { label: "Investor Accounts", value: "18.4K" },
];

const tabs = [
  "All Markets",
  "Real Estate",
  "Private Credit",
  "Energy",
  "Infrastructure",
  "Token IPO",
  "Secondary Market",
];

const featuredMarkets = [
  {
    id: 1,
    name: "Vilnius Prime Office Portfolio",
    symbol: "VPOP",
    category: "Real Estate",
    location: "Vilnius, Lithuania",
    price: "€104.20",
    change: "+2.84%",
    volume: "€4.8M",
    marketCap: "€42M",
    sentiment: "Strong demand",
    status: "Live",
    description:
      "Institutional-grade office assets with quarterly yield distribution and transparent issuer reporting.",
  },
  {
    id: 2,
    name: "Solar Yield Notes",
    symbol: "SYN",
    category: "Energy",
    location: "Southern Europe",
    price: "€98.74",
    change: "+1.42%",
    volume: "€2.1M",
    marketCap: "€27M",
    sentiment: "Stable inflows",
    status: "Hot",
    description:
      "Tokenized renewable income notes backed by diversified solar cash-flow agreements.",
  },
  {
    id: 3,
    name: "Logistics Chain Income Fund",
    symbol: "LCIF",
    category: "Infrastructure",
    location: "Central Europe",
    price: "€112.08",
    change: "-0.63%",
    volume: "€3.7M",
    marketCap: "€58M",
    sentiment: "High liquidity",
    status: "Live",
    description:
      "Warehousing and logistics-linked token basket with monthly performance snapshots.",
  },
  {
    id: 4,
    name: "Nextoken Growth Token IPO",
    symbol: "NGTI",
    category: "Token IPO",
    location: "EU Regulated",
    price: "€12.30",
    change: "+5.91%",
    volume: "€1.6M",
    marketCap: "€16M",
    sentiment: "Rising interest",
    status: "New",
    description:
      "Primary issuance marketplace for vetted growth-stage tokenized offerings on Nextoken Capital.",
  },
];

const marketTable = [
  {
    symbol: "VPOP",
    name: "Vilnius Prime Office Portfolio",
    category: "Real Estate",
    price: "€104.20",
    change: "+2.84%",
    volume: "€4.8M",
    cap: "€42M",
  },
  {
    symbol: "SYN",
    name: "Solar Yield Notes",
    category: "Energy",
    price: "€98.74",
    change: "+1.42%",
    volume: "€2.1M",
    cap: "€27M",
  },
  {
    symbol: "LCIF",
    name: "Logistics Chain Income Fund",
    category: "Infrastructure",
    price: "€112.08",
    change: "-0.63%",
    volume: "€3.7M",
    cap: "€58M",
  },
  {
    symbol: "NGTI",
    name: "Nextoken Growth Token IPO",
    category: "Token IPO",
    price: "€12.30",
    change: "+5.91%",
    volume: "€1.6M",
    cap: "€16M",
  },
  {
    symbol: "ECRE",
    name: "European Core Residential",
    category: "Real Estate",
    price: "€87.56",
    change: "+1.08%",
    volume: "€2.9M",
    cap: "€31M",
  },
  {
    symbol: "BCDN",
    name: "Business Credit Debt Notes",
    category: "Private Credit",
    price: "€101.18",
    change: "+0.38%",
    volume: "€1.3M",
    cap: "€24M",
  },
  {
    symbol: "HBEN",
    name: "Hydrogen Build Energy Notes",
    category: "Energy",
    price: "€93.40",
    change: "-1.14%",
    volume: "€890K",
    cap: "€19M",
  },
  {
    symbol: "AMHC",
    name: "Airport Mobility Hub Corridor",
    category: "Infrastructure",
    price: "€119.72",
    change: "+3.12%",
    volume: "€5.2M",
    cap: "€64M",
  },
];

const marketThemes = [
  {
    title: "Income Yield",
    value: "8 Markets",
    desc: "Assets focused on predictable distribution and conservative underwriting.",
  },
  {
    title: "Capital Growth",
    value: "14 Markets",
    desc: "Higher-upside offerings designed around long-term appreciation potential.",
  },
  {
    title: "Institutional Access",
    value: "11 Markets",
    desc: "Large-ticket opportunities packaged for broader investor participation.",
  },
  {
    title: "Primary Issuance",
    value: "6 Live Deals",
    desc: "Fresh token launches and regulated capital-raising opportunities.",
  },
];

const insights = [
  {
    title: "Most watched this week",
    items: ["Vilnius Prime Office Portfolio", "Solar Yield Notes", "Nextoken Growth Token IPO"],
  },
  {
    title: "Highest turnover",
    items: ["Airport Mobility Hub Corridor", "Vilnius Prime Office Portfolio", "Logistics Chain Income Fund"],
  },
  {
    title: "Trending categories",
    items: ["Real Estate", "Infrastructure", "Token IPO"],
  },
];

export default function MarketsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All Markets");
  const [search, setSearch] = useState("");

  const filteredFeatured = useMemo(() => {
    return featuredMarkets.filter((item) => {
      const tabMatch = activeTab === "All Markets" || item.category === activeTab;
      const q = search.toLowerCase().trim();
      const searchMatch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      return tabMatch && searchMatch;
    });
  }, [activeTab, search]);

  const filteredTable = useMemo(() => {
    return marketTable.filter((item) => {
      const tabMatch = activeTab === "All Markets" || item.category === activeTab;
      const q = search.toLowerCase().trim();
      const searchMatch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return tabMatch && searchMatch;
    });
  }, [activeTab, search]);

  return (
    <>
      <Head>
        <title>Markets — Nextoken Capital</title>
        <meta
          name="description"
          content="Explore tokenized real-world asset markets, offerings, watchlists, and platform insights on Nextoken Capital."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="marketsPage">
        <div className="bgGlow bgGlowOne" />
        <div className="bgGlow bgGlowTwo" />

        <section className="container">
          <div className="heroCard">
            <div className="heroLeft">
              <div className="eyebrow">Nextoken Capital Markets</div>
              <h1>
                Markets, built for <span>tokenized real-world assets</span>
              </h1>
              <p>
                Discover curated offerings, secondary market activity, new token issuances,
                and investor-ready opportunities across the Nextoken Capital ecosystem.
              </p>

              <div className="heroActions">
                <button className="primaryBtn" onClick={() => router.push("/exchange")}>
                  Open Exchange
                </button>
                <button className="ghostBtn" onClick={() => router.push("/register")}>
                  Create Account
                </button>
              </div>
            </div>

            <div className="heroStats">
              {topStats.map((stat) => (
                <div key={stat.label} className="statTile">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="tabsBar">
            <div className="tabsScroll">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tabBtn ${activeTab === tab ? "tabBtnActive" : ""}`}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="searchWrap">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search markets, symbols, sectors..."
              />
            </div>
          </div>

          <section className="sectionBlock">
            <div className="sectionHead">
              <div>
                <h2>Featured markets</h2>
                <p>Curated opportunities and high-visibility offerings on the platform.</p>
              </div>
              <button className="textBtn" onClick={() => router.push("/exchange")}>
                View all markets
              </button>
            </div>

            <div className="featuredGrid">
              {filteredFeatured.length ? (
                filteredFeatured.map((item) => (
                  <article className="featuredCard" key={item.id}>
                    <div className="featuredTop">
                      <div>
                        <div className="symbolPill">{item.symbol}</div>
                        <h3>{item.name}</h3>
                        <div className="metaLine">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{item.location}</span>
                        </div>
                      </div>
                      <div className={`statusBadge status-${item.status.toLowerCase()}`}>
                        {item.status}
                      </div>
                    </div>

                    <p className="cardDesc">{item.description}</p>

                    <div className="priceRow">
                      <div>
                        <span className="miniLabel">Price</span>
                        <strong>{item.price}</strong>
                      </div>
                      <div>
                        <span className="miniLabel">24h</span>
                        <strong className={item.change.startsWith("-") ? "downText" : "upText"}>
                          {item.change}
                        </strong>
                      </div>
                    </div>

                    <div className="metricsGrid">
                      <div className="metricBox">
                        <span>Volume</span>
                        <strong>{item.volume}</strong>
                      </div>
                      <div className="metricBox">
                        <span>Market Cap</span>
                        <strong>{item.marketCap}</strong>
                      </div>
                      <div className="metricBox">
                        <span>Market Mood</span>
                        <strong>{item.sentiment}</strong>
                      </div>
                    </div>

                    <button className="cardBtn" onClick={() => router.push("/exchange")}>
                      View market
                    </button>
                  </article>
                ))
              ) : (
                <div className="emptyState">
                  <h3>No matching markets</h3>
                  <p>Try another category or search term.</p>
                </div>
              )}
            </div>
          </section>

          <section className="sectionBlock twoCol">
            <div className="watchlistCard">
              <div className="sectionHead compactHead">
                <div>
                  <h2>Market watchlist</h2>
                  <p>Track active Nextoken Capital instruments and categories.</p>
                </div>
              </div>

              <div className="tableWrap">
                <div className="marketTableHead">
                  <span>Instrument</span>
                  <span>Price</span>
                  <span>24h</span>
                  <span>Volume</span>
                  <span>Cap</span>
                </div>

                {filteredTable.map((row) => (
                  <button
                    key={row.symbol}
                    className="marketTableRow"
                    type="button"
                    onClick={() => router.push("/exchange")}
                  >
                    <div className="instrumentCell">
                      <div className="instrumentBadge">{row.symbol.slice(0, 3)}</div>
                      <div>
                        <div className="instrumentName">{row.name}</div>
                        <div className="instrumentSub">
                          {row.symbol} · {row.category}
                        </div>
                      </div>
                    </div>
                    <span>{row.price}</span>
                    <span className={row.change.startsWith("-") ? "downText" : "upText"}>
                      {row.change}
                    </span>
                    <span>{row.volume}</span>
                    <span>{row.cap}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rightColumn">
              <div className="themeCard">
                <div className="sectionHead compactHead">
                  <div>
                    <h2>Market themes</h2>
                    <p>Explore the main investment pathways on Nextoken Capital.</p>
                  </div>
                </div>

                <div className="themeGrid">
                  {marketThemes.map((theme) => (
                    <div key={theme.title} className="themeItem">
                      <strong>{theme.title}</strong>
                      <span>{theme.value}</span>
                      <p>{theme.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="insightCard">
                <div className="sectionHead compactHead">
                  <div>
                    <h2>Platform insights</h2>
                    <p>What investors are focusing on right now.</p>
                  </div>
                </div>

                <div className="insightList">
                  {insights.map((block) => (
                    <div key={block.title} className="insightBlock">
                      <h3>{block.title}</h3>
                      <ul>
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="ctaSection">
            <div className="ctaCard">
              <div>
                <h2>Discover the full Nextoken Capital market experience</h2>
                <p>
                  Access listings, evaluate offerings, and move from market discovery to
                  execution in one unified platform.
                </p>
              </div>

              <div className="ctaActions">
                <button className="primaryBtn" onClick={() => router.push("/exchange")}>
                  Open Exchange
                </button>
                <button className="ghostBtn" onClick={() => router.push("/register")}>
                  Register
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        body {
          background: #070b12;
          color: #eef3fb;
          font-family: Inter, "Segoe UI", system-ui, sans-serif;
        }

        .marketsPage {
          min-height: 100vh;
          padding: 96px 18px 32px;
          background:
            radial-gradient(circle at top left, rgba(240,185,11,0.08), transparent 24%),
            radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 20%),
            linear-gradient(180deg, #070b12 0%, #0c1320 100%);
          position: relative;
          overflow: hidden;
        }

        .bgGlow {
          position: fixed;
          border-radius: 999px;
          filter: blur(120px);
          pointer-events: none;
          opacity: 0.22;
        }

        .bgGlowOne {
          width: 280px;
          height: 280px;
          left: -70px;
          top: 60px;
          background: rgba(240, 185, 11, 0.45);
        }

        .bgGlowTwo {
          width: 320px;
          height: 320px;
          right: -90px;
          top: 120px;
          background: rgba(59, 130, 246, 0.35);
        }

        .container {
          max-width: 1440px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .heroCard,
        .sectionBlock,
        .watchlistCard,
        .themeCard,
        .insightCard,
        .ctaCard,
        .tabsBar {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(18, 24, 34, 0.82);
          border-radius: 24px;
          box-shadow: 0 20px 46px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(14px);
        }

        .heroCard {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, 420px);
          gap: 24px;
          padding: 28px;
          margin-bottom: 18px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 14px;
          border-radius: 999px;
          background: rgba(240, 185, 11, 0.12);
          border: 1px solid rgba(240, 185, 11, 0.22);
          color: #f0b90b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .heroLeft h1 {
          margin: 0 0 14px;
          font-size: 48px;
          line-height: 1.04;
          letter-spacing: -1.2px;
          color: #ffffff;
        }

        .heroLeft h1 span {
          background: linear-gradient(180deg, #ffe089 0%, #c78913 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .heroLeft p {
          margin: 0;
          max-width: 760px;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(238, 243, 251, 0.72);
        }

        .heroActions,
        .ctaActions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .primaryBtn,
        .ghostBtn,
        .cardBtn,
        .textBtn {
          border: none;
          cursor: pointer;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .primaryBtn {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 14px;
          background: linear-gradient(135deg, #f0b90b, #c78913);
          color: #10151d;
          font-size: 14px;
        }

        .primaryBtn:hover,
        .cardBtn:hover {
          transform: translateY(-1px);
        }

        .ghostBtn {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          color: #eef3fb;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 14px;
        }

        .heroStats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .statTile {
          border-radius: 18px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 118px;
        }

        .statTile span {
          color: rgba(238, 243, 251, 0.56);
          font-size: 12px;
          margin-bottom: 6px;
        }

        .statTile strong {
          color: #ffffff;
          font-size: 28px;
          line-height: 1.1;
        }

        .tabsBar {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .tabsScroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .tabBtn {
          min-height: 40px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: rgba(238, 243, 251, 0.75);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .tabBtnActive {
          color: #f0b90b;
          border-color: rgba(240, 185, 11, 0.32);
          background: rgba(240, 185, 11, 0.11);
        }

        .searchWrap {
          width: 320px;
          max-width: 100%;
          flex-shrink: 0;
        }

        .searchWrap input {
          width: 100%;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          color: #eef3fb;
          padding: 0 14px;
          outline: none;
        }

        .searchWrap input::placeholder {
          color: rgba(238, 243, 251, 0.34);
        }

        .searchWrap input:focus {
          border-color: rgba(240, 185, 11, 0.42);
        }

        .sectionBlock {
          padding: 22px;
          margin-bottom: 18px;
        }

        .sectionHead {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .compactHead {
          margin-bottom: 14px;
        }

        .sectionHead h2 {
          margin: 0 0 6px;
          color: #ffffff;
          font-size: 24px;
        }

        .sectionHead p {
          margin: 0;
          color: rgba(238, 243, 251, 0.6);
          font-size: 14px;
          line-height: 1.6;
        }

        .textBtn {
          background: transparent;
          color: #f0b90b;
          font-size: 14px;
          padding: 0;
        }

        .featuredGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .featuredCard {
          border-radius: 22px;
          padding: 18px;
          background:
            radial-gradient(circle at top right, rgba(240,185,11,0.09), transparent 28%),
            rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-width: 0;
        }

        .featuredTop {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
        }

        .symbolPill {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          color: #f0b90b;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .featuredCard h3 {
          margin: 0 0 6px;
          color: #ffffff;
          font-size: 18px;
          line-height: 1.3;
        }

        .metaLine {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          color: rgba(238, 243, 251, 0.56);
          font-size: 12px;
        }

        .statusBadge {
          min-height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          border: 1px solid transparent;
        }

        .status-live,
        .status-hot,
        .status-new {
          color: #f0b90b;
          background: rgba(240, 185, 11, 0.12);
          border-color: rgba(240, 185, 11, 0.24);
        }

        .cardDesc {
          margin: 0;
          color: rgba(238, 243, 251, 0.64);
          font-size: 13px;
          line-height: 1.7;
        }

        .priceRow {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .miniLabel {
          display: block;
          color: rgba(238, 243, 251, 0.46);
          font-size: 11px;
          margin-bottom: 4px;
        }

        .priceRow strong {
          color: #ffffff;
          font-size: 18px;
        }

        .metricsGrid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }

        .metricBox {
          border-radius: 14px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .metricBox span {
          display: block;
          font-size: 11px;
          color: rgba(238, 243, 251, 0.46);
          margin-bottom: 4px;
        }

        .metricBox strong {
          color: #ffffff;
          font-size: 14px;
        }

        .cardBtn {
          min-height: 44px;
          border-radius: 14px;
          background: rgba(240, 185, 11, 0.12);
          color: #f0b90b;
          border: 1px solid rgba(240, 185, 11, 0.22);
          font-size: 13px;
          margin-top: auto;
        }

        .twoCol {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, 420px);
          gap: 18px;
          padding: 0;
          background: transparent;
          border: none;
          box-shadow: none;
          backdrop-filter: none;
        }

        .watchlistCard,
        .rightColumn {
          min-width: 0;
        }

        .watchlistCard {
          padding: 22px;
        }

        .rightColumn {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .themeCard,
        .insightCard {
          padding: 22px;
        }

        .tableWrap {
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.02);
        }

        .marketTableHead,
        .marketTableRow {
          display: grid;
          grid-template-columns: 2.2fr 0.9fr 0.9fr 0.9fr 0.9fr;
          gap: 12px;
          align-items: center;
          padding: 14px 16px;
        }

        .marketTableHead {
          color: rgba(238, 243, 251, 0.5);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .marketTableRow {
          width: 100%;
          text-align: left;
          border: none;
          background: transparent;
          color: #eef3fb;
          cursor: pointer;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .marketTableRow:last-child {
          border-bottom: none;
        }

        .marketTableRow:hover {
          background: rgba(255, 255, 255, 0.035);
        }

        .instrumentCell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .instrumentBadge {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #f0b90b, #c78913);
          color: #10151d;
          font-size: 12px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .instrumentName {
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.35;
        }

        .instrumentSub {
          color: rgba(238, 243, 251, 0.48);
          font-size: 12px;
          margin-top: 4px;
        }

        .themeGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .themeItem {
          border-radius: 18px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .themeItem strong {
          display: block;
          color: #ffffff;
          font-size: 15px;
          margin-bottom: 6px;
        }

        .themeItem span {
          display: block;
          color: #f0b90b;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .themeItem p {
          margin: 0;
          color: rgba(238, 243, 251, 0.58);
          font-size: 13px;
          line-height: 1.65;
        }

        .insightList {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .insightBlock {
          border-radius: 18px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .insightBlock h3 {
          margin: 0 0 10px;
          color: #ffffff;
          font-size: 15px;
        }

        .insightBlock ul {
          margin: 0;
          padding-left: 18px;
          color: rgba(238, 243, 251, 0.68);
        }

        .insightBlock li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .ctaSection {
          margin-top: 4px;
        }

        .ctaCard {
          padding: 26px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
        }

        .ctaCard h2 {
          margin: 0 0 8px;
          color: #ffffff;
          font-size: 28px;
        }

        .ctaCard p {
          margin: 0;
          color: rgba(238, 243, 251, 0.64);
          font-size: 15px;
          line-height: 1.7;
          max-width: 760px;
        }

        .upText {
          color: #0ecb81 !important;
        }

        .downText {
          color: #f6465d !important;
        }

        .emptyState {
          border-radius: 20px;
          padding: 52px 20px;
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px dashed rgba(255, 255, 255, 0.08);
        }

        .emptyState h3 {
          margin: 0 0 8px;
          color: #ffffff;
        }

        .emptyState p {
          margin: 0;
          color: rgba(238, 243, 251, 0.56);
        }

        @media (max-width: 1200px) {
          .heroCard {
            grid-template-columns: 1fr;
          }

          .featuredGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .twoCol {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 820px) {
          .marketsPage {
            padding: 88px 12px 24px;
          }

          .heroCard,
          .sectionBlock,
          .watchlistCard,
          .themeCard,
          .insightCard,
          .ctaCard,
          .tabsBar {
            border-radius: 20px;
          }

          .heroLeft h1 {
            font-size: 34px;
          }

          .heroStats {
            grid-template-columns: 1fr 1fr;
          }

          .tabsBar {
            flex-direction: column;
            align-items: stretch;
          }

          .searchWrap {
            width: 100%;
          }

          .featuredGrid,
          .themeGrid {
            grid-template-columns: 1fr;
          }

          .ctaCard {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .heroCard {
            padding: 18px;
          }

          .heroStats {
            grid-template-columns: 1fr;
          }

          .marketTableHead,
          .marketTableRow {
            grid-template-columns: 1.8fr 1fr 1fr;
          }

          .marketTableHead span:nth-child(4),
          .marketTableHead span:nth-child(5),
          .marketTableRow span:nth-child(4),
          .marketTableRow span:nth-child(5) {
            display: none;
          }

          .metricsGrid {
            grid-template-columns: 1fr;
          }

          .priceRow {
            grid-template-columns: 1fr;
          }

          .ctaActions,
          .heroActions {
            width: 100%;
          }

          .primaryBtn,
          .ghostBtn {
            flex: 1;
          }
        }
      `}</style>
    </>
  );
}