import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATUS_STYLES = {
  draft:     { bg:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)", label:"Draft" },
  review:    { bg:"rgba(240,185,11,0.1)",  color:"#F0B90B",              label:"Under Review" },
  approved:  { bg:"rgba(59,130,246,0.1)",  color:"#3B82F6",              label:"Approved" },
  live:      { bg:"rgba(14,203,129,0.1)",  color:"#0ECB81",              label:"Live" },
  closing:   { bg:"rgba(240,185,11,0.1)",  color:"#F0B90B",              label:"Closing Soon" },
  closed:    { bg:"rgba(99,102,241,0.1)",  color:"#818cf8",              label:"Fully Funded" },
  completed: { bg:"rgba(14,203,129,0.1)",  color:"#0ECB81",              label:"Completed" },
  cancelled: { bg:"rgba(255,77,77,0.1)",   color:"#FF6B6B",              label:"Cancelled" },
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
  const [assets, setAssets]     = useState([]);
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
        setAssets(data.assets || []);
        setStats(data.stats || {});
      }
    } catch { router.push("/login"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const deleteAsset = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });
    if (res.ok) loadData();
  };

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
        .od-new-btn{padding:9px 20px;background:#F0B90B;color:#000;border:none;border-radius:7px;font-size:13px;font-weight:800;cursor:pointer;text-decoration:none;font-family:inherit}
        .od-new-btn:hover{background:#FFD000}
        .od-body{max-width:1280px;margin:0 auto;padding:22px 20px 60px}
        .od-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:20px}
        .od-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px}
        .od-stat-v{font-size:1.5rem;font-weight:900;line-height:1;margin-bottom:5px}
        .od-stat-l{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px}
        .gold{color:#F0B90B}.green{color:#0ECB81}.blue{color:#3B82F6}
        .od-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:20px;overflow-x:auto}
        .od-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;margin-bottom:-1px}
        .od-tab:hover{color:#fff}
        .od-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
        .od-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:13px;overflow:hidden;margin-bottom:16px}
        .od-card-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between}
        .od-card-title{font-size:14px;font-weight:700;color:#fff}
        .od-listing{display:flex;align-items:center;gap:16px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.05);transition:background .15s}
        .od-listing:last-child{border-bottom:none}
        .od-listing:hover{background:rgba(255,255,255,0.02)}
        .od-listing-ico{font-size:28px;flex-shrink:0}
        .od-listing-info{flex:1;min-width:0}
        .od-listing-name{font-size:14px;font-weight:700;color:#fff;margin-bottom:2px}
        .od-listing-meta{font-size:12px;color:rgba(255,255,255,0.35)}
        .od-listing-stats{display:flex;gap:20px;flex-shrink:0}
        .od-listing-stat{text-align:right}
        .od-listing-stat-v{font-size:14px;font-weight:800}
        .od-listing-stat-l{font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px}
        .od-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700}
        .od-prog{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;width:120px;overflow:hidden;margin-top:4px}
        .od-prog-fill{height:100%;background:#F0B90B;border-radius:2px}
        .od-listing-actions{display:flex;gap:6px;flex-shrink:0}
        .od-act-btn{padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;border:none}
        .od-act-edit{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1)}
        .od-act-edit:hover{color:#fff;border-color:rgba(255,255,255,0.3)}
        .od-act-del{background:rgba(255,77,77,0.08);color:#FF6B6B;border:1px solid rgba(255,77,77,0.15)}
        .od-act-del:hover{background:rgba(255,77,77,0.15)}
        .od-empty{padding:40px 20px;text-align:center;color:rgba(255,255,255,0.3);font-size:14px}
        .od-empty a{color:#F0B90B;text-decoration:none}
        @media(max-width:900px){.od-stats{grid-template-columns:repeat(2,1fr)}.od-listing{flex-direction:column;align-items:flex-start}.od-listing-stats{width:100%;justify-content:space-between}}
        @media(max-width:480px){.od-stats{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="od">
        <div className="od-head">
          <div className="od-head-in">
            <div>
              <div className="od-title">Asset Owner Dashboard</div>
              <div className="od-title-sub">{user.firstName} {user.lastName} · {user.email}</div>
            </div>
            <Link href="/tokenize" className="od-new-btn">+ List New Asset</Link>
          </div>
        </div>

        <div className="od-body">
          {/* STATS */}
          <div className="od-stats">
            <div className="od-stat">
              <div className="od-stat-v gold">{stats.totalAssets || 0}</div>
              <div className="od-stat-l">Total Listings</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v green">{stats.liveAssets || 0}</div>
              <div className="od-stat-l">Live Now</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v gold">{fmt(stats.totalRaised || 0)}</div>
              <div className="od-stat-l">Total Raised</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v" style={{color:"#fff"}}>{stats.totalInvestors || 0}</div>
              <div className="od-stat-l">Total Investors</div>
            </div>
            <div className="od-stat">
              <div className="od-stat-v blue">{stats.totalViews || 0}</div>
              <div className="od-stat-l">Total Views</div>
            </div>
          </div>

          {/* TABS */}
          <div className="od-tabs">
            {[["overview","All Listings"],["live","Live"],["review","Under Review"],["draft","Drafts"]].map(([id,lbl]) => (
              <button key={id} className={`od-tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lbl}</button>
            ))}
          </div>

          {/* LISTINGS */}
          <div className="od-card">
            <div className="od-card-head">
              <div className="od-card-title">
                {tab === "overview" ? "All Listings" : tab === "live" ? "Live Listings" : tab === "review" ? "Under Review" : "Drafts"}
                {" "}({(tab === "overview" ? assets : assets.filter(a => tab === "live" ? ["live","closing"].includes(a.status) : a.status === tab)).length})
              </div>
            </div>

            {(() => {
              const filtered = tab === "overview" ? assets :
                tab === "live" ? assets.filter(a => ["live","closing"].includes(a.status)) :
                assets.filter(a => a.status === tab);

              if (filtered.length === 0) return (
                <div className="od-empty">
                  No listings found. <Link href="/tokenize">Create your first listing →</Link>
                </div>
              );

              return filtered.map(a => {
                const st = STATUS_STYLES[a.status] || STATUS_STYLES.draft;
                return (
                  <div key={a._id} className="od-listing">
                    <div className="od-listing-ico">{ASSET_ICONS[a.assetType] || "📦"}</div>
                    <div className="od-listing-info">
                      <div className="od-listing-name">{a.name} <span style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.3)",marginLeft:6}}>{a.ticker}</span></div>
                      <div className="od-listing-meta">
                        {a.location && `📍 ${a.location} · `}
                        {a.assetType?.replace("_"," ")} · Created {new Date(a.createdAt).toLocaleDateString("en-GB")}
                      </div>
                      <span className="od-badge" style={{background:st.bg,color:st.color,marginTop:6}}>{st.label}</span>
                    </div>
                    <div className="od-listing-stats">
                      <div className="od-listing-stat">
                        <div className="od-listing-stat-v gold">{fmt(a.totalInvested || 0)}</div>
                        <div className="od-listing-stat-l">Raised</div>
                        <div className="od-prog"><div className="od-prog-fill" style={{width:(a.fundingPct||0)+"%"}} /></div>
                      </div>
                      <div className="od-listing-stat">
                        <div className="od-listing-stat-v" style={{color:"#fff"}}>{a.investorCount || 0}</div>
                        <div className="od-listing-stat-l">Investors</div>
                      </div>
                      <div className="od-listing-stat">
                        <div className="od-listing-stat-v" style={{color:"#fff"}}>{fmt(a.targetRaise)}</div>
                        <div className="od-listing-stat-l">Target</div>
                      </div>
                      {a.targetROI && (
                        <div className="od-listing-stat">
                          <div className="od-listing-stat-v green">{a.targetROI}%</div>
                          <div className="od-listing-stat-l">ROI</div>
                        </div>
                      )}
                    </div>
                    <div className="od-listing-actions">
                      {["draft","review"].includes(a.status) && (
                        <>
                          <button className="od-act-btn od-act-edit" onClick={() => router.push(`/tokenize?edit=${a._id}`)}>Edit</button>
                          <button className="od-act-btn od-act-del" onClick={() => deleteAsset(a._id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
