const fs = require("fs");

const code = `import Link from "next/link";
import { useState } from "react";

const S = {
  page:  { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  sec:   { maxWidth:1200, margin:"0 auto", padding:"72px 32px" },
  h2:    { fontFamily:"Syne,sans-serif", fontSize:"clamp(26px,4vw,44px)", fontWeight:800, color:"#e8e8f0", margin:"0 0 14px", letterSpacing:"-0.5px" },
  lbl:   { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:10, display:"block" },
  sub:   { fontSize:16, color:"#8a9bb8", fontWeight:300, maxWidth:620, lineHeight:1.75, margin:"0 0 40px" },
  card:  { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:28 },
  gold:  { padding:"13px 30px", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  out:   { padding:"13px 30px", borderRadius:10, background:"transparent", color:"#F0B90B", fontSize:14, fontWeight:600, border:"1px solid rgba(240,185,11,0.35)", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  badge: { display:"inline-flex", alignItems:"center", gap:8, padding:"5px 16px", borderRadius:20, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" },
};

const timeline = [
  { year:"2021", t:"The Idea",          d:"Bikash Bhat identifies the gap: trillions in real-world assets locked away from everyday investors due to high minimums, intermediaries, and geographic restrictions." },
  { year:"2022", t:"Research & Build",  d:"18 months of deep research into ERC-3643, MiCA regulations, and institutional tokenization. First smart contract prototypes developed and tested." },
  { year:"2023", t:"Legal Foundation",  d:"Nextoken Capital UAB incorporated in Vilnius, Lithuania. Regulatory engagement with Bank of Lithuania begins. Legal and compliance framework established." },
  { year:"2024", t:"Platform Launch",   d:"Beta platform launched with first tokenized bond offerings. KYC/AML integration with Sumsub completed. First 500 investors onboarded." },
  { year:"2025", t:"Scaling Globally",  d:"EUR 140M+ in assets tokenized. 12,400+ verified investors across 30+ countries. Institutional partnerships established in Singapore, UAE, and UK." },
  { year:"2026", t:"Global Expansion",  d:"Full MiCA compliance achieved. Exchange launched for secondary trading. Expanding to 180+ countries with institutional access tiers." },
];

const values = [
  { icon:"🔐", t:"Compliance First",    d:"Every product decision starts with regulatory compliance. We believe the future of finance requires trust, and trust requires regulation." },
  { icon:"🌍", t:"Global by Design",    d:"Built from day one for 180+ countries. No geographic bias — every investor deserves access to the same institutional-grade opportunities." },
  { icon:"🔍", t:"Radical Transparency",d:"On-chain audit trails, real-time fundraising progress, and public smart contract code. We hide nothing." },
  { icon:"⚡", t:"Technology Forward",  d:"We believe blockchain is not hype — it is infrastructure. T+0 settlement, on-chain cap tables, and programmable compliance are the future." },
  { icon:"🏛", t:"Institutional Grade", d:"We hold ourselves to the standards of the world's most regulated financial institutions, not the minimum viable compliance of a startup." },
  { icon:"🤝", t:"Investor First",      d:"Our business model aligns with investor success. We succeed when our investors access better opportunities, lower costs, and greater returns." },
];

const team = [
  {
    name:  "Bikash Bhat",
    role:  "CEO & Founder",
    photo: "/bikash.png",
    bio:   "Visionary entrepreneur and fintech innovator behind Nextoken Capital. Bikash built Nextoken with a mission to democratize access to institutional-grade real-world asset investments for everyone — from retail investors in Vilnius to family offices in Singapore.",
    links: { linkedin:"#", twitter:"#" },
    tags:  ["Fintech","Tokenization","Regulatory Strategy","Capital Markets"],
    location: "Vilnius, Lithuania",
  },
];

export default function AboutPage() {
  const [activeYear, setActiveYear] = useState(null);

  return (
    <div style={S.page}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse { animation: pulse 2s infinite; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#05060a; }
        ::-webkit-scrollbar-thumb { background:rgba(240,185,11,0.3); border-radius:3px; }
      \`}</style>

      {/* HERO */}
      <div style={{ position:"relative", padding:"96px 32px 72px", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 900px 500px at 50% -40px,rgba(240,185,11,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ ...S.badge, marginBottom:26 }}>
          <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
          Our Story
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,6vw,72px)", fontWeight:800, lineHeight:1.04, letterSpacing:"-2px", color:"#e8e8f0", maxWidth:860, margin:"0 auto 22px" }}>
          We Are Building the<br /><span style={{ color:"#F0B90B" }}>Future of Capital Markets</span>
        </h1>
        <p style={{ fontSize:18, fontWeight:300, color:"#8a9bb8", maxWidth:660, margin:"0 auto 40px", lineHeight:1.75 }}>
          Nextoken Capital is a regulated fintech platform headquartered in Vilnius, Lithuania — on a mission to tokenize the world's real-world assets and make them accessible to every investor on the planet.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <Link href="/register" style={S.gold}>Join the Platform</Link>
          <Link href="/contact"  style={S.out}>Get in Touch</Link>
        </div>
      </div>

      {/* STATS */}
      <div style={{ margin:"0 32px", borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#0d0d14", display:"flex", flexWrap:"wrap" }}>
        {[{v:"2021",l:"Founded"},{v:"EUR 140M+",l:"Assets Tokenized"},{v:"12,400+",l:"Investors"},{v:"180+",l:"Countries"},{v:"Vilnius",l:"Headquarters"},{v:"Bank of Lithuania",l:"Regulator"}].map((s,i,arr) => (
          <div key={s.l} style={{ flex:1, minWidth:120, padding:"24px 20px", textAlign:"center", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.07)":"none" }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:s.v.length > 8 ? 14 : 22, fontWeight:800, color:"#F0B90B" }}>{s.v}</div>
            <div style={{ fontSize:11, color:"#8a9bb8", marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* MISSION */}
      <div style={S.sec}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          <div>
            <span style={S.lbl}>Our Mission</span>
            <h2 style={S.h2}>Democratizing Access to Real-World Asset Investment</h2>
            <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.85, marginBottom:20 }}>
              For decades, the most lucrative investment opportunities — commercial real estate, infrastructure projects, private equity, and institutional bonds — have been locked away behind high minimums, complex legal structures, and geographic restrictions.
            </p>
            <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.85, marginBottom:20 }}>
              Nextoken Capital was built to change that. By tokenizing real-world assets on regulated blockchain infrastructure, we reduce the minimum investment from hundreds of thousands of euros to as little as EUR 100 — while maintaining full legal compliance.
            </p>
            <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.85, marginBottom:32 }}>
              Our platform connects investors in 180+ countries with verified asset issuers — from Baltic real estate developers to Singapore infrastructure funds — through a single, transparent, on-chain platform.
            </p>
            <Link href="/markets" style={S.gold}>Explore Opportunities →</Link>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[
              { icon:"🏢", t:"EUR 100",         l:"Minimum Investment",  color:"#F0B90B"  },
              { icon:"🌍", t:"180+",            l:"Countries Supported", color:"#22c55e"  },
              { icon:"⚖️", t:"MiCA",            l:"EU Regulated",        color:"#818cf8"  },
              { icon:"🔐", t:"ERC-3643",        l:"Token Standard",      color:"#38bdf8"  },
              { icon:"⚡", t:"T+0",             l:"Settlement",          color:"#fbbf24"  },
              { icon:"📊", t:"On-Chain",        l:"Cap Table",           color:"#f87171"  },
            ].map(item => (
              <div key={item.t} style={{ ...S.card, textAlign:"center", padding:20 }}>
                <div style={{ fontSize:26, marginBottom:8 }}>{item.icon}</div>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:800, color:item.color, marginBottom:2 }}>{item.t}</div>
                <div style={{ fontSize:11, color:"#8a9bb8" }}>{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CEO SECTION */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <span style={S.lbl}>Leadership</span>
          <h2 style={{ ...S.h2, marginBottom:40 }}>Meet the Founder</h2>

          <div style={{ display:"grid", gridTemplateColumns:"360px 1fr", gap:48, alignItems:"flex-start" }}>

            {/* CEO Photo Card */}
            <div style={{ position:"sticky", top:80 }}>
              <div style={{ ...S.card, border:"1px solid rgba(240,185,11,0.25)", overflow:"hidden", padding:0 }}>
                {/* Photo */}
                <div style={{ position:"relative", background:"linear-gradient(135deg,rgba(240,185,11,0.1) 0%,rgba(99,102,241,0.08) 100%)", padding:"32px 32px 0" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#F0B90B,#fcd34d)" }} />
                  <img
                    src="/bikash.png"
                    alt="Bikash Bhat — CEO & Founder, Nextoken Capital"
                    style={{ width:"100%", maxWidth:280, margin:"0 auto", display:"block", borderRadius:"12px 12px 0 0", objectFit:"cover", aspectRatio:"3/4" }}
                  />
                </div>

                {/* Info */}
                <div style={{ padding:"24px 28px 28px" }}>
                  <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:"#e8e8f0", margin:"0 0 4px" }}>Bikash Bhat</h3>
                  <p style={{ fontSize:14, color:"#F0B90B", fontWeight:600, marginBottom:4 }}>CEO & Founder</p>
                  <p style={{ fontSize:12.5, color:"#8a9bb8", marginBottom:16 }}>📍 Vilnius, Lithuania</p>

                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
                    {["Fintech","Tokenization","RWA","Capital Markets","DeFi"].map(tag => (
                      <span key={tag} style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:"rgba(240,185,11,0.08)", color:"#F0B90B", border:"1px solid rgba(240,185,11,0.2)" }}>{tag}</span>
                    ))}
                  </div>

                  <div style={{ display:"flex", gap:8 }}>
                    <a href="#" style={{ flex:1, textAlign:"center", padding:"9px 0", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.03)", color:"#b0b7c3", fontSize:12.5, fontWeight:600, textDecoration:"none" }}>
                      LinkedIn →
                    </a>
                    <a href="#" style={{ flex:1, textAlign:"center", padding:"9px 0", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.03)", color:"#b0b7c3", fontSize:12.5, fontWeight:600, textDecoration:"none" }}>
                      Twitter →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CEO Bio */}
            <div>
              <div style={{ ...S.card, border:"1px solid rgba(240,185,11,0.15)", marginBottom:20 }}>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#8a9bb8", margin:"0 0 14px" }}>About Bikash</p>
                <p style={{ fontSize:15.5, color:"#b0b7c3", lineHeight:1.85, marginBottom:16 }}>
                  Bikash Bhat is the founder and CEO of Nextoken Capital UAB — a regulated financial technology company headquartered in Vilnius, Lithuania, dedicated to tokenizing real-world assets for a global investor base.
                </p>
                <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.85, marginBottom:16 }}>
                  With a deep passion for financial inclusion and blockchain technology, Bikash founded Nextoken with a singular vision: to break down the walls between everyday investors and institutional-grade investment opportunities that were previously accessible only to the ultra-wealthy.
                </p>
                <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.85, marginBottom:16 }}>
                  Under his leadership, Nextoken has grown to serve 12,400+ verified investors across 180+ countries, tokenized over EUR 140M in real-world assets, and established direct regulatory supervision from the Bank of Lithuania — one of the most respected financial regulators in the EU.
                </p>
                <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.85 }}>
                  Bikash is a vocal advocate for MiCA compliance, ERC-3643 token standards, and the responsible democratization of capital markets through regulated blockchain infrastructure.
                </p>
              </div>

              {/* Quote */}
              <div style={{ ...S.card, border:"1px solid rgba(240,185,11,0.2)", background:"rgba(240,185,11,0.04)", marginBottom:20, position:"relative" }}>
                <div style={{ position:"absolute", top:14, left:22, fontSize:52, color:"rgba(240,185,11,0.12)", fontFamily:"Georgia,serif", lineHeight:1 }}>"</div>
                <p style={{ fontSize:17, color:"#e8e8f0", lineHeight:1.8, fontStyle:"italic", paddingTop:16, paddingLeft:8 }}>
                  The world's assets are going on-chain. Our job is to make sure that happens safely, transparently, and with full regulatory compliance — so that every investor, regardless of geography or wealth, can participate in the future of capital markets.
                </p>
                <p style={{ fontSize:13, color:"#F0B90B", fontWeight:700, marginTop:14 }}>— Bikash Bhat, CEO &amp; Founder, Nextoken Capital</p>
              </div>

              {/* Key achievements */}
              <div style={{ ...S.card }}>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#8a9bb8", margin:"0 0 16px" }}>Key Achievements</p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { icon:"🏦", t:"Founded Nextoken Capital UAB",               d:"Registered and regulated financial technology company in Vilnius, Lithuania." },
                    { icon:"⚖️", t:"Secured Bank of Lithuania Supervision",       d:"Established direct regulatory relationship and MiCA compliance framework." },
                    { icon:"🌍", t:"Expanded to 180+ Countries",                  d:"Built global KYC/AML infrastructure supporting investors from every major jurisdiction." },
                    { icon:"💰", t:"Tokenized EUR 140M+ in Real-World Assets",    d:"Oversaw tokenization of real estate, energy, equity, and bond offerings." },
                    { icon:"🔐", t:"Implemented ERC-3643 Compliance Stack",       d:"Deployed institutional-grade on-chain compliance across all token issuances." },
                    { icon:"🚀", t:"Launched Secondary Exchange",                 d:"Built the Nextoken Exchange for peer-to-peer secondary trading of tokenized securities." },
                  ].map(item => (
                    <div key={item.t} style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:"rgba(240,185,11,0.10)", border:"1px solid rgba(240,185,11,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{item.icon}</div>
                      <div>
                        <p style={{ fontSize:14, fontWeight:700, color:"#e8e8f0", margin:"0 0 3px" }}>{item.t}</p>
                        <p style={{ fontSize:12.5, color:"#8a9bb8", margin:0 }}>{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div style={S.sec}>
        <span style={S.lbl}>Our Journey</span>
        <h2 style={{ ...S.h2, marginBottom:48 }}>From Idea to Global Platform</h2>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:59, top:0, bottom:0, width:1, background:"linear-gradient(180deg,transparent,rgba(240,185,11,0.3) 10%,rgba(240,185,11,0.3) 90%,transparent)" }} />
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {timeline.map((item, i) => (
              <div key={item.year}
                onClick={() => setActiveYear(activeYear === i ? null : i)}
                style={{ display:"flex", gap:32, alignItems:"flex-start", cursor:"pointer", padding:"20px 0" }}>
                {/* Year bubble */}
                <div style={{ width:118, flexShrink:0, display:"flex", alignItems:"center", gap:18 }}>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:800, color:activeYear===i?"#F0B90B":"#8a9bb8", textAlign:"right", flex:1 }}>{item.year}</div>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:activeYear===i?"#F0B90B":"#0d0d14", border:"2px solid "+(activeYear===i?"#F0B90B":"rgba(240,185,11,0.3)"), flexShrink:0, transition:"all 0.2s", zIndex:1 }} />
                </div>
                {/* Content */}
                <div style={{ flex:1, paddingBottom:8 }}>
                  <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:activeYear===i?"#F0B90B":"#e8e8f0", marginBottom:6, transition:"color 0.2s" }}>{item.t}</h4>
                  <p style={{ fontSize:14, color:"#8a9bb8", lineHeight:1.75, margin:0 }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VALUES */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <span style={S.lbl}>What We Stand For</span>
          <h2 style={S.h2}>Our Core Values</h2>
          <p style={S.sub}>Six principles that guide every product decision, regulatory interaction, and investor relationship at Nextoken Capital.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
            {values.map(v => (
              <div key={v.t}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(240,185,11,0.3)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="none"; }}
                style={{ ...S.card, transition:"all 0.2s", cursor:"default" }}>
                <div style={{ fontSize:30, marginBottom:14 }}>{v.icon}</div>
                <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#F0B90B", marginBottom:8 }}>{v.t}</h4>
                <p style={{ fontSize:13.5, color:"#8a9bb8", lineHeight:1.7 }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOCATION */}
      <div style={S.sec}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
          <div>
            <span style={S.lbl}>Headquarters</span>
            <h2 style={S.h2}>Based in Vilnius,<br />Heart of the Baltic</h2>
            <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.85, marginBottom:20 }}>
              Nextoken Capital UAB is registered and headquartered in Vilnius, Lithuania — one of Europe's fastest-growing fintech hubs and home to a deep talent pool of blockchain, legal, and financial engineering expertise.
            </p>
            <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.85, marginBottom:28 }}>
              Lithuania's progressive regulatory environment, direct EU membership, and the Bank of Lithuania's proactive approach to digital asset regulation make it the ideal base for building a globally compliant tokenization platform.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { icon:"🏛", t:"Nextoken Capital UAB",             d:"Company registration number: in Lithuania" },
                { icon:"📍", t:"Vilnius, Lithuania",               d:"European Union · GMT+3 · EU Member State" },
                { icon:"⚖️", t:"Bank of Lithuania",                d:"Primary financial regulator and supervisor" },
                { icon:"🇪🇺", t:"EU Passporting Rights",           d:"Licensed to operate across all 27 EU member states" },
              ].map(item => (
                <div key={item.t} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <span style={{ fontSize:18, flexShrink:0, marginTop:2 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize:13.5, fontWeight:700, color:"#e8e8f0", margin:"0 0 2px" }}>{item.t}</p>
                    <p style={{ fontSize:12.5, color:"#8a9bb8", margin:0 }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...S.card, border:"1px solid rgba(240,185,11,0.15)", overflow:"hidden", padding:0 }}>
            <div style={{ background:"linear-gradient(135deg,rgba(240,185,11,0.08) 0%,rgba(99,102,241,0.06) 100%)", padding:32, textAlign:"center" }}>
              <div style={{ fontSize:64, marginBottom:12 }}>🇱🇹</div>
              <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#e8e8f0", marginBottom:6 }}>Vilnius, Lithuania</h3>
              <p style={{ fontSize:14, color:"#F0B90B", fontWeight:600, marginBottom:12 }}>European Union · Baltic Region</p>
              <p style={{ fontSize:13, color:"#8a9bb8", lineHeight:1.7 }}>
                One of the EU's leading fintech jurisdictions with progressive digital asset regulation and direct access to all European financial markets.
              </p>
            </div>
            <div style={{ padding:"20px 28px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              {[
                { l:"Time Zone",    v:"EET (UTC+2/+3)"  },
                { l:"Regulator",    v:"Bank of Lithuania"},
                { l:"Currency",     v:"EUR (Euro)"      },
                { l:"EU Member",    v:"Since 2004"       },
                { l:"Fin. Hub Rank",v:"Top 10 EU"       },
              ].map(item => (
                <div key={item.l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize:13, color:"#8a9bb8" }}>{item.l}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:"#e8e8f0" }}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin:"0 32px 64px", borderRadius:20, padding:"72px 48px", textAlign:"center", position:"relative", overflow:"hidden", border:"1px solid rgba(240,185,11,0.25)", background:"linear-gradient(135deg,rgba(240,185,11,0.08) 0%,rgba(99,102,241,0.06) 100%)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 700px 400px at 50% 0%,rgba(240,185,11,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <span style={S.lbl}>Join Us</span>
          <h2 style={{ ...S.h2, marginBottom:14 }}>Be Part of the<br />Tokenization Revolution</h2>
          <p style={{ fontSize:16, color:"#8a9bb8", fontWeight:300, maxWidth:520, margin:"0 auto 36px", lineHeight:1.75 }}>
            Whether you are an investor looking for better returns or an issuer looking to raise global capital — Nextoken Capital is built for you.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/register" style={S.gold}>Create Free Account</Link>
            <Link href="/contact"  style={S.out}>Contact Bikash's Team</Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"48px 32px 28px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:48, marginBottom:40 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <span style={{ fontFamily:"Syne,sans-serif", fontSize:20, fontWeight:900, color:"#F0B90B", letterSpacing:2 }}>NXT</span>
                <div style={{ width:1, height:22, background:"rgba(240,185,11,0.25)" }} />
                <div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:13, fontWeight:800, letterSpacing:"0.15em", color:"#F0B90B" }}>NEXTOKEN</div>
                  <div style={{ fontSize:9, letterSpacing:"0.2em", color:"#8a9bb8", textTransform:"uppercase" }}>CAPITAL</div>
                </div>
              </div>
              <p style={{ fontSize:13, color:"#8a9bb8", maxWidth:260, lineHeight:1.75, marginBottom:16 }}>The regulated infrastructure for tokenized real-world assets. Registered in Lithuania.</p>
              <p style={{ fontSize:11, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em" }}>MONITORED BY <a href="#" style={{ color:"#F0B90B", textDecoration:"none" }}>Bank of Lithuania</a></p>
            </div>
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8", marginBottom:16 }}>Products</h5>
              {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13, color:"#b0b7c3", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8", marginBottom:16 }}>Company</h5>
              {[["About Us","/about"],["Institutional","/institutional"],["Compliance","/compliance"],["Careers","/careers"],["Blog","/blog"],["Contact","/contact"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13, color:"#b0b7c3", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:20, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:10 }}>
            <p style={{ fontSize:12, color:"#8a9bb8", margin:0 }}>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
            <p style={{ fontSize:11, color:"#8a9bb8", opacity:0.6, margin:0 }}>Tokenized assets involve risk. Capital at risk. Regulated by Bank of Lithuania.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync("pages/about.js", code, "utf8");
console.log("Done! pages/about.js — " + code.length + " chars");
console.log("Bikash photo at /bikash.png is referenced — already in public folder");