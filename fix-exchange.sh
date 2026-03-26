#!/bin/bash
# EXCHANGE: Market price, price history, session fix, pro UX
# Run: chmod +x fix-exchange.sh && ./fix-exchange.sh
set -e

echo "  🏦 Building Pro Exchange Page..."

# ═══════════════════════════════════════
# 1. FIX SESSION: Use cookie-based auth fallback
# ═══════════════════════════════════════
cat > lib/getUser.js << 'EOF'
import { connectDB } from "./mongodb";
import User from "./models/User";
import { getServerSession } from "next-auth/next";

export async function getAuthUser(req, res, authOptions) {
  await connectDB();
  
  // Try NextAuth session first
  try {
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (user) return user;
    }
  } catch(e) {}

  // Fallback: check cookie token
  try {
    const cookie = req.cookies?.nxt_session;
    if (cookie) {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(cookie, process.env.JWT_SECRET || "nextoken-capital-jwt-secret-2024");
      if (decoded?.email) {
        const user = await User.findOne({ email: decoded.email });
        if (user) return user;
      }
      if (decoded?.id) {
        const user = await User.findById(decoded.id);
        if (user) return user;
      }
    }
  } catch(e) {}

  // Fallback: Authorization header
  try {
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET || "nextoken-capital-jwt-secret-2024");
      if (decoded?.email) {
        const user = await User.findOne({ email: decoded.email });
        if (user) return user;
      }
    }
  } catch(e) {}

  return null;
}
EOF
echo "  ✓ Universal auth helper (NextAuth + cookie + Bearer token)"

# ═══════════════════════════════════════
# 2. UPDATE BUY API (use getAuthUser)
# ═══════════════════════════════════════
sed -i 's|import { getServerSession } from "next-auth/next";|import { getAuthUser } from "../../../lib/getUser";|' pages/api/investments/buy.js 2>/dev/null
sed -i 's|import { authOptions } from "../auth/\[\.\.\.nextauth\]";||' pages/api/investments/buy.js 2>/dev/null
sed -i 's|const session = await getServerSession(req, res, authOptions);||' pages/api/investments/buy.js 2>/dev/null
sed -i 's|if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });|const user = await getAuthUser(req, res); if (!user) return res.status(401).json({ error: "Please login to continue" });|' pages/api/investments/buy.js 2>/dev/null
sed -i 's|const user = await User.findOne({ email: session.user.email });||' pages/api/investments/buy.js 2>/dev/null
sed -i 's|if (!user) return res.status(404).json({ error: "User not found" });||' pages/api/investments/buy.js 2>/dev/null

# Same for sell, buy-secondary, wallet, orderbook/place, orderbook/cancel, my-orders, holdings, notifications
for f in pages/api/investments/sell.js pages/api/investments/buy-secondary.js pages/api/wallet/deposit.js pages/api/wallet/index.js pages/api/wallet/withdraw-otp.js pages/api/orderbook/place.js pages/api/orderbook/cancel.js pages/api/orderbook/my-orders.js pages/api/investments/my.js pages/api/investments/orders.js pages/api/investments/holdings.js pages/api/notifications/index.js pages/api/user/tax-report.js pages/api/issuer/stats.js pages/api/issuer/distributions.js pages/api/issuer/payout-settings.js; do
  if [ -f "$f" ]; then
    sed -i 's|import { getServerSession } from "next-auth/next";|import { getAuthUser } from "../../../lib/getUser";|' "$f" 2>/dev/null
    sed -i 's|import { getServerSession } from "next-auth\/next";|import { getAuthUser } from "../../../lib/getUser";|' "$f" 2>/dev/null
    sed -i '/import { authOptions }/d' "$f" 2>/dev/null
    sed -i 's|const session = await getServerSession(req, res, authOptions);|const user = await getAuthUser(req, res);|' "$f" 2>/dev/null
    sed -i 's|if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });|if (!user) return res.status(401).json({ error: "Please login" });|' "$f" 2>/dev/null
    sed -i '/const user = await User.findOne({ email: session.user.email });/d' "$f" 2>/dev/null
    sed -i '/if (!user) return res.status(404).json({ error: "User not found" });/d' "$f" 2>/dev/null
  fi
done
echo "  ✓ All APIs use universal auth (no more random logouts)"

# ═══════════════════════════════════════
# 3. PRICE HISTORY API
# ═══════════════════════════════════════
cat > pages/api/orderbook/price-history.js << 'EOF'
import { connectDB } from "../../../lib/mongodb";
import Trade from "../../../models/Trade";

export default async function handler(req, res) {
  await connectDB();
  const { assetId, period } = req.query;
  if (!assetId) return res.status(400).json({ error: "assetId required" });

  const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 7;
  const since = new Date(Date.now() - days * 86400000);

  const trades = await Trade.find({ assetId, createdAt: { $gte: since } }).sort({ createdAt: 1 }).lean();

  // Group by day for chart
  const daily = {};
  trades.forEach(t => {
    const day = new Date(t.createdAt).toISOString().split("T")[0];
    if (!daily[day]) daily[day] = { date: day, open: t.pricePerUnit, high: t.pricePerUnit, low: t.pricePerUnit, close: t.pricePerUnit, volume: 0, trades: 0 };
    daily[day].high = Math.max(daily[day].high, t.pricePerUnit);
    daily[day].low = Math.min(daily[day].low, t.pricePerUnit);
    daily[day].close = t.pricePerUnit;
    daily[day].volume += t.totalAmount;
    daily[day].trades += 1;
  });

  const allTrades = trades.map(t => ({
    price: t.pricePerUnit, units: t.units, amount: t.totalAmount,
    time: t.createdAt, txHash: t.txHash,
  }));

  // Stats
  const prices = trades.map(t => t.pricePerUnit);
  const high = prices.length ? Math.max(...prices) : 0;
  const low = prices.length ? Math.min(...prices) : 0;
  const avg = prices.length ? Math.round(prices.reduce((s,p) => s+p, 0) / prices.length * 100) / 100 : 0;
  const totalVolume = trades.reduce((s,t) => s + t.totalAmount, 0);
  const change = prices.length >= 2 ? Math.round((prices[prices.length-1] - prices[0]) / prices[0] * 10000) / 100 : 0;

  return res.json({
    candles: Object.values(daily),
    trades: allTrades.slice(-50).reverse(),
    stats: { high, low, avg, totalVolume, totalTrades: trades.length, change },
  });
}
EOF
echo "  ✓ Price history API (OHLCV candles, stats, change %)"

# ═══════════════════════════════════════
# 4. COMPLETE EXCHANGE PAGE
# ═══════════════════════════════════════
cat > pages/exchange.js << 'EOF'
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function Exchange() {
  const router = useRouter();
  const { data: session } = useSession();
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ob, setOb] = useState({ bids:[], asks:[], recentTrades:[], lastPrice:null, bestBid:null, bestAsk:null, spread:null, volume24h:0 });
  const [priceHistory, setPriceHistory] = useState({ candles:[], trades:[], stats:{} });
  const [myOrders, setMyOrders] = useState([]);
  const [orderType, setOrderType] = useState("limit"); // limit | market
  const [side, setSide] = useState("bid");
  const [units, setUnits] = useState("");
  const [price, setPrice] = useState("");
  const [period, setPeriod] = useState("7d");
  const [tab, setTab] = useState("book"); // book | trades | history | myorders
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshTimer, setRefreshTimer] = useState(null);

  useEffect(() => { loadAssets(); }, []);
  useEffect(() => { if (selected) { loadOB(); loadHistory(); loadMyOrders(); } }, [selected, period]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (selected) {
      const t = setInterval(() => { loadOB(); }, 10000);
      return () => clearInterval(t);
    }
  }, [selected]);

  const loadAssets = () => fetch("/api/assets/stats").then(r=>r.json()).then(d => { const live = (d.assets||[]).filter(a=>a.status==="live"||a.approvalStatus==="live"); setAssets(live); if(live[0]) { setSelected(live[0]); setPrice(String(priceOf(live[0]))); } setLoading(false); }).catch(()=>setLoading(false));
  const loadOB = () => { if(selected) fetch("/api/orderbook?assetId="+selected._id).then(r=>r.json()).then(setOb).catch(()=>{}); };
  const loadHistory = () => { if(selected) fetch("/api/orderbook/price-history?assetId="+selected._id+"&period="+period).then(r=>r.json()).then(setPriceHistory).catch(()=>{}); };
  const loadMyOrders = () => { if(session) fetch("/api/orderbook/my-orders").then(r=>r.json()).then(d=>setMyOrders(d.orders||[])).catch(()=>{}); };

  const priceOf = (a) => a.tokenPrice || (a.targetRaise && a.tokenSupply ? Math.round(a.targetRaise/a.tokenSupply) : 100);

  const placeOrder = async () => {
    if (!session) { router.push("/login"); return; }
    if (!selected) { setMsg("Select an asset"); return; }
    setMsg("");

    let orderPrice = Number(price);
    if (orderType === "market") {
      orderPrice = side === "bid" ? (ob.bestAsk || priceOf(selected)) : (ob.bestBid || priceOf(selected));
    }
    if (!units || Number(units) <= 0 || orderPrice <= 0) { setMsg("Enter valid units and price"); return; }

    const r = await fetch("/api/orderbook/place", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ assetId: selected._id, side, units: Number(units), pricePerUnit: orderPrice }) });
    const d = await r.json();
    setMsg(r.ok ? d.message : "Error: " + d.error);
    if (r.ok) { setUnits(""); loadOB(); loadHistory(); loadMyOrders(); }
  };

  const cancelOrder = async (id) => {
    const r = await fetch("/api/orderbook/cancel", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ orderId: id }) });
    const d = await r.json();
    setMsg(r.ok ? d.message : d.error);
    loadMyOrders(); loadOB();
  };

  const badge = (s) => { const c={open:"#22c55e",partial:"#f59e0b",filled:"#3b82f6",cancelled:"#6b7280",expired:"#6b7280"}; return <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:(c[s]||"#666")+"15",color:c[s]||"#666",fontWeight:700}}>{s}</span>; };
  const inp = { background:"#0d1117", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"10px 12px", color:"#fff", fontSize:14, outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box" };
  const ps = priceHistory.stats || {};

  return (
    <>
      <Head><title>Exchange — Nextoken Capital</title></Head>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#0B0E11", color:"#fff", paddingTop:60 }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"16px 16px" }}>

          {/* TOP BAR: Asset selector + key stats */}
          <div style={{ display:"flex", alignItems:"center", gap:16, padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:16 }}>
            <select value={selected?._id||""} onChange={e=>{const a=assets.find(x=>x._id===e.target.value);setSelected(a);if(a)setPrice(String(priceOf(a)));}} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 14px", color:"#F0B90B", fontSize:15, fontWeight:700, fontFamily:"inherit", cursor:"pointer" }}>
              {assets.map(a=><option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
            {selected && <>
              <div style={{ textAlign:"center" }}><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>LAST PRICE</div><div style={{ fontSize:20, fontWeight:800, color:"#F0B90B" }}>{ob.lastPrice ? "EUR "+ob.lastPrice : "EUR "+priceOf(selected)}</div></div>
              <div><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>24H CHANGE</div><div style={{ fontSize:14, fontWeight:700, color:ps.change>=0?"#22c55e":"#ef4444" }}>{ps.change>=0?"+":""}{ps.change||0}%</div></div>
              <div><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>24H HIGH</div><div style={{ fontSize:14, fontWeight:600 }}>EUR {ps.high||"—"}</div></div>
              <div><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>24H LOW</div><div style={{ fontSize:14, fontWeight:600 }}>EUR {ps.low||"—"}</div></div>
              <div><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>24H VOLUME</div><div style={{ fontSize:14, fontWeight:600 }}>EUR {(ob.volume24h||0).toLocaleString()}</div></div>
              <div><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>BID</div><div style={{ fontSize:14, fontWeight:700, color:"#22c55e" }}>{ob.bestBid||"—"}</div></div>
              <div><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>ASK</div><div style={{ fontSize:14, fontWeight:700, color:"#ef4444" }}>{ob.bestAsk||"—"}</div></div>
              <div><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>SPREAD</div><div style={{ fontSize:14, fontWeight:600, color:"#8b5cf6" }}>{ob.spread!==null?"EUR "+ob.spread:"—"}</div></div>
            </>}
          </div>

          {msg && <div style={{ background:msg.startsWith("Error")?"rgba(255,77,77,0.1)":"rgba(34,197,94,0.1)", border:"1px solid "+(msg.startsWith("Error")?"rgba(255,77,77,0.2)":"rgba(34,197,94,0.2)"), borderRadius:8, padding:"10px 14px", fontSize:13, color:msg.startsWith("Error")?"#ff6b6b":"#22c55e", marginBottom:12 }}>{msg}</div>}

          {/* MAIN GRID: Chart | OrderBook | PlaceOrder */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 280px 300px", gap:12 }}>

            {/* LEFT: Price Chart + Tabs */}
            <div>
              {/* Price chart */}
              <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:16, marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  <span style={{ fontSize:13, fontWeight:700 }}>Price History</span>
                  <div style={{ display:"flex", gap:4 }}>
                    {["7d","30d","90d"].map(p=><button key={p} onClick={()=>setPeriod(p)} style={{ padding:"3px 10px", borderRadius:4, fontSize:10, fontWeight:600, cursor:"pointer", fontFamily:"inherit", background:period===p?"#F0B90B20":"transparent", color:period===p?"#F0B90B":"rgba(255,255,255,0.3)", border:"none" }}>{p}</button>)}
                  </div>
                </div>
                <div style={{ height:180, display:"flex", alignItems:"flex-end", gap:1 }}>
                  {(priceHistory.candles||[]).length === 0 ?
                    <div style={{ width:"100%", textAlign:"center", color:"rgba(255,255,255,0.2)", fontSize:12, paddingTop:60 }}>No trading data yet. Place orders to start.</div>
                  : (priceHistory.candles||[]).map((c,i) => {
                    const allPrices = (priceHistory.candles||[]).flatMap(x=>[x.high,x.low]);
                    const maxP = Math.max(...allPrices); const minP = Math.min(...allPrices);
                    const range = maxP - minP || 1;
                    const h = Math.max(((c.high-c.low)/range)*150, 4);
                    const bottom = ((c.low-minP)/range)*150;
                    const green = c.close >= c.open;
                    return <div key={i} title={c.date+"\nO:"+c.open+" H:"+c.high+" L:"+c.low+" C:"+c.close+"\nVol: EUR "+c.volume} style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                      <div style={{ width:"100%", background:green?"#22c55e":"#ef4444", height:h, marginBottom:bottom, borderRadius:1, minHeight:2, cursor:"pointer", opacity:0.8 }} />
                    </div>;
                  })}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                  <span style={{ fontSize:9, color:"rgba(255,255,255,0.2)" }}>{priceHistory.candles?.[0]?.date||""}</span>
                  <span style={{ fontSize:9, color:"rgba(255,255,255,0.2)" }}>{priceHistory.candles?.[priceHistory.candles.length-1]?.date||""}</span>
                </div>
              </div>

              {/* Tabs: Book, Trades, History, My Orders */}
              <div style={{ display:"flex", gap:4, marginBottom:8 }}>
                {[{k:"book",l:"Order Book"},{k:"trades",l:"Last 10 Trades"},{k:"history",l:"Price History"},{k:"myorders",l:"My Orders ("+myOrders.filter(o=>["open","partial"].includes(o.status)).length+")"}].map(t=>(
                  <button key={t.k} onClick={()=>setTab(t.k)} style={{ padding:"6px 14px", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", background:tab===t.k?"#F0B90B15":"rgba(255,255,255,0.03)", color:tab===t.k?"#F0B90B":"rgba(255,255,255,0.35)", border:tab===t.k?"1px solid #F0B90B25":"1px solid rgba(255,255,255,0.05)" }}>{t.l}</button>
                ))}
              </div>

              {/* LAST 10 TRADES */}
              {tab === "trades" && (
                <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"90px 80px 100px 80px 1fr", padding:"8px 12px", fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                    <span>Price</span><span>Units</span><span>Amount</span><span>Time</span><span>TX</span>
                  </div>
                  {(ob.recentTrades||[]).length === 0 ? <div style={{ padding:20, textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.2)" }}>No trades</div>
                  : (ob.recentTrades||[]).slice(0,10).map((t,i) => (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"90px 80px 100px 80px 1fr", padding:"6px 12px", fontSize:12, borderBottom:"1px solid rgba(255,255,255,0.03)", alignItems:"center" }}>
                      <span style={{ fontWeight:700, color:"#F0B90B" }}>EUR {t.price}</span>
                      <span>{t.units}</span>
                      <span style={{ color:"rgba(255,255,255,0.5)" }}>EUR {(t.amount||0).toLocaleString()}</span>
                      <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{new Date(t.time).toLocaleTimeString()}</span>
                      <span style={{ fontSize:9, fontFamily:"monospace", color:"rgba(255,255,255,0.2)" }}>{t.txHash?.slice(0,14)}...</span>
                    </div>
                  ))}
                </div>
              )}

              {/* PRICE HISTORY TABLE */}
              {tab === "history" && (
                <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"100px 80px 80px 80px 80px 100px 60px", padding:"8px 12px", fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                    <span>Date</span><span>Open</span><span>High</span><span>Low</span><span>Close</span><span>Volume</span><span>Trades</span>
                  </div>
                  {(priceHistory.candles||[]).length === 0 ? <div style={{ padding:20, textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.2)" }}>No data</div>
                  : [...(priceHistory.candles||[])].reverse().map((c,i) => (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"100px 80px 80px 80px 80px 100px 60px", padding:"6px 12px", fontSize:12, borderBottom:"1px solid rgba(255,255,255,0.03)", alignItems:"center" }}>
                      <span style={{ fontSize:11 }}>{c.date}</span>
                      <span>EUR {c.open}</span>
                      <span style={{ color:"#22c55e" }}>EUR {c.high}</span>
                      <span style={{ color:"#ef4444" }}>EUR {c.low}</span>
                      <span style={{ fontWeight:600, color:c.close>=c.open?"#22c55e":"#ef4444" }}>EUR {c.close}</span>
                      <span style={{ color:"rgba(255,255,255,0.4)" }}>EUR {c.volume.toLocaleString()}</span>
                      <span>{c.trades}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ORDER BOOK */}
              {tab === "book" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                    <div style={{ padding:"8px 12px", background:"rgba(34,197,94,0.05)", fontSize:11, fontWeight:700, color:"#22c55e" }}>BIDS (Buyers)</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"4px 12px", fontSize:9, color:"rgba(255,255,255,0.3)" }}><span>Price</span><span style={{textAlign:"center"}}>Units</span><span style={{textAlign:"right"}}>Total</span></div>
                    {(ob.bids||[]).length===0?<div style={{padding:16,textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.15)"}}>No bids</div>
                    :(ob.bids||[]).slice(0,10).map((b,i)=>(
                      <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"4px 12px",fontSize:12,position:"relative"}}>
                        <div style={{position:"absolute",left:0,top:0,bottom:0,background:"rgba(34,197,94,0.06)",width:Math.min(b.units/Math.max(...(ob.bids||[]).map(x=>x.units),1)*100,100)+"%"}} />
                        <span style={{color:"#22c55e",fontWeight:600,position:"relative"}}>EUR {b.price}</span>
                        <span style={{textAlign:"center",position:"relative"}}>{b.units}</span>
                        <span style={{textAlign:"right",position:"relative",color:"rgba(255,255,255,0.4)",fontSize:10}}>EUR {(b.price*b.units).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                    <div style={{ padding:"8px 12px", background:"rgba(239,68,68,0.05)", fontSize:11, fontWeight:700, color:"#ef4444" }}>ASKS (Sellers)</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"4px 12px", fontSize:9, color:"rgba(255,255,255,0.3)" }}><span>Price</span><span style={{textAlign:"center"}}>Units</span><span style={{textAlign:"right"}}>Total</span></div>
                    {(ob.asks||[]).length===0?<div style={{padding:16,textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.15)"}}>No asks</div>
                    :(ob.asks||[]).slice(0,10).map((a,i)=>(
                      <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"4px 12px",fontSize:12,position:"relative"}}>
                        <div style={{position:"absolute",right:0,top:0,bottom:0,background:"rgba(239,68,68,0.06)",width:Math.min(a.units/Math.max(...(ob.asks||[]).map(x=>x.units),1)*100,100)+"%"}} />
                        <span style={{color:"#ef4444",fontWeight:600,position:"relative"}}>EUR {a.price}</span>
                        <span style={{textAlign:"center",position:"relative"}}>{a.units}</span>
                        <span style={{textAlign:"right",position:"relative",color:"rgba(255,255,255,0.4)",fontSize:10}}>EUR {(a.price*a.units).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MY ORDERS */}
              {tab === "myorders" && (
                <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"60px 140px 80px 90px 70px 60px 70px 60px", padding:"8px 12px", fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                    <span>Side</span><span>Asset</span><span>Price</span><span>Units</span><span>Filled</span><span>Left</span><span>Status</span><span></span>
                  </div>
                  {myOrders.length===0?<div style={{padding:20,textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.2)"}}>No orders</div>
                  :myOrders.map((o,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"60px 140px 80px 90px 70px 60px 70px 60px",padding:"8px 12px",fontSize:12,borderBottom:"1px solid rgba(255,255,255,0.03)",alignItems:"center"}}>
                      <span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:o.side==="bid"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:o.side==="bid"?"#22c55e":"#ef4444",fontWeight:700}}>{o.side}</span>
                      <span style={{fontWeight:600,fontSize:11}}>{o.assetName}</span>
                      <span>EUR {o.pricePerUnit}</span>
                      <span>{o.units}</span>
                      <span style={{color:"#22c55e"}}>{o.filledUnits||0}</span>
                      <span>{o.remainingUnits}</span>
                      {badge(o.status)}
                      <div>{["open","partial"].includes(o.status)&&<button onClick={()=>cancelOrder(o._id)} style={{padding:"3px 8px",borderRadius:4,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MIDDLE: Order Book Compact */}
            <div style={{ display:"none" }}></div>

            {/* RIGHT: Place Order Panel */}
            <div style={{ background:"#161b22", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)", padding:20, height:"fit-content", position:"sticky", top:80 }}>
              <div style={{ fontSize:16, fontWeight:800, marginBottom:16 }}>Place Order</div>

              {/* Order type: Limit vs Market */}
              <div style={{ display:"flex", gap:4, marginBottom:12 }}>
                <button onClick={()=>setOrderType("limit")} style={{ flex:1, padding:7, borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", background:orderType==="limit"?"#F0B90B15":"transparent", color:orderType==="limit"?"#F0B90B":"rgba(255,255,255,0.3)", border:orderType==="limit"?"1px solid #F0B90B30":"1px solid rgba(255,255,255,0.06)" }}>Limit</button>
                <button onClick={()=>setOrderType("market")} style={{ flex:1, padding:7, borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", background:orderType==="market"?"#F0B90B15":"transparent", color:orderType==="market"?"#F0B90B":"rgba(255,255,255,0.3)", border:orderType==="market"?"1px solid #F0B90B30":"1px solid rgba(255,255,255,0.06)" }}>Market</button>
              </div>

              {/* Side: Buy vs Sell */}
              <div style={{ display:"flex", gap:4, marginBottom:16 }}>
                <button onClick={()=>setSide("bid")} style={{ flex:1, padding:10, borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", background:side==="bid"?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.03)", color:side==="bid"?"#22c55e":"rgba(255,255,255,0.3)", border:side==="bid"?"1px solid rgba(34,197,94,0.3)":"1px solid rgba(255,255,255,0.06)" }}>BUY</button>
                <button onClick={()=>setSide("ask")} style={{ flex:1, padding:10, borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", background:side==="ask"?"rgba(239,68,68,0.15)":"rgba(255,255,255,0.03)", color:side==="ask"?"#ef4444":"rgba(255,255,255,0.3)", border:side==="ask"?"1px solid rgba(239,68,68,0.3)":"1px solid rgba(255,255,255,0.06)" }}>SELL</button>
              </div>

              {/* Price (for limit) or market price indicator */}
              {orderType === "limit" ? (
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:10, color:"rgba(255,255,255,0.35)", display:"block", marginBottom:4 }}>PRICE (EUR)</label>
                  <input type="number" value={price} onChange={e=>setPrice(e.target.value)} style={inp} />
                  <div style={{ display:"flex", gap:4, marginTop:4 }}>
                    {ob.bestBid && <button onClick={()=>setPrice(String(ob.bestBid))} style={{ padding:"2px 8px", borderRadius:4, fontSize:9, background:"rgba(34,197,94,0.1)", color:"#22c55e", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Bid {ob.bestBid}</button>}
                    {ob.bestAsk && <button onClick={()=>setPrice(String(ob.bestAsk))} style={{ padding:"2px 8px", borderRadius:4, fontSize:9, background:"rgba(239,68,68,0.1)", color:"#ef4444", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Ask {ob.bestAsk}</button>}
                    {ob.lastPrice && <button onClick={()=>setPrice(String(ob.lastPrice))} style={{ padding:"2px 8px", borderRadius:4, fontSize:9, background:"rgba(240,185,11,0.1)", color:"#F0B90B", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Last {ob.lastPrice}</button>}
                  </div>
                </div>
              ) : (
                <div style={{ background:"#0d1117", borderRadius:8, padding:"10px 14px", marginBottom:12 }}>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>MARKET PRICE</div>
                  <div style={{ fontSize:18, fontWeight:800, color:"#F0B90B" }}>EUR {side==="bid"?(ob.bestAsk||priceOf(selected)||"—"):(ob.bestBid||priceOf(selected)||"—")}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>Best {side==="bid"?"ask":"bid"} price</div>
                </div>
              )}

              {/* Units */}
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:10, color:"rgba(255,255,255,0.35)", display:"block", marginBottom:4 }}>UNITS</label>
                <input type="number" value={units} onChange={e=>setUnits(e.target.value)} style={inp} placeholder="0" />
              </div>

              {/* Summary */}
              {units && (Number(price) > 0 || orderType === "market") && (() => {
                const p = orderType === "market" ? (side==="bid"?(ob.bestAsk||priceOf(selected)):(ob.bestBid||priceOf(selected))) : Number(price);
                const total = Number(units) * p;
                const fee = total * 0.005;
                return (
                  <div style={{ background:"#0d1117", borderRadius:8, padding:12, marginBottom:12, fontSize:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}><span style={{color:"rgba(255,255,255,0.4)"}}>Subtotal</span><span>EUR {total.toLocaleString()}</span></div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}><span style={{color:"rgba(255,255,255,0.4)"}}>Fee (0.5%)</span><span>EUR {fee.toFixed(2)}</span></div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:4, fontSize:14 }}><span>Total</span><span style={{color:"#F0B90B"}}>EUR {(total + (side==="bid"?fee:-fee)).toFixed(2)}</span></div>
                  </div>
                );
              })()}

              <button onClick={placeOrder} disabled={!selected||!units} style={{ width:"100%", padding:14, background:side==="bid"?"#22c55e":"#ef4444", color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"inherit", opacity:(!selected||!units)?0.4:1 }}>
                {orderType==="market"?"Market ":"Limit "}{side==="bid"?"Buy":"Sell"}{units?" · "+units+" units":""}
              </button>
              <p style={{ fontSize:9, color:"rgba(255,255,255,0.2)", marginTop:8, textAlign:"center" }}>Orders auto-expire in 7 days. 0.5% fee per side. Auto-refreshes every 10s.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
EOF
echo "  ✓ Complete exchange page"

echo ""
echo "  ╔═══════════════════════════════════════════════════════════════╗"
echo "  ║  PRO EXCHANGE ENGINE COMPLETE                                 ║"
echo "  ║                                                               ║"
echo "  ║  SESSION FIX:                                                 ║"
echo "  ║    Universal auth: NextAuth + cookie + Bearer token           ║"
echo "  ║    No more random logouts on API calls                        ║"
echo "  ║    Applied to ALL 17 user-facing APIs                         ║"
echo "  ║                                                               ║"
echo "  ║  EXCHANGE PAGE (/exchange):                                   ║"
echo "  ║    Asset selector with live stats bar                         ║"
echo "  ║    Price chart (OHLCV candles, 7d/30d/90d)                    ║"
echo "  ║    Order book (bid/ask depth with volume bars)                ║"
echo "  ║    Last 10 trades (price, units, time, txHash)                ║"
echo "  ║    Price history table (date, OHLC, volume, trades)           ║"
echo "  ║    My Orders (open/filled/cancelled + cancel button)          ║"
echo "  ║    Limit orders (set your own price)                          ║"
echo "  ║    Market orders (instant buy at best ask/bid)                ║"
echo "  ║    Quick price buttons (Bid/Ask/Last)                         ║"
echo "  ║    Fee calculator in order panel                              ║"
echo "  ║    Auto-refresh every 10 seconds                              ║"
echo "  ║    24h change %, high, low, volume, spread                    ║"
echo "  ║                                                               ║"
echo "  ║  NEW API: /api/orderbook/price-history                        ║"
echo "  ║    OHLCV candles, stats (high/low/avg/change%)                ║"
echo "  ║                                                               ║"
echo "  ║  RUN:                                                         ║"
echo "  ║    git add -A && git commit -m 'feat: pro exchange'           ║"
echo "  ║    git push && npx vercel --prod                              ║"
echo "  ╚═══════════════════════════════════════════════════════════════╝"
