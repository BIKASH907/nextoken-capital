const fs = require("fs");

let code = fs.readFileSync("pages/_app.js", "utf8");

// Fix wagmi imports — remove broken provider imports
code = code.replace(
  `import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";`,
  ``
);

// Fix configureChains — remove alchemyProvider, keep only publicProvider inline
code = code.replace(
  `const { chains, publicClient } = configureChains(
  [mainnet, polygon, arbitrum, optimism, base],
  [publicProvider()]
);`,
  `const { chains, publicClient } = configureChains(
  [mainnet, polygon, arbitrum, optimism, base],
  [
    (chain) => ({
      chain,
      rpcUrls: chain.rpcUrls,
      publicClient: chain.publicClient,
    }),
  ]
);`
);

fs.writeFileSync("pages/_app.js", code, "utf8");
console.log("Fixed wagmi imports");