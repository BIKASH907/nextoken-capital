import { useState } from "react";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

const SAMPLE_TRANSFERS = [
  { txHash:"0x1a2b...3c4d", date:"2025-03-24 14:32", from:"0xAbC...123", fromName:"John Doe", fromCountry:"DE", to:"0xDeF...456", toName:"Jane Smith", toCountry:"LT", amount:"€5,000", asset:"SOLAR-01", status:"verified" },
  { txHash:"0x5e6f...7g8h", date:"2025-03-24 12:15", from:"0xGhI...789", fromName:"Corp Ltd", fromCountry:"GB", to:"0xJkL...012", toName:"Acme GmbH", toCountry:"AT", amount:"€25,000", asset:"OFFIC-03", status:"verified" },
  { txHash:"0x9i0j...1k2l", date:"2025-03-23 18:45", from:"0xMnO...345", fromName:"Alice Wong", fromCountry:"SG", to:"0xPqR...678", toName:"Bob Lee", toCountry:"HK", amount:"€12,500", asset:"WIND-07", status:"pending" },
];

export default function TravelRulePage() {
  const [search, setSearch] = useState("");
  const filtered = SAMPLE_TRANSFERS.filter(t =>
    !search || Object.values(t).some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Head><title>Travel Rule — Admin</title></Head>
      <AdminShell title="Travel Rule (TFR) Audit Log" subtitle="On-chain transfers with verified originator and beneficiary identity data">
        <style>{`
          .tr-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;margin-bottom:16px}
          .tr-search{width:100%;max-width:320px;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;font-size:13px;color:#fff;outline:none;font-family:inherit;margin-bottom:16px}
          .tr-table{width:100%;border-collapse:collapse}
          .tr-table th{text-align:left;font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px;padding:12px 14px;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);background:#161B22}
          .tr-table td{padding:12px 14px;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.7)}
          .tr-table tr:hover td{background:rgba(255,255,255,0.02)}
          .tr-hash{font-family:monospace;color:#F0B90B;font-size:11px}
          .tr-addr{font-family:monospace;font-size:11px;color:rgba(255,255,255,0.4)}
          .tr-name{font-size:12px;font-weight:600;color:#fff}
          .tr-country{font-size:11px;color:rgba(255,255,255,0.35)}
          .tr-status{padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700}
          .tr-verified{background:rgba(14,203,129,0.12);color:#0ECB81}
          .tr-pending{background:rgba(240,185,11,0.12);color:#F0B90B}
          .tr-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
          .tr-stat{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px}
          .tr-stat-v{font-size:1.4rem;font-weight:900;margin-bottom:3px}
          .tr-stat-l{font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.5px}
        `}</style>

        <div className="tr-stat-grid">
          <div className="tr-stat"><div className="tr-stat-v" style={{color:"#fff"}}>{SAMPLE_TRANSFERS.length}</div><div className="tr-stat-l">Total Transfers</div></div>
          <div className="tr-stat"><div className="tr-stat-v" style={{color:"#0ECB81"}}>{SAMPLE_TRANSFERS.filter(t=>t.status==="verified").length}</div><div className="tr-stat-l">Verified</div></div>
          <div className="tr-stat"><div className="tr-stat-v" style={{color:"#F0B90B"}}>{SAMPLE_TRANSFERS.filter(t=>t.status==="pending").length}</div><div className="tr-stat-l">Pending</div></div>
          <div className="tr-stat"><div className="tr-stat-v" style={{color:"#0ECB81"}}>100%</div><div className="tr-stat-l">Compliance Rate</div></div>
        </div>

        <input className="tr-search" placeholder="Search by tx hash, name, address..." value={search} onChange={e=>setSearch(e.target.value)} />

        <div className="tr-card">
          <table className="tr-table">
            <thead><tr><th>Tx Hash</th><th>Date</th><th>Originator</th><th>Beneficiary</th><th>Amount</th><th>Asset</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.txHash}>
                  <td><span className="tr-hash">{t.txHash}</span></td>
                  <td>{t.date}</td>
                  <td><div className="tr-name">{t.fromName}</div><div className="tr-addr">{t.from}</div><div className="tr-country">{t.fromCountry}</div></td>
                  <td><div className="tr-name">{t.toName}</div><div className="tr-addr">{t.to}</div><div className="tr-country">{t.toCountry}</div></td>
                  <td style={{fontWeight:700,color:"#fff"}}>{t.amount}</td>
                  <td style={{color:"#F0B90B",fontWeight:600}}>{t.asset}</td>
                  <td><span className={`tr-status ${t.status==="verified"?"tr-verified":"tr-pending"}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminShell>
    </>
  );
}
