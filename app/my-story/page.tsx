'use client'

export const dynamic = 'force-dynamic';

import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyStoryPage() {
  const { authenticated, ready, user } = usePrivy();
  const { address } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [story, setStory] = useState('');
  const [firstShow, setFirstShow] = useState('');
  const [favoriteEra, setFavoriteEra] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, mounted, router]);

  // TODO: Load existing story from IPFS/database
  // TODO: Save story to IPFS with hash on-chain

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implement IPFS upload
      // For now, just local storage as placeholder
      const storyData = {
        story,
        firstShow,
        favoriteEra,
        walletAddress: address,
        timestamp: Date.now()
      };

      localStorage.setItem(`nfa-story-${address}`, JSON.stringify(storyData));

      alert('Story saved! (Currently local only - on-chain storage coming soon)');
    } catch (error) {
      console.error('Failed to save story:', error);
      alert('Failed to save story. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Load existing story
    if (address && mounted) {
      const saved = localStorage.getItem(`nfa-story-${address}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setStory(data.story || '');
          setFirstShow(data.firstShow || '');
          setFavoriteEra(data.favoriteEra || '');
        } catch (e) {
          console.error('Failed to load story:', e);
        }
      }
    }
  }, [address, mounted]);

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

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-4xl font-bold text-white mb-2">Your Story</h1>
          <p className="text-purple-200 text-lg">Every Head has a tale to tell</p>
          <p className="text-white/60 mt-2">Share your journey with the family</p>
        </div>

        {/* Story Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 mb-6">

          {/* First Show */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              🎸 Your First Dead Show
            </label>
            <p className="text-white/60 text-sm mb-3">
              Where and when did you first experience the magic? (Or your first Dead-adjacent show)
            </p>
            <input
              type="text"
              value={firstShow}
              onChange={(e) => setFirstShow(e.target.value)}
              placeholder="e.g., Dead & Company - Boulder 2019, or 'Never seen them live, but been loving the music since...'"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Favorite Era */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              ⚡ Favorite Dead Era/Sound
            </label>
            <select
              value={favoriteEra}
              onChange={(e) => setFavoriteEra(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              <option value="">Select your vibe...</option>
              <option value="early-psychedelic">Early Psychedelic (60s - Anthem of the Sun)</option>
              <option value="primal-dead">Primal Dead (68-70 - Live/Dead era)</option>
              <option value="classic-70s">Classic 70s (71-74 - Europe '72 era)</option>
              <option value="blues-jazz">Blues for Allah / Jazz fusion</option>
              <option value="late-70s">Late 70s (Terrapin era)</option>
              <option value="80s-brent">80s with Brent (Go to Heaven - In the Dark)</option>
              <option value="late-brent">Late Brent era (89-90)</option>
              <option value="90s-vince">90s with Vince (final tours)</option>
              <option value="dead-and-co">Dead & Company</option>
              <option value="phil-friends">Phil Lesh & Friends</option>
              <option value="other-dead-bands">Other Dead-adjacent (JRAD, DSO, etc.)</option>
              <option value="just-studio">Mostly studio albums</option>
              <option value="all-of-it">All of it!</option>
            </select>
          </div>

          {/* Personal Story */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              🌹 Your Dead Story
            </label>
            <p className="text-white/60 text-sm mb-3">
              What does the Grateful Dead mean to you? How'd you find NFA Bears? What's your connection to the scene?
            </p>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Share your story... Maybe it's about a life-changing show, a family tradition, discovering bootlegs, parking lot memories, or just vibing to American Beauty on a Sunday morning..."
              rows={8}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 resize-none"
            />
            <p className="text-white/40 text-xs mt-2">
              {story.length} characters • Your story will be visible to other family members
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || !story}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all"
          >
            {saving ? 'Saving to the archive...' : '💾 Save My Story'}
          </button>
        </div>

        {/* Cultural Context */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/30 mb-6">
          <h3 className="text-white font-bold text-lg mb-3">📚 Why Stories Matter</h3>
          <p className="text-white/90 text-sm mb-3">
            The Grateful Dead scene was built on shared stories - tape trading, show reviews, parking lot conversations.
            These weren't just trivia; they were how culture got passed down.
          </p>
          <p className="text-white/80 text-sm italic">
            "The story's the same one we've all been told, but we tell it anyway because it's our story and we love it." - Somebody, probably
          </p>
        </div>

        {/* Technical Note */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
          <p className="text-white/60 text-xs">
            🔮 Future enhancement: Stories will be stored on IPFS (decentralized, permanent)
            with hashes anchored to your SBT on-chain. For now, they live locally.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => router.push('/member')}
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
          >
            View My Profile →
          </button>
        </div>
      </div>
    </div>
  );
}
