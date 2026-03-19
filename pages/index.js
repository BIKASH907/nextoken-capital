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

        {/* HERO — full image background */}
        <section className="hero">
          <div className="heroBg" />
          <div className="heroOverlay" />
          <div className="heroContent">
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

          {/* Floating asset cards */}
          <div className="floatCard floatCard1">
            <div className="fcTag">TOKENIZED BOND</div>
            <div className="fcVal">€ 10,000</div>
            <div className="fcSub">EU Gov Bond · 5.2% APY</div>
            <div className="fcLive"><span className="liveDot" />LIVE</div>
          </div>
          <div className="floatCard floatCard2">
            <div className="fcTag">REAL ESTATE TOKEN</div>
            <div className="fcVal">Vilnius Office</div>
            <div className="fcSub">€2.4M · 847 tokens</div>
            <div className="fcLive"><span className="liveDot" />TRADEABLE</div>
          </div>
          <div className="floatCard floatCard3">
            <div className="fcTag">EQUITY TOKEN</div>
            <div className="fcVal">FinTech IPO</div>
            <div className="fcSub">+18.4% · 30d</div>
            <div className="fcLive"><span className="liveDot gold" />OPEN</div>
          </div>
          <div className="floatCard floatCard4">
            <div className="fcTag">NXC TOKEN</div>
            <div className="fcVal gold">€ {prices[0]?.price || "3.847"}</div>
            <div className="fcSub up">↑ +5.23% today</div>
            <div className="fcLive"><span className="liveDot" />REGULATED</div>
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
        .main { background:#04040a; color:#fff; min-height:100vh; padding-top:68px; }
        .wrap { max-width:1280px; margin:0 auto; padding:0 28px; }

        /* TICKER */
        .tickerWrap { background:rgba(0,0,0,0.6); border-bottom:1px solid rgba(255,255,255,0.07); overflow:hidden; height:40px; display:flex; align-items:center; position:relative; z-index:10; }
        .tickerTrack { display:flex; animation:ticker 50s linear infinite; width:max-content; }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .tickerItem { display:flex; align-items:center; gap:8px; padding:0 24px; border-right:1px solid rgba(255,255,255,0.05); white-space:nowrap; }
        .tSym { font-size:12px; color:rgba(255,255,255,0.45); font-weight:500; }
        .tPrice { font-size:12px; color:#fff; font-weight:600; }
        .tChange { font-size:12px; font-weight:500; }
        .up { color:#0ecb81; }
        .dn { color:#f6465d; }

        /* HERO */
        .hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .heroBg {
          position: absolute;
          inset: 0;
          background-image: url('/hero-bg.png');
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          transform: scale(1.03);
          animation: subtleZoom 20s ease-in-out infinite alternate;
        }
        @keyframes subtleZoom {
          from { transform: scale(1.03); }
          to   { transform: scale(1.08); }
        }
        .heroOverlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(4,4,10,0.55) 0%,
            rgba(4,4,10,0.3) 40%,
            rgba(4,4,10,0.5) 70%,
            rgba(4,4,10,0.95) 100%
          );
        }
        .heroContent {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 760px;
          padding: 0 24px;
        }
        .heroBadge {
          display:inline-flex; align-items:center; gap:8px;
          font-size:12px; color:rgba(255,255,255,0.7);
          border:1px solid rgba(255,255,255,0.15);
          border-radius:100px; padding:6px 16px; margin-bottom:28px;
          background:rgba(0,0,0,0.35); backdrop-filter:blur(10px);
        }
        .dot { width:6px; height:6px; border-radius:50%; background:#0ecb81; flex-shrink:0; }
        .heroH1 { font-size:58px; font-weight:900; line-height:1.08; margin:0 0 20px; letter-spacing:-2px; text-shadow:0 4px 40px rgba(0,0,0,0.6); }
        .gold { color:#f5c842; }
        .heroP { font-size:17px; color:rgba(255,255,255,0.65); line-height:1.7; margin:0 0 36px; text-shadow:0 2px 20px rgba(0,0,0,0.8); }
        .heroBtns { display:flex; gap:14px; justify-content:center; margin-bottom:52px; }
        .btnPrimary { padding:14px 36px; border-radius:8px; border:none; background:#f5c842; color:#111; font-size:15px; font-weight:700; cursor:pointer; transition:background .15s,transform .12s; }
        .btnPrimary:hover { background:#ffd84d; transform:translateY(-1px); }
        .btnSecondary { padding:14px 36px; border-radius:8px; border:1px solid rgba(255,255,255,0.3); background:rgba(0,0,0,0.35); color:#fff; font-size:15px; font-weight:600; cursor:pointer; transition:border-color .15s,background .15s; backdrop-filter:blur(8px); }
        .btnSecondary:hover { border-color:rgba(255,255,255,0.6); background:rgba(0,0,0,0.5); }
        .heroStats { display:flex; gap:48px; justify-content:center; }
        .stat { display:flex; flex-direction:column; gap:4px; }
        .statV { font-size:22px; font-weight:800; color:#f5c842; text-shadow:0 0 20px rgba(245,200,66,0.4); }
        .statL { font-size:11px; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:1px; }

        /* FLOATING CARDS */
        .floatCard {
          position: absolute;
          z-index: 3;
          background: rgba(10,10,20,0.6);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 16px 20px;
          backdrop-filter: blur(16px);
          min-width: 180px;
        }
        .floatCard1 { top: 15%; left: 5%; animation: floatA 6s ease-in-out infinite; border-color:rgba(245,200,66,0.25); }
        .floatCard2 { top: 15%; right: 5%; animation: floatB 7s ease-in-out infinite; border-color:rgba(59,91,219,0.3); }
        .floatCard3 { bottom: 12%; left: 5%; animation: floatC 8s ease-in-out infinite; border-color:rgba(103,65,217,0.3); }
        .floatCard4 { bottom: 12%; right: 5%; animation: floatA 9s ease-in-out infinite reverse; border-color:rgba(14,203,129,0.25); }
        @keyframes floatA { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-14px);} }
        @keyframes floatB { 0%,100%{transform:translateY(-8px);} 50%{transform:translateY(8px);} }
        @keyframes floatC { 0%,100%{transform:translateY(-5px);} 50%{transform:translateY(10px);} }
        .fcTag { font-size:10px; color:rgba(255,255,255,0.4); letter-spacing:1.5px; margin-bottom:6px; text-transform:uppercase; }
        .fcVal { font-size:17px; font-weight:700; color:#fff; margin-bottom:4px; }
        .fcVal.gold { color:#f5c842; }
        .fcSub { font-size:12px; color:rgba(255,255,255,0.45); margin-bottom:8px; }
        .fcSub.up { color:#0ecb81; }
        .fcLive { display:flex; align-items:center; gap:6px; font-size:10px; color:#0ecb81; font-weight:600; letter-spacing:0.5px; }
        .liveDot { width:6px; height:6px; border-radius:50%; background:#0ecb81; flex-shrink:0; }
        .liveDot.gold { background:#f5c842; }

        /* SECTIONS */
        .section { padding:90px 0; border-top:1px solid rgba(255,255,255,0.06); background:#04040a; }
        .sectionAlt { background:#070710; }
        .eyebrow { font-size:11px; letter-spacing:2px; color:#f5c842; font-weight:600; margin:0 0 12px; }
        .sectionH2 { font-size:38px; font-weight:800; color:#fff; margin:0 0 48px; letter-spacing:-0.5px; }

        .grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .fCard { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:28px; transition:border-color .2s,transform .2s; }
        .fCard:hover { border-color:rgba(245,200,66,0.3); transform:translateY(-5px); }
        .fIcon { font-size:28px; margin-bottom:16px; }
        .fTitle { font-size:16px; font-weight:700; color:#fff; margin:0 0 10px; }
        .fDesc { font-size:14px; color:rgba(255,255,255,0.45); line-height:1.65; margin:0; }

        .grid2 { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
        .tCard { display:flex; gap:20px; align-items:flex-start; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:24px; transition:border-color .2s; }
        .tCard:hover { border-color:rgba(59,91,219,0.35); }
        .tIcon { font-size:28px; flex-shrink:0; }
        .tTitle { font-size:15px; font-weight:700; color:#fff; margin:0 0 8px; }
        .tDesc { font-size:13px; color:rgba(255,255,255,0.45); line-height:1.6; margin:0; }

        /* CTA */
        .ctaSection { padding:90px 0; border-top:1px solid rgba(255,255,255,0.06); background:linear-gradient(135deg,#0d0a00 0%,#04040a 100%); }
        .ctaWrap { display:flex; justify-content:space-between; align-items:center; gap:40px; }
        .ctaH2 { font-size:34px; font-weight:800; color:#fff; margin:0 0 8px; }
        .ctaP { font-size:15px; color:rgba(255,255,255,0.45); margin:0; }

        /* FOOTER */
        .footer { background:#030309; border-top:1px solid rgba(255,255,255,0.07); padding:60px 0 32px; }
        .footerTop { display:flex; gap:80px; margin-bottom:48px; }
        .footerBrand { flex-shrink:0; width:220px; }
        .fLogo { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .fNxt { font-size:22px; font-weight:900; color:#f5c842; }
        .fLogoText { display:flex; flex-direction:column; line-height:1; gap:2px; }
        .fLogoTop { font-size:12px; font-weight:700; color:#fff; letter-spacing:2px; }
        .fLogoBot { font-size:9px; color:rgba(255,255,255,0.4); letter-spacing:2.5px; }
        .fTagline { font-size:13px; color:rgba(255,255,255,0.4); line-height:1.6; margin:0 0 20px; }
        .litBadge { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); border-radius:10px; padding:10px 14px; }
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
          .floatCard2,.floatCard4 { display:none; }
          .grid3 { grid-template-columns:repeat(2,1fr); }
          .footerTop { flex-direction:column; gap:40px; }
          .footerBrand { width:100%; }
        }
        @media (max-width:640px) {
          .heroH1 { font-size:36px; }
          .floatCard1,.floatCard3 { display:none; }
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