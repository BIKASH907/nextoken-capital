import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const JOBS = [
  { id:1, title:"Senior Blockchain Engineer",  dept:"Engineering",  loc:"Vilnius / Remote", type:"Full-time", desc:"Build and maintain ERC-3643 token infrastructure, smart contracts, and on-chain settlement systems." },
  { id:2, title:"Compliance Officer",          dept:"Legal",        loc:"Vilnius",           type:"Full-time", desc:"Manage MiCA compliance, Bank of Lithuania reporting, AML monitoring, and regulatory filings." },
  { id:3, title:"Full-Stack Developer",        dept:"Engineering",  loc:"Remote",            type:"Full-time", desc:"Build investor-facing features on our Next.js platform, API integrations, and dashboard tooling." },
  { id:4, title:"Asset Origination Manager",  dept:"Investments",  loc:"Vilnius / EU",      type:"Full-time", desc:"Source, structure, and onboard real-world assets including real estate, bonds, and private equity." },
  { id:5, title:"Product Designer (UI/UX)",   dept:"Design",       loc:"Remote",            type:"Full-time", desc:"Design my dashboards, onboarding flows, and the secondary market exchange interface." },
  { id:6, title:"Marketing Manager",          dept:"Marketing",    loc:"Remote",            type:"Full-time", desc:"Drive investor acquisition through content marketing, partnerships, and growth campaigns." },
];

const PERKS = [
  { icon:"🌍", title:"Remote-Friendly",     desc:"Most roles can be performed fully remotely across the EU." },
  { icon:"📈", title:"Equity Options",       desc:"All full-time employees receive token options in the platform." },
  { icon:"🏖️", title:"30 Days PTO",          desc:"Generous paid time off on top of public holidays." },
  { icon:"📚", title:"Learning Budget",      desc:"EUR 2,000 annual budget for courses, conferences, and books." },
  { icon:"💻", title:"Top Equipment",        desc:"MacBook Pro or equivalent + home office setup allowance." },
  { icon:"🏥", title:"Health Insurance",     desc:"Private health insurance for all full-time employees." },
];

const DEPTS = ["All", "Engineering", "Legal", "Investments", "Design", "Marketing"];

export default function CareersPage() {
  const [dept, setDept] = useState("All");
  const [selected, setSelected] = useState(null);
  const [applied, setApplied] = useState(false);

  const filtered = dept === "All" ? JOBS : JOBS.filter(j => j.dept === dept);

  return (
    <>
      <Head>
        <title>Careers — Nextoken Capital</title>
        <meta name="description" content="Join the Nextoken Capital team and help build the marketplace for tokenized real-world assets." />
      </Head>
      <Navbar />

      <style>{`
        .cr-page { min-height:100vh; background:#0B0E11; padding-top:64px; }

        .cr-hero { padding:64px 20px 52px; text-align:center; position:relative; overflow:hidden; }
        .cr-hero-glow { position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 60% 50% at 50% 40%, rgba(240,185,11,0.06), transparent); }
        .cr-hero-tag { font-size:11px; font-weight:700; color:#F0B90B; letter-spacing:2px; text-transform:uppercase; margin-bottom:12px; }
        .cr-hero h1 { font-size:clamp(1.8rem,4vw,3rem); font-weight:900; color:#fff; letter-spacing:-1px; margin-bottom:14px; }
        .cr-hero h1 em { color:#F0B90B; font-style:normal; }
        .cr-hero p { font-size:14px; color:rgba(255,255,255,0.45); max-width:500px; margin:0 auto; line-height:1.7; }

        .cr-stats { background:#0F1318; border-top:1px solid rgba(255,255,255,0.07); border-bottom:1px solid rgba(255,255,255,0.07); padding:28px 20px; }
        .cr-stats-inner { max-width:1280px; margin:0 auto; display:flex; justify-content:center; gap:48px; flex-wrap:wrap; text-align:center; }
        .cr-stat-v { font-size:1.6rem; font-weight:900; color:#F0B90B; line-height:1; margin-bottom:5px; }
        .cr-stat-l { font-size:12px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:1px; }

        .cr-section     { padding:64px 20px; }
        .cr-section-alt { padding:64px 20px; background:#0F1318; }
        .cr-inner   { max-width:1100px; margin:0 auto; }
        .cr-tag   { font-size:11px; font-weight:700; color:#F0B90B; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; }
        .cr-title { font-size:clamp(1.5rem,2.8vw,2.2rem); font-weight:900; color:#fff; margin-bottom:10px; letter-spacing:-.5px; }
        .cr-sub   { font-size:13px; color:rgba(255,255,255,0.4); max-width:480px; line-height:1.7; margin-bottom:32px; }

        /* FILTER */
        .cr-filter { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:28px; }
        .cr-filter-btn { padding:7px 16px; border-radius:7px; font-size:12px; font-weight:600; border:1px solid rgba(255,255,255,0.1); background:transparent; color:rgba(255,255,255,0.5); cursor:pointer; transition:all .15s; font-family:inherit; }
        .cr-filter-btn:hover { border-color:rgba(255,255,255,0.3); color:#fff; }
        .cr-filter-btn.on { background:rgba(240,185,11,0.1); border-color:rgba(240,185,11,0.35); color:#F0B90B; }

        /* JOBS */
        .cr-jobs-list { display:flex; flex-direction:column; gap:12px; }
        .cr-job-card { background:#0F1318; border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:22px 24px; display:flex; align-items:center; justify-content:space-between; gap:16px; cursor:pointer; transition:border-color .2s; }
        .cr-job-card:hover, .cr-job-card.open { border-color:rgba(240,185,11,0.3); }
        .cr-job-left { flex:1; }
        .cr-job-title { font-size:15px; font-weight:800; color:#fff; margin-bottom:6px; }
        .cr-job-meta  { display:flex; gap:12px; flex-wrap:wrap; }
        .cr-job-tag { padding:3px 10px; border-radius:6px; font-size:11px; font-weight:600; }
        .cr-job-tag.dept { background:rgba(240,185,11,0.1); color:#F0B90B; }
        .cr-job-tag.loc  { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5); }
        .cr-job-tag.type { background:rgba(14,203,129,0.1); color:#0ECB81; }
        .cr-job-arrow { font-size:18px; color:rgba(255,255,255,0.2); transition:all .2s; }
        .cr-job-card.open .cr-job-arrow { color:#F0B90B; transform:rotate(90deg); }
        .cr-job-details { padding:0 24px 22px; background:#0F1318; border:1px solid rgba(240,185,11,0.15); border-top:none; border-radius:0 0 12px 12px; margin-top:-12px; }
        .cr-job-desc { font-size:13px; color:rgba(255,255,255,0.55); line-height:1.8; padding-top:14px; margin-bottom:16px; }
        .cr-job-apply { display:inline-flex; align-items:center; gap:6px; padding:10px 22px; background:#F0B90B; color:#000; border-radius:7px; font-size:13px; font-weight:800; border:none; cursor:pointer; font-family:inherit; transition:background .15s; }
        .cr-job-apply:hover { background:#FFD000; }

        /* PERKS */
        .cr-perks-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .cr-perk-card { background:#161B22; border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:24px; }
        .cr-perk-icon  { font-size:26px; margin-bottom:12px; }
        .cr-perk-title { font-size:14px; font-weight:800; color:#fff; margin-bottom:7px; }
        .cr-perk-desc  { font-size:13px; color:rgba(255,255,255,0.43); line-height:1.7; }

        /* CTA */
        .cr-cta { background:#F0B90B; padding:60px 20px; text-align:center; }
        .cr-cta h2 { font-size:clamp(1.6rem,3vw,2.2rem); font-weight:900; color:#000; margin-bottom:10px; }
        .cr-cta p  { font-size:14px; color:rgba(0,0,0,0.6); margin-bottom:24px; }
        .cr-cta-btn { display:inline-block; padding:13px 32px; background:#000; color:#fff; border-radius:8px; font-size:14px; font-weight:800; text-decoration:none; }

        /* MODAL APPLIED */
        .cr-applied { text-align:center; padding:32px 0 16px; }
        .cr-applied-icon  { font-size:48px; margin-bottom:14px; }
        .cr-applied-title { font-size:17px; font-weight:800; color:#0ECB81; margin-bottom:7px; }
        .cr-applied-sub   { font-size:13px; color:rgba(255,255,255,0.45); line-height:1.7; }

        @media(max-width:768px){ .cr-perks-grid{ grid-template-columns:repeat(2,1fr); } .cr-job-card{ flex-direction:column; align-items:flex-start; } }
        @media(max-width:480px){ .cr-perks-grid{ grid-template-columns:1fr; } .cr-stats-inner{ gap:24px; } }
      `}</style>

      <div className="cr-page">

        <section className="cr-hero">
          <div className="cr-hero-glow" />
          <div className="cr-hero-tag">We are hiring</div>
          <h1>Build the Future of <em>Capital Markets</em></h1>
          <p>Join a team of fintech engineers, compliance specialists, and investment professionals building tokenization marketplace infrastructure.</p>
        </section>

        <div className="cr-stats">
          <div className="cr-stats-inner">
            {[["Vilnius, LT","Headquarters"],["Remote-Friendly","Work Style"],[`${JOBS.length} Open Roles`,"Join the Team"],["2022","Founded"]].map(([v,l]) => (
              <div key={l}><div className="cr-stat-v">{v}</div><div className="cr-stat-l">{l}</div></div>
            ))}
          </div>
        </div>

        <section className="cr-section">
          <div className="cr-inner">
            <div className="cr-tag">Open Positions</div>
            <h2 className="cr-title">Current Openings</h2>
            <p className="cr-sub">We are a remote-friendly team. Most roles can be performed from anywhere in the EU.</p>

            <div className="cr-filter">
              {DEPTS.map(d => (
                <button key={d} className={"cr-filter-btn"+(dept===d?" on":"")} onClick={()=>setDept(d)}>{d}</button>
              ))}
            </div>

            <div className="cr-jobs-list">
              {filtered.map(job => (
                <div key={job.id}>
                  <div
                    className={"cr-job-card"+(selected===job.id?" open":"")}
                    onClick={() => { setSelected(selected===job.id ? null : job.id); setApplied(false); }}
                  >
                    <div className="cr-job-left">
                      <div className="cr-job-title">{job.title}</div>
                      <div className="cr-job-meta">
                        <span className="cr-job-tag dept">{job.dept}</span>
                        <span className="cr-job-tag loc">📍 {job.loc}</span>
                        <span className="cr-job-tag type">{job.type}</span>
                      </div>
                    </div>
                    <div className="cr-job-arrow">›</div>
                  </div>
                  {selected === job.id && (
                    <div className="cr-job-details">
                      {applied ? (
                        <div className="cr-applied">
                          <div className="cr-applied-icon">🎉</div>
                          <div className="cr-applied-title">Application Received!</div>
                          <p className="cr-applied-sub">Thanks for applying to <strong>{job.title}</strong>. Our team will review your application and get back to you within 5 business days.</p>
                        </div>
                      ) : (
                        <>
                          <p className="cr-job-desc">{job.desc}</p>
                          <button className="cr-job-apply" onClick={() => setApplied(true)}>
                            Apply for this role →
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cr-section-alt">
          <div className="cr-inner">
            <div className="cr-tag">Benefits</div>
            <h2 className="cr-title">Why Work at Nextoken</h2>
            <p className="cr-sub">We invest in our team the same way we invest in building great products.</p>
            <div className="cr-perks-grid">
              {PERKS.map(p => (
                <div key={p.title} className="cr-perk-card">
                  <div className="cr-perk-icon">{p.icon}</div>
                  <div className="cr-perk-title">{p.title}</div>
                  <div className="cr-perk-desc">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cr-cta">
          <h2>Don&apos;t see a role that fits?</h2>
          <p>Send us your CV and we will keep it on file for future opportunities.</p>
          <Link href="/contact" className="cr-cta-btn">Get in Touch</Link>
        </section>

      </div>
      <Footer />
    </>
  );
}