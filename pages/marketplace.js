import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function Marketplace() {
  const router = useRouter();
  const { data: session } = useSession();
  const [assets, setAssets] = useState([]);
  const [sellOrders, setSellOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("primary");
  const [buyModal, setBuyModal] = useState(null);
  const [units, setUnits] = useState(1);
  const [msg, setMsg] = useState("");

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [a, o] = await Promise.all([
        fetch("/api/assets/stats").then(r => r.json()).catch(() => ({ assets: [] })),
        fetch("/api/investments/sell-orders").then(r => r.json()).catch(() => ({ orders: [] })),
      ]);
      setAssets((a.assets || []).filter(x => x.status === "live" || x.approvalStatus === "live"));
      setSellOrders(o.orders || []);
    } catch(e) {} finally { setLoading(false); }
  };

  const buyPrimary = async () => {
    if (!session) { router.push("/login"); return; }
    setMsg("");
    const res = await fetch("/api/investments/buy", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId: buyModal._id, units: Number(units) }),
    });
    const d = await res.json();
    setMsg(res.ok ? "Success! " + d.message : "Error: " + d.error);
    if (res.ok) { setBuyModal(null); loadAll(); }
  };

  const buySecondary = async (orderId) => {
    if (!session) { router.push("/login"); return; }
    const res = await fetch("/api/investments/buy-secondary", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const d = await res.json();
    setMsg(res.ok ? "Success! " + d.message : "Error: " + d.error);
    if (res.ok) loadAll();
  };

  const pricePerUnit = (a) => a.tokenPrice || (a.targetRaise && a.tokenSupply ? Math.round(a.targetRaise / a.tokenSupply) : 100);

  return (
    <>
      <Head><title>Marketplace — Nextoken Capital</title></Head>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#0B0E11", color:"#fff", paddingTop:70 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 20px" }}>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>Asset Marketplace</h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:24 }}>Invest in tokenized real-world assets from EUR 100</p>

          {msg && <div style={{ background: msg.startsWith("Success") ? "rgba(34,197,94,0.1)" : "rgba(255,77,77,0.1)", border: "1px solid " + (msg.startsWith("Success") ? "rgba(34,197,94,0.2)" : "rgba(255,77,77,0.2)"), borderRadius:8, padding:"10px 14px", fontSize:13, color: msg.startsWith("Success") ? "#22c55e" : "#ff6b6b", marginBottom:16 }}>{msg}</div>}

          <div style={{ display:"flex", gap:8, marginBottom:24 }}>
            <button onClick={() => setTab("primary")} style={{ padding:"8px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", background: tab==="primary" ? "#F0B90B15" : "rgba(255,255,255,0.04)", color: tab==="primary" ? "#F0B90B" : "rgba(255,255,255,0.4)", border: tab==="primary" ? "1px solid #F0B90B30" : "1px solid rgba(255,255,255,0.06)" }}>Primary Market</button>
            <button onClick={() => setTab("secondary")} style={{ padding:"8px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", background: tab==="secondary" ? "#8b5cf615" : "rgba(255,255,255,0.04)", color: tab==="secondary" ? "#8b5cf6" : "rgba(255,255,255,0.4)", border: tab==="secondary" ? "1px solid #8b5cf630" : "1px solid rgba(255,255,255,0.06)" }}>Secondary Market ({sellOrders.length})</button>
          </div>

          {loading ? <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>Loading...</div> : (
            <>
              {/* PRIMARY MARKET */}
              {tab === "primary" && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:16 }}>
                  {assets.length === 0 ? <div style={{ gridColumn:"1/-1", textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>No assets available yet</div> : assets.map(a => (
                    <div key={a._id} style={{ background:"#161b22", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:20, transition:"border-color .15s" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                        <div>
                          <div style={{ fontSize:16, fontWeight:700 }}>{a.name}</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{a.assetType} · {a.issuerName || "Nextoken"}</div>
                        </div>
                        <span style={{ fontSize:10, padding:"3px 8px", borderRadius:4, background:"rgba(34,197,94,0.1)", color:"#22c55e", fontWeight:700, height:"fit-content" }}>LIVE</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                        <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 10px" }}><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>PRICE/UNIT</div><div style={{ fontSize:15, fontWeight:700, color:"#F0B90B" }}>EUR {pricePerUnit(a)}</div></div>
                        <div style={{ background:"#0a0e14", borderRadius:6, padding:"8px 10px" }}><div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>YIELD</div><div style={{ fontSize:15, fontWeight:700, color:"#22c55e" }}>{a.targetROI || a.interestRate || "N/A"}%</div></div>
                      </div>
                      {a.description && <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:12, lineHeight:1.5 }}>{a.description?.slice(0, 100)}{a.description?.length > 100 ? "..." : ""}</div>}
                      <button onClick={() => { setBuyModal(a); setUnits(1); }} style={{ width:"100%", padding:10, background:"#F0B90B", color:"#000", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Invest Now</button>
                    </div>
                  ))}
                </div>
              )}

              {/* SECONDARY MARKET */}
              {tab === "secondary" && (
                <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"180px 80px 100px 100px 100px", padding:"10px 20px", background:"rgba(255,255,255,0.03)", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>
                    <span>Asset</span><span>Units</span><span>Price/Unit</span><span>Total</span><span>Action</span>
                  </div>
                  {sellOrders.length === 0 ? (
                    <div style={{ padding:30, textAlign:"center", color:"rgba(255,255,255,0.3)" }}>No sell orders listed. Check back later.</div>
                  ) : sellOrders.map(o => (
                    <div key={o._id} style={{ display:"grid", gridTemplateColumns:"180px 80px 100px 100px 100px", padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, alignItems:"center" }}>
                      <span style={{ fontWeight:600 }}>{o.assetName}</span>
                      <span>{o.units}</span>
                      <span style={{ color:"#F0B90B" }}>EUR {o.pricePerUnit}</span>
                      <span style={{ fontWeight:600 }}>EUR {o.totalAmount?.toLocaleString()}</span>
                      <button onClick={() => buySecondary(o._id)} style={{ padding:"5px 12px", borderRadius:5, background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.2)", color:"#8b5cf6", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Buy</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* BUY MODAL */}
          {buyModal && (
            <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }} onClick={() => setBuyModal(null)}>
              <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:420, background:"#0F1318", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:28 }}>
                <h2 style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>Invest in {buyModal.name}</h2>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:16 }}>{buyModal.assetType} · EUR {pricePerUnit(buyModal)}/unit</p>

                <div style={{ marginBottom:16 }}>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>UNITS TO BUY</label>
                  <input type="number" value={units} onChange={e => setUnits(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width:"100%", background:"#161B22", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 14px", color:"#fff", fontSize:16, fontWeight:700, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
                </div>

                <div style={{ background:"#0a0e14", borderRadius:8, padding:14, marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>Subtotal</span><span style={{ fontSize:13 }}>EUR {(units * pricePerUnit(buyModal)).toLocaleString()}</span></div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>Fee (1%)</span><span style={{ fontSize:13 }}>EUR {Math.round(units * pricePerUnit(buyModal) * 0.01)}</span></div>
                  <div style={{ display:"flex", justifyContent:"space-between", borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:6 }}><span style={{ fontSize:13, fontWeight:700 }}>Total</span><span style={{ fontSize:16, fontWeight:800, color:"#F0B90B" }}>EUR {Math.round(units * pricePerUnit(buyModal) * 1.01).toLocaleString()}</span></div>
                </div>

                <button onClick={buyPrimary} style={{ width:"100%", padding:12, background:"#F0B90B", color:"#000", border:"none", borderRadius:8, fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>Confirm Purchase</button>
                <button onClick={() => setBuyModal(null)} style={{ width:"100%", marginTop:8, padding:10, background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"rgba(255,255,255,0.4)", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
