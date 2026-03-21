import Head from "next/head";
const ENDPOINTS = [{ method: "GET", path: "/v1/markets", desc: "List all tokenized asset markets", auth: false }, { method: "GET", path: "/v1/bonds", desc: "List all bond listings with yields and status", auth: false }, { method: "GET", path: "/v1/bonds/:id", desc: "Get a specific bond listing by ID", auth: false }, { method: "POST", path: "/v1/orders", desc: "Place a buy or sell order", auth: true }, { method: "GET", path: "/v1/portfolio", desc: "Get authenticated user portfolio", auth: true }, { method: "POST", path: "/v1/tokenize", desc: "Submit an asset for tokenization review", auth: true }, { method: "GET", path: "/v1/status", desc: "Platform health and uptime status", auth: false }];
export default function ApiDocsPage() {
  const s = { page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "80px 20px" }, wrap: { maxWidth: 900, margin: "0 auto" }, tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }, h1: { fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 }, sub: { fontSize: 16, color: "#848e9c", marginBottom: 48 }, row: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 10, padding: "16px 20px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" } };
  return (
    <>
      <Head><title>API Docs — Nextoken Capital</title></Head>
      <div style={s.page}><div style={s.wrap}>
        <div style={s.tag}>Developer Docs</div>
        <h1 style={s.h1}>Nextoken <span style={{ color: "#f0b90b" }}>API</span></h1>
        <p style={s.sub}>Base URL: <code style={{ color: "#f0b90b" }}>https://api.nextokencapital.com</code></p>
        {ENDPOINTS.map((ep, i) => (
          <div key={i} style={s.row}>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 6, fontFamily: "monospace", flexShrink: 0, background: ep.method === "GET" ? "#0d3a1a" : "#1a2a4a", color: ep.method === "GET" ? "#02c076" : "#4dabf7" }}>{ep.method}</span>
            <span style={{ fontSize: 14, fontFamily: "monospace", color: "#eaecef", flex: 1, minWidth: 160 }}>{ep.path}</span>
            <span style={{ fontSize: 13, color: "#848e9c", flex: 2, minWidth: 180 }}>{ep.desc}</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600, flexShrink: 0, background: ep.auth ? "rgba(240,185,11,0.1)" : "#1e2329", color: ep.auth ? "#f0b90b" : "#474d57" }}>{ep.auth ? "Auth required" : "Public"}</span>
          </div>
        ))}
        <div style={{ background: "#0f1117", border: "1px solid #1e2329", borderRadius: 12, padding: "24px", marginTop: 40, fontFamily: "monospace", fontSize: 13, lineHeight: 1.7, color: "#848e9c", overflowX: "auto" }}>
          <div style={{ color: "#474d57", marginBottom: 8 }}># Example: Get all bonds</div>
          <div>curl https://api.nextokencapital.com/v1/bonds \</div>
          <div>  -H "Authorization: Bearer YOUR_API_KEY"</div>
        </div>
        <div style={{ background: "rgba(240,185,11,0.06)", border: "1px solid rgba(240,185,11,0.2)", borderRadius: 14, padding: "32px", textAlign: "center", marginTop: 48 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Get API Access</div>
          <div style={{ fontSize: 13, color: "#848e9c", marginBottom: 24 }}>API access is available to verified platform users.</div>
          <a href="/contact" style={{ display: "inline-block", background: "#f0b90b", color: "#05060a", fontWeight: 800, padding: "12px 28px", borderRadius: 10, textDecoration: "none", fontSize: 14 }}>Request API Key</a>
        </div>
      </div></div>
    </>
  );
}
