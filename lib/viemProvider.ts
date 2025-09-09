import { createPublicClient, createWalletClient, http, defineChain } from "viem";

// Production-ready Berachain testnet configuration
export const bepolia = defineChain({
  id: 80084,
  name: "Berachain bArtio",
  network: "berachain-bartio",
  nativeCurrency: { 
    name: "BERA", 
    symbol: "BERA", 
    decimals: 18 
  },
  rpcUrls: {
    default: { 
      http: [process.env.NEXT_PUBLIC_BEPOLIA_RPC || "https://bartio.rpc.berachain.com/"] 
    },
    public: { 
      http: ["https://bartio.rpc.berachain.com/"] 
    }
  },
  blockExplorers: {
    default: { 
      name: "Berachain Explorer", 
      url: "https://bartio.beratrail.io" 
    }
  },
  testnet: true,
});

// Production-ready client configurations with retry logic
export const publicClient = createPublicClient({ 
  chain: bepolia, 
  transport: http(process.env.NEXT_PUBLIC_BEPOLIA_RPC || "https://bartio.rpc.berachain.com/", {
    batch: true,
    retryCount: 3,
    retryDelay: ({ count }) => Math.min(1000 * 2 ** count, 30000),
  })
});

export const walletClient = createWalletClient({ 
  chain: bepolia, 
  transport: http(process.env.NEXT_PUBLIC_BEPOLIA_RPC || "https://bartio.rpc.berachain.com/", {
    batch: true,
    retryCount: 3,
    retryDelay: ({ count }) => Math.min(1000 * 2 ** count, 30000),
  })
}); 