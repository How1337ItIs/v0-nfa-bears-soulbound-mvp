import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, createPublicClient, http } from 'viem';
import { bepolia } from '@/lib/viemProvider';
import { membershipAbi } from '@/contracts/membershipAbi';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 m'),
  analytics: true,
});

// Validate environment variables at module level
if (!process.env.DEPLOYER_PRIVATE_KEY) {
  throw new Error('DEPLOYER_PRIVATE_KEY environment variable is required');
}

if (!process.env.DEPLOYER_PRIVATE_KEY.startsWith('0x') || process.env.DEPLOYER_PRIVATE_KEY.length !== 66) {
  throw new Error('DEPLOYER_PRIVATE_KEY must be a valid 64-character hex private key starting with 0x');
}

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
  throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS environment variable is required');
}

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.startsWith('0x') || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.length !== 42) {
  throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS must be a valid Ethereum address');
}

const account = privateKeyToAccount(process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`);
const walletClient = createWalletClient({
  account,
  chain: bepolia,
  transport: http()
});

const publicClient = createPublicClient({
  chain: bepolia,
  transport: http()
});

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { address, code } = body;

    if (!address || !code) {
      return NextResponse.json({ 
        error: 'Address and code are required' 
      }, { status: 400 });
    }

    // Verify the code is still valid in Redis
    const inviteKey = `invite:${code}`;
    const inviteData = await redis.get(inviteKey);
    
    if (!inviteData) {
      return NextResponse.json({ 
        error: 'Invalid or expired invite code' 
      }, { status: 400 });
    }

    const { timestamp, venueId } = JSON.parse(inviteData as string);
    
    // Check if invite is still recent (within 5 minutes of generation)
    const now = Math.floor(Date.now() / 1000);
    const isRecent = now - timestamp < 5 * 60;
    
    if (!isRecent) {
      await redis.del(inviteKey);
      return NextResponse.json({ 
        error: 'Invite code has expired' 
      }, { status: 400 });
    }

    // Check if this wallet already has an SBT
    try {
      const hasMinted = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: membershipAbi,
        functionName: 'hasMinted',
        args: [address as `0x${string}`]
      }) as boolean;

      if (hasMinted) {
        return NextResponse.json({ 
          error: 'This wallet already has a membership NFT' 
        }, { status: 400 });
      }
    } catch (error) {
      console.error('Error checking existing membership:', error);
    }

    // Delete the invite code to prevent reuse
    await redis.del(inviteKey);

    // Mint the SBT
    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: membershipAbi,
        functionName: 'mintMembership',
        args: [address as `0x${string}`],
        account
      });

      const hash = await walletClient.writeContract(request);
      
      console.log(`Minted SBT for ${address}, tx: ${hash}`);
      
      return NextResponse.json({ 
        success: true,
        hash,
        message: 'Miracle SBT minted successfully!' 
      });
    } catch (mintError) {
      console.error('Minting failed:', mintError);
      
      // Re-add the invite code if minting failed
      await redis.set(inviteKey, JSON.stringify({ timestamp, venueId }), { ex: 5 * 60 });
      
      return NextResponse.json({ 
        error: 'Failed to mint NFT. Please try again.' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Mint API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 