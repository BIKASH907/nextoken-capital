import { useTranslation } from "react-i18next";

const TEAM = [
  { name: "Bikash Bhat",        role: "CEO & Founder",         linkedin: "https://www.linkedin.com/in/bikash-bhat-87700318a", img: "/bikash.jpg", placeholder: false },
  { name: "[Compliance Lead]",  role: "Head of Compliance",    linkedin: "",                                                   img: "",            placeholder: true  },
  { name: "[CTO]",              role: "Chief Technology Officer", linkedin: "",                                               img: "",            placeholder: true  },
  { name: "[CFO]",              role: "Chief Financial Officer",  linkedin: "",                                               img: "",            placeholder: true  },
];

const PARTNERS = [
  { category: "categoryWallet",     name: "MetaMask · Ledger · WalletConnect", placeholder: false },
  { category: "categoryKyc",        name: "Sumsub",                            placeholder: false },
  { category: "categoryPayments",   name: "Monerium",                          placeholder: false },
  { category: "categoryBlockchain", name: "Polygon",                           placeholder: false },
  { category: "categoryAudit",      name: "Add smart contract auditor",        placeholder: true  },
  { category: "categoryLegal",      name: "Add legal advisor",                 placeholder: true  },
];

export default function TeamPartners() {
  const { t } = useTranslation();
  return (
    <>
      <section style={{ background: "#0B0E11", padding: "80px 20px", color: "#fff", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F0B90B", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>{t("team.eyebrow")}</div>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 10 }}>{t("team.title")}</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>{t("team.lead")}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
            {TEAM.map((m, i) => (
              <div key={i} style={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 20, textAlign: "center", opacity: m.placeholder ? 0.55 : 1, borderStyle: m.placeholder ? "dashed" : "solid" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 12px", background: m.img ? `url(${m.img}) center/cover` : "rgba(255,255,255,0.04)", border: m.placeholder ? "1px dashed rgba(255,255,255,0.2)" : "2px solid rgba(240,185,11,0.3)" }} />
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{m.role}</div>
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 10, fontSize: 11, color: "#F0B90B", textDecoration: "none" }}>LinkedIn →</a>
                )}
                {m.placeholder && (
                  <div style={{ marginTop: 10, fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{t("team.addPhoto")}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#080A0E", padding: "70px 20px", color: "#fff", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F0B90B", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>{t("partners.eyebrow")}</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>{t("partners.title")}</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>{t("partners.lead")}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {PARTNERS.map((p, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: p.placeholder ? "1px dashed rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "20px 16px", textAlign: "center", opacity: p.placeholder ? 0.55 : 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{t(`partners.${p.category}`)}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: p.placeholder ? "rgba(255,255,255,0.5)" : "#fff" }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
