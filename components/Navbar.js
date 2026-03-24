import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const WALLETS = [
  {
    id: "metamask",
    name: "MetaMask",
    desc: "Most popular browser wallet",
    icon: "🦊",
    check: () => typeof window !== "undefined" && !!window.ethereum?.isMetaMask,
    connect: async () => {
      const acc = await window.ethereum.request({ method: "eth_requestAccounts" });
      return acc[0];
    },
    install: "https://metamask.io/download/",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    desc: "By Coinbase exchange",
    icon: "🔵",
    check: () => typeof window !== "undefined" && !!window.ethereum?.isCoinbaseWallet,
    connect: async () => {
      const acc = await window.ethereum.request({ method: "eth_requestAccounts" });
      return acc[0];
    },
    install: "https://www.coinbase.com/wallet/downloads",
  },
  {
    id: "trust",
    name: "Trust Wallet",
    desc: "Mobile & browser wallet",
    icon: "🛡️",
    check: () => typeof window !== "undefined" && !!window.ethereum?.isTrust,
    connect: async () => {
      const acc = await window.ethereum.request({ method: "eth_requestAccounts" });
      return acc[0];
    },
    install: "https://trustwallet.com/download",
  },
  {
    id: "brave",
    name: "Brave Wallet",
    desc: "Built into Brave browser",
    icon: "🦁",
    check: () => typeof window !== "undefined" && !!window.ethereum?.isBraveWallet,
    connect: async () => {
      const acc = await window.ethereum.request({ method: "eth_requestAccounts" });
      return acc[0];
    },
    install: "https://brave.com/download/",
  },
  {
    id: "phantom",
    name: "Phantom",
    desc: "Solana & EVM wallet",
    icon: "👻",
    check: () => typeof window !== "undefined" && !!window.phantom?.ethereum,
    connect: async () => {
      const acc = await window.phantom.ethereum.request({ method: "eth_requestAccounts" });
      return acc[0];
    },
    install: "https://phantom.app/download",
  },
  {
    id: "okx",
    name: "OKX Wallet",
    desc: "By OKX exchange",
    icon: "⭕",
    check: () => typeof window !== "undefined" && !!window.okxwallet,
    connect: async () => {
      const acc = await window.okxwallet.request({ method: "eth_requestAccounts" });
      return acc[0];
    },
    install: "https://www.okx.com/web3/wallet",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    desc: "Scan QR with any mobile wallet",
    icon: "🔗",
    check: () => false,
    connect: async () => null,
    install: "https://walletconnect.com/",
    comingSoon: true,
  },
  {
    id: "ledger",
    name: "Ledger",
    desc: "Hardware wallet",
    icon: "🔐",
    check: () => false,
    connect: async () => null,
    install: "https://www.ledger.com/",
    comingSoon: true,
  },
];

export default function Navbar() {
  const [open, setOpen]             = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [wallet, setWallet]         = useState(null);
  const [walletName, setWalletName] = useState("");
  const [showModal, setShowModal]   = useState(false);
  const [connecting, setConnecting] = useState(null);
  const [error, setError]           = useState("");
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [router.asPath]);

  // Auto-reconnect on load
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then(acc => {
        if (acc.length > 0) { setWallet(acc[0]); setWalletName("Wallet"); }
      });
      window.ethereum.on("accountsChanged", acc => {
        if (acc.length > 0) setWallet(acc[0]);
        else { setWallet(null); setWalletName(""); }
      });
    }
  }, []);

  const handleConnect = async (w) => {
    if (w.comingSoon) return;
    if (!w.check()) { window.open(w.install, "_blank"); return; }
    setConnecting(w.id);
    setError("");
    try {
      const address = await w.connect();
      if (address) {
        setWallet(address);
        setWalletName(w.name);
        setShowModal(false);
      }
    } catch {
      setError("Connection cancelled or failed. Please try again.");
    } finally {
      setConnecting(null);
    }
  };

  const disconnect = () => { setWallet(null); setWalletName(""); setShowModal(false); };

  const isActive  = (href) => router.asPath === href;
  const shortAddr = wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : null;

  const links = [
    { href: "/markets",    label: "Markets" },
    { href: "/exchange",   label: "Exchange" },
    { href: "/bonds",      label: "Bonds" },
    { href: "/equity-ipo", label: "Equity & IPO" },
    { href: "/tokenize",   label: "Tokenize" },
    { href: "/owner-dashboard", label: "My Assets" },
    { href: "/owner-dashboard", label: "List Asset" },
  ];

  return (
    <>
      <style>{`
        .nb{position:fixed;top:0;left:0;right:0;z-index:9000;height:64px;display:flex;align-items:center;transition:background .2s,border-color .2s}
        .nb.sc{background:#0B0E11;border-bottom:1px solid rgba(240,185,11,0.2);box-shadow:0 2px 20px rgba(0,0,0,0.5)}
        .nb.tp{background:rgba(11,14,17,0.93);border-bottom:1px solid rgba(255,255,255,0.06)}
        .nb-in{width:100%;max-width:1280px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;gap:16px}
        .nb-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0}
        .nb-nxt{font-size:20px;font-weight:900;color:#F0B90B;letter-spacing:-.5px}
        .nb-vl{width:1px;height:26px;background:rgba(255,255,255,0.2)}
        .nb-txt{display:flex;flex-direction:column;line-height:1.2}
        .nb-t1{font-size:11px;font-weight:800;color:#fff;letter-spacing:2px}
        .nb-t2{font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:3px}
        .nb-links{display:flex;align-items:center;gap:2px;flex:1;justify-content:center}
        .nb-links a{padding:7px 14px;border-radius:7px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.7);text-decoration:none;transition:color .15s,background .15s;white-space:nowrap}
        .nb-links a:hover{color:#fff;background:rgba(255,255,255,0.08)}
        .nb-links a.on{color:#F0B90B;background:rgba(240,185,11,0.1)}
        .nb-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
        .nb-cw{padding:8px 18px;border-radius:7px;font-size:13px;font-weight:700;color:#000;background:#F0B90B;border:none;cursor:pointer;white-space:nowrap;transition:background .15s;font-family:inherit}
        .nb-cw:hover{background:#FFD000}
        .nb-cw.on{background:transparent;color:#F0B90B;border:1.5px solid rgba(240,185,11,0.4)}
        .nb-cw.on:hover{background:rgba(240,185,11,0.08)}
        .nb-li{padding:8px 18px;border-radius:7px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.8);background:transparent;border:1px solid rgba(255,255,255,0.18);text-decoration:none;transition:all .15s;white-space:nowrap}
        .nb-li:hover{border-color:rgba(255,255,255,0.45);color:#fff}
        .nb-hbg{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}
        .nb-hbg span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:all .25s}
        .nb-mob{display:none;position:fixed;top:64px;left:0;right:0;bottom:0;background:rgba(9,12,15,0.99);padding:20px;overflow-y:auto;z-index:8999;flex-direction:column;gap:6px}
        .nb-mob.open{display:flex}
        .nb-mob a{display:block;padding:15px 18px;border-radius:10px;font-size:16px;font-weight:600;color:rgba(255,255,255,0.8);text-decoration:none;border:1px solid rgba(255,255,255,0.08);transition:all .15s}
        .nb-mob a:hover,.nb-mob a.on{color:#F0B90B;background:rgba(240,185,11,0.08);border-color:rgba(240,185,11,0.22)}
        .nb-mob-sep{height:1px;background:rgba(255,255,255,0.08);margin:10px 0}
        .nb-mob-cw{display:block;width:100%;padding:14px 18px;border-radius:10px;font-size:15px;font-weight:700;color:#000;background:#F0B90B;border:none;text-align:center;cursor:pointer;font-family:inherit;margin-bottom:8px}
        .nb-mob-li{display:block;padding:14px 18px;border-radius:10px;font-size:15px;font-weight:700;color:rgba(255,255,255,0.8);text-decoration:none;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);text-align:center}

        /* MODAL */
        .wm-ov{position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;animation:wfade .15s ease}
        @keyframes wfade{from{opacity:0}to{opacity:1}}
        .wm-box{background:#0F1318;border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:28px;width:100%;max-width:460px;animation:wup .2s ease}
        @keyframes wup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .wm-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
        .wm-title{font-size:18px;font-weight:800;color:#fff}
        .wm-x{background:none;border:none;color:rgba(255,255,255,0.4);font-size:24px;cursor:pointer;line-height:1;padding:2px 6px;transition:color .15s}
        .wm-x:hover{color:#fff}
        .wm-sub{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:22px;line-height:1.6}
        .wm-grid{display:flex;flex-direction:column;gap:8px}
        .wm-row{display:flex;align-items:center;gap:14px;padding:13px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:#161B22;cursor:pointer;transition:all .15s}
        .wm-row:hover{border-color:rgba(240,185,11,0.4);background:rgba(240,185,11,0.04)}
        .wm-row.spin{opacity:.6;pointer-events:none}
        .wm-row.soon{opacity:.45;cursor:default}
        .wm-row.soon:hover{border-color:rgba(255,255,255,0.08);background:#161B22}
        .wm-ico{font-size:26px;width:34px;text-align:center;flex-shrink:0}
        .wm-info{flex:1}
        .wm-name{font-size:14px;font-weight:700;color:#fff;margin-bottom:2px}
        .wm-desc{font-size:12px;color:rgba(255,255,255,0.38)}
        .wm-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;flex-shrink:0}
        .wm-badge.ok{background:rgba(14,203,129,0.12);color:#0ECB81;border:1px solid rgba(14,203,129,0.3)}
        .wm-badge.get{background:rgba(240,185,11,0.1);color:#F0B90B;border:1px solid rgba(240,185,11,0.25)}
        .wm-badge.soon{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.35);border:1px solid rgba(255,255,255,0.1)}
        .wm-spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.1);border-top-color:#F0B90B;border-radius:50%;animation:wspin .6s linear infinite;flex-shrink:0}
        @keyframes wspin{to{transform:rotate(360deg)}}
        .wm-err{background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.25);border-radius:8px;padding:10px 14px;font-size:12px;color:#FF6B6B;margin-top:12px;line-height:1.6}
        .wm-connected{text-align:center;padding:8px 0 4px}
        .wm-conn-addr{font-size:16px;font-weight:800;color:#F0B90B;margin-bottom:4px}
        .wm-conn-via{font-size:12px;color:rgba(255,255,255,0.38);margin-bottom:22px}
        .wm-disc{width:100%;padding:13px;background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.25);border-radius:9px;color:#FF6B6B;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s}
        .wm-disc:hover{background:rgba(255,77,77,0.15)}
        .wm-note{font-size:11px;color:rgba(255,255,255,0.22);text-align:center;margin-top:16px;line-height:1.7}
        .wm-note a{color:#F0B90B}

        @media(max-width:900px){.nb-links{display:none}}
        @media(max-width:640px){.nb-li,.nb-cw{display:none}.nb-hbg{display:flex}}
      `}</style>

      {/* NAVBAR */}
      <nav className={`nb ${scrolled ? "sc" : "tp"}`}>
        <div className="nb-in">
          <Link href="/" className="nb-logo">
            <span className="nb-nxt">NXT</span>
            <div className="nb-vl" />
            <div className="nb-txt">
              <span className="nb-t1">NEXTOKEN</span>
              <span className="nb-t2">CAPITAL</span>
            </div>
          </Link>

          <div className="nb-links">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? "on" : ""}>{l.label}</Link>
            ))}
          </div>

          <div className="nb-right">
            <button className={`nb-cw ${wallet ? "on" : ""}`} onClick={() => setShowModal(true)}>
              {wallet ? `● ${shortAddr}` : "Connect Wallet"}
            </button>
            <Link href="/login" className="nb-li">Log In</Link>
            <button className="nb-hbg" onClick={() => setOpen(!open)} aria-label="Menu">
              <span style={{ transform: open ? "rotate(45deg) translate(5px,5px)" : "none" }} />
              <span style={{ opacity: open ? 0 : 1 }} />
              <span style={{ transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`nb-mob ${open ? "open" : ""}`}>
        {links.map(l => (
          <Link key={l.href} href={l.href} className={isActive(l.href) ? "on" : ""}>{l.label}</Link>
        ))}
        <div className="nb-mob-sep" />
        <button className="nb-mob-cw" onClick={() => { setOpen(false); setShowModal(true); }}>
          {wallet ? `● ${shortAddr}` : "Connect Wallet"}
        </button>
        <Link href="/login" className="nb-mob-li">Log In</Link>
      </div>

      {/* WALLET MODAL */}
      {showModal && (
        <div className="wm-ov" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="wm-box">
            <div className="wm-head">
              <div className="wm-title">{wallet ? "Wallet Connected" : "Connect a Wallet"}</div>
              <button className="wm-x" onClick={() => setShowModal(false)}>×</button>
            </div>

            {wallet ? (
              <div className="wm-connected">
                <div style={{ fontSize: 44, marginBottom: 14 }}>✅</div>
                <div className="wm-conn-addr">{shortAddr}</div>
                <div className="wm-conn-via">Connected via {walletName}</div>
                <button className="wm-disc" onClick={disconnect}>Disconnect Wallet</button>
              </div>
            ) : (
              <>
                <p className="wm-sub">Select your preferred wallet to connect to Nextoken Capital.</p>
                <div className="wm-grid">
                  {WALLETS.map(w => {
                    const installed = w.check();
                    const isLoading = connecting === w.id;
                    return (
                      <div
                        key={w.id}
                        className={`wm-row ${isLoading ? "spin" : ""} ${w.comingSoon ? "soon" : ""}`}
                        onClick={() => handleConnect(w)}
                      >
                        <div className="wm-ico">{w.icon}</div>
                        <div className="wm-info">
                          <div className="wm-name">{w.name}</div>
                          <div className="wm-desc">{w.desc}</div>
                        </div>
                        {isLoading ? (
                          <div className="wm-spinner" />
                        ) : w.comingSoon ? (
                          <span className="wm-badge soon">Soon</span>
                        ) : installed ? (
                          <span className="wm-badge ok">Installed ✓</span>
                        ) : (
                          <span className="wm-badge get">Install</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {error && <div className="wm-err">⚠️ {error}</div>}
                <p className="wm-note">
                  By connecting you agree to our{" "}
                  <Link href="/terms" onClick={() => setShowModal(false)}>Terms</Link> and{" "}
                  <Link href="/privacy" onClick={() => setShowModal(false)}>Privacy Policy</Link>.
                  We never store your private keys.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}