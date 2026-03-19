import Link from "next/link";
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

          {/* LOGO */}
          <Link href="/" className="logo">
            NXT
          </Link>

          {/* CENTER LINKS */}
          <div className="navLinks">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={router.pathname === link.href ? "active" : ""}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* RIGHT BUTTONS */}
          <div className="actions">
            <Link href="/login" className="login">
              Log In
            </Link>

            <Link href="/register" className="register">
              Register
            </Link>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: #000;
          border-bottom: 2px solid #f0b90b;
          z-index: 1000;
        }

        .navInner {
          max-width: 1200px;
          margin: auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        .logo {
          font-size: 28px;
          font-weight: 900;
          color: #f0b90b;
          text-decoration: none;
        }

        .navLinks {
          display: flex;
          gap: 28px;
        }

        .navLinks a {
          color: #ccc;
          text-decoration: none;
          font-size: 16px;
        }

        .navLinks a:hover {
          color: #fff;
        }

        .navLinks .active {
          color: #fff;
          font-weight: 600;
        }

        .actions {
          display: flex;
          gap: 12px;
        }

        .login {
          padding: 8px 18px;
          border: 1px solid #666;
          border-radius: 8px;
          color: #fff;
          text-decoration: none;
        }

        .register {
          padding: 8px 18px;
          background: #f0b90b;
          color: #000;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
        }
      `}</style>
    </>
  );
}