import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { label: "Markets", href: "/markets" },
    { label: "Exchange", href: "/exchange" },
    { label: "Bonds", href: "/bonds" },
    { label: "Equity & IPO", href: "/equity-ipo" },
    { label: "Tokenize", href: "/tokenize" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        const clickedHamburger = event.target.closest?.("[data-hamburger='true']");
        if (!clickedHamburger) {
          setMenuOpen(false);
        }
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isActive = (href) => router.pathname === href;

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          <Link href="/" style={styles.logoContainer} onClick={() => setMenuOpen(false)}>
            <div style={styles.nxtText}>NXT</div>
            <div style={styles.logoText}>
              <div style={styles.brandMain}>NEXTOKEN</div>
              <div style={styles.brandSub}>CAPITAL</div>
            </div>
          </Link>

          <div className="desktopLinks" style={styles.desktopLinks}>
            {navLinks.map((link) => (
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
          </div>

          <div className="desktopActions" style={styles.desktopActions}>
            <Link href="/login" style={styles.loginBtn}>
              Log In
            </Link>

            <div style={styles.walletButtonWrap}>
              <ConnectButton
                accountStatus="address"
                chainStatus="icon"
                showBalance={false}
              />
            </div>
          </div>

          <button
            type="button"
            data-hamburger="true"
            className="hamburgerBtn"
            onClick={() => setMenuOpen((prev) => !prev)}
            style={styles.hamburger}
            aria-label="Toggle menu"
          >
            <span style={styles.hamburgerLine} />
            <span style={styles.hamburgerLine} />
            <span style={styles.hamburgerLine} />
          </button>
        </div>

        {menuOpen && (
          <div className="mobileMenu" style={styles.mobileMenu} ref={mobileMenuRef}>
            <div style={styles.mobileLinks}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    ...styles.mobileNavLink,
                    ...(isActive(link.href) ? styles.mobileNavLinkActive : {}),
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div style={styles.mobileActions}>
              <Link
                href="/login"
                style={styles.mobileLoginBtn}
                onClick={() => setMenuOpen(false)}
              >
                Log In
              </Link>

              <div style={styles.mobileWalletBox}>
                <div style={styles.mobileWalletTitle}>Connect Wallet</div>
                <div style={styles.mobileWalletInner}>
                  <ConnectButton
                    accountStatus="address"
                    chainStatus="icon"
                    showBalance={false}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @media (max-width: 980px) {
          .desktopLinks,
          .desktopActions {
            display: none !important;
          }

          .hamburgerBtn {
            display: flex !important;
          }

          .mobileMenu {
            display: block !important;
          }
        }

        :global(.rainbow-connect-button),
        :global([data-rk] button) {
          font-weight: 800 !important;
        }
      `}</style>
    </>
  );
}

const styles = {
  nav: {
    background: "#05060a",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    minWidth: "fit-content",
  },

  nxtText: {
    color: "#F0B90B",
    fontWeight: 900,
    fontSize: "28px",
    letterSpacing: "1px",
    lineHeight: 1,
  },

  logoText: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1,
  },

  brandMain: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: 800,
    letterSpacing: "1.2px",
  },

  brandSub: {
    color: "#F0B90B",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "2px",
    marginTop: "4px",
  },

  desktopLinks: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
    flex: 1,
    justifyContent: "center",
  },

  navLink: {
    color: "#b7bdc6",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
    padding: "6px 0",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  },

  navLinkActive: {
    color: "#ffffff",
  },

  desktopActions: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  loginBtn: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "#11141b",
    padding: "10px 18px",
    borderRadius: "10px",
    whiteSpace: "nowrap",
  },

  walletButtonWrap: {
    display: "flex",
    alignItems: "center",
  },

  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: "4px",
    background: "transparent",
    border: "none",
    padding: "6px",
    cursor: "pointer",
  },

  hamburgerLine: {
    width: "22px",
    height: "2px",
    background: "#ffffff",
    borderRadius: "999px",
    display: "block",
  },

  mobileMenu: {
    display: "none",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px 18px",
  },

  mobileLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  mobileNavLink: {
    color: "#d6d9df",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 600,
    padding: "12px 10px",
    borderRadius: "10px",
    background: "#11141b",
  },

  mobileNavLinkActive: {
    color: "#ffffff",
    background: "#171b22",
  },

  mobileActions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "14px",
  },

  mobileLoginBtn: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#11141b",
    padding: "12px 16px",
    borderRadius: "10px",
    textAlign: "center",
  },

  mobileWalletBox: {
    background: "#11141b",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "12px",
  },

  mobileWalletTitle: {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 800,
    marginBottom: "10px",
  },

  mobileWalletInner: {
    display: "flex",
    alignItems: "center",
  },
};