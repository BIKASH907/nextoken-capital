import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#0B0E11", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "60px 20px 30px", color: "#fff", fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#F0B90B" }}>NXT</span>
            <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.15)" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: 1, lineHeight: 1.2 }}>NEXTOKEN</div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5 }}>CAPITAL</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 16 }}>{t("footer.tagline")}</p>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            {t("footer.address")}<br />{t("footer.city")}
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>{t("footer.company")}</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[{ label: t("footer.about"), href: "/about" }, { label: t("footer.careers"), href: "/careers" }, { label: t("footer.contact"), href: "/contact" }, { label: t("footer.press"), href: "/press" }].map((l) => (
              <li key={l.href} style={{ marginBottom: 10 }}>
                <Link href={l.href} style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", fontSize: 14, transition: "color .15s" }}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>{t("footer.resources")}</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[{ label: t("footer.documentation"), href: "/learn" }, { label: t("footer.blog"), href: "/blog" }, { label: t("footer.fees"), href: "/fees" }, { label: t("footer.status"), href: "/status" }, { label: t("footer.support"), href: "/support" }].map((l) => (
              <li key={l.href} style={{ marginBottom: 10 }}>
                <Link href={l.href} style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", fontSize: 14 }}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>{t("footer.legal")}</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[{ label: t("footer.privacy"), href: "/privacy" }, { label: t("footer.terms"), href: "/terms" }, { label: t("footer.risk"), href: "/risk" }, { label: t("footer.compliance"), href: "/compliance" }].map((l) => (
              <li key={l.href} style={{ marginBottom: 10 }}>
                <Link href={l.href} style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", fontSize: 14 }}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>{t("footer.copyright", { year })}</p>
        <div style={{ display: "flex", gap: 20 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{t("footer.micaReady")}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{t("footer.euFramework")}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{t("footer.erc3643")}</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
