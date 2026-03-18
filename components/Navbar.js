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
            <div className="logoBox">
              <span className="logoNxt">NXT</span>
            </div>
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          background: #0a0b0f;
        }

        .navInner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .navLogo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .logoBox {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: linear-gradient(135deg, #f5c842, #e6a817);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logoNxt {
          font-size: 13px;
          font-weight: 900;
          color: #111;
          letter-spacing: 0.5px;
        }

        .logoTextWrap {
          display: flex;
          flex-direction: column;
          line-height: 1;
          gap: 1px;
        }

        .logoTop {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 1.5px;
        }

        .logoBottom {
          font-size: 10px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 2px;
        }

        .navLinks {
          display: flex;
          align-items: center;
          gap: 0;
          flex: 1;
          justify-content: center;
        }

        .navLinks button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 6px 16px;
          border-radius: 8px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }

        .navLinks button:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .navLinks button.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          font-weight: 600;
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
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: transparent;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }

        .btnLogin:hover {
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.06);
        }

        .btnRegister {
          padding: 8px 20px;
          border-radius: 8px;
          border: none;
          background: #f5c842;
          color: #111;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
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