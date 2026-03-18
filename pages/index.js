<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Nextoken Capital — Tokenized Real-World Assets</title>
  <meta name="description" content="Invest in tokenized real-world assets. Nextoken Capital — NXC Token." />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <style>
    :root{
      --bg-0:#05060a;
      --bg-1:#0b0d14;
      --card:#0f1220cc;
      --card2:#0f122099;
      --line:#ffffff1a;
      --text:#eef1ff;
      --muted:#b6b9d6;
      --gold:#f5c15a;
      --gold2:#ffda7a;
      --gold3:#b97b23;
      --blue:#3aa0ff;
      --teal:#35d0b2;
      --shadow: 0 20px 60px rgba(0,0,0,.55);
      --radius: 18px;
      --radius2: 26px;
    }

    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color:var(--text);
      background:
        radial-gradient(1200px 800px at 20% 10%, rgba(255,187,60,.25), transparent 55%),
        radial-gradient(1000px 700px at 80% 20%, rgba(58,160,255,.18), transparent 55%),
        radial-gradient(900px 600px at 50% 90%, rgba(53,208,178,.12), transparent 60%),
        linear-gradient(180deg, var(--bg-0), var(--bg-1));
      overflow-x:hidden;
    }

    a{color:inherit; text-decoration:none}
    .container{max-width:1180px; margin:0 auto; padding:0 18px}

    .sparkle{
      position:fixed; inset:0; pointer-events:none; opacity:.25;
      background-image:
        radial-gradient(2px 2px at 10% 20%, #fff, transparent 60%),
        radial-gradient(1px 1px at 50% 40%, #fff, transparent 60%),
        radial-gradient(1px 1px at 80% 30%, #fff, transparent 60%),
        radial-gradient(1px 1px at 20% 80%, #fff, transparent 60%),
        radial-gradient(2px 2px at 70% 75%, #fff, transparent 60%),
        radial-gradient(1px 1px at 90% 85%, #fff, transparent 60%);
      filter: blur(.2px);
    }

    .topbar{
      border-bottom:1px solid var(--line);
      background:linear-gradient(180deg, rgba(20,18,30,.75), rgba(10,10,16,.55));
      backdrop-filter: blur(10px);
      position:sticky; top:0; z-index:50;
    }

    .topbar-inner{
      display:flex; align-items:center; justify-content:space-between;
      padding:12px 0;
      gap:14px;
    }

    .brand{
      display:flex; align-items:center; gap:12px; min-width:240px;
    }

    .logoMark{
      width:38px; height:38px; border-radius:12px;
      background:
        radial-gradient(18px 18px at 30% 30%, rgba(255,255,255,.25), transparent 60%),
        linear-gradient(135deg, rgba(255,218,122,.95), rgba(185,123,35,.95));
      box-shadow: 0 12px 30px rgba(255,193,90,.15);
      position:relative;
    }

    .logoMark:before{
      content:"";
      position:absolute; inset:8px;
      border-radius:10px;
      background:linear-gradient(135deg, rgba(10,12,18,.9), rgba(25,30,45,.9));
      border:1px solid rgba(255,255,255,.18);
    }

    .brandText{
      display:flex; flex-direction:column; line-height:1.05;
    }

    .brandText strong{
      font-weight:800; letter-spacing:.6px;
    }

    .brandText span{
      color:rgba(255,255,255,.75);
      font-size:12px;
      letter-spacing:2.6px;
      margin-top:2px;
    }

    .nav{
      display:flex; align-items:center; gap:18px;
      padding:0 10px;
      border-left:1px solid var(--line);
      border-right:1px solid var(--line);
    }

    .nav a{
      font-size:14px;
      color:rgba(238,241,255,.85);
      padding:8px 10px;
      border-radius:12px;
      transition:.2s ease;
      position:relative;
    }

    .nav a.active{
      color:var(--gold2);
    }

    .nav a:hover{
      background:rgba(255,255,255,.06);
    }

    .rightTools{
      display:flex; align-items:center; gap:10px;
      justify-content:flex-end;
      min-width:260px;
    }

    .pill{
      display:flex; align-items:center; gap:8px;
      padding:8px 10px;
      border-radius:999px;
      border:1px solid var(--line);
      background:rgba(255,255,255,.04);
      color:rgba(238,241,255,.85);
      font-size:13px;
    }

    .pill small{opacity:.85}

    .btn{
      border:0;
      cursor:pointer;
      font-weight:700;
      letter-spacing:.2px;
      border-radius:12px;
      padding:10px 14px;
      color:#111;
      background:linear-gradient(135deg, var(--gold2), var(--gold));
      box-shadow: 0 12px 30px rgba(255,193,90,.20);
      transition: transform .15s ease, filter .15s ease;
      white-space:nowrap;
    }

    .btn:hover{transform: translateY(-1px); filter:saturate(1.05)}
    .btn:active{transform: translateY(0px)}

    .hero{
      padding:28px 0 14px;
      position:relative;
    }

    .heroCard{
      border-radius: var(--radius2);
      overflow:hidden;
      border:1px solid rgba(255,255,255,.14);
      background:
        radial-gradient(900px 350px at 70% 40%, rgba(255,193,90,.22), transparent 60%),
        radial-gradient(900px 350px at 30% 40%, rgba(58,160,255,.18), transparent 60%),
        linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
      box-shadow: var(--shadow);
      position:relative;
    }

    .heroInner{
      display:grid;
      grid-template-columns: 1.15fr .85fr;
      gap:24px;
      padding:26px;
      align-items:center;
      min-height:320px;
    }

    .hero h1{
      margin:0;
      font-size:44px;
      line-height:1.04;
      letter-spacing:.5px;
    }

    .hero h1 .gold{
      background:linear-gradient(180deg, var(--gold2), var(--gold3));
      -webkit-background-clip:text;
      background-clip:text;
      color:transparent;
      text-shadow:0 14px 40px rgba(255,193,90,.15);
    }

    .hero p{
      margin:14px 0 18px;
      color:rgba(238,241,255,.82);
      max-width:560px;
      font-size:15.5px;
      line-height:1.55;
    }

    .heroActions{
      display:flex; gap:12px; align-items:center; flex-wrap:wrap;
    }

    .btnOutline{
      border:1px solid rgba(255,255,255,.20);
      background:rgba(255,255,255,.06);
      color:rgba(238,241,255,.92);
      padding:10px 14px;
      border-radius:12px;
      font-weight:700;
      cursor:pointer;
      transition:.2s ease;
    }

    .btnOutline:hover{background:rgba(255,255,255,.10)}

    .heroVisual{
      position:relative;
      height:260px;
      border-radius:22px;
      border:1px solid rgba(255,255,255,.12);
      background:
        radial-gradient(120px 120px at 75% 30%, rgba(255,255,255,.22), transparent 60%),
        radial-gradient(260px 260px at 40% 70%, rgba(255,193,90,.25), transparent 62%),
        radial-gradient(220px 220px at 70% 80%, rgba(58,160,255,.22), transparent 60%),
        linear-gradient(135deg, rgba(12,14,22,.95), rgba(20,24,38,.65));
      overflow:hidden;
      box-shadow: 0 22px 60px rgba(0,0,0,.45);
    }

    .coin{
      position:absolute;
      width:170px; height:170px;
      right:20px; top:18px;
      border-radius:999px;
      background:
        radial-gradient(70px 70px at 30% 30%, rgba(255,255,255,.35), transparent 55%),
        linear-gradient(135deg, var(--gold2), var(--gold3));
      box-shadow: 0 30px 80px rgba(255,193,90,.25);
      display:grid; place-items:center;
      border:1px solid rgba(255,255,255,.18);
    }

    .coin span{
      font-weight:900;
      font-size:38px;
      letter-spacing:1px;
      color:#1a1206;
      text-shadow: 0 8px 22px rgba(0,0,0,.25);
    }

    .ring{
      position:absolute; inset:-30px;
      border-radius:999px;
      border:2px solid rgba(255,218,122,.16);
      filter: blur(.1px);
    }

    .chartUp{
      position:absolute; left:20px; bottom:18px;
      width:220px; height:110px;
      border-radius:18px;
      background:rgba(255,255,255,.05);
      border:1px solid rgba(255,255,255,.12);
      padding:12px;
    }

    .chartUp .line{
      height:100%;
      background:
        linear-gradient(90deg, transparent, transparent),
        radial-gradient(140px 80px at 70% 55%, rgba(53,208,178,.25), transparent 62%),
        radial-gradient(140px 80px at 45% 35%, rgba(58,160,255,.22), transparent 62%);
      border-radius:14px;
      position:relative;
      overflow:hidden;
    }

    .chartUp .line:before{
      content:"";
      position:absolute; inset:0;
      background:
        linear-gradient(135deg, rgba(255,218,122,.0), rgba(255,218,122,.0)),
        repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 1px, transparent 1px 16px);
      opacity:.55;
    }

    .chartUp .arrow{
      position:absolute; right:16px; top:18px;
      font-size:18px; color:rgba(255,218,122,.95);
      text-shadow:0 10px 30px rgba(255,193,90,.25);
    }

    .chip{
      position:absolute; left:-35px; top:40px;
      width:120px; height:60px;
      border-radius:16px;
      background:linear-gradient(135deg, rgba(58,160,255,.30), rgba(255,193,90,.18));
      border:1px solid rgba(255,255,255,.14);
      transform: rotate(-12deg);
      opacity:.9;
    }

    .sectionTitle{
      margin:22px 0 12px;
      text-align:center;
      font-weight:800;
      letter-spacing:2px;
      color:rgba(255,218,122,.92);
      text-transform:uppercase;
      font-size:14px;
    }

    .vm{
      margin-top:16px;
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap:14px;
    }

    .vmCard{
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.12);
      border-radius: var(--radius);
      padding:18px 18px 16px;
      box-shadow: 0 18px 40px rgba(0,0,0,.35);
      position:relative;
      overflow:hidden;
    }

    .vmCard:before{
      content:"";
      position:absolute; inset:-1px;
      background: radial-gradient(280px 120px at 20% 0%, rgba(255,193,90,.18), transparent 60%);
      opacity:.9;
      pointer-events:none;
    }

    .vmHead{
      display:flex; align-items:center; gap:12px;
      margin-bottom:10px;
      position:relative;
    }

    .vmIcon{
      width:38px; height:38px; border-radius:14px;
      display:grid; place-items:center;
      background: linear-gradient(135deg, rgba(255,218,122,.9), rgba(185,123,35,.9));
      color:#1b1207;
      font-weight:900;
      box-shadow: 0 14px 30px rgba(255,193,90,.18);
    }

    .vmHead h3{
      margin:0; font-size:18px; letter-spacing:.4px;
    }

    .vmCard p{
      margin:0;
      color:rgba(238,241,255,.82);
      line-height:1.55;
      position:relative;
    }

    .features{
      margin-top:16px;
      display:grid;
      grid-template-columns: repeat(4, 1fr);
      gap:12px;
    }

    .feature{
      border-radius: var(--radius);
      border:1px solid rgba(255,255,255,.12);
      background:
        radial-gradient(240px 140px at 30% 20%, rgba(255,193,90,.16), transparent 60%),
        linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03));
      box-shadow: 0 18px 40px rgba(0,0,0,.35);
      padding:16px 14px;
      min-height:132px;
      position:relative;
      overflow:hidden;
    }

    .feature .badge{
      width:42px; height:42px; border-radius:16px;
      display:grid; place-items:center;
      background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.14);
      margin-bottom:10px;
      color:rgba(255,218,122,.95);
      font-size:18px;
    }

    .feature h4{margin:0 0 6px; font-size:14.5px; letter-spacing:.2px}
    .feature p{margin:0; color:rgba(238,241,255,.78); font-size:13px; line-height:1.45}

    .token{
      margin:18px 0 0;
      border-radius: var(--radius2);
      border:1px solid rgba(255,255,255,.14);
      background:
        radial-gradient(900px 250px at 50% 20%, rgba(255,193,90,.20), transparent 60%),
        radial-gradient(900px 280px at 20% 80%, rgba(58,160,255,.14), transparent 60%),
        linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      box-shadow: var(--shadow);
      overflow:hidden;
    }

    .tokenInner{
      padding:18px 18px 16px;
    }

    .tokenGrid{
      display:grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap:12px;
      align-items:stretch;
      margin-top:10px;
    }

    .tokenCard{
      border-radius: var(--radius);
      border:1px solid rgba(255,255,255,.12);
      background:rgba(255,255,255,.04);
      padding:14px;
      box-shadow: 0 16px 40px rgba(0,0,0,.30);
      display:flex;
      gap:12px;
      align-items:flex-start;
      min-height:110px;
    }

    .tokenCard .ic{
      width:42px; height:42px; border-radius:16px;
      display:grid; place-items:center;
      background:linear-gradient(135deg, rgba(255,218,122,.85), rgba(185,123,35,.85));
      color:#1a1207;
      font-weight:900;
      flex:0 0 auto;
    }

    .tokenCard h4{margin:0 0 4px; font-size:14.5px}
    .tokenCard p{margin:0; color:rgba(238,241,255,.78); font-size:13px; line-height:1.45}

    .tokenCTA{
      display:flex;
      justify-content:center;
      margin-top:14px;
    }

    footer{
      margin:18px 0 26px;
      padding-top:18px;
      border-top:1px solid var(--line);
      color:rgba(238,241,255,.75);
    }

    .footerRow{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      flex-wrap:wrap;
    }

    .socials{
      display:flex; gap:10px; align-items:center; flex-wrap:wrap;
    }

    .socials a{
      width:38px; height:38px;
      display:grid; place-items:center;
      border-radius:14px;
      border:1px solid rgba(255,255,255,.14);
      background:rgba(255,255,255,.05);
      transition:.2s ease;
    }

    .socials a:hover{transform: translateY(-1px); background:rgba(255,255,255,.08)}

    .contact{
      display:flex; gap:12px; align-items:center; flex-wrap:wrap;
      font-size:13px;
    }

    .contact span{
      display:flex; align-items:center; gap:8px;
      padding:8px 10px; border-radius:999px;
      border:1px solid rgba(255,255,255,.12);
      background:rgba(255,255,255,.04);
    }

    .disclaimer{
      margin-top:14px;
      font-size:12px;
      color:rgba(238,241,255,.60);
      line-height:1.55;
      text-align:center;
    }

    .menuBtn{
      display:none;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.05);
      color:rgba(238,241,255,.9);
      border-radius:12px;
      padding:9px 12px;
      cursor:pointer;
      font-weight:700;
    }

    @media (max-width: 980px){
      .heroInner{grid-template-columns: 1fr;}
      .heroVisual{height:240px}
      .features{grid-template-columns: 1fr 1fr}
      .tokenGrid{grid-template-columns: 1fr}
      .nav{display:none}
      .menuBtn{display:inline-flex}
      .brand{min-width:auto}
      .rightTools{min-width:auto}
      .hero h1{font-size:36px}
    }

    @media (max-width: 520px){
      .features{grid-template-columns: 1fr}
      .hero h1{font-size:32px}
    }

    .drawer{
      display:none;
      border-top:1px solid var(--line);
      padding:10px 0 12px;
    }

    .drawer a{
      display:block;
      padding:10px 12px;
      border-radius:14px;
      color:rgba(238,241,255,.9);
    }

    .drawer a:hover{background:rgba(255,255,255,.06)}
    .drawer.show{display:block}
  </style>
</head>

<body>
  <div class="sparkle"></div>

  <header class="topbar">
    <div class="container">
      <div class="topbar-inner">
        <a class="brand" href="#">
          <div class="logoMark" aria-hidden="true"></div>
          <div class="brandText">
            <strong>NEXTOKEN</strong>
            <span>CAPITAL</span>
          </div>
        </a>

        <nav class="nav" aria-label="Primary navigation">
          <a class="active" href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#how">How It Works</a>
          <a href="#news">News</a>
          <a href="#contact">Contact</a>
        </nav>

        <div class="rightTools">
          <button class="menuBtn" id="menuBtn"><i class="fa-solid fa-bars"></i> Menu</button>
          <div class="pill" title="Language">
            <i class="fa-solid fa-globe"></i> <small>EN</small>
          </div>
          <div class="pill" title="Phone">
            <i class="fa-solid fa-phone"></i> <small>+1 (555) 123-4567</small>
          </div>
          <button class="btn" onclick="scrollToId('get-started')">Get Started</button>
        </div>
      </div>

      <div class="drawer" id="drawer">
        <a href="#home" onclick="closeDrawer()">Home</a>
        <a href="#about" onclick="closeDrawer()">About Us</a>
        <a href="#how" onclick="closeDrawer()">How It Works</a>
        <a href="#news" onclick="closeDrawer()">News</a>
        <a href="#contact" onclick="closeDrawer()">Contact</a>
      </div>
    </div>
  </header>

  <main id="home" class="hero">
    <div class="container">
      <section class="heroCard">
        <div class="heroInner">
          <div>
            <h1>
              INVEST IN <span class="gold">TOKENIZED</span><br/>
              REAL-WORLD ASSETS
            </h1>
            <p>
              Register and explore opportunities in property, infrastructure, energy projects, businesses &amp; more.
              Nextoken Capital provides real-world asset tokenization infrastructure with the <strong>NXC</strong> token ecosystem.
            </p>

            <div class="heroActions">
              <button class="btn" onclick="scrollToId('get-started')">Register Now</button>
              <button class="btnOutline" onclick="scrollToId('how')">How it works</button>
            </div>
          </div>

          <div class="heroVisual" aria-label="Hero visual">
            <div class="chip" aria-hidden="true"></div>
            <div class="coin" aria-hidden="true">
              <div class="ring"></div>
              <span>NXC</span>
            </div>
            <div class="chartUp" aria-hidden="true">
              <div class="arrow"><i class="fa-solid fa-arrow-trend-up"></i></div>
              <div class="line"></div>
            </div>
          </div>
        </div>
      </section>

      <div class="sectionTitle">OUR VISION &amp; MISSION</div>

      <section class="vm" id="about">
        <article class="vmCard">
          <div class="vmHead">
            <div class="vmIcon"><i class="fa-solid fa-eye"></i></div>
            <h3>Our Vision</h3>
          </div>
          <p>
            To empower global access to tokenized real-world assets by making investment opportunities transparent,
            efficient, and borderless.
          </p>
        </article>

        <article class="vmCard">
          <div class="vmHead">
            <div class="vmIcon"><i class="fa-solid fa-bullseye"></i></div>
            <h3>Our Mission</h3>
          </div>
          <p>
            To build a secure and decentralized investment ecosystem for everyone using blockchain-powered tokenization
            infrastructure and compliant onboarding.
          </p>
        </article>
      </section>

      <section class="features" style="margin-top:16px">
        <article class="feature">
          <div class="badge"><i class="fa-solid fa-coins"></i></div>
          <h4>Earn Passive Income</h4>
          <p>Target returns with diversified tokenized opportunities (example: 15%–18% ROI annually).</p>
        </article>

        <article class="feature">
          <div class="badge"><i class="fa-solid fa-shield-halved"></i></div>
          <h4>Trusted EU Company</h4>
          <p>Corporate structure and EU-based operations to support trust and transparency.</p>
        </article>

        <article class="feature">
          <div class="badge"><i class="fa-solid fa-circle-check"></i></div>
          <h4>Secure &amp; Compliant</h4>
          <p>Strong security practices with compliance-first onboarding and clear disclosures.</p>
        </article>

        <article class="feature">
          <div class="badge"><i class="fa-solid fa-solar-panel"></i></div>
          <h4>Future Projects</h4>
          <p>Pipeline includes tokenized infrastructure and green energy-linked opportunities.</p>
        </article>
      </section>

      <section class="token" id="how" style="margin-top:18px">
        <div class="tokenInner">
          <div class="sectionTitle" style="margin:6px 0 4px">NXC TOKEN</div>

          <div class="tokenGrid">
            <article class="tokenCard">
              <div class="ic"><i class="fa-solid fa-link"></i></div>
              <div>
                <h4>Utility Token Access</h4>
                <p>Use NXC to access ecosystem utilities, platform features, and participation mechanisms.</p>
              </div>
            </article>

            <article class="tokenCard">
              <div class="ic"><i class="fa-solid fa-chart-pie"></i></div>
              <div>
                <h4>Supply &amp; Tokenomics</h4>
                <p>Example placeholder: fixed supply model and transparent token distribution.</p>
              </div>
            </article>

            <article class="tokenCard">
              <div class="ic"><i class="fa-solid fa-gift"></i></div>
              <div>
                <h4>Staking &amp; Rewards</h4>
                <p>Stake to earn ecosystem benefits (rewards structure can be added later).</p>
              </div>
            </article>
          </div>

          <div class="tokenCTA" id="get-started">
            <button class="btn" onclick="alert('Connect this button to your Webflow / registration page link.')">
              Learn About NXC
            </button>
          </div>
        </div>
      </section>

      <section id="news" style="margin-top:18px">
        <div class="sectionTitle">NEWS</div>
        <div style="
          border:1px solid rgba(255,255,255,.12);
          background:rgba(255,255,255,.04);
          border-radius: var(--radius2);
          padding:16px;
          box-shadow: 0 18px 40px rgba(0,0,0,.30);
        ">
          <p style="margin:0; color:rgba(238,241,255,.80); line-height:1.55">
            Add your latest updates here (launch announcements, partnerships, token updates, project pipeline).
          </p>
        </div>
      </section>

      <footer id="contact">
        <div class="footerRow">
          <div class="socials" aria-label="Social media links">
            <a href="#" title="X / Twitter" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="#" title="Facebook" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" title="Instagram" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" title="LinkedIn" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="#" title="Telegram" aria-label="Telegram"><i class="fa-brands fa-telegram"></i></a>
          </div>

          <div class="contact">
            <span><i class="fa-solid fa-envelope"></i> info@nextoken.com</span>
            <span><i class="fa-solid fa-phone"></i> +1 (555) 123-4567</span>
          </div>
        </div>

        <div class="disclaimer">
          NXC Token is a utility token for ecosystem access. Nextoken Capital does not provide financial services,
          investment advice, or custody of funds. Always do your own research and comply with local laws.
        </div>
      </footer>
    </div>
  </main>

  <script>
    function scrollToId(id){
      const el = document.getElementById(id);
      if(!el) return;
      el.scrollIntoView({behavior:'smooth', block:'start'});
      closeDrawer();
    }

    const menuBtn = document.getElementById('menuBtn');
    const drawer = document.getElementById('drawer');

    function closeDrawer(){
      drawer.classList.remove('show');
    }

    if(menuBtn){
      menuBtn.addEventListener('click', () => {
        drawer.classList.toggle('show');
      });
    }
  </script>
</body>
</html>