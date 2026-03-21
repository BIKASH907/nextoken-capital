import Head from "next/head";
import { useEffect, useState } from "react";
const SERVICES = [{ name: "Trading Platform", uptime: "99.98%" }, { name: "Bond Marketplace", uptime: "99.97%" }, { name: "Tokenization Portal", uptime: "99.95%" }, { name: "Exchange / Secondary Market", uptime: "99.99%" }, { name: "KYC / Verification API", uptime: "99.94%" }, { name: "Wallet Connection", uptime: "99.99%" }, { name: "REST API", uptime: "99.96%" }, { name: "Authentication", uptime: "100.00%" }];
export default function StatusPage() {
  const [time, setTime] = useState("");
  useEffect(() => { const update = () => setTime(new Date().toUTCString()); update(); const t = setInterval(update, 1000); return () => clearInterval(t); }, []);
  const s = { page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "80px 20px" }, wrap: { maxWidth: 800, margin: "0 auto" }, tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }, h1: { fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 }, row: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 10, padding: "14px 20px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 } };
  return (
    <>
      <Head><title>Platform Status — Nextoken Capital</title></Head>
      <div style={s.page}><div style={s.wrap}>
        <div style={s.tag}>Platform Status</div>
        <h1 style={s.h1}>Nextoken <span style={{ color: "#f0b90b" }}>Status</span></h1>
        <div style={{ fontSize: 12, color: "#474d57", marginBottom: 32 }}>Last updated: {time}</div>
        <div style={{ background: "rgba(2,192,118,0.08)", border: "1px solid rgba(2,192,118,0.25)", borderRadius: 14, padding: "20px 24px", marginBottom: 40, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#02c076", display: "inline-block", boxShadow: "0 0 10px #02c076", flexShrink: 0 }} />
          <div><div style={{ fontSize: 16, fontWeight: 700, color: "#02c076" }}>All Systems Operational</div><div style={{ fontSize: 12, color: "#848e9c", marginTop: 2 }}>Nextoken Capital · Vilnius, Lithuania</div></div>
        </div>
        {SERVICES.map((svc, i) => (
          <div key={i} style={s.row}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#eaecef" }}>{svc.name}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 12, color: "#474d57" }}>{svc.uptime} uptime</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#02c076", display: "inline-block" }} />
                <span style={{ color: "#02c076" }}>Operational</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: 48, padding: "28px", background: "#0f1117", borderRadius: 14, border: "1px solid #1e2329" }}>
          <div style={{ fontSize: 14, color: "#848e9c", marginBottom: 12 }}>Experiencing an issue?</div>
          <a href="/contact" style={{ display: "inline-block", background: "#f0b90b", color: "#05060a", fontWeight: 800, padding: "11px 24px", borderRadius: 10, textDecoration: "none", fontSize: 14 }}>Report an Issue</a>
        </div>
      </div></div>
    </>
  );
}
