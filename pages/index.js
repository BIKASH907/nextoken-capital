import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const tickerItems = [
    "EUR 0.4823 +0.89%",
    "ADA/EUR 0.3310 -1.48%",
    "AVAX/EUR 22.23 +2.41%",
    "DOT/EUR 5.72 -1.38%",
    "MATIC/EUR 0.5140 +3.38%",
    "LINK/EUR 11.55 +2.76%",
    "Bond Market Open",
    "Equity Access Available",
  ];

  const features = [
    {
      title: "Issue Bonds",
      text: "Launch regulated bond offerings with compliant onboarding and fast settlement.",
      icon: "▣",
    },
    {
      title: "Tokenize Assets",
      text: "Bring real estate, infrastructure, and business equity into a digital market environment.",
      icon: "◈",
    },
    {
      title: "Equity & IPO",
      text: "Access equity offerings and secondary market participation through one platform.",
      icon: "◇",
    },
    {
      title: "Exchange",
      text: "Trade listed digital capital market products with a clean, fast exchange-style interface.",
      icon: "◉",
    },
  ];

  const trustPoints = [
    {
      title: "MiCA Licensed",
      text: "Built around the EU MiCA regulatory framework.",
    },
    {
      title: "Monitored by Bank of Lithuania",
      text: "Aligned with Lithuania-based financial oversight.",
    },
    {
      title: "DLT Pilot Regime",
      text: "Structured for compliant digital securities operations.",
    },
    {
      title: "AML / KYC Compliant",
      text: "Includes onboarding, screening, and account monitoring processes.",
    },
  ];

  const stats = [
    { value: "$300T+", label: "Global Asset Market" },
    { value: "190+", label: "Countries" },
    { value: "<48h", label: "Time to Issue" },
    { value: "0.2%", label: "Trading Fee" },
  ];

  return (
    <>
      <Head>
        <title>Nextoken Capital</title>
        <meta
          name="description"
          content="Nextoken Capital is a platform for bonds, real-world asset tokenization, equity offerings, and regulated secondary market access."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="homePage">
        <section className="tickerBar" aria-label="Market ticker">
          <div className="tickerTrack">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item}-${index}`} className="tickerItem">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="heroSection">
          <div className="heroOverlay" />
          <div className="heroContainer">
            <div className="heroTopBadge">
              <span className="dot" />
              MiCA Licensed · EU Regulated · DLT Pilot Regime
            </div>

            <div className="heroGrid">
              <div className="heroContent">
                <h1>
                  The Global Platform for
                  <br />
                  <span>Tokenized Capital Markets</span>
                </h1>

                <p>
                  Issue bonds, tokenize real-world assets, launch equity
                  offerings, and access a regulated secondary market through one
                  compliant platform.
                </p>

                <div className="heroButtons">
                  <Link href="/register" className="primaryBtn">
                    Get Started
                  </Link>
                  <Link href="/exchange" className="secondaryBtn">
                    Open Exchange
                  </Link>
                </div>

                <div className="statsGrid">
                  {stats.map((item) => (
                    <div key={item.label} className="statCard">
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="heroVisual">
                <div className="floatingCard leftTop">
                  <span className="cardLabel">Tokenized Bond</span>
                  <strong>€ 10,000</strong>
                  <p>EU Gov Bond · 5.2% APY</p>
                  <span className="statusText">LIVE</span>
                </div>

                <div className="floatingCard rightTop">
                  <span className="cardLabel">Real Estate Token</span>
                  <strong>Vilnius Office</strong>
                  <p>€2.4M · 847 tokens</p>
                  <span className="statusText">TRADEABLE</span>
                </div>

                <div className="centerPanel">
                  <div className="panelHeader">Nextoken Capital Overview</div>
                  <div className="chartArea">
                    <div className="chartBar bar1" />
                    <div className="chartBar bar2" />
                    <div className="chartBar bar3" />
                    <div className="chartBar bar4" />
                    <div className="chartBar bar5" />
                    <div className="chartBar bar6" />
                  </div>
                  <div className="panelFooter">
                    <span>Regulated market access</span>
                    <span>24/7 exchange experience</span>
                  </div>
                </div>

                <div className="floatingCard leftBottom">
                  <span className="cardLabel">Equity Token</span>
                  <strong>FinTech IPO</strong>
                  <p>+18.4% · 30d</p>
                  <span className="statusText">OPEN</span>
                </div>

                <div className="floatingCard rightBottom highlightCard">
                  <span className="cardLabel">Platform Access</span>
                  <strong>Compliant Infrastructure</strong>
                  <p>Built for regulated digital capital markets</p>
                  <span className="statusText">REGULATED</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="featuresSection">
          <div className="sectionContainer">
            <div className="sectionHeading">
              <span className="eyebrow">Everything You Need</span>
              <h2>One Platform. All Capital Markets.</h2>
            </div>

            <div className="featuresGrid">
              {features.map((item) => (
                <article key={item.title} className="featureCard">
                  <div className="featureIcon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="trustSection">
          <div className="sectionContainer">
            <div className="sectionHeading">
              <span className="eyebrow">Regulated & Compliant</span>
              <h2>Built on Trust & Regulation</h2>
            </div>

            <div className="trustGrid">
              {trustPoints.map((item) => (
                <article key={item.title} className="trustCard">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ctaSection">
          <div className="sectionContainer">
            <div className="ctaCard">
              <h2>Ready to build in tokenized capital markets?</h2>
              <p>
                Join investors and issuers on a platform focused on bonds,
                equity access, real-world asset tokenization, and compliant
                market infrastructure.
              </p>

              <div className="ctaButtons">
                <Link href="/register" className="primaryBtn">
                  Create Free Account
                </Link>
                <Link href="/contact" className="secondaryBtn">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="sectionContainer">
            <div className="footerTop">
              <div className="footerBrand">
                <div className="footerLogoRow">
                  <span className="footerNxt">NXT</span>
                  <div className="footerBrandText">
                    <strong>Nextoken Capital</strong>
                    <span>Digital Capital Markets</span>
                  </div>
                </div>

                <p>
                  The regulated infrastructure for tokenized real-world assets.
                </p>
                <p className="footerMeta">Monitored by Bank of Lithuania</p>
                <p className="footerMeta">
                  © 2026 Nextoken Capital UAB. All rights reserved. Registered
                  in Lithuania.
                </p>
              </div>

              <div className="footerLinks">
                <div className="footerCol">
                  <h4>Company</h4>
                  <Link href="/about">About Us</Link>
                </div>

                <div className="footerCol">
                  <h4>Legal</h4>
                  <Link href="/terms">Terms of Service</Link>
                  <Link href="/privacy">Privacy Policy</Link>
                  <Link href="/risk">Risk Disclosure</Link>
                  <Link href="/aml">AML Policy</Link>
                </div>

                <div className="footerCol">
                  <h4>Support</h4>
                  <Link href="/contact">Contact Us</Link>
                </div>
              </div>
            </div>

            <div className="footerBottom">
              <div className="contactBox">
                <h4>Contact</h4>
                <p>
                  Use the Contact Us page for platform, issuer, partnership, or
                  compliance-related inquiries.
                </p>
                <Link href="/contact" className="footerContactBtn">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </footer>

        <style jsx>{`
          .homePage {
            min-height: 100vh;
            background:
              radial-gradient(
                1200px 600px at 20% 0%,
                rgba(240, 185, 11, 0.08),
                transparent 55%
              ),
              linear-gradient(180deg, #05070d 0%, #0a0d14 50%, #070a11 100%);
            color: #ffffff;
          }

          .tickerBar {
            overflow: hidden;
            border-top: 1px solid rgba(255, 255, 255, 0.04);
            border-bottom: 1px solid rgba(240, 185, 11, 0.14);
            background: rgba(255, 255, 255, 0.02);
          }

          .tickerTrack {
            display: flex;
            gap: 36px;
            white-space: nowrap;
            min-width: max-content;
            padding: 12px 18px;
            animation: tickerMove 28s linear infinite;
          }

          .tickerItem {
            color: rgba(255, 255, 255, 0.78);
            font-size: 14px;
            font-weight: 700;
          }

          .heroSection {
            position: relative;
            overflow: hidden;
            padding: 42px 20px 70px;
          }

          .heroOverlay {
            position: absolute;
            inset: 0;
            background:
              radial-gradient(
                600px 300px at 75% 35%,
                rgba(240, 185, 11, 0.1),
                transparent 60%
              ),
              radial-gradient(
                500px 280px at 20% 25%,
                rgba(34, 197, 94, 0.06),
                transparent 60%
              );
            pointer-events: none;
          }

          .heroContainer,
          .sectionContainer {
            max-width: 1280px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
          }

          .heroTopBadge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 18px;
            border-radius: 999px;
            margin-bottom: 24px;
            background: rgba(13, 18, 28, 0.82);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.84);
            font-size: 14px;
            font-weight: 700;
          }

          .dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: #14c784;
            box-shadow: 0 0 12px rgba(20, 199, 132, 0.55);
          }

          .heroGrid {
            display: grid;
            grid-template-columns: 1.05fr 0.95fr;
            gap: 34px;
            align-items: center;
          }

          .heroContent h1 {
            margin: 0 0 18px;
            font-size: 74px;
            line-height: 0.96;
            font-weight: 900;
            letter-spacing: -2px;
          }

          .heroContent h1 span {
            color: #f0b90b;
          }

          .heroContent p {
            margin: 0;
            max-width: 760px;
            color: rgba(255, 255, 255, 0.76);
            font-size: 18px;
            line-height: 1.7;
          }

          .heroButtons,
          .ctaButtons {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
            margin-top: 30px;
          }

          .primaryBtn,
          .secondaryBtn,
          .footerContactBtn {
            min-height: 50px;
            padding: 0 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 800;
            transition: all 0.2s ease;
          }

          .primaryBtn {
            background: #f0b90b;
            color: #111111;
            border: 1px solid #f0b90b;
            box-shadow: 0 14px 28px rgba(240, 185, 11, 0.18);
          }

          .primaryBtn:hover,
          .footerContactBtn:hover {
            transform: translateY(-1px);
            box-shadow: 0 18px 34px rgba(240, 185, 11, 0.26);
          }

          .secondaryBtn {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.14);
          }

          .secondaryBtn:hover {
            color: #f0b90b;
            border-color: rgba(240, 185, 11, 0.42);
          }

          .statsGrid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            margin-top: 34px;
          }

          .statCard {
            padding: 18px 16px;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
          }

          .statCard strong {
            display: block;
            margin-bottom: 6px;
            color: #f0b90b;
            font-size: 30px;
            line-height: 1;
            font-weight: 900;
          }

          .statCard span {
            color: rgba(255, 255, 255, 0.65);
            font-size: 13px;
            font-weight: 600;
          }

          .heroVisual {
            position: relative;
            min-height: 620px;
            border-radius: 28px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background:
              radial-gradient(
                450px 220px at 50% 50%,
                rgba(240, 185, 11, 0.1),
                transparent 60%
              ),
              linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.04),
                rgba(255, 255, 255, 0.02)
              );
            box-shadow: 0 22px 60px rgba(0, 0, 0, 0.34);
            overflow: hidden;
          }

          .centerPanel {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 72%;
            border-radius: 22px;
            padding: 22px;
            background: rgba(8, 12, 18, 0.88);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 18px 48px rgba(0, 0, 0, 0.3);
          }

          .panelHeader {
            font-size: 15px;
            font-weight: 800;
            margin-bottom: 20px;
            color: #ffffff;
          }

          .chartArea {
            height: 220px;
            display: flex;
            align-items: flex-end;
            gap: 14px;
            padding: 18px;
            border-radius: 18px;
            background:
              linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.03),
                rgba(240, 185, 11, 0.05)
              );
          }

          .chartBar {
            flex: 1;
            border-radius: 18px 18px 0 0;
            background: linear-gradient(180deg, #f0b90b, #7d5f00);
          }

          .bar1 {
            height: 30%;
          }

          .bar2 {
            height: 45%;
          }

          .bar3 {
            height: 38%;
          }

          .bar4 {
            height: 62%;
          }

          .bar5 {
            height: 78%;
          }

          .bar6 {
            height: 70%;
          }

          .panelFooter {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-top: 16px;
            color: rgba(255, 255, 255, 0.68);
            font-size: 13px;
            font-weight: 600;
          }

          .floatingCard {
            position: absolute;
            width: 250px;
            padding: 20px;
            border-radius: 20px;
            background: rgba(9, 14, 22, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
          }

          .leftTop {
            left: 26px;
            top: 28px;
          }

          .rightTop {
            right: 26px;
            top: 28px;
          }

          .leftBottom {
            left: 26px;
            bottom: 26px;
          }

          .rightBottom {
            right: 26px;
            bottom: 26px;
          }

          .highlightCard {
            border-color: rgba(20, 199, 132, 0.25);
          }

          .cardLabel {
            display: block;
            margin-bottom: 12px;
            color: rgba(255, 255, 255, 0.46);
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .floatingCard strong {
            display: block;
            font-size: 22px;
            line-height: 1.2;
            margin-bottom: 8px;
          }

          .floatingCard p {
            margin: 0 0 12px;
            color: rgba(255, 255, 255, 0.62);
            font-size: 15px;
            line-height: 1.5;
          }

          .statusText {
            color: #14c784;
            font-size: 14px;
            font-weight: 800;
          }

          .featuresSection,
          .trustSection,
          .ctaSection {
            padding: 24px 20px 70px;
          }

          .sectionHeading {
            margin-bottom: 26px;
          }

          .eyebrow {
            display: inline-block;
            margin-bottom: 10px;
            color: #f0b90b;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .sectionHeading h2 {
            margin: 0;
            font-size: 44px;
            line-height: 1.05;
            font-weight: 900;
          }

          .featuresGrid,
          .trustGrid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }

          .featureCard,
          .trustCard {
            padding: 24px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.07);
          }

          .featureIcon {
            width: 46px;
            height: 46px;
            display: grid;
            place-items: center;
            border-radius: 14px;
            margin-bottom: 16px;
            background: rgba(240, 185, 11, 0.12);
            color: #f0b90b;
            font-size: 22px;
            font-weight: 900;
          }

          .featureCard h3,
          .trustCard h3 {
            margin: 0 0 10px;
            font-size: 20px;
            font-weight: 800;
          }

          .featureCard p,
          .trustCard p,
          .ctaCard p,
          .footer p {
            margin: 0;
            color: rgba(255, 255, 255, 0.7);
            font-size: 16px;
            line-height: 1.7;
          }

          .ctaCard {
            padding: 34px;
            border-radius: 24px;
            background:
              radial-gradient(
                500px 200px at 20% 20%,
                rgba(240, 185, 11, 0.08),
                transparent 60%
              ),
              rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          .ctaCard h2 {
            margin: 0 0 14px;
            font-size: 42px;
            line-height: 1.05;
            font-weight: 900;
          }

          .footer {
            padding: 10px 20px 40px;
          }

          .footerTop {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 30px;
            padding: 32px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }

          .footerLogoRow {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 18px;
          }

          .footerNxt {
            color: #f0b90b;
            font-size: 28px;
            font-weight: 900;
            letter-spacing: 1px;
          }

          .footerBrandText {
            display: flex;
            flex-direction: column;
          }

          .footerBrandText strong {
            font-size: 22px;
            font-weight: 800;
          }

          .footerBrandText span {
            margin-top: 4px;
            color: rgba(255, 255, 255, 0.55);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.2px;
            text-transform: uppercase;
          }

          .footerMeta {
            margin-top: 10px !important;
            color: rgba(255, 255, 255, 0.55) !important;
            font-size: 14px !important;
          }

          .footerLinks {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          .footerCol h4,
          .contactBox h4 {
            margin: 0 0 14px;
            font-size: 15px;
            font-weight: 800;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .footerCol a {
            display: block;
            margin-bottom: 12px;
            text-decoration: none;
            color: rgba(255, 255, 255, 0.68);
            font-size: 16px;
            transition: color 0.2s ease;
          }

          .footerCol a:hover {
            color: #f0b90b;
          }

          .footerBottom {
            padding-top: 8px;
          }

          .contactBox {
            padding: 24px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.07);
            max-width: 560px;
          }

          .footerContactBtn {
            margin-top: 18px;
            background: #f0b90b;
            color: #111111;
            border: 1px solid #f0b90b;
            box-shadow: 0 14px 28px rgba(240, 185, 11, 0.18);
          }

          @keyframes tickerMove {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @media (max-width: 1180px) {
            .heroGrid {
              grid-template-columns: 1fr;
            }

            .heroVisual {
              min-height: 560px;
            }

            .heroContent h1 {
              font-size: 58px;
              line-height: 1;
            }

            .featuresGrid,
            .trustGrid {
              grid-template-columns: repeat(2, 1fr);
            }

            .statsGrid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 760px) {
            .heroSection,
            .featuresSection,
            .trustSection,
            .ctaSection,
            .footer {
              padding-left: 16px;
              padding-right: 16px;
            }

            .heroContent h1 {
              font-size: 42px;
              letter-spacing: -1px;
            }

            .heroContent p,
            .featureCard p,
            .trustCard p,
            .ctaCard p,
            .footer p {
              font-size: 15px;
            }

            .sectionHeading h2,
            .ctaCard h2 {
              font-size: 32px;
            }

            .featuresGrid,
            .trustGrid,
            .statsGrid,
            .footerLinks,
            .footerTop {
              grid-template-columns: 1fr;
            }

            .heroVisual {
              min-height: 860px;
            }

            .centerPanel {
              width: calc(100% - 32px);
              top: 50%;
            }

            .floatingCard {
              position: static;
              width: 100%;
              margin: 16px;
            }

            .heroVisual {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              padding: 12px 0 320px;
            }

            .leftTop,
            .rightTop,
            .leftBottom,
            .rightBottom {
              left: auto;
              right: auto;
              top: auto;
              bottom: auto;
            }

            .panelFooter {
              flex-direction: column;
            }

            .heroButtons,
            .ctaButtons {
              flex-direction: column;
            }

            .primaryBtn,
            .secondaryBtn,
            .footerContactBtn {
              width: 100%;
            }
          }
        `}</style>
      </main>
    </>
  );
}