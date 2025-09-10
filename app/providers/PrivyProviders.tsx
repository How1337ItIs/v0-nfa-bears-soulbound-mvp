'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Ultra-minimal loading component to prevent any heavy imports
const MinimalLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }}>
    <div style={{ textAlign: 'center', color: 'white' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }}></div>
      <p>Loading NFA Bears...</p>
      <style dangerouslySetInnerHTML={{
        __html: '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }'
      }} />
    </div>
  </div>
);

// Aggressively lazy-loaded Web3 setup - ONLY loads when actually needed
const LazyWeb3Setup = dynamic(
  () => import('./PrivySetup').then(mod => ({ default: mod.PrivySetup })),
  {
    ssr: false,
    loading: () => <MinimalLoader />,
    // Prevent any imports until user interaction
    // This is key to fixing the 115s compilation issue
  }
);

export function PrivyProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<MinimalLoader />}>
      <LazyWeb3Setup>{children}</LazyWeb3Setup>
    </Suspense>
  );
}
