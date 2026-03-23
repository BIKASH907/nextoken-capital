import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../components/AdminSidebar";
export default function UsersPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
  }, []);
  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.users) setUsers(d.users); });
  }, [token]);
  const filtered = filter === "all" ? users : users.filter(u => u.kycStatus === filter);
  if (!mounted) return <div style={{background:"#0B0E11",minHeight:"100vh"}} />;
  return (
    <>
      <Head><title>Users — Admin</title></Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#0B0E11;color:#fff;font-family:'DM Sans',system-ui,sans-serif}.main{margin-left:220px;padding:32px;min-height:100vh}.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}.badge-green{background:rgba(14,203,129,0.12);color:#0ECB81}.badge-yellow{background:rgba(240,185,11,0.12);color:#F0B90B}.badge-red{background:rgba(255,77,77,0.12);color:#ff6b6b}.badge-gray{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}.card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px}.filter-bar{display:flex;gap:8px;margin-bottom:20px}.fb{padding:6px 16px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,0.1);background:none;color:rgba(255,255,255,0.5)}.fb.active{background:rgba(240,185,11,0.1);color:#F0B90B;border-color:rgba(240,185,11,0.3)}table{width:100%;border-collapse:collapse}th{text-align:left;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;padding:0 0 12px;font-weight:700}td{padding:12px 0;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:middle}tr:last-child td{border:none}.empty{text-align:center;padding:40px;color:rgba(255,255,255,0.3)}`}</style>
      <AdminSidebar />
      <div className="main">
        <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Users</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:24}}>{users.length} registered investors</div>
        <div className="filter-bar">
          {["all","none","pending","approved","rejected"].map(f => (
            <button key={f} className={`fb${filter===f?" active":""}`} onClick={() => setFilter(f)}>
              {f === "none" ? "No KYC" : f.charAt(0).toUpperCase()+f.slice(1)} ({f==="all"?users.length:users.filter(u=>u.kycStatus===(f==="none"?"none":f)).length})
            </button>
          ))}
        </div>
        <div className="card">
          {filtered.length === 0 ? <div className="empty">No users found</div> : (
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Country</th><th>KYC</th><th>Role</th><th>Joined</th></tr></thead>
              <tbody>{filtered.map(u => (
                <tr key={u._id} style={{cursor:"pointer"}} onClick={() => router.push("/admin/kyc")}>
                  <td style={{fontWeight:600}}>{u.firstName} {u.lastName}</td>
                  <td style={{color:"rgba(255,255,255,0.6)"}}>{u.email}</td>
                  <td style={{color:"rgba(255,255,255,0.5)"}}>{u.country || "N/A"}</td>
                  <td><span className={`badge badge-${u.kycStatus==="approved"?"green":u.kycStatus==="pending"?"yellow":u.kycStatus==="rejected"?"red":"gray"}`}>{u.kycStatus || "none"}</span></td>
                  <td><span className="badge badge-gray">{u.role}</span></td>
                  <td style={{color:"rgba(255,255,255,0.4)"}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
