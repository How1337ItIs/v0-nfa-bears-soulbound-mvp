'use client';

import { createConfig, WagmiProvider } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { defineChain } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Define Bepolia chain configuration
const bepolia = defineChain({
  id: 11155111,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BEPOLIA_RPC || ''],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BEPOLIA_RPC || ''],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
  },
  testnet: true,
});

export function WagmiSetup({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [wagmiConfig] = useState(() => createConfig({
    chains: [bepolia],
    transports: {
      [bepolia.id]: http(process.env.NEXT_PUBLIC_BEPOLIA_RPC || '')
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );
} 