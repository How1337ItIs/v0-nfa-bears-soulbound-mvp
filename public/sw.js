// NFA Bears Service Worker - Production Ready PWA Implementation
// Version: 1.0.0

const CACHE_NAME = 'nfa-bears-v1.0.0';
const OFFLINE_URL = '/offline';

// Critical assets to cache immediately for app shell architecture
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/ambassador',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Static assets
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js',
];

// Assets that should be cached but aren't critical
const CACHE_LATER_ASSETS = [
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-384x384.png',
];

// Network-first strategy URLs (API calls, dynamic content)
const NETWORK_FIRST_URLS = [
  '/api/',
  '/invite/',
  'https://bartio.rpc.berachain.com/',
  'https://bartio.beratrail.io/',
];

// Cache-first strategy URLs (static assets, images)
const CACHE_FIRST_URLS = [
  '/_next/static/',
  '/icons/',
  '/images/',
  '.woff2',
  '.woff',
  '.ttf',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
];

// Install event - cache critical resources immediately
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('📦 Caching critical assets...');
        
        // Cache critical assets
        await cache.addAll(PRECACHE_ASSETS);
        console.log('✅ Critical assets cached successfully');
        
        // Cache additional assets in background
        setTimeout(async () => {
          try {
            await cache.addAll(CACHE_LATER_ASSETS);
            console.log('✅ Additional assets cached');
          } catch (error) {
            console.warn('⚠️ Some additional assets failed to cache:', error);
          }
        }, 1000);
        
        // Skip waiting to activate immediately
        self.skipWaiting();
        
      } catch (error) {
        console.error('❌ Service Worker install failed:', error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
          name.startsWith('nfa-bears-') && name !== CACHE_NAME
        );
        
        if (oldCaches.length > 0) {
          console.log('🧹 Cleaning up old caches:', oldCaches);
          await Promise.all(
            oldCaches.map(cacheName => caches.delete(cacheName))
          );
        }
        
        // Claim all clients immediately
        await self.clients.claim();
        console.log('✅ Service Worker activated and claimed all clients');
        
      } catch (error) {
        console.error('❌ Service Worker activation failed:', error);
      }
    })()
  );
});

// Fetch event - implement strategic caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Strategy 1: Network First (API calls, dynamic content)
    if (NETWORK_FIRST_URLS.some(pattern => url.href.includes(pattern))) {
      return await networkFirst(request);
    }
    
    // Strategy 2: Cache First (static assets)
    if (CACHE_FIRST_URLS.some(pattern => url.href.includes(pattern))) {
      return await cacheFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate (pages, HTML)
    if (pathname.endsWith('.html') || pathname === '/' || !pathname.includes('.')) {
      return await staleWhileRevalidate(request);
    }
    
    // Default: Network with cache fallback
    return await networkWithCacheFallback(request);
    
  } catch (error) {
    console.error('🚨 Fetch handler error:', error);
    return await handleOffline(request);
  }
}

// Network First Strategy - for API calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📡 Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache First Strategy - for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('📦 Cache and network failed for:', request.url);
    throw error;
  }
}

// Stale While Revalidate - for pages
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(error => {
      console.log('📡 Background fetch failed:', request.url);
    });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  return fetchPromise;
}

// Network with Cache Fallback
async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle offline scenarios
async function handleOffline(request) {
  const url = new URL(request.url);
  
  // For navigation requests, show offline page
  if (request.mode === 'navigate') {
    const offlineResponse = await caches.match(OFFLINE_URL);
    return offlineResponse || new Response('Offline', { status: 503 });
  }
  
  // For API requests, return a JSON error
  if (url.pathname.startsWith('/api/')) {
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Network connection required for this operation',
        offline: true
      }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // For other requests, return a generic offline response
  return new Response('Offline - NFA Bears requires internet connection', { 
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-mint') {
    console.log('🔄 Background sync triggered for minting');
    event.waitUntil(processMintQueue());
  }
});

async function processMintQueue() {
  // Future: Process offline mint requests when back online
  console.log('📝 Processing mint queue (placeholder)');
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Handle action button clicks
    switch (event.action) {
      case 'open-dashboard':
        event.waitUntil(clients.openWindow('/dashboard'));
        break;
      case 'scan-qr':
        event.waitUntil(clients.openWindow('/scan'));
        break;
    }
  } else {
    // Handle notification body click
    event.waitUntil(
      clients.matchAll().then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

console.log('🎪 NFA Bears Service Worker loaded successfully');
