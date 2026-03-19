"use client";

import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '64px',
      backgroundColor: '#0b0e11',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="max-w-[1440px] mx-auto px-4 w-full flex items-center justify-between">
        
        {/* LOGO AREA */}
        <Link href="/" className="flex items-center no-underline">
          <div className="logo-nxt">NXT</div>
          <div className="logo-sep"></div>
          <div className="flex flex-col">
            <span className="logo-name uppercase">Nextoken</span>
            <span className="logo-cap uppercase">Capital</span>
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-8">
          {['Markets', 'Exchange', 'Bonds', 'Equity & IPO', 'Tokenize'].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} className="text-white/70 hover:text-white text-[13px] font-bold no-underline transition-colors">
              {item}
            </Link>
          ))}
        </nav>

        {/* BUTTONS */}
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