import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  const links = [
    { label: "Markets", href: "/markets" },
    { label: "Exchange", href: "/exchange" },
    { label: "Bonds", href: "/bonds" },
    { label: "Equity & IPO", href: "/equity" },
    { label: "Tokenize", href: "/tokenize" },
  ];

  const isActive = (href) => router.pathname === href;

  return (
    <>
      <header className={`navbar ${scrolled ? "navbarScrolled" : ""}`}>
        <div className="navContainer">
          <Link href="/" className="brand" aria-label="Nextoken Capital Home">
            <span className="brandLogoText">NXT</span>

            <span className="brandTextWrap">
              <span className="brandTitle">Nextoken Capital</span>
              <span className="brandSub">Digital Capital Markets</span>
            </span>
          </Link>

          <nav className="desktopNav" aria-label="Main navigation">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`navLink ${isActive(item.href) ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="desktopActions">
            <Link href="/login" className="loginBtn">
              Log In
            </Link>
            <div className="walletDesktop">
              <ConnectButton
                label="Connect Wallet"
                accountStatus="address"
                showBalance={false}
              />
            </div>
          </div>

          <button
            type="button"
            className={`menuButton ${menuOpen ? "menuButtonOpen" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div
          id="mobile-navigation"
          className={`mobileMenu ${menuOpen ? "mobileMenuOpen" : ""}`}
        >
          <div className="mobileMenuInner">
            <nav className="mobileNav" aria-label="Mobile navigation">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobileNavLink ${isActive(item.href) ? "mobileActive" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mobileActions">
              <Link href="/login" className="loginBtn mobileBtn">
                Log In
              </Link>

              <div className="walletMobile">
                <ConnectButton
                  label="Connect"
                  accountStatus="address"
                  showBalance={false}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(8, 11, 18, 0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(240, 185, 11, 0.18);
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .navbarScrolled {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.32);
          border-bottom-color: rgba(240, 185, 11, 0.28);
        }

        .navContainer {
          max-width: 1280px;
          min-height: 76px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-sizing: border-box;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
          min-width: fit-content;
        }

        .brandLogoText {
          color: #f0b90b;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 1px;
          line-height: 1;
        }

        .brandTextWrap {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .brandTitle {
          color: #ffffff;
          font-size: 18px;
          font-weight: 800;
          white-space: nowrap;
        }

        .brandSub {
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .desktopNav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          flex: 1;
        }

        .navLink {
          position: relative;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          white-space: nowrap;
          padding: 8px 0;
          transition: color 0.2s ease;
        }

        .navLink:hover {
          color: #f0b90b;
        }

        .navLink::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: #f0b90b;
          border-radius: 999px;
          transition: width 0.22s ease;
        }

        .navLink:hover::after,
        .navLink.active::after {
          width: 100%;
        }

        .navLink.active {
          color: #f0b90b;
        }

        .desktopActions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .walletDesktop {
          display: flex;
          align-items: center;
        }

        .loginBtn {
          min-height: 40px;
          padding: 0 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          transition: all 0.2s ease;
          color: #ffffff;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-sizing: border-box;
        }

        .loginBtn:hover {
          color: #f0b90b;
          border-color: rgba(240, 185, 11, 0.45);
          background: rgba(255, 255, 255, 0.03);
        }

        .menuButton {
          display: none;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
          padding: 0;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
        }

        .menuButton span {
          display: block;
          width: 18px;
          height: 2px;
          background: #ffffff;
          border-radius: 999px;
          transition: all 0.25s ease;
        }

        .menuButtonOpen span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .menuButtonOpen span:nth-child(2) {
          opacity: 0;
        }

        .menuButtonOpen span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .mobileMenu {
          display: none;
        }

        .walletMobile {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 10px;
        }

        @media (max-width: 980px) {
          .desktopNav,
          .desktopActions {
            display: none;
          }

          .menuButton {
            display: inline-flex;
          }

          .navContainer {
            min-height: 72px;
            padding: 0 16px;
          }

          .mobileMenu {
            display: grid;
            grid-template-rows: 0fr;
            overflow: hidden;
            transition: grid-template-rows 0.25s ease;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            background: rgba(8, 11, 18, 0.98);
          }

          .mobileMenuOpen {
            grid-template-rows: 1fr;
          }

          .mobileMenuInner {
            overflow: hidden;
          }

          .mobileNav {
            display: flex;
            flex-direction: column;
            padding: 10px 16px 0;
          }

          .mobileNavLink {
            text-decoration: none;
            color: rgba(255, 255, 255, 0.9);
            font-size: 15px;
            font-weight: 600;
            padding: 14px 2px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }

          .mobileNavLink:hover,
          .mobileActive {
            color: #f0b90b;
          }

          .mobileActions {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 16px;
          }

          .mobileBtn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}