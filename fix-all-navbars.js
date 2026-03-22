const fs = require("fs");
const path = require("path");

const files = fs.readdirSync("pages").filter(f => f.endsWith(".js") && !f.startsWith("_"));

let fixed = 0;
files.forEach((file) => {
  const fp = path.join("pages", file);
  let code = fs.readFileSync(fp, "utf8");
  const before = code;

  code = code.replace(/import Navbar from ["']\.\.\/components\/Navbar["'];\r?\n/g, "");
  code = code.replace(/\s*<Navbar\s*\/>/g, "");

  if (code !== before) {
    fs.writeFileSync(fp, code, "utf8");
    console.log("Fixed: " + fp);
    fixed++;
  }
});

console.log("Done! Fixed " + fixed + " files.");