const fs = require("fs");

let code = fs.readFileSync("pages/about.js", "utf8");

// Fix 1: increase photo area height and center the image
code = code.replace(
  `position:"relative", height:200, background:member.photo && !imgErr ? "#111" : "linear-gradient(135deg,"+member.bg+" 0%,rgba(5,5,8,0.8) 100%)"`,
  `position:"relative", height:280, background:member.photo && !imgErr ? "#111" : "linear-gradient(135deg,"+member.bg+" 0%,rgba(5,5,8,0.8) 100%)"`
);

// Fix 2: center the photo properly
code = code.replace(
  `objectFit:"cover", objectPosition:"center top"`,
  `objectFit:"cover", objectPosition:"center center"`
);

// Fix 3: taller fade so transition is smooth
code = code.replace(
  `bottom:0, left:0, right:0, height:80, background:"linear-gradient(transparent,#0d0d14)"`,
  `bottom:0, left:0, right:0, height:100, background:"linear-gradient(transparent,#0d0d14)"`
);

fs.writeFileSync("pages/about.js", code, "utf8");
console.log("Done! Photo crop fixed — centered, taller card");