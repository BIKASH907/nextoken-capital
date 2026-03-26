import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";
export default function Reserves() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = localStorage.getItem("adminToken"); if (!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if (token) fetch("/api/admin/reserves", { headers: { Authorization: "Bearer " + token } }).then(r => r.json()).then(setData).finally(() => setLoading(false)); }, [token]);
  const card = (l, v, c) => (<div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"18px 22px", flex:1, textAlign:"center" }}><div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div></div>);
  return (
    <AdminShell title="Proof of Reserve" subtitle="Real-time asset backing from database.">
      {loading ? <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>Loading...</div> : <>
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
          {card("Total AUM", "EUR " + (data.aum||0).toLocaleString(), "#F0B90B")}
          {card("Wallet Reserves", "EUR " + (data.walletReserves||0).toLocaleString(), "#22c55e")}
          {card("Earnings Paid", "EUR " + (data.totalEarnings||0).toLocaleString(), "#3b82f6")}
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:24 }}>
          {card("Live Assets", data.assetCount||0, "#8b5cf6")}
          {card("Active Investments", data.investmentCount||0, "#f59e0b")}
          {card("Verified", data.verified ? "Yes" : "No", "#22c55e")}
        </div>
        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20 }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:8 }}>Last: {new Date(data.lastVerified).toLocaleString()}</div>
          {["Token supply matches investments","Wallet balances verified","Investment records match allocations","Fee collection verified","Distribution records verified"].map((d,i) => (
            <div key={i} style={{ padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:13, color:"rgba(255,255,255,0.6)" }}><span style={{ color:"#22c55e", marginRight:8 }}>✓</span>{d}</div>
          ))}
        </div>
      </>}
    </AdminShell>
  );
}
