'use client'

import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">

        {/* Success Animation */}
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to the Family!
          </h1>
          <p className="text-2xl text-purple-200">
            You're officially a Genesis Bear 🐻
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-white font-bold text-2xl mb-4">What Happens Next?</h2>

          <div className="space-y-4 text-left">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📧</span>
              <div>
                <h3 className="text-white font-semibold text-lg">Check Your Email</h3>
                <p className="text-white/80">You'll receive a confirmation with your NFT details</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-3xl">🎁</span>
              <div>
                <h3 className="text-white font-semibold text-lg">Gift Box Shipping</h3>
                <p className="text-white/80">If you're in the first 100, your gift box ships in 2-4 weeks</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-3xl">💬</span>
              <div>
                <h3 className="text-white font-semibold text-lg">Join the Community</h3>
                <p className="text-white/80">Head to Discord to connect with fellow Bears</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-3xl">🗳️</span>
              <div>
                <h3 className="text-white font-semibold text-lg">Governance Access</h3>
                <p className="text-white/80">You now have voting rights in the DAO</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/dashboard"
            className="bg-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-purple-700 transition-all"
          >
            Go to Dashboard
          </Link>

          <a
            href="https://discord.gg/nfabears"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all"
          >
            Join Discord
          </a>

          <Link
            href="/"
            className="bg-white/20 text-white font-bold py-4 px-6 rounded-xl hover:bg-white/30 transition-all"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-white/60 text-sm">
          <p>🐻 Not Fade Away 🐻</p>
        </div>
      </div>
    </div>
  )
}
