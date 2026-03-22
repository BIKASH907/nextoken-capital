const fs = require("fs");

let code = fs.readFileSync("components/Navbar.js", "utf8");

// Replace <style jsx> with regular <style> tag
code = code.replace(
  `      <style jsx>{\`
        @media (max-width: 980px) {
          .desk-links, .desk-actions { display: none !important; }
          .hamburger { display: flex !important; }
          .mobile-menu { display: flex !important; }
        }
        :global([data-rk] button) { font-weight: 700 !important; font-family: 'DM Sans', sans-serif !important; }
      \`}</style>`,
  `      <style dangerouslySetInnerHTML={{ __html: \`
        @media (max-width: 980px) {
          .desk-links  { display: none !important; }
          .desk-actions { display: none !important; }
          .hamburger   { display: flex !important; }
          .mobile-menu { display: flex !important; }
        }
        [data-rk] button { font-weight: 700 !important; font-family: 'DM Sans', sans-serif !important; }
      \` }} />`
);

fs.writeFileSync("components/Navbar.js", code, "utf8");
console.log("Done! Navbar mobile CSS fixed — style jsx replaced with dangerouslySetInnerHTML");