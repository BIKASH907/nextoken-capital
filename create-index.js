const fs = require("fs");

const code = `import Link from "next/link";
import { useState, useEffect } from "react";

const stats = [
  { v:"EUR 140M+", l:"Assets Tokenized"    },
  { v:"12,400+",   l:"Verified Investors"  },
  { v:"180+",      l:"Countries Supported" },
  { v:"ERC-3643",  l:"Token Standard"      },
  { v:"T+0",       l:"Settlement"          },
  { v:"MiCA",      l:"EU Regulated"        },
];

const features = [
  { icon:"🏢", title:"Real Estate",         desc:"Fractional ownership of commercial, residential, and industrial properties across global markets.",       href:"/markets"    },
  { icon:"⚡", title:"Energy & Green",      desc:"Invest in solar, wind, and infrastructure projects with transparent on-chain yield distributions.",       href:"/markets"    },
  { icon:"📈", title:"Equity & IPOs",       desc:"Participate in blockchain-native IPOs and tokenized equity raises with ERC-3643 compliance.",            href:"/equity-ipo" },
  { icon:"💰", title:"Digital Bonds",       desc:"Access corporate, green, municipal, and convertible bonds with digital issuance and real-time tracking.", href:"/bonds"      },
  { icon:"🔄", title:"Secondary Exchange",  desc:"Trade tokenized assets peer-to-peer on the Nextoken regulated secondary market with T+0 settlement.",    href:"/exchange"   },
  { icon:"🚀", title:"Tokenize Assets",     desc:"Issue bonds, equity, or real estate tokens to a global network of 12,400+ verified investors.",           href:"/tokenize"   },
];

const steps = [
  { n:"01", icon:"🪪", t:"Create Account",      b:"Sign up and complete KYC identity verification via Sumsub. Takes under 5 minutes." },
  { n:"02", icon:"🔍", t:"Browse Opportunities", b:"Explore tokenized bonds, equity, real estate, and energy assets from verified global issuers." },
  { n:"03", icon:"💳", t:"Invest Digitally",     b:"Subscribe to opportunities starting from EUR 100. Receive ERC-3643 compliant security tokens." },
  { n:"04", icon:"📊", t:"Track & Trade",        b:"Monitor your portfolio in real time. Trade on the secondary market or hold for yield distributions." },
];

const testimonials = [
  { name:"Sarah M.",     role:"Family Office, London",       text:"Nextoken gave us access to tokenized real estate deals that were previously only available to large institutions. The compliance framework is excellent.",  flag:"🇬🇧" },
  { name:"Arjun P.",     role:"Retail Investor, Singapore",  text:"The onboarding took less than 10 minutes. I invested in a Baltic green bond and received my tokens immediately. The platform is incredibly intuitive.",       flag:"🇸🇬" },
  { name:"Klaus W.",     role:"Asset Manager, Frankfurt",    text:"We tokenized a EUR 5M commercial property portfolio through Nextoken in under 6 weeks. The ERC-3643 compliance and investor whitelisting worked flawlessly.", flag:"🇩🇪" },
  { name:"Fatima A.",    role:"Investor, Dubai",             text:"Finally a regulated platform where I can access European real estate and green bonds from the UAE. The Reg D compliant structure gave us full confidence.",       flag:"🇦🇪" },
];

const logos = ["🏦 Bank of Lithuania","⚖️ MiCA Compliant","🔐 ERC-3643","🛡 ISO 27001","🪪 Sumsub KYC","🌍 FATF Compliant"];

const S = {
  page:  { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  sec:   { maxWidth:1200, margin:"0 auto", padding:"80px 32px" },
  h2:    { fontFamily:"Syne,sans-serif", fontSize:"clamp(28px,4vw,46px)", fontWeight:800, color:"#e8e8f0", margin:"0 0 14px", letterSpacing:"-0.5px" },
  lbl:   { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:10, display:"block" },
  sub:   { fontSize:16, color:"#8a9bb8", fontWeight:300, maxWidth:600, lineHeight:1.75, margin:"0 0 48px" },
  card:  { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:28, transition:"all 0.2s" },
  gold:  { padding:"14px 32px", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:15, fontWeight:800, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  out:   { padding:"14px 32px", borderRadius:10, background:"transparent", color:"#F0B90B", fontSize:15, fontWeight:600, border:"1px solid rgba(240,185,11,0.4)", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  badge: { display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:20, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" },
};

function Counter({ target, suffix="" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = parseFloat(target.replace(/[^0-9.]/g,""));
    const duration = 2000;
    const steps = 60;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  const prefix = target.startsWith("EUR") ? "EUR " : "";
  const display = prefix + count.toLocaleString() + suffix;
  return <span>{display}</span>;
}

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [countersStarted, setCountersStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCountersStarted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={S.page}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow     { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .pulse  { animation: pulse 2s infinite; }
        .float  { animation: float 6s ease-in-out infinite; }
        .fade-up{ animation: fadeUp 0.6s ease both; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#05060a; }
        ::-webkit-scrollbar-thumb { background:rgba(240,185,11,0.3); border-radius:3px; }
        .feature-card:hover { border-color:rgba(240,185,11,0.35) !important; transform:translateY(-4px) !important; }
        .step-card:hover { border-color:rgba(240,185,11,0.25) !important; }
      \`}</style>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={{ position:"relative", minHeight:"92vh", display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"120px 32px 80px", overflow:"hidden" }}>

        {/* Background glows */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:"-10%", left:"50%", transform:"translateX(-50%)", width:800, height:600, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(240,185,11,0.15) 0%,transparent 70%)", animation:"glow 4s ease-in-out infinite" }} />
          <div style={{ position:"absolute", bottom:"10%", left:"10%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(99,102,241,0.08) 0%,transparent 70%)" }} />
          <div style={{ position:"absolute", bottom:"20%", right:"5%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(34,197,94,0.06) 0%,transparent 70%)" }} />
          {/* Grid lines */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.03 }} xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F0B90B" strokeWidth="1"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div style={{ position:"relative", zIndex:1, maxWidth:900, margin:"0 auto" }}>
          <div style={{ ...S.badge, marginBottom:28 }}>
            <span className="pulse" style={{ width:8, height:8, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
            Regulated · MiCA Compliant · Bank of Lithuania
          </div>

          <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(40px,7vw,82px)", fontWeight:900, lineHeight:1.02, letterSpacing:"-2.5px", color:"#e8e8f0", margin:"0 0 24px" }}>
            The Future of<br />
            <span style={{ color:"#F0B90B", position:"relative" }}>
              Capital Markets
              <svg style={{ position:"absolute", bottom:-8, left:0, width:"100%", height:6, opacity:0.4 }} viewBox="0 0 400 6" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 3 Q100 0 200 3 Q300 6 400 3" stroke="#F0B90B" strokeWidth="2.5" fill="none"/>
              </svg>
            </span>
            <br />Is Tokenized
          </h1>

          <p style={{ fontSize:"clamp(16px,2.2vw,20px)", fontWeight:300, color:"#8a9bb8", maxWidth:680, margin:"0 auto 44px", lineHeight:1.75 }}>
            Nextoken Capital is the regulated infrastructure for tokenized real-world assets — connecting investors in 180+ countries with bonds, equity, real estate, and energy investments through blockchain-native technology.
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:56 }}>
            <Link href="/register" style={S.gold}>Start Investing — Free</Link>
            <Link href="/markets"  style={S.out}>Explore Markets</Link>
          </div>

          {/* Trust row */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:20, justifyContent:"center", opacity:0.6 }}>
            {logos.map(l => (
              <span key={l} style={{ fontSize:12.5, color:"#8a9bb8", fontWeight:600 }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Floating cards */}
        <div className="float" style={{ position:"absolute", left:"3%", top:"30%", background:"#0d0d14", border:"1px solid rgba(240,185,11,0.2)", borderRadius:14, padding:"14px 18px", display:"none" }}>
          <div style={{ fontSize:11, color:"#8a9bb8", marginBottom:4 }}>Latest Investment</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#F0B90B" }}>Solar Farm +18.2%</div>
        </div>
      </div>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#0d0d14" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap" }}>
          {stats.map((s,i,arr) => (
            <div key={s.l} style={{ flex:1, minWidth:130, padding:"28px 20px", textAlign:"center", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.07)":"none" }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, color:"#F0B90B", marginBottom:4 }}>
                {countersStarted ? <Counter target={s.v} /> : s.v}
              </div>
              <div style={{ fontSize:12, color:"#8a9bb8" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <div style={S.sec}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <span style={S.lbl}>What You Can Access</span>
          <h2 style={{ ...S.h2, maxWidth:600, margin:"0 auto 16px" }}>One Platform. Every Asset Class.</h2>
          <p style={{ fontSize:16, color:"#8a9bb8", maxWidth:560, margin:"0 auto", lineHeight:1.75 }}>
            From real estate to green bonds — access institutional-grade investments previously reserved for the ultra-wealthy, starting from EUR 100.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:18 }}>
          {features.map(f => (
            <Link key={f.title} href={f.href} className="feature-card"
              style={{ ...S.card, textDecoration:"none", cursor:"pointer", display:"block" }}>
              <div style={{ fontSize:34, marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#e8e8f0", marginBottom:10 }}>{f.title}</h3>
              <p style={{ fontSize:13.5, color:"#8a9bb8", lineHeight:1.7, marginBottom:16 }}>{f.desc}</p>
              <span style={{ fontSize:13, color:"#F0B90B", fontWeight:600 }}>Explore →</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <span style={S.lbl}>Getting Started</span>
            <h2 style={{ ...S.h2, margin:"0 auto 16px" }}>Invest in 4 Simple Steps</h2>
            <p style={{ fontSize:16, color:"#8a9bb8", maxWidth:520, margin:"0 auto", lineHeight:1.75 }}>
              From registration to your first tokenized investment in under 15 minutes.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
            {steps.map((s,i) => (
              <div key={s.n} className="step-card" style={{ ...S.card, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:16, right:16, fontFamily:"Syne,sans-serif", fontSize:42, fontWeight:900, color:"rgba(240,185,11,0.06)", lineHeight:1 }}>{s.n}</div>
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

      {/* ── GLOBAL REACH ─────────────────────────────────────── */}
      <div style={S.sec}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          <div>
            <span style={S.lbl}>Global Infrastructure</span>
            <h2 style={S.h2}>Built for Investors<br />Everywhere</h2>
            <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.8, marginBottom:28 }}>
              Nextoken Capital operates across 180+ countries with a regulatory framework that supports investors in the EU, UK, US, UAE, Singapore, India, and beyond.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:32 }}>
              {[
                { icon:"⚖️", t:"MiCA & Bank of Lithuania",    d:"Fully regulated under EU law. Compliant with Markets in Crypto-Assets Regulation." },
                { icon:"🔐", t:"ERC-3643 Token Standard",     d:"On-chain KYC/AML enforcement. Only whitelisted investors can hold or transfer tokens." },
                { icon:"🌍", t:"FATF & Travel Rule Compliant", d:"Cross-border AML compliance. VASP registered and reporting-ready globally." },
                { icon:"🪪", t:"Sumsub Identity Verification", d:"Automated KYC/AML for 180+ countries. Enhanced due diligence for institutional clients." },
              ].map(item => (
                <div key={item.t} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:"rgba(240,185,11,0.10)", border:"1px solid rgba(240,185,11,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:"#e8e8f0", margin:"0 0 3px" }}>{item.t}</p>
                    <p style={{ fontSize:12.5, color:"#8a9bb8", margin:0, lineHeight:1.6 }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/compliance" style={S.out}>View Compliance Framework →</Link>
          </div>

          {/* Region Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { flag:"🇪🇺", region:"European Union",   note:"MiCA · Bank of Lithuania", color:"#818cf8" },
              { flag:"🇸🇬", region:"Singapore",        note:"MAS Compatible",            color:"#22c55e" },
              { flag:"🇦🇪", region:"UAE / Dubai",      note:"DIFC · ADGM",              color:"#F0B90B" },
              { flag:"🇬🇧", region:"United Kingdom",   note:"FCA Aligned",              color:"#38bdf8" },
              { flag:"🇺🇸", region:"United States",    note:"Reg D · Reg S",            color:"#a78bfa" },
              { flag:"🇮🇳", region:"India",            note:"GIFT City IFSC",            color:"#fb923c" },
              { flag:"🇨🇭", region:"Switzerland",      note:"FINMA · DLT Act",          color:"#f87171" },
              { flag:"🇭🇰", region:"Hong Kong",        note:"SFC Licensed",             color:"#4ade80" },
            ].map(r => (
              <div key={r.region} style={{ ...S.card, padding:16, display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:28, flexShrink:0 }}>{r.flag}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:r.color, marginBottom:2 }}>{r.region}</div>
                  <div style={{ fontSize:11, color:"#8a9bb8" }}>{r.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ASSET SHOWCASE ───────────────────────────────────── */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <span style={S.lbl}>Live Opportunities</span>
            <h2 style={{ ...S.h2, margin:"0 auto 14px" }}>Featured Investments</h2>
            <p style={{ fontSize:15, color:"#8a9bb8", maxWidth:500, margin:"0 auto", lineHeight:1.75 }}>A snapshot of live tokenized investment opportunities available on Nextoken today.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16, marginBottom:36 }}>
            {[
              { emoji:"🌱", name:"Baltic Green Bond",      type:"Green Bond",    yield:"6.4%", min:"EUR 500",   risk:"Low",    status:"Live",    color:"#22c55e", pct:72 },
              { emoji:"⚡", name:"VoltGrid Energy IPO",    type:"Blockchain IPO",yield:"28.4%",min:"EUR 100",   risk:"Low",    status:"Hot",     color:"#ef4444", pct:87 },
              { emoji:"🏢", name:"Berlin Office Token",    type:"Real Estate",   yield:"16.4%",min:"EUR 500",   risk:"Low",    status:"Live",    color:"#22c55e", pct:78 },
              { emoji:"🤖", name:"NeuroLogic AI Series A", type:"Early Stage",   yield:"34.2%",min:"EUR 500",   risk:"Medium", status:"Live",    color:"#22c55e", pct:61 },
            ].map(asset => (
              <div key={asset.name}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(240,185,11,0.35)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="none"; }}
                style={{ ...S.card, cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <span style={{ fontSize:30 }}>{asset.emoji}</span>
                  <div style={{ display:"flex", gap:6 }}>
                    <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10.5, fontWeight:600, background:"rgba("+( asset.status==="Hot"?"239,68,68":"34,197,94" )+ ",0.10)", color:asset.color, border:"1px solid rgba("+(asset.status==="Hot"?"239,68,68":"34,197,94")+",0.25)" }}>{asset.status}</span>
                  </div>
                </div>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#e8e8f0", marginBottom:3 }}>{asset.name}</div>
                <div style={{ fontSize:12, color:"#8a9bb8", marginBottom:14 }}>{asset.type}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:12, background:"rgba(255,255,255,0.025)", borderRadius:10, marginBottom:12 }}>
                  <div><div style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#F0B90B" }}>{asset.yield}</div><div style={{ fontSize:10, color:"#8a9bb8" }}>Target ROI</div></div>
                  <div><div style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#e8e8f0" }}>{asset.min}</div><div style={{ fontSize:10, color:"#8a9bb8" }}>Min. Invest</div></div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#8a9bb8", marginBottom:4 }}>
                    <span>Funded</span><span style={{ color:"#e8e8f0", fontWeight:600 }}>{asset.pct}%</span>
                  </div>
                  <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ width:asset.pct+"%", height:"100%", background:"linear-gradient(90deg,#F0B90B,#fcd34d)", borderRadius:3 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center" }}>
            <Link href="/markets" style={S.gold}>View All Opportunities →</Link>
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <div style={S.sec}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <span style={S.lbl}>Investor Stories</span>
          <h2 style={{ ...S.h2, margin:"0 auto" }}>Trusted by Investors Worldwide</h2>
        </div>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <div style={{ ...S.card, border:"1px solid rgba(240,185,11,0.2)", padding:40, textAlign:"center", minHeight:180, position:"relative" }}>
            <div style={{ position:"absolute", top:20, left:28, fontSize:48, color:"rgba(240,185,11,0.15)", fontFamily:"serif", lineHeight:1 }}>"</div>
            <p style={{ fontSize:16, color:"#b0b7c3", lineHeight:1.8, marginBottom:24, position:"relative", zIndex:1 }}>
              {testimonials[activeTestimonial].text}
            </p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              <span style={{ fontSize:24 }}>{testimonials[activeTestimonial].flag}</span>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#e8e8f0" }}>{testimonials[activeTestimonial].name}</div>
                <div style={{ fontSize:12, color:"#8a9bb8" }}>{testimonials[activeTestimonial].role}</div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20 }}>
            {testimonials.map((_,i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                style={{ width:i===activeTestimonial?24:8, height:8, borderRadius:4, border:"none", background:i===activeTestimonial?"#F0B90B":"rgba(255,255,255,0.15)", cursor:"pointer", transition:"all 0.3s" }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── FOR ISSUERS ──────────────────────────────────────── */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
            <div>
              <span style={S.lbl}>For Asset Issuers</span>
              <h2 style={S.h2}>Raise Capital<br />From the World</h2>
              <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.8, marginBottom:28 }}>
                Tokenize your real estate, equity, bonds, or energy assets and distribute them to 12,400+ verified investors across 180+ countries — all on regulated, compliant infrastructure.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:36 }}>
                {[
                  "Launch in 4-12 weeks depending on asset type",
                  "ERC-3643 compliant tokens with built-in KYC/AML",
                  "Real-time cap table and investor registry on-chain",
                  "70% lower cost vs traditional securitization",
                  "Access to institutional, retail and global investors",
                  "Secondary market listing for investor liquidity",
                ].map(item => (
                  <div key={item} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ width:20, height:20, borderRadius:"50%", background:"rgba(240,185,11,0.15)", border:"1px solid rgba(240,185,11,0.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"#F0B90B", fontSize:11, fontWeight:800, flexShrink:0 }}>✓</span>
                    <span style={{ fontSize:13.5, color:"#b0b7c3" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <Link href="/tokenize"     style={S.gold}>Tokenize Your Assets</Link>
                <Link href="/institutional" style={S.out}>Institutional Access</Link>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {[
                { icon:"🏢", t:"Real Estate",  v:"EUR 500K+", l:"Min. Asset Size"  },
                { icon:"📈", t:"Equity IPO",   v:"4 Weeks",   l:"Time to Launch"   },
                { icon:"💰", t:"Bonds",        v:"EUR 250K+", l:"Min. Issuance"    },
                { icon:"⚡", t:"Energy",       v:"70%",       l:"Cost Reduction"   },
                { icon:"🌍", t:"Reach",        v:"180+",      l:"Countries"        },
                { icon:"👥", t:"Investors",    v:"12,400+",   l:"Verified Users"   },
              ].map(item => (
                <div key={item.t} style={{ ...S.card, textAlign:"center", padding:20 }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{item.icon}</div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:800, color:"#F0B90B", marginBottom:2 }}>{item.v}</div>
                  <div style={{ fontSize:11, color:"#8a9bb8" }}>{item.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <div style={{ padding:"100px 32px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 900px 600px at 50% 50%,rgba(240,185,11,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:700, margin:"0 auto" }}>
          <span style={S.lbl}>Get Started Today</span>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(32px,5vw,58px)", fontWeight:900, lineHeight:1.08, letterSpacing:"-1.5px", color:"#e8e8f0", margin:"0 0 20px" }}>
            The World's Assets<br /><span style={{ color:"#F0B90B" }}>Are Going On-Chain.</span>
          </h2>
          <p style={{ fontSize:17, color:"#8a9bb8", fontWeight:300, maxWidth:520, margin:"0 auto 44px", lineHeight:1.8 }}>
            Join 12,400+ investors and 100+ issuers already building the future of capital markets on Nextoken Capital's regulated infrastructure.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:28 }}>
            <Link href="/register"     style={S.gold}>Create Free Account</Link>
            <Link href="/institutional" style={S.out}>Institutional Access</Link>
          </div>
          <p style={{ fontSize:12, color:"#8a9bb8", opacity:0.7 }}>
            No minimum to register · KYC in under 5 minutes · Regulated by Bank of Lithuania
          </p>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"60px 32px 32px", background:"#080810" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:48 }}>
            {/* Brand */}
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
              <p style={{ fontSize:11, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                MONITORED BY <a href="#" style={{ color:"#F0B90B", textDecoration:"none" }}>Bank of Lithuania</a>
              </p>
              <div style={{ display:"flex", gap:10, marginTop:16 }}>
                {["Twitter","LinkedIn","Telegram"].map(s => (
                  <span key={s} style={{ padding:"6px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)", fontSize:11.5, color:"#8a9bb8", cursor:"pointer" }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8", marginBottom:16 }}>Products</h5>
              {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13.5, color:"#b0b7c3", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>

            {/* Company */}
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8", marginBottom:16 }}>Company</h5>
              {[["About Us","/about"],["Institutional","/institutional"],["Compliance","/compliance"],["Careers","/careers"],["Blog","/blog"],["Press","/press"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13.5, color:"#b0b7c3", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>

            {/* Legal & Support */}
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8", marginBottom:16 }}>Legal & Support</h5>
              {[["Terms of Service","/terms"],["Privacy Policy","/privacy"],["Risk Disclosure","/risk"],["AML Policy","/aml"],["Help Center","/help"],["Contact Us","/contact"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13.5, color:"#b0b7c3", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:24, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:12 }}>
            <p style={{ fontSize:12, color:"#8a9bb8", margin:0 }}>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania (VAT: LT000000000).</p>
            <p style={{ fontSize:11.5, color:"#8a9bb8", opacity:0.65, margin:0, maxWidth:500 }}>
              Risk warning: Investing in tokenized assets involves significant risk including loss of capital. Past performance is not indicative of future results. Not available to US persons except under applicable exemptions.
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