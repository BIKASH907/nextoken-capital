const fs = require("fs");

let code = fs.readFileSync("app/equity-ipo/page.tsx", "utf8");

// Fix: replace the S object with typed positions
code = code.replace(
  `nav:     { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:64, background:"rgba(5,5,8,0.95)", borderBottom:"1px solid rgba(255,255,255,0.08)", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(20px)" },`,
  `nav:     { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:64, background:"rgba(5,5,8,0.95)", borderBottom:"1px solid rgba(255,255,255,0.08)", position:"sticky" as const, top:0, zIndex:100, backdropFilter:"blur(20px)" },`
);

fs.writeFileSync("app/equity-ipo/page.tsx", code, "utf8");
console.log("Fixed! position:sticky now has as const");