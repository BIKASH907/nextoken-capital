import React from "react";
import Link from "next/link";

const navItems = [
  { label: "Markets", href: "/markets" },
  { label: "Exchange", href: "/exchange" },
  { label: "Bonds", href: "/bonds" },
  { label: "Equity & IPO", href: "/equity" },
  { label: "Tokenize", href: "/tokenize" },
];

const Header = () => {
  return (
    <header className="fixed top-0 left-0 z-[100] flex h-16 w-full items-center border-b border-white/10 bg-[#0b0e11]">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4">
        <Link href="/" className="flex items-center no-underline">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: "#F0B90B",
                fontSize: "2rem",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "0.08em",
                fontFamily: "Inter, Arial, sans-serif",
              }}
            >
              NXT
            </span>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.05,
                marginTop: "1px",
              }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, Arial, sans-serif",
                }}
              >
                NEXTOKEN
              </span>
              <span
                style={{
                  color: "#FFFFFF",
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, Arial, sans-serif",
                }}
              >
                CAPITAL
              </span>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[13px] font-bold text-white/70 no-underline transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-md border border-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:text-[#F0B90B]"
          >
            Log In
          </button>
          <button
            type="button"
            className="rounded-md bg-[#F0B90B] px-6 py-2 text-sm font-bold text-black transition-all hover:bg-[#fcd535]"
          >
            Register
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;