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
