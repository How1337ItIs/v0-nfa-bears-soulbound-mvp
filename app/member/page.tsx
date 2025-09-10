'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { useMintSBT } from '@/lib/useMintSBT';
import { useGenesisBears } from '@/lib/useGenesisBears';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamicImport from 'next/dynamic';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Dynamic QR code to avoid SSR issues
const QRCodeComponent = dynamicImport(
  () => import('qrcode.react').then(mod => ({ default: mod.QRCodeSVG })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-48 h-48 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    )
  }
);

const UncleSamSkeleton = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2">
    <ellipse cx="36" cy="54" rx="24" ry="12" fill="#1A1AFF"/>
    <ellipse cx="36" cy="36" rx="18" ry="22" fill="#FFFFFF" stroke="#111111" strokeWidth="2"/>
    <ellipse cx="36" cy="36" rx="16" ry="20" fill="#FFF"/>
    <ellipse cx="28" cy="38" rx="2.5" ry="3.5" fill="#111"/>
    <ellipse cx="44" cy="38" rx="2.5" ry="3.5" fill="#111"/>
    <ellipse cx="36" cy="48" rx="6" ry="2" fill="#FF2222"/>
    <rect x="24" y="12" width="24" height="12" rx="4" fill="#FF2222" stroke="#111" strokeWidth="2"/>
    <rect x="28" y="8" width="16" height="8" rx="2" fill="#1A1AFF" stroke="#111" strokeWidth="2"/>
    <rect x="32" y="4" width="8" height="8" rx="1" fill="#FFF" stroke="#111" strokeWidth="2"/>
    <rect x="30" y="20" width="12" height="4" rx="2" fill="#C0C0C0"/>
  </svg>
);

export default function MemberPage() {
  const { user, authenticated, logout, ready } = usePrivy();
  const { address } = useAccount();
  const { hasMinted, checkHasMinted } = useMintSBT();
  const { isHolder, balance, tokenIds, loading: genesisBearLoading, error: genesisBearError, refresh } = useGenesisBears();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && ready && !authenticated) {
      router.push('/');
    }
  }, [authenticated, ready, mounted, router]);

  useEffect(() => {
    if (address && mounted) {
      checkHasMinted(address);
    }
  }, [address, mounted, checkHasMinted]);

  const displayAddress = address 
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : 'No wallet connected';

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (!mounted || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <UncleSamSkeleton />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">NFA Bears Member</h1>
              <p className="text-gray-600">Welcome to the family!</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Membership Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Membership Status</h2>
              {genesisBearLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              )}
            </div>
            
            {/* Genesis Bears Status */}
            {genesisBearError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">❌</div>
                  <div>
                    <div className="font-semibold text-red-800">Connection Error</div>
                    <div className="text-sm text-red-600">{genesisBearError}</div>
                    <button 
                      onClick={refresh}
                      className="text-xs text-red-700 underline hover:text-red-800 mt-1"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            ) : isHolder ? (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🐻</div>
                    <div>
                      <div className="font-semibold text-purple-800">Genesis Bear Holder</div>
                      <div className="text-sm text-purple-600">You own {balance} Genesis Bear{balance !== 1 ? 's' : ''}</div>
                      {tokenIds.length > 0 && (
                        <div className="text-xs text-purple-500 mt-1">
                          Bear{tokenIds.length !== 1 ? 's' : ''} #{tokenIds.join(', #')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {hasMinted && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">✅</div>
                      <div>
                        <div className="font-semibold text-green-800">Miracle SBT Holder</div>
                        <div className="text-sm text-green-600">Active community member</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600"><strong>Wallet:</strong></p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded">{displayAddress}</p>
                    <button
                      onClick={handleCopy}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600"><strong>Email:</strong></p>
                  <p className="text-sm">{user?.email?.address || 'Not provided'}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">⚠️</div>
                  <div>
                    <div className="font-semibold text-yellow-800">No Genesis Bear Found</div>
                    <div className="text-sm text-yellow-600">You need to own a Genesis Bear to access premium features</div>
                    <div className="text-xs text-yellow-500 mt-1">
                      Connected wallet: {displayAddress}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Member Benefits */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Member Benefits</h2>
            
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <div className="text-purple-600 mr-3">🎵</div>
                <div className="text-sm">
                  <div className="font-medium">Event Access</div>
                  <div className="text-gray-600">Discounted tickets to NFA Bears shows</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 mr-3">🛒</div>
                <div className="text-sm">
                  <div className="font-medium">Vendor Discounts</div>
                  <div className="text-gray-600">~10% off at participating vendors</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="text-green-600 mr-3">🎆</div>
                <div className="text-sm">
                  <div className="font-medium">POAT Collection</div>
                  <div className="text-gray-600">Collect event attendance tokens</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <div className="text-orange-600 mr-3">💬</div>
                <div className="text-sm">
                  <div className="font-medium">Community Access</div>
                  <div className="text-gray-600">Discord server and exclusive channels</div>
                </div>
              </div>
            </div>
          </div>

          {/* Member QR Code */}
          {hasMinted && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Member QR</h2>
              <p className="text-sm text-gray-600 mb-4">
                Show this QR code to vendors for discounts
              </p>
              
              {!showQR ? (
                <button
                  onClick={() => setShowQR(true)}
                  className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Generate QR Code
                </button>
              ) : (
                <div className="text-center space-y-4">
                  {typeof window !== 'undefined' && (
                    <QRCodeComponent
                      value={address || ''}
                      size={192}
                      level="M"
                      includeMargin={true}
                      className="mx-auto"
                    />
                  )}
                  <p className="text-xs text-gray-500">Your wallet address</p>
                  <button
                    onClick={() => setShowQR(false)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Hide QR Code
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Community Links */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Community</h2>
            
            <div className="space-y-3">
              <a 
                href="https://discord.gg/nfabears" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-2xl mr-3">💬</div>
                <div>
                  <div className="font-medium text-gray-900">Join Discord</div>
                  <div className="text-sm text-gray-600">Connect with other Bears</div>
                </div>
              </a>
              
              <a 
                href="https://twitter.com/nfabears" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-2xl mr-3">🐦</div>
                <div>
                  <div className="font-medium text-gray-900">Follow on Twitter</div>
                  <div className="text-sm text-gray-600">Stay updated on events</div>
                </div>
              </a>
              
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-2xl mb-2">✨</div>
                <div className="text-sm text-gray-700">
                  <strong>"Fuck crypto, real family shit"</strong>
                  <br />— NFA Bears what!?!?
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Not Fade Away • Not Financial Advice • Non-Fungible Acid Bears</p>
          <p className="mt-1">Built with ♥️ for the Deadhead community</p>
        </div>
      </div>
    </div>
  );
}

// Add wavy border style
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `.wavy-border { border-radius: 2rem; border-style: solid; border-width: 4px; box-shadow: 0 0 24px 4px #1A1AFFAA; }
  .wavy-border { border-image: repeating-linear-gradient(135deg, #FF2222 0 10px, #1A1AFF 10px 20px, #FFFFFF 20px 30px, #FF2222 30px 40px, #1A1AFF 40px 50px) 30; }`;
  document.head.appendChild(style);
} 