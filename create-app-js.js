const fs = require("fs");

const code = `import { useState, useEffect } from "react";
import { RainbowKitProvider, getDefaultWallets, darkTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import Head from "next/head";
import "@rainbow-me/rainbowkit/styles.css";

// ─── Chain & Wallet Config ───────────────────────────────────
const { chains, publicClient } = configureChains(
  [mainnet, polygon, arbitrum, optimism, base],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Nextoken Capital",
  projectId: "nextoken-capital-rwa",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

// ─── Global Styles ───────────────────────────────────────────
const globalStyles = \`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    background: #05060a;
    color: #e8e8f0;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  a {
    color: inherit;
  }

  button {
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #05060a;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(240, 185, 11, 0.3);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(240, 185, 11, 0.5);
  }

  ::selection {
    background: rgba(240, 185, 11, 0.25);
    color: #e8e8f0;
  }

  /* RainbowKit overrides */
  [data-rk] {
    font-family: 'DM Sans', sans-serif !important;
  }

  [data-rk] button {
    font-weight: 700 !important;
    font-family: 'DM Sans', sans-serif !important;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  .fade-in   { animation: fadeIn   0.3s ease both; }
  .fade-up   { animation: fadeUp   0.35s ease both; }
  .slide-down{ animation: slideDown 0.25s ease both; }
  .pulse     { animation: pulse    2s infinite; }
  .spin      { animation: spin     1s linear infinite; }

  /* Page transition */
  .page-enter {
    animation: fadeUp 0.3s ease both;
  }
\`;

// ─── Toast Notification ──────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: { bg:"rgba(34,197,94,0.12)",  border:"rgba(34,197,94,0.3)",  color:"#22c55e",  icon:"✅" },
    error:   { bg:"rgba(239,68,68,0.12)",   border:"rgba(239,68,68,0.3)",   color:"#f87171",  icon:"❌" },
    warning: { bg:"rgba(245,158,11,0.12)", border:"rgba(245,158,11,0.3)", color:"#f59e0b",  icon:"⚠️" },
    info:    { bg:"rgba(240,185,11,0.12)", border:"rgba(240,185,11,0.3)", color:"#F0B90B",  icon:"ℹ️" },
  };
  const c = colors[type] || colors.info;

  return (
    <div style={{
      position:"fixed", bottom:24, right:24, zIndex:9999,
      display:"flex", alignItems:"center", gap:12,
      padding:"14px 18px", borderRadius:12,
      background:c.bg, border:"1px solid "+c.border,
      boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
      maxWidth:360, animation:"slideDown 0.25s ease both",
      backdropFilter:"blur(12px)",
    }}>
      <span style={{ fontSize:18, flexShrink:0 }}>{c.icon}</span>
      <p style={{ fontSize:13.5, color:c.color, margin:0, fontWeight:500, lineHeight:1.5 }}>{message}</p>
      <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", color:c.color, cursor:"pointer", fontSize:18, lineHeight:1, flexShrink:0, opacity:0.7 }}>×</button>
    </div>
  );
}

// ─── Cookie Consent Banner ───────────────────────────────────
function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("nxt_cookies");
    if (!accepted) setTimeout(() => setShow(true), 2000);
  }, []);

  function accept() {
    localStorage.setItem("nxt_cookies", "accepted");
    setShow(false);
  }

  function decline() {
    localStorage.setItem("nxt_cookies", "declined");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:9998,
      background:"rgba(13,13,20,0.98)", borderTop:"1px solid rgba(240,185,11,0.2)",
      padding:"18px 32px", backdropFilter:"blur(20px)",
      display:"flex", flexWrap:"wrap", alignItems:"center", gap:16, justifyContent:"space-between",
    }}>
      <div style={{ flex:1, minWidth:260 }}>
        <p style={{ fontSize:14, fontWeight:600, color:"#e8e8f0", margin:"0 0 4px" }}>🍪 Cookie Notice</p>
        <p style={{ fontSize:12.5, color:"#8a9bb8", margin:0, lineHeight:1.6 }}>
          We use essential cookies to operate the platform and optional analytics cookies to improve your experience.
          Read our <a href="/privacy" style={{ color:"#F0B90B", textDecoration:"none" }}>Privacy Policy</a>.
        </p>
      </div>
      <div style={{ display:"flex", gap:10, flexShrink:0 }}>
        <button onClick={decline} style={{ padding:"9px 20px", borderRadius:8, border:"1px solid rgba(255,255,255,0.12)", background:"transparent", color:"#8a9bb8", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
          Decline
        </button>
        <button onClick={accept} style={{ padding:"9px 20px", borderRadius:8, background:"#F0B90B", color:"#000", fontSize:13, fontWeight:800, border:"none", cursor:"pointer", fontFamily:"inherit" }}>
          Accept All
        </button>
      </div>
    </div>
  );
}

// ─── Wallet Backup Reminder ──────────────────────────────────
function WalletBackupReminder() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("nxt_wallet_backup");
    if (!dismissed) setTimeout(() => setShow(true), 5000);
  }, []);

  function dismiss() {
    localStorage.setItem("nxt_wallet_backup", "dismissed");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div style={{
      position:"fixed", top:80, right:20, zIndex:9997,
      width:300, background:"#0d0d14",
      border:"1px solid rgba(240,185,11,0.35)", borderRadius:14,
      padding:18, boxShadow:"0 8px 40px rgba(0,0,0,0.5)",
      animation:"slideDown 0.3s ease both",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <span style={{ fontSize:20 }}>🔐</span>
        <p style={{ fontSize:14, fontWeight:700, color:"#F0B90B", margin:0 }}>Wallet Backup Guide</p>
        <button onClick={dismiss} style={{ marginLeft:"auto", background:"none", border:"none", color:"#8a9bb8", cursor:"pointer", fontSize:18 }}>×</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
        {[
          { icon:"📝", text:"Write down your 12 or 24-word recovery phrase on physical paper." },
          { icon:"🔒", text:"Store backups in a secure, fireproof location." },
          { icon:"🚨", text:"If you lose your recovery phrase, your assets cannot be recovered." },
        ].map(item => (
          <div key={item.icon} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <span style={{ fontSize:14, flexShrink:0 }}>{item.icon}</span>
            <p style={{ fontSize:12, color:"#8a9bb8", margin:0, lineHeight:1.6 }}>{item.text}</p>
          </div>
        ))}
      </div>
      <div style={{ padding:"8px 12px", borderRadius:8, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", marginBottom:12 }}>
        <p style={{ fontSize:11.5, color:"#f87171", fontWeight:600, margin:0 }}>
          🛡 Nextoken will NEVER ask for your seed phrase.
        </p>
      </div>
      <button onClick={dismiss} style={{ width:"100%", padding:"9px 0", borderRadius:8, background:"rgba(240,185,11,0.12)", border:"1px solid rgba(240,185,11,0.3)", color:"#F0B90B", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
        Got it — I have backed up my wallet
      </button>
    </div>
  );
}

// ─── Page Progress Bar ───────────────────────────────────────
function ProgressBar({ loading }) {
  if (!loading) return null;
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, height:2, zIndex:99999, background:"rgba(240,185,11,0.15)" }}>
      <div style={{
        height:"100%", background:"linear-gradient(90deg,#F0B90B,#fcd34d,#F0B90B)",
        backgroundSize:"200% 100%",
        animation:"shimmer 1.2s infinite",
        width:"100%",
      }} />
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────
export default function App({ Component, pageProps, router }) {
  const [pageLoading, setPageLoading] = useState(false);
  const [toast, setToast]             = useState(null);

  // Page loading indicator
  useEffect(() => {
    function start() { setPageLoading(true);  }
    function stop()  { setPageLoading(false); }
    router.events.on("routeChangeStart",    start);
    router.events.on("routeChangeComplete", stop);
    router.events.on("routeChangeError",    stop);
    return () => {
      router.events.off("routeChangeStart",    start);
      router.events.off("routeChangeComplete", stop);
      router.events.off("routeChangeError",    stop);
    };
  }, [router]);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({
          accentColor:          "#F0B90B",
          accentColorForeground:"#000000",
          borderRadius:         "medium",
          fontStack:            "system",
          overlayBlur:          "small",
        })}
        appInfo={{
          appName: "Nextoken Capital",
          learnMoreUrl: "https://nextokencapital.com/learn",
        }}
        coolMode
      >
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#05060a" />

          {/* Default SEO — overridden per page */}
          <title>Nextoken Capital — Tokenized Real-World Assets</title>
          <meta name="description" content="The regulated infrastructure for tokenized real-world assets. Invest in bonds, equity, real estate and energy tokens across 180+ countries." />
          <meta name="keywords" content="tokenized assets, RWA, blockchain IPO, digital bonds, equity tokens, ERC-3643, real estate tokenization" />

          {/* Open Graph */}
          <meta property="og:type"        content="website" />
          <meta property="og:url"         content="https://nextokencapital.com" />
          <meta property="og:title"       content="Nextoken Capital — Tokenized Real-World Assets" />
          <meta property="og:description" content="Regulated digital asset infrastructure for modern investors and issuers across 180+ countries." />
          <meta property="og:image"       content="https://nextokencapital.com/og-image.png" />

          {/* Twitter */}
          <meta name="twitter:card"        content="summary_large_image" />
          <meta name="twitter:site"        content="@nextokencapital" />
          <meta name="twitter:title"       content="Nextoken Capital" />
          <meta name="twitter:description" content="Regulated tokenized real-world asset infrastructure." />

          {/* Favicons */}
          <link rel="icon"             href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

          {/* Canonical */}
          <link rel="canonical" href={"https://nextokencapital.com" + (router.asPath === "/" ? "" : router.asPath)} />
        </Head>

        {/* Global Styles */}
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

        {/* Page Loading Bar */}
        <ProgressBar loading={pageLoading} />

        {/* Page */}
        <div className="page-enter" key={router.pathname}>
          <Component {...pageProps} />
        </div>

        {/* Wallet Backup Reminder — shows 5s after load */}
        <WalletBackupReminder />

        {/* Cookie Consent */}
        <CookieBanner />

        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

      </RainbowKitProvider>
    </WagmiConfig>
  );
}
`;

fs.writeFileSync("pages/_app.js", code, "utf8");
console.log("Done! pages/_app.js — " + code.length + " chars");
console.log("");
console.log("Includes:");
console.log("  ✓ RainbowKit — MetaMask, Coinbase, WalletConnect, Rainbow, Trust Wallet");
console.log("  ✓ Wagmi — Ethereum, Polygon, Arbitrum, Optimism, Base chains");
console.log("  ✓ Global fonts — Syne + DM Sans + DM Mono");
console.log("  ✓ Page loading progress bar");
console.log("  ✓ Wallet backup reminder popup (5s after load)");
console.log("  ✓ Cookie consent banner");
console.log("  ✓ Toast notification system");
console.log("  ✓ Full SEO meta tags + Open Graph + Twitter cards");
console.log("  ✓ Page transition animations");
console.log("  ✓ Dark scrollbar, text selection, global resets");