const fs = require("fs");
fs.mkdirSync("app/equity-ipo", { recursive: true });

const code = `"use client";
import { useState } from "react";
import Link from "next/link";

const S = {
  page:    { minHeight:"100vh", background:"#050508", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  nav:     { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:64, background:"rgba(5,5,8,0.95)", borderBottom:"1px solid rgba(255,255,255,0.08)", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(20px)" },
  section: { maxWidth:1200, margin:"0 auto", padding:"64px 32px" },
  h2:      { fontFamily:"Syne,sans-serif", fontSize:"clamp(26px,4vw,40px)", fontWeight:800, color:"#e8e8f0", margin:"0 0 12px", letterSpacing:"-0.5px" },
  label:   { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#d4af37", marginBottom:10, display:"block" },
  sub:     { fontSize:15, color:"#b0b0c8", fontWeight:300, maxWidth:560, lineHeight:1.7, margin:"0 0 32px" },
  card:    { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:24, transition:"all 0.2s", cursor:"pointer" },
  btnGold: { padding:"12px 28px", borderRadius:10, background:"#d4af37", color:"#000", fontSize:14, fontWeight:700, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block" },
  btnOut:  { padding:"12px 28px", borderRadius:10, background:"transparent", color:"#d4af37", fontSize:14, fontWeight:500, border:"1px solid rgba(212,175,55,0.35)", cursor:"pointer", textDecoration:"none", display:"inline-block" },
  badge:   { display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:20, border:"1px solid rgba(212,175,55,0.3)", background:"rgba(212,175,55,0.08)", color:"#d4af37", fontSize:11, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase" },
  filterBtn: (active) => ({ padding:"6px 14px", borderRadius:20, border:\`1px solid \${active?"rgba(212,175,55,0.5)":"rgba(255,255,255,0.08)"}\`, background: active?"rgba(212,175,55,0.12)":"transparent", color: active?"#d4af37":"#b0b0c8", fontSize:12.5, fontWeight:500, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }),
  sortBtn:   (active) => ({ padding:"6px 12px", borderRadius:8, border:\`1px solid \${active?"rgba(212,175,55,0.5)":"rgba(255,255,255,0.08)"}\`, background: active?"rgba(212,175,55,0.12)":"transparent", color: active?"#d4af37":"#7a7a96", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }),
};

const statusStyle = {
  live:     { background:"rgba(34,197,94,0.10)",  color:"#22c55e", border:"1px solid rgba(34,197,94,0.25)"  },
  hot:      { background:"rgba(239,68,68,0.10)",  color:"#f87171", border:"1px solid rgba(239,68,68,0.25)"  },
  closing:  { background:"rgba(212,175,55,0.10)", color:"#d4af37", border:"1px solid rgba(212,175,55,0.3)"  },
  upcoming: { background:"rgba(99,102,241,0.10)", color:"#818cf8", border:"1px solid rgba(99,102,241,0.3)"  },
};

const riskStyle = {
  low:    { color:"#22c55e" },
  medium: { color:"#f59e0b" },
  high:   { color:"#ef4444" },
};

const listings = [
  { id:1, emoji:"⚡", name:"VoltGrid Energy",      ticker:"VGE", subtype:"Blockchain IPO", type:"ipo",       risk:"low",    location:"Helsinki, Finland",      irr:"28.4%", min:"€100",   target:"€18M", raised:"€15.7M", pct:87, status:"hot",      sl:"🔥 Hot"          },
  { id:2, emoji:"🤖", name:"NeuroLogic AI",         ticker:"NLA", subtype:"Series A",      type:"early",     risk:"medium", location:"Tallinn, Estonia",       irr:"34.2%", min:"€500",   target:"€25M", raised:"€15.3M", pct:61, status:"live",     sl:"● Live"          },
  { id:3, emoji:"🏥", name:"MedCore Pharma",         ticker:"MCP", subtype:"ERC-3643",      type:"token",     risk:"low",    location:"Zurich, Switzerland",    irr:"19.8%", min:"€250",   target:"€40M", raised:"€29.6M", pct:74, status:"live",     sl:"● Live"          },
  { id:4, emoji:"🌊", name:"AquaTech Solutions",     ticker:"ATS", subtype:"Blockchain IPO", type:"ipo",      risk:"medium", location:"Amsterdam, Netherlands", irr:"22.1%", min:"€500",   target:"€12M", raised:"€11.2M", pct:93, status:"closing",  sl:"⏱ Closing Soon"  },
  { id:5, emoji:"🛸", name:"OrbitalX Space",         ticker:"ORB", subtype:"Seed Round",    type:"early",     risk:"high",   location:"Warsaw, Poland",         irr:"31.7%", min:"€1,000", target:"€8M",  raised:"€3.0M",  pct:38, status:"live",     sl:"● Live"          },
  { id:6, emoji:"📦", name:"Baltic Logistics REIT",  ticker:"BLR", subtype:"Secondary",     type:"secondary", risk:"low",    location:"Riga, Latvia",           irr:"16.3%", min:"€250",   target:"€6M",  raised:"€1.3M",  pct:22, status:"upcoming", sl:"◆ Upcoming"      },
];

const tableRows = [
  { name:"NeuroLogic AI",         ticker:"NLA", type:"Early-Stage",    stage:"Series A",    irr:"34.2%", price:"€1.42", cap:"€52M",  risk:"medium", prog:"61% · €15.3M/€25M", min:"€500",   status:"live"     },
  { name:"OrbitalX Space",        ticker:"ORB", type:"Early-Stage",    stage:"Seed",        irr:"31.7%", price:"€0.88", cap:"€14M",  risk:"high",   prog:"38% · €3.0M/€8M",   min:"€1,000", status:"live"     },
  { name:"VoltGrid Energy",       ticker:"VGE", type:"Blockchain IPO", stage:"Public",      irr:"28.4%", price:"€2.10", cap:"€80M",  risk:"low",    prog:"87% · €15.7M/€18M", min:"€100",   status:"hot"      },
  { name:"AquaTech Solutions",    ticker:"ATS", type:"Blockchain IPO", stage:"Public",      irr:"22.1%", price:"€1.55", cap:"€35M",  risk:"medium", prog:"93% · €11.2M/€12M", min:"€500",   status:"closing"  },
  { name:"MedCore Pharma",        ticker:"MCP", type:"Equity Token",   stage:"ERC-3643",    irr:"19.8%", price:"€3.20", cap:"€190M", risk:"low",    prog:"74% · €29.6M/€40M", min:"€250",   status:"live"     },
  { name:"Baltic Logistics REIT", ticker:"BLR", type:"Secondary",      stage:"Token Float", irr:"16.3%", price:"€1.08", cap:"€28M",  risk:"low",    prog:"22% · €1.3M/€6M",   min:"€250",   status:"upcoming" },
];

const faqs = [
  { q:"What is a blockchain IPO?",                   a:"A blockchain IPO is a public equity offering launched natively on-chain. Investors receive compliant security tokens representing real equity ownership, with on-chain settlement and a transparent shareholder registry." },
  { q:"What does ERC-3643 mean?",                    a:"ERC-3643 is the regulatory-grade standard for security tokens on Ethereum. It enforces KYC, AML, and jurisdiction-based transfer controls at the smart contract level." },
  { q:"What is the minimum investment?",             a:"Minimum ticket sizes vary by offering. Early-stage rounds typically start from €500–€1,000, while blockchain IPOs can have entry points as low as €100." },
  { q:"Can equity tokens be traded after issuance?", a:"Yes. Qualifying equity tokens may be listed on the Nextoken secondary exchange for peer-to-peer trading among eligible investors." },
  { q:"How do issuers launch an equity raise?",      a:"Issuers begin through the Tokenize workflow, submit legal documentation and financials, define equity structure and investor terms, then launch a compliant digital fundraise." },
];

function StatusBadge({ status, label }) {
  const st = statusStyle[status] || statusStyle.live;
  return <span style={{ ...st, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>{label}</span>;
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px", background:"#0d0d14", border:"none", color:"#e8e8f0", fontSize:14.5, fontWeight:500, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
        <span>{q}</span>
        <span style={{ color:"#d4af37", fontSize:20, flexShrink:0, marginLeft:16 }}>{open?"−":"+"}</span>
      </button>
      {open && <div style={{ padding:"0 20px 18px", background:"#0d0d14" }}><p style={{ fontSize:13.5, color:"#b0b0c8", lineHeight:1.7, margin:0 }}>{a}</p></div>}
    </div>
  );
}

function ListingCard({ item }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ ...S.card, border:\`1px solid \${hovered?"rgba(212,175,55,0.35)":"rgba(255,255,255,0.08)"}\`, transform: hovered?"translateY(-2px)":"none", position:"relative", overflow:"hidden" }}>
      {hovered && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#d4af37,#f0d060)" }} />}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ fontSize:32 }}>{item.emoji}</span>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
          <StatusBadge status={item.status} label={item.sl} />
          <span style={{ padding:"3px 10px", borderRadius:20, fontSize:10.5, fontWeight:500, background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.4)", border:"1px solid rgba(255,255,255,0.08)" }}>{item.subtype}</span>
        </div>
      </div>
      <div style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#e8e8f0", marginBottom:2 }}>{item.name}</div>
      <div style={{ fontFamily:"monospace", fontSize:11, color:"#7a7a96", marginBottom:4 }}>{item.ticker} · {item.subtype}</div>
      <div style={{ fontSize:12.5, color:"#7a7a96", marginBottom:16 }}>📍 {item.location}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, padding:14, background:"rgba(255,255,255,0.025)", borderRadius:10, marginBottom:16 }}>
        {[{v:item.irr,l:"Target IRR"},{v:item.min,l:"Min. Invest"},{v:item.target,l:"Raise Target"}].map((m) => (
          <div key={m.l}><div style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#d4af37" }}>{m.v}</div><div style={{ fontSize:10.5, color:"#7a7a96", marginTop:2 }}>{m.l}</div></div>
        ))}
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#7a7a96", marginBottom:6 }}>
          <span>Funding <strong style={{ color:"#e8e8f0" }}>{item.pct}%</strong></span>
          <span>{item.raised} / {item.target}</span>
        </div>
        <div style={{ height:5, background:"rgba(255,255,255,0.07)", borderRadius:4, overflow:"hidden" }}>
          <div style={{ width:item.pct+"%", height:"100%", background:"linear-gradient(90deg,#d4af37,#f0d060)", borderRadius:4 }} />
        </div>
      </div>
      <div style={{ fontSize:11.5, fontWeight:600, marginBottom:12, ...riskStyle[item.risk] }}>● {item.risk==="low"?"Low Risk":item.risk==="medium"?"Medium Risk":"High Risk"}</div>
      <button style={{ width:"100%", padding:"11px 0", borderRadius:10, border:"1px solid rgba(212,175,55,0.3)", background:"rgba(212,175,55,0.08)", color:"#d4af37", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.background="#d4af37"; e.currentTarget.style.color="#000"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background="rgba(212,175,55,0.08)"; e.currentTarget.style.color="#d4af37"; }}>
        View Opportunity
      </button>
    </div>
  );
}

export default function EquityIPOPage() {
  const [activeType, setActiveType] = useState("all");
  const [activeRisk, setActiveRisk] = useState("all");
  const [activeSort, setActiveSort] = useState("IRR");

  const filtered = listings.filter((l) => {
    const tok = activeType === "all" || l.type === activeType;
    const rok = activeRisk === "all" || l.risk === activeRisk;
    return tok && rok;
  });

  return (
    <div style={S.page}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse { animation: pulseDot 2s infinite; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050508; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius:3px; }
        table { border-collapse: collapse; width: 100%; }
        th { text-align: left; }
      \`}</style>

      {/* NAVBAR */}
      <nav style={S.nav}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
          <span style={{ fontFamily:"Syne,sans-serif", fontSize:19, fontWeight:800, color:"#d4af37", letterSpacing:2 }}>NXT</span>
          <div style={{ width:1, height:22, background:"rgba(212,175,55,0.25)" }} />
          <div>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:12.5, fontWeight:700, letterSpacing:"0.2em", color:"#d4af37" }}>NEXTOKEN</div>
            <div style={{ fontSize:8.5, letterSpacing:"0.2em", color:"#7a7a96", textTransform:"uppercase" }}>CAPITAL</div>
          </div>
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"]].map(([l,h]) => (
            <a key={l} href={h} style={{ padding:"6px 14px", borderRadius:8, textDecoration:"none", fontSize:13.5, fontWeight:500, color: l==="Equity & IPO"?"#d4af37":"#7a7a96", background: l==="Equity & IPO"?"rgba(212,175,55,0.10)":"transparent", transition:"all 0.15s" }}>{l}</a>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <a href="/login"    style={{ padding:"7px 18px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", color:"#b0b0c8", fontSize:13, textDecoration:"none" }}>Log In</a>
          <a href="/register" style={{ padding:"7px 18px", borderRadius:8, background:"#d4af37", color:"#000", fontSize:13, fontWeight:700, textDecoration:"none" }}>Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position:"relative", padding:"90px 32px 70px", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 800px 400px at 50% -40px,rgba(212,175,55,0.15) 0%,transparent 70%),radial-gradient(ellipse 500px 300px at 20% 80%,rgba(99,102,241,0.06) 0%,transparent 60%)", pointerEvents:"none" }} />
        <div style={{ ...S.badge, marginBottom:24 }}>
          <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#d4af37", display:"inline-block" }} />
          Equity &amp; IPO
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,6vw,68px)", fontWeight:800, lineHeight:1.05, letterSpacing:"-1.5px", color:"#e8e8f0", maxWidth:820, margin:"0 auto 20px" }}>
          Digital Equity &amp;<br /><span style={{ color:"#d4af37" }}>Blockchain IPO Market</span>
        </h1>
        <p style={{ fontSize:17, fontWeight:300, color:"#b0b0c8", maxWidth:600, margin:"0 auto 36px", lineHeight:1.7 }}>
          Participate in tokenized equity raises and blockchain-native IPOs. Early-stage access, transparent cap tables, and on-chain share issuance for modern investors.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <a href="#listings" style={S.btnGold}>Explore Listings</a>
          <a href="#issue"    style={S.btnOut}>Issue Equity</a>
        </div>
      </div>

      {/* STAT STRIP */}
      <div style={{ margin:"0 32px", borderTop:"1px solid rgba(255,255,255,0.08)", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"#0d0d14", display:"flex", flexWrap:"wrap" }}>
        {[{v:"12",l:"Active Offerings"},{v:"€140M+",l:"Total Capital Raised"},{v:"34.2%",l:"Highest Upside"},{v:"€100",l:"Lowest Entry Point"},{v:"4",l:"Equity Types"},{v:"ERC-3643",l:"Compliance Standard"}].map((s,i,arr) => (
          <div key={s.l} style={{ flex:1, minWidth:140, padding:"22px 28px", textAlign:"center", borderRight: i<arr.length-1?"1px solid rgba(255,255,255,0.08)":"none" }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, color:"#d4af37", letterSpacing:"-0.5px" }}>{s.v}</div>
            <div style={{ fontSize:11.5, color:"#7a7a96", marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* EQUITY TYPES */}
      <div style={S.section}>
        <span style={S.label}>Structures</span>
        <h2 style={S.h2}>Equity Structures You Can Access</h2>
        <p style={S.sub}>From early-stage SAFEs to full blockchain IPO listings, Nextoken supports the complete equity capital lifecycle.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, marginTop:8 }}>
          {[
            { icon:"🚀", name:"Blockchain IPO",     desc:"Full public equity offerings launched on-chain with transparent allocation and secondary market readiness." },
            { icon:"🌱", name:"Early-Stage Equity", desc:"Invest in pre-IPO rounds. Includes SAFE notes, priced seed rounds, and Series A allocations." },
            { icon:"📊", name:"Equity Tokens (ST)", desc:"ERC-3643 compliant security tokens with regulatory-grade investor whitelisting and transfer controls." },
            { icon:"🔄", name:"Secondary Listings",  desc:"Trade previously issued equity tokens on the Nextoken exchange for early investor liquidity." },
          ].map((c) => (
            <div key={c.name} style={{ ...S.card }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor="rgba(212,175,55,0.3)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.transform="none"; }}>
              <div style={{ fontSize:28, marginBottom:14 }}>{c.icon}</div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#e8e8f0", marginBottom:8 }}>{c.name}</div>
              <div style={{ fontSize:13, color:"#b0b0c8", lineHeight:1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LISTINGS */}
      <div id="listings" style={S.section}>
        <span style={S.label}>Live Now</span>
        <h2 style={S.h2}>Equity &amp; IPO Directory</h2>
        <p style={S.sub}>Browse active raises, upcoming IPOs, and secondary market equity token listings.</p>

        {/* Filters */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, alignItems:"center", marginBottom:28 }}>
          <span style={{ fontSize:11.5, color:"#7a7a96", fontWeight:600, letterSpacing:"0.05em" }}>TYPE</span>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[["all","All"],["ipo","Blockchain IPO"],["early","Early-Stage"],["token","Equity Token"],["secondary","Secondary"]].map(([v,l]) => (
              <button key={v} onClick={() => setActiveType(v)} style={S.filterBtn(activeType===v)}>{l}</button>
            ))}
          </div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.08)", margin:"0 4px" }} />
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[["all","All Risk"],["low","Low"],["medium","Medium"],["high","High"]].map(([v,l]) => (
              <button key={v} onClick={() => setActiveRisk(v)} style={S.filterBtn(activeRisk===v)}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {filtered.map((item) => <ListingCard key={item.id} item={item} />)}
          {filtered.length===0 && <div style={{ gridColumn:"1/-1", padding:"60px 0", textAlign:"center", color:"#7a7a96", fontSize:15 }}>No listings match this filter.</div>}
        </div>
      </div>

      {/* TABLE */}
      <div style={S.section}>
        <span style={S.label}>Full Directory</span>
        <h2 style={S.h2}>All Equity Listings</h2>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
          {["IRR","Mkt Cap","Progress","Min. Invest","Name"].map((s) => (
            <button key={s} onClick={() => setActiveSort(s)} style={S.sortBtn(activeSort===s)}>Sort: {s}</button>
          ))}
        </div>
        <div style={{ overflowX:"auto", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14 }}>
          <table>
            <thead>
              <tr style={{ background:"#12121c" }}>
                {["Company","Type","Stage","Target IRR","Share Price","Mkt Cap","Risk","Progress","Min. Invest","Status",""].map((h) => (
                  <th key={h} style={{ padding:"13px 16px", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"#7a7a96", borderBottom:"1px solid rgba(255,255,255,0.08)", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ fontWeight:600, fontSize:13.5, color:"#e8e8f0" }}>{row.name}</div>
                    <div style={{ fontFamily:"monospace", fontSize:10.5, color:"#7a7a96" }}>{row.ticker}</div>
                  </td>
                  <td style={{ padding:"14px 16px" }}><span style={{ padding:"3px 9px", borderRadius:20, fontSize:10.5, background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.4)", border:"1px solid rgba(255,255,255,0.08)" }}>{row.type}</span></td>
                  <td style={{ padding:"14px 16px", fontSize:13, color:"#b0b0c8" }}>{row.stage}</td>
                  <td style={{ padding:"14px 16px", fontFamily:"Syne,sans-serif", fontWeight:700, color:"#22c55e" }}>{row.irr}</td>
                  <td style={{ padding:"14px 16px", fontFamily:"monospace", fontSize:12.5, color:"#e8e8f0" }}>{row.price}</td>
                  <td style={{ padding:"14px 16px", fontFamily:"monospace", fontSize:12.5, color:"#b0b0c8" }}>{row.cap}</td>
                  <td style={{ padding:"14px 16px", fontSize:12, fontWeight:600, ...riskStyle[row.risk] }}>● {row.risk==="low"?"Low":row.risk==="medium"?"Med":"High"}</td>
                  <td style={{ padding:"14px 16px", fontSize:12.5, color:"#b0b0c8", whiteSpace:"nowrap" }}>{row.prog}</td>
                  <td style={{ padding:"14px 16px", fontFamily:"monospace", fontSize:12.5, color:"#e8e8f0" }}>{row.min}</td>
                  <td style={{ padding:"14px 16px" }}><StatusBadge status={row.status} label={row.status==="live"?"● Live":row.status==="hot"?"🔥 Hot":row.status==="closing"?"⏱ Closing":"◆ Upcoming"} /></td>
                  <td style={{ padding:"14px 16px", textAlign:"right" }}>
                    <button style={{ padding:"6px 14px", borderRadius:8, border:"1px solid rgba(212,175,55,0.3)", background:"transparent", color:"#d4af37", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background="#d4af37"; e.currentTarget.style.color="#000"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#d4af37"; }}>
                      Invest
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="issue" style={S.section}>
        <span style={S.label}>Issuer Workflow</span>
        <h2 style={S.h2}>How Equity Issuance Works</h2>
        <p style={S.sub}>From structure to on-chain settlement, Nextoken handles the full lifecycle of your equity raise.</p>
        <div style={{ position:"relative", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:32, marginTop:16 }}>
          <div style={{ position:"absolute", top:24, left:60, right:60, height:1, background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)" }} />
          {[
            { n:"01", title:"Define Structure",     body:"Set share class, total supply, valuation cap, investor rights, and preferred terms." },
            { n:"02", title:"Submit Legal Docs",     body:"Prepare cap table, pitch deck, audited financials, and disclosure documentation." },
            { n:"03", title:"Token Issuance",        body:"ERC-3643 compliant security tokens with KYC-gated investor whitelisting on-chain." },
            { n:"04", title:"Run the Fundraise",     body:"Open subscriptions. Monitor allocation progress and milestones in real time." },
            { n:"05", title:"Exchange Listing",      body:"Qualified tokens progress to Nextoken secondary exchange for liquidity." },
          ].map((step) => (
            <div key={step.n}>
              <div style={{ width:48, height:48, borderRadius:"50%", border:"1px solid rgba(212,175,55,0.3)", background:"rgba(212,175,55,0.10)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#d4af37", marginBottom:16, position:"relative", zIndex:1 }}>{step.n}</div>
              <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:14.5, fontWeight:700, color:"#e8e8f0", marginBottom:8 }}>{step.title}</h4>
              <p style={{ fontSize:13, color:"#7a7a96", lineHeight:1.65, margin:0 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={S.section}>
        <span style={S.label}>FAQ</span>
        <h2 style={{ ...S.h2, marginBottom:28 }}>Common Equity Questions</h2>
        {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
      </div>

      {/* CTA */}
      <div style={{ margin:"0 32px 64px", borderRadius:18, padding:"64px 48px", textAlign:"center", position:"relative", overflow:"hidden", border:"1px solid rgba(212,175,55,0.3)", background:"linear-gradient(135deg,rgba(212,175,55,0.10) 0%,rgba(99,102,241,0.07) 100%)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 600px 300px at 50% 0%,rgba(212,175,55,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <span style={S.label}>Get Started</span>
          <h2 style={{ ...S.h2, marginBottom:12 }}>Ready to Issue or Invest<br />in Digital Equity?</h2>
          <p style={{ fontSize:15, color:"#b0b0c8", fontWeight:300, maxWidth:460, margin:"0 auto 32px", lineHeight:1.7 }}>Join 12,400+ investors and issuers building the future of capital markets on Nextoken.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="/tokenize" style={S.btnGold}>Issue Equity</a>
            <a href="/exchange" style={S.btnOut}>Explore Exchange</a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.08)", padding:"56px 32px 32px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:48, marginBottom:48 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <span style={{ fontFamily:"Syne,sans-serif", fontSize:19, fontWeight:800, color:"#d4af37", letterSpacing:2 }}>NXT</span>
                <div style={{ width:1, height:22, background:"rgba(212,175,55,0.25)" }} />
                <div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:12.5, fontWeight:700, letterSpacing:"0.2em", color:"#d4af37" }}>NEXTOKEN</div>
                  <div style={{ fontSize:8.5, letterSpacing:"0.2em", color:"#7a7a96", textTransform:"uppercase" }}>CAPITAL</div>
                </div>
              </div>
              <p style={{ fontSize:12.5, color:"#7a7a96", maxWidth:240, lineHeight:1.7, marginBottom:20 }}>The regulated infrastructure for tokenized real-world assets. Registered in Lithuania.</p>
              <div style={{ fontSize:10.5, color:"#7a7a96", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                MONITORED BY<br />
                <a href="#" style={{ color:"#d4af37", textDecoration:"none" }}>LT Bank of Lithuania</a>
              </div>
            </div>
            <div>
              <h5 style={{ fontSize:10.5, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", color:"#7a7a96", marginBottom:16 }}>Products</h5>
              {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"]].map(([l,h]) => (
                <a key={l} href={h} style={{ display:"block", fontSize:13, color:"#b0b0c8", textDecoration:"none", marginBottom:10 }}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:24, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:10 }}>
            <p style={{ fontSize:12, color:"#7a7a96", margin:0 }}>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
            <p style={{ fontSize:11, color:"#7a7a96", opacity:0.7, margin:0 }}>Risk warning: Investing in tokenized equity involves significant risk. Past performance is not indicative of future results.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync("app/equity-ipo/page.tsx", code, "utf8");
console.log("✅ app/equity-ipo/page.tsx rewritten with inline styles!");
console.log("📏 Size: " + code.length + " characters");
console.log("🎨 100% inline styles — no Tailwind dependency");