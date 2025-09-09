import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

// Lazy load Web3 providers - CRITICAL for fast compilation
const LazyProviders = dynamic(() => import("./providers/PrivyProviders").then(mod => ({ default: mod.PrivyProviders })), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div>Initializing NFA Bears...</div>
    </div>
  ),
});

// Environment validation disabled for speed
console.log('Environment validation: DISABLED (development mode)');

export const metadata: Metadata = {
  title: "NFA Bears - Not Fade Away",
  description: "Grateful Dead-inspired Web3 community for live music and authentic connections",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NFA Bears",
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    userScalable: false,
    themeColor: '#ff3366',
  };
}

const spiralBg = `
  background: url('data:image/svg+xml;utf8,<svg width="100%25" height="100%25" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="a" cx="50%" cy="50%" r="80%" fx="50%" fy="50%"><stop offset="0%25" stop-color="%23FFFFFF"/><stop offset="40%25" stop-color="%231A1AFF"/><stop offset="80%25" stop-color="%23FF2222"/></radialGradient></defs><rect width="800" height="800" fill="url(%23a)"/><g><path d="M400,400 Q600,200 800,400 T400,800 T0,400 T400,0 Z" fill="none" stroke="%23FF2222" stroke-width="40"/><path d="M400,400 Q200,600 0,400 T400,0 T800,400 T400,800 Z" fill="none" stroke="%231A1AFF" stroke-width="40"/><path d="M400,400 Q600,600 800,400 T400,0 T0,400 T400,800 Z" fill="none" stroke="%23FFFFFF" stroke-width="40"/></g></svg>');
  background-size: cover;
  background-attachment: fixed;
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen" style={{fontFamily: 'system-ui, sans-serif'}}>
        <LazyProviders>{children}</LazyProviders>
      </body>
    </html>
  );
}

