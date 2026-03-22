import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// All platform data — edit here to update dashboard
const MARKETS = [
  { id:1, emoji:"☀️", title:"Solar Farm Portfolio",      location:"Alicante, Spain",        roi:18.2, min:250,  raised:4600000, target:5000000 },
  { id:2, emoji:"🏢", title:"Tokenized Office Building", location:"Berlin, Germany",        roi:16.4, min:500,  raised:1872000, target:2400000 },
  { id:3, emoji:"💨", title:"Wind Energy Project",       location:"Gdansk, Poland",         roi:17.6, min:250,  raised:2145000, target:6500000 },
  { id:4, emoji:"🏭", title:"Logistics Hub",             location:"Warsaw, Poland",         roi:15.1, min:1000, raised:3600000, target:8000000 },
];
const BONDS = [
  { id:1, name:"Baltic Infrastructure Bond", issuer:"NXT Infrastructure UAB", coupon:"7.5%", term:"36 mo", rating:"BBB+", status:"Live" },
  { id:2, name:"European Solar Bond I",       issuer:"SolarBridge Capital",    coupon:"8.2%", term:"60 mo", rating:"BB+",  status:"Live" },
  { id:3, name:"Warsaw Logistics Bond",       issuer:"LogiPark Holdings",      coupon:"6.9%", term:"24 mo", rating:"BBB",  status:"Live" },
];
const IPOS = [
  { id:1, name:"BalticPay Technologies", sector:"Fintech",    price:"€5.00",  date:"Apr 2026", status:"Open" },
  { id:2, name:"GreenVolt Energy",        sector:"Renewables", price:"€10.00", date:"May 2026", status:"Open" },
];
const TOKENS = [
  { symbol:"SOLAR-01", name:"Solar Farm Portfolio",      price:10.42, change:+2.4,  yield:"18.2%" },
  { symbol:"WIND-07",  name:"Wind Energy Project",       price:12.15, change:+5.1,  yield:"17.6%" },
  { symbol:"TECH-08",  name:"Tech Business Park",        price:15.30, change:+3.7,  yield:"15.9%" },
  { symbol:"OFFIC-03", name:"Tokenized Office Building", price:8.91,  change:-0.8,  yield:"16.4%" },
  { symbol:"LOGX-06",  name:"Logistics Hub",             price:11.20, change:+1.9,  yield:"15.1%" },
];

const DEFAULT_PORTFOLIO = {
  totalValue: 12450, totalInvested: 10000, totalReturn: 2450,
  holdings: [
    { symbol:"SOLAR-01", name:"Solar Farm Portfolio",      qty:120, price:10.42, value:1250.40, change:2.4  },
    { symbol:"WIND-07",  name:"Wind Energy Project",       qty:80,  price:12.15, value:972.00,  change:5.1  },
    { symbol:"TECH-08",  name:"Tech Business Park",        qty:50,  price:15.30, value:765.00,  change:3.7  },
    { symbol:"OFFIC-03", name:"Tokenized Office Building", qty:200, price:8.91,  value:1782.00, change:-0.8 },
  ],
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser]           = useState(null);
  const [portfolio, setPortfolio] = useState(DEFAULT_PORTFOLIO);
  const [tab, setTab]             = useState("overview");
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const u = localStorage.getItem("nxt_user");
      const p = localStorage.getItem("nxt_portfolio");
      if (!u) { router.push("/login"); return; }
      setUser(JSON.parse(u));
      if (p) setPortfolio(JSON.parse(p));
    } catch {
      router.push("/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("nxt_user");
    router.push("/login");
  };

  if (!mounted || !user) return (
    <div style={{ minHeight:"100vh", background:"#0B0E11", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>Loading...</div>
    </div>
  );

  const returnPct = portfolio.totalInvested > 0
    ? ((portfolio.totalReturn / portfolio.totalInvested) * 100).toFixed(1)
    : "0.0";

  return (
    <>
      <Head>
        <title>Dashboard — Nextoken Capital</title>
        <meta name="description" content="Your Nextoken Capital investment dashboard." />
      </Head>
      <Navbar />
      <style>{`
        .db{min-height:100vh;background:#0B0E11;padding-top:64px}
        .db-header{background:#0F1318;border-bottom:1px solid rgba(255,255,255,0.07);padding:24px 20px}
        .db-header-in{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px}
        .db-welcome{font-size:clamp(1.1rem,2.5vw,1.5rem);font-weight:900;color:#fff}
        .db-welcome-sub{font-size:13px;color:rgba(255,255,255,0.38);margin-top:3px}
        .db-header-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .db-invest-btn{padding:9px 20px;background:#F0B90B;color:#000;border:none;border-radius:7px;font-size:13px;font-weight:800;cursor:pointer;text-decoration:none;font-family:inherit}
        .db-logout-btn{padding:9px 16px;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.12);border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
        .db-logout-btn:hover{color:#FF6B6B;border-color:rgba(255,77,77,0.3)}
        .db-body{max-width:1280px;margin:0 auto;padding:24px 20px 60px}
        .db-tabs{display:flex;gap:0;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:24px;overflow-x:auto}
        .db-tab{padding:10px 20px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;margin-bottom:-1px}
        .db-tab:hover{color:#fff}
        .db-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
        .db-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
        .db-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px 20px}
        .db-stat-v{font-size:1.6rem;font-weight:900;line-height:1;margin-bottom:5px}
        .db-stat-l{font-size:11px;color:rgba(255,255,255,0.38);text-transform:uppercase;letter-spacing:.5px}
        .db-stat-c{font-size:12px;font-weight:700;margin-top:4px}
        .gold{color:#F0B90B} .green{color:#0ECB81} .red{color:#FF4D4D}
        .db-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:18px;margin-bottom:18px}
        .db-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:13px;overflow:hidden}
        .db-card-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between}
        .db-card-title{font-size:13px;font-weight:700;color:#fff}
        .db-card-link{font-size:12px;color:#F0B90B;text-decoration:none;background:none;border:none;cursor:pointer;font-family:inherit}
        .db-row{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid rgba(255,255,255,0.05);gap:12px}
        .db-row:last-child{border-bottom:none}
        .db-row-l{flex:1}
        .db-row-name{font-size:13px;font-weight:700;color:#fff}
        .db-row-sub{font-size:11px;color:rgba(255,255,255,0.32);margin-top:1px}
        .db-row-val{font-size:13px;font-weight:700;color:#fff;text-align:right}
        .db-row-chg{font-size:11px;font-weight:700;text-align:right;margin-top:1px}
        .db-empty{padding:24px 18px;font-size:13px;color:rgba(255,255,255,0.3);text-align:center}
        .db-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
        .db-action{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;text-align:center;text-decoration:none;transition:all .2s}
        .db-action:hover{border-color:rgba(240,185,11,0.3);transform:translateY(-1px)}
        .db-action-icon{font-size:22px;margin-bottom:6px}
        .db-action-label{font-size:12px;font-weight:700;color:rgba(255,255,255,0.6)}
        .db-prog{height:3px;background:rgba(255,255,255,0.06);border-radius:2px;margin-top:5px;overflow:hidden}
        .db-prog-fill{height:100%;background:#F0B90B;border-radius:2px}
        @media(max-width:1000px){.db-stats{grid-template-columns:repeat(2,1fr)}.db-grid{grid-template-columns:1fr}.db-actions{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.db-stats{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="db">
        <div className="db-header">
          <div className="db-header-in">
            <div>
              <div className="db-welcome">Welcome back, {user.firstName || user.email?.split("@")[0]} 👋</div>
              <div className="db-welcome-sub">Here is your portfolio overview</div>
            </div>
            <div className="db-header-right">
              <Link href="/markets" className="db-invest-btn">+ Invest Now</Link>
              <button className="db-logout-btn" onClick={logout}>Log Out</button>
            </div>
          </div>
        </div>

        <div className="db-body">

          {/* TABS */}
          <div className="db-tabs">
            {[["overview","Overview"],["portfolio","Portfolio"],["markets","Markets"],["bonds","Bonds"],["ipos","IPOs"],["exchange","Exchange"]].map(([id,label]) => (
              <button key={id} className={`db-tab ${tab===id?"on":""}`} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>

          {/* STATS */}
          <div className="db-stats">
            <div className="db-stat">
              <div className="db-stat-v gold">€{portfolio.totalValue.toLocaleString("de-DE",{minimumFractionDigits:2})}</div>
              <div className="db-stat-l">Portfolio Value</div>
            </div>
            <div className="db-stat">
              <div className={`db-stat-v ${portfolio.totalReturn >= 0 ? "green" : "red"}`}>
                {portfolio.totalReturn >= 0 ? "+" : ""}€{portfolio.totalReturn.toFixed(2)}
              </div>
              <div className="db-stat-l">Total Return</div>
              <div className={`db-stat-c ${portfolio.totalReturn >= 0 ? "green" : "red"}`}>
                {portfolio.totalReturn >= 0 ? "+" : ""}{returnPct}%
              </div>
            </div>
            <div className="db-stat">
              <div className="db-stat-v" style={{color:"#fff"}}>€{portfolio.totalInvested.toLocaleString("de-DE",{minimumFractionDigits:2})}</div>
              <div className="db-stat-l">Total Invested</div>
            </div>
            <div className="db-stat">
              <div className="db-stat-v" style={{color:"#fff"}}>{portfolio.holdings.length}</div>
              <div className="db-stat-l">Holdings</div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="db-actions">
            {[["🏪","Browse Markets","/markets"],["🔄","Trade Tokens","/exchange"],["📄","View Bonds","/bonds"],["📈","IPOs","/equity-ipo"]].map(([icon,label,href]) => (
              <Link key={label} href={href} className="db-action">
                <div className="db-action-icon">{icon}</div>
                <div className="db-action-label">{label}</div>
              </Link>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="db-grid">
              <div className="db-card">
                <div className="db-card-head">
                  <div className="db-card-title">My Holdings</div>
                  <button className="db-card-link" onClick={() => setTab("portfolio")}>View all →</button>
                </div>
                {portfolio.holdings.length === 0 ? (
                  <div className="db-empty">No holdings yet. <Link href="/markets" style={{color:"#F0B90B"}}>Start investing →</Link></div>
                ) : portfolio.holdings.map(h => (
                  <div key={h.symbol} className="db-row">
                    <div className="db-row-l">
                      <div className="db-row-name">{h.symbol}</div>
                      <div className="db-row-sub">{h.name} · {h.qty} tokens</div>
                    </div>
                    <div>
                      <div className="db-row-val">€{h.value.toFixed(2)}</div>
                      <div className={`db-row-chg ${h.change >= 0 ? "green" : "red"}`}>{h.change >= 0 ? "+" : ""}{h.change}%</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div className="db-card">
                  <div className="db-card-head">
                    <div className="db-card-title">Live Markets</div>
                    <Link href="/markets" className="db-card-link">See all →</Link>
                  </div>
                  {MARKETS.slice(0,3).map(m => (
                    <div key={m.id} className="db-row">
                      <span style={{fontSize:18,flexShrink:0}}>{m.emoji}</span>
                      <div className="db-row-l">
                        <div className="db-row-name">{m.title}</div>
                        <div className="db-row-sub">{m.location}</div>
                      </div>
                      <div className="db-row-val gold">{m.roi}%</div>
                    </div>
                  ))}
                </div>
                <div className="db-card">
                  <div className="db-card-head">
                    <div className="db-card-title">Open IPOs</div>
                    <Link href="/equity-ipo" className="db-card-link">See all →</Link>
                  </div>
                  {IPOS.map(i => (
                    <div key={i.id} className="db-row">
                      <div className="db-row-l">
                        <div className="db-row-name">{i.name}</div>
                        <div className="db-row-sub">{i.sector} · {i.date}</div>
                      </div>
                      <div className="db-row-val" style={{color:"#3B82F6"}}>{i.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PORTFOLIO */}
          {tab === "portfolio" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">All Holdings ({portfolio.holdings.length})</div>
                <Link href="/markets" className="db-card-link">+ Add Investment</Link>
              </div>
              {portfolio.holdings.length === 0 ? (
                <div className="db-empty">No holdings. <Link href="/markets" style={{color:"#F0B90B"}}>Browse markets →</Link></div>
              ) : portfolio.holdings.map(h => {
                const pct = portfolio.totalValue > 0 ? (h.value/portfolio.totalValue*100) : 0;
                return (
                  <div key={h.symbol} className="db-row" style={{flexDirection:"column",alignItems:"flex-start",gap:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                      <div>
                        <div className="db-row-name">{h.symbol} — {h.name}</div>
                        <div className="db-row-sub">{h.qty} tokens @ €{h.price.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="db-row-val">€{h.value.toFixed(2)}</div>
                        <div className={`db-row-chg ${h.change >= 0 ? "green" : "red"}`}>{h.change >= 0?"+":""}{h.change}%</div>
                      </div>
                    </div>
                    <div style={{width:"100%"}}>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",marginBottom:3}}>{pct.toFixed(1)}% of portfolio</div>
                      <div className="db-prog"><div className="db-prog-fill" style={{width:pct+"%"}} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MARKETS */}
          {tab === "markets" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">All Markets</div>
                <Link href="/markets" className="db-card-link">Full page →</Link>
              </div>
              {MARKETS.map(m => (
                <div key={m.id} className="db-row">
                  <span style={{fontSize:20,flexShrink:0}}>{m.emoji}</span>
                  <div className="db-row-l">
                    <div className="db-row-name">{m.title}</div>
                    <div className="db-row-sub">📍 {m.location} · From €{m.min}</div>
                    <div className="db-prog" style={{width:"50%"}}>
                      <div className="db-prog-fill" style={{width:Math.round(m.raised/m.target*100)+"%"}} />
                    </div>
                  </div>
                  <div className="db-row-val gold">{m.roi}% ROI</div>
                </div>
              ))}
            </div>
          )}

          {/* BONDS */}
          {tab === "bonds" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">Bonds</div>
                <Link href="/bonds" className="db-card-link">Full page →</Link>
              </div>
              {BONDS.map(b => (
                <div key={b.id} className="db-row">
                  <div className="db-row-l">
                    <div className="db-row-name">{b.name}</div>
                    <div className="db-row-sub">{b.issuer} · {b.rating} · {b.term}</div>
                  </div>
                  <div className="db-row-val green">{b.coupon}</div>
                </div>
              ))}
            </div>
          )}

          {/* IPOS */}
          {tab === "ipos" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">IPOs</div>
                <Link href="/equity-ipo" className="db-card-link">Full page →</Link>
              </div>
              {IPOS.map(i => (
                <div key={i.id} className="db-row">
                  <div className="db-row-l">
                    <div className="db-row-name">{i.name}</div>
                    <div className="db-row-sub">{i.sector} · {i.date}</div>
                  </div>
                  <div>
                    <div className="db-row-val" style={{color:"#3B82F6"}}>{i.price}</div>
                    <div className="db-row-chg green">{i.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EXCHANGE */}
          {tab === "exchange" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">Exchange</div>
                <Link href="/exchange" className="db-card-link">Trade →</Link>
              </div>
              {TOKENS.map(t => (
                <div key={t.symbol} className="db-row">
                  <div className="db-row-l">
                    <div className="db-row-name">{t.symbol}</div>
                    <div className="db-row-sub">{t.name}</div>
                  </div>
                  <div style={{textAlign:"right",minWidth:80}}>
                    <div className="db-row-val">€{t.price.toFixed(2)}</div>
                    <div className={`db-row-chg ${t.change >= 0 ? "green" : "red"}`}>{t.change >= 0?"+":""}{t.change}%</div>
                  </div>
                  <div style={{textAlign:"right",minWidth:60}}>
                    <div className="db-row-val gold">{t.yield}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>yield</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}