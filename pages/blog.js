import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const POSTS = [
  { id:1, cat:"Regulation",   date:"Mar 15, 2026", title:"MiCA Regulation: What It Means for Tokenized Asset Investors",       excerpt:"The EU's Markets in Crypto-Assets Regulation came into full effect in 2025. Here is what every investor on a regulated tokenization platform needs to know.",                  readTime:"6 min" },
  { id:2, cat:"Education",    date:"Mar 8, 2026",  title:"ERC-3643: The Security Token Standard Explained",                    excerpt:"ERC-3643 is the token standard we use for all security tokens on the platform. This guide explains how it works, why it matters, and how it protects investors.",         readTime:"8 min" },
  { id:3, cat:"Markets",      date:"Feb 28, 2026", title:"European Real Estate Tokenization: Q1 2026 Market Update",           excerpt:"A look at the latest trends in tokenized real estate across Europe, including market performance, new issuances, and investor sentiment going into Q2.",              readTime:"5 min" },
  { id:4, cat:"Investing",    date:"Feb 20, 2026", title:"How to Build a Diversified Tokenized Asset Portfolio",               excerpt:"Diversification is one of the most important principles of investing. Here is how to build a balanced portfolio using tokenized bonds, equity, real estate, and energy.", readTime:"7 min" },
  { id:5, cat:"Platform",     date:"Feb 12, 2026", title:"Secondary Market Launch: Trade Tokenized Assets 24/7",               excerpt:"We have launched the Nextoken Capital secondary market exchange, allowing investors to trade security tokens around the clock with a 0.2% flat fee.",                       readTime:"4 min" },
  { id:6, cat:"Education",    date:"Feb 5, 2026",  title:"What is Asset Tokenization? A Beginner's Guide",                    excerpt:"Asset tokenization is the process of converting ownership rights in a real-world asset into digital tokens on a blockchain. Here is everything you need to know to get started.", readTime:"9 min" },
];

const CATS = ["All", "Regulation", "Education", "Markets", "Investing", "Platform"];

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>Blog — Nextoken Capital</title>
        <meta name="description" content="Insights on tokenized assets, regulation, and investing from the Nextoken Capital team." />
      </Head>
      <Navbar />
      <style>{`
        .bl{min-height:100vh;background:#0B0E11;padding-top:64px}
        .bl-hero{padding:52px 20px 40px;border-bottom:1px solid rgba(255,255,255,0.07);text-align:center}
        .bl-tag{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
        .bl-h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#fff;letter-spacing:-1px;margin-bottom:10px}
        .bl-sub{font-size:14px;color:rgba(255,255,255,0.45);max-width:480px;margin:0 auto;line-height:1.7}
        .bl-body{max-width:1100px;margin:0 auto;padding:40px 20px 72px}
        .bl-cats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:36px}
        .bl-cat{padding:7px 16px;border-radius:7px;font-size:12px;font-weight:600;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(255,255,255,0.5);cursor:pointer;font-family:inherit;transition:all .15s}
        .bl-cat:hover{color:#fff;border-color:rgba(255,255,255,0.3)}
        .bl-cat.on{background:rgba(240,185,11,0.1);border-color:rgba(240,185,11,0.35);color:#F0B90B}
        .bl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .bl-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:14px;overflow:hidden;transition:border-color .2s,transform .2s;cursor:pointer}
        .bl-card:hover{border-color:rgba(240,185,11,0.25);transform:translateY(-2px)}
        .bl-card-img{height:140px;background:linear-gradient(135deg,rgba(240,185,11,0.08),rgba(255,255,255,0.03));display:flex;align-items:center;justify-content:center;font-size:40px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .bl-card-body{padding:20px}
        .bl-card-meta{display:flex;align-items:center;gap:10px;margin-bottom:10px}
        .bl-card-cat{padding:3px 10px;border-radius:999px;font-size:10px;font-weight:700;background:rgba(240,185,11,0.1);color:#F0B90B;border:1px solid rgba(240,185,11,0.2)}
        .bl-card-date{font-size:11px;color:rgba(255,255,255,0.3)}
        .bl-card-title{font-size:15px;font-weight:800;color:#fff;line-height:1.4;margin-bottom:10px}
        .bl-card-excerpt{font-size:12px;color:rgba(255,255,255,0.45);line-height:1.7;margin-bottom:14px}
        .bl-card-footer{display:flex;align-items:center;justify-content:space-between}
        .bl-read-time{font-size:11px;color:rgba(255,255,255,0.3)}
        .bl-read-link{font-size:12px;font-weight:700;color:#F0B90B;text-decoration:none}
        .bl-subscribe{background:#0F1318;border:1px solid rgba(240,185,11,0.2);border-radius:14px;padding:36px;text-align:center;margin-top:48px}
        .bl-sub-title{font-size:18px;font-weight:800;color:#fff;margin-bottom:8px}
        .bl-sub-desc{font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:20px;line-height:1.6}
        .bl-sub-form{display:flex;gap:10px;max-width:420px;margin:0 auto;flex-wrap:wrap}
        .bl-sub-input{flex:1;min-width:200px;padding:11px 14px;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-size:13px;outline:none;font-family:inherit}
        .bl-sub-btn{padding:11px 22px;background:#F0B90B;color:#000;border:none;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit}
        @media(max-width:900px){.bl-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:540px){.bl-grid{grid-template-columns:1fr}.bl-sub-form{flex-direction:column}.bl-sub-input,.bl-sub-btn{width:100%}}
      `}</style>
      <div className="bl">
        <div className="bl-hero">
          <div className="bl-tag">Insights</div>
          <h1 className="bl-h1">Nextoken Capital Blog</h1>
          <p className="bl-sub">Insights on tokenized assets, EU regulation, and investing from our team in Vilnius.</p>
        </div>
        <div className="bl-body">
          <div className="bl-cats">
            {CATS.map(c => <button key={c} className={`bl-cat${c==="All"?" on":""}`}>{c}</button>)}
          </div>
          <div className="bl-grid">
            {POSTS.map(p => (
              <div key={p.id} className="bl-card">
                <div className="bl-card-img">
                  {p.cat === "Regulation" ? "⚖️" : p.cat === "Education" ? "📚" : p.cat === "Markets" ? "📊" : p.cat === "Investing" ? "💼" : "🚀"}
                </div>
                <div className="bl-card-body">
                  <div className="bl-card-meta">
                    <span className="bl-card-cat">{p.cat}</span>
                    <span className="bl-card-date">{p.date}</span>
                  </div>
                  <div className="bl-card-title">{p.title}</div>
                  <div className="bl-card-excerpt">{p.excerpt}</div>
                  <div className="bl-card-footer">
                    <span className="bl-read-time">⏱ {p.readTime} read</span>
                    <Link href="/register" className="bl-read-link">Read more →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bl-subscribe">
            <div className="bl-sub-title">Stay informed</div>
            <p className="bl-sub-desc">Get the latest insights on tokenized assets and EU regulation delivered to your inbox.</p>
            <div className="bl-sub-form">
              <input className="bl-sub-input" placeholder="Your email address" type="email" />
              <button className="bl-sub-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}