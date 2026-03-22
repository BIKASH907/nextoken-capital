import Link from "next/link";
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
      `}</style>

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
