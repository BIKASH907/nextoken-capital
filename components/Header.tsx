"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Globe, 
  Search, 
  LayoutGrid, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  PieChart, 
  FileText,
  UserCircle,
  Bell
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle glassmorphism on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* --- TOP NAV BAR --- */}
      <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 bg-gold rounded flex items-center justify-center font-black text-black text-lg transition-transform group-hover:rotate-12">
              N
            </div>
            <div className="hidden xs:flex flex-col leading-none">
              <span className="text-white font-black text-sm tracking-tight">NEXTOKEN</span>
              <span className="text-gold font-bold text-[8px] tracking-[3px] uppercase">Capital</span>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((menu) => (
              <div key={menu.title} className="relative group py-5">
                <button className="flex items-center gap-1 text-white/70 hover:text-gold text-sm font-bold transition-colors">
                  {menu.title} {menu.items && <ChevronDown size={14} />}
                </button>
                {menu.items && (
                  <div className="absolute top-full left-0 w-80 bg-dark-3 border border-white/10 rounded-xl shadow-2xl p-3 hidden group-hover:grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2">
                    {menu.items.map((item) => (
                      <a key={item.label} href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-dark-5 transition-colors">
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
        </div>

        {/* RIGHT: SEARCH & TOOLS */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-gold transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search Assets..." 
              className="bg-dark-5 border border-transparent focus:border-gold/30 rounded-full py-1.5 pl-10 pr-4 text-xs text-white outline-none w-40 focus:w-60 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-gold px-4 py-1.5 rounded text-xs">Join</button>
            
            {/* MOBILE TOGGLE */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:text-gold p-1"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      <div className={`lg:hidden fixed inset-0 top-16 bg-dark z-[-1] transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col p-6 gap-6 h-full overflow-y-auto">
          {navLinks.map((menu) => (
            <div key={menu.title} className="flex flex-col gap-3">
              <h3 className="text-gold text-xs font-black uppercase tracking-widest">{menu.title}</h3>
              {menu.items ? (
                <div className="grid grid-cols-1 gap-4 pl-2">
                  {menu.items.map((item) => (
                    <a key={item.label} href="#" className="flex items-center gap-4 group">
                      <div className="p-2 bg-dark-5 rounded group-active:bg-gold/10 transition-colors">
                        <item.icon size={20} className="text-white/60 group-active:text-gold" />
                      </div>
                      <span className="text-white font-bold text-sm">{item.label}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <a href={menu.link} className="text-white font-bold text-lg pl-2">Markets</a>
              )}
            </div>
          ))}

          <hr className="border-white/5 my-2" />

          <div className="flex flex-col gap-3">
            <button className="btn-dark w-full py-3 rounded font-bold">Log In</button>
            <button className="btn-gold w-full py-3 rounded font-bold">Register Now</button>
          </div>

          <div className="flex justify-center gap-8 mt-auto py-6 text-white/30 border-t border-white/5">
            <Globe size={20} />
            <Bell size={20} />
            <UserCircle size={20} />
          </div>
        </div>
      </div>

      {/* --- TICKER TAPE (Hides on very small screens) --- */}
      <div className="hidden md:block w-full bg-dark-2 border-t border-white/5 overflow-hidden py-1">
        <div className="animate-marquee flex gap-12 text-[9px] font-mono text-white/30 uppercase tracking-[2px]">
          <span>Himalayan Potato Index <span className="text-green-up">+4.2%</span></span>
          <span>Vilnius RE Bond-A <span className="text-green-up">7.2% Yield</span></span>
          <span>NEXTOKEN IPO <span className="text-gold">Subscribing</span></span>
          <span>Pokhara Agro-Credit <span className="text-red-down">-0.8%</span></span>
          {/* Repeating for seamless loop */}
          <span>Himalayan Potato Index <span className="text-green-up">+4.2%</span></span>
          <span>Vilnius RE Bond-A <span className="text-green-up">7.2% Yield</span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;