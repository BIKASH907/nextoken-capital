import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminShell from "../../components/admin/AdminShell";
export default function Reports() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  useEffect(() => { const t = localStorage.getItem("adminToken"); if(!t) router.push("/admin/login"); setToken(t); }, []);
  const headers = { Authorization: "Bearer " + token };
  const generate = async (type) => {
    setLoading(true); setSelectedType(type);
    const r = await fetch("/api/admin/regulatory/reports?type="+type, { headers });
    setReport(await r.json()); setLoading(false);
  };
  const reports = [
    { type:"sar", label:"Suspicious Activity Report", desc:"High/critical risk alerts for regulatory filing" },
    { type:"transaction_summary", label:"Transaction Summary", desc:"All completed transactions with volume" },
    { type:"aml", label:"AML Compliance Report", desc:"Compliance and financial audit entries" },
    { type:"casp_quarterly", label:"CASP Quarterly (MiCA)", desc:"Quarterly return for MiCA CASP reporting" },
  ];
  return (
    <AdminShell title="Regulatory Reports" subtitle="Generate reports for MiCA, AML, SAR compliance.">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
        {reports.map((r,i) => (
          <div key={i} onClick={()=>generate(r.type)} style={{ background:"#161b22", border:selectedType===r.type?"1px solid #F0B90B":"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"16px 20px", cursor:"pointer" }}>
            <div style={{ fontSize:14, fontWeight:700, color:selectedType===r.type?"#F0B90B":"#fff" }}>{r.label}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{r.desc}</div>
          </div>
        ))}
      </div>
      {loading && <div style={{ textAlign:"center", padding:20, color:"rgba(255,255,255,0.3)" }}>Generating report...</div>}
      {report && !loading && (
        <div style={{ background:"#161b22", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", padding:20 }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#F0B90B", marginBottom:4 }}>{report.type}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:16 }}>Period: {new Date(report.period?.from).toLocaleDateString()} — {new Date(report.period?.to).toLocaleDateString()}</div>
          <pre style={{ background:"#0a0e14", borderRadius:8, padding:16, fontSize:11, color:"rgba(255,255,255,0.6)", overflow:"auto", maxHeight:400, fontFamily:"monospace", whiteSpace:"pre-wrap" }}>{JSON.stringify(report, null, 2)}</pre>
        </div>
      )}
    </AdminShell>
  );
}
