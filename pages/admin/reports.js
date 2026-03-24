import { useState } from "react";
import Head from "next/head";
import AdminShell from "../../components/admin/AdminShell";

export default function ReportsPage() {
  const [tab, setTab] = useState("casp");

  const tabs = [
    { id:"casp", label:"CASP Returns" },
    { id:"sar", label:"SAR Portal" },
    { id:"tax", label:"Tax Reporting" },
  ];

  return (
    <>
      <Head><title>Reports — Admin</title></Head>
      <AdminShell title="Regulatory Reporting" subtitle="CASP quarterly returns, suspicious activity reports, and tax documentation">
        <style>{`
          .rp-tabs{display:flex;gap:4px;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.07)}
          .rp-tab{padding:10px 18px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit}
          .rp-tab.on{color:#F0B90B;border-bottom-color:#F0B90B}
          .rp-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:24px;margin-bottom:16px}
          .rp-report{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.05)}
          .rp-report:last-child{border:none}
          .rp-btn{padding:8px 18px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:none;font-family:inherit;background:#F0B90B;color:#000}
          .rp-btn:hover{background:#FFD000}
          .rp-btn-ghost{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1)}
          .rp-field{margin-bottom:14px}
          .rp-label{display:block;font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
          .rp-input{width:100%;background:#161B22;color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;font-size:13px;outline:none;font-family:inherit}
          .rp-input:focus{border-color:rgba(240,185,11,0.4)}
          .rp-textarea{resize:vertical;min-height:80px}
        `}</style>

        <div className="rp-tabs">{tabs.map(t => <button key={t.id} className={`rp-tab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>

        {tab === "casp" && (
          <div className="rp-card">
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>CASP Return Generator</div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20,lineHeight:1.7}}>
              Generate quarterly reports required by the Bank of Lithuania and ESMA under MiCA CASP regulations.
            </p>
            {[
              { period:"Q1 2025 (Jan–Mar)", status:"Ready", date:"Due: Apr 15, 2025" },
              { period:"Q4 2024 (Oct–Dec)", status:"Submitted", date:"Submitted: Jan 10, 2025" },
              { period:"Q3 2024 (Jul–Sep)", status:"Submitted", date:"Submitted: Oct 8, 2024" },
            ].map(r => (
              <div key={r.period} className="rp-report">
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{r.period}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:2}}>{r.date}</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:r.status==="Ready"?"rgba(240,185,11,0.1)":"rgba(14,203,129,0.1)",color:r.status==="Ready"?"#F0B90B":"#0ECB81"}}>{r.status}</span>
                  <button className={r.status==="Ready"?"rp-btn":"rp-btn rp-btn-ghost"}>
                    {r.status==="Ready"?"Generate Report":"Download"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "sar" && (
          <div className="rp-card">
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Suspicious Activity Report (SAR)</div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20,lineHeight:1.7}}>
              Pre-fill and submit reports to FNTT (Financial Crime Investigation Service of Lithuania).
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div className="rp-field"><label className="rp-label">Subject Name</label><input className="rp-input" placeholder="Full legal name" /></div>
              <div className="rp-field"><label className="rp-label">Subject Email</label><input className="rp-input" placeholder="email@example.com" /></div>
              <div className="rp-field"><label className="rp-label">Transaction Reference</label><input className="rp-input" placeholder="Tx hash or ID" /></div>
              <div className="rp-field"><label className="rp-label">Amount (EUR)</label><input className="rp-input" type="number" placeholder="0" /></div>
            </div>
            <div className="rp-field"><label className="rp-label">Reason / Suspicion Details</label><textarea className="rp-input rp-textarea" placeholder="Describe the suspicious activity..." /></div>
            <div className="rp-field"><label className="rp-label">Supporting Evidence</label><input className="rp-input" type="file" /></div>
            <button className="rp-btn" style={{marginTop:8}}>Submit SAR to FNTT →</button>
          </div>
        )}

        {tab === "tax" && (
          <div className="rp-card">
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Tax Reporting Module</div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20,lineHeight:1.7}}>
              Generate annual capital gains and income statements for platform users.
            </p>
            <div style={{display:"flex",gap:10,marginBottom:20}}>
              <select className="rp-input" style={{width:200}}>
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
              </select>
              <button className="rp-btn">Generate All User Reports</button>
              <button className="rp-btn rp-btn-ghost">Export CSV</button>
            </div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>Reports include: investment income, capital gains/losses, dividend distributions, and fee summaries per user.</p>
          </div>
        )}
      </AdminShell>
    </>
  );
}
