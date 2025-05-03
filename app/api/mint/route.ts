import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { bepolia } from '@/lib/viemProvider';
import NFABearsMembership from '@/contracts/NFABearsMembership.json';
import { limiter } from '@/lib/rate-limit';
import { verifyCoordinates, verifyTimeSecret } from '@/lib/location';

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
    const { address, code, coordinates, secret } = body;

    if (!address || !code || !coordinates || !secret) {
      return NextResponse.json({ 
        error: 'Address, code, coordinates, and secret are required' 
      }, { status: 400 });
    }

    // Get invite data
    const inviteData = await redis.get(`invite:${code}`);
    if (!inviteData) {
      return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 });
    }

    const { timestamp, coordinates: venueCoordinates } = JSON.parse(inviteData);
    const now = Date.now();
    const isRecent = now - timestamp < 5 * 60 * 1000; // 5 minutes

    if (!isRecent) {
      return NextResponse.json({ error: 'Invite code expired' }, { status: 400 });
    }

    // Verify time secret
    if (!verifyTimeSecret(secret)) {
      return NextResponse.json({ error: 'Invalid time secret' }, { status: 400 });
    }

    // Verify coordinates
    if (!verifyCoordinates(coordinates.lat, coordinates.lng)) {
      return NextResponse.json({ error: 'Must be at venue' }, { status: 400 });
    }

    // Delete the code after verification
    await redis.del(`invite:${code}`);

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