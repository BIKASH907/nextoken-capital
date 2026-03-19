import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Markets", href: "/markets" },
    { label: "Exchange", href: "/exchange" },
    { label: "Bonds", href: "/bonds" },
    { label: "Equity & IPO", href: "/equity" },
    { label: "Tokenize", href: "/tokenize" },
  ];

  const isActive = (href) => router.pathname === href;

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navInner">
          <Link href="/" className="navLogo" onClick={closeMenu}>
            <span className="logoNxt">NXT</span>
            <span className="logoDivider" />
            <span className="logoTextWrap">
              <span className="logoTop">NEXTOKEN</span>
              <span className="logoBottom">CAPITAL</span>
            </span>
          </Link>

          <div className="navLinks">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navLink ${isActive(link.href) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navActions">
            <Link href="/login" className="btnLogin">
              Log In
            </Link>
            <Link href="/register" className="btnRegister">
              Register
            </Link>
          </div>

          <button
            type="button"
            className={`menuToggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`mobileMenu ${menuOpen ? "show" : ""}`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobileLink ${isActive(link.href) ? "active" : ""}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}

          <Link href="/login" className="mobileLogin" onClick={closeMenu}>
            Log In
          </Link>

          <Link
            href="/register"
            className="mobileRegister"
            onClick={closeMenu}
          >
            Register
          </Link>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(13, 13, 13, 0.96);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .navInner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
          min-height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .navLogo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          cursor: pointer;
          flex-shrink: 0;
        }

        .logoNxt {
          font-size: 22px;
          font-weight: 900;
          color: #f5c842;
          letter-spacing: 1px;
          line-height: 1;
        }

        .logoDivider {
          width: 1px;
          height: 28px;
          background: rgba(255, 255, 255, 0.15);
        }

        .logoTextWrap {
          display: flex;
          flex-direction: column;
          gap: 3px;
          line-height: 1;
        }

        .logoTop {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 2px;
        }

        .logoBottom {
          font-size: 9px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 2.5px;
        }

        .navLinks {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          gap: 4px;
          min-width: 0;
        }

        .navLink {
          text-decoration: none;
          color: rgba(255, 255, 255, 0.58);
          font-size: 14px;
          font-weight: 500;
          padding: 8px 14px;
          border-radius: 8px;
          white-space: nowrap;
          letter-spacing: 0.2px;
          transition: color 0.15s ease, background 0.15s ease;
        }

        .navLink:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .navLink.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .btnLogin,
        .btnRegister {
          text-decoration: none;
          white-space: nowrap;
        }

        .btnLogin {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 116px;
          height: 46px;
          padding: 0 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: transparent;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .btnLogin:hover {
          border-color: rgba(255, 255, 255, 0.45);
          background: rgba(255, 255, 255, 0.05);
        }

        .btnRegister {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 134px;
          height: 46px;
          padding: 0 22px;
          border-radius: 12px;
          background: #f5c842;
          color: #111111;
          font-size: 14px;
          font-weight: 800;
          transition: background 0.15s ease, transform 0.12s ease;
        }

        .btnRegister:hover {
          background: #ffd84d;
          transform: translateY(-1px);
        }

        .menuToggle {
          display: none;
          width: 44px;
          height: 44px;
          padding: 0;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: transparent;
          cursor: pointer;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          flex-shrink: 0;
        }

        .menuToggle span {
          display: block;
          width: 18px;
          height: 2px;
          background: #ffffff;
          border-radius: 2px;
          transition: all 0.2s ease;
        }

        .menuToggle.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .menuToggle.open span:nth-child(2) {
          opacity: 0;
        }

        .menuToggle.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .mobileMenu {
          display: none;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px 18px;
        }

        .mobileMenu.show {
          display: none;
        }

        .mobileLink,
        .mobileLogin,
        .mobileRegister {
          display: block;
          width: 100%;
          text-decoration: none;
          text-align: left;
          font-size: 15px;
          padding: 14px 16px;
          border-radius: 10px;
          margin-top: 10px;
        }

        .mobileLink {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }

        .mobileLink.active {
          background: rgba(245, 200, 66, 0.12);
          border-color: rgba(245, 200, 66, 0.4);
          color: #f5c842;
        }

        .mobileLogin {
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: transparent;
          color: #ffffff;
        }

        .mobileRegister {
          background: #f5c842;
          color: #111111;
          font-weight: 700;
          border: none;
        }

        @media (max-width: 1100px) {
          .navLink {
            padding: 8px 10px;
            font-size: 13px;
          }

          .btnLogin,
          .btnRegister {
            min-width: auto;
            padding: 0 16px;
          }
        }

        @media (max-width: 900px) {
          .navLinks,
          .navActions {
            display: none;
          }

          .menuToggle {
            display: flex;
          }

          .mobileMenu.show {
            display: block;
          }

          .navInner {
            padding: 0 16px;
            min-height: 72px;
          }

          .mobileMenu {
            padding: 0 16px 16px;
          }
        }

        @media (max-width: 480px) {
          .logoNxt {
            font-size: 18px;
          }

          .logoDivider {
            height: 24px;
          }

          .logoTop {
            font-size: 10px;
            letter-spacing: 1.5px;
          }

          .logoBottom {
            font-size: 8px;
            letter-spacing: 2px;
          }

          .navInner {
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
}