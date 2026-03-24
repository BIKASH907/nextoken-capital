import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

const SAVED_VIEWS = [
  { name:"Morning Queue", desc:"Pending KYC + High Risk", filters:{kyc:"pending",risk:"high"} },
  { name:"New This Week", desc:"Registered in last 7 days", filters:{date:"7d"} },
  { name:"EU Verified", desc:"Approved EU investors", filters:{kyc:"approved",region:"eu"} },
];

const EU_COUNTRIES = ["Austria","Belgium","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France","Germany","Greece","Hungary","Ireland","Italy","Latvia","Lithuania","Luxembourg","Malta","Netherlands","Poland","Portugal","Romania","Slovakia","Slovenia","Spain","Sweden"];

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [fKyc, setFKyc] = useState("all");
  const [fRole, setFRole] = useState("all");
  const [fRisk, setFRisk] = useState("all");
  const [fRegion, setFRegion] = useState("all");
  const [fDate, setFDate] = useState("all");
  const [fType, setFType] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    fetch("/api/admin/users", { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => { if (d.users) setUsers(d.users); });
  }, [router]);

  const applyView = (v) => {
    if (v.filters.kyc) setFKyc(v.filters.kyc);
    if (v.filters.risk) setFRisk(v.filters.risk);
    if (v.filters.date) setFDate(v.filters.date);
    if (v.filters.region) setFRegion(v.filters.region);
  };

  const clearFilters = () => { setFKyc("all"); setFRole("all"); setFRisk("all"); setFRegion("all"); setFDate("all"); setFType("all"); setSearch(""); };

  const filtered = users.filter(u => {
    if (search && !`${u.firstName} ${u.lastName} ${u.email} ${u.country}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (fKyc !== "all" && (u.kycStatus || "none") !== fKyc) return false;
    if (fRole !== "all" && u.role !== fRole) return false;
    if (fType !== "all" && (u.accountType || "investor") !== fType) return false;
    if (fRegion === "eu" && !EU_COUNTRIES.includes(u.country)) return false;
    if (fRegion === "non-eu" && EU_COUNTRIES.includes(u.country)) return false;
    if (fDate !== "all") {
      const days = fDate === "24h" ? 1 : fDate === "7d" ? 7 : fDate === "30d" ? 30 : fDate === "90d" ? 90 : 9999;
      const diff = (Date.now() - new Date(u.createdAt).getTime()) / (1000*60*60*24);
      if (diff > days) return false;
    }
    return true;
  });

  const activeFilterCount = [fKyc,fRole,fRisk,fRegion,fDate,fType].filter(f=>f!=="all").length + (search?1:0);

  return (
    <>
      <Head><title>Users — Admin</title></Head>
      <AdminShell title="User Management" subtitle={`${users.length} total users · ${filtered.length} shown`}>
        <style>{`
          .uf-bar{display:flex;gap:10px;align-items:center;margin-bottom:16px;flex-wrap:wrap}
          .uf-search{flex:1;min-width:200px;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;font-size:13px;color:#fff;outline:none;font-family:inherit}
          .uf-search:focus{border-color:rgba(240,185,11,0.4)}
          .uf-toggle{padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:1px solid rgba(240,185,11,0.25);background:rgba(240,185,11,0.06);color:#F0B90B;font-family:inherit}
          .uf-clear{padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.1);background:none;color:rgba(255,255,255,0.4);font-family:inherit}
          .uf-panel{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px;margin-bottom:16px}
          .uf-panel-title{font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
          .uf-row{display:flex;gap:24px;flex-wrap:wrap;margin-bottom:14px}
          .uf-group{display:flex;flex-direction:column;gap:6px;min-width:140px}
          .uf-label{font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px}
          .uf-chips{display:flex;gap:4px;flex-wrap:wrap}
          .uf-chip{padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.08);background:none;color:rgba(255,255,255,0.4);font-family:inherit;transition:all .15s}
          .uf-chip.on{background:rgba(240,185,11,0.1);color:#F0B90B;border-color:rgba(240,185,11,0.3)}
          .uf-views{display:flex;gap:8px;margin-bottom:16px}
          .uf-view{padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.07);background:#0F1318;color:rgba(255,255,255,0.5);font-family:inherit;transition:all .15s}
          .uf-view:hover{border-color:rgba(240,185,11,0.3);color:#F0B90B}
          .uf-view-name{font-weight:700;color:#fff;margin-right:6px}
          .uf-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden}
          .uf-table{width:100%;border-collapse:collapse}
          .uf-table th{text-align:left;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px;padding:12px 14px;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);background:#161B22}
          .uf-table td{padding:11px 14px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.04)}
          .uf-table tr:hover td{background:rgba(255,255,255,0.02)}
          .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700}
          .bg{background:rgba(14,203,129,0.12);color:#0ECB81}
          .by{background:rgba(240,185,11,0.12);color:#F0B90B}
          .br{background:rgba(255,77,77,0.12);color:#ff6b6b}
          .bb{background:rgba(88,101,242,0.12);color:#818cf8}
          .bw{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}
          .uf-count{font-size:12px;color:rgba(255,255,255,0.3);margin-bottom:8px}
        `}</style>

        {/* Saved Views */}
        <div className="uf-views">
          <span style={{fontSize:11,color:"rgba(255,255,255,0.25)",alignSelf:"center",marginRight:4}}>Smart Folders:</span>
          {SAVED_VIEWS.map(v => (
            <button key={v.name} className="uf-view" onClick={()=>applyView(v)}>
              <span className="uf-view-name">{v.name}</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{v.desc}</span>
            </button>
          ))}
        </div>

        {/* Search + Toggle */}
        <div className="uf-bar">
          <input className="uf-search" placeholder="Search by name, email, country..." value={search} onChange={e=>setSearch(e.target.value)} />
          <button className="uf-toggle" onClick={()=>setShowFilters(!showFilters)}>
            🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          {activeFilterCount > 0 && <button className="uf-clear" onClick={clearFilters}>✕ Clear all</button>}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="uf-panel">
            <div className="uf-panel-title">Filter Users</div>
            <div className="uf-row">
              <div className="uf-group">
                <div className="uf-label">Verification Status</div>
                <div className="uf-chips">
                  {["all","none","pending","approved","rejected"].map(v => (
                    <button key={v} className={`uf-chip ${fKyc===v?"on":""}`} onClick={()=>setFKyc(v)}>{v==="all"?"All":v.charAt(0).toUpperCase()+v.slice(1)}</button>
                  ))}
                </div>
              </div>
              <div className="uf-group">
                <div className="uf-label">User Role</div>
                <div className="uf-chips">
                  {[["all","All"],["user","User"],["admin","Admin"]].map(([v,l]) => (
                    <button key={v} className={`uf-chip ${fRole===v?"on":""}`} onClick={()=>setFRole(v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="uf-group">
                <div className="uf-label">Account Type</div>
                <div className="uf-chips">
                  {[["all","All"],["investor","Investor"],["issuer","Asset Owner"]].map(([v,l]) => (
                    <button key={v} className={`uf-chip ${fType===v?"on":""}`} onClick={()=>setFType(v)}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="uf-row">
              <div className="uf-group">
                <div className="uf-label">Region</div>
                <div className="uf-chips">
                  {[["all","All"],["eu","EU Only"],["non-eu","Non-EU"]].map(([v,l]) => (
                    <button key={v} className={`uf-chip ${fRegion===v?"on":""}`} onClick={()=>setFRegion(v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="uf-group">
                <div className="uf-label">Onboarding Date</div>
                <div className="uf-chips">
                  {[["all","All Time"],["24h","24h"],["7d","7 Days"],["30d","30 Days"],["90d","90 Days"]].map(([v,l]) => (
                    <button key={v} className={`uf-chip ${fDate===v?"on":""}`} onClick={()=>setFDate(v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="uf-group">
                <div className="uf-label">Risk Level</div>
                <div className="uf-chips">
                  {[["all","All"],["low","Low"],["medium","Medium"],["high","High"]].map(([v,l]) => (
                    <button key={v} className={`uf-chip ${fRisk===v?"on":""}`} onClick={()=>setFRisk(v)}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="uf-count">Showing {filtered.length} of {users.length} users</div>

        <div className="uf-card">
          <table className="uf-table">
            <thead><tr><th>Name</th><th>Email</th><th>Country</th><th>KYC</th><th>Type</th><th>Role</th><th>Risk</th><th>Joined</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={8} style={{textAlign:"center",padding:40,color:"rgba(255,255,255,0.25)"}}>No users match filters</td></tr> :
              filtered.map(u => (
                <tr key={u._id}>
                  <td style={{fontWeight:600,color:"#fff"}}>{u.firstName} {u.lastName}</td>
                  <td style={{color:"rgba(255,255,255,0.5)"}}>{u.email}</td>
                  <td style={{color:"rgba(255,255,255,0.4)"}}>{u.country||"—"}</td>
                  <td><span className={`badge ${u.kycStatus==="approved"?"bg":u.kycStatus==="pending"?"by":u.kycStatus==="rejected"?"br":"bw"}`}>{u.kycStatus||"none"}</span></td>
                  <td><span className="badge bb">{u.accountType||"investor"}</span></td>
                  <td><span className="badge bw">{u.role}</span></td>
                  <td><span className="badge bg">Low</span></td>
                  <td style={{color:"rgba(255,255,255,0.35)",fontSize:11}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminShell>
    </>
  );
}
