import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Navbar from "../components/Navbar";

const listings = [
  { id:1, emoji:"⚡", name:"VoltGrid Energy",      ticker:"VGE", subtype:"Blockchain IPO", type:"ipo",       risk:"low",    location:"Helsinki, Finland",      irr:"28.4%", min:"EUR 100",   minNum:100,  price:"EUR 2.10", target:"EUR 18M", raised:"EUR 15.7M", pct:87, status:"hot",      sl:"Hot"         },
  { id:2, emoji:"🤖", name:"NeuroLogic AI",         ticker:"NLA", subtype:"Series A",      type:"early",     risk:"medium", location:"Tallinn, Estonia",       irr:"34.2%", min:"EUR 500",   minNum:500,  price:"EUR 1.42", target:"EUR 25M", raised:"EUR 15.3M", pct:61, status:"live",     sl:"Live"        },
  { id:3, emoji:"🏥", name:"MedCore Pharma",         ticker:"MCP", subtype:"ERC-3643",      type:"token",     risk:"low",    location:"Zurich, Switzerland",    irr:"19.8%", min:"EUR 250",   minNum:250,  price:"EUR 3.20", target:"EUR 40M", raised:"EUR 29.6M", pct:74, status:"live",     sl:"Live"        },
  { id:4, emoji:"🌊", name:"AquaTech Solutions",     ticker:"ATS", subtype:"Blockchain IPO", type:"ipo",      risk:"medium", location:"Amsterdam, Netherlands", irr:"22.1%", min:"EUR 500",   minNum:500,  price:"EUR 1.55", target:"EUR 12M", raised:"EUR 11.2M", pct:93, status:"closing",  sl:"Closing Soon"},
  { id:5, emoji:"🛸", name:"OrbitalX Space",         ticker:"ORB", subtype:"Seed Round",    type:"early",     risk:"high",   location:"Warsaw, Poland",         irr:"31.7%", min:"EUR 1,000", minNum:1000, price:"EUR 0.88", target:"EUR 8M",  raised:"EUR 3.0M",  pct:38, status:"live",     sl:"Live"        },
  { id:6, emoji:"📦", name:"Baltic Logistics REIT",  ticker:"BLR", subtype:"Secondary",     type:"secondary", risk:"low",    location:"Riga, Latvia",           irr:"16.3%", min:"EUR 250",   minNum:250,  price:"EUR 1.08", target:"EUR 6M",  raised:"EUR 1.3M",  pct:22, status:"upcoming", sl:"Upcoming"    },
];

const statusStyle = {
  live:     { background:"rgba(34,197,94,0.10)",  color:"#22c55e", border:"1px solid rgba(34,197,94,0.25)"  },
  hot:      { background:"rgba(239,68,68,0.10)",  color:"#f87171", border:"1px solid rgba(239,68,68,0.25)"  },
  closing:  { background:"rgba(212,175,55,0.10)", color:"#F0B90B", border:"1px solid rgba(212,175,55,0.3)"  },
  upcoming: { background:"rgba(99,102,241,0.10)", color:"#818cf8", border:"1px solid rgba(99,102,241,0.3)"  },
};
const riskColor = { low:"#22c55e", medium:"#f59e0b", high:"#ef4444" };

const faqs = [
  { q:"What is a blockchain IPO?",                   a:"A blockchain IPO is a public equity offering launched natively on-chain. Investors receive compliant security tokens representing real equity ownership, with on-chain settlement and a transparent shareholder registry." },
  { q:"What does ERC-3643 mean?",                    a:"ERC-3643 is the regulatory-grade standard for security tokens on Ethereum. It enforces KYC, AML, and jurisdiction-based transfer controls at the smart contract level." },
  { q:"What is the minimum investment?",             a:"Minimum ticket sizes vary by offering. Early-stage rounds typically start from EUR 500 to EUR 1,000, while blockchain IPOs can have entry points as low as EUR 100." },
  { q:"Can equity tokens be traded after issuance?", a:"Yes. Qualifying equity tokens may be listed on the Nextoken secondary exchange for peer-to-peer trading among eligible investors." },
  { q:"How do issuers launch an equity raise?",      a:"Issuers begin through the Tokenize workflow, submit legal documentation and financials, define equity structure and investor terms, then launch a compliant digital fundraise." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px", background:"#0d0d14", border:"none", color:"#e8e8f0", fontSize:14.5, fontWeight:500, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
        <span>{q}</span>
        <span style={{ color:"#F0B90B", fontSize:20, flexShrink:0, marginLeft:16 }}>{open?"-":"+"}</span>
      </button>
      {open && <div style={{ padding:"0 20px 18px", background:"#0d0d14" }}><p style={{ fontSize:13.5, color:"#b0b0c8", lineHeight:1.7, margin:0 }}>{a}</p></div>}
    </div>
  );
}

function InvestModal({ item, onClose }) {
  const [amount, setAmount] = useState(String(item.minNum));
  const [step, setStep]     = useState("form");
  const [loading, setLoading] = useState(false);
  const priceNum = parseFloat(item.price.replace("EUR ",""));
  const tokens   = amount ? Math.floor(parseFloat(amount)/priceNum) : 0;

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
        <style>{`@keyframes eqspin{to{transform:rotate(360deg)}}`}</style>
        {step==="success"?(
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:52,marginBottom:14}}>🎉</div>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:20,fontWeight:800,color:"#22c55e",marginBottom:8}}>Investment Placed!</div>
            <p style={{fontSize:13,color:"#b0b0c8",lineHeight:1.7,marginBottom:20}}>You invested <strong style={{color:"#F0B90B"}}>EUR {amount}</strong> in <strong style={{color:"#fff"}}>{item.name}</strong>.<br/>Confirmation sent to your registered email.</p>
            <div style={{background:"rgba(240,185,11,0.06)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:10,padding:16,marginBottom:20,textAlign:"left"}}>
              {[["Company",item.name],["Ticker",item.ticker],["Amount","EUR "+amount],["Units",tokens+" @ "+item.price],["Target IRR",item.irr],["Stage",item.subtype]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
                  <span style={{color:"rgba(255,255,255,0.4)"}}>{l}</span>
                  <span style={{fontWeight:600,color:"#e8e8f0"}}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={onClose} style={{width:"100%",padding:12,background:"#F0B90B",color:"#000",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Done</button>
          </div>
        ):step==="confirm"?(
          <>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:800,color:"#e8e8f0",marginBottom:4}}>Confirm Investment</div>
            <p style={{fontSize:12,color:"#7a7a96",marginBottom:20,lineHeight:1.6}}>Review your details before confirming.</p>
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:16,marginBottom:16}}>
              {[["Company",item.name],["Stage",item.subtype],["Amount","EUR "+amount],["Units",tokens+" @ "+item.price],["Target IRR",item.irr],["Risk",item.risk.charAt(0).toUpperCase()+item.risk.slice(1)]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:8,borderBottom:"1px solid rgba(255,255,255,0.04)",paddingBottom:8}}>
                  <span style={{color:"#7a7a96"}}>{l}</span>
                  <span style={{fontWeight:600,color:"#e8e8f0"}}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",lineHeight:1.6,marginBottom:16}}>
              By confirming you agree to our <Link href="/terms" style={{color:"#F0B90B"}}>Terms</Link> and <Link href="/risk" style={{color:"#F0B90B"}}>Risk Disclosure</Link>. Subject to KYC.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:10}}>
              <button onClick={()=>setStep("form")} style={{padding:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"rgba(255,255,255,0.6)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>
              <button onClick={confirm} disabled={loading} style={{padding:12,background:"#F0B90B",color:"#000",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {loading?<><span style={{width:14,height:14,border:"2px solid rgba(0,0,0,0.2)",borderTopColor:"#000",borderRadius:"50%",animation:"eqspin .6s linear infinite",display:"inline-block"}}/>Investing...</>:"Confirm →"}
              </button>
            </div>
          </>
        ):(
          <>
            <div style={{fontSize:28,marginBottom:10}}>{item.emoji}</div>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:800,color:"#e8e8f0",marginBottom:2}}>{item.name}</div>
            <div style={{fontFamily:"monospace",fontSize:11,color:"#7a7a96",marginBottom:16}}>{item.ticker} · {item.subtype}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,background:"rgba(255,255,255,0.025)",borderRadius:10,padding:12,marginBottom:20}}>
              {[["Target IRR",item.irr],["Share Price",item.price],["Min. Invest",item.min]].map(([l,v])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:700,color:"#F0B90B"}}>{v}</div>
                  <div style={{fontSize:10,color:"#7a7a96",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:".5px",marginBottom:7}}>Investment Amount (EUR)</label>
            <input type="number" min={item.minNum} step="50" value={amount} onChange={e=>setAmount(e.target.value)}
              style={{width:"100%",background:"#161B22",color:"#fff",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"12px 14px",fontSize:16,fontWeight:700,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:8}}/>
            <div style={{fontSize:12,color:"#7a7a96",marginBottom:14}}>≈ {tokens} units @ {item.price}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
              {[item.minNum,item.minNum*2,item.minNum*5,item.minNum*10].map(v=>(
                <button key={v} onClick={()=>setAmount(String(v))} style={{padding:"5px 12px",borderRadius:8,border:"1px solid rgba(240,185,11,0.25)",background:String(amount)===String(v)?"rgba(240,185,11,0.12)":"transparent",color:"#F0B90B",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>€{v.toLocaleString()}</button>
              ))}
            </div>
            <div style={{background:"rgba(240,185,11,0.05)",border:"1px solid rgba(240,185,11,0.15)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.6,marginBottom:16}}>
              ⚠️ KYC required. <Link href="/register" style={{color:"#F0B90B"}}>Register</Link> or <Link href="/login" style={{color:"#F0B90B"}}>log in</Link> to invest.
            </div>
            <button onClick={()=>{if(!amount||parseFloat(amount)<item.minNum){alert("Min "+item.min);return;}setStep("confirm");}}
              onMouseEnter={e=>e.currentTarget.style.background="#FFD000"}
              onMouseLeave={e=>e.currentTarget.style.background="#F0B90B"}
              style={{width:"100%",padding:"13px 0",background:"#F0B90B",color:"#000",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
              Continue to Review →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ListingCard({ item, onInvest }) {
  const [hov, setHov] = useState(false);
  const st = statusStyle[item.status]||statusStyle.live;
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:"#0d0d14",border:"1px solid "+(hov?"rgba(240,185,11,0.35)":"rgba(255,255,255,0.08)"),borderRadius:16,padding:24,transition:"all 0.2s",position:"relative",overflow:"hidden",transform:hov?"translateY(-2px)":"none" }}>
      {hov&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#F0B90B,#fcd34d)"}}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <span style={{fontSize:32}}>{item.emoji}</span>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
          <span style={{...st,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600}}>{item.sl}</span>
          <span style={{padding:"3px 10px",borderRadius:20,fontSize:10.5,fontWeight:500,background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.08)"}}>{item.subtype}</span>
        </div>
      </div>
      <div style={{fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:700,color:"#e8e8f0",marginBottom:2}}>{item.name}</div>
      <div style={{fontFamily:"monospace",fontSize:11,color:"#7a7a96",marginBottom:4}}>{item.ticker}</div>
      <div style={{fontSize:12.5,color:"#7a7a96",marginBottom:16}}>Location: {item.location}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,padding:14,background:"rgba(255,255,255,0.025)",borderRadius:10,marginBottom:16}}>
        {[{v:item.irr,l:"Target IRR"},{v:item.min,l:"Min. Invest"},{v:item.target,l:"Raise Target"}].map(m=>(
          <div key={m.l}><div style={{fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:700,color:"#F0B90B"}}>{m.v}</div><div style={{fontSize:10.5,color:"#7a7a96",marginTop:2}}>{m.l}</div></div>
        ))}
      </div>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#7a7a96",marginBottom:6}}>
          <span>Funding {item.pct}%</span><span>{item.raised} / {item.target}</span>
        </div>
        <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}>
          <div style={{width:item.pct+"%",height:"100%",background:"linear-gradient(90deg,#F0B90B,#fcd34d)",borderRadius:4}}/>
        </div>
      </div>
      <div style={{fontSize:11.5,fontWeight:600,marginBottom:12,color:riskColor[item.risk]}}>{item.risk==="low"?"Low Risk":item.risk==="medium"?"Medium Risk":"High Risk"}</div>
      <button onClick={()=>onInvest(item)}
        onMouseEnter={e=>{e.currentTarget.style.background="#F0B90B";e.currentTarget.style.color="#000";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(240,185,11,0.08)";e.currentTarget.style.color="#F0B90B";}}
        style={{width:"100%",padding:"11px 0",borderRadius:10,border:"1px solid rgba(240,185,11,0.3)",background:"rgba(240,185,11,0.08)",color:"#F0B90B",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
        Invest Now →
      </button>
    </div>
  );
}

const typeFilters=[["all","All"],["ipo","Blockchain IPO"],["early","Early-Stage"],["token","Equity Token"],["secondary","Secondary"]];
const riskFilters=[["all","All Risk"],["low","Low"],["medium","Medium"],["high","High"]];
const FB=(a)=>({padding:"6px 14px",borderRadius:20,border:"1px solid "+(a?"rgba(240,185,11,0.5)":"rgba(255,255,255,0.08)"),background:a?"rgba(240,185,11,0.12)":"transparent",color:a?"#F0B90B":"#b0b0c8",fontSize:12.5,fontWeight:500,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"});
const S={page:{minHeight:"100vh",background:"#05060a",color:"#e8e8f0",fontFamily:"'DM Sans',system-ui,sans-serif"},sec:{maxWidth:1200,margin:"0 auto",padding:"64px 32px"},h2:{fontFamily:"Syne,sans-serif",fontSize:"clamp(26px,4vw,42px)",fontWeight:800,color:"#e8e8f0",margin:"0 0 12px",letterSpacing:"-0.5px"},lbl:{fontSize:11,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#F0B90B",marginBottom:10,display:"block"},sub:{fontSize:15,color:"#b0b0c8",fontWeight:300,maxWidth:560,lineHeight:1.7,margin:"0 0 32px"},gold:{padding:"12px 28px",borderRadius:10,background:"#F0B90B",color:"#000",fontSize:14,fontWeight:800,border:"none",cursor:"pointer",textDecoration:"none",display:"inline-block"},out:{padding:"12px 28px",borderRadius:10,background:"transparent",color:"#F0B90B",fontSize:14,fontWeight:600,border:"1px solid rgba(240,185,11,0.35)",cursor:"pointer",textDecoration:"none",display:"inline-block"},badge:{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:20,border:"1px solid rgba(240,185,11,0.3)",background:"rgba(240,185,11,0.08)",color:"#F0B90B",fontSize:11,fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase"}};

const tableRows=[
  {name:"NeuroLogic AI",ticker:"NLA",type:"Early-Stage",stage:"Series A",irr:"34.2%",price:"EUR 1.42",cap:"EUR 52M",risk:"medium",prog:"61%",min:"EUR 500",minNum:500,status:"live",emoji:"🤖",subtype:"Series A"},
  {name:"OrbitalX Space",ticker:"ORB",type:"Early-Stage",stage:"Seed",irr:"31.7%",price:"EUR 0.88",cap:"EUR 14M",risk:"high",prog:"38%",min:"EUR 1,000",minNum:1000,status:"live",emoji:"🛸",subtype:"Seed Round"},
  {name:"VoltGrid Energy",ticker:"VGE",type:"Blockchain IPO",stage:"Public",irr:"28.4%",price:"EUR 2.10",cap:"EUR 80M",risk:"low",prog:"87%",min:"EUR 100",minNum:100,status:"hot",emoji:"⚡",subtype:"Blockchain IPO"},
  {name:"AquaTech Solutions",ticker:"ATS",type:"Blockchain IPO",stage:"Public",irr:"22.1%",price:"EUR 1.55",cap:"EUR 35M",risk:"medium",prog:"93%",min:"EUR 500",minNum:500,status:"closing",emoji:"🌊",subtype:"Blockchain IPO"},
  {name:"MedCore Pharma",ticker:"MCP",type:"Equity Token",stage:"ERC-3643",irr:"19.8%",price:"EUR 3.20",cap:"EUR 190M",risk:"low",prog:"74%",min:"EUR 250",minNum:250,status:"live",emoji:"🏥",subtype:"ERC-3643"},
  {name:"Baltic Logistics REIT",ticker:"BLR",type:"Secondary",stage:"Token Float",irr:"16.3%",price:"EUR 1.08",cap:"EUR 28M",risk:"low",prog:"22%",min:"EUR 250",minNum:250,status:"upcoming",emoji:"📦",subtype:"Secondary"},
];

export default function EquityIPOPage() {
  const [activeType,setActiveType]=useState("all");
  const [activeRisk,setActiveRisk]=useState("all");
  const [activeSort,setActiveSort]=useState("IRR");
  const [investItem,setInvestItem]=useState(null);
  const filtered=listings.filter(l=>(activeType==="all"||l.type===activeType)&&(activeRisk==="all"||l.risk===activeRisk));

  return (
    <>
      <Head><title>Equity & IPO — Nextoken Capital</title><meta name="description" content="Invest in tokenized equity and blockchain IPOs on Nextoken Capital."/></Head>
      <Navbar />
      <div style={{...S.page,paddingTop:64}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{margin:0}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}.pulse{animation:pulse 2s infinite}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#05060a}::-webkit-scrollbar-thumb{background:rgba(240,185,11,0.3);border-radius:3px}table{border-collapse:collapse;width:100%}th{text-align:left}`}</style>

        <div style={{position:"relative",padding:"90px 32px 70px",textAlign:"center",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 800px 400px at 50% -40px,rgba(240,185,11,0.13) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <div style={{...S.badge,marginBottom:24}}><span className="pulse" style={{width:7,height:7,borderRadius:"50%",background:"#F0B90B",display:"inline-block"}}/>Equity and IPO</div>
          <h1 style={{fontFamily:"Syne,sans-serif",fontSize:"clamp(36px,6vw,68px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-1.5px",color:"#e8e8f0",maxWidth:820,margin:"0 auto 20px"}}>Digital Equity and<br/><span style={{color:"#F0B90B"}}>Blockchain IPO Market</span></h1>
          <p style={{fontSize:17,fontWeight:300,color:"#b0b0c8",maxWidth:600,margin:"0 auto 36px",lineHeight:1.7}}>Participate in tokenized equity raises and blockchain-native IPOs. Early-stage access, transparent cap tables, and on-chain share issuance for modern investors.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}><a href="#listings" style={S.gold}>Explore Listings</a><a href="#issue" style={S.out}>Issue Equity</a></div>
        </div>

        <div style={{margin:"0 32px",borderTop:"1px solid rgba(255,255,255,0.08)",borderBottom:"1px solid rgba(255,255,255,0.08)",background:"#0d0d14",display:"flex",flexWrap:"wrap"}}>
          {[{v:"12",l:"Active Offerings"},{v:"EUR 140M+",l:"Total Capital Raised"},{v:"34.2%",l:"Highest Upside"},{v:"EUR 100",l:"Lowest Entry"},{v:"4",l:"Equity Types"},{v:"ERC-3643",l:"Compliance Standard"}].map((s,i,arr)=>(
            <div key={s.l} style={{flex:1,minWidth:130,padding:"22px 20px",textAlign:"center",borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.08)":"none"}}>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:24,fontWeight:800,color:"#F0B90B"}}>{s.v}</div>
              <div style={{fontSize:11,color:"#7a7a96",marginTop:3}}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={S.sec}>
          <span style={S.lbl}>Structures</span><h2 style={S.h2}>Equity Structures You Can Access</h2>
          <p style={S.sub}>From early-stage SAFEs to full blockchain IPO listings, Nextoken supports the complete equity capital lifecycle.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
            {[{icon:"🚀",name:"Blockchain IPO",desc:"Full public equity offerings launched on-chain with transparent allocation and secondary market readiness."},{icon:"🌱",name:"Early-Stage Equity",desc:"Invest in pre-IPO rounds. Includes SAFE notes, priced seed rounds, and Series A allocations."},{icon:"📊",name:"Equity Tokens (ST)",desc:"ERC-3643 compliant security tokens with regulatory-grade investor whitelisting and transfer controls."},{icon:"🔄",name:"Secondary Listings",desc:"Trade previously issued equity tokens on the Nextoken exchange for early investor liquidity."}].map(c=>(
              <div key={c.name} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(240,185,11,0.3)";e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.transform="none";}} style={{background:"#0d0d14",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:24,transition:"all 0.2s",cursor:"pointer"}}>
                <div style={{fontSize:28,marginBottom:14}}>{c.icon}</div>
                <div style={{fontFamily:"Syne,sans-serif",fontSize:16,fontWeight:700,color:"#e8e8f0",marginBottom:8}}>{c.name}</div>
                <div style={{fontSize:13,color:"#b0b0c8",lineHeight:1.6}}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div id="listings" style={S.sec}>
          <span style={S.lbl}>Live Now</span><h2 style={S.h2}>Equity and IPO Directory</h2>
          <p style={S.sub}>Browse active raises, upcoming IPOs, and secondary market equity token listings.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",marginBottom:28}}>
            <span style={{fontSize:11.5,color:"#7a7a96",fontWeight:600}}>TYPE</span>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{typeFilters.map(([v,l])=><button key={v} onClick={()=>setActiveType(v)} style={FB(activeType===v)}>{l}</button>)}</div>
            <div style={{width:1,height:28,background:"rgba(255,255,255,0.08)",margin:"0 4px"}}/>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{riskFilters.map(([v,l])=><button key={v} onClick={()=>setActiveRisk(v)} style={FB(activeRisk===v)}>{l}</button>)}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
            {filtered.map(item=><ListingCard key={item.id} item={item} onInvest={setInvestItem}/>)}
            {filtered.length===0&&<div style={{gridColumn:"1/-1",padding:"60px 0",textAlign:"center",color:"#7a7a96"}}>No listings match this filter.</div>}
          </div>
        </div>

        <div style={S.sec}>
          <span style={S.lbl}>Full Directory</span><h2 style={S.h2}>All Equity Listings</h2>
          <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
            {["IRR","Mkt Cap","Progress","Min. Invest","Name"].map(s=>(
              <button key={s} onClick={()=>setActiveSort(s)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+(activeSort===s?"rgba(240,185,11,0.5)":"rgba(255,255,255,0.08)"),background:activeSort===s?"rgba(240,185,11,0.12)":"transparent",color:activeSort===s?"#F0B90B":"#7a7a96",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>Sort: {s}</button>
            ))}
          </div>
          <div style={{overflowX:"auto",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14}}>
            <table>
              <thead><tr style={{background:"#12121c"}}>
                {["Company","Type","Stage","Target IRR","Share Price","Mkt Cap","Risk","Progress","Min","Status",""].map(h=>(
                  <th key={h} style={{padding:"13px 16px",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#7a7a96",borderBottom:"1px solid rgba(255,255,255,0.08)",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {tableRows.map((row,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"14px 16px"}}><div style={{fontWeight:600,fontSize:13.5,color:"#e8e8f0"}}>{row.name}</div><div style={{fontFamily:"monospace",fontSize:10.5,color:"#7a7a96"}}>{row.ticker}</div></td>
                    <td style={{padding:"14px 16px"}}><span style={{padding:"3px 9px",borderRadius:20,fontSize:10.5,background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.08)"}}>{row.type}</span></td>
                    <td style={{padding:"14px 16px",fontSize:13,color:"#b0b0c8"}}>{row.stage}</td>
                    <td style={{padding:"14px 16px",fontFamily:"Syne,sans-serif",fontWeight:700,color:"#22c55e"}}>{row.irr}</td>
                    <td style={{padding:"14px 16px",fontFamily:"monospace",fontSize:12.5,color:"#e8e8f0"}}>{row.price}</td>
                    <td style={{padding:"14px 16px",fontFamily:"monospace",fontSize:12.5,color:"#b0b0c8"}}>{row.cap}</td>
                    <td style={{padding:"14px 16px",fontSize:12,fontWeight:600,color:riskColor[row.risk]}}>{row.risk==="low"?"Low":row.risk==="medium"?"Med":"High"}</td>
                    <td style={{padding:"14px 16px",fontSize:12.5,color:"#b0b0c8"}}>{row.prog}</td>
                    <td style={{padding:"14px 16px",fontFamily:"monospace",fontSize:12.5,color:"#e8e8f0"}}>{row.min}</td>
                    <td style={{padding:"14px 16px"}}><span style={{...(statusStyle[row.status]||statusStyle.live),padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600}}>{row.status==="live"?"Live":row.status==="hot"?"Hot":row.status==="closing"?"Closing":"Upcoming"}</span></td>
                    <td style={{padding:"14px 16px",textAlign:"right"}}>
                      <button onClick={()=>setInvestItem(row)} onMouseEnter={e=>{e.currentTarget.style.background="#F0B90B";e.currentTarget.style.color="#000";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#F0B90B";}} style={{padding:"6px 14px",borderRadius:8,border:"1px solid rgba(240,185,11,0.3)",background:"transparent",color:"#F0B90B",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>Invest →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div id="issue" style={{background:"#0a0a10",borderTop:"1px solid rgba(255,255,255,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={S.sec}>
            <span style={S.lbl}>Issuer Workflow</span><h2 style={S.h2}>How Equity Issuance Works</h2>
            <p style={S.sub}>From structure to on-chain settlement, Nextoken handles the full lifecycle of your equity raise.</p>
            <div style={{position:"relative",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:32}}>
              <div style={{position:"absolute",top:24,left:60,right:60,height:1,background:"linear-gradient(90deg,transparent,rgba(240,185,11,0.3),transparent)"}}/>
              {[{n:"01",t:"Define Structure",b:"Set share class, supply, valuation cap, investor rights, and preferred terms."},{n:"02",t:"Submit Legal Docs",b:"Prepare cap table, pitch deck, audited financials, and disclosure package."},{n:"03",t:"Token Issuance",b:"ERC-3643 security tokens with KYC-gated investor whitelisting on-chain."},{n:"04",t:"Run the Fundraise",b:"Open subscriptions, monitor allocation progress and milestones in real time."},{n:"05",t:"Exchange Listing",b:"Qualified tokens progress to Nextoken secondary exchange for liquidity."}].map(s=>(
                <div key={s.n}>
                  <div style={{width:48,height:48,borderRadius:"50%",border:"1px solid rgba(240,185,11,0.3)",background:"rgba(240,185,11,0.10)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:700,color:"#F0B90B",marginBottom:16,position:"relative",zIndex:1}}>{s.n}</div>
                  <h4 style={{fontFamily:"Syne,sans-serif",fontSize:14,fontWeight:700,color:"#e8e8f0",marginBottom:8}}>{s.t}</h4>
                  <p style={{fontSize:13,color:"#7a7a96",lineHeight:1.65,margin:0}}>{s.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={S.sec}>
          <span style={S.lbl}>FAQ</span><h2 style={{...S.h2,marginBottom:28}}>Common Equity Questions</h2>
          {faqs.map(f=><FaqItem key={f.q} q={f.q} a={f.a}/>)}
        </div>

        <div style={{margin:"0 32px 64px",borderRadius:18,padding:"64px 48px",textAlign:"center",position:"relative",overflow:"hidden",border:"1px solid rgba(240,185,11,0.3)",background:"linear-gradient(135deg,rgba(240,185,11,0.08) 0%,rgba(99,102,241,0.06) 100%)"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 600px 300px at 50% 0%,rgba(240,185,11,0.10) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <span style={S.lbl}>Get Started</span>
            <h2 style={{...S.h2,marginBottom:12}}>Ready to Issue or Invest in Digital Equity?</h2>
            <p style={{fontSize:15,color:"#b0b0c8",fontWeight:300,maxWidth:460,margin:"0 auto 32px",lineHeight:1.7}}>Join 1,000+ investors and issuers building the future of capital markets on Nextoken.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <Link href="/tokenize" style={S.gold}>Issue Equity</Link>
              <Link href="/exchange" style={S.out}>Explore Exchange</Link>
            </div>
          </div>
        </div>

        <footer style={{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"48px 32px 28px"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:48,marginBottom:40}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <span style={{fontFamily:"Syne,sans-serif",fontSize:20,fontWeight:900,color:"#F0B90B",letterSpacing:2}}>NXT</span>
                  <div style={{width:1,height:22,background:"rgba(240,185,11,0.25)"}}/>
                  <div><div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:800,letterSpacing:"0.15em",color:"#F0B90B"}}>NEXTOKEN</div><div style={{fontSize:9,letterSpacing:"0.2em",color:"#7a7a96",textTransform:"uppercase"}}>CAPITAL</div></div>
                </div>
                <p style={{fontSize:13,color:"#7a7a96",maxWidth:240,lineHeight:1.7,marginBottom:16}}>The regulated infrastructure for tokenized real-world assets. Registered in Lithuania.</p>
              </div>
              <div>
                <h5 style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"#7a7a96",marginBottom:16}}>Products</h5>
                {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"]].map(([l,h])=>(
                  <Link key={l} href={h} style={{display:"block",fontSize:13,color:"#b0b0c8",textDecoration:"none",marginBottom:10}}>{l}</Link>
                ))}
              </div>
            </div>
            <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:20,display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:10}}>
              <p style={{fontSize:12,color:"#7a7a96",margin:0}}>2026 Nextoken Capital UAB. All rights reserved.</p>
              <p style={{fontSize:11,color:"#7a7a96",opacity:0.7,margin:0}}>Risk warning: Investing involves significant risk.</p>
            </div>
          </div>
        </footer>
      </div>

      {investItem && <InvestModal item={investItem} onClose={()=>setInvestItem(null)}/>}
    </>
  );
}