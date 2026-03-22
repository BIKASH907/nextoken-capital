// pages/dashboard.js
// Real session via JWT cookie — no localStorage
// Real investments from MongoDB
// KYC status gate — shows what is/isn't available based on verification status

import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MARKET_DATA = [
  { id:"solar-01",  emoji:"☀️", symbol:"SOLAR-01", title:"Solar Farm Portfolio",      location:"Alicante, Spain",    roi:18.2, min:250,  price:10.42, raised:4600000, target:5000000 },
  { id:"wind-07",   emoji:"💨", symbol:"WIND-07",  title:"Wind Energy Project",       location:"Gdansk, Poland",     roi:17.6, min:250,  price:12.15, raised:2145000, target:6500000 },
  { id:"office-03", emoji:"🏢", symbol:"OFFIC-03", title:"Tokenized Office Building", location:"Berlin, Germany",    roi:16.4, min:500,  price:8.91,  raised:1872000, target:2400000 },
  { id:"logx-06",   emoji:"🏭", symbol:"LOGX-06",  title:"Logistics Hub",             location:"Warsaw, Poland",     roi:15.1, min:1000, price:11.20, raised:3600000, target:8000000 },
  { id:"tech-08",   emoji:"💼", symbol:"TECH-08",  title:"Tech Business Park",        location:"Dublin, Ireland",    roi:15.9, min:500,  price:15.30, raised:2000000, target:10000000 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser]               = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [tab, setTab]                 = useState("overview");
  const [investModal, setInvestModal] = useState(null);
  const [investAmount, setInvestAmount] = useState("");
  const [investLoading, setInvestLoading] = useState(false);
  const [investMsg, setInvestMsg]     = useState("");
  const [mounted, setMounted]         = useState(false);

  const loadData = useCallback(async () => {
    try {
      // Load user from real API (JWT cookie)
      const userRes = await fetch("/api/user/me");
      if (!userRes.ok) {
        router.push("/login?redirect=/dashboard");
        return;
      }
      const userData = await userRes.json();
      setUser(userData);

      // Load real investments
      const invRes = await fetch("/api/investments/list");
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvestments(invData.investments || []);
      }
    } catch {
      router.push("/login?redirect=/dashboard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, [loadData]);

  const logout = async () => {
    await fetch("/api/user/me", { method: "DELETE" });
    router.push("/");
  };

  const handleInvest = async () => {
    if (!investModal || !investAmount) return;
    setInvestLoading(true);
    setInvestMsg("");
    try {
      const qty = Math.floor(parseFloat(investAmount) / investModal.price);
      const res = await fetch("/api/investments/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId:     investModal.id,
          assetName:   investModal.title,
          assetSymbol: investModal.symbol,
          amount:      parseFloat(investAmount),
          tokenPrice:  investModal.price,
          quantity:    qty,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInvestMsg(`✅ ${data.message}`);
        setTimeout(() => {
          setInvestModal(null);
          setInvestAmount("");
          setInvestMsg("");
          loadData(); // Refresh real data — no redirect
        }, 2000);
      } else if (data.kycRequired) {
        setInvestMsg("⚠️ KYC verification required. Please complete your identity verification first.");
      } else {
        setInvestMsg(`❌ ${data.error}`);
      }
    } catch {
      setInvestMsg("❌ Network error. Please try again.");
    } finally {
      setInvestLoading(false);
    }
  };

  if (!mounted || loading) return (
    <div style={{minHeight:"100vh",background:"#0B0E11",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:32,height:32,border:"3px solid rgba(240,185,11,0.2)",borderTopColor:"#F0B90B",borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 14px"}}/>
        <div style={{color:"rgba(255,255,255,0.3)",fontSize:13}}>Loading your dashboard...</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!user) return null;

  const kycApproved  = user.kycStatus === "approved";
  const kycPending   = user.kycStatus === "pending";
  const kycSubmitted = user.kycStatus === "submitted";

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const totalValue    = investments.reduce((s, i) => s + (i.currentValue || i.amount), 0);
  const totalReturn   = totalValue - totalInvested;
  const returnPct     = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(1) : "0.0";

  return (
    <>
      <Head>
        <title>Dashboard — Nextoken Capital</title>
      </Head>
      <Navbar />
      <style>{`
        .db{min-height:100vh;background:#0B0E11;padding-top:64px}
        .db-head{background:#0F1318;border-bottom:1px solid rgba(255,255,255,0.07);padding:20px}
        .db-head-in{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
        .db-welcome{font-size:clamp(1rem,2.5vw,1.4rem);font-weight:900;color:#fff}
        .db-welcome-sub{font-size:13px;color:rgba(255,255,255,0.35);margin-top:2px}
        .db-head-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .db-invest-btn{padding:9px 20px;background:#F0B90B;color:#000;border:none;border-radius:7px;font-size:13px;font-weight:800;cursor:pointer;text-decoration:none}
        .db-logout{padding:9px 16px;background:transparent;color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.12);border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
        .db-logout:hover{color:#FF6B6B;border-color:rgba(255,77,77,0.3)}
        .db-body{max-width:1280px;margin:0 auto;padding:22px 20px 60px}

        /* KYC BANNER */
        .db-kyc-banner{border-radius:12px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
        .db-kyc-banner.pending{background:rgba(240,185,11,0.06);border:1px solid rgba(240,185,11,0.2)}
        .db-kyc-banner.submitted{background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.2)}
        .db-kyc-banner.approved{background:rgba(14,203,129,0.06);border:1px solid rgba(14,203,129,0.2)}
        .db-kyc-title{font-size:14px;font-weight:700;margin-bottom:3px}
        .db-kyc-sub{font-size:12px;color:rgba(255,255,255,0.45);line-height:1.5}
        .db-kyc-btn{padding:8px 18px;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;border:none;font-family:inherit;white-space:nowrap}

        .db-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:20px;overflow-x:auto}
        .db-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;margin-bottom:-1px}
        .db-tab:hover{color:#fff}
        .db-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}

        .db-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
        .db-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px}
        .db-stat-v{font-size:1.5rem;font-weight:900;line-height:1;margin-bottom:5px}
        .db-stat-l{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px}
        .db-stat-c{font-size:11px;font-weight:700;margin-top:3px}
        .gold{color:#F0B90B}.green{color:#0ECB81}.red{color:#FF4D4D}.blue{color:#3B82F6}

        .db-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
        .db-action{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;text-align:center;text-decoration:none;transition:all .2s}
        .db-action:hover{border-color:rgba(240,185,11,0.3);transform:translateY(-1px)}
        .db-action-ico{font-size:22px;margin-bottom:6px}
        .db-action-lbl{font-size:12px;font-weight:700;color:rgba(255,255,255,0.6)}

        .db-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:16px}
        .db-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:13px;overflow:hidden;margin-bottom:16px}
        .db-card-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between}
        .db-card-title{font-size:13px;font-weight:700;color:#fff}
        .db-card-link{font-size:12px;color:#F0B90B;text-decoration:none;background:none;border:none;cursor:pointer;font-family:inherit}
        .db-row{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-bottom:1px solid rgba(255,255,255,0.05);gap:12px}
        .db-row:last-child{border-bottom:none}
        .db-row-l{flex:1}
        .db-row-name{font-size:13px;font-weight:700;color:#fff}
        .db-row-sub{font-size:11px;color:rgba(255,255,255,0.3);margin-top:1px}
        .db-row-val{font-size:13px;font-weight:700;text-align:right}
        .db-row-chg{font-size:11px;font-weight:700;text-align:right;margin-top:1px}
        .db-empty{padding:28px 18px;font-size:13px;color:rgba(255,255,255,0.3);text-align:center}
        .db-prog{height:3px;background:rgba(255,255,255,0.06);border-radius:2px;margin-top:5px;overflow:hidden}
        .db-prog-fill{height:100%;background:#F0B90B;border-radius:2px}
        .db-invest-row-btn{padding:6px 14px;background:rgba(240,185,11,0.1);border:1px solid rgba(240,185,11,0.25);border-radius:6px;font-size:12px;font-weight:700;color:#F0B90B;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;flex-shrink:0}
        .db-invest-row-btn:hover{background:rgba(240,185,11,0.18)}
        .db-invest-row-btn:disabled{opacity:.35;cursor:not-allowed}

        /* INVEST MODAL */
        .inv-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px}
        .inv-modal{background:#0F1318;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px;width:100%;max-width:400px}
        .inv-title{font-size:17px;font-weight:800;color:#fff;margin-bottom:4px}
        .inv-sub{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:20px;line-height:1.5}
        .inv-label{font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;display:block}
        .inv-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px 14px;font-size:16px;font-weight:700;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .inv-input:focus{border-color:rgba(240,185,11,0.5)}
        .inv-hint{font-size:12px;color:rgba(255,255,255,0.3);margin-top:6px}
        .inv-msg{padding:10px 14px;border-radius:8px;font-size:13px;font-weight:600;margin:14px 0;line-height:1.5}
        .inv-msg.ok{background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.25);color:#0ECB81}
        .inv-msg.err{background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.2);color:#FF6B6B}
        .inv-btns{display:grid;grid-template-columns:1fr 1.5fr;gap:10px;margin-top:18px}
        .inv-btn{padding:12px;border-radius:8px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;transition:all .15s;border:none}
        .inv-btn.cancel{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6)}
        .inv-btn.confirm{background:#F0B90B;color:#000}
        .inv-btn.confirm:hover{background:#FFD000}
        .inv-btn:disabled{opacity:.4;cursor:not-allowed}
        .inv-spin{width:14px;height:14px;border:2px solid rgba(0,0,0,0.2);border-top-color:#000;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
        @keyframes spin{to{transform:rotate(360deg)}}

        @media(max-width:1000px){.db-stats{grid-template-columns:repeat(2,1fr)}.db-grid{grid-template-columns:1fr}.db-actions{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.db-stats{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="db">
        <div className="db-head">
          <div className="db-head-in">
            <div>
              <div className="db-welcome">Welcome back, {user.firstName} 👋</div>
              <div className="db-welcome-sub">{user.email} · {user.country}</div>
            </div>
            <div className="db-head-right">
              {kycApproved && <Link href="/markets" className="db-invest-btn">+ Invest Now</Link>}
              <button className="db-logout" onClick={logout}>Log Out</button>
            </div>
          </div>
        </div>

        <div className="db-body">

          {/* KYC STATUS BANNER */}
          {kycPending && (
            <div className="db-kyc-banner pending">
              <div>
                <div className="db-kyc-title" style={{color:"#F0B90B"}}>⚠️ KYC Verification Required</div>
                <p className="db-kyc-sub">You must complete identity verification before you can invest. This takes 2–5 minutes.</p>
              </div>
              <Link href="/kyc" className="db-kyc-btn" style={{background:"#F0B90B",color:"#000"}}>Start Verification →</Link>
            </div>
          )}
          {kycSubmitted && (
            <div className="db-kyc-banner submitted">
              <div>
                <div className="db-kyc-title" style={{color:"#3B82F6"}}>⏳ KYC Under Review</div>
                <p className="db-kyc-sub">Your documents have been submitted. Verification typically takes 1–2 business days.</p>
              </div>
              <span className="db-kyc-btn" style={{background:"rgba(59,130,246,0.1)",color:"#3B82F6",border:"1px solid rgba(59,130,246,0.25)",cursor:"default"}}>Under Review</span>
            </div>
          )}
          {kycApproved && (
            <div className="db-kyc-banner approved">
              <div>
                <div className="db-kyc-title" style={{color:"#0ECB81"}}>✅ KYC Verified — Ready to Invest</div>
                <p className="db-kyc-sub">Your identity has been verified. You can now invest in any available asset.</p>
              </div>
            </div>
          )}

          {/* TABS */}
          <div className="db-tabs">
            {[["overview","Overview"],["portfolio","Portfolio"],["markets","Markets"]].map(([id,lbl]) => (
              <button key={id} className={`db-tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lbl}</button>
            ))}
          </div>

          {/* STATS */}
          <div className="db-stats">
            <div className="db-stat">
              <div className="db-stat-v gold">€{totalValue.toLocaleString("de-DE",{minimumFractionDigits:2})}</div>
              <div className="db-stat-l">Portfolio Value</div>
            </div>
            <div className="db-stat">
              <div className={`db-stat-v ${totalReturn >= 0 ? "green" : "red"}`}>
                {totalReturn >= 0?"+":""}€{totalReturn.toFixed(2)}
              </div>
              <div className="db-stat-l">Total Return</div>
              <div className={`db-stat-c ${totalReturn >= 0 ? "green" : "red"}`}>{totalReturn >= 0?"+":""}{returnPct}%</div>
            </div>
            <div className="db-stat">
              <div className="db-stat-v" style={{color:"#fff"}}>€{totalInvested.toLocaleString("de-DE",{minimumFractionDigits:2})}</div>
              <div className="db-stat-l">Total Invested</div>
            </div>
            <div className="db-stat">
              <div className="db-stat-v" style={{color:"#fff"}}>{investments.length}</div>
              <div className="db-stat-l">Active Investments</div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="db-actions">
            {[["🏪","Browse Markets","/markets"],["🔄","Exchange","/exchange"],["📄","Bonds","/bonds"],["📈","IPOs","/equity-ipo"]].map(([ico,lbl,href])=>(
              <Link key={lbl} href={href} className="db-action">
                <div className="db-action-ico">{ico}</div>
                <div className="db-action-lbl">{lbl}</div>
              </Link>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <div className="db-grid">
              <div className="db-card">
                <div className="db-card-head">
                  <div className="db-card-title">My Investments ({investments.length})</div>
                  <button className="db-card-link" onClick={()=>setTab("portfolio")}>View all →</button>
                </div>
                {investments.length === 0 ? (
                  <div className="db-empty">
                    No investments yet.{" "}
                    {kycApproved
                      ? <Link href="/markets" style={{color:"#F0B90B"}}>Browse markets →</Link>
                      : <Link href="/kyc" style={{color:"#F0B90B"}}>Complete KYC to invest →</Link>
                    }
                  </div>
                ) : investments.slice(0,5).map(i => (
                  <div key={i.id} className="db-row">
                    <div className="db-row-l">
                      <div className="db-row-name">{i.assetSymbol}</div>
                      <div className="db-row-sub">{i.assetName} · {i.quantity} tokens</div>
                    </div>
                    <div>
                      <div className="db-row-val" style={{color:"#fff"}}>€{(i.currentValue||i.amount).toFixed(2)}</div>
                      <div className="db-row-chg green">Active</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="db-card">
                  <div className="db-card-head">
                    <div className="db-card-title">Available Markets</div>
                    <Link href="/markets" className="db-card-link">All →</Link>
                  </div>
                  {MARKET_DATA.slice(0,3).map(m => (
                    <div key={m.id} className="db-row">
                      <span style={{fontSize:18,flexShrink:0}}>{m.emoji}</span>
                      <div className="db-row-l">
                        <div className="db-row-name">{m.title}</div>
                        <div className="db-row-sub">From €{m.min}</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                        <div className="db-row-val gold">{m.roi}%</div>
                        <button
                          className="db-invest-row-btn"
                          disabled={!kycApproved}
                          onClick={() => { setInvestModal(m); setInvestAmount(String(m.min)); }}
                          title={!kycApproved ? "Complete KYC to invest" : "Invest"}
                        >
                          {kycApproved ? "Invest" : "🔒 KYC"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PORTFOLIO TAB */}
          {tab === "portfolio" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">All Investments ({investments.length})</div>
                {kycApproved && <Link href="/markets" className="db-card-link">+ New Investment</Link>}
              </div>
              {investments.length === 0 ? (
                <div className="db-empty">
                  {kycApproved
                    ? <><Link href="/markets" style={{color:"#F0B90B"}}>Browse markets</Link> to make your first investment.</>
                    : <>Complete <Link href="/kyc" style={{color:"#F0B90B"}}>KYC verification</Link> to start investing.</>
                  }
                </div>
              ) : investments.map(i => (
                <div key={i.id} className="db-row" style={{flexDirection:"column",alignItems:"flex-start",gap:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                    <div>
                      <div className="db-row-name">{i.assetName}</div>
                      <div className="db-row-sub">{i.quantity} tokens @ €{i.tokenPrice?.toFixed(2)} · {new Date(i.createdAt).toLocaleDateString("en-GB")}</div>
                    </div>
                    <div>
                      <div className="db-row-val" style={{color:"#fff"}}>€{(i.currentValue||i.amount).toFixed(2)}</div>
                      <div className="db-row-chg green">{i.status}</div>
                    </div>
                  </div>
                  <div style={{width:"100%"}}>
                    <div className="db-prog"><div className="db-prog-fill" style={{width:"100%"}} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MARKETS TAB */}
          {tab === "markets" && (
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">Available Assets ({MARKET_DATA.length})</div>
                <Link href="/markets" className="db-card-link">Full page →</Link>
              </div>
              {MARKET_DATA.map(m => (
                <div key={m.id} className="db-row">
                  <span style={{fontSize:20,flexShrink:0}}>{m.emoji}</span>
                  <div className="db-row-l">
                    <div className="db-row-name">{m.title}</div>
                    <div className="db-row-sub">📍 {m.location} · Min €{m.min} · €{m.price}/token</div>
                    <div className="db-prog" style={{width:"55%"}}>
                      <div className="db-prog-fill" style={{width:Math.round(m.raised/m.target*100)+"%"}} />
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                    <div className="db-row-val gold">{m.roi}% ROI</div>
                    <button
                      className="db-invest-row-btn"
                      disabled={!kycApproved}
                      onClick={() => { setInvestModal(m); setInvestAmount(String(m.min)); }}
                      title={!kycApproved ? "Complete KYC to invest" : `Invest in ${m.title}`}
                    >
                      {kycApproved ? "Invest →" : "🔒 KYC Required"}
                    </button>
                  </div>
                </div>
              ))}
              {!kycApproved && (
                <div style={{padding:"16px 18px",borderTop:"1px solid rgba(255,255,255,0.06)",fontSize:13,color:"rgba(255,255,255,0.35)",textAlign:"center"}}>
                  <Link href="/kyc" style={{color:"#F0B90B",textDecoration:"none"}}>Complete KYC verification</Link> to unlock investing
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* INVEST MODAL */}
      {investModal && (
        <div className="inv-overlay" onClick={e => { if(e.target===e.currentTarget){setInvestModal(null);setInvestMsg("");} }}>
          <div className="inv-modal">
            <div style={{fontSize:28,marginBottom:10}}>{investModal.emoji}</div>
            <div className="inv-title">{investModal.title}</div>
            <p className="inv-sub">📍 {investModal.location} · {investModal.roi}% Target ROI · Min €{investModal.min}</p>

            <label className="inv-label">Investment Amount (EUR)</label>
            <input
              className="inv-input"
              type="number"
              min={investModal.min}
              step="50"
              value={investAmount}
              onChange={e => setInvestAmount(e.target.value)}
              placeholder={`Min €${investModal.min}`}
            />
            <div className="inv-hint">
              ≈ {investAmount ? Math.floor(parseFloat(investAmount)/investModal.price) : 0} tokens @ €{investModal.price}/token
            </div>

            {investMsg && (
              <div className={`inv-msg ${investMsg.startsWith("✅")?"ok":"err"}`}>{investMsg}</div>
            )}

            <div className="inv-btns">
              <button className="inv-btn cancel" onClick={() => { setInvestModal(null); setInvestMsg(""); }}>Cancel</button>
              <button
                className="inv-btn confirm"
                disabled={investLoading || !investAmount || parseFloat(investAmount) < investModal.min}
                onClick={handleInvest}
              >
                {investLoading ? <><span className="inv-spin"/>Investing...</> : `Invest €${investAmount||"0"} →`}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}