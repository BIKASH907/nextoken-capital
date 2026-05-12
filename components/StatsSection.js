import React from "react";
import { useTranslation } from "react-i18next";

export default function StatsSection() {
  const { t } = useTranslation();
  const stats = [
    { icon: "🏢", n: "5+",        l: t("stats.listings"),         c: "rgba(240,185,11,0.06)", bc: "rgba(240,185,11,0.12)" },
    { icon: "🌍", n: "3",         l: t("stats.countries"),        c: "rgba(59,130,246,0.06)", bc: "rgba(59,130,246,0.12)" },
    { icon: "⛓️", n: "24/7",      l: t("stats.settlement"),       c: "rgba(14,203,129,0.06)", bc: "rgba(14,203,129,0.12)" },
    { icon: "🔐", n: t("stats.nonCustodialLabel"), l: t("stats.directPurchases"), c: "rgba(139,92,246,0.06)", bc: "rgba(139,92,246,0.12)" },
  ];
  return (
    <section style={{ background: "#0B0E11", padding: "0 20px 80px", color: "#fff", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} style={{ background: s.c, border: "1px solid " + s.bc, borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{s.n}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
