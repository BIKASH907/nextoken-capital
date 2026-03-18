import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const links = [
    { label: "Markets", href: "/markets" },
    { label: "Exchange", href: "/exchange" },
    { label: "Bonds", href: "/bonds" },
    { label: "Equity & IPO", href: "/equity" },
    { label: "Tokenize", href: "/tokenize" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navInner">
          <div className="navLogo" onClick={() => router.push("/")}>
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
                onClick={() => router.push(link.href)}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="navActions">
            <button className="btnLogin" onClick={() => router.push("/login")}>
              Log In
            </button>
            <button className="btnRegister" onClick={() => router.push("/register")}>
              Register
            </button>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 68px;
          background: #0d0d0d;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .navInner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .navLogo {
          display: flex;
          align-items: center;
          gap: 12px;
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
          padding: 8px 22px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: transparent;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }

        .btnLogin:hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.05);
        }

        .btnRegister {
          padding: 8px 22px;
          border-radius: 8px;
          border: none;
          background: #f5c842;
          color: #111111;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, transform 0.12s;
        }

        .btnRegister:hover {
          background: #ffd84d;
          transform: translateY(-1px);
        }

        @media (max-width: 900px) {
          .navLinks {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .btnLogin {
            display: none;
          }
        }
      `}</style>
    </>
  );
}