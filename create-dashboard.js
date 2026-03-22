const fs = require("fs");

const code = `import Link from "next/link";
import { useState } from "react";

const user = {
  name: "Bikash Bhat",
  email: "bikash@nextokencapital.com",
  kycStatus: "pending",
  joined: "March 2026",
  country: "Lithuania",
  accountType: "Investor",
};

const holdings = [
  { id:1, emoji:"🌱", name:"Baltic Green Bond 2027",    ticker:"BALT-GREEN-27", type:"Green Bond",    value:4920,  cost:4800,  gain:120,   gainPct:2.5,  tokens:50,    yield:"6.4%", status:"active"  },
  { id:2, emoji:"⚡", name:"VoltGrid Energy",           ticker:"VGE",           type:"Equity Token",  value:2310,  cost:2100,  gain:210,   gainPct:10.0, tokens:1100,  yield:"28.4%",status:"active"  },
  { id:3, emoji:"🤖", name:"NeuroLogic AI Series A",   ticker:"NLA",           type:"Early Stage",   value:1420,  cost:1500,  gain:-80,   gainPct:-5.3, tokens:1000,  yield:"34.2%",status:"locked"  },
  { id:4, emoji:"🏢", name:"Berlin Office Token",       ticker:"BOT-1",         type:"Real Estate",   value:980,   cost:1000,  gain:-20,   gainPct:-2.0, tokens:2,     yield:"16.4%",status:"active"  },
];

const activity = [
  { date:"21 Mar 2026", type:"invest",   icon:"💰", action:"Invested",         asset:"VoltGrid Energy",         amount:"+EUR 500",  color:"#22c55e" },
  { date:"18 Mar 2026", type:"invest",   icon:"💰", action:"Invested",         asset:"Baltic Green Bond 2027",  amount:"+EUR 1,000",color:"#22c55e" },
  { date:"15 Mar 2026", type:"kyc",      icon:"🪪", action:"KYC Submitted",    asset:"Identity Documents",      amount:"—",         color:"#f59e0b" },
  { date:"12 Mar 2026", type:"register", icon:"✅", action:"Account Created",  asset:"Nextoken Capital",        amount:"—",         color:"#818cf8" },
];

const kycSteps = [
  { label:"Account Created",           done:true,  active:false },
  { label:"Documents Submitted",       done:true,  active:false },
  { label:"Sumsub Review in Progress", done:false, active:true  },
  { label:"Compliance Approval",       done:false, active:false },
  { label:"Full Access Unlocked",      done:false, active:false },
];

const lockedActions = [
  "Invest in new assets",
  "Purchase bonds",
  "Participate in IPOs",
  "Register assets for tokenization",
  "Secondary market trading",
  "Withdraw funds",
];

const allowedActions = [
  "Browse all markets",
  "View all listings",
  "Explore bond offerings",
  "View investment details",
  "Use AI support chatbot",
  "View your portfolio",
];

const watchlist = [
  { emoji:"☀️", name:"Solar Farm Portfolio",  type:"Real Estate", irr:"18.2%", min:"EUR 250",   status:"Closing" },
  { emoji:"💨", name:"Wind Energy Project",   type:"Energy",      irr:"17.6%", min:"EUR 250",   status:"Live"    },
  { emoji:"💼", name:"Tech Business Park",    type:"Commercial",  irr:"15.9%", min:"EUR 500",   status:"Live"    },
];

const totalValue    = holdings.reduce((s,h) => s + h.value, 0);
const totalCost     = holdings.reduce((s,h) => s + h.cost,  0);
const totalGain     = totalValue - totalCost;
const totalGainPct  = ((totalGain / totalCost) * 100).toFixed(1);

const S = {
  page:    { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  wrap:    { maxWidth:1300, margin:"0 auto", padding:"32px 24px" },
  card:    { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:24 },
  lbl:     { fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8" },
  gold:    { padding:"10px 22px", borderRadius:9, background:"#F0B90B", color:"#000", fontSize:13.5, fontWeight:800, border:"none", cursor:"pointer", textDecoration:"none", display:"inline-block", fontFamily:"inherit" },
  tab:     (a) => ({ padding:"9px 18px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13.5, fontWeight:600, transition:"all 0.15s", background:a?"rgba(240,185,11,0.12)":"transparent", color:a?"#F0B90B":"#8a9bb8" }),
};

function StatCard({ icon, label, value, sub, color, locked }) {
  return (
    <div style={{ ...S.card, position:"relative", overflow:"hidden" }}>
      {locked && <div style={{ position:"absolute", top:10, right:10, fontSize:14 }}>🔒</div>}
      <div style={{ fontSize:28, marginBottom:10 }}>{icon}</div>
      <div style={{ fontSize:11, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>{label}</div>
      <div style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, color:color||"#F0B90B" }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:"#8a9bb8", marginTop:3 }}>{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={S.page}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#05060a; }
        ::-webkit-scrollbar-thumb { background:rgba(240,185,11,0.3); border-radius:3px; }
        table { border-collapse:collapse; width:100%; }
        th { text-align:left; }
      \`}</style>

      <div style={S.wrap}>

        {/* HEADER */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:28 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#F0B90B", marginBottom:6 }}>Investor Dashboard</p>
            <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"clamp(22px,3.5vw,34px)", fontWeight:800, margin:"0 0 4px", color:"#e8e8f0" }}>
              Welcome back, {user.name.split(" ")[0]} 👋
            </h1>
            <p style={{ fontSize:13.5, color:"#8a9bb8", margin:0 }}>{user.email} · Joined {user.joined} · {user.accountType}</p>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <div style={{ padding:"10px 18px", borderRadius:12, background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.25)", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:18 }}>⏳</span>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:"#f59e0b", margin:0 }}>KYC Pending</p>
                <p style={{ fontSize:11, color:"#8a9bb8", margin:0 }}>Sumsub review in progress</p>
              </div>
            </div>
            <Link href="/markets" style={S.gold}>Explore Markets</Link>
          </div>
        </div>

        {/* KYC BANNER */}
        <div style={{ padding:"18px 22px", borderRadius:16, border:"1px solid rgba(245,158,11,0.3)", background:"rgba(245,158,11,0.05)", display:"flex", gap:16, alignItems:"flex-start", marginBottom:28, flexWrap:"wrap" }}>
          <span style={{ fontSize:24, flexShrink:0 }}>⚠️</span>
          <div style={{ flex:1, minWidth:240 }}>
            <p style={{ fontSize:14, fontWeight:700, color:"#f59e0b", margin:"0 0 5px" }}>Complete KYC to unlock full platform access</p>
            <p style={{ fontSize:13, color:"#8a9bb8", margin:"0 0 12px", lineHeight:1.6 }}>
              Your identity verification is in progress via Sumsub. Until approved, you <strong style={{ color:"#f59e0b" }}>cannot invest in new assets</strong> or register assets for issuance.
            </p>
            <Link href="/register" style={S.gold}>🪪 Complete Verification</Link>
          </div>
          {/* KYC Progress */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:200 }}>
            {kycSteps.map(s => (
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, border:"1px solid", borderColor:s.done?"rgba(34,197,94,0.4)":s.active?"rgba(245,158,11,0.4)":"rgba(255,255,255,0.1)", background:s.done?"rgba(34,197,94,0.1)":s.active?"rgba(245,158,11,0.1)":"rgba(255,255,255,0.03)", color:s.done?"#22c55e":s.active?"#f59e0b":"#8a9bb8" }}>
                  {s.done ? "✓" : s.active ? "…" : "○"}
                </div>
                <p style={{ fontSize:11.5, margin:0, fontWeight:s.active?700:400, color:s.done?"#22c55e":s.active?"#f59e0b":"#8a9bb8" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:28 }}>
          <StatCard icon="💼" label="Portfolio Value"  value={"EUR "+totalValue.toLocaleString()} sub={holdings.length+" holdings"} color="#F0B90B" />
          <StatCard icon="📈" label="Total Gain"       value={(totalGain>=0?"+":"")+totalGain+" EUR"} sub={"All time · "+totalGainPct+"%"} color={totalGain>=0?"#22c55e":"#ef4444"} />
          <StatCard icon="🔒" label="Locked (KYC)"     value="EUR 1,420" sub="Unlocks after KYC" color="#f59e0b" locked />
          <StatCard icon="📊" label="Active Holdings"  value={holdings.filter(h=>h.status==="active").length+""} sub={holdings.length+" total"} color="#818cf8" />
          <StatCard icon="🌍" label="Country"          value={user.country} sub="EU Regulated" color="#38bdf8" />
        </div>

        {/* TABS */}
        <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:"1px solid rgba(255,255,255,0.07)", paddingBottom:12, flexWrap:"wrap" }}>
          {[["overview","Overview"],["holdings","Holdings"],["activity","Activity"],["watchlist","Watchlist"],["access","Access Level"]].map(([v,l]) => (
            <button key={v} onClick={() => setTab(v)} style={S.tab(tab===v)}>{l}</button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab==="overview" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

            {/* Portfolio Breakdown */}
            <div style={S.card}>
              <p style={{ ...S.lbl, marginBottom:16 }}>Portfolio Breakdown</p>
              {holdings.map(h => (
                <div key={h.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:24 }}>{h.emoji}</span>
                    <div>
                      <p style={{ fontSize:13.5, fontWeight:600, color:"#e8e8f0", margin:0 }}>{h.name}</p>
                      <p style={{ fontSize:11, color:"#8a9bb8", margin:0 }}>{h.type} · {h.tokens} tokens</p>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:14, fontWeight:700, color:"#e8e8f0", margin:0 }}>EUR {h.value.toLocaleString()}</p>
                    <p style={{ fontSize:12, fontWeight:600, color:h.gain>=0?"#22c55e":"#ef4444", margin:0 }}>{h.gain>=0?"+":""}{h.gain} EUR ({h.gainPct}%)</p>
                  </div>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0 0" }}>
                <span style={{ fontSize:14, fontWeight:700, color:"#e8e8f0" }}>Total</span>
                <span style={{ fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:800, color:"#F0B90B" }}>EUR {totalValue.toLocaleString()}</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={S.card}>
                <p style={{ ...S.lbl, marginBottom:16 }}>Recent Activity</p>
                {activity.map((a,i) => (
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, background:"rgba(255,255,255,0.05)" }}>{a.icon}</div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:13, fontWeight:600, color:"#e8e8f0", margin:0 }}>{a.action}</p>
                      <p style={{ fontSize:11.5, color:"#8a9bb8", margin:0 }}>{a.asset} · {a.date}</p>
                    </div>
                    <p style={{ fontSize:13, fontWeight:700, color:a.color, margin:0, flexShrink:0 }}>{a.amount}</p>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div style={S.card}>
                <p style={{ ...S.lbl, marginBottom:14 }}>Quick Actions</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    { icon:"🔍", label:"Browse Markets",   href:"/markets"    },
                    { icon:"📈", label:"Equity & IPO",     href:"/equity-ipo" },
                    { icon:"💰", label:"Bond Listings",    href:"/bonds"      },
                    { icon:"🔄", label:"Exchange",         href:"/exchange"   },
                    { icon:"🏢", label:"Tokenize Asset",   href:"/tokenize"   },
                    { icon:"🪪", label:"Complete KYC",     href:"/register"   },
                  ].map(q => (
                    <Link key={q.label} href={q.href}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", borderRadius:10, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)", textDecoration:"none", transition:"all 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor="rgba(240,185,11,0.3)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"}>
                      <span style={{ fontSize:16 }}>{q.icon}</span>
                      <span style={{ fontSize:12.5, color:"#b0b7c3", fontWeight:500 }}>{q.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── HOLDINGS TAB ── */}
        {tab==="holdings" && (
          <div style={S.card}>
            <p style={{ ...S.lbl, marginBottom:20 }}>All Holdings</p>
            <div style={{ overflowX:"auto" }}>
              <table>
                <thead>
                  <tr style={{ background:"#12121c" }}>
                    {["Asset","Type","Tokens","Current Value","Cost Basis","Gain / Loss","Yield","Status"].map(h => (
                      <th key={h} style={{ padding:"12px 16px", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"#8a9bb8", borderBottom:"1px solid rgba(255,255,255,0.07)", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holdings.map(h => (
                    <tr key={h.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"14px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontSize:22 }}>{h.emoji}</span>
                          <div>
                            <div style={{ fontWeight:600, fontSize:13.5, color:"#e8e8f0" }}>{h.name}</div>
                            <div style={{ fontFamily:"monospace", fontSize:10.5, color:"#8a9bb8" }}>{h.ticker}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"14px 16px" }}>
                        <span style={{ padding:"3px 9px", borderRadius:20, fontSize:11, background:"rgba(255,255,255,0.05)", color:"#8a9bb8", border:"1px solid rgba(255,255,255,0.08)" }}>{h.type}</span>
                      </td>
                      <td style={{ padding:"14px 16px", fontFamily:"monospace", fontSize:13, color:"#b0b7c3" }}>{h.tokens.toLocaleString()}</td>
                      <td style={{ padding:"14px 16px", fontWeight:700, fontSize:14, color:"#e8e8f0" }}>EUR {h.value.toLocaleString()}</td>
                      <td style={{ padding:"14px 16px", fontSize:13, color:"#8a9bb8" }}>EUR {h.cost.toLocaleString()}</td>
                      <td style={{ padding:"14px 16px", fontWeight:700, fontSize:13, color:h.gain>=0?"#22c55e":"#ef4444" }}>
                        {h.gain>=0?"+":""}{h.gain} ({h.gainPct}%)
                      </td>
                      <td style={{ padding:"14px 16px", fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:14, color:"#F0B90B" }}>{h.yield}</td>
                      <td style={{ padding:"14px 16px" }}>
                        <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:h.status==="active"?"rgba(34,197,94,0.1)":"rgba(245,158,11,0.1)", color:h.status==="active"?"#22c55e":"#f59e0b", border:"1px solid "+(h.status==="active"?"rgba(34,197,94,0.25)":"rgba(245,158,11,0.25)") }}>
                          {h.status==="locked" ? "🔒 KYC Required" : "● Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop:16, padding:"14px 16px", borderRadius:12, background:"rgba(240,185,11,0.04)", border:"1px solid rgba(240,185,11,0.15)", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
              {[{l:"Total Value",v:"EUR "+totalValue.toLocaleString()},{l:"Total Cost",v:"EUR "+totalCost.toLocaleString()},{l:"Total Gain",v:(totalGain>=0?"+":"")+totalGain+" EUR"},{l:"Return",v:totalGainPct+"%"}].map(s => (
                <div key={s.l} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:11, color:"#8a9bb8", marginBottom:3 }}>{s.l}</div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:800, color:"#F0B90B" }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ACTIVITY TAB ── */}
        {tab==="activity" && (
          <div style={S.card}>
            <p style={{ ...S.lbl, marginBottom:20 }}>Transaction History</p>
            {activity.map((a,i) => (
              <div key={i} style={{ display:"flex", gap:16, alignItems:"center", padding:"16px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width:44, height:44, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.07)" }}>{a.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:"#e8e8f0", margin:0 }}>{a.action}</p>
                  <p style={{ fontSize:12.5, color:"#8a9bb8", margin:0 }}>{a.asset}</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontSize:15, fontWeight:700, color:a.color, margin:0 }}>{a.amount}</p>
                  <p style={{ fontSize:11.5, color:"#8a9bb8", margin:0 }}>{a.date}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop:16, padding:14, borderRadius:12, background:"rgba(99,102,241,0.05)", border:"1px solid rgba(99,102,241,0.2)" }}>
              <p style={{ fontSize:12.5, color:"#818cf8", margin:0 }}>📋 Full transaction history will be available once KYC is approved and trading is enabled.</p>
            </div>
          </div>
        )}

        {/* ── WATCHLIST TAB ── */}
        {tab==="watchlist" && (
          <div>
            <div style={{ marginBottom:16, padding:"14px 18px", borderRadius:12, border:"1px solid rgba(245,158,11,0.25)", background:"rgba(245,158,11,0.05)", display:"flex", gap:10 }}>
              <span style={{ fontSize:18 }}>🔒</span>
              <p style={{ fontSize:13, color:"#f59e0b", margin:0, lineHeight:1.6 }}>
                <strong>KYC required to invest.</strong> You can browse and save opportunities but cannot invest until identity verification is complete.{" "}
                <Link href="/register" style={{ color:"#F0B90B", fontWeight:700 }}>Complete KYC →</Link>
              </p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
              {watchlist.map(w => (
                <div key={w.name}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(240,185,11,0.3)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="none"; }}
                  style={{ ...S.card, transition:"all 0.2s", cursor:"pointer" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <span style={{ fontSize:32 }}>{w.emoji}</span>
                    <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:w.status==="Live"?"rgba(34,197,94,0.1)":"rgba(240,185,11,0.1)", color:w.status==="Live"?"#22c55e":"#F0B90B", border:"1px solid "+(w.status==="Live"?"rgba(34,197,94,0.25)":"rgba(240,185,11,0.3)") }}>{w.status}</span>
                  </div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#e8e8f0", marginBottom:3 }}>{w.name}</div>
                  <div style={{ fontSize:12, color:"#8a9bb8", marginBottom:14 }}>{w.type}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:12, background:"rgba(255,255,255,0.025)", borderRadius:10, marginBottom:14 }}>
                    <div><div style={{ fontFamily:"Syne,sans-serif", fontSize:16, fontWeight:700, color:"#F0B90B" }}>{w.irr}</div><div style={{ fontSize:10.5, color:"#8a9bb8" }}>Target ROI</div></div>
                    <div><div style={{ fontFamily:"Syne,sans-serif", fontSize:14, fontWeight:700, color:"#e8e8f0" }}>{w.min}</div><div style={{ fontSize:10.5, color:"#8a9bb8" }}>Min. Invest</div></div>
                  </div>
                  <Link href="/register" style={{ display:"block", textAlign:"center", padding:"10px 0", borderRadius:9, border:"1px solid rgba(240,185,11,0.3)", background:"rgba(240,185,11,0.08)", color:"#F0B90B", fontSize:13, fontWeight:600, textDecoration:"none" }}>
                    🔒 KYC to Invest
                  </Link>
                </div>
              ))}
              <Link href="/markets"
                style={{ ...S.card, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, textDecoration:"none", border:"2px dashed rgba(255,255,255,0.1)", cursor:"pointer", minHeight:200 }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(240,185,11,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}>
                <span style={{ fontSize:32 }}>🔍</span>
                <span style={{ fontSize:14, fontWeight:600, color:"#8a9bb8" }}>Browse More Opportunities</span>
              </Link>
            </div>
          </div>
        )}

        {/* ── ACCESS LEVEL TAB ── */}
        {tab==="access" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div style={{ ...S.card, border:"1px solid rgba(34,197,94,0.2)" }}>
              <p style={{ fontSize:11, fontWeight:700, color:"#22c55e", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16 }}>✓ What You Can Do Now</p>
              {allowedActions.map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color:"#22c55e", fontSize:14, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:13.5, color:"#b0b7c3" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ ...S.card, border:"1px solid rgba(239,68,68,0.2)" }}>
              <p style={{ fontSize:11, fontWeight:700, color:"#ef4444", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16 }}>✗ Locked Until KYC Approved</p>
              {lockedActions.map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color:"#ef4444", fontSize:14, flexShrink:0 }}>✗</span>
                  <span style={{ fontSize:13.5, color:"#b0b7c3" }}>{item}</span>
                </div>
              ))}
              <Link href="/register" style={{ display:"block", textAlign:"center", padding:"12px 0", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:13.5, fontWeight:800, textDecoration:"none", marginTop:16 }}>
                🪪 Complete KYC Now
              </Link>
            </div>

            {/* Account Info */}
            <div style={{ ...S.card, gridColumn:"1 / -1" }}>
              <p style={{ ...S.lbl, marginBottom:16 }}>Account Information</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
                {[
                  { l:"Full Name",     v:user.name         },
                  { l:"Email",         v:user.email        },
                  { l:"Account Type",  v:user.accountType  },
                  { l:"Country",       v:user.country      },
                  { l:"Member Since",  v:user.joined       },
                  { l:"KYC Status",    v:"Pending — Sumsub review" },
                ].map(s => (
                  <div key={s.l} style={{ padding:"12px 14px", borderRadius:10, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:11, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{s.l}</div>
                    <div style={{ fontSize:13.5, fontWeight:600, color:"#e8e8f0" }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
`;

fs.writeFileSync("pages/dashboard.js", code, "utf8");
console.log("Done! pages/dashboard.js — " + code.length + " chars");