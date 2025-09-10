import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, createPublicClient, http } from 'viem';
import { bepolia } from '@/lib/viemProvider';
import { membershipAbi } from '@/contracts/membershipAbi';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { 
  withErrorHandling, 
  Logger, 
  createValidationError, 
  createRateLimitError,
  createBlockchainError,
  createInternalError, 
  extractRequestContext 
} from '@/lib/error-handling';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 m'),
  analytics: true,
  prefix: 'nfa-mint-rl'
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

const mintHandler = async (request: NextRequest) => {
  const context = extractRequestContext(request);
  Logger.info('SBT minting request received', { endpoint: context.endpoint }, context);
  
  // Rate limiting
  const ip = context.ip || '127.0.0.1';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    Logger.security('Rate limit exceeded for mint endpoint', {
      ip,
      limit,
      remaining
    }, context);
    
    const error = createRateLimitError('Too many minting attempts. Please wait before trying again.', context);
    
    return NextResponse.json(
      {
        error: error.message,
        type: error.type,
        retryAfter: Math.round((reset - Date.now()) / 1000),
        timestamp: new Date().toISOString()
      },
      { 
        status: error.statusCode,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const body = await request.json();
  const { address, code } = body;

  if (!address || !code) {
    throw createValidationError('Address and code are required', context);
  }

  if (typeof address !== 'string' || !address.startsWith('0x') || address.length !== 42) {
    throw createValidationError('Invalid Ethereum address format', context);
  }

  Logger.info('Processing mint request', {
    address,
    codePreview: code.substring(0, 10) + '...'
  }, context);

  // Verify the code is still valid in Redis
  const inviteKey = `invite:${code}`;
  let inviteData;
  
  try {
    inviteData = await redis.get(inviteKey);
  } catch (redisError) {
    Logger.error('Redis lookup failed for invite code', redisError instanceof Error ? redisError : new Error(String(redisError)), context);
    throw createInternalError('Failed to verify invite code', context);
  }
  
  if (!inviteData) {
    Logger.warn('Invalid or expired invite code used', {
      inviteKey: inviteKey.substring(0, 20) + '...',
      address
    }, context);
    throw createValidationError('Invalid or expired invite code', context);
  }

  let parsedInviteData;
  try {
    parsedInviteData = JSON.parse(inviteData as string);
  } catch (parseError) {
    Logger.error('Failed to parse invite data from Redis', parseError instanceof Error ? parseError : new Error(String(parseError)), context);
    throw createInternalError('Corrupt invite data', context);
  }
  
  const { timestamp, venueId } = parsedInviteData;
  
  // Check if invite is still recent (within 5 minutes of generation)
  const now = Math.floor(Date.now() / 1000);
  const isRecent = now - timestamp < 5 * 60;
  
  if (!isRecent) {
    Logger.warn('Expired invite code attempted', {
      age: now - timestamp,
      venueId,
      address
    }, context);
    
    try {
      await redis.del(inviteKey);
    } catch (redisError) {
      Logger.error('Failed to cleanup expired invite', redisError instanceof Error ? redisError : new Error(String(redisError)), context);
    }
    
    throw createValidationError('Invite code has expired', context);
  }

  // Check if this wallet already has an SBT
  let hasMinted = false;
  try {
    hasMinted = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: membershipAbi,
      functionName: 'hasMinted',
      args: [address as `0x${string}`]
    }) as boolean;

    Logger.info('Checked existing membership status', {
      address,
      hasMinted
    }, context);

    if (hasMinted) {
      Logger.warn('Attempt to mint duplicate SBT', { address }, context);
      throw createValidationError('This wallet already has a membership NFT', context);
    }
  } catch (error) {
    if (error instanceof Error && error.message?.includes('already has a membership')) {
      throw error; // Re-throw validation errors
    }
    Logger.error('Error checking existing membership', error instanceof Error ? error : new Error(String(error)), context);
    throw createBlockchainError('Failed to verify membership status', context);
  }

  // Delete the invite code to prevent reuse
  try {
    await redis.del(inviteKey);
    Logger.info('Invite code consumed for minting', { venueId, address }, context);
  } catch (redisError) {
    Logger.error('Failed to delete used invite code', redisError instanceof Error ? redisError : new Error(String(redisError)), context);
    // Continue with minting - this is not critical
  }

  // Mint the SBT
  try {
    Logger.info('Starting SBT minting process', {
      address,
      contract: CONTRACT_ADDRESS,
      venueId
    }, context);
    
    const { request } = await publicClient.simulateContract({
      address: CONTRACT_ADDRESS,
      abi: membershipAbi,
      functionName: 'mintMembership',
      args: [address as `0x${string}`],
      account
    });

    const hash = await walletClient.writeContract(request);
    
    Logger.info('SBT minted successfully', {
      address,
      transactionHash: hash,
      venueId
    }, context);
    
    return NextResponse.json({ 
      success: true,
      hash,
      message: 'Miracle SBT minted successfully!'
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json'
      }
    });
    
  } catch (mintError) {
    Logger.error('SBT minting failed', mintError instanceof Error ? mintError : new Error(String(mintError)), context);
    
    // Re-add the invite code if minting failed
    try {
      await redis.set(inviteKey, JSON.stringify({ timestamp, venueId }), { ex: 5 * 60 });
      Logger.info('Restored invite code after minting failure', { venueId }, context);
    } catch (restoreError) {
      Logger.error('Failed to restore invite code after minting failure', restoreError instanceof Error ? restoreError : new Error(String(restoreError)), context);
    }
    
    const error = createBlockchainError('Failed to mint NFT. Please try again.', context);
    error.context.originalError = mintError instanceof Error ? mintError.message : String(mintError);
    throw error;
  }
};

export const POST = withErrorHandling(mintHandler);
