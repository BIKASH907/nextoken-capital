import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function Marketplace() {
  const router = useRouter();
  const { data: session } = useSession();
  const [tab, setTab] = useState("assets");
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [orderBook, setOrderBook] = useState({ bids:[], asks:[], recentTrades:[] });
  const [myOrders, setMyOrders] = useState([]);
  const [side, setSide] = useState("bid");
  const [units, setUnits] = useState("");
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAssets(); loadMyOrders(); }, []);
  useEffect(() => { if (selectedAsset) loadOrderBook(selectedAsset._id); }, [selectedAsset]);

  const loadAssets = () => fetch("/api/assets/stats").then(r => r.json()).then(d => { setAssets((d.assets||[]).filter(a => a.status === "live" || a.approvalStatus === "live")); setLoading(false); }).catch(() => setLoading(false));
  const loadOrderBook = (id) => fetch("/api/orderbook?assetId=" + id).then(r => r.json()).then(setOrderBook).catch(() => {});
  const loadMyOrders = () => { if (session) fetch("/api/orderbook/my-orders").then(r => r.json()).then(d => setMyOrders(d.orders || [])).catch(() => {}); };

  const placeOrder = async () => {
    if (!session) { router.push("/login"); return; }
    if (!selectedAsset || !units || !price) { setMsg("Select asset, units, and price"); return; }
    setMsg("");
    const r = await fetch("/api/orderbook/place", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId: selectedAsset._id, side, units: Number(units), pricePerUnit: Number(price) }) });
    const d = await r.json();
    setMsg(r.ok ? d.message : "Error: " + d.error);
    if (r.ok) { setUnits(""); setPrice(""); loadOrderBook(selectedAsset._id); loadMyOrders(); loadAssets(); }
  };

  const cancelOrder = async (id) => {
    const r = await fetch("/api/orderbook/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: id }) });
    const d = await r.json();
    setMsg(r.ok ? d.message : d.error);
    loadMyOrders(); if (selectedAsset) loadOrderBook(selectedAsset._id);
  };

  const buyPrimary = async (asset) => {
    if (!session) { router.push("/login"); return; }
    const u = prompt("Units to buy:");
    if (!u || Number(u) <= 0) return;
    const r = await fetch("/api/investments/buy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId: asset._id, units: Number(u) }) });
    const d = await r.json();
    setMsg(r.ok ? d.message : d.error);
    loadAssets();
  };

  const priceOf = (a) => a.tokenPrice || (a.targetRaise && a.tokenSupply ? Math.round(a.targetRaise / a.tokenSupply) : 100);
  const badge = (s) => { const c = { open:"#22c55e", partial:"#f59e0b", filled:"#3b82f6", cancelled:"#6b7280", expired:"#6b7280" }; return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:(c[s]||"#666")+"15", color:c[s]||"#666", fontWeight:700 }}>{s}</span>; };
  const inp = { background:"#0a0e14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"8px 12px", color:"#fff", fontSize:13, outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box" };

  return (
    <>
      <Head><title>Marketplace — Nextoken Capital</title></Head>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#0B0E11", color:"#fff", paddingTop:70 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px" }}>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Asset Marketplace</h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:20 }}>Buy from issuers or trade on the secondary market</p>

          {msg && <div style={{ background:msg.startsWith("Error")?"rgba(255,77,77,0.1)":"rgba(34,197,94,0.1)", border:"1px solid "+(msg.startsWith("Error")?"rgba(255,77,77,0.2)":"rgba(34,197,94,0.2)"), borderRadius:8, padding:"10px 14px", fontSize:13, color:msg.startsWith("Error")?"#ff6b6b":"#22c55e", marginBottom:16 }}>{msg}</div>}

          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            {["assets","trade","orders"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding:"8px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", background:tab===t?"#F0B90B15":"rgba(255,255,255,0.04)", color:tab===t?"#F0B90B":"rgba(255,255,255,0.4)", border:tab===t?"1px solid #F0B90B30":"1px solid rgba(255,255,255,0.06)" }}>
                {t === "assets" ? "Primary Market" : t === "trade" ? "Trade (Order Book)" : "My Orders (" + myOrders.filter(o=>["open","partial"].includes(o.status)).length + ")"}
              </button>
            ))}
          </div>

          {/* PRIMARY MARKET */}
          {tab === "assets" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
              {loading ? <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>Loading...</div>
              : assets.length === 0 ? <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>No assets available</div>
              : assets.map(a => (
                <div key={a._id} onClick={() => router.push("/asset/" + a._id)} style={{ cursor:"pointer", background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:20 }}>
                  <div style={{ fontSize:16, fontWeight:700 }}>{a.name}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:12 }}>{a.assetType}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                    <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 10px" }}><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>PRICE</div><div style={{ fontSize:15, fontWeight:700, color:"#F0B90B" }}>EUR {priceOf(a)}</div></div>
                    <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 10px" }}><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>YIELD</div><div style={{ fontSize:15, fontWeight:700, color:"#22c55e" }}>{a.targetROI||0}%</div></div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={(e) => { e.stopPropagation(); buyPrimary(a); }} style={{ flex:1, padding:10, background:"#F0B90B", color:"#000", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Buy</button>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedAsset(a); setTab("trade"); setPrice(String(priceOf(a))); }} style={{ flex:1, padding:10, background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.2)", color:"#8b5cf6", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Trade</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TRADE (ORDER BOOK) */}
          {tab === "trade" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>
              {/* Left: Order Book + Trades */}
              <div>
                {/* Asset selector */}
                <div style={{ marginBottom:16 }}>
                  <select value={selectedAsset?._id || ""} onChange={e => { const a = assets.find(x => x._id === e.target.value); setSelectedAsset(a); if(a) setPrice(String(priceOf(a))); }} style={{ ...inp, cursor:"pointer" }}>
                    <option value="">Select an asset to trade</option>
                    {assets.map(a => <option key={a._id} value={a._id}>{a.name} — EUR {priceOf(a)}</option>)}
                  </select>
                </div>

                {selectedAsset && <>
                  {/* Market info */}
                  <div style={{ display:"flex", gap:12, marginBottom:16 }}>
                    {[{l:"Last Price", v:orderBook.lastPrice?"EUR "+orderBook.lastPrice:"—", c:"#F0B90B"}, {l:"Best Bid", v:orderBook.bestBid?"EUR "+orderBook.bestBid:"—", c:"#22c55e"}, {l:"Best Ask", v:orderBook.bestAsk?"EUR "+orderBook.bestAsk:"—", c:"#ef4444"}, {l:"Spread", v:orderBook.spread!==null?"EUR "+orderBook.spread:"—", c:"#8b5cf6"}, {l:"24h Volume", v:"EUR "+(orderBook.volume24h||0).toLocaleString(), c:"#3b82f6"}].map((s,i) => (
                      <div key={i} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"10px 14px", flex:1 }}>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>{s.l}</div>
                        <div style={{ fontSize:14, fontWeight:700, color:s.c }}>{s.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Depth: Asks (top) + Bids (bottom) */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                    {/* Asks */}
                    <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                      <div style={{ padding:"8px 12px", background:"rgba(239,68,68,0.05)", fontSize:11, fontWeight:700, color:"#ef4444" }}>ASKS (Sell Orders)</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", padding:"6px 12px", fontSize:9, color:"rgba(255,255,255,0.3)", fontWeight:700 }}><span>PRICE</span><span style={{ textAlign:"right" }}>UNITS</span></div>
                      {(orderBook.asks||[]).length === 0 ? <div style={{ padding:16, textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.2)" }}>No asks</div>
                      : (orderBook.asks||[]).slice(0,10).reverse().map((a,i) => (
                        <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", padding:"4px 12px", fontSize:12, position:"relative" }}>
                          <div style={{ position:"absolute", right:0, top:0, bottom:0, background:"rgba(239,68,68,0.06)", width: Math.min(a.units/Math.max(...(orderBook.asks||[]).map(x=>x.units),1)*100, 100)+"%" }} />
                          <span style={{ color:"#ef4444", fontWeight:600, position:"relative" }}>EUR {a.price}</span>
                          <span style={{ textAlign:"right", position:"relative" }}>{a.units}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bids */}
                    <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                      <div style={{ padding:"8px 12px", background:"rgba(34,197,94,0.05)", fontSize:11, fontWeight:700, color:"#22c55e" }}>BIDS (Buy Orders)</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", padding:"6px 12px", fontSize:9, color:"rgba(255,255,255,0.3)", fontWeight:700 }}><span>PRICE</span><span style={{ textAlign:"right" }}>UNITS</span></div>
                      {(orderBook.bids||[]).length === 0 ? <div style={{ padding:16, textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.2)" }}>No bids</div>
                      : (orderBook.bids||[]).slice(0,10).map((b,i) => (
                        <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", padding:"4px 12px", fontSize:12, position:"relative" }}>
                          <div style={{ position:"absolute", right:0, top:0, bottom:0, background:"rgba(34,197,94,0.06)", width: Math.min(b.units/Math.max(...(orderBook.bids||[]).map(x=>x.units),1)*100, 100)+"%" }} />
                          <span style={{ color:"#22c55e", fontWeight:600, position:"relative" }}>EUR {b.price}</span>
                          <span style={{ textAlign:"right", position:"relative" }}>{b.units}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Trades */}
                  <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                    <div style={{ padding:"8px 12px", fontSize:11, fontWeight:700, color:"#F0B90B" }}>RECENT TRADES</div>
                    {(orderBook.recentTrades||[]).length === 0 ? <div style={{ padding:16, textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.2)" }}>No trades yet</div>
                    : (orderBook.recentTrades||[]).slice(0,10).map((t,i) => (
                      <div key={i} style={{ display:"grid", gridTemplateColumns:"80px 80px 80px 1fr", padding:"6px 12px", fontSize:11, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                        <span style={{ fontWeight:600 }}>EUR {t.price}</span>
                        <span>{t.units} units</span>
                        <span style={{ color:"rgba(255,255,255,0.4)" }}>EUR {t.amount}</span>
                        <span style={{ color:"rgba(255,255,255,0.25)", fontSize:10 }}>{new Date(t.time).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </>}
              </div>

              {/* Right: Place Order */}
              <div style={{ background:"#161b22", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)", padding:20, height:"fit-content", position:"sticky", top:90 }}>
                <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Place Order</h3>
                <div style={{ display:"flex", gap:4, marginBottom:16 }}>
                  <button onClick={() => setSide("bid")} style={{ flex:1, padding:8, borderRadius:6, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", background:side==="bid"?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.04)", color:side==="bid"?"#22c55e":"rgba(255,255,255,0.4)", border:side==="bid"?"1px solid rgba(34,197,94,0.3)":"1px solid rgba(255,255,255,0.06)" }}>Buy (Bid)</button>
                  <button onClick={() => setSide("ask")} style={{ flex:1, padding:8, borderRadius:6, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", background:side==="ask"?"rgba(239,68,68,0.15)":"rgba(255,255,255,0.04)", color:side==="ask"?"#ef4444":"rgba(255,255,255,0.4)", border:side==="ask"?"1px solid rgba(239,68,68,0.3)":"1px solid rgba(255,255,255,0.06)" }}>Sell (Ask)</button>
                </div>
                <div style={{ marginBottom:12 }}><label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", display:"block", marginBottom:4 }}>Price per unit (EUR)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} style={inp} placeholder="100" /></div>
                <div style={{ marginBottom:12 }}><label style={{ fontSize:11, color:"rgba(255,255,255,0.4)", display:"block", marginBottom:4 }}>Units</label><input type="number" value={units} onChange={e => setUnits(e.target.value)} style={inp} placeholder="10" /></div>

                {units && price && (
                  <div style={{ background:"#0a0e14", borderRadius:8, padding:12, marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}><span style={{ color:"rgba(255,255,255,0.4)" }}>Total</span><span>EUR {(Number(units)*Number(price)).toLocaleString()}</span></div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}><span style={{ color:"rgba(255,255,255,0.4)" }}>Fee (0.5%)</span><span>EUR {(Number(units)*Number(price)*0.005).toFixed(2)}</span></div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, fontWeight:700, borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:4 }}><span>You {side==="bid"?"pay":"receive"}</span><span style={{ color:"#F0B90B" }}>EUR {(Number(units)*Number(price)*(side==="bid"?1.005:0.995)).toFixed(2)}</span></div>
                  </div>
                )}

                <button onClick={placeOrder} disabled={!selectedAsset || !units || !price} style={{ width:"100%", padding:12, background:side==="bid"?"#22c55e":"#ef4444", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit", opacity:(!selectedAsset||!units||!price)?0.4:1 }}>
                  {side === "bid" ? "Place Buy Order" : "Place Sell Order"}
                </button>
                <p style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginTop:8, textAlign:"center" }}>Orders expire in 7 days. 0.5% fee per side.</p>
              </div>
            </div>
          )}

          {/* MY ORDERS */}
          {tab === "orders" && (
            <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"70px 150px 70px 90px 80px 70px 80px 70px", padding:"10px 16px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                <span>Side</span><span>Asset</span><span>Units</span><span>Price</span><span>Filled</span><span>Remain</span><span>Status</span><span>Action</span>
              </div>
              {myOrders.length === 0 ? <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No orders</div>
              : myOrders.map((o,i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"70px 150px 70px 90px 80px 70px 80px 70px", padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
                  <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:o.side==="bid"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", color:o.side==="bid"?"#22c55e":"#ef4444", fontWeight:700 }}>{o.side}</span>
                  <span style={{ fontWeight:600 }}>{o.assetName}</span>
                  <span>{o.units}</span>
                  <span>EUR {o.pricePerUnit}</span>
                  <span style={{ color:"#22c55e" }}>{o.filledUnits||0}</span>
                  <span>{o.remainingUnits}</span>
                  {badge(o.status)}
                  <div>{["open","partial"].includes(o.status) && <button onClick={() => cancelOrder(o._id)} style={{ padding:"3px 8px", borderRadius:4, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", fontSize:9, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
