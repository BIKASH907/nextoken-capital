import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function StickyDemoBar() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("nxt_demo_dismissed") === "1") {
        setDismissed(true);
        return;
      }
    } catch (e) {}
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9500,
        transform: visible ? "translateY(0)" : "translateY(120%)",
        transition: "transform 0.35s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto 14px",
          background: "linear-gradient(135deg, #F0B90B 0%, #FFD000 100%)",
          color: "#0B0E11",
          borderRadius: 14,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, flex: "1 1 200px", minWidth: 200 }}>
          {t("lead.demoTitle")}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a
            href="mailto:hello@nextokencapital.com?subject=Institutional%20Demo%20request"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", background: "#0B0E11", color: "#F0B90B", borderRadius: 9, fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            {t("lead.demoBtn")} →
          </a>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => {
              setDismissed(true);
              try { sessionStorage.setItem("nxt_demo_dismissed", "1"); } catch (e) {}
            }}
            style={{ background: "transparent", border: "none", color: "#0B0E11", fontSize: 20, lineHeight: 1, cursor: "pointer", padding: "0 6px", fontWeight: 800 }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
