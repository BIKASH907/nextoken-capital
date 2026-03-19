import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";

const marketCards = [
  { name: "BTC", full: "Bitcoin", price: "$67,421.21", change: "+2.18%" },
  { name: "ETH", full: "Ethereum", price: "$3,412.55", change: "+1.44%" },
  { name: "BNB", full: "BNB", price: "$592.30", change: "+0.86%" },
  { name: "SOL", full: "Solana", price: "$154.22", change: "+3.19%" },
];

const productCards = [
  {
    title: "Buy Crypto",
    text: "Purchase digital assets with simple onboarding and a fast user journey.",
  },
  {
    title: "Trade Markets",
    text: "Access spot-style market interfaces with premium presentation and speed.",
  },
  {
    title: "Invest in Offerings",
    text: "Explore tokenized bonds, equity access, and curated capital market products.",
  },
  {
    title: "Tokenize Assets",
    text: "Bring real-world opportunities to a modern investor-ready digital platform.",
  },
];

const highlights = [
  {
    title: "Deep Liquidity Experience",
    text: "A premium homepage inspired by global exchange platforms, adapted for Nextoken Capital.",
  },
  {
    title: "Institutional Presentation",
    text: "Clear product sections, trust indicators, market cards, and strong investor-facing CTAs.",
  },
  {
    title: "Built for Conversion",
    text: "Focused messaging and action blocks designed to guide visitors from interest to onboarding.",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Nextoken Capital</title>
        <meta
          name="description"
          content="Nextoken Capital digital capital markets platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className="page">
        <section className="hero">
          <div className="heroBg">
            <Image
              src="/hero-bg.jpg"
              alt="Hero background"
              fill
              priority
              style={{ objectFit: "cover" }}
            />
            <div className="heroOverlay" />
          </div>

          <div className="container heroInner">
            <div className="heroLeft">
              <p className="eyebrow">Trusted by modern digital investors</p>
              <h1>Buy, trade, and invest in digital capital markets</h1>
              <p className="heroText">
                Nextoken Capital gives users a premium gateway into markets,
                tokenized products, and investor-ready digital offerings with a
                fast, clean, exchange-inspired experience.
              </p>

              <div className="heroActions">
                <a href="/register" className="primaryBtn">
                  Get Started
                </a>
                <a href="/markets" className="secondaryBtn">
                  View Markets
                </a>
              </div>

              <div className="trustRow">
                <span>Fast onboarding</span>
                <span>Premium UI</span>
                <span>Investor-focused flows</span>
              </div>
            </div>

            <div className="heroRight">
              <div className="tradeCard">
                <div className="tradeHeader">
                  <span>Market Overview</span>
                  <span className="status">Live</span>
                </div>

                <div className="chartArea">
                  <div className="chartGlow" />
                  <div className="chartLine">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="tickerList">
                  {marketCards.map((item) => (
                    <div className="tickerItem" key={item.name}>
                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.full}</p>
                      </div>
                      <div className="tickerRight">
                        <strong>{item.price}</strong>
                        <span>{item.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="marketSection">
          <div className="container">
            <div className="sectionHead">
              <div>
                <p className="sectionTag">Markets</p>
                <h2>Explore the market with a modern exchange-style layout</h2>
              </div>
              <a href="/markets" className="sectionLink">
                View all markets
              </a>
            </div>

            <div className="marketGrid">
              {marketCards.map((item) => (
                <div className="marketCard" key={item.name}>
                  <div className="marketTop">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.full}</p>
                    </div>
                    <span className="positive">{item.change}</span>
                  </div>

                  <div className="miniChart">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="marketBottom">
                    <strong>{item.price}</strong>
                    <a href="/markets">Trade now</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="productSection">
          <div className="container">
            <div className="sectionHead centerHead">
              <p className="sectionTag">Products</p>
              <h2>Everything users need in one powerful homepage</h2>
            </div>

            <div className="productGrid">
              {productCards.map((item) => (
                <div className="productCard" key={item.title}>
                  <div className="iconBox">{item.title.charAt(0)}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bannerSection">
          <div className="container">
            <div className="bannerCard">
              <div className="bannerText">
                <p className="sectionTag">Why Nextoken Capital</p>
                <h2>Designed to feel like a world-class trading platform</h2>
                <p>
                  This layout brings back your richer homepage design and makes
                  it feel closer to the polished style of leading exchange
                  platforms.
                </p>
              </div>

              <div className="bannerActions">
                <a href="/register" className="primaryBtn">
                  Register Now
                </a>
                <a href="/tokenize" className="secondaryBtn">
                  Start Tokenizing
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="highlightSection">
          <div className="container">
            <div className="sectionHead centerHead">
              <p className="sectionTag">Highlights</p>
              <h2>Premium presentation across every section</h2>
            </div>

            <div className="highlightGrid">
              {highlights.map((item) => (
                <div className="highlightCard" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container footerInner">
            <div>
              <h3>Nextoken Capital</h3>
              <p>
                A modern capital markets experience inspired by premium exchange
                design.
              </p>
            </div>

            <div className="footerLinks">
              <a href="/markets">Markets</a>
              <a href="/exchange">Trade</a>
              <a href="/bonds">Earn</a>
              <a href="/equity">Equity & IPO</a>
              <a href="/tokenize">Tokenize</a>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        .page {
          background: #0b0e11;
          color: #ffffff;
          min-height: 100vh;
        }

        .container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .hero {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          padding-top: 64px;
        }

        .heroBg {
          position: absolute;
          inset: 0;
        }

        .heroOverlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(240, 185, 11, 0.12), transparent 30%),
            linear-gradient(180deg, rgba(11, 14, 17, 0.35) 0%, rgba(11, 14, 17, 0.92) 72%, #0b0e11 100%);
        }

        .heroInner {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 36px;
          align-items: center;
          padding-top: 56px;
          padding-bottom: 80px;
        }

        .eyebrow,
        .sectionTag {
          color: #f0b90b;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin: 0 0 14px;
        }

        .heroLeft h1 {
          margin: 0 0 22px;
          font-size: clamp(44px, 7vw, 84px);
          line-height: 1.04;
          font-weight: 900;
          letter-spacing: -0.04em;
          max-width: 760px;
        }

        .heroText {
          margin: 0 0 30px;
          max-width: 690px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 19px;
          line-height: 1.8;
        }

        .heroActions,
        .bannerActions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .primaryBtn,
        .secondaryBtn,
        .sectionLink {
          text-decoration: none;
        }

        .primaryBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 24px;
          border-radius: 10px;
          background: #f0b90b;
          color: #111111;
          font-size: 14px;
          font-weight: 800;
        }

        .primaryBtn:hover {
          background: #ffd24a;
        }

        .secondaryBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 24px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
          font-size: 14px;
          font-weight: 700;
        }

        .trustRow {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          margin-top: 22px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 14px;
        }

        .trustRow span::before {
          content: "•";
          color: #f0b90b;
          margin-right: 8px;
        }

        .tradeCard {
          background: linear-gradient(180deg, rgba(28, 31, 38, 0.94), rgba(18, 20, 26, 0.96));
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 22px;
          padding: 22px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.32);
        }

        .tradeHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 14px;
          font-weight: 700;
        }

        .status {
          color: #111;
          background: #f0b90b;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .chartArea {
          position: relative;
          height: 220px;
          border-radius: 16px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)),
            #11141b;
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          margin-bottom: 18px;
        }

        .chartGlow {
          position: absolute;
          inset: auto 0 0 0;
          height: 120px;
          background: linear-gradient(180deg, rgba(240, 185, 11, 0), rgba(240, 185, 11, 0.14));
        }

        .chartLine {
          position: absolute;
          inset: 26px 18px 26px 18px;
          display: flex;
          align-items: end;
          justify-content: space-between;
        }

        .chartLine span {
          width: 12%;
          border-radius: 999px 999px 0 0;
          background: linear-gradient(180deg, #f0b90b, #8a6a07);
        }

        .chartLine span:nth-child(1) { height: 32%; }
        .chartLine span:nth-child(2) { height: 50%; }
        .chartLine span:nth-child(3) { height: 42%; }
        .chartLine span:nth-child(4) { height: 70%; }
        .chartLine span:nth-child(5) { height: 62%; }
        .chartLine span:nth-child(6) { height: 84%; }
        .chartLine span:nth-child(7) { height: 76%; }

        .tickerList {
          display: grid;
          gap: 12px;
        }

        .tickerItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
        }

        .tickerItem strong {
          display: block;
          font-size: 15px;
        }

        .tickerItem p {
          margin: 4px 0 0;
          color: rgba(255, 255, 255, 0.54);
          font-size: 13px;
        }

        .tickerRight {
          text-align: right;
        }

        .tickerRight span,
        .positive {
          color: #0ecb81;
          font-size: 13px;
          font-weight: 700;
        }

        .marketSection,
        .productSection,
        .bannerSection,
        .highlightSection {
          padding: 88px 0;
        }

        .sectionHead {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .centerHead {
          display: block;
          text-align: center;
        }

        .sectionHead h2,
        .centerHead h2,
        .bannerText h2 {
          margin: 0;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.15;
          font-weight: 800;
        }

        .sectionLink {
          color: #f0b90b;
          font-weight: 700;
        }

        .marketGrid,
        .productGrid,
        .highlightGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .marketCard,
        .productCard,
        .highlightCard {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          padding: 22px;
        }

        .marketTop,
        .marketBottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .marketTop h3,
        .productCard h3,
        .highlightCard h3 {
          margin: 0 0 6px;
          font-size: 22px;
        }

        .marketTop p,
        .productCard p,
        .highlightCard p,
        .bannerText p {
          margin: 0;
          color: rgba(255, 255, 255, 0.66);
          line-height: 1.8;
          font-size: 15px;
        }

        .miniChart {
          height: 86px;
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 8px;
          margin: 18px 0;
        }

        .miniChart span {
          flex: 1;
          border-radius: 999px 999px 0 0;
          background: linear-gradient(180deg, #f0b90b, #8b6c08);
        }

        .miniChart span:nth-child(1) { height: 36%; }
        .miniChart span:nth-child(2) { height: 58%; }
        .miniChart span:nth-child(3) { height: 48%; }
        .miniChart span:nth-child(4) { height: 80%; }
        .miniChart span:nth-child(5) { height: 62%; }
        .miniChart span:nth-child(6) { height: 74%; }

        .marketBottom strong {
          font-size: 18px;
        }

        .marketBottom a {
          color: #f0b90b;
          text-decoration: none;
          font-weight: 700;
        }

        .iconBox {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(240, 185, 11, 0.14);
          color: #f0b90b;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 900;
          margin-bottom: 18px;
        }

        .bannerCard {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          padding: 34px;
          border-radius: 24px;
          background:
            radial-gradient(circle at top right, rgba(240, 185, 11, 0.14), transparent 28%),
            rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .bannerText {
          max-width: 760px;
        }

        .footer {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 34px 0 44px;
        }

        .footerInner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .footerInner h3 {
          margin: 0 0 8px;
          font-size: 20px;
        }

        .footerInner p {
          margin: 0;
          color: rgba(255, 255, 255, 0.58);
        }

        .footerLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
        }

        .footerLinks a {
          color: rgba(255, 255, 255, 0.72);
          text-decoration: none;
        }

        .footerLinks a:hover {
          color: #ffffff;
        }

        @media (max-width: 1100px) {
          .heroInner,
          .marketGrid,
          .productGrid,
          .highlightGrid {
            grid-template-columns: 1fr 1fr;
          }

          .heroInner {
            align-items: start;
          }
        }

        @media (max-width: 820px) {
          .heroInner,
          .marketGrid,
          .productGrid,
          .highlightGrid,
          .footerInner {
            grid-template-columns: 1fr;
            display: grid;
          }

          .sectionHead,
          .bannerCard {
            display: block;
          }

          .sectionLink {
            display: inline-block;
            margin-top: 12px;
          }

          .bannerActions {
            margin-top: 22px;
          }

          .heroText {
            font-size: 17px;
          }
        }

        @media (max-width: 560px) {
          .heroActions,
          .bannerActions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .primaryBtn,
          .secondaryBtn {
            width: 100%;
          }

          .heroInner {
            padding-top: 34px;
          }

          .heroLeft h1 {
            font-size: 42px;
          }
        }
      `}</style>
    </>
  );
}