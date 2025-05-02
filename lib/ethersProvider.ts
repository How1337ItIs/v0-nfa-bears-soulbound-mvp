import { createPublicClient, createWalletClient, http } from 'viem';

// For read operations
export const publicClient = createPublicClient({
  chain: { 
    id: 80069, 
    name: 'BerachainBepolia', 
    nativeCurrency: {
      name: 'BERA',
      symbol: 'BERA',
      decimals: 18
    }, 
    rpcUrls: {
      default: {
        http: [process.env.NEXT_PUBLIC_RPC_URL!]
      }
    }
  },
  transport: http()
});

// For write operations
export const walletClient = createWalletClient({
  chain: { 
    id: 80069, 
    name: 'BerachainBepolia', 
    nativeCurrency: {
      name: 'BERA',
      symbol: 'BERA',
      decimals: 18
    }, 
    rpcUrls: {
      default: {
        http: [process.env.NEXT_PUBLIC_RPC_URL!]
      }
    }
  },
  transport: http()
}); 