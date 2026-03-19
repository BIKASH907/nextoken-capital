"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { title: 'Markets', link: '/markets' },
    { title: 'Exchange', link: '/exchange' },
    { title: 'Bonds', link: '/bonds' },
    { title: 'Equity & IPO', link: '/equity' },
    { title: 'Tokenize', link: '/tokenize' }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-[#0b0e11] border-b border-white/10 h-16">
      <div className="max-w-[1440px] mx-auto px-4 h-full flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center no-underline">
          <div className="logo-nxt">NXT</div>
          <div className="logo-sep"></div>
          <div className="flex flex-col">
            <span className="logo-name uppercase">Nextoken</span>
            <span className="logo-cap uppercase">Capital</span>
          </div>
        </Link>

        {/* NAV */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link key={item.title} href={item.link} className="text-white/70 hover:text-white text-[13px] font-bold no-underline">
              {item.title}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex relative mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <input type="text" placeholder="Search..." className="bg-[#2B3139] rounded py-1.5 pl-9 pr-4 text-xs text-white outline-none w-32" />
          </div>
          <button className="btn-login hidden sm:block">Log In</button>
          <button className="btn-gold">Register</button>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden ml-2 text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-[#0b0e11] p-6 flex flex-col gap-4 border-b border-white/10 animate-in slide-in-from-top">
          {navLinks.map((item) => (
            <Link key={item.title} href={item.link} onClick={() => setIsMenuOpen(false)} className="text-white font-bold text-lg no-underline">
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;