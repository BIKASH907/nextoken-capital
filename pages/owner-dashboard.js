import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATUS_COLORS = {
  draft:     { bg:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.4)", label:"Draft" },
  review:    { bg:"rgba(240,185,11,0.1)",   color:"#F0B90B",              label:"Under Review" },
  approved:  { bg:"rgba(59,130,246,0.1)",   color:"#3B82F6",              label:"Approved" },
  live:      { bg:"rgba(14,203,129,0.1)",   color:"#0ECB81",              label:"Live" },
  closing:   { bg:"rgba(240,185,11,0.1)",   color:"#F0B90B",              label:"Closing Soon" },
  closed:    { bg:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.4)", label:"Closed" },
  completed: { bg:"rgba(14,203,129,0.1)",   color:"#0ECB81",              label:"Completed" },
  cancelled: { bg:"rgba(255,77,77,0.1)",    color:"#FF4D4D",              label:"Cancelled" },
};

const ASSET_ICONS = {
  real_estate:"🏢", bond:"📄", equity:"📈", energy:"⚡",
  fund:"🏦", commodity:"💎", infrastructure:"🏗", other:"📦",
};

function fmt(n) {
  if (n >= 1000000) return "€" + (n/1000000).toFixed(1) + "M";
  if (n >= 1000) return "€" + (n/1000).toFixed(0) + "K";
  return "€" + n;
}

export default function OwnerDashboard() {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [listings, setListings] = useState([]);
  const [stats, setStats]       = useState({});
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState("overview");

  const loadData = useCallback(async () => {
    try {
      const userRes = await fetch("/api/user/me");
      if (!userRes.ok) { router.push("/login?redirect=/owner-dashboard"); return; }
      const userData = await userRes.json();
      setUser(userData);

      const listRes = await fetch("/api/assets/my-listings");
      if (listRes.ok) {
        const data = await listRes.json();
        setListings(data.listings || []);
        setStats(data.stats || {});
      }
    } catch { router.push("/login"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#0B0E11",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:32,height:32,border:"3px solid rgba(240,185,11,0.2)",borderTopColor:"#F0B90B",borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 14px"}}/>
        <div style={{color:"rgba(255,255,255,0.3)",fontSize:13}}>Loading dashboard...</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!user) return null;

  return (
    <>
      <Head><title>Asset Owner Dashboard — Nextoken Capital</title></Head>
      <Navbar />
      <style>{`
        .od{min-height:100vh;background:#0B0E11;padding-top:64px}
        .od-head{background:#0F1318;border-bottom:1px solid rgba(255,255,255,0.07);padding:20px}
        .od-head-in{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
        .od-title{font-size:clamp(1rem,2.5vw,1.4rem);font-weight:900;color:#fff}
        .od-title-sub{font-size:13px;color:rgba(255,255,255,0.35);margin-top:2px}
        .od-head-btns{display:flex;gap:10px;flex-wrap:wrap}
        .od-btn-new{padding:9px 20px;background:#F0B90B;color:#000;border:none;border-radius:7px;font-size:13px;font-weight:800;cursor:pointer;text-decoration:none;font-family:inherit}
        .od-btn-new:hover{background:#FFD000}
        .od-btn-switch{padding:9px 16px;background:transparent;color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.12);border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;font-family:inherit}
        .od-body{max-width:1280px;margin:0 auto;padding:22px 20px 60px}
        .od-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
        .od-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px}
        .od-stat-v{font-size:1.5rem;font-weight:900;line-height:1;margin-bottom:5px}
        .od-stat-l{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px}
        .od-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:20px;overflow-x:auto}
        .od-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;margin-bottom:-1px}
        .od-tab:hover{color:#fff}
        .od-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
        .od-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:13px;overflow:hidden;margin-bottom:16px}
        .od-card-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between}
        .od-card-title{font-size:13px;font-weight:700;color:#fff}
        .od-listing{display:flex;align-items:center;gap:16px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.05);transition:background .15s}
        .od-listing:last-child{border-bottom:none}
        .od-listing:hover{background:rgba(255,255,255,0.02)}
        .od-listing-ico{font-size:28px;flex-shrink:0}
        .od-listing-info{flex:1;min-width:0}
        .od-listing-name{font-size:14px;font-weight:700;color:#fff;margin-bottom:2px}
        .od-listing-meta{font-size:12px;color:rgba(255,255,255,0.35)}
        .od-listing-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}
        .od-listing-raised{font-size:14px;font-weight:800;color:#F0B90B}
        .od-listing-prog{width:100px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden}
        .od-listing-prog-fill{height:100%;background:#F0B90B;border-radius:2px}
        .od-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700}
        .od-empty{padding:40px 18px;font-size:13px;color:rgba(255,255,255,0.3);text-align:center}
        .od-docs{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
        .od-doc{padding:6px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;font-size:11px;color:rgba(255,255,255,0.5);text-decoration:none;transition:all .15s}
        .od-doc:hover{border-color:rgba(240,185,11,0.3);color:#F0B90B}
        @media(max-width:900px){.od-stats{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.od-stats{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="od">
        <div className="od-head">
          <div className="od-head-in">
            <div>
              <div className="od-title">Asset Owner Dashboard 🏢</div>
              <div className="od-title-sub">{user.firstName} {user.lastName} · {user.email}</div>
            </div>
            <div className="od-head-btns">
              <Link href="/tokenize" className="od-btn-new">+ List New Asset</Link>
              <Link href="/dashboard" className="od-btn-switch">Switch to Investor →</Link>
            </div>
          </div>
        </div>

        <div className="od-body">
          {/* STATS */}
          <div className="od-stats">
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#F0B90B"}}>{stats.totalListings || 0}</div>
              <div className="od-stat-l">Total Listings</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#0ECB81"}}>{stats.liveListings || 0}</div>
              <div className="od-stat-l">Live Listings</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#F0B90B"}}>{fmt(stats.totalRaised || 0)}</div>
              <div className="od-stat-l">Total Raised</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#fff"}}>{stats.totalInvestors || 0}</div>
              <div className="od-stat-l">Total Investors</div>
            </div>
          </div>

          {/* TABS */}
          <div className="od-tabs">
            {[["overview","All Listings"],["live","Live"],["review","Under Review"],["completed","Completed"]].map(([id,lbl]) => (
              <button key={id} className={`od-tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lbl}</button>
            ))}
          </div>

          {/* LISTINGS */}
          <div className="od-card">
            <div className="od-card-head">
              <div className="od-card-title">
                {tab === "overview" ? "All Listings" : tab === "live" ? "Live Listings" : tab === "review" ? "Under Review" : "Completed"}
                {" "}({(tab === "overview" ? listings : listings.filter(l =>
                  tab === "live" ? (l.status === "live" || l.status === "closing") :
                  tab === "review" ? (l.status === "review" || l.status === "draft") :
                  (l.status === "completed" || l.status === "closed")
                )).length})
              </div>
              <Link href="/tokenize" style={{fontSize:12,color:"#F0B90B",textDecoration:"none"}}>+ New Listing</Link>
            </div>

            {listings.length === 0 ? (
              <div className="od-empty">
                No listings yet. <Link href="/tokenize" style={{color:"#F0B90B"}}>Create your first listing →</Link>
              </div>
            ) : (
              (tab === "overview" ? listings : listings.filter(l =>
                tab === "live" ? (l.status === "live" || l.status === "closing") :
                tab === "review" ? (l.status === "review" || l.status === "draft") :
                (l.status === "completed" || l.status === "closed")
              )).map(l => {
                const sc = STATUS_COLORS[l.status] || STATUS_COLORS.draft;
                const pct = l.targetRaise ? Math.round((l.raisedAmount / l.targetRaise) * 100) : 0;
                return (
                  <div key={l.id} className="od-listing">
                    <div className="od-listing-ico">{ASSET_ICONS[l.assetType] || "📦"}</div>
                    <div className="od-listing-info">
                      <div className="od-listing-name">{l.name} <span style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.3)",marginLeft:6}}>{l.ticker}</span></div>
                      <div className="od-listing-meta">
                        {l.location && <>📍 {l.location} · </>}
                        {l.targetROI && <>{l.targetROI}% ROI · </>}
                        Min €{l.minInvestment || 100} ·{" "}
                        {l.investorCount || 0} investors
                      </div>
                      {l.documents && l.documents.length > 0 && (
                        <div className="od-docs">
                          {l.documents.map((d, i) => (
                            <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="od-doc">
                              📎 {d.name || `Document ${i+1}`}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="od-listing-right">
                      <span className="od-badge" style={{background:sc.bg, color:sc.color, border:`1px solid ${sc.color}33`}}>
                        {sc.label}
                      </span>
                      <div className="od-listing-raised">{fmt(l.raisedAmount || 0)} / {fmt(l.targetRaise)}</div>
                      <div className="od-listing-prog">
                        <div className="od-listing-prog-fill" style={{width: Math.min(pct, 100) + "%"}} />
                      </div>
                      <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{pct}% funded</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* HELP */}
          <div style={{background:"#0F1318",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:20,marginTop:16}}>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:8}}>Need Help?</div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.7,marginBottom:12}}>
              Our compliance team reviews all new listings within 2-3 business days. Once approved, your asset goes live on the marketplace.
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Link href="/contact" style={{padding:"8px 16px",background:"rgba(240,185,11,0.1)",border:"1px solid rgba(240,185,11,0.25)",borderRadius:7,fontSize:12,fontWeight:700,color:"#F0B90B",textDecoration:"none"}}>Contact Support</Link>
              <Link href="/help" style={{padding:"8px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.5)",textDecoration:"none"}}>Help Center</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
