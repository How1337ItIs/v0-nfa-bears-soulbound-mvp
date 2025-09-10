'use client';

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-hot-toast';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen tie-dye-bg flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="glassmorphic rounded-xl p-8 liquid-morph">
          <div className="text-6xl mb-6 spiral-animation">💫</div>
          <h1 className="text-2xl font-bold text-white mb-4 groovy-font">
            Something went sideways
          </h1>
          <p className="text-white/80 mb-6 text-sm">
            Don't worry, the show must go on. We've captured this error and the dev bears are on it.
          </p>
          
          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm font-mono break-all">
              {error.message}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetErrorBoundary}
              className="w-full py-3 px-6 aurora-gradient text-white font-medium rounded-lg magnetic-button transition-all"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-2 px-6 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 transition-all"
            >
              Go Home
            </button>
          </div>
          
          <div className="mt-6 p-4 border border-white/20 rounded-lg bg-white/5">
            <h4 className="text-white font-medium mb-2 text-sm">What can you do?</h4>
            <ul className="text-white/70 text-xs space-y-1 text-left">
              <li>• Try refreshing the page</li>
              <li>• Check your internet connection</li>
              <li>• Make sure your wallet is connected</li>
              <li>• Contact support if this persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function ErrorBoundary({ 
  children, 
  fallback: Fallback = ErrorFallback,
  onError 
}: ErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }
    
    // Show toast notification
    toast.error('Something went wrong. Please try again.');
    
    // Custom error handler
    onError?.(error, errorInfo);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={Fallback}
      onError={handleError}
      onReset={() => {
        // Clear any state that might be causing the error
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// Specific error boundaries for different components
export function Web3ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <div className="glassmorphic rounded-xl p-8 liquid-morph text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-xl font-bold text-white mb-4 groovy-font">
            Web3 Connection Issue
          </h3>
          <p className="text-white/80 mb-6 text-sm">
            There was a problem connecting to the blockchain. This might be a temporary network issue.
          </p>
          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-xs">{error.message}</p>
          </div>
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-2 aurora-gradient text-white rounded-lg magnetic-button transition-all font-medium"
          >
            Reconnect to Web3
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export function QRScannerErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <div className="glassmorphic rounded-xl p-8 liquid-morph text-center">
          <div className="text-4xl mb-4">📷</div>
          <h3 className="text-xl font-bold text-white mb-4 groovy-font">
            Camera Scanner Error
          </h3>
          <p className="text-white/80 mb-6 text-sm">
            The QR code scanner encountered an issue. Please check your camera permissions.
          </p>
          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-xs">{error.message}</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={resetErrorBoundary}
              className="w-full px-6 py-2 aurora-gradient text-white rounded-lg magnetic-button transition-all font-medium"
            >
              Restart Scanner
            </button>
            <button
              onClick={() => window.location.href = '/ambassador'}
              className="w-full px-6 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 transition-all"
            >
              Generate QR Instead
            </button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// Loading boundary for async operations
export function LoadingBoundary({ 
  children, 
  loading, 
  error,
  retry,
  loadingText = "Loading...",
  errorText = "Something went wrong"
}: {
  children: React.ReactNode;
  loading: boolean;
  error?: string | null;
  retry?: () => void;
  loadingText?: string;
  errorText?: string;
}) {
  if (loading) {
    return (
      <div className="glassmorphic rounded-xl p-8 liquid-morph text-center">
        <div className="text-4xl mb-4 float-animation">🎪</div>
        <h3 className="text-xl font-bold text-white mb-4 groovy-font">
          {loadingText}
        </h3>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glassmorphic rounded-xl p-8 liquid-morph text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-white mb-4 groovy-font">
          {errorText}
        </h3>
        <p className="text-white/80 mb-6 text-sm">{error}</p>
        {retry && (
          <button
            onClick={retry}
            className="px-6 py-2 aurora-gradient text-white rounded-lg magnetic-button transition-all font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
