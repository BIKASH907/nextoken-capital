import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Markets", href: "/markets" },
    { label: "Exchange", href: "/exchange" },
    { label: "Bonds", href: "/bonds" },
    { label: "Equity & IPO", href: "/equity" },
    { label: "Tokenize", href: "/tokenize" },
    { label: "Assets", href: "/assets" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const closeMenu = () => setMenuOpen(false);

  const isActive = (href) => {
    return router.pathname === href;
  };

  return (
    <>
      <header className={`navbar ${scrolled ? "navbarScrolled" : ""}`}>
        <div className="navbarInner">
          <Link href="/" className="brand" onClick={closeMenu}>
            <span className="brandLogo">NXT</span>
            <span className="brandTextWrap">
              <span className="brandTitle">Nextoken Capital</span>
              <span className="brandSub">Digital Capital Markets</span>
            </span>
          </Link>

          <nav className="desktopNav">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`navLink ${isActive(item.href) ? "activeLink" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="desktopActions">
            <Link href="/login" className="loginBtn">
              Log In
            </Link>
            <Link href="/register" className="registerBtn">
              Register
            </Link>
          </div>

          <button
            type="button"
            className={`menuToggle ${menuOpen ? "menuToggleOpen" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`mobilePanel ${menuOpen ? "mobilePanelOpen" : ""}`}>
          <div className="mobileLinks">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`mobileLink ${isActive(item.href) ? "activeMobileLink" : ""}`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mobileActions">
            <Link href="/login" className="loginBtn mobileActionBtn" onClick={closeMenu}>
              Log In
            </Link>
            <Link href="/register" className="registerBtn mobileActionBtn" onClick={closeMenu}>
              Register
            </Link>
          </div>
        </div>
      </header>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1200;
          width: 100%;
          background: rgba(6, 8, 14, 0.96);
          border-bottom: 1px solid rgba(255, 184, 0, 0.18);
          backdrop-filter: blur(14px);
          transition: all 0.25s ease;
        }

        .navbarScrolled {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.32);
          border-bottom-color: rgba(255, 184, 0, 0.24);
        }

        .navbarInner {
          max-width: 1280px;
          margin: 0 auto;
          min-height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 0 24px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          min-width: fit-content;
        }

        .brandLogo {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #fcd535, #c28a00);
          color: #111111;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 1px;
          box-shadow: 0 12px 26px rgba(252, 213, 53, 0.28);
          flex-shrink: 0;
        }

        .brandTextWrap {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }

        .brandTitle {
          color: #ffffff;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: 0.1px;
          white-space: nowrap;
        }

        .brandSub {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          font-weight: 600;
          margin-top: 3px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .desktopNav {
          display: flex;
          align-items: center;
          gap: 28px;
          flex: 1;
          justify-content: center;
        }

        .navLink {
          position: relative;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.88);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.1px;
          transition: color 0.2s ease;
          padding: 8px 0;
          white-space: nowrap;
        }

        .navLink:hover {
          color: #fcd535;
        }

        .navLink::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #fcd535, #e2ad10);
          transition: width 0.25s ease;
        }

        .navLink:hover::after,
        .activeLink::after {
          width: 100%;
        }

        .activeLink {
          color: #fcd535;
        }

        .desktopActions {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: fit-content;
        }

        .loginBtn,
        .registerBtn {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .loginBtn {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .loginBtn:hover {
          color: #fcd535;
          border-color: rgba(252, 213, 53, 0.35);
          background: rgba(255, 255, 255, 0.07);
        }

        .registerBtn {
          color: #111111;
          background: linear-gradient(135deg, #fcd535, #e0a800);
          border: 1px solid transparent;
          box-shadow: 0 12px 26px rgba(252, 213, 53, 0.2);
        }

        .registerBtn:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 32px rgba(252, 213, 53, 0.3);
        }

        .menuToggle {
          display: none;
          width: 46px;
          height: 46px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 0;
        }

        .menuToggle span {
          width: 19px;
          height: 2px;
          background: #ffffff;
          border-radius: 999px;
          transition: all 0.25s ease;
        }

        .menuToggleOpen span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .menuToggleOpen span:nth-child(2) {
          opacity: 0;
        }

        .menuToggleOpen span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .mobilePanel {
          display: none;
        }

        @media (max-width: 1100px) {
          .desktopNav {
            gap: 18px;
          }

          .navLink {
            font-size: 14px;
          }

          .brandTitle {
            font-size: 17px;
          }
        }

        @media (max-width: 920px) {
          .desktopNav,
          .desktopActions {
            display: none;
          }

          .menuToggle {
            display: inline-flex;
          }

          .navbarInner {
            min-height: 74px;
            padding: 0 16px;
          }

          .mobilePanel {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.28s ease;
            overflow: hidden;
            background: rgba(6, 8, 14, 0.99);
            border-top: 1px solid rgba(255, 255, 255, 0.06);
          }

          .mobilePanelOpen {
            grid-template-rows: 1fr;
          }

          .mobilePanelOpen > div,
          .mobilePanelOpen .mobileActions {
            min-height: 0;
          }

          .mobileLinks,
          .mobileActions {
            overflow: hidden;
          }

          .mobileLinks {
            display: flex;
            flex-direction: column;
            padding: 12px 16px 8px;
          }

          .mobileLink {
            text-decoration: none;
            color: rgba(255, 255, 255, 0.88);
            font-size: 15px;
            font-weight: 600;
            padding: 14px 2px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            transition: color 0.2s ease;
          }

          .mobileLink:hover,
          .activeMobileLink {
            color: #fcd535;
          }

          .mobileActions {
            display: flex;
            gap: 10px;
            padding: 14px 16px 18px;
          }

          .mobileActionBtn {
            flex: 1;
          }
        }

        @media (max-width: 640px) {
          .brand {
            gap: 10px;
          }

          .brandLogo {
            width: 42px;
            height: 42px;
            font-size: 12px;
            border-radius: 12px;
          }

          .brandTitle {
            font-size: 15px;
          }

          .brandSub {
            font-size: 10px;
          }

          .mobileActions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}