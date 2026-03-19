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
  FileText,
  Globe,
  Bell,
  UserCircle
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
    {
      title: 'Invest',
      items: [
        { label: 'RWA Marketplace', desc: 'Real Estate & Agriculture', icon: Building2 },
        { label: 'Bond Board', desc: 'Fixed Income & Corporate Bonds', icon: ShieldCheck },
        { label: 'IPOs / Launchpad', desc: 'New Asset Offerings', icon: TrendingUp },
      ]
    },
    {
      title: 'Issuance',
      items: [
        { label: 'Tokenize Assets', desc: 'Digitalize your RWA', icon: LayoutGrid },
        { label: 'Raise Capital', desc: 'Equity & Debt Financing', icon: PieChart },
        { label: 'Documentation', desc: 'Legal & Technical Guides', icon: FileText },
      ]
    },
    { title: 'Markets', link: '/markets' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
      isScrolled || isMenuOpen ? 'bg-[#0b0e11] border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* --- LOGO: IDENTICAL TO HOME PAGE --- */}
        <Link href="/" className="flex items-center no-underline group">
          <div className="logo-nxt">NXT</div>
          <div className="logo-sep"></div>
          <div className="flex flex-col">
            <span className="logo-name uppercase">Nextoken</span>
            <span className="logo-cap uppercase">Capital</span>
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((menu) => (
            <div key={menu.title} className="relative group py-5">
              <button className="flex items-center gap-1 text-white/70 hover:text-gold text-sm font-bold transition-colors">
                {menu.title} {menu.items && <ChevronDown size={14} />}
              </button>
              {menu.items && (
                <div className="absolute top-full left-0 w-80 bg-[#1E2329] border border-white/10 rounded-xl shadow-2xl p-3 hidden group-hover:grid grid-cols-1 gap-1">
                  {menu.items.map((item) => (
                    <a key={item.label} href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#2B3139] transition-colors">
                      <item.icon size={18} className="text-gold mt-0.5" />
                      <div>
                        <p className="text-white font-bold text-xs">{item.label}</p>
                        <p className="text-white/40 text-[10px]">{item.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* --- RIGHT SECTION: LOGIN/JOIN COLORS PRESERVED --- */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <input 
              type="text" 
              placeholder="Search Assets..." 
              className="bg-[#2B3139] border border-transparent focus:border-gold/30 rounded py-1.5 pl-9 pr-4 text-xs text-white outline-none w-32 focus:w-48 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Login button: Keep same font size and color from your global styles */}
            <button className="hidden sm:block text-white/80 hover:text-white text-xs font-bold px-3">Log In</button>
            
            {/* Join button: Exact Gold color #F0B90B */}
            <button className="btn-gold px-4 py-1.5 rounded text-xs font-bold">Join</button>
            
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

      {/* --- MOBILE MENU --- */}
      <div className={`lg:hidden fixed inset-0 top-16 bg-[#0B0E11] z-[-1] transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col p-6 gap-8 h-full overflow-y-auto">
          {navLinks.map((menu) => (
            <div key={menu.title} className="flex flex-col gap-4">
              <h3 className="text-gold text-xs font-black uppercase tracking-[3px] opacity-60">{menu.title}</h3>
              {menu.items ? (
                <div className="grid grid-cols-1 gap-5 pl-2">
                  {menu.items.map((item) => (
                    <a key={item.label} href="#" onClick={closeMenu} className="flex items-center gap-4">
                      <div className="p-2 bg-[#1E2329] rounded">
                        <item.icon size={20} className="text-white/60" />
                      </div>
                      <span className="text-white font-bold text-sm">{item.label}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <Link href={menu.link || '#'} onClick={closeMenu} className="text-white font-bold text-lg pl-2">Markets</Link>
              )}
            </div>
          ))}

          <div className="mt-auto pt-6 flex flex-col gap-3 border-t border-white/5 pb-10">
            <button className="btn-dark w-full py-3 rounded font-bold text-white/80">Log In</button>
            <button className="btn-gold w-full py-3 rounded font-bold">Join Now</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;