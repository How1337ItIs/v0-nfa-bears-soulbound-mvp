'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { defineChain } from 'viem';
import { useState } from 'react';

// Define Berachain testnet configuration for production readiness
const berachainTestnet = defineChain({
  id: 80069,
  name: 'Berachain Bepolia',
  network: 'berachain-bepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'BERA',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BEPOLIA_RPC || 'https://bepolia.rpc.berachain.com/'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BEPOLIA_RPC || 'https://bepolia.rpc.berachain.com/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Berachain Explorer',
      url: 'https://bepolia.beratrail.io',
    },
  },
  testnet: true,
});

// Export wagmi config for use in hooks
export const wagmiConfig = createConfig({
  chains: [berachainTestnet],
  transports: {
    [berachainTestnet.id]: http(
      process.env.NEXT_PUBLIC_BEPOLIA_RPC || 'https://bepolia.rpc.berachain.com/'
    )
  },
  ssr: true,
  batch: { multicall: true },
});

export function PrivySetup({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
      },
    },
  }));

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        // Enhanced login methods for 60-second miracle
        loginMethods: ['email', 'google', 'twitter', 'sms', 'wallet'],
        
        // Production-ready appearance
        appearance: {
          theme: 'dark',
          accentColor: '#ff3366',
          logo: '/icons/icon-192x192.png',
          landingHeader: 'Welcome to NFA Bears',
          loginMessage: 'Connect to access the member dashboard. Your Miracle SBT can only be claimed in-person at events.',
          showWalletLoginFirst: false,
        },
        
        // Optimized embedded wallets - force Bepolia for new wallets
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          priceDisplay: {
            primary: 'fiat-currency',
            secondary: 'native-token',
          },
        },
        
        // Enhanced security with MFA
        mfa: {
          noPromptOnMfaRequired: false,
        },
        
        // Legal configuration
        legal: {
          termsAndConditionsUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/terms`,
          privacyPolicyUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/privacy`,
        },
        
        // Network configuration - CRITICAL: Only Berachain Bepolia testnet
        defaultChain: berachainTestnet,
        supportedChains: [berachainTestnet],
        
        
        // External wallets
        externalWallets: {
          coinbaseWallet: {
            connectionOptions: 'smartWalletOnly',
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
