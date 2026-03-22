const fs = require("fs");

["pages/equity-ipo.js", "pages/bonds.js", "pages/institutional.js"].forEach((file) => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, "utf8");
  
  // Remove Navbar import
  code = code.replace(/import Navbar from ["']\.\.\/components\/Navbar["'];\n/g, "");
  code = code.replace(/import Navbar from ["']\.\.\/components\/Navbar["'];\r\n/g, "");
  
  // Remove <Navbar /> usage
  code = code.replace(/<Navbar \/>\n/g, "");
  code = code.replace(/<Navbar\/>\n/g, "");
  code = code.replace(/\s*<Navbar \/>/g, "");
  code = code.replace(/\s*<Navbar\/>/g, "");

  fs.writeFileSync(file, code, "utf8");
  console.log("Fixed: " + file);
});