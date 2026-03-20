"use client";

import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 z-[100] bg-[#0b0e11] border-b border-white/10 flex items-center">
      <div className="max-w-[1440px] mx-auto px-4 w-full flex items-center justify-between">
        
        {/* BRANDING */}
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
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-8">
          {['Markets', 'Exchange', 'Bonds', 'Equity & IPO', 'Tokenize'].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              className="text-white/70 hover:text-white text-[13px] font-bold no-underline transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-4">
          <button className="text-white font-bold text-sm hover:text-[#F0B90B] transition-colors px-4 py-2 border border-white/10 rounded-md">
            Log In
          </button>
          <button className="bg-[#F0B90B] text-black px-6 py-2 rounded-md text-sm font-bold hover:bg-[#fcd535] transition-all">
            Register
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;