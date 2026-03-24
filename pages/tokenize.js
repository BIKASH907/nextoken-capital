// pages/tokenize.js
// Color scheme fixed to match platform: gold #F0B90B, background #0B0E11
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ASSET_TYPES = [
  { id:"real-estate", icon:"🏢", label:"Real Estate",      desc:"Commercial, residential, or industrial property" },
  { id:"bonds",       icon:"📄", label:"Corporate Bond",   desc:"Company debt instrument with fixed coupon" },
  { id:"equity",      icon:"📈", label:"Company Equity",   desc:"Shares in a private or public company" },
  { id:"energy",      icon:"⚡", label:"Energy Project",   desc:"Solar, wind, or other renewable energy assets" },
  { id:"fund",        icon:"🏦", label:"Fund",             desc:"Pooled investment vehicle or ETF structure" },
  { id:"other",       icon:"💎", label:"Other Asset",      desc:"Commodities, infrastructure, or other assets" },
];

const STEPS = [
  { n:"01", title:"Submit Application",  desc:"Complete our online form with asset details, valuation, and legal structure." },
  { n:"02", title:"Compliance Review",   desc:"Our team reviews your asset for MiCA, AML, and regulatory compliance." },
  { n:"03", title:"Legal Structuring",   desc:"We structure the token as an ERC-3643 security token with full transfer controls." },
  { n:"04", title:"Token Issuance",      desc:"Tokens are minted and listed on the Nextoken Capital platform for investors." },
  { n:"05", title:"Live on Platform",    desc:"Your asset is live on the marketplace. Traders can browse, invest, and trade on the exchange." },
];

const FAQS = [
  { q:"What types of assets can be tokenized?", a:"We support real estate, corporate bonds, company equity, renewable energy projects, funds, and other real-world assets with a clear legal ownership structure and verifiable valuation." },
  { q:"What is the minimum asset value?", a:"We currently accept assets with a minimum valuation of EUR 500,000. For smaller assets, we recommend our pooled fund structure." },
  { q:"How long does the process take?", a:"The full tokenization process typically takes 6–12 weeks from application submission to going live on the platform, depending on asset complexity and jurisdiction." },
  { q:"What are the fees?", a:"We charge a one-time structuring fee of 1.5–3% of asset value plus annual platform fees of 0.5%. A full fee schedule is provided during the compliance review stage." },
  { q:"Do I need to be in the EU?", a:"No. We accept asset issuers from 70+ jurisdictions. The asset itself must comply with EU law if it is to be offered to EU investors." },
  { q:"What happens after tokenization?", a:"Your asset appears on the Nextoken platform where verified investors can invest. You retain asset management control while investors hold digital ownership tokens." },
];

export default function TokenizePage() {
  const [assetType, setAssetType] = useState("");
  const [form, setForm] = useState({ name:"", email:"", company:"", country:"", assetValue:"", assetDesc:"" });
  const [submitted, setSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Tokenize Your Asset — Nextoken Capital</title>
        <meta name="description" content="Tokenize your real-world asset on the Nextoken Capital regulated platform. Real estate, bonds, equity, energy and more." />
      </Head>
      <Navbar />

      <style>{`
        .tz{min-height:100vh;background:#0B0E11;padding-top:64px}

        /* HERO */
        .tz-hero{padding:60px 20px 48px;position:relative;overflow:hidden;text-align:center}
        .tz-hero-glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 60% 50% at 50% 40%,rgba(240,185,11,0.07),transparent)}
        .tz-hero-tag{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px}
        .tz-hero h1{font-size:clamp(1.8rem,4vw,3rem);font-weight:900;color:#fff;letter-spacing:-1px;margin-bottom:12px}
        .tz-hero h1 em{color:#F0B90B;font-style:normal}
        .tz-hero p{font-size:14px;color:rgba(255,255,255,0.45);max-width:540px;margin:0 auto 32px;line-height:1.7}
        .tz-hero-badges{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .tz-hero-badge{padding:7px 16px;border-radius:999px;font-size:12px;font-weight:600;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6)}

        /* STEPS */
        .tz-steps{background:#0F1318;border-top:1px solid rgba(255,255,255,0.07);border-bottom:1px solid rgba(255,255,255,0.07);padding:40px 20px}
        .tz-steps-in{max-width:1280px;margin:0 auto}
        .tz-steps-title{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;text-align:center;margin-bottom:8px}
        .tz-steps-h{font-size:clamp(1.3rem,2.5vw,1.8rem);font-weight:900;color:#fff;text-align:center;margin-bottom:32px}
        .tz-steps-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;position:relative}
        .tz-step{text-align:center;padding:20px 16px;background:#161B22;border:1px solid rgba(255,255,255,0.07);border-radius:12px;position:relative}
        .tz-step-n{font-size:2rem;font-weight:900;color:rgba(240,185,11,0.2);line-height:1;margin-bottom:10px}
        .tz-step-title{font-size:13px;font-weight:800;color:#fff;margin-bottom:6px}
        .tz-step-desc{font-size:11px;color:rgba(255,255,255,0.4);line-height:1.6}

        /* BODY */
        .tz-body{max-width:1100px;margin:0 auto;padding:56px 20px 72px;display:grid;grid-template-columns:1fr 380px;gap:40px;align-items:start}

        /* LEFT — asset types + FAQ */
        .tz-section-tag{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
        .tz-section-title{font-size:clamp(1.3rem,2.5vw,1.8rem);font-weight:900;color:#fff;margin-bottom:8px;letter-spacing:-.5px}
        .tz-section-sub{font-size:13px;color:rgba(255,255,255,0.4);line-height:1.7;margin-bottom:28px}

        .tz-asset-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:48px}
        .tz-asset-card{background:#0F1318;border:2px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px;cursor:pointer;transition:all .2s;text-align:center}
        .tz-asset-card:hover{border-color:rgba(240,185,11,0.3);background:rgba(240,185,11,0.03)}
        .tz-asset-card.selected{border-color:#F0B90B;background:rgba(240,185,11,0.06)}
        .tz-asset-ico{font-size:28px;margin-bottom:10px}
        .tz-asset-label{font-size:13px;font-weight:700;color:#fff;margin-bottom:4px}
        .tz-asset-desc{font-size:11px;color:rgba(255,255,255,0.38);line-height:1.5}

        /* FAQ */
        .tz-faq-item{border:1px solid rgba(255,255,255,0.07);border-radius:10px;margin-bottom:8px;overflow:hidden;transition:border-color .2s}
        .tz-faq-item.open{border-color:rgba(240,185,11,0.25)}
        .tz-faq-q{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;cursor:pointer;gap:12px}
        .tz-faq-q-text{font-size:14px;font-weight:700;color:#fff;flex:1}
        .tz-faq-arrow{font-size:13px;color:rgba(255,255,255,0.3);transition:transform .2s}
        .tz-faq-item.open .tz-faq-arrow{transform:rotate(180deg);color:#F0B90B}
        .tz-faq-a{padding:0 18px 15px;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.8;border-top:1px solid rgba(255,255,255,0.06);padding-top:13px}

        /* RIGHT — sticky form */
        .tz-form-card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;position:sticky;top:84px}
        .tz-form-title{font-size:17px;font-weight:800;color:#fff;margin-bottom:4px}
        .tz-form-sub{font-size:13px;color:rgba(255,255,255,0.38);margin-bottom:22px;line-height:1.6}
        .tz-field{margin-bottom:14px}
        .tz-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .tz-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:11px 14px;font-size:13px;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .tz-input:focus{border-color:rgba(240,185,11,0.5)}
        .tz-input option{background:#161B22}
        .tz-submit{width:100%;padding:13px;background:#F0B90B;color:#000;font-size:14px;font-weight:800;border:none;border-radius:8px;cursor:pointer;font-family:inherit;transition:background .15s;margin-top:4px}
        .tz-submit:hover{background:#FFD000}
        .tz-form-note{font-size:11px;color:rgba(255,255,255,0.25);text-align:center;margin-top:12px;line-height:1.6}
        .tz-success{text-align:center;padding:20px 0}
        .tz-success-ico{font-size:48px;margin-bottom:14px}
        .tz-success-title{font-size:17px;font-weight:800;color:#0ECB81;margin-bottom:8px}
        .tz-success-sub{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7}

        /* WHY */
        .tz-why{background:#0F1318;border-top:1px solid rgba(255,255,255,0.07);padding:56px 20px}
        .tz-why-in{max-width:1100px;margin:0 auto}
        .tz-why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:32px}
        .tz-why-card{background:#161B22;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:22px}
        .tz-why-ico{font-size:26px;margin-bottom:10px}
        .tz-why-title{font-size:14px;font-weight:800;color:#fff;margin-bottom:7px}
        .tz-why-desc{font-size:12px;color:rgba(255,255,255,0.42);line-height:1.7}

        /* CTA */
        .tz-cta{background:#F0B90B;padding:56px 20px;text-align:center}
        .tz-cta h2{font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;color:#000;margin-bottom:10px}
        .tz-cta p{font-size:14px;color:rgba(0,0,0,0.58);margin-bottom:24px}
        .tz-cta-btn{display:inline-block;padding:13px 32px;background:#000;color:#fff;border-radius:8px;font-size:14px;font-weight:800;text-decoration:none}

        @media(max-width:1024px){.tz-body{grid-template-columns:1fr}.tz-form-card{position:static}.tz-steps-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:768px){.tz-asset-grid{grid-template-columns:repeat(2,1fr)}.tz-why-grid{grid-template-columns:1fr 1fr}.tz-steps-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.tz-asset-grid{grid-template-columns:1fr 1fr}.tz-why-grid{grid-template-columns:1fr}.tz-steps-grid{grid-template-columns:1fr}}
      `}</style>

      <div className="tz">
        {/* HERO */}
        <section className="tz-hero">
          <div className="tz-hero-glow" />
          <div className="tz-hero-tag">Asset Tokenization</div>
          <h1>Tokenize Your <em>Real-World Asset</em></h1>
          <p>Turn illiquid real-world assets into tradable digital tokens and list them on our marketplace for 1,000+ verified traders across 180+ countries.</p>
          <div className="tz-hero-badges">
            {["🏛️ Bank of Lithuania Licensed","⚖️ MiCA Compliant","🔗 ERC-3643 Standard","🌍 180+ Countries","⏱️ 6–12 Week Process"].map(b => (
              <span key={b} className="tz-hero-badge">{b}</span>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className="tz-steps">
          <div className="tz-steps-in">
            <div className="tz-steps-title">Tokenization Process</div>
            <h2 className="tz-steps-h">From Asset to Token in 5 Steps</h2>
            <div className="tz-steps-grid">
              {STEPS.map(s => (
                <div key={s.n} className="tz-step">
                  <div className="tz-step-n">{s.n}</div>
                  <div className="tz-step-title">{s.title}</div>
                  <div className="tz-step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN BODY */}
        <div className="tz-body">
          <div>
            {/* ASSET TYPES */}
            <div className="tz-section-tag">Asset Classes</div>
            <h2 className="tz-section-title">What Can Be Tokenized?</h2>
            <p className="tz-section-sub">Select the type of asset you want to tokenize. We support all major real-world asset classes.</p>
            <div className="tz-asset-grid">
              {ASSET_TYPES.map(a => (
                <div
                  key={a.id}
                  className={`tz-asset-card ${assetType === a.id ? "selected" : ""}`}
                  onClick={() => setAssetType(a.id)}
                >
                  <div className="tz-asset-ico">{a.icon}</div>
                  <div className="tz-asset-label">{a.label}</div>
                  <div className="tz-asset-desc">{a.desc}</div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div className="tz-section-tag">FAQ</div>
            <h2 className="tz-section-title">Common Questions</h2>
            <p className="tz-section-sub" style={{ marginBottom:20 }}>Everything you need to know about tokenizing an asset.</p>
            {FAQS.map((f, i) => (
              <div key={i} className={`tz-faq-item ${faqOpen === i ? "open" : ""}`}>
                <div className="tz-faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <div className="tz-faq-q-text">{f.q}</div>
                  <span className="tz-faq-arrow">▼</span>
                </div>
                {faqOpen === i && <div className="tz-faq-a">{f.a}</div>}
              </div>
            ))}
          </div>

          {/* STICKY FORM */}
          <div className="tz-form-card">
            {submitted ? (
              <div className="tz-success">
                <div className="tz-success-ico">✅</div>
                <div className="tz-success-title">Application Received!</div>
                <p className="tz-success-sub">
                  Thank you! Our team will review your application and contact you within 2 business days.
                </p>
              </div>
            ) : (
              <>
                <div className="tz-form-title">Apply to Tokenize</div>
                <p className="tz-form-sub">Submit your application and our compliance team will get back to you within 2 business days.</p>
                <form onSubmit={submit}>
                  <div className="tz-field">
                    <label className="tz-label">Full Name</label>
                    <input className="tz-input" name="name" value={form.name} onChange={handle} placeholder="Bikash Bhat" required />
                  </div>
                  <div className="tz-field">
                    <label className="tz-label">Email</label>
                    <input className="tz-input" name="email" type="email" value={form.email} onChange={handle} placeholder="you@company.com" required />
                  </div>
                  <div className="tz-field">
                    <label className="tz-label">Company / Organisation</label>
                    <input className="tz-input" name="company" value={form.company} onChange={handle} placeholder="Company name" />
                  </div>
                  <div className="tz-field">
                    <label className="tz-label">Asset Type</label>
                    <select className="tz-input" name="assetType" value={assetType} onChange={e => setAssetType(e.target.value)} required>
                      <option value="">Select asset type...</option>
                      {ASSET_TYPES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                    </select>
                  </div>
                  <div className="tz-field">
                    <label className="tz-label">Estimated Asset Value (EUR)</label>
                    <input className="tz-input" name="assetValue" type="number" min="500000" value={form.assetValue} onChange={handle} placeholder="e.g. 2000000" required />
                  </div>
                  <div className="tz-field">
                    <label className="tz-label">Brief Asset Description</label>
                    <textarea className="tz-input" name="assetDesc" value={form.assetDesc} onChange={handle} rows={3} placeholder="Describe your asset..." style={{ resize:"vertical" }} required />
                  </div>
                  <button type="submit" className="tz-submit">Submit Application →</button>
                </form>
                <p className="tz-form-note">
                  By submitting you agree to our <Link href="/terms" style={{ color:"#F0B90B" }}>Terms</Link> and <Link href="/privacy" style={{ color:"#F0B90B" }}>Privacy Policy</Link>.
                </p>
              </>
            )}
          </div>
        </div>

        {/* WHY */}
        <section className="tz-why">
          <div className="tz-why-in">
            <div style={{ fontSize:11,fontWeight:700,color:"#F0B90B",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10 }}>Why Nextoken Capital?</div>
            <h2 style={{ fontSize:"clamp(1.4rem,2.5vw,2rem)",fontWeight:900,color:"#fff",marginBottom:10,letterSpacing:"-.5px" }}>The regulated choice for tokenization</h2>
            <p style={{ fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.8,maxWidth:520 }}>We are the only EU-regulated tokenization platform in Lithuania with active Bank of Lithuania EMI and MiCA CASP authorizations.</p>
            <div className="tz-why-grid">
              {[
                { ico:"⚖️", title:"Fully Regulated",        desc:"EMI and MiCA CASP licenses from the Bank of Lithuania — not a grey-market platform." },
                { ico:"🔗", title:"ERC-3643 Standard",      desc:"All tokens issued under ERC-3643 with full transfer controls and investor whitelisting." },
                { ico:"🌍", title:"1,000+ Investors",       desc:"Instant access to a verified investor base in 180+ countries from day one." },
                { ico:"🔐", title:"ISO 27001 Security",     desc:"Enterprise-grade infrastructure with full security certification." },
                { ico:"📊", title:"On-chain Transparency",  desc:"Real-time cap tables, on-chain settlement, and full audit trail for every transaction." },
                { ico:"💼", title:"End-to-end Service",     desc:"Legal structuring, token issuance, investor onboarding, and secondary market — all in one platform." },
              ].map(c => (
                <div key={c.title} className="tz-why-card">
                  <div className="tz-why-ico">{c.ico}</div>
                  <div className="tz-why-title">{c.title}</div>
                  <div className="tz-why-desc">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="tz-cta">
          <h2>Ready to tokenize your asset?</h2>
          <p>Submit your application today and our team will be in touch within 2 business days.</p>
          <Link href="#" className="tz-cta-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Apply Now →</Link>
        </section>
      </div>
      <Footer />
    </>
  );
}