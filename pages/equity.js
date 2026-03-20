import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const initialAssets = [
  {
    code: "NGTI",
    title: "Nextoken Growth Token IPO",
    category: "Primary Offering",
    price: 12.3,
    holdings: 420,
    allocation: "32%",
    status: "New",
  },
  {
    code: "VPOP",
    title: "Vilnius Prime Office Portfolio",
    category: "Real Estate",
    price: 104.2,
    holdings: 120,
    allocation: "41%",
    status: "Live",
  },
  {
    code: "LCIF",
    title: "Logistics Chain Income Fund",
    category: "Infrastructure",
    price: 112.08,
    holdings: 85,
    allocation: "27%",
    status: "Live",
  },
];

export default function EquityIpoPage() {
  const [assets, setAssets] = useState(
    initialAssets.map((item) => ({
      ...item,
      change: "+0.00%",
      isUp: true,
    }))
  );

  const [activeTab, setActiveTab] = useState("market");

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((item) => {
          const rawChange = (Math.random() - 0.5) * 2.4;
          const nextPrice = Math.max(0.01, +(item.price + rawChange).toFixed(2));
          return {
            ...item,
            price: nextPrice,
            change: `${rawChange >= 0 ? "+" : ""}${rawChange.toFixed(2)}%`,
            isUp: rawChange >= 0,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const portfolio = useMemo(() => {
    const totalValue = assets.reduce(
      (sum, item) => sum + item.price * item.holdings,
      0
    );
    const dayMove = assets.reduce((sum, item) => {
      const pct = parseFloat(item.change);
      return sum + item.price * item.holdings * (pct / 100);
    }, 0);

    return {
      totalValue,
      dayMove,
      investorName: "Investor Dashboard",
      accountLevel: "Verified",
    };
  }, [assets]);

  return (
    <>
      <Head>
        <title>Equity & IPO | Nextoken Capital</title>
        <meta
          name="description"
          content="Equity and IPO dashboard for Nextoken Capital with market overview, investor dashboard, login call-to-action, and portfolio tracking."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="page">
        <section className="hero">
          <div className="heroGlow heroGlowOne" />
          <div className="heroGlow heroGlowTwo" />

          <div className="heroCard">
            <div className="heroContent">
              <span className="badge">Capital Markets</span>
              <h1>Equity & IPO</h1>
              <p className="subtitle">
                Nextoken Capital supports issuer onboarding, compliance
                visibility, investor access, and portfolio tracking in one
                structured interface.
              </p>

              <div className="actions">
                <Link href="/" className="btnPrimary">
                  Back to Home
                </Link>
                <a href="#dashboard" className="btnSecondary">
                  Open Dashboard
                </a>
                <Link href="/login" className="btnGhost">
                  Log In
                </Link>
              </div>

              <div className="heroStats">
                <div className="statBox">
                  <span className="statValue">3</span>
                  <span className="statLabel">Featured Offerings</span>
                </div>
                <div className="statBox">
                  <span className="statValue">Live</span>
                  <span className="statLabel">Market Tracking</span>
                </div>
                <div className="statBox">
                  <span className="statValue">24/7</span>
                  <span className="statLabel">Portfolio Visibility</span>
                </div>
              </div>
            </div>

            <div className="heroPanel">
              <div className="miniPanel">
                <div className="miniPanelTop">
                  <span className="miniPill">Investor View</span>
                  <span className="miniStatus">Active</span>
                </div>

                <h3>Portfolio Snapshot</h3>
                <p>
                  A cleaner equity experience with market overview, dashboard
                  access, and portfolio visibility.
                </p>

                <div className="miniGrid">
                  <div className="miniCard">
                    <span>Total Value</span>
                    <strong>
                      €
                      {portfolio.totalValue.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </div>
                  <div className="miniCard">
                    <span>Daily Move</span>
                    <strong
                      className={portfolio.dayMove >= 0 ? "green" : "red"}
                    >
                      {portfolio.dayMove >= 0 ? "+" : "-"}€
                      {Math.abs(portfolio.dayMove).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </div>
                  <div className="miniCard">
                    <span>Access</span>
                    <strong>Dashboard</strong>
                  </div>
                  <div className="miniCard">
                    <span>Status</span>
                    <strong>Verified</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="dashboard" className="dashboardSection">
          <div className="sectionHeader">
            <span className="sectionTag">Investor Dashboard</span>
            <h2>Market overview, account access, and portfolio tracking</h2>
            <p>
              This layout adds a stronger investor-facing experience while
              keeping the page aligned with the rest of the site.
            </p>
          </div>

          <div className="tabBar">
            <button
              type="button"
              className={`tabBtn ${activeTab === "market" ? "tabActive" : ""}`}
              onClick={() => setActiveTab("market")}
            >
              Market
            </button>
            <button
              type="button"
              className={`tabBtn ${activeTab === "dashboard" ? "tabActive" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`tabBtn ${activeTab === "portfolio" ? "tabActive" : ""}`}
              onClick={() => setActiveTab("portfolio")}
            >
              Portfolio
            </button>
          </div>

          {activeTab === "market" && (
            <div className="panel">
              <div className="panelHeader">
                <div>
                  <h3>Featured Equity Opportunities</h3>
                  <p>Live-style pricing and offering visibility.</p>
                </div>
                <div className="panelActions">
                  <Link href="/login" className="smallBtn">
                    Investor Login
                  </Link>
                </div>
              </div>

              <div className="marketTable">
                <div className="tableHead">
                  <span>Asset</span>
                  <span>Category</span>
                  <span>Price</span>
                  <span>Change</span>
                  <span>Status</span>
                </div>

                {assets.map((item) => (
                  <div key={item.code} className="tableRow">
                    <div className="assetCell">
                      <strong>{item.code}</strong>
                      <p>{item.title}</p>
                    </div>
                    <div className="mutedCell">{item.category}</div>
                    <div className={`priceCell ${item.isUp ? "flashGreen" : "flashRed"}`}>
                      €{item.price.toFixed(2)}
                    </div>
                    <div className={item.isUp ? "green strong" : "red strong"}>
                      {item.change}
                    </div>
                    <div>
                      <span className="statusPill">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="panel">
              <div className="dashboardGrid">
                <div className="summaryCard">
                  <span className="cardLabel">Account</span>
                  <h3>{portfolio.investorName}</h3>
                  <p className="cardText">
                    Access offering summaries, onboarding progress, compliance
                    workflow, and portfolio visibility from one place.
                  </p>

                  <div className="summaryMeta">
                    <div className="summaryMini">
                      <span>Level</span>
                      <strong>{portfolio.accountLevel}</strong>
                    </div>
                    <div className="summaryMini">
                      <span>Access</span>
                      <strong>Investor</strong>
                    </div>
                    <div className="summaryMini">
                      <span>Workflow</span>
                      <strong>Enabled</strong>
                    </div>
                  </div>

                  <div className="summaryActions">
                    <Link href="/login" className="btnPrimary">
                      Log In
                    </Link>
                    <a href="#portfolio-panel" className="btnSecondary">
                      View Portfolio
                    </a>
                  </div>
                </div>

                <div className="loginCard">
                  <span className="cardLabel">Secure Access</span>
                  <h3>Login & account entry</h3>
                  <p className="cardText">
                    Provide secure access for investors to review offerings,
                    monitor positions, and follow market changes.
                  </p>

                  <div className="loginMock">
                    <div className="inputMock">Email address</div>
                    <div className="inputMock">Password</div>
                    <div className="loginButtonMock">Continue to Dashboard</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div id="portfolio-panel" className="panel">
              <div className="panelHeader">
                <div>
                  <h3>Portfolio Tracking</h3>
                  <p>Track holdings, allocation, and portfolio value.</p>
                </div>
              </div>

              <div className="portfolioTop">
                <div className="portfolioStat">
                  <span>Total Value</span>
                  <strong>
                    €
                    {portfolio.totalValue.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
                <div className="portfolioStat">
                  <span>Daily Change</span>
                  <strong className={portfolio.dayMove >= 0 ? "green" : "red"}>
                    {portfolio.dayMove >= 0 ? "+" : "-"}€
                    {Math.abs(portfolio.dayMove).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
                <div className="portfolioStat">
                  <span>Tracked Assets</span>
                  <strong>{assets.length}</strong>
                </div>
              </div>

              <div className="portfolioList">
                {assets.map((item) => {
                  const currentValue = item.price * item.holdings;
                  return (
                    <div key={item.code} className="portfolioRow">
                      <div className="portfolioAsset">
                        <strong>{item.code}</strong>
                        <p>{item.title}</p>
                      </div>
                      <div className="portfolioCol">
                        <span>Holdings</span>
                        <strong>{item.holdings}</strong>
                      </div>
                      <div className="portfolioCol">
                        <span>Allocation</span>
                        <strong>{item.allocation}</strong>
                      </div>
                      <div className="portfolioCol">
                        <span>Value</span>
                        <strong>
                          €
                          {currentValue.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </strong>
                      </div>
                      <div className="portfolioCol">
                        <span>Move</span>
                        <strong className={item.isUp ? "green" : "red"}>
                          {item.change}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="bottomSection">
          <div className="bottomGrid">
            <div className="bottomCard">
              <span className="sectionTag">Issuer Readiness</span>
              <h3>Structured offering presentation</h3>
              <p>
                Present equity opportunities with stronger visibility,
                onboarding structure, and a more professional investor
                experience.
              </p>
            </div>

            <div className="bottomCard">
              <span className="sectionTag">Compliance Flow</span>
              <h3>KYC and review visibility</h3>
              <p>
                Make onboarding, verification, and workflow stages easier to
                understand across the page.
              </p>
            </div>

            <div className="bottomCard">
              <span className="sectionTag">Investor Access</span>
              <h3>Portfolio-first dashboard design</h3>
              <p>
                Connect market data, login access, and portfolio tracking in a
                cleaner layout.
              </p>
            </div>
          </div>
        </section>

        <style jsx>{`
          .page {
            min-height: 100vh;
            background: linear-gradient(180deg, #05060a 0%, #090b12 45%, #0c1018 100%);
            color: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
          }

          .hero {
            position: relative;
            overflow: hidden;
            padding: 56px 20px 72px;
          }

          .heroGlow {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            pointer-events: none;
          }

          .heroGlowOne {
            width: 320px;
            height: 320px;
            top: -80px;
            right: -40px;
            background: rgba(240, 185, 11, 0.12);
          }

          .heroGlowTwo {
            width: 240px;
            height: 240px;
            left: -40px;
            top: 140px;
            background: rgba(240, 185, 11, 0.08);
          }

          .heroCard {
            max-width: 1240px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 22px;
            position: relative;
            z-index: 1;
          }

          .heroContent,
          .heroPanel {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(240, 185, 11, 0.16);
            border-radius: 24px;
            padding: 36px;
            box-shadow: 0 14px 40px rgba(0, 0, 0, 0.24);
          }

          .badge {
            display: inline-flex;
            align-items: center;
            min-height: 36px;
            padding: 0 14px;
            border-radius: 999px;
            background: rgba(240, 185, 11, 0.12);
            color: #f0b90b;
            font-size: 14px;
            font-weight: 700;
          }

          h1 {
            margin: 18px 0 14px;
            font-size: 56px;
            line-height: 1.05;
          }

          .subtitle {
            margin: 0;
            color: rgba(255, 255, 255, 0.76);
            line-height: 1.75;
            font-size: 18px;
            max-width: 760px;
          }

          .actions {
            margin-top: 28px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
          }

          .btnPrimary,
          .btnSecondary,
          .btnGhost,
          .smallBtn {
            text-decoration: none;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            transition: 0.2s ease;
            box-sizing: border-box;
          }

          .btnPrimary {
            min-height: 48px;
            padding: 0 20px;
            background: linear-gradient(135deg, #f0b90b, #ffd54a);
            color: #111111;
            box-shadow: 0 10px 24px rgba(240, 185, 11, 0.22);
          }

          .btnPrimary:hover {
            transform: translateY(-1px);
          }

          .btnSecondary {
            min-height: 48px;
            padding: 0 20px;
            border: 1px solid rgba(240, 185, 11, 0.24);
            color: #f0b90b;
            background: rgba(255, 255, 255, 0.02);
          }

          .btnGhost {
            min-height: 48px;
            padding: 0 20px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #ffffff;
            background: transparent;
          }

          .smallBtn {
            min-height: 40px;
            padding: 0 16px;
            background: linear-gradient(135deg, #f0b90b, #ffd54a);
            color: #111111;
          }

          .heroStats {
            margin-top: 32px;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }

          .statBox {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(240, 185, 11, 0.12);
            border-radius: 18px;
            padding: 16px;
          }

          .statValue {
            display: block;
            font-size: 24px;
            font-weight: 800;
            color: #f0b90b;
            margin-bottom: 6px;
          }

          .statLabel {
            display: block;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.62);
            line-height: 1.5;
          }

          .miniPanelTop {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
          }

          .miniPill {
            display: inline-flex;
            align-items: center;
            min-height: 32px;
            padding: 0 12px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
          }

          .miniStatus {
            display: inline-flex;
            align-items: center;
            min-height: 32px;
            padding: 0 12px;
            border-radius: 999px;
            background: rgba(240, 185, 11, 0.12);
            color: #f0b90b;
            font-size: 12px;
            font-weight: 700;
          }

          .miniPanel h3 {
            margin: 0 0 10px;
            font-size: 28px;
          }

          .miniPanel p {
            margin: 0;
            color: rgba(255, 255, 255, 0.72);
            line-height: 1.7;
          }

          .miniGrid {
            margin-top: 20px;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .miniCard {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(240, 185, 11, 0.12);
            border-radius: 16px;
            padding: 16px;
          }

          .miniCard span {
            display: block;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.58);
            margin-bottom: 8px;
          }

          .miniCard strong {
            font-size: 18px;
            color: #ffffff;
          }

          .dashboardSection,
          .bottomSection {
            max-width: 1240px;
            margin: 0 auto;
            padding: 0 20px 80px;
          }

          .sectionHeader {
            margin-bottom: 24px;
            max-width: 760px;
          }

          .sectionTag {
            display: inline-block;
            margin-bottom: 10px;
            color: #f0b90b;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .sectionHeader h2 {
            margin: 0 0 12px;
            font-size: 40px;
            line-height: 1.15;
          }

          .sectionHeader p {
            margin: 0;
            color: rgba(255, 255, 255, 0.72);
            line-height: 1.75;
            font-size: 17px;
          }

          .tabBar {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .tabBtn {
            min-height: 44px;
            padding: 0 18px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.03);
            color: #ffffff;
            cursor: pointer;
            font-weight: 700;
          }

          .tabActive {
            color: #111111;
            background: linear-gradient(135deg, #f0b90b, #ffd54a);
            border-color: transparent;
          }

          .panel {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(240, 185, 11, 0.16);
            border-radius: 24px;
            padding: 28px;
            box-shadow: 0 14px 40px rgba(0, 0, 0, 0.22);
          }

          .panelHeader {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            align-items: center;
            margin-bottom: 18px;
            flex-wrap: wrap;
          }

          .panelHeader h3 {
            margin: 0 0 6px;
            font-size: 28px;
          }

          .panelHeader p {
            margin: 0;
            color: rgba(255, 255, 255, 0.68);
          }

          .marketTable {
            width: 100%;
            border-radius: 18px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          .tableHead,
          .tableRow {
            display: grid;
            grid-template-columns: 2fr 1.2fr 1fr 1fr 0.8fr;
            gap: 14px;
            align-items: center;
            padding: 16px 18px;
          }

          .tableHead {
            background: rgba(255, 255, 255, 0.04);
            font-size: 13px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.68);
          }

          .tableRow {
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            transition: background 0.2s ease;
          }

          .tableRow:hover {
            background: rgba(240, 185, 11, 0.04);
          }

          .assetCell strong,
          .portfolioAsset strong {
            display: block;
            color: #f0b90b;
            font-size: 14px;
            margin-bottom: 4px;
          }

          .assetCell p,
          .portfolioAsset p {
            margin: 0;
            color: rgba(255, 255, 255, 0.74);
            line-height: 1.5;
          }

          .mutedCell {
            color: rgba(255, 255, 255, 0.7);
          }

          .priceCell {
            font-weight: 700;
            color: #ffffff;
            border-radius: 8px;
            padding: 6px 8px;
            width: fit-content;
          }

          .strong {
            font-weight: 700;
          }

          .statusPill {
            display: inline-flex;
            align-items: center;
            min-height: 32px;
            padding: 0 12px;
            border-radius: 999px;
            background: rgba(240, 185, 11, 0.12);
            color: #f0b90b;
            font-size: 12px;
            font-weight: 700;
          }

          .dashboardGrid {
            display: grid;
            grid-template-columns: 1.05fr 0.95fr;
            gap: 18px;
          }

          .summaryCard,
          .loginCard {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(240, 185, 11, 0.12);
            border-radius: 20px;
            padding: 24px;
          }

          .cardLabel {
            display: inline-block;
            color: #f0b90b;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 12px;
          }

          .summaryCard h3,
          .loginCard h3 {
            margin: 0 0 10px;
            font-size: 28px;
          }

          .cardText {
            margin: 0;
            color: rgba(255, 255, 255, 0.72);
            line-height: 1.7;
          }

          .summaryMeta {
            margin-top: 20px;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }

          .summaryMini {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 14px;
            padding: 14px;
          }

          .summaryMini span,
          .portfolioCol span,
          .portfolioStat span {
            display: block;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.58);
            margin-bottom: 8px;
          }

          .summaryMini strong,
          .portfolioCol strong,
          .portfolioStat strong {
            color: #ffffff;
            font-size: 17px;
          }

          .summaryActions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
            flex-wrap: wrap;
          }

          .loginMock {
            margin-top: 20px;
            display: grid;
            gap: 12px;
          }

          .inputMock,
          .loginButtonMock {
            min-height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            padding: 0 16px;
            box-sizing: border-box;
          }

          .inputMock {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.5);
          }

          .loginButtonMock {
            background: linear-gradient(135deg, #f0b90b, #ffd54a);
            color: #111111;
            font-weight: 700;
            justify-content: center;
          }

          .portfolioTop {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin-bottom: 20px;
          }

          .portfolioStat,
          .portfolioRow {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(240, 185, 11, 0.12);
            border-radius: 16px;
            padding: 18px;
          }

          .portfolioList {
            display: grid;
            gap: 12px;
          }

          .portfolioRow {
            display: grid;
            grid-template-columns: 2fr repeat(4, 1fr);
            gap: 14px;
            align-items: center;
          }

          .portfolioCol {
            min-width: 0;
          }

          .bottomGrid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
          }

          .bottomCard {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(240, 185, 11, 0.14);
            border-radius: 22px;
            padding: 24px;
          }

          .bottomCard h3 {
            margin: 0 0 10px;
            font-size: 24px;
          }

          .bottomCard p {
            margin: 0;
            color: rgba(255, 255, 255, 0.72);
            line-height: 1.7;
          }

          .green {
            color: #22c55e;
          }

          .red {
            color: #ef4444;
          }

          .flashGreen {
            animation: greenFlash 0.45s ease;
          }

          .flashRed {
            animation: redFlash 0.45s ease;
          }

          @keyframes greenFlash {
            0% {
              background: rgba(34, 197, 94, 0.22);
            }
            100% {
              background: transparent;
            }
          }

          @keyframes redFlash {
            0% {
              background: rgba(239, 68, 68, 0.22);
            }
            100% {
              background: transparent;
            }
          }

          @media (max-width: 1100px) {
            .heroCard,
            .dashboardGrid,
            .bottomGrid,
            .portfolioTop {
              grid-template-columns: 1fr;
            }

            .heroContent,
            .heroPanel {
              padding: 28px;
            }

            h1 {
              font-size: 44px;
            }
          }

          @media (max-width: 860px) {
            .heroStats,
            .summaryMeta {
              grid-template-columns: 1fr;
            }

            .tableHead {
              display: none;
            }

            .tableRow {
              grid-template-columns: 1fr;
              gap: 10px;
            }

            .portfolioRow {
              grid-template-columns: 1fr;
            }

            .panel,
            .bottomCard {
              padding: 20px;
            }

            .sectionHeader h2 {
              font-size: 32px;
            }
          }

          @media (max-width: 640px) {
            .hero {
              padding: 36px 16px 56px;
            }

            .dashboardSection,
            .bottomSection {
              padding: 0 16px 56px;
            }

            .heroCard {
              gap: 16px;
            }

            h1 {
              font-size: 34px;
            }

            .subtitle,
            .sectionHeader p {
              font-size: 16px;
            }

            .actions,
            .summaryActions,
            .tabBar {
              flex-direction: column;
            }

            .btnPrimary,
            .btnSecondary,
            .btnGhost,
            .smallBtn,
            .tabBtn {
              width: 100%;
            }
          }
        `}</style>
      </main>
    </>
  );
}