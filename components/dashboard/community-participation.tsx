'use client';

import { useState } from 'react';
import { useUserType } from '@/lib/useUserType';
import { toast } from 'react-hot-toast';

interface ForumPost {
  id: string;
  author: string;
  title: string;
  excerpt: string;
  timestamp: string;
  replies: number;
  hearts: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  venue: string;
  date: string;
  attendees: number;
  maxAttendees: number;
  poatAvailable: boolean;
}

export function CommunityParticipation() {
  const { isSBTHolder } = useUserType();
  const [activeTab, setActiveTab] = useState<'forum' | 'events' | 'meetups'>('forum');

  // Mock forum posts
  const forumPosts: ForumPost[] = [
    {
      id: '1',
      author: '0x1234...5678',
      title: 'Best Jerry Garcia solos of all time?',
      excerpt: 'Let\'s discuss the most transcendent guitar solos from the Captain...',
      timestamp: '2 hours ago',
      replies: 12,
      hearts: 8
    },
    {
      id: '2',
      author: '0xabcd...efgh',
      title: 'Parking lot cooking tips',
      excerpt: 'Share your best recipes for cooking on the lot before shows...',
      timestamp: '5 hours ago',
      replies: 7,
      hearts: 15
    },
    {
      id: '3',
      author: '0x9876...5432',
      title: 'Setting up a local chapter in Denver',
      excerpt: 'Anyone interested in starting regular meetups in the Denver area?',
      timestamp: '1 day ago',
      replies: 23,
      hearts: 19
    }
  ];

  // Mock upcoming events
  const upcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'NFA Bears SF Meetup',
      venue: 'Golden Gate Park',
      date: '2025-09-15',
      attendees: 12,
      maxAttendees: 25,
      poatAvailable: true
    },
    {
      id: '2',
      title: 'Jerry Garcia Birthday Celebration',
      venue: 'Berkeley Art Museum',
      date: '2025-08-01',
      attendees: 45,
      maxAttendees: 50,
      poatAvailable: true
    }
  ];

  const handleJoinDiscussion = async (postId: string) => {
    try {
      // Call real forum API when implemented
      const response = await fetch('/api/forum/join-discussion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      });
      
      if (response.ok) {
        toast.success('Joined discussion successfully!');
      } else {
        toast('Forum integration will be available soon!');
      }
    } catch (error) {
      toast('Forum integration will be available soon!');
    }
  };

  const handleRSVPEvent = async (eventId: string) => {
    try {
      // Call real event management API when implemented
      const response = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });
      
      if (response.ok) {
        toast.success('RSVP recorded successfully!');
      } else {
        toast('Event management will be available soon!');
      }
    } catch (error) {
      toast('Event management will be available soon!');
    }
  };

  const handleCreatePost = async () => {
    try {
      // This would open a modal or navigate to posting interface
      toast('Opening forum composer...');
      // Future: Open post creation modal
    } catch (error) {
      toast('Forum posting will be available soon!');
    }
  };

  if (!isSBTHolder) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="text-center text-white/60">
          <div className="text-4xl mb-4">🔒</div>
          <p>SBT holders only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">💬</span>
          Community Participation
        </h2>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-white/10 rounded-lg p-1">
          {(['forum', 'events', 'meetups'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 capitalize ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-white/80">
                Latest community discussions
              </div>
              <button
                onClick={handleCreatePost}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
              >
                + New Post
              </button>
            </div>

            <div className="space-y-3">
              {forumPosts.map((post) => (
                <div key={post.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="text-green-400 text-sm font-medium mr-3">
                          {post.author}
                        </div>
                        <div className="text-white/50 text-xs">
                          {post.timestamp}
                        </div>
                      </div>
                      <h4 className="text-white font-semibold mb-2">
                        {post.title}
                      </h4>
                      <p className="text-white/70 text-sm mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleJoinDiscussion(post.id)}
                          className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <span className="mr-1">💬</span>
                          {post.replies} replies
                        </button>
                        <div className="flex items-center text-red-400 text-sm">
                          <span className="mr-1">❤️</span>
                          {post.hearts}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button 
                onClick={() => toast('Loading more posts...')}
                className="text-green-400 hover:text-green-300 text-sm"
              >
                Load more discussions →
              </button>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="text-white/80 mb-4">
              Community events you can attend
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="text-white font-semibold mr-3">
                          {event.title}
                        </h4>
                        {event.poatAvailable && (
                          <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                            POAT Available
                          </div>
                        )}
                      </div>
                      <div className="text-white/70 text-sm mb-2">
                        📍 {event.venue}
                      </div>
                      <div className="text-white/70 text-sm mb-3">
                        📅 {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-green-400 text-sm">
                          {event.attendees}/{event.maxAttendees} attending
                        </div>
                        <button
                          onClick={() => handleRSVPEvent(event.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                        >
                          RSVP
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {upcomingEvents.length === 0 && (
              <div className="text-center text-white/60 py-8">
                <div className="text-4xl mb-2">📅</div>
                <p>No upcoming events</p>
                <p className="text-sm mt-1">Check back soon for community gatherings!</p>
              </div>
            )}
          </div>
        )}

        {/* Meetups Tab */}
        {activeTab === 'meetups' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-white mb-2">Local Meetups</h3>
              <p className="text-white/70 mb-6">
                Connect with Bears in your area
              </p>
            </div>

            {/* Regional Chapters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/20 rounded-xl">
                <div className="text-2xl mb-2">🌉</div>
                <div className="text-white font-semibold mb-1">Bay Area Bears</div>
                <div className="text-white/60 text-sm mb-3">
                  45 members • Next meetup: Sept 15
                </div>
                <button 
                  onClick={() => toast.success('Joined Bay Area Bears!')}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-200"
                >
                  Join Chapter
                </button>
              </div>

              <div className="p-4 bg-white/5 border border-white/20 rounded-xl">
                <div className="text-2xl mb-2">🏔️</div>
                <div className="text-white font-semibold mb-1">Denver Dead</div>
                <div className="text-white/60 text-sm mb-3">
                  23 members • Forming now
                </div>
                <button 
                  onClick={() => toast.success('Joined Denver Dead!')}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-200"
                >
                  Join Chapter
                </button>
              </div>
            </div>

            {/* Create Chapter */}
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
              <div className="text-center">
                <div className="text-purple-300 font-bold text-lg mb-2">
                  Start a Local Chapter
                </div>
                <p className="text-purple-200/80 text-sm mb-4">
                  Don't see your area? Create a new regional chapter and bring the Bears to your community.
                </p>
                <button 
                  onClick={() => toast('Local chapter tools will be available soon!')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                >
                  Create Chapter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
