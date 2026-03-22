"use client";

import { useState } from "react";
import Link from "next/link";

type FilterType = "all" | "ipo" | "early" | "token" | "secondary";
type FilterRisk = "all" | "low" | "medium" | "high";

const listings = [
  { id:1, emoji:"⚡", name:"VoltGrid Energy",      ticker:"VGE", subtype:"Blockchain IPO", type:"ipo"       as FilterType, risk:"low"    as FilterRisk, location:"Helsinki, Finland",      irr:"28.4%", minInvest:"€100",   raiseTarget:"€18M", raised:"€15.7M", progress:87, status:"hot",      statusLabel:"🔥 Hot" },
  { id:2, emoji:"🤖", name:"NeuroLogic AI",         ticker:"NLA", subtype:"Series A",      type:"early"     as FilterType, risk:"medium" as FilterRisk, location:"Tallinn, Estonia",       irr:"34.2%", minInvest:"€500",   raiseTarget:"€25M", raised:"€15.3M", progress:61, status:"live",     statusLabel:"● Live" },
  { id:3, emoji:"🏥", name:"MedCore Pharma",         ticker:"MCP", subtype:"ERC-3643",      type:"token"     as FilterType, risk:"low"    as FilterRisk, location:"Zurich, Switzerland",    irr:"19.8%", minInvest:"€250",   raiseTarget:"€40M", raised:"€29.6M", progress:74, status:"live",     statusLabel:"● Live" },
  { id:4, emoji:"🌊", name:"AquaTech Solutions",     ticker:"ATS", subtype:"Blockchain IPO", type:"ipo"      as FilterType, risk:"medium" as FilterRisk, location:"Amsterdam, Netherlands", irr:"22.1%", minInvest:"€500",   raiseTarget:"€12M", raised:"€11.2M", progress:93, status:"closing",  statusLabel:"⏱ Closing Soon" },
  { id:5, emoji:"🛸", name:"OrbitalX Space",         ticker:"ORB", subtype:"Seed Round",    type:"early"     as FilterType, risk:"high"   as FilterRisk, location:"Warsaw, Poland",          irr:"31.7%", minInvest:"€1,000", raiseTarget:"€8M",  raised:"€3.0M",  progress:38, status:"live",     statusLabel:"● Live" },
  { id:6, emoji:"📦", name:"Baltic Logistics REIT",  ticker:"BLR", subtype:"Secondary",     type:"secondary" as FilterType, risk:"low"    as FilterRisk, location:"Riga, Latvia",           irr:"16.3%", minInvest:"€250",   raiseTarget:"€6M",  raised:"€1.3M",  progress:22, status:"upcoming", statusLabel:"◆ Upcoming" },
];

const tableRows = [
  { name:"NeuroLogic AI",        ticker:"NLA", type:"Early-Stage",    stage:"Series A",    irr:"34.2%", price:"€1.42", mktcap:"€52M",  risk:"med",  prog:"61% · €15.3M/€25M", min:"€500",   status:"live"     },
  { name:"OrbitalX Space",       ticker:"ORB", type:"Early-Stage",    stage:"Seed",        irr:"31.7%", price:"€0.88", mktcap:"€14M",  risk:"high", prog:"38% · €3.0M/€8M",   min:"€1,000", status:"live"     },
  { name:"VoltGrid Energy",      ticker:"VGE", type:"Blockchain IPO", stage:"Public",      irr:"28.4%", price:"€2.10", mktcap:"€80M",  risk:"low",  prog:"87% · €15.7M/€18M", min:"€100",   status:"hot"      },
  { name:"AquaTech Solutions",   ticker:"ATS", type:"Blockchain IPO", stage:"Public",      irr:"22.1%", price:"€1.55", mktcap:"€35M",  risk:"med",  prog:"93% · €11.2M/€12M", min:"€500",   status:"closing"  },
  { name:"MedCore Pharma",       ticker:"MCP", type:"Equity Token",   stage:"ERC-3643",    irr:"19.8%", price:"€3.20", mktcap:"€190M", risk:"low",  prog:"74% · €29.6M/€40M", min:"€250",   status:"live"     },
  { name:"Baltic Logistics REIT",ticker:"BLR", type:"Secondary",      stage:"Token Float", irr:"16.3%", price:"€1.08", mktcap:"€28M",  risk:"low",  prog:"22% · €1.3M/€6M",   min:"€250",   status:"upcoming" },
];

const faqs = [
  { q:"What is a blockchain IPO?",                    a:"A blockchain IPO is a public equity offering launched natively on-chain. Investors receive compliant security tokens representing real equity ownership, with on-chain settlement and a transparent shareholder registry." },
  { q:"What does ERC-3643 mean?",                     a:"ERC-3643 is the regulatory-grade standard for security tokens on Ethereum. It enforces KYC, AML, and jurisdiction-based transfer controls at the smart contract level." },
  { q:"What is the minimum investment?",              a:"Minimum ticket sizes vary by offering. Early-stage rounds typically start from €500-€1,000, while blockchain IPOs can have entry points as low as €100." },
  { q:"Can equity tokens be traded after issuance?",  a:"Yes. Qualifying equity tokens may be listed on the Nextoken secondary exchange for peer-to-peer trading among eligible investors." },
  { q:"How do issuers launch an equity raise?",       a:"Issuers begin through the Tokenize workflow, submit legal documentation and financials, define equity structure and investor terms, then launch a compliant digital fundraise." },
];

function StatusBadge({ status, label }: { status: string; label: string }) {
  const map: Record<string,string> = {
    live:     "bg-green-500/10 text-green-400 border border-green-500/25",
    hot:      "bg-red-500/10 text-red-400 border border-red-500/25",
    closing:  "bg-yellow-600/10 text-yellow-400 border border-yellow-600/30",
    upcoming: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${map[status] ?? "bg-white/5 text-white/40 border border-white/10"}`}>
      {label}
    </span>
  );
}

function TypeBadge({ label }: { label: string }) {
  return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-white/5 text-white/40 border border-white/10">{label}</span>;
}

function RiskPill({ risk }: { risk: string }) {
  if (risk === "low")  return <span className="text-green-400 text-xs font-semibold">● Low Risk</span>;
  if (risk === "med")  return <span className="text-amber-400 text-xs font-semibold">● Medium Risk</span>;
  if (risk === "high") return <span className="text-red-400 text-xs font-semibold">● High Risk</span>;
  return null;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/[0.08] rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-[18px] bg-[#0d0d14] text-left text-[14.5px] font-medium text-[#e8e8f0] hover:bg-[#12121c] transition-colors">
        <span>{q}</span>
        <span className="text-[#d4af37] text-lg flex-shrink-0 ml-4">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 bg-[#0d0d14]">
          <p className="text-[13.5px] text-[#b0b0c8] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function ListingCard({ item }: { item: typeof listings[0] }) {
  const riskLabel = item.risk === "low" ? "● Low Risk" : item.risk === "medium" ? "● Medium Risk" : "● High Risk";
  const riskColor = item.risk === "low" ? "text-green-400" : item.risk === "medium" ? "text-amber-400" : "text-red-400";
  return (
    <div className="relative bg-[#0d0d14] border border-white/[0.08] rounded-xl p-6 hover:border-yellow-600/35 hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#d4af37] to-[#f0d060] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-between items-start mb-3">
        <span className="text-[32px]">{item.emoji}</span>
        <div className="flex flex-wrap gap-1.5 justify-end">
          <StatusBadge status={item.status} label={item.statusLabel} />
          <TypeBadge label={item.subtype} />
        </div>
      </div>
      <div className="font-syne text-[17px] font-bold text-[#e8e8f0] mb-0.5">{item.name}</div>
      <div className="font-mono text-[11px] text-[#7a7a96] mb-1">{item.ticker} · {item.subtype}</div>
      <div className="text-[12.5px] text-[#7a7a96] mb-4">📍 {item.location}</div>
      <div className="grid grid-cols-3 gap-3 mb-5 p-4 bg-white/[0.025] rounded-lg">
        <div><div className="font-syne text-[17px] font-bold text-[#d4af37]">{item.irr}</div><div className="text-[10.5px] text-[#7a7a96] mt-0.5">Target IRR</div></div>
        <div><div className="font-syne text-[17px] font-bold text-[#d4af37]">{item.minInvest}</div><div className="text-[10.5px] text-[#7a7a96] mt-0.5">Min. Invest</div></div>
        <div><div className="font-syne text-[17px] font-bold text-[#d4af37]">{item.raiseTarget}</div><div className="text-[10.5px] text-[#7a7a96] mt-0.5">Raise Target</div></div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#7a7a96] mb-1.5">
          <span>Funding Progress <strong className="text-[#e8e8f0]">{item.progress}%</strong></span>
          <span>{item.raised} / {item.raiseTarget}</span>
        </div>
        <div className="h-[5px] bg-white/[0.07] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#f0d060]" style={{ width: item.progress + "%" }} />
        </div>
      </div>
      <div className={`text-[11.5px] font-semibold mb-3 ${riskColor}`}>{riskLabel}</div>
      <button className="w-full py-2.5 rounded-lg border border-yellow-600/30 bg-yellow-600/10 text-[#d4af37] text-[13px] font-semibold hover:bg-[#d4af37] hover:text-black transition-all duration-150">
        View Opportunity
      </button>
    </div>
  );
}

export default function EquityIPOPage() {
  const [activeType, setActiveType] = useState<FilterType>("all");
  const [activeRisk, setActiveRisk] = useState<FilterRisk>("all");
  const [activeSort, setActiveSort] = useState("IRR");

  const filtered = listings.filter((l) => {
    const typeOk = activeType === "all" || l.type === activeType;
    const riskOk = activeRisk === "all" || l.risk === activeRisk;
    return typeOk && riskOk;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.35} }
        .pulse-dot { animation: pulse-dot 2s infinite; }
      `}</style>

      <div className="min-h-screen bg-[#050508] text-[#e8e8f0]" style={{ fontFamily:"'DM Sans',sans-serif" }}>

        {/* NAVBAR */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-16 bg-[rgba(5,5,8,0.88)] backdrop-blur-xl border-b border-white/[0.08]">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <span className="font-syne text-[19px] font-extrabold text-[#d4af37] tracking-wide leading-none">NXT</span>
            <div className="w-px h-[22px] bg-yellow-600/25" />
            <div className="leading-tight">
              <span className="font-syne block text-[12.5px] font-bold tracking-[3px] text-[#d4af37]">NEXTOKEN</span>
              <span className="block text-[8.5px] font-normal tracking-[2.5px] text-[#7a7a96] uppercase">CAPITAL</span>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            {[
              { label:"Markets",     href:"/markets"   },
              { label:"Exchange",    href:"/exchange"  },
              { label:"Bonds",       href:"/bonds"     },
              { label:"Equity & IPO",href:"/equity-ipo",active:true },
              { label:"Tokenize",    href:"/tokenize"  },
            ].map((link) => (
              <Link key={link.label} href={link.href}
                className={`px-3.5 py-1.5 rounded-md text-[13.5px] font-medium no-underline transition-all duration-150 ${link.active ? "text-[#d4af37] bg-yellow-600/[0.12]" : "text-[#7a7a96] hover:text-[#e8e8f0] hover:bg-white/[0.05]"}`}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/login" className="px-4 py-1.5 rounded-lg border border-white/[0.08] text-[#b0b0c8] text-[13px] font-medium no-underline hover:border-yellow-600/50 hover:text-[#d4af37] transition-all">Log In</Link>
            <Link href="/register" className="px-4 py-1.5 rounded-lg bg-[#d4af37] text-black text-[13px] font-semibold no-underline hover:opacity-85 transition-opacity">Get Started</Link>
          </div>
        </nav>

        {/* HERO */}
        <div className="relative px-8 pt-[90px] pb-[70px] text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 800px 400px at 50% -40px,rgba(212,175,55,0.15) 0%,transparent 70%),radial-gradient(ellipse 500px 300px at 20% 80%,rgba(99,102,241,0.06) 0%,transparent 60%)" }} />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-600/30 bg-yellow-600/[0.12] text-[#d4af37] text-[11px] font-semibold tracking-[1.8px] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] pulse-dot" />
            Equity &amp; IPO
          </div>
          <h1 className="font-syne text-[clamp(36px,6vw,68px)] font-extrabold leading-[1.05] tracking-[-1.5px] text-[#e8e8f0] max-w-[820px] mx-auto mb-5">
            Digital Equity &amp;<br /><span className="text-[#d4af37]">Blockchain IPO Market</span>
          </h1>
          <p className="text-[17px] font-light text-[#b0b0c8] max-w-[600px] mx-auto mb-9 leading-[1.7]">
            Participate in tokenized equity raises and blockchain-native IPOs. Early-stage access, transparent cap tables, and on-chain share issuance for modern investors.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="#listings" className="px-7 py-3 rounded-[9px] bg-[#d4af37] text-black text-[14px] font-semibold no-underline hover:opacity-85 transition-opacity">Explore Listings</a>
            <a href="#issue"    className="px-7 py-3 rounded-[9px] border border-yellow-600/30 text-[#d4af37] text-[14px] font-medium no-underline hover:bg-yellow-600/[0.12] transition-colors">Issue Equity</a>
          </div>
        </div>

        {/* STAT STRIP */}
        <div className="mx-8 border-t border-b border-white/[0.08] bg-[#0d0d14] flex flex-wrap">
          {[
            { val:"12",       label:"Active Offerings"    },
            { val:"€140M+",   label:"Total Capital Raised"},
            { val:"34.2%",    label:"Highest Upside"      },
            { val:"€100",     label:"Lowest Entry Point"  },
            { val:"4",        label:"Equity Types"        },
            { val:"ERC-3643", label:"Compliance Standard" },
          ].map((s, i, arr) => (
            <div key={s.label} className={`flex-1 min-w-[140px] px-7 py-5 text-center ${i < arr.length - 1 ? "border-r border-white/[0.08]" : ""}`}>
              <div className="font-syne text-[26px] font-bold text-[#d4af37] tracking-[-0.5px]">{s.val}</div>
              <div className="text-[11.5px] text-[#7a7a96] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* EQUITY TYPES */}
        <section className="max-w-[1200px] mx-auto px-8 py-[72px]">
          <div className="text-[11px] font-semibold tracking-[2.5px] uppercase text-[#d4af37] mb-3">Structures</div>
          <h2 className="font-syne text-[clamp(26px,4vw,42px)] font-bold tracking-[-0.8px] text-[#e8e8f0] mb-3">Equity Structures You Can Access</h2>
          <p className="text-[16px] text-[#b0b0c8] font-light max-w-[560px] leading-[1.7]">From early-stage SAFEs to full blockchain IPO listings, Nextoken supports the complete equity capital lifecycle.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              { icon:"🚀", name:"Blockchain IPO",      desc:"Full public equity offerings launched on-chain with transparent allocation, on-chain shareholder registry, and secondary market readiness." },
              { icon:"🌱", name:"Early-Stage Equity",  desc:"Invest in pre-IPO rounds for high-growth companies. Includes SAFE notes, priced seed rounds, and Series A allocations." },
              { icon:"📊", name:"Equity Tokens (ST)",  desc:"ERC-3643 compliant security tokens representing real equity with regulatory-grade investor whitelisting and transfer controls." },
              { icon:"🔄", name:"Secondary Listings",  desc:"Trade previously issued equity tokens on the Nextoken exchange. Liquidity for early investors without waiting for a traditional exit." },
            ].map((c) => (
              <div key={c.name} className="bg-[#0d0d14] border border-white/[0.08] rounded-xl p-7 hover:border-yellow-600/30 hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className="text-[28px] mb-3.5">{c.icon}</div>
                <div className="font-syne text-[16px] font-bold text-[#e8e8f0] mb-2">{c.name}</div>
                <div className="text-[13px] text-[#b0b0c8] leading-[1.6]">{c.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* LISTINGS */}
        <section id="listings" className="max-w-[1200px] mx-auto px-8 pb-[72px]">
          <div className="text-[11px] font-semibold tracking-[2.5px] uppercase text-[#d4af37] mb-3">Live Now</div>
          <h2 className="font-syne text-[clamp(26px,4vw,42px)] font-bold tracking-[-0.8px] text-[#e8e8f0] mb-3">Equity &amp; IPO Directory</h2>
          <p className="text-[16px] text-[#b0b0c8] font-light max-w-[560px] leading-[1.7] mb-8">Browse active raises, upcoming IPOs, and secondary market equity token listings.</p>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center mb-7">
            <span className="text-[11.5px] text-[#7a7a96] font-semibold tracking-wide">TYPE</span>
            <div className="flex flex-wrap gap-1.5">
              {(["all","ipo","early","token","secondary"] as FilterType[]).map((t) => {
                const labels: Record<FilterType,string> = { all:"All", ipo:"Blockchain IPO", early:"Early-Stage", token:"Equity Token", secondary:"Secondary" };
                return (
                  <button key={t} onClick={() => setActiveType(t)}
                    className={`px-3.5 py-1.5 rounded-full border text-[12.5px] font-medium transition-all ${activeType === t ? "border-yellow-600/50 text-[#d4af37] bg-yellow-600/[0.12]" : "border-white/[0.08] text-[#b0b0c8] hover:border-yellow-600/30 hover:text-[#d4af37]"}`}>
                    {labels[t]}
                  </button>
                );
              })}
            </div>
            <div className="w-px h-7 bg-white/[0.08]" />
            <div className="flex flex-wrap gap-1.5">
              {(["all","low","medium","high"] as FilterRisk[]).map((r) => {
                const labels: Record<FilterRisk,string> = { all:"All Risk", low:"Low", medium:"Medium", high:"High" };
                return (
                  <button key={r} onClick={() => setActiveRisk(r)}
                    className={`px-3.5 py-1.5 rounded-full border text-[12.5px] font-medium transition-all ${activeRisk === r ? "border-yellow-600/50 text-[#d4af37] bg-yellow-600/[0.12]" : "border-white/[0.08] text-[#b0b0c8] hover:border-yellow-600/30 hover:text-[#d4af37]"}`}>
                    {labels[r]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((item) => <ListingCard key={item.id} item={item} />)}
            {filtered.length === 0 && (
              <div className="col-span-3 py-16 text-center text-[#7a7a96]">No listings match this filter.</div>
            )}
          </div>
        </section>

        {/* TABLE */}
        <section className="max-w-[1200px] mx-auto px-8 pb-[72px]">
          <div className="text-[11px] font-semibold tracking-[2.5px] uppercase text-[#d4af37] mb-3">Full Directory</div>
          <h2 className="font-syne text-[clamp(26px,4vw,42px)] font-bold tracking-[-0.8px] text-[#e8e8f0] mb-5">All Equity Listings</h2>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {["IRR","Mkt Cap","Progress","Min. Invest","Name"].map((s) => (
              <button key={s} onClick={() => setActiveSort(s)}
                className={`px-3 py-1.5 rounded-md border text-[12px] font-medium transition-all ${activeSort === s ? "border-yellow-600/50 text-[#d4af37] bg-yellow-600/[0.12]" : "border-white/[0.08] text-[#7a7a96] hover:border-yellow-600/30 hover:text-[#d4af37]"}`}>
                Sort: {s}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto border border-white/[0.08] rounded-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#12121c]">
                  {["Company","Type","Stage","Target IRR","Share Price","Mkt Cap","Risk","Progress","Min. Invest","Status",""].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold tracking-[1px] uppercase text-[#7a7a96] border-b border-white/[0.08] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.08] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-[13.5px] text-[#e8e8f0]">{row.name}</div>
                      <div className="font-mono-dm text-[10.5px] text-[#7a7a96]">{row.ticker}</div>
                    </td>
                    <td className="px-4 py-3.5"><TypeBadge label={row.type} /></td>
                    <td className="px-4 py-3.5 text-[13px] text-[#b0b0c8]">{row.stage}</td>
                    <td className="px-4 py-3.5 font-syne font-bold text-green-400">{row.irr}</td>
                    <td className="px-4 py-3.5 font-mono-dm text-[12.5px] text-[#e8e8f0]">{row.price}</td>
                    <td className="px-4 py-3.5 font-mono-dm text-[12.5px] text-[#b0b0c8]">{row.mktcap}</td>
                    <td className="px-4 py-3.5"><RiskPill risk={row.risk} /></td>
                    <td className="px-4 py-3.5 text-[12.5px] text-[#b0b0c8] whitespace-nowrap">{row.prog}</td>
                    <td className="px-4 py-3.5 font-mono-dm text-[12.5px] text-[#e8e8f0]">{row.min}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={row.status} label={row.status==="live"?"● Live":row.status==="hot"?"🔥 Hot":row.status==="closing"?"⏱ Closing":"◆ Upcoming"} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button className="px-3.5 py-1.5 rounded-md border border-yellow-600/30 text-[#d4af37] text-[12px] font-semibold hover:bg-[#d4af37] hover:text-black transition-all">Invest</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="issue" className="max-w-[1200px] mx-auto px-8 pb-[72px]">
          <div className="text-[11px] font-semibold tracking-[2.5px] uppercase text-[#d4af37] mb-3">Issuer Workflow</div>
          <h2 className="font-syne text-[clamp(26px,4vw,42px)] font-bold tracking-[-0.8px] text-[#e8e8f0] mb-3">How Equity Issuance Works</h2>
          <p className="text-[16px] text-[#b0b0c8] font-light max-w-[560px] leading-[1.7] mb-12">From structure to on-chain settlement, Nextoken handles the full lifecycle of your equity raise.</p>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="hidden lg:block absolute top-6 left-16 right-16 h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
            {[
              { n:"01", title:"Define Equity Structure",   body:"Set share class, total supply, valuation cap, investor rights, and preferred terms or SAFE parameters." },
              { n:"02", title:"Submit Legal & Financials", body:"Prepare cap table, pitch deck, audited financials, and disclosure documentation for review." },
              { n:"03", title:"Token Issuance",            body:"Equity is tokenized as ERC-3643 compliant security tokens with KYC-gated investor whitelisting on-chain." },
              { n:"04", title:"Run the Fundraise",         body:"Open subscriptions to eligible investors. Monitor allocation progress and milestones in real time." },
              { n:"05", title:"Exchange Listing Path",     body:"Qualified equity tokens may progress to the Nextoken secondary exchange for liquidity and investor exits." },
            ].map((step) => (
              <div key={step.n}>
                <div className="w-12 h-12 rounded-full border border-yellow-600/30 bg-yellow-600/[0.12] flex items-center justify-center font-syne text-[15px] font-bold text-[#d4af37] mb-4 relative z-10">{step.n}</div>
                <h4 className="font-syne text-[14.5px] font-bold text-[#e8e8f0] mb-2">{step.title}</h4>
                <p className="text-[13px] text-[#7a7a96] leading-[1.65]">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-[1200px] mx-auto px-8 pb-[72px]">
          <div className="text-[11px] font-semibold tracking-[2.5px] uppercase text-[#d4af37] mb-3">FAQ</div>
          <h2 className="font-syne text-[clamp(26px,4vw,42px)] font-bold tracking-[-0.8px] text-[#e8e8f0] mb-8">Common Equity Questions</h2>
          <div className="flex flex-col gap-2.5">
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </section>

        {/* CTA */}
        <div className="mx-8 mb-16 rounded-[18px] px-12 py-16 text-center relative overflow-hidden border border-yellow-600/30" style={{ background:"linear-gradient(135deg,rgba(212,175,55,0.10) 0%,rgba(99,102,241,0.07) 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 600px 300px at 50% 0%,rgba(212,175,55,0.10) 0%,transparent 70%)" }} />
          <div className="relative z-10">
            <div className="text-[11px] font-semibold tracking-[2.5px] uppercase text-[#d4af37] mb-3">Get Started</div>
            <h2 className="font-syne text-[clamp(24px,3.5vw,38px)] font-bold tracking-[-0.8px] text-[#e8e8f0] mb-3">Ready to Issue or Invest<br />in Digital Equity?</h2>
            <p className="text-[15px] text-[#b0b0c8] font-light max-w-[460px] mx-auto mb-8">Join 12,400+ investors and issuers building the future of capital markets on Nextoken.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/tokenize" className="px-7 py-3 rounded-[9px] bg-[#d4af37] text-black text-[14px] font-semibold no-underline hover:opacity-85 transition-opacity">Issue Equity</Link>
              <Link href="/exchange" className="px-7 py-3 rounded-[9px] border border-yellow-600/30 text-[#d4af37] text-[14px] font-medium no-underline hover:bg-yellow-600/[0.12] transition-colors">Explore Exchange</Link>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="border-t border-white/[0.08] px-8 pt-14 pb-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-syne text-[19px] font-extrabold text-[#d4af37] tracking-wide leading-none">NXT</span>
                  <div className="w-px h-[22px] bg-yellow-600/25" />
                  <div className="leading-tight">
                    <span className="font-syne block text-[12.5px] font-bold tracking-[3px] text-[#d4af37]">NEXTOKEN</span>
                    <span className="block text-[8.5px] font-normal tracking-[2.5px] text-[#7a7a96] uppercase">CAPITAL</span>
                  </div>
                </div>
                <p className="text-[12.5px] text-[#7a7a96] max-w-[240px] leading-[1.7] mb-5">The regulated infrastructure for tokenized real-world assets. Registered in Lithuania.</p>
                <div className="text-[10.5px] text-[#7a7a96] uppercase tracking-[0.5px]">
                  MONITORED BY<br />
                  <a href="#" className="text-[#d4af37] no-underline hover:underline">LT Bank of Lithuania</a>
                </div>
              </div>
              <div>
                <h5 className="text-[10.5px] font-semibold tracking-[2px] uppercase text-[#7a7a96] mb-4">Products</h5>
                {[["Markets","/markets"],["Exchange","/exchange"],["Bonds","/bonds"],["Equity & IPO","/equity-ipo"],["Tokenize","/tokenize"]].map(([l,h]) => (
                  <Link key={l} href={h} className="block text-[13px] text-[#b0b0c8] no-underline hover:text-[#e8e8f0] transition-colors mb-2.5">{l}</Link>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-white/[0.08] flex flex-wrap justify-between gap-3">
              <p className="text-[12px] text-[#7a7a96]">© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
              <p className="text-[11px] text-[#7a7a96] opacity-70">Risk warning: Investing in tokenized equity involves significant risk. Past performance is not indicative of future results.</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
