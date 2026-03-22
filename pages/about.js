import Link from "next/link";
import { useState } from "react";

const S = {
  page:  { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  sec:   { maxWidth:1200, margin:"0 auto", padding:"72px 32px" },
  h2:    { fontFamily:"Syne,sans-serif", fontSize:"clamp(26px,4vw,44px)", fontWeight:800, color:"#e8e8f0", margin:"0 0 14px", letterSpacing:"-0.5px" },
  lbl:   { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:10, display:"block" },
  sub:   { fontSize:16, color:"#8a9bb8", fontWeight:300, maxWidth:620, lineHeight:1.75, margin:"0 0 44px" },
  card:  { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:28, transition:"all 0.2s" },
  gold:  { padding:"13px 30px", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  out:   { padding:"13px 30px", borderRadius:10, background:"transparent", color:"#F0B90B", fontSize:14, fontWeight:600, border:"1px solid rgba(240,185,11,0.35)", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  badge: { display:"inline-flex", alignItems:"center", gap:8, padding:"5px 16px", borderRadius:20, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" },
};

const team = [
  {
    initials:"BB", color:"#F0B90B", bg:"rgba(240,185,11,0.15)", photo:"/bikash.jpg",
    name:"Bikash Bhat",
    role:"CEO & Founder",
    location:"Vilnius, Lithuania",
    bio:"Serial fintech entrepreneur with 10+ years building regulated financial infrastructure. Previously led digital asset strategy at two European investment banks. Passionate about democratizing access to institutional-grade investments through blockchain technology.",
    tags:["Fintech","Tokenization","RWA","Capital Markets","DeFi"],
    linkedin:"#", twitter:"#",
  },
  {
    initials:"AK", color:"#818cf8", bg:"rgba(129,140,248,0.15)",
    name:"Anna Kowalski",
    role:"Chief Compliance Officer",
    location:"Warsaw, Poland",
    bio:"Former regulatory counsel at the European Securities and Markets Authority (ESMA). Expert in MiCA, FATF compliance, and digital asset regulation across EU, UK, and US jurisdictions. Oversees all licensing and regulatory relationships.",
    tags:["MiCA","Regulatory","AML/KYC","ESMA","ERC-3643"],
    linkedin:"#", twitter:"#",
  },
  {
    initials:"MT", color:"#22c55e", bg:"rgba(34,197,94,0.15)",
    name:"Marcus Teller",
    role:"Chief Technology Officer",
    location:"Berlin, Germany",
    bio:"Blockchain architect with deep expertise in ERC-3643, Layer 2 scaling, and DeFi infrastructure. Previously built tokenization platforms for two Fortune 500 financial institutions. Leads all smart contract development and platform security.",
    tags:["Solidity","ERC-3643","Web3","Smart Contracts","Security"],
    linkedin:"#", twitter:"#",
  },
  {
    initials:"SN", color:"#38bdf8", bg:"rgba(56,189,248,0.15)",
    name:"Sofia Nakamura",
    role:"Head of Institutional Sales",
    location:"Singapore",
    bio:"Former VP at a leading Singapore sovereign wealth fund. 12+ years originating institutional investment opportunities across APAC. Leads relationships with family offices, hedge funds, and asset managers across Asia, Middle East, and Europe.",
    tags:["Institutional","APAC","Sales","Family Offices","Hedge Funds"],
    linkedin:"#", twitter:"#",
  },
  {
    initials:"DR", color:"#f87171", bg:"rgba(248,113,113,0.15)",
    name:"David Rosenberg",
    role:"Head of Asset Origination",
    location:"Tel Aviv, Israel",
    bio:"Real estate and infrastructure dealmaker with EUR 800M+ in completed tokenized transactions. Specialized in identifying and structuring institutional-grade RWA opportunities across real estate, energy, and private credit sectors.",
    tags:["Real Estate","Infrastructure","Deal Sourcing","RWA","Private Credit"],
    linkedin:"#", twitter:"#",
  },
  {
    initials:"LP", color:"#fb923c", bg:"rgba(251,146,60,0.15)",
    name:"Laura Petersen",
    role:"Head of Investor Relations",
    location:"Copenhagen, Denmark",
    bio:"Former investment director at a leading Nordic family office. Expert in investor onboarding, portfolio management, and building long-term institutional relationships. Oversees all investor communications and reporting.",
    tags:["Investor Relations","Nordic","Family Offices","Portfolio","Reporting"],
    linkedin:"#", twitter:"#",
  },
];

const milestones = [
  { year:"2021", t:"Founded",               d:"Nextoken Capital UAB incorporated in Vilnius, Lithuania by Bikash Bhat." },
  { year:"2022", t:"Regulatory License",     d:"Received VASP registration from Bank of Lithuania. First regulated tokenization license in the Baltics." },
  { year:"2022", t:"First Tokenization",     d:"Completed first tokenized real estate offering — EUR 2.4M commercial property in Riga, Latvia." },
  { year:"2023", t:"ERC-3643 Adoption",      d:"Migrated entire token infrastructure to ERC-3643 standard. First Baltic platform to achieve full on-chain compliance." },
  { year:"2023", t:"Series A Funding",       d:"Raised EUR 4.2M Series A led by Nordic fintech venture fund to accelerate global expansion." },
  { year:"2024", t:"MiCA Compliance",        d:"Achieved full MiCA compliance ahead of EU regulatory deadline. Obtained CASP license upgrade." },
  { year:"2024", t:"Global Expansion",       d:"Launched investor access in 50+ new countries including Singapore, UAE, India, and Australia." },
  { year:"2025", t:"EUR 100M Milestone",     d:"Surpassed EUR 100M in total assets tokenized across real estate, energy, bonds, and equity." },
  { year:"2026", t:"12,400+ Investors",      d:"Platform reaches 12,400+ verified investors across 180+ countries. Secondary exchange launched." },
];

const values = [
  { icon:"⚖️", t:"Compliance First",     d:"We built regulation into our foundation — not as an afterthought. Every product decision starts with 'is this compliant?'" },
  { icon:"🌍", t:"Truly Global",          d:"We believe great investment opportunities should be accessible to investors everywhere — not just those with the right connections." },
  { icon:"🔐", t:"Transparent by Design", d:"On-chain transparency means investors can verify everything — ownership, transfers, compliance, and performance — independently." },
  { icon:"🤝", t:"Investor First",        d:"Every feature we build is measured by one question: does this make investing safer, simpler, or more rewarding for our investors?" },
  { icon:"🚀", t:"Innovation with Purpose",d:"We apply cutting-edge blockchain technology only where it creates genuine value — not just for the sake of technology." },
  { icon:"🏛", t:"Institutional Grade",    d:"We hold ourselves to the standards of top-tier financial institutions because our investors deserve nothing less." },
];

function TeamCard({ member }) {
  const [hov, setHov] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:"#0d0d14", border:"1px solid "+(hov?"rgba(240,185,11,0.35)":"rgba(255,255,255,0.07)"), borderRadius:18, overflow:"hidden", transition:"all 0.25s", transform:hov?"translateY(-4px)":"none", boxShadow:hov?"0 20px 60px rgba(0,0,0,0.4)":"none" }}>

      {/* Photo / Gradient Header */}
      <div style={{ position:"relative", height:280, background:member.photo && !imgErr ? "#111" : "linear-gradient(135deg,"+member.bg+" 0%,rgba(5,5,8,0.8) 100%)", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {member.photo && !imgErr ? (
          <img src={member.photo} alt={member.name}
            onError={() => setImgErr(true)}
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center center", display:"block" }} />
        ) : (
          <span style={{ fontFamily:"Syne,sans-serif", fontSize:64, fontWeight:900, color:member.color, opacity:0.6 }}>{member.initials}</span>
        )}
        {/* Bottom fade */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:100, background:"linear-gradient(transparent,#0d0d14)" }} />
        {/* Role badge */}
        <div style={{ position:"absolute", top:14, right:14, padding:"4px 12px", borderRadius:20, background:"rgba(5,5,8,0.75)", border:"1px solid "+member.color+"55", backdropFilter:"blur(8px)" }}>
          <span style={{ fontSize:11, fontWeight:700, color:member.color }}>{member.role}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:"20px 22px 22px" }}>
        <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:19, fontWeight:800, color:"#e8e8f0", margin:"0 0 4px" }}>{member.name}</h3>
        <p style={{ fontSize:12.5, color:"#8a9bb8", margin:"0 0 14px" }}>📍 {member.location}</p>
        <p style={{ fontSize:13.5, color:"#8a9bb8", lineHeight:1.7, margin:"0 0 16px" }}>{member.bio}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
          {member.tags.map(t => (
            <span key={t} style={{ padding:"4px 11px", borderRadius:20, fontSize:11, fontWeight:600, background:"rgba(255,255,255,0.05)", color:"#8a9bb8", border:"1px solid rgba(255,255,255,0.08)" }}>{t}</span>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <a href={member.linkedin}
            onMouseEnter={e => { e.currentTarget.style.background=member.color; e.currentTarget.style.color="#000"; e.currentTarget.style.borderColor=member.color; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#8a9bb8"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}
            style={{ flex:1, textAlign:"center", padding:"9px 0", borderRadius:9, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#8a9bb8", fontSize:12.5, textDecoration:"none", fontWeight:600, transition:"all 0.15s" }}>LinkedIn</a>
          <a href={member.twitter}
            onMouseEnter={e => { e.currentTarget.style.background=member.color; e.currentTarget.style.color="#000"; e.currentTarget.style.borderColor=member.color; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#8a9bb8"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}
            style={{ flex:1, textAlign:"center", padding:"9px 0", borderRadius:9, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#8a9bb8", fontSize:12.5, textDecoration:"none", fontWeight:600, transition:"all 0.15s" }}>Twitter</a>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
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
      `}</style>

      {/* HERO */}
      <div style={{ position:"relative", padding:"96px 32px 72px", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 900px 500px at 50% -40px,rgba(240,185,11,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ ...S.badge, marginBottom:26 }}>
          <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
          Our Story
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,6vw,72px)", fontWeight:800, lineHeight:1.04, letterSpacing:"-2px", color:"#e8e8f0", maxWidth:860, margin:"0 auto 22px" }}>
          Building the Future of<br /><span style={{ color:"#F0B90B" }}>Global Capital Markets</span>
        </h1>
        <p style={{ fontSize:18, fontWeight:300, color:"#8a9bb8", maxWidth:680, margin:"0 auto 40px", lineHeight:1.75 }}>
          Nextoken Capital was founded in Vilnius, Lithuania in 2021 with one mission: to democratize access to institutional-grade real-world asset investments through regulated blockchain infrastructure — for investors anywhere in the world.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <Link href="/register"  style={S.gold}>Join the Platform</Link>
          <Link href="/tokenize"  style={S.out}>Tokenize Assets</Link>
        </div>
      </div>

      {/* STATS */}
      <div style={{ margin:"0 32px", borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#0d0d14", display:"flex", flexWrap:"wrap" }}>
        {[{v:"2021",l:"Founded"},{v:"EUR 140M+",l:"Assets Tokenized"},{v:"12,400+",l:"Investors"},{v:"180+",l:"Countries"},{v:"6",l:"Team Members"},{v:"MiCA",l:"EU Regulated"}].map((s,i,arr) => (
          <div key={s.l} style={{ flex:1, minWidth:110, padding:"24px 16px", textAlign:"center", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.07)":"none" }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#F0B90B" }}>{s.v}</div>
            <div style={{ fontSize:11, color:"#8a9bb8", marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* MISSION */}
      <div style={S.sec}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          <div>
            <span style={S.lbl}>Our Mission</span>
            <h2 style={S.h2}>Capital Markets for Everyone, Everywhere</h2>
            <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.8, marginBottom:20 }}>
              For too long, the best investment opportunities — institutional real estate, private equity, green infrastructure bonds — have been locked behind the doors of private banking relationships and million-dollar minimums.
            </p>
            <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.8, marginBottom:20 }}>
              We built Nextoken Capital to change that. Using blockchain technology and regulatory-grade compliance infrastructure, we make it possible for any verified investor — whether they are in Vilnius, Singapore, Dubai, or São Paulo — to access the same opportunities as a London hedge fund.
            </p>
            <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.8, marginBottom:32 }}>
              We are regulated by the Bank of Lithuania, MiCA compliant, and built on ERC-3643 — because democratizing access means nothing if it is not done properly.
            </p>
            <Link href="/compliance" style={S.out}>Our Compliance Framework →</Link>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[
              { icon:"🌍", t:"180+ Countries",    v:"Global investor access from day one" },
              { icon:"⚖️", t:"MiCA Compliant",    v:"EU regulated, investor protected"    },
              { icon:"🔐", t:"ERC-3643",          v:"On-chain compliance enforcement"     },
              { icon:"💰", t:"EUR 100 Minimum",   v:"No millionaire requirements"         },
              { icon:"🏦", t:"Institutional Grade",v:"Same deals, open to all"            },
              { icon:"🪪", t:"Sumsub KYC",        v:"180+ country identity verification"  },
            ].map(item => (
              <div key={item.t} style={{ ...S.card, padding:20 }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{item.icon}</div>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:4 }}>{item.t}</div>
                <div style={{ fontSize:12, color:"#8a9bb8", lineHeight:1.5 }}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VALUES */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <span style={S.lbl}>What We Stand For</span>
            <h2 style={{ ...S.h2, margin:"0 auto" }}>Our Core Values</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
            {values.map(v => (
              <div key={v.t}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(240,185,11,0.3)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="none"; }}
                style={{ ...S.card }}>
                <div style={{ fontSize:32, marginBottom:14 }}>{v.icon}</div>
                <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#F0B90B", marginBottom:8 }}>{v.t}</h4>
                <p style={{ fontSize:13.5, color:"#8a9bb8", lineHeight:1.7 }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TEAM */}
      <div style={S.sec}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <span style={S.lbl}>The Team</span>
          <h2 style={{ ...S.h2, margin:"0 auto 16px" }}>Meet the People Building Nextoken</h2>
          <p style={{ fontSize:16, color:"#8a9bb8", maxWidth:560, margin:"0 auto", lineHeight:1.75 }}>
            A global team of fintech veterans, compliance experts, blockchain engineers, and institutional finance professionals — united by a shared mission.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:20 }}>
          {team.map(member => <TeamCard key={member.name} member={member} />)}
        </div>
      </div>

      {/* TIMELINE */}
      <div style={{ background:"#080810", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={S.sec}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <span style={S.lbl}>Our Journey</span>
            <h2 style={{ ...S.h2, margin:"0 auto" }}>Company Timeline</h2>
          </div>
          <div style={{ position:"relative", maxWidth:800, margin:"0 auto" }}>
            <div style={{ position:"absolute", left:79, top:0, bottom:0, width:2, background:"linear-gradient(180deg,transparent,rgba(240,185,11,0.3) 10%,rgba(240,185,11,0.3) 90%,transparent)" }} />
            {milestones.map((m,i) => (
              <div key={m.year+m.t} style={{ display:"flex", gap:24, marginBottom:32, alignItems:"flex-start" }}>
                <div style={{ width:80, textAlign:"right", flexShrink:0 }}>
                  <span style={{ fontFamily:"Syne,sans-serif", fontSize:13, fontWeight:800, color:"#F0B90B" }}>{m.year}</span>
                </div>
                <div style={{ width:18, height:18, borderRadius:"50%", background:"#F0B90B", flexShrink:0, marginTop:2, border:"3px solid #05060a", position:"relative", zIndex:1 }} />
                <div style={{ flex:1, paddingBottom:8 }}>
                  <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#e8e8f0", marginBottom:4 }}>{m.t}</h4>
                  <p style={{ fontSize:13.5, color:"#8a9bb8", lineHeight:1.65, margin:0 }}>{m.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OFFICE */}
      <div style={S.sec}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
          <div>
            <span style={S.lbl}>Where We Are</span>
            <h2 style={S.h2}>Headquartered in Vilnius, Lithuania</h2>
            <p style={{ fontSize:15, color:"#8a9bb8", lineHeight:1.8, marginBottom:24 }}>
              We are based in Vilnius — one of Europe's fastest-growing fintech hubs and home to the Bank of Lithuania's regulatory sandbox. Our EU base gives us passporting rights across all 27 member states while keeping us close to leading blockchain talent and regulatory expertise.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
              {[
                { icon:"🏢", t:"Nextoken Capital UAB",   d:"Gedimino pr. 20, Vilnius, Lithuania LT-01103" },
                { icon:"📧", t:"General Inquiries",       d:"hello@nextokencapital.com" },
                { icon:"⚖️", t:"Compliance",             d:"compliance@nextokencapital.com" },
                { icon:"🤝", t:"Institutional Sales",    d:"institutional@nextokencapital.com" },
                { icon:"📰", t:"Press & Media",          d:"press@nextokencapital.com" },
              ].map(item => (
                <div key={item.t} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <span style={{ fontSize:18, flexShrink:0, marginTop:2 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:"#e8e8f0", margin:"0 0 2px" }}>{item.t}</p>
                    <p style={{ fontSize:12.5, color:"#8a9bb8", margin:0 }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/contact" style={S.gold}>Contact Us →</Link>
          </div>
          <div style={{ ...S.card, border:"1px solid rgba(240,185,11,0.2)", padding:32 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <span style={{ fontSize:28 }}>🇱🇹</span>
              <div>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#F0B90B" }}>Vilnius, Lithuania</div>
                <div style={{ fontSize:12, color:"#8a9bb8" }}>EU · Bank of Lithuania Supervised</div>
              </div>
            </div>
            <div style={{ height:200, borderRadius:12, background:"linear-gradient(135deg,rgba(240,185,11,0.08) 0%,rgba(99,102,241,0.05) 100%)", border:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, opacity:0.05 }}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs><pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#F0B90B" strokeWidth="0.5"/></pattern></defs>
                  <rect width="100%" height="100%" fill="url(#g)" />
                </svg>
              </div>
              <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
                <div style={{ fontSize:48, marginBottom:8 }}>📍</div>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#e8e8f0" }}>Gedimino pr. 20</div>
                <div style={{ fontSize:13, color:"#8a9bb8" }}>Vilnius LT-01103</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[{v:"CET+1",l:"Time Zone"},{v:"EU",l:"Jurisdiction"},{v:"LT",l:"Reg. Country"},{v:"UAB",l:"Entity Type"}].map(s => (
                <div key={s.l} style={{ padding:12, borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", textAlign:"center" }}>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#F0B90B" }}>{s.v}</div>
                  <div style={{ fontSize:11, color:"#8a9bb8", marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin:"0 32px 64px", borderRadius:20, padding:"72px 48px", textAlign:"center", position:"relative", overflow:"hidden", border:"1px solid rgba(240,185,11,0.25)", background:"linear-gradient(135deg,rgba(240,185,11,0.08) 0%,rgba(99,102,241,0.05) 100%)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 700px 400px at 50% 0%,rgba(240,185,11,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <span style={S.lbl}>Join Us</span>
          <h2 style={{ ...S.h2, marginBottom:14 }}>Be Part of the Story</h2>
          <p style={{ fontSize:16, color:"#8a9bb8", fontWeight:300, maxWidth:500, margin:"0 auto 36px", lineHeight:1.75 }}>
            Whether you are an investor, issuer, or looking to join our team — we would love to hear from you.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/register" style={S.gold}>Start Investing</Link>
            <Link href="/careers"  style={S.out}>View Open Roles</Link>
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
            </div>
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8", marginBottom:16 }}>Products</h5>
              {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13, color:"#b0b7c3", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
            <div>
              <h5 style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8", marginBottom:16 }}>Company</h5>
              {[["About Us","/about"],["Careers","/careers"],["Press","/press"],["Contact","/contact"],["Compliance","/compliance"]].map(([l,h]) => (
                <Link key={l} href={h} style={{ display:"block", fontSize:13, color:"#b0b7c3", textDecoration:"none", marginBottom:10 }}>{l}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:20, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:10 }}>
            <p style={{ fontSize:12, color:"#8a9bb8", margin:0 }}>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
            <p style={{ fontSize:11, color:"#8a9bb8", opacity:0.6, margin:0 }}>Nextoken Capital UAB is supervised by the Bank of Lithuania.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
