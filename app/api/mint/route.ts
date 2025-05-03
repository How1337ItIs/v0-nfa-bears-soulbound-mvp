import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { bepolia } from '@/lib/viemProvider';
import NFABearsMembership from '@/contracts/NFABearsMembership.json';
import { limiter } from '@/lib/rate-limit';

const account = privateKeyToAccount(process.env.DEPLOYER_KEY as `0x${string}`);
const walletClient = createWalletClient({
  account,
  chain: bepolia,
  transport: http()
});

export async function POST(req: Request) {
  try {
    // Apply rate limiting
    await limiter.check(req, 4, 'MINT');

    const body = await req.json();
    const { address, code } = body;

    if (!address || !code) {
      return NextResponse.json({ error: 'Address and code are required' }, { status: 400 });
    }

    // Check and redeem invite code
    const ok = await redis.del(`invite:${code}`);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid or redeemed invite' }, { status: 400 });
    }

    const { request } = await walletClient.simulateContract({
      address: '0xF0e401E962f2C126A3E44a6708E0884De038E77b',
      abi: NFABearsMembership.abi,
      functionName: 'mintMembership',
      args: [address]
    });

    const hash = await walletClient.writeContract(request);
    return NextResponse.json({ hash });
  } catch (error) {
    console.error('Mint error:', error);
    return NextResponse.json({ error: 'Failed to mint' }, { status: 500 });
  }
} 