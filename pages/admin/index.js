
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

const S = {
  page: { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  card: { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:24 },
  lbl:  { fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8" },
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      if (session.user.role !== "admin") { router.push("/dashboard"); return; }
      fetch("/api/admin/stats")
        .then(r => r.json())
        .then(d => { setStats(d); setLoading(false); });
    }
  }, [status, session]);

  if (loading) return (
    <div style={{ ...S.page, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:48, height:48, border:"3px solid rgba(240,185,11,0.2)", borderTop:"3px solid #F0B90B", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 16px" }} />
        <p style={{ color:"#8a9bb8" }}>Loading admin panel...</p>
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} body{margin:0} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth:1300, margin:"0 auto", padding:"32px 24px" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32, flexWrap:"wrap", gap:12 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:4 }}>Admin Panel</p>
            <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:28, fontWeight:800, color:"#e8e8f0", margin:0 }}>Nextoken Admin Dashboard</h1>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Link href="/admin/users" style={{ padding:"9px 18px", borderRadius:9, border:"1px solid rgba(255,255,255,0.1)", color:"#b0b0c8", textDecoration:"none", fontSize:13 }}>Manage Users</Link>
            <Link href="/admin/kyc" style={{ padding:"9px 18px", borderRadius:9, background:"rgba(245,158,11,0.12)", border:"1px solid rgba(245,158,11,0.3)", color:"#f59e0b", textDecoration:"none", fontSize:13, fontWeight:700 }}>
              KYC Queue {stats?.kycPending > 0 && <span style={{ marginLeft:6, background:"#f59e0b", color:"#000", borderRadius:10, padding:"1px 7px", fontSize:11, fontWeight:800 }}>{stats.kycPending}</span>}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:28 }}>
          {[
            { icon:"👥", l:"Total Users",       v:stats?.totalUsers       || 0, color:"#F0B90B"  },
            { icon:"⏳", l:"KYC Pending",       v:stats?.kycPending       || 0, color:"#f59e0b"  },
            { icon:"✅", l:"KYC Approved",      v:stats?.kycApproved      || 0, color:"#22c55e"  },
            { icon:"💰", l:"Total Investments", v:stats?.totalInvestments || 0, color:"#818cf8"  },
            { icon:"💶", l:"Total Volume",      v:"EUR "+(stats?.totalVolume||0).toLocaleString(), color:"#38bdf8" },
          ].map(s => (
            <div key={s.l} style={S.card}>
              <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:11, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>{s.l}</div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, color:s.color }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Recent Users */}
        <div style={S.card}>
          <p style={{ ...S.lbl, marginBottom:20 }}>Recent Registrations</p>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#12121c" }}>
                  {["Name","Email","Type","KYC Status","Country","Joined","Actions"].map(h => (
                    <th key={h} style={{ padding:"12px 16px", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"#8a9bb8", borderBottom:"1px solid rgba(255,255,255,0.07)", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(stats?.recentUsers || []).map(u => (
                  <tr key={u._id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"13px 16px", fontWeight:600, color:"#e8e8f0" }}>{u.firstName} {u.lastName}</td>
                    <td style={{ padding:"13px 16px", fontSize:13, color:"#8a9bb8" }}>{u.email}</td>
                    <td style={{ padding:"13px 16px" }}>
                      <span style={{ padding:"2px 8px", borderRadius:6, fontSize:11, background:"rgba(255,255,255,0.05)", color:"#8a9bb8", border:"1px solid rgba(255,255,255,0.08)" }}>{u.accountType}</span>
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600,
                        background: u.kycStatus==="approved"?"rgba(34,197,94,0.1)":u.kycStatus==="pending"?"rgba(245,158,11,0.1)":u.kycStatus==="rejected"?"rgba(239,68,68,0.1)":"rgba(255,255,255,0.05)",
                        color:      u.kycStatus==="approved"?"#22c55e":u.kycStatus==="pending"?"#f59e0b":u.kycStatus==="rejected"?"#ef4444":"#8a9bb8",
                        border:     "1px solid "+(u.kycStatus==="approved"?"rgba(34,197,94,0.25)":u.kycStatus==="pending"?"rgba(245,158,11,0.25)":"rgba(255,255,255,0.08)"),
                      }}>{u.kycStatus || "none"}</span>
                    </td>
                    <td style={{ padding:"13px 16px", fontSize:13, color:"#8a9bb8" }}>{u.country || "—"}</td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:"#8a9bb8" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding:"13px 16px" }}>
                      <Link href={"/admin/users/"+u._id} style={{ padding:"5px 12px", borderRadius:7, border:"1px solid rgba(240,185,11,0.3)", color:"#F0B90B", fontSize:12, fontWeight:600, textDecoration:"none" }}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
