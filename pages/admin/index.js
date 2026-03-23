// pages/admin/index.js — Full admin dashboard with tabs
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

const TABS = ["Dashboard","Assets","Users","Investments","Blockchain","Employees"];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab]       = useState("Dashboard");
  const [admin, setAdmin]   = useState(null);
  const [stats, setStats]   = useState(null);
  const [assets, setAssets] = useState([]);
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [assetForm, setAssetForm] = useState({ name:"", ticker:"", assetType:"real_estate", targetRaise:"", minInvestment:"100", targetROI:"", term:"", location:"", riskLevel:"medium", status:"draft" });
  const [formLoading, setFormLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const apiFetch = useCallback(async (url, opts = {}) => {
    const res = await fetch(url, { ...opts, headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}`, ...opts.headers } });
    if (res.status === 401) { localStorage.removeItem("adminToken"); router.push("/admin/login"); return null; }
    return res.json();
  }, [token, router]);

  useEffect(() => {
    if (!token) { router.push("/admin/login"); return; }
    try { const p = JSON.parse(atob(token.split(".")[1])); setAdmin(p); } catch {}
    loadStats();
  }, [token]);

  const loadStats = async () => {
    setLoading(true);
    const data = await apiFetch("/api/admin/stats");
    if (data) setStats(data);
    setLoading(false);
  };

  const loadAssets = async () => {
    const data = await apiFetch("/api/admin/assets");
    if (data) setAssets(data.assets || []);
  };

  const loadUsers = async () => {
    const data = await apiFetch("/api/admin/users");
    if (data) setUsers(data.users || []);
  };

  useEffect(() => {
    if (tab === "Assets") loadAssets();
    if (tab === "Users") loadUsers();
  }, [tab]);

  const createAsset = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMsg("");
    const data = await apiFetch("/api/admin/assets", { method:"POST", body: JSON.stringify(assetForm) });
    setFormLoading(false);
    if (data?.asset) { setMsg("✅ Asset created!"); setShowAssetForm(false); loadAssets(); setAssetForm({ name:"",ticker:"",assetType:"real_estate",targetRaise:"",minInvestment:"100",targetROI:"",term:"",location:"",riskLevel:"medium",status:"draft" }); }
    else setMsg("❌ " + (data?.error || "Failed"));
  };

  const deleteAsset = async (id) => {
    if (!confirm("Delete this asset?")) return;
    await apiFetch(`/api/admin/assets/${id}`, { method:"DELETE" });
    loadAssets();
  };

  const updateAssetStatus = async (id, status) => {
    await apiFetch(`/api/admin/assets/${id}`, { method:"PATCH", body: JSON.stringify({ status }) });
    loadAssets();
  };

  const ROLE_COLOR = { super_admin:"#F0B90B", admin:"#0ECB81", compliance:"#3B9AF8", operations:"#A78BFA", finance:"#FB923C", support:"#94A3B8" };

  return (
    <>
      <Head><title>Admin — Nextoken Capital</title></Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0B0E11;color:#fff;font-family:'DM Sans',system-ui,sans-serif}
        .ad{display:flex;min-height:100vh}
        .ad-side{width:220px;background:#0F1318;border-right:1px solid rgba(255,255,255,0.07);padding:20px 0;position:fixed;top:0;bottom:0;flex-shrink:0;display:flex;flex-direction:column}
        .ad-logo{padding:0 20px 20px;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:16px}
        .ad-logo-nxt{font-size:18px;font-weight:900;color:#F0B90B}
        .ad-logo-sub{font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:1px}
        .ad-nav-item{display:flex;align-items:center;gap:10px;padding:10px 20px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);cursor:pointer;transition:all .15s;border-left:2px solid transparent}
        .ad-nav-item:hover{color:#fff;background:rgba(255,255,255,0.04)}
        .ad-nav-item.on{color:#F0B90B;background:rgba(240,185,11,0.06);border-left-color:#F0B90B}
        .ad-nav-ico{font-size:16px;width:20px;text-align:center}
        .ad-user{margin-top:auto;padding:16px 20px;border-top:1px solid rgba(255,255,255,0.07)}
        .ad-user-name{font-size:12px;font-weight:700;color:#fff}
        .ad-user-role{font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px;margin-bottom:10px}
        .ad-logout{font-size:12px;color:rgba(255,255,255,0.4);cursor:pointer;background:none;border:none;font-family:inherit;padding:0}
        .ad-logout:hover{color:#ff6b6b}
        .ad-main{margin-left:220px;flex:1;padding:28px}
        .ad-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
        .ad-title{font-size:20px;font-weight:900}
        .ad-back{font-size:12px;color:rgba(255,255,255,0.4);text-decoration:none;border:1px solid rgba(255,255,255,0.1);padding:6px 14px;border-radius:7px;transition:all .15s}
        .ad-back:hover{color:#fff;border-color:rgba(255,255,255,0.3)}
        .ad-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
        .ad-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px}
        .ad-card-val{font-size:26px;font-weight:900;color:#F0B90B}
        .ad-card-lbl{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px;margin-top:4px}
        .ad-card-sub{font-size:11px;color:rgba(255,255,255,0.25);margin-top:6px}
        .ad-sec{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;margin-bottom:16px}
        .ad-sec-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .ad-sec-title{font-size:13px;font-weight:700;color:rgba(255,255,255,0.7)}
        .ad-btn{padding:8px 16px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;border:none}
        .ad-btn-yellow{background:#F0B90B;color:#000}
        .ad-btn-yellow:hover{background:#FFD000}
        .ad-btn-ghost{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1)}
        .ad-btn-ghost:hover{background:rgba(255,255,255,0.1);color:#fff}
        .ad-btn-red{background:rgba(255,77,77,0.12);color:#ff6b6b;border:1px solid rgba(255,77,77,0.2)}
        .ad-btn-red:hover{background:rgba(255,77,77,0.2)}
        .ad-btn-green{background:rgba(14,203,129,0.12);color:#0ECB81;border:1px solid rgba(14,203,129,0.2)}
        .ad-table{width:100%;border-collapse:collapse}
        .ad-table th{text-align:left;font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px;padding:10px 20px;border-bottom:1px solid rgba(255,255,255,0.05)}
        .ad-table td{padding:12px 20px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.04)}
        .ad-table tr:last-child td{border-bottom:none}
        .ad-table tr:hover td{background:rgba(255,255,255,0.02)}
        .ad-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700}
        .ad-badge-green{background:rgba(14,203,129,0.12);color:#0ECB81}
        .ad-badge-yellow{background:rgba(240,185,11,0.12);color:#F0B90B}
        .ad-badge-red{background:rgba(255,77,77,0.12);color:#ff6b6b}
        .ad-badge-gray{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.4)}
        .ad-badge-blue{background:rgba(59,154,248,0.12);color:#3B9AF8}
        .ad-form{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:20px}
        .ad-form-full{grid-column:1/-1}
        .ad-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
        .ad-input{width:100%;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:7px;padding:9px 12px;font-size:13px;color:#fff;outline:none;font-family:inherit;transition:border-color .15s;box-sizing:border-box}
        .ad-input:focus{border-color:rgba(240,185,11,0.4)}
        .ad-msg{padding:10px 20px;font-size:13px;border-radius:7px;margin-bottom:14px}
        .ad-msg-ok{background:rgba(14,203,129,0.1);color:#0ECB81;border:1px solid rgba(14,203,129,0.2)}
        .ad-msg-err{background:rgba(255,77,77,0.1);color:#ff6b6b;border:1px solid rgba(255,77,77,0.2)}
        .ad-empty{text-align:center;padding:40px;color:rgba(255,255,255,0.3);font-size:13px}
        @media(max-width:900px){.ad-side{display:none}.ad-main{margin-left:0}.ad-grid{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="ad">
        {/* SIDEBAR */}
        <div className="ad-side">
          <div className="ad-logo">
            <div className="ad-logo-nxt">NXT Admin</div>
            <div className="ad-logo-sub">NEXTOKEN CAPITAL</div>
          </div>
          {[
            ["Dashboard","📊"],["Assets","🏢"],["Users","👥"],
            ["Investments","💰"],["Blockchain","🔗"],["Employees","👤"],
          ].map(([t, ico]) => (
            <div key={t} className={`ad-nav-item ${tab===t?"on":""}`} onClick={() => setTab(t)}>
              <span className="ad-nav-ico">{ico}</span>{t}
            </div>
          ))}
          <div className="ad-user">
            {admin && <>
              <div className="ad-user-name">{admin.email}</div>
              <div className="ad-user-role" style={{ color: ROLE_COLOR[admin.role] || "#94A3B8" }}>{admin.role}</div>
            </>}
            <button className="ad-logout" onClick={() => { localStorage.removeItem("adminToken"); router.push("/admin/login"); }}>
              Sign out →
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div className="ad-main">
          <div className="ad-topbar">
            <div className="ad-title">{tab}</div>
            <Link href="/" className="ad-back">← Back to site</Link>
          </div>

          {msg && <div className={`ad-msg ${msg.startsWith("✅") ? "ad-msg-ok" : "ad-msg-err"}`}>{msg}</div>}

          {/* DASHBOARD TAB */}
          {tab === "Dashboard" && <>
            {loading ? <div className="ad-empty">Loading...</div> : stats && <>
              <div className="ad-grid">
                <div className="ad-card"><div className="ad-card-val">{stats.users?.total || 0}</div><div className="ad-card-lbl">Total Users</div><div className="ad-card-sub">KYC pending: {stats.users?.kycPending || 0}</div></div>
                <div className="ad-card"><div className="ad-card-val">€{((stats.investments?.volume || 0)/1000).toFixed(0)}K</div><div className="ad-card-lbl">Total Volume</div><div className="ad-card-sub">{stats.investments?.confirmed || 0} active investments</div></div>
                <div className="ad-card"><div className="ad-card-val">{stats.assets?.live || 0}</div><div className="ad-card-lbl">Live Assets</div><div className="ad-card-sub">{stats.assets?.draft || 0} in draft</div></div>
                <div className="ad-card"><div className="ad-card-val">{stats.blockchain?.whitelisted || 0}</div><div className="ad-card-lbl">Whitelisted Wallets</div><div className="ad-card-sub">{stats.blockchain?.wallets || 0} total connected</div></div>
              </div>
              <div className="ad-grid" style={{ gridTemplateColumns:"1fr 1fr" }}>
                <div className="ad-sec">
                  <div className="ad-sec-head"><span className="ad-sec-title">Recent Users</span></div>
                  <table className="ad-table">
                    <thead><tr><th>Name</th><th>Email</th><th>KYC</th></tr></thead>
                    <tbody>
                      {(stats.recentUsers || []).map(u => (
                        <tr key={u._id}>
                          <td>{u.firstName} {u.lastName}</td>
                          <td style={{ color:"rgba(255,255,255,0.5)" }}>{u.email}</td>
                          <td><span className={`ad-badge ${u.kycStatus==="approved"?"ad-badge-green":u.kycStatus==="pending"?"ad-badge-yellow":"ad-badge-gray"}`}>{u.kycStatus}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="ad-sec">
                  <div className="ad-sec-head"><span className="ad-sec-title">Recent Investments</span></div>
                  <table className="ad-table">
                    <thead><tr><th>Asset</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {(stats.recentInvestments || []).map(inv => (
                        <tr key={inv._id}>
                          <td>{inv.assetName}</td>
                          <td>€{inv.amount?.toLocaleString()}</td>
                          <td><span className={`ad-badge ${inv.status==="active"?"ad-badge-green":inv.status==="pending"?"ad-badge-yellow":"ad-badge-gray"}`}>{inv.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>}
          </>}

          {/* ASSETS TAB */}
          {tab === "Assets" && <>
            <div className="ad-sec">
              <div className="ad-sec-head">
                <span className="ad-sec-title">{assets.length} assets</span>
                <button className="ad-btn ad-btn-yellow" onClick={() => setShowAssetForm(f => !f)}>
                  {showAssetForm ? "Cancel" : "+ Add Asset"}
                </button>
              </div>

              {showAssetForm && (
                <form onSubmit={createAsset} className="ad-form">
                  <div><label className="ad-label">Asset Name *</label><input className="ad-input" value={assetForm.name} onChange={e => setAssetForm(f=>({...f,name:e.target.value}))} placeholder="Solar Farm Portfolio" required /></div>
                  <div><label className="ad-label">Ticker *</label><input className="ad-input" value={assetForm.ticker} onChange={e => setAssetForm(f=>({...f,ticker:e.target.value.toUpperCase()}))} placeholder="SFP" required /></div>
                  <div><label className="ad-label">Asset Type *</label>
                    <select className="ad-input" value={assetForm.assetType} onChange={e => setAssetForm(f=>({...f,assetType:e.target.value}))}>
                      {["real_estate","bond","equity","energy","fund","commodity","infrastructure"].map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label className="ad-label">Location</label><input className="ad-input" value={assetForm.location} onChange={e => setAssetForm(f=>({...f,location:e.target.value}))} placeholder="Berlin, Germany" /></div>
                  <div><label className="ad-label">Target Raise (EUR) *</label><input className="ad-input" type="number" value={assetForm.targetRaise} onChange={e => setAssetForm(f=>({...f,targetRaise:e.target.value}))} placeholder="5000000" required /></div>
                  <div><label className="ad-label">Min Investment (EUR)</label><input className="ad-input" type="number" value={assetForm.minInvestment} onChange={e => setAssetForm(f=>({...f,minInvestment:e.target.value}))} /></div>
                  <div><label className="ad-label">Target ROI (%)</label><input className="ad-input" type="number" step="0.1" value={assetForm.targetROI} onChange={e => setAssetForm(f=>({...f,targetROI:e.target.value}))} placeholder="14.5" /></div>
                  <div><label className="ad-label">Term (months)</label><input className="ad-input" type="number" value={assetForm.term} onChange={e => setAssetForm(f=>({...f,term:e.target.value}))} placeholder="36" /></div>
                  <div><label className="ad-label">Risk Level</label>
                    <select className="ad-input" value={assetForm.riskLevel} onChange={e => setAssetForm(f=>({...f,riskLevel:e.target.value}))}>
                      <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                    </select>
                  </div>
                  <div><label className="ad-label">Initial Status</label>
                    <select className="ad-input" value={assetForm.status} onChange={e => setAssetForm(f=>({...f,status:e.target.value}))}>
                      <option value="draft">Draft</option><option value="review">Review</option><option value="live">Live</option>
                    </select>
                  </div>
                  <div className="ad-form-full" style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
                    <button type="button" className="ad-btn ad-btn-ghost" onClick={() => setShowAssetForm(false)}>Cancel</button>
                    <button type="submit" className="ad-btn ad-btn-yellow" disabled={formLoading}>{formLoading ? "Creating..." : "Create Asset"}</button>
                  </div>
                </form>
              )}

              {assets.length === 0 ? <div className="ad-empty">No assets yet. Click "+ Add Asset" to create your first investment listing.</div> : (
                <table className="ad-table">
                  <thead><tr><th>Asset</th><th>Type</th><th>Target</th><th>ROI</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {assets.map(a => (
                      <tr key={a._id}>
                        <td><div style={{ fontWeight:600 }}>{a.name}</div><div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>{a.ticker} · {a.location}</div></td>
                        <td style={{ color:"rgba(255,255,255,0.5)" }}>{a.assetType}</td>
                        <td>€{(a.targetRaise/1000000).toFixed(1)}M</td>
                        <td style={{ color:"#0ECB81" }}>{a.targetROI}%</td>
                        <td>
                          <span className={`ad-badge ${a.status==="live"?"ad-badge-green":a.status==="draft"?"ad-badge-gray":a.status==="review"?"ad-badge-yellow":"ad-badge-blue"}`}>
                            {a.status}
                          </span>
                        </td>
                        <td style={{ display:"flex",gap:6 }}>
                          {a.status === "draft" && <button className="ad-btn ad-btn-green" style={{ fontSize:11,padding:"4px 10px" }} onClick={() => updateAssetStatus(a._id,"live")}>Publish</button>}
                          {a.status === "live"  && <button className="ad-btn ad-btn-ghost" style={{ fontSize:11,padding:"4px 10px" }} onClick={() => updateAssetStatus(a._id,"closed")}>Close</button>}
                          <button className="ad-btn ad-btn-red" style={{ fontSize:11,padding:"4px 10px" }} onClick={() => deleteAsset(a._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>}

          {/* USERS TAB */}
          {tab === "Users" && <>
            <div className="ad-sec">
              <div className="ad-sec-head"><span className="ad-sec-title">{users.length} users</span></div>
              {users.length === 0 ? <div className="ad-empty">No users registered yet.</div> : (
                <table className="ad-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Country</th><th>KYC</th><th>Joined</th><th>Actions</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight:600 }}>{u.firstName} {u.lastName}</td>
                        <td style={{ color:"rgba(255,255,255,0.5)" }}>{u.email}</td>
                        <td style={{ color:"rgba(255,255,255,0.5)" }}>{u.country || "—"}</td>
                        <td><span className={`ad-badge ${u.kycStatus==="approved"?"ad-badge-green":u.kycStatus==="pending"?"ad-badge-yellow":u.kycStatus==="rejected"?"ad-badge-red":"ad-badge-gray"}`}>{u.kycStatus}</span></td>
                        <td style={{ color:"rgba(255,255,255,0.35)",fontSize:12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td><button className="ad-btn ad-btn-ghost" style={{ fontSize:11,padding:"4px 10px" }}>View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>}

          {/* INVESTMENTS TAB */}
          {tab === "Investments" && (
            <div className="ad-sec">
              <div className="ad-sec-head"><span className="ad-sec-title">Investment records</span></div>
              <div className="ad-empty">Investments will appear here once users start investing.</div>
            </div>
          )}

          {/* BLOCKCHAIN TAB */}
          {tab === "Blockchain" && (
            <div className="ad-sec">
              <div className="ad-sec-head"><span className="ad-sec-title">Wallet whitelist management</span></div>
              <div className="ad-empty">Connected wallets and whitelist management will appear here. Wallets must be whitelisted before users can receive ERC-3643 tokens.</div>
            </div>
          )}

          {/* EMPLOYEES TAB */}
          {tab === "Employees" && (
            <div className="ad-sec">
              <div className="ad-sec-head">
                <span className="ad-sec-title">Team members</span>
                <button className="ad-btn ad-btn-yellow">+ Add Employee</button>
              </div>
              <div className="ad-empty">Add team members with role-based access (compliance, operations, support, finance).</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
