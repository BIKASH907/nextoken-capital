import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const TICKER_ITEMS = [
  { symbol: "BTC/EUR", price: "62,054.31", change: "-3.66" },
  { symbol: "ETH/EUR", price: "1,913.01", change: "-5.24" },
  { symbol: "BNB/EUR", price: "568.90", change: "-2.20" },
  { symbol: "SOL/EUR", price: "98.42", change: "+1.12" },
  { symbol: "XRP/EUR", price: "0.4821", change: "+0.87" },
  { symbol: "ADA/EUR", price: "0.3312", change: "-1.45" },
  { symbol: "AVAX/EUR", price: "22.18", change: "+2.30" },
  { symbol: "DOT/EUR", price: "5.74", change: "-0.92" },
  { symbol: "MATIC/EUR", price: "0.5123", change: "+3.10" },
  { symbol: "LINK/EUR", price: "11.42", change: "+1.75" },
];

const FEATURES = [
  { icon: "🏛", title: "Issue Bonds", desc: "Launch regulated tokenized bonds on-chain with full MiCA compliance and instant settlement." },
  { icon: "🏠", title: "Tokenize Assets", desc: "Convert real estate, infrastructure, and business equity into tradeable digital tokens." },
  { icon: "📈", title: "Equity & IPO", desc: "Participate in tokenized equity offerings and secondary market trading 24/7." },
  { icon: "⚡", title: "Exchange", desc: "Trade tokenized real-world assets with deep liquidity and 0.2% flat trading fees." },
  { icon: "🌍", title: "190+ Countries", desc: "Global access to regulated capital markets infrastructure from anywhere in the world." },
  { icon: "🔒", title: "EU Regulated", desc: "Fully licensed under MiCA, supervised by the Bank of Lithuania and EU authorities." },
];

const STATS = [
  { value: "$300T+", label: "Global Asset Market" },
  { value: "190+", label: "Countries" },
  { value: "<48h", label: "Time to Issue" },
  { value: "0.2%", label: "Trading Fee" },
];

export default function Home() {
  const router = useRouter();
  const [prices, setPrices] = useState(TICKER_ITEMS);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.5) * 0.4;
          const raw = parseFloat(item.price.replace(/,/g, "")) * (1 + delta / 100);
          const formatted = raw >= 1
            ? raw.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : raw.toFixed(4);
          const changeVal = parseFloat(item.change) + delta;
          return { ...item, price: formatted, change: (changeVal >= 0 ? "+" : "") + changeVal.toFixed(2) };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main className="main">

        {/* BACKGROUND ORBS */}
        <div className="bgOrbs" aria-hidden="true">
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />
          <div className="orb orb4" />
          <div className="dotGrid" />
        </div>

        {/* TICKER BAR */}
        <div className="tickerWrap">
          <div className="tickerTrack">
            {[...prices, ...prices].map((item, i) => (
              <div className="tickerItem" key={i}>
                <span className="tSym">{item.symbol}</span>
                <span className="tPrice">{item.price}</span>
                <span className={`tChange ${item.change.startsWith("+") ? "up" : "dn"}`}>{item.change}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="wrap heroWrap">
            <div className="heroLeft">
              <div className="heroBadge">
                <span className="dot" />
                MiCA Licensed · EU Regulated · DLT Pilot Regime
              </div>
              <h1 className="heroH1">
                The Global Platform for<br />
                <span className="gold">Tokenized Capital Markets</span>
              </h1>
              <p className="heroP">
                Issue bonds, tokenize real-world assets, launch equity offerings,
                and trade on a regulated 24/7 secondary market — all on one compliant platform.
              </p>
              <div className="heroBtns">
                <button className="btnPrimary" onClick={() => router.push("/register")}>Get Started</button>
                <button className="btnSecondary" onClick={() => router.push("/exchange")}>Open Exchange</button>
              </div>
              <div className="heroStats">
                {STATS.map((s) => (
                  <div className="stat" key={s.label}>
                    <span className="statV">{s.value}</span>
                    <span className="statL">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="heroRight">
              <div className="liveCard">
                <div className="liveCardHead">
                  <span className="liveCardTitle">Live Market</span>
                  <span className="liveDot">● LIVE</span>
                </div>
                {prices.slice(0, 5).map((item) => (
                  <div className="liveRow" key={item.symbol}>
                    <span className="lSym">{item.symbol}</span>
                    <span className="lPrice">€{item.price}</span>
                    <span className={`lChange ${item.change.startsWith("+") ? "up" : "dn"}`}>{item.change}%</span>
                  </div>
                ))}
                <button className="liveBtn" onClick={() => router.push("/exchange")}>View All Markets →</button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section">
          <div className="wrap">
            <p className="eyebrow">EVERYTHING YOU NEED</p>
            <h2 className="sectionH2">One Platform. All Capital Markets.</h2>
            <div className="grid3">
              {FEATURES.map((f) => (
                <div className="fCard" key={f.title}>
                  <div className="fIcon">{f.icon}</div>
                  <h3 className="fTitle">{f.title}</h3>
                  <p className="fDesc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="section sectionAlt">
          <div className="wrap">
            <p className="eyebrow">REGULATED & COMPLIANT</p>
            <h2 className="sectionH2">Built on Trust & Regulation</h2>
            <div className="grid2">
              {[
                { icon: "🇪🇺", title: "MiCA Licensed", desc: "Compliant with the EU Markets in Crypto-Assets Regulation framework." },
                { icon: "🏦", title: "Monitored by Bank of Lithuania", desc: "Supervised by Lietuvos bankas, the central bank and financial regulator of Lithuania." },
                { icon: "⚖️", title: "DLT Pilot Regime", desc: "Approved to operate under the EU DLT Pilot Regime for tokenized securities." },
                { icon: "🛡", title: "AML / KYC Compliant", desc: "Full KYC onboarding, AML screening, and transaction monitoring on all accounts." },
              ].map((t) => (
                <div className="tCard" key={t.title}>
                  <div className="tIcon">{t.icon}</div>
                  <div>
                    <h4 className="tTitle">{t.title}</h4>
                    <p className="tDesc">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="ctaSection">
          <div className="wrap ctaWrap">
            <div>
              <h2 className="ctaH2">Ready to tokenize the world?</h2>
              <p className="ctaP">Join 12,400+ investors and issuers on the platform.</p>
            </div>
            <button className="btnPrimary" onClick={() => router.push("/register")}>Create Free Account</button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="wrap">
            <div className="footerTop">
              <div className="footerBrand">
                <div className="fLogo">
                  <span className="fNxt">NXT</span>
                  <div className="fLogoText">
                    <span className="fLogoTop">NEXTOKEN</span>
                    <span className="fLogoBot">CAPITAL</span>
                  </div>
                </div>
                <p className="fTagline">The regulated infrastructure for tokenized real-world assets.</p>
                <div className="litBadge">
                  <span style={{ fontSize: "20px" }}>🇱🇹</span>
                  <div className="litText">
                    <span className="litLabel">Monitored by</span>
                    <span className="litName">Bank of Lithuania</span>
                  </div>
                </div>
              </div>
              <div className="footerCols">
                {[
                  { title: "Products", links: [["Markets", "/markets"], ["Exchange", "/exchange"], ["Bonds", "/bonds"], ["Equity & IPO", "/equity"], ["Tokenize", "/tokenize"]] },
                  { title: "Company", links: [["About Us", ""], ["Careers", ""], ["Press", ""], ["Blog", ""]] },
                  { title: "Legal", links: [["Terms of Service", ""], ["Privacy Policy", ""], ["Risk Disclosure", ""], ["AML Policy", ""]] },
                  { title: "Support", links: [["Help Center", ""], ["Contact Us", ""], ["API Docs", ""], ["Status", ""]] },
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
              <p>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
              <p>Risk warning: Investing in tokenized assets involves risk. Past performance is not indicative of future results.</p>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        /* ── BASE ── */
        .main {
          background: #04040a;
          color: #fff;
          min-height: 100vh;
          padding-top: 68px;
          position: relative;
          overflow-x: hidden;
        }

        /* ── ONDO-STYLE BACKGROUND ── */
        .bgOrbs {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.18;
        }
        .orb1 {
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, #3b5bdb, transparent 70%);
          top: -180px;
          left: -100px;
          animation: drift1 18s ease-in-out infinite alternate;
        }
        .orb2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #6741d9, transparent 70%);
          top: 100px;
          right: -120px;
          animation: drift2 22s ease-in-out infinite alternate;
        }
        .orb3 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #1971c2, transparent 70%);
          bottom: 200px;
          left: 30%;
          animation: drift3 26s ease-in-out infinite alternate;
        }
        .orb4 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #f5c842, transparent 70%);
          bottom: -100px;
          right: 10%;
          opacity: 0.07;
          animation: drift1 20s ease-in-out infinite alternate-reverse;
        }
        @keyframes drift1 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(60px, 80px) scale(1.12); }
        }
        @keyframes drift2 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-80px, 60px) scale(1.08); }
        }
        @keyframes drift3 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(50px, -70px) scale(1.15); }
        }
        .dotGrid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 40%, black 30%, transparent 100%);
        }

        /* All content sits above orbs */
        .tickerWrap, .hero, .section, .ctaSection, .footer {
          position: relative;
          z-index: 1;
        }

        /* ── TICKER ── */
        .tickerWrap {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          height: 40px;
          display: flex;
          align-items: center;
          backdrop-filter: blur(8px);
        }
        .tickerTrack { display:flex; animation:ticker 50s linear infinite; width:max-content; }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .tickerItem { display:flex; align-items:center; gap:8px; padding:0 24px; border-right:1px solid rgba(255,255,255,0.05); white-space:nowrap; }
        .tSym { font-size:12px; color:rgba(255,255,255,0.45); font-weight:500; }
        .tPrice { font-size:12px; color:#fff; font-weight:600; }
        .tChange { font-size:12px; font-weight:500; }
        .up { color:#0ecb81; }
        .dn { color:#f6465d; }

        /* ── HERO ── */
        .hero { padding: 90px 0 70px; }
        .wrap { max-width:1280px; margin:0 auto; padding:0 28px; }
        .heroWrap { display:flex; align-items:center; gap:60px; }
        .heroLeft { flex:1; }
        .heroRight { flex-shrink:0; width:340px; }
        .heroBadge {
          display:inline-flex; align-items:center; gap:8px;
          font-size:12px; color:rgba(255,255,255,0.55);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:100px; padding:6px 14px; margin-bottom:28px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(8px);
        }
        .dot { width:6px; height:6px; border-radius:50%; background:#0ecb81; flex-shrink:0; }
        .heroH1 { font-size:54px; font-weight:800; line-height:1.1; margin:0 0 20px; letter-spacing:-1.5px; }
        .gold { color:#f5c842; }
        .heroP { font-size:17px; color:rgba(255,255,255,0.5); line-height:1.7; max-width:520px; margin:0 0 36px; }
        .heroBtns { display:flex; gap:14px; margin-bottom:52px; }
        .btnPrimary { padding:14px 32px; border-radius:8px; border:none; background:#f5c842; color:#111; font-size:15px; font-weight:700; cursor:pointer; transition:background .15s,transform .12s; }
        .btnPrimary:hover { background:#ffd84d; transform:translateY(-1px); }
        .btnSecondary { padding:14px 32px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.04); color:#fff; font-size:15px; font-weight:600; cursor:pointer; transition:border-color .15s,background .15s; backdrop-filter:blur(8px); }
        .btnSecondary:hover { border-color:rgba(255,255,255,0.4); background:rgba(255,255,255,0.08); }
        .heroStats { display:flex; gap:40px; }
        .stat { display:flex; flex-direction:column; gap:4px; }
        .statV { font-size:22px; font-weight:800; color:#f5c842; }
        .statL { font-size:11px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:1px; }

        /* ── LIVE CARD ── */
        .liveCard {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 80px rgba(59,91,219,0.12), 0 0 0 1px rgba(255,255,255,0.05);
        }
        .liveCardHead { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
        .liveCardTitle { font-size:13px; font-weight:600; color:rgba(255,255,255,0.6); }
        .liveDot { font-size:11px; color:#0ecb81; font-weight:600; }
        .liveRow { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
        .lSym { font-size:13px; font-weight:600; color:#fff; width:100px; }
        .lPrice { font-size:13px; color:rgba(255,255,255,0.8); flex:1; text-align:right; }
        .lChange { font-size:12px; font-weight:600; width:70px; text-align:right; }
        .liveBtn { margin-top:16px; width:100%; padding:10px; border-radius:8px; border:1px solid rgba(245,200,66,0.25); background:transparent; color:#f5c842; font-size:13px; font-weight:600; cursor:pointer; transition:background .15s; }
        .liveBtn:hover { background:rgba(245,200,66,0.08); }

        /* ── SECTIONS ── */
        .section { padding:90px 0; border-top:1px solid rgba(255,255,255,0.06); }
        .sectionAlt { background: rgba(255,255,255,0.02); }
        .eyebrow { font-size:11px; letter-spacing:2px; color:#f5c842; font-weight:600; margin:0 0 12px; }
        .sectionH2 { font-size:38px; font-weight:800; color:#fff; margin:0 0 48px; letter-spacing:-0.5px; }

        .grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .fCard {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 28px;
          backdrop-filter: blur(12px);
          transition: border-color .2s, background .2s, transform .2s;
        }
        .fCard:hover { border-color:rgba(245,200,66,0.3); background:rgba(255,255,255,0.06); transform:translateY(-4px); }
        .fIcon { font-size:28px; margin-bottom:16px; }
        .fTitle { font-size:16px; font-weight:700; color:#fff; margin:0 0 10px; }
        .fDesc { font-size:14px; color:rgba(255,255,255,0.45); line-height:1.65; margin:0; }

        .grid2 { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
        .tCard {
          display:flex; gap:20px; align-items:flex-start;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius:16px; padding:24px;
          backdrop-filter:blur(12px);
          transition: border-color .2s;
        }
        .tCard:hover { border-color:rgba(59,91,219,0.4); }
        .tIcon { font-size:28px; flex-shrink:0; }
        .tTitle { font-size:15px; font-weight:700; color:#fff; margin:0 0 8px; }
        .tDesc { font-size:13px; color:rgba(255,255,255,0.45); line-height:1.6; margin:0; }

        /* ── CTA ── */
        .ctaSection { padding:90px 0; border-top:1px solid rgba(255,255,255,0.06); }
        .ctaWrap { display:flex; justify-content:space-between; align-items:center; gap:40px; }
        .ctaH2 { font-size:34px; font-weight:800; color:#fff; margin:0 0 8px; }
        .ctaP { font-size:15px; color:rgba(255,255,255,0.45); margin:0; }

        /* ── FOOTER ── */
        .footer { background:rgba(0,0,0,0.6); border-top:1px solid rgba(255,255,255,0.07); padding:60px 0 32px; backdrop-filter:blur(20px); }
        .footerTop { display:flex; gap:80px; margin-bottom:48px; }
        .footerBrand { flex-shrink:0; width:220px; }
        .fLogo { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .fNxt { font-size:22px; font-weight:900; color:#f5c842; }
        .fLogoText { display:flex; flex-direction:column; line-height:1; gap:2px; }
        .fLogoTop { font-size:12px; font-weight:700; color:#fff; letter-spacing:2px; }
        .fLogoBot { font-size:9px; color:rgba(255,255,255,0.4); letter-spacing:2.5px; }
        .fTagline { font-size:13px; color:rgba(255,255,255,0.4); line-height:1.6; margin:0 0 20px; }
        .litBadge { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 14px; }
        .litText { display:flex; flex-direction:column; gap:1px; }
        .litLabel { font-size:10px; color:rgba(255,255,255,0.35); letter-spacing:0.5px; text-transform:uppercase; }
        .litName { font-size:12px; font-weight:600; color:#fff; }
        .footerCols { display:flex; gap:60px; flex:1; }
        .footerCol { display:flex; flex-direction:column; gap:12px; }
        .colTitle { font-size:13px; font-weight:700; color:#fff; margin:0 0 4px; text-transform:uppercase; letter-spacing:0.5px; }
        .colLink { font-size:13px; color:rgba(255,255,255,0.4); cursor:pointer; transition:color .15s; text-decoration:none; }
        .colLink:hover { color:rgba(255,255,255,0.8); }
        .footerBottom { border-top:1px solid rgba(255,255,255,0.06); padding-top:24px; display:flex; flex-direction:column; gap:6px; }
        .footerBottom p { font-size:12px; color:rgba(255,255,255,0.25); margin:0; }

        @media (max-width:1024px) {
          .heroWrap { flex-direction:column; }
          .heroRight { width:100%; }
          .grid3 { grid-template-columns:repeat(2,1fr); }
          .footerTop { flex-direction:column; gap:40px; }
          .footerBrand { width:100%; }
        }
        @media (max-width:640px) {
          .heroH1 { font-size:34px; }
          .grid3 { grid-template-columns:1fr; }
          .grid2 { grid-template-columns:1fr; }
          .heroStats { gap:20px; flex-wrap:wrap; }
          .ctaWrap { flex-direction:column; align-items:flex-start; }
          .footerCols { flex-wrap:wrap; gap:32px; }
        }
      `}</style>
    </>
  );
}