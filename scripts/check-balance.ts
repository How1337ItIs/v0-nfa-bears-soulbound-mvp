import { createPublicClient, http } from 'viem';

const chain = {
  id: 80085,
  name: 'Berachain Bepolia',
  network: 'bepolia',
  nativeCurrency: { name: 'BERA', symbol: 'BERA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://bepolia.rpc.berachain.com'] }
  }
} as const;

const publicClient = createPublicClient({
  chain,
  transport: http()
});

async function main() {
  const address = '0xC9ba78130433dfC58dBf0F94f4Ff3b29E1a050a4';
  const balance = await publicClient.getBalance({ address });
  console.log('Balance:', balance.toString(), 'wei');
  console.log('Balance:', Number(balance) / 1e18, 'BERA');
}

main().catch(console.error); 