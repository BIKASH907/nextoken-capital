import { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SERVICES = [
  { name:"Platform & Web App",          status:"operational", uptime:"99.98%" },
  { name:"Secondary Market Exchange",   status:"operational", uptime:"99.95%" },
  { name:"KYC Verification (Sumsub)",   status:"operational", uptime:"99.90%" },
  { name:"Wallet Connection",           status:"operational", uptime:"99.97%" },
  { name:"API",                         status:"operational", uptime:"99.99%" },
  { name:"Email Notifications",         status:"operational", uptime:"99.85%" },
  { name:"Blockchain Settlement",       status:"operational", uptime:"99.92%" },
  { name:"Authentication Service",      status:"operational", uptime:"99.98%" },
];

const INCIDENTS = [
  { date:"Feb 14, 2026", title:"Scheduled Maintenance — Exchange Downtime",    duration:"45 min", status:"resolved", detail:"Planned maintenance to upgrade exchange matching engine. Completed ahead of schedule with no data loss." },
  { date:"Jan 28, 2026", title:"KYC Verification Delays",                      duration:"2 hr",   status:"resolved", detail:"Sumsub experienced elevated processing times affecting new user verifications. Resolved by Sumsub engineering team." },
  { date:"Jan 5, 2026",  title:"API Rate Limiting Issue",                      duration:"30 min", status:"resolved", detail:"Incorrect rate limits applied to certain API endpoints. Corrected and additional monitoring added." },
];

export default function StatusPage() {
  const [now, setNow] = useState("");
  useEffect(() => { setNow(new Date().toLocaleString("en-GB", { timeZone:"Europe/Vilnius" })); }, []);

  const allOperational = SERVICES.every(s => s.status === "operational");

  return (
    <>
      <Head>
        <title>Platform Status — Nextoken Capital</title>
        <meta name="description" content="Real-time status of Nextoken Capital platform services." />
      </Head>
      <Navbar />
      <style>{`
        .st{min-height:100vh;background:#0B0E11;padding-top:64px}
        .st-hero{padding:52px 20px 36px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.07)}
        .st-tag{font-size:11px;font-weight:700;color:#F0B90B;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
        .st-h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#fff;letter-spacing:-1px;margin-bottom:16px}
        .st-overall{display:inline-flex;align-items:center;gap:10px;padding:12px 22px;border-radius:999px;font-size:14px;font-weight:700;margin-bottom:10px}
        .st-overall.green{background:rgba(14,203,129,0.1);border:1px solid rgba(14,203,129,0.3);color:#0ECB81}
        .st-overall.red{background:rgba(255,77,77,0.1);border:1px solid rgba(255,77,77,0.3);color:#FF4D4D}
        .st-dot{width:8px;height:8px;border-radius:50%;animation:st-pulse 2s ease-in-out infinite}
        .st-dot.green{background:#0ECB81}
        .st-dot.red{background:#FF4D4D}
        @keyframes st-pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .st-time{font-size:12px;color:rgba(255,255,255,0.3)}
        .st-body{max-width:860px;margin:0 auto;padding:40px 20px 72px}
        .st-section-title{font-size:13px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1px;margin-bottom:14px}
        .st-services{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:14px;overflow:hidden;margin-bottom:36px}
        .st-service{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid rgba(255,255,255,0.05);gap:12px}
        .st-service:last-child{border-bottom:none}
        .st-svc-left{display:flex;align-items:center;gap:10px;flex:1}
        .st-svc-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .st-svc-dot.operational{background:#0ECB81}
        .st-svc-dot.degraded{background:#F0B90B}
        .st-svc-dot.outage{background:#FF4D4D}
        .st-svc-name{font-size:14px;color:#fff;font-weight:500}
        .st-svc-right{display:flex;align-items:center;gap:16px}
        .st-svc-uptime{font-size:12px;color:rgba(255,255,255,0.35)}
        .st-svc-badge{padding:3px 10px;border-radius:999px;font-size:10px;font-weight:700}
        .st-svc-badge.operational{background:rgba(14,203,129,0.1);color:#0ECB81;border:1px solid rgba(14,203,129,0.25)}
        .st-svc-badge.degraded{background:rgba(240,185,11,0.1);color:#F0B90B;border:1px solid rgba(240,185,11,0.25)}
        .st-svc-badge.outage{background:rgba(255,77,77,0.1);color:#FF4D4D;border:1px solid rgba(255,77,77,0.25)}
        .st-incidents{}
        .st-incident{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px 22px;margin-bottom:10px}
        .st-inc-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}
        .st-inc-title{font-size:14px;font-weight:700;color:#fff}
        .st-inc-date{font-size:11px;color:rgba(255,255,255,0.35);flex-shrink:0}
        .st-inc-meta{display:flex;gap:10px;margin-bottom:8px;flex-wrap:wrap}
        .st-inc-resolved{padding:2px 10px;border-radius:999px;font-size:10px;font-weight:700;background:rgba(14,203,129,0.1);color:#0ECB81;border:1px solid rgba(14,203,129,0.2)}
        .st-inc-duration{font-size:11px;color:rgba(255,255,255,0.35)}
        .st-inc-detail{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7}
        .st-uptime-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:36px}
        .st-up-card{background:#0F1318;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;text-align:center}
        .st-up-val{font-size:1.6rem;font-weight:900;color:#0ECB81;margin-bottom:4px}
        .st-up-lbl{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1px}
        @media(max-width:540px){.st-uptime-summary{grid-template-columns:1fr}.st-svc-uptime{display:none}}
      `}</style>
      <div className="st">
        <div className="st-hero">
          <div className="st-tag">System Status</div>
          <h1 className="st-h1">Platform Status</h1>
          <div className={`st-overall ${allOperational ? "green" : "red"}`}>
            <span className={`st-dot ${allOperational ? "green" : "red"}`} />
            {allOperational ? "All systems operational" : "Some systems degraded"}
          </div>
          <div className="st-time">Last updated: {now || "Loading..."} EET</div>
        </div>
        <div className="st-body">

          <div className="st-uptime-summary">
            <div className="st-up-card"><div className="st-up-val">99.96%</div><div className="st-up-lbl">30-day uptime</div></div>
            <div className="st-up-card"><div className="st-up-val">99.94%</div><div className="st-up-lbl">90-day uptime</div></div>
            <div className="st-up-card"><div className="st-up-val">0</div><div className="st-up-lbl">Active incidents</div></div>
          </div>

          <div className="st-section-title">Services</div>
          <div className="st-services">
            {SERVICES.map(s => (
              <div key={s.name} className="st-service">
                <div className="st-svc-left">
                  <div className={`st-svc-dot ${s.status}`} />
                  <span className="st-svc-name">{s.name}</span>
                </div>
                <div className="st-svc-right">
                  <span className="st-svc-uptime">{s.uptime} uptime</span>
                  <span className={`st-svc-badge ${s.status}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="st-section-title">Recent Incidents</div>
          <div className="st-incidents">
            {INCIDENTS.map(inc => (
              <div key={inc.title} className="st-incident">
                <div className="st-inc-head">
                  <div className="st-inc-title">{inc.title}</div>
                  <div className="st-inc-date">{inc.date}</div>
                </div>
                <div className="st-inc-meta">
                  <span className="st-inc-resolved">Resolved</span>
                  <span className="st-inc-duration">Duration: {inc.duration}</span>
                </div>
                <p className="st-inc-detail">{inc.detail}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}