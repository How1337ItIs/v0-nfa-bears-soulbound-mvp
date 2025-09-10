import { createPublicClient, createWalletClient, http, defineChain } from "viem";

// Production-ready Berachain testnet configuration
export const bepolia = defineChain({
  id: 80069,
  name: "Berachain Bepolia",
  network: "berachain-bepolia",
  nativeCurrency: { 
    name: "BERA", 
    symbol: "BERA", 
    decimals: 18 
  },
  rpcUrls: {
    default: { 
      http: [process.env.NEXT_PUBLIC_BEPOLIA_RPC || "https://bepolia.rpc.berachain.com/"] 
    },
    public: { 
      http: ["https://bepolia.rpc.berachain.com/"] 
    }
  },
  blockExplorers: {
    default: { 
      name: "Berachain Explorer", 
      url: "https://bepolia.beratrail.io" 
    }
  },
  testnet: true,
});

// Production-ready client configurations with retry logic
export const publicClient = createPublicClient({ 
  chain: bepolia, 
  transport: http(process.env.NEXT_PUBLIC_BEPOLIA_RPC || "https://bepolia.rpc.berachain.com/", {
    batch: true,
    retryCount: 3,
    retryDelay: 1000,
  })
});

export const walletClient = createWalletClient({ 
  chain: bepolia, 
  transport: http(process.env.NEXT_PUBLIC_BEPOLIA_RPC || "https://bepolia.rpc.berachain.com/", {
    batch: true,
    retryCount: 3,
    retryDelay: 1000,
  })
}); 