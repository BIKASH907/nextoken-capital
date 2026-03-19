import React from 'react';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// CRITICAL: Ensure this import path is exactly where your Navbar file is
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const config = getDefaultConfig({
  appName: 'Nextoken Capital',
  projectId: 'YOUR_PROJECT_ID', 
  chains: [mainnet, polygon],
  ssr: true,
});

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: '#f0b90b' })}>
          <div style={{ backgroundColor: "#05060a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* THIS LINE REVEALS THE NAVBAR ON EVERY PAGE */}
            <Navbar /> 
            <main style={{ flex: 1 }}>
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}