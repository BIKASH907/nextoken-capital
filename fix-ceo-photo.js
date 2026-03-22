const fs = require("fs");

let code = fs.readFileSync("pages/about.js", "utf8");

// Replace BB initials avatar with real photo
code = code.replace(
  `  <div style={{ width:72, height:72, borderRadius:18, background:member.bg, border:"2px solid "+member.color+"44", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
        <span style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:member.color }}>{member.initials}</span>
      </div>`,
  `  <div style={{ width:72, height:72, borderRadius:18, overflow:"hidden", border:"2px solid "+member.color+"44", marginBottom:18, background:member.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {member.photo ? (
          <img src={member.photo} alt={member.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        ) : (
          <span style={{ fontFamily:"Syne,sans-serif", fontSize:24, fontWeight:800, color:member.color }}>{member.initials}</span>
        )}
      </div>`
);

// Add photo field to Bikash
code = code.replace(
  `    initials:"BB", color:"#F0B90B", bg:"rgba(240,185,11,0.15)",
    name:"Bikash Bhat",`,
  `    initials:"BB", color:"#F0B90B", bg:"rgba(240,185,11,0.15)", photo:"/bikash.jpg",
    name:"Bikash Bhat",`
);

fs.writeFileSync("pages/about.js", code, "utf8");
console.log("Done! CEO photo slot added — place bikash.jpg in /public folder");