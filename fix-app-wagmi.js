const fs = require("fs");

let code = fs.readFileSync("pages/_app.js", "utf8");

// Replace the entire broken imports + config block
code = code.replace(
`import { RainbowKitProvider, getDefaultWallets, darkTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";`,
`import { RainbowKitProvider, getDefaultWallets, darkTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains";`
);

// Replace the configureChains call
code = code.replace(
`const { chains, publicClient } = configureChains(
  [mainnet, polygon, arbitrum, optimism, base],
  [publicProvider()]
);`,
`const { chains, publicClient } = configureChains(
  [mainnet, polygon, arbitrum, optimism, base],
  [
    (chain) => {
      return {
        chain,
        rpcUrls: { default: { http: [chain.rpcUrls.default.http[0]] } },
        publicClient: createPublicClient({ chain, transport: http() }),
      };
    },
  ]
);`
);

// Add missing imports at the top
code = code.replace(
  `import { RainbowKitProvider, getDefaultWallets, darkTheme } from "@rainbow-me/rainbowkit";`,
  `import { RainbowKitProvider, getDefaultWallets, darkTheme, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, coinbaseWallet, walletConnectWallet, rainbowWallet } from "@rainbow-me/rainbowkit/wallets";
import { createPublicClient, http } from "viem";`
);

fs.writeFileSync("pages/_app.js", code, "utf8");
console.log("Patched wagmi config");