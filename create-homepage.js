const fs = require("fs");

const code = `import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const S = {
  page:  { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  gold:  { padding:"14px 32px", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:15, fontWeight:800, textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  out:   { padding:"14px 32px", borderRadius:10, background:"transparent", color:"#F0B90B", fontSize:15, fontWeight:600, border:"1px solid rgba(240,185,11,0.4)", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  card:  { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:28, transition:"all 0.25s" },
  lbl:   { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:10, display:"block" },
  h2:    { fontFamily:"Syne,sans-serif", fontSize:"clamp(28px,4vw,46px)", fontWeight:800, color:"#e8e8f0", margin:"0 0 14px", letterSpacing:"-0.5px" },
  sub:   { fontSize:16, color:"#8a9bb8", fontWeight:300, maxWidth:600, lineHeight:1.75, margin:"0 0 44px" },
  sec:   { maxWidth:1200, margin:"0 auto", padding:"80px 32px" },
};

const stats = [
  { v:"EUR 140M+", l:"Assets Tokenized"    },
  { v:"12,400+",   l:"Verified Investors"  },
  { v:"180+",      l:"Countries Supported" },
  { v:"ERC-3643",  l:"Token Standard"      },
  { v:"T+0",       l:"Settlement"          },
  { v:"MiCA",      l:"EU Regulated"        },
];

const features = [
  { icon:"🏢", title:"Real Estate",          desc:"Fractional ownership in commercial, residential, and industrial properties across global markets from EUR 250.",   href:"/markets",    color:"#F0B90B"  },
  { icon:"⚡", title:"Energy & Green",        desc:"Invest in solar, wind, and infrastructure projects with automated on-chain yield distributions.",                  href:"/markets",    color:"#22c55e"  },
  { icon:"📈", title:"Equity & IPOs",         desc:"Participate in blockchain-native IPOs and tokenized equity raises — starting from EUR 100.",                       href:"/equity-ipo", color:"#818cf8"  },
  { icon:"💰", title:"Digital Bonds",         desc:"Green, corporate, municipal, and convertible bonds with digital issuance and real-time progress tracking.",        href:"/bonds",      color:"#38bdf8"  },
  { icon:"🔄", title:"Secondary Exchange",   desc:"Trade tokenized assets peer-to-peer on our regulated secondary market with T+0 blockchain settlement.",            href:"/exchange",   color:"#fb923c"  },
  { icon:"🚀", title:"Tokenize Your Assets", desc:"Issue bonds, equity, or real estate tokens to 12,400+ verified global investors in as little as 4 weeks.",        href:"/tokenize",   color:"#f87171"  },
];

const steps = [
  { n:"01", icon:"🪪", t:"Create Account",       b:"Register free and complete identity verification via Sumsub. Takes under 5 minutes for most investors." },
  { n:"02", icon:"🔍", t:"Browse Opportunities", b:"Explore tokenized bonds, equity, real estate, and energy assets across 180+ countries." },
  { n:"03", icon:"💳", t:"Invest Digitally",     b:"Subscribe from EUR 100. Receive ERC-3643 compliant security tokens directly to your wallet." },
  { n:"04", icon:"📊", t:"Track and Trade",      b:"Monitor your portfolio in real time and trade on the secondary exchange for liquidity." },
];

const testimonials = [
  { name:"Sarah M.",   role:"Family Office, London",      flag:"🇬🇧", text:"Nextoken gave us access to tokenized real estate deals that were previously only available to large institutions. The compliance framework is excellent." },
  { name:"Arjun P.",   role:"Retail Investor, Singapore", flag:"🇸🇬", text:"Onboarding took less than 10 minutes. I invested in a Baltic green bond and received my tokens immediately. The platform is incredibly intuitive." },
  { name:"Klaus W.",   role:"Asset Manager, Frankfurt",   flag:"🇩🇪", text:"We tokenized a EUR 5M commercial property portfolio in under 6 weeks. ERC-3643 compliance and investor whitelisting worked flawlessly." },
  { name:"Fatima A.",  role:"Investor, Dubai",            flag:"🇦🇪", text:"Finally a regulated platform where I can access European real estate and green bonds from the UAE. The structure gave us full confidence." },
];

const liveAssets = [
  { emoji:"🌱", name:"Baltic Green Bond 2027",   type:"Green Bond",    roi:"6.4%",  min:"EUR 500",   pct:72, hot:false },
  { emoji:"⚡", name:"VoltGrid Energy IPO",      type:"Blockchain IPO",roi:"28.4%", min:"EUR 100",   pct:87, hot:true  },
  { emoji:"🏢", name:"Berlin Office Token",      type:"Real Estate",   roi:"16.4%", min:"EUR 500",   pct:78, hot:false },
  { emoji:"🤖", name:"NeuroLogic AI Series A",  type:"Early Stage",   roi:"34.2%", min:"EUR 500",   pct:61, hot:false },
];

const regions = [
  { flag:"🇪🇺", name:"European Union",  note:"MiCA · Bank of Lithuania", color:"#818cf8" },
  { flag:"🇸🇬", name:"Singapore",       note:"MAS Compatible",            color:"#22c55e" },
  { flag:"🇦🇪", name:"UAE / Dubai",     note:"DIFC · ADGM",              color:"#F0B90B" },
  { flag:"🇬🇧", name:"United Kingdom",  note:"FCA Aligned",              color:"#38bdf8" },
  { flag:"🇺🇸", name:"United States",   note:"Reg D · Reg S",            color:"#a78bfa" },
  { flag:"🇮🇳", name:"India",           note:"GIFT City IFSC",            color:"#fb923c" },
  { flag:"🇨🇭", name:"Switzerland",     note:"FINMA · DLT Act",          color:"#f87171" },
  { flag:"🇭🇰", name:"Hong Kong",       note:"SFC Licensed",             color:"#4ade80" },
];

export default function HomePage() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(p => (p+1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={S.page}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes glow   { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .pulse   { animation: pulse  2s infinite; }
        .glow    { animation: glow   4s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .float   { animation: float  6s ease-in-out infinite; }
        .feat-card:hover  { border-color:rgba(240,185,11,0.4) !important; transform:translateY(-4px) !important; }
        .asset-card:hover { border-color:rgba(240,185,11,0.4) !important; transform:translateY(-3px) !important; }
        .step-card:hover  { border-color:rgba(240,185,11,0.25) !important; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#05060a; }
        ::-webkit-scrollbar-thumb { background:rgba(240,185,11,0.3); border-radius:3px; }
      \`}</style>

      {/* ── HERO ── */}
      <div style={{ position:"relative", minHeight:"95vh", display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"120px 32px 80px", overflow:"hidden" }}>

        {/* BG Glows */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div className="glow" style={{ position:"absolute", top:"-15%", left:"50%", transform:"translateX(-50%)", width:900, height:700, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(240,185,11,0.13) 0%,transparent 65%)" }} />
          <div style={{ position:"absolute", bottom:"5%", left:"8%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(99,102,241,0.07) 0%,transparent 70%)" }} />
          <div style={{ position:"absolute", top:"30%", right:"5%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(34,197,94,0.05) 0%,transparent 70%)" }} />
          {/* Grid */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.025 }}>
            <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0L0 0 0 60" fill="none" stroke="#F0B90B" strokeWidth="1"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div style={{ position:"relative", zIndex:1, maxWidth:920 }} className="fade-up">

          {/* Badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 18px", borderRadius:20, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11.5, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:30 }}>
            <span className="pulse" style={{ width:8, height:8, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
            Regulated · MiCA Compliant · Bank of Lithuania
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(42px,7.5vw,88px)", fontWeight:900, lineHeight:1.01, letterSpacing:"-3px", color:"#e8e8f0", margin:"0 0 26px" }}>
            The Future of<br />
            <span style={{ color:"#F0B90B", position:"relative" }}>
              Capital Markets
              <svg style={{ position:"absolute", bottom:-6, left:0, width:"100%", height:5, opacity:0.5 }} viewBox="0 0 400 5">
                <path d="M0 2.5 Q100 0 200 2.5 Q300 5 400 2.5" stroke="#F0B90B" strokeWidth="2.5" fill="none"/>
              </svg>
            </span>
            <br />Is Tokenized
          </h1>

          <p style={{ fontSize:"clamp(16px,2.2vw,20px)", fontWeight:300, color:"#8a9bb8", maxWidth:680, margin:"0 auto 48px", lineHeight:1.8 }}>
            Nextoken Capital is the regulated infrastructure for tokenized real-world assets — bonds, equity, real estate, and energy — open to investors in 180+ countries from as little as EUR 100.
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:56 }}>
            <Link href="/register" style={S.gold}>Start Investing — Free</Link>
            <Link href="/markets"  style={S.out}>Explore Markets</Link>
          </div>

          {/* Trust Badges */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:16, justifyContent:"center", opacity:0.55 }}>
            {["🏦 Bank of Lithuania","⚖️ MiCA Compliant","🔐 ERC-3643","🛡 ISO 27001","🪪 Sumsub KYC","🌍 FATF Aligned"].map(b => (
              <span key={b} style={{ fontSize:12.5, color:"#8a9bb8", fontWeight:600 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STAT STRIP ── */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#0d0d14" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap" }}>
          {stats.map((s,i,arr) => (
            <div key={s.l} style={{ flex:1, minWidth:130, padding:"30px 20px", textAlign:"center", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.07)":"none" }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, color:"#F0B90B", marginBottom:5 }}>{s.v}</div>
              <div style={{ fontSize:12, color:"#8a9bb8" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={S.sec}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <span style={S.lbl}>What You Can Access</span>
          <h2 style={{ ...S.h2, maxWidth:640, margin:"0 auto 16px" }}>One Platform. Every Asset Class.</h2>
          <p style={{ fontSize:16, color:"#8a9bb8", maxWidth:560, margin:"0 auto", lineHeight:1.75 }}>
            From real estate to green bonds — institutional-grade investments previously reserved for the ultra-wealthy, starting from EUR 100.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:18 }}>
          {features.map(f => (
            <Link key={f.title} href={f.href} className="feat-card"
              style={{ ...S.card, textDecoration:"none", display:"block" }}>
              <div style={{ width:56, height:56, borderRadius:14, background:"rgba(240,185,11,0.08)", border:"1px solid rgba(240,185,11,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:f.color, marginBottom:8 }}>{f.title}</h3>
              <p style={{ fontSize:13.5, color:"#8a9bb8", lineHeight:1.7, marginBottom:14 }}>{f.desc}</p>
              <span style={{ fontSize:13, color:"#F0B90B", fontWeight:600 }}>Explore →</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <span style={S.lbl}>Getting Started</span>
            <h2 style={{ ...S.h2, margin:"0 auto 14px" }}>Invest in 4 Simple Steps</h2>
            <p style={{ fontSize:16, color:"#8a9bb8", maxWidth:480, margin:"0 auto", lineHeight:1.75 }}>
              From registration to your first tokenized investment in under 15 minutes.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:18 }}>
            {steps.map(s => (
              <div key={s.n} className="step-card"
                style={{ ...S.card, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:12, right:16, fontFamily:"Syne,sans-serif", fontSize:48, fontWeight:900, color:"rgba(240,185,11,0.05)", lineHeight:1 }}>{s.n}</div>
                <div style={{ width:52, height:52, borderRadius:14, background:"rgba(240,185,11,0.10)", border:"1px solid rgba(240,185,11,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:16 }}>{s.icon}</div>
                <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#e8e8f0", marginBottom:8 }}>{s.t}</h4>
                <p style={{ fontSize:13.5, color:"#8a9bb8", lineHeight:1.7, margin:0 }}>{s.b}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:44 }}>
            <Link href="/register" style={S.gold}>Create Free Account →</Link>
          </div>
        </div>
      </div>

      {/* ── LIVE ASSETS ── */}
      <div style={S.sec}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16, marginBottom:36 }}>
          <div>
            <span style={S.lbl}>Live Now</span>
            <h2 style={{ ...S.h2, margin:0 }}>Featured Investments</h2>
          </div>
          <Link href="/markets" style={{ fontSize:14, color:"#F0B90B", fontWeight:600, textDecoration:"none" }}>View all opportunities →</Link>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16 }}>
          {liveAssets.map(a => (
            <div key={a.name} className="asset-card"
              style={{ ...S.card, cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <span style={{ fontSize:32 }}>{a.emoji}</span>
                <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:a.hot?"rgba(239,68,68,0.10)":"rgba(34,197,94,0.10)", color:a.hot?"#f87171":"#22c55e", border:"1px solid "+(a.hot?"rgba(239,68,68,0.25)":"rgba(34,197,94,0.25)") }}>
                  {a.hot ? "🔥 Hot" : "● Live"}
                </span>
              </div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#e8e8f0", marginBottom:3 }}>{a.name}</div>
              <div style={{ fontSize:12, color:"#8a9bb8", marginBottom:14 }}>{a.type}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:12, background:"rgba(255,255,255,0.025)", borderRadius:10, marginBottom:12 }}>
                <div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:800, color:"#F0B90B" }}>{a.roi}</div>
                  <div style={{ fontSize:10.5, color:"#8a9bb8" }}>Target ROI</div>
                </div>
                <div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#e8e8f0" }}>{a.min}</div>
                  <div style={{ fontSize:10.5, color:"#8a9bb8" }}>Min. Invest</div>
                </div>
              </div>
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11.5, color:"#8a9bb8", marginBottom:5 }}>
                  <span>Funded</span>
                  <span style={{ color:"#e8e8f0", fontWeight:600 }}>{a.pct}%</span>
                </div>
                <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ width:a.pct+"%", height:"100%", background:"linear-gradient(90deg,#F0B90B,#fcd34d)", borderRadius:3 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GLOBAL REACH ── */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
            <div>
              <span style={S.lbl}>Global Infrastructure</span>
              <h2 style={S.h2}>Built for Investors Everywhere</h2>
              <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.8, marginBottom:28 }}>
                Nextoken operates across 180+ countries with regulatory frameworks covering EU, UK, US, UAE, Singapore, India, and beyond. Our compliance infrastructure enables any verified investor to access institutional-grade opportunities — regardless of where they are.
              </p>
              {[
                { icon:"⚖️", t:"MiCA & Bank of Lithuania",     d:"Fully regulated under EU law." },
                { icon:"🔐", t:"ERC-3643 Token Standard",      d:"On-chain KYC/AML enforcement on every transfer." },
                { icon:"🌍", t:"FATF & Travel Rule Compliant",  d:"Cross-border AML. VASP registered globally." },
                { icon:"🪪", t:"Sumsub KYC — 180+ Countries",  d:"Automated identity verification for all investors." },
              ].map(item => (
                <div key={item.t} style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:"rgba(240,185,11,0.10)", border:"1px solid rgba(240,185,11,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:"#e8e8f0", margin:"0 0 2px" }}>{item.t}</p>
                    <p style={{ fontSize:12.5, color:"#8a9bb8", margin:0 }}>{item.d}</p>
                  </div>
                </div>
              ))}
              <Link href="/compliance" style={{ ...S.out, marginTop:12, display:"inline-block" }}>View Compliance →</Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {regions.map(r => (
                <div key={r.name} style={{ ...S.card, padding:16, display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:26, flexShrink:0 }}>{r.flag}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:r.color, marginBottom:2 }}>{r.name}</div>
                    <div style={{ fontSize:11, color:"#8a9bb8" }}>{r.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={S.sec}>
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <span style={S.lbl}>Investor Stories</span>
          <h2 style={{ ...S.h2, margin:"0 auto" }}>Trusted by Investors Worldwide</h2>
        </div>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <div style={{ background:"#0d0d14", border:"1px solid rgba(240,185,11,0.2)", borderRadius:20, padding:"44px 40px", textAlign:"center", minHeight:200, position:"relative" }}>
            <div style={{ position:"absolute", top:20, left:28, fontSize:52, color:"rgba(240,185,11,0.12)", fontFamily:"serif", lineHeight:1 }}>"</div>
            <p style={{ fontSize:17, color:"#b0b7c3", lineHeight:1.8, marginBottom:28, position:"relative", zIndex:1, fontWeight:300 }}>
              {testimonials[testimonialIdx].text}
            </p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
              <span style={{ fontSize:28 }}>{testimonials[testimonialIdx].flag}</span>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:"#e8e8f0" }}>{testimonials[testimonialIdx].name}</div>
                <div style={{ fontSize:12.5, color:"#8a9bb8" }}>{testimonials[testimonialIdx].role}</div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:18 }}>
            {testimonials.map((_,i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)}
                style={{ width:i===testimonialIdx?24:8, height:8, borderRadius:4, border:"none", background:i===testimonialIdx?"#F0B90B":"rgba(255,255,255,0.15)", cursor:"pointer", transition:"all 0.3s" }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── FOR ISSUERS ── */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { icon:"🏢", t:"Real Estate",   v:"EUR 500K+", l:"Min. Asset"     },
                { icon:"📈", t:"Equity IPO",    v:"4 Weeks",   l:"Time to Launch" },
                { icon:"💰", t:"Bonds",         v:"EUR 250K+", l:"Min. Issuance"  },
                { icon:"⚡", t:"Energy",        v:"70%",       l:"Cost Reduction" },
                { icon:"🌍", t:"Reach",         v:"180+",      l:"Countries"      },
                { icon:"👥", t:"Investors",     v:"12,400+",   l:"Verified"       },
              ].map(item => (
                <div key={item.t} style={{ ...S.card, textAlign:"center", padding:20 }}>
                  <div style={{ fontSize:26, marginBottom:8 }}>{item.icon}</div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:800, color:"#F0B90B", marginBottom:2 }}>{item.v}</div>
                  <div style={{ fontSize:11, color:"#8a9bb8" }}>{item.l}</div>
                </div>
              ))}
            </div>
            <div>
              <span style={S.lbl}>For Asset Issuers</span>
              <h2 style={S.h2}>Raise Capital From the World</h2>
              <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.8, marginBottom:24 }}>
                Tokenize your real estate, equity, bonds, or energy assets and distribute them to 12,400+ verified investors across 180+ countries — on regulated, compliant infrastructure.
              </p>
              {[
                "Launch in 4-12 weeks depending on asset type",
                "ERC-3643 tokens with built-in KYC/AML enforcement",
                "Real-time cap table and on-chain investor registry",
                "70% lower cost vs traditional securitization",
                "Secondary market listing for investor liquidity",
              ].map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <span style={{ width:20, height:20, borderRadius:"50%", background:"rgba(240,185,11,0.12)", border:"1px solid rgba(240,185,11,0.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"#F0B90B", fontSize:11, fontWeight:800, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:13.5, color:"#b0b7c3" }}>{item}</span>
                </div>
              ))}
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:28 }}>
                <Link href="/tokenize"      style={S.gold}>Tokenize Your Assets</Link>
                <Link href="/institutional" style={S.out}>Institutional Access</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div style={{ padding:"100px 32px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 900px 700px at 50% 50%,rgba(240,185,11,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:720, margin:"0 auto" }}>
          <span style={S.lbl}>Get Started Today</span>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(34px,5.5vw,64px)", fontWeight:900, lineHeight:1.06, letterSpacing:"-1.5px", color:"#e8e8f0", margin:"0 0 20px" }}>
            The World's Assets<br /><span style={{ color:"#F0B90B" }}>Are Going On-Chain.</span>
          </h2>
          <p style={{ fontSize:17, color:"#8a9bb8", fontWeight:300, maxWidth:540, margin:"0 auto 44px", lineHeight:1.8 }}>
            Join 12,400+ investors and 100+ issuers already building the future of capital markets on Nextoken Capital's regulated infrastructure.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:24 }}>
            <Link href="/register"      style={S.gold}>Create Free Account</Link>
            <Link href="/institutional" style={S.out}>Institutional Access</Link>
          </div>
          <p style={{ fontSize:12.5, color:"#8a9bb8", opacity:0.7 }}>
            No minimum to register · KYC in under 5 minutes · Regulated by Bank of Lithuania
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"64px 32px 32px", background:"#080810" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:48 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <span style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:900, color:"#F0B90B", letterSpacing:2 }}>NXT</span>
                <div style={{ width:1, height:22, background:"rgba(240,185,11,0.25)" }} />
                <div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:13, fontWeight:800, letterSpacing:"0.2em", color:"#F0B90B" }}>NEXTOKEN</div>
                  <div style={{ fontSize:9, letterSpacing:"0.2em", color:"#8a9bb8", textTransform:"uppercase" }}>CAPITAL</div>
                </div>
              </div>
              <p style={{ fontSize:13, color:"#8a9bb8", maxWidth:260, lineHeight:1.75, marginBottom:18 }}>
                The regulated infrastructure for tokenized real-world assets. Connecting investors and issuers across 180+ countries.
              </p>
              <p style={{ fontSize:11, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:14 }}>
                MONITORED BY <a href="#" style={{ color:"#F0B90B", textDecoration:"none" }}>Bank of Lithuania</a>
              </p>
              <div style={{ display:"flex", gap:8 }}>
                {["Twitter","LinkedIn","Telegram"].map(s => (
                  <span key={s} style={{ padding:"5px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)", fontSize:11.5, color:"#8a9bb8", cursor:"pointer" }}>{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8", marginBottom:16 }}>Products</h5>
              {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"],["Learn","/learn"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13.5, color:"#b0b7c3", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8", marginBottom:16 }}>Company</h5>
              {[["About Us","/about"],["Institutional","/institutional"],["Compliance","/compliance"],["Careers","/careers"],["Blog","/blog"],["Press","/press"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13.5, color:"#b0b7c3", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8", marginBottom:16 }}>Legal & Support</h5>
              {[["Terms of Service","/terms"],["Privacy Policy","/privacy"],["Risk Disclosure","/risk"],["AML Policy","/aml"],["Help Center","/help"],["Contact Us","/contact"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13.5, color:"#b0b7c3", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:24, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:12 }}>
            <p style={{ fontSize:12, color:"#8a9bb8", margin:0 }}>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
            <p style={{ fontSize:11.5, color:"#8a9bb8", opacity:0.65, margin:0, maxWidth:500 }}>
              Risk warning: Investing in tokenized assets involves significant risk. Past performance is not indicative of future results. Not available to US persons except under applicable exemptions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync("pages/index.js", code, "utf8");
console.log("Done! pages/index.js — " + code.length + " chars");