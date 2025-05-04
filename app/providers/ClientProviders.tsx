'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { WagmiSetup } from './WagmiSetup';

const PrivySetup = dynamic(
  () => import('@privy-io/react-auth').then(mod => mod.PrivyProvider),
  { ssr: false }
);

const QueryClientProvider = dynamic(
  () => import('@tanstack/react-query').then(mod => mod.QueryClientProvider),
  { ssr: false }
);

const WagmiProvider = dynamic(
  () => import('@privy-io/wagmi').then(mod => mod.WagmiProvider),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const setup = async () => {
      const { createConfig } = await import('@privy-io/wagmi');
      const { http } = await import('wagmi');
      const { defineChain } = await import('viem');

      const bepolia = defineChain({
        id: 11155111,
        name: 'Sepolia',
        network: 'sepolia',
        nativeCurrency: {
          decimals: 18,
          name: 'Sepolia Ether',
          symbol: 'ETH',
        },
        rpcUrls: {
          default: {
            http: [process.env.NEXT_PUBLIC_BEPOLIA_RPC || ''],
          },
          public: {
            http: [process.env.NEXT_PUBLIC_BEPOLIA_RPC || ''],
          },
        },
        blockExplorers: {
          default: {
            name: 'Etherscan',
            url: 'https://sepolia.etherscan.io',
          },
        },
        testnet: true,
      });

      const wagmiConfig = createConfig({
        chains: [bepolia],
        transports: {
          [bepolia.id]: http(process.env.NEXT_PUBLIC_BEPOLIA_RPC || '')
        }
      });

      setConfig(wagmiConfig);
      setMounted(true);
    };

    setup();
  }, []);

  if (!mounted || !config) {
    return <>{children}</>;
  }

  return (
    <PrivySetup
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url.com/logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <QueryClientProvider client={new (require('@tanstack/react-query').QueryClient)()}>
        <WagmiSetup>
          {children}
        </WagmiSetup>
      </QueryClientProvider>
    </PrivySetup>
  );
} 