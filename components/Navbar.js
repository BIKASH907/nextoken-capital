import Link from "next/link";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import AuthModal from "./AuthModal";
import styles from "../styles/Navbar.module.css";

const NAV_LINKS = [
  { label: "Markets", href: "/markets" },
  { label: "Exchange", href: "/exchange" },
  { label: "Bonds", href: "/bonds" },
  { label: "Equity & IPO", href: "/equity" },
  { label: "Tokenize", href: "/tokenize" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const openLoginModal = () => {
    setModal("login");
    setMenuOpen(false);
  };

  const closeModal = () => {
    setModal(null);
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brandWrap} onClick={closeMobileMenu}>
            <span className={styles.brandMark}>NXT</span>
            <span className={styles.brandText}>Nextoken Capital</span>
          </Link>

          <nav className={styles.navLinks}>
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.navActions}>
            <div className={styles.walletWrap}>
              <ConnectButton />
            </div>

            <button
              type="button"
              className={styles.loginBtn}
              onClick={openLoginModal}
            >
              Log In
            </button>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className={styles.menuButton}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
          </button>
        </div>

        {menuOpen && (
          <nav className={styles.mobileMenu}>
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              className={styles.mobileLoginBtn}
              onClick={openLoginModal}
            >
              Log In
            </button>
          </nav>
        )}
      </header>

      {modal && (
        <AuthModal
          mode={modal}
          onClose={closeModal}
          onSwitch={(type) => setModal(type)}
        />
      )}
    </>
  );
}