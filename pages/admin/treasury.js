import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";
export default function Treasury() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if(token) fetch("/api/admin/treasury", { headers:{ Authorization:"Bearer "+token } }).then(r=>r.json()).then(setData).finally(()=>setLoading(false)); }, [token]);
  const card = (l,v,c) => <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"16px 20px", flex:1, minWidth:140 }}><div style={{ fontSize:22, fontWeight:800, color:c }}>{v}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div></div>;
  const fb = data.feeBreakdown || {};
  return (
    <AdminShell title="Treasury & Revenue" subtitle="Platform finances, fee revenue, AUM.">
      {loading ? <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>Loading...</div> : <>
        <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
          {card("Total AUM", "EUR "+(data.aum||0).toLocaleString(), "#F0B90B")}
          {card("Total Balance", "EUR "+(data.totalBalance||0).toLocaleString(), "#22c55e")}
          {card("Locked", "EUR "+(data.lockedBalance||0).toLocaleString(), "#f59e0b")}
          {card("Fee Revenue", "EUR "+(data.totalFeeRevenue||0).toLocaleString(), "#8b5cf6")}
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
          {card("Total Deposits", "EUR "+(data.totalDeposits||0).toLocaleString(), "#3b82f6")}
          {card("Total Withdrawals", "EUR "+(data.totalWithdrawals||0).toLocaleString(), "#ef4444")}
          {card("Earnings Paid", "EUR "+(data.totalEarnings||0).toLocaleString(), "#22c55e")}
          {card("Wallets", data.walletCount||0, "#f59e0b")}
        </div>
        <h3 style={{ fontSize:14, fontWeight:700, color:"#F0B90B", marginBottom:12 }}>Fee Revenue Breakdown</h3>
        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20 }}>
          {[{l:"Trading Fees (0.5-1%)", v:fb.trading||0, c:"#3b82f6"}, {l:"Listing Fees", v:fb.listing||0, c:"#8b5cf6"}, {l:"Management Fees", v:fb.management||0, c:"#22c55e"}].map((r,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>{r.l}</span>
              <span style={{ fontSize:14, fontWeight:700, color:r.c }}>EUR {r.v.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </>}
    </AdminShell>
  );
}
