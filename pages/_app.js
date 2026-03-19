import React from 'react';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css'; // Don't forget this!

import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'Nextoken Capital',
  projectId: 'YOUR_PROJECT_ID', // Get yours at cloud.walletconnect.com
  chains: [mainnet, polygon],
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: '#f0b90b' })}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}