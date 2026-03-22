const fs = require("fs");

let code = fs.readFileSync("app/bonds/page.tsx", "utf8");

// Add React import at the top
code = code.replace(
  `"use client";
import { useState } from "react";`,
  `"use client";
import React, { useState } from "react";`
);

// Replace React.createElement TypeTag with JSX
code = code.replace(
  `function TypeTag({ type }) {
  const c = typeColor[type] || typeColor.Corporate;
  return React.createElement("span", { style:{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:c.bg, color:c.color, border:"1px solid "+c.border } }, type);
}`,
  `function TypeTag({ type }: { type: string }) {
  const c = typeColor[type] || typeColor.Corporate;
  return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:c.bg, color:c.color, border:"1px solid "+c.border }}>{type}</span>;
}`
);

// Replace React.createElement StatusTag with JSX
code = code.replace(
  `function StatusTag({ status }) {
  const c = statusStyle[status] || statusStyle.Live;
  return React.createElement("span", { style:{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:c.bg, color:c.color, border:"1px solid "+c.border } }, status);
}`,
  `function StatusTag({ status }: { status: string }) {
  const c = statusStyle[status] || statusStyle.Live;
  return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:c.bg, color:c.color, border:"1px solid "+c.border }}>{status}</span>;
}`
);

// Replace React.createElement FaqItem with JSX
code = code.replace(
  `function FaqItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    React.createElement("div", { style:{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, overflow:"hidden", marginBottom:8 } },
      React.createElement("button", { onClick:()=>setOpen(!open), style:{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px", background:"#0d0d14", border:"none", color:"#e8e8f0", fontSize:14.5, fontWeight:500, cursor:"pointer", textAlign:"left", fontFamily:"inherit" } },
        React.createElement("span", null, q),
        React.createElement("span", { style:{ color:"#d4af37", fontSize:20, flexShrink:0, marginLeft:16 } }, open?"−":"+")
      ),
      open && React.createElement("div", { style:{ padding:"0 20px 18px", background:"#0d0d14" } },
        React.createElement("p", { style:{ fontSize:13.5, color:"#b0b0c8", lineHeight:1.7, margin:0 } }, a)
      )
    )
  );
}`,
  `function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, overflow:"hidden", marginBottom:8 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px", background:"#0d0d14", border:"none", color:"#e8e8f0", fontSize:14.5, fontWeight:500, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
        <span>{q}</span>
        <span style={{ color:"#d4af37", fontSize:20, flexShrink:0, marginLeft:16 }}>{open?"−":"+"}</span>
      </button>
      {open && <div style={{ padding:"0 20px 18px", background:"#0d0d14" }}><p style={{ fontSize:13.5, color:"#b0b0c8", lineHeight:1.7, margin:0 }}>{a}</p></div>}
    </div>
  );
}`
);

// Replace React.createElement BondCard with JSX
code = code.replace(
  `function BondCard({ bond }) {
  const [hov, setHov] = React.useState(false);
  const tc = typeColor[bond.type] || typeColor.Corporate;
  const sc = statusStyle[bond.status] || statusStyle.Live;
  return (
    React.createElement("div", {
      onMouseEnter:()=>setHov(true), onMouseLeave:()=>setHov(false),
      style:{ background:"#0d0d14", borderRadius:16, padding:24, transition:"all 0.2s", position:"relative", overflow:"hidden", border:"1px solid "+(hov?"rgba(212,175,55,0.35)":"rgba(255,255,255,0.08)"), transform:hov?"translateY(-2px)":"none" }
    },
      hov && React.createElement("div", { style:{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#d4af37,#f0d060)" } }),
      bond.featured && React.createElement("div", { style:{ position:"absolute", top:14, right:14 } },
        React.createElement("span", { style:{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"rgba(212,175,55,0.15)", color:"#d4af37", border:"1px solid rgba(212,175,55,0.3)" } }, "Featured")
      ),
      React.createElement("div", { style:{ fontSize:32, marginBottom:12 } }, bond.emoji),
      React.createElement("div", { style:{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 } },
        React.createElement("span", { style:{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:sc.bg, color:sc.color, border:"1px solid "+sc.border } }, bond.status),
        React.createElement("span", { style:{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:tc.bg, color:tc.color, border:"1px solid "+tc.border } }, bond.type)
      ),
      React.createElement("div", { style:{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#e8e8f0", marginBottom:3 } }, bond.name),
      React.createElement("div", { style:{ fontFamily:"monospace", fontSize:11, color:"#7a7a96", marginBottom:4 } }, bond.ticker),
      React.createElement("div", { style:{ fontSize:12.5, color:"#7a7a96", marginBottom:16 } }, "🏢 "+bond.issuer),
      React.createElement("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, padding:14, background:"rgba(255,255,255,0.025)", borderRadius:10, marginBottom:16 } },
        [["Yield",bond.yield_],["Price","EUR "+bond.price],["Term",bond.term]].map(([l,v]) =>
          React.createElement("div", { key:l },
            React.createElement("div", { style:{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#d4af37" } }, v),
            React.createElement("div", { style:{ fontSize:10.5, color:"#7a7a96", marginTop:2 } }, l)
          )
        )
      ),
      React.createElement("div", { style:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 } },
        React.createElement("div", { style:{ display:"flex", gap:8, alignItems:"center" } },
          React.createElement("span", { style:{ fontSize:11, color:"#7a7a96" } }, "Rating"),
          React.createElement("span", { style:{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:ratingColor(bond.rating) } }, bond.rating)
        ),
        React.createElement("span", { style:{ fontSize:12, color:"#7a7a96" } }, "Min: EUR "+bond.min)
      ),
      React.createElement("div", { style:{ marginBottom:16 } },
        React.createElement("div", { style:{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#7a7a96", marginBottom:6 } },
          React.createElement("span", null, "Funding ", React.createElement("strong", { style:{ color:"#e8e8f0" } }, bond.progress+"%")),
          React.createElement("span", null, "EUR "+bond.raised+" / EUR "+bond.target)
        ),
        React.createElement("div", { style:{ height:5, background:"rgba(255,255,255,0.07)", borderRadius:4, overflow:"hidden" } },
          React.createElement("div", { style:{ width:bond.progress+"%", height:"100%", background:"linear-gradient(90deg,#d4af37,#f0d060)", borderRadius:4 } })
        )
      ),
      React.createElement("button", {
        onMouseEnter:(e)=>{ e.currentTarget.style.background="#d4af37"; e.currentTarget.style.color="#000"; },
        onMouseLeave:(e)=>{ e.currentTarget.style.background="rgba(212,175,55,0.08)"; e.currentTarget.style.color="#d4af37"; },
        style:{ width:"100%", padding:"11px 0", borderRadius:10, border:"1px solid rgba(212,175,55,0.3)", background:"rgba(212,175,55,0.08)", color:"#d4af37", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }
      }, "Invest in This Bond")
    )
  );
}`,
  `function BondCard({ bond }: { bond: typeof bonds[0] }) {
  const [hov, setHov] = useState(false);
  const tc = typeColor[bond.type] || typeColor.Corporate;
  const sc = statusStyle[bond.status] || statusStyle.Live;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:"#0d0d14", borderRadius:16, padding:24, transition:"all 0.2s", position:"relative" as const, overflow:"hidden", border:"1px solid "+(hov?"rgba(212,175,55,0.35)":"rgba(255,255,255,0.08)"), transform:hov?"translateY(-2px)":"none" }}>
      {hov && <div style={{ position:"absolute" as const, top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#d4af37,#f0d060)" }} />}
      {bond.featured && <div style={{ position:"absolute" as const, top:14, right:14 }}><span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:"rgba(212,175,55,0.15)", color:"#d4af37", border:"1px solid rgba(212,175,55,0.3)" }}>Featured</span></div>}
      <div style={{ fontSize:32, marginBottom:12 }}>{bond.emoji}</div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:sc.bg, color:sc.color, border:"1px solid "+sc.border }}>{bond.status}</span>
        <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:tc.bg, color:tc.color, border:"1px solid "+tc.border }}>{bond.type}</span>
      </div>
      <div style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#e8e8f0", marginBottom:3 }}>{bond.name}</div>
      <div style={{ fontFamily:"monospace", fontSize:11, color:"#7a7a96", marginBottom:4 }}>{bond.ticker}</div>
      <div style={{ fontSize:12.5, color:"#7a7a96", marginBottom:16 }}>🏢 {bond.issuer}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, padding:14, background:"rgba(255,255,255,0.025)", borderRadius:10, marginBottom:16 }}>
        {([["Yield",bond.yield_],["Price","EUR "+bond.price],["Term",bond.term]] as [string,string][]).map(([l,v]) => (
          <div key={l}>
            <div style={{ fontFamily:"Syne,sans-serif", fontSize:17, fontWeight:700, color:"#d4af37" }}>{v}</div>
            <div style={{ fontSize:10.5, color:"#7a7a96", marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#7a7a96" }}>Rating</span>
          <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:ratingColor(bond.rating) }}>{bond.rating}</span>
        </div>
        <span style={{ fontSize:12, color:"#7a7a96" }}>Min: EUR {bond.min}</span>
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#7a7a96", marginBottom:6 }}>
          <span>Funding <strong style={{ color:"#e8e8f0" }}>{bond.progress}%</strong></span>
          <span>EUR {bond.raised} / EUR {bond.target}</span>
        </div>
        <div style={{ height:5, background:"rgba(255,255,255,0.07)", borderRadius:4, overflow:"hidden" }}>
          <div style={{ width:bond.progress+"%", height:"100%", background:"linear-gradient(90deg,#d4af37,#f0d060)", borderRadius:4 }} />
        </div>
      </div>
      <button
        onMouseEnter={(e) => { e.currentTarget.style.background="#d4af37"; e.currentTarget.style.color="#000"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background="rgba(212,175,55,0.08)"; e.currentTarget.style.color="#d4af37"; }}
        style={{ width:"100%", padding:"11px 0", borderRadius:10, border:"1px solid rgba(212,175,55,0.3)", background:"rgba(212,175,55,0.08)", color:"#d4af37", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
        Invest in This Bond
      </button>
    </div>
  );
}`
);

fs.writeFileSync("app/bonds/page.tsx", code, "utf8");
console.log("✅ app/bonds/page.tsx fixed — JSX replaces React.createElement");