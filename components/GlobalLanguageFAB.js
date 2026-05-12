import dynamic from "next/dynamic";

// Client-only — LanguageSelector reads localStorage / navigator.language
const LanguageSelector = dynamic(() => import("./LanguageSelector"), { ssr: false });

export default function GlobalLanguageFAB() {
  return (
    <div
      style={{
        position: "fixed",
        top: 76,          // ↓ below the 64px navbar so it doesn't overlap Log In / Connect Wallet
        right: 14,
        zIndex: 9001,     // ↓ behind navbar (9000) so the navbar bar always wins above 64px
        pointerEvents: "auto",
      }}
    >
      <LanguageSelector />
    </div>
  );
}
