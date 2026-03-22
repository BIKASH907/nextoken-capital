import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TOKENS = [
  { symbol:"SOLAR-01", name:"Solar Farm Portfolio",      price:10.42, change:+2.4,  vol:"€142K", cap:"€5.2M",  yield:"18.2%", risk:"Low" },
  { symbol:"OFFIC-03", name:"Tokenized Office Building", price:8.91,  change:-0.8,  vol:"€89K",  cap:"€2.4M",  yield:"16.4%", risk:"Low" },
  { symbol:"WIND-07",  name:"Wind Energy Project",       price:12.15, change:+5.1,  vol:"€201K", cap:"€6.5M",  yield:"17.6%", risk:"Medium" },
  { symbol:"RETL-02",  name:"Retail Shopping Centre",    price:9.78,  change:+0.3,  vol:"€67K",  cap:"€4.0M",  yield:"13.9%", risk:"Low" },
  { symbol:"LOGX-06",  name:"Logistics Hub",             price:11.20, change:+1.9,  vol:"€310K", cap:"€8.0M",  yield:"15.1%", risk:"Medium" },
  { symbol:"STUD-04",  name:"Student Housing Block",     price:7.65,  change:-1.2,  vol:"€44K",  cap:"€1.8M",  yield:"14.2%", risk:"Low" },
  { symbol:"TECH-08",  name:"Tech Business Park",        price:15.30, change:+3.7,  vol:"€520K", cap:"€10.0M", yield:"15.9%", risk:"Medium" },
  { symbol:"H2-09",    name:"Green Hydrogen Plant",      price:22.10, change:+8.2,  vol:"€890K", cap:"€12.0M", yield:"18.8%", risk:"High" },
];

export default function ExchangePage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(TOKENS[0]);
  const [qty, setQty] = useState("");
  const [side, setSide] = useState("buy");

  const filtered = TOKENS.filter(t =>
    t.symbol.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = qty ? (parseFloat(qty) * selected.price).toFixed(2) : "0.00";

  return (
    <>
      <Head><title>Exchange — Nextoken Capital</title></Head>
      <Navbar />
      <style>{`
        .ex-page { min-height:100vh; background:#0B0E11; padding-top:64px; }
        .ex-hero { padding:48px 20px 32px; border-bottom:1px solid rgba(255,255,255,0.07); }
        .ex-hero-inner { max-width:1280px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; }
        .ex-hero-left .tag { font-size:11px; font-weight:700; color:#F0B90B; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px; }
        .ex-hero-left h1 { font-size:clamp(1.6rem,3vw,2.4rem); font-weight:900; color:#fff; letter-spacing:-1px; margin-bottom:6px; }
        .ex-hero-left p { font-size:13px; color:rgba(255,255,255,0.45); }
        .ex-stats { display:flex; gap:28px; flex-wrap:wrap; }
        .ex-stat-v { font-size:18px; font-weight:900; color:#F0B90B; }
        .ex-stat-l { font-size:11px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:1px; }
        .ex-body { max-width:1280px; margin:0 auto; padding:24px 20px 60px; display:grid; grid-template-columns:1fr 360px; gap:20px; align-items:start; }
        .ex-table-wrap { background:#0F1318; border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow:hidden; }
        .ex-table-head { padding:16px 20px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.07); }
        .ex-table-head h3 { font-size:14px; font-weight:700; color:#fff; }
        .ex-search { padding:7px 14px; background:#161B22; border:1px solid rgba(255,255,255,0.1); border-radius:7px; color:#fff; font-size:13px; outline:none; font-family:inherit; width:200px; }
        .ex-table { width:100%; border-collapse:collapse; }
        .ex-table th { padding:10px 16px; font-size:11px; font-weight:700; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:1px; text-align:left; border-bottom:1px solid rgba(255,255,255,0.06); }
        .ex-table td { padding:14px 16px; font-size:13px; color:rgba(255,255,255,0.75); border-bottom:1px solid rgba(255,255,255,0.04); }
        .ex-table tr { cursor:pointer; transition:background .15s; }
        .ex-table tr:hover td, .ex-table tr.sel td { background:rgba(240,185,11,0.05); }
        .ex-table tr.sel td { border-left:2px solid #F0B90B; }
        .ex-sym { font-weight:800; color:#fff; font-size:12px; }
        .ex-name { font-size:11px; color:rgba(255,255,255,0.4); }
        .ex-price { font-weight:700; color:#fff; }
        .pos { color:#0ECB81; } .neg { color:#FF4D4D; }
        .trade-panel { background:#0F1318; border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:22px; position:sticky; top:80px; }
        .trade-title { font-size:15px; font-weight:800; color:#fff; margin-bottom:4px; }
        .trade-price-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.07); }
        .trade-price { font-size:22px; font-weight:900; color:#F0B90B; }
        .side-tabs { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:18px; }
        .side-btn { padding:10px; border-radius:8px; font-size:13px; font-weight:700; border:none; cursor:pointer; font-family:inherit; transition:all .15s; }
        .side-btn.buy-on  { background:#0ECB81; color:#000; }
        .side-btn.sell-on { background:#FF4D4D; color:#fff; }
        .side-btn.off     { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5); }
        .trade-field { margin-bottom:14px; }
        .trade-field label { display:block; font-size:11px; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px; }
        .trade-field input { width:100%; padding:11px 14px; background:#161B22; border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:#fff; font-size:14px; outline:none; font-family:inherit; transition:border-color .15s; }
        .trade-field input:focus { border-color:rgba(240,185,11,0.5); }
        .trade-total { display:flex; justify-content:space-between; padding:12px 14px; background:rgba(240,185,11,0.06); border-radius:8px; margin-bottom:16px; font-size:13px; }
        .trade-total span:last-child { font-weight:800; color:#F0B90B; }
        .trade-btn { width:100%; padding:13px; border:none; border-radius:8px; font-size:14px; font-weight:800; cursor:pointer; font-family:inherit; transition:background .15s; }
        .trade-btn.buy  { background:#0ECB81; color:#000; }
        .trade-btn.sell { background:#FF4D4D; color:#fff; }
        .trade-note { font-size:11px; color:rgba(255,255,255,0.3); text-align:center; margin-top:10px; line-height:1.5; }
        @media(max-width:900px){ .ex-body{ grid-template-columns:1fr; } .trade-panel{ position:static; } }
        @media(max-width:540px){ .ex-search{ width:100%; } .ex-stats{ gap:16px; } }
      `}</style>

      <div className="ex-page">
        <div className="ex-hero">
          <div className="ex-hero-inner">
            <div className="ex-hero-left">
              <div className="tag">Secondary Market</div>
              <h1>Trade Tokenized Assets</h1>
              <p>Buy and sell security tokens on the regulated secondary market.</p>
            </div>
            <div className="ex-stats">
              {[["€2.3M","24h Volume"],["8","Listed Tokens"],["0.2%","Trading Fee"],["T+0","Settlement"]].map(([v,l])=>(
                <div key={l}><div className="ex-stat-v">{v}</div><div className="ex-stat-l">{l}</div></div>
              ))}
            </div>
          </div>
        </div>

        <div className="ex-body">
          <div className="ex-table-wrap">
            <div className="ex-table-head">
              <h3>All Markets</h3>
              <input className="ex-search" placeholder="Search tokens..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <table className="ex-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Price</th>
                  <th>24h Change</th>
                  <th>Volume</th>
                  <th>Market Cap</th>
                  <th>Yield</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.symbol} className={selected.symbol===t.symbol?"sel":""} onClick={()=>setSelected(t)}>
                    <td><div className="ex-sym">{t.symbol}</div><div className="ex-name">{t.name}</div></td>
                    <td className="ex-price">€{t.price.toFixed(2)}</td>
                    <td className={t.change>=0?"pos":"neg"}>{t.change>=0?"+":""}{t.change}%</td>
                    <td>{t.vol}</td>
                    <td>{t.cap}</td>
                    <td style={{color:"#F0B90B",fontWeight:700}}>{t.yield}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="trade-panel">
            <div className="trade-title">{selected.symbol}</div>
            <div className="trade-price-row">
              <div className="trade-price">€{selected.price.toFixed(2)}</div>
              <span className={selected.change>=0?"pos":"neg"} style={{fontWeight:700}}>
                {selected.change>=0?"+":""}{selected.change}%
              </span>
            </div>
            <div className="side-tabs">
              <button className={"side-btn "+(side==="buy"?"buy-on":"off")} onClick={()=>setSide("buy")}>Buy</button>
              <button className={"side-btn "+(side==="sell"?"sell-on":"off")} onClick={()=>setSide("sell")}>Sell</button>
            </div>
            <div className="trade-field">
              <label>Quantity (tokens)</label>
              <input type="number" placeholder="0" min="1" value={qty} onChange={e=>setQty(e.target.value)} />
            </div>
            <div className="trade-field">
              <label>Price per token</label>
              <input value={"€" + selected.price.toFixed(2)} readOnly style={{opacity:.6}} />
            </div>
            <div className="trade-total">
              <span>Total</span>
              <span>€{total}</span>
            </div>
            <Link href="/register">
              <button className={"trade-btn "+side}>{side==="buy"?"Buy "+selected.symbol:"Sell "+selected.symbol}</button>
            </Link>
            <p className="trade-note">You must be KYC verified to trade. All trades are final.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
