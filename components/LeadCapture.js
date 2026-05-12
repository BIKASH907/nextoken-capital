import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LeadCapture() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState("investor");
  const [status, setStatus] = useState("idle"); // idle | sending | ok | err

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/leads/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, intent, source: "homepage" }),
      });
      setStatus(res.ok ? "ok" : "err");
    } catch (e) {
      setStatus("err");
    }
  };

  return (
    <section style={{ background: "#0B0E11", padding: "70px 20px", color: "#fff", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", background: "#0F1318", border: "1px solid rgba(240,185,11,0.18)", borderRadius: 16, padding: "40px 28px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10, textAlign: "center" }}>{t("lead.title")}</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 24, textAlign: "center" }}>{t("lead.subtitle")}</p>

        {status === "ok" ? (
          <div style={{ background: "rgba(14,203,129,0.08)", border: "1px solid rgba(14,203,129,0.3)", borderRadius: 10, padding: "16px 20px", color: "#0ECB81", textAlign: "center", fontWeight: 700 }}>
            ✓ {t("lead.success")}
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("lead.placeholder")}
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, fontFamily: "inherit" }}
            />
            <select
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, fontFamily: "inherit" }}
            >
              <option value="investor">{t("lead.intent_investor")}</option>
              <option value="issuer">{t("lead.intent_issuer")}</option>
              <option value="institution">{t("lead.intent_institution")}</option>
              <option value="partner">{t("lead.intent_partner")}</option>
            </select>
            <button
              type="submit"
              disabled={status === "sending"}
              style={{ width: "100%", padding: "14px 16px", background: "#F0B90B", color: "#0B0E11", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: status === "sending" ? "wait" : "pointer", fontFamily: "inherit" }}
            >
              {status === "sending" ? "..." : t("lead.submit")}
            </button>
            {status === "err" && (
              <div style={{ fontSize: 13, color: "#FF6B6B", textAlign: "center" }}>{t("lead.error")}</div>
            )}
          </form>
        )}

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>{t("lead.demoTitle")}</div>
          <a href="mailto:hello@nextokencapital.com?subject=Demo%20request" style={{ display: "inline-block", padding: "10px 22px", background: "transparent", color: "#F0B90B", border: "1px solid rgba(240,185,11,0.4)", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            {t("lead.demoBtn")} →
          </a>
        </div>
      </div>
    </section>
  );
}
