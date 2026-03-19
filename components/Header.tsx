"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Markets', link: '/markets' },
    { title: 'Exchange', link: '/exchange' },
    { title: 'Bonds', link: '/bonds' },
    { title: 'Equity & IPO', link: '/equity' },
    { title: 'Tokenize', link: '/tokenize' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
      isScrolled || isMenuOpen ? 'bg-[#0b0e11] border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* --- CORRECTED LOGO SECTION --- */}
        <Link href="/" className="flex items-center no-underline group">
          <div className="logo-nxt">NXT</div>
          <div className="logo-sep"></div>
          <div className="flex flex-col">
            <span className="logo-name uppercase">Nextoken</span>
            <span className="logo-cap uppercase">Capital</span>
          </div>
        </Link>

        {/* --- CENTER NAVIGATION --- */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link 
              key={item.title} 
              href={item.link} 
              className="text-white/70 hover:text-white text-[13px] font-bold transition-colors no-underline"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* --- RIGHT SECTION: LOGIN & REGISTER --- */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <input 
              type="text" 
              placeholder="Search Assets..." 
              className="bg-[#2B3139] border border-transparent rounded py-1.5 pl-9 pr-4 text-xs text-white outline-none w-32"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Login: High-contrast Bold White */}
            <button className="hidden sm:block text-white font-bold text-sm px-2 hover:text-[#F0B90B] transition-colors">
              Log In
            </button>
            
            {/* Register: Specific Binance Gold #F0B90B */}
            <button className="bg-[#F0B90B] text-black px-5 py-2 rounded text-sm font-bold hover:bg-[#fcd535] transition-all">
              Register
            </button>
            
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-[#0b0e11] p-6 flex flex-col gap-4 border-b border-white/10">
          {navLinks.map((item) => (
            <Link key={item.title} href={item.link} className="text-white font-bold text-lg no-underline">
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;