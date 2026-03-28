import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FAQS = [
  { cat:"Getting Started", q:"How do I create an account?", a:"Click 'Get Started' in the top navigation. You will need to provide your name, email, and complete KYC identity verification via Sumsub. The process takes under 5 minutes." },
  { cat:"Getting Started", q:"What documents do I need for KYC?", a:"You need a government-issued photo ID (passport, national ID card, or driver's license) and access to a camera for a selfie. In some cases we may request proof of address." },
  { cat:"Getting Started", q:"What countries can invest?", a:"We support investors from 180+ countries. Some jurisdictions are restricted due to regulatory requirements. You will be notified during registration if your country is not currently supported." },
  { cat:"Investing",       q:"What is the minimum investment?", a:"The minimum investment is EUR 100 for most assets. Some assets may have higher minimums — this is clearly shown on each asset's page before you invest." },
  { cat:"Investing",       q:"How do I invest in an asset?", a:"Browse Markets, select an asset, review the details including ROI, term, and risk level, then click 'View Opportunity'. You will need a verified account and sufficient wallet balance to invest." },
  { cat:"Investing",       q:"When do I receive returns?", a:"Return schedules vary by asset type. Bond coupons are paid quarterly. Real estate distributions are typically annual. Exact payment schedules are shown on each asset's detail page." },
  { cat:"Exchange",        q:"How does the secondary market work?", a:"The exchange allows you to buy and sell security tokens you already hold. All trades settle on-chain at T+0. A 0.2% flat fee applies to all executed trades." },
  { cat:"Exchange",        q:"Can I withdraw my investment early?", a:"You can sell your tokens on the secondary market if there is a buyer available. Liquidity is not guaranteed. Some assets have lock-up periods during which trading is restricted." },
  { cat:"Wallet",          q:"How do I connect my wallet?", a:"Click 'Connect Wallet' in the navigation bar. We support MetaMask, WalletConnect, Coinbase Wallet, and other EVM-compatible wallets. Your wallet address is used for on-chain settlement." },
  { cat:"Wallet",          q:"Is my wallet secure?", a:"We never have access to your private keys or seed phrase. Always keep your recovery phrase offline and secure. Never share it with anyone — including Nextoken Capital staff." },
  { cat:"Security",        q:"How is my account protected?", a:"We recommend enabling 2FA on your account. All data is encrypted at rest and in transit. Our infrastructure follows enterprise security standards. We monitor for suspicious activity 24/7." },
  { cat:"Security",        q:"What if I forget my password?", a:"Click 'Forgot password?' on the login page. You will receive a password reset email within a few minutes. If you do not receive it, check your spam folder or contact support." },
];

const CATS = ["All", "Getting Started", "Investing", "Exchange", "Wallet", "Security"];

export default function HelpPage() {
  const [cat, setCat]       = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen]     = useState(null);

  const filtered = FAQS.filter(f =>
    (cat === "All" || f.cat === cat) &&
    (search === "" || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Head>
        <title>Help Center — Nextoken Capital</title>
        <meta name="description" content="Find answers to common questions about investing, the exchange, wallet, and account security on Nextoken Capital." />
      </Head>
      <Navbar />
      <style>{`
        .hp{min-height:100vh;background:#0B0E11;padding-top:64px}
        .hp-hero{padding:52px 20px 40px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.07)}
        .hp-tag{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
        .hp-h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#fff;letter-spacing:-1px;margin-bottom:20px}
        .hp-search-wrap{max-width:520px;margin:0 auto;position:relative}
        .hp-search{width:100%;padding:13px 18px 13px 44px;background:#0F1318;border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:14px;outline:none;font-family:inherit;transition:border-color .15s}
        .hp-search:focus{border-color:rgba(240,185,11,0.5)}
        .hp-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:16px;color:rgba(255,255,255,0.3)}
        .hp-body{max-width:860px;margin:0 auto;padding:36px 20px 72px}
        .hp-cats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px}
        .hp-cat{padding:7px 16px;border-radius:7px;font-size:12px;font-weight:600;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(255,255,255,0.5);cursor:pointer;font-family:inherit;transition:all .15s}
        .hp-cat:hover{color:#fff;border-color:rgba(255,255,255,0.3)}
        .hp-cat.on{background:rgba(240,185,11,0.1);border-color:rgba(240,185,11,0.35);color:#F0B90B}
        .hp-count{font-size:13px;color:rgba(255,255,255,0.35);margin-bottom:20px}
        .hp-faq{border:1px solid rgba(255,255,255,0.07);border-radius:10px;margin-bottom:8px;overflow:hidden;transition:border-color .2s}
        .hp-faq.open{border-color:rgba(240,185,11,0.25)}
        .hp-faq-q{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;cursor:pointer;gap:12px}
        .hp-faq-q-text{font-size:14px;font-weight:700;color:#fff;flex:1}
        .hp-faq-cat{font-size:10px;font-weight:700;color:#F0B90B;background:rgba(240,185,11,0.1);padding:2px 8px;border-radius:999px;flex-shrink:0}
        .hp-faq-arrow{font-size:14px;color:rgba(255,255,255,0.3);transition:transform .2s;flex-shrink:0}
        .hp-faq.open .hp-faq-arrow{transform:rotate(180deg);color:#F0B90B}
        .hp-faq-a{padding:0 20px 16px;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.8;border-top:1px solid rgba(255,255,255,0.06);padding-top:14px}
        .hp-no-results{text-align:center;padding:48px 20px;font-size:14px;color:rgba(255,255,255,0.35)}
        .hp-contact{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:32px;text-align:center;margin-top:40px}
        .hp-contact-title{font-size:16px;font-weight:800;color:#fff;margin-bottom:8px}
        .hp-contact-sub{font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:20px;line-height:1.6}
        .hp-contact-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .hp-contact-btn{padding:11px 24px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;transition:all .15s}
        .hp-contact-btn.primary{background:#F0B90B;color:#000}
        .hp-contact-btn.primary:hover{background:#FFD000}
        .hp-contact-btn.ghost{background:transparent;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.15)}
        .hp-contact-btn.ghost:hover{border-color:rgba(255,255,255,0.35);color:#fff}
        @media(max-width:480px){.hp-faq-cat{display:none}}
      `}</style>
      <div className="hp">
        <div className="hp-hero">
          <div className="hp-tag">Help Center</div>
          <h1 className="hp-h1">How can we help you?</h1>
          <div className="hp-search-wrap">
            <span className="hp-search-icon">🔍</span>
            <input className="hp-search" placeholder="Search help articles..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="hp-body">
          <div className="hp-cats">
            {CATS.map(c => <button key={c} className={`hp-cat${cat===c?" on":""}`} onClick={()=>setCat(c)}>{c}</button>)}
          </div>
          <div className="hp-count">{filtered.length} article{filtered.length !== 1 ? "s" : ""} found</div>
          {filtered.length === 0 ? (
            <div className="hp-no-results">No articles found. Try a different search term or category.</div>
          ) : (
            filtered.map((f, i) => (
              <div key={i} className={`hp-faq${open===i?" open":""}`}>
                <div className="hp-faq-q" onClick={()=>setOpen(open===i?null:i)}>
                  <div className="hp-faq-q-text">{f.q}</div>
                  <span className="hp-faq-cat">{f.cat}</span>
                  <span className="hp-faq-arrow">▼</span>
                </div>
                {open === i && <div className="hp-faq-a">{f.a}</div>}
              </div>
            ))
          )}
          <div className="hp-contact">
            <div className="hp-contact-title">Still need help?</div>
            <p className="hp-contact-sub">Our support team in Vilnius is available Monday to Friday, 9am–6pm EET.</p>
            <div className="hp-contact-btns">
              <Link href="/contact" className="hp-contact-btn primary">Contact Support</Link>
              <Link href="/status"  className="hp-contact-btn ghost">Platform Status</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}