import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";

export default function MarketControl() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [assets, setAssets] = useState([]);
  const [botOrders, setBotOrders] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => { const t = localStorage.getItem("adminToken"); if (!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if (token) { loadAssets(); loadBot(); } }, [token]);

  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const loadAssets = () => fetch("/api/admin/market-phase", { headers }).then(r => r.json()).then(d => setAssets(d.assets || []));
  const loadBot = () => fetch("/api/admin/market-maker", { headers }).then(r => r.json()).then(d => setBotOrders(d.botOrders || []));

  const changePhase = async (id, phase) => {
    const r = await fetch("/api/admin/market-phase", { method: "POST", headers, body: JSON.stringify({ assetId: id, phase }) });
    setMsg((await r.json()).message); loadAssets();
  };

  const startBot = async (id) => {
    const r = await fetch("/api/admin/market-maker", { method: "POST", headers, body: JSON.stringify({ assetId: id, action: "start" }) });
    setMsg((await r.json()).message); loadBot();
  };

  const stopBot = async (id) => {
    const r = await fetch("/api/admin/market-maker", { method: "POST", headers, body: JSON.stringify({ assetId: id, action: "stop" }) });
    setMsg((await r.json()).message); loadBot();
  };

  const phaseColor = { primary_active: "#F0B90B", price_discovery: "#8b5cf6", secondary_active: "#22c55e" };
  const phaseLabel = { primary_active: "IPO (Primary)", price_discovery: "Price Discovery", secondary_active: "Live Trading" };

  return (
    <AdminShell title="Market Control" subtitle="Manage asset phases, market maker bot, and trading status.">
      {msg && <div style={{ background: "rgba(240,185,11,0.08)", border: "1px solid rgba(240,185,11,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#F0B90B", marginBottom: 16 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px", flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#F0B90B" }}>{assets.length}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Total Assets</div>
        </div>
        <div style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px", flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#22c55e" }}>{botOrders.length}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Bot Orders Active</div>
        </div>
      </div>

      {assets.map((a, i) => (
        <div key={i} style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 20px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Sold: {a.soldUnits || 0}/{a.tokenSupply || 0} · Last: EUR {a.lastTradedPrice || "—"}</div>
            </div>
            <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, background: (phaseColor[a.marketPhase] || "#666") + "15", color: phaseColor[a.marketPhase] || "#666", fontWeight: 700 }}>{phaseLabel[a.marketPhase] || a.marketPhase || "primary"}</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => changePhase(a._id, "primary_active")} style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(240,185,11,0.1)", border: "1px solid rgba(240,185,11,0.2)", color: "#F0B90B", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Set IPO</button>
            <button onClick={() => changePhase(a._id, "price_discovery")} style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#8b5cf6", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Price Discovery</button>
            <button onClick={() => changePhase(a._id, "secondary_active")} style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Live Trading</button>
            <span style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", margin: "0 4px" }} />
            <button onClick={() => startBot(a._id)} style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Start Bot</button>
            <button onClick={() => stopBot(a._id)} style={{ padding: "4px 10px", borderRadius: 4, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Stop Bot</button>
          </div>
        </div>
      ))}
    </AdminShell>
  );
}
