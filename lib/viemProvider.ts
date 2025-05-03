import { createPublicClient, createWalletClient, http } from "viem";

console.log('NEXT_PUBLIC_BEPOLIA_RPC:', process.env.NEXT_PUBLIC_BEPOLIA_RPC);

export const bepolia = {
  id: 80069,
  name: "Berachain Bepolia",
  network: "bepolia",
  nativeCurrency: { name: "BERA", symbol: "BERA", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_BEPOLIA_RPC!] },
    public: { http: ["https://bepolia.rpc.berachain.com"] }
  },
  blockExplorers: {
    default: { name: "BeraTrail", url: "https://bepolia.beratrail.io" }
  }
} as const;

export const publicClient = createPublicClient({ chain: bepolia, transport: http() });
export const walletClient = createWalletClient({ chain: bepolia, transport: http() }); 