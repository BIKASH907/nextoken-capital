const fs = require("fs");

// ═══════════════════════════════════════
// MARKETS PAGE
// ═══════════════════════════════════════
const markets = `import Link from "next/link";
import { useState } from "react";

const opportunities = [
  { id:1,  emoji:"☀️", name:"Solar Farm Portfolio",       location:"Alicante, Spain",          category:"Energy",          risk:"low",    irr:"18.2%", min:"EUR 250",   target:"EUR 5M",   raised:"EUR 4.6M",  pct:92, status:"closing", sl:"Closing Soon" },
  { id:2,  emoji:"🛍️", name:"Retail Shopping Centre",     location:"Amsterdam, Netherlands",   category:"Commercial",      risk:"low",    irr:"13.9%", min:"EUR 1,000", target:"EUR 4M",   raised:"EUR 3.5M",  pct:88, status:"closing", sl:"Closing Soon" },
  { id:3,  emoji:"🏢", name:"Tokenized Office Building",  location:"Berlin, Germany",          category:"Property",        risk:"low",    irr:"16.4%", min:"EUR 500",   target:"EUR 2.4M", raised:"EUR 1.9M",  pct:78, status:"live",    sl:"Live"         },
  { id:4,  emoji:"🏠", name:"Student Housing Block",      location:"Prague, Czechia",          category:"Property",        risk:"low",    irr:"14.2%", min:"EUR 250",   target:"EUR 1.8M", raised:"EUR 1.3M",  pct:71, status:"live",    sl:"Live"         },
  { id:5,  emoji:"🏘️", name:"Residential Complex",        location:"Lisbon, Portugal",         category:"Property",        risk:"low",    irr:"14.8%", min:"EUR 500",   target:"EUR 3.2M", raised:"EUR 1.9M",  pct:60, status:"live",    sl:"Live"         },
  { id:6,  emoji:"🏭", name:"Logistics Hub",              location:"Warsaw, Poland",           category:"Infrastructure",  risk:"medium", irr:"15.1%", min:"EUR 1,000", target:"EUR 8M",   raised:"EUR 3.6M",  pct:45, status:"live",    sl:"Live"         },
  { id:7,  emoji:"💨", name:"Wind Energy Project",        location:"Gdansk, Poland",           category:"Energy",          risk:"medium", irr:"17.6%", min:"EUR 250",   target:"EUR 6.5M", raised:"EUR 2.1M",  pct:33, status:"live",    sl:"Live"         },
  { id:8,  emoji:"💼", name:"Tech Business Park",         location:"Dublin, Ireland",          category:"Commercial",      risk:"medium", irr:"15.9%", min:"EUR 500",   target:"EUR 10M",  raised:"EUR 2.0M",  pct:20, status:"live",    sl:"Live"         },
  { id:9,  emoji:"⚗️", name:"Green Hydrogen Plant",       location:"Rotterdam, Netherlands",   category:"Energy",          risk:"high",   irr:"18.8%", min:"EUR 2,000", target:"EUR 12M",  raised:"EUR 1.8M",  pct:15, status:"live",    sl:"Live"         },
  { id:10, emoji:"🏗", name:"Smart Infrastructure Fund",  location:"Singapore",                category:"Infrastructure",  risk:"medium", irr:"16.2%", min:"EUR 500",   target:"EUR 15M",  raised:"EUR 4.5M",  pct:30, status:"live",    sl:"Live"         },
  { id:11, emoji:"🌊", name:"Offshore Wind Farm",         location:"Copenhagen, Denmark",      category:"Energy",          risk:"medium", irr:"17.1%", min:"EUR 1,000", target:"EUR 20M",  raised:"EUR 7.0M",  pct:35, status:"live",    sl:"Live"         },
  { id:12, emoji:"🏥", name:"Medical Centre Portfolio",   location:"Zurich, Switzerland",      category:"Commercial",      risk:"low",    irr:"13.4%", min:"EUR 750",   target:"EUR 6M",   raised:"EUR 4.2M",  pct:70, status:"live",    sl:"Live"         },
];

const statusStyle = {
  live:    { bg:"rgba(34,197,94,0.10)",  color:"#22c55e", border:"rgba(34,197,94,0.25)"  },
  closing: { bg:"rgba(240,185,11,0.10)", color:"#F0B90B", border:"rgba(240,185,11,0.3)"  },
  upcoming:{ bg:"rgba(99,102,241,0.10)", color:"#818cf8", border:"rgba(99,102,241,0.3)"  },
};

const riskColor = { low:"#22c55e", medium:"#f59e0b", high:"#ef4444" };

const S = {
  page:  { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  sec:   { maxWidth:1200, margin:"0 auto", padding:"56px 32px" },
  h2:    { fontFamily:"Syne,sans-serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:800, color:"#e8e8f0", margin:"0 0 12px", letterSpacing:"-0.5px" },
  lbl:   { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:10, display:"block" },
  sub:   { fontSize:15, color:"#8a9bb8", fontWeight:300, maxWidth:600, lineHeight:1.75, margin:"0 0 32px" },
  badge: { display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:20, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase" },
  gold:  { padding:"12px 28px", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block" },
  out:   { padding:"12px 28px", borderRadius:10, background:"transparent", color:"#F0B90B", fontSize:14, fontWeight:600, border:"1px solid rgba(240,185,11,0.35)", cursor:"pointer", textDecoration:"none", display:"inline-block" },
  FB:    (a) => ({ padding:"6px 14px", borderRadius:20, border:"1px solid "+(a?"rgba(240,185,11,0.5)":"rgba(255,255,255,0.08)"), background:a?"rgba(240,185,11,0.12)":"transparent", color:a?"#F0B90B":"#b0b0c8", fontSize:12.5, fontWeight:500, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }),
};

function OpCard({ item }) {
  const [hov, setHov] = useState(false);
  const st = statusStyle[item.status] || statusStyle.live;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:"#0d0d14", border:"1px solid "+(hov?"rgba(240,185,11,0.35)":"rgba(255,255,255,0.08)"), borderRadius:16, padding:24, transition:"all 0.2s", position:"relative", overflow:"hidden", transform:hov?"translateY(-2px)":"none" }}>
      {hov && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#F0B90B,#fcd34d)" }} />}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ fontSize:32 }}>{item.emoji}</span>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
          <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:st.bg, color:st.color, border:"1px solid "+st.border }}>{item.sl}</span>
          <span style={{ padding:"3px 10px", borderRadius:20, fontSize:10.5, background:"rgba(255,255,255,0.05)", color:riskColor[item.risk], border:"1px solid rgba(255,255,255,0.08)", fontWeight:600 }}>{item.risk==="low"?"Low Risk":item.risk==="medium"?"Med Risk":"High Risk"}</span>
        </div>
      </div>
      <div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#e8e8f0", marginBottom:3 }}>{item.name}</div>
      <div style={{ fontSize:12.5, color:"#8a9bb8", marginBottom:4 }}>📍 {item.location}</div>
      <div style={{ display:"inline-block", padding:"2px 8px", borderRadius:6, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", fontSize:11, color:"#8a9bb8", marginBottom:14 }}>{item.category}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, padding:12, background:"rgba(255,255,255,0.025)", borderRadius:10, marginBottom:14 }}>
        {[{v:item.irr,l:"Target ROI"},{v:item.min,l:"Min. Invest"},{v:item.target,l:"Target"}].map(m => (
          <div key={m.l}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#F0B90B" }}>{m.v}</div>
            <div style={{ fontSize:10, color:"#8a9bb8", marginTop:2 }}>{m.l}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11.5, color:"#8a9bb8", marginBottom:5 }}>
          <span>Funding <strong style={{ color:"#e8e8f0" }}>{item.pct}%</strong></span>
          <span>{item.raised} / {item.target}</span>
        </div>
        <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
          <div style={{ width:item.pct+"%", height:"100%", background:"linear-gradient(90deg,#F0B90B,#fcd34d)", borderRadius:3 }} />
        </div>
      </div>
      <button
        onMouseEnter={e => { e.currentTarget.style.background="#F0B90B"; e.currentTarget.style.color="#000"; }}
        onMouseLeave={e => { e.currentTarget.style.background="rgba(240,185,11,0.08)"; e.currentTarget.style.color="#F0B90B"; }}
        style={{ width:"100%", padding:"10px 0", borderRadius:10, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
        View Opportunity
      </button>
    </div>
  );
}

const categories = ["All","Property","Energy","Infrastructure","Commercial"];
const risks      = ["All","Low","Medium","High"];
const sorts      = ["Most Funded","Highest ROI","Lowest Min."];

export default function MarketsPage() {
  const [cat,  setCat]  = useState("All");
  const [risk, setRisk] = useState("All");
  const [sort, setSort] = useState("Most Funded");
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");

  const filtered = opportunities.filter(o => {
    const cm = cat  === "All" || o.category === cat;
    const rm = risk === "All" || o.risk === risk.toLowerCase();
    const sm = search === "" || o.name.toLowerCase().includes(search.toLowerCase()) || o.location.toLowerCase().includes(search.toLowerCase());
    return cm && rm && sm;
  }).sort((a,b) => {
    if (sort === "Most Funded")   return b.pct - a.pct;
    if (sort === "Highest ROI")   return parseFloat(b.irr) - parseFloat(a.irr);
    if (sort === "Lowest Min.")   return parseInt(a.min.replace(/[^0-9]/g,"")) - parseInt(b.min.replace(/[^0-9]/g,""));
    return 0;
  });

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
        input::placeholder { color:#8a9bb8; }
      \`}</style>

      {/* HERO */}
      <div style={{ position:"relative", padding:"80px 32px 60px", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 800px 400px at 50% -40px,rgba(240,185,11,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ ...S.badge, marginBottom:22 }}>
          <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
          Investment Opportunities
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(32px,5vw,62px)", fontWeight:800, lineHeight:1.06, letterSpacing:"-1.5px", color:"#e8e8f0", maxWidth:800, margin:"0 auto 18px" }}>
          Explore Premium<br /><span style={{ color:"#F0B90B" }}>Tokenized Markets</span>
        </h1>
        <p style={{ fontSize:16, fontWeight:300, color:"#8a9bb8", maxWidth:580, margin:"0 auto 32px", lineHeight:1.75 }}>
          Access curated real-world asset opportunities across property, energy, infrastructure, and commercial sectors with a modern digital investment experience.
        </p>
      </div>

      {/* STAT STRIP */}
      <div style={{ margin:"0 32px", borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#0d0d14", display:"flex", flexWrap:"wrap" }}>
        {[{v:"12",l:"Active Projects"},{v:"EUR 50M+",l:"Total Assets"},{v:"18.8%",l:"Highest ROI"},{v:"EUR 250",l:"Min. Invest"},{v:"30+",l:"Countries"},{v:"100%",l:"On-Chain"}].map((s,i,arr) => (
          <div key={s.l} style={{ flex:1, minWidth:110, padding:"20px 16px", textAlign:"center", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.07)":"none" }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, color:"#F0B90B" }}>{s.v}</div>
            <div style={{ fontSize:11, color:"#8a9bb8", marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div style={S.sec}>
        {/* Search */}
        <div style={{ position:"relative", marginBottom:20 }}>
          <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:16, color:"#8a9bb8" }}>🔍</span>
          <input
            placeholder="Search by name or location..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"12px 16px 12px 44px", borderRadius:12, background:"#0d0d14", border:"1px solid rgba(255,255,255,0.08)", color:"#e8e8f0", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
          />
        </div>

        <div style={{ display:"flex", flexWrap:"wrap", gap:12, alignItems:"center", marginBottom:28 }}>
          <span style={{ fontSize:11.5, color:"#8a9bb8", fontWeight:600 }}>CATEGORY</span>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {categories.map(c => <button key={c} onClick={() => setCat(c)} style={S.FB(cat===c)}>{c}</button>)}
          </div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.08)", margin:"0 4px" }} />
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {risks.map(r => <button key={r} onClick={() => setRisk(r)} style={S.FB(risk===r)}>{r} Risk</button>)}
          </div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.08)", margin:"0 4px" }} />
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding:"7px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"#0d0d14", color:"#b0b0c8", fontSize:12.5, cursor:"pointer", fontFamily:"inherit", outline:"none" }}>
            {sorts.map(s => <option key={s} style={{ background:"#0d0d14" }}>{s}</option>)}
          </select>
          <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
            {["grid","list"].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ width:34, height:34, borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:view===v?"rgba(240,185,11,0.12)":"transparent", color:view===v?"#F0B90B":"#8a9bb8", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {v==="grid"?"⊞":"≡"}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize:13, color:"#8a9bb8", marginBottom:20 }}>
          Showing <strong style={{ color:"#e8e8f0" }}>{filtered.length}</strong> of <strong style={{ color:"#e8e8f0" }}>{opportunities.length}</strong> opportunities
        </p>

        {view === "grid" ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
            {filtered.map(item => <OpCard key={item.id} item={item} />)}
            {filtered.length===0 && <div style={{ gridColumn:"1/-1", padding:"60px 0", textAlign:"center", color:"#8a9bb8", fontSize:15 }}>No opportunities match your filters.</div>}
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map(item => {
              const st = statusStyle[item.status] || statusStyle.live;
              return (
                <div key={item.id}
                  onMouseEnter={e => e.currentTarget.style.borderColor="rgba(240,185,11,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}
                  style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"18px 24px", display:"flex", alignItems:"center", gap:20, transition:"border-color 0.15s" }}>
                  <span style={{ fontSize:28, flexShrink:0 }}>{item.emoji}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#e8e8f0" }}>{item.name}</div>
                    <div style={{ fontSize:12, color:"#8a9bb8" }}>📍 {item.location} · {item.category}</div>
                  </div>
                  <div style={{ textAlign:"center", minWidth:70 }}>
                    <div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#F0B90B" }}>{item.irr}</div>
                    <div style={{ fontSize:10.5, color:"#8a9bb8" }}>Target ROI</div>
                  </div>
                  <div style={{ textAlign:"center", minWidth:80 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#e8e8f0" }}>{item.min}</div>
                    <div style={{ fontSize:10.5, color:"#8a9bb8" }}>Min. Invest</div>
                  </div>
                  <div style={{ minWidth:100 }}>
                    <div style={{ fontSize:11.5, color:"#8a9bb8", marginBottom:4 }}>{item.pct}%</div>
                    <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ width:item.pct+"%", height:"100%", background:"linear-gradient(90deg,#F0B90B,#fcd34d)" }} />
                    </div>
                  </div>
                  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:st.bg, color:st.color, border:"1px solid "+st.border, flexShrink:0 }}>{item.sl}</span>
                  <button
                    onMouseEnter={e => { e.currentTarget.style.background="#F0B90B"; e.currentTarget.style.color="#000"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#F0B90B"; }}
                    style={{ padding:"8px 18px", borderRadius:8, border:"1px solid rgba(240,185,11,0.3)", background:"transparent", color:"#F0B90B", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", flexShrink:0, transition:"all 0.15s" }}>
                    Invest
                  </button>
                </div>
              );
            })}
            {filtered.length===0 && <div style={{ padding:"60px 0", textAlign:"center", color:"#8a9bb8" }}>No opportunities match your filters.</div>}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ margin:"0 32px 64px", borderRadius:18, padding:"60px 40px", textAlign:"center", position:"relative", overflow:"hidden", border:"1px solid rgba(240,185,11,0.25)", background:"linear-gradient(135deg,rgba(240,185,11,0.08) 0%,rgba(99,102,241,0.06) 100%)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 600px 300px at 50% 0%,rgba(240,185,11,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(22px,3.5vw,36px)", fontWeight:800, color:"#e8e8f0", margin:"0 0 12px" }}>Start Building Your Portfolio</h2>
          <p style={{ fontSize:15, color:"#8a9bb8", fontWeight:300, maxWidth:440, margin:"0 auto 28px", lineHeight:1.7 }}>Create your account to access tokenized investment opportunities across multiple real-world sectors.</p>
          <Link href="/register" style={S.gold}>Register Now</Link>
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
            {[["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"],["Institutional","/institutional"]].map(([l,h]) => (
              <Link key={l} href={h} style={{ fontSize:13, color:"#8a9bb8", textDecoration:"none" }}>{l}</Link>
            ))}
          </div>
          <p style={{ fontSize:11.5, color:"#8a9bb8", margin:0 }}>2026 Nextoken Capital UAB · Regulated by Bank of Lithuania</p>
        </div>
      </footer>
    </div>
  );
}
`;

// ═══════════════════════════════════════
// EXCHANGE PAGE
// ═══════════════════════════════════════
const exchange = `import Link from "next/link";
import { useState } from "react";

const tokens = [
  { id:1,  symbol:"VGE",  name:"VoltGrid Energy",        type:"Equity",     price:2.10,  change:+5.2,  vol:"EUR 142K", mcap:"EUR 80M",  low:1.98, high:2.18, liquidity:"High",   status:"live"   },
  { id:2,  symbol:"NLA",  name:"NeuroLogic AI",           type:"Equity",     price:1.42,  change:-1.8,  vol:"EUR 89K",  mcap:"EUR 52M",  low:1.38, high:1.51, liquidity:"Med",    status:"live"   },
  { id:3,  symbol:"MCP",  name:"MedCore Pharma",          type:"Equity",     price:3.20,  change:+2.4,  vol:"EUR 67K",  mcap:"EUR 190M", low:3.10, high:3.28, liquidity:"High",   status:"live"   },
  { id:4,  symbol:"BLR",  name:"Baltic Logistics REIT",   type:"Real Estate",price:1.08,  change:+0.9,  vol:"EUR 34K",  mcap:"EUR 28M",  low:1.05, high:1.11, liquidity:"Low",    status:"live"   },
  { id:5,  symbol:"BALT", name:"Baltic Green Bond 2027",  type:"Bond",       price:98.40, change:+0.2,  vol:"EUR 210K", mcap:"EUR 5M",   low:98.1, high:98.7, liquidity:"High",   status:"live"   },
  { id:6,  symbol:"LOGI", name:"Logistics Income Bond",   type:"Bond",       price:97.90, change:-0.1,  vol:"EUR 156K", mcap:"EUR 4M",   low:97.7, high:98.1, liquidity:"Med",    status:"live"   },
  { id:7,  symbol:"SFP",  name:"Solar Farm Portfolio",    type:"Real Estate",price:1.24,  change:+3.1,  vol:"EUR 98K",  mcap:"EUR 62M",  low:1.20, high:1.27, liquidity:"Med",    status:"live"   },
  { id:8,  symbol:"ATS",  name:"AquaTech Solutions",      type:"Equity",     price:1.55,  change:-0.6,  vol:"EUR 45K",  mcap:"EUR 35M",  low:1.51, high:1.60, liquidity:"Low",    status:"live"   },
  { id:9,  symbol:"WEP",  name:"Wind Energy Project",     type:"Real Estate",price:0.88,  change:+1.4,  vol:"EUR 76K",  mcap:"EUR 44M",  low:0.85, high:0.91, liquidity:"Med",    status:"live"   },
  { id:10, symbol:"RYN",  name:"Renewable Yield Note",    type:"Bond",       price:100.4, change:+0.05, vol:"EUR 88K",  mcap:"EUR 8M",   low:100.2,high:100.6,liquidity:"Med",   status:"live"   },
];

const orderBook = {
  bids: [
    { price:2.09, size:4500, total:9405 },
    { price:2.08, size:8200, total:17056 },
    { price:2.07, size:3100, total:6417 },
    { price:2.06, size:12000,total:24720 },
    { price:2.05, size:6700, total:13735 },
  ],
  asks: [
    { price:2.11, size:3200, total:6752 },
    { price:2.12, size:7500, total:15900 },
    { price:2.13, size:4100, total:8733 },
    { price:2.14, size:9800, total:20972 },
    { price:2.15, size:5600, total:12040 },
  ],
};

const trades = [
  { time:"14:32:18", price:2.10, size:1200, side:"buy"  },
  { time:"14:31:55", price:2.09, size:800,  side:"sell" },
  { time:"14:31:40", price:2.10, size:2400, side:"buy"  },
  { time:"14:31:22", price:2.11, size:600,  side:"buy"  },
  { time:"14:30:58", price:2.09, size:1800, side:"sell" },
  { time:"14:30:45", price:2.08, size:3200, side:"sell" },
];

const typeColor = { Equity:"#818cf8", Bond:"#22c55e", "Real Estate":"#F0B90B" };

const S = {
  page:  { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  badge: { display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:20, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase" },
  gold:  { padding:"11px 24px", borderRadius:9, background:"#F0B90B", color:"#000", fontSize:13.5, fontWeight:800, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  out:   { padding:"11px 24px", borderRadius:9, background:"transparent", color:"#F0B90B", fontSize:13.5, fontWeight:600, border:"1px solid rgba(240,185,11,0.35)", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  FB:    (a) => ({ padding:"6px 14px", borderRadius:20, border:"1px solid "+(a?"rgba(240,185,11,0.5)":"rgba(255,255,255,0.08)"), background:a?"rgba(240,185,11,0.12)":"transparent", color:a?"#F0B90B":"#b0b0c8", fontSize:12.5, fontWeight:500, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }),
  panel: { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14 },
  th:    { padding:"11px 14px", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"#8a9bb8", borderBottom:"1px solid rgba(255,255,255,0.07)", whiteSpace:"nowrap", textAlign:"left" },
  td:    { padding:"13px 14px", fontSize:13, borderBottom:"1px solid rgba(255,255,255,0.05)" },
};

export default function ExchangePage() {
  const [selected, setSelected] = useState(tokens[0]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [orderType, setOrderType] = useState("buy");
  const [orderQty, setOrderQty] = useState("");
  const [orderPrice, setOrderPrice] = useState("");
  const [orderMode, setOrderMode] = useState("market");

  const filtered = tokens.filter(t => {
    const tm = typeFilter === "All" || t.type === typeFilter;
    const sm = search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.symbol.toLowerCase().includes(search.toLowerCase());
    return tm && sm;
  });

  return (
    <div style={S.page}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse { animation: pulse 2s infinite; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#05060a; }
        ::-webkit-scrollbar-thumb { background:rgba(240,185,11,0.3); border-radius:3px; }
        input::placeholder { color:#8a9bb8; }
        input:focus { border-color:#F0B90B !important; outline:none; }
      \`}</style>

      {/* HEADER */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"20px 32px" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ ...S.badge, marginBottom:10 }}>
              <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#F0B90B", display:"inline-block" }} />
              Secondary Market
            </div>
            <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(24px,4vw,40px)", fontWeight:800, color:"#e8e8f0", margin:0, letterSpacing:"-0.5px" }}>
              Nextoken <span style={{ color:"#F0B90B" }}>Exchange</span>
            </h1>
            <p style={{ fontSize:14, color:"#8a9bb8", margin:"6px 0 0" }}>Trade tokenized real-world assets on the regulated secondary market.</p>
          </div>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
            {[{v:"10",l:"Listed Tokens"},{v:"EUR 1.2M",l:"24h Volume"},{v:"ERC-3643",l:"Standard"},{v:"T+0",l:"Settlement"}].map(s => (
              <div key={s.l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:800, color:"#F0B90B" }}>{s.v}</div>
                <div style={{ fontSize:11, color:"#8a9bb8" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KYC WARNING */}
      <div style={{ background:"rgba(245,158,11,0.05)", borderBottom:"1px solid rgba(245,158,11,0.15)", padding:"10px 32px" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontSize:14 }}>⚠️</span>
          <p style={{ fontSize:12.5, color:"#f59e0b", margin:0 }}>
            <strong>KYC Required to Trade:</strong> You must complete identity verification before placing orders.{" "}
            <Link href="/register" style={{ color:"#F0B90B", fontWeight:700 }}>Complete KYC →</Link>
          </p>
        </div>
      </div>

      <div style={{ maxWidth:1400, margin:"0 auto", padding:"24px 32px", display:"grid", gridTemplateColumns:"380px 1fr", gap:20 }}>

        {/* LEFT — Token List */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Search + Filter */}
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#8a9bb8" }}>🔍</span>
            <input placeholder="Search tokens..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width:"100%", padding:"10px 14px 10px 38px", borderRadius:10, background:"#0d0d14", border:"1px solid rgba(255,255,255,0.08)", color:"#e8e8f0", fontSize:13, fontFamily:"inherit" }} />
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {["All","Equity","Bond","Real Estate"].map(t => <button key={t} onClick={() => setTypeFilter(t)} style={S.FB(typeFilter===t)}>{t}</button>)}
          </div>

          {/* Token Table */}
          <div style={{ ...S.panel, overflow:"hidden" }}>
            <div style={{ overflowY:"auto", maxHeight:520 }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#12121c" }}>
                    <th style={S.th}>Token</th>
                    <th style={{ ...S.th, textAlign:"right" }}>Price</th>
                    <th style={{ ...S.th, textAlign:"right" }}>24h</th>
                    <th style={{ ...S.th, textAlign:"right" }}>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id} onClick={() => setSelected(t)}
                      style={{ cursor:"pointer", background:selected.id===t.id?"rgba(240,185,11,0.06)":"transparent", transition:"background 0.15s" }}
                      onMouseEnter={e => { if(selected.id!==t.id) e.currentTarget.style.background="rgba(255,255,255,0.02)"; }}
                      onMouseLeave={e => { if(selected.id!==t.id) e.currentTarget.style.background="transparent"; }}>
                      <td style={S.td}>
                        <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13.5, color:selected.id===t.id?"#F0B90B":"#e8e8f0" }}>{t.symbol}</div>
                        <div style={{ fontSize:11, color:"#8a9bb8", marginTop:1 }}>{t.name.length > 20 ? t.name.slice(0,20)+"..." : t.name}</div>
                      </td>
                      <td style={{ ...S.td, textAlign:"right", fontFamily:"monospace", fontWeight:600, color:"#e8e8f0" }}>EUR {t.price.toFixed(2)}</td>
                      <td style={{ ...S.td, textAlign:"right", fontSize:12.5, fontWeight:600, color:t.change>=0?"#22c55e":"#ef4444" }}>
                        {t.change>=0?"+":""}{t.change.toFixed(1)}%
                      </td>
                      <td style={{ ...S.td, textAlign:"right", fontSize:12, color:"#8a9bb8" }}>{t.vol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT — Trading Panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Selected Token Info */}
          <div style={{ ...S.panel, padding:20, display:"flex", flexWrap:"wrap", gap:20, alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <span style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:"#F0B90B" }}>{selected.symbol}</span>
                <span style={{ padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:600, background:"rgba(255,255,255,0.05)", color:typeColor[selected.type]||"#8a9bb8", border:"1px solid rgba(255,255,255,0.08)" }}>{selected.type}</span>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
              </div>
              <div style={{ fontSize:13, color:"#8a9bb8" }}>{selected.name}</div>
            </div>
            <div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:32, fontWeight:800, color:"#e8e8f0" }}>EUR {selected.price.toFixed(2)}</div>
              <div style={{ fontSize:14, fontWeight:600, color:selected.change>=0?"#22c55e":"#ef4444" }}>
                {selected.change>=0?"+":""}{selected.change.toFixed(1)}% today
              </div>
            </div>
            <div style={{ display:"flex", gap:24 }}>
              {[{l:"24h High",v:"EUR "+selected.high.toFixed(2)},{l:"24h Low",v:"EUR "+selected.low.toFixed(2)},{l:"Volume",v:selected.vol},{l:"Mkt Cap",v:selected.mcap},{l:"Liquidity",v:selected.liquidity}].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize:11, color:"#8a9bb8", marginBottom:2 }}>{s.l}</div>
                  <div style={{ fontSize:13.5, fontWeight:600, color:"#e8e8f0" }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Placeholder + Order Book + Trade Form */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 200px 240px", gap:14 }}>

            {/* Chart */}
            <div style={{ ...S.panel, padding:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:14, fontWeight:700, color:"#e8e8f0" }}>Price Chart</div>
                <div style={{ display:"flex", gap:4 }}>
                  {["1H","1D","1W","1M","ALL"].map(p => (
                    <button key={p} style={{ padding:"3px 8px", borderRadius:6, border:"1px solid rgba(255,255,255,0.08)", background:"transparent", color:"#8a9bb8", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>{p}</button>
                  ))}
                </div>
              </div>
              {/* Fake sparkline chart */}
              <div style={{ height:160, position:"relative", background:"rgba(240,185,11,0.02)", borderRadius:8, overflow:"hidden" }}>
                <svg width="100%" height="160" viewBox="0 0 400 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F0B90B" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#F0B90B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,120 C20,115 40,105 60,98 S100,80 120,75 S160,60 180,65 S220,55 240,50 S280,40 300,42 S340,38 360,35 S380,30 400,28" stroke="#F0B90B" strokeWidth="2" fill="none" />
                  <path d="M0,120 C20,115 40,105 60,98 S100,80 120,75 S160,60 180,65 S220,55 240,50 S280,40 300,42 S340,38 360,35 S380,30 400,28 L400,160 L0,160 Z" fill="url(#chartGrad)" />
                </svg>
                <div style={{ position:"absolute", bottom:8, right:12, fontSize:11, color:"#8a9bb8" }}>Live price simulation</div>
              </div>
              {/* Recent Trades */}
              <div style={{ marginTop:16 }}>
                <p style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:"#8a9bb8", margin:"0 0 10px" }}>Recent Trades</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:4 }}>
                  <span style={{ fontSize:10.5, color:"#8a9bb8", fontWeight:600 }}>TIME</span>
                  <span style={{ fontSize:10.5, color:"#8a9bb8", fontWeight:600, textAlign:"right" }}>PRICE</span>
                  <span style={{ fontSize:10.5, color:"#8a9bb8", fontWeight:600, textAlign:"right" }}>SIZE</span>
                  <span style={{ fontSize:10.5, color:"#8a9bb8", fontWeight:600, textAlign:"right" }}>SIDE</span>
                  {trades.map((t,i) => (
                    <>
                      <span key={"t"+i} style={{ fontSize:11.5, color:"#8a9bb8", fontFamily:"monospace" }}>{t.time}</span>
                      <span key={"p"+i} style={{ fontSize:11.5, fontFamily:"monospace", color:t.side==="buy"?"#22c55e":"#ef4444", textAlign:"right" }}>EUR {t.price.toFixed(2)}</span>
                      <span key={"s"+i} style={{ fontSize:11.5, fontFamily:"monospace", color:"#e8e8f0", textAlign:"right" }}>{t.size}</span>
                      <span key={"sd"+i} style={{ fontSize:11.5, fontWeight:600, color:t.side==="buy"?"#22c55e":"#ef4444", textAlign:"right", textTransform:"uppercase" }}>{t.side}</span>
                    </>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Book */}
            <div style={{ ...S.panel, padding:16 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#8a9bb8", margin:"0 0 12px" }}>Order Book</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginBottom:6 }}>
                <span style={{ fontSize:10, color:"#8a9bb8", fontWeight:600 }}>PRICE</span>
                <span style={{ fontSize:10, color:"#8a9bb8", fontWeight:600, textAlign:"right" }}>SIZE</span>
              </div>
              {orderBook.asks.slice().reverse().map((o,i) => (
                <div key={"a"+i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, padding:"3px 0", position:"relative" }}>
                  <div style={{ position:"absolute", right:0, top:0, bottom:0, background:"rgba(239,68,68,0.08)", width:(o.size/15000*100)+"%", borderRadius:2 }} />
                  <span style={{ fontSize:12, fontFamily:"monospace", color:"#ef4444", position:"relative" }}>EUR {o.price.toFixed(2)}</span>
                  <span style={{ fontSize:12, fontFamily:"monospace", color:"#8a9bb8", textAlign:"right", position:"relative" }}>{o.size.toLocaleString()}</span>
                </div>
              ))}
              <div style={{ textAlign:"center", padding:"6px 0", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)", margin:"4px 0" }}>
                <span style={{ fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#F0B90B" }}>EUR {selected.price.toFixed(2)}</span>
              </div>
              {orderBook.bids.map((o,i) => (
                <div key={"b"+i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, padding:"3px 0", position:"relative" }}>
                  <div style={{ position:"absolute", right:0, top:0, bottom:0, background:"rgba(34,197,94,0.08)", width:(o.size/15000*100)+"%", borderRadius:2 }} />
                  <span style={{ fontSize:12, fontFamily:"monospace", color:"#22c55e", position:"relative" }}>EUR {o.price.toFixed(2)}</span>
                  <span style={{ fontSize:12, fontFamily:"monospace", color:"#8a9bb8", textAlign:"right", position:"relative" }}>{o.size.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Order Form */}
            <div style={{ ...S.panel, padding:18, display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                {["buy","sell"].map(side => (
                  <button key={side} onClick={() => setOrderType(side)}
                    style={{ padding:"9px 0", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:700, textTransform:"uppercase", background:orderType===side?(side==="buy"?"#22c55e":"#ef4444"):"rgba(255,255,255,0.05)", color:orderType===side?"#000":"#8a9bb8", transition:"all 0.15s" }}>
                    {side}
                  </button>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                {["market","limit"].map(m => (
                  <button key={m} onClick={() => setOrderMode(m)}
                    style={{ padding:"6px 0", borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer", fontFamily:"inherit", fontSize:12, background:orderMode===m?"rgba(240,185,11,0.12)":"transparent", color:orderMode===m?"#F0B90B":"#8a9bb8", transition:"all 0.15s" }}>
                    {m.charAt(0).toUpperCase()+m.slice(1)}
                  </button>
                ))}
              </div>
              {orderMode==="limit" && (
                <div>
                  <label style={{ fontSize:11, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:5 }}>Limit Price (EUR)</label>
                  <input placeholder={"EUR "+selected.price.toFixed(2)} value={orderPrice} onChange={e => setOrderPrice(e.target.value)}
                    style={{ width:"100%", padding:"9px 12px", borderRadius:8, background:"#12121c", border:"1px solid rgba(255,255,255,0.08)", color:"#e8e8f0", fontSize:13, fontFamily:"inherit" }} />
                </div>
              )}
              <div>
                <label style={{ fontSize:11, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.05em", display:"block", marginBottom:5 }}>Quantity (tokens)</label>
                <input type="number" placeholder="0" value={orderQty} onChange={e => setOrderQty(e.target.value)}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:8, background:"#12121c", border:"1px solid rgba(255,255,255,0.08)", color:"#e8e8f0", fontSize:13, fontFamily:"inherit" }} />
              </div>
              {orderQty && (
                <div style={{ padding:10, borderRadius:8, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:11.5, color:"#8a9bb8" }}>Est. Total</span>
                    <span style={{ fontSize:12, fontWeight:600, color:"#e8e8f0" }}>EUR {(parseFloat(orderQty)||0 * selected.price).toFixed(2)}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:11.5, color:"#8a9bb8" }}>Fee (0.25%)</span>
                    <span style={{ fontSize:12, color:"#8a9bb8" }}>EUR {((parseFloat(orderQty)||0) * selected.price * 0.0025).toFixed(2)}</span>
                  </div>
                </div>
              )}
              <div style={{ padding:10, borderRadius:8, background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)" }}>
                <p style={{ fontSize:11.5, color:"#f59e0b", margin:"0 0 6px", fontWeight:600 }}>KYC Required</p>
                <p style={{ fontSize:11, color:"#8a9bb8", margin:0, lineHeight:1.5 }}>Complete identity verification to trade.</p>
              </div>
              <Link href="/register"
                style={{ display:"block", textAlign:"center", padding:"11px 0", borderRadius:9, background: orderType==="buy"?"#22c55e":"#ef4444", color:"#000", fontSize:13.5, fontWeight:800, textDecoration:"none" }}>
                {orderType==="buy" ? "Buy "+selected.symbol : "Sell "+selected.symbol} →
              </Link>
              <p style={{ fontSize:11, color:"#8a9bb8", textAlign:"center", margin:0 }}>ERC-3643 · KYC verified only · T+0 settlement</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"32px 32px 20px", marginTop:20 }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:14, alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:900, color:"#F0B90B", letterSpacing:2 }}>NXT</span>
            <div style={{ width:1, height:18, background:"rgba(240,185,11,0.25)" }} />
            <span style={{ fontFamily:"Syne,sans-serif", fontSize:12, fontWeight:800, letterSpacing:"0.15em", color:"#F0B90B" }}>NEXTOKEN EXCHANGE</span>
          </div>
          <p style={{ fontSize:12, color:"#8a9bb8", margin:0 }}>Trading in tokenized securities involves risk. KYC verification required for all trades. Regulated by Bank of Lithuania.</p>
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync("pages/markets.js",  markets,  "utf8");
fs.writeFileSync("pages/exchange.js", exchange, "utf8");
console.log("Done! pages/markets.js  — " + markets.length  + " chars");
console.log("Done! pages/exchange.js — " + exchange.length + " chars");
console.log("Both pages written in plain JS — no TypeScript, no double navbar");