'use client';

import { defineChain } from 'viem';
import { createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';

export const bepolia = defineChain({
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

export const wagmiConfig = createConfig({
  chains: [bepolia],
  transports: {
    [bepolia.id]: http(process.env.NEXT_PUBLIC_BEPOLIA_RPC || '')
  }
}); 