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

          <nav style={styles.desktopNav}>
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

          <div style={styles.actions}>
            <button type="button" onClick={handleLoginClick} style={styles.loginBtn}>
              Log In
            </button>

            <button type="button" onClick={handleRegisterClick} style={styles.registerBtn}>
              Register
            </button>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              style={styles.menuButton}
            >
              <span style={styles.menuLine} />
              <span style={styles.menuLine} />
              <span style={styles.menuLine} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav style={styles.mobileMenu}>
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

            <button type="button" onClick={handleLoginClick} style={styles.mobileLoginBtn}>
              Log In
            </button>

            <button type="button" onClick={handleRegisterClick} style={styles.mobileRegisterBtn}>
              Register
            </button>
          </nav>
        )}
      </header>

      <style jsx global>{\`
        @media (max-width: 1100px) {
          .nextoken-desktop-nav {
            display: none !important;
          }
          .nextoken-menu-button {
            display: flex !important;
          }
          .nextoken-mobile-menu {
            display: flex !important;
          }
        }

        @media (max-width: 700px) {
          .nextoken-brand-mark {
            font-size: 22px !important;
          }
          .nextoken-brand-text {
            font-size: 20px !important;
          }
          .nextoken-actions .nextoken-register-btn {
            display: none !important;
          }
        }
      \`}</style>
    </>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "#0b0e11",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
  },
  inner: {
    maxWidth: "1280px",
    margin: "0 auto",
    minHeight: "76px",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    flexShrink: 0,
  },
  brandMark: {
    color: "#f0b90b",
    fontWeight: 900,
    fontSize: "28px",
    lineHeight: 1,
    letterSpacing: "0.06em",
    className: "nextoken-brand-mark",
  },
  brandText: {
    color: "#ffffff",
    fontWeight: 800,
    fontSize: "26px",
    lineHeight: 1,
    className: "nextoken-brand-text",
  },
  desktopNav: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flex: 1,
    justifyContent: "center",
    className: "nextoken-desktop-nav",
  },
  navLink: {
    color: "rgba(255,255,255,0.78)",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 600,
    padding: "8px 2px",
    transition: "0.2s ease",
  },
  navLinkActive: {
    color: "#f0b90b",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
    className: "nextoken-actions",
  },
  loginBtn: {
    background: "#f0b90b",
    color: "#111111",
    border: "none",
    borderRadius: "10px",
    padding: "11px 18px",
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  registerBtn: {
    background: "#1e2329",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "11px 18px",
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    className: "nextoken-register-btn",
  },
  menuButton: {
    display: "none",
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#161a1e",
    cursor: "pointer",
    padding: "10px",
    flexDirection: "column",
    justifyContent: "center",
    gap: "4px",
    className: "nextoken-menu-button",
  },
  menuLine: {
    display: "block",
    width: "100%",
    height: "2px",
    background: "#ffffff",
    borderRadius: "20px",
  },
  mobileMenu: {
    display: "none",
    padding: "0 20px 20px",
    maxWidth: "1280px",
    margin: "0 auto",
    background: "#0b0e11",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    flexDirection: "column",
    gap: "10px",
    className: "nextoken-mobile-menu",
  },
  mobileLink: {
    color: "rgba(255,255,255,0.82)",
    textDecoration: "none",
    padding: "12px 0",
    fontWeight: 600,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  mobileLinkActive: {
    color: "#f0b90b",
  },
  mobileLoginBtn: {
    marginTop: "10px",
    background: "#f0b90b",
    color: "#111111",
    border: "none",
    borderRadius: "10px",
    padding: "12px 16px",
    fontWeight: 800,
    textAlign: "center",
    cursor: "pointer",
  },
  mobileRegisterBtn: {
    background: "#1e2329",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "12px 16px",
    fontWeight: 800,
    textAlign: "center",
    cursor: "pointer",
  },
};
