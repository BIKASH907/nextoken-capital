const fs = require("fs");

let code = fs.readFileSync("pages/_app.js", "utf8");

// Add Navbar import after the last import line
code = code.replace(
  `import "@rainbow-me/rainbowkit/styles.css";`,
  `import "@rainbow-me/rainbowkit/styles.css";
import Navbar from "../components/Navbar";`
);

// Add Navbar above Component in the render
code = code.replace(
  `          <div className="page-enter" key={router.pathname}>
            <Component {...pageProps} />
          </div>`,
  `          <Navbar />
          <div className="page-enter" key={router.pathname}>
            <Component {...pageProps} />
          </div>`
);

fs.writeFileSync("pages/_app.js", code, "utf8");
console.log("Done! Navbar added globally to _app.js");