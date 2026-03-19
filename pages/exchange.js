// pages/exchange.js
// ─── Full Binance-style exchange with live candles, order book, trade feed ───
// Mobile compatible · All time frames · No external dependencies

import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'

// ─── MARKET DATA ──────────────────────────────────────────────────────────────
const PAIRS = [
  { sym:'BTC/EUR',  price:62054.31, chg:-3.66, vol:'1.24B',  high:64900, low:61200 },
  { sym:'ETH/EUR',  price:1913.01,  chg:-5.24, vol:'580M',   high:2025,  low:1890  },
  { sym:'BNB/EUR',  price:568.90,   chg:-2.20, vol:'290M',   high:588,   low:562   },
  { sym:'SOL/EUR',  price:98.42,    chg:+1.12, vol:'420M',   high:102,   low:96.1  },
  { sym:'XRP/EUR',  price:0.4821,   chg:+0.87, vol:'1.8B',   high:0.495, low:0.471 },
  { sym:'ADA/EUR',  price:0.3312,   chg:-1.45, vol:'920M',   high:0.341, low:0.328 },
  { sym:'AVAX/EUR', price:22.18,    chg:+2.30, vol:'310M',   high:22.9,  low:21.5  },
  { sym:'DOT/EUR',  price:5.74,     chg:-0.92, vol:'175M',   high:5.85,  low:5.68  },
  { sym:'MATIC/EUR',price:0.5123,   chg:+3.10, vol:'660M',   high:0.524, low:0.494 },
  { sym:'LINK/EUR', price:11.42,    chg:+1.75, vol:'240M',   high:11.65, low:11.10 },
  { sym:'UNI/EUR',  price:8.34,     chg:-0.55, vol:'180M',   high:8.71,  low:8.20  },
  { sym:'ATOM/EUR', price:6.91,     chg:+0.33, vol:'95M',    high:7.10,  low:6.78  },
]

const TIMEFRAMES = ['1m','5m','15m','1h','4h','1d','1w']

function rand(min, max) { return Math.random() * (max - min) + min }
function randInt(min, max) { return Math.floor(rand(min, max + 1)) }

function generateCandles(basePrice, count, tf) {
  const candles = []
  let price = basePrice * rand(0.85, 1.12)
  const now = Date.now()
  const tfMs = { '1m':60000,'5m':300000,'15m':900000,'1h':3600000,'4h':14400000,'1d':86400000,'1w':604800000 }
  const ms = tfMs[tf] || 60000
  for (let i = count; i > 0; i--) {
    const vol = price * rand(0.008, 0.025)
    const open = price
    const close = price + rand(-vol, vol)
    const high = Math.max(open, close) + rand(0, vol * 0.5)
    const low = Math.min(open, close) - rand(0, vol * 0.5)
    candles.push({ t: now - i * ms, o: open, h: high, l: low, c: close, v: rand(100, 5000) })
    price = close
  }
  return candles
}

// ─── CHART COMPONENT ─────────────────────────────────────────────────────────
function CandleChart({ pair, tf }) {
  const canvasRef = useRef(null)
  const candlesRef = useRef([])
  const rafRef = useRef(null)
  const dirtyRef = useRef(true)
  const hoverRef = useRef(-1)

  const basePrice = PAIRS.find(p => p.sym === pair)?.price || 1000

  useEffect(() => {
    candlesRef.current = generateCandles(basePrice, 200, tf)
    dirtyRef.current = true
  }, [pair, tf, basePrice])

  useEffect(() => {
    const interval = setInterval(() => {
      const candles = candlesRef.current
      if (!candles.length) return
      const last = candles[candles.length - 1]
      const vol = last.c * 0.0006
      last.c += rand(-vol, vol)
      last.h = Math.max(last.h, last.c)
      last.l = Math.min(last.l, last.c)
      dirtyRef.current = true
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !dirtyRef.current) return
    dirtyRef.current = false
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, W, H)

    const candles = candlesRef.current
    const VIEW = Math.min(candles.length, 100)
    const data = candles.slice(-VIEW)
    if (!data.length) return

    const UP = '#0ecb81'
    const DOWN = '#f6465d'
    const GRID = 'rgba(255,255,255,0.04)'
    const TXTC = 'rgba(132,142,156,0.9)'

    const PAD = { t:12, r:70, b:36, l:8 }
    const chartH = H * 0.78
    const volH = H * 0.16
    const cW = W - PAD.l - PAD.r
    const bW = Math.max(2, (cW / VIEW) * 0.75)

    const prices = data.flatMap(c => [c.h, c.l])
    const mn = Math.min(...prices), mx = Math.max(...prices)
    const rng = mx - mn || 1
    const pad = rng * 0.06
    const yMin = mn - pad, yMax = mx + pad

    const toY = p => PAD.t + chartH - ((p - yMin) / (yMax - yMin)) * chartH
    const toX = i => PAD.l + (i + 0.5) * (cW / VIEW)

    // Grid
    ctx.strokeStyle = GRID
    ctx.lineWidth = 1
    for (let i = 0; i <= 6; i++) {
      const y = PAD.t + (chartH / 6) * i
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(W - PAD.r, y); ctx.stroke()
      const price = yMax - ((yMax - yMin) / 6) * i
      ctx.fillStyle = TXTC
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(price.toFixed(price > 100 ? 2 : 4), W - PAD.r + 4, y + 4)
    }

    // Volume bars
    const maxVol = Math.max(...data.map(c => c.v))
    data.forEach((c, i) => {
      const x = toX(i)
      const bh = (c.v / maxVol) * volH
      ctx.fillStyle = c.c >= c.o ? 'rgba(14,203,129,0.25)' : 'rgba(246,70,93,0.25)'
      ctx.fillRect(x - bW / 2, H - PAD.b - bh, bW, bh)
    })

    // Candles
    data.forEach((c, i) => {
      const x = toX(i)
      const color = c.c >= c.o ? UP : DOWN
      ctx.strokeStyle = color
      ctx.fillStyle = c.c >= c.o ? UP : DOWN
      ctx.lineWidth = 1

      // Wick
      ctx.beginPath()
      ctx.moveTo(x, toY(c.h))
      ctx.lineTo(x, toY(c.l))
      ctx.stroke()

      // Body
      const top = toY(Math.max(c.o, c.c))
      const ht = Math.max(1, Math.abs(toY(c.o) - toY(c.c)))
      if (c.c >= c.o) {
        ctx.fillRect(x - bW / 2, top, bW, ht)
      } else {
        ctx.strokeStyle = DOWN
        ctx.lineWidth = 1
        ctx.strokeRect(x - bW / 2, top, bW, ht)
        ctx.fillStyle = DOWN
        ctx.fillRect(x - bW / 2, top, bW, ht)
      }

      // Hover highlight
      if (i === hoverRef.current) {
        ctx.fillStyle = 'rgba(255,255,255,0.04)'
        ctx.fillRect(x - bW, PAD.t, bW * 2, chartH)
      }
    })

    // Last price line
    const last = data[data.length - 1]
    if (last) {
      const y = toY(last.c)
      const isUp = last.c >= last.o
      ctx.save()
      ctx.setLineDash([3, 3])
      ctx.strokeStyle = isUp ? 'rgba(14,203,129,0.5)' : 'rgba(246,70,93,0.5)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(W - PAD.r, y); ctx.stroke()
      ctx.restore()

      ctx.fillStyle = isUp ? UP : DOWN
      ctx.beginPath()
      ctx.roundRect(W - PAD.r + 2, y - 9, 65, 18, 3)
      ctx.fill()
      ctx.fillStyle = '#0b0e11'
      ctx.font = 'bold 10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(last.c.toFixed(last.c > 10 ? 2 : 4), W - PAD.r + 34, y + 4)
    }

    // Hover tooltip
    if (hoverRef.current >= 0 && hoverRef.current < data.length) {
      const c = data[hoverRef.current]
      const x = toX(hoverRef.current)
      const lines = [
        `O: ${c.o.toFixed(c.o > 10 ? 2 : 4)}`,
        `H: ${c.h.toFixed(c.h > 10 ? 2 : 4)}`,
        `L: ${c.l.toFixed(c.l > 10 ? 2 : 4)}`,
        `C: ${c.c.toFixed(c.c > 10 ? 2 : 4)}`,
        `V: ${c.v.toFixed(0)}`,
      ]
      const TW = 110, TH = lines.length * 16 + 16
      let tx = x + 12
      if (tx + TW > W - PAD.r) tx = x - TW - 12
      ctx.fillStyle = 'rgba(20,25,35,0.95)'
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.roundRect(tx, PAD.t + 8, TW, TH, 6); ctx.fill(); ctx.stroke()
      ctx.font = '10px monospace'
      lines.forEach((line, j) => {
        ctx.fillStyle = 'rgba(132,142,156,0.9)'
        ctx.textAlign = 'left'
        ctx.fillText(line, tx + 8, PAD.t + 22 + j * 16)
      })

      // Crosshair
      ctx.save()
      ctx.setLineDash([2, 2])
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, H - PAD.b); ctx.stroke()
      ctx.restore()
    }

    // Time axis
    ctx.fillStyle = TXTC
    ctx.font = '9px monospace'
    ctx.textAlign = 'center'
    const step = Math.max(1, Math.floor(VIEW / 8))
    data.forEach((c, i) => {
      if (i % step === 0) {
        const d = new Date(c.t)
        const label = tf === '1d' || tf === '1w'
          ? `${d.getMonth()+1}/${d.getDate()}`
          : `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
        ctx.fillText(label, toX(i), H - PAD.b + 14)
      }
    })
  }, [])

  useEffect(() => {
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop) }
    loop()
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  const onMove = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mouseX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const VIEW = Math.min(candlesRef.current.length, 100)
    const cW = canvas.clientWidth - 8 - 70
    const idx = Math.floor((mouseX - 8) / (cW / VIEW))
    hoverRef.current = Math.max(0, Math.min(idx, VIEW - 1))
    dirtyRef.current = true
  }, [])

  const onLeave = useCallback(() => { hoverRef.current = -1; dirtyRef.current = true }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width:'100%', height:'100%', display:'block', cursor:'crosshair' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchMove={onMove}
    />
  )
}

// ─── ORDER BOOK ───────────────────────────────────────────────────────────────
function OrderBook({ pair }) {
  const [book, setBook] = useState({ asks:[], bids:[] })
  const basePrice = PAIRS.find(p => p.sym === pair)?.price || 1000

  useEffect(() => {
    const gen = () => {
      const mid = basePrice + rand(-basePrice * 0.001, basePrice * 0.001)
      const asks = [], bids = []
      let ap = mid + basePrice * 0.0002
      let bp = mid - basePrice * 0.0002
      for (let i = 0; i < 12; i++) {
        asks.push({ p: ap, a: rand(0.01, 3), t: rand(50,5000) })
        bids.push({ p: bp, a: rand(0.01, 3), t: rand(50,5000) })
        ap += rand(0.1, basePrice * 0.0008)
        bp -= rand(0.1, basePrice * 0.0008)
      }
      const maxT = Math.max(...[...asks,...bids].map(x=>x.t))
      asks.forEach(x => x.pct = (x.t/maxT)*100)
      bids.forEach(x => x.pct = (x.t/maxT)*100)
      setBook({ asks: asks.reverse(), bids, mid })
    }
    gen()
    const iv = setInterval(gen, 1200)
    return () => clearInterval(iv)
  }, [pair, basePrice])

  const fmt = (n) => n > 100 ? n.toFixed(2) : n > 1 ? n.toFixed(4) : n.toFixed(6)

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',fontSize:'11px',fontFamily:'monospace'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'4px 8px',color:'#848e9c',borderBottom:'1px solid #1e2329',fontSize:'10px'}}>
        <span>Price(EUR)</span><span style={{textAlign:'right'}}>Amount</span><span style={{textAlign:'right'}}>Total</span>
      </div>
      <div style={{flex:1,overflow:'hidden'}}>
        {book.asks.map((r,i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'2px 8px',position:'relative',cursor:'pointer'}}>
            <div style={{position:'absolute',right:0,top:0,bottom:0,background:'rgba(246,70,93,0.1)',width:`${r.pct}%`}}/>
            <span style={{color:'#f6465d',position:'relative'}}>{fmt(r.p)}</span>
            <span style={{textAlign:'right',color:'#c4cdd4',position:'relative'}}>{r.a.toFixed(4)}</span>
            <span style={{textAlign:'right',color:'#c4cdd4',position:'relative'}}>{r.t.toFixed(0)}</span>
          </div>
        ))}
        <div style={{padding:'6px 8px',borderTop:'1px solid #1e2329',borderBottom:'1px solid #1e2329',display:'flex',alignItems:'center',gap:'8px'}}>
          <span style={{color: book.mid > basePrice ? '#0ecb81' : '#f6465d',fontSize:'14px',fontWeight:700}}>{fmt(book.mid || basePrice)}</span>
          <span style={{color:'#848e9c',fontSize:'10px'}}>≈ EUR {fmt(book.mid || basePrice)}</span>
        </div>
        {book.bids.map((r,i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'2px 8px',position:'relative',cursor:'pointer'}}>
            <div style={{position:'absolute',right:0,top:0,bottom:0,background:'rgba(14,203,129,0.1)',width:`${r.pct}%`}}/>
            <span style={{color:'#0ecb81',position:'relative'}}>{fmt(r.p)}</span>
            <span style={{textAlign:'right',color:'#c4cdd4',position:'relative'}}>{r.a.toFixed(4)}</span>
            <span style={{textAlign:'right',color:'#c4cdd4',position:'relative'}}>{r.t.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TRADE FEED ───────────────────────────────────────────────────────────────
function TradeFeed({ pair }) {
  const [trades, setTrades] = useState([])
  const basePrice = PAIRS.find(p => p.sym === pair)?.price || 1000

  useEffect(() => {
    const init = Array.from({length:20}, () => ({
      id: Math.random(), p: basePrice * rand(0.9998,1.0002),
      a: rand(0.001,2), side: Math.random()>0.5?'buy':'sell', t: new Date()
    }))
    setTrades(init)
    const iv = setInterval(() => {
      setTrades(prev => [{
        id: Math.random(), p: basePrice * rand(0.9998,1.0002),
        a: rand(0.001,2), side: Math.random()>0.5?'buy':'sell', t: new Date(), isNew:true
      }, ...prev].slice(0,25))
    }, randInt(400,2000))
    return () => clearInterval(iv)
  }, [pair, basePrice])

  const fmt = (n) => n > 100 ? n.toFixed(2) : n > 1 ? n.toFixed(4) : n.toFixed(6)

  return (
    <div style={{height:'100%',overflow:'hidden',fontFamily:'monospace',fontSize:'11px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'4px 8px',color:'#848e9c',borderBottom:'1px solid #1e2329',fontSize:'10px'}}>
        <span>Price(EUR)</span><span style={{textAlign:'right'}}>Amount</span><span style={{textAlign:'right'}}>Time</span>
      </div>
      {trades.map(t => (
        <div key={t.id} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'2px 8px',animation:t.isNew?'fadeIn .3s ease':'none'}}>
          <span style={{color:t.side==='buy'?'#0ecb81':'#f6465d'}}>{fmt(t.p)}</span>
          <span style={{textAlign:'right',color:'#c4cdd4'}}>{t.a.toFixed(4)}</span>
          <span style={{textAlign:'right',color:'#848e9c'}}>{t.t.toHours?.() || `${t.t.getHours().toString().padStart(2,'0')}:${t.t.getMinutes().toString().padStart(2,'0')}:${t.t.getSeconds().toString().padStart(2,'0')}`}</span>
        </div>
      ))}
    </div>
  )
}

// ─── ORDER FORM ───────────────────────────────────────────────────────────────
function OrderForm({ pair }) {
  const [side, setSide] = useState('buy')
  const [type, setType] = useState('limit')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [pct, setPct] = useState(0)
  const basePrice = PAIRS.find(p => p.sym === pair)?.price || 1000
  const base = pair.split('/')[0]

  useEffect(() => { setPrice(basePrice.toFixed(basePrice > 10 ? 2 : 4)) }, [pair, basePrice])

  const total = ((parseFloat(price)||0) * (parseFloat(amount)||0)).toFixed(2)
  const balance = side === 'buy' ? '5,000.00 EUR' : `0.1420 ${base}`

  return (
    <div style={{padding:'12px',height:'100%',display:'flex',flexDirection:'column',gap:'10px'}}>
      {/* Side tabs */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px'}}>
        <button onClick={() => setSide('buy')} style={{padding:'8px',borderRadius:'4px',border:'none',cursor:'pointer',fontWeight:600,fontSize:'13px',background:side==='buy'?'#0ecb81':'transparent',color:side==='buy'?'#0b0e11':'#848e9c',transition:'all .2s'}}>Buy</button>
        <button onClick={() => setSide('sell')} style={{padding:'8px',borderRadius:'4px',border:'none',cursor:'pointer',fontWeight:600,fontSize:'13px',background:side==='sell'?'#f6465d':'transparent',color:side==='sell'?'#fff':'#848e9c',transition:'all .2s'}}>Sell</button>
      </div>

      {/* Type tabs */}
      <div style={{display:'flex',gap:'12px',borderBottom:'1px solid #1e2329',paddingBottom:'8px'}}>
        {['limit','market','stop'].map(t => (
          <button key={t} onClick={() => setType(t)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'12px',color:type===t?'#f0b90b':'#848e9c',fontWeight:type===t?600:400,paddingBottom:'4px',borderBottom:type===t?'2px solid #f0b90b':'2px solid transparent',textTransform:'capitalize',transition:'all .2s'}}>{t}</button>
        ))}
      </div>

      {/* Balance */}
      <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'#848e9c'}}>
        <span>Available</span><span style={{color:'#c4cdd4'}}>{balance}</span>
      </div>

      {/* Price input */}
      {type !== 'market' && (
        <div style={{position:'relative'}}>
          <label style={{fontSize:'11px',color:'#848e9c',display:'block',marginBottom:'4px'}}>Price</label>
          <input value={price} onChange={e => setPrice(e.target.value)} style={{width:'100%',background:'#1e2329',border:'1px solid #2b3139',borderRadius:'4px',padding:'8px 48px 8px 10px',color:'#c4cdd4',fontSize:'12px',fontFamily:'monospace',outline:'none',boxSizing:'border-box'}} />
          <span style={{position:'absolute',right:'10px',top:'28px',color:'#848e9c',fontSize:'11px'}}>EUR</span>
        </div>
      )}

      {/* Amount input */}
      <div style={{position:'relative'}}>
        <label style={{fontSize:'11px',color:'#848e9c',display:'block',marginBottom:'4px'}}>Amount</label>
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00000000" style={{width:'100%',background:'#1e2329',border:'1px solid #2b3139',borderRadius:'4px',padding:'8px 48px 8px 10px',color:'#c4cdd4',fontSize:'12px',fontFamily:'monospace',outline:'none',boxSizing:'border-box'}} />
        <span style={{position:'absolute',right:'10px',top:'28px',color:'#848e9c',fontSize:'11px'}}>{base}</span>
      </div>

      {/* Percentage slider */}
      <div style={{display:'flex',gap:'4px'}}>
        {[25,50,75,100].map(p => (
          <button key={p} onClick={() => { setPct(p); setAmount((p/100 * 0.142).toFixed(6)) }} style={{flex:1,padding:'4px',background:pct===p?'rgba(240,185,11,0.15)':'#1e2329',border:`1px solid ${pct===p?'#f0b90b':'#2b3139'}`,borderRadius:'4px',color:pct===p?'#f0b90b':'#848e9c',fontSize:'10px',cursor:'pointer',transition:'all .2s'}}>{p}%</button>
        ))}
      </div>

      {/* Total */}
      <div style={{position:'relative'}}>
        <label style={{fontSize:'11px',color:'#848e9c',display:'block',marginBottom:'4px'}}>Total</label>
        <input value={total} readOnly style={{width:'100%',background:'#1e2329',border:'1px solid #2b3139',borderRadius:'4px',padding:'8px 48px 8px 10px',color:'#c4cdd4',fontSize:'12px',fontFamily:'monospace',outline:'none',boxSizing:'border-box'}} />
        <span style={{position:'absolute',right:'10px',top:'28px',color:'#848e9c',fontSize:'11px'}}>EUR</span>
      </div>

      {/* Submit */}
      <button onClick={() => alert(`${side.toUpperCase()} order placed!`)} style={{padding:'12px',borderRadius:'4px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'13px',background:side==='buy'?'#0ecb81':'#f6465d',color:side==='buy'?'#0b0e11':'#fff',marginTop:'auto',transition:'opacity .2s'}} onMouseOver={e=>e.target.style.opacity='.85'} onMouseOut={e=>e.target.style.opacity='1'}>
        {side === 'buy' ? `Buy ${base}` : `Sell ${base}`}
      </button>

      {/* Login prompt if not logged in */}
      <p style={{textAlign:'center',fontSize:'11px',color:'#848e9c',margin:0}}>
        <a href="#" style={{color:'#f0b90b',textDecoration:'none'}}>Log In</a> or <a href="#" style={{color:'#f0b90b',textDecoration:'none'}}>Register</a> to trade
      </p>
    </div>
  )
}

// ─── MARKETS OVERVIEW ─────────────────────────────────────────────────────────
function MarketsView({ onSelectPair }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('vol')
  const [sortDir, setSortDir] = useState(-1)
  const [tab, setTab] = useState('all')

  const filtered = PAIRS
    .filter(p => p.sym.toLowerCase().includes(search.toLowerCase()))
    .filter(p => tab === 'all' || (tab === 'gainers' && p.chg > 0) || (tab === 'losers' && p.chg < 0))
    .sort((a, b) => {
      const av = sort === 'price' ? a.price : sort === 'chg' ? a.chg : parseFloat(a.vol)
      const bv = sort === 'price' ? b.price : sort === 'chg' ? b.chg : parseFloat(b.vol)
      return (av - bv) * sortDir
    })

  const toggleSort = (col) => {
    if (sort === col) setSortDir(d => d * -1)
    else { setSort(col); setSortDir(-1) }
  }

  return (
    <div style={{background:'#0b0e11',minHeight:'100vh',color:'#c4cdd4',fontFamily:'monospace'}}>
      {/* Header */}
      <div style={{background:'#161a1e',borderBottom:'1px solid #1e2329',padding:'20px 24px'}}>
        <h1 style={{fontSize:'20px',fontWeight:700,color:'#fff',margin:'0 0 4px'}}>Markets Overview</h1>
        <p style={{color:'#848e9c',fontSize:'12px',margin:0}}>Live tokenized asset prices on Nextoken Capital</p>
      </div>

      <div style={{padding:'20px 24px'}}>
        {/* Stats bar */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'24px'}}>
          {[
            {l:'Total Market Cap',v:'€420B+',c:'#0ecb81'},
            {l:'24h Volume',v:'€8.2B',c:'#c4cdd4'},
            {l:'Active Pairs',v:'12',c:'#c4cdd4'},
            {l:'Avg Change 24h',v:'-1.2%',c:'#f6465d'},
          ].map(s => (
            <div key={s.l} style={{background:'#161a1e',border:'1px solid #1e2329',borderRadius:'8px',padding:'16px'}}>
              <div style={{fontSize:'11px',color:'#848e9c',marginBottom:'6px'}}>{s.l}</div>
              <div style={{fontSize:'18px',fontWeight:700,color:s.c}}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{display:'flex',gap:'0',marginBottom:'16px',borderBottom:'1px solid #1e2329'}}>
          {['all','gainers','losers'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{background:'none',border:'none',cursor:'pointer',padding:'10px 20px',color:tab===t?'#f0b90b':'#848e9c',borderBottom:tab===t?'2px solid #f0b90b':'2px solid transparent',textTransform:'capitalize',fontSize:'13px',fontWeight:tab===t?600:400,marginBottom:'-1px'}}>{t}</button>
          ))}
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center'}}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{background:'#1e2329',border:'1px solid #2b3139',borderRadius:'6px',padding:'6px 12px',color:'#c4cdd4',fontSize:'12px',outline:'none',fontFamily:'monospace'}} />
          </div>
        </div>

        {/* Table */}
        <div style={{background:'#161a1e',borderRadius:'8px',overflow:'hidden',border:'1px solid #1e2329'}}>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr',padding:'10px 16px',borderBottom:'1px solid #1e2329',fontSize:'11px',color:'#848e9c'}}>
            <span>Pair</span>
            <span style={{textAlign:'right',cursor:'pointer'}} onClick={() => toggleSort('price')}>Price {sort==='price'?sortDir===1?'↑':'↓':''}</span>
            <span style={{textAlign:'right',cursor:'pointer'}} onClick={() => toggleSort('chg')}>24h% {sort==='chg'?sortDir===1?'↑':'↓':''}</span>
            <span style={{textAlign:'right',cursor:'pointer'}} onClick={() => toggleSort('vol')}>Volume {sort==='vol'?sortDir===1?'↑':'↓':''}</span>
            <span style={{textAlign:'right'}}>Action</span>
          </div>
          {filtered.map(p => (
            <div key={p.sym} onClick={() => onSelectPair(p.sym)} style={{display:'grid',gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr',padding:'12px 16px',borderBottom:'1px solid #1e2329',cursor:'pointer',transition:'background .15s'}} onMouseOver={e=>e.currentTarget.style.background='#1e2329'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#f0b90b,#e67e00)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#0b0e11'}}>{p.sym.split('/')[0].slice(0,3)}</div>
                <div>
                  <div style={{color:'#fff',fontWeight:600,fontSize:'13px'}}>{p.sym.split('/')[0]}</div>
                  <div style={{color:'#848e9c',fontSize:'11px'}}>{p.sym}</div>
                </div>
              </div>
              <div style={{textAlign:'right',alignSelf:'center',color:'#fff',fontWeight:600}}>€{p.price.toLocaleString('en', {minimumFractionDigits:p.price>1?2:4})}</div>
              <div style={{textAlign:'right',alignSelf:'center',color:p.chg>=0?'#0ecb81':'#f6465d',fontWeight:600}}>{p.chg>=0?'+':''}{p.chg.toFixed(2)}%</div>
              <div style={{textAlign:'right',alignSelf:'center',color:'#848e9c',fontSize:'12px'}}>{p.vol}</div>
              <div style={{textAlign:'right',alignSelf:'center'}}>
                <button style={{background:'transparent',border:'1px solid #f0b90b',borderRadius:'4px',padding:'4px 12px',color:'#f0b90b',fontSize:'11px',cursor:'pointer',fontFamily:'monospace'}}>Trade</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN EXCHANGE PAGE ───────────────────────────────────────────────────────
export default function Exchange() {
  const [pair, setPair] = useState('BTC/EUR')
  const [tf, setTf] = useState('1h')
  const [view, setView] = useState('chart') // 'chart' | 'book' | 'trades'
  const [showMarkets, setShowMarkets] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const currentPair = PAIRS.find(p => p.sym === pair) || PAIRS[0]

  if (showMarkets) {
    return (
      <>
        <Head><title>Markets — Nextoken Capital</title></Head>
        <div style={{background:'#0b0e11',minHeight:'100vh'}}>
          <div style={{background:'#161a1e',borderBottom:'1px solid #1e2329',padding:'0 16px',display:'flex',alignItems:'center',gap:'16px',height:'48px'}}>
            <button onClick={() => setShowMarkets(false)} style={{background:'none',border:'none',color:'#f0b90b',cursor:'pointer',fontSize:'13px',fontFamily:'monospace'}}>← Exchange</button>
          </div>
          <MarketsView onSelectPair={s => { setPair(s); setShowMarkets(false) }} />
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{pair} — Nextoken Capital Exchange</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0b0e11; color: #c4cdd4; font-family: 'DM Sans', monospace; }
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: #0b0e11; }
          ::-webkit-scrollbar-thumb { background: #2b3139; border-radius: 2px; }
          input:focus { border-color: #f0b90b !important; }
          @keyframes fadeIn { from { opacity:0; background:rgba(240,185,11,0.05); } to { opacity:1; background:transparent; } }
          @media (max-width: 767px) {
            .desktop-only { display: none !important; }
          }
          @media (min-width: 768px) {
            .mobile-only { display: none !important; }
          }
        `}</style>
      </Head>

      <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:'#0b0e11'}}>

        {/* ── TOP BAR ── */}
        <div style={{background:'#161a1e',borderBottom:'1px solid #1e2329',padding:'0 12px',display:'flex',alignItems:'center',gap:'12px',height:'52px',flexShrink:0,overflowX:'auto'}}>

          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:'6px',flexShrink:0}}>
            <div style={{width:'24px',height:'24px',background:'#f0b90b',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#0b0e11'}}>N</div>
            <span style={{color:'#fff',fontWeight:700,fontSize:'13px',display:isMobile?'none':'block'}}>NXT</span>
          </div>

          <div style={{width:'1px',height:'24px',background:'#1e2329',flexShrink:0}} />

          {/* Pair selector */}
          <button onClick={() => setShowMarkets(true)} style={{display:'flex',alignItems:'center',gap:'8px',background:'none',border:'none',cursor:'pointer',flexShrink:0}}>
            <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'linear-gradient(135deg,#f0b90b,#e67e00)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:700,color:'#0b0e11'}}>{pair.split('/')[0].slice(0,3)}</div>
            <span style={{color:'#fff',fontWeight:700,fontSize:'15px'}}>{pair}</span>
            <span style={{color:'#848e9c',fontSize:'12px'}}>▼</span>
          </button>

          {/* Price */}
          <div style={{flexShrink:0}}>
            <div style={{color:currentPair.chg>=0?'#0ecb81':'#f6465d',fontWeight:700,fontSize:'16px',fontFamily:'monospace'}}>
              {currentPair.price.toLocaleString('en',{minimumFractionDigits:currentPair.price>1?2:4})}
            </div>
          </div>

          {/* Stats */}
          <div style={{display:'flex',gap:'20px',flexShrink:0}} className="desktop-only">
            {[
              {l:'24h Change',v:`${currentPair.chg>=0?'+':''}${currentPair.chg.toFixed(2)}%`,c:currentPair.chg>=0?'#0ecb81':'#f6465d'},
              {l:'24h High',v:currentPair.high.toLocaleString('en'),c:'#c4cdd4'},
              {l:'24h Low',v:currentPair.low.toLocaleString('en'),c:'#c4cdd4'},
              {l:'24h Volume',v:currentPair.vol,c:'#c4cdd4'},
            ].map(s => (
              <div key={s.l}>
                <div style={{fontSize:'10px',color:'#848e9c'}}>{s.l}</div>
                <div style={{fontSize:'12px',color:s.c,fontFamily:'monospace'}}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Markets button */}
          <button onClick={() => setShowMarkets(true)} style={{marginLeft:'auto',background:'#1e2329',border:'1px solid #2b3139',borderRadius:'4px',padding:'5px 12px',color:'#c4cdd4',fontSize:'11px',cursor:'pointer',flexShrink:0,fontFamily:'monospace'}}>Markets</button>
        </div>

        {/* ── MAIN CONTENT ── */}
        {isMobile ? (
          // ── MOBILE LAYOUT ──
          <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            {/* Mobile tab bar */}
            <div style={{display:'flex',background:'#161a1e',borderBottom:'1px solid #1e2329'}}>
              {['chart','book','trades','order'].map(v => (
                <button key={v} onClick={() => setView(v)} style={{flex:1,padding:'8px 4px',background:'none',border:'none',cursor:'pointer',color:view===v?'#f0b90b':'#848e9c',borderBottom:view===v?'2px solid #f0b90b':'2px solid transparent',fontSize:'11px',textTransform:'capitalize',fontFamily:'monospace'}}>
                  {v === 'order' ? 'Trade' : v}
                </button>
              ))}
            </div>

            {/* Timeframes - only show on chart */}
            {view === 'chart' && (
              <div style={{display:'flex',gap:'0',background:'#161a1e',borderBottom:'1px solid #1e2329',overflowX:'auto'}}>
                {TIMEFRAMES.map(t => (
                  <button key={t} onClick={() => setTf(t)} style={{padding:'6px 12px',background:'none',border:'none',cursor:'pointer',color:tf===t?'#f0b90b':'#848e9c',fontFamily:'monospace',fontSize:'11px',borderBottom:tf===t?'2px solid #f0b90b':'2px solid transparent',whiteSpace:'nowrap',fontWeight:tf===t?600:400}}>{t}</button>
                ))}
              </div>
            )}

            {/* Mobile content */}
            <div style={{flex:1,overflow:'hidden'}}>
              {view === 'chart' && <CandleChart pair={pair} tf={tf} />}
              {view === 'book' && <div style={{height:'100%',overflow:'auto'}}><OrderBook pair={pair} /></div>}
              {view === 'trades' && <div style={{height:'100%',overflow:'auto'}}><TradeFeed pair={pair} /></div>}
              {view === 'order' && <div style={{height:'100%',overflow:'auto'}}><OrderForm pair={pair} /></div>}
            </div>
          </div>
        ) : (
          // ── DESKTOP LAYOUT ──
          <div style={{flex:1,display:'grid',gridTemplateColumns:'200px 1fr 220px 220px',gridTemplateRows:'1fr',overflow:'hidden',gap:'1px',background:'#1e2329'}}>

            {/* Left: Pair list */}
            <div style={{background:'#161a1e',overflow:'auto',display:'flex',flexDirection:'column'}}>
              <div style={{padding:'8px',borderBottom:'1px solid #1e2329'}}>
                <input placeholder="Search..." style={{width:'100%',background:'#1e2329',border:'1px solid #2b3139',borderRadius:'4px',padding:'5px 8px',color:'#c4cdd4',fontSize:'11px',outline:'none',fontFamily:'monospace'}} />
              </div>
              <div style={{flex:1,overflow:'auto'}}>
                {PAIRS.map(p => (
                  <div key={p.sym} onClick={() => setPair(p.sym)} style={{padding:'8px 10px',cursor:'pointer',background:pair===p.sym?'#1e2329':'transparent',borderLeft:pair===p.sym?'2px solid #f0b90b':'2px solid transparent',transition:'all .15s'}} onMouseOver={e=>{ if(pair!==p.sym) e.currentTarget.style.background='rgba(255,255,255,0.03)' }} onMouseOut={e=>{ if(pair!==p.sym) e.currentTarget.style.background='transparent' }}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{color:'#fff',fontSize:'12px',fontWeight:600}}>{p.sym.split('/')[0]}</span>
                      <span style={{color:p.chg>=0?'#0ecb81':'#f6465d',fontSize:'10px',fontFamily:'monospace'}}>{p.chg>=0?'+':''}{p.chg.toFixed(2)}%</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:'2px'}}>
                      <span style={{color:'#848e9c',fontSize:'10px',fontFamily:'monospace'}}>{p.sym}</span>
                      <span style={{color:'#c4cdd4',fontSize:'10px',fontFamily:'monospace'}}>{p.price > 1 ? p.price.toFixed(2) : p.price.toFixed(4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center: Chart */}
            <div style={{background:'#0b0e11',display:'flex',flexDirection:'column',overflow:'hidden'}}>
              {/* Timeframe bar */}
              <div style={{display:'flex',alignItems:'center',gap:'0',background:'#161a1e',borderBottom:'1px solid #1e2329',flexShrink:0}}>
                {TIMEFRAMES.map(t => (
                  <button key={t} onClick={() => setTf(t)} style={{padding:'7px 14px',background:'none',border:'none',cursor:'pointer',color:tf===t?'#f0b90b':'#848e9c',fontFamily:'monospace',fontSize:'11px',borderBottom:tf===t?'2px solid #f0b90b':'2px solid transparent',fontWeight:tf===t?600:400,transition:'all .15s'}}>{t}</button>
                ))}
                <div style={{marginLeft:'auto',padding:'0 12px',fontSize:'11px',color:'#848e9c',fontFamily:'monospace'}}>
                  Nextoken Capital · MiCA Regulated
                </div>
              </div>
              {/* Chart canvas */}
              <div style={{flex:1,position:'relative'}}>
                <CandleChart pair={pair} tf={tf} />
              </div>

              {/* Open Orders tab */}
              <div style={{height:'120px',borderTop:'1px solid #1e2329',background:'#161a1e',flexShrink:0,overflow:'auto'}}>
                <div style={{padding:'6px 12px',borderBottom:'1px solid #1e2329',fontSize:'11px',color:'#848e9c',fontFamily:'monospace'}}>Open Orders (0)</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'80px',color:'#848e9c',fontSize:'12px'}}>No open orders</div>
              </div>
            </div>

            {/* Right: Order Book */}
            <div style={{background:'#161a1e',display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <div style={{padding:'6px 8px',borderBottom:'1px solid #1e2329',fontSize:'11px',color:'#848e9c',fontFamily:'monospace',display:'flex',gap:'12px'}}>
                <span style={{color:'#c4cdd4',borderBottom:'1px solid #f0b90b',paddingBottom:'2px'}}>Order Book</span>
                <span style={{cursor:'pointer'}} onClick={() => setView('trades')}>Trades</span>
              </div>
              <div style={{flex:1,overflow:'hidden'}}>
                <OrderBook pair={pair} />
              </div>
            </div>

            {/* Far Right: Order Form */}
            <div style={{background:'#161a1e',display:'flex',flexDirection:'column',overflow:'auto'}}>
              <OrderForm pair={pair} />
            </div>

          </div>
        )}
      </div>
    </>
  )
}