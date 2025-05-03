import { NextResponse } from 'next/server';
import { createWalletClient, http, createPublicClient } from 'viem';
import { getBalance } from 'viem/actions';
import { privateKeyToAccount } from 'viem/accounts';
import { bepolia } from '@/lib/viemProvider';
import { membershipAbi } from '@/contracts/membershipAbi';

const account = privateKeyToAccount(process.env.DEPLOYER_KEY as `0x${string}`);
console.log('Relayer account address:', account.address);

const wallet = createWalletClient({ 
  account, 
  chain: bepolia, 
  transport: http(process.env.BERA_RPC!) 
});

const publicClient = createPublicClient({
  chain: bepolia,
  transport: http(process.env.BERA_RPC!)
});

export async function POST(request: Request) {
  const { address } = await request.json();           // address to mint for
  try {
    // Check account balance first
    const balance = await getBalance(publicClient, { address: account.address });
    console.log('Account balance:', balance.toString());
    
    if (balance === BigInt(0)) {
      return NextResponse.json({ error: 'Insufficient BERA for gas' }, { status: 400 });
    }

    const txHash = await wallet.writeContract({
      account,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: membershipAbi,
      functionName: 'mintMembership',
      args: [address],
    });
    return NextResponse.json({ txHash });
  } catch (e) {
    console.error('Mint error:', e);
    return NextResponse.json({ error: 'mint failed' }, { status: 500 });
  }
} 