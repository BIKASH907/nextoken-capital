// lib/AppContext.js
// ─────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for the entire platform.
// Import { useApp } from "../lib/AppContext" in any page to read
// or update: user, wallet, portfolio, markets, bonds, IPOs, exchange.
// Any change here automatically reflects in Navbar, Dashboard,
// Markets, Exchange, Bonds, Equity-IPO pages.
// ─────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from "react";

// ── SHARED DATA ───────────────────────────────────────────────────
// Edit these arrays to update ALL pages simultaneously.
// Add a new bond here → it appears on /bonds AND /dashboard.
// Change a market price here → /markets AND /exchange update.

export const MARKETS_DATA = [
  { id:1,  emoji:"☀️", badge:"Closing Soon", risk:"Low",    cat:"Energy",         title:"Solar Farm Portfolio",      location:"Alicante, Spain",        roi:18.2, min:250,  term:60, raised:4600000, target:5000000 },
  { id:2,  emoji:"🛍️", badge:"Closing Soon", risk:"Low",    cat:"Commercial",     title:"Retail Shopping Centre",    location:"Amsterdam, Netherlands", roi:13.9, min:1000, term:36, raised:3520000, target:4000000 },
  { id:3,  emoji:"🏢", badge:"Live",         risk:"Low",    cat:"Property",       title:"Tokenized Office Building", location:"Berlin, Germany",        roi:16.4, min:500,  term:36, raised:1872000, target:2400000 },
  { id:4,  emoji:"🏠", badge:"Live",         risk:"Low",    cat:"Property",       title:"Student Housing Block",     location:"Prague, Czechia",        roi:14.2, min:250,  term:24, raised:1278000, target:1800000 },
  { id:5,  emoji:"🏘️", badge:"Live",         risk:"Low",    cat:"Property",       title:"Residential Complex",       location:"Lisbon, Portugal",       roi:14.8, min:500,  term:24, raised:1920000, target:3200000 },
  { id:6,  emoji:"🏭", badge:"Live",         risk:"Medium", cat:"Infrastructure", title:"Logistics Hub",             location:"Warsaw, Poland",         roi:15.1, min:1000, term:48, raised:3600000, target:8000000 },
  { id:7,  emoji:"💨", badge:"Live",         risk:"Medium", cat:"Energy",         title:"Wind Energy Project",       location:"Gdansk, Poland",         roi:17.6, min:250,  term:72, raised:2145000, target:6500000 },
  { id:8,  emoji:"💼", badge:"Live",         risk:"Medium", cat:"Commercial",     title:"Tech Business Park",        location:"Dublin, Ireland",        roi:15.9, min:500,  term:60, raised:2000000, target:10000000 },
  { id:9,  emoji:"⚗️", badge:"Live",         risk:"High",   cat:"Energy",         title:"Green Hydrogen Plant",      location:"Rotterdam, Netherlands", roi:18.8, min:2000, term:84, raised:1800000, target:12000000 },
];

export const BONDS_DATA = [
  { id:1, name:"Baltic Infrastructure Bond", issuer:"NXT Infrastructure UAB", coupon:"7.5%", couponNum:7.5, term:"36 months", min:"€500",  rating:"BBB+", status:"Live",     raised:2400000, target:5000000 },
  { id:2, name:"European Solar Bond I",       issuer:"SolarBridge Capital",    coupon:"8.2%", couponNum:8.2, term:"60 months", min:"€250",  rating:"BB+",  status:"Live",     raised:1800000, target:3000000 },
  { id:3, name:"Warsaw Logistics Bond",       issuer:"LogiPark Holdings",      coupon:"6.9%", couponNum:6.9, term:"24 months", min:"€1000", rating:"BBB",  status:"Live",     raised:3600000, target:4000000 },
  { id:4, name:"Green Energy Convertible",    issuer:"CleanPower EU",          coupon:"9.1%", couponNum:9.1, term:"48 months", min:"€2000", rating:"BB",   status:"Upcoming", raised:0,       target:8000000 },
  { id:5, name:"Lisbon Residential Bond",     issuer:"UrbanNest Portugal",     coupon:"7.0%", couponNum:7.0, term:"36 months", min:"€500",  rating:"BBB-", status:"Live",     raised:900000,  target:2000000 },
];

export const IPOS_DATA = [
  { id:1, name:"BalticPay Technologies", sector:"Fintech",    raise:"€8M",  price:"€5.00",  priceNum:5,   min:"€500",  date:"Apr 2026", status:"Open",   desc:"Pan-Baltic digital payments infrastructure processing 2M+ transactions monthly." },
  { id:2, name:"GreenVolt Energy",        sector:"Renewables", raise:"€12M", price:"€10.00", priceNum:10,  min:"€1000", date:"May 2026", status:"Open",   desc:"Solar and wind energy operator with 140MW of installed capacity." },
  { id:3, name:"MedChain Diagnostics",    sector:"HealthTech", raise:"€5M",  price:"€2.50",  priceNum:2.5, min:"€250",  date:"Jun 2026", status:"Coming", desc:"AI-powered diagnostics platform deployed in 38 hospitals across the EU." },
  { id:4, name:"LogiRail Freight",        sector:"Logistics",  raise:"€20M", price:"€15.00", priceNum:15,  min:"€1500", date:"Jul 2026", status:"Coming", desc:"Cross-border rail freight operator connecting 12 EU countries." },
];

export const TOKENS_DATA = [
  { symbol:"SOLAR-01", name:"Solar Farm Portfolio",      price:10.42, change:+2.4,  vol:"€142K", cap:"€5.2M",  yield:"18.2%", risk:"Low" },
  { symbol:"OFFIC-03", name:"Tokenized Office Building", price:8.91,  change:-0.8,  vol:"€89K",  cap:"€2.4M",  yield:"16.4%", risk:"Low" },
  { symbol:"WIND-07",  name:"Wind Energy Project",       price:12.15, change:+5.1,  vol:"€201K", cap:"€6.5M",  yield:"17.6%", risk:"Medium" },
  { symbol:"RETL-02",  name:"Retail Shopping Centre",    price:9.78,  change:+0.3,  vol:"€67K",  cap:"€4.0M",  yield:"13.9%", risk:"Low" },
  { symbol:"LOGX-06",  name:"Logistics Hub",             price:11.20, change:+1.9,  vol:"€310K", cap:"€8.0M",  yield:"15.1%", risk:"Medium" },
  { symbol:"STUD-04",  name:"Student Housing Block",     price:7.65,  change:-1.2,  vol:"€44K",  cap:"€1.8M",  yield:"14.2%", risk:"Low" },
  { symbol:"TECH-08",  name:"Tech Business Park",        price:15.30, change:+3.7,  vol:"€520K", cap:"€10.0M", yield:"15.9%", risk:"Medium" },
  { symbol:"H2-09",    name:"Green Hydrogen Plant",      price:22.10, change:+8.2,  vol:"€890K", cap:"€12.0M", yield:"18.8%", risk:"High" },
];

// ── PLATFORM STATS (update once → reflects on homepage + dashboard) ──
export const PLATFORM_STATS = {
  assetsTokenized:   "EUR 140M+",
  verifiedInvestors: "12,400+",
  countries:         "180+",
  minInvestment:     "EUR 100",
  tradingFee:        "0.2%",
  avgBondCoupon:     "7.5%",
  activeBonds:       BONDS_DATA.filter(b => b.status === "Live").length,
  openIPOs:          IPOS_DATA.filter(i => i.status === "Open").length,
  activeMarkets:     MARKETS_DATA.length,
};

// ── CONTEXT ───────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // User state
  const [user, setUser] = useState(null);

  // Wallet state
  const [wallet, setWallet] = useState({
    connected: false,
    address: "",
    balance: 0,
    currency: "EUR",
  });

  // Portfolio — user's holdings (persisted in localStorage)
  const [portfolio, setPortfolio] = useState({
    totalValue:   0,
    totalInvested:0,
    totalReturn:  0,
    holdings:     [], // { symbol, name, qty, price, value, change }
  });

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Load user + portfolio from localStorage on mount
  useEffect(() => {
    try {
      const savedUser      = localStorage.getItem("nxt_user");
      const savedPortfolio = localStorage.getItem("nxt_portfolio");
      const savedWallet    = localStorage.getItem("nxt_wallet");
      if (savedUser)      setUser(JSON.parse(savedUser));
      if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
      if (savedWallet)    setWallet(JSON.parse(savedWallet));
    } catch {}
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    if (user)      localStorage.setItem("nxt_user",      JSON.stringify(user));
    if (portfolio) localStorage.setItem("nxt_portfolio", JSON.stringify(portfolio));
    if (wallet)    localStorage.setItem("nxt_wallet",    JSON.stringify(wallet));
  }, [user, portfolio, wallet]);

  // ── ACTIONS ────────────────────────────────────────────────────

  const login = (userData) => {
    setUser(userData);
    // Seed a demo portfolio on first login
    setPortfolio({
      totalValue:    12450.00,
      totalInvested: 10000.00,
      totalReturn:   2450.00,
      holdings: [
        { symbol:"SOLAR-01", name:"Solar Farm Portfolio",      qty:120, price:10.42, value:1250.40, change:+2.4  },
        { symbol:"WIND-07",  name:"Wind Energy Project",       qty:80,  price:12.15, value:972.00,  change:+5.1  },
        { symbol:"TECH-08",  name:"Tech Business Park",        qty:50,  price:15.30, value:765.00,  change:+3.7  },
        { symbol:"OFFIC-03", name:"Tokenized Office Building", qty:200, price:8.91,  value:1782.00, change:-0.8  },
      ],
    });
    addNotification("Welcome back! Your portfolio has been loaded.", "success");
  };

  const logout = () => {
    setUser(null);
    setPortfolio({ totalValue:0, totalInvested:0, totalReturn:0, holdings:[] });
    setWallet({ connected:false, address:"", balance:0, currency:"EUR" });
    localStorage.removeItem("nxt_user");
    localStorage.removeItem("nxt_portfolio");
    localStorage.removeItem("nxt_wallet");
  };

  const connectWallet = (address = "0x1a2b...9f0e") => {
    const w = { connected:true, address, balance:5420.50, currency:"EUR" };
    setWallet(w);
    addNotification("Wallet connected successfully.", "success");
  };

  const invest = (asset, amount) => {
    const tokenPrice = asset.price || asset.min || 10;
    const qty = Math.floor(amount / tokenPrice);
    setPortfolio(prev => {
      const existing = prev.holdings.find(h => h.symbol === asset.symbol);
      let holdings;
      if (existing) {
        holdings = prev.holdings.map(h =>
          h.symbol === asset.symbol
            ? { ...h, qty: h.qty + qty, value: (h.qty + qty) * tokenPrice }
            : h
        );
      } else {
        holdings = [...prev.holdings, {
          symbol: asset.symbol || asset.title?.slice(0,6).toUpperCase()+"-00",
          name:   asset.name   || asset.title,
          qty, price: tokenPrice,
          value:  qty * tokenPrice,
          change: asset.change || 0,
        }];
      }
      const totalValue    = holdings.reduce((s,h) => s + h.value, 0);
      const totalInvested = prev.totalInvested + amount;
      return { ...prev, holdings, totalValue, totalInvested, totalReturn: totalValue - totalInvested };
    });
    addNotification(`Invested €${amount} in ${asset.name || asset.title}.`, "success");
  };

  const addNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  return (
    <AppContext.Provider value={{
      // Data (shared across all pages)
      markets:  MARKETS_DATA,
      bonds:    BONDS_DATA,
      ipos:     IPOS_DATA,
      tokens:   TOKENS_DATA,
      stats:    PLATFORM_STATS,
      // State
      user, wallet, portfolio, notifications,
      // Actions
      login, logout, connectWallet, invest, addNotification,
    }}>
      {children}
      {/* Global toast notifications */}
      {notifications.length > 0 && (
        <div style={{
          position:"fixed", bottom:24, right:24, zIndex:9999,
          display:"flex", flexDirection:"column", gap:8,
        }}>
          {notifications.map(n => (
            <div key={n.id} style={{
              padding:"12px 18px", borderRadius:10, fontSize:13, fontWeight:600,
              background: n.type==="success" ? "#0ECB81" : n.type==="error" ? "#FF4D4D" : "#F0B90B",
              color: "#000", maxWidth:320, boxShadow:"0 4px 20px rgba(0,0,0,0.3)",
              animation:"fadeInUp .2s ease",
            }}>
              {n.message}
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </AppContext.Provider>
  );
}

// ── HOOK ──────────────────────────────────────────────────────────
// Usage in any page:
//   import { useApp } from "../lib/AppContext";
//   const { user, wallet, portfolio, markets, bonds } = useApp();
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}