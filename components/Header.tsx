"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Exact links from your image: Markets, Exchange, Bonds, Equity & IPO, Tokenize
  const navLinks = [
    { title: 'Markets', link: '/markets' },
    { title: 'Exchange', link: '/exchange' },
    { title: 'Bonds', link: '/bonds' },
    { title: 'Equity & IPO', link: '/equity' },
    { title: 'Tokenize', link: '/tokenize' }
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '64px',
      zIndex: 1000,
      backgroundColor: '#0b0e11',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
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

        {/* NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link 
              key={item.title} 
              href={item.link} 
              className="text-white/70 hover:text-white text-[13px] font-bold no-underline transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-white font-bold text-sm hover:text-[#F0B90B] transition-colors border border-white/20 px-4 py-2 rounded">
            Log In
          </button>
          <button className="bg-[#F0B90B] text-black px-6 py-2 rounded text-sm font-bold hover:bg-[#fcd535] transition-all">
            Register
          </button>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white ml-2">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          width: '100%',
          height: 'calc(100vh - 64px)',
          backgroundColor: '#0b0e11',
          padding: '2rem',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {navLinks.map((item) => (
            <Link key={item.title} href={item.link} onClick={() => setIsMenuOpen(false)} className="text-white font-bold text-xl no-underline">
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;