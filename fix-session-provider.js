const fs = require("fs");
let code = fs.readFileSync("pages/_app.js", "utf8");

code = code.replace(
  `import { useState, useEffect } from "react";`,
  `import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";`
);

code = code.replace(
  `    <WagmiProvider config={config}>`,
  `    <SessionProvider session={pageProps.session}>
    <WagmiProvider config={config}>`
);

code = code.replace(
  `        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>`,
  `        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </SessionProvider>`
);

fs.writeFileSync("pages/_app.js", code, "utf8");
console.log("Done! SessionProvider added to _app.js");