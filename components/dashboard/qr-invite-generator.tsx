'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface InviteData {
  code: string;
  qrUrl: string;
  expiresAt: number;
}

export function QRInviteGenerator() {
  const [selectedVenue, setSelectedVenue] = useState('local-dev');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentInvite, setCurrentInvite] = useState<InviteData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Update countdown timer
  useEffect(() => {
    if (!currentInvite) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = currentInvite.expiresAt - now;
      
      if (remaining <= 0) {
        setCurrentInvite(null);
        setTimeRemaining(0);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentInvite]);

  const generateInvite = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      console.log('Generating invite for venue:', selectedVenue);
      
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          venueId: selectedVenue
        })
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API success data:', { code: data.code?.substring(0, 20) + '...', hasQrUrl: !!data.qrUrl });
      
      setCurrentInvite({
        code: data.code,
        qrUrl: data.qrUrl,
        expiresAt: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes from now
      });

      toast.success('QR invite generated! Valid for 15 minutes.');
    } catch (error) {
      console.error('Error generating invite:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate invite');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const copyInviteLink = () => {
    if (!currentInvite) return;
    
    const inviteUrl = `${window.location.origin}/invite/${currentInvite.code}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite link copied to clipboard!');
  };

  const venues = [
    { id: 'local-dev', name: '🏠 Local Development', description: 'Testing venue' },
    { id: 'berkeley-art-museum', name: '🎨 Berkeley Art Museum', description: 'Berkeley, CA' },
    { id: 'sf-moma', name: '🏛️ SF MOMA', description: 'San Francisco, CA' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">📱</span>
          Generate QR Invite
        </h2>

        {!currentInvite ? (
          <div className="space-y-6">
            {/* Venue Selection */}
            <div>
              <label className="block text-white/80 mb-3 font-medium">
                Select Venue
              </label>
              <div className="grid gap-3">
                {venues.map(venue => (
                  <button
                    key={venue.id}
                    onClick={() => setSelectedVenue(venue.id)}
                    className={`p-4 rounded-xl text-left transition-all duration-200 ${
                      selectedVenue === venue.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold">{venue.name}</div>
                    <div className="text-sm opacity-80">{venue.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateInvite}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <span className="mr-2">⚡</span>
                  Generate Miracle Invite
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            {/* QR Code Display */}
            <div className="bg-white p-6 rounded-2xl mx-auto inline-block">
              <img 
                src={currentInvite.qrUrl} 
                alt="QR Invite Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            {/* Invite Info */}
            <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4">
              <div className="text-green-400 font-bold text-lg mb-2">
                Active Invite Code
              </div>
              <div className="font-mono text-white/80 mb-2 break-all">
                {currentInvite.code}
              </div>
              <div className="text-green-300">
                Expires in: {formatTimeRemaining(timeRemaining)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyInviteLink}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
              >
                📋 Copy Link
              </button>
              <button
                onClick={() => setCurrentInvite(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
              >
                🔄 New Invite
              </button>
            </div>

            {/* Instructions */}
            <div className="text-white/60 text-sm">
              <p className="mb-2">📱 <strong>Instructions:</strong></p>
              <p>1. Show this QR code to someone you want to onboard</p>
              <p>2. They scan it with their phone camera</p>
              <p>3. They'll be guided through the 60-Second Miracle flow</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
