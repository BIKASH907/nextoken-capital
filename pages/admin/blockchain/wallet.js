import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../../components/admin/AdminShell";

export default function BlockchainWallet() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [info, setInfo] = useState({});
  const [assets, setAssets] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => { const t = localStorage.getItem("adminToken"); if (!t) router.push("/admin/login"); setToken(t); }, []);
  useEffect(() => { if (token) { loadInfo(); loadAssets(); } }, [token]);

  const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const loadInfo = () => fetch("/api/blockchain/info", { headers }).then(r => r.json()).then(setInfo).catch(() => {});
  const loadAssets = () => fetch("/api/admin/assets", { headers }).then(r => r.json()).then(d => setAssets(d.assets || [])).catch(() => {});

  const deploy = async (id) => {
    setMsg("Deploying...");
    const r = await fetch("/api/blockchain/deploy", { method: "POST", headers, body: JSON.stringify({ assetId: id }) });
    const d = await r.json();
    setMsg(r.ok ? d.message : "Error: " + d.error);
    loadAssets();
  };

  const card = (l, v, c) => <div style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 20px", flex: 1 }}><div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{l}</div></div>;

  return (
    <AdminShell title="Blockchain & Wallet" subtitle="Real Polygon mainnet connection. Deploy tokens, monitor deployer wallet.">
      {msg && <div style={{ background: "rgba(240,185,11,0.08)", border: "1px solid rgba(240,185,11,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#F0B90B", marginBottom: 16 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {card("Network", info.network || "—", "#8b5cf6")}
        {card("Chain ID", info.chainId || "—", "#3b82f6")}
        {card("MATIC Balance", info.maticBalance ? info.maticBalance + " MATIC" : "—", "#22c55e")}
        {card("RPC", info.rpcConnected ? "Connected" : "Disconnected", info.rpcConnected ? "#22c55e" : "#ef4444")}
      </div>

      {info.deployer && (
        <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Deployer Address</div>
          <a href={info.explorerUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "monospace", fontSize: 14, color: "#F0B90B", textDecoration: "none" }}>{info.deployer}</a>
        </div>
      )}

      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Token Deployment</h3>
      <div style={{ background: "#161b22", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        {assets.map((a, i) => (
          <div key={i} style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{a.contractAddress ? "Deployed: " + a.contractAddress.slice(0, 20) + "..." : "Not deployed"}</div>
            </div>
            {!a.contractAddress ? (
              <button onClick={() => deploy(a._id)} style={{ padding: "6px 14px", borderRadius: 6, background: "#F0B90B", color: "#000", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Deploy Token</button>
            ) : (
              <a href={"https://polygonscan.com/address/" + a.contractAddress} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#22c55e", textDecoration: "none" }}>View on PolygonScan</a>
            )}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
