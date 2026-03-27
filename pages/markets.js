import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ALL_PROJECTS = [
  { id:1, emoji:"☀️", badge:"Closing Soon", risk:"Low", cat:"Energy",         title:"Solar Farm Portfolio",     location:"Alicante, Spain",         roi:18.2, min:250,  term:60, raised:4600000, target:5000000 },
  { id:2, emoji:"🛍️", badge:"Closing Soon", risk:"Low", cat:"Commercial",     title:"Retail Shopping Centre",   location:"Amsterdam, Netherlands",  roi:13.9, min:1000, term:36, raised:3520000, target:4000000 },
  { id:3, emoji:"🏢", badge:"Live",         risk:"Low", cat:"Property",       title:"Tokenized Office Building", location:"Berlin, Germany",        roi:16.4, min:500,  term:36, raised:1872000, target:2400000 },
  { id:4, emoji:"🏠", badge:"Live",         risk:"Low", cat:"Property",       title:"Student Housing Block",    location:"Prague, Czechia",         roi:14.2, min:250,  term:24, raised:1278000, target:1800000 },
  { id:5, emoji:"🏘️", badge:"Live",         risk:"Low", cat:"Property",       title:"Residential Complex",      location:"Lisbon, Portugal",        roi:14.8, min:500,  term:24, raised:1920000, target:3200000 },
  { id:6, emoji:"🏭", badge:"Live",         risk:"Medium", cat:"Infrastructure", title:"Logistics Hub",          location:"Warsaw, Poland",          roi:15.1, min:1000, term:48, raised:3600000, target:8000000 },
  { id:7, emoji:"💨", badge:"Live",         risk:"Medium", cat:"Energy",        title:"Wind Energy Project",     location:"Gdansk, Poland",          roi:17.6, min:250,  term:72, raised:2145000, target:6500000 },
  { id:8, emoji:"💼", badge:"Live",         risk:"Medium", cat:"Commercial",    title:"Tech Business Park",      location:"Dublin, Ireland",         roi:15.9, min:500,  term:60, raised:2000000, target:10000000 },
  { id:9, emoji:"⚗️", badge:"Live",         risk:"High",   cat:"Energy",        title:"Green Hydrogen Plant",    location:"Rotterdam, Netherlands",  roi:18.8, min:2000, term:84, raised:1800000, target:12000000 },
];

const CATS = ["All","Property","Energy","Infrastructure","Commercial"];
const RISKS = ["All","Low","Medium","High"];

function fmt(n) {
  if (n >= 1000000) return "€" + (n/1000000).toFixed(1) + "M";
  if (n >= 1000) return "€" + (n/1000).toFixed(0) + "K";
  return "€" + n;
}

export default function MarketsPage() {
  const [cat, setCat] = useState("All");
  const [risk, setRisk] = useState("All");
  const [sort, setSort] = useState("Most Funded");

  let list = ALL_PROJECTS
    .filter(p => cat  === "All" || p.cat  === cat)
    .filter(p => risk === "All" || p.risk === risk);

  if (sort === "Highest ROI")       list = [...list].sort((a,b) => b.roi - a.roi);
  if (sort === "Lowest Min. Invest") list = [...list].sort((a,b) => a.min - b.min);
  if (sort === "Most Funded")        list = [...list].sort((a,b) => (b.raised/b.target) - (a.raised/a.target));

  const riskColor = { Low:"#0ECB81", Medium:"#F0B90B", High:"#FF4D4D" };

  return (
    <>
      <Head><title>Markets — Nextoken Capital</title></Head>
      <Navbar />
      <style>{`
        .mk-page { min-height:100vh; background:#0B0E11; padding-top:64px; }
        .mk-hero { padding:60px 20px 40px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.07); }
        .mk-hero-tag { font-size:11px; font-weight:700; color:#F0B90B; letter-spacing:2px; text-transform:uppercase; margin-bottom:12px; }
        .mk-hero h1 { font-size:clamp(1.8rem,4vw,3rem); font-weight:900; color:#fff; margin-bottom:12px; letter-spacing:-1px; }
        .mk-hero p { font-size:14px; color:rgba(255,255,255,0.45); max-width:520px; margin:0 auto; line-height:1.7; }
        .mk-filters { max-width:1280px; margin:0 auto; padding:24px 20px; display:flex; gap:16px; flex-wrap:wrap; align-items:center; }
        .filter-group { display:flex; flex-direction:column; gap:6px; }
        .filter-label { font-size:11px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:1px; font-weight:700; }
        .filter-btns { display:flex; gap:6px; flex-wrap:wrap; }
        .filter-btn { padding:6px 14px; border-radius:6px; font-size:12px; font-weight:600; border:1px solid rgba(255,255,255,0.12); background:transparent; color:rgba(255,255,255,0.55); cursor:pointer; transition:all .15s; font-family:inherit; }
        .filter-btn:hover { border-color:rgba(255,255,255,0.3); color:#fff; }
        .filter-btn.on { background:rgba(240,185,11,0.12); border-color:rgba(240,185,11,0.4); color:#F0B90B; }
        .filter-select { padding:7px 12px; border-radius:6px; font-size:12px; background:#161B22; border:1px solid rgba(255,255,255,0.12); color:#fff; cursor:pointer; font-family:inherit; outline:none; }
        .mk-count { font-size:12px; color:rgba(255,255,255,0.35); margin-left:auto; align-self:flex-end; padding-bottom:2px; }
        .mk-grid { max-width:1280px; margin:0 auto; padding:0 20px 60px; display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .mk-card { background:#0F1318; border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow:hidden; transition:border-color .2s,transform .2s; }
        .mk-card:hover { border-color:rgba(240,185,11,0.25); transform:translateY(-2px); }
        .mk-card-top { padding:22px 22px 0; }
        .mk-card-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
        .mk-card-emoji { font-size:32px; line-height:1; }
        .mk-card-badges { display:flex; flex-direction:column; gap:5px; align-items:flex-end; }
        .badge-live { padding:3px 10px; border-radius:999px; font-size:10px; font-weight:700; background:rgba(14,203,129,0.12); color:#0ECB81; border:1px solid rgba(14,203,129,0.3); }
        .badge-soon { padding:3px 10px; border-radius:999px; font-size:10px; font-weight:700; background:rgba(240,185,11,0.12); color:#F0B90B; border:1px solid rgba(240,185,11,0.3); }
        .badge-risk { padding:3px 10px; border-radius:999px; font-size:10px; font-weight:700; }
        .mk-card-cat { font-size:11px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; font-weight:700; }
        .mk-card-title { font-size:16px; font-weight:800; color:#fff; margin-bottom:4px; line-height:1.3; }
        .mk-card-loc { font-size:12px; color:rgba(255,255,255,0.4); margin-bottom:18px; }
        .mk-card-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; padding:0 22px 18px; border-top:1px solid rgba(255,255,255,0.06); padding-top:16px; }
        .mk-stat-val { font-size:15px; font-weight:800; color:#F0B90B; }
        .mk-stat-lbl { font-size:10px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:.5px; margin-top:2px; }
        .mk-progress-wrap { padding:0 22px 18px; }
        .mk-progress-top { display:flex; justify-content:space-between; font-size:11px; color:rgba(255,255,255,0.4); margin-bottom:6px; }
        .mk-progress-bar { height:4px; background:rgba(255,255,255,0.08); border-radius:2px; overflow:hidden; }
        .mk-progress-fill { height:100%; background:#F0B90B; border-radius:2px; transition:width .4s; }
        .mk-card-action { padding:0 22px 22px; }
        .mk-btn { display:block; width:100%; padding:11px; background:rgba(240,185,11,0.1); border:1px solid rgba(240,185,11,0.25); color:#F0B90B; border-radius:8px; font-size:13px; font-weight:700; text-align:center; text-decoration:none; transition:all .15s; cursor:pointer; font-family:inherit; }
        .mk-btn:hover { background:rgba(240,185,11,0.18); border-color:rgba(240,185,11,0.5); }
        .mk-cta { background:#F0B90B; padding:60px 20px; text-align:center; }
        .mk-cta h2 { font-size:clamp(1.6rem,3vw,2.4rem); font-weight:900; color:#000; margin-bottom:12px; }
        .mk-cta p { font-size:14px; color:rgba(0,0,0,0.6); margin-bottom:28px; }
        .mk-cta-btn { display:inline-block; padding:13px 32px; background:#000; color:#fff; border-radius:8px; font-size:14px; font-weight:800; text-decoration:none; }
        @media(max-width:900px){ .mk-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:540px){ .mk-grid{ grid-template-columns:1fr; } .mk-filters{ flex-direction:column; align-items:flex-start; } .mk-count{ margin-left:0; } }
      `}</style>

      <div className="mk-page">
        <div className="mk-hero">
          <div className="mk-hero-tag">Marketplace Listings  <Footer />
</div>
          <h1>Explore the Tokenized Asset Marketplace</h1>
          <p>Browse curated tokenized listings across property, energy, infrastructure, and commercial sectors.</p>
          <Footer />
</div>

        <div className="mk-filters">
          <div className="filter-group">
            <div className="filter-label">Category  <Footer />
</div>
            <div className="filter-btns">
              {CATS.map(c => <button key={c} className={"filter-btn"+(cat===c?" on":"")} onClick={()=>setCat(c)}>{c}</button>)}
              <Footer />
</div>
            <Footer />
</div>
          <div className="filter-group">
            <div className="filter-label">Risk Level  <Footer />
</div>
            <div className="filter-btns">
              {RISKS.map(r => <button key={r} className={"filter-btn"+(risk===r?" on":"")} onClick={()=>setRisk(r)}>{r}</button>)}
              <Footer />
</div>
            <Footer />
</div>
          <div className="filter-group">
            <div className="filter-label">Sort By  <Footer />
</div>
            <select className="filter-select" value={sort} onChange={e=>setSort(e.target.value)}>
              <option>Most Funded</option>
              <option>Highest ROI</option>
              <option>Lowest Min. Invest</option>
            </select>
            <Footer />
</div>
          <div className="mk-count">Showing <strong>{list.length}</strong> of <strong>{ALL_PROJECTS.length}</strong> opportunities  <Footer />
</div>
          <Footer />
</div>

        <div className="mk-grid">
          {list.map(p => {
            const pct = Math.round((p.raised/p.target)*100);
            return (
              <div key={p.id} className="mk-card">
                <div className="mk-card-top">
                  <div className="mk-card-head">
                    <span className="mk-card-emoji">{p.emoji}</span>
                    <div className="mk-card-badges">
                      <span className={p.badge==="Closing Soon"?"badge-soon":"badge-live"}>{p.badge}</span>
                      <span className="badge-risk" style={{background:`rgba(${p.risk==="Low"?"14,203,129":p.risk==="Medium"?"240,185,11":"255,77,77"},0.1)`,color:riskColor[p.risk],border:`1px solid ${riskColor[p.risk]}44`}}>{p.risk} Risk</span>
                      <Footer />
</div>
                    <Footer />
</div>
                  <div className="mk-card-cat">{p.cat}  <Footer />
</div>
                  <div className="mk-card-title">{p.title}  <Footer />
</div>
                  <div className="mk-card-loc">📍 {p.location}  <Footer />
</div>
                  <Footer />
</div>
                <div className="mk-card-stats">
                  <div><div className="mk-stat-val">{p.roi}%</div><div className="mk-stat-lbl">Target ROI</div>  <Footer />
</div>
                  <div><div className="mk-stat-val">{fmt(p.min)}</div><div className="mk-stat-lbl">Min. Invest</div>  <Footer />
</div>
                  <div><div className="mk-stat-val">{p.term}mo</div><div className="mk-stat-lbl">Term</div>  <Footer />
</div>
                  <Footer />
</div>
                <div className="mk-progress-wrap">
                  <div className="mk-progress-top">
                    <span>Funding Progress <strong style={{color:"#fff"}}>{pct}%</strong></span>
                    <span>{fmt(p.raised)} raised</span>
                    <Footer />
</div>
                  <div className="mk-progress-bar"><div className="mk-progress-fill" style={{width:pct+"%"}} />  <Footer />
</div>
                  <Footer />
</div>
                <div className="mk-card-action">
                  <Link href="/register" className="mk-btn">View Listing</Link>
                  <Footer />
</div>
                <Footer />
</div>
            );
          })}
          <Footer />
</div>

        <div className="mk-cta">
          <h2>Start trading on the marketplace today</h2>
          <p>Create your account to trade tokenized assets on our marketplace.</p>
          <Link href="/register" className="mk-cta-btn">Register Now</Link>
          <Footer />
</div>
        <Footer />
</div>
      <Footer />
    </>
  );
}
