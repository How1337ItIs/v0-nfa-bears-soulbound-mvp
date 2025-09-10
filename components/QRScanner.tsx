'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  width?: number;
  height?: number;
  fps?: number;
  className?: string;
}

export default function QRScanner({ 
  onScanSuccess, 
  onScanError,
  width = 300,
  height = 300,
  fps = 10,
  className = '' 
}: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: width },
          height: { ideal: height }
        } 
      });
      
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setError(null);
      return true;
    } catch (err) {
      console.error('Camera permission denied:', err);
      setHasPermission(false);
      setError('Camera access is required to scan QR codes. Please allow camera permission and try again.');
      return false;
    }
  }, [width, height]);

  // Initialize scanner
  const initializeScanner = useCallback(async () => {
    if (!elementRef.current || scannerRef.current) return;

    const config = {
      fps,
      qrbox: {
        width: Math.min(250, width * 0.8),
        height: Math.min(250, height * 0.8)
      },
      aspectRatio: 1.0,
      disableFlip: false,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
      defaultZoomValueIfSupported: 1,
      useBarCodeDetectorIfSupported: true,
      rememberLastUsedCamera: true,
      // Styling
      videoConstraints: {
        facingMode: 'environment'
      }
    };

    try {
      const scanner = new Html5QrcodeScanner(
        elementRef.current.id,
        config,
        false // verbose logging disabled in production
      );

      const handleScanSuccess = (decodedText: string, decodedResult: any) => {
        console.log('🔍 QR Code scanned:', decodedText);
        setIsScanning(false);
        
        // Validate the scanned code format
        if (decodedText.includes(':') && decodedText.split(':').length >= 4) {
          onScanSuccess(decodedText);
          toast.success('QR code scanned successfully!');
        } else {
          setError('Invalid QR code format. Please scan a valid NFA Bears invite code.');
          onScanError?.('Invalid QR code format');
        }
      };

      const handleScanError = (errorMessage: string) => {
        // Only log serious errors, not scanning attempts
        if (!errorMessage.includes('NotFoundException') && 
            !errorMessage.includes('No MultiFormat Readers were able')) {
          console.warn('QR Scanner error:', errorMessage);
        }
      };

      scanner.render(handleScanSuccess, handleScanError);
      scannerRef.current = scanner;
      setIsScanning(true);
      setError(null);

    } catch (err) {
      console.error('Failed to initialize QR scanner:', err);
      setError('Failed to initialize camera scanner. Please check your camera settings.');
      onScanError?.('Scanner initialization failed');
    }
  }, [fps, width, height, onScanSuccess, onScanError]);

  // Cleanup scanner
  const cleanupScanner = useCallback(() => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.warn('Error cleaning up scanner:', err);
      }
    }
  }, []);

  // Start scanning
  const startScanning = useCallback(async () => {
    setError(null);
    
    if (hasPermission === null) {
      const permitted = await requestCameraPermission();
      if (!permitted) return;
    }
    
    if (hasPermission === false) {
      await requestCameraPermission();
      return;
    }

    await initializeScanner();
  }, [hasPermission, requestCameraPermission, initializeScanner]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    cleanupScanner();
  }, [cleanupScanner]);

  // Initialize on mount
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Check if camera is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera not supported on this device');
      return;
    }

    // Auto-start scanning if we have permission
    if (hasPermission) {
      initializeScanner();
    }

    return () => {
      cleanupScanner();
    };
  }, [hasPermission, initializeScanner, cleanupScanner]);

  return (
    <div className={`relative ${className}`}>
      <div className="glassmorphic rounded-xl p-6 liquid-morph">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white mb-2 groovy-font">
            Scan Miracle Invite
          </h3>
          <p className="text-white/80 text-sm">
            Point your camera at the QR code to join the NFA Bears family
          </p>
        </div>

        {/* Scanner Container */}
        <div className="relative bg-black/20 rounded-lg overflow-hidden border border-white/20">
          {error ? (
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 text-center min-h-[250px] sm:min-h-[300px]">
              <div className="text-4xl mb-4">📷</div>
              <p className="text-red-300 mb-4 text-sm">{error}</p>
              <button
                onClick={startScanning}
                className="px-4 sm:px-6 py-2 aurora-gradient text-white rounded-lg magnetic-button transition-all font-medium text-sm"
              >
                {hasPermission === false ? 'Grant Camera Permission' : 'Try Again'}
              </button>
            </div>
          ) : hasPermission === null ? (
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 text-center min-h-[250px] sm:min-h-[300px]">
              <div className="text-4xl mb-4 float-animation">🎪</div>
              <p className="text-white/80 mb-4 text-sm">
                We need camera access to scan QR codes for your Miracle SBT
              </p>
              <button
                onClick={requestCameraPermission}
                className="px-4 sm:px-6 py-2 aurora-gradient text-white rounded-lg magnetic-button transition-all font-medium text-sm"
              >
                Enable Camera
              </button>
            </div>
          ) : (
            <div>
              <div 
                id="qr-scanner" 
                ref={elementRef}
                className="w-full"
                style={{ 
                  minHeight: 250 
                }}
              />
              
              {/* Scanner overlay with dancing bears */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-white/60 text-xs">
                    Looking for QR code...
                  </div>
                  
                  {/* Corner markers */}
                  <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-4 sm:w-6 h-4 sm:h-6 border-l-2 border-t-2 border-white/60"></div>
                  <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-4 sm:w-6 h-4 sm:h-6 border-r-2 border-t-2 border-white/60"></div>
                  <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-4 sm:w-6 h-4 sm:h-6 border-l-2 border-b-2 border-white/60"></div>
                  <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-4 sm:w-6 h-4 sm:h-6 border-r-2 border-b-2 border-white/60"></div>
                  
                  {/* Dancing bears in corners */}
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 text-sm sm:text-lg float-animation">🐻</div>
                  <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 text-sm sm:text-lg breathe-animation">✨</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mt-4">
          {isScanning ? (
            <button
              onClick={stopScanning}
              className="px-6 py-2 bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all font-medium"
            >
              Stop Scanning
            </button>
          ) : hasPermission && !error ? (
            <button
              onClick={startScanning}
              className="px-6 py-2 aurora-gradient text-white rounded-lg magnetic-button transition-all font-medium"
            >
              Start Scanning
            </button>
          ) : null}
        </div>

        {/* Instructions */}
        <div className="mt-4 p-4 border border-white/20 rounded-lg bg-white/5">
          <h4 className="text-white font-medium mb-2 text-sm">How to scan:</h4>
          <ul className="text-white/70 text-xs space-y-1">
            <li>• Hold your device steady</li>
            <li>• Ensure good lighting</li>
            <li>• Point camera at the QR code</li>
            <li>• Wait for automatic detection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
