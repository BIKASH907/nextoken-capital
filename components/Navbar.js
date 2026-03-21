import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Navbar({ onLogin, onRegister }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "Markets", href: "/markets" },
    { label: "Exchange", href: "/exchange" },
    { label: "Bonds", href: "/bonds" },
    { label: "Equity & IPO", href: "/equity" },
    { label: "Tokenize", href: "/tokenize" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const closeMenu = () => setMenuOpen(false);

  const isActive = (href) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname === href;
  };

  const handleLoginClick = () => {
    closeMenu();
    if (typeof onLogin === "function") {
      onLogin();
      return;
    }
    if (router.pathname !== "/login") {
      router.push("/login");
    }
  };

  const handleRegisterClick = () => {
    closeMenu();
    if (typeof onRegister === "function") {
      onRegister();
      return;
    }
    if (router.pathname !== "/register") {
      router.push("/register");
    }
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.inner}>
          <Link href="/" style={styles.brand} onClick={closeMenu}>
            <span style={styles.brandMark}>NXT</span>
            <span style={styles.brandText}>Nextoken Capital</span>
          </Link>

          <nav className="nextoken-desktop-nav" style={styles.desktopNav}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  ...styles.navLink,
                  ...(isActive(link.href) ? styles.navLinkActive : {}),
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nextoken-desktop-actions" style={styles.desktopActions}>
            <button type="button" onClick={handleLoginClick} style={styles.loginBtn}>
              Log In
            </button>
            <button
              type="button"
              onClick={handleRegisterClick}
              style={styles.registerBtn}
            >
              Register
            </button>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            style={styles.menuButton}
            className="nextoken-mobile-toggle"
          >
            <span style={styles.menuBar} />
            <span style={styles.menuBar} />
            <span style={styles.menuBar} />
          </button>
        </div>

        {menuOpen && (
          <div className="nextoken-mobile-menu" style={styles.mobileMenu}>
            <div style={styles.mobileLinks}>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  style={{
                    ...styles.mobileLink,
                    ...(isActive(link.href) ? styles.mobileLinkActive : {}),
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div style={styles.mobileButtons}>
              <button
                type="button"
                onClick={handleLoginClick}
                style={styles.mobileLoginBtn}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={handleRegisterClick}
                style={styles.mobileRegisterBtn}
              >
                Register
              </button>
            </div>
          </div>
        )}
      </header>

      <style jsx global>{`
        @media (max-width: 1100px) {
          .nextoken-desktop-nav,
          .nextoken-desktop-actions {
            display: none !important;
          }

          .nextoken-mobile-toggle {
            display: inline-flex !important;
          }
        }

        @media (min-width: 1101px) {
          .nextoken-mobile-toggle,
          .nextoken-mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    background:
      "linear-gradient(180deg, rgba(10,12,18,0.96) 0%, rgba(10,12,18,0.9) 100%)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  inner: {
    maxWidth: "1280px",
    margin: "0 auto",
    minHeight: "72px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    padding: "0 20px",
  },

  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    flexShrink: 0,
  },

  brandMark: {
    fontSize: "26px",
    fontWeight: 800,
    lineHeight: 1,
    color: "#f0b90b",
    letterSpacing: "0.08em",
  },

  brandText: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#ffffff",
    whiteSpace: "nowrap",
  },

  desktopNav: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
    justifyContent: "center",
  },

  navLink: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.78)",
    fontSize: "14px",
    fontWeight: 500,
    padding: "10px 14px",
    borderRadius: "10px",
    transition: "all 0.2s ease",
  },

  navLinkActive: {
    color: "#ffffff",
    background: "rgba(240,185,11,0.12)",
    border: "1px solid rgba(240,185,11,0.28)",
  },

  desktopActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },

  loginBtn: {
    border: "1px solid rgba(255,255,255,0.16)",
    background: "transparent",
    color: "#ffffff",
    padding: "10px 18px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  registerBtn: {
    border: "none",
    background: "#f0b90b",
    color: "#111111",
    padding: "10px 18px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },

  menuButton: {
    display: "none",
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "5px",
    cursor: "pointer",
    padding: 0,
    flexShrink: 0,
  },

  menuBar: {
    width: "18px",
    height: "2px",
    background: "#ffffff",
    borderRadius: "999px",
    display: "block",
  },

  mobileMenu: {
    padding: "0 20px 18px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(10,12,18,0.98)",
  },

  mobileLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingTop: "14px",
  },

  mobileLink: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.82)",
    fontSize: "15px",
    fontWeight: 500,
    padding: "12px 14px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  mobileLinkActive: {
    color: "#ffffff",
    background: "rgba(240,185,11,0.12)",
    border: "1px solid rgba(240,185,11,0.25)",
  },

  mobileButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "16px",
  },

  mobileLoginBtn: {
    border: "1px solid rgba(255,255,255,0.16)",
    background: "transparent",
    color: "#ffffff",
    padding: "12px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  mobileRegisterBtn: {
    border: "none",
    background: "#f0b90b",
    color: "#111111",
    padding: "12px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
};