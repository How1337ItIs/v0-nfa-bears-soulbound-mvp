'use client';

import { useState } from 'react';
import { BigQRCode } from '@/components/BigQRCode';
import { CountdownCircle } from '@/components/CountdownCircle';
import { ErrorBoundary } from 'react-error-boundary';
import { allVenues } from '@/lib/venues';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}

function AmbassadorContent() {
  const [selectedVenue, setSelectedVenue] = useState('');
  const [url, setUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const venues = allVenues();

  const generateInvite = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ venueId: selectedVenue }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate invite');
      }
      
      const data = await response.json();
      setUrl(data.url);
      setExpiresAt(data.expiresAt);
    } catch (error) {
      console.error('Failed to generate invite:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate invite');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        // You might want to show a success toast here
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Ambassador Portal</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-4">
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
              Select Venue
            </label>
            <select
              id="venue"
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            >
              <option value="">Select a venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={generateInvite}
            disabled={isLoading || !selectedVenue}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate New Invite'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {url && expiresAt && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Invite QR Code</h2>
              <div className="flex flex-col items-center gap-4">
                <BigQRCode url={url} />
                <CountdownCircle
                  duration={60}
                  onComplete={() => {
                    setUrl(null);
                    setExpiresAt(null);
                  }}
                />
                <button
                  onClick={copyToClipboard}
                  className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AmbassadorPage() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <AmbassadorContent />
    </ErrorBoundary>
  );
}
