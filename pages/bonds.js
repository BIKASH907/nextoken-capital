import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Navbar from "../components/Navbar";

const typeColor = {
  Green:       { bg:"rgba(34,197,94,0.08)",  color:"#22c55e", border:"rgba(34,197,94,0.25)"  },
  Corporate:   { bg:"rgba(99,102,241,0.08)", color:"#818cf8", border:"rgba(99,102,241,0.3)"  },
  Convertible: { bg:"rgba(240,185,11,0.08)", color:"#F0B90B", border:"rgba(240,185,11,0.3)"  },
  Municipal:   { bg:"rgba(14,165,233,0.08)", color:"#38bdf8", border:"rgba(14,165,233,0.25)" },
};
const statusStyle = {
  Live:     { bg:"rgba(34,197,94,0.10)",  color:"#22c55e", border:"rgba(34,197,94,0.25)"  },
  Closing:  { bg:"rgba(240,185,11,0.10)", color:"#F0B90B", border:"rgba(240,185,11,0.3)"  },
  Upcoming: { bg:"rgba(99,102,241,0.10)", color:"#818cf8", border:"rgba(99,102,241,0.3)"  },
};
const ratingColor = (r) => { if (r.startsWith("A")) return "#22c55e"; if (r.startsWith("BB")) return "#f59e0b"; return "#ef4444"; };

const bonds = [
  { id:1, name:"SME Convertible Note I",     ticker:"SME-CNV-26",    type:"Convertible", issuer:"Growth Capital Partners", yld:"8.2%", price:"99.8",  term:"2Y", rating:"BB",   progress:94, raised:"940K",  target:"1M",   min:"250",   status:"Closing", emoji:"💼", featured:true  },
  { id:2, name:"Logistics Income Bond",      ticker:"LOGI-28",       type:"Corporate",   issuer:"Baltic Logistics REIT",   yld:"6.9%", price:"97.9",  term:"4Y", rating:"BBB",  progress:60, raised:"2.4M",  target:"4M",   min:"500",   status:"Live",    emoji:"🏭", featured:true  },
  { id:3, name:"Baltic Green Bond 2027",     ticker:"BALT-GREEN-27", type:"Green",       issuer:"Baltic Energy UAB",       yld:"6.4%", price:"98.4",  term:"3Y", rating:"A-",   progress:72, raised:"3.6M",  target:"5M",   min:"500",   status:"Live",    emoji:"🌱", featured:true  },
  { id:4, name:"Renewable Yield Note 2030",  ticker:"RYN-30",        type:"Green",       issuer:"Nord Renewables",         yld:"5.8%", price:"100.4", term:"6Y", rating:"A",    progress:53, raised:"4.2M",  target:"8M",   min:"750",   status:"Live",    emoji:"💨", featured:false },
  { id:5, name:"EU Infrastructure Bond",     ticker:"EU-INFRA-29",   type:"Corporate",   issuer:"Euro Infra Group",        yld:"5.1%", price:"101.2", term:"5Y", rating:"BBB+", progress:45, raised:"9M",    target:"20M",  min:"1000",  status:"Live",    emoji:"🏗", featured:false },
  { id:6, name:"Municipal Development Note", ticker:"MUNI-31",       type:"Municipal",   issuer:"Regional Dev Fund",       yld:"4.3%", price:"102.1", term:"7Y", rating:"A+",   progress:65, raised:"6.5M",  target:"10M",  min:"1500",  status:"Upcoming",emoji:"🏛", featured:false },
];
const faqs = [
  { q:"What types of bonds are listed?",    a:"The platform includes green, corporate, convertible, and municipal bond structures from verified issuers across Europe and globally." },
  { q:"How is fundraising progress shown?", a:"Each bond displays a visible completion percentage and raised-versus-target amount updated in real time." },
  { q:"Can bonds trade digitally?",         a:"Where structure and review permit, digital bonds can progress toward exchange-based workflows on the Nextoken secondary market." },
  { q:"What is the minimum investment?",    a:"Minimum ticket size varies by bond and is shown in each listing, starting from as low as EUR 250." },
  { q:"How do issuers launch a bond?",      a:"Issuers begin through the Tokenize workflow, define structure, maturity, and investor terms, then submit documentation for review." },
];
const S = {
  page:  { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  sec:   { maxWidth:1200, margin:"0 auto", padding:"64px 32px" },
  h2:    { fontFamily:"Syne,sans-serif", fontSize:"clamp(26px,4vw,42px)", fontWeight:800, color:"#e8e8f0", margin:"0 0 12px", letterSpacing:"-0.5px" },
  lbl:   { fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:10, display:"block" },
  sub:   { fontSize:15, color:"#b0b0c8", fontWeight:300, maxWidth:580, lineHeight:1.7, margin:"0 0 32px" },
  card:  { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:24, transition:"all 0.2s" },
  gold:  { padding:"12px 28px", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block" },
  out:   { padding:"12px 28px", borderRadius:10, background:"transparent", color:"#F0B90B", fontSize:14, fontWeight:600, border:"1px solid rgba(240,185,11,0.35)", cursor:"pointer", textDecoration:"none", display:"inline-block" },
  badge: { display:"inline-flex", alignItems:"center", gap:8, padding:"5px 14px", borderRadius:20, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:11, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase" },
  FB:    (a) => ({ padding:"6px 14px", borderRadius:20, border:"1px solid "+(a?"rgba(240,185,11,0.5)":"rgba(255,255,255,0.08)"), background:a?"rgba(240,185,11,0.12)":"transparent", color:a?"#F0B90B":"#b0b0c8", fontSize:12.5, fontWeight:500, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }),
};

function TypeTag({ type }) { const c = typeColor[type]||typeColor.Corporate; return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:c.bg, color:c.color, border:"1px solid "+c.border }}>{type}</span>; }
function StatusTag({ status }) { const c = statusStyle[status]||statusStyle.Live; return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:c.bg, color:c.color, border:"1px solid "+c.border }}>{status}</span>; }

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px", background:"#0d0d14", border:"none", color:"#e8e8f0", fontSize:14.5, fontWeight:500, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
        <span>{q}</span><span style={{ color:"#F0B90B", fontSize:20, flexShrink:0, marginLeft:16 }}>{open?"-":"+"}</span>
      </button>
      {open && <div style={{ padding:"0 20px 18px", background:"#0d0d14" }}><p style={{ fontSize:13.5, color:"#b0b0c8", lineHeight:1.7, margin:0 }}>{a}</p></div>}
    </div>
  );
}

// ── NEW: INVEST MODAL ──────────────────────────────────────────────────────────
function InvestModal({ bond, onClose }) {
  const [amount, setAmount] = useState(bond.min);
  const [step, setStep]     = useState("form");
  const [loading, setLoading] = useState(false);
  const tokens = amount ? Math.floor(parseFloat(amount)/parseFloat(bond.price)) : 0;
  const annual = amount ? (parseFloat(amount)*parseFloat(bond.yld)/100).toFixed(2) : "0.00";

  const confirm = async () => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,1400));
    setLoading(false);
    setStep("success");
  };

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"#0d0d14",border:"1px solid rgba(240,185,11,0.25)",borderRadius:18,padding:28,width:"100%",maxWidth:420,position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:16,right:18,background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:22,cursor:"pointer",lineHeight:1 }}>×</button>
        <style>{`@keyframes bspin{to{transform:rotate(360deg)}}`}</style>

        {step==="success" ? (
          <div style={{ textAlign:"center",padding:"16px 0" }}>
            <div style={{ fontSize:52,marginBottom:14 }}>🎉</div>
            <div style={{ fontFamily:"Syne,sans-serif",fontSize:20,fontWeight:800,color:"#22c55e",marginBottom:8 }}>Investment Placed!</div>
            <p style={{ fontSize:13,color:"#b0b0c8",lineHeight:1.7,marginBottom:20 }}>You invested <strong style={{color:"#F0B90B"}}>EUR {amount}</strong> in <strong style={{color:"#fff"}}>{bond.name}</strong>. Confirmation sent to your registered email.</p>
            <div style={{ background:"rgba(240,185,11,0.06)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:10,padding:16,marginBottom:20,textAlign:"left" }}>
              {[["Bond",bond.name],["Amount","EUR "+amount],["Yield",bond.yld+" p.a."],["Est. Annual Return","EUR "+annual],["Term",bond.term]].map(([l,v])=>(
                <div key={l} style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6 }}>
                  <span style={{color:"rgba(255,255,255,0.4)"}}>{l}</span>
                  <span style={{fontWeight:600,color:"#e8e8f0"}}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={onClose} style={{ width:"100%",padding:12,background:"#F0B90B",color:"#000",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit" }}>Done</button>
          </div>
        ) : step==="confirm" ? (
          <>
            <div style={{ fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:800,color:"#e8e8f0",marginBottom:4 }}>Confirm Investment</div>
            <p style={{ fontSize:12,color:"#7a7a96",marginBottom:20,lineHeight:1.6 }}>Review your details before confirming.</p>
            <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:16,marginBottom:16 }}>
              {[["Bond",bond.name],["Issuer",bond.issuer],["Amount","EUR "+amount],["Tokens",tokens+" tokens @ EUR "+bond.price],["Yield",bond.yld+" per annum"],["Est. Annual Return","EUR "+annual],["Term",bond.term],["Rating",bond.rating]].map(([l,v])=>(
                <div key={l} style={{ display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:8,borderBottom:"1px solid rgba(255,255,255,0.04)",paddingBottom:8 }}>
                  <span style={{color:"#7a7a96"}}>{l}</span>
                  <span style={{fontWeight:600,color:"#e8e8f0",textAlign:"right",maxWidth:"55%"}}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize:11,color:"rgba(255,255,255,0.3)",lineHeight:1.6,marginBottom:16 }}>
              By confirming you agree to our <Link href="/terms" style={{color:"#F0B90B"}}>Terms</Link> and <Link href="/risk" style={{color:"#F0B90B"}}>Risk Disclosure</Link>. Subject to KYC verification.
            </p>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:10 }}>
              <button onClick={()=>setStep("form")} style={{ padding:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"rgba(255,255,255,0.6)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>← Back</button>
              <button onClick={confirm} disabled={loading} style={{ padding:12,background:"#F0B90B",color:"#000",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                {loading?<><span style={{width:14,height:14,border:"2px solid rgba(0,0,0,0.2)",borderTopColor:"#000",borderRadius:"50%",animation:"bspin .6s linear infinite",display:"inline-block"}}/>Investing...</>:"Confirm Investment →"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize:28,marginBottom:10 }}>{bond.emoji}</div>
            <div style={{ fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:800,color:"#e8e8f0",marginBottom:2 }}>{bond.name}</div>
            <div style={{ fontFamily:"monospace",fontSize:11,color:"#7a7a96",marginBottom:16 }}>{bond.ticker} · {bond.issuer}</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,background:"rgba(255,255,255,0.025)",borderRadius:10,padding:12,marginBottom:20 }}>
              {[["Yield",bond.yld],["Term",bond.term],["Rating",bond.rating]].map(([l,v])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"Syne,sans-serif",fontSize:16,fontWeight:700,color:"#F0B90B"}}>{v}</div>
                  <div style={{fontSize:10,color:"#7a7a96",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <label style={{ display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:".5px",marginBottom:7 }}>Investment Amount (EUR)</label>
            <input type="number" min={bond.min} step="50" value={amount} onChange={e=>setAmount(e.target.value)}
              style={{ width:"100%",background:"#161B22",color:"#fff",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"12px 14px",fontSize:16,fontWeight:700,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:8 }} />
            <div style={{ fontSize:12,color:"#7a7a96",marginBottom:14 }}>
              ≈ {tokens} tokens · Est. annual return: <span style={{color:"#22c55e",fontWeight:700}}>EUR {annual}</span>
            </div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:18 }}>
              {[bond.min, String(parseInt(bond.min)*2), String(parseInt(bond.min)*5), String(parseInt(bond.min)*10)].map(v=>(
                <button key={v} onClick={()=>setAmount(v)} style={{ padding:"5px 12px",borderRadius:8,border:"1px solid rgba(240,185,11,0.25)",background:String(amount)===String(v)?"rgba(240,185,11,0.12)":"transparent",color:"#F0B90B",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>€{parseInt(v).toLocaleString()}</button>
              ))}
            </div>
            <div style={{ background:"rgba(240,185,11,0.05)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.6,marginBottom:16 }}>
              ⚠️ Investment requires KYC verification. <Link href="/register" style={{color:"#F0B90B"}}>Register</Link> or <Link href="/login" style={{color:"#F0B90B"}}>log in</Link> to complete.
            </div>
            <button onClick={()=>{ if(!amount||parseFloat(amount)<parseFloat(bond.min)){alert("Min EUR "+bond.min);return;} setStep("confirm"); }}
              style={{ width:"100%",padding:"13px 0",background:"#F0B90B",color:"#000",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit" }}
              onMouseEnter={e=>e.currentTarget.style.background="#FFD000"}
              onMouseLeave={e=>e.currentTarget.style.background="#F0B90B"}>
              Continue to Review →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── BOND CARD (identical to original + onInvest prop) ─────────────────────────
function BondCard({ bond, onInvest }) {
  const [hov, setHov] = useState(false);
  const sc = statusStyle[bond.status]||statusStyle.Live;
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ ...S.card,border:"1px solid "+(hov?"rgba(240,185,11,0.35)":"rgba(255,255,255,0.08)"),transform:hov?"translateY(-2px)":"none",position:"relative",overflow:"hidden" }}>
      {hov&&<div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#F0B90B,#fcd34d)" }}/>}
      {bond.featured&&<div style={{ position:"absolute",top:14,right:14 }}><span style={{ padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(240,185,11,0.15)",color:"#F0B90B",border:"1px solid rgba(240,185,11,0.3)" }}>Featured</span></div>}
      <div style={{ fontSize:32,marginBottom:12 }}>{bond.emoji}</div>
      <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
        <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:sc.bg,color:sc.color,border:"1px solid "+sc.border }}>{bond.status}</span>
        <TypeTag type={bond.type}/>
      </div>
      <div style={{ fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:700,color:"#e8e8f0",marginBottom:3 }}>{bond.name}</div>
      <div style={{ fontFamily:"monospace",fontSize:11,color:"#7a7a96",marginBottom:4 }}>{bond.ticker}</div>
      <div style={{ fontSize:12.5,color:"#7a7a96",marginBottom:16 }}>Issuer: {bond.issuer}</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,padding:14,background:"rgba(255,255,255,0.025)",borderRadius:10,marginBottom:16 }}>
        {[["Yield",bond.yld],["Price","EUR "+bond.price],["Term",bond.term]].map(([l,v])=>(
          <div key={l}><div style={{ fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:700,color:"#F0B90B" }}>{v}</div><div style={{ fontSize:10.5,color:"#7a7a96",marginTop:2 }}>{l}</div></div>
        ))}
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          <span style={{ fontSize:11,color:"#7a7a96" }}>Rating</span>
          <span style={{ fontFamily:"monospace",fontSize:13,fontWeight:700,color:ratingColor(bond.rating) }}>{bond.rating}</span>
        </div>
        <span style={{ fontSize:12,color:"#7a7a96" }}>Min: EUR {bond.min}</span>
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,color:"#7a7a96",marginBottom:6 }}>
          <span>Funding {bond.progress}%</span><span>EUR {bond.raised} / EUR {bond.target}</span>
        </div>
        <div style={{ height:5,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden" }}>
          <div style={{ width:bond.progress+"%",height:"100%",background:"linear-gradient(90deg,#F0B90B,#fcd34d)",borderRadius:4 }}/>
        </div>
      </div>
      <button onClick={()=>onInvest(bond)}
        onMouseEnter={(e)=>{e.currentTarget.style.background="#F0B90B";e.currentTarget.style.color="#000";}}
        onMouseLeave={(e)=>{e.currentTarget.style.background="rgba(240,185,11,0.08)";e.currentTarget.style.color="#F0B90B";}}
        style={{ width:"100%",padding:"11px 0",borderRadius:10,border:"1px solid rgba(240,185,11,0.3)",background:"rgba(240,185,11,0.08)",color:"#F0B90B",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s" }}>
        Invest in This Bond →
      </button>
    </div>
  );
}

export default function BondsPage() {
  const [activeType,   setActiveType]   = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeSort,   setActiveSort]   = useState("Yield");
  const [investBond,   setInvestBond]   = useState(null);

  const filtered = bonds.filter(b=>(activeType==="All"||b.type===activeType)&&(activeStatus==="All"||b.status===activeStatus));

  return (
    <>
      <Head>
        <title>Bonds — Nextoken Capital</title>
        <meta name="description" content="Invest in tokenized bond securities on Nextoken Capital." />
      </Head>

      <Navbar />

      <div style={{ ...S.page, paddingTop:64 }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
          *{box-sizing:border-box;margin:0;padding:0}body{margin:0}
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}.pulse{animation:pulse 2s infinite}
          ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#05060a}::-webkit-scrollbar-thumb{background:rgba(240,185,11,0.3);border-radius:3px}
          table{border-collapse:collapse;width:100%}th{text-align:left}
        `}</style>

        {/* HERO */}
        <div style={{ position:"relative",padding:"90px 32px 70px",textAlign:"center",overflow:"hidden" }}>
          <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 800px 400px at 50% -40px,rgba(240,185,11,0.13) 0%,transparent 70%)",pointerEvents:"none" }}/>
          <div style={{ ...S.badge,marginBottom:24 }}>
            <span className="pulse" style={{ width:7,height:7,borderRadius:"50%",background:"#F0B90B",display:"inline-block" }}/>
            Fixed Income Market
          </div>
          <h1 style={{ fontFamily:"Syne,sans-serif",fontSize:"clamp(36px,6vw,68px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-1.5px",color:"#e8e8f0",maxWidth:820,margin:"0 auto 20px" }}>
            Tokenized<br/><span style={{ color:"#F0B90B" }}>Bond Market</span>
          </h1>
          <p style={{ fontSize:17,fontWeight:300,color:"#b0b0c8",maxWidth:600,margin:"0 auto 36px",lineHeight:1.7 }}>
            Explore corporate, green, municipal, and convertible bonds with digital issuance, transparent fundraising progress, and modern fixed-income discovery tools.
          </p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
            <a href="#listings" style={S.gold}>Explore Bonds</a>
            <a href="#issue"    style={S.out}>Issue a Bond</a>
          </div>
        </div>

        {/* STATS */}
        <div style={{ margin:"0 32px",borderTop:"1px solid rgba(255,255,255,0.08)",borderBottom:"1px solid rgba(255,255,255,0.08)",background:"#0d0d14",display:"flex",flexWrap:"wrap" }}>
          {[{v:"6+",l:"Bond Listings"},{v:"8.2%",l:"Top Yield"},{v:"EUR 48M+",l:"Raise Pipeline"},{v:"4",l:"Bond Types"},{v:"EUR 250",l:"Min. Entry"},{v:"Live",l:"Digital Issuance"}].map((s,i,arr)=>(
            <div key={s.l} style={{ flex:1,minWidth:120,padding:"22px 20px",textAlign:"center",borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.08)":"none" }}>
              <div style={{ fontFamily:"Syne,sans-serif",fontSize:24,fontWeight:800,color:"#F0B90B" }}>{s.v}</div>
              <div style={{ fontSize:11,color:"#7a7a96",marginTop:3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* CATEGORIES */}
        <div style={S.sec}>
          <span style={S.lbl}>Structures</span>
          <h2 style={S.h2}>Bond Categories</h2>
          <p style={S.sub}>Four distinct bond structures for different investor profiles and risk appetites.</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16 }}>
            {[{icon:"🌱",name:"Green Bonds",color:"#22c55e",desc:"Finance sustainability-focused infrastructure and energy projects with transparent yield structures."},{icon:"🏢",name:"Corporate Bonds",color:"#818cf8",desc:"Raise working capital and growth funding through modern digital bond issuance workflows."},{icon:"🔄",name:"Convertible Notes",color:"#F0B90B",desc:"Blend debt yield with future equity conversion logic for growth-stage issuers."},{icon:"🏛",name:"Municipal Bonds",color:"#38bdf8",desc:"Support public and regional development with long-term funding structures."}].map(c=>(
              <div key={c.name}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(240,185,11,0.3)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.transform="none";}}
                style={{ ...S.card,cursor:"pointer" }}>
                <div style={{ fontSize:28,marginBottom:14 }}>{c.icon}</div>
                <div style={{ fontFamily:"Syne,sans-serif",fontSize:16,fontWeight:700,color:c.color,marginBottom:8 }}>{c.name}</div>
                <div style={{ fontSize:13,color:"#b0b0c8",lineHeight:1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LISTINGS */}
        <div id="listings" style={S.sec}>
          <span style={S.lbl}>Live Now</span>
          <h2 style={S.h2}>Bond Directory</h2>
          <p style={S.sub}>High-yield digital bond listings open for subscription right now.</p>
          <div style={{ display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",marginBottom:28 }}>
            <span style={{ fontSize:11.5,color:"#7a7a96",fontWeight:600 }}>TYPE</span>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {["All","Green","Corporate","Convertible","Municipal"].map(t=>(
                <button key={t} onClick={()=>setActiveType(t)} style={S.FB(activeType===t)}>{t}</button>
              ))}
            </div>
            <div style={{ width:1,height:28,background:"rgba(255,255,255,0.08)",margin:"0 4px" }}/>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {["All","Live","Closing","Upcoming"].map(s=>(
                <button key={s} onClick={()=>setActiveStatus(s)} style={S.FB(activeStatus===s)}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20 }}>
            {filtered.map(b=><BondCard key={b.id} bond={b} onInvest={setInvestBond}/>)}
            {filtered.length===0&&<div style={{ gridColumn:"1/-1",padding:"60px 0",textAlign:"center",color:"#7a7a96" }}>No bonds match this filter.</div>}
          </div>
        </div>

        {/* TABLE */}
        <div style={{ background:"#0a0a10",borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={S.sec}>
            <span style={S.lbl}>Full Directory</span>
            <h2 style={S.h2}>All Bond Listings</h2>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:20 }}>
              {["Yield","Price","Term","Progress","Name"].map(s=>(
                <button key={s} onClick={()=>setActiveSort(s)} style={{ padding:"6px 12px",borderRadius:8,border:"1px solid "+(activeSort===s?"rgba(240,185,11,0.5)":"rgba(255,255,255,0.08)"),background:activeSort===s?"rgba(240,185,11,0.12)":"transparent",color:activeSort===s?"#F0B90B":"#7a7a96",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit" }}>Sort: {s}</button>
              ))}
            </div>
            <div style={{ overflowX:"auto",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14 }}>
              <table>
                <thead>
                  <tr style={{ background:"#12121c" }}>
                    {["Bond","Type","Issuer","Yield","Price","Term","Rating","Progress","Min","Status",""].map(h=>(
                      <th key={h} style={{ padding:"13px 16px",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#7a7a96",borderBottom:"1px solid rgba(255,255,255,0.08)",whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bonds.map((b,i)=>(
                    <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"14px 16px" }}><div style={{ fontWeight:600,fontSize:13.5,color:"#e8e8f0" }}>{b.name}</div><div style={{ fontFamily:"monospace",fontSize:10.5,color:"#7a7a96" }}>{b.ticker}</div></td>
                      <td style={{ padding:"14px 16px" }}><TypeTag type={b.type}/></td>
                      <td style={{ padding:"14px 16px",fontSize:12.5,color:"#b0b0c8" }}>{b.issuer}</td>
                      <td style={{ padding:"14px 16px",fontFamily:"Syne,sans-serif",fontWeight:700,color:"#22c55e",fontSize:14 }}>{b.yld}</td>
                      <td style={{ padding:"14px 16px",fontFamily:"monospace",fontSize:12.5,color:"#e8e8f0" }}>EUR {b.price}</td>
                      <td style={{ padding:"14px 16px",fontSize:13,color:"#b0b0c8" }}>{b.term}</td>
                      <td style={{ padding:"14px 16px",fontFamily:"monospace",fontWeight:700,fontSize:13,color:ratingColor(b.rating) }}>{b.rating}</td>
                      <td style={{ padding:"14px 16px" }}>
                        <div style={{ fontSize:11.5,color:"#7a7a96",marginBottom:4 }}>{b.progress}%</div>
                        <div style={{ height:4,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden",width:80 }}>
                          <div style={{ width:b.progress+"%",height:"100%",background:"linear-gradient(90deg,#F0B90B,#fcd34d)" }}/>
                        </div>
                      </td>
                      <td style={{ padding:"14px 16px",fontFamily:"monospace",fontSize:12.5,color:"#e8e8f0" }}>EUR {b.min}</td>
                      <td style={{ padding:"14px 16px" }}><StatusTag status={b.status}/></td>
                      <td style={{ padding:"14px 16px",textAlign:"right" }}>
                        <button onClick={()=>setInvestBond(b)}
                          onMouseEnter={e=>{e.currentTarget.style.background="#F0B90B";e.currentTarget.style.color="#000";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#F0B90B";}}
                          style={{ padding:"6px 14px",borderRadius:8,border:"1px solid rgba(240,185,11,0.3)",background:"transparent",color:"#F0B90B",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s" }}>
                          Invest →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div id="issue" style={S.sec}>
          <span style={S.lbl}>Issuer Workflow</span>
          <h2 style={S.h2}>How Bond Issuance Works</h2>
          <p style={S.sub}>From structure to on-chain settlement, Nextoken handles the full lifecycle of your bond raise.</p>
          <div style={{ position:"relative",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:32 }}>
            <div style={{ position:"absolute",top:24,left:60,right:60,height:1,background:"linear-gradient(90deg,transparent,rgba(240,185,11,0.3),transparent)" }}/>
            {[{n:"01",t:"Submit Bond Structure",b:"Define size, maturity, yield, investor profile, and offering goals."},{n:"02",t:"Review Documentation",b:"Prepare issuer data, legal structure, financials, and disclosure package."},{n:"03",t:"Launch Fundraise",b:"Open the offering to eligible investors through a digital bond issuance workflow."},{n:"04",t:"Track Progress",b:"Monitor subscriptions, allocation progress, and fundraising milestones in real time."},{n:"05",t:"Secondary Market",b:"Move eligible instruments toward digital exchange visibility and liquidity workflows."}].map(s=>(
              <div key={s.n}>
                <div style={{ width:48,height:48,borderRadius:"50%",border:"1px solid rgba(240,185,11,0.3)",background:"rgba(240,185,11,0.10)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:700,color:"#F0B90B",marginBottom:16,position:"relative",zIndex:1 }}>{s.n}</div>
                <h4 style={{ fontFamily:"Syne,sans-serif",fontSize:14.5,fontWeight:700,color:"#e8e8f0",marginBottom:8 }}>{s.t}</h4>
                <p style={{ fontSize:13,color:"#7a7a96",lineHeight:1.65,margin:0 }}>{s.b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background:"#0a0a10",borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={S.sec}>
            <span style={S.lbl}>FAQ</span>
            <h2 style={{ ...S.h2,marginBottom:28 }}>Common Bond Questions</h2>
            {faqs.map(f=><FaqItem key={f.q} q={f.q} a={f.a}/>)}
          </div>
        </div>

        {/* CTA */}
        <div style={{ margin:"0 32px 64px",borderRadius:18,padding:"64px 48px",textAlign:"center",position:"relative",overflow:"hidden",border:"1px solid rgba(240,185,11,0.3)",background:"linear-gradient(135deg,rgba(240,185,11,0.08) 0%,rgba(14,165,233,0.05) 100%)" }}>
          <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 600px 300px at 50% 0%,rgba(240,185,11,0.10) 0%,transparent 70%)",pointerEvents:"none" }}/>
          <div style={{ position:"relative",zIndex:1 }}>
            <span style={S.lbl}>Ready to Launch?</span>
            <h2 style={{ ...S.h2,marginBottom:12 }}>Launch a Digital Bond Today</h2>
            <p style={{ fontSize:15,color:"#b0b0c8",fontWeight:300,maxWidth:460,margin:"0 auto 32px",lineHeight:1.7 }}>Build a modern fixed-income offering with digital fundraising, transparent progress, and exchange-ready visibility.</p>
            <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
              <Link href="/tokenize" style={S.gold}>Issue a Bond</Link>
              <Link href="/exchange" style={S.out}>Explore Exchange</Link>
            </div>
            <p style={{ fontSize:11,color:"#7a7a96",marginTop:24,opacity:0.7 }}>Bond market notice: Yield, price, and maturity may vary depending on issuer structure and jurisdiction.</p>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop:"1px solid rgba(255,255,255,0.08)",padding:"48px 32px 28px" }}>
          <div style={{ maxWidth:1200,margin:"0 auto" }}>
            <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:48,marginBottom:40 }}>
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
                  <span style={{ fontFamily:"Syne,sans-serif",fontSize:20,fontWeight:900,color:"#F0B90B",letterSpacing:2 }}>NXT</span>
                  <div style={{ width:1,height:22,background:"rgba(240,185,11,0.25)" }}/>
                  <div>
                    <div style={{ fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:800,letterSpacing:"0.15em",color:"#F0B90B" }}>NEXTOKEN</div>
                    <div style={{ fontSize:9,letterSpacing:"0.2em",color:"#7a7a96",textTransform:"uppercase" }}>CAPITAL</div>
                  </div>
                </div>
                <p style={{ fontSize:13,color:"#7a7a96",maxWidth:240,lineHeight:1.7,marginBottom:16 }}>The regulated infrastructure for tokenized real-world assets. Registered in Lithuania.</p>
                <p style={{ fontSize:11,color:"#7a7a96",textTransform:"uppercase",letterSpacing:"0.05em" }}>MONITORED BY <a href="#" style={{ color:"#F0B90B",textDecoration:"none" }}>Bank of Lithuania</a></p>
              </div>
              <div>
                <h5 style={{ fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"#7a7a96",marginBottom:16 }}>Products</h5>
                {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"]].map(([l,h])=>(
                  <Link key={l} href={h} style={{ display:"block",fontSize:13,color:"#b0b0c8",textDecoration:"none",marginBottom:10 }}>{l}</Link>
                ))}
              </div>
            </div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:20,display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:10 }}>
              <p style={{ fontSize:12,color:"#7a7a96",margin:0 }}>2026 Nextoken Capital UAB. All rights reserved.</p>
              <p style={{ fontSize:11,color:"#7a7a96",opacity:0.7,margin:0 }}>Risk warning: Fixed income products may involve credit, liquidity, and market risks.</p>
            </div>
          </div>
        </footer>
      </div>

      {investBond && <InvestModal bond={investBond} onClose={()=>setInvestBond(null)}/>}
    </>
  );
}