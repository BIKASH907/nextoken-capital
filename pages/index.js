import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

const TICKER_ITEMS = [
  { symbol: "BTC/EUR", price: "62,054.31", change: "-3.66" },
  { symbol: "ETH/EUR", price: "1,913.01", change: "-5.24" },
  { symbol: "BNB/EUR", price: "568.90", change: "-2.20" },
  { symbol: "SOL/EUR", price: "98.42", change: "+1.12" },
  { symbol: "XRP/EUR", price: "0.4821", change: "+0.87" },
  { symbol: "ADA/EUR", price: "0.3312", change: "-1.45" },
  { symbol: "AVAX/EUR", price: "22.18", change: "+2.30" },
  { symbol: "DOT/EUR", price: "5.74", change: "-0.92" },
  { symbol: "MATIC/EUR", price: "0.5123", change: "+3.10" },
  { symbol: "LINK/EUR", price: "11.42", change: "+1.75" },
];

const FEATURES = [
  { icon: "🏛", title: "Issue Bonds", desc: "Launch regulated tokenized bonds on-chain with full MiCA compliance and instant settlement." },
  { icon: "🏠", title: "Tokenize Assets", desc: "Convert real estate, infrastructure, and business equity into tradeable digital tokens." },
  { icon: "📈", title: "Equity & IPO", desc: "Participate in tokenized equity offerings and secondary market trading 24/7." },
  { icon: "⚡", title: "Exchange", desc: "Trade tokenized real-world assets with deep liquidity and 0.2% flat trading fees." },
  { icon: "🌍", title: "190+ Countries", desc: "Global access to regulated capital markets infrastructure from anywhere in the world." },
  { icon: "🔒", title: "EU Regulated", desc: "Fully licensed under MiCA, supervised by the Bank of Lithuania and EU authorities." },
];

const STATS = [
  { value: "$300T+", label: "Global Asset Market" },
  { value: "190+", label: "Countries" },
  { value: "<48h", label: "Time to Issue" },
  { value: "0.2%", label: "Trading Fee" },
];

function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, t = 0, animId;
    let particles = [], nodes = [], streams = [], hexGrid = [];

    function rand(a, b) { return a + Math.random() * (b - a); }

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      buildHexGrid();
      initAll();
    }

    function buildHexGrid() {
      hexGrid = [];
      const r = 30;
      for (let row = 0; row < Math.ceil(H / (r * 1.5)) + 2; row++)
        for (let col = 0; col < Math.ceil(W / (r * 1.75)) + 2; col++)
          hexGrid.push({ cx: col * r * 1.75 + (row % 2 ? r * 0.875 : 0), cy: row * r * 1.5, r, ph: rand(0, Math.PI * 2), sp: rand(0.004, 0.015) });
    }

    function initAll() {
      particles = [];
      for (let i = 0; i < 200; i++) particles.push({
        x: rand(0, W), y: rand(0, H), vx: rand(-0.2, 0.2), vy: rand(-0.6, -0.1),
        r: rand(0.4, 1.8), life: rand(0, 1), decay: rand(0.002, 0.005),
        col: Math.random() < 0.25 ? "245,200,66" : Math.random() < 0.5 ? "59,91,219" : "103,65,217",
      });
      nodes = [];
      for (let i = 0; i < 28; i++) nodes.push({
        x: rand(0, W), y: rand(0, H), vx: rand(-0.18, 0.18), vy: rand(-0.18, 0.18),
        r: rand(1.5, 3.5), pulse: rand(0, Math.PI * 2), ps: rand(0.015, 0.03),
      });
      const chars = "NXT01€₿TKNCAP∞Δ◆ABF".split("");
      streams = [];
      for (let i = 0; i < 10; i++) streams.push({
        x: rand(20, W - 20), y: rand(-300, H), speed: rand(1.2, 3.5),
        vals: Array.from({ length: 14 }, () => chars[Math.floor(rand(0, chars.length))]),
        alpha: rand(0.1, 0.3), gap: 16,
      });
    }

    function orb(x, y, r, R, G, B, a) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${R},${G},${B},${a})`);
      g.addColorStop(0.5, `rgba(${R},${G},${B},${a * 0.4})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }

    function hexPath(x, y, r) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        i ? ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)) : ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
      }
      ctx.closePath();
    }

    function draw() {
      ctx.fillStyle = "#03030a"; ctx.fillRect(0, 0, W, H);
      t += 0.01;
      const cx = W / 2, cy = H * 0.45;

      orb(cx + Math.sin(t * 0.3) * 90, cy + Math.cos(t * 0.25) * 50, 380, 59, 91, 219, 0.2);
      orb(cx + Math.cos(t * 0.35) * 130, cy + Math.sin(t * 0.4) * 70, 300, 103, 65, 217, 0.17);
      orb(cx + Math.sin(t * 0.5) * 60, cy - 80 + Math.cos(t * 0.45) * 40, 250, 14, 113, 194, 0.13);
      orb(cx, cy, 160, 245, 200, 66, 0.07);

      hexGrid.forEach(h => {
        h.ph += h.sp;
        const pulse = 0.5 + 0.5 * Math.sin(h.ph);
        const d = Math.sqrt((h.cx - cx) ** 2 + (h.cy - cy) ** 2) / Math.sqrt(cx * cx + cy * cy);
        const a = (0.025 + 0.05 * pulse) * (1 - d * 0.8);
        if (a < 0.005) return;
        hexPath(h.cx, h.cy, h.r - 2);
        ctx.strokeStyle = `rgba(80,120,255,${a})`; ctx.lineWidth = 0.5; ctx.stroke();
        if (pulse > 0.94 && Math.random() < 0.01) { ctx.fillStyle = "rgba(245,200,66,0.04)"; ctx.fill(); }
      });

      streams.forEach(s => {
        s.y += s.speed;
        if (s.y > H + 220) { s.y = -220; s.x = rand(20, W - 20); }
        ctx.font = "11px monospace";
        s.vals.forEach((v, i) => {
          const fy = s.y + i * s.gap;
          if (fy < -10 || fy > H + 10) return;
          const fade = Math.max(0, 1 - Math.abs(fy - H / 2) / (H * 0.55));
          ctx.fillStyle = i === 0
            ? `rgba(245,200,66,${s.alpha * fade * 1.8})`
            : `rgba(80,130,255,${s.alpha * fade * (1 - i / s.vals.length) * 0.8})`;
          ctx.fillText(v, s.x, fy);
        });
      });

      const nCount = 24;
      for (let i = 0; i < nCount; i++) {
        const a = (i / nCount) * Math.PI * 2 + t * 0.08;
        const orR = Math.min(W, H) * 0.28 + Math.sin(t * 0.6 + i) * 18;
        const nx = cx + Math.cos(a) * orR * (W / H < 1.2 ? 0.75 : 0.9);
        const ny = cy + Math.sin(a) * orR * 0.5;
        const p2 = 0.5 + 0.5 * Math.sin(t * 2.5 + i);
        if (i % 4 === 0) {
          ctx.strokeStyle = "rgba(100,150,255,0.1)"; ctx.lineWidth = 0.5; ctx.setLineDash([3, 7]);
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke(); ctx.setLineDash([]);
        }
        for (let j = i + 1; j < nCount; j++) {
          const a2 = (j / nCount) * Math.PI * 2 + t * 0.08;
          const or2 = Math.min(W, H) * 0.28 + Math.sin(t * 0.6 + j) * 18;
          const nx2 = cx + Math.cos(a2) * or2 * (W / H < 1.2 ? 0.75 : 0.9);
          const ny2 = cy + Math.sin(a2) * or2 * 0.5;
          const dd = Math.sqrt((nx2 - nx) ** 2 + (ny2 - ny) ** 2);
          if (dd < 80) { ctx.strokeStyle = `rgba(100,140,255,${(1 - dd / 80) * 0.12})`; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(nx2, ny2); ctx.stroke(); }
        }
        ctx.beginPath(); ctx.arc(nx, ny, 2 + p2 * 2, 0, Math.PI * 2);
        ctx.fillStyle = i % 5 === 0 ? `rgba(245,200,66,${0.5 + p2 * 0.4})` : `rgba(120,170,255,${0.35 + p2 * 0.3})`; ctx.fill();
      }

      [70, 110, 155, 200, 250, 305].forEach((r, i) => {
        const p2 = 0.4 + 0.6 * Math.sin(t * 0.7 + i * 0.6);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = i < 3 ? `rgba(245,200,66,${0.03 + 0.03 * p2})` : `rgba(59,91,219,${0.05 + 0.03 * p2})`;
        ctx.lineWidth = i < 3 ? 1 : 0.5; ctx.stroke();
      });

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += n.ps;
        if (n.x < 10 || n.x > W - 10) n.vx *= -1;
        if (n.y < 10 || n.y > H - 10) n.vy *= -1;
        nodes.forEach(m => {
          const dx = m.x - n.x, dy = m.y - n.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100 && d > 0) { ctx.strokeStyle = `rgba(100,130,255,${(1 - d / 100) * 0.15})`; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke(); }
        });
        const p2 = 0.6 + 0.4 * Math.sin(n.pulse);
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140,170,255,${0.4 * p2})`; ctx.fill();
      });

      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
      cg.addColorStop(0, "rgba(245,200,66,0.95)"); cg.addColorStop(1, "rgba(245,200,66,0)");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.fill();
      const pp = 0.5 + 0.5 * Math.sin(t * 2.5);
      ctx.beginPath(); ctx.arc(cx, cy, 32 + pp * 10, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245,200,66,${0.15 + 0.12 * pp})`; ctx.lineWidth = 1.5; ctx.stroke();

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) { p.x = rand(0, W); p.y = H + 5; p.life = rand(0.4, 1); }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${p.life * 0.6})`; ctx.fill();
      });

      for (let dx = 0; dx < W; dx += 26) for (let dy = 0; dy < H; dy += 26) {
        const f = 1 - Math.sqrt((dx - cx) ** 2 + (dy - cy) ** 2) / (Math.sqrt(cx * cx + cy * cy) * 1.1);
        if (f > 0.04) { ctx.beginPath(); ctx.arc(dx, dy, 0.7, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${0.04 * f})`; ctx.fill(); }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", () => { cancelAnimationFrame(animId); resize(); draw(); });
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="heroCanvas" />;
}

export default function Home() {
  const router = useRouter();
  const [prices, setPrices] = useState(TICKER_ITEMS);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(item => {
        const delta = (Math.random() - 0.5) * 0.4;
        const raw = parseFloat(item.price.replace(/,/g, "")) * (1 + delta / 100);
        const formatted = raw >= 1
          ? raw.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : raw.toFixed(4);
        const changeVal = parseFloat(item.change) + delta;
        return { ...item, price: formatted, change: (changeVal >= 0 ? "+" : "") + changeVal.toFixed(2) };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main className="main">

        {/* TICKER */}
        <div className="tickerWrap">
          <div className="tickerTrack">
            {[...prices, ...prices].map((item, i) => (
              <div className="tickerItem" key={i}>
                <span className="tSym">{item.symbol}</span>
                <span className="tPrice">{item.price}</span>
                <span className={`tChange ${item.change.startsWith("+") ? "up" : "dn"}`}>{item.change}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* HERO */}
        <section className="hero">
          <HeroCanvas />

          {/* Floating asset cards */}
          <div className="floatCard fc1">
            <div className="fcTag">TOKENIZED BOND</div>
            <div className="fcVal">€ 10,000</div>
            <div className="fcSub">EU Gov Bond · 5.2% APY</div>
            <div className="fcLive"><span className="liveDot green" />LIVE</div>
          </div>
          <div className="floatCard fc2">
            <div className="fcTag">REAL ESTATE TOKEN</div>
            <div className="fcVal">Vilnius Office</div>
            <div className="fcSub">€2.4M · 847 tokens</div>
            <div className="fcLive"><span className="liveDot green" />TRADEABLE</div>
          </div>
          <div className="floatCard fc3">
            <div className="fcTag">EQUITY TOKEN</div>
            <div className="fcVal">FinTech IPO</div>
            <div className="fcSub">+18.4% · 30d</div>
            <div className="fcLive"><span className="liveDot gold" />OPEN</div>
          </div>
          <div className="floatCard fc4">
            <div className="fcTag">NXC TOKEN</div>
            <div className="fcVal gold">€ 3.847</div>
            <div className="fcSub up">↑ +5.23% today</div>
            <div className="fcLive"><span className="liveDot green" />REGULATED</div>
          </div>

          {/* Hero content */}
          <div className="heroContent">
            <div className="heroBadge">
              <span className="badgeDot" />
              MiCA Licensed · EU Regulated · DLT Pilot Regime
            </div>
            <h1 className="heroH1">
              The Global Platform for<br />
              <span className="gold">Tokenized Capital Markets</span>
            </h1>
            <p className="heroP">
              Issue bonds, tokenize real-world assets, launch equity offerings,
              and trade on a regulated 24/7 secondary market — all on one compliant platform.
            </p>
            <div className="heroBtns">
              <button className="btnPrimary" onClick={() => router.push("/register")}>Get Started</button>
              <button className="btnSecondary" onClick={() => router.push("/exchange")}>Open Exchange</button>
            </div>
            <div className="heroStats">
              {STATS.map(s => (
                <div className="stat" key={s.label}>
                  <span className="statV">{s.value}</span>
                  <span className="statL">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stat bar */}
          <div className="heroBar">
            {[["$300T+", "Global Asset Market"], ["€50M+", "Assets Tokenized"], ["12,400+", "Investors"], ["99.9%", "Uptime SLA"], ["190+", "Countries"]].map(([v, l], i) => (
              <div className="heroBarItem" key={l}>
                {i > 0 && <div className="barDiv" />}
                <div className="barVal">{v}</div>
                <div className="barLabel">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="section">
          <div className="wrap">
            <p className="eyebrow">EVERYTHING YOU NEED</p>
            <h2 className="sectionH2">One Platform. All Capital Markets.</h2>
            <div className="grid3">
              {FEATURES.map(f => (
                <div className="fCard" key={f.title}>
                  <div className="fIcon">{f.icon}</div>
                  <h3 className="fTitle">{f.title}</h3>
                  <p className="fDesc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="section sectionAlt">
          <div className="wrap">
            <p className="eyebrow">REGULATED & COMPLIANT</p>
            <h2 className="sectionH2">Built on Trust & Regulation</h2>
            <div className="grid2">
              {[
                { icon: "🇪🇺", title: "MiCA Licensed", desc: "Compliant with the EU Markets in Crypto-Assets Regulation framework." },
                { icon: "🏦", title: "Monitored by Bank of Lithuania", desc: "Supervised by Lietuvos bankas, the central bank and financial regulator of Lithuania." },
                { icon: "⚖️", title: "DLT Pilot Regime", desc: "Approved to operate under the EU DLT Pilot Regime for tokenized securities." },
                { icon: "🛡", title: "AML / KYC Compliant", desc: "Full KYC onboarding, AML screening, and transaction monitoring on all accounts." },
              ].map(t => (
                <div className="tCard" key={t.title}>
                  <div className="tIcon">{t.icon}</div>
                  <div>
                    <h4 className="tTitle">{t.title}</h4>
                    <p className="tDesc">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="ctaSection">
          <div className="wrap ctaWrap">
            <div>
              <h2 className="ctaH2">Ready to tokenize the world?</h2>
              <p className="ctaP">Join 12,400+ investors and issuers on the platform.</p>
            </div>
            <button className="btnPrimary" onClick={() => router.push("/register")}>Create Free Account</button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="wrap">
            <div className="footerTop">
              <div className="footerBrand">
                <div className="fLogo">
                  <span className="fNxt">NXT</span>
                  <div className="fLogoText">
                    <span className="fLogoTop">NEXTOKEN</span>
                    <span className="fLogoBot">CAPITAL</span>
                  </div>
                </div>
                <p className="fTagline">The regulated infrastructure for tokenized real-world assets.</p>
                <div className="litBadge">
                  <span style={{ fontSize: "20px" }}>🇱🇹</span>
                  <div className="litText">
                    <span className="litLabel">Monitored by</span>
                    <span className="litName">Bank of Lithuania</span>
                  </div>
                </div>
              </div>
              <div className="footerCols">
                {[
                  { title: "Products", links: [["Markets", "/markets"], ["Exchange", "/exchange"], ["Bonds", "/bonds"], ["Equity & IPO", "/equity"], ["Tokenize", "/tokenize"]] },
                  { title: "Company", links: [["About Us", ""], ["Careers", ""], ["Press", ""], ["Blog", ""]] },
                  { title: "Legal", links: [["Terms of Service", ""], ["Privacy Policy", ""], ["Risk Disclosure", ""], ["AML Policy", ""]] },
                  { title: "Support", links: [["Help Center", ""], ["Contact Us", ""], ["API Docs", ""], ["Status", ""]] },
                ].map(col => (
                  <div className="footerCol" key={col.title}>
                    <h5 className="colTitle">{col.title}</h5>
                    {col.links.map(([label, href]) => (
                      <a key={label} className="colLink" onClick={() => href && router.push(href)}>{label}</a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="footerBottom">
              <p>© 2026 Nextoken Capital UAB. All rights reserved. Registered in Lithuania.</p>
              <p>Risk warning: Investing in tokenized assets involves risk. Past performance is not indicative of future results.</p>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        .main { background:#03030a; color:#fff; min-height:100vh; padding-top:68px; }
        .wrap { max-width:1280px; margin:0 auto; padding:0 28px; }

        /* TICKER */
        .tickerWrap { background:rgba(255,255,255,0.02); border-bottom:1px solid rgba(255,255,255,0.06); overflow:hidden; height:40px; display:flex; align-items:center; position:relative; z-index:2; }
        .tickerTrack { display:flex; animation:ticker 50s linear infinite; width:max-content; }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .tickerItem { display:flex; align-items:center; gap:8px; padding:0 24px; border-right:1px solid rgba(255,255,255,0.05); white-space:nowrap; }
        .tSym { font-size:12px; color:rgba(255,255,255,0.45); font-weight:500; }
        .tPrice { font-size:12px; color:#fff; font-weight:600; }
        .tChange { font-size:12px; font-weight:500; }
        .up { color:#0ecb81; }
        .dn { color:#f6465d; }

        /* HERO */
        .hero { position:relative; height:100vh; min-height:640px; overflow:hidden; }
        .heroCanvas { position:absolute; inset:0; width:100%; height:100%; display:block; }

        /* Floating cards */
        .floatCard { position:absolute; background:rgba(255,255,255,0.04); border-radius:14px; padding:14px 18px; backdrop-filter:blur(16px); z-index:2; }
        .fc1 { top:80px; left:40px; border:1px solid rgba(245,200,66,0.25); animation:floatA 6s ease-in-out infinite; }
        .fc2 { top:80px; right:40px; border:1px solid rgba(59,91,219,0.3); animation:floatB 7s ease-in-out infinite; }
        .fc3 { bottom:140px; left:40px; border:1px solid rgba(103,65,217,0.3); animation:floatC 8s ease-in-out infinite; }
        .fc4 { bottom:140px; right:40px; border:1px solid rgba(14,203,129,0.25); animation:floatA 9s ease-in-out infinite reverse; }
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatB { 0%,100%{transform:translateY(-8px)} 50%{transform:translateY(8px)} }
        @keyframes floatC { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(10px)} }
        .fcTag { font-size:9px; color:rgba(255,255,255,0.4); letter-spacing:1.5px; margin-bottom:6px; text-transform:uppercase; }
        .fcVal { font-size:15px; font-weight:700; color:#fff; }
        .fcVal.gold { color:#f5c842; }
        .fcSub { font-size:11px; color:rgba(255,255,255,0.5); margin-top:3px; }
        .fcSub.up { color:#0ecb81; }
        .fcLive { display:flex; align-items:center; gap:5px; margin-top:8px; font-size:10px; color:rgba(255,255,255,0.5); }
        .liveDot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
        .liveDot.green { background:#0ecb81; }
        .liveDot.gold { background:#f5c842; }

        /* Hero content */
        .heroContent { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:2; padding:0 28px; text-align:center; }
        .heroBadge { display:inline-flex; align-items:center; gap:8px; font-size:12px; color:rgba(255,255,255,0.55); border:1px solid rgba(255,255,255,0.12); border-radius:100px; padding:6px 16px; margin-bottom:24px; background:rgba(255,255,255,0.04); backdrop-filter:blur(8px); }
        .badgeDot { width:6px; height:6px; border-radius:50%; background:#0ecb81; flex-shrink:0; animation:pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .heroH1 { font-size:56px; font-weight:800; line-height:1.08; margin:0 0 20px; letter-spacing:-1.5px; max-width:700px; }
        .gold { color:#f5c842; }
        .heroP { font-size:17px; color:rgba(255,255,255,0.5); line-height:1.7; max-width:520px; margin:0 0 32px; }
        .heroBtns { display:flex; gap:14px; margin-bottom:0; }
        .btnPrimary { padding:14px 32px; border-radius:8px; border:none; background:#f5c842; color:#111; font-size:15px; font-weight:700; cursor:pointer; transition:background .15s,transform .12s; }
        .btnPrimary:hover { background:#ffd84d; transform:translateY(-1px); }
        .btnSecondary { padding:14px 32px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); color:#fff; font-size:15px; font-weight:600; cursor:pointer; backdrop-filter:blur(8px); transition:border-color .15s,background .15s; }
        .btnSecondary:hover { border-color:rgba(255,255,255,0.4); background:rgba(255,255,255,0.08); }

        /* Hero stats */
        .heroStats { display:none; }

        /* Bottom stat bar */
        .heroBar { position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.55); backdrop-filter:blur(16px); border-top:1px solid rgba(255,255,255,0.07); padding:16px 40px; display:flex; justify-content:space-around; align-items:center; z-index:2; }
        .heroBarItem { display:flex; align-items:center; gap:14px; }
        .barDiv { width:1px; height:28px; background:rgba(255,255,255,0.08); margin-right:14px; }
        .barVal { font-size:18px; font-weight:800; color:#f5c842; }
        .barLabel { font-size:10px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:1px; }

        /* SECTIONS */
        .section { padding:90px 0; border-top:1px solid rgba(255,255,255,0.06); }
        .sectionAlt { background:rgba(255,255,255,0.015); }
        .eyebrow { font-size:11px; letter-spacing:2px; color:#f5c842; font-weight:600; margin:0 0 12px; }
        .sectionH2 { font-size:38px; font-weight:800; color:#fff; margin:0 0 48px; letter-spacing:-0.5px; }

        .grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .fCard { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:28px; backdrop-filter:blur(12px); transition:border-color .2s,transform .2s; }
        .fCard:hover { border-color:rgba(245,200,66,0.3); transform:translateY(-4px); }
        .fIcon { font-size:28px; margin-bottom:16px; }
        .fTitle { font-size:16px; font-weight:700; color:#fff; margin:0 0 10px; }
        .fDesc { font-size:14px; color:rgba(255,255,255,0.45); line-height:1.65; margin:0; }

        .grid2 { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
        .tCard { display:flex; gap:20px; align-items:flex-start; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:24px; backdrop-filter:blur(12px); transition:border-color .2s; }
        .tCard:hover { border-color:rgba(59,91,219,0.4); }
        .tIcon { font-size:28px; flex-shrink:0; }
        .tTitle { font-size:15px; font-weight:700; color:#fff; margin:0 0 8px; }
        .tDesc { font-size:13px; color:rgba(255,255,255,0.45); line-height:1.6; margin:0; }

        /* CTA */
        .ctaSection { padding:90px 0; border-top:1px solid rgba(255,255,255,0.06); background:linear-gradient(135deg,#0d0a00 0%,#03030a 100%); }
        .ctaWrap { display:flex; justify-content:space-between; align-items:center; gap:40px; }
        .ctaH2 { font-size:34px; font-weight:800; color:#fff; margin:0 0 8px; }
        .ctaP { font-size:15px; color:rgba(255,255,255,0.45); margin:0; }

        /* FOOTER */
        .footer { background:#020202; border-top:1px solid rgba(255,255,255,0.07); padding:60px 0 32px; }
        .footerTop { display:flex; gap:80px; margin-bottom:48px; }
        .footerBrand { flex-shrink:0; width:220px; }
        .fLogo { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .fNxt { font-size:22px; font-weight:900; color:#f5c842; }
        .fLogoText { display:flex; flex-direction:column; line-height:1; gap:2px; }
        .fLogoTop { font-size:12px; font-weight:700; color:#fff; letter-spacing:2px; }
        .fLogoBot { font-size:9px; color:rgba(255,255,255,0.4); letter-spacing:2.5px; }
        .fTagline { font-size:13px; color:rgba(255,255,255,0.4); line-height:1.6; margin:0 0 20px; }
        .litBadge { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); border-radius:10px; padding:10px 14px; }
        .litText { display:flex; flex-direction:column; gap:1px; }
        .litLabel { font-size:10px; color:rgba(255,255,255,0.35); letter-spacing:0.5px; text-transform:uppercase; }
        .litName { font-size:12px; font-weight:600; color:#fff; }
        .footerCols { display:flex; gap:60px; flex:1; }
        .footerCol { display:flex; flex-direction:column; gap:12px; }
        .colTitle { font-size:13px; font-weight:700; color:#fff; margin:0 0 4px; text-transform:uppercase; letter-spacing:0.5px; }
        .colLink { font-size:13px; color:rgba(255,255,255,0.4); cursor:pointer; transition:color .15s; text-decoration:none; }
        .colLink:hover { color:rgba(255,255,255,0.8); }
        .footerBottom { border-top:1px solid rgba(255,255,255,0.06); padding-top:24px; display:flex; flex-direction:column; gap:6px; }
        .footerBottom p { font-size:12px; color:rgba(255,255,255,0.25); margin:0; }

        @media (max-width:1024px) {
          .fc2,.fc4 { display:none; }
          .grid3 { grid-template-columns:repeat(2,1fr); }
          .footerTop { flex-direction:column; gap:40px; }
          .footerBrand { width:100%; }
        }
        @media (max-width:768px) {
          .heroH1 { font-size:36px; }
          .fc1,.fc2,.fc3,.fc4 { display:none; }
          .heroBar { padding:12px 16px; flex-wrap:wrap; gap:12px; }
          .barDiv { display:none; }
          .grid3 { grid-template-columns:1fr; }
          .grid2 { grid-template-columns:1fr; }
          .ctaWrap { flex-direction:column; align-items:flex-start; }
          .footerCols { flex-wrap:wrap; gap:32px; }
        }
      `}</style>
    </>
  );
}