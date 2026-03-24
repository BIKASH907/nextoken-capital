import { useState } from "react";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

const CONTRACTS = [
  { name:"SOLAR-01 Security Token", standard:"ERC-3643", address:"0x1234...5678", chain:"Ethereum", status:"active", deployed:"2025-01-15", supply:"500,000" },
  { name:"OFFIC-03 Security Token", standard:"ERC-3643", address:"0xABCD...EFGH", chain:"Ethereum", status:"active", deployed:"2025-02-01", supply:"240,000" },
  { name:"WIND-07 Security Token", standard:"ERC-3643", address:"0x9876...5432", chain:"Ethereum", status:"active", deployed:"2025-02-20", supply:"650,000" },
  { name:"LOGX-06 Security Token", standard:"ERC-3643", address:"0xFEDC...BA98", chain:"Ethereum", status:"paused", deployed:"2025-03-01", supply:"800,000" },
];

export default function ContractsPage() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Head><title>Smart Contracts — Admin</title></Head>
      <AdminShell title="Smart Contract Factory Control" subtitle="Deploy, pause, or upgrade asset-backed smart contracts (ERC-3643 / ERC-7518)">
        <style>{`
          .sc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;margin-bottom:20px}
          .sc-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;cursor:pointer;transition:all .2s}
          .sc-card:hover{border-color:rgba(240,185,11,0.3);transform:translateY(-1px)}
          .sc-name{font-size:14px;font-weight:700;color:#fff;margin-bottom:4px}
          .sc-addr{font-family:monospace;font-size:11px;color:#F0B90B;margin-bottom:12px}
          .sc-row{display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px}
          .sc-row-l{color:rgba(255,255,255,0.4)}
          .sc-row-v{font-weight:600;color:#fff}
          .sc-status{padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700}
          .sc-active{background:rgba(14,203,129,0.12);color:#0ECB81}
          .sc-paused{background:rgba(240,185,11,0.12);color:#F0B90B}
          .sc-actions{display:flex;gap:6px;margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06)}
          .sc-btn{padding:6px 14px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid;font-family:inherit;transition:all .15s}
        `}</style>

        <div style={{display:"flex",gap:10,marginBottom:20}}>
          <button style={{padding:"10px 20px",background:"#F0B90B",color:"#000",border:"none",borderRadius:8,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>+ Deploy New Contract</button>
          <button style={{padding:"10px 20px",background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>View Factory ABI</button>
        </div>

        <div className="sc-grid">
          {CONTRACTS.map(c => (
            <div key={c.address} className="sc-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div className="sc-name">{c.name}</div>
                <span className={`sc-status ${c.status==="active"?"sc-active":"sc-paused"}`}>{c.status}</span>
              </div>
              <div className="sc-addr">{c.address}</div>
              <div className="sc-row"><span className="sc-row-l">Standard</span><span className="sc-row-v">{c.standard}</span></div>
              <div className="sc-row"><span className="sc-row-l">Chain</span><span className="sc-row-v">{c.chain}</span></div>
              <div className="sc-row"><span className="sc-row-l">Supply</span><span className="sc-row-v">{c.supply}</span></div>
              <div className="sc-row"><span className="sc-row-l">Deployed</span><span className="sc-row-v">{c.deployed}</span></div>
              <div className="sc-actions">
                <button className="sc-btn" style={{borderColor:"rgba(14,203,129,0.3)",background:"rgba(14,203,129,0.08)",color:"#0ECB81"}}>Verify</button>
                <button className="sc-btn" style={{borderColor:"rgba(240,185,11,0.3)",background:"rgba(240,185,11,0.08)",color:"#F0B90B"}}>{c.status==="active"?"Pause":"Resume"}</button>
                <button className="sc-btn" style={{borderColor:"rgba(59,130,246,0.3)",background:"rgba(59,130,246,0.08)",color:"#3B82F6"}}>Upgrade</button>
              </div>
            </div>
          ))}
        </div>
      </AdminShell>
    </>
  );
}
