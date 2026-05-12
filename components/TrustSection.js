import React from "react";
import { useTranslation } from "react-i18next";

export default function TrustSection() {
  const { t } = useTranslation();
  const pipeline = [
    { n: "1", t: t("trust.kybTitle"),      d: t("trust.kybDesc"),      c: "#F0B90B" },
    { n: "2", t: t("trust.ddTitle"),       d: t("trust.ddDesc"),       c: "#3B82F6" },
    { n: "3", t: t("trust.legalTitle"),    d: t("trust.legalDesc"),    c: "#0ECB81" },
    { n: "4", t: t("trust.contractTitle"), d: t("trust.contractDesc"), c: "#8B5CF6" },
    { n: "5", t: t("trust.approvalTitle"), d: t("trust.approvalDesc"), c: "#EF4444" },
  ];
  const cards = [
    { icon: "🔗", t: t("trust.nonCustodialTitle"), d: t("trust.nonCustodialDesc"), bc: "rgba(240,185,11,0.1)" },
    { icon: "📜", t: t("trust.rightsTitle"),       d: t("trust.rightsDesc"),       bc: "rgba(59,130,246,0.1)" },
    { icon: "🛡️", t: t("trust.ownershipTitle"),    d: t("trust.ownershipDesc"),    bc: "rgba(14,203,129,0.1)" },
    { icon: "🔐", t: t("trust.kycTitle"),          d: t("trust.kycDesc"),          bc: "rgba(139,92,246,0.1)" },
    { icon: "⛓️", t: t("trust.onchainTitle"),      d: t("trust.onchainDesc"),      bc: "rgba(239,68,68,0.1)" },
    { icon: "💶", t: t("trust.paymentsTitle"),     d: t("trust.paymentsDesc"),     bc: "rgba(20,184,166,0.1)" },
  ];
  const bar = [
    { n: "ERC-3643", l: t("trust.barErc") },
    { n: "Polygon",  l: t("trust.barPolygon") },
    { n: "Sumsub",   l: t("trust.barSumsub") },
    { n: "Monerium", l: t("trust.barMonerium") },
  ];
  return (
    <section style={{ background: "#080A0E", padding: "80px 20px", color: "#fff", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(240,185,11,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#F0B90B", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>{t("trust.eyebrow")}</div>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>{t("trust.title")}</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>{t("trust.lead")}</p>
        </div>
        <div className="trust-pipeline" style={{ marginBottom: 64 }}>
          {pipeline.map((s, i) => (
            <div key={i} style={{ flex: 1, minWidth: 120, background: "#0F1318", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 16px", textAlign: "center", position: "relative" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.c + "20", border: "2px solid " + s.c + "40", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 13, fontWeight: 900, color: s.c }}>{s.n}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{s.t}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{s.d}</div>
            </div>
          ))}
        </div>
        <div className="trust-cards" style={{ marginBottom: 48 }}>
          {cards.map((c, i) => (
            <div key={i} style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 28 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: c.bc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>{c.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{c.t}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{c.d}</div>
            </div>
          ))}
        </div>
        <div className="trust-bar">
          {bar.map((t2, i) => (
            <div key={i} style={{ textAlign: "center", padding: "18px 12px", background: "rgba(240,185,11,0.03)", border: "1px solid rgba(240,185,11,0.08)", borderRadius: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#F0B90B", marginBottom: 2 }}>{t2.n}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{t2.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
