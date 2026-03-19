"use client";

import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Globe, 
  Bell, 
  UserCircle, 
  Search, 
  LayoutGrid, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  PieChart, 
  FileText 
} from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const isConnected = false; // Toggle this for development testing

  // Handle glassmorphism effect on scroll
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
    {
      title: 'Secondary Market',
      link: '/trade'
    }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#0b0e11]/80 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT: LOGO & NAV */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-[#F0B90B] rounded-lg flex items-center justify-center font-bold text-black group-hover:rotate-12 transition-transform">
              NXT
            </div>
            <span className="text-white font-bold text-xl tracking-tight hidden md:block">
              Nextoken<span className="text-[#F0B90B]">Capital</span>
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((menu) => (
              <div 
                key={menu.title}
                className="relative group py-5"
                onMouseEnter={() => setActiveMenu(menu.title)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className="flex items-center gap-1 text-gray-300 hover:text-[#F0B90B] font-medium text-sm transition-colors">
                  {menu.title} {menu.items && <ChevronDown size={14} />}
                </button>

                {/* DROPDOWN MEGA-MENU */}
                {menu.items && activeMenu === menu.title && (
                  <div className="absolute top-full left-0 w-[450px] bg-[#1e2329] border border-gray-700 rounded-xl shadow-2xl p-4 grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {menu.items.map((item) => (
                      <a 
                        key={item.label}
                        href="#" 
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#2b3139] transition-colors group/item"
                      >
                        <div className="mt-1 p-2 bg-gray-800 rounded-md group-hover/item:text-[#F0B90B] transition-colors">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{item.label}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* CENTER: SEARCH (BINANCE STYLE) */}
        <div className="hidden xl:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#F0B90B]" size={16} />
            <input 
              type="text" 
              placeholder="Search RWA, Bonds, or Assets..." 
              className="w-full bg-[#2b3139] border border-transparent focus:border-[#F0B90B] rounded-full py-1.5 pl-10 pr-4 text-sm text-white outline-none transition-all"
            />
          </div>
        </div>

        {/* RIGHT: AUTH & ACTIONS */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 text-gray-300">
             <button className="hover:text-white"><Globe size={18} /></button>
             <button className="relative hover:text-white">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0b0e11]"></span>
             </button>
          </div>

          {!isConnected ? (
            <div className="flex items-center gap-2">
              <button className="text-white text-sm font-semibold px-4 py-2 hover:text-[#F0B90B] transition-colors">
                Log In
              </button>
              <button className="bg-[#F0B90B] text-black text-sm font-bold px-5 py-2 rounded-lg hover:bg-[#fcd535] transition-all shadow-lg active:scale-95">
                Get Started
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-gray-800 rounded-full pl-4 pr-1 py-1 cursor-pointer hover:bg-gray-700 transition-colors">
              <span className="text-xs text-white font-medium">0.45 ETH</span>
              <UserCircle size={28} className="text-[#F0B90B]" />
            </div>
          )}
        </div>
      </div>

      {/* SUB-HEADER: LIVE TICKER TAPE */}
      <div className="w-full bg-[#181a20] border-t border-gray-800 overflow-hidden py-1">
        <div className="flex gap-8 whitespace-nowrap animate-marquee items-center text-[10px] font-mono text-gray-400 uppercase tracking-widest">
          <span>Potatoes Export Fund: <span className="text-green-400">+12.4%</span></span>
          <span className="opacity-30">|</span>
          <span>Vilnius RE Bond A: <span className="text-green-400">7.2% Yield</span></span>
          <span className="opacity-30">|</span>
          <span>NXT Capital IPO: <span className="text-yellow-400">Subscription Open</span></span>
          <span className="opacity-30">|</span>
          <span>Himalayan Agro-Token: <span className="text-red-400">-1.2%</span></span>
          <span className="opacity-30">|</span>
          <span>Potatoes Export Fund: <span className="text-green-400">+12.4%</span></span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;