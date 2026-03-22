// components/Navbar.js
// Reads user, wallet, portfolio from AppContext.
// Shows wallet balance when connected, user avatar when logged in.
// Works on EVERY page automatically via _app.js AppProvider.

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useApp } from "../lib/AppContext";

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const router = useRouter();
  const { user, wallet, portfolio, logout, connectWallet } = useApp();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); setShowUser(false); }, [router.asPath]);

  const links = [
    { href:"/markets",    label:"Markets" },
    { href:"/exchange",   label:"Exchange" },
    { href:"/bonds",      label:"Bonds" },
    { href:"/equity-ipo", label:"Equity & IPO" },
    { href:"/tokenize",   label:"Tokenize" },
  ];

  const isActive = (href) => router.asPath === href;

  return (
    <>
      <style>{`
        .nb{position:fixed;top:0;left:0;right:0;z-index:1000;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transition:background .3s,border-color .3s}
        .nb.sc{background:rgba(11,14,17,0.97);border-bottom:1px solid rgba(240,185,11,0.15)}
        .nb.tp{background:rgba(11,14,17,0.80);border-bottom:1px solid rgba(255,255,255,0.05)}
        .nb-in{max-width:1280px;margin:0 auto;height:64px;padding:0 20px;display:flex;align-items:center;justify-content:space-between}
        .logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .logo-nxt{font-size:20px;font-weight:900;color:#F0B90B;letter-spacing:-.5px}
        .logo-ln{width:1px;height:28px;background:rgba(255,255,255,0.15)}
        .logo-tx{display:flex;flex-direction:column;line-height:1.1}
        .logo-tx .t1{font-size:11px;font-weight:800;color:#fff;letter-spacing:2px}
        .logo-tx .t2{font-size:9px;color:rgba(255,255,255,0.4);letter-spacing:3px}
        .nl{display:flex;align-items:center;gap:2px}
        .nl a{padding:6px 14px;border-radius:6px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.65);text-decoration:none;transition:color .15s,background .15s}
        .nl a:hover{color:#fff;background:rgba(255,255,255,0.07)}
        .nl a.on{color:#F0B90B;background:rgba(240,185,11,0.09)}
        .nr{display:flex;align-items:center;gap:8px;position:relative}
        .btn-li{padding:7px 16px;border-radius:6px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.75);background:transparent;border:1px solid rgba(255,255,255,0.15);text-decoration:none;transition:all .15s}
        .btn-li:hover{border-color:rgba(255,255,255,0.4);color:#fff}
        .btn-gs{padding:7px 18px;border-radius:6px;font-size:13px;font-weight:700;color:#000;background:#F0B90B;border:none;text-decoration:none;transition:background .15s;cursor:pointer}
        .btn-gs:hover{background:#FFD000}
        .btn-wallet{padding:7px 14px;border-radius:6px;font-size:12px;font-weight:700;color:#0ECB81;background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.25);cursor:pointer;transition:all .15s;white-space:nowrap}
        .btn-wallet:hover{background:rgba(14,203,129,0.18)}
        .btn-wallet.connected{color:#0ECB81}
        .user-btn{width:34px;height:34px;border-radius:50%;background:rgba(240,185,11,0.15);border:1.5px solid rgba(240,185,11,0.4);display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;color:#F0B90B;font-weight:800;transition:all .15s}
        .user-btn:hover{background:rgba(240,185,11,0.25)}
        .user-dropdown{position:absolute;top:calc(100% + 10px);right:0;background:#161B22;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:8px;min-width:220px;box-shadow:0 8px 32px rgba(0,0,0,0.4)}
        .ud-header{padding:10px 12px 12px;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:6px}
        .ud-name{font-size:13px;font-weight:700;color:#fff}
        .ud-email{font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px}
        .ud-portfolio{display:flex;justify-content:space-between;margin-top:10px;padding:8px 0;border-top:1px solid rgba(255,255,255,0.07)}
        .ud-pv{font-size:14px;font-weight:800;color:#F0B90B}
        .ud-pl{font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.5px;margin-top:1px}
        .ud-item{display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:8px;font-size:13px;color:rgba(255,255,255,0.7);text-decoration:none;transition:all .15s;cursor:pointer;width:100%;background:none;border:none;text-align:left}
        .ud-item:hover{background:rgba(255,255,255,0.06);color:#fff}
        .ud-item.danger{color:#FF6B6B}
        .ud-item.danger:hover{background:rgba(255,77,77,0.08)}
        .hbg{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}
        .hbg span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:all .3s}
        .mm{display:none;position:fixed;inset:0;top:64px;background:rgba(9,12,15,0.98);backdrop-filter:blur(20px);padding:20px;overflow-y:auto;z-index:999;flex-direction:column;gap:6px}
        .mm.op{display:flex}
        .mm a{display:block;padding:14px 16px;border-radius:10px;font-size:16px;font-weight:600;color:rgba(255,255,255,0.75);text-decoration:none;border:1px solid rgba(255,255,255,0.07);transition:all .15s}
        .mm a:hover,.mm a.on{color:#F0B90B;background:rgba(240,185,11,0.07);border-color:rgba(240,185,11,0.2)}
        .mm-div{height:1px;background:rgba(255,255,255,0.08);margin:8px 0}
        .mm-wallet{display:block;padding:13px 16px;border-radius:10px;text-align:center;font-size:14px;font-weight:700;color:#0ECB81;background:rgba(14,203,129,0.08);border:1px solid rgba(14,203,129,0.2);margin-bottom:8px;cursor:pointer;width:100%}
        .mm-reg{display:block;padding:14px 16px;border-radius:10px;text-align:center;font-size:15px;font-weight:700;color:#000;background:#F0B90B;text-decoration:none}
        @media(max-width:1024px){.nl{display:none}}
        @media(max-width:768px){.btn-li,.btn-gs,.btn-wallet{display:none!important}.hbg{display:flex!important}.user-btn{display:flex!important}}
        @media(min-width:769px){.user-dropdown{display:block!important}}
      `}</style>

      <nav className={`nb ${scrolled ? "sc" : "tp"}`}>
        <div className="nb-in">

          {/* Logo */}
          <Link href="/" className="logo">
            <span className="logo-nxt">NXT</span>
            <div className="logo-ln" />
            <div className="logo-tx">
              <span className="t1">NEXTOKEN</span>
              <span className="t2">CAPITAL</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="nl">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? "on" : ""}>{l.label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div className="nr">
            {/* Wallet button */}
            {wallet.connected ? (
              <button className="btn-wallet connected">
                💳 €{wallet.balance.toLocaleString("en-EU", { minimumFractionDigits:2 })}
              </button>
            ) : (
              <button className="btn-wallet" onClick={() => connectWallet()}>
                Connect Wallet
              </button>
            )}

            {/* User menu or login/register */}
            {user ? (
              <div style={{ position:"relative" }}>
                <button className="user-btn" onClick={() => setShowUser(!showUser)}>
                  {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                </button>
                {showUser && (
                  <div className="user-dropdown">
                    <div className="ud-header">
                      <div className="ud-name">{user.firstName} {user.lastName}</div>
                      <div className="ud-email">{user.email}</div>
                      <div className="ud-portfolio">
                        <div>
                          <div className="ud-pv">€{portfolio.totalValue.toLocaleString("en-EU", { minimumFractionDigits:2 })}</div>
                          <div className="ud-pl">Portfolio Value</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div className="ud-pv" style={{ color: portfolio.totalReturn >= 0 ? "#0ECB81" : "#FF4D4D" }}>
                            {portfolio.totalReturn >= 0 ? "+" : ""}€{portfolio.totalReturn.toFixed(2)}
                          </div>
                          <div className="ud-pl">Total Return</div>
                        </div>
                      </div>
                    </div>
                    <Link href="/dashboard" className="ud-item">📊 Dashboard</Link>
                    <Link href="/markets"   className="ud-item">🏪 Markets</Link>
                    <Link href="/exchange"  className="ud-item">🔄 Exchange</Link>
                    <div className="mm-div" />
                    <button className="ud-item danger" onClick={logout}>🚪 Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login"    className="btn-li">Log In</Link>
                <Link href="/register" className="btn-gs">Get Started</Link>
              </>
            )}

            {/* Hamburger */}
            <button className="hbg" onClick={() => setOpen(!open)} aria-label="Menu">
              <span style={{ transform: open ? "rotate(45deg) translate(5px,5px)" : "none" }} />
              <span style={{ opacity: open ? 0 : 1 }} />
              <span style={{ transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mm ${open ? "op" : ""}`}>
        {links.map(l => (
          <Link key={l.href} href={l.href} className={isActive(l.href) ? "on" : ""}>{l.label}</Link>
        ))}
        <div className="mm-div" />
        {user ? (
          <>
            <Link href="/dashboard" className="mm-reg" style={{ background:"rgba(240,185,11,0.1)", color:"#F0B90B", marginBottom:8 }}>
              📊 Dashboard
            </Link>
            <button className="mm-wallet" onClick={logout}>🚪 Log Out</button>
          </>
        ) : (
          <>
            <button className="mm-wallet" onClick={() => connectWallet()}>
              {wallet.connected ? `💳 €${wallet.balance.toFixed(2)}` : "Connect Wallet"}
            </button>
            <Link href="/register" className="mm-reg">Get Started — Free</Link>
          </>
        )}
      </div>
    </>
  );
}