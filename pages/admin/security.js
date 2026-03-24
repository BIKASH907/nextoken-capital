import { useState } from "react";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

export default function SecurityPage() {
  const [tab, setTab] = useState("killswitch");
  const [killActive, setKillActive] = useState(false);
  const [confirm2FA, setConfirm2FA] = useState("");
  const [walletInput, setWalletInput] = useState("");
  const [whitelisted, setWhitelisted] = useState([
    { addr:"0xAbC1...D23F", name:"Institutional Fund A", added:"2025-01-15", status:"active" },
    { addr:"0xDeF4...G56H", name:"Market Maker B", added:"2025-02-01", status:"active" },
  ]);
  const [adminLogins] = useState([
    { time:"2025-03-25 01:15:00", admin:"Bikash Bhat", ip:"185.x.x.x", device:"Chrome / Windows", status:"success" },
    { time:"2025-03-24 22:30:00", admin:"Bikash Bhat", ip:"185.x.x.x", device:"Chrome / Windows", status:"success" },
    { time:"2025-03-24 14:00:00", admin:"Bikash Bhat", ip:"185.x.x.x", device:"Mobile Safari", status:"success" },
    { time:"2025-03-23 09:00:00", admin:"Unknown", ip:"92.x.x.x", device:"Firefox / Linux", status:"failed" },
  ]);
  const [logs] = useState([
    { time:"2025-03-24 14:32:10", admin:"Bikash Bhat", action:"KYC Approved", target:"User: john@example.com", ip:"185.x.x.x" },
    { time:"2025-03-24 12:15:00", admin:"Bikash Bhat", action:"Asset Status → Live", target:"SOLAR-01", ip:"185.x.x.x" },
    { time:"2025-03-24 09:00:00", admin:"System", action:"Auto-screen: Sanctions", target:"All users", ip:"—" },
    { time:"2025-03-23 18:45:00", admin:"Bikash Bhat", action:"Wallet Whitelisted", target:"0xAbC1...D23F", ip:"185.x.x.x" },
  ]);

  const tabs = [
    { id:"killswitch", label:"🚨 Kill Switch" },
    { id:"surveillance", label:"📊 Surveillance" },
    { id:"wallets", label:"💳 Wallet Manager" },
    { id:"logs", label:"📝 Activity Logs" },
  ];

  return (
    <>
      <Head><title>Security — Admin</title></Head>
      <AdminShell title="Risk & Security Control Plane" subtitle="Emergency controls, market surveillance, wallet management, and audit logs">
        <style>{`
          .se-tabs{display:flex;gap:4px;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.07)}
          .se-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit}
          .se-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
          .se-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px;margin-bottom:16px}
          .se-kill-box{text-align:center;padding:40px;border:2px solid ${killActive?"rgba(255,77,77,0.4)":"rgba(255,255,255,0.08)"};border-radius:16px;background:${killActive?"rgba(255,77,77,0.05)":"transparent"};transition:all .3s}
          .se-kill-btn{padding:16px 40px;border-radius:12px;font-size:16px;font-weight:900;cursor:pointer;font-family:inherit;border:none;transition:all .2s}
          .se-input{background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;font-size:13px;color:#fff;outline:none;font-family:inherit;margin:8px 0}
          .se-table{width:100%;border-collapse:collapse}
          .se-table th{text-align:left;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px;padding:10px 14px;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06)}
          .se-table td{padding:10px 14px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.7)}
        `}</style>

        <div className="se-tabs">{tabs.map(t => <button key={t.id} className={`se-tab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

        {tab === "killswitch" && (
          <div className="se-card">
            <div className="se-kill-box">
              <div style={{fontSize:52,marginBottom:16}}>{killActive?"🔴":"🟢"}</div>
              <div style={{fontSize:20,fontWeight:900,color:killActive?"#FF4D4D":"#0ECB81",marginBottom:8}}>
                {killActive?"⚠️ TRADING PAUSED":"Trading Active"}
              </div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20,maxWidth:400,margin:"0 auto 20px",lineHeight:1.7}}>
                {killActive
                  ? "All platform trading is currently suspended. Users cannot buy or sell tokens."
                  : "Platform is operating normally. Use the kill switch only in case of a detected exploit or emergency."
                }
              </p>
              {!killActive ? (
                <>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:8}}>Enter 2FA code to activate emergency pause:</p>
                  <input className="se-input" type="text" maxLength={6} placeholder="000000" value={confirm2FA} onChange={e=>setConfirm2FA(e.target.value.replace(/[^0-9]/g,''))} style={{width:120,textAlign:"center",fontSize:20,letterSpacing:8}} />
                  <br />
                  <button className="se-kill-btn" style={{background:"#FF4D4D",color:"#fff",marginTop:16}} onClick={()=>{if(confirm2FA.length===6)setKillActive(true)}} disabled={confirm2FA.length!==6}>
                    🚨 PAUSE ALL TRADING
                  </button>
                </>
              ) : (
                <button className="se-kill-btn" style={{background:"#0ECB81",color:"#000",marginTop:8}} onClick={()=>{setKillActive(false);setConfirm2FA("");}}>
                  ✅ RESUME TRADING
                </button>
              )}
            </div>
          </div>
        )}

        {tab === "surveillance" && (
          <div className="se-card">
            <div style={{fontSize:15,fontWeight:700,marginBottom:16}}>Market Abuse Surveillance</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
              <div style={{background:"#161B22",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:16,textAlign:"center"}}><div style={{fontSize:"1.3rem",fontWeight:900,color:"#0ECB81"}}>0</div><div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginTop:3}}>Wash Trade Alerts</div></div>
              <div style={{background:"#161B22",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:16,textAlign:"center"}}><div style={{fontSize:"1.3rem",fontWeight:900,color:"#0ECB81"}}>0</div><div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginTop:3}}>Price Manipulation</div></div>
              <div style={{background:"#161B22",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:16,textAlign:"center"}}><div style={{fontSize:"1.3rem",fontWeight:900,color:"#0ECB81"}}>0</div><div style={{fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginTop:3}}>Insider Flags</div></div>
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.35)",textAlign:"center",marginBottom:16}}>AI-driven surveillance is active.</p>
            <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Recent Alerts</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{id:"TX-001",reason:"High value first transaction (€25,000)",risk:"high",time:"01:12"},{id:"TX-004",reason:"Cross-border corporate transfer (€50,000)",risk:"high",time:"18:15"},{id:"TX-005",reason:"TFR data missing on cross-border trade",risk:"high",time:"16:00"},{id:"TX-010",reason:"Sanctions proximity + unverified wallet (€75,000)",risk:"critical",time:"15:30"}].map(a => (
                <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"rgba(255,77,77,0.04)",border:"1px solid rgba(255,77,77,0.12)",borderRadius:8}}>
                  <div><div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{a.id} — {a.reason}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:2}}>Today {a.time}</div></div>
                  <a href="/admin/transactions" style={{fontSize:11,color:"#F0B90B",textDecoration:"none",fontWeight:700}}>View →</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "wallets" && (
          <div className="se-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:15,fontWeight:700}}>Wallet Whitelisting Manager</div>
              <div style={{display:"flex",gap:8}}>
                <input className="se-input" placeholder="0x..." value={walletInput} onChange={e=>setWalletInput(e.target.value)} style={{width:240,margin:0}} />
                <button style={{padding:"8px 16px",background:"#F0B90B",color:"#000",border:"none",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer"}} onClick={()=>{if(walletInput){setWhitelisted(prev=>[...prev,{addr:walletInput,name:"New Wallet",added:new Date().toISOString().split("T")[0],status:"active"}]);setWalletInput("");}}}>+ Add</button>
              </div>
            </div>
            <table className="se-table">
              <thead><tr><th>Wallet</th><th>Name</th><th>Added</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {whitelisted.map((w,i) => (
                  <tr key={i}>
                    <td style={{fontFamily:"monospace",color:"#F0B90B",fontSize:11}}>{w.addr}</td>
                    <td style={{fontWeight:600}}>{w.name}</td>
                    <td style={{color:"rgba(255,255,255,0.4)"}}>{w.added}</td>
                    <td><span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(14,203,129,0.12)",color:"#0ECB81"}}>{w.status}</span></td>
                    <td><button style={{padding:"4px 12px",background:"rgba(255,77,77,0.08)",border:"1px solid rgba(255,77,77,0.15)",borderRadius:6,color:"#ff6b6b",fontSize:11,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setWhitelisted(prev=>prev.filter((_,j)=>j!==i))}>Revoke</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "logins" && (
          <div className="se-card">
            <div style={{fontSize:15,fontWeight:700,marginBottom:16}}>Recent Admin Logins</div>
            <table className="se-table">
              <thead><tr><th>Timestamp</th><th>Admin</th><th>IP Address</th><th>Device</th><th>Status</th></tr></thead>
              <tbody>
                {adminLogins.map((l,i) => (
                  <tr key={i}>
                    <td style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.4)"}}>{l.time}</td>
                    <td style={{fontWeight:600}}>{l.admin}</td>
                    <td style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.3)"}}>{l.ip}</td>
                    <td style={{color:"rgba(255,255,255,0.5)"}}>{l.device}</td>
                    <td><span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:l.status==="success"?"rgba(14,203,129,0.12)":"rgba(255,77,77,0.12)",color:l.status==="success"?"#0ECB81":"#FF4D4D"}}>{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === "logs" && (
          <div className="se-card">
            <div style={{fontSize:15,fontWeight:700,marginBottom:16}}>Activity Logs</div>
            <table className="se-table">
              <thead><tr><th>Timestamp</th><th>Admin</th><th>Action</th><th>Target</th><th>IP</th></tr></thead>
              <tbody>
                {logs.map((l,i) => (
                  <tr key={i}>
                    <td style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.4)"}}>{l.time}</td>
                    <td style={{fontWeight:600}}>{l.admin}</td>
                    <td style={{color:"#F0B90B"}}>{l.action}</td>
                    <td>{l.target}</td>
                    <td style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.3)"}}>{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminShell>
    </>
  );
}
