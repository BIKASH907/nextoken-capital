import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const TICKER = [
  { symbol: "BTC/EUR", price: "62054.31", change: "-3.66" },
  { symbol: "ETH/EUR", price: "1913.01", change: "-5.24" },
  { symbol: "BNB/EUR", price: "568.90", change: "-2.20" },
  { symbol: "SOL/EUR", price: "98.42", change: "+1.12" },
  { symbol: "XRP/EUR", price: "0.4821", change: "+0.87" },
  { symbol: "ADA/EUR", price: "0.3312", change: "-1.45" },
  { symbol: "AVAX/EUR", price: "22.18", change: "+2.30" },
  { symbol: "DOT/EUR", price: "5.74", change: "-0.92" },
  { symbol: "MATIC/EUR", price: "0.5123", change: "+3.10" },
  { symbol: "LINK/EUR", price: "11.42", change: "+1.75" },
];

const ASSET_CATEGORIES = [
  {
    label: "Real Assets",
    color: "#f5c842",
    items: ["Real Estate", "Infrastructure", "Precious Metals", "Commodities", "Agricultural Assets"],
  },
  {
    label: "Financial Assets",
    color: "#4f8ef7",
    items: ["Corporate Bonds", "Private Equity", "Venture Capital", "Debt Instruments", "Revenue Streams"],
  },
  {
    label: "Alternative Investments",
    color: "#0ecb81",
    items: ["Art & Collectibles", "Music & Film Rights", "Sports Clubs", "Healthcare", "Luxury Goods"],
  },
  {
    label: "Emerging Markets",
    color: "#b77aff",
    items: ["Carbon Credits", "Intellectual Property", "Gaming Assets", "Royalty Streams", "ESG Instruments"],
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Securitize",
    desc: "Choose your jurisdiction, structure your financial instrument, and prepare your legal wrapper for on-chain issuance.",
  },
  {
    step: "02",
    title: "Tokenize",
    desc: "Onboard investors with a compliant KYC/AML digital experience. Allocate security tokens to approved wallets.",
  },
  {
    step: "03",
    title: "Manage",
    desc: "Handle dividends, corporate actions, transfers, and compliance enforcement — all automated on the blockchain.",
  },
];

const PRODUCTS = [
  { icon: "📜", title: "Bond Issuance", desc: "Issue tokenized corporate or government bonds with automated coupon payments and instant settlement.", tag: "15–18% Target ROI" },
  { icon: "🏠", title: "Real Estate", desc: "Fractional ownership of income-generating real estate. Lower minimums, global investors, 24/7 liquidity.", tag: "From €1,000" },
  { icon: "📊", title: "Equity & IPO", desc: "Run regulated tokenized equity rounds and secondary market trading without traditional broker overhead.", tag: "DLT Pilot Regime" },
  { icon: "⚡", title: "Exchange", desc: "Deep liquidity secondary market for all tokenized assets. 0.2% flat fee, instant settlement, 24/7.", tag: "0.2% Fee" },
];

const STATS = [
  { value: "$300T+", label: "Global Asset Market" },
  { value: "190+", label: "Countries Supported" },
  { value: "<48h", label: "Time to Issue" },
  { value: "12,400+", label: "Registered Investors" },
];

export default function Home() {
  const router = useRouter();
  const [ticker, setTicker] = useState(TICKER);

  useEffect(() => {
    const id = setInterval(() => {
      setTicker((prev) =>
        prev.map((t) => {
          const d = (Math.random() - 0.5) * 0.3;
          const raw = parseFloat(t.price.replace(/,/g, "")) * (1 + d / 100);
          const price = raw >= 1
            ? raw.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : raw.toFixed(4);
          const ch = parseFloat(t.change) + d;
          return { ...t, price, change: (ch >= 0 ? "+" : "") + ch.toFixed(2) };
        })
      );
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Navbar />
      <main className="main">

        {/* ── TICKER ── */}
        <div className="ticker">
          <div className="tickerTrack">
            {[...ticker, ...ticker].map((t, i) => (
              <div className="tickerItem" key={i}>
                <span className="tSym">{t.symbol}</span>
                <span className="tPrice">{t.price}</span>
                <span className={`tChg ${t.change.startsWith("+") ? "up" : "dn"}`}>{t.change}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="wrap heroWrap">
            <div className="heroLeft">
              <div className="heroPill">
                <span className="pillDot" />
                MiCA Licensed · EU Regulated · DLT Pilot Regime
              </div>
              <h1 className="heroH1">
                Institutional-Grade<br />
                <span className="gold">Tokenized Capital Markets</span>
              </h1>
              <p className="heroSub">
                Issue bonds, tokenize real-world assets, launch equity offerings and trade
                on a regulated 24/7 secondary market — all on one compliant platform
                supervised by the Bank of Lithuania.
              </p>
              <div className="heroCtas">
                <button className="btnPrimary" onClick={() => router.push("/register")}>
                  Start Investing
                </button>
                <button className="btnGhost" onClick={() => router.push("/tokenize")}>
                  Tokenize an Asset
                </button>
              </div>
              <div className="heroStats">
                {STATS.map((s) => (
                  <div className="hStat" key={s.label}>
                    <span className="hStatV">{s.value}</span>
                    <span className="hStatL">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="heroRight">
              <div className="liveCard">
                <div className="lcHead">
                  <span className="lcTitle">Live Markets</span>
                  <span className="lcLive">● LIVE</span>
                </div>
                {ticker.slice(0, 5).map((t) => (
                  <div className="lcRow" key={t.symbol}>
                    <span className="lcSym">{t.symbol}</span>
                    <span className="lcPrice">€{t.price}</span>
                    <span className={`lcChg ${t.change.startsWith("+") ? "up" : "dn"}`}>{t.change}%</span>
                  </div>
                ))}
                <button className="lcBtn" onClick={() => router.push("/exchange")}>
                  Open Exchange →
                </button>
              </div>
              <div className="yieldCard">
                <span className="ycLabel">Target Annual Yield</span>
                <span className="ycValue">15 – 18%</span>
                <span className="ycSub">On tokenized bond products · EU regulated</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT CAN BE TOKENIZED ── */}
        <section className="section">
          <div className="wrap blockWrap">
            <div className="sectionHead">
              <p className="eyebrow">WHAT CAN BE TOKENIZED</p>
              <h2 className="sectionH2">Any Asset. Any Market. On-Chain.</h2>
              <p className="sectionSub">From real estate to carbon credits — if it has value, it can be tokenized and traded on Nextoken Capital.</p>
            </div>
            <div className="catGrid">
              {ASSET_CATEGORIES.map((cat) => (
                <div className="catCard" key={cat.label} style={{ "--accent": cat.color }}>
                  <div className="catLabel" style={{ color: cat.color }}>{cat.label}</div>
                  <ul className="catList">
                    {cat.items.map((item) => (
                      <li key={item}>
                        <span className="catDot" style={{ background: cat.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="section sectionDark">
          <div className="wrap blockWrap">
            <div className="sectionHead">
              <p className="eyebrow">HOW IT WORKS</p>
              <h2 className="sectionH2">From Asset to Token in 3 Steps</h2>
            </div>
            <div className="processRow">
              {PROCESS.map((p, idx) => (
                <div className="processCard" key={p.step}>
                  <div className="processStep">{p.step}</div>
                  <h3 className="processTitle">{p.title}</h3>
                  <p className="processDesc">{p.desc}</p>
                  {idx < PROCESS.length - 1 && <div className="processArrow">→</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section className="section">
          <div className="wrap blockWrap">
            <div className="sectionHead">
              <p className="eyebrow">OUR PRODUCTS</p>
              <h2 className="sectionH2">Every Financial Instrument. Tokenized.</h2>
            </div>
            <div className="prodGrid">
              {PRODUCTS.map((p) => (
                <div className="prodCard" key={p.title}>
                  <div className="prodTop">
                    <span className="prodIcon">{p.icon}</span>
                    <span className="prodTag">{p.tag}</span>
                  </div>
                  <h3 className="prodTitle">{p.title}</h3>
                  <p className="prodDesc">{p.desc}</p>
                  <button className="prodBtn" onClick={() => router.push("/register")}>Learn More →</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPLIANCE ── */}
        <section className="section sectionDark">
          <div className="wrap blockWrap">
            <div className="sectionHead">
              <p className="eyebrow">COMPLIANCE & REGULATION</p>
              <h2 className="sectionH2">Regulated. Audited. Trusted.</h2>
              <p className="sectionSub">Every token issued on Nextoken Capital is backed by a legal framework. We operate under the strictest EU financial regulations.</p>
            </div>
            <div className="compGrid">
              {[
                { icon: "🇪🇺", title: "MiCA Licensed", desc: "Fully compliant with the EU Markets in Crypto-Assets Regulation. The gold standard for digital asset regulation." },
                { icon: "🏦", title: "Bank of Lithuania", desc: "Supervised and monitored by Lietuvos bankas — Lithuania's central bank and primary financial regulator." },
                { icon: "⚖️", title: "DLT Pilot Regime", desc: "Approved to operate under the EU DLT Pilot Regime, enabling regulated trading of tokenized securities." },
                { icon: "🛡", title: "AML / KYC", desc: "Institutional-grade KYC onboarding, real-time AML screening, and continuous transaction monitoring." },
                { icon: "🔍", title: "SOC 2 Audited", desc: "Annual third-party security audits ensuring your data and assets meet the highest industry standards." },
                { icon: "📋", title: "GDPR Compliant", desc: "Full compliance with EU data protection regulation. Your data is never sold or shared with third parties." },
              ].map((c) => (
                <div className="compCard" key={c.title}>
                  <span className="compIcon">{c.icon}</span>
                  <h4 className="compTitle">{c.title}</h4>
                  <p className="compDesc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ctaSection">
          <div className="wrap ctaWrap">
            <div className="ctaLeft">
              <h2 className="ctaH2">Ready to enter the future of capital markets?</h2>
              <p className="ctaP">Join 12,400+ investors and issuers already on the platform. Free to register, no minimums to explore.</p>
            </div>
            <div className="ctaBtns">
              <button className="btnPrimary" onClick={() => router.push("/register")}>Create Free Account</button>
              <button className="btnGhost" onClick={() => router.push("/markets")}>Explore Markets</button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="wrap footerWrap">
            <div className="footerTop">
              <div className="footerBrand">
                <div className="fLogo">
                  <span className="fNxt">NXT</span>
                  <div className="fLogoText">
                    <span className="fLogoTop">NEXTOKEN</span>
                    <span className="fLogoBot">CAPITAL</span>
                  </div>
                </div>
                <p className="fTagline">Regulated infrastructure for tokenized real-world assets. Supervised by the Bank of Lithuania.</p>
                <div className="litBadge">
                  <span className="litFlag">🇱🇹</span>
                  <div>
                    <span className="litLabel">Monitored by</span>
                    <span className="litName">Bank of Lithuania</span>
                  </div>
                </div>
                <div className="litBadge" style={{marginTop:"10px"}}>
                  <span className="litFlag">🇪🇺</span>
                  <div>
                    <span className="litLabel">Licensed under</span>
                    <span className="litName">MiCA Regulation</span>
                  </div>
                </div>
              </div>
              <div className="footerCols">
                {[
                  { title: "Products", links: [["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity"],["Tokenize","/tokenize"]] },
                  { title: "Assets", links: [["Real Estate",""],["Corporate Bonds",""],["Private Equity",""],["Carbon Credits",""],["Infrastructure",""]] },
                  { title: "Company", links: [["About Us",""],["Careers",""],["Press",""],["Blog",""],["Partners",""]] },
                  { title: "Legal", links: [["Terms of Service",""],["Privacy Policy",""],["Risk Disclosure",""],["AML Policy",""],["Cookie Policy",""]] },
                ].map((col) => (
                  <div className="footerCol" key={col.title}>
                    <h5 className="colTitle">{col.title}</h5>
                    {col.links.map(([label, href]) => (
                      <a key={label} className="colLink" onClick={() => href && router.push(href)}>{label}</a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="footerBottom">
              <p>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania. Company No. 305XXXXXX.</p>
              <p>⚠ Risk warning: Investing in tokenized assets carries risk. Capital is at risk. Past performance is not indicative of future results. This is not financial advice.</p>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        * { box-sizing: border-box; }
        .main { background: #0b0b0f; color: #fff; min-height: 100vh; padding-top: 68px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .wrap { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
        .blockWrap { display: block; }

        /* TICKER */
        .ticker { background: #111116; border-bottom: 1px solid rgba(255,255,255,0.05); overflow: hidden; height: 42px; display: flex; align-items: center; }
        .tickerTrack { display: flex; animation: slide 60s linear infinite; width: max-content; }
        @keyframes slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .tickerItem { display: flex; align-items: center; gap: 8px; padding: 0 28px; border-right: 1px solid rgba(255,255,255,0.05); white-space: nowrap; }
        .tSym { font-size: 12px; color: rgba(255,255,255,0.4); font-weight: 500; }
        .tPrice { font-size: 12px; color: #fff; font-weight: 600; font-variant-numeric: tabular-nums; }
        .tChg { font-size: 12px; font-weight: 600; }
        .up { color: #0ecb81; }
        .dn { color: #f6465d; }

        /* HERO */
        .hero { padding: 90px 0 70px; }
        .heroWrap { display: flex; align-items: flex-start; gap: 60px; }
        .heroLeft { flex: 1; }
        .heroRight { flex-shrink: 0; width: 320px; display: flex; flex-direction: column; gap: 16px; }
        .heroPill { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; padding: 6px 14px; margin-bottom: 24px; }
        .pillDot { width: 6px; height: 6px; border-radius: 50%; background: #0ecb81; flex-shrink: 0; }
        .heroH1 { font-size: 54px; font-weight: 800; line-height: 1.08; margin: 0 0 20px; letter-spacing: -1.5px; color: #fff; }
        .gold { color: #f5c842; }
        .heroSub { font-size: 16px; color: rgba(255,255,255,0.48); line-height: 1.75; max-width: 540px; margin: 0 0 36px; }
        .heroCtas { display: flex; gap: 14px; margin-bottom: 52px; }
        .btnPrimary { padding: 14px 32px; border-radius: 8px; border: none; background: #f5c842; color: #111; font-size: 15px; font-weight: 700; cursor: pointer; transition: background .15s, transform .12s; white-space: nowrap; }
        .btnPrimary:hover { background: #ffd84d; transform: translateY(-1px); }
        .btnGhost { padding: 14px 32px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.18); background: transparent; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; transition: border-color .15s, background .15s; white-space: nowrap; }
        .btnGhost:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); }
        .heroStats { display: flex; gap: 0; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 32px; }
        .hStat { flex: 1; border-right: 1px solid rgba(255,255,255,0.07); padding-right: 24px; margin-right: 24px; }
        .hStat:last-child { border-right: none; margin-right: 0; padding-right: 0; }
        .hStatV { display: block; font-size: 24px; font-weight: 800; color: #f5c842; margin-bottom: 4px; }
        .hStatL { font-size: 11px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 1px; }

        /* LIVE CARD */
        .liveCard { background: #13131a; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 22px; }
        .lcHead { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .lcTitle { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.55); }
        .lcLive { font-size: 11px; color: #0ecb81; font-weight: 600; }
        .lcRow { display: flex; align-items: center; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .lcSym { font-size: 13px; font-weight: 600; color: #fff; width: 95px; }
        .lcPrice { font-size: 13px; color: rgba(255,255,255,0.75); flex: 1; text-align: right; font-variant-numeric: tabular-nums; }
        .lcChg { font-size: 12px; font-weight: 600; width: 64px; text-align: right; }
        .lcBtn { margin-top: 14px; width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(245,200,66,0.25); background: transparent; color: #f5c842; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s; }
        .lcBtn:hover { background: rgba(245,200,66,0.07); }

        /* YIELD CARD */
        .yieldCard { background: linear-gradient(135deg, #1a1500 0%, #13131a 100%); border: 1px solid rgba(245,200,66,0.2); border-radius: 16px; padding: 22px; text-align: center; }
        .ycLabel { display: block; font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
        .ycValue { display: block; font-size: 36px; font-weight: 900; color: #f5c842; letter-spacing: -1px; margin-bottom: 6px; }
        .ycSub { font-size: 12px; color: rgba(255,255,255,0.35); }

        /* SECTIONS */
        .section { padding: 90px 0; border-top: 1px solid rgba(255,255,255,0.05); }
        .sectionDark { background: #0e0e14; }
        .sectionHead { text-align: center; margin-bottom: 56px; }
        .eyebrow { font-size: 11px; letter-spacing: 2.5px; color: #f5c842; font-weight: 700; margin: 0 0 12px; }
        .sectionH2 { font-size: 38px; font-weight: 800; color: #fff; margin: 0 0 16px; letter-spacing: -0.8px; }
        .sectionSub { font-size: 16px; color: rgba(255,255,255,0.42); max-width: 560px; margin: 0 auto; line-height: 1.7; }

        /* ASSET CATEGORIES */
        .catGrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .catCard { background: #13131a; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 24px; border-top: 3px solid var(--accent); transition: transform .2s, border-color .2s; }
        .catCard:hover { transform: translateY(-4px); }
        .catLabel { font-size: 13px; font-weight: 700; margin-bottom: 16px; display: block; letter-spacing: 0.3px; }
        .catList { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .catList li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.55); }
        .catDot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

        /* PROCESS */
        .processRow { display: flex; gap: 0; position: relative; }
        .processCard { flex: 1; background: #13131a; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 32px 28px; position: relative; }
        .processCard:not(:last-child) { margin-right: 20px; }
        .processStep { font-size: 11px; font-weight: 700; color: #f5c842; letter-spacing: 2px; margin-bottom: 16px; }
        .processTitle { font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 12px; }
        .processDesc { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; margin: 0; }
        .processArrow { position: absolute; right: -22px; top: 50%; transform: translateY(-50%); font-size: 20px; color: rgba(255,255,255,0.2); z-index: 1; }

        /* PRODUCTS */
        .prodGrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .prodCard { background: #13131a; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 26px; display: flex; flex-direction: column; gap: 12px; transition: border-color .2s, background .2s; }
        .prodCard:hover { border-color: rgba(245,200,66,0.3); background: #171720; }
        .prodTop { display: flex; justify-content: space-between; align-items: center; }
        .prodIcon { font-size: 26px; }
        .prodTag { font-size: 10px; font-weight: 700; color: #f5c842; background: rgba(245,200,66,0.1); border-radius: 6px; padding: 3px 8px; }
        .prodTitle { font-size: 17px; font-weight: 700; color: #fff; margin: 0; }
        .prodDesc { font-size: 13px; color: rgba(255,255,255,0.42); line-height: 1.65; margin: 0; flex: 1; }
        .prodBtn { font-size: 13px; color: #f5c842; background: none; border: none; cursor: pointer; padding: 0; font-weight: 600; text-align: left; transition: opacity .15s; }
        .prodBtn:hover { opacity: 0.7; }

        /* COMPLIANCE */
        .compGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .compCard { background: #13131a; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 26px; }
        .compIcon { font-size: 28px; display: block; margin-bottom: 14px; }
        .compTitle { font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 8px; }
        .compDesc { font-size: 13px; color: rgba(255,255,255,0.42); line-height: 1.65; margin: 0; }

        /* CTA */
        .ctaSection { padding: 90px 0; background: linear-gradient(135deg, #14100a 0%, #0b0b0f 60%); border-top: 1px solid rgba(255,255,255,0.05); }
        .ctaWrap { display: flex; justify-content: space-between; align-items: center; gap: 48px; }
        .ctaLeft { flex: 1; }
        .ctaH2 { font-size: 34px; font-weight: 800; color: #fff; margin: 0 0 10px; letter-spacing: -0.5px; }
        .ctaP { font-size: 15px; color: rgba(255,255,255,0.42); margin: 0; line-height: 1.6; }
        .ctaBtns { display: flex; flex-direction: column; gap: 12px; flex-shrink: 0; }

        /* FOOTER */
        .footer { background: #080810; border-top: 1px solid rgba(255,255,255,0.06); padding: 64px 0 32px; }
        .footerWrap { display: block; }
        .footerTop { display: flex; gap: 80px; margin-bottom: 48px; }
        .footerBrand { flex-shrink: 0; width: 240px; }
        .fLogo { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .fNxt { font-size: 22px; font-weight: 900; color: #f5c842; }
        .fLogoText { display: flex; flex-direction: column; line-height: 1; gap: 2px; }
        .fLogoTop { font-size: 12px; font-weight: 700; color: #fff; letter-spacing: 2px; }
        .fLogoBot { font-size: 9px; color: rgba(255,255,255,0.35); letter-spacing: 2.5px; }
        .fTagline { font-size: 13px; color: rgba(255,255,255,0.35); line-height: 1.65; margin: 0 0 20px; }
        .litBadge { display: flex; align-items: center; gap: 10px; background: #111118; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; }
        .litFlag { font-size: 18px; flex-shrink: 0; }
        .litBadge div { display: flex; flex-direction: column; gap: 1px; }
        .litLabel { font-size: 9px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1px; }
        .litName { font-size: 12px; font-weight: 600; color: #fff; }
        .footerCols { display: flex; gap: 56px; flex: 1; }
        .footerCol { display: flex; flex-direction: column; gap: 11px; }
        .colTitle { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.6); margin: 0 0 4px; text-transform: uppercase; letter-spacing: 1px; }
        .colLink { font-size: 13px; color: rgba(255,255,255,0.35); cursor: pointer; transition: color .15s; text-decoration: none; }
        .colLink:hover { color: rgba(255,255,255,0.75); }
        .footerBottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px; display: flex; flex-direction: column; gap: 6px; }
        .footerBottom p { font-size: 12px; color: rgba(255,255,255,0.22); margin: 0; line-height: 1.6; }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .catGrid { grid-template-columns: repeat(2, 1fr); }
          .prodGrid { grid-template-columns: repeat(2, 1fr); }
          .compGrid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 960px) {
          .heroWrap { flex-direction: column; }
          .heroRight { width: 100%; flex-direction: row; }
          .liveCard, .yieldCard { flex: 1; }
          .footerTop { flex-direction: column; gap: 40px; }
          .footerBrand { width: 100%; }
          .footerCols { flex-wrap: wrap; gap: 32px; }
          .processRow { flex-direction: column; gap: 16px; }
          .processCard { margin-right: 0 !important; }
          .processArrow { display: none; }
        }
        @media (max-width: 640px) {
          .heroH1 { font-size: 36px; }
          .sectionH2 { font-size: 28px; }
          .catGrid { grid-template-columns: 1fr; }
          .prodGrid { grid-template-columns: 1fr; }
          .compGrid { grid-template-columns: 1fr; }
          .heroRight { flex-direction: column; }
          .ctaWrap { flex-direction: column; align-items: flex-start; }
          .heroStats { flex-wrap: wrap; gap: 16px; }
          .hStat { flex: none; border-right: none; margin-right: 0; padding-right: 0; }
        }
      `}</style>
    </>
  );
}