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
  // Check relayer balance
  const relayerAddress = '0xC9ba78130433dfC58dBf0F94f4Ff3b29E1a050a4';
  const balance = await publicClient.getBalance({ address: relayerAddress });
  console.log('Relayer balance:', Number(balance) / 1e18, 'BERA');

  // Check contract owner
  const contractAddress = '0xF0e401E962f2C126A3E44a6708E0884De038E77b';
  const owner = await publicClient.readContract({
    address: contractAddress,
    abi: [{
      stateMutability: 'view',
      type: 'function',
      name: 'owner',
      outputs: [{ type: 'address' }]
    }],
    functionName: 'owner'
  });
  
  console.log('Contract owner:', owner);
  console.log('Is relayer the owner?', (owner as string).toLowerCase() === relayerAddress.toLowerCase());
}

main().catch(console.error);
