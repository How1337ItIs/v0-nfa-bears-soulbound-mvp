'use client';

import { useState, useEffect } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { berachainBepolia } from 'viem/chains';

// Client-side only wrapper
export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    console.error('NEXT_PUBLIC_PRIVY_APP_ID is not set');
    return null;
  }

  const config = createConfig({
    chains: [berachainBepolia],
    transports: {
      [berachainBepolia.id]: http(process.env.NEXT_PUBLIC_BEPOLIA_RPC),
    },
  });

  return (
    <WagmiProvider config={config}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
        config={{
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            showWalletLoginFirst: true,
          },
        }}
      >
        {children}
      </PrivyProvider>
    </WagmiProvider>
  );
}

// Server component wrapper
export function PrivyProviders({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
} 