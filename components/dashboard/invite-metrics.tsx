'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface InviteStats {
  totalInvitesGenerated: number;
  totalRedemptions: number;
  successfulMints: number;
  conversionRate: number;
  recentActivity: Array<{
    date: string;
    action: 'invite_generated' | 'invite_redeemed' | 'sbt_minted';
    code?: string;
    venue?: string;
  }>;
}

export function InviteMetrics() {
  const { address } = useAccount();
  const [stats, setStats] = useState<InviteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('30d');

  // Mock data for now - would integrate with backend analytics
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with real API call
      setStats({
        totalInvitesGenerated: 12,
        totalRedemptions: 8,
        successfulMints: 6,
        conversionRate: 75, // (6/8) * 100
        recentActivity: [
          { date: '2025-09-08', action: 'sbt_minted', code: 'ABC123', venue: 'berkeley-art-museum' },
          { date: '2025-09-08', action: 'invite_redeemed', code: 'XYZ789', venue: 'sf-moma' },
          { date: '2025-09-07', action: 'invite_generated', venue: 'local-dev' },
          { date: '2025-09-06', action: 'sbt_minted', code: 'DEF456', venue: 'berkeley-art-museum' },
          { date: '2025-09-05', action: 'invite_generated', venue: 'sf-moma' },
        ]
      });
      
      setLoading(false);
    };

    if (address) {
      fetchStats();
    }
  }, [address, timeframe]);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="h-20 bg-white/20 rounded"></div>
            <div className="h-20 bg-white/20 rounded"></div>
            <div className="h-20 bg-white/20 rounded"></div>
          </div>
          <div className="h-48 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="text-center text-white/60">
          <div className="text-4xl mb-4">📊</div>
          <p>No metrics available yet.</p>
          <p className="text-sm mt-2">Generate some invites to see your impact!</p>
        </div>
      </div>
    );
  }

  const getActionIcon = (action: InviteStats['recentActivity'][0]['action']) => {
    switch (action) {
      case 'invite_generated': return '📱';
      case 'invite_redeemed': return '👀';
      case 'sbt_minted': return '🎉';
      default: return '📝';
    }
  };

  const getActionText = (activity: InviteStats['recentActivity'][0]) => {
    switch (activity.action) {
      case 'invite_generated':
        return `Generated invite for ${activity.venue}`;
      case 'invite_redeemed':
        return `Someone scanned invite ${activity.code?.slice(0, 8)}... at ${activity.venue}`;
      case 'sbt_minted':
        return `New member onboarded with ${activity.code?.slice(0, 8)}... at ${activity.venue}`;
      default:
        return 'Unknown activity';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-3">📊</span>
            Invite Metrics
          </h2>
          
          <div className="flex bg-white/10 rounded-lg p-1">
            {(['7d', '30d', 'all'] as const).map(period => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 text-sm rounded font-medium transition-all duration-200 ${
                  timeframe === period
                    ? 'bg-purple-600 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {period === 'all' ? 'All Time' : period.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-500/20 border border-blue-500/40 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {stats.totalInvitesGenerated}
            </div>
            <div className="text-blue-300 text-sm">Invites Generated</div>
          </div>
          
          <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {stats.totalRedemptions}
            </div>
            <div className="text-yellow-300 text-sm">Scanned</div>
          </div>
          
          <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {stats.successfulMints}
            </div>
            <div className="text-green-300 text-sm">Members Onboarded</div>
          </div>
          
          <div className="bg-purple-500/20 border border-purple-500/40 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {stats.conversionRate}%
            </div>
            <div className="text-purple-300 text-sm">Conversion Rate</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="mr-2">⏰</span>
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">
                      {getActionIcon(activity.action)}
                    </div>
                    <div>
                      <div className="text-white/90 text-sm">
                        {getActionText(activity)}
                      </div>
                      <div className="text-white/50 text-xs">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {activity.action === 'sbt_minted' && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Success!
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-white/60 py-8">
                <div className="text-4xl mb-2">🕐</div>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Impact Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
          <div className="text-center">
            <div className="text-white font-semibold mb-2">
              🌟 Your Community Impact
            </div>
            <div className="text-white/80 text-sm">
              You've helped onboard {stats.successfulMints} new members to the NFA Bears family! 
              Keep spreading the magic with more QR invites.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}