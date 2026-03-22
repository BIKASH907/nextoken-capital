// pages/dashboard.js
// All data comes from AppContext — portfolio, wallet, markets, bonds, IPOs.
// Any change to AppContext.js auto-reflects here.

import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useApp } from "../lib/AppContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, wallet, portfolio, markets, bonds, ipos, tokens, stats, connectWallet, addNotification } = useApp();
  const [tab, setTab] = useState("overview");

  // Redirect to login if not logged in
  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const returnPct = portfolio.totalInvested > 0
    ? ((portfolio.totalReturn / portfolio.totalInvested) * 100).toFixed(2)
    : "0.00";

  const liveMarkets  = markets.filter(m => m.badge === "Live").slice(0, 3);
  const liveBonds    = bonds.filter(b => b.status === "Live").slice(0, 3);
  const openIPOs     = ipos.filter(i => i.status === "Open").slice(0, 2);
  const topTokens    = tokens.slice(0, 4);

  return (
    <>
      <Head>
        <title>Dashboard — Nextoken Capital</title>
        <meta name="description" content="Your Nextoken Capital investment dashboard." />
      </Head>
      <Navbar />

      <style>{`
        .db-page{min-height:100vh;background:#0B0E11;padding-top:64px}
        .db-header{background:#0F1318;border-bottom:1px solid rgba(255,255,255,0.07);padding:28px 20px}
        .db-header-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
        .db-welcome{font-size:clamp(1.2rem,2.5vw,1.6rem);font-weight:900;color:#fff}
        .db-sub{font-size:13px;color:rgba(255,255,255,0.4);margin-top:3px}
        .db-header-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .db-wallet-chip{display:flex;align-items:center;gap:7px;padding:8px 14px;background:rgba(14,203,129,0.08);border:1px solid rgba(14,203,129,0.2);border-radius:8px;font-size:12px;color:#0ECB81;font-weight:700;cursor:pointer;transition:all .15s}
        .db-wallet-chip:hover{background:rgba(14,203,129,0.15)}
        .db-body{max-width:1280px;margin:0 auto;padding:28px 20px 60px}
        .db-tabs{display:flex;gap:4px;margin-bottom:28px;border-bottom:1px solid rgba(255,255,255,0.07);padding-bottom:0}
        .db-tab{padding:10px 20px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.45);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;margin-bottom:-1px}
        .db-tab:hover{color:#fff}
        .db-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}

        /* STATS ROW */
        .db-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
        .db-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px}
        .db-stat-v{font-size:1.7rem;font-weight:900;line-height:1;margin-bottom:5px}
        .db-stat-l{font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px}
        .db-stat-ch{font-size:12px;font-weight:700;margin-top:4px}
        .pos{color:#0ECB81} .neg{color:#FF4D4D} .gold{color:#F0B90B}

        /* SECTIONS */
        .db-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:20px;margin-bottom:20px}
        .db-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:14px;overflow:hidden}
        .db-card-head{padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between}
        .db-card-title{font-size:14px;font-weight:700;color:#fff}
        .db-card-link{font-size:12px;color:#F0B90B;text-decoration:none}
        .db-card-link:hover{text-decoration:underline}
        .db-card-body{padding:4px 0}

        /* HOLDINGS */
        .db-holding{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.05);gap:12px}
        .db-holding:last-child{border-bottom:none}
        .db-h-sym{font-size:12px;font-weight:800;color:#fff}
        .db-h-name{font-size:11px;color:rgba(255,255,255,0.35);margin-top:1px}
        .db-h-val{font-size:13px;font-weight:700;color:#fff;text-align:right}
        .db-h-chg{font-size:11px;font-weight:700;text-align:right;margin-top:1px}
        .db-empty{padding:24px 20px;font-size:13px;color:rgba(255,255,255,0.35);text-align:center}

        /* MARKET ROWS */
        .db-mkt-row{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.05);gap:12px}
        .db-mkt-row:last-child{border-bottom:none}
        .db-mkt-icon{font-size:20px;flex-shrink:0}
        .db-mkt-name{font-size:13px;font-weight:700;color:#fff;flex:1}
        .db-mkt-loc{font-size:11px;color:rgba(255,255,255,0.35)}
        .db-mkt-roi{font-size:13px;font-weight:800;color:#F0B90B;text-align:right}
        .db-mkt-min{font-size:11px;color:rgba(255,255,255,0.35);text-align:right}

        /* BOND ROWS */
        .db-bond-row{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.05);gap:12px}
        .db-bond-row:last-child{border-bottom:none}
        .db-bond-name{font-size:13px;font-weight:700;color:#fff;flex:1}
        .db-bond-issuer{font-size:11px;color:rgba(255,255,255,0.35)}
        .db-bond-coupon{font-size:14px;font-weight:900;color:#0ECB81;text-align:right}
        .db-bond-term{font-size:11px;color:rgba(255,255,255,0.35);text-align:right}

        /* IPO ROWS */
        .db-ipo-row{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.05);gap:12px}
        .db-ipo-row:last-child{border-bottom:none}
        .db-ipo-name{font-size:13px;font-weight:700;color:#fff}
        .db-ipo-sector{font-size:11px;color:rgba(255,255,255,0.35)}
        .db-ipo-price{font-size:14px;font-weight:900;color:#3B82F6;text-align:right}
        .db-ipo-date{font-size:11px;color:rgba(255,255,255,0.35);text-align:right}
        .db-ipo-badge{padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:rgba(59,130,246,0.12);color:#3B82F6;border:1px solid rgba(59,130,246,0.25)}

        /* EXCHANGE MINI */
        .db-tok-row{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.05);gap:12px}
        .db-tok-row:last-child{border-bottom:none}
        .db-tok-sym{font-size:12px;font-weight:800;color:#fff}
        .db-tok-name{font-size:11px;color:rgba(255,255,255,0.35)}
        .db-tok-price{font-size:13px;font-weight:700;color:#fff;text-align:right}
        .db-tok-chg{font-size:12px;font-weight:700;text-align:right}

        /* QUICK ACTIONS */
        .db-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
        .db-action{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px 16px;text-align:center;text-decoration:none;transition:all .2s;cursor:pointer}
        .db-action:hover{border-color:rgba(240,185,11,0.3);background:rgba(240,185,11,0.04);transform:translateY(-1px)}
        .db-action-icon{font-size:24px;margin-bottom:8px}
        .db-action-label{font-size:12px;font-weight:700;color:rgba(255,255,255,0.7)}

        /* PROGRESS BAR */
        .db-prog-bar{height:3px;background:rgba(255,255,255,0.07);border-radius:2px;margin-top:6px;overflow:hidden}
        .db-prog-fill{height:100%;background:#F0B90B;border-radius:2px}

        @media(max-width:1000px){.db-stats{grid-template-columns:repeat(2,1fr)}.db-grid{grid-template-columns:1fr}.db-actions{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.db-stats{grid-template-columns:1fr 1fr}.db-actions{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="db-page">

        {/* HEADER */}
        <div className="db-header">
          <div className="db-header-inner">
            <div>
              <div className="db-welcome">
                Welcome back, {user.firstName || user.email?.split("@")[0]} 👋
              </div>
              <div className="db-sub">Here is your portfolio overview</div>
            </div>
            <div className="db-header-right">
              <div
                className="db-wallet-chip"
                onClick={() => !wallet.connected && connectWallet()}
              >
                {wallet.connected ? (
                  <>💳 {wallet.address.slice(0,6)}...{wallet.address.slice(-4)} · €{wallet.balance.toFixed(2)}</>
                ) : (
                  <>🔗 Connect Wallet</>
                )}
              </div>
              <Link href="/markets" style={{ padding:"8px 16px", background:"#F0B90B", color:"#000", borderRadius:7, fontSize:13, fontWeight:800, textDecoration:"none" }}>
                + Invest
              </Link>
            </div>
          </div>
        </div>

        <div className="db-body">

          {/* TABS */}
          <div className="db-tabs">
            {[["overview","Overview"],["portfolio","Portfolio"],["markets","Markets"],["bonds","Bonds"],["ipos","IPOs"],["exchange","Exchange"]].map(([id,label]) => (
              <button key={id} className={`db-tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{label}</button>
            ))}
          </div>

          {/* STATS */}
          <div className="db-stats">
            <div className="db-stat">
              <div className="db-stat-v gold">€{portfolio.totalValue.toLocaleString("en-EU",{minimumFractionDigits:2})}</div>
              <div className="db-stat-l">Portfolio Value</div>
            </div>
            <div className="db-stat">
              <div className={`db-stat-v ${portfolio.totalReturn >= 0 ? "pos" : "neg"}`}>
                {portfolio.totalReturn >= 0 ? "+" : ""}€{portfolio.totalReturn.toFixed(2)}
              </div>
              <div className="db-stat-l">Total Return</div>
              <div className={`db-stat-ch ${portfolio.totalReturn >= 0 ? "pos" : "neg"}`}>
                {portfolio.totalReturn >= 0 ? "+" : ""}{returnPct}%
              </div>
            </div>
            <div className="db-stat">
              <div className="db-stat-v" style={{color:"#fff"}}>€{portfolio.totalInvested.toLocaleString("en-EU",{minimumFractionDigits:2})}</div>
              <div className="db-stat-l">Total Invested</div>
            </div>
            <div className="db-stat">
              <div className="db-stat-v" style={{color:"#fff"}}>{portfolio.holdings.length}</div>
              <div className="db-stat-l">Holdings</div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="db-actions">
            {[
              { icon:"🏪", label:"Browse Markets", href:"/markets" },
              { icon:"🔄", label:"Trade Tokens",   href:"/exchange" },
              { icon:"📄", label:"View Bonds",      href:"/bonds" },
              { icon:"📈", label:"Equity & IPOs",   href:"/equity-ipo" },
            ].map(a => (
              <Link key={a.label} href={a.href} className="db-action">
                <div className="db-action-icon">{a.icon}</div>
                <div className="db-action-label">{a.label}</div>
              </Link>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <div className="db-grid">
              {/* Holdings */}
              <div className="db-card">
                <div className="db-card-head">
                  <div className="db-card-title">My Holdings</div>
                  <button className="db-card-link" onClick={()=>setTab("portfolio")}>View all →</button>
                </div>
                <div className="db-card-body">
                  {portfolio.holdings.length === 0 ? (
                    <div className="db-empty">No holdings yet. <Link href="/markets" style={{color:"#F0B90B"}}>Start investing →</Link></div>
                  ) : (
                    portfolio.holdings.map(h => (
                      <div key={h.symbol} className="db-holding">
                        <div>
                          <div className="db-h-sym">{h.symbol}</div>
                          <div className="db-h-name">{h.name}</div>
                        </div>
                        <div>
                          <div className="db-h-val">€{h.value.toFixed(2)}</div>
                          <div className={`db-h-chg ${h.change >= 0 ? "pos" : "neg"}`}>
                            {h.change >= 0 ? "+" : ""}{h.change}% · {h.qty} tokens
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Live Markets */}
              <div>
                <div className="db-card" style={{marginBottom:16}}>
                  <div className="db-card-head">
                    <div className="db-card-title">Live Markets</div>
                    <Link href="/markets" className="db-card-link">See all →</Link>
                  </div>
                  <div className="db-card-body">
                    {liveMarkets.map(m => (
                      <div key={m.id} className="db-mkt-row">
                        <span className="db-mkt-icon">{m.emoji}</span>
                        <div style={{flex:1}}>
                          <div className="db-mkt-name">{m.title}</div>
                          <div className="db-mkt-loc">📍 {m.location}</div>
                        </div>
                        <div>
                          <div className="db-mkt-roi">{m.roi}% ROI</div>
                          <div className="db-mkt-min">From €{m.min}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="db-card">
                  <div className="db-card-head">
                    <div className="db-card-title">Open IPOs</div>
                    <Link href="/equity-ipo" className="db-card-link">See all →</Link>
                  </div>
                  <div className="db-card-body">
                    {openIPOs.map(ipo => (
                      <div key={ipo.id} className="db-ipo-row">
                        <div style={{flex:1}}>
                          <div className="db-ipo-name">{ipo.name}</div>
                          <div className="db-ipo-sector">{ipo.sector}</div>
                        </div>
                        <div>
                          <div className="db-ipo-price">{ipo.price}</div>
                          <div className="db-ipo-date">{ipo.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PORTFOLIO TAB */}
          {tab === "portfolio" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">All Holdings ({portfolio.holdings.length})</div>
                <Link href="/markets" className="db-card-link">+ Add Investment</Link>
              </div>
              <div className="db-card-body">
                {portfolio.holdings.length === 0 ? (
                  <div className="db-empty">No holdings yet. <Link href="/markets" style={{color:"#F0B90B"}}>Browse markets →</Link></div>
                ) : portfolio.holdings.map(h => {
                  const pct = portfolio.totalValue > 0 ? (h.value / portfolio.totalValue) * 100 : 0;
                  return (
                    <div key={h.symbol} className="db-holding" style={{flexDirection:"column",alignItems:"flex-start",gap:6}}>
                      <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                        <div>
                          <div className="db-h-sym">{h.symbol}</div>
                          <div className="db-h-name">{h.name} · {h.qty} tokens @ €{h.price.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="db-h-val">€{h.value.toFixed(2)}</div>
                          <div className={`db-h-chg ${h.change >= 0 ? "pos" : "neg"}`}>{h.change >= 0 ? "+" : ""}{h.change}%</div>
                        </div>
                      </div>
                      <div style={{width:"100%"}}>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginBottom:3}}>{pct.toFixed(1)}% of portfolio</div>
                        <div className="db-prog-bar"><div className="db-prog-fill" style={{width:pct+"%"}} /></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MARKETS TAB */}
          {tab === "markets" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">All Markets ({markets.length})</div>
                <Link href="/markets" className="db-card-link">Full page →</Link>
              </div>
              <div className="db-card-body">
                {markets.map(m => (
                  <div key={m.id} className="db-mkt-row">
                    <span className="db-mkt-icon">{m.emoji}</span>
                    <div style={{flex:1}}>
                      <div className="db-mkt-name">{m.title}</div>
                      <div className="db-mkt-loc">📍 {m.location} · {m.risk} Risk · {m.term}mo</div>
                      <div className="db-prog-bar" style={{marginTop:4,width:"60%"}}>
                        <div className="db-prog-fill" style={{width:Math.round((m.raised/m.target)*100)+"%"}} />
                      </div>
                    </div>
                    <div>
                      <div className="db-mkt-roi">{m.roi}%</div>
                      <div className="db-mkt-min">From €{m.min}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BONDS TAB */}
          {tab === "bonds" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">Bonds ({bonds.length})</div>
                <Link href="/bonds" className="db-card-link">Full page →</Link>
              </div>
              <div className="db-card-body">
                {bonds.map(b => (
                  <div key={b.id} className="db-bond-row">
                    <div style={{flex:1}}>
                      <div className="db-bond-name">{b.name}</div>
                      <div className="db-bond-issuer">{b.issuer} · {b.rating} · {b.status}</div>
                    </div>
                    <div>
                      <div className="db-bond-coupon">{b.coupon}</div>
                      <div className="db-bond-term">{b.term} · {b.min}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IPOS TAB */}
          {tab === "ipos" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">IPOs ({ipos.length})</div>
                <Link href="/equity-ipo" className="db-card-link">Full page →</Link>
              </div>
              <div className="db-card-body">
                {ipos.map(ipo => (
                  <div key={ipo.id} className="db-ipo-row">
                    <div style={{flex:1}}>
                      <div className="db-ipo-name">{ipo.name}</div>
                      <div className="db-ipo-sector">{ipo.sector} · Raise: {ipo.raise}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div className="db-ipo-price">{ipo.price}</div>
                      <div className="db-ipo-date">{ipo.date}</div>
                      <div style={{marginTop:4}}><span className="db-ipo-badge">{ipo.status}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXCHANGE TAB */}
          {tab === "exchange" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">Exchange Markets ({tokens.length})</div>
                <Link href="/exchange" className="db-card-link">Trade →</Link>
              </div>
              <div className="db-card-body">
                {tokens.map(t => (
                  <div key={t.symbol} className="db-tok-row">
                    <div style={{flex:1}}>
                      <div className="db-tok-sym">{t.symbol}</div>
                      <div className="db-tok-name">{t.name}</div>
                    </div>
                    <div style={{textAlign:"right",minWidth:80}}>
                      <div className="db-tok-price">€{t.price.toFixed(2)}</div>
                      <div className={`db-tok-chg ${t.change >= 0 ? "pos" : "neg"}`}>
                        {t.change >= 0 ? "+" : ""}{t.change}%
                      </div>
                    </div>
                    <div style={{textAlign:"right",minWidth:60}}>
                      <div style={{fontSize:12,color:"#F0B90B",fontWeight:700}}>{t.yield}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>yield</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}