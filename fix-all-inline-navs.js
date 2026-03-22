const fs = require("fs");
const path = require("path");

// Pages that have their OWN inline navbar and should NOT
// because _app.js already renders the global Navbar
const pages = [
  "pages/register.js",
  "pages/login.js", 
  "pages/forgot-password.js",
];

pages.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, "utf8");
  const before = code;

  // Remove any <nav ...> block that contains the NXT logo
  // Pattern: finds nav opening to matching closing </nav>
  let result = "";
  let i = 0;
  let inNav = false;
  let navDepth = 0;
  
  // Simpler approach — remove lines between {/* NAVBAR */} and </nav>
  const lines = code.split("\n");
  let skipMode = false;
  let navBraceCount = 0;
  const filtered = [];
  
  for (let j = 0; j < lines.length; j++) {
    const line = lines[j];
    
    if (line.includes("{/* NAVBAR */}") || (line.includes("<nav ") && line.includes("style={S.nav}"))) {
      skipMode = true;
      navBraceCount = 0;
    }
    
    if (skipMode) {
      if (line.includes("<nav")) navBraceCount++;
      if (line.includes("</nav>")) {
        navBraceCount--;
        if (navBraceCount <= 0) {
          skipMode = false;
          continue;
        }
      }
      continue;
    }
    
    filtered.push(line);
  }
  
  code = filtered.join("\n");
  
  if (code !== before) {
    fs.writeFileSync(file, code, "utf8");
    console.log("Fixed: " + file);
  } else {
    console.log("No change: " + file);
  }
});