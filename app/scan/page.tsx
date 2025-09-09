'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import dynamic from 'next/dynamic';
import { useMintSBT } from '@/lib/useMintSBT';
import { toast } from 'react-hot-toast';

// Dynamic import for QRScanner to reduce initial bundle size
const QRScanner = dynamic(() => import('@/components/QRScanner'), {
  ssr: false,
  loading: () => (
    <div className="glassmorphic rounded-xl p-8 liquid-morph">
      <div className="text-center">
        <div className="text-6xl mb-6 spiral-animation">📷</div>
        <h3 className="text-xl font-bold text-white mb-4 groovy-font">
          Loading Scanner
        </h3>
        <p className="text-white/80 mb-6">
          Initializing QR code scanner...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  ),
});

export default function ScanPage() {
  const router = useRouter();
  const { authenticated, ready, login } = usePrivy();
  const { mintWithCode, isLoading, hasMinted, mintStatus } = useMintSBT();
  
  const [currentStep, setCurrentStep] = useState<'scan' | 'location' | 'minting' | 'success'>('scan');
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  // Handle QR code scan success
  const handleScanSuccess = async (decodedText: string) => {
    console.log('🔍 QR Code scanned:', decodedText);
    setScannedCode(decodedText);
    setCurrentStep('location');
    
    // Request location for verification
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          handleMintWithLocation(decodedText, position);
        },
        (error) => {
          console.warn('Location access denied:', error);
          toast.error('Location access required for venue verification');
          // Continue without location for development
          handleMintWithLocation(decodedText, null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      // Continue without location for development
      handleMintWithLocation(decodedText, null);
    }
  };

  // Handle minting with location verification
  const handleMintWithLocation = async (code: string, position: GeolocationPosition | null) => {
    if (!authenticated) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (hasMinted) {
      toast.success('You already have a Miracle SBT!');
      router.push('/dashboard');
      return;
    }

    setCurrentStep('minting');

    try {
      await mintWithCode(code);
      setCurrentStep('success');
      
      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Minting failed:', error);
      setCurrentStep('scan');
      setScannedCode(null);
    }
  };

  // Handle scan error
  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
    toast.error('QR code scanning failed. Please try again.');
  };

  // Reset to start scanning again
  const resetScan = () => {
    setCurrentStep('scan');
    setScannedCode(null);
    setLocation(null);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Web3...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen tie-dye-bg flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="glassmorphic rounded-xl p-8 liquid-morph">
            <div className="text-6xl mb-6 float-animation">🎪</div>
            <h1 className="text-2xl font-bold text-white mb-4 groovy-font">
              Connect to Scan
            </h1>
            <p className="text-white/80 mb-6">
              You need to connect your wallet before scanning QR codes for Miracle SBTs.
            </p>
            <button
              onClick={() => login()}
              className="w-full py-3 px-6 aurora-gradient text-white font-medium rounded-lg magnetic-button transition-all"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen tie-dye-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-white/70 hover:text-white mb-4 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-white groovy-font mb-2">
              60-Second Miracle
            </h1>
            <p className="text-white/80">
              Scan your invite QR code to join the NFA Bears family
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'scan' ? 'bg-white text-purple-600' : 
                ['location', 'minting', 'success'].includes(currentStep) ? 'bg-green-400 text-white' : 'bg-white/20 text-white/60'
              }`}>
                1
              </div>
              <div className="w-8 h-1 bg-white/20">
                <div className={`h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 ${
                  ['location', 'minting', 'success'].includes(currentStep) ? 'w-full' : 'w-0'
                }`}></div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'location' ? 'bg-white text-purple-600' : 
                ['minting', 'success'].includes(currentStep) ? 'bg-green-400 text-white' : 'bg-white/20 text-white/60'
              }`}>
                2
              </div>
              <div className="w-8 h-1 bg-white/20">
                <div className={`h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 ${
                  ['minting', 'success'].includes(currentStep) ? 'w-full' : 'w-0'
                }`}></div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'minting' ? 'bg-white text-purple-600' : 
                currentStep === 'success' ? 'bg-green-400 text-white' : 'bg-white/20 text-white/60'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step Labels */}
          <div className="flex items-center justify-between mb-8 text-center text-white/70 text-sm">
            <span className={currentStep === 'scan' ? 'text-white font-medium' : ''}>Scan QR Code</span>
            <span className={currentStep === 'location' ? 'text-white font-medium' : ''}>Verify Location</span>
            <span className={['minting', 'success'].includes(currentStep) ? 'text-white font-medium' : ''}>Mint SBT</span>
          </div>

          {/* Content */}
          {currentStep === 'scan' && (
            <QRScanner
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
              width={400}
              height={400}
            />
          )}

          {currentStep === 'location' && (
            <div className="glassmorphic rounded-xl p-8 liquid-morph text-center">
              <div className="text-6xl mb-6 spiral-animation">📍</div>
              <h3 className="text-xl font-bold text-white mb-4 groovy-font">
                Verifying Location
              </h3>
              <p className="text-white/80 mb-6">
                Checking that you're at the venue for your Miracle SBT...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </div>
          )}

          {currentStep === 'minting' && (
            <div className="glassmorphic rounded-xl p-8 liquid-morph text-center">
              <div className="text-6xl mb-6 breathe-animation">🎪</div>
              <h3 className="text-xl font-bold text-white mb-4 groovy-font">
                Minting Your Miracle SBT
              </h3>
              <p className="text-white/80 mb-6">
                Creating your soulbound token on the blockchain...
              </p>
              
              {/* Detailed status */}
              <div className="space-y-3 mb-6">
                <div className={`flex items-center justify-center space-x-2 ${
                  mintStatus === 'minting' ? 'text-yellow-300' : 'text-green-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    mintStatus === 'minting' ? 'bg-yellow-300 animate-pulse' : 'bg-green-300'
                  }`}></div>
                  <span className="text-sm">Transaction submitted</span>
                </div>
                
                <div className={`flex items-center justify-center space-x-2 ${
                  mintStatus === 'confirming' ? 'text-yellow-300' : 
                  mintStatus === 'success' ? 'text-green-300' : 'text-white/40'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    mintStatus === 'confirming' ? 'bg-yellow-300 animate-pulse' : 
                    mintStatus === 'success' ? 'bg-green-300' : 'bg-white/40'
                  }`}></div>
                  <span className="text-sm">Confirming on blockchain</span>
                </div>
              </div>
              
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="glassmorphic rounded-xl p-8 liquid-morph text-center">
              <div className="text-6xl mb-6 dancing-bear">🐻✨</div>
              <h3 className="text-2xl font-bold text-white mb-4 groovy-font">
                Welcome to the Family!
              </h3>
              <p className="text-white/80 mb-6">
                Your Miracle SBT has been minted successfully. You're now part of the NFA Bears community!
              </p>
              
              <div className="p-4 border border-green-400/30 bg-green-400/10 rounded-lg mb-6">
                <div className="flex items-center justify-center space-x-2 text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">Miracle SBT Minted</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3 px-6 aurora-gradient text-white font-medium rounded-lg magnetic-button transition-all"
                >
                  Go to Dashboard
                </button>
                
                <button
                  onClick={resetScan}
                  className="w-full py-2 px-6 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 transition-all"
                >
                  Scan Another Code
                </button>
              </div>
            </div>
          )}

          {/* Debug Info (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-black/20 rounded-lg border border-white/10">
              <h4 className="text-white font-medium mb-2 text-sm">Debug Info:</h4>
              <div className="text-white/60 text-xs space-y-1">
                <div>Step: {currentStep}</div>
                <div>Scanned: {scannedCode ? 'Yes' : 'No'}</div>
                <div>Location: {location ? 'Granted' : 'Pending'}</div>
                <div>Has Minted: {hasMinted ? 'Yes' : 'No'}</div>
                <div>Status: {mintStatus}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}