"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  LayoutGrid, 
  PieChart, 
  FileText
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

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
        
        {/* --- LOGO SECTION (Exact Match to Image 4 & 6) --- */}
        <Link href="/" className="flex items-center no-underline group">
          <div className="logo-nxt">NXT</div>
          <div className="logo-sep"></div>
          <div className="flex flex-col">
            <span className="logo-name uppercase">Nextoken</span>
            <span className="logo-cap uppercase">Capital</span>
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION (Exact Match to Image 6) --- */}
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

        {/* --- RIGHT TOOLS: LOGIN & REGISTER (Exact Match to Image 6) --- */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <input 
              type="text" 
              placeholder="Search Assets..." 
              className="bg-[#2B3139] border border-transparent focus:border-gold/30 rounded py-1.5 pl-9 pr-4 text-xs text-white outline-none w-32 focus:w-48 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Log In Button: Same font size and color as Image 6 */}
            <button className="hidden sm:block text-white font-bold text-sm px-2 hover:text-gold transition-colors">
              Log In
            </button>
            
            {/* Register Button: Exact Gold/Yellow color from Image 6 */}
            <button className="bg-[#F0B90B] text-black px-5 py-2 rounded text-sm font-bold hover:bg-[#fcd535] transition-all">
              Register
            </button>
            
            {/* MOBILE HAMBURGER */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:text-gold p-1"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE OVERLAY MENU --- */}
      <div className={`lg:hidden fixed inset-0 top-16 bg-[#0B0E11] z-[-1] transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col p-6 gap-8 h-full overflow-y-auto">
          <nav className="flex flex-col gap-6">
            {navLinks.map((item) => (
              <Link 
                key={item.title} 
                href={item.link} 
                onClick={closeMenu}
                className="text-white font-bold text-lg border-b border-white/5 pb-2 no-underline"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 flex flex-col gap-3 pb-10">
            <button className="w-full py-3 rounded font-bold border border-white/10 text-white">Log In</button>
            <button className="bg-[#F0B90B] text-black w-full py-3 rounded font-bold">Register Now</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;