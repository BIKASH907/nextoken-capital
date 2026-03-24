import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { router.push("/admin/login"); return; }
    fetch("/api/admin/users", { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => { if (d.users) setUsers(d.users); });
  }, [router]);

  const filtered = users.filter(u =>
    !search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head><title>Users — Admin</title></Head>
      <AdminShell title="User Management" subtitle={`${users.length} registered users`}>
        <style>{`
          .u-search{width:320px;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;font-size:13px;color:#fff;outline:none;font-family:inherit;margin-bottom:16px}
          .u-search:focus{border-color:rgba(240,185,11,0.4)}
          .u-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden}
          .u-table{width:100%;border-collapse:collapse}
          .u-table th{text-align:left;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px;padding:12px 16px;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);background:#161B22}
          .u-table td{padding:12px 16px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.04)}
          .u-table tr:hover td{background:rgba(255,255,255,0.02)}
          .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
          .badge-green{background:rgba(14,203,129,0.12);color:#0ECB81}
          .badge-yellow{background:rgba(240,185,11,0.12);color:#F0B90B}
          .badge-red{background:rgba(255,77,77,0.12);color:#ff6b6b}
          .badge-gray{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.5)}
          .badge-blue{background:rgba(88,101,242,0.12);color:#818cf8}
        `}</style>

        <input className="u-search" placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)} />

        <div className="u-card">
          <table className="u-table">
            <thead><tr><th>Name</th><th>Email</th><th>Country</th><th>KYC</th><th>Type</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td style={{fontWeight:600,color:"#fff"}}>{u.firstName} {u.lastName}</td>
                  <td style={{color:"rgba(255,255,255,0.5)"}}>{u.email}</td>
                  <td style={{color:"rgba(255,255,255,0.4)"}}>{u.country||"N/A"}</td>
                  <td><span className={`badge badge-${u.kycStatus==="approved"?"green":u.kycStatus==="pending"?"yellow":u.kycStatus==="rejected"?"red":"gray"}`}>{u.kycStatus||"none"}</span></td>
                  <td><span className="badge badge-blue">{u.accountType||"investor"}</span></td>
                  <td><span className="badge badge-gray">{u.role}</span></td>
                  <td style={{color:"rgba(255,255,255,0.35)"}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminShell>
    </>
  );
}
