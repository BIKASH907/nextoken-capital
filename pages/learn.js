import Link from "next/link";
import { useState } from "react";

const S = {
  page:  { minHeight:"100vh", background:"#0B0E11", color:"rgba(255,255,255,0.85)", fontFamily:"'DM Sans',system-ui,sans-serif" },
  sec:   { maxWidth:1200, margin:"0 auto", padding:"64px 32px" },
  h2:    { fontFamily:"Syne,sans-serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:800, color:"rgba(255,255,255,0.85)", margin:"0 0 14px", letterSpacing:"-0.5px" },
  lbl:   { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:10, display:"block" },
  sub:   { fontSize:16, color:"rgba(255,255,255,0.5)", fontWeight:300, maxWidth:620, lineHeight:1.75, margin:"0 0 44px" },
  card:  { background:"#0B0E11", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:28, transition:"all 0.2s" },
  gold:  { padding:"13px 30px", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  out:   { padding:"13px 30px", borderRadius:10, background:"transparent", color:"#F0B90B", fontSize:14, fontWeight:600, border:"1px solid rgba(240,185,11,0.35)", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  badge: { display:"inline-flex", alignItems:"center", gap:8, padding:"5px 16px", borderRadius:20, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" },
  FB:    (a) => ({ padding:"7px 16px", borderRadius:20, border:"1px solid "+(a?"rgba(240,185,11,0.5)":"rgba(255,255,255,0.08)"), background:a?"rgba(240,185,11,0.12)":"transparent", color:a?"#F0B90B":"rgba(255,255,255,0.6)", fontSize:12.5, fontWeight:500, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }),
};

const categories = ["All","Getting Started","Tokenization","Compliance","Blockchain","Investing","DeFi"];

const articles = [
  {
    id:1, cat:"Getting Started", readTime:"4 min", level:"Beginner",
    emoji:"🚀", color:"#0ECB81",
    title:"What is Nextoken Capital?",
    desc:"A complete introduction to the platform — what we do, who we serve, and how tokenized investing works for everyday investors.",
    topics:["Platform overview","How to register","KYC process","First investment"],
  },
  {
    id:2, cat:"Tokenization", readTime:"6 min", level:"Beginner",
    emoji:"🏢", color:"#F0B90B",
    title:"What is Real-World Asset (RWA) Tokenization?",
    desc:"Learn how physical assets like real estate, bonds, and energy projects are converted into digital tokens that can be bought, sold, and owned globally.",
    topics:["Definition of RWA","How tokenization works","Benefits over traditional investing","Examples"],
  },
  {
    id:3, cat:"Blockchain", readTime:"5 min", level:"Beginner",
    emoji:"🔐", color:"#8b5cf6",
    title:"What is ERC-3643 and Why Does It Matter?",
    desc:"The ERC-3643 standard is the backbone of regulated security tokens. Understand how it enforces compliance at the smart contract level — automatically.",
    topics:["ERC-3643 explained","On-chain KYC/AML","Transfer restrictions","Why it beats ERC-20 for securities"],
  },
  {
    id:4, cat:"Compliance", readTime:"7 min", level:"Intermediate",
    emoji:"⚖️", color:"#38bdf8",
    title:"Understanding MiCA — EU Crypto Regulation Explained",
    desc:"The Markets in Crypto-Assets regulation is the EU's landmark crypto law. Learn what it means for investors, issuers, and platforms like Nextoken.",
    topics:["What MiCA covers","CASP licensing","Investor protections","Impact on tokenized assets"],
  },
  {
    id:5, cat:"Investing", readTime:"8 min", level:"Intermediate",
    emoji:"📊", color:"#fb923c",
    title:"How to Evaluate a Tokenized Bond Investment",
    desc:"A step-by-step guide to analyzing bond offerings on Nextoken — from understanding yield and rating to assessing issuer risk and liquidity.",
    topics:["Bond types","Yield vs risk","Credit ratings","Liquidity considerations"],
  },
  {
    id:6, cat:"Tokenization", readTime:"10 min", level:"Advanced",
    emoji:"🏗", color:"#ef4444",
    title:"How to Tokenize a Real Estate Asset",
    desc:"A detailed guide for property owners and issuers looking to tokenize real estate on Nextoken — from legal structure to smart contract deployment.",
    topics:["Legal structuring","SPV setup","Token issuance","Investor whitelisting","Secondary market"],
  },
  {
    id:7, cat:"Blockchain", readTime:"5 min", level:"Beginner",
    emoji:"🔗", color:"#a78bfa",
    title:"Blockchain Basics for New Investors",
    desc:"Never used blockchain before? Start here. Learn what a blockchain is, how wallets work, and what owning a token actually means.",
    topics:["What is blockchain","Public vs private keys","Wallets explained","Token ownership"],
  },
  {
    id:8, cat:"Compliance", readTime:"6 min", level:"Intermediate",
    emoji:"🪪", color:"#0ECB81",
    title:"KYC & AML: Why Identity Verification is Required",
    desc:"Every investor on Nextoken must complete KYC. Learn why this is legally required, how Sumsub works, and what data is collected.",
    topics:["What is KYC","What is AML","FATF requirements","Sumsub process","Data privacy"],
  },
  {
    id:9, cat:"Investing", readTime:"7 min", level:"Beginner",
    emoji:"💰", color:"#fbbf24",
    title:"Understanding Investment Risk in Tokenized Assets",
    desc:"All investments carry risk. Learn how to assess and manage risk when investing in tokenized real estate, equity, and bonds.",
    topics:["Types of risk","Risk ratings explained","Diversification","Due diligence checklist"],
  },
  {
    id:10, cat:"DeFi", readTime:"8 min", level:"Advanced",
    emoji:"🔄", color:"#34d399",
    title:"DeFi vs Regulated Tokenization — What is the Difference?",
    desc:"DeFi and regulated tokenization both use blockchain — but they serve very different purposes. Understand the key distinctions.",
    topics:["DeFi explained","Regulated tokens vs DeFi","Legal ownership","Smart contract compliance","Risk differences"],
  },
  {
    id:11, cat:"Getting Started", readTime:"3 min", level:"Beginner",
    emoji:"👛", color:"#60a5fa",
    title:"How to Connect Your Crypto Wallet",
    desc:"Step-by-step guide to connecting MetaMask, Coinbase Wallet, or WalletConnect to your Nextoken account.",
    topics:["Supported wallets","MetaMask setup","WalletConnect","Security tips","Recovery phrase backup"],
  },
  {
    id:12, cat:"Investing", readTime:"9 min", level:"Intermediate",
    emoji:"📈", color:"#e879f9",
    title:"Blockchain IPOs vs Traditional IPOs",
    desc:"Blockchain-native IPOs offer faster settlement, lower costs, and global access. Compare them to traditional IPOs to understand the advantages.",
    topics:["Traditional IPO process","Blockchain IPO advantages","ERC-3643 compliance","Access and minimums","Secondary liquidity"],
  },
];

const glossary = [
  { term:"RWA",        def:"Real-World Asset. Physical assets like real estate, bonds, or commodities represented as digital tokens on a blockchain." },
  { term:"ERC-3643",   def:"The institutional-grade security token standard on Ethereum. Enforces KYC/AML compliance at the smart contract level." },
  { term:"MiCA",       def:"Markets in Crypto-Assets. The EU regulatory framework governing crypto-asset service providers and token issuers." },
  { term:"KYC",        def:"Know Your Customer. The identity verification process required by regulators before investing." },
  { term:"AML",        def:"Anti-Money Laundering. Rules and processes to detect and prevent financial crimes." },
  { term:"CASP",       def:"Crypto-Asset Service Provider. A regulated entity licensed to offer crypto-asset services under MiCA." },
  { term:"VASP",       def:"Virtual Asset Service Provider. The FATF term for businesses offering crypto-related services." },
  { term:"FATF",       def:"Financial Action Task Force. The global AML/CFT standard-setting body whose recommendations Nextoken follows." },
  { term:"Tokenization",def:"The process of converting ownership rights in a real-world asset into a digital token on a blockchain." },
  { term:"SPV",        def:"Special Purpose Vehicle. A legal entity used to hold the asset being tokenized, isolating it from issuer risk." },
  { term:"EDD",        def:"Enhanced Due Diligence. Additional KYC/AML checks applied to high-risk or institutional investors." },
  { term:"Whitelist",  def:"A list of verified wallet addresses permitted to hold or transfer a security token under ERC-3643." },
  { term:"T+0",        def:"Trade plus zero days. Settlement finality on the same day a transaction occurs — enabled by blockchain." },
  { term:"IRR",        def:"Internal Rate of Return. A metric used to estimate the profitability of a potential investment over time." },
  { term:"Yield",      def:"The income generated by an investment, usually expressed as a percentage of its value annually." },
];

const levelColor = {
  Beginner:     { bg:"rgba(34,197,94,0.10)",  color:"#0ECB81", border:"rgba(34,197,94,0.25)"  },
  Intermediate: { bg:"rgba(240,185,11,0.10)", color:"#F0B90B", border:"rgba(240,185,11,0.3)"  },
  Advanced:     { bg:"rgba(239,68,68,0.10)",  color:"#ef4444", border:"rgba(239,68,68,0.25)"  },
};

function ArticleCard({ a }) {
  const [hov, setHov] = useState(false);
  const lc = levelColor[a.level];
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...S.card, border:"1px solid "+(hov?"rgba(240,185,11,0.35)":"rgba(255,255,255,0.07)"), transform:hov?"translateY(-3px)":"none", cursor:"pointer", display:"flex", flexDirection:"column" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <span style={{ fontSize:32 }}>{a.emoji}</span>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
          <span style={{ padding:"3px 9px", borderRadius:20, fontSize:10.5, fontWeight:600, background:lc.bg, color:lc.color, border:"1px solid "+lc.border }}>{a.level}</span>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>⏱ {a.readTime} read</span>
        </div>
      </div>
      <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:8, lineHeight:1.35, flex:1 }}>{a.title}</h3>
      <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:14 }}>{a.desc}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
        {a.topics.map(t => <span key={t} style={{ padding:"2px 8px", borderRadius:6, fontSize:10.5, background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.07)" }}>{t}</span>)}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ padding:"2px 8px", borderRadius:6, fontSize:10.5, background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.07)" }}>{a.cat}</span>
        <span style={{ marginLeft:"auto", fontSize:13, color:a.color, fontWeight:600 }}>Read article →</span>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", background:"#0B0E11", border:"none", color:"rgba(255,255,255,0.85)", fontSize:14.5, fontWeight:500, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
        <span>{q}</span>
        <span style={{ color:"#F0B90B", fontSize:20, flexShrink:0, marginLeft:16 }}>{open ? "-" : "+"}</span>
      </button>
      {open && <div style={{ padding:"0 20px 16px", background:"#0B0E11" }}><p style={{ fontSize:13.5, color:"rgba(255,255,255,0.5)", lineHeight:1.75, margin:0 }}>{a}</p></div>}
    </div>
  );
}

export default function LearnPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [glossarySearch, setGlossarySearch] = useState("");
  const [activeTab, setActiveTab] = useState("articles");

  const filtered = articles.filter(a => {
    const cm = activeCat === "All" || a.cat === activeCat;
    const sm = search === "" || a.title.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase());
    return cm && sm;
  });

  const filteredGlossary = glossary.filter(g =>
    glossarySearch === "" || g.term.toLowerCase().includes(glossarySearch.toLowerCase()) || g.def.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse { animation: pulse 2s infinite; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#05060a; }
        ::-webkit-scrollbar-thumb { background:rgba(240,185,11,0.3); border-radius:3px; }
        input::placeholder { color:#8a9bb8; }
        input:focus { border-color:#F0B90B !important; outline:none; }
      `}</style>

      {/* HERO */}
      <div style={{ position:"relative", padding:"90px 32px 70px", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 800px 400px at 50% -40px,rgba(240,185,11,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ ...S.badge, marginBottom:24 }}>
          <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
          Education Hub
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,6vw,68px)", fontWeight:800, lineHeight:1.05, letterSpacing:"-1.5px", color:"rgba(255,255,255,0.85)", maxWidth:820, margin:"0 auto 20px" }}>
          Learn to Invest in<br /><span style={{ color:"#F0B90B" }}>Tokenized Assets</span>
        </h1>
        <p style={{ fontSize:17, fontWeight:300, color:"rgba(255,255,255,0.5)", maxWidth:600, margin:"0 auto 36px", lineHeight:1.75 }}>
          From blockchain basics to advanced tokenization strategies — everything you need to invest confidently in real-world tokenized assets.
        </p>
        {/* Search */}
        <div style={{ position:"relative", maxWidth:520, margin:"0 auto" }}>
          <span style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", fontSize:18, color:"rgba(255,255,255,0.5)" }}>🔍</span>
          <input placeholder="Search articles, topics, terms..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"14px 18px 14px 50px", borderRadius:14, background:"#0B0E11", border:"1.5px solid rgba(255,255,255,0.10)", color:"rgba(255,255,255,0.85)", fontSize:15, fontFamily:"inherit", boxSizing:"border-box" }} />
        </div>
      </div>

      {/* STATS */}
      <div style={{ margin:"0 32px", borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#0B0E11", display:"flex", flexWrap:"wrap" }}>
        {[{v:"12",l:"Articles"},{v:"15",l:"Glossary Terms"},{v:"3",l:"Skill Levels"},{v:"7",l:"Topic Categories"},{v:"Free",l:"Always Free"},{v:"5 min",l:"Avg. Read Time"}].map((s,i,arr) => (
          <div key={s.l} style={{ flex:1, minWidth:100, padding:"20px 16px", textAlign:"center", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.07)":"none" }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#F0B90B" }}>{s.v}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* LEARNING PATHS */}
      <div style={S.sec}>
        <span style={S.lbl}>Learning Paths</span>
        <h2 style={S.h2}>Where Do You Want to Start?</h2>
        <p style={S.sub}>Choose a learning path based on your experience level or investment goal.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16, marginBottom:12 }}>
          {[
            { icon:"🌱", color:"#0ECB81", bg:"rgba(34,197,94,0.10)", title:"Complete Beginner",      desc:"Never invested before? Start here. Learn what tokenized assets are, how blockchain works, and how to make your first investment.",  steps:["What is RWA tokenization?","Blockchain basics","How KYC works","Your first investment"] },
            { icon:"📊", color:"#F0B90B", bg:"rgba(240,185,11,0.10)", title:"Experienced Investor",  desc:"Already invest in stocks or bonds? Learn how tokenized assets compare, the advantages, and how to diversify your portfolio.",         steps:["RWA vs traditional assets","Risk assessment","Bond vs equity tokens","Portfolio diversification"] },
            { icon:"🏢", color:"#8b5cf6", bg:"rgba(129,140,248,0.10)", title:"Asset Issuer",         desc:"Want to raise capital by tokenizing your asset? Learn the full issuance process from legal structure to investor distribution.",       steps:["Tokenization overview","Legal structures","Smart contract setup","Running a fundraise"] },
            { icon:"🏦", color:"#38bdf8", bg:"rgba(56,189,248,0.10)", title:"Institutional Investor", desc:"Managing significant capital? Learn about ERC-3643 compliance, institutional-grade custody, and our dedicated onboarding process.",   steps:["ERC-3643 explained","MiCA compliance","Institutional tiers","Enhanced due diligence"] },
          ].map(p => (
            <div key={p.title}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(240,185,11,0.3)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="none"; }}
              style={{ ...S.card, cursor:"pointer" }}>
              <div style={{ width:52, height:52, borderRadius:14, background:p.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:14 }}>{p.icon}</div>
              <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:p.color, marginBottom:8 }}>{p.title}</h3>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.7, marginBottom:14 }}>{p.desc}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {p.steps.map((s,i) => (
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", background:p.bg, border:"1px solid "+p.color+"55", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:p.color, flexShrink:0 }}>{i+1}</div>
                    <span style={{ fontSize:12.5, color:"rgba(255,255,255,0.6)" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ARTICLES + GLOSSARY */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>

          {/* Tabs */}
          <div style={{ display:"flex", gap:6, marginBottom:28, borderBottom:"1px solid rgba(255,255,255,0.07)", paddingBottom:12 }}>
            {[["articles","📚 Articles ("+articles.length+")"],["glossary","📖 Glossary ("+glossary.length+" terms)"]].map(([v,l]) => (
              <button key={v} onClick={() => setActiveTab(v)}
                style={{ padding:"9px 20px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:14, fontWeight:600, background:activeTab===v?"rgba(240,185,11,0.12)":"transparent", color:activeTab===v?"#F0B90B":"rgba(255,255,255,0.5)", transition:"all 0.15s" }}>{l}</button>
            ))}
          </div>

          {/* ARTICLES */}
          {activeTab==="articles" && (
            <>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:28 }}>
                {categories.map(c => <button key={c} onClick={() => setActiveCat(c)} style={S.FB(activeCat===c)}>{c}</button>)}
              </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:20 }}>
                Showing <strong style={{ color:"rgba(255,255,255,0.85)" }}>{filtered.length}</strong> of <strong style={{ color:"rgba(255,255,255,0.85)" }}>{articles.length}</strong> articles
                {activeCat!=="All" && <span> in <strong style={{ color:"#F0B90B" }}>{activeCat}</strong></span>}
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
                {filtered.map(a => <ArticleCard key={a.id} a={a} />)}
                {filtered.length===0 && (
                  <div style={{ gridColumn:"1/-1", padding:"60px 0", textAlign:"center", color:"rgba(255,255,255,0.5)" }}>
                    <p style={{ fontSize:16, marginBottom:8 }}>No articles found for "{search}"</p>
                    <button onClick={() => { setSearch(""); setActiveCat("All"); }} style={{ color:"#F0B90B", background:"none", border:"none", cursor:"pointer", fontSize:14, fontFamily:"inherit" }}>Clear filters →</button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* GLOSSARY */}
          {activeTab==="glossary" && (
            <>
              <div style={{ position:"relative", marginBottom:24 }}>
                <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:16, color:"rgba(255,255,255,0.5)" }}>🔍</span>
                <input placeholder="Search glossary terms..." value={glossarySearch} onChange={e => setGlossarySearch(e.target.value)}
                  style={{ width:"100%", padding:"12px 16px 12px 44px", borderRadius:12, background:"#0B0E11", border:"1.5px solid rgba(255,255,255,0.10)", color:"rgba(255,255,255,0.85)", fontSize:14, fontFamily:"inherit", boxSizing:"border-box" }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:12 }}>
                {filteredGlossary.map(g => (
                  <div key={g.term} style={{ ...S.card, padding:20, display:"flex", gap:14, alignItems:"flex-start" }}>
                    <div style={{ minWidth:70, padding:"4px 10px", borderRadius:8, background:"rgba(240,185,11,0.10)", border:"1px solid rgba(240,185,11,0.25)", textAlign:"center" }}>
                      <span style={{ fontFamily:"Syne,sans-serif", fontSize:12, fontWeight:800, color:"#F0B90B" }}>{g.term}</span>
                    </div>
                    <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:1.65, margin:0 }}>{g.def}</p>
                  </div>
                ))}
                {filteredGlossary.length===0 && (
                  <div style={{ gridColumn:"1/-1", padding:"40px 0", textAlign:"center", color:"rgba(255,255,255,0.5)" }}>No terms found for "{glossarySearch}"</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* QUICK FAQS */}
      <div style={S.sec}>
        <span style={S.lbl}>Common Questions</span>
        <h2 style={{ ...S.h2, marginBottom:28 }}>Investor FAQ</h2>
        {[
          { q:"Do I need crypto experience to invest on Nextoken?",          a:"No. Nextoken is designed for both crypto-native and traditional investors. You can invest without ever interacting with a blockchain wallet — simply use your email account and bank transfer. The blockchain complexity is handled behind the scenes." },
          { q:"What is the minimum amount I can invest?",                    a:"Minimum investment sizes vary by offering. They start as low as EUR 100 for some blockchain IPOs, EUR 250 for green bonds and real estate, and EUR 500-1,000 for early-stage equity and energy projects. Each listing shows the minimum clearly." },
          { q:"How long does KYC verification take?",                        a:"Standard KYC via Sumsub typically takes 5-15 minutes for most investors. In some cases, especially for enhanced due diligence, it may take up to 24-48 hours. You will be notified by email once approved." },
          { q:"Can I lose my entire investment?",                             a:"Yes — all investments carry risk including the potential loss of capital. Tokenized assets are not risk-free. We provide risk ratings (Low / Medium / High) for every listing and encourage investors to diversify and only invest what they can afford to lose." },
          { q:"How do I receive returns on my investment?",                   a:"Returns vary by asset type. Bonds pay regular interest (yield) directly to your wallet or bank account. Equity tokens may pay dividends or appreciate in value. Real estate tokens distribute rental income on a scheduled basis. All distributions are automated via smart contracts." },
          { q:"Can I sell my tokens before maturity?",                        a:"Yes, for eligible tokens listed on the Nextoken Exchange. The secondary market allows peer-to-peer token trading among verified investors. Not all tokens are listed on the exchange — check each offering's terms for secondary market eligibility." },
        ].map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
      </div>

      {/* CTA */}
      <div style={{ margin:"0 32px 64px", borderRadius:18, padding:"64px 40px", textAlign:"center", position:"relative", overflow:"hidden", border:"1px solid rgba(240,185,11,0.25)", background:"linear-gradient(135deg,rgba(240,185,11,0.08) 0%,rgba(99,102,241,0.05) 100%)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 600px 300px at 50% 0%,rgba(240,185,11,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(24px,4vw,40px)", fontWeight:800, color:"rgba(255,255,255,0.85)", margin:"0 0 14px", letterSpacing:"-0.5px" }}>Ready to Start Investing?</h2>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.5)", fontWeight:300, maxWidth:440, margin:"0 auto 32px", lineHeight:1.75 }}>
            Create your free account, complete KYC in 5 minutes, and access tokenized bonds, equity, and real estate from EUR 100.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/register" style={S.gold}>Create Free Account</Link>
            <Link href="/markets"  style={S.out}>Explore Markets</Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"40px 32px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:20, alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:900, color:"#F0B90B", letterSpacing:2 }}>NXT</span>
            <div style={{ width:1, height:18, background:"rgba(240,185,11,0.25)" }} />
            <span style={{ fontFamily:"Syne,sans-serif", fontSize:12, fontWeight:800, letterSpacing:"0.15em", color:"#F0B90B" }}>NEXTOKEN CAPITAL</span>
          </div>
          <div style={{ display:"flex", gap:20 }}>
            {[["Markets","/markets"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"],["Compliance","/compliance"]].map(([l,h]) => (
              <Link key={l} href={h} style={{ fontSize:13, color:"rgba(255,255,255,0.5)", textDecoration:"none" }}>{l}</Link>
            ))}
          </div>
          <p style={{ fontSize:11.5, color:"rgba(255,255,255,0.5)", margin:0 }}>© 2026 Nextoken Capital UAB · Regulated by Bank of Lithuania</p>
        </div>
      </footer>
    </div>
  );
}
