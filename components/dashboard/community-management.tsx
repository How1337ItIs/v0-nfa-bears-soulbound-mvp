'use client';

import { useState } from 'react';
import { useGenesisBears } from '@/lib/useGenesisBears';
import { toast } from 'react-hot-toast';

interface CommunityMember {
  address: string;
  joinDate: string;
  sbtTokenId: string;
  onboardedBy: string;
  status: 'active' | 'inactive';
  events: number;
}

export function CommunityManagement() {
  const { tokenIds, isHolder } = useGenesisBears();
  const [activeTab, setActiveTab] = useState<'members' | 'governance' | 'events'>('members');
  const [loading, setLoading] = useState(false);

  // Mock community members data
  const members: CommunityMember[] = [
    {
      address: '0x1234...5678',
      joinDate: '2025-09-08',
      sbtTokenId: '42',
      onboardedBy: 'Your Genesis #1',
      status: 'active',
      events: 3
    },
    {
      address: '0xabcd...efgh',
      joinDate: '2025-09-07',
      sbtTokenId: '41',
      onboardedBy: 'Your Genesis #1',
      status: 'active',
      events: 1
    },
    {
      address: '0x9876...5432',
      joinDate: '2025-09-06',
      sbtTokenId: '40',
      onboardedBy: 'Your Genesis #2',
      status: 'inactive',
      events: 0
    }
  ];

  const handleCreateProposal = () => {
    toast('Governance proposals coming soon! This will integrate with DAO tooling.');
  };

  const handleScheduleEvent = () => {
    toast('Event scheduling coming soon! This will integrate with POAT system.');
  };

  if (!isHolder) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="text-center text-white/60">
          <div className="text-4xl mb-4">🔒</div>
          <p>Genesis holders only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">👥</span>
          Community Management
        </h2>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-white/10 rounded-lg p-1">
          {(['members', 'governance', 'events'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 capitalize ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-white/80">
                <span className="font-semibold">{members.length}</span> members onboarded by your Genesis Bears
              </div>
              <div className="text-sm text-green-400">
                +{members.filter(m => new Date(m.joinDate) > new Date(Date.now() - 7*24*60*60*1000)).length} this week
              </div>
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        member.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <div className="text-white font-medium">
                          {member.address}
                        </div>
                        <div className="text-white/60 text-sm">
                          Joined {new Date(member.joinDate).toLocaleDateString()} • 
                          SBT #{member.sbtTokenId} • 
                          {member.events} events attended
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 text-sm font-medium">
                        {member.onboardedBy}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        member.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {member.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Member Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-blue-500/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {members.filter(m => m.status === 'active').length}
                </div>
                <div className="text-blue-300 text-sm">Active</div>
              </div>
              <div className="text-center p-3 bg-green-500/20 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {members.reduce((sum, m) => sum + m.events, 0)}
                </div>
                <div className="text-green-300 text-sm">Total Events</div>
              </div>
              <div className="text-center p-3 bg-purple-500/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {(members.filter(m => m.status === 'active').length / members.length * 100).toFixed(0)}%
                </div>
                <div className="text-purple-300 text-sm">Retention</div>
              </div>
            </div>
          </div>
        )}

        {/* Governance Tab */}
        {activeTab === 'governance' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🗳️</div>
              <h3 className="text-xl font-bold text-white mb-2">DAO Governance</h3>
              <p className="text-white/70 mb-6">
                As a Genesis holder, you have voting rights in community decisions
              </p>
            </div>

            {/* Voting Power */}
            <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-4">
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-lg mb-2">
                  Your Voting Power
                </div>
                <div className="text-3xl font-bold text-yellow-300 mb-1">
                  {tokenIds.length}
                </div>
                <div className="text-yellow-300/80 text-sm">
                  Votes (1 per Genesis Bear)
                </div>
              </div>
            </div>

            {/* Governance Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleCreateProposal}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all duration-200 text-left"
              >
                <div className="text-2xl mb-2">📝</div>
                <div className="text-white font-semibold mb-1">Create Proposal</div>
                <div className="text-white/60 text-sm">
                  Submit new governance proposals
                </div>
              </button>

              <button
                onClick={() => toast('Active proposals will appear here')}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all duration-200 text-left"
              >
                <div className="text-2xl mb-2">🗳️</div>
                <div className="text-white font-semibold mb-1">Active Votes</div>
                <div className="text-white/60 text-sm">
                  View and vote on proposals
                </div>
              </button>
            </div>

            {/* Recent Governance Activity */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Recent Activity</h4>
              <div className="text-center text-white/60 py-8">
                <div className="text-4xl mb-2">🏛️</div>
                <p>No governance activity yet</p>
                <p className="text-sm mt-1">Be the first to create a proposal!</p>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-bold text-white mb-2">Event Management</h3>
              <p className="text-white/70 mb-6">
                Organize shows and distribute POATs to the community
              </p>
            </div>

            {/* Event Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleScheduleEvent}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all duration-200 text-left"
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="text-white font-semibold mb-1">Schedule Event</div>
                <div className="text-white/60 text-sm">
                  Plan a show or gathering
                </div>
              </button>

              <button
                onClick={() => toast('POAT management coming soon')}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all duration-200 text-left"
              >
                <div className="text-2xl mb-2">🎟️</div>
                <div className="text-white font-semibold mb-1">Manage POATs</div>
                <div className="text-white/60 text-sm">
                  Create attendance NFTs
                </div>
              </button>
            </div>

            {/* Upcoming Events */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Upcoming Events</h4>
              <div className="text-center text-white/60 py-8">
                <div className="text-4xl mb-2">🗓️</div>
                <p>No events scheduled</p>
                <p className="text-sm mt-1">Schedule your first community event!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}