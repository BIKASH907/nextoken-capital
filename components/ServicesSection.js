import React from "react";
import { useTranslation } from "react-i18next";

export default function ServicesSection() {
  const { t } = useTranslation();
  const categories = [
    { icon: "🏢", t: t("services.realEstateTitle"),  d: t("services.realEstateDesc"),  color: "#F0B90B" },
    { icon: "📊", t: t("services.bondsTitle"),       d: t("services.bondsDesc"),       color: "#3B82F6" },
    { icon: "⚡", t: t("services.energyTitle"),      d: t("services.energyDesc"),      color: "#0ECB81" },
    { icon: "🏭", t: t("services.commoditiesTitle"), d: t("services.commoditiesDesc"), color: "#8B5CF6" },
    { icon: "📈", t: t("services.equityTitle"),      d: t("services.equityDesc"),      color: "#EF4444" },
    { icon: "🌱", t: t("services.agricultureTitle"), d: t("services.agricultureDesc"), color: "#14B8A6" },
  ];
  const steps = [
    { n: "01", t: t("services.step1Title"), d: t("services.step1Desc"), color: "#F0B90B" },
    { n: "02", t: t("services.step2Title"), d: t("services.step2Desc"), color: "#3B82F6" },
    { n: "03", t: t("services.step3Title"), d: t("services.step3Desc"), color: "#0ECB81" },
    { n: "04", t: t("services.step4Title"), d: t("services.step4Desc"), color: "#8B5CF6" },
  ];
  return (
    <section style={{ background: "#0B0E11", padding: "80px 20px", color: "#fff", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#F0B90B", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>{t("services.categoryEyebrow")}</div>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>{t("services.categoryTitle")}</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>{t("services.categoryLead")}</p>
        </div>
        <div className="cats-grid" style={{ marginBottom: 80 }}>
          {categories.map((c, i) => (
            <div key={i} style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 28, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.color, opacity: 0.5 }} />
              <div style={{ fontSize: 32, marginBottom: 14 }}>{c.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{c.t}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{c.d}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#F0B90B", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>{t("services.howEyebrow")}</div>
          <h2 style={{ fontSize: 32, fontWeight: 900 }}>{t("services.howTitle")}</h2>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: 28, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, position: "relative" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: s.color + "15", border: "2px solid " + s.color + "30", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 18, fontWeight: 900, color: s.color }}>{s.n}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.t}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{s.d}</div>
              {i < 3 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
