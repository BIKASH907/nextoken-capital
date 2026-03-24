import { useState } from "react";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

const SAMPLE_REGISTRY = [
  { wallet:"0xAbC1...D23F", name:"John Doe", country:"DE", kyc:"approved", tokens:500, asset:"SOLAR-01", value:"€5,210", pct:"2.5%" },
  { wallet:"0xDeF4...G56H", name:"Jane Smith", country:"LT", kyc:"approved", tokens:1200, asset:"SOLAR-01", value:"€12,504", pct:"6.0%" },
  { wallet:"0xGhI7...J89K", name:"Corp Ltd", country:"GB", kyc:"approved", tokens:5000, asset:"OFFIC-03", value:"€44,550", pct:"12.5%" },
  { wallet:"0xLmN0...P12Q", name:"Alice Wong", country:"SG", kyc:"approved", tokens:300, asset:"WIND-07", value:"€3,645", pct:"1.0%" },
  { wallet:"0xRsT3...U45V", name:"Bob Lee", country:"HK", kyc:"approved", tokens:800, asset:"LOGX-06", value:"€8,960", pct:"3.2%" },
];

export default function RegistryPage() {
  const [search, setSearch] = useState("");
  const filtered = SAMPLE_REGISTRY.filter(r =>
    !search || Object.values(r).some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Head><title>Shareholder Registry — Admin</title></Head>
      <AdminShell title="Digital Shareholder Registry" subtitle="Real-time cap table mapping wallet addresses to verified legal identities">
        <style>{`
          .sr-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden}
          .sr-search{width:320px;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;font-size:13px;color:#fff;outline:none;font-family:inherit;margin-bottom:16px}
          .sr-table{width:100%;border-collapse:collapse}
          .sr-table th{text-align:left;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px;padding:12px 14px;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);background:#161B22}
          .sr-table td{padding:12px 14px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.7)}
          .sr-table tr:hover td{background:rgba(255,255,255,0.02)}
        `}</style>

        <input className="sr-search" placeholder="Search wallet, name, asset..." value={search} onChange={e=>setSearch(e.target.value)} />
        <div className="sr-card">
          <table className="sr-table">
            <thead><tr><th>Wallet</th><th>Legal Identity</th><th>Country</th><th>KYC</th><th>Asset</th><th>Tokens</th><th>Value</th><th>Ownership %</th></tr></thead>
            <tbody>
              {filtered.map((r,i) => (
                <tr key={i}>
                  <td style={{fontFamily:"monospace",color:"#F0B90B",fontSize:11}}>{r.wallet}</td>
                  <td style={{fontWeight:600,color:"#fff"}}>{r.name}</td>
                  <td>{r.country}</td>
                  <td><span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(14,203,129,0.12)",color:"#0ECB81"}}>{r.kyc}</span></td>
                  <td style={{fontWeight:600,color:"#F0B90B"}}>{r.asset}</td>
                  <td>{r.tokens.toLocaleString()}</td>
                  <td style={{fontWeight:600}}>{r.value}</td>
                  <td>{r.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminShell>
    </>
  );
}
