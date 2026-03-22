import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { label: "Markets",     href: "/markets"    },
    { label: "Exchange",    href: "/exchange"   },
    { label: "Bonds",       href: "/bonds"      },
    { label: "Equity & IPO",href: "/equity-ipo" },
    { label: "Tokenize",    href: "/tokenize"   },
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        if (!e.target.closest("[data-hamburger]")) setMenuOpen(false);
      }
    }
    function handleEsc(e) { if (e.key === "Escape") setMenuOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const active = (href) => router.pathname === href;

  return (
    <>
      <nav style={N.nav}>
        <div style={N.container}>

          {/* LOGO */}
          <Link href="/" style={N.logo} onClick={() => setMenuOpen(false)}>
            <span style={N.nxt}>NXT</span>
            <div style={N.divider} />
            <div>
              <div style={N.brand}>NEXTOKEN</div>
              <div style={N.sub}>CAPITAL</div>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="desk-links" style={N.links}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} style={{ ...N.link, ...(active(l.href) ? N.linkOn : {}) }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="desk-actions" style={N.actions}>
            <Link href="/login" style={N.loginBtn}>Log In</Link>
            
            <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} />
          </div>

          {/* HAMBURGER */}
          <button data-hamburger="true" className="hamburger" onClick={() => setMenuOpen(p => !p)}
            style={N.hamburger} aria-label="Toggle menu">
            <span style={N.bar} />
            <span style={N.bar} />
            <span style={N.bar} />
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="mobile-menu" ref={mobileMenuRef} style={N.mobileMenu}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ ...N.mobileLink, ...(active(l.href) ? N.mobileLinkOn : {}) }}>
                {l.label}
              </Link>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:8 }}>
              <Link href="/login" onClick={() => setMenuOpen(false)}
                style={{ flex:1, textAlign:"center", padding:"11px 0", borderRadius:10, border:"1px solid rgba(255,255,255,0.12)", background:"#11141b", color:"#fff", fontSize:14, fontWeight:700, textDecoration:"none" }}>
                Log In
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}
                style={{ flex:1, textAlign:"center", padding:"11px 0", borderRadius:10, background:"#F0B90B", color:"#000", fontSize:14, fontWeight:800, textDecoration:"none" }}>
                Get Started
              </Link>
            </div>
            <div style={{ marginTop:12, padding:12, borderRadius:12, background:"#11141b", border:"1px solid rgba(255,255,255,0.08)" }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#fff", margin:"0 0 8px" }}>Connect Wallet</p>
              <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} />
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @media (max-width: 980px) {
          .desk-links, .desk-actions { display: none !important; }
          .hamburger { display: flex !important; }
          .mobile-menu { display: flex !important; }
        }
        :global([data-rk] button) { font-weight: 800 !important; }
      `}</style>
    </>
  );
}

const N = {
  nav: {
    background: "#05060a",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "0 24px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    textDecoration: "none",
    flexShrink: 0,
  },
  nxt: {
    color: "#F0B90B",
    fontWeight: 900,
    fontSize: 26,
    letterSpacing: 1,
    lineHeight: 1,
  },
  divider: {
    width: 1,
    height: 22,
    background: "rgba(240,185,11,0.3)",
  },
  brand: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "1.5px",
    lineHeight: 1,
  },
  sub: {
    color: "#F0B90B",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "2.5px",
    marginTop: 3,
    textTransform: "uppercase",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  link: {
    color: "#8a9bb8",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: 8,
    whiteSpace: "nowrap",
    transition: "all 0.15s",
  },
  linkOn: {
    color: "#F0B90B",
    background: "rgba(240,185,11,0.10)",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  loginBtn: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: 13.5,
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "#11141b",
    padding: "9px 18px",
    borderRadius: 10,
    whiteSpace: "nowrap",
  },
  registerBtn: {
    color: "#000000",
    textDecoration: "none",
    fontSize: 13.5,
    fontWeight: 800,
    background: "#F0B90B",
    padding: "9px 18px",
    borderRadius: 10,
    whiteSpace: "nowrap",
  },
  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: 5,
    background: "transparent",
    border: "none",
    padding: 6,
    cursor: "pointer",
  },
  bar: {
    width: 22,
    height: 2,
    background: "#ffffff",
    borderRadius: 999,
    display: "block",
  },
  mobileMenu: {
    display: "none",
    flexDirection: "column",
    gap: 4,
    padding: "12px 24px 20px",
    maxWidth: 1400,
    margin: "0 auto",
  },
  mobileLink: {
    color: "#d6d9df",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
    padding: "11px 14px",
    borderRadius: 10,
    background: "#11141b",
  },
  mobileLinkOn: {
    color: "#F0B90B",
    background: "#171b22",
  },
};
