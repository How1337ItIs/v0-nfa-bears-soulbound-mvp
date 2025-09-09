'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Check initial connection
    setIsOnline(navigator.onLine);

    // Listen for connection changes
    const handleOnline = () => {
      setIsOnline(true);
      // Redirect to home after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  return (
    <div className="min-h-screen tie-dye-bg flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="glassmorphic rounded-xl p-8 liquid-morph">
          {isOnline ? (
            <>
              <div className="text-6xl mb-6 animate-bounce">🌈</div>
              <h1 className="text-2xl font-bold text-white mb-4 groovy-font">
                Connection Restored!
              </h1>
              <p className="text-white/80 mb-6">
                Welcome back to the NFA Bears family. Redirecting you now...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6 float-animation">🐻</div>
              <h1 className="text-2xl font-bold text-white mb-4 groovy-font">
                You're Offline
              </h1>
              <p className="text-white/80 mb-6">
                The music must go on, but some features need an internet connection. 
                Check your network and we'll get you back on the bus.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="text-sm text-white/70">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span>No Internet Connection</span>
                  </div>
                </div>
                
                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-white font-medium mb-2">While offline, you can still:</h3>
                  <ul className="text-sm text-white/70 space-y-1">
                    <li>• Browse cached pages</li>
                    <li>• View your wallet info</li>
                    <li>• Read community guidelines</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-6 aurora-gradient text-white font-medium rounded-lg magnetic-button transition-all"
              >
                Try Again
              </button>
              
              <div className="mt-6 p-4 border border-white/20 rounded-lg">
                <p className="text-xs text-white/60 mb-2">Connection Status:</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`}></div>
                  <span className="text-sm text-white/80">
                    {isOnline ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Quote for offline inspiration */}
        <div className="mt-8 p-6 glassmorphic rounded-xl border-l-4 aurora-gradient">
          <blockquote className="text-white/90 italic script-font text-sm">
            "Sometimes we live no particular way but our own..."
          </blockquote>
          <p className="text-white/70 text-xs mt-2">— Grateful Dead, "Uncle John's Band"</p>
        </div>
      </div>
    </div>
  );
}