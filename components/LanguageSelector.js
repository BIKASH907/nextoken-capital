import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n, { SUPPORTED_LANGUAGES, ensureLanguage } from "../lib/i18n";

export default function LanguageSelector() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCurrent(i18n.language || "en");
    const onChange = (lng) => setCurrent(lng);
    i18n.on("languageChanged", onChange);
    return () => i18n.off("languageChanged", onChange);
  }, []);

  const selectLang = async (code) => {
    setOpen(false);
    setSearch("");
    await ensureLanguage(code);
  };

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === current) || SUPPORTED_LANGUAGES[0];

  const filtered = SUPPORTED_LANGUAGES.filter((l) => {
    const q = search.toLowerCase();
    return l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q);
  });

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-label={t("language.label", "Language")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          color: "#fff",
          fontSize: 12,
          cursor: "pointer",
          fontFamily: "inherit",
          fontWeight: 600,
        }}
      >
        <span style={{ fontSize: 14 }}>{currentLang.flag}</span>
        <span>{currentLang.code.toUpperCase()}</span>
        <span style={{ fontSize: 8, opacity: 0.4 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 9998 }}
          />
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: 6,
              width: 280,
              maxHeight: 400,
              background: "#0F1318",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
              zIndex: 9999,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("language.search", "Search language...")}
                autoFocus
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6,
                  padding: "8px 10px",
                  fontSize: 12,
                  color: "#fff",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div style={{ overflowY: "auto", maxHeight: 340 }}>
              {filtered.map((l) => {
                const isCurrent = l.code === current;
                return (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => selectLang(l.code)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "10px 14px",
                      border: "none",
                      background: isCurrent ? "rgba(240,185,11,0.08)" : "transparent",
                      color: isCurrent ? "#F0B90B" : "rgba(255,255,255,0.6)",
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                      borderLeft: isCurrent ? "2px solid #F0B90B" : "2px solid transparent",
                    }}
                  >
                    <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{l.flag}</span>
                    <span style={{ fontWeight: isCurrent ? 700 : 400 }}>{l.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.3 }}>
                      {l.code.toUpperCase()}
                    </span>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ padding: 16, fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
                  No match
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
