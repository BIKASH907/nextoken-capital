// pages/exchange.js
import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const PriceCtx = createContext({})

const BASE_PAIRS = [
  { sym:'BTC/EUR',   price:62054.31, chg:-3.66, vol:'1.24B', high:64900, low:61200 },
  { sym:'ETH/EUR',   price:1913.01,  chg:-5.24, vol:'580M',  high:2025,  low:1890  },
  { sym:'BNB/EUR',   price:568.90,   chg:-2.20, vol:'290M',  high:588,   low:562   },
  { sym:'SOL/EUR',   price:98.42,    chg:+1.12, vol:'420M',  high:102,   low:96.1  },
  { sym:'XRP/EUR',   price:0.4821,   chg:+0.87, vol:'1.8B',  high:0.495, low:0.471 },
  { sym:'ADA/EUR',   price:0.3312,   chg:-1.45, vol:'920M',  high:0.341, low:0.328 },
  { sym:'AVAX/EUR',  price:22.18,    chg:+2.30, vol:'310M',  high:22.9,  low:21.5  },
  { sym:'DOT/EUR',   price:5.74,     chg:-0.92, vol:'175M',  high:5.85,  low:5.68  },
  { sym:'MATIC/EUR', price:0.5123,   chg:+3.10, vol:'660M',  high:0.524, low:0.494 },
  { sym:'LINK/EUR',  price:11.42,    chg:+1.75, vol:'240M',  high:11.65, low:11.10 },
  { sym:'UNI/EUR',   price:8.34,     chg:-0.55, vol:'180M',  high:8.71,  low:8.20  },
  { sym:'ATOM/EUR',  price:6.91,     chg:+0.33, vol:'95M',   high:7.10,  low:6.78  },
]

const TFS = ['1m','5m','15m','1h','4h','1d','1w']
const r = (min,max) => Math.random()*(max-min)+min

function buildCandles(base, count, tf) {
  const ms = {'1m':60000,'5m':300000,'15m':900000,'1h':3600000,'4h':14400000,'1d':86400000,'1w':604800000}[tf]||60000
  const candles=[]; let p=base*r(0.88,1.1); const now=Date.now()
  for(let i=count;i>0;i--){
    const v=p*r(0.006,0.022),o=p,c=p+r(-v,v),h=Math.max(o,c)+r(0,v*0.4),l=Math.min(o,c)-r(0,v*0.4)
    candles.push({t:now-i*ms,o,h,l,c,v:r(50,3000)}); p=c
  }
  return candles
}

function Chart({ pair, tf }) {
  const { livePrice } = useContext(PriceCtx)
  const cvs = useRef(null)
  const candles = useRef([])
  const raf = useRef(null)
  const dirty = useRef(true)
  const hover = useRef(-1)
  const base = BASE_PAIRS.find(p=>p.sym===pair)?.price||1000

  useEffect(()=>{ candles.current=buildCandles(base,200,tf); dirty.current=true },[pair,tf,base])

  useEffect(()=>{
    if(!candles.current.length||!livePrice[pair]) return
    const last=candles.current[candles.current.length-1]
    last.c=livePrice[pair]; last.h=Math.max(last.h,last.c); last.l=Math.min(last.l,last.c)
    dirty.current=true
  },[livePrice,pair])

  const draw = useCallback(()=>{
    const el=cvs.current; if(!el||!dirty.current) return; dirty.current=false
    const ctx=el.getContext('2d'), dpr=window.devicePixelRatio||1
    const W=el.clientWidth, H=el.clientHeight
    el.width=W*dpr; el.height=H*dpr; ctx.scale(dpr,dpr)
    ctx.clearRect(0,0,W,H)
    const data=candles.current.slice(-100); if(!data.length) return
    const UP='#0ecb81',DN='#f6465d',GR='rgba(255,255,255,0.04)',TX='rgba(132,142,156,0.85)'
    const P={t:10,r:72,b:34,l:6}
    const cH=H*0.76, vH=H*0.15, cW=W-P.l-P.r
    const VIEW=data.length
    const prices=data.flatMap(c=>[c.h,c.l])
    const mn=Math.min(...prices),mx=Math.max(...prices),rng=mx-mn||1,pd=rng*0.05
    const yMin=mn-pd,yMax=mx+pd
    const toY=p=>P.t+cH-((p-yMin)/(yMax-yMin))*cH
    const toX=i=>P.l+(i+0.5)*(cW/VIEW)
    const bW=Math.max(2,(cW/VIEW)*0.72)
    ctx.strokeStyle=GR; ctx.lineWidth=1
    for(let i=0;i<=5;i++){
      const y=P.t+(cH/5)*i; ctx.beginPath();ctx.moveTo(P.l,y);ctx.lineTo(W-P.r,y);ctx.stroke()
      const pr=yMax-((yMax-yMin)/5)*i
      ctx.fillStyle=TX;ctx.font='10px monospace';ctx.textAlign='left'
      ctx.fillText(pr.toFixed(pr>100?2:pr>1?4:6),W-P.r+4,y+4)
    }
    const mxV=Math.max(...data.map(c=>c.v))
    data.forEach((c,i)=>{
      const x=toX(i),bh=(c.v/mxV)*vH
      ctx.fillStyle=c.c>=c.o?'rgba(14,203,129,0.22)':'rgba(246,70,93,0.22)'
      ctx.fillRect(x-bW/2,H-P.b-bh,bW,bh)
    })
    data.forEach((c,i)=>{
      const x=toX(i),up=c.c>=c.o,col=up?UP:DN
      if(i===hover.current){ctx.fillStyle='rgba(255,255,255,0.03)';ctx.fillRect(x-bW,P.t,bW*2,cH)}
      ctx.strokeStyle=col;ctx.lineWidth=1
      ctx.beginPath();ctx.moveTo(x,toY(c.h));ctx.lineTo(x,toY(c.l));ctx.stroke()
      const top=toY(Math.max(c.o,c.c)),ht=Math.max(1,Math.abs(toY(c.o)-toY(c.c)))
      ctx.fillStyle=col;ctx.fillRect(x-bW/2,top,bW,ht)
      if(!up){ctx.strokeStyle=col;ctx.strokeRect(x-bW/2,top,bW,ht)}
    })
    const last=data[data.length-1]
    if(last){
      const y=toY(last.c),up=last.c>=last.o,col=up?UP:DN
      ctx.save();ctx.setLineDash([3,3]);ctx.strokeStyle=col+'80';ctx.lineWidth=1
      ctx.beginPath();ctx.moveTo(P.l,y);ctx.lineTo(W-P.r,y);ctx.stroke();ctx.restore()
      ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(W-P.r+2,y-9,68,18,3);ctx.fill()
      ctx.fillStyle='#0b0e11';ctx.font='bold 10px monospace';ctx.textAlign='center'
      ctx.fillText(last.c.toFixed(last.c>100?2:last.c>1?4:6),W-P.r+35,y+4)
    }
    if(hover.current>=0&&hover.current<data.length){
      const c=data[hover.current],x=toX(hover.current)
      const dp=c.c>100?2:c.c>1?4:6
      const lines=[`O:${c.o.toFixed(dp)}`,`H:${c.h.toFixed(dp)}`,`L:${c.l.toFixed(dp)}`,`C:${c.c.toFixed(dp)}`,`V:${c.v.toFixed(0)}`]
      const TW=115,TH=lines.length*16+14; let tx=x+12
      if(tx+TW>W-P.r) tx=x-TW-12
      ctx.fillStyle='rgba(18,23,33,0.95)';ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1
      ctx.beginPath();ctx.roundRect(tx,P.t+6,TW,TH,5);ctx.fill();ctx.stroke()
      ctx.font='10px monospace';ctx.textAlign='left'
      lines.forEach((ln,j)=>{ctx.fillStyle='rgba(196,205,212,0.9)';ctx.fillText(ln,tx+8,P.t+20+j*16)})
      ctx.save();ctx.setLineDash([2,2]);ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1
      ctx.beginPath();ctx.moveTo(x,P.t);ctx.lineTo(x,H-P.b);ctx.stroke();ctx.restore()
    }
    ctx.fillStyle=TX;ctx.font='9px monospace';ctx.textAlign='center'
    const step=Math.max(1,Math.floor(VIEW/8))
    data.forEach((c,i)=>{
      if(i%step===0){
        const d=new Date(c.t)
        const lbl=(tf==='1d'||tf==='1w')?`${d.getMonth()+1}/${d.getDate()}`:`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
        ctx.fillText(lbl,toX(i),H-P.b+13)
      }
    })
  },[])

  useEffect(()=>{ const loop=()=>{draw();raf.current=requestAnimationFrame(loop)}; loop(); return()=>cancelAnimationFrame(raf.current) },[draw])

  const onMove=useCallback(e=>{
    const el=cvs.current; if(!el) return
    const rect=el.getBoundingClientRect()
    const mx=(e.touches?e.touches[0].clientX:e.clientX)-rect.left
    const VIEW=Math.min(candles.current.length,100)
    const cW=el.clientWidth-6-72
    hover.current=Math.max(0,Math.min(Math.floor((mx-6)/(cW/VIEW)),VIEW-1))
    dirty.current=true
  },[])

  return <canvas ref={cvs} style={{width:'100%',height:'100%',display:'block',cursor:'crosshair'}}
    onMouseMove={onMove} onMouseLeave={()=>{hover.current=-1;dirty.current=true}} onTouchMove={onMove}/>
}

function Book({ pair }) {
  const { livePrice } = useContext(PriceCtx)
  const [book, setBook] = useState({asks:[],bids:[],mid:0})
  useEffect(()=>{
    const gen=()=>{
      const mid=livePrice[pair]||BASE_PAIRS.find(p=>p.sym===pair)?.price||1000
      const asks=[],bids=[]
      let ap=mid+mid*0.0002,bp=mid-mid*0.0002
      for(let i=0;i<12;i++){
        asks.push({p:ap,a:r(0.01,3),t:r(50,5000)}); bids.push({p:bp,a:r(0.01,3),t:r(50,5000)})
        ap+=r(0.1,mid*0.0006); bp-=r(0.1,mid*0.0006)
      }
      const mxT=Math.max(...[...asks,...bids].map(x=>x.t))
      asks.forEach(x=>x.pct=(x.t/mxT)*100); bids.forEach(x=>x.pct=(x.t/mxT)*100)
      setBook({asks:asks.reverse(),bids,mid})
    }
    gen(); const iv=setInterval(gen,1000); return()=>clearInterval(iv)
  },[pair,livePrice])
  const fmt=n=>n>1000?n.toFixed(2):n>1?n.toFixed(4):n.toFixed(6)
  return(
    <div style={{height:'100%',display:'flex',flexDirection:'column',fontSize:'11px',fontFamily:'monospace'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'4px 8px',color:'#848e9c',borderBottom:'1px solid #1e2329',fontSize:'10px'}}>
        <span>Price(EUR)</span><span style={{textAlign:'right'}}>Amount</span><span style={{textAlign:'right'}}>Total</span>
      </div>
      <div style={{flex:1,overflow:'hidden'}}>
        {book.asks.map((row,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'2px 8px',position:'relative',cursor:'pointer'}} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
            <div style={{position:'absolute',right:0,top:0,bottom:0,background:'rgba(246,70,93,0.1)',width:`${row.pct}%`}}/>
            <span style={{color:'#f6465d',position:'relative'}}>{fmt(row.p)}</span>
            <span style={{textAlign:'right',color:'#c4cdd4',position:'relative'}}>{row.a.toFixed(4)}</span>
            <span style={{textAlign:'right',color:'#848e9c',position:'relative'}}>{row.t.toFixed(0)}</span>
          </div>
        ))}
        <div style={{padding:'5px 8px',borderTop:'1px solid #1e2329',borderBottom:'1px solid #1e2329',display:'flex',alignItems:'center',gap:'8px',background:'#0d1117'}}>
          <span style={{color:'#0ecb81',fontSize:'14px',fontWeight:700}}>{fmt(book.mid)}</span>
          <span style={{color:'#848e9c',fontSize:'10px'}}>≈ EUR {fmt(book.mid)}</span>
        </div>
        {book.bids.map((row,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'2px 8px',position:'relative',cursor:'pointer'}} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
            <div style={{position:'absolute',right:0,top:0,bottom:0,background:'rgba(14,203,129,0.1)',width:`${row.pct}%`}}/>
            <span style={{color:'#0ecb81',position:'relative'}}>{fmt(row.p)}</span>
            <span style={{textAlign:'right',color:'#c4cdd4',position:'relative'}}>{row.a.toFixed(4)}</span>
            <span style={{textAlign:'right',color:'#848e9c',position:'relative'}}>{row.t.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Feed({ pair }) {
  const { livePrice } = useContext(PriceCtx)
  const [trades, setTrades] = useState([])
  const base = livePrice[pair]||BASE_PAIRS.find(p=>p.sym===pair)?.price||1000
  useEffect(()=>{
    setTrades(Array.from({length:18},()=>({id:Math.random(),p:base*r(0.9998,1.0002),a:r(0.001,2),side:Math.random()>.5?'buy':'sell',t:new Date()})))
    const iv=setInterval(()=>setTrades(prev=>[{id:Math.random(),p:(livePrice[pair]||base)*r(0.9998,1.0002),a:r(0.001,2),side:Math.random()>.5?'buy':'sell',t:new Date()},...prev].slice(0,22)),r(400,1800))
    return()=>clearInterval(iv)
  },[pair])
  const fmt=n=>n>1000?n.toFixed(2):n>1?n.toFixed(4):n.toFixed(6)
  return(
    <div style={{height:'100%',overflow:'hidden',fontFamily:'monospace',fontSize:'11px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'4px 8px',color:'#848e9c',borderBottom:'1px solid #1e2329',fontSize:'10px'}}>
        <span>Price(EUR)</span><span style={{textAlign:'right'}}>Amount</span><span style={{textAlign:'right'}}>Time</span>
      </div>
      <div style={{overflow:'hidden',height:'calc(100% - 28px)'}}>
        {trades.map(t=>(
          <div key={t.id} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'2px 8px'}}>
            <span style={{color:t.side==='buy'?'#0ecb81':'#f6465d'}}>{fmt(t.p)}</span>
            <span style={{textAlign:'right',color:'#c4cdd4'}}>{t.a.toFixed(4)}</span>
            <span style={{textAlign:'right',color:'#848e9c'}}>{String(t.t.getHours()).padStart(2,'0')}:{String(t.t.getMinutes()).padStart(2,'0')}:{String(t.t.getSeconds()).padStart(2,'0')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Form({ pair }) {
  const { livePrice } = useContext(PriceCtx)
  const [side, setSide] = useState('buy')
  const [type, setType] = useState('limit')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [pct, setPct] = useState(null)
  const base = pair.split('/')[0]
  const lp = livePrice[pair]||BASE_PAIRS.find(p=>p.sym===pair)?.price||1000
  useEffect(()=>{ setPrice(lp.toFixed(lp>100?2:lp>1?4:6)) },[pair,lp])
  const total = ((parseFloat(price)||0)*(parseFloat(amount)||0)).toFixed(2)
  return(
    <div style={{padding:'12px',display:'flex',flexDirection:'column',gap:'10px',height:'100%'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3px',background:'#0b0e11',borderRadius:'6px',padding:'3px'}}>
        {['buy','sell'].map(s=>(
          <button key={s} onClick={()=>setSide(s)} style={{padding:'8px',borderRadius:'4px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'13px',transition:'all .2s',background:side===s?(s==='buy'?'#0ecb81':'#f6465d'):'transparent',color:side===s?(s==='buy'?'#0b0e11':'#fff'):'#848e9c',textTransform:'capitalize'}}>{s}</button>
        ))}
      </div>
      <div style={{display:'flex',borderBottom:'1px solid #1e2329'}}>
        {['limit','market','stop'].map(t=>(
          <button key={t} onClick={()=>setType(t)} style={{flex:1,background:'none',border:'none',cursor:'pointer',fontSize:'11px',color:type===t?'#f0b90b':'#848e9c',fontWeight:type===t?600:400,padding:'6px 4px',borderBottom:type===t?'2px solid #f0b90b':'2px solid transparent',textTransform:'capitalize',fontFamily:'monospace',transition:'all .15s'}}>{t}</button>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'#848e9c'}}>
        <span>Available</span><span style={{color:'#c4cdd4'}}>{side==='buy'?'5,000.00 EUR':`0.1420 ${base}`}</span>
      </div>
      {type!=='market'&&(
        <div>
          <label style={{fontSize:'10px',color:'#848e9c',display:'block',marginBottom:'4px'}}>Price (EUR)</label>
          <div style={{position:'relative'}}>
            <input value={price} onChange={e=>setPrice(e.target.value)} style={{width:'100%',background:'#1e2329',border:'1px solid #2b3139',borderRadius:'4px',padding:'8px 40px 8px 10px',color:'#e8e8e8',fontSize:'12px',fontFamily:'monospace',outline:'none',boxSizing:'border-box'}}/>
            <span style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',color:'#848e9c',fontSize:'11px'}}>EUR</span>
          </div>
        </div>
      )}
      <div>
        <label style={{fontSize:'10px',color:'#848e9c',display:'block',marginBottom:'4px'}}>Amount ({base})</label>
        <div style={{position:'relative'}}>
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00000000" style={{width:'100%',background:'#1e2329',border:'1px solid #2b3139',borderRadius:'4px',padding:'8px 40px 8px 10px',color:'#e8e8e8',fontSize:'12px',fontFamily:'monospace',outline:'none',boxSizing:'border-box'}}/>
          <span style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',color:'#848e9c',fontSize:'11px'}}>{base}</span>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'4px'}}>
        {[25,50,75,100].map(p=>(
          <button key={p} onClick={()=>{setPct(p);setAmount((p/100*0.142).toFixed(6))}} style={{padding:'4px',background:pct===p?'rgba(240,185,11,0.15)':'#1e2329',border:`1px solid ${pct===p?'#f0b90b':'#2b3139'}`,borderRadius:'4px',color:pct===p?'#f0b90b':'#848e9c',fontSize:'10px',cursor:'pointer',fontFamily:'monospace'}}>{p}%</button>
        ))}
      </div>
      <div>
        <label style={{fontSize:'10px',color:'#848e9c',display:'block',marginBottom:'4px'}}>Total (EUR)</label>
        <div style={{position:'relative'}}>
          <input value={total} readOnly style={{width:'100%',background:'#1e2329',border:'1px solid #2b3139',borderRadius:'4px',padding:'8px 40px 8px 10px',color:'#848e9c',fontSize:'12px',fontFamily:'monospace',outline:'none',boxSizing:'border-box'}}/>
          <span style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',color:'#848e9c',fontSize:'11px'}}>EUR</span>
        </div>
      </div>
      <button onClick={()=>alert(`${side.toUpperCase()} order: ${amount||'0'} ${base} @ ${price} EUR`)} style={{padding:'11px',borderRadius:'4px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'13px',background:side==='buy'?'#0ecb81':'#f6465d',color:side==='buy'?'#0b0e11':'#fff'}} onMouseOver={e=>e.target.style.opacity='.85'} onMouseOut={e=>e.target.style.opacity='1'}>
        {side==='buy'?`Buy ${base}`:`Sell ${base}`}
      </button>
      <p style={{textAlign:'center',fontSize:'11px',color:'#848e9c',margin:0}}>
        <Link href="/login" style={{color:'#f0b90b',textDecoration:'none'}}>Log In</Link> or <Link href="/register" style={{color:'#f0b90b',textDecoration:'none'}}>Register</Link>
      </p>
    </div>
  )
}

function Markets({ onSelect }) {
  const { livePrice } = useContext(PriceCtx)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')
  const [sort, setSort] = useState('vol')
  const [dir, setDir] = useState(-1)
  const rows = BASE_PAIRS
    .filter(p=>p.sym.toLowerCase().includes(search.toLowerCase()))
    .filter(p=>tab==='all'||(tab==='up'&&p.chg>0)||(tab==='down'&&p.chg<0))
    .sort((a,b)=>{ const av=sort==='price'?a.price:sort==='chg'?a.chg:parseFloat(a.vol); const bv=sort==='price'?b.price:sort==='chg'?b.chg:parseFloat(b.vol); return(av-bv)*dir })
  const tog=col=>{ if(sort===col)setDir(d=>d*-1); else{setSort(col);setDir(-1)} }
  return(
    <div style={{background:'#0b0e11',minHeight:'100%',color:'#c4cdd4'}}>
      <div style={{background:'#161a1e',borderBottom:'1px solid #1e2329',padding:'16px 20px'}}>
        <h2 style={{color:'#fff',fontWeight:700,fontSize:'18px',margin:'0 0 4px'}}>Markets Overview</h2>
        <p style={{color:'#848e9c',fontSize:'12px',margin:0,fontFamily:'monospace'}}>Live tokenized asset prices — MiCA regulated</p>
      </div>
      <div style={{padding:'16px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'20px'}}>
          {[{l:'Market Cap',v:'€420B+',c:'#0ecb81'},{l:'24h Volume',v:'€8.2B',c:'#c4cdd4'},{l:'Active Pairs',v:'12',c:'#c4cdd4'},{l:'Avg 24h',v:'-1.2%',c:'#f6465d'}].map(s=>(
            <div key={s.l} style={{background:'#161a1e',border:'1px solid #1e2329',borderRadius:'8px',padding:'14px'}}>
              <div style={{fontSize:'11px',color:'#848e9c',marginBottom:'4px',fontFamily:'monospace'}}>{s.l}</div>
              <div style={{fontSize:'17px',fontWeight:700,color:s.c,fontFamily:'monospace'}}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',borderBottom:'1px solid #1e2329'}}>
          {[['all','All'],['up','Gainers'],['down','Losers']].map(([v,l])=>(
            <button key={v} onClick={()=>setTab(v)} style={{background:'none',border:'none',cursor:'pointer',padding:'8px 16px',color:tab===v?'#f0b90b':'#848e9c',borderBottom:tab===v?'2px solid #f0b90b':'2px solid transparent',fontSize:'12px',fontFamily:'monospace',marginBottom:'-1px'}}>{l}</button>
          ))}
          <div style={{marginLeft:'auto',paddingBottom:'8px'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:'#1e2329',border:'1px solid #2b3139',borderRadius:'5px',padding:'5px 10px',color:'#c4cdd4',fontSize:'11px',outline:'none',fontFamily:'monospace'}}/>
          </div>
        </div>
        <div style={{background:'#161a1e',borderRadius:'8px',overflow:'hidden',border:'1px solid #1e2329'}}>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr',padding:'8px 16px',borderBottom:'1px solid #1e2329',fontSize:'10px',color:'#848e9c',fontFamily:'monospace'}}>
            <span>Pair</span>
            <span style={{textAlign:'right',cursor:'pointer'}} onClick={()=>tog('price')}>Price {sort==='price'?(dir===1?'↑':'↓'):''}</span>
            <span style={{textAlign:'right',cursor:'pointer'}} onClick={()=>tog('chg')}>24h% {sort==='chg'?(dir===1?'↑':'↓'):''}</span>
            <span style={{textAlign:'right',cursor:'pointer'}} onClick={()=>tog('vol')}>Volume {sort==='vol'?(dir===1?'↑':'↓'):''}</span>
            <span style={{textAlign:'right'}}>Action</span>
          </div>
          {rows.map(p=>(
            <div key={p.sym} onClick={()=>onSelect(p.sym)} style={{display:'grid',gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr',padding:'11px 16px',borderBottom:'1px solid #1e2329',cursor:'pointer',transition:'background .12s'}} onMouseOver={e=>e.currentTarget.style.background='#1e2329'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'linear-gradient(135deg,#f0b90b,#c8830a)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:700,color:'#0b0e11',flexShrink:0}}>{p.sym.split('/')[0].slice(0,3)}</div>
                <div><div style={{color:'#fff',fontWeight:600,fontSize:'13px'}}>{p.sym.split('/')[0]}</div><div style={{color:'#848e9c',fontSize:'10px',fontFamily:'monospace'}}>{p.sym}</div></div>
              </div>
              <div style={{textAlign:'right',alignSelf:'center',color:'#fff',fontWeight:600,fontFamily:'monospace',fontSize:'13px'}}>€{(livePrice[p.sym]||p.price).toLocaleString('en',{minimumFractionDigits:p.price>1?2:4})}</div>
              <div style={{textAlign:'right',alignSelf:'center',color:p.chg>=0?'#0ecb81':'#f6465d',fontWeight:600,fontFamily:'monospace',fontSize:'12px'}}>{p.chg>=0?'+':''}{p.chg.toFixed(2)}%</div>
              <div style={{textAlign:'right',alignSelf:'center',color:'#848e9c',fontSize:'12px',fontFamily:'monospace'}}>{p.vol}</div>
              <div style={{textAlign:'right',alignSelf:'center'}}><button style={{background:'transparent',border:'1px solid #f0b90b',borderRadius:'4px',padding:'4px 10px',color:'#f0b90b',fontSize:'11px',cursor:'pointer',fontFamily:'monospace'}}>Trade</button></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Ticker({ livePrice, onSelect }) {
  return(
    <div style={{background:'#161a1e',borderBottom:'1px solid #1e2329',display:'flex',overflowX:'auto',scrollbarWidth:'none',flexShrink:0}}>
      {BASE_PAIRS.slice(0,8).map(p=>{
        const pr=livePrice[p.sym]||p.price
        return(
          <button key={p.sym} onClick={()=>onSelect(p.sym)} style={{padding:'6px 16px',background:'none',border:'none',cursor:'pointer',flexShrink:0,textAlign:'left',borderRight:'1px solid #1e2329'}}>
            <div style={{fontSize:'11px',color:'#fff',fontWeight:600,fontFamily:'monospace'}}>{p.sym}</div>
            <div style={{display:'flex',gap:'6px',alignItems:'center',marginTop:'1px'}}>
              <span style={{fontSize:'11px',color:p.chg>=0?'#0ecb81':'#f6465d',fontFamily:'monospace'}}>{pr.toLocaleString('en',{minimumFractionDigits:pr>1?2:4})}</span>
              <span style={{fontSize:'10px',color:p.chg>=0?'#0ecb81':'#f6465d',fontFamily:'monospace'}}>{p.chg>=0?'+':''}{p.chg.toFixed(2)}%</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default function Exchange() {
  const [pair, setPair] = useState('BTC/EUR')
  const [tf, setTf] = useState('1h')
  const [rightTab, setRightTab] = useState('book')
  const [page, setPage] = useState('exchange')
  const [mobileTab, setMobileTab] = useState('chart')
  const [livePrice, setLivePrice] = useState(()=>Object.fromEntries(BASE_PAIRS.map(p=>[p.sym,p.price])))
  const [isMobile, setIsMobile] = useState(false)

  useEffect(()=>{
    const iv=setInterval(()=>{
      setLivePrice(prev=>{
        const next={...prev}
        BASE_PAIRS.forEach(p=>{ const v=next[p.sym]*0.0005; next[p.sym]=Math.max(0.0001,next[p.sym]+r(-v,v)) })
        return next
      })
    },600)
    return()=>clearInterval(iv)
  },[])

  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<900)
    check(); window.addEventListener('resize',check); return()=>window.removeEventListener('resize',check)
  },[])

  const cp=BASE_PAIRS.find(p=>p.sym===pair)||BASE_PAIRS[0]
  const lp=livePrice[pair]||cp.price
  const handleSelect=(sym)=>{ setPair(sym); setPage('exchange') }

  return(
    <PriceCtx.Provider value={{livePrice}}>
      <Head>
        <title>{pair} {lp.toFixed(lp>100?2:4)} — Nextoken Capital Exchange</title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{background:#0b0e11;color:#c4cdd4;font-family:'DM Sans',sans-serif}
          ::-webkit-scrollbar{width:4px;height:4px}
          ::-webkit-scrollbar-track{background:#0b0e11}
          ::-webkit-scrollbar-thumb{background:#2b3139;border-radius:2px}
          input:focus{border-color:#f0b90b!important;outline:none}
          .exch-wrap{position:fixed;top:64px;left:0;right:0;bottom:0;display:flex;flex-direction:column;overflow:hidden}
        `}</style>
      </Head>

      <div className="exch-wrap">
        <Ticker livePrice={livePrice} onSelect={handleSelect}/>
        <div style={{background:'#161a1e',borderBottom:'1px solid #1e2329',padding:'8px 12px',display:'flex',alignItems:'center',gap:'12px',flexShrink:0,overflowX:'auto'}}>
          <button onClick={()=>setPage(p=>p==='markets'?'exchange':'markets')} style={{display:'flex',alignItems:'center',gap:'8px',background:'none',border:'none',cursor:'pointer',flexShrink:0}}>
            <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'linear-gradient(135deg,#f0b90b,#c8830a)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:700,color:'#0b0e11'}}>{pair.split('/')[0].slice(0,3)}</div>
            <span style={{color:'#fff',fontWeight:700,fontSize:'15px',fontFamily:'monospace'}}>{pair}</span>
            <span style={{color:'#848e9c',fontSize:'11px'}}>▾</span>
          </button>
          <div style={{flexShrink:0}}>
            <div style={{color:cp.chg>=0?'#0ecb81':'#f6465d',fontWeight:700,fontSize:'17px',fontFamily:'monospace'}}>{lp.toLocaleString('en',{minimumFractionDigits:lp>100?2:4})}</div>
            <div style={{color:'#848e9c',fontSize:'10px',fontFamily:'monospace'}}>EUR {lp.toLocaleString('en',{minimumFractionDigits:lp>100?2:4})}</div>
          </div>
          <div style={{display:'flex',gap:'20px',flexShrink:0,overflowX:'auto'}}>
            {[{l:'24h Change',v:`${cp.chg>=0?'+':''}${cp.chg.toFixed(2)}%`,c:cp.chg>=0?'#0ecb81':'#f6465d'},{l:'24h High',v:cp.high.toLocaleString(),c:'#c4cdd4'},{l:'24h Low',v:cp.low.toLocaleString(),c:'#c4cdd4'},{l:'Volume',v:cp.vol,c:'#c4cdd4'}].map(s=>(
              <div key={s.l} style={{flexShrink:0}}>
                <div style={{fontSize:'10px',color:'#848e9c',fontFamily:'monospace'}}>{s.l}</div>
                <div style={{fontSize:'12px',color:s.c,fontFamily:'monospace'}}>{s.v}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setPage(p=>p==='markets'?'exchange':'markets')} style={{marginLeft:'auto',background:'#1e2329',border:'1px solid #2b3139',borderRadius:'4px',padding:'5px 12px',color:'#c4cdd4',fontSize:'11px',cursor:'pointer',flexShrink:0,fontFamily:'monospace'}}>
            {page==='markets'?'← Exchange':'Markets ▾'}
          </button>
        </div>

        {page==='markets' ? (
          <div style={{flex:1,overflow:'auto'}}><Markets onSelect={handleSelect}/></div>
        ) : isMobile ? (
          <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div style={{display:'flex',background:'#161a1e',borderBottom:'1px solid #1e2329',flexShrink:0}}>
              {[['chart','Chart'],['book','Book'],['trades','Trades'],['order','Trade']].map(([v,l])=>(
                <button key={v} onClick={()=>setMobileTab(v)} style={{flex:1,padding:'8px 4px',background:'none',border:'none',cursor:'pointer',color:mobileTab===v?'#f0b90b':'#848e9c',borderBottom:mobileTab===v?'2px solid #f0b90b':'2px solid transparent',fontSize:'11px',fontFamily:'monospace',fontWeight:mobileTab===v?600:400}}>{l}</button>
              ))}
            </div>
            {mobileTab==='chart'&&(
              <div style={{display:'flex',background:'#161a1e',borderBottom:'1px solid #1e2329',overflowX:'auto',flexShrink:0}}>
                {TFS.map(t=>(<button key={t} onClick={()=>setTf(t)} style={{padding:'5px 12px',background:'none',border:'none',cursor:'pointer',color:tf===t?'#f0b90b':'#848e9c',fontFamily:'monospace',fontSize:'11px',borderBottom:tf===t?'2px solid #f0b90b':'2px solid transparent',whiteSpace:'nowrap',fontWeight:tf===t?600:400,flexShrink:0}}>{t}</button>))}
              </div>
            )}
            <div style={{flex:1,overflow:'hidden'}}>
              {mobileTab==='chart'&&<Chart pair={pair} tf={tf}/>}
              {mobileTab==='book'&&<div style={{height:'100%',overflow:'auto'}}><Book pair={pair}/></div>}
              {mobileTab==='trades'&&<div style={{height:'100%',overflow:'auto'}}><Feed pair={pair}/></div>}
              {mobileTab==='order'&&<div style={{height:'100%',overflow:'auto'}}><Form pair={pair}/></div>}
            </div>
          </div>
        ) : (
          <div style={{flex:1,display:'grid',gridTemplateColumns:'190px 1fr 210px 210px',gap:'1px',background:'#1e2329',overflow:'hidden'}}>
            <div style={{background:'#161a1e',display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <div style={{padding:'8px',borderBottom:'1px solid #1e2329',flexShrink:0}}>
                <input placeholder="Search..." style={{width:'100%',background:'#1e2329',border:'1px solid #2b3139',borderRadius:'4px',padding:'5px 8px',color:'#c4cdd4',fontSize:'11px',fontFamily:'monospace'}}/>
              </div>
              <div style={{flex:1,overflow:'auto'}}>
                {BASE_PAIRS.map(p=>{
                  const pr=livePrice[p.sym]||p.price
                  return(
                    <div key={p.sym} onClick={()=>setPair(p.sym)} style={{padding:'7px 10px',cursor:'pointer',background:pair===p.sym?'#1e2329':'transparent',borderLeft:pair===p.sym?'2px solid #f0b90b':'2px solid transparent',transition:'all .12s'}} onMouseOver={e=>{if(pair!==p.sym)e.currentTarget.style.background='rgba(255,255,255,0.03)'}} onMouseOut={e=>{if(pair!==p.sym)e.currentTarget.style.background='transparent'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{color:'#fff',fontSize:'12px',fontWeight:600,fontFamily:'monospace'}}>{p.sym.split('/')[0]}</span>
                        <span style={{color:p.chg>=0?'#0ecb81':'#f6465d',fontSize:'10px',fontFamily:'monospace'}}>{p.chg>=0?'+':''}{p.chg.toFixed(2)}%</span>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',marginTop:'1px'}}>
                        <span style={{color:'#848e9c',fontSize:'10px',fontFamily:'monospace'}}>{p.sym}</span>
                        <span style={{color:'#c4cdd4',fontSize:'10px',fontFamily:'monospace'}}>{pr.toFixed(pr>100?2:pr>1?4:6)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{background:'#0b0e11',display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <div style={{display:'flex',alignItems:'center',background:'#161a1e',borderBottom:'1px solid #1e2329',flexShrink:0,overflowX:'auto'}}>
                {TFS.map(t=>(<button key={t} onClick={()=>setTf(t)} style={{padding:'6px 13px',background:'none',border:'none',cursor:'pointer',color:tf===t?'#f0b90b':'#848e9c',fontFamily:'monospace',fontSize:'11px',borderBottom:tf===t?'2px solid #f0b90b':'2px solid transparent',fontWeight:tf===t?600:400,whiteSpace:'nowrap'}}>{t}</button>))}
                <span style={{marginLeft:'auto',padding:'0 12px',fontSize:'10px',color:'#2b3139',fontFamily:'monospace',flexShrink:0}}>NXT · MiCA Regulated</span>
              </div>
              <div style={{flex:1,position:'relative',overflow:'hidden'}}><Chart pair={pair} tf={tf}/></div>
              <div style={{height:'100px',borderTop:'1px solid #1e2329',background:'#161a1e',flexShrink:0}}>
                <div style={{padding:'5px 12px',borderBottom:'1px solid #1e2329',fontSize:'11px',color:'#848e9c',fontFamily:'monospace'}}>Open Orders (0)</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'68px',color:'#848e9c',fontSize:'12px',fontFamily:'monospace'}}>No open orders</div>
              </div>
            </div>
            <div style={{background:'#161a1e',display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <div style={{display:'flex',borderBottom:'1px solid #1e2329',flexShrink:0}}>
                {[['book','Order Book'],['trades','Trades']].map(([v,l])=>(<button key={v} onClick={()=>setRightTab(v)} style={{flex:1,padding:'7px 6px',background:'none',border:'none',cursor:'pointer',color:rightTab===v?'#f0b90b':'#848e9c',borderBottom:rightTab===v?'2px solid #f0b90b':'2px solid transparent',fontSize:'11px',fontFamily:'monospace',fontWeight:rightTab===v?600:400}}>{l}</button>))}
              </div>
              <div style={{flex:1,overflow:'hidden'}}>{rightTab==='book'?<Book pair={pair}/>:<Feed pair={pair}/>}</div>
            </div>
            <div style={{background:'#161a1e',overflow:'auto'}}><Form pair={pair}/></div>
          </div>
        )}
      </div>
    </PriceCtx.Provider>
  )
}