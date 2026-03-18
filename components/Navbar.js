import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const navLinks = [
    { name: "Markets", path: "/markets" },
    { name: "Exchange", path: "/exchange" },
    { name: "Bonds", path: "/bonds" },
    { name: "Equity & IPO", path: "/equity" },
    { name: "Tokenize", path: "/tokenize" },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        
        {/* LOGO */}
        <div style={styles.logo} onClick={() => router.push("/")}>
          <span style={styles.logoNXT}>NXT</span>

          <div style={styles.divider}></div>

          <div style={styles.logoText}>
            <span style={styles.nextoken}>NEXTOKEN</span>
            <span style={styles.capital}>CAPITAL</span>
          </div>
        </div>

        {/* NAV LINKS */}
        <div style={styles.navLinks}>
          {navLinks.map((item) => {
            const active = router.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  ...styles.link,
                  ...(active ? styles.activeLink : {}),
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>
          <button style={styles.login}>Log In</button>
          <button style={styles.register}>Register</button>
        </div>

      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    width: "100%",
    height: "80px",
    background: "#0B0E11",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    zIndex: 1000,
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
  },

  logoNXT: {
    color: "#F0B90B",
    fontSize: "26px",
    fontWeight: "900",
  },

  divider: {
    width: "1px",
    height: "30px",
    background: "rgba(240,185,11,0.3)",
  },

  logoText: {
    display: "flex",
    flexDirection: "column",
    lineHeight: "1",
  },

  nextoken: {
    color: "#fff",
    fontWeight: "800",
    fontSize: "16px",
  },

  capital: {
    color: "#F0B90B",
    fontSize: "10px",
    letterSpacing: "3px",
    marginTop: "3px",
  },

  navLinks: {
    display: "flex",
    gap: "8px",
  },

  link: {
    padding: "10px 16px",
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.6)",
    fontSize: "15px",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
  },

  activeLink: {
    background: "#1E2329",
    color: "#fff",
  },

  right: {
    display: "flex",
    gap: "10px",
  },

  login: {
    padding: "10px 18px",
    background: "transparent",
    border: "1px solid rgba(240,185,11,0.3)",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  register: {
    padding: "10px 18px",
    background: "#F0B90B",
    border: "none",
    color: "#000",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },
};