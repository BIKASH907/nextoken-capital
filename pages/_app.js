import Navbar from "../components/Navbar";
import React from 'react';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'Nextoken Capital',
  projectId: 'b00090bb1fd858afec43b9d5c3bee3a6',
  chains: [mainnet, polygon],
  ssr: true,
});

export default function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: '#f0b90b' })}>
          <div style={{ backgroundColor: "#05060a", minHeight: "100vh" }}>
            <Component {...pageProps} />
            <Navbar />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}