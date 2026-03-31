import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RISKS = [
  { icon:"📉", title:"Market Risk",         color:"#ef4444", desc:"The value of tokenized assets may go down as well as up. You may receive back less than you invested. Past performance is not a reliable indicator of future results. Real estate values, bond prices, and equity valuations are affected by economic conditions, interest rates, and market sentiment." },
  { icon:"💧", title:"Liquidity Risk",       color:"#F0B90B", desc:"Tokenized assets may be difficult to sell quickly at a fair price. Secondary market trading depends on the availability of buyers and sellers. There is no guarantee that a secondary market will exist for any particular token, and you may be unable to exit your investment before the stated maturity date." },
  { icon:"⚖️", title:"Regulatory Risk",      color:"#3B82F6", desc:"The regulatory environment for crypto-assets and tokenized digital assets is evolving. Changes in law, regulation, or regulatory interpretation may affect the value of your investments, your ability to trade, or the platform's ability to operate. MiCA and other EU regulations may impose new requirements." },
  { icon:"🔐", title:"Technology Risk",      color:"#0ECB81", desc:"Blockchain technology is subject to software bugs, cyber attacks, and infrastructure failures. Smart contract vulnerabilities could result in loss of funds. While we implement security best practices following ISO 27001 standards, no system is entirely free from technical risk." },
  { icon:"🏗️", title:"Issuer Risk",          color:"#F0B90B", desc:"The financial performance of the underlying asset depends on the issuer's ability to manage and operate it. Issuers may default, become insolvent, or fail to deliver estimated earnings. Our compliance review does not constitute a recommendation or guarantee of performance." },
  { icon:"💱", title:"Currency Risk",        color:"#3B82F6", desc:"If you invest in assets denominated in a currency other than your home currency, exchange rate fluctuations may affect the value of your investment when converted back. Euro-denominated investments carry currency risk for non-Eurozone investors." },
  { icon:"🌐", title:"Concentration Risk",   color:"#ef4444", desc:"Investing a large proportion of your portfolio in a single asset, sector, or geography increases your exposure to specific risks. We recommend diversifying your investments across multiple asset classes, sectors, and geographies to reduce concentration risk." },
  { icon:"📋", title:"Operational Risk",     color:"#0ECB81", desc:"Platform downtime, settlement failures, or administrative errors could affect your ability to invest or trade. While we maintain business continuity plans, operational disruptions may delay or prevent transactions from being executed at the desired time or price." },
];

export default function RiskPage() {
  return (
    <>
      <Head>
        <title>Risk Disclosure — Nextoken Capital</title>
        <meta name="description" content="Important risk disclosure for buyers using the Nextoken Capital tokenized asset platform." />
      </Head>
      <Navbar />
      <style>{`
        .rk{min-height:100vh;background:#0B0E11;padding-top:64px}
        .rk-hero{padding:52px 20px 40px;border-bottom:1px solid rgba(255,255,255,0.07);text-align:center}
        .rk-tag{font-size:11px;font-weight:700;color:#FF4D4D;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
        .rk-h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#fff;letter-spacing:-1px;margin-bottom:14px}
        .rk-warning{max-width:680px;margin:0 auto;padding:16px 20px;background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.25);border-radius:10px;font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7;text-align:left}
        .rk-body{max-width:1100px;margin:0 auto;padding:48px 20px 72px}
        .rk-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-bottom:48px}
        .rk-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:26px}
        .rk-card-head{display:flex;align-items:center;gap:12px;margin-bottom:14px}
        .rk-card-icon{font-size:24px}
        .rk-card-title{font-size:15px;font-weight:800;color:#fff}
        .rk-card-text{font-size:13px;color:rgba(255,255,255,0.5);line-height:1.8}
        .rk-summary{background:#0F1318;border:1px solid rgba(255,77,77,0.2);border-radius:14px;padding:28px;margin-bottom:32px}
        .rk-summary-title{font-size:15px;font-weight:800;color:#FF4D4D;margin-bottom:16px}
        .rk-summary-item{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.7;margin-bottom:10px}
        .rk-summary-item::before{content:"•";color:#FF4D4D;flex-shrink:0;margin-top:1px}
        .rk-footer-links{display:flex;gap:16px;flex-wrap:wrap;padding-top:32px;border-top:1px solid rgba(255,255,255,0.07)}
        .rk-footer-links a{font-size:13px;color:#F0B90B;text-decoration:none}
        @media(max-width:768px){.rk-grid{grid-template-columns:1fr}}
      `}</style>
      <div className="rk">
        <div className="rk-hero">
          <div className="rk-tag">Risk Disclosure</div>
          <h1 className="rk-h1">Important Risk Information</h1>
          <div className="rk-warning">
            <strong>Capital at Risk.</strong> Investing in tokenized assets involves significant risk and is not suitable for all investors. The value of your investments can go down as well as up, and you may lose all of the money you invest. Please read this risk disclosure carefully before investing and consider seeking independent financial guidance.
          </div>
        </div>
        <div className="rk-body">
          <div className="rk-grid">
            {RISKS.map(r => (
              <div key={r.title} className="rk-card">
                <div className="rk-card-head">
                  <span className="rk-card-icon">{r.icon}</span>
                  <span className="rk-card-title" style={{ color: r.color }}>{r.title}</span>
                </div>
                <p className="rk-card-text">{r.desc}</p>
              </div>
            ))}
          </div>
          <div className="rk-summary">
            <div className="rk-summary-title">⚠️ Key Points to Remember</div>
            {[
              "Only invest money you can afford to lose entirely.",
              "Tokenized assets are not covered by the EU Deposit Guarantee Scheme.",
              "Past performance of an asset does not guarantee future returns.",
              "You should diversify your investments to reduce risk.",
              "Ensure you understand the specific risks of each asset before investing.",
              "Consider your investment horizon — some assets have lock-up periods.",
              "Regulatory changes may affect your ability to trade or withdraw funds.",
              "Seek independent financial, legal, and tax advice if in doubt.",
            ].map(t => <div key={t} className="rk-summary-item">{t}</div>)}
          </div>
          <div className="rk-footer-links">
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/aml">AML Policy</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}