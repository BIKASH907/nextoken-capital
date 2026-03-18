import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const howItWorksRef = useRef(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    { icon: "💰", title: "Earn Passive Income", text: "Target returns with diversified tokenized opportunities with 15%–18% ROI annually." },
    { icon: "🛡️", title: "Trusted EU Company", text: "Corporate structure and EU-based operations to support trust and full transparency." },
    { icon: "✅", title: "Secure & Compliant", text: "Strong security practices with compliance-first onboarding and clear disclosures." },
    { icon: "🌞", title: "Future Projects", text: "Pipeline includes tokenized infrastructure and green energy-linked opportunities." },
  ];

  const tokenCards = [
    { icon: "🔗", title: "Utility Token Access", text: "Use NXC to access ecosystem utilities, platform features, and participation mechanisms." },
    { icon: "📊", title: "Supply & Tokenomics", text: "Fixed supply model with transparent token distribution and on-chain verifiability." },
    { icon: "🎁", title: "Staking & Rewards", text: "Stake NXC tokens to earn ecosystem benefits, priority access, and compounding rewards." },
  ];

  const steps = [
    { num: "01", title: "Create Account", text: "Sign up in minutes with your email. Complete KYC verification to unlock all features.", icon: "👤" },
    { num: "02", title: "Deposit Funds", text: "Add funds via bank transfer or crypto. Your balance is secured in a compliant EU vault.", icon: "💳" },
    { num: "03", title: "Choose Asset", text: "Browse tokenized real-world assets — property, energy, infrastructure, and more.", icon: "🏠" },
    { num: "04", title: "Earn Returns", text: "Receive passive income directly to your wallet. Track performance on your dashboard.", icon: "📈" },
  ];

  const news = [
    { date: "March 2025", tag: "Partnership", title: "Nextoken Capital Signs MoU with EU Infrastructure Fund", text: "Strategic partnership to tokenize €50M in renewable energy assets across three EU countries." },
    { date: "February 2025", tag: "Launch", title: "NXC Token Pre-Sale Opens Q2 2025", text: "The NXC token pre-sale is now scheduled with a fixed supply of 100M tokens and community allocation." },
    { date: "January 2025", tag: "Compliance", title: "Nextoken Receives EU Regulatory Approval Milestone", text: "Approval milestone reached for compliant tokenized asset issuance under EU DLT framework." },
  ];

  return (
    <>
      <Head>
        <title>Nextoken Capital — Tokenized Real-World Assets</title>
        <meta name="description" content="Invest in tokenized real-world assets — property, infrastructure, energy and more. Powered by NXC ecosystem." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="home-page">
        <section className="hero">
          <div className="container">
            <div className="heroCard">
              <div className="heroInner">
                <div className="heroContent">
                  <div className="tag">Tokenized Real-World Assets</div>
                  <h1>
                    INVEST IN <span className="goldText">TOKENIZED</span>
                    <br />REAL-WORLD ASSETS
                  </h1>
                  <p>
                    Register and explore opportunities in property, infrastructure, energy projects,
                    businesses and more. Nextoken Capital provides real-world asset tokenization
                    infrastructure with the <strong>NXC</strong> ecosystem.
                  </p>
                  <div className="heroBadges">
                    <span className="badge">🔒 EU Regulated</span>
                    <span className="badge">⚡ Blockchain-Powered</span>
                    <span className="badge">📊 15–18% Target ROI</span>
                  </div>
                  <div className="heroActions">
                    <button className="btnPrimary" onClick={() => router.push("/dashboard")}>Get Started — It&apos;s Free</button>
                    <button className="btnSecondary" onClick={scrollToHowItWorks}>How it Works ↓</button>
                  </div>
                </div>

                <div className="heroVisual">
                  <div className="statPill"><span className="statGreen">▲ 18.2%</span> this quarter</div>

                  <div className="roiCard">
                    <div className="roiHeader">
                      <span className="roiLabel">Annual ROI Performance</span>
                      <span className="roiVal">↗ 18%</span>
                    </div>
                    <div className="chartBars">
                      <div className="barWrap"><div className="bar" style={{ height: "40%" }} /><span>Q1</span></div>
                      <div className="barWrap"><div className="bar" style={{ height: "58%" }} /><span>Q2</span></div>
                      <div className="barWrap"><div className="bar" style={{ height: "72%" }} /><span>Q3</span></div>
                      <div className="barWrap"><div className="bar" style={{ height: "55%" }} /><span>Q4</span></div>
                      <div className="barWrap"><div className="bar highlight" style={{ height: "90%" }} /><span>Q1</span></div>
                    </div>
                  </div>

                  <div className="assetGrid">
                    <div className="assetPill">🏠 Real Estate</div>
                    <div className="assetPill">⚡ Energy</div>
                    <div className="assetPill">🏗️ Infrastructure</div>
                    <div className="assetPill">📈 Equity</div>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS BAR */}
            <div className="statsBar">
              <div className="statItem"><span className="statNum">€50M+</span><span className="statLbl">Assets Tokenized</span></div>
              <div className="statDivider" />
              <div className="statItem"><span className="statNum">12,400+</span><span className="statLbl">Registered Investors</span></div>
              <div className="statDivider" />
              <div className="statItem"><span className="statNum">15–18%</span><span className="statLbl">Target Annual ROI</span></div>
              <div className="statDivider" />
              <div className="statItem"><span className="statNum">EU</span><span className="statLbl">Regulated & Compliant</span></div>
            </div>

            {/* VISION & MISSION */}
            <div className="sectionTitle">OUR VISION &amp; MISSION</div>
            <section className="vmSection">
              <article className="vmCard">
                <div className="vmHead"><div className="vmIcon">👁️</div><h3>Our Vision</h3></div>
                <p>To empower global access to tokenized real-world assets by making investment opportunities transparent, efficient, and borderless — open to everyone, not just institutions.</p>
              </article>
              <article className="vmCard">
                <div className="vmHead"><div className="vmIcon">🎯</div><h3>Our Mission</h3></div>
                <p>To build a secure and decentralized investment ecosystem using blockchain-powered tokenization infrastructure and compliant onboarding — bridging traditional finance with Web3.</p>
              </article>
            </section>

            {/* FEATURES */}
            <section className="featuresSection">
              {features.map((item) => (
                <article className="featureCard" key={item.title}>
                  <div className="featureBadge">{item.icon}</div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </article>
              ))}
            </section>

            {/* HOW IT WORKS */}
            <div ref={howItWorksRef} className="sectionTitle" style={{ marginTop: 36 }}>HOW IT WORKS</div>
            <section className="stepsSection">
              {steps.map((step, i) => (
                <div className="stepCard" key={step.num}>
                  <div className="stepNum">{step.num}</div>
                  <div className="stepIcon">{step.icon}</div>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                  {i < steps.length - 1 && <div className="stepArrow">→</div>}
                </div>
              ))}
            </section>

            {/* NXC TOKEN */}
            <section className="tokenSection">
              <div className="tokenInner">
                <div className="sectionTitle sectionTitleSmall">NXC TOKEN</div>
                <p className="tokenSubtitle">The NXC token powers the entire Nextoken ecosystem — from platform access to staking rewards.</p>
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
                  <div className="tokenMetaItem"><span className="metaLbl">Total Supply</span><span className="metaVal">100,000,000 NXC</span></div>
                  <div className="tokenMetaItem"><span className="metaLbl">Network</span><span className="metaVal">Ethereum ERC-20</span></div>
                  <div className="tokenMetaItem"><span className="metaLbl">Pre-Sale</span><span className="metaVal">Q2 2025</span></div>
                  <div className="tokenMetaItem"><span className="metaLbl">Listing</span><span className="metaVal">Q3 2025</span></div>
                </div>
                <div className="tokenCTA">
                  <button className="btnPrimary" onClick={() => router.push("/tokenize")}>Explore Tokenization</button>
                  <button className="btnSecondary" onClick={() => router.push("/markets")}>Browse Markets</button>
                </div>
              </div>
            </section>

            {/* NEWS */}
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
                  </article>
                ))}
              </div>
            </section>

            {/* CTA BANNER */}
            <section className="ctaBanner">
              <div className="ctaContent">
                <h2>Ready to Start Investing?</h2>
                <p>Join 12,400+ investors already on the Nextoken platform. Access tokenized assets across bonds, equity, and more.</p>
                <button className="btnPrimary ctaBtnLarge" onClick={() => router.push("/dashboard")}>Go to Dashboard →</button>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
              <div className="footerTop">
                <div className="footerBrand">
                  <div className="footerLogoRow">
                    <div className="footerLogoBox">NXT</div>
                    <div className="footerLogoDivider" />
                    <div className="footerLogoText">
                      <span className="footerLogoMain">NEXTOKEN</span>
                      <span className="footerLogoSub">CAPITAL</span>
                    </div>
                  </div>
                  <p>Tokenized Real-World Assets for everyone. EU-regulated, blockchain-powered, community-driven.</p>
                  <div className="regulatorBadge">
                    <div className="regulatorIcon">🏦</div>
                    <div className="regulatorText">
                      <span className="regulatorLabel">Monitored by</span>
                      <span className="regulatorName">Bank of Lithuania</span>
                    </div>
                  </div>
                </div>
                <div className="footerLinks">
                  <div className="footerCol">
                    <h5>Platform</h5>
                    <button onClick={() => router.push("/dashboard")}>Dashboard</button>
                    <button onClick={() => router.push("/markets")}>Markets</button>
                    <button onClick={() => router.push("/exchange")}>Exchange</button>
                    <button onClick={() => router.push("/tokenize")}>Tokenize</button>
                  </div>
                  <div className="footerCol">
                    <h5>Assets</h5>
                    <button onClick={() => router.push("/bonds")}>Bonds</button>
                    <button onClick={() => router.push("/equity")}>Equity & IPO</button>
                    <button onClick={() => router.push("/markets")}>All Markets</button>
                  </div>
                  <div className="footerCol">
                    <h5>Contact</h5>
                    <a href="mailto:info@nextoken.com">info@nextoken.com</a>
                    <a href="https://twitter.com/nextoken" target="_blank" rel="noopener noreferrer">Twitter / X</a>
                    <a href="https://t.me/nextoken" target="_blank" rel="noopener noreferrer">Telegram</a>
                  </div>
                </div>
              </div>

              <div className="footerRow">
                <div className="socials">
                  <a href="https://twitter.com/nextoken" target="_blank" rel="noopener noreferrer" aria-label="X">𝕏</a>
                  <a href="https://facebook.com/nextoken" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
                  <a href="https://instagram.com/nextoken" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>
                  <a href="https://linkedin.com/company/nextoken" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
                  <a href="https://t.me/nextoken" target="_blank" rel="noopener noreferrer" aria-label="Telegram">tg</a>
                </div>
                <div className="contact">
                  <a href="mailto:info@nextoken.com">✉ info@nextoken.com</a>
                  <a href="tel:+35261234567">☎ +352 6 123 4567</a>
                </div>
              </div>

              <div className="disclaimer">
                ⚠️ NXC Token is a utility token for ecosystem access only. Nextoken Capital does not provide financial services, investment advice, or custody of funds. Tokenized asset returns are targets, not guarantees. Always do your own research and comply with your local laws.
                <br />© {new Date().getFullYear()} Nextoken Capital. All rights reserved. Registered in Lithuania. Monitored by the Bank of Lithuania.
              </div>
            </footer>
          </div>
        </section>
      </main>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
          background: radial-gradient(1200px 800px at 20% 10%, rgba(255,187,60,0.18), transparent 55%),
            radial-gradient(1000px 700px at 80% 20%, rgba(58,160,255,0.12), transparent 55%),
            linear-gradient(180deg, #05060a, #0b0d14);
          color: #eef1ff;
          position: relative;
          overflow-x: hidden;
          font-family: "Segoe UI", system-ui, sans-serif;
        }
        .container { max-width: 1180px; margin: 0 auto; padding: 0 18px 40px; }
        .btnPrimary, .btnSecondary {
          border-radius: 12px; padding: 11px 20px;
          font-weight: 700; cursor: pointer;
          transition: all 0.2s ease; font-size: 14.5px;
        }
        .btnPrimary {
          border: 0; color: #111;
          background: linear-gradient(135deg, #ffda7a, #f5c15a);
          box-shadow: 0 12px 30px rgba(255,193,90,0.25);
        }
        .btnPrimary:hover { transform: translateY(-1px); box-shadow: 0 16px 36px rgba(255,193,90,0.35); }
        .btnSecondary {
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
          color: rgba(238,241,255,0.92);
        }
        .btnSecondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.35); }

        .hero { padding: 96px 0 0; }
        .heroCard {
          border-radius: 26px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.12);
          background: radial-gradient(900px 350px at 70% 40%, rgba(255,193,90,0.15), transparent 60%),
            radial-gradient(900px 350px at 30% 40%, rgba(58,160,255,0.1), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .heroInner {
          display: grid; grid-template-columns: 1.1fr 0.9fr;
          gap: 28px; padding: 40px 32px; align-items: center;
        }
        .heroContent h1 { margin: 0; font-size: 46px; line-height: 1.04; letter-spacing: 0.5px; }
        .goldText {
          background: linear-gradient(180deg, #ffda7a, #b97b23);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .heroContent p { margin: 14px 0 16px; color: rgba(238,241,255,0.8); font-size: 15.5px; line-height: 1.55; }
        .tag {
          display: inline-block; margin-bottom: 14px;
          padding: 7px 14px; border-radius: 999px;
          border: 1px solid rgba(255,218,122,0.22);
          color: #ffda7a; font-size: 11px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          background: rgba(255,255,255,0.03);
        }
        .heroBadges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
        .badge {
          padding: 5px 11px; border-radius: 8px;
          font-size: 12px; font-weight: 600;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(238,241,255,0.85);
        }
        .heroActions { display: flex; gap: 12px; flex-wrap: wrap; }

        .heroVisual {
          position: relative; border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.1);
          background: linear-gradient(135deg, rgba(12,14,22,0.9), rgba(20,24,38,0.7));
          padding: 20px; display: flex; flex-direction: column; gap: 14px;
          min-height: 280px; justify-content: center;
        }
        .statPill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 999px; width: fit-content;
          background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1);
          font-size: 12px; font-weight: 600; color: rgba(238,241,255,0.85);
        }
        .statGreen { color: #35d0b2; }
        .roiCard {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 16px;
        }
        .roiHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .roiLabel { font-size: 11px; color: rgba(255,218,122,0.75); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .roiVal { font-size: 16px; font-weight: 800; color: #ffda7a; }
        .chartBars { display: flex; align-items: flex-end; gap: 8px; height: 80px; }
        .barWrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
        .bar { width: 100%; border-radius: 4px 4px 0 0; background: rgba(58,160,255,0.4); }
        .bar.highlight { background: linear-gradient(180deg, #ffda7a, #f5a623); }
        .barWrap span { font-size: 10px; color: rgba(238,241,255,0.4); }
        .assetGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .assetPill {
          padding: 8px 12px; border-radius: 10px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          font-size: 12px; font-weight: 600; color: rgba(238,241,255,0.75);
          text-align: center;
        }

        .statsBar {
          display: flex; align-items: center; justify-content: center;
          margin: 16px 0 0; border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          padding: 20px 24px; flex-wrap: wrap; gap: 16px;
        }
        .statItem { flex: 1; min-width: 120px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .statNum {
          font-size: 24px; font-weight: 900;
          background: linear-gradient(180deg, #ffda7a, #b97b23);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .statLbl { font-size: 12px; color: rgba(238,241,255,0.6); font-weight: 500; text-align: center; }
        .statDivider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }

        .sectionTitle {
          margin: 32px 0 16px; text-align: center; font-weight: 800;
          letter-spacing: 2px; color: rgba(255,218,122,0.92);
          text-transform: uppercase; font-size: 13px;
        }
        .sectionTitleSmall { margin-top: 4px; }

        .vmSection { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .vmCard {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px; padding: 20px;
        }
        .vmHead { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .vmHead h3 { margin: 0; font-size: 16px; }
        .vmIcon, .featureBadge, .tokenIcon {
          width: 42px; height: 42px; flex-shrink: 0; border-radius: 14px;
          display: grid; place-items: center;
          background: linear-gradient(135deg, rgba(255,218,122,0.9), rgba(185,123,35,0.9));
          color: #1b1207; font-size: 20px;
        }
        .vmCard p { color: rgba(238,241,255,0.8); line-height: 1.6; margin: 0; font-size: 14.5px; }

        .featuresSection { margin-top: 14px; display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .featureCard {
          border-radius: 18px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          box-shadow: 0 18px 40px rgba(0,0,0,0.3); padding: 18px 16px;
        }
        .featureCard h4 { margin: 10px 0 6px; font-size: 14.5px; }
        .featureCard p { color: rgba(238,241,255,0.8); line-height: 1.55; margin: 0; font-size: 13.5px; }

        .stepsSection { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .stepCard {
          border-radius: 18px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03); padding: 20px 16px; position: relative;
        }
        .stepCard h4 { margin: 10px 0 6px; font-size: 14.5px; }
        .stepCard p { color: rgba(238,241,255,0.75); line-height: 1.55; margin: 0; font-size: 13.5px; }
        .stepNum { font-size: 32px; font-weight: 900; color: rgba(255,218,122,0.2); line-height: 1; margin-bottom: 8px; }
        .stepIcon { font-size: 26px; }
        .stepArrow { position: absolute; right: -14px; top: 50%; transform: translateY(-50%); font-size: 20px; color: rgba(255,218,122,0.4); z-index: 2; }

        .tokenSection {
          margin-top: 18px; border-radius: 26px; border: 1px solid rgba(255,255,255,0.12);
          background: radial-gradient(900px 250px at 50% 20%, rgba(255,193,90,0.18), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .tokenInner { padding: 24px; }
        .tokenSubtitle { text-align: center; color: rgba(238,241,255,0.7); font-size: 14.5px; margin: 0 auto 16px; max-width: 500px; line-height: 1.5; }
        .tokenGrid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .tokenCard {
          border-radius: 18px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); padding: 16px;
          display: flex; gap: 12px; align-items: flex-start;
        }
        .tokenCard h4 { margin: 0 0 6px; font-size: 14.5px; }
        .tokenCard p { color: rgba(238,241,255,0.8); line-height: 1.55; margin: 0; font-size: 13.5px; }
        .tokenMeta {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 10px;
          margin-top: 16px; padding: 16px; border-radius: 14px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
        }
        .tokenMetaItem { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .metaLbl { font-size: 11px; color: rgba(238,241,255,0.5); font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
        .metaVal { font-size: 14px; font-weight: 700; color: #ffda7a; }
        .tokenCTA { display: flex; justify-content: center; gap: 12px; margin-top: 18px; flex-wrap: wrap; }

        .newsSection { margin-top: 18px; }
        .newsGrid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
        .newsCard {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px; padding: 20px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .newsTop { display: flex; align-items: center; justify-content: space-between; }
        .newsTag {
          padding: 4px 10px; border-radius: 8px;
          background: rgba(255,218,122,0.1); border: 1px solid rgba(255,218,122,0.2);
          color: #ffda7a; font-size: 11px; font-weight: 700;
        }
        .newsDate { font-size: 12px; color: rgba(238,241,255,0.45); }
        .newsCard h4 { margin: 0; font-size: 14.5px; line-height: 1.4; }
        .newsCard p { color: rgba(238,241,255,0.75); line-height: 1.55; margin: 0; font-size: 13.5px; }

        .ctaBanner {
          margin-top: 24px; border-radius: 26px;
          border: 1px solid rgba(255,218,122,0.2);
          background: radial-gradient(800px 300px at 50% 50%, rgba(255,193,90,0.2), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
          box-shadow: 0 20px 60px rgba(0,0,0,0.4); padding: 48px 28px; text-align: center;
        }
        .ctaContent h2 { margin: 0 0 12px; font-size: 32px; font-weight: 900; }
        .ctaContent p { color: rgba(238,241,255,0.8); font-size: 15.5px; line-height: 1.55; margin: 0 auto 24px; max-width: 500px; }
        .ctaBtnLarge { padding: 14px 32px !important; font-size: 16px !important; border-radius: 14px !important; }

        .footer { margin: 28px 0 0; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(238,241,255,0.75); }
        .footerTop { display: grid; grid-template-columns: 1fr 2fr; gap: 40px; margin-bottom: 28px; }
        .footerBrand { display: flex; flex-direction: column; gap: 14px; }
        .footerLogoRow { display: flex; align-items: center; gap: 10px; }
        .footerLogoBox {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #ffda7a, #f5a623);
          display: grid; place-items: center;
          font-weight: 900; font-size: 12px; color: #111;
        }
        .footerLogoDivider { width: 1px; height: 26px; background: rgba(255,255,255,0.18); }
        .footerLogoText { display: flex; flex-direction: column; line-height: 1.1; }
        .footerLogoMain { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; color: #eef1ff; }
        .footerLogoSub { font-size: 9px; font-weight: 500; letter-spacing: 2px; color: rgba(255,218,122,0.75); text-transform: uppercase; }
        .footerBrand p { font-size: 13px; color: rgba(238,241,255,0.6); line-height: 1.6; margin: 0; max-width: 220px; }

        .regulatorBadge {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 12px;
          border: 1px solid rgba(255,218,122,0.2);
          background: rgba(255,218,122,0.05);
          width: fit-content;
        }
        .regulatorIcon { font-size: 22px; }
        .regulatorText { display: flex; flex-direction: column; line-height: 1.2; }
        .regulatorLabel { font-size: 10px; color: rgba(238,241,255,0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .regulatorName { font-size: 13px; font-weight: 700; color: #ffda7a; }

        .footerLinks { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        .footerCol { display: flex; flex-direction: column; gap: 10px; }
        .footerCol h5 { margin: 0 0 4px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,218,122,0.8); }
        .footerCol button { background: none; border: none; color: rgba(238,241,255,0.65); font-size: 13.5px; cursor: pointer; text-align: left; padding: 0; transition: color 0.2s; }
        .footerCol button:hover { color: #ffda7a; }
        .footerCol a { color: rgba(238,241,255,0.65); font-size: 13.5px; text-decoration: none; transition: color 0.2s; }
        .footerCol a:hover { color: #ffda7a; }
        .footerRow { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.07); }
        .socials, .contact { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .socials a {
          min-width: 38px; min-height: 38px; display: inline-flex; align-items: center; justify-content: center;
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.05); padding: 8px 12px;
          color: inherit; text-decoration: none; font-size: 13px; font-weight: 700; transition: all 0.2s;
        }
        .socials a:hover { background: rgba(255,218,122,0.1); border-color: rgba(255,218,122,0.3); color: #ffda7a; }
        .contact a {
          display: inline-flex; align-items: center; padding: 8px 14px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04);
          color: rgba(238,241,255,0.8); text-decoration: none; font-size: 13px; transition: all 0.2s;
        }
        .contact a:hover { border-color: rgba(255,218,122,0.3); color: #ffda7a; }
        .disclaimer { margin-top: 20px; font-size: 11.5px; color: rgba(238,241,255,0.4); line-height: 1.65; text-align: center; padding-bottom: 28px; }

        @media (max-width: 980px) {
          .heroInner { grid-template-columns: 1fr; }
          .featuresSection { grid-template-columns: 1fr 1fr; }
          .stepsSection { grid-template-columns: 1fr 1fr; }
          .tokenGrid { grid-template-columns: 1fr; }
          .vmSection { grid-template-columns: 1fr; }
          .newsGrid { grid-template-columns: 1fr 1fr; }
          .heroContent h1 { font-size: 36px; }
          .footerTop { grid-template-columns: 1fr; gap: 24px; }
          .tokenMeta { grid-template-columns: 1fr 1fr; }
          .statDivider { display: none; }
        }
        @media (max-width: 640px) {
          .featuresSection { grid-template-columns: 1fr; }
          .stepsSection { grid-template-columns: 1fr; }
          .stepArrow { display: none; }
          .heroContent h1 { font-size: 30px; }
          .container { padding: 0 14px 28px; }
          .footerLinks { grid-template-columns: 1fr 1fr; }
          .tokenMeta { grid-template-columns: 1fr 1fr; }
          .ctaContent h2 { font-size: 24px; }
          .newsGrid { grid-template-columns: 1fr; }
          .hero { padding-top: 80px; }
        }
      `}</style>
    </>
  );
}