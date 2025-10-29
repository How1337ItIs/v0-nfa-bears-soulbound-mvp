'use client'

export const dynamic = 'force-dynamic';

import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserType } from '@/lib/useUserType';

// Mock proposals for MVP - will be replaced with on-chain governance
const MOCK_PROPOSALS = [
  {
    id: 1,
    title: 'Host NFA Bears Night at The Fillmore',
    author: '0x742d...5f0bEb',
    authorName: 'SpiralOut',
    status: 'active',
    description: 'Organize a dedicated NFA Bears night at The Fillmore with local Dead cover bands. Estimated cost: $5k from treasury.',
    votesFor: 42,
    votesAgainst: 3,
    totalVotes: 45,
    quorum: 71, // 10% of 710 Genesis holders
    endsAt: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days
    category: 'events'
  },
  {
    id: 2,
    title: 'Partner with Shakedown Street Vendors Co-op',
    author: '0x8a9c...3d2eF1',
    authorName: 'TapeTrader',
    status: 'active',
    description: 'Establish official partnership with established lot vendors. They get verification tools, we get 15% discount network.',
    votesFor: 67,
    votesAgainst: 8,
    totalVotes: 75,
    quorum: 71,
    endsAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
    category: 'partnerships'
  },
  {
    id: 3,
    title: 'Donate 5% of Treasury to MAPS Research',
    author: '0x1f5a...9c4bD2',
    authorName: 'PsychedelicScholar',
    status: 'passed',
    description: 'Support MAPS (Multidisciplinary Association for Psychedelic Studies) with $11.8k donation from charity budget.',
    votesFor: 234,
    votesAgainst: 12,
    totalVotes: 246,
    quorum: 71,
    endsAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // ended 2 days ago
    category: 'charity'
  }
];

export default function ProposalsPage() {
  const { authenticated, ready } = usePrivy();
  const { address } = useAccount();
  const router = useRouter();
  const { isGenesisHolder, isSBTHolder, loading: userTypeLoading } = useUserType();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'passed' | 'failed'>('active');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, mounted, router]);

  if (!ready || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const filteredProposals = MOCK_PROPOSALS.filter(p =>
    filter === 'all' || p.status === filter
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🗳️</div>
          <h1 className="text-4xl font-bold text-white mb-2">Community Proposals</h1>
          <p className="text-purple-200 text-lg mb-2">
            "Nobody should have that" - Jerry Garcia
          </p>
          <p className="text-white/60">
            Collective decision-making in action. Everyone has a voice.
          </p>
        </div>

        {/* Governance Info */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/30 mb-8">
          <h3 className="text-white font-bold text-lg mb-3">How Governance Works</h3>
          <div className="space-y-2 text-white/90 text-sm">
            <p>• <strong>Genesis Holders:</strong> 1 vote per NFT (binding decisions)</p>
            <p>• <strong>SBT Members:</strong> Can propose and discuss (sentiment matters)</p>
            <p>• <strong>Quorum:</strong> 71 votes (10% of 710 Genesis Bears)</p>
            <p>• <strong>Philosophy:</strong> Clear (transparency), Rave (joy), Light (insight)</p>
          </div>
        </div>

        {/* Your Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Your Governance Status:</p>
              <p className="text-white font-semibold text-lg">
                {userTypeLoading ? 'Checking...' :
                 isGenesisHolder ? '✓ Genesis Holder - Full Voting Rights' :
                 isSBTHolder ? '✓ SBT Member - Can Propose & Discuss' :
                 'Connect wallet to participate'}
              </p>
            </div>
            {(isGenesisHolder || isSBTHolder) && (
              <Link
                href="/proposals/create"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                + New Proposal
              </Link>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['all', 'active', 'passed', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.map((proposal) => {
            const percentFor = proposal.totalVotes > 0
              ? (proposal.votesFor / proposal.totalVotes) * 100
              : 0;
            const hasQuorum = proposal.totalVotes >= proposal.quorum;
            const timeLeft = proposal.endsAt - Date.now();
            const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));

            return (
              <div
                key={proposal.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        proposal.status === 'active' ? 'bg-green-500/20 text-green-300' :
                        proposal.status === 'passed' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {proposal.status.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/70">
                        {proposal.category}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">{proposal.title}</h3>
                    <p className="text-white/80 text-sm">
                      Proposed by <span className="text-purple-300 font-semibold">{proposal.authorName}</span>
                      {proposal.status === 'active' && (
                        <span className="text-white/60"> • {daysLeft} days left to vote</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/90 mb-4">{proposal.description}</p>

                {/* Voting Stats */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-white/70 mb-2">
                    <span>For: {proposal.votesFor}</span>
                    <span>Against: {proposal.votesAgainst}</span>
                    <span>Total: {proposal.totalVotes}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                      style={{ width: `${percentFor}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>{percentFor.toFixed(1)}% approval</span>
                    <span className={hasQuorum ? 'text-green-400' : 'text-yellow-400'}>
                      {hasQuorum ? '✓ Quorum reached' : `${proposal.quorum - proposal.totalVotes} votes to quorum`}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {proposal.status === 'active' && (
                  <div className="flex gap-3">
                    {isGenesisHolder ? (
                      <>
                        <button className="flex-1 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all">
                          ✓ Vote For
                        </button>
                        <button className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all">
                          ✗ Vote Against
                        </button>
                      </>
                    ) : (
                      <div className="flex-1 py-2 px-4 bg-white/5 text-white/60 text-center rounded-lg border border-white/10">
                        {isSBTHolder ? 'SBT Members can discuss in Discord' : 'Genesis holders can vote'}
                      </div>
                    )}
                    <Link
                      href={`/proposals/${proposal.id}`}
                      className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all"
                    >
                      Discuss
                    </Link>
                  </div>
                )}

                {proposal.status === 'passed' && (
                  <div className="text-center py-2 bg-blue-600/20 text-blue-300 font-semibold rounded-lg border border-blue-400/30">
                    ✓ Passed - Implementation in progress
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredProposals.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/60">No {filter} proposals yet</p>
            {(isGenesisHolder || isSBTHolder) && (
              <Link
                href="/proposals/create"
                className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all"
              >
                Be the first to propose something!
              </Link>
            )}
          </div>
        )}

        {/* Call to Action */}
        {(isGenesisHolder || isSBTHolder) && (
          <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30 text-center">
            <h3 className="text-white font-bold text-lg mb-2">Have an idea for the community?</h3>
            <p className="text-white/80 mb-4">
              Propose a show, suggest a partnership, recommend a charity. This is YOUR collective.
            </p>
            <Link
              href="/proposals/create"
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              + Create Proposal
            </Link>
          </div>
        )}

        {/* Philosophy Footer */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-3">🧭 Governance Philosophy</h3>
          <div className="space-y-3 text-white/80 text-sm">
            <p>
              <strong className="text-purple-300">Clear (Transparency):</strong> All proposals are public. All votes are on-chain. Books are open.
            </p>
            <p>
              <strong className="text-purple-300">Rave (Collective Joy):</strong> We're building what makes us happy, together. Not a corporation, a family.
            </p>
            <p>
              <strong className="text-purple-300">Light (Insight):</strong> Good ideas can come from anywhere. Listen with open mind. Decide with open heart.
            </p>
            <p className="italic text-white/60 pt-2 border-t border-white/10">
              "Nobody should have that... You don't want to be the king." - Jerry Garcia
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
