import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TEAM = [
  { name:"Bikash Bhat",       role:"CEO & Founder",          bio:"Fintech entrepreneur with 10+ years in capital markets and blockchain infrastructure.", photo:"/bikash.jpg", linkedin:"https://www.linkedin.com/in/bikash-bhat-87700318a" },
  { name:"Compliance Team",   role:"Legal & Compliance",     bio:"EU-based regulatory specialists ensuring full MiCA and Bank of Lithuania compliance." },
  { name:"Engineering Team",  role:"Blockchain & Platform",  bio:"Full-stack engineers specialising in ERC-3643 asset token infrastructure." },
  { name:"Investment Team",   role:"Asset Origination",      bio:"Asset specialists sourcing and structuring real-world asset listings." },
];

const VALUES = [
  { icon:"⚖️", title:"Regulated First",   desc:"Every product decision starts with regulatory compliance. We hold EMI and CASP authorizations from the Bank of Lithuania." },
  { icon:"🔍", title:"Full Transparency",  desc:"On-chain ownership records, public cap tables, and real-time reporting for every asset on the platform." },
  { icon:"🌍", title:"Global Access",      desc:"Investors from 180+ countries can access institutional-grade assets from as little as EUR 100." },
  { icon:"🔐", title:"Security First",     desc:"Enterprise-grade security with Sumsub KYC and ERC-3643 transfer controls protect every transaction." },
];

const MILESTONES = [
  { year:"2022", event:"Nextoken Capital UAB founded in Vilnius, Lithuania." },
  { year:"2023", event:"Bank of Lithuania EMI license granted. First asset tokenized on platform." },
  { year:"2024", event:"MiCA CASP authorization received. Platform launched to public investors." },
  { year:"2025", event:"EUR 100M+ in assets tokenized. 10,000+ verified buyers onboarded." },
  { year:"2026", event:"Secondary market exchange launched. 180+ countries supported." },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us — Nextoken Capital</title>
        <meta name="description" content="Nextoken Capital is the regulated infrastructure for tokenized real-world assets, registered in Lithuania and monitored by the Bank of Lithuania." />
      </Head>
      <Navbar />

      <style>{`
        .ab-page { min-height:100vh; background:#0B0E11; padding-top:64px; }

        /* HERO */
        .ab-hero { padding:64px 20px 52px; position:relative; overflow:hidden; }
        .ab-hero-glow { position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 60% 50% at 50% 40%, rgba(240,185,11,0.06), transparent); }
        .ab-hero-inner { max-width:860px; margin:0 auto; text-align:center; position:relative; }
        .ab-hero-tag { font-size:11px; font-weight:700; color:#F0B90B; letter-spacing:2px; text-transform:uppercase; margin-bottom:12px; }
        .ab-hero h1 { font-size:clamp(2rem,5vw,3.8rem); font-weight:900; color:#fff; letter-spacing:-1.5px; margin-bottom:20px; line-height:1.06; }
        .ab-hero h1 em { color:#F0B90B; font-style:normal; }
        .ab-hero p { font-size:clamp(1rem,1.8vw,1.1rem); color:rgba(255,255,255,0.5); line-height:1.8; max-width:600px; margin:0 auto 36px; }
        .ab-hero-badges { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .ab-hero-badge { display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); font-size:12px; color:rgba(255,255,255,0.6); }

        /* STATS */
        .ab-stats { background:#0F1318; border-top:1px solid rgba(255,255,255,0.07); border-bottom:1px solid rgba(255,255,255,0.07); padding:36px 20px; }
        .ab-stats-inner { max-width:1280px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:20px; text-align:center; }
        .ab-stat-v { font-size:clamp(1.4rem,2.5vw,2rem); font-weight:900; color:#F0B90B; line-height:1; margin-bottom:6px; }
        .ab-stat-l { font-size:12px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:1px; }

        /* SECTIONS */
        .ab-section     { padding:64px 20px; }
        .ab-section-alt { padding:64px 20px; background:#0F1318; }
        .ab-inner   { max-width:1280px; margin:0 auto; }
        .ab-tag   { font-size:11px; font-weight:700; color:#F0B90B; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; }
        .ab-title { font-size:clamp(1.5rem,2.8vw,2.2rem); font-weight:900; color:#fff; margin-bottom:10px; letter-spacing:-.5px; }
        .ab-sub   { font-size:13px; color:rgba(255,255,255,0.4); max-width:520px; line-height:1.7; margin-bottom:40px; }

        /* MISSION */
        .ab-mission { max-width:800px; }
        .ab-mission p { font-size:15px; color:rgba(255,255,255,0.65); line-height:1.9; margin-bottom:18px; }
        .ab-mission strong { color:#fff; }

        /* VALUES */
        .ab-values-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
        .ab-value-card { background:#161B22; border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:26px; }
        .ab-value-icon  { font-size:26px; margin-bottom:12px; }
        .ab-value-title { font-size:15px; font-weight:800; color:#fff; margin-bottom:8px; }
        .ab-value-desc  { font-size:13px; color:rgba(255,255,255,0.43); line-height:1.7; }

        /* TIMELINE */
        .ab-timeline { max-width:680px; }
        .ab-timeline-item { display:flex; gap:24px; margin-bottom:28px; }
        .ab-timeline-left { display:flex; flex-direction:column; align-items:center; }
        .ab-timeline-year { font-size:13px; font-weight:800; color:#F0B90B; min-width:48px; text-align:center; }
        .ab-timeline-line { flex:1; width:1px; background:rgba(255,255,255,0.1); margin:8px 0; }
        .ab-timeline-dot { width:10px; height:10px; border-radius:50%; background:#F0B90B; flex-shrink:0; margin-top:4px; }
        .ab-timeline-event { font-size:13px; color:rgba(255,255,255,0.55); line-height:1.7; padding-top:2px; }

        /* TEAM */
        .ab-team-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
        .ab-team-card { background:#161B22; border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:24px 20px; text-align:center; }
        .ab-team-avatar { width:56px; height:56px; border-radius:50%; background:rgba(240,185,11,0.12); border:2px solid rgba(240,185,11,0.3); display:flex; align-items:center; justify-content:center; font-size:22px; margin:0 auto 14px; }
        .ab-team-name { font-size:14px; font-weight:800; color:#fff; margin-bottom:4px; }
        .ab-team-role { font-size:11px; color:#F0B90B; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:10px; }
        .ab-team-bio  { font-size:12px; color:rgba(255,255,255,0.4); line-height:1.6; }

        /* REGULATION */
        .ab-reg-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .ab-reg-card { background:#161B22; border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:22px; }
        .ab-reg-icon  { font-size:24px; margin-bottom:10px; }
        .ab-reg-title { font-size:13px; font-weight:800; color:#fff; margin-bottom:6px; }
        .ab-reg-desc  { font-size:12px; color:rgba(255,255,255,0.4); line-height:1.6; }
        .ab-reg-badge { display:inline-block; padding:3px 10px; border-radius:999px; font-size:10px; font-weight:700; background:rgba(14,203,129,0.1); color:#0ECB81; border:1px solid rgba(14,203,129,0.25); margin-top:10px; }

        /* CTA */
        .ab-cta { background:#F0B90B; padding:64px 20px; text-align:center; }
        .ab-cta h2 { font-size:clamp(1.6rem,3vw,2.4rem); font-weight:900; color:#000; margin-bottom:12px; }
        .ab-cta p  { font-size:14px; color:rgba(0,0,0,0.6); margin-bottom:28px; }
        .ab-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .ab-cta-dark  { padding:13px 28px; background:#000; color:#fff; border-radius:8px; font-size:14px; font-weight:800; text-decoration:none; }
        .ab-cta-ghost { padding:13px 28px; background:transparent; color:rgba(0,0,0,0.65); border:1.5px solid rgba(0,0,0,0.2); border-radius:8px; font-size:14px; font-weight:700; text-decoration:none; }

        @media(max-width:900px){ .ab-stats-inner{ grid-template-columns:repeat(2,1fr); } .ab-team-grid{ grid-template-columns:repeat(2,1fr); } .ab-reg-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:540px){ .ab-values-grid{ grid-template-columns:1fr; } .ab-team-grid{ grid-template-columns:1fr; } .ab-reg-grid{ grid-template-columns:1fr; } .ab-hero-badges{ flex-direction:column; align-items:center; } }
      `}</style>

      <div className="ab-page">

        <section className="ab-hero">
          <div className="ab-hero-glow" />
          <div className="ab-hero-inner">
            <div className="ab-hero-tag">About Us</div>
            <h1>The Regulated Marketplace for <em>Tokenized Assets</em></h1>
            <p>Nextoken Capital is the regulated marketplace for the next generation of tokenized assets — compliant, accessible, and on-chain.</p>
            <div className="ab-hero-badges">
              {["🏛️ Bank of Lithuania","📍 Vilnius, Lithuania","⚖️ MiCA Compliant","🔗 Founded 2022"].map(b => (
                <div key={b} className="ab-hero-badge">{b}</div>
              ))}
            </div>
          </div>
        </section>

        <div className="ab-stats">
          <div className="ab-stats-inner">
            {[["2022","Year Founded"],["Platform Live","Assets Available"],["Growing","Investor Community"],["180+","Countries Supported"]].map(([v,l]) => (
              <div key={l}><div className="ab-stat-v">{v}</div><div className="ab-stat-l">{l}</div></div>
            ))}
          </div>
        </div>

        <section className="ab-section">
          <div className="ab-inner">
            <div className="ab-tag">Our Mission</div>
            <h2 className="ab-title">Why We Built Nextoken Capital</h2>
            <div className="ab-mission">
              <p>Traditional capital markets are fragmented, slow, and inaccessible to most investors. <strong>Real estate deals require hundreds of thousands of euros.</strong> Private equity is reserved for institutions. Bond markets are opaque.</p>
              <p>Nextoken Capital was founded to change this. By tokenizing real-world assets on regulated blockchain infrastructure, we enable <strong>investors from 180+ countries to access institutional-grade investments from EUR 100</strong> — with full transparency, on-chain settlement, and EU regulatory oversight.</p>
              <p>We are registered in Lithuania, monitored by the Bank of Lithuania, and operate under MiCA — the EU's comprehensive crypto-asset regulation framework. <strong>Compliance is not an afterthought. It is our foundation.</strong></p>
            </div>
          </div>
        </section>

        <section className="ab-section-alt">
          <div className="ab-inner">
            <div className="ab-tag">Our Values</div>
            <h2 className="ab-title">What We Stand For</h2>
            <p className="ab-sub">Four principles that guide every product decision we make.</p>
            <div className="ab-values-grid">
              {VALUES.map(v => (
                <div key={v.title} className="ab-value-card">
                  <div className="ab-value-icon">{v.icon}</div>
                  <div className="ab-value-title">{v.title}</div>
                  <div className="ab-value-desc">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ab-section">
          <div className="ab-inner">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
              <div>
                <div className="ab-tag">Our Journey</div>
                <h2 className="ab-title">Company Timeline</h2>
                <p className="ab-sub">From founding to a fully operational tokenized asset platform.</p>
                <div className="ab-timeline">
                  {MILESTONES.map((m, i) => (
                    <div key={m.year} className="ab-timeline-item">
                      <div className="ab-timeline-left">
                        <div className="ab-timeline-dot" />
                        {i < MILESTONES.length - 1 && <div className="ab-timeline-line" />}
                      </div>
                      <div>
                        <div className="ab-timeline-year">{m.year}</div>
                        <div className="ab-timeline-event">{m.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="ab-tag">The Team</div>
                <h2 className="ab-title">Who Builds Nextoken</h2>
                <p className="ab-sub">A team of fintech, compliance, and blockchain specialists.</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  {TEAM.map(t => (
                    <div key={t.name} className="ab-team-card">
                      {t.photo ? <img src={t.photo} alt={t.name} style={{width:56,height:56,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(240,185,11,0.3)",margin:"0 auto 14px",display:"block"}} /> : <div className="ab-team-avatar">👤</div>}
                      <div className="ab-team-name">{t.name}</div>
                      <div className="ab-team-role">{t.role}</div>
                      <div className="ab-team-bio">{t.bio}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ab-section-alt">
          <div className="ab-inner">
            <div className="ab-tag">Regulation</div>
            <h2 className="ab-title">Fully Regulated Infrastructure</h2>
            <p className="ab-sub">Every service we offer operates under EU financial regulation.</p>
            <div className="ab-reg-grid">
              {[
                { icon:"🏛️", title:"Bank of Lithuania", desc:"Nextoken Capital UAB is authorized and monitored by the Bank of Lithuania as an Electronic Money Institution.", badge:"EMI License" },
                { icon:"⚖️", title:"MiCA Regulation",   desc:"We hold a MiCA CASP (Crypto-Asset Service Provider) authorization, the gold standard for EU crypto regulation.", badge:"CASP Authorized" },
                { icon:"🪪", title:"Sumsub KYC",        desc:"All investors complete identity verification via Sumsub, ensuring full AML and CFT compliance across 180+ countries.", badge:"AML Compliant" },
                { icon:"🔗", title:"ERC-3643 Standard", desc:"All asset tokens are issued under the ERC-3643 standard, providing transfer controls, whitelisting and on-chain compliance.", badge:"Token Standard" },
                { icon:"🛡️", title:"Security Standards",         desc:"Our infrastructure follows international standards for information security management.", badge:"In Progress" },
                { icon:"🌐", title:"FATF Aligned",      desc:"Our AML policies are aligned with FATF (Financial Action Task Force) recommendations for virtual asset service providers.", badge:"FATF Compliant" },
              ].map(r => (
                <div key={r.title} className="ab-reg-card">
                  <div className="ab-reg-icon">{r.icon}</div>
                  <div className="ab-reg-title">{r.title}</div>
                  <div className="ab-reg-desc">{r.desc}</div>
                  <span className="ab-reg-badge">{r.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ab-cta">
          <h2>Join the marketplace</h2>
          <p>Create your free account and start trading tokenized real-world assets on our marketplace today.</p>
          <div className="ab-cta-btns">
            <Link href="/register" className="ab-cta-dark">Create Free Account</Link>
            <Link href="/contact"  className="ab-cta-ghost">Contact the Team</Link>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}