import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ASSET_TYPES = [
  { icon: "🏢", label: "Real Estate",   desc: "Commercial & residential" },
  { icon: "📄", label: "Bonds",         desc: "Corporate & government" },
  { icon: "📈", label: "Equity & IPO",  desc: "Private & public shares" },
  { icon: "⚡", label: "Energy",        desc: "Renewable energy projects" },
  { icon: "🏦", label: "Funds",         desc: "Alternative investment funds" },
  { icon: "💎", label: "Commodities",   desc: "Gold, silver & materials" },
];

const STEPS = [
  { n: "01", title: "Submit Asset",      desc: "Add valuation, ownership documents, financial data and issuance preferences." },
  { n: "02", title: "Compliance Review", desc: "Structure, eligibility rules, and documents are reviewed by our team." },
  { n: "03", title: "Token Issuance",    desc: "Digital issuance parameters are prepared and tokens minted on-chain." },
  { n: "04", title: "Investor Access",   desc: "Eligible investors can participate under defined transfer rules." },
  { n: "05", title: "Market Readiness",  desc: "Assets progress toward exchange and secondary market liquidity." },
];

const STATS = [
  { v: "€100",  l: "Minimum investment" },
  { v: "180+",  l: "Countries of investors" },
  { v: "48hr",  l: "Compliance review" },
  { v: "0.2%",  l: "Trading fee" },
];

const FAQS = [
  ["How long does tokenization take?",   "Initial review can begin after submission. Timing depends on documentation quality and structure complexity."],
  ["Who can invest in my asset?",        "This depends on the investor eligibility rules selected for the offering and applicable jurisdiction requirements."],
  ["What token standard is used?",       "We support ERC-3643, ERC-1400, and ERC-20 as selectable structure options."],
  ["Can tokens trade after issuance?",   "Where structure and review permit, assets can progress toward secondary market workflows."],
  ["What documents are required?",       "Valuation report, legal ownership proof, financial statements, and insurance documents."],
];

export default function TokenizePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    assetName: "", assetType: "Commercial Real Estate",
    totalValue: "", tokenSupply: "", tokenPrice: "",
    expectedReturn: "", minInvestment: "", deadline: "",
    description: "", tokenStandard: "ERC-3643",
    eligibility: "EU Verified Investors",
  });
  const [submitted, setSubmitted] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit  = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <>
      <Head>
        <title>Tokenize Real-World Assets — Nextoken Capital</title>
        <meta name="description" content="Launch compliant digital offerings for real estate, bonds, equity and funds in 48 hours." />
      </Head>
      <Navbar />

      <style>{`
        .tz-page { min-height:100vh; background:#0B0E11; padding-top:64px; }

        /* HERO */
        .tz-hero { padding:64px 20px 52px; text-align:center; position:relative; overflow:hidden; background:linear-gradient(180deg,#060d10 0%,#0B0E11 100%); }
        .tz-hero-glow { position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 65% 55% at 50% 40%, rgba(0,200,180,0.07), transparent); }
        .tz-badge { display:inline-flex; align-items:center; gap:8px; padding:7px 18px; border-radius:999px; border:1px solid rgba(0,200,180,0.3); background:rgba(0,200,180,0.06); color:#00C8B4; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:24px; }
        .tz-badge-dot { width:6px; height:6px; border-radius:50%; background:#00C8B4; animation:tz-pulse 2s ease-in-out infinite; }
        @keyframes tz-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .tz-hero h1 { font-size:clamp(2rem,5vw,3.8rem); font-weight:900; line-height:1.06; letter-spacing:-1.5px; margin:0 0 20px; max-width:760px; margin-left:auto; margin-right:auto; color:#fff; }
        .tz-hero h1 em { color:#00C8B4; font-style:normal; }
        .tz-hero p { font-size:clamp(1rem,1.8vw,1.1rem); color:rgba(255,255,255,0.5); line-height:1.8; max-width:500px; margin:0 auto 36px; }
        .tz-hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; width:100%; max-width:400px; margin:0 auto; }
        .btn-teal { flex:1; min-width:160px; padding:14px 24px; border-radius:8px; background:#00C8B4; color:#000; font-size:14px; font-weight:800; border:none; cursor:pointer; text-decoration:none; text-align:center; transition:background .15s; font-family:inherit; }
        .btn-teal:hover { background:#00e0ca; }
        .btn-teal-outline { flex:1; min-width:160px; padding:14px 24px; border-radius:8px; background:transparent; color:rgba(255,255,255,0.8); font-size:14px; font-weight:700; border:1px solid rgba(0,200,180,0.3); cursor:pointer; text-decoration:none; text-align:center; transition:all .15s; font-family:inherit; }
        .btn-teal-outline:hover { border-color:rgba(0,200,180,0.7); color:#00C8B4; }

        /* STATS */
        .tz-stats { background:#0A1012; border-top:1px solid rgba(0,200,180,0.1); border-bottom:1px solid rgba(0,200,180,0.1); padding:32px 20px; }
        .tz-stats-inner { max-width:1280px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:20px; text-align:center; }
        .tz-stat-v { font-size:clamp(1.4rem,2.5vw,2rem); font-weight:900; color:#00C8B4; line-height:1; margin-bottom:6px; }
        .tz-stat-l { font-size:12px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:1px; }

        /* SECTIONS */
        .tz-section     { padding:64px 20px; }
        .tz-section-alt { padding:64px 20px; background:#0A1012; }
        .tz-inner   { max-width:1280px; margin:0 auto; }
        .tz-tag   { font-size:11px; font-weight:700; color:#00C8B4; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; }
        .tz-title { font-size:clamp(1.5rem,2.8vw,2.2rem); font-weight:900; color:#fff; margin-bottom:10px; letter-spacing:-.5px; }
        .tz-sub   { font-size:13px; color:rgba(255,255,255,0.4); max-width:480px; line-height:1.7; margin-bottom:40px; }

        /* WARNINGS */
        .tz-warn-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .tz-warn-card { border-radius:12px; padding:24px; }
        .tz-warn-title { font-size:14px; font-weight:800; margin-bottom:12px; }
        .tz-warn-item { font-size:13px; color:rgba(255,255,255,0.5); line-height:1.8; padding-left:14px; position:relative; margin-bottom:6px; }
        .tz-warn-item::before { content:"•"; position:absolute; left:0; }

        /* ASSET TYPES */
        .tz-assets-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:12px; }
        .tz-asset-card { background:#0F1318; border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:18px 12px; text-align:center; transition:all .2s; }
        .tz-asset-card:hover { border-color:rgba(0,200,180,0.3); background:rgba(0,200,180,0.04); transform:translateY(-2px); }
        .tz-asset-icon  { font-size:24px; margin-bottom:8px; }
        .tz-asset-label { font-size:12px; font-weight:700; color:#fff; margin-bottom:3px; }
        .tz-asset-desc  { font-size:10px; color:rgba(255,255,255,0.35); line-height:1.4; }

        /* STEPS */
        .tz-steps-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; }
        .tz-step-card { background:#0F1318; border:1px solid rgba(255,255,255,0.07); border-top:2px solid #00C8B4; border-radius:0 0 12px 12px; padding:22px 16px; }
        .tz-step-n { font-size:1.8rem; font-weight:900; color:rgba(0,200,180,0.25); line-height:1; margin-bottom:12px; }
        .tz-step-t { font-size:13px; font-weight:800; color:#fff; margin-bottom:7px; }
        .tz-step-d { font-size:12px; color:rgba(255,255,255,0.4); line-height:1.7; }

        /* FORM */
        .tz-form-layout { display:grid; grid-template-columns:1.3fr 0.7fr; gap:24px; align-items:start; }
        .tz-form-card { background:#0F1318; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:32px; }
        .tz-form-title { font-size:18px; font-weight:800; color:#fff; margin-bottom:6px; }
        .tz-form-sub   { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:28px; line-height:1.6; }
        .tz-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .tz-field { margin-bottom:16px; }
        .tz-field label { display:block; font-size:11px; font-weight:700; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:.5px; margin-bottom:7px; }
        .tz-field input, .tz-field select, .tz-field textarea {
          width:100%; background:#161B22; color:#fff;
          border:1px solid rgba(255,255,255,0.1); border-radius:8px;
          padding:11px 14px; font-size:13px; outline:none;
          font-family:inherit; transition:border-color .15s;
        }
        .tz-field input:focus, .tz-field select:focus, .tz-field textarea:focus { border-color:rgba(0,200,180,0.5); }
        .tz-field select option { background:#161B22; }
        .tz-field textarea { resize:vertical; }
        .tz-submit { width:100%; padding:14px; background:#00C8B4; color:#000; font-size:14px; font-weight:800; border:none; border-radius:8px; cursor:pointer; font-family:inherit; transition:background .15s; margin-top:6px; }
        .tz-submit:hover { background:#00e0ca; }

        /* SUMMARY */
        .tz-summary { background:#161B22; border:1px solid rgba(0,200,180,0.15); border-radius:16px; padding:22px; position:sticky; top:84px; }
        .tz-summary-title { font-size:14px; font-weight:800; color:#fff; margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.07); }
        .tz-summary-row { display:flex; justify-content:space-between; gap:10px; margin-bottom:11px; }
        .tz-summary-row span:first-child { font-size:12px; color:rgba(255,255,255,0.4); }
        .tz-summary-row span:last-child  { font-size:12px; color:#fff; font-weight:600; text-align:right; }
        .tz-summary-div { height:1px; background:rgba(255,255,255,0.07); margin:14px 0; }
        .tz-summary-why { font-size:10px; font-weight:700; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; }
        .tz-summary-bullet { font-size:12px; color:rgba(255,255,255,0.4); margin-bottom:7px; display:flex; align-items:flex-start; gap:6px; }
        .tz-summary-bullet::before { content:"→"; color:#00C8B4; flex-shrink:0; }

        /* SUCCESS */
        .tz-success { text-align:center; padding:48px 20px; }
        .tz-success-icon  { font-size:52px; margin-bottom:16px; }
        .tz-success-title { font-size:20px; font-weight:800; color:#00C8B4; margin-bottom:8px; }
        .tz-success-sub   { font-size:14px; color:rgba(255,255,255,0.45); line-height:1.7; }

        /* FAQ */
        .tz-faq-item { border-bottom:1px solid rgba(255,255,255,0.07); padding:16px 0; }
        .tz-faq-q { font-size:14px; font-weight:700; color:#fff; margin-bottom:7px; }
        .tz-faq-a { font-size:13px; color:rgba(255,255,255,0.43); line-height:1.7; }

        /* CTA */
        .tz-cta { background:#00C8B4; padding:64px 20px; text-align:center; }
        .tz-cta h2 { font-size:clamp(1.6rem,3.5vw,2.6rem); font-weight:900; color:#000; margin:0 0 12px; letter-spacing:-1px; }
        .tz-cta p  { font-size:14px; color:rgba(0,0,0,0.55); margin:0 auto 28px; max-width:420px; line-height:1.7; }
        .tz-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .tz-cta-dark  { padding:13px 32px; background:#000; color:#fff; border:none; border-radius:8px; font-size:14px; font-weight:800; cursor:pointer; text-decoration:none; transition:background .15s; font-family:inherit; }
        .tz-cta-dark:hover { background:#1a1a1a; }
        .tz-cta-ghost { padding:13px 32px; background:transparent; color:rgba(0,0,0,0.65); border:1.5px solid rgba(0,0,0,0.22); border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; text-decoration:none; transition:all .15s; font-family:inherit; }
        .tz-cta-ghost:hover { border-color:rgba(0,0,0,0.5); color:#000; }

        /* RISK */
        .tz-risk { background:#0B0E11; padding:24px 20px; border-top:1px solid rgba(255,255,255,0.05); }
        .tz-risk p { max-width:1280px; margin:0 auto; font-size:11px; color:rgba(255,255,255,0.2); line-height:1.8; }

        /* RESPONSIVE */
        @media(max-width:1100px){ .tz-assets-grid{ grid-template-columns:repeat(3,1fr); } .tz-steps-grid{ grid-template-columns:repeat(3,1fr); } }
        @media(max-width:900px){ .tz-stats-inner{ grid-template-columns:repeat(2,1fr); } .tz-assets-grid{ grid-template-columns:repeat(2,1fr); } .tz-steps-grid{ grid-template-columns:repeat(2,1fr); } .tz-form-layout{ grid-template-columns:1fr; } .tz-summary{ position:static; } .tz-warn-grid{ grid-template-columns:1fr; } .tz-row{ grid-template-columns:1fr; } }
        @media(max-width:540px){ .tz-hero{ padding:80px 16px 44px; } .tz-hero-btns{ flex-direction:column; max-width:100%; } .btn-teal,.btn-teal-outline{ min-width:unset; width:100%; } .tz-assets-grid{ grid-template-columns:repeat(2,1fr); } .tz-steps-grid{ grid-template-columns:1fr; } .tz-section,.tz-section-alt{ padding:48px 16px; } .tz-form-card{ padding:20px; } .tz-cta-btns{ flex-direction:column; align-items:center; } .tz-cta-dark,.tz-cta-ghost{ width:100%; max-width:320px; text-align:center; } }
      `}</style>

      <div className="tz-page">

        {/* HERO */}
        <section className="tz-hero">
          <div className="tz-hero-glow" />
          <div className="tz-badge"><span className="tz-badge-dot" /> Issuer Portal</div>
          <h1>Tokenize Real-World Assets<br /><em>in 48 Hours</em></h1>
          <p>Launch compliant digital offerings for real estate, infrastructure, private equity, funds and bonds — structured for modern capital access.</p>
          <div className="tz-hero-btns">
            <a href="#issuance-form" className="btn-teal">Start Issuance</a>
            <Link href="/markets" className="btn-teal-outline">Explore Markets</Link>
          </div>
        </section>

        {/* STATS */}
        <div className="tz-stats">
          <div className="tz-stats-inner">
            {STATS.map(s => (
              <div key={s.l}><div className="tz-stat-v">{s.v}</div><div className="tz-stat-l">{s.l}</div></div>
            ))}
          </div>
        </div>

        {/* WARNINGS */}
        <section className="tz-section">
          <div className="tz-inner">
            <div className="tz-warn-grid">
              <div className="tz-warn-card" style={{ background:"rgba(240,185,11,0.05)", border:"1px solid rgba(240,185,11,0.2)" }}>
                <div className="tz-warn-title" style={{ color:"#F0B90B" }}>⚠️ Safety Warning</div>
                <div className="tz-warn-item">Nextoken Capital will <strong>never</strong> ask for your Private Key or Seed Phrase.</div>
                <div className="tz-warn-item">Always verify the URL is <strong>nextokencapital.com</strong> before connecting.</div>
                <div className="tz-warn-item">Blockchain transactions are irreversible — verify all wallet addresses carefully.</div>
              </div>
              <div className="tz-warn-card" style={{ background:"rgba(14,203,129,0.05)", border:"1px solid rgba(14,203,129,0.2)" }}>
                <div className="tz-warn-title" style={{ color:"#0ECB81" }}>🔐 Wallet Backup Guide</div>
                <div className="tz-warn-item">Write down your 12 or 24-word recovery phrase on physical paper.</div>
                <div className="tz-warn-item">Store backups in a secure, fireproof location.</div>
                <div className="tz-warn-item">If you lose your recovery phrase, your assets cannot be recovered.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ASSET TYPES */}
        <section className="tz-section-alt">
          <div className="tz-inner">
            <div className="tz-tag">Asset Classes</div>
            <h2 className="tz-title">What You Can Tokenize</h2>
            <p className="tz-sub">Any asset with legal title can be tokenized on our platform.</p>
            <div className="tz-assets-grid">
              {ASSET_TYPES.map(a => (
                <div key={a.label} className="tz-asset-card">
                  <div className="tz-asset-icon">{a.icon}</div>
                  <div className="tz-asset-label">{a.label}</div>
                  <div className="tz-asset-desc">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="tz-section">
          <div className="tz-inner">
            <div className="tz-tag">Workflow</div>
            <h2 className="tz-title">How Tokenization Works</h2>
            <p className="tz-sub">From asset submission to live secondary market trading in 5 steps.</p>
            <div className="tz-steps-grid">
              {STEPS.map(s => (
                <div key={s.n} className="tz-step-card">
                  <div className="tz-step-n">{s.n}</div>
                  <div className="tz-step-t">{s.title}</div>
                  <div className="tz-step-d">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className="tz-section-alt" id="issuance-form">
          <div className="tz-inner">
            <div className="tz-tag">Issuer Intake</div>
            <h2 className="tz-title">Start Your Issuance</h2>
            <p className="tz-sub">Complete the intake form and submit your asset for internal compliance review.</p>
            <div className="tz-form-layout">
              <div className="tz-form-card">
                {submitted ? (
                  <div className="tz-success">
                    <div className="tz-success-icon">✅</div>
                    <div className="tz-success-title">Submission Received!</div>
                    <div className="tz-success-sub">Our compliance team will review your asset and contact you within 48 hours.</div>
                  </div>
                ) : (
                  <form onSubmit={submit}>
                    <div className="tz-form-title">Asset Details</div>
                    <p className="tz-form-sub">Fill in your asset information to begin the tokenization process.</p>
                    <div className="tz-row">
                      <div className="tz-field">
                        <label>Asset Name</label>
                        <input name="assetName" value={form.assetName} onChange={handle} placeholder="Baltic Office Tower" required />
                      </div>
                      <div className="tz-field">
                        <label>Asset Type</label>
                        <select name="assetType" value={form.assetType} onChange={handle}>
                          {["Commercial Real Estate","Residential Real Estate","Private Equity","Infrastructure","Commodity","Fund","Bond","Other"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="tz-field">
                        <label>Total Asset Value</label>
                        <input name="totalValue" value={form.totalValue} onChange={handle} placeholder="€5,000,000" required />
                      </div>
                      <div className="tz-field">
                        <label>Token Supply</label>
                        <input name="tokenSupply" value={form.tokenSupply} onChange={handle} placeholder="500,000" required />
                      </div>
                      <div className="tz-field">
                        <label>Token Price</label>
                        <input name="tokenPrice" value={form.tokenPrice} onChange={handle} placeholder="€10" required />
                      </div>
                      <div className="tz-field">
                        <label>Expected Return</label>
                        <input name="expectedReturn" value={form.expectedReturn} onChange={handle} placeholder="8% annual" />
                      </div>
                      <div className="tz-field">
                        <label>Minimum Investment</label>
                        <input name="minInvestment" value={form.minInvestment} onChange={handle} placeholder="€500" />
                      </div>
                      <div className="tz-field">
                        <label>Fundraising Deadline</label>
                        <input name="deadline" type="date" value={form.deadline} onChange={handle} />
                      </div>
                    </div>
                    <div className="tz-field">
                      <label>Asset Description</label>
                      <textarea name="description" value={form.description} onChange={handle} rows={4} placeholder="Describe the asset, income model, structure and investor proposition." required />
                    </div>
                    <div className="tz-row">
                      <div className="tz-field">
                        <label>Token Standard</label>
                        <select name="tokenStandard" value={form.tokenStandard} onChange={handle}>
                          {["ERC-3643","ERC-1400","ERC-20"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="tz-field">
                        <label>Investor Eligibility</label>
                        <select name="eligibility" value={form.eligibility} onChange={handle}>
                          {["EU Verified Investors","Accredited Investors","Retail + Verified","Private Placement Only"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="tz-submit">Submit for Review →</button>
                  </form>
                )}
              </div>

              <div className="tz-summary">
                <div className="tz-summary-title">Issuance Summary</div>
                {[["Asset Type",form.assetType],["Token Standard",form.tokenStandard],["Eligibility",form.eligibility],["Token Supply",form.tokenSupply||"—"],["Token Price",form.tokenPrice||"—"],["Min. Investment",form.minInvestment||"—"]].map(([k,v]) => (
                  <div key={k} className="tz-summary-row"><span>{k}</span><span>{v}</span></div>
                ))}
                <div className="tz-summary-div" />
                <div className="tz-summary-why">Why this works</div>
                {["Structured issuer intake","Clear eligibility setup","Document-driven review","Secondary market readiness"].map(b => (
                  <div key={b} className="tz-summary-bullet">{b}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="tz-section">
          <div className="tz-inner" style={{ maxWidth:860 }}>
            <div className="tz-tag">FAQ</div>
            <h2 className="tz-title">Common Questions</h2>
            {FAQS.map(([q,a]) => (
              <div key={q} className="tz-faq-item">
                <div className="tz-faq-q">{q}</div>
                <div className="tz-faq-a">{a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="tz-cta">
          <h2>Ready to Structure Your Asset?</h2>
          <p>Start your issuer intake, define your token structure, and prepare for digital capital formation.</p>
          <div className="tz-cta-btns">
            <a href="#issuance-form" className="tz-cta-dark">Start Issuance</a>
            <Link href="/markets" className="tz-cta-ghost">Explore Markets</Link>
          </div>
        </section>

        <div className="tz-risk">
          <p>Risk notice: Digital offerings, tokenized assets and real-world asset investments may involve regulatory, market, custody, technology and liquidity risks. Issuer eligibility, investor access and secondary market availability depend on jurisdiction, structure and internal review outcomes.</p>
        </div>

      </div>
      <Footer />
    </>
  );
}