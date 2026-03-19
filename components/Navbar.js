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

  const goTo = (href) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navInner">
          <div className="navLogo" onClick={() => goTo("/")}>
            <span className="logoNxt">NXT</span>
            <div className="logoDivider" />
            <div className="logoTextWrap">
              <span className="logoTop">NEXTOKEN</span>
              <span className="logoBottom">CAPITAL</span>
            </div>
          </div>

          <div className="navLinks">
            {links.map((link) => (
              <button
                key={link.href}
                className={router.pathname === link.href ? "active" : ""}
                onClick={() => goTo(link.href)}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="navActions">
            <button className="btnLogin" onClick={() => goTo("/login")}>
              Log In
            </button>
            <button className="btnRegister" onClick={() => goTo("/register")}>
              Register
            </button>
          </div>

          <button
            className={`menuToggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`mobileMenu ${menuOpen ? "show" : ""}`}>
          {links.map((link) => (
            <button
              key={link.href}
              className={router.pathname === link.href ? "active" : ""}
              onClick={() => goTo(link.href)}
            >
              {link.label}
            </button>
          ))}

          <button className="mobileLogin" onClick={() => goTo("/login")}>
            Log In
          </button>

          <button className="mobileRegister" onClick={() => goTo("/register")}>
            Register
          </button>
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .navInner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
          min-height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .navLogo {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          flex-shrink: 0;
          min-width: 0;
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
          line-height: 1;
          gap: 2px;
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
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 2.5px;
        }

        .navLinks {
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: center;
          gap: 2px;
          min-width: 0;
        }

        .navLinks button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.55);
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          padding: 6px 14px;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
          letter-spacing: 0.2px;
        }

        .navLinks button:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.07);
        }

        .navLinks button.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          font-weight: 500;
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .btnLogin {
          padding: 8px 20px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: transparent;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          white-space: nowrap;
        }

        .btnLogin:hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.05);
        }

        .btnRegister {
          padding: 8px 20px;
          border-radius: 8px;
          border: none;
          background: #f5c842;
          color: #111111;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, transform 0.12s;
          white-space: nowrap;
        }

        .btnRegister:hover {
          background: #ffd84d;
          transform: translateY(-1px);
        }

        .menuToggle {
          display: none;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: transparent;
          cursor: pointer;
          padding: 0;
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

        .mobileMenu button {
          width: 100%;
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #ffffff;
          font-size: 15px;
          padding: 14px 16px;
          border-radius: 10px;
          margin-top: 10px;
          cursor: pointer;
        }

        .mobileMenu button.active {
          background: rgba(245, 200, 66, 0.12);
          border-color: rgba(245, 200, 66, 0.4);
          color: #f5c842;
        }

        .mobileLogin {
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          background: transparent !important;
          color: #ffffff !important;
        }

        .mobileRegister {
          background: #f5c842 !important;
          color: #111111 !important;
          border: none !important;
          font-weight: 700;
        }

        @media (max-width: 1100px) {
          .navLinks {
            gap: 0;
          }

          .navLinks button {
            padding: 6px 10px;
            font-size: 13px;
          }

          .btnLogin,
          .btnRegister {
            padding: 8px 16px;
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
            min-height: 64px;
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