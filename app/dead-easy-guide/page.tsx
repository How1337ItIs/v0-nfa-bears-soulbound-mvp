'use client';

import { useAccount } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';

export default function DeadEasyGuidePage() {
  const { address } = useAccount();
  const { authenticated } = usePrivy();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🐻</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the NFA Bears Family!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your Miracle SBT is your key to authentic community, vendor discounts, and preserving Deadhead parking lot culture in the digital age.
          </p>
        </div>

        {/* Core Benefits */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Vendor Discounts */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Vendor Discounts</h3>
            <p className="text-gray-600 mb-4">
              Your SBT gives you exclusive discounts at participating vendors. Genesis holders get even better rates! Show your membership at checkout or use your wallet address for online purchases.
            </p>
            <div className="text-sm text-gray-500">
              Pro tip: Keep your wallet handy when shopping with community vendors
            </div>
          </div>

          {/* Community Access */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-2-4H9m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Discord Community</h3>
            <p className="text-gray-600 mb-4">
              Join our vibrant Discord server where the real conversations happen. Share tour stories, connect with other Heads, and stay updated on events.
            </p>
            <a
              href="https://discord.gg/nfabears"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Join Discord →
            </a>
          </div>

          {/* POAT Collection */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Collect POATs</h3>
            <p className="text-gray-600 mb-4">
              Proof of Attendance Tokens (POATs) commemorate your presence at shows, meetups, and community events. Each one tells a story and builds your on-chain legacy.
            </p>
            <div className="text-sm text-gray-500">
              Look for QR codes at events to claim your POATs
            </div>
          </div>

          {/* Cultural Foundation */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">The Pill Triad Philosophy</h3>
            <p className="text-gray-600 mb-4">
              <strong>Clear</strong> (transparency), <strong>Rave</strong> (joy), <strong>Light</strong> (insight). We preserve authentic Deadhead parking lot culture through technology, not speculation.
            </p>
            <div className="text-sm text-gray-500">
              "Fuck crypto, real family shit" - this is about community, not coins
            </div>
          </div>

        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-6">How Your SBT Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎫</span>
              </div>
              <h4 className="font-semibold mb-2">Soul-Bound</h4>
              <p className="text-sm text-white/80">
                Your SBT can't be sold or transferred. It represents your authentic connection to the community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h4 className="font-semibold mb-2">GPS-Verified</h4>
              <p className="text-sm text-white/80">
                Your membership was verified through our "60-Second Miracle" GPS system - proving real-world connection.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h4 className="font-semibold mb-2">On-Chain Forever</h4>
              <p className="text-sm text-white/80">
                Your membership lives on Berachain, preserving your place in the community permanently.
              </p>
            </div>

          </div>
        </div>

        {/* Growth Path */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Journey Forward</h2>
          <div className="space-y-4">
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-medium text-green-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Start Using Discounts</h4>
                <p className="text-gray-600 text-sm">Look for the NFA Bears logo at participating vendors and present your wallet for verification.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-medium text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Join Discord Conversations</h4>
                <p className="text-gray-600 text-sm">Connect with other community members, share experiences, and stay updated on events.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-medium text-purple-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Attend Events & Collect POATs</h4>
                <p className="text-gray-600 text-sm">Build your on-chain story by attending shows and community gatherings.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-medium text-yellow-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Consider Genesis Upgrade</h4>
                <p className="text-gray-600 text-sm">Genesis Bears get enhanced discounts, DAO voting rights, and the ability to bring new members.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Explore?</h2>
          <p className="text-gray-600 mb-8">
            Your membership dashboard has everything you need to track benefits, view POATs, and manage your community experience.
          </p>
          <div className="space-x-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Questions? Reach out in <a href="https://discord.gg/nfabears" className="text-blue-600 hover:text-blue-700">Discord</a> or check your dashboard for more resources.
          </p>
        </div>

      </div>
    </div>
  );
}
