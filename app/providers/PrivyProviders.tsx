'use client';
console.log("APP_ID:", process.env.NEXT_PUBLIC_PRIVY_APP_ID);

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, WagmiProvider } from 'wagmi';
import { http } from 'viem';
import { bepolia } from '@/lib/viemProvider';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [bepolia],
  transports: {
    [bepolia.id]: http(process.env.NEXT_PUBLIC_BEPOLIA_RPC),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: 'light',
          accentColor: '#000000',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
