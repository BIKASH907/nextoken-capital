import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const howItWorksRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: "📄",
      title: "Tokenized Bonds",
      text: "Trade sovereign and corporate bonds as digital tokens with instant settlement and transparent pricing on-chain.",
    },
    {
      icon: "🏢",
      title: "Fractional Real Estate",
      text: "Access residential and commercial property shares starting from EUR 100 — global real estate, fractionalized and liquid.",
    },
    {
      icon: "📈",
      title: "Equity & IPO",
      text: "Participate in blockchain-native IPOs and trade equity tokens of high-growth European ventures on our secondary market.",
    },
    {
      icon: "💎",
      title: "Commodity Tokens",
      text: "Trade digitized agricultural and industrial commodity tokens with full traceability and regulated custody.",
    },
  ];

  const tokenCards = [
    {
      icon: "🔗",
      title: "Utility Token Access",
      text: "Use NXC to access ecosystem utilities, platform features, and participation mechanisms.",
    },
    {
      icon: "📊",
      title: "Supply & Tokenomics",
      text: "Fixed supply model with transparent token distribution and on-chain verifiability.",
    },
    {
      icon: "🎁",
      title: "Staking & Rewards",
      text: "Stake NXC tokens to earn ecosystem benefits, priority access, and compounding rewards.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Discover",
      text: "Browse a curated marketplace of tokenized real-world assets — filter by class, region, yield, and term.",
      icon: "🔍",
    },
    {
      num: "02",
      title: "Evaluate",
      text: "Review asset details, documentation, and compliance data. Conduct your own independent due diligence.",
      icon: "📋",
    },
    {
      num: "03",
      title: "Trade from EUR 100",
      text: "Buy and sell fractional tokens representing real-world assets — with T+0 settlement on every trade.",
      icon: "💱",
    },
    {
      num: "04",
      title: "Earn & Exchange",
      text: "Receive automated distributions and trade freely on our secondary market exchange.",
      icon: "📈",
    },
  ];

  const news = [
    {
      date: "March 2025",
      tag: "Marketplace",
      title: "Nextoken Marketplace Launches Secondary Trading",
      text: "Our secondary market exchange is now live — trade tokenized assets 24/7 with 0.25% fees and instant settlement.",
    },
    {
      date: "February 2025",
      tag: "Listing",
      title: "NXC Token Pre-Sale Opens Q2 2025",
      text: "The NXC token pre-sale is now scheduled with a fixed supply of 100M tokens and community allocation.",
    },
    {
      date: "January 2025",
      tag: "Compliance",
      title: "Nextoken Achieves Full MiCA Compliance",
      text: "MiCA CASP authorization received — enabling fully compliant marketplace operations across all 27 EU member states.",
    },
  ];

  return (
    <>
      <Head>
        <title>Nextoken Capital — The Regulated RWA Marketplace</title>
        <meta
          name="description"
          content="The regulated marketplace for tokenized real-world assets. Trade bonds, equity, real estate and commodities from EUR 100 with 0.25% fees."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className="home-page">
        <div className="sparkle" />

        {/* ── HERO ── */}
        <section className="hero">
          <div className="container">
            <div className="heroCard">
              <div className="heroInner">
                <div className="heroContent">
                  <div className="tag">The Regulated RWA Marketplace</div>

                  <h1>
                    REAL-WORLD ASSETS,{" "}
                    <span className="goldText">REIMAGINED.</span>
                    <br />
                    TRADE 24/7.
                  </h1>

                  <p>
                    Nextoken Capital is the regulated marketplace for tokenized
                    real-world assets — bonds, equity, real estate, and
                    commodities — with 0.25% fees, instant settlement, and
                    full MiCA compliance.
                  </p>

                  <div className="heroBadges">
                    <span className="badge">🔒 EU Regulated</span>
                    <span className="badge">⚡ Blockchain-Powered</span>
                    <span className="badge">📊 0.25% Trading Fee</span>
                  </div>

                  <div className="heroActions">
                    <button
                      className="btnPrimary"
                      onClick={() => router.push("/markets")}
                    >
                      Explore Marketplace
                    </button>
                    <button
                      className="btnSecondary"
                      onClick={() => router.push("/tokenize")}
                    >
                      List an Asset →
                    </button>
                  </div>
                </div>

                <div className="heroVisual" aria-label="Hero visual">
                  <div className="chip" />
                  <div className="coin">
                    <div className="ring" />
                    <span>NXC</span>
                  </div>
                  <div className="chartUp">
                    <div className="chartLabel">24h Volume</div>
                    <div className="chartBar" style={{ height: "40%" }} />
                    <div className="chartBar" style={{ height: "60%" }} />
                    <div className="chartBar" style={{ height: "75%" }} />
                    <div className="chartBar" style={{ height: "55%" }} />
                    <div className="chartBar highlight" style={{ height: "90%" }} />
                    <div className="arrow">↗ €2.3M</div>
                  </div>
                  <div className="statPill">
                    <span className="statGreen">▲ 18.2%</span> this quarter
                  </div>
                </div>
              </div>
            </div>

            {/* ── STATS BAR ── */}
            <div className="statsBar">
              <div className="statItem">
                <span className="statNum">EUR 140M+</span>
                <span className="statLbl">Assets Listed</span>
              </div>
              <div className="statDivider" />
              <div className="statItem">
                <span className="statNum">1,000+</span>
                <span className="statLbl">Active Traders</span>
              </div>
              <div className="statDivider" />
              <div className="statItem">
                <span className="statNum">T+0</span>
                <span className="statLbl">Settlement Time</span>
              </div>
              <div className="statDivider" />
              <div className="statItem">
                <span className="statNum">EU</span>
                <span className="statLbl">Regulated & Compliant</span>
              </div>
            </div>

            {/* ── WHY NEXTOKEN MARKETPLACE ── */}
            <div className="sectionTitle">WHY NEXTOKEN MARKETPLACE</div>
            <section className="vmSection">
              <article className="vmCard">
                <div className="vmHead">
                  <div className="vmIcon">🏛️</div>
                  <h3>Regulated Marketplace</h3>
                </div>
                <p>
                  Authorized by the Bank of Lithuania with full MiCA CASP
                  compliance. Trade with confidence on a marketplace that
                  meets the highest EU regulatory standards.
                </p>
              </article>
              <article className="vmCard">
                <div className="vmHead">
                  <div className="vmIcon">⚡</div>
                  <h3>Instant Settlement</h3>
                </div>
                <p>
                  Replace T+2 days with T+0 block-time finality. Every trade
                  on our marketplace settles instantly on-chain with full
                  transparency and an immutable audit trail.
                </p>
              </article>
            </section>

            {/* ── MARKETPLACE CATEGORIES ── */}
            <div className="sectionTitle" style={{ marginTop: 36 }}>MARKETPLACE</div>
            <section className="featuresSection">
              {features.map((item) => (
                <article className="featureCard" key={item.title}>
                  <div className="featureBadge">{item.icon}</div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </article>
              ))}
            </section>

            {/* ── HOW IT WORKS ── */}
            <div
              ref={howItWorksRef}
              className="sectionTitle"
              style={{ marginTop: 36 }}
            >
              HOW THE MARKETPLACE WORKS
            </div>
            <section className="stepsSection">
              {steps.map((step, i) => (
                <div className="stepCard" key={step.num}>
                  <div className="stepNum">{step.num}</div>
                  <div className="stepIcon">{step.icon}</div>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                  {i < steps.length - 1 && (
                    <div className="stepArrow">→</div>
                  )}
                </div>
              ))}
            </section>

            {/* ── NXC TOKEN ── */}
            <section className="tokenSection">
              <div className="tokenInner">
                <div className="sectionTitle sectionTitleSmall">NXC TOKEN</div>
                <p className="tokenSubtitle">
                  The NXC token powers the entire Nextoken marketplace —
                  from platform access to staking rewards and trading benefits.
                </p>

                <div className="tokenGrid">
                  {tokenCards.map((item) => (
                    <article className="tokenCard" key={item.title}>
                      <div className="tokenIcon">{item.icon}</div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.text}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="tokenMeta">
                  <div className="tokenMetaItem">
                    <span className="metaLbl">Total Supply</span>
                    <span className="metaVal">100,000,000 NXC</span>
                  </div>
                  <div className="tokenMetaItem">
                    <span className="metaLbl">Network</span>
                    <span className="metaVal">Ethereum ERC-20</span>
                  </div>
                  <div className="tokenMetaItem">
                    <span className="metaLbl">Pre-Sale</span>
                    <span className="metaVal">Q2 2025</span>
                  </div>
                  <div className="tokenMetaItem">
                    <span className="metaLbl">Listing</span>
                    <span className="metaVal">Q3 2025</span>
                  </div>
                </div>

                <div className="tokenCTA">
                  <button
                    className="btnPrimary"
                    onClick={() => router.push("/token")}
                  >
                    Learn About NXC Token
                  </button>
                  <button
                    className="btnSecondary"
                    onClick={() => router.push("/whitepaper")}
                  >
                    Read Whitepaper
                  </button>
                </div>
              </div>
            </section>

            {/* ── NEWS ── */}
            <section className="newsSection">
              <div className="sectionTitle">LATEST NEWS</div>
              <div className="newsGrid">
                {news.map((item) => (
                  <article className="newsCard" key={item.title}>
                    <div className="newsTop">
                      <span className="newsTag">{item.tag}</span>
                      <span className="newsDate">{item.date}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                    <button
                      className="newsLink"
                      onClick={() => router.push("/news")}
                    >
                      Read more →
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="ctaBanner">
              <div className="ctaContent">
                <h2>Ready to Trade Real-World Assets?</h2>
                <p>
                  Join 1,000+ traders already on the Nextoken marketplace.
                  Create your account and start trading tokenized assets today.
                </p>
                <button
                  className="btnPrimary ctaBtnLarge"
                  onClick={() => router.push("/register")}
                >
                  Create Free Account →
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .home-page {
          min-height: 100vh;
          background: radial-gradient(1200px 800px at 20% 10%, rgba(255,187,60,0.2), transparent 55%),
            radial-gradient(1000px 700px at 80% 20%, rgba(58,160,255,0.14), transparent 55%),
            radial-gradient(900px 600px at 50% 90%, rgba(53,208,178,0.1), transparent 60%),
            linear-gradient(180deg, #05060a, #0b0d14);
          color: #eef1ff;
          position: relative;
          overflow-x: hidden;
          font-family: "Segoe UI", system-ui, sans-serif;
          padding-top: 64px;
        }
        .container { max-width:1180px; margin:0 auto; padding:0 18px 40px; }
        .sparkle { position:fixed; inset:0; pointer-events:none; opacity:0.18; background-image:radial-gradient(2px 2px at 10% 20%,#fff,transparent 60%),radial-gradient(1px 1px at 50% 40%,#fff,transparent 60%),radial-gradient(1px 1px at 80% 30%,#fff,transparent 60%),radial-gradient(1px 1px at 20% 80%,#fff,transparent 60%),radial-gradient(2px 2px at 70% 75%,#fff,transparent 60%),radial-gradient(1px 1px at 90% 85%,#fff,transparent 60%); }
        .btnPrimary,.btnSecondary { border-radius:12px; padding:11px 20px; font-weight:700; cursor:pointer; transition:all 0.2s ease; font-size:14.5px; }
        .btnPrimary { border:0; color:#111; background:linear-gradient(135deg,#ffda7a,#f5c15a); box-shadow:0 12px 30px rgba(255,193,90,0.25); }
        .btnPrimary:hover { transform:translateY(-1px); box-shadow:0 16px 36px rgba(255,193,90,0.35); }
        .btnSecondary { border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.06); color:rgba(238,241,255,0.92); }
        .btnSecondary:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.35); }
        .hero { padding:28px 0 0; }
        .heroCard { border-radius:26px; overflow:hidden; border:1px solid rgba(255,255,255,0.14); background:radial-gradient(900px 350px at 70% 40%,rgba(255,193,90,0.18),transparent 60%),radial-gradient(900px 350px at 30% 40%,rgba(58,160,255,0.14),transparent 60%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02)); box-shadow:0 20px 60px rgba(0,0,0,0.45); }
        .heroInner { display:grid; grid-template-columns:1.15fr 0.85fr; gap:24px; padding:36px 28px; align-items:center; min-height:360px; }
        .heroContent h1 { margin:0; font-size:44px; line-height:1.04; letter-spacing:0.5px; }
        .goldText { background:linear-gradient(180deg,#ffda7a,#b97b23); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .heroContent p { margin:14px 0 14px; color:rgba(238,241,255,0.82); max-width:560px; font-size:15.5px; line-height:1.55; }
        .tag { display:inline-block; margin-bottom:14px; padding:8px 14px; border-radius:999px; border:1px solid rgba(255,218,122,0.22); color:#ffda7a; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; background:rgba(255,255,255,0.03); }
        .heroBadges { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px; }
        .badge { padding:5px 11px; border-radius:8px; font-size:12px; font-weight:600; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:rgba(238,241,255,0.85); }
        .heroActions { display:flex; gap:12px; flex-wrap:wrap; }
        .heroVisual { position:relative; height:280px; border-radius:22px; border:1px solid rgba(255,255,255,0.12); background:radial-gradient(120px 120px at 75% 30%,rgba(255,255,255,0.22),transparent 60%),radial-gradient(260px 260px at 40% 70%,rgba(255,193,90,0.25),transparent 62%),radial-gradient(220px 220px at 70% 80%,rgba(58,160,255,0.22),transparent 60%),linear-gradient(135deg,rgba(12,14,22,0.95),rgba(20,24,38,0.65)); overflow:hidden; }
        .coin { position:absolute; width:170px; height:170px; right:20px; top:18px; border-radius:999px; background:radial-gradient(70px 70px at 30% 30%,rgba(255,255,255,0.35),transparent 55%),linear-gradient(135deg,#ffda7a,#b97b23); box-shadow:0 30px 80px rgba(255,193,90,0.3); display:grid; place-items:center; border:1px solid rgba(255,255,255,0.18); color:#1a1206; font-weight:900; font-size:38px; }
        .ring { position:absolute; inset:-30px; border-radius:999px; border:2px solid rgba(255,218,122,0.16); }
        .chartUp { position:absolute; left:18px; bottom:16px; width:200px; height:120px; border-radius:18px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); padding:32px 12px 12px; display:flex; align-items:flex-end; gap:6px; }
        .chartLabel { position:absolute; top:10px; left:12px; font-size:10px; color:rgba(255,218,122,0.7); font-weight:600; letter-spacing:0.5px; }
        .chartBar { flex:1; border-radius:4px 4px 0 0; background:rgba(58,160,255,0.4); }
        .chartBar.highlight { background:linear-gradient(180deg,#ffda7a,#f5a623); }
        .arrow { position:absolute; right:12px; top:10px; font-size:12px; font-weight:700; color:rgba(255,218,122,0.95); }
        .chip { position:absolute; left:-35px; top:40px; width:120px; height:60px; border-radius:16px; background:linear-gradient(135deg,rgba(58,160,255,0.3),rgba(255,193,90,0.18)); border:1px solid rgba(255,255,255,0.14); transform:rotate(-12deg); }
        .statPill { position:absolute; top:16px; left:16px; padding:6px 12px; border-radius:999px; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.12); font-size:12px; font-weight:600; color:rgba(238,241,255,0.85); }
        .statGreen { color:#35d0b2; }
        .statsBar { display:flex; align-items:center; justify-content:center; margin:16px 0 0; border-radius:18px; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.03); padding:20px 24px; flex-wrap:wrap; gap:16px; }
        .statItem { flex:1; min-width:120px; display:flex; flex-direction:column; align-items:center; gap:4px; }
        .statNum { font-size:24px; font-weight:900; background:linear-gradient(180deg,#ffda7a,#b97b23); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .statLbl { font-size:12px; color:rgba(238,241,255,0.6); font-weight:500; text-align:center; }
        .statDivider { width:1px; height:40px; background:rgba(255,255,255,0.1); }
        .sectionTitle { margin:32px 0 16px; text-align:center; font-weight:800; letter-spacing:2px; color:rgba(255,218,122,0.92); text-transform:uppercase; font-size:13px; }
        .sectionTitleSmall { margin-top:4px; }
        .vmSection { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .vmCard { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:18px; padding:20px; box-shadow:0 18px 40px rgba(0,0,0,0.35); }
        .vmHead { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
        .vmHead h3 { margin:0; font-size:16px; }
        .vmIcon,.featureBadge,.tokenIcon { width:42px; height:42px; flex-shrink:0; border-radius:14px; display:grid; place-items:center; background:linear-gradient(135deg,rgba(255,218,122,0.9),rgba(185,123,35,0.9)); color:#1b1207; font-size:20px; }
        .vmCard p { color:rgba(238,241,255,0.8); line-height:1.6; margin:0; font-size:14.5px; }
        .featuresSection { margin-top:14px; display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        .featureCard { border-radius:18px; border:1px solid rgba(255,255,255,0.12); background:radial-gradient(240px 140px at 30% 20%,rgba(255,193,90,0.16),transparent 60%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03)); box-shadow:0 18px 40px rgba(0,0,0,0.35); padding:18px 16px; }
        .featureCard h4 { margin:10px 0 6px; font-size:14.5px; }
        .featureCard p { color:rgba(238,241,255,0.8); line-height:1.55; margin:0; font-size:13.5px; }
        .stepsSection { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        .stepCard { border-radius:18px; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.03); padding:20px 16px; position:relative; }
        .stepCard h4 { margin:10px 0 6px; font-size:14.5px; }
        .stepCard p { color:rgba(238,241,255,0.75); line-height:1.55; margin:0; font-size:13.5px; }
        .stepNum { font-size:32px; font-weight:900; color:rgba(255,218,122,0.2); line-height:1; margin-bottom:8px; }
        .stepIcon { font-size:26px; }
        .stepArrow { position:absolute; right:-14px; top:50%; transform:translateY(-50%); font-size:20px; color:rgba(255,218,122,0.4); z-index:2; }
        .tokenSection { margin-top:18px; border-radius:26px; border:1px solid rgba(255,255,255,0.14); background:radial-gradient(900px 250px at 50% 20%,rgba(255,193,90,0.2),transparent 60%),radial-gradient(900px 280px at 20% 80%,rgba(58,160,255,0.14),transparent 60%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)); box-shadow:0 20px 60px rgba(0,0,0,0.45); }
        .tokenInner { padding:24px; }
        .tokenSubtitle { text-align:center; color:rgba(238,241,255,0.7); font-size:14.5px; margin:0 auto 16px; max-width:500px; line-height:1.5; }
        .tokenGrid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
        .tokenCard { border-radius:18px; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); padding:16px; box-shadow:0 16px 40px rgba(0,0,0,0.3); display:flex; gap:12px; align-items:flex-start; }
        .tokenCard h4 { margin:0 0 6px; font-size:14.5px; }
        .tokenCard p { color:rgba(238,241,255,0.8); line-height:1.55; margin:0; font-size:13.5px; }
        .tokenMeta { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-top:16px; padding:16px; border-radius:14px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); }
        .tokenMetaItem { display:flex; flex-direction:column; align-items:center; gap:4px; }
        .metaLbl { font-size:11px; color:rgba(238,241,255,0.5); font-weight:600; letter-spacing:0.5px; text-transform:uppercase; }
        .metaVal { font-size:14px; font-weight:700; color:#ffda7a; }
        .tokenCTA { display:flex; justify-content:center; gap:12px; margin-top:18px; flex-wrap:wrap; }
        .newsSection { margin-top:18px; }
        .newsGrid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .newsCard { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:18px; padding:20px; box-shadow:0 18px 40px rgba(0,0,0,0.35); display:flex; flex-direction:column; gap:10px; }
        .newsTop { display:flex; align-items:center; justify-content:space-between; }
        .newsTag { padding:4px 10px; border-radius:8px; background:rgba(255,218,122,0.12); border:1px solid rgba(255,218,122,0.2); color:#ffda7a; font-size:11px; font-weight:700; letter-spacing:0.5px; }
        .newsDate { font-size:12px; color:rgba(238,241,255,0.45); }
        .newsCard h4 { margin:0; font-size:14.5px; line-height:1.4; }
        .newsCard p { color:rgba(238,241,255,0.75); line-height:1.55; margin:0; font-size:13.5px; flex:1; }
        .newsLink { background:none; border:none; color:#ffda7a; font-size:13px; font-weight:600; cursor:pointer; padding:0; text-align:left; transition:opacity 0.2s; }
        .newsLink:hover { opacity:0.75; }
        .ctaBanner { margin-top:24px; border-radius:26px; border:1px solid rgba(255,218,122,0.2); background:radial-gradient(800px 300px at 50% 50%,rgba(255,193,90,0.22),transparent 60%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)); box-shadow:0 20px 60px rgba(0,0,0,0.4); padding:48px 28px; text-align:center; }
        .ctaContent h2 { margin:0 0 12px; font-size:32px; font-weight:900; }
        .ctaContent p { color:rgba(238,241,255,0.8); font-size:15.5px; line-height:1.55; margin:0 auto 24px; max-width:500px; }
        .ctaBtnLarge { padding:14px 32px !important; font-size:16px !important; border-radius:14px !important; }
        @media (max-width:980px) {
          .heroInner { grid-template-columns:1fr; }
          .heroVisual { height:220px; }
          .featuresSection { grid-template-columns:1fr 1fr; }
          .stepsSection { grid-template-columns:1fr 1fr; }
          .tokenGrid { grid-template-columns:1fr; }
          .vmSection { grid-template-columns:1fr; }
          .newsGrid { grid-template-columns:1fr 1fr; }
          .heroContent h1 { font-size:36px; }
          .tokenMeta { grid-template-columns:1fr 1fr; }
          .statDivider { display:none; }
        }
        @media (max-width:640px) {
          .featuresSection { grid-template-columns:1fr; }
          .stepsSection { grid-template-columns:1fr; }
          .stepArrow { display:none; }
          .heroContent h1 { font-size:30px; }
          .container { padding:0 14px 28px; }
          .tokenMeta { grid-template-columns:1fr 1fr; }
          .ctaContent h2 { font-size:24px; }
          .newsGrid { grid-template-columns:1fr; }
        }
      `}</style>
    </>
  );
}
