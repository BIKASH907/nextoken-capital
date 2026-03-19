"use client";
import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 z-[100] bg-[#0b0e11] border-b border-white/10 flex items-center">
      <div className="max-w-[1440px] mx-auto px-4 w-full flex items-center justify-between">
        
        <Link href="/" className="flex items-center no-underline">
          <div className="logo-nxt">NXT</div>
          <div className="logo-sep"></div>
          <div className="flex flex-col">
            <span className="logo-name uppercase">Nextoken</span>
            <span className="logo-cap uppercase">Capital</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/markets" className="text-white/70 hover:text-white text-[13px] font-bold no-underline">Markets</Link>
          <Link href="/bonds" className="text-white/70 hover:text-white text-[13px] font-bold no-underline">Bonds</Link>
          <Link href="/tokenize" className="text-white/70 hover:text-white text-[13px] font-bold no-underline">Tokenize</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-white font-bold text-sm px-2">Log In</button>
          <button className="bg-[#F0B90B] text-black px-5 py-2 rounded text-sm font-bold">Register</button>
        </div>
      </div>
    </header>
  );
};

export default Header;