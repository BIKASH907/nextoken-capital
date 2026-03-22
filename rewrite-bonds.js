const fs = require("fs");
fs.mkdirSync("app/bonds", { recursive: true });

const code = `"use client";
import { useState } from "react";

const typeColor: Record<string, { bg: string; color: string; border: string }> = {
  Green:       { bg:"rgba(34,197,94,0.08)",  color:"#22c55e", border:"rgba(34,197,94,0.25)"  },
  Corporate:   { bg:"rgba(99,102,241,0.08)", color:"#818cf8", border:"rgba(99,102,241,0.3)"  },
  Convertible: { bg:"rgba(212,175,55,0.08)", color:"#d4af37", border:"rgba(212,175,55,0.3)"  },
  Municipal:   { bg:"rgba(14,165,233,0.08)", color:"#38bdf8", border:"rgba(14,165,233,0.25)" },
};

const statusStyle: Record<string, { bg: string; color: string; border: string }> = {
  Live:     { bg:"rgba(34,197,94,0.10)",  color:"#22c55e", border:"rgba(34,197,94,0.25)"  },
  Closing:  { bg:"rgba(212,175,55,0.10)", color:"#d4af37", border:"rgba(212,175,55,0.3)"  },
  Upcoming: { bg:"rgba(99,102,241,0.10)", color:"#818cf8", border:"rgba(99,102,241,0.3)"  },
};

const ratingColor = (r: string) => {
  if (r.startsWith("A"))  return "#22c55e";
  if (r.startsWith("BB")) return "#f59e0b";
  return "#ef4444";
};

const bonds = [
  { id:1, name:"SME Convertible Note I",     ticker:"SME-CNV-26",    type:"Convertible", issuer:"Growth Capital Partners", yld:"8.2%", price:"99.8",  term:"2Y", rating:"BB",   progress:94, raised:"940K",  target:"1M",   min:"250",   status:"Closing", emoji:"💼", featured:true  },
  { id:2, name:"Logistics Income Bond",      ticker:"LOGI-28",       type:"Corporate",   issuer:"Baltic Logistics REIT",   yld:"6.9%", price:"97.9",  term:"4Y", rating:"BBB",  progress:60, raised:"2.4M",  target:"4M",   min:"500",   status:"Live",    emoji:"🏭", featured:true  },
  { id:3, name:"Baltic Green Bond 2027",     ticker:"BALT-GREEN-27", type:"Green",       issuer:"Baltic Energy UAB",       yld:"6.4%", price:"98.4",  term:"3Y", rating:"A-",   progress:72, raised:"3.6M",  target:"5M",   min:"500",   status:"Live",    emoji:"🌱", featured:true  },
  { id:4, name:"Renewable Yield Note 2030",  ticker:"RYN-30",        type:"Green",       issuer:"Nord Renewables",         yld:"5.8%", price:"100.4", term:"6Y", rating:"A",    progress:53, raised:"4.2M",  target:"8M",   min:"750",   status:"Live",    emoji:"💨", featured:false },
  { id:5, name:"EU Infrastructure Bond",    ticker:"EU-INFRA-29",   type:"Corporate",   issuer:"Euro Infra Group",        yld:"5.1%", price:"101.2", term:"5Y", rating:"BBB+", progress:45, raised:"9M",    target:"20M",  min:"1000",  status:"Live",    emoji:"🏗", featured:false },
  { id:6, name:"Municipal Development Note", ticker:"MUNI-31",       type:"Municipal",   issuer:"Regional Dev Fund",       yld:"4.3%", price:"102.1", term:"7Y", rating:"A+",   progress:65, raised:"6.5M",  target:"10M",  min:"1500",  status:"Upcoming",emoji:"🏛", featured:false },
];

const steps = [
  { n:"01", title:"Submit Bond Structure", body:"Define size, maturity, yield, investor profile, and offering goals." },
  { n:"02", title:"Review Documentation",  body:"Prepare issuer data, legal structure, financials, and disclosure package." },
  { n:"03", title:"Launch Fundraise",      body:"Open the offering to eligible investors through a digital bond issuance workflow." },
  { n:"04", title:"Track Progress",        body:"Monitor subscriptions, allocation progress, and fundraising milestones in real time." },
  { n:"05", title:"Secondary Market",      body:"Move eligible instruments toward digital exchange visibility and liquidity workflows." },
];

const faqs = [
  { q:"What types of bonds are listed?",    a:"The platform includes green, corporate, convertible, and municipal bond structures from verified issuers across Europe." },
  { q:"How is fundraising progress shown?", a:"Each bond displays a visible completion percentage and raised-versus-target amount updated in real time." },
  { q:"Can bonds trade digitally?",         a:"Where structure and review permit, digital bonds can progress toward exchange-based workflows on the Nextoken secondary market." },
  { q:"What is the minimum investment?",    a:"Minimum ticket size varies by bond and is shown directly in each listing, starting from as low as EUR 250." },
  { q:"How do issuers launch a bond?",      a:"Issuers begin through the Tokenize workflow, define structure, maturity, and investor terms, then submit documentation for review." },
];

const navLinks: [string, string][] = [["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"]];

const NAV: React.CSSProperties  = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:64, background:"rgba(5,5,8,0.95)", borderBottom:"1px solid rgba(255,255,255,0.08)", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(20px)" };
const PAGE: React.CSSProperties = { minHeight:"100vh", background:"#050508", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" };
const SEC: React.CSSProperties  = { maxWidth:1200, margin:"0 auto", padding:"64px 32px" };
const H2: React.CSSProperties   = { fontFamily:"Syne,sans-serif", fontSize:"clamp(26px,4vw,40px)", fontWeight:800, color:"#e8e8f0", margin:"0 0 12px", letterSpacing:"-0.5px" };
const LBL: React.CSSProperties  = { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#d4af37", marginBottom:10, display:"block" };
const SUB: React.CSSProperties  = { fontSize:15, color:"#b0b0c8", fontWeight:300, maxWidth:580, lineHeight:1.7, margin:"0 0 32px" };
const GOLD: React.CSSProperties = { padding:"12px 28px", borderRadius:10, background:"#d4af37", color:"#000", fontSize:14, fontWeight:700, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" };
const OUT: React.CSSProperties  = { padding:"12px 28px", borderRadius:10, background:"transparent", color:"#d4af37", fontSize:14, fontWeight:500, border:"1px solid rgba(212,175,55,0.35)", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" };
const BADGE: React.CSSProperties = { display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:20, border:"1px solid rgba(212,175,55,0.3)", background:"rgba(212,175,55,0.08)", color:"#d4af37", fontSize:11, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase" };

const filterBtn = (a: boolean): React.CSSProperties => ({ padding:"6px 14px", borderRadius:20, border:"1px solid "+(a?"rgba(212,175,55,0.5)":"rgba(255,255,255,0.08)"), background:a?"rgba(212,175,55,0.12)":"transparent", color:a?"#d4af37":"#b0b0c8", fontSize:12.5, fontWeight:500, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" });
const sortBtn  = (a: boolean): React.CSSProperties => ({ padding:"6px 12px", borderRadius:8, border:"1px solid "+(a?"rgba(212,175,55,0.5)":"rgba(255,255,255,0.08)"), background:a?"rgba(212,175,55,0.12)":"transparent", color:a?"#d4af37":"#7a7a96", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"inherit" });

function TypeTag({ type }: { type: string }) {
  const c = typeColor[type] || typeColor.Corporate;
  return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:c.bg, color:c.color, border:"1px solid "+c.border }}>{type}</span>;
}

function StatusTag({ status }: { status: string }) {
  const c = statusStyle[status] || statusStyle.Live;
  return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:c.bg, color:c.color, border:"1px solid "+c.border }}>{status}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px", background:"#0d0d14", border:"none", color:"#e8e8f0", fontSize:14.5, fontWeight:500, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
        <span>{q}</span>
        <span style={{ color:"#d4af37", fontSize:20, flexShrink:0, marginLeft:16 }}>{open ? "−" : "+"}</span>
      </button>
      {open && <div style={{ padding:"0 20px 18px", background:"#0d0d14" }}><p style={{ fontSize:13.5, color:"#b0b0c8", lineHeight:1.7, margin:0 }}>{a}</p></div>}
    </div>
  );
}

function BondCard({ bond }: { bond: typeof bonds[0] }) {
  const [hov, setHov] = useState(false);
  const tc = typeColor[bond.type] || typeColor.Corporate;
  const sc = statusStyle[bond.status] || statusStyle.Live;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:"#0d0d14", borderRadius:16, padding:24, transition:"all 0.2s", position:"relative", overflow:"hidden", border:"1px solid "+(hov?"rgba(212,175,55,0.35)":"rgba(255,255,255,0.08)"), transform:hov?"translateY(-2px)":"none" }}>
      {hov && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#d4af37,#f0d060)" }} />}
      {bond.featured && <div style={{ position:"absolute", top:14, right:14 }}><span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"rgba(212,175,55,0.15)", color:"#d4af37", border:"1px solid rgba(212,175,55,0.3)" }}>Featured</span></div>}
      <div style={{ fontSize:32, marginBottom:12 }}>{bond.emoji}</div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        <StatusTag status={bond.status} />
        <TypeTag type={bond.type} />
      </div>
      <div style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#e8e8f0", marginBottom:3 }}>{bond.name}</div>
      <div style={{ fontFamily:"monospace", fontSize:11, color:"#7a7a96", marginBottom:4 }}>{bond.ticker}</div>
      <div style={{ fontSize:12.5, color:"#7a7a96", marginBottom:16 }}>🏢 {bond.issuer}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, padding:14, background:"rgba(255,255,255,0.025)", borderRadius:10, marginBottom:16 }}>
        {([["Yield",bond.yld],["Price","EUR "+bond.price],["Term",bond.term]] as [string,string][]).map(([l,v]) => (
          <div key={l}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#d4af37" }}>{v}</div>
            <div style={{ fontSize:10.5, color:"#7a7a96", marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#7a7a96" }}>Rating</span>
          <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:ratingColor(bond.rating) }}>{bond.rating}</span>
        </div>
        <span style={{ fontSize:12, color:"#7a7a96" }}>Min: EUR {bond.min}</span>
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#7a7a96", marginBottom:6 }}>
          <span>Funding <strong style={{ color:"#e8e8f0" }}>{bond.progress}%</strong></span>
          <span>EUR {bond.raised} / EUR {bond.target}</span>
        </div>
        <div style={{ height:5, background:"rgba(255,255,255,0.07)", borderRadius:4, overflow:"hidden" }}>
          <div style={{ width:bond.progress+"%", height:"100%", background:"linear-gradient(90deg,#d4af37,#f0d060)", borderRadius:4 }} />
        </div>
      </div>
      <button
        onMouseEnter={(e) => { e.currentTarget.style.background="#d4af37"; e.currentTarget.style.color="#000"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background="rgba(212,175,55,0.08)"; e.currentTarget.style.color="#d4af37"; }}
        style={{ width:"100%", padding:"11px 0", borderRadius:10, border:"1px solid rgba(212,175,55,0.3)", background:"rgba(212,175,55,0.08)", color:"#d4af37", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
        Invest in This Bond
      </button>
    </div>
  );
}

export default function BondsPage() {
  const [activeType,   setActiveType]   = useState("All");
  const [activeSort,   setActiveSort]   = useState("Yield");
  const [activeStatus, setActiveStatus] = useState("All");

  const filtered = bonds.filter((b) => {
    const tok = activeType   === "All" || b.type   === activeType;
    const sok = activeStatus === "All" || b.status === activeStatus;
    return tok && sok;
  });

  return (
    <div style={PAGE}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse { animation: pulseDot 2s infinite; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#050508; }
        ::-webkit-scrollbar-thumb { background:rgba(212,175,55,0.3); border-radius:3px; }
        table { border-collapse:collapse; width:100%; }
        th { text-align:left; }
      \`}</style>

      {/* NAVBAR */}
      <nav style={NAV}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none" }}>
          <span style={{ fontFamily:"Syne,sans-serif", fontSize:19, fontWeight:800, color:"#d4af37", letterSpacing:2 }}>NXT</span>
          <div style={{ width:1, height:22, background:"rgba(212,175,55,0.25)" }} />
          <div>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:12.5, fontWeight:700, letterSpacing:"0.2em", color:"#d4af37" }}>NEXTOKEN</div>
            <div style={{ fontSize:8.5, letterSpacing:"0.2em", color:"#7a7a96", textTransform:"uppercase" }}>CAPITAL</div>
          </div>
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {navLinks.map(([l,h]) => (
            <a key={l} href={h} style={{ padding:"6px 14px", borderRadius:8, textDecoration:"none", fontSize:13.5, fontWeight:500, color:l==="Bonds"?"#d4af37":"#7a7a96", background:l==="Bonds"?"rgba(212,175,55,0.10)":"transparent" }}>{l}</a>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <a href="/login"    style={{ padding:"7px 18px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", color:"#b0b0c8", fontSize:13, textDecoration:"none" }}>Log In</a>
          <a href="/register" style={{ padding:"7px 18px", borderRadius:8, background:"#d4af37", color:"#000", fontSize:13, fontWeight:700, textDecoration:"none" }}>Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position:"relative", padding:"90px 32px 70px", textAlign:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 800px 400px at 50% -40px,rgba(212,175,55,0.15) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ ...BADGE, marginBottom:24 }}>
          <span className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#d4af37", display:"inline-block" }} />
          Fixed Income Market
        </div>
        <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(36px,6vw,68px)", fontWeight:800, lineHeight:1.05, letterSpacing:"-1.5px", color:"#e8e8f0", maxWidth:820, margin:"0 auto 20px" }}>
          Tokenized<br /><span style={{ color:"#d4af37" }}>Bond Market</span>
        </h1>
        <p style={{ fontSize:17, fontWeight:300, color:"#b0b0c8", maxWidth:600, margin:"0 auto 36px", lineHeight:1.7 }}>
          Explore corporate, green, municipal, and convertible bonds with digital issuance, transparent fundraising progress, and modern fixed-income discovery tools.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <a href="#listings" style={GOLD}>Explore Bonds</a>
          <a href="#issue"    style={OUT}>Issue a Bond</a>
        </div>
      </div>

      {/* STAT STRIP */}
      <div style={{ margin:"0 32px", borderTop:"1px solid rgba(255,255,255,0.08)", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"#0d0d14", display:"flex", flexWrap:"wrap" }}>
        {([{v:"6+",l:"Bond Listings"},{v:"8.2%",l:"Top Yield"},{v:"EUR 48M+",l:"Raise Pipeline"},{v:"4",l:"Bond Types"},{v:"EUR 250",l:"Min. Entry"},{v:"Live",l:"Digital Issuance"}] as {v:string;l:string}[]).map((s,i,arr) => (
          <div key={s.l} style={{ flex:1, minWidth:120, padding:"22px 20px", textAlign:"center", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.08)":"none" }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:"#d4af37" }}>{s.v}</div>
            <div style={{ fontSize:11, color:"#7a7a96", marginTop:3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* CATEGORIES */}
      <div style={SEC}>
        <span style={LBL}>Structures</span>
        <h2 style={H2}>Bond Categories You Can Access</h2>
        <p style={SUB}>Four distinct bond structures for different investor profiles and risk appetites.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16 }}>
          {([
            { icon:"🌱", name:"Green Bonds",      color:"#22c55e", desc:"Finance sustainability-focused infrastructure and energy projects with transparent yield structures." },
            { icon:"🏢", name:"Corporate Bonds",   color:"#818cf8", desc:"Raise working capital and growth funding through modern digital bond issuance workflows." },
            { icon:"🔄", name:"Convertible Notes", color:"#d4af37", desc:"Blend debt yield with future equity conversion logic for growth-stage issuers." },
            { icon:"🏛", name:"Municipal Bonds",   color:"#38bdf8", desc:"Support public and regional development with long-term funding structures." },
          ] as {icon:string;name:string;color:string;desc:string}[]).map((c) => (
            <div key={c.name}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor="rgba(212,175,55,0.3)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.transform="none"; }}
              style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:24, transition:"all 0.2s", cursor:"pointer" }}>
              <div style={{ fontSize:28, marginBottom:14 }}>{c.icon}</div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:c.color, marginBottom:8 }}>{c.name}</div>
              <div style={{ fontSize:13, color:"#b0b0c8", lineHeight:1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LISTINGS */}
      <div id="listings" style={SEC}>
        <span style={LBL}>Live Now</span>
        <h2 style={H2}>Bond Directory</h2>
        <p style={SUB}>High-yield digital bond listings open for subscription right now.</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, alignItems:"center", marginBottom:28 }}>
          <span style={{ fontSize:11.5, color:"#7a7a96", fontWeight:600 }}>TYPE</span>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {["All","Green","Corporate","Convertible","Municipal"].map((t) => (
              <button key={t} onClick={() => setActiveType(t)} style={filterBtn(activeType===t)}>{t}</button>
            ))}
          </div>
          <div style={{ width:1, height:28, background:"rgba(255,255,255,0.08)", margin:"0 4px" }} />
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {["All","Live","Closing","Upcoming"].map((s) => (
              <button key={s} onClick={() => setActiveStatus(s)} style={filterBtn(activeStatus===s)}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {filtered.map((b) => <BondCard key={b.id} bond={b} />)}
          {filtered.length===0 && <div style={{ gridColumn:"1/-1", padding:"60px 0", textAlign:"center", color:"#7a7a96" }}>No bonds match this filter.</div>}
        </div>
      </div>

      {/* TABLE */}
      <div style={SEC}>
        <span style={LBL}>Full Directory</span>
        <h2 style={H2}>All Bond Listings</h2>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
          {["Yield","Price","Term","Progress","Name"].map((s) => (
            <button key={s} onClick={() => setActiveSort(s)} style={sortBtn(activeSort===s)}>Sort: {s}</button>
          ))}
        </div>
        <div style={{ overflowX:"auto", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14 }}>
          <table>
            <thead>
              <tr style={{ background:"#12121c" }}>
                {["Bond","Type","Issuer","Yield","Price","Term","Rating","Progress","Min","Status","Action"].map((h) => (
                  <th key={h} style={{ padding:"13px 16px", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"#7a7a96", borderBottom:"1px solid rgba(255,255,255,0.08)", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bonds.map((b, i) => (
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ fontWeight:600, fontSize:13.5, color:"#e8e8f0" }}>{b.name}</div>
                    <div style={{ fontFamily:"monospace", fontSize:10.5, color:"#7a7a96" }}>{b.ticker}</div>
                  </td>
                  <td style={{ padding:"14px 16px" }}><TypeTag type={b.type} /></td>
                  <td style={{ padding:"14px 16px", fontSize:12.5, color:"#b0b0c8" }}>{b.issuer}</td>
                  <td style={{ padding:"14px 16px", fontFamily:"Syne,sans-serif", fontWeight:700, color:"#22c55e", fontSize:14 }}>{b.yld}</td>
                  <td style={{ padding:"14px 16px", fontFamily:"monospace", fontSize:12.5, color:"#e8e8f0" }}>EUR {b.price}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, color:"#b0b0c8" }}>{b.term}</td>
                  <td style={{ padding:"14px 16px", fontFamily:"monospace", fontWeight:700, fontSize:13, color:ratingColor(b.rating) }}>{b.rating}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ fontSize:11.5, color:"#7a7a96", marginBottom:5 }}>{b.progress}%</div>
                    <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden", width:80 }}>
                      <div style={{ width:b.progress+"%", height:"100%", background:"linear-gradient(90deg,#d4af37,#f0d060)" }} />
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px", fontFamily:"monospace", fontSize:12.5, color:"#e8e8f0" }}>EUR {b.min}</td>
                  <td style={{ padding:"14px 16px" }}><StatusTag status={b.status} /></td>
                  <td style={{ padding:"14px 16px", textAlign:"right" }}>
                    <button
                      onMouseEnter={(e) => { e.currentTarget.style.background="#d4af37"; e.currentTarget.style.color="#000"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#d4af37"; }}
                      style={{ padding:"6px 14px", borderRadius:8, border:"1px solid rgba(212,175,55,0.3)", background:"transparent", color:"#d4af37", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
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
      <div id="issue" style={SEC}>
        <span style={LBL}>Issuer Workflow</span>
        <h2 style={H2}>How Bond Issuance Works</h2>
        <p style={SUB}>From structure to on-chain settlement, Nextoken handles the full lifecycle of your bond raise.</p>
        <div style={{ position:"relative", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:32, marginTop:16 }}>
          <div style={{ position:"absolute", top:24, left:60, right:60, height:1, background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)" }} />
          {steps.map((step) => (
            <div key={step.n}>
              <div style={{ width:48, height:48, borderRadius:"50%", border:"1px solid rgba(212,175,55,0.3)", background:"rgba(212,175,55,0.10)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Syne,sans-serif", fontSize:15, fontWeight:700, color:"#d4af37", marginBottom:16, position:"relative", zIndex:1 }}>{step.n}</div>
              <h4 style={{ fontFamily:"Syne,sans-serif", fontSize:14.5, fontWeight:700, color:"#e8e8f0", marginBottom:8 }}>{step.title}</h4>
              <p style={{ fontSize:13, color:"#7a7a96", lineHeight:1.65, margin:0 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={SEC}>
        <span style={LBL}>FAQ</span>
        <h2 style={{ ...H2, marginBottom:28 }}>Common Bond Questions</h2>
        {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
      </div>

      {/* CTA */}
      <div style={{ margin:"0 32px 64px", borderRadius:18, padding:"64px 48px", textAlign:"center", position:"relative", overflow:"hidden", border:"1px solid rgba(212,175,55,0.3)", background:"linear-gradient(135deg,rgba(212,175,55,0.10) 0%,rgba(14,165,233,0.05) 100%)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 600px 300px at 50% 0%,rgba(212,175,55,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <span style={LBL}>Ready to Launch?</span>
          <h2 style={{ ...H2, marginBottom:12 }}>Launch a Digital Bond Today</h2>
          <p style={{ fontSize:15, color:"#b0b0c8", fontWeight:300, maxWidth:460, margin:"0 auto 32px", lineHeight:1.7 }}>Build a modern fixed-income offering with digital fundraising, transparent progress, and exchange-ready visibility.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="/tokenize" style={GOLD}>Issue a Bond</a>
            <a href="/exchange" style={OUT}>Explore Exchange</a>
          </div>
          <p style={{ fontSize:11, color:"#7a7a96", marginTop:24, opacity:0.7 }}>Bond market notice: Yield, price, and maturity may vary depending on issuer structure and jurisdiction.</p>
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
              <div style={{ fontSize:10.5, color:"#7a7a96", textTransform:"uppercase", letterSpacing:"0.05em" }}>MONITORED BY<br /><a href="#" style={{ color:"#d4af37", textDecoration:"none" }}>LT Bank of Lithuania</a></div>
            </div>
            <div>
              <h5 style={{ fontSize:10.5, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", color:"#7a7a96", marginBottom:16 }}>Products</h5>
              {navLinks.map(([l,h]) => (
                <a key={l} href={h} style={{ display:"block", fontSize:13, color:"#b0b0c8", textDecoration:"none", marginBottom:10 }}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:24, display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:10 }}>
            <p style={{ fontSize:12, color:"#7a7a96", margin:0 }}>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
            <p style={{ fontSize:11, color:"#7a7a96", opacity:0.7, margin:0 }}>Risk warning: Fixed income products may involve credit, liquidity, and market risks.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync("app/bonds/page.tsx", code, "utf8");
console.log("Done! " + code.length + " chars — clean TypeScript JSX, no React.createElement");