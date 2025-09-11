'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useMintSBT } from '@/lib/useMintSBT';
import { toast } from 'react-hot-toast';
import { ClientOnlyQRScanner } from '@/components/ClientOnlyQRScanner';

export default function ScanPage() {
  const router = useRouter();
  const { authenticated, ready, login } = usePrivy();
  const { mintWithCode, isLoading, hasMinted, mintStatus } = useMintSBT();
  
  const [currentStep, setCurrentStep] = useState<'scan' | 'location' | 'minting' | 'success'>('scan');
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  // Handle QR code scan success
  const handleScanSuccess = async (decodedText: string) => {
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
          toast.error('Might want to watch out - we need your location for this to work');
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
      toast.error('Hold on there, friend - we need your wallet connected to get everything just exactly perfect!');
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
      setCurrentStep('scan');
      setScannedCode(null);
    }
  };

  // Handle scan error
  const handleScanError = (error: string) => {
    toast.error('Things are really weird up here - scanner malfunction!');
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
    <div className="min-h-screen tie-dye-bg relative overflow-hidden">
      {/* Psychedelic Oil Projection Background */}
      <div className="absolute inset-0 oil-projection-bg opacity-40"></div>
      
      {/* Floating Lava Lamp Blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 psychedelic-gradient-1 oil-blob"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 psychedelic-gradient-2 oil-blob-2" style={{ animationDelay: "5s" }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 psychedelic-gradient-3 oil-blob-3" style={{ animationDelay: "10s" }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 psychedelic-gradient-1 oil-blob" style={{ animationDelay: "15s" }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header - Psychedelic Style */}
          <div className="text-center mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-white/70 hover:text-white mb-4 transition-colors syrupy-button"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-white groovy-font mb-2 psychedelic-text">
              60-Second Miracle
            </h1>
            <p className="text-white/80 liquid-chrome">
              Scan your invite QR code to join the NFA Bears family
            </p>
          </div>

          {/* Progress Steps - Oil Blob Style */}
          <div className="flex items-center justify-center mb-6 px-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className={`w-6 sm:w-8 h-6 sm:h-8 oil-blob flex items-center justify-center text-xs sm:text-sm font-medium ${
                currentStep === 'scan' ? 'psychedelic-gradient-1 text-white' : 
                ['location', 'minting', 'success'].includes(currentStep) ? 'psychedelic-gradient-2 text-white' : 'bg-white/20 text-white/60'
              }`}>
                1
              </div>
              <div className="w-4 sm:w-8 h-1 bg-white/20 oil-blob-2">
                <div className={`h-full psychedelic-gradient-1 transition-all duration-500 ${
                  ['location', 'minting', 'success'].includes(currentStep) ? 'w-full' : 'w-0'
                }`}></div>
              </div>
              <div className={`w-6 sm:w-8 h-6 sm:h-8 oil-blob-3 flex items-center justify-center text-xs sm:text-sm font-medium ${
                currentStep === 'location' ? 'psychedelic-gradient-1 text-white' : 
                ['minting', 'success'].includes(currentStep) ? 'psychedelic-gradient-2 text-white' : 'bg-white/20 text-white/60'
              }`}>
                2
              </div>
              <div className="w-4 sm:w-8 h-1 bg-white/20 oil-blob">
                <div className={`h-full psychedelic-gradient-2 transition-all duration-500 ${
                  ['minting', 'success'].includes(currentStep) ? 'w-full' : 'w-0'
                }`}></div>
              </div>
              <div className={`w-6 sm:w-8 h-6 sm:h-8 oil-blob-2 flex items-center justify-center text-xs sm:text-sm font-medium ${
                currentStep === 'minting' ? 'psychedelic-gradient-1 text-white' : 
                currentStep === 'success' ? 'psychedelic-gradient-2 text-white' : 'bg-white/20 text-white/60'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step Labels - Liquid Chrome Style */}
          <div className="flex items-center justify-between mb-8 text-center text-white/70 text-xs sm:text-sm px-4">
            <span className={`${currentStep === 'scan' ? 'text-white font-medium liquid-chrome' : ''} truncate`}>Scan QR</span>
            <span className={`${currentStep === 'location' ? 'text-white font-medium liquid-chrome' : ''} truncate`}>Verify Location</span>
            <span className={`${['minting', 'success'].includes(currentStep) ? 'text-white font-medium liquid-chrome' : ''} truncate`}>Mint SBT</span>
          </div>

          {/* Content */}
          {currentStep === 'scan' && (
            <div className="px-2 relative">
              {/* Kaleidoscope Frame */}
              <div className="relative mx-auto w-fit">
                {/* Outer Kaleidoscope Ring */}
                <div className="absolute inset-0 w-full h-full kaleidoscope oil-blob-2 opacity-60 scale-110"></div>
                
                {/* Middle Ring */}
                <div className="absolute inset-2 w-full h-full psychedelic-gradient-1 oil-blob-3 opacity-40 scale-105"></div>
                
                {/* Inner Ring */}
                <div className="absolute inset-4 w-full h-full psychedelic-gradient-2 oil-blob opacity-30 scale-100"></div>
                
                {/* QR Scanner Container */}
                <div className="relative z-10 oil-glassmorphic oil-blob-2 p-4">
                  <ClientOnlyQRScanner
                    onScanSuccess={handleScanSuccess}
                    onScanError={handleScanError}
                    width={300}
                    height={300}
                    className="max-w-full"
                  />
                </div>
                
                {/* Floating Oil Droplets around scanner */}
                <div className="absolute -top-4 -right-4 w-6 h-6 psychedelic-gradient-3 oil-blob-2 opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-4 h-4 psychedelic-gradient-1 oil-blob-3 opacity-50"></div>
                <div className="absolute top-1/2 -left-6 w-3 h-3 psychedelic-gradient-2 oil-blob opacity-40"></div>
                <div className="absolute top-1/2 -right-6 w-5 h-5 psychedelic-gradient-3 oil-blob-2 opacity-45"></div>
              </div>
            </div>
          )}

          {currentStep === 'location' && (
            <div className="oil-glassmorphic oil-blob-2 p-8 text-center relative overflow-hidden">
              {/* Kaleidoscope Background */}
              <div className="absolute inset-0 kaleidoscope opacity-20"></div>
              
              <div className="text-6xl mb-6 spiral-animation psychedelic-shimmer relative z-10">📍</div>
              <h3 className="text-xl font-bold text-white mb-4 groovy-font liquid-chrome relative z-10">
                Verifying Location
              </h3>
              <p className="text-white/80 mb-6 relative z-10">
                Checking that you're at the venue for your Miracle SBT...
              </p>
              <div className="w-8 h-8 psychedelic-gradient-1 oil-blob animate-spin mx-auto relative z-10"></div>
            </div>
          )}

          {currentStep === 'minting' && (
            <div className="oil-glassmorphic oil-blob-3 p-8 text-center relative overflow-hidden">
              {/* Kaleidoscope Background */}
              <div className="absolute inset-0 kaleidoscope opacity-20"></div>
              
              <div className="text-6xl mb-6 breathe-animation psychedelic-shimmer relative z-10">🎪</div>
              <h3 className="text-xl font-bold text-white mb-4 groovy-font liquid-chrome relative z-10">
                Minting Your Miracle SBT
              </h3>
              <p className="text-white/80 mb-6 relative z-10">
                Creating your soulbound token on the blockchain...
              </p>
              
              {/* Detailed status - Oil Blob Style */}
              <div className="space-y-3 mb-6 relative z-10">
                <div className={`flex items-center justify-center space-x-2 ${
                  mintStatus === 'minting' ? 'text-yellow-300' : 'text-green-300'
                }`}>
                  <div className={`w-3 h-3 oil-blob-2 ${
                    mintStatus === 'minting' ? 'psychedelic-gradient-2 animate-pulse' : 'psychedelic-gradient-1'
                  }`}></div>
                  <span className="text-sm liquid-chrome">Transaction submitted</span>
                </div>
                
                <div className={`flex items-center justify-center space-x-2 ${
                  mintStatus === 'confirming' ? 'text-yellow-300' : 
                  mintStatus === 'success' ? 'text-green-300' : 'text-white/40'
                }`}>
                  <div className={`w-3 h-3 oil-blob-3 ${
                    mintStatus === 'confirming' ? 'psychedelic-gradient-2 animate-pulse' : 
                    mintStatus === 'success' ? 'psychedelic-gradient-1' : 'bg-white/40'
                  }`}></div>
                  <span className="text-sm liquid-chrome">Confirming on blockchain</span>
                </div>
              </div>
              
              <div className="w-8 h-8 psychedelic-gradient-3 oil-blob animate-spin mx-auto relative z-10"></div>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="oil-glassmorphic oil-blob p-8 text-center relative overflow-hidden">
              {/* Kaleidoscope Background */}
              <div className="absolute inset-0 kaleidoscope opacity-20"></div>
              
              <div className="text-6xl mb-6 dancing-bear psychedelic-shimmer relative z-10">🐻✨</div>
              <h3 className="text-2xl font-bold text-white mb-4 groovy-font psychedelic-text relative z-10">
                Welcome to the Family!
              </h3>
              <p className="text-white/80 mb-6 relative z-10">
                Your Miracle SBT has been minted successfully. You're now part of the NFA Bears community!
              </p>
              
              <div className="p-4 psychedelic-gradient-1 oil-blob-2 mb-6 relative z-10">
                <div className="flex items-center justify-center space-x-2 text-white">
                  <div className="w-3 h-3 psychedelic-gradient-2 oil-blob-3"></div>
                  <span className="text-sm font-medium liquid-chrome">Miracle SBT Minted</span>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3 px-6 psychedelic-gradient-1 oil-blob text-white font-medium syrupy-button"
                >
                  <span className="liquid-chrome">Go to Dashboard</span>
                </button>
                
                <button
                  onClick={resetScan}
                  className="w-full py-2 px-6 psychedelic-gradient-2 oil-blob-2 text-white/80 syrupy-button"
                >
                  <span className="liquid-chrome">Scan Another Code</span>
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
