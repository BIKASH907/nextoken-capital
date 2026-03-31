import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import AutoLogout from "../components/AutoLogout";
import Navbar from "../components/Navbar";

const TABS = ["portfolio","bonds","orders","earnings","wallet","kyc","tax","notifications"];
const TAB_LABELS = { portfolio:"Portfolio", bonds:"Investments", orders:"Buy/Sell", earnings:"Earnings", wallet:"Wallet", kyc:"KYC", tax:"Tax Report", notifications:"Notifications" };

export default function InvestorDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tab, setTab] = useState("portfolio");
  const [wallet, setWallet] = useState(null);
  const [investments, setInvestments] = useState({ investments: [], stats: {} });
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState({ notifications: [], unread: 0 });
  const [taxData, setTaxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [depositAmt, setDepositAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadAll();
  }, [status]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [w, inv, ord, me, notif] = await Promise.all([
        fetch("/api/wallet").then(r => r.json()).catch(() => ({})),
        fetch("/api/investments/my").then(r => r.json()).catch(() => ({ investments: [], stats: {} })),
        fetch("/api/investments/orders").then(r => r.json()).catch(() => ({ orders: [] })),
        fetch("/api/user/me").then(r => r.json()).catch(() => ({})),
        fetch("/api/notifications").then(r => r.json()).catch(() => ({ notifications: [], unread: 0 })),
      ]);
      if (w.wallet) setWallet(w.wallet);
      setInvestments(inv);
      setOrders(ord.orders || []);
      if (me.user) setUser(me.user);
      setNotifications(notif);
    } catch(e) {} finally { setLoading(false); }
  };

  const loadTax = async () => {
    const year = new Date().getFullYear();
    const d = await fetch("/api/user/tax-report?year=" + year).then(r => r.json()).catch(() => null);
    setTaxData(d);
  };

  const doWallet = async (action, amount) => {
    if (!amount || Number(amount) <= 0) return;
    setMsg("");
    const r = await fetch("/api/wallet/deposit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: Number(amount), action }) });
    const d = await r.json();
    setMsg(r.ok ? d.message : d.error);
    setDepositAmt(""); setWithdrawAmt("");
    loadAll();
  };

  const doSell = async (inv) => {
    const u = prompt("Units to sell (max " + inv.units + "):");
    if (!u || Number(u) <= 0) return;
    const p = prompt("Price per unit (current: EUR " + inv.pricePerUnit + "):");
    const r = await fetch("/api/investments/sell", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ investmentId: inv._id, units: Number(u), pricePerUnit: Number(p) || inv.pricePerUnit }) });
    const d = await r.json();
    alert(r.ok ? d.message : d.error);
    loadAll();
  };

  const markRead = async (id) => {
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "mark_read", id }) });
    loadAll();
  };

  const st = investments.stats || {};
  const totalEarnings = investments.investments?.reduce((s, i) => s + (i.earnings?.reduce((es, e) => es + e.amount, 0) || 0), 0) || 0;

  const card = (l, v, c) => (
    <div style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"18px 22px", flex:1, minWidth:130 }}>
      <div style={{ fontSize:24, fontWeight:800, color:c }}>{v}</div>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{l}</div>
    </div>
  );

  const badge = (s) => {
    const c = { active:"#22c55e", matured:"#3b82f6", sold:"#f59e0b", pending:"#8b5cf6", completed:"#22c55e", failed:"#ef4444", cancelled:"#6b7280", processing:"#f59e0b" };
    return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:(c[s]||"#666")+"15", color:c[s]||"#666", fontWeight:700 }}>{s}</span>;
  };

  if (status === "loading" || loading) return <div style={{ minHeight:"100vh", background:"#0B0E11", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>Loading...</div>;

  return (
    <>
      <Head><title>Dashboard — Nextoken Capital</title></Head>
      <AutoLogout timeoutMs={86400000} isAdmin={false} />
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#0B0E11", color:"#fff", paddingTop:70 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
            <div>
              <h1 style={{ fontSize:24, fontWeight:800 }}>My Dashboard</h1>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>Welcome, {session?.user?.name || user?.firstName || "Investor"}</p>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {notifications.unread > 0 && <span style={{ background:"#ef4444", color:"#fff", borderRadius:12, padding:"2px 8px", fontSize:11, fontWeight:700 }}>{notifications.unread} new</span>}
              <button onClick={() => router.push("/change-password")} style={{ padding:"6px 14px", borderRadius:6, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Password</button>
              <button onClick={() => signOut({ callbackUrl:"/login" })} style={{ padding:"6px 14px", borderRadius:6, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", color:"#ef4444", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Sign Out</button>
            </div>
          </div>

          <div style={{ display:"flex", gap:4, marginBottom:24, overflowX:"auto", paddingBottom:8 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => { setTab(t); if(t==="tax" && !taxData) loadTax(); }} style={{ padding:"7px 16px", borderRadius:7, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", background:tab===t?"#F0B90B15":"rgba(255,255,255,0.04)", color:tab===t?"#F0B90B":"rgba(255,255,255,0.4)", border:tab===t?"1px solid #F0B90B30":"1px solid rgba(255,255,255,0.06)" }}>
                {TAB_LABELS[t]}{t==="notifications" && notifications.unread > 0 ? " (" + notifications.unread + ")" : ""}
              </button>
            ))}
          </div>

          {msg && <div style={{ background:"rgba(240,185,11,0.08)", border:"1px solid rgba(240,185,11,0.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#F0B90B", marginBottom:16 }}>{msg}</div>}

          {/* PORTFOLIO */}
          {tab === "portfolio" && <>
            <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
              {card("Total Purchased", "EUR " + (st.totalInvested||0).toLocaleString(), "#3b82f6")}
              {card("Active", st.active||0, "#22c55e")}
              {card("Earnings", "EUR " + totalEarnings.toLocaleString(), "#F0B90B")}
              {card("Wallet", "EUR " + (wallet?.available||0).toLocaleString(), "#8b5cf6")}
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              <button onClick={() => router.push("/marketplace")} style={{ padding:"8px 20px", borderRadius:7, background:"#F0B90B", color:"#000", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Browse Marketplace</button>
            </div>
            <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20 }}>
              {investments.investments?.length === 0 ? <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", padding:20 }}>No investments yet. Visit the marketplace to start.</div>
              : investments.investments?.map((inv, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", alignItems:"center" }}>
                  <div><div style={{ fontSize:14, fontWeight:600 }}>{inv.assetName}</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{inv.assetType} · {inv.tokens || inv.units} units · EUR {inv.tokenPrice || inv.pricePerUnit}/unit</div></div>
                  <div style={{ textAlign:"right", display:"flex", alignItems:"center", gap:8 }}>
                    <div><div style={{ fontSize:14, fontWeight:700, color:"#F0B90B" }}>EUR {(inv.amount || inv.totalInvested || 0).toLocaleString()}</div>{badge(inv.status)}</div>
                    {(inv.status === "active" || inv.status === "confirmed") && <button onClick={() => doSell(inv)} style={{ padding:"4px 10px", borderRadius:4, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:10, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Sell</button>}
                  </div>
                </div>
              ))}
            </div>
          </>}

          {/* INVESTMENTS */}
          {tab === "bonds" && <>
            <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"180px 70px 70px 100px 100px 70px 70px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                <span>Asset</span><span>Units</span><span>Yield</span><span>Invested</span><span>Maturity</span><span>Status</span><span>Action</span>
              </div>
              {investments.investments?.length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No investments</div>
              : investments.investments?.map((inv, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"180px 70px 70px 100px 100px 70px 70px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
                  <span style={{ fontWeight:600 }}>{inv.assetName}</span>
                  <span>{inv.tokens || inv.units}</span>
                  <span style={{ color:"#22c55e" }}>{inv.expectedROI || inv.yieldRate || 0}%</span>
                  <span style={{ fontWeight:600 }}>EUR {(inv.amount || inv.totalInvested || 0).toLocaleString()}</span>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{inv.maturityDate ? new Date(inv.maturityDate).toLocaleDateString() : "N/A"}</span>
                  {badge(inv.status)}
                  <div>{(inv.status === "active" || inv.status === "confirmed") && <button onClick={() => doSell(inv)} style={{ padding:"3px 8px", borderRadius:4, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:9, cursor:"pointer", fontFamily:"inherit" }}>Sell</button>}</div>
                </div>
              ))}
            </div>
          </>}

          {/* ORDERS */}
          {tab === "orders" && <>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <h3 style={{ fontSize:15, fontWeight:700 }}>Order History</h3>
              <button onClick={() => router.push("/marketplace")} style={{ padding:"6px 16px", borderRadius:6, background:"#F0B90B", color:"#000", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Buy Assets</button>
            </div>
            <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"70px 160px 70px 100px 100px 70px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                <span>Type</span><span>Asset</span><span>Units</span><span>Amount</span><span>Date</span><span>Status</span>
              </div>
              {orders.length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No orders</div>
              : orders.map((o, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"70px 160px 70px 100px 100px 70px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
                  <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:o.type==="buy"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", color:o.type==="buy"?"#22c55e":"#ef4444", fontWeight:700 }}>{o.type}</span>
                  <span style={{ fontWeight:600 }}>{o.assetName}</span>
                  <span>{o.units}</span>
                  <span>EUR {o.totalAmount?.toLocaleString()}</span>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{new Date(o.createdAt).toLocaleDateString()}</span>
                  {badge(o.status)}
                </div>
              ))}
            </div>
          </>}

          {/* EARNINGS */}
          {tab === "earnings" && <>
            <div style={{ display:"flex", gap:12, marginBottom:24 }}>
              {card("Total Earnings", "EUR " + totalEarnings.toLocaleString(), "#F0B90B")}
            </div>
            <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"180px 100px 100px 180px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                <span>Asset</span><span>Amount</span><span>Date</span><span>TX Hash</span>
              </div>
              {investments.investments?.flatMap(inv => (inv.earnings||[]).map(e => ({...e, assetName: inv.assetName}))).length === 0 ?
                <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No earnings yet</div>
              : investments.investments?.flatMap(inv => (inv.earnings||[]).map(e => ({...e, assetName: inv.assetName}))).map((e, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"180px 100px 100px 180px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
                  <span style={{ fontWeight:600 }}>{e.assetName}</span>
                  <span style={{ color:"#22c55e", fontWeight:700 }}>+EUR {e.amount?.toFixed(2)}</span>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{new Date(e.date).toLocaleDateString()}</span>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"monospace" }}>{e.txHash?.slice(0,20)}...</span>
                </div>
              ))}
            </div>
          </>}

          {/* WALLET */}
          {tab === "wallet" && <>
            <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap" }}>
              {card("Available", "EUR " + (wallet?.available||0).toLocaleString(), "#22c55e")}
              {card("Locked", "EUR " + (wallet?.locked||0).toLocaleString(), "#f59e0b")}
              {card("Earnings", "EUR " + (wallet?.earnings||0).toLocaleString(), "#F0B90B")}
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Connect your wallet (MetaMask, WalletConnect) to invest directly in assets. Non-custodial — your funds stay in your wallet.</div>
              <button onClick={() => router.push("/marketplace")} style={{ padding:"8px 16px", borderRadius:6, background:"rgba(240,185,11,0.08)", border:"1px solid rgba(240,185,11,0.15)", color:"#F0B90B", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Marketplace</button>
            </div>
            <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
              {(wallet?.transactions||[]).length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No transactions</div>
              : (wallet?.transactions||[]).map((t, i) => (
                <div key={i} style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div><div style={{ fontSize:13, fontWeight:600 }}>{t.description || t.type}</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{new Date(t.createdAt).toLocaleString()}{t.txHash ? " · " + t.txHash.slice(0,16) + "..." : ""}</div></div>
                  <div style={{ fontSize:14, fontWeight:700, color:["deposit","profit_distribution","sell"].includes(t.type)?"#22c55e":"#ef4444" }}>
                    {t.amount > 0 ? "+" : ""}EUR {Math.abs(t.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </>}

          {/* KYC */}
          {tab === "kyc" && <>
            <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:30, textAlign:"center" }}>
              {user?.kycStatus === "approved" ? <>
                <div style={{ fontSize:48 }}>✅</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#22c55e", marginTop:8 }}>KYC Verified</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>You can invest in all assets.</div>
              </> : <>
                <div style={{ fontSize:48 }}>🪪</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#f59e0b", marginTop:8 }}>Verification {user?.kycStatus === "pending" ? "Pending" : "Required"}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4, marginBottom:16 }}>Complete KYC to start investing.</div>
                <button onClick={() => router.push("/kyc")} style={{ padding:"10px 24px", background:"#F0B90B", color:"#000", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Start Verification</button>
              </>}
            </div>
          </>}

          {/* TAX */}
          {tab === "tax" && <>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>Tax Report — {new Date().getFullYear()}</h3>
            {!taxData ? <div style={{ textAlign:"center", padding:20, color:"rgba(255,255,255,0.3)" }}>Loading tax data...</div> : (
              <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20 }}>
                {[
                  { l: "Total Bought", v: "EUR " + (taxData.summary?.totalBought||0).toLocaleString() },
                  { l: "Total Sold", v: "EUR " + (taxData.summary?.totalSold||0).toLocaleString() },
                  { l: "Capital Gains", v: "EUR " + (taxData.summary?.capitalGains||0).toLocaleString(), c: (taxData.summary?.capitalGains||0) >= 0 ? "#22c55e" : "#ef4444" },
                  { l: "Earnings (Distributions)", v: "EUR " + (taxData.summary?.totalEarnings||0).toLocaleString(), c: "#F0B90B" },
                  { l: "Total Fees Paid", v: "EUR " + (taxData.summary?.totalFees||0).toLocaleString() },
                  { l: "Net Income", v: "EUR " + (taxData.summary?.netIncome||0).toLocaleString(), c: "#F0B90B" },
                ].map((r,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>{r.l}</span>
                    <span style={{ fontSize:14, fontWeight:700, color:r.c || "#fff" }}>{r.v}</span>
                  </div>
                ))}
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:12 }}>This is for informational purposes only. Consult a tax professional.</p>
              </div>
            )}
          </>}

          {/* NOTIFICATIONS */}
          {tab === "notifications" && <>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <h3 style={{ fontSize:15, fontWeight:700 }}>Notifications ({notifications.unread} unread)</h3>
              <button onClick={() => markRead()} style={{ padding:"6px 14px", borderRadius:6, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Mark all read</button>
            </div>
            <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
              {notifications.notifications?.length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No notifications</div>
              : notifications.notifications?.map((n, i) => (
                <div key={i} onClick={() => !n.read && markRead(n._id)} style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", background:n.read?"transparent":"rgba(240,185,11,0.03)", cursor:"pointer" }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:14, fontWeight:n.read?400:700 }}>{n.title}</span>
                    <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{n.message}</div>
                </div>
              ))}
            </div>
          </>}
        </div>
      </div>
    </>
  );
}
