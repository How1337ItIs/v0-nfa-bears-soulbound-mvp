'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const PrivySetup = dynamic(
  () => import('./PrivySetup').then(mod => mod.PrivySetup),
  { ssr: false }
);

export function ClientPrivyProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useState(() => {
    setMounted(true);
  });

  if (!mounted) {
    return <>{children}</>;
  }

  return <PrivySetup>{children}</PrivySetup>;
}
