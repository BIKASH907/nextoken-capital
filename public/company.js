/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║          NEXTOKEN CAPITAL — Main Application Script              ║
 * ║          Full front-end JS · v2.1.0 · © 2026 Nextoken            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

'use strict';

const NXT = {};

NXT.utils = {
  formatCurrency(value, currency = 'EUR', decimals = 2) {
    return new Intl.NumberFormat('en-EU', { style: 'currency', currency, minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  },
  formatCompact(value) {
    if (value >= 1e12) return (value / 1e12).toFixed(1) + 'T';
    if (value >= 1e9)  return (value / 1e9).toFixed(1) + 'B';
    if (value >= 1e6)  return (value / 1e6).toFixed(1) + 'M';
    if (value >= 1e3)  return (value / 1e3).toFixed(1) + 'K';
    return value.toFixed(2);
  },
  clamp(val, min, max) { return Math.min(Math.max(val, min), max); },
  lerp(a, b, t) { return a + (b - a) * t; },
  rand(min, max) { return Math.random() * (max - min) + min; },
  randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  throttle(fn, limit) {
    let lastCall = 0;
    return function(...args) { const now = Date.now(); if (now - lastCall >= limit) { lastCall = now; fn.apply(this, args); } };
  },
  debounce(fn, delay) {
    let timer;
    return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); };
  },
  timeAgo(date) {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60)    return `${Math.floor(diff)}s ago`;
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  },
  async copyToClipboard(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch { const el = document.createElement('textarea'); el.value = text; el.style.position = 'fixed'; el.style.opacity = '0'; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); return true; }
  },
  uid(prefix = 'id') { return `${prefix}_${Math.random().toString(36).slice(2, 10)}`; },
  clone(obj) { return JSON.parse(JSON.stringify(obj)); },
  $(selector, root = document) { return root.querySelector(selector); },
  $$(selector, root = document) { return [...root.querySelectorAll(selector)]; },
  el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'className') node.className = v;
      else if (k === 'innerHTML') node.innerHTML = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v);
    });
    children.forEach(child => { if (typeof child === 'string') node.appendChild(document.createTextNode(child)); else if (child) node.appendChild(child); });
    return node;
  },
};

NXT.state = {
  currentPage: 'home', isLoggedIn: false, user: null, kycLevel: 0,
  portfolio: [], openOrders: [], activeMarket: 'BTC/EUR', theme: 'dark', apiKeys: [],
  _listeners: {},
  on(event, fn) { if (!this._listeners[event]) this._listeners[event] = []; this._listeners[event].push(fn); },
  off(event, fn) { if (this._listeners[event]) this._listeners[event] = this._listeners[event].filter(f => f !== fn); },
  emit(event, data) { (this._listeners[event] || []).forEach(fn => fn(data)); },
  set(key, value) { const old = this[key]; this[key] = value; this.emit('change', { key, value, old }); this.emit(`change:${key}`, { value, old }); },
};

NXT.router = {
  pages: ['home', 'about', 'careers', 'press', 'blog', 'api', 'exchange', 'dashboard'],
  init() {
    document.addEventListener('click', e => { const link = e.target.closest('[data-page]'); if (link) { e.preventDefault(); this.go(link.dataset.page); } });
    window.addEventListener('hashchange', () => { const hash = location.hash.slice(1); if (this.pages.includes(hash)) this.go(hash, false); });
    const initial = location.hash.slice(1) || 'home';
    this.go(this.pages.includes(initial) ? initial : 'home', false);
  },
  go(id, pushHistory = true) {
    const pages = NXT.utils.$$('.page');
    const target = document.getElementById(`page-${id}`);
    if (!target) return;
    pages.forEach(p => { p.classList.remove('active', 'page-enter'); p.style.display = 'none'; });
    target.style.display = 'block';
    requestAnimationFrame(() => { target.classList.add('active', 'page-enter'); setTimeout(() => target.classList.remove('page-enter'), 400); });
    NXT.utils.$$('.nav-links a').forEach(a => a.classList.remove('active'));
    const navLink = document.getElementById(`nav-${id}`);
    if (navLink) navLink.classList.add('active');
    if (pushHistory) history.pushState(null, '', `#${id}`);
    NXT.state.set('currentPage', id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    NXT.state.emit(`page:${id}`);
    NXT.scrollAnimations.refresh();
  },
};

NXT.market = {
  assets: {
    'BTC/EUR':   { price: 62054.31, open: 64400, vol: 100000, high: 64900, low: 61200 },
    'ETH/EUR':   { price: 1913.01,  open: 2020,  vol: 580000,  high: 2025,  low: 1890 },
    'BNB/EUR':   { price: 568.90,   open: 581,   vol: 290000,  high: 588,   low: 562 },
    'SOL/EUR':   { price: 98.42,    open: 97.32, vol: 420000,  high: 102,   low: 96.1 },
    'XRP/EUR':   { price: 0.4821,   open: 0.478, vol: 1800000, high: 0.495, low: 0.471 },
    'ADA/EUR':   { price: 0.3312,   open: 0.336, vol: 920000,  high: 0.341, low: 0.328 },
    'AVAX/EUR':  { price: 22.18,    open: 21.68, vol: 310000,  high: 22.9,  low: 21.5 },
    'DOT/EUR':   { price: 5.74,     open: 5.79,  vol: 175000,  high: 5.85,  low: 5.68 },
    'MATIC/EUR': { price: 0.5123,   open: 0.497, vol: 660000,  high: 0.524, low: 0.494 },
    'LINK/EUR':  { price: 11.42,    open: 11.23, vol: 240000,  high: 11.65, low: 11.10 },
  },
  priceHistory: {}, _timers: [], _subscribers: [],
  init() {
    Object.keys(this.assets).forEach(pair => { this.priceHistory[pair] = this._generateHistory(pair, 200); });
    Object.entries(this.assets).forEach(([pair]) => { const interval = NXT.utils.randInt(800, 2200); const timer = setInterval(() => this._tick(pair), interval); this._timers.push(timer); });
    const candleTimer = setInterval(() => this._closeCandle(), 30000); this._timers.push(candleTimer);
  },
  _generateHistory(pair, count) {
    const asset = this.assets[pair]; let price = asset.price * NXT.utils.rand(0.85, 1.15);
    const candles = []; const now = Date.now();
    for (let i = count; i > 0; i--) {
      const volatility = price * 0.018;
      const open  = price;
      const close = NXT.utils.clamp(price + NXT.utils.rand(-volatility, volatility), price * 0.85, price * 1.15);
      const high  = Math.max(open, close) + Math.abs(NXT.utils.rand(0, volatility * 0.6));
      const low   = Math.min(open, close) - Math.abs(NXT.utils.rand(0, volatility * 0.6));
      const vol   = NXT.utils.rand(asset.vol * 0.4, asset.vol * 1.6);
      candles.push({ time: now - i * 60000, open, high, low, close, vol }); price = close;
    }
    return candles;
  },
  _tick(pair) {
    const asset = this.assets[pair]; const volatility = asset.price * 0.0008;
    const delta = NXT.utils.rand(-volatility, volatility); const newPrice = Math.max(asset.price + delta, 0.0001);
    asset.prev = asset.price; asset.price = parseFloat(newPrice.toFixed(pair.includes('XRP') || pair.includes('ADA') || pair.includes('MATIC') ? 4 : 2));
    asset.change = ((asset.price - asset.open) / asset.open) * 100;
    const history = this.priceHistory[pair];
    if (history.length > 0) { const last = history[history.length - 1]; last.close = asset.price; if (asset.price > last.high) last.high = asset.price; if (asset.price < last.low) last.low = asset.price; }
    this._subscribers.forEach(fn => fn(pair, asset)); NXT.state.emit('price:update', { pair, asset });
  },
  _closeCandle() {
    Object.entries(this.assets).forEach(([pair, asset]) => {
      const history = this.priceHistory[pair]; const last = history[history.length - 1];
      history.push({ time: Date.now(), open: last ? last.close : asset.price, high: asset.price, low: asset.price, close: asset.price, vol: NXT.utils.rand(asset.vol * 0.4, asset.vol * 1.6) });
      if (history.length > 500) history.shift();
    });
  },
  subscribe(fn) { this._subscribers.push(fn); return () => { this._subscribers = this._subscribers.filter(f => f !== fn); }; },
  getAsset(pair) { return this.assets[pair] || null; },
  stop() { this._timers.forEach(clearInterval); this._timers = []; },
};

NXT.ticker = {
  el: null, track: null,
  init() {
    this.el = NXT.utils.$('.ticker-wrapper') || NXT.utils.$('#ticker-bar');
    this.track = NXT.utils.$('.ticker-track') || NXT.utils.$('.ticker');
    if (!this.track) return;
    this.render();
    NXT.market.subscribe((pair, asset) => this._updateCell(pair, asset));
  },
  render() { const pairs = Object.keys(NXT.market.assets); const items = pairs.map(pair => this._buildItem(pair)).join(''); this.track.innerHTML = items + items; },
  _buildItem(pair) {
    const asset = NXT.market.assets[pair]; const change = ((asset.price - asset.open) / asset.open) * 100;
    const sign = change >= 0 ? '+' : ''; const cls = change >= 0 ? 'up' : 'down';
    return `<span class="ticker-item" data-pair="${pair}"><span class="ticker-pair">${pair}</span><span class="ticker-price" data-price="${pair}">${asset.price.toLocaleString('en-EU', { minimumFractionDigits: 2 })}</span><span class="ticker-change ${cls}" data-change="${pair}">${sign}${change.toFixed(2)}%</span></span>`;
  },
  _updateCell(pair, asset) {
    const change = ((asset.price - asset.open) / asset.open) * 100; const sign = change >= 0 ? '+' : ''; const cls = change >= 0 ? 'up' : 'down';
    NXT.utils.$$(`[data-price="${pair}"]`).forEach(el => { el.textContent = asset.price.toLocaleString('en-EU', { minimumFractionDigits: 2 }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 400); });
    NXT.utils.$$(`[data-change="${pair}"]`).forEach(el => { el.textContent = `${sign}${change.toFixed(2)}%`; el.className = `ticker-change ${cls}`; });
  },
};

NXT.chart = {
  canvas: null, ctx: null, pair: 'BTC/EUR', type: 'candle', interval: '1m', _raf: null, _dirty: true, _tooltip: null, _hoverIdx: -1,
  init(canvasId = 'price-chart') {
    this.canvas = document.getElementById(canvasId); if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d'); this._resize();
    window.addEventListener('resize', NXT.utils.throttle(() => this._resize(), 200));
    this.canvas.addEventListener('mousemove', e => this._onMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => { this._hoverIdx = -1; this._dirty = true; });
    NXT.market.subscribe((pair) => { if (pair === this.pair) { this._dirty = true; } });
    this._loop();
  },
  setPair(pair) { this.pair = pair; this._dirty = true; },
  setType(type) { this.type = type; this._dirty = true; },
  _resize() {
    const dpr = window.devicePixelRatio || 1; const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * dpr; this.canvas.height = (rect.height || 320) * dpr;
    this.canvas.style.width = `${rect.width}px`; this.canvas.style.height = `${rect.height || 320}px`;
    this.ctx.scale(dpr, dpr); this._dirty = true;
  },
  _loop() { this._raf = requestAnimationFrame(() => this._loop()); if (!this._dirty) return; this._dirty = false; this._draw(); },
  _draw() {
    const ctx = this.ctx; const W = this.canvas.clientWidth; const H = this.canvas.clientHeight;
    const data = NXT.market.priceHistory[this.pair] || []; const VIEW = Math.min(data.length, 80);
    const candles = data.slice(-VIEW); if (!candles.length) return;
    const UP = '#38bd82'; const DOWN = '#e05050'; const GRID = 'rgba(255,255,255,0.05)'; const TEXT = 'rgba(122,133,153,0.9)';
    ctx.clearRect(0, 0, W, H);
    const PAD = { top: 16, right: 60, bottom: 36, left: 12 };
    const chartW = W - PAD.left - PAD.right; const chartH = H - PAD.top - PAD.bottom;
    const prices = candles.flatMap(c => [c.high, c.low]); const minPrice = Math.min(...prices); const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1; const pad = priceRange * 0.08;
    const yMin = minPrice - pad; const yMax = maxPrice + pad;
    const toY = p => PAD.top + chartH - ((p - yMin) / (yMax - yMin)) * chartH;
    const toX = i => PAD.left + (i + 0.5) * (chartW / candles.length);
    ctx.strokeStyle = GRID; ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = PAD.top + (chartH / 5) * i; ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
      const price = yMax - ((yMax - yMin) / 5) * i;
      ctx.fillStyle = TEXT; ctx.font = '10px DM Mono, monospace'; ctx.textAlign = 'left';
      ctx.fillText(price.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), W - PAD.right + 6, y + 4);
    }
    if (this.type === 'candle') { this._drawCandles(ctx, candles, toX, toY, chartW, UP, DOWN); }
    else { this._drawLine(ctx, candles, toX, toY, chartW, chartH, PAD, UP, DOWN); }
    this._drawVolume(ctx, candles, toX, W, H, PAD, chartW, UP, DOWN);
    if (this._hoverIdx >= 0 && this._hoverIdx < candles.length) { this._drawTooltip(ctx, candles[this._hoverIdx], toX(this._hoverIdx), PAD.top, H, PAD.bottom); }
    const lastPrice = candles[candles.length - 1]?.close;
    if (lastPrice) {
      const y = toY(lastPrice); ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(56,189,130,0.4)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke(); ctx.restore();
      ctx.fillStyle = UP; ctx.beginPath(); ctx.roundRect(W - PAD.right + 2, y - 9, 55, 18, 4); ctx.fill();
      ctx.fillStyle = '#060810'; ctx.font = 'bold 10px DM Mono, monospace'; ctx.textAlign = 'center';
      ctx.fillText(lastPrice.toLocaleString('en-EU', { minimumFractionDigits: 2 }), W - PAD.right + 29, y + 4);
    }
    const step = Math.max(1, Math.floor(candles.length / 6));
    ctx.fillStyle = TEXT; ctx.font = '10px DM Mono, monospace'; ctx.textAlign = 'center';
    candles.forEach((c, i) => { if (i % step === 0) { const d = new Date(c.time); const label = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`; ctx.fillText(label, toX(i), H - PAD.bottom + 14); } });
  },
  _drawCandles(ctx, candles, toX, toY, chartW, UP, DOWN) {
    const w = Math.max(2, (chartW / candles.length) * 0.65);
    candles.forEach((c, i) => {
      const x = toX(i); const color = c.close >= c.open ? UP : DOWN;
      ctx.strokeStyle = color; ctx.fillStyle = c.close >= c.open ? UP : 'rgba(224,80,80,0.85)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, toY(c.high)); ctx.lineTo(x, toY(c.low)); ctx.stroke();
      const top = toY(Math.max(c.open, c.close)); const ht = Math.max(1, Math.abs(toY(c.open) - toY(c.close)));
      ctx.fillRect(x - w / 2, top, w, ht);
      if (i === this._hoverIdx) { ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(x - w, 0, w * 2, toY(0) + 100); }
    });
  },
  _drawLine(ctx, candles, toX, toY, chartW, chartH, PAD, UP, DOWN) {
    const first = candles[0]; const last = candles[candles.length - 1]; const isUp = last.close >= first.close; const color = isUp ? UP : DOWN;
    const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + chartH);
    grad.addColorStop(0, isUp ? 'rgba(56,189,130,0.18)' : 'rgba(224,80,80,0.18)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.moveTo(toX(0), PAD.top + chartH);
    candles.forEach((c, i) => ctx.lineTo(toX(i), toY(c.close)));
    ctx.lineTo(toX(candles.length - 1), PAD.top + chartH); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); candles.forEach((c, i) => { if (i === 0) ctx.moveTo(toX(i), toY(c.close)); else ctx.lineTo(toX(i), toY(c.close)); });
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.lineJoin = 'round'; ctx.stroke();
  },
  _drawVolume(ctx, candles, toX, W, H, PAD, chartW, UP, DOWN) {
    const maxVol = Math.max(...candles.map(c => c.vol)); const volH = (H - PAD.bottom - PAD.top) * 0.14;
    const barW = Math.max(1, (chartW / candles.length) * 0.6);
    candles.forEach((c, i) => {
      const x = toX(i); const barHeight = (c.vol / maxVol) * volH;
      ctx.fillStyle = c.close >= c.open ? 'rgba(56,189,130,0.2)' : 'rgba(224,80,80,0.2)';
      ctx.fillRect(x - barW / 2, H - PAD.bottom - barHeight, barW, barHeight);
    });
  },
  _drawTooltip(ctx, candle, x, topPad, H, bottomPad) {
    const d = new Date(candle.time);
    const lines = [`${d.toLocaleTimeString()}`, `O: ${candle.open.toFixed(2)}`, `H: ${candle.high.toFixed(2)}`, `L: ${candle.low.toFixed(2)}`, `C: ${candle.close.toFixed(2)}`, `V: ${NXT.utils.formatCompact(candle.vol)}`];
    const TW = 120; const TH = lines.length * 16 + 16; let tx = x + 12;
    if (tx + TW > ctx.canvas.clientWidth - 60) tx = x - TW - 12;
    ctx.fillStyle = 'rgba(13,17,32,0.92)'; ctx.strokeStyle = 'rgba(56,189,130,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(tx, topPad + 10, TW, TH, 6); ctx.fill(); ctx.stroke();
    ctx.font = '10px DM Mono, monospace';
    lines.forEach((line, i) => { ctx.fillStyle = i === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(122,133,153,0.9)'; ctx.textAlign = 'left'; ctx.fillText(line, tx + 8, topPad + 24 + i * 16); });
    ctx.setLineDash([3, 3]); ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, topPad); ctx.lineTo(x, H - bottomPad); ctx.stroke(); ctx.setLineDash([]);
  },
  _onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect(); const mouseX = e.clientX - rect.left;
    const data = NXT.market.priceHistory[this.pair] || []; const VIEW = Math.min(data.length, 80);
    const candles = data.slice(-VIEW); const W = this.canvas.clientWidth; const PAD_L = 12; const PAD_R = 60;
    const chartW = W - PAD_L - PAD_R; const idx = Math.floor((mouseX - PAD_L) / (chartW / candles.length));
    this._hoverIdx = NXT.utils.clamp(idx, 0, candles.length - 1); this._dirty = true;
  },
  destroy() { cancelAnimationFrame(this._raf); },
};

NXT.orderBook = {
  el: null, pair: 'BTC/EUR', _interval: null, _bids: [], _asks: [], DEPTH: 12,
  init(containerId = 'order-book') {
    this.el = document.getElementById(containerId); if (!this.el) return;
    this._generate(); this.render();
    this._interval = setInterval(() => { this._mutate(); this.render(); }, 1500);
    NXT.market.subscribe((pair) => { if (pair === this.pair) { this._generate(); this.render(); } });
  },
  setPair(pair) { this.pair = pair; this._generate(); this.render(); },
  _generate() {
    const asset = NXT.market.assets[this.pair]; const mid = asset?.price || 62000; const spread = mid * 0.0003;
    this._bids = []; this._asks = []; let bidP = mid - spread / 2; let askP = mid + spread / 2;
    for (let i = 0; i < this.DEPTH; i++) { const vol = NXT.utils.rand(0.05, 3.5); bidP -= NXT.utils.rand(0.1, mid * 0.0005); this._bids.push({ price: bidP, vol, total: 0 }); }
    for (let i = 0; i < this.DEPTH; i++) { const vol = NXT.utils.rand(0.05, 3.5); askP += NXT.utils.rand(0.1, mid * 0.0005); this._asks.push({ price: askP, vol, total: 0 }); }
    let cumBid = 0; let cumAsk = 0;
    this._bids.forEach(b => { cumBid += b.vol; b.total = cumBid; }); this._asks.forEach(a => { cumAsk += a.vol; a.total = cumAsk; });
    this._maxTotal = Math.max(cumBid, cumAsk);
  },
  _mutate() {
    const mutIdx = NXT.utils.randInt(0, this.DEPTH - 1); const mutSide = Math.random() > 0.5 ? this._bids : this._asks;
    if (mutSide[mutIdx]) { mutSide[mutIdx].vol = NXT.utils.rand(0.02, 4); }
    let cb = 0; let ca = 0;
    this._bids.forEach(b => { cb += b.vol; b.total = cb; }); this._asks.forEach(a => { ca += a.vol; a.total = ca; });
    this._maxTotal = Math.max(cb, ca);
  },
  render() {
    if (!this.el) return;
    const asset = NXT.market.assets[this.pair]; const mid = asset?.price || 62000;
    const change = ((asset?.price - asset?.open) / asset?.open * 100) || 0; const cls = change >= 0 ? 'up' : 'down';
    const rows = (entries, side) => entries.map(e => {
      const pct = (e.total / this._maxTotal) * 100; const cls2 = side === 'bid' ? 'ob-bid' : 'ob-ask';
      return `<div class="ob-row ${cls2}" style="position:relative;"><div class="ob-depth-bar ${cls2}-bar" style="width:${pct.toFixed(1)}%"></div><span class="ob-price">${e.price.toFixed(2)}</span><span class="ob-vol">${e.vol.toFixed(4)}</span><span class="ob-total">${e.total.toFixed(4)}</span></div>`;
    }).join('');
    this.el.innerHTML = `<div class="ob-header"><span>Price (EUR)</span><span>Amount</span><span>Total</span></div><div class="ob-asks">${rows([...this._asks].reverse(), 'ask')}</div><div class="ob-mid ${cls}">${mid.toLocaleString('en-EU', { minimumFractionDigits: 2 })} <small>${change >= 0 ? '+' : ''}${change.toFixed(2)}%</small></div><div class="ob-bids">${rows(this._bids, 'bid')}</div>`;
  },
  destroy() { clearInterval(this._interval); },
};

NXT.tradeFeed = {
  el: null, pair: 'BTC/EUR', trades: [], _MAX: 30, _interval: null,
  init(containerId = 'trade-feed') {
    this.el = document.getElementById(containerId); if (!this.el) return;
    for (let i = 0; i < 15; i++) this._generateTrade(true);
    this.render();
    const schedule = () => { this._interval = setTimeout(() => { this._generateTrade(false); this.render(); schedule(); }, NXT.utils.randInt(600, 2800)); };
    schedule();
  },
  _generateTrade(silent = false) {
    const asset = NXT.market.assets[this.pair]; const price = asset.price * NXT.utils.rand(0.9995, 1.0005);
    const amount = NXT.utils.rand(0.001, 2.5); const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const trade = { id: NXT.utils.uid('t'), price: parseFloat(price.toFixed(2)), amount: parseFloat(amount.toFixed(4)), side, time: new Date().toISOString(), isNew: !silent };
    this.trades.unshift(trade); if (this.trades.length > this._MAX) this.trades.pop();
  },
  render() {
    if (!this.el) return;
    this.el.innerHTML = `<div class="tf-header"><span>Price (EUR)</span><span>Amount</span><span>Time</span></div>${this.trades.map((t, i) => `<div class="tf-row ${t.side} ${i === 0 && t.isNew ? 'tf-new' : ''}"><span class="tf-price ${t.side}">${t.price.toLocaleString('en-EU', { minimumFractionDigits: 2 })}</span><span class="tf-amount">${t.amount.toFixed(4)}</span><span class="tf-time">${new Date(t.time).toLocaleTimeString('en-EU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></div>`).join('')}`;
  },
  destroy() { clearTimeout(this._interval); },
};

NXT.exchange = {
  side: 'buy', type: 'limit', _form: null,
  init() {
    this._form = document.getElementById('order-form'); if (!this._form) return;
    NXT.utils.$$('[data-side]').forEach(btn => { btn.addEventListener('click', () => { this.side = btn.dataset.side; NXT.utils.$$('[data-side]').forEach(b => b.classList.remove('active')); btn.classList.add('active'); this._updateFormColor(); }); });
    NXT.utils.$$('[data-order-type]').forEach(btn => { btn.addEventListener('click', () => { this.type = btn.dataset.orderType; NXT.utils.$$('[data-order-type]').forEach(b => b.classList.remove('active')); btn.classList.add('active'); this._togglePriceField(); }); });
    NXT.utils.$$('[data-pct]').forEach(btn => { btn.addEventListener('click', () => { const pct = parseFloat(btn.dataset.pct) / 100; const balance = this.side === 'buy' ? 5000 : 0.15; const amtEl = document.getElementById('order-amount'); if (amtEl) amtEl.value = (balance * pct).toFixed(this.side === 'buy' ? 2 : 6); this._updateTotal(); }); });
    ['order-amount', 'order-price'].forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('input', () => this._updateTotal()); });
    this._form.addEventListener('submit', e => { e.preventDefault(); this._placeOrder(); });
    NXT.market.subscribe((pair) => { if (pair === NXT.state.activeMarket) this._fillCurrentPrice(); });
    this._fillCurrentPrice();
  },
  _updateFormColor() {
    const submitBtn = document.getElementById('order-submit'); if (!submitBtn) return;
    submitBtn.style.background = this.side === 'buy' ? 'var(--accent)' : 'var(--red)';
    submitBtn.textContent = this.side === 'buy' ? `Buy ${NXT.state.activeMarket.split('/')[0]}` : `Sell ${NXT.state.activeMarket.split('/')[0]}`;
  },
  _togglePriceField() { const priceRow = document.getElementById('price-row'); if (priceRow) { priceRow.style.display = this.type === 'market' ? 'none' : ''; } },
  _fillCurrentPrice() { const priceEl = document.getElementById('order-price'); if (!priceEl || this.type === 'market') return; const asset = NXT.market.assets[NXT.state.activeMarket]; if (asset) priceEl.value = asset.price.toFixed(2); this._updateTotal(); },
  _updateTotal() {
    const priceEl = document.getElementById('order-price'); const amtEl = document.getElementById('order-amount'); const totalEl = document.getElementById('order-total');
    if (!amtEl || !totalEl) return;
    const price = parseFloat(priceEl?.value) || NXT.market.assets[NXT.state.activeMarket]?.price || 0;
    const amount = parseFloat(amtEl.value) || 0; totalEl.textContent = NXT.utils.formatCurrency(price * amount);
  },
  _placeOrder() {
    if (!NXT.state.isLoggedIn) { NXT.modal.open('login'); NXT.toast.show('Please log in to place orders', 'warn'); return; }
    if (NXT.state.kycLevel < 2) { NXT.toast.show('KYC Level 2 required for trading', 'warn'); return; }
    const amtEl = document.getElementById('order-amount'); const priceEl = document.getElementById('order-price'); const amount = parseFloat(amtEl?.value);
    if (!amount || amount <= 0) { NXT.toast.show('Please enter a valid amount', 'error'); return; }
    const price = this.type === 'market' ? NXT.market.assets[NXT.state.activeMarket]?.price : parseFloat(priceEl?.value);
    const order = { id: NXT.utils.uid('ord'), pair: NXT.state.activeMarket, side: this.side, type: this.type, amount, price, status: 'open', time: new Date().toISOString() };
    NXT.state.openOrders.push(order);
    NXT.toast.show(`${this.side === 'buy' ? '🟢' : '🔴'} ${this.side.toUpperCase()} order placed — ${amount} ${NXT.state.activeMarket.split('/')[0]} @ ${NXT.utils.formatCurrency(price)}`, 'success');
    setTimeout(() => { order.status = 'filled'; NXT.state.openOrders = NXT.state.openOrders.filter(o => o.id !== order.id); NXT.toast.show(`✅ Order ${order.id} filled`, 'success'); NXT.portfolio.refresh(); }, NXT.utils.randInt(1500, 5000));
    if (amtEl) amtEl.value = ''; this._updateTotal();
  },
};

NXT.toast = {
  container: null, _queue: [], _active: 0, MAX_ACTIVE: 4,
  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) { this.container = NXT.utils.el('div', { id: 'toast-container', className: 'toast-container' }); document.body.appendChild(this.container); }
  },
  show(message, type = 'info', duration = 4000) {
    if (this._active >= this.MAX_ACTIVE) { this._queue.push({ message, type, duration }); return; }
    this._active++;
    const icons = { success: '✓', error: '✕', warn: '⚠', info: 'ℹ' };
    const toast = NXT.utils.el('div', { className: `toast toast-${type}` });
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span class="toast-msg">${message}</span><button class="toast-close" aria-label="Dismiss">×</button>`;
    toast.querySelector('.toast-close').addEventListener('click', () => this._dismiss(toast));
    this.container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-show'));
    const timer = setTimeout(() => this._dismiss(toast), duration); toast._timer = timer;
    return toast;
  },
  _dismiss(toast) {
    clearTimeout(toast._timer); toast.classList.remove('toast-show'); toast.classList.add('toast-hide');
    setTimeout(() => { toast.remove(); this._active--; if (this._queue.length > 0) { const next = this._queue.shift(); this.show(next.message, next.type, next.duration); } }, 300);
  },
};

NXT.modal = {
  _stack: [], _overlay: null,
  init() {
    this._overlay = document.getElementById('modal-overlay');
    if (!this._overlay) { this._overlay = NXT.utils.el('div', { id: 'modal-overlay', className: 'modal-overlay' }); document.body.appendChild(this._overlay); }
    this._overlay.addEventListener('click', e => { if (e.target === this._overlay) this.close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && this._stack.length) this.close(); });
  },
  open(id) {
    const modal = document.getElementById(`modal-${id}`); if (!modal) return;
    this._overlay.style.display = 'flex'; requestAnimationFrame(() => this._overlay.classList.add('modal-overlay-show'));
    modal.style.display = 'flex'; requestAnimationFrame(() => modal.classList.add('modal-show'));
    this._stack.push(modal); document.body.style.overflow = 'hidden';
  },
  close() {
    const modal = this._stack.pop(); if (!modal) return;
    modal.classList.remove('modal-show'); modal.classList.add('modal-hide');
    setTimeout(() => { modal.style.display = 'none'; modal.classList.remove('modal-hide'); }, 300);
    if (this._stack.length === 0) { this._overlay.classList.remove('modal-overlay-show'); setTimeout(() => { this._overlay.style.display = 'none'; }, 300); document.body.style.overflow = ''; }
  },
  build(id, title, bodyHTML, footerHTML = '') {
    if (document.getElementById(`modal-${id}`)) return;
    const modal = NXT.utils.el('div', { id: `modal-${id}`, className: 'modal' });
    modal.innerHTML = `<div class="modal-dialog"><div class="modal-head"><h3 class="modal-title">${title}</h3><button class="modal-x" aria-label="Close">×</button></div><div class="modal-body">${bodyHTML}</div>${footerHTML ? `<div class="modal-foot">${footerHTML}</div>` : ''}</div>`;
    modal.querySelector('.modal-x').addEventListener('click', () => this.close());
    document.body.appendChild(modal);
  },
};

NXT.auth = {
  init() {
    NXT.modal.build('login', '🔐 Log in to Nextoken', `
      <form id="form-login" class="auth-form" novalidate>
        <div class="form-group"><label for="login-email">Email address</label><input id="login-email" type="email" placeholder="you@example.com" autocomplete="email" required /><span class="field-err" id="err-login-email"></span></div>
        <div class="form-group"><label for="login-pass">Password</label><div class="input-eye"><input id="login-pass" type="password" placeholder="••••••••" autocomplete="current-password" required /><button type="button" class="eye-btn" data-target="login-pass">👁</button></div><span class="field-err" id="err-login-pass"></span></div>
        <div class="form-row-inline"><label class="checkbox-label"><input type="checkbox" id="login-remember" /> Remember me</label><a href="#" class="link-sm">Forgot password?</a></div>
        <button type="submit" class="btn-primary full-w" id="btn-login">Log In →</button>
        <p class="auth-switch">No account? <a href="#" onclick="NXT.auth.switchTo('register')">Create one free</a></p>
      </form>`, '');
    NXT.modal.build('register', '🚀 Create your account', `
      <form id="form-register" class="auth-form" novalidate>
        <div class="grid-2-sm"><div class="form-group"><label for="reg-first">First name</label><input id="reg-first" type="text" placeholder="Jonas" required /></div><div class="form-group"><label for="reg-last">Last name</label><input id="reg-last" type="text" placeholder="Petrauskas" required /></div></div>
        <div class="form-group"><label for="reg-email">Email address</label><input id="reg-email" type="email" placeholder="you@example.com" autocomplete="email" required /><span class="field-err" id="err-reg-email"></span></div>
        <div class="form-group"><label for="reg-country">Country of residence</label><select id="reg-country" required><option value="">Select country…</option><option>Lithuania</option><option>Estonia</option><option>Latvia</option><option>Germany</option><option>France</option><option>Netherlands</option><option>United Kingdom</option><option>United States</option><option>Singapore</option><option>Other</option></select></div>
        <div class="form-group"><label for="reg-pass">Password</label><div class="input-eye"><input id="reg-pass" type="password" placeholder="Min. 12 characters" autocomplete="new-password" required /><button type="button" class="eye-btn" data-target="reg-pass">👁</button></div><div class="pass-strength" id="pass-strength"></div></div>
        <label class="checkbox-label" style="margin-bottom:16px"><input type="checkbox" id="reg-terms" required />I agree to the <a href="#" class="link-sm">Terms of Service</a> and <a href="#" class="link-sm">Privacy Policy</a></label>
        <button type="submit" class="btn-primary full-w" id="btn-register">Create Account →</button>
        <p class="auth-switch">Already have an account? <a href="#" onclick="NXT.auth.switchTo('login')">Log in</a></p>
      </form>`, '');
    this._bindLoginForm(); this._bindRegisterForm(); this._bindPasswordToggles(); this._bindPasswordStrength();
  },
  switchTo(modal) { NXT.modal.close(); setTimeout(() => NXT.modal.open(modal), 320); },
  _bindLoginForm() {
    const form = document.getElementById('form-login'); if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value.trim(); const pass = document.getElementById('login-pass')?.value; const btn = document.getElementById('btn-login');
      if (!email || !email.includes('@')) { document.getElementById('err-login-email').textContent = 'Enter a valid email address'; return; }
      if (!pass || pass.length < 6) { document.getElementById('err-login-pass').textContent = 'Password must be at least 6 characters'; return; }
      btn.textContent = 'Signing in…'; btn.disabled = true;
      await new Promise(r => setTimeout(r, 1200));
      NXT.state.set('isLoggedIn', true); NXT.state.set('user', { email, name: email.split('@')[0] }); NXT.state.set('kycLevel', 2);
      NXT.modal.close(); NXT.toast.show(`Welcome back, ${NXT.state.user.name}! 👋`, 'success'); NXT.auth._updateNavForLoggedIn();
      btn.textContent = 'Log In →'; btn.disabled = false;
    });
  },
  _bindRegisterForm() {
    const form = document.getElementById('form-register'); if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault(); const btn = document.getElementById('btn-register'); btn.textContent = 'Creating account…'; btn.disabled = true;
      await new Promise(r => setTimeout(r, 1800));
      NXT.state.set('isLoggedIn', true); const first = document.getElementById('reg-first')?.value || 'User'; NXT.state.set('user', { name: first }); NXT.state.set('kycLevel', 1);
      NXT.modal.close(); NXT.toast.show(`Account created! Welcome, ${first} 🎉`, 'success'); NXT.toast.show('Complete KYC to unlock trading', 'info', 6000); NXT.auth._updateNavForLoggedIn();
      btn.textContent = 'Create Account →'; btn.disabled = false;
    });
  },
  _bindPasswordToggles() {
    document.addEventListener('click', e => { const btn = e.target.closest('.eye-btn'); if (!btn) return; const input = document.getElementById(btn.dataset.target); if (!input) return; input.type = input.type === 'password' ? 'text' : 'password'; btn.textContent = input.type === 'password' ? '👁' : '🙈'; });
  },
  _bindPasswordStrength() {
    const input = document.getElementById('reg-pass'); const meter = document.getElementById('pass-strength'); if (!input || !meter) return;
    input.addEventListener('input', () => {
      const val = input.value; let score = 0;
      if (val.length >= 12) score++; if (/[A-Z]/.test(val)) score++; if (/[0-9]/.test(val)) score++; if (/[^A-Za-z0-9]/.test(val)) score++;
      const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']; const colors = ['', '#e05050', '#f0a040', '#f0c040', '#38bd82'];
      meter.innerHTML = val.length ? `<div class="ps-bar"><div style="width:${score * 25}%;background:${colors[score]};height:3px;border-radius:2px;transition:all .3s"></div></div><span style="font-size:0.72rem;color:${colors[score]}">${labels[score]}</span>` : '';
    });
  },
  _updateNavForLoggedIn() {
    const loginBtn = document.querySelector('.nav-login');
    if (loginBtn) { loginBtn.textContent = NXT.state.user?.name || 'Account'; loginBtn.removeEventListener('click', loginBtn._handler); loginBtn._handler = () => NXT.router.go('dashboard'); loginBtn.addEventListener('click', loginBtn._handler); }
  },
  logout() { NXT.state.set('isLoggedIn', false); NXT.state.set('user', null); NXT.state.set('kycLevel', 0); NXT.toast.show('You have been logged out', 'info'); },
};

NXT.kyc = {
  LEVELS: [
    { label: 'Not started', desc: 'No verification. Read-only access.', color: '#4a5568' },
    { label: 'Level 1 — Email verified', desc: 'View markets and watchlist. No trading.', color: '#f0a040' },
    { label: 'Level 2 — ID verified', desc: 'Trade up to €50,000/day.', color: '#38bd82' },
    { label: 'Level 3 — Enhanced', desc: 'Unlimited trading and asset issuance.', color: '#6b9de8' },
  ],
  render(containerId = 'kyc-widget') {
    const el = document.getElementById(containerId); if (!el) return;
    const level = NXT.state.kycLevel; const info = this.LEVELS[level] || this.LEVELS[0];
    el.innerHTML = `<div class="kyc-status"><div class="kyc-indicator" style="background:${info.color}"></div><div><div class="kyc-label" style="color:${info.color}">${info.label}</div><div class="kyc-desc">${info.desc}</div></div>${level < 3 ? `<button class="btn-sm" onclick="NXT.kyc.startVerification()">Upgrade →</button>` : '<span class="badge-verified">✓ Fully Verified</span>'}</div><div class="kyc-steps">${this.LEVELS.slice(1).map((l, i) => `<div class="kyc-step ${i < level ? 'done' : i === level - 1 ? 'current' : ''}"><div class="kyc-step-dot">${i < level ? '✓' : i + 1}</div><span>${l.label.split(' — ')[1] || l.label}</span></div>`).join('')}</div>`;
  },
  startVerification() {
    NXT.toast.show('KYC verification portal is being opened…', 'info');
    setTimeout(() => NXT.toast.show('For demo: KYC auto-upgraded to Level 2', 'success'), 1500);
    setTimeout(() => { NXT.state.set('kycLevel', Math.min(NXT.state.kycLevel + 1, 3)); this.render(); }, 2500);
  },
};

NXT.apiKeys = {
  _keys: [],
  init() { const container = document.getElementById('api-key-manager'); if (!container) return; this.render(container); },
  render(container) {
    container.innerHTML = `<div class="akey-header"><h3>API Keys</h3><button class="btn-primary btn-sm" id="btn-gen-key">+ Generate Key</button></div><div id="akey-list">${this._keys.length ? this._keys.map(k => this._keyRow(k)).join('') : '<p style="color:var(--text-dim);font-size:.85rem">No API keys yet. Generate your first key to get started.</p>'}</div><div class="akey-perms"><h4>Permissions</h4><div class="perm-checkboxes">${['Read Markets', 'Read Account', 'Trade', 'Withdraw', 'Tokenize'].map(p => `<label class="checkbox-label"><input type="checkbox" ${p !== 'Withdraw' ? 'checked' : ''} />${p}</label>`).join('')}</div></div>`;
    document.getElementById('btn-gen-key')?.addEventListener('click', () => this._generate(container));
  },
  _keyRow(key) {
    return `<div class="akey-row" id="key-${key.id}"><div><div class="akey-name">${key.name}</div><div class="akey-val" title="Click to reveal"><code>${key.revealed ? key.value : key.masked}</code><button class="btn-icon" onclick="NXT.apiKeys.toggle('${key.id}')">👁</button><button class="btn-icon" onclick="NXT.apiKeys.copy('${key.id}')">⎘</button></div><div class="akey-meta">Created ${NXT.utils.timeAgo(key.created)} · Last used: ${key.lastUsed || 'Never'}</div></div><button class="btn-danger btn-sm" onclick="NXT.apiKeys.revoke('${key.id}')">Revoke</button></div>`;
  },
  _generate(container) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const rand32 = () => Array.from({ length: 32 }, () => chars[NXT.utils.randInt(0, chars.length - 1)]).join('');
    const key = { id: NXT.utils.uid('key'), name: `Key ${this._keys.length + 1}`, value: `nxt_live_${rand32()}`, masked: `nxt_live_${'•'.repeat(32)}`, created: new Date().toISOString(), lastUsed: null, revealed: false };
    this._keys.push(key); NXT.toast.show(`API key "${key.name}" generated. Store it safely — it won't be shown again.`, 'success', 6000); this.render(container);
  },
  toggle(id) { const key = this._keys.find(k => k.id === id); if (key) { key.revealed = !key.revealed; this.render(document.getElementById('api-key-manager')); } },
  async copy(id) { const key = this._keys.find(k => k.id === id); if (!key) return; await NXT.utils.copyToClipboard(key.value); NXT.toast.show('API key copied to clipboard', 'success'); },
  revoke(id) { this._keys = this._keys.filter(k => k.id !== id); NXT.toast.show('API key revoked', 'warn'); this.render(document.getElementById('api-key-manager')); },
};

NXT.apiPlayground = {
  init() {
    const pg = document.getElementById('api-playground'); if (!pg) return;
    NXT.utils.$$('.docs-content pre').forEach(pre => {
      const btn = NXT.utils.el('button', { className: 'copy-code-btn' }, 'Copy');
      btn.addEventListener('click', async () => { await NXT.utils.copyToClipboard(pre.textContent); btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy'; }, 1800); });
      pre.style.position = 'relative'; pre.appendChild(btn);
    });
    NXT.utils.$$('.sidebar-link').forEach(link => { link.addEventListener('click', e => { e.preventDefault(); const target = document.querySelector(link.getAttribute('href')); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); NXT.utils.$$('.sidebar-link').forEach(l => l.classList.remove('active')); link.classList.add('active'); }); });
    const headings = NXT.utils.$$('.docs-content h2[id], .docs-content h3[id]');
    if (headings.length && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { const id = entry.target.id; const link = document.querySelector(`.sidebar-link[href="#${id}"]`); if (link) { NXT.utils.$$('.sidebar-link').forEach(l => l.classList.remove('active')); link.classList.add('active'); } } }); }, { rootMargin: '-20% 0px -60% 0px' });
      headings.forEach(h => obs.observe(h));
    }
    this._buildTester();
  },
  _buildTester() {
    const container = document.getElementById('api-tester'); if (!container) return;
    container.innerHTML = `<div class="tester-header"><span class="eyebrow">Live API Tester</span></div><div class="tester-row"><select id="tester-method" class="tester-method"><option>GET</option><option>POST</option><option>DELETE</option></select><input id="tester-endpoint" type="text" value="/markets" placeholder="/markets" class="tester-input" /><button id="tester-send" class="btn-primary btn-sm">Send →</button></div><div class="tester-body-row" id="tester-body-row" style="display:none"><label>Request Body (JSON)</label><textarea id="tester-body" class="tester-textarea" rows="6">{}</textarea></div><div class="tester-response" id="tester-response" style="display:none"><div class="tester-res-header"><span>Response</span><span id="tester-status" class="tester-status"></span></div><pre id="tester-res-body" class="tester-res-body"></pre></div>`;
    document.getElementById('tester-method')?.addEventListener('change', e => { const bodyRow = document.getElementById('tester-body-row'); if (bodyRow) bodyRow.style.display = e.target.value !== 'GET' ? 'block' : 'none'; });
    document.getElementById('tester-send')?.addEventListener('click', () => this._sendRequest());
  },
  async _sendRequest() {
    const method = document.getElementById('tester-method')?.value; const endpoint = document.getElementById('tester-endpoint')?.value;
    const btn = document.getElementById('tester-send'); const resEl = document.getElementById('tester-response'); const statusEl = document.getElementById('tester-status'); const bodyEl = document.getElementById('tester-res-body');
    if (!endpoint.startsWith('/')) { NXT.toast.show('Endpoint must start with /', 'error'); return; }
    btn.textContent = 'Sending…'; btn.disabled = true;
    await new Promise(r => setTimeout(r, NXT.utils.randInt(300, 900)));
    const mockResponses = { '/markets': { markets: Object.keys(NXT.market.assets).map(p => ({ pair: p, status: 'active', price: NXT.market.assets[p].price })) }, '/ticker/BTC-EUR': { pair: 'BTC/EUR', price: NXT.market.assets['BTC/EUR'].price }, '/account/kyc': { level: NXT.state.kycLevel }, '/account/balance': { EUR: '5,000.00', BTC: '0.14230', ETH: '2.5012' } };
    const mockKey = Object.keys(mockResponses).find(k => endpoint.endsWith(k));
    let responseData; let statusCode;
    if (method === 'DELETE') { responseData = { deleted: true, id: 'ord_' + Math.random().toString(36).slice(2,8) }; statusCode = 200; }
    else if (!NXT.state.isLoggedIn && endpoint !== '/markets') { responseData = { error: { code: 'UNAUTHORIZED', message: 'Missing or invalid API key.', status: 401 } }; statusCode = 401; }
    else if (mockKey) { responseData = mockResponses[mockKey]; statusCode = 200; }
    else if (method === 'POST') { responseData = { id: NXT.utils.uid(), status: 'created', created_at: new Date().toISOString() }; statusCode = 201; }
    else { responseData = { error: { code: 'NOT_FOUND', message: `Endpoint '${endpoint}' not found.`, status: 404 } }; statusCode = 404; }
    resEl.style.display = 'block'; statusEl.textContent = statusCode; statusEl.className = `tester-status ${statusCode < 300 ? 'ok' : statusCode < 500 ? 'warn' : 'err'}`;
    bodyEl.textContent = JSON.stringify(responseData, null, 2); btn.textContent = 'Send →'; btn.disabled = false;
  },
};

NXT.blog = {
  activeCategory: 'All',
  init() {
    NXT.utils.$$('.cat-btn').forEach(btn => { btn.addEventListener('click', () => { NXT.utils.$$('.cat-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); this.activeCategory = btn.textContent.trim(); this._filterPosts(); }); });
    const searchInput = document.getElementById('blog-search'); if (searchInput) { searchInput.addEventListener('input', NXT.utils.debounce(() => this._filterPosts(), 300)); }
    const featured = NXT.utils.$('.featured-post'); if (featured) { featured.style.cursor = 'pointer'; featured.addEventListener('click', () => { NXT.toast.show('Opening article…', 'info'); }); }
  },
  _filterPosts() {
    const query = document.getElementById('blog-search')?.value.toLowerCase() || '';
    NXT.utils.$$('.blog-card').forEach(post => {
      const cat = post.querySelector('.blog-cat')?.textContent.trim() || ''; const title = post.querySelector('.blog-title')?.textContent.toLowerCase() || '';
      const catMatch = this.activeCategory === 'All' || cat === this.activeCategory; const queryMatch = !query || title.includes(query);
      post.style.transition = 'opacity 0.25s, transform 0.25s';
      if (catMatch && queryMatch) { post.style.opacity = '1'; post.style.transform = 'scale(1)'; post.style.display = ''; }
      else { post.style.opacity = '0'; post.style.transform = 'scale(0.97)'; setTimeout(() => { if (!(catMatch && queryMatch)) post.style.display = 'none'; }, 250); }
    });
  },
};

NXT.careers = {
  _activeDept: 'All',
  init() {
    const deptBtns = NXT.utils.$$('[data-dept]');
    deptBtns.forEach(btn => { btn.addEventListener('click', () => { deptBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); this._activeDept = btn.dataset.dept; this._filterJobs(); }); });
    NXT.utils.$$('.apply-btn').forEach(btn => { btn.addEventListener('click', e => { e.stopPropagation(); const card = btn.closest('.job-card'); const title = card?.querySelector('.job-title')?.textContent; this._openApplyModal(title || 'this role'); }); });
    NXT.utils.$$('.job-card').forEach(card => { card.addEventListener('click', e => { if (e.target.closest('.apply-btn')) return; card.classList.toggle('job-expanded'); }); });
    this._buildApplyModal();
  },
  _filterJobs() { NXT.utils.$$('.job-card').forEach(card => { const dept = card.querySelector('.job-dept')?.textContent.trim() || ''; card.style.display = this._activeDept === 'All' || dept === this._activeDept ? '' : 'none'; }); },
  _buildApplyModal() {
    NXT.modal.build('apply', '📄 Apply for Position', `
      <form id="form-apply" class="auth-form" novalidate>
        <div class="form-group"><label>Position</label><input id="apply-role" type="text" readonly style="opacity:.6;cursor:default" /></div>
        <div class="grid-2-sm"><div class="form-group"><label for="apply-first">First name</label><input id="apply-first" type="text" placeholder="Jonas" required /></div><div class="form-group"><label for="apply-last">Last name</label><input id="apply-last" type="text" placeholder="Petrauskas" required /></div></div>
        <div class="form-group"><label for="apply-email">Email address</label><input id="apply-email" type="email" placeholder="you@example.com" required /></div>
        <div class="form-group"><label for="apply-linkedin">LinkedIn / Portfolio URL</label><input id="apply-linkedin" type="url" placeholder="https://linkedin.com/in/..." /></div>
        <div class="form-group"><label for="apply-cv">Upload CV (PDF, max 5MB)</label><div class="file-drop" id="apply-cv-drop"><span>📎 Drop your CV here or <u>browse</u></span><input type="file" id="apply-cv" accept=".pdf,.doc,.docx" style="display:none" /></div></div>
        <div class="form-group"><label for="apply-cover">Cover letter (optional)</label><textarea id="apply-cover" rows="4" placeholder="Tell us why you're excited about this role…"></textarea></div>
        <button type="submit" class="btn-primary full-w" id="btn-apply">Submit Application →</button>
      </form>`);
    const form = document.getElementById('form-apply'); if (!form) return;
    const dropZone = document.getElementById('apply-cv-drop'); const fileInput = document.getElementById('apply-cv');
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());
      dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragging'); });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
      dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragging'); const file = e.dataTransfer.files[0]; if (file) dropZone.querySelector('span').textContent = `✓ ${file.name}`; });
      fileInput.addEventListener('change', () => { const file = fileInput.files[0]; if (file) dropZone.querySelector('span').textContent = `✓ ${file.name}`; });
    }
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = document.getElementById('btn-apply');
      btn.textContent = 'Submitting…';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 1600));
      NXT.modal.close();
      NXT.toast.show("🎉 Application submitted! We'll be in touch within 5 business days.", 'success', 7000);
      btn.textContent = 'Submit Application →';
      btn.disabled = false;
    });
  },
  _openApplyModal(role) { NXT.modal.open('apply'); setTimeout(() => { const roleInput = document.getElementById('apply-role'); if (roleInput) roleInput.value = role; }, 50); },
};

NXT.scrollAnimations = {
  _obs: null,
  init() {
    if (!('IntersectionObserver' in window)) return;
    this._obs = new IntersectionObserver(entries => { entries.forEach(entry => { if (!entry.isIntersecting) return; const el = entry.target; if (el.classList.contains('reveal')) { el.classList.add('revealed'); } if (el.dataset.count) { this._animateCounter(el); } this._obs.unobserve(el); }); }, { threshold: 0.15 });
    this.refresh();
  },
  refresh() {
    const selectors = ['.card', '.stat-cell', '.job-card', '.blog-card', '.article-card', '.perk-card', '.reg-card', '.team-card', '.timeline .tl-item'];
    selectors.forEach(sel => { NXT.utils.$$(sel).forEach((el, i) => { if (!el.dataset.observed) { el.classList.add('reveal'); el.style.animationDelay = `${i * 0.05}s`; el.dataset.observed = '1'; this._obs?.observe(el); } }); });
    NXT.utils.$$('[data-count]').forEach(el => { if (!el.dataset.observed) { el.dataset.observed = '1'; this._obs?.observe(el); } });
  },
  _animateCounter(el) {
    const target = parseFloat(el.dataset.count); const suffix = el.dataset.suffix || ''; const prefix = el.dataset.prefix || '';
    const duration = parseInt(el.dataset.duration) || 1400; const decimals = (target % 1 !== 0) ? 1 : 0; const start = performance.now();
    const step = (now) => { const elapsed = now - start; const progress = Math.min(elapsed / duration, 1); const ease = 1 - Math.pow(1 - progress, 3); const current = target * ease; el.textContent = prefix + current.toFixed(decimals) + suffix; if (progress < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  },
};

NXT.particles = {
  canvas: null, ctx: null, _particles: [], _raf: null, COUNT: 55,
  init(canvasId = 'bg-canvas') {
    this.canvas = document.getElementById(canvasId); if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d'); this._resize(); this._generate(); this._loop();
    window.addEventListener('resize', NXT.utils.throttle(() => { this._resize(); this._generate(); }, 400));
    document.addEventListener('mousemove', NXT.utils.throttle(e => { this._mouseX = e.clientX / window.innerWidth; this._mouseY = e.clientY / window.innerHeight; }, 30));
  },
  _resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; },
  _generate() { this._particles = Array.from({ length: this.COUNT }, () => ({ x: NXT.utils.rand(0, this.canvas.width), y: NXT.utils.rand(0, this.canvas.height), vx: NXT.utils.rand(-0.12, 0.12), vy: NXT.utils.rand(-0.12, 0.12), size: NXT.utils.rand(0.8, 2.2), alpha: NXT.utils.rand(0.08, 0.28) })); },
  _loop() { this._raf = requestAnimationFrame(() => this._loop()); this._draw(); },
  _draw() {
    const ctx = this.ctx; const W = this.canvas.width; const H = this.canvas.height;
    ctx.clearRect(0, 0, W, H); const CONN_DIST = 130;
    this._particles.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(56,189,130,${p.alpha})`; ctx.fill(); });
    ctx.lineWidth = 0.4;
    for (let i = 0; i < this._particles.length; i++) { for (let j = i + 1; j < this._particles.length; j++) { const a = this._particles[i]; const b = this._particles[j]; const dx = a.x - b.x; const dy = a.y - b.y; const dist = Math.sqrt(dx * dx + dy * dy); if (dist < CONN_DIST) { ctx.strokeStyle = `rgba(56,189,130,${(1 - dist / CONN_DIST) * 0.1})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } } }
  },
  destroy() { cancelAnimationFrame(this._raf); },
};

NXT.portfolio = {
  _holdings: [
    { asset: 'BTC', amount: 0.142, avgCost: 58000, pair: 'BTC/EUR' },
    { asset: 'ETH', amount: 2.50,  avgCost: 1750,  pair: 'ETH/EUR' },
    { asset: 'SOL', amount: 40,    avgCost: 85,    pair: 'SOL/EUR' },
    { asset: 'AVAX', amount: 15,   avgCost: 19.50, pair: 'AVAX/EUR' },
  ],
  init() { const container = document.getElementById('portfolio-table'); if (!container) return; this.render(container); NXT.market.subscribe(NXT.utils.throttle(() => this.render(container), 3000)); },
  refresh() { const container = document.getElementById('portfolio-table'); if (container) this.render(container); },
  render(container) {
    let totalValue = 0; let totalCost = 0;
    const rows = this._holdings.map(h => {
      const price = NXT.market.assets[h.pair]?.price || 0; const value = price * h.amount; const cost = h.avgCost * h.amount;
      const pnl = value - cost; const pnlPct = ((pnl / cost) * 100); totalValue += value; totalCost += cost;
      return `<tr><td><span class="asset-badge">${h.asset}</span></td><td>${h.amount.toFixed(h.amount < 1 ? 4 : 2)}</td><td>${NXT.utils.formatCurrency(price)}</td><td>${NXT.utils.formatCurrency(value)}</td><td class="${pnl >= 0 ? 'up' : 'down'}">${NXT.utils.formatCurrency(pnl)} (${pnl >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%)</td></tr>`;
    }).join('');
    const totalPnl = totalValue - totalCost; const totalPnlPct = ((totalPnl / totalCost) * 100);
    container.innerHTML = `<div class="port-summary"><div class="port-stat"><div class="port-stat-label">Total Value</div><div class="port-stat-val">${NXT.utils.formatCurrency(totalValue)}</div></div><div class="port-stat"><div class="port-stat-label">Total P&L</div><div class="port-stat-val ${totalPnl >= 0 ? 'up' : 'down'}">${NXT.utils.formatCurrency(totalPnl)} (${totalPnl >= 0 ? '+' : ''}${totalPnlPct.toFixed(2)}%)</div></div><div class="port-stat"><div class="port-stat-label">Open Orders</div><div class="port-stat-val">${NXT.state.openOrders.length}</div></div></div><table class="port-table"><thead><tr><th>Asset</th><th>Amount</th><th>Price</th><th>Value</th><th>P&L</th></tr></thead><tbody>${rows}</tbody></table>`;
  },
};

NXT.shortcuts = {
  _map: {},
  init() {
    this.register('alt+e', () => NXT.router.go('exchange'), 'Open Exchange');
    this.register('alt+d', () => NXT.router.go('dashboard'), 'Dashboard');
    this.register('alt+a', () => NXT.router.go('about'), 'About');
    this.register('alt+b', () => NXT.router.go('blog'), 'Blog');
    this.register('alt+/', () => this._showHelp(), 'Show shortcuts');
    this.register('alt+l', () => { if (NXT.state.isLoggedIn) NXT.auth.logout(); else NXT.modal.open('login'); }, 'Login / Logout');
    document.addEventListener('keydown', e => { const key = [e.altKey ? 'alt' : '', e.ctrlKey ? 'ctrl' : '', e.shiftKey ? 'shift' : '', e.key.toLowerCase()].filter(Boolean).join('+'); const fn = this._map[key]; if (fn) { e.preventDefault(); fn(); } });
  },
  register(combo, fn, label = '') { this._map[combo] = fn; this._map[combo]._label = label; this._map[combo]._combo = combo; },
  _showHelp() {
    const lines = Object.values(this._map).filter(fn => fn._label).map(fn => `<tr><td><kbd>${fn._combo}</kbd></td><td>${fn._label}</td></tr>`).join('');
    NXT.modal.build('shortcuts', '⌨️ Keyboard Shortcuts', `<table class="shortcut-table"><thead><tr><th>Shortcut</th><th>Action</th></tr></thead><tbody>${lines}</tbody></table>`);
    NXT.modal.open('shortcuts');
  },
};

NXT.styles = {
  inject() {
    const css = `
      .page { opacity: 0; transform: translateY(10px); transition: opacity .35s ease, transform .35s ease; }
      .page.active { opacity: 1; transform: translateY(0); }
      .ticker-item { display: inline-flex; align-items: center; gap: 10px; padding: 0 22px; white-space: nowrap; font-family: var(--font-mono); font-size: .8rem; }
      .ticker-pair { color: var(--text-muted); font-size: .75rem; }
      .ticker-price { color: var(--text); font-weight: 500; }
      .ticker-change.up { color: var(--accent); }
      .ticker-change.down { color: var(--red); }
      .ticker-price.flash { animation: flash .35s ease; }
      @keyframes flash { 0%,100% { opacity:1; } 50% { opacity:.4; } }
      .reveal { opacity: 0; transform: translateY(18px); transition: opacity .45s ease, transform .45s ease; }
      .reveal.revealed { opacity: 1; transform: translateY(0); }
      .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
      .toast { pointer-events: all; display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-radius: 12px; background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-size: .85rem; max-width: 380px; box-shadow: 0 8px 32px rgba(0,0,0,.4); transform: translateX(120%); transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .3s; opacity: 0; }
      .toast.toast-show { transform: translateX(0); opacity: 1; }
      .toast.toast-hide { transform: translateX(120%); opacity: 0; }
      .toast-success { border-left: 3px solid var(--accent); }
      .toast-error { border-left: 3px solid var(--red); }
      .toast-warn { border-left: 3px solid var(--gold); }
      .toast-info { border-left: 3px solid #6b9de8; }
      .toast-icon { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 700; }
      .toast-success .toast-icon { background: rgba(56,189,130,.15); color: var(--accent); }
      .toast-error .toast-icon { background: rgba(224,80,80,.15); color: var(--red); }
      .toast-warn .toast-icon { background: rgba(240,192,64,.15); color: var(--gold); }
      .toast-info .toast-icon { background: rgba(107,157,232,.15); color: #6b9de8; }
      .toast-msg { flex: 1; line-height: 1.4; }
      .toast-close { background: none; border: none; color: var(--text-dim); font-size: 1rem; cursor: pointer; padding: 0 4px; }
      .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(4px); opacity: 0; transition: opacity .25s; }
      .modal-overlay.modal-overlay-show { opacity: 1; }
      .modal { display: none; position: fixed; inset: 0; z-index: 1001; align-items: center; justify-content: center; padding: 20px; }
      .modal.modal-show .modal-dialog { transform: translateY(0) scale(1); opacity: 1; }
      .modal-dialog { background: var(--surface2); border: 1px solid var(--border); border-radius: 18px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; transform: translateY(20px) scale(.97); opacity: 0; transition: transform .3s cubic-bezier(.34,1.4,.64,1), opacity .3s; box-shadow: 0 24px 64px rgba(0,0,0,.5); }
      .modal-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
      .modal-title { font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; }
      .modal-x { background: none; border: none; color: var(--text-muted); font-size: 1.3rem; cursor: pointer; padding: 0; line-height: 1; }
      .modal-body { padding: 24px; }
      .auth-form { display: flex; flex-direction: column; gap: 14px; }
      .form-group { display: flex; flex-direction: column; gap: 6px; }
      .form-group label { font-size: .82rem; color: var(--text-muted); }
      .form-group input, .form-group select, .form-group textarea { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; color: var(--text); font-family: var(--font-body); font-size: .9rem; outline: none; transition: border-color .2s; width: 100%; }
      .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--border-glow); }
      .field-err { font-size: .75rem; color: var(--red); min-height: 16px; }
      .input-eye { position: relative; }
      .input-eye input { padding-right: 40px; }
      .eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: .9rem; }
      .btn-primary { background: var(--accent); color: var(--bg); border: none; border-radius: 10px; padding: 12px 24px; font-family: var(--font-body); font-size: .88rem; font-weight: 600; cursor: pointer; transition: opacity .2s; }
      .btn-primary:hover { opacity: .85; }
      .btn-primary:disabled { opacity: .5; cursor: not-allowed; }
      .btn-sm { padding: 7px 14px; font-size: .78rem; }
      .btn-danger { background: rgba(224,80,80,.12); color: var(--red); border: 1px solid rgba(224,80,80,.25); border-radius: 8px; padding: 7px 14px; font-size: .78rem; cursor: pointer; }
      .btn-icon { background: none; border: none; cursor: pointer; opacity: .6; font-size: .85rem; }
      .full-w { width: 100%; }
      .form-row-inline { display: flex; align-items: center; justify-content: space-between; }
      .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: .82rem; color: var(--text-muted); cursor: pointer; }
      .checkbox-label input { width: 14px; height: 14px; accent-color: var(--accent); }
      .link-sm { font-size: .8rem; color: var(--accent); text-decoration: none; }
      .auth-switch { text-align: center; font-size: .82rem; color: var(--text-muted); margin: 0; }
      .grid-2-sm { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .ps-bar { height: 3px; background: var(--border); border-radius: 2px; margin-top: 6px; overflow: hidden; }
      .ob-header { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 8px 12px; font-family: var(--font-mono); font-size: .68rem; color: var(--text-dim); text-transform: uppercase; }
      .ob-row { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 3px 12px; font-family: var(--font-mono); font-size: .78rem; cursor: pointer; }
      .ob-bid { color: var(--accent); }
      .ob-ask { color: var(--red); }
      .ob-depth-bar { position: absolute; top: 0; right: 0; height: 100%; opacity: .12; pointer-events: none; }
      .ob-bid-bar { background: var(--accent); }
      .ob-ask-bar { background: var(--red); }
      .ob-mid { text-align: center; padding: 10px; font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
      .ob-mid.up { color: var(--accent); }
      .ob-mid.down { color: var(--red); }
      .tf-header { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 8px 12px; font-family: var(--font-mono); font-size: .68rem; color: var(--text-dim); text-transform: uppercase; }
      .tf-row { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 3px 12px; font-family: var(--font-mono); font-size: .78rem; }
      .tf-new { animation: rowFlash .5s ease; }
      @keyframes rowFlash { from { background: rgba(56,189,130,.12); } to { background: transparent; } }
      .tf-price.buy { color: var(--accent); }
      .tf-price.sell { color: var(--red); }
      .copy-code-btn { position: absolute; top: 10px; right: 10px; background: var(--surface2); border: 1px solid var(--border); color: var(--text-muted); font-size: .72rem; font-family: var(--font-mono); padding: 4px 10px; border-radius: 5px; cursor: pointer; }
      .tester-row { display: flex; gap: 8px; margin: 14px 0; }
      .tester-method { background: var(--surface); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 8px 12px; font-family: var(--font-mono); font-size: .8rem; }
      .tester-input { flex: 1; background: var(--surface); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 8px 12px; font-family: var(--font-mono); font-size: .8rem; }
      .tester-textarea { width: 100%; background: var(--surface); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 10px; font-family: var(--font-mono); font-size: .78rem; resize: vertical; }
      .tester-res-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-family: var(--font-mono); font-size: .78rem; color: var(--text-muted); }
      .tester-status { padding: 3px 10px; border-radius: 5px; font-size: .72rem; }
      .tester-status.ok { background: rgba(56,189,130,.12); color: var(--accent); }
      .tester-status.warn { background: rgba(240,192,64,.12); color: var(--gold); }
      .tester-status.err { background: rgba(224,80,80,.12); color: var(--red); }
      .tester-res-body { white-space: pre; font-size: .78rem; max-height: 280px; overflow-y: auto; }
      .port-summary { display: flex; gap: 32px; padding: 20px 0 24px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
      .port-stat-label { font-size: .72rem; color: var(--text-dim); font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 4px; }
      .port-stat-val { font-family: var(--font-display); font-weight: 700; font-size: 1.2rem; }
      .port-table { width: 100%; border-collapse: collapse; font-size: .85rem; }
      .port-table th { text-align: left; padding: 8px 12px; font-family: var(--font-mono); font-size: .68rem; color: var(--text-dim); text-transform: uppercase; border-bottom: 1px solid var(--border); }
      .port-table td { padding: 12px 12px; border-bottom: 1px solid rgba(255,255,255,.04); color: var(--text-muted); }
      .asset-badge { font-family: var(--font-mono); font-size: .78rem; color: var(--text); background: var(--surface2); border: 1px solid var(--border); border-radius: 4px; padding: 2px 8px; }
      .up { color: var(--accent) !important; }
      .down { color: var(--red) !important; }
      .kyc-status { display: flex; align-items: center; gap: 14px; padding: 16px; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 16px; }
      .kyc-indicator { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
      .kyc-label { font-family: var(--font-display); font-weight: 700; font-size: .9rem; }
      .kyc-desc { font-size: .78rem; color: var(--text-muted); }
      .badge-verified { font-size: .75rem; color: var(--accent); border: 1px solid var(--border-glow); border-radius: 20px; padding: 4px 12px; }
      .kyc-steps { display: flex; gap: 8px; flex-wrap: wrap; }
      .kyc-step { display: flex; align-items: center; gap: 8px; font-size: .8rem; color: var(--text-dim); }
      .kyc-step.done { color: var(--accent); }
      .kyc-step-dot { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .68rem; font-weight: 700; border: 1px solid var(--border); }
      .kyc-step.done .kyc-step-dot { background: var(--accent); color: var(--bg); border-color: var(--accent); }
      .akey-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
      .akey-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 14px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 10px; }
      .akey-val { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: .75rem; color: var(--text-muted); }
      .akey-meta { font-size: .72rem; color: var(--text-dim); margin-top: 4px; }
      .akey-perms { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); }
      .perm-checkboxes { display: flex; flex-wrap: wrap; gap: 12px; }
      .file-drop { border: 2px dashed var(--border); border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; color: var(--text-muted); font-size: .85rem; transition: border-color .2s; }
      .file-drop:hover, .file-drop.dragging { border-color: var(--border-glow); background: var(--accent-dim); }
      .shortcut-table { width: 100%; border-collapse: collapse; font-size: .85rem; }
      .shortcut-table td { padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,.04); }
      kbd { background: var(--surface2); border: 1px solid var(--border); border-radius: 5px; padding: 3px 8px; font-family: var(--font-mono); font-size: .78rem; color: var(--accent); }
      #bg-canvas { position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: .6; }
      .page { position: relative; z-index: 1; }
      select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a8599' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
    `;
    const style = document.createElement('style'); style.id = 'nxt-runtime-styles'; style.textContent = css; document.head.appendChild(style);
  },
};

NXT.init = function() {
  NXT.styles.inject();
  NXT.toast.init();
  NXT.modal.init();
  NXT.router.init();
  NXT.market.init();
  NXT.ticker.init();
  NXT.scrollAnimations.init();
  NXT.auth.init();
  NXT.particles.init('bg-canvas');
  NXT.shortcuts.init();
  NXT.state.on('page:exchange', () => { NXT.chart.init('price-chart'); NXT.orderBook.init('order-book'); NXT.tradeFeed.init('trade-feed'); NXT.exchange.init(); NXT.portfolio.init(); });
  NXT.state.on('page:dashboard', () => { NXT.kyc.render('kyc-widget'); NXT.portfolio.init(); NXT.apiKeys.init(); NXT.chart.init('dash-chart'); });
  NXT.state.on('page:api', () => { NXT.apiPlayground.init(); });
  NXT.state.on('page:careers', () => { NXT.careers.init(); });
  NXT.state.on('page:blog', () => { NXT.blog.init(); });
  document.querySelector('.nav-login')?.addEventListener('click', e => { e.preventDefault(); NXT.modal.open(NXT.state.isLoggedIn ? 'register' : 'login'); });
  document.querySelector('.nav-register')?.addEventListener('click', e => { e.preventDefault(); NXT.modal.open('register'); });
  NXT.utils.$$('[data-market]').forEach(btn => { btn.addEventListener('click', () => { const pair = btn.dataset.market; NXT.state.set('activeMarket', pair); NXT.chart.setPair(pair); NXT.orderBook.setPair(pair); NXT.tradeFeed.pair = pair; NXT.utils.$$('[data-market]').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }); });
  setTimeout(() => { NXT.toast.show('Welcome to Nextoken Capital — EU regulated tokenized markets', 'info', 5000); }, 800);
  console.log('%c NXT NEXTOKEN CAPITAL ', 'background:#38bd82;color:#060810;font-weight:800;font-size:14px;padding:6px 12px;border-radius:4px;');
};

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', NXT.init); } else { NXT.init(); }
window.NXT = NXT;