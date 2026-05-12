import dynamic from "next/dynamic";

// Client-only import — LanguageSelector reads localStorage / navigator.language
const LanguageSelector = dynamic(() => import("./LanguageSelector"), { ssr: false });

export default function GlobalLanguageFAB() {
  return (
    <div
      style={{
        position: "fixed",
        top: 14,
        right: 14,
        zIndex: 10000,
        pointerEvents: "auto",
      }}
    >
      <LanguageSelector />
    </div>
  );
}
