import Head from "next/head";
import { useEffect, useState } from "react";

const SERVICES = [
  { name: "Trading Platform", status: "operational", uptime: "99.98%" },
  { name: "Bond Marketplace", status: "operational", uptime: "99.97%" },
  { name: "Tokenization Portal", status: "operational", uptime: "99.95%" },
  { name: "Exchange / Secondary Market", status: "operational", uptime: "99.99%" },
  { name: "KYC / Verification API", status: "operational", uptime: "99.94%" },
  { name: "Wallet Connection", status: "operational", uptime: "99.99%" },
  { name: "REST API", status: "operational", uptime: "99.96%" },
  { name: "Authentication", status: "operational", uptime: "100.00%" },
];

const statusStyle = {
  operational: { dot: "#02c076", label: "Operational", bg: "rgba(2,192,118,0.08)", border: "rgba(2,192,118,0.2)" },
  degraded: { dot: "#f0b90b", label: "Degraded", bg: "rgba(240,185,11,0.08)", border: "rgba(240,185,11,0.2)" },
  outage: { dot: "#ff6b6b", label: "Outage", bg: "rgba(255,107,107,0.08)", border: "rgba(255,107,107,0.2)" },
};

export default function StatusPage() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toUTCString());
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const allOk = SERVICES.every(s => s.status === "operational");

  const s = {
    page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "80px 20px" },
    wrap: { maxWidth: 800, margin: "0 auto" },
    tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 },
    h1: { fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 },
    banner: { borderRadius: 14, padding: "20px 24px", marginBottom: 40, display: "flex", alignItems: "center", gap: 14, border: "1px solid" },
    row: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 10, padding: "14px 20px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 },
    serviceName: { fontSize: 14, fontWeight: 500, color: "#eaecef" },
    right: { display: "flex", alignItems: "center", gap: 16 },
    uptime: { fontSize: 12, color: "#474d57" },
    statusPill: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600 },
  };

  return (
    <>
      <Head><title>Platform Status — Nextoken Capital</title></Head>
      <div style={s.page}>
        <div style={s.wrap}>
          <div style={s.tag}>Platform Status</div>
          <h1 style={s.h1}>Nextoken <span style={{ color: "#f0b90b" }}>Status</span></h1>
          <div style={{ fontSize: 12, color: "#474d57", marginBottom: 32 }}>Last updated: {time}</div>

          <div style={{ ...s.banner, background: allOk ? "rgba(2,192,118,0.08)" : "rgba(255,107,107,0.08)", borderColor: allOk ? "rgba(2,192,118,0.25)" : "rgba(255,107,107,0.25)" }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: allOk ? "#02c076" : "#ff6b6b", display: "inline-block", boxShadow: `0 0 10px ${allOk ? "#02c076" : "#ff6b6b"}`, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: allOk ? "#02c076" : "#ff6b6b" }}>{allOk ? "All Systems Operational" : "Some Systems Affected"}</div>
              <div style={{ fontSize: 12, color: "#848e9c", marginTop: 2 }}>Nextoken Capital · Vilnius, Lithuania · nextokencapital.com</div>
            </div>
          </div>

          {SERVICES.map((svc, i) => {
            const st = statusStyle[svc.status];
            return (
              <div key={i} style={s.row}>
                <span style={s.serviceName}>{svc.name}</span>
                <div style={s.right}>
                  <span style={s.uptime}>{svc.uptime} uptime</span>
                  <div style={s.statusPill}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: st.dot, display: "inline-block" }} />
                    <span style={{ color: st.dot }}>{st.label}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{ textAlign: "center", marginTop: 48, padding: "28px", background: "#0f1117", borderRadius: 14, border: "1px solid #1e2329" }}>
            <div style={{ fontSize: 14, color: "#848e9c", marginBottom: 12 }}>Experiencing an issue not shown here?</div>
#!/bin/bash

# ============================================================
#  Nextoken Capital — Create All 9 Missing Pages
#  Run from your project root: bash create-pages.sh
# ============================================================

set -e
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════╗"
echo "║   Nextoken — Creating 9 Missing Pages    ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

mkdir -p pages

# ════════════════════════════════════════════════════════════
# 1. /contact
# ════════════════════════════════════════════════════════════
echo -e "${GREEN}[1/9] Creating pages/contact.js...${NC}"
cat > pages/contact.js << 'EOF'
import Head from "next/head";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); setSent(true); };

  const s = {
    page: { minHeight: "100vh", background: "#05060a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "80px 20px" },
    wrap: { maxWidth: 1100, margin: "0 auto" },
    tag: { fontSize: 12, fontWeight: 700, color: "#f0b90b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 },
    h1: { fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 },
    sub: { fontSize: 16, color: "#848e9c", marginBottom: 60, maxWidth: 500 },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" },
    card: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 16, padding: "32px" },
    label: { fontSize: 12, fontWeight: 600, color: "#848e9c", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" },
    input: { width: "100%", background: "#1a1d23", border: "1px solid #2b3139", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, marginBottom: 16, boxSizing: "border-box", outline: "none" },
    btn: { width: "100%", padding: "13px", background: "#f0b90b", color: "#05060a", fontWeight: 800, fontSize: 14, border: "none", borderRadius: 10, cursor: "pointer" },
    infoCard: { background: "#0f1117", border: "1px solid #1e2329", borderRadius: 16, padding: "28px", marginBottom: 20 },
    infoTitle: { fontSize: 13, fontWeight: 700, color: "#f0b90b", marginBottom: 16 },
    infoRow: { display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 },
    infoIcon: { width: 36, height: 36, background: "rgba(240,185,11,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 },
    infoText: { fontSize: 13, color: "#848e9c", lineHeight: 1.6 },
    infoValue: { fontSize: 14, color: "#fff", fontWeight: 500 },
  };

  return (
    <>
      <Head><title>Contact Us — Nextoken Capital</title></Head>
      <div style={s.page}>
        <div style={s.wrap}>
          <div style={s.tag}>Get in touch</div>
          <h1 style={s.h1}>Contact <span style={{ color: "#f0b90b" }}>Nextoken Capital</span></h1>
          <p style={s.sub}>Our team in Vilnius, Lithuania is here to help. Reach out for support, partnerships, or general inquiries.</p>

          <div style={{ ...s.grid, gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
            {/* Form */}
            <div style={s.card}>
              {!sent ? (
                <form onSubmit={submit}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 24 }}>Send us a message</div>
                  {[["name","Your full name","text"],["email","Your email address","email"],["subject","Subject","text"]].map(([n,p,t]) => (
                    <div key={n}>
                      <label style={s.label}>{n}</label>
                      <input name={n} type={t} placeholder={p} value={form[n]} onChange={handle} required style={s.input} />
                    </div>
                  ))}
                  <label style={s.label}>Message</label>
                  <textarea name="message" placeholder="How can we help you?" value={form.message} onChange={handle} required rows={5} style={{ ...s.input, resize: "none" }} />
                  <button type="submit" style={s.btn}>Send Message →</button>
                </form>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#02c076", marginBottom: 8 }}>Message Sent!</div>
                  <div style={{ fontSize: 14, color: "#848e9c" }}>We'll get back to you within 1–2 business days.</div>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div style={s.infoCard}>
                <div style={s.infoTitle}>OFFICE</div>
                {[
                  ["📍", "Address", "Gynėjų g. 14, Vilnius 01109, Lithuania 🇱🇹"],
                  ["🏢", "Company", "Nextoken Capital UAB"],
                  ["👤", "CEO & Founder", "Bikash Bhat"],
                  ["🏦", "Regulated by", "Bank of Lithuania"],
                  ["✉️", "Email", "support@nextokencapital.com"],
                  ["🕐", "Office Hours", "Mon–Fri, 9am–6pm EET"],
                ].map(([icon, label, value]) => (
                  <div key={label} style={s.infoRow}>
                    <div style={s.infoIcon}>{icon}</div>
                    <div>
                      <div style={s.infoText}>{label}</div>
                      <div style={s.infoValue}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ ...s.infoCard, background: "rgba(240,185,11,0.05)", border: "1px solid rgba(240,185,11,0.2)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f0b90b", marginBottom: 8 }}>⚡ 24/7 AI Support</div>
                <div style={{ fontSize: 13, color: "#848e9c", lineHeight: 1.6 }}>Use the chat bubble at the bottom-right of any page for instant answers, available around the clock.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
