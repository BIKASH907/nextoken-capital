const fs = require("fs");

let code = fs.readFileSync("pages/about.js", "utf8");

// Replace the TeamCard function entirely
const oldCard = `function TeamCard({ member }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...S.card, border:"1px solid "+(hov?"rgba(240,185,11,0.3)":"rgba(255,255,255,0.07)"), transform:hov?"translateY(-3px)":"none" }}>
      {/* Avatar */}
      <div style={{ width:72, height:72, borderRadius:18, overflow:"hidden", border:"2px solid "+member.color+"44", marginBottom:18, background:member.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {member.photo ? (
          <img src={member.photo} alt={member.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        ) : (
          <span style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:member.color }}>{member.initials}</span>
        )}
      </div>
      <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:18, fontWeight:800, color:"#e8e8f0", margin:"0 0 4px" }}>{member.name}</h3>
      <p style={{ fontSize:13, fontWeight:700, color:member.color, margin:"0 0 6px" }}>{member.role}</p>
      <p style={{ fontSize:12.5, color:"#8a9bb8", margin:"0 0 14px" }}>📍 {member.location}</p>
      <p style={{ fontSize:13, color:"#8a9bb8", lineHeight:1.7, margin:"0 0 16px" }}>{member.bio}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
        {member.tags.map(t => (
          <span key={t} style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:"rgba(255,255,255,0.05)", color:"#8a9bb8", border:"1px solid rgba(255,255,255,0.08)" }}>{t}</span>
        ))}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <a href={member.linkedin} style={{ padding:"6px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#8a9bb8", fontSize:12, textDecoration:"none", fontWeight:600 }}>LinkedIn</a>
        <a href={member.twitter}  style={{ padding:"6px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#8a9bb8", fontSize:12, textDecoration:"none", fontWeight:600 }}>Twitter</a>
      </div>
    </div>
  );
}`;

const newCard = `function TeamCard({ member }) {
  const [hov, setHov] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:"#0d0d14", border:"1px solid "+(hov?"rgba(240,185,11,0.35)":"rgba(255,255,255,0.07)"), borderRadius:18, overflow:"hidden", transition:"all 0.25s", transform:hov?"translateY(-4px)":"none", boxShadow:hov?"0 20px 60px rgba(0,0,0,0.4)":"none" }}>

      {/* Photo / Gradient Header */}
      <div style={{ position:"relative", height:200, background:member.photo && !imgErr ? "#111" : "linear-gradient(135deg,"+member.bg+" 0%,rgba(5,5,8,0.8) 100%)", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {member.photo && !imgErr ? (
          <img src={member.photo} alt={member.name}
            onError={() => setImgErr(true)}
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }} />
        ) : (
          <span style={{ fontFamily:"Syne,sans-serif", fontSize:64, fontWeight:900, color:member.color, opacity:0.6 }}>{member.initials}</span>
        )}
        {/* Bottom fade */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, background:"linear-gradient(transparent,#0d0d14)" }} />
        {/* Role badge */}
        <div style={{ position:"absolute", top:14, right:14, padding:"4px 12px", borderRadius:20, background:"rgba(5,5,8,0.75)", border:"1px solid "+member.color+"55", backdropFilter:"blur(8px)" }}>
          <span style={{ fontSize:11, fontWeight:700, color:member.color }}>{member.role}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:"20px 22px 22px" }}>
        <h3 style={{ fontFamily:"Syne,sans-serif", fontSize:19, fontWeight:800, color:"#e8e8f0", margin:"0 0 4px" }}>{member.name}</h3>
        <p style={{ fontSize:12.5, color:"#8a9bb8", margin:"0 0 14px" }}>📍 {member.location}</p>
        <p style={{ fontSize:13.5, color:"#8a9bb8", lineHeight:1.7, margin:"0 0 16px" }}>{member.bio}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
          {member.tags.map(t => (
            <span key={t} style={{ padding:"4px 11px", borderRadius:20, fontSize:11, fontWeight:600, background:"rgba(255,255,255,0.05)", color:"#8a9bb8", border:"1px solid rgba(255,255,255,0.08)" }}>{t}</span>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <a href={member.linkedin}
            onMouseEnter={e => { e.currentTarget.style.background=member.color; e.currentTarget.style.color="#000"; e.currentTarget.style.borderColor=member.color; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#8a9bb8"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}
            style={{ flex:1, textAlign:"center", padding:"9px 0", borderRadius:9, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#8a9bb8", fontSize:12.5, textDecoration:"none", fontWeight:600, transition:"all 0.15s" }}>LinkedIn</a>
          <a href={member.twitter}
            onMouseEnter={e => { e.currentTarget.style.background=member.color; e.currentTarget.style.color="#000"; e.currentTarget.style.borderColor=member.color; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#8a9bb8"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}
            style={{ flex:1, textAlign:"center", padding:"9px 0", borderRadius:9, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#8a9bb8", fontSize:12.5, textDecoration:"none", fontWeight:600, transition:"all 0.15s" }}>Twitter</a>
        </div>
      </div>
    </div>
  );
}`;

if (code.includes("function TeamCard")) {
  code = code.replace(oldCard, newCard);
  fs.writeFileSync("pages/about.js", code, "utf8");
  console.log("Done! Team cards redesigned");
} else {
  console.log("ERROR: Could not find TeamCard function — check the file manually");
}