const fs = require("fs");

const files = [
  "app/bonds/page.tsx",
  "app/equity-ipo/page.tsx",
  "app/register/page.tsx",
];

files.forEach((file) => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, "utf8");

  // Fix position values that TypeScript rejects
  code = code
    .replace(/position:"sticky"/g,   'position:"sticky" as const')
    .replace(/position:"relative"/g, 'position:"relative" as const')
    .replace(/position:"absolute"/g, 'position:"absolute" as const')
    .replace(/position:"fixed"/g,    'position:"fixed" as const');

  // Remove double as const if script runs twice
  code = code
    .replace(/as const as const/g, "as const");

  fs.writeFileSync(file, code, "utf8");
  console.log("Fixed: " + file);
});

console.log("All done!");