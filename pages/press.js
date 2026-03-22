import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PRESS = [
  { date:"Mar 10, 2026", source:"Fintech Lithuania",       title:"Nextoken Capital reaches EUR 140M in tokenized assets", type:"Coverage" },
  { date:"Feb 22, 2026", source:"The Paypers",             title:"Nextoken Capital launches secondary market exchange for security tokens", type:"Coverage" },
  { date:"Feb 5, 2026",  source:"Baltic Times",            title:"Lithuanian fintech tokenizes EUR 100M in real-world assets", type:"Coverage" },
  { date:"Jan 18, 2026", source:"CoinDesk",                title:"EU-regulated platform brings institutional assets to retail investors", type:"Coverage" },
  { date:"Dec 12, 2025", source:"Nextoken Capital",        title:"Nextoken Capital receives MiCA CASP authorization from Bank of Lithuania", type:"Press Release" },
  { date:"Nov 3, 2025",  source:"Nextoken Capital",        title:"Platform launch: Tokenized real-world assets now available to 180+ countries", type:"Press Release" },
];

const FACTS = [
  { value:"2022",       label:"Founded" },
  { value:"Vilnius",    label:"Headquarters" },
  { value:"EUR 140M+",  label:"Assets Tokenized" },
  { value:"12,400+",    label:"Verified Investors" },
  { value:"180+",       label:"Countries" },
  { value:"MiCA/EMI",   label:"Regulatory Status" },
];

export default function PressPage() {
  return (
    <>
      <Head>
        <title>Press — Nextoken Capital</title>
        <meta name="description" content="Press coverage, press releases, and media resources for Nextoken Capital." />
      </Head>
      <Navbar />
      <style>{`
        .pr{min-height:100vh;background:#0B0E11;padding-top:64px}
        .pr-hero{padding:52px 20px 40px;border-bottom:1px solid rgba(255,255,255,0.07)}
        .pr-hero-inner{max-width:1100px;margin:0 auto;display:flex;align-items:flex-start;justify-content:space-between;gap:40px;flex-wrap:wrap}
        .pr-hero-left{}
        .pr-tag{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
        .pr-h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#fff;letter-spacing:-1px;margin-bottom:12px}
        .pr-sub{font-size:14px;color:rgba(255,255,255,0.45);line-height:1.7;max-width:500px;margin-bottom:20px}
        .pr-contact-btn{display:inline-block;padding:11px 22px;background:#F0B90B;color:#000;border-radius:8px;font-size:13px;font-weight:800;text-decoration:none}
        .pr-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;min-width:280px}
        .pr-fact{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px 16px;text-align:center}
        .pr-fact-v{font-size:1.2rem;font-weight:900;color:#F0B90B;margin-bottom:3px}
        .pr-fact-l{font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1px}
        .pr-body{max-width:1100px;margin:0 auto;padding:40px 20px 72px;display:grid;grid-template-columns:1.4fr 0.6fr;gap:40px;align-items:start}
        .pr-section-title{font-size:13px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1px;margin-bottom:16px}
        .pr-item{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.07)}
        .pr-item:last-child{border-bottom:none}
        .pr-item-date{font-size:11px;color:rgba(255,255,255,0.3);flex-shrink:0;margin-top:3px}
        .pr-item-source{font-size:11px;font-weight:700;color:#F0B90B;margin-bottom:4px}
        .pr-item-title{font-size:14px;font-weight:700;color:#fff;line-height:1.4}
        .pr-item-badge{display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;margin-top:6px}
        .pr-item-badge.coverage{background:rgba(59,130,246,0.1);color:#3B82F6;border:1px solid rgba(59,130,246,0.2)}
        .pr-item-badge.release{background:rgba(240,185,11,0.1);color:#F0B90B;border:1px solid rgba(240,185,11,0.2)}
        .pr-kit{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px}
        .pr-kit-title{font-size:15px;font-weight:800;color:#fff;margin-bottom:8px}
        .pr-kit-sub{font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:18px;line-height:1.6}
        .pr-kit-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:rgba(255,255,255,0.6)}
        .pr-kit-item:last-child{border-bottom:none}
        .pr-kit-icon{font-size:16px;flex-shrink:0}
        .pr-contact-card{background:#0F1318;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px;margin-top:16px}
        .pr-contact-title{font-size:14px;font-weight:800;color:#fff;margin-bottom:8px}
        .pr-contact-text{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;margin-bottom:14px}
        .pr-contact-email{display:block;font-size:13px;color:#F0B90B;text-decoration:none;font-weight:700}
        @media(max-width:900px){.pr-body{grid-template-columns:1fr}.pr-hero-inner{flex-direction:column}}
        @media(max-width:480px){.pr-facts{grid-template-columns:repeat(2,1fr)}}
      `}</style>
      <div className="pr">
        <div className="pr-hero">
          <div className="pr-hero-inner">
            <div className="pr-hero-left">
              <div className="pr-tag">Press & Media</div>
              <h1 className="pr-h1">Press Room</h1>
              <p className="pr-sub">Press coverage, press releases, and media resources for journalists and analysts covering Nextoken Capital and tokenized asset markets.</p>
              <Link href="/contact" className="pr-contact-btn">Media Enquiries</Link>
            </div>
            <div className="pr-facts">
              {FACTS.map(f => (
                <div key={f.label} className="pr-fact">
                  <div className="pr-fact-v">{f.value}</div>
                  <div className="pr-fact-l">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pr-body">
          <div>
            <div className="pr-section-title">Coverage & Press Releases</div>
            {PRESS.map(p => (
              <div key={p.title} className="pr-item">
                <div>
                  <div className="pr-item-source">{p.source}</div>
                  <div className="pr-item-title">{p.title}</div>
                  <span className={`pr-item-badge ${p.type==="Coverage"?"coverage":"release"}`}>{p.type}</span>
                </div>
                <div className="pr-item-date">{p.date}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="pr-section-title">Media Kit</div>
            <div className="pr-kit">
              <div className="pr-kit-title">Brand Assets</div>
              <p className="pr-kit-sub">Download official logos, brand guidelines, and product screenshots.</p>
              {[
                { icon:"🖼️", label:"Logo Pack (SVG, PNG)" },
                { icon:"📐", label:"Brand Guidelines PDF" },
                { icon:"📸", label:"Product Screenshots" },
                { icon:"👤", label:"Leadership Photos" },
                { icon:"📄", label:"Company Fact Sheet" },
              ].map(item => (
                <div key={item.label} className="pr-kit-item">
                  <span className="pr-kit-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="pr-contact-card">
              <div className="pr-contact-title">Media Contact</div>
              <p className="pr-contact-text">For interview requests, press enquiries, and media partnerships:</p>
              <a href="mailto:press@nextokencapital.com" className="pr-contact-email">press@nextokencapital.com</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}