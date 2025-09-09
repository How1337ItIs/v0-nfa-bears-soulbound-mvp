// Server Component - NO 'use client' to avoid heavy Web3 imports
import dynamic from 'next/dynamic';

// Lazy-load the client component that needs Web3
const DynamicHomePage = dynamic(() => import('./components/HomePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen tie-dye-bg flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-pulse">🐻✨</div>
        <h1 className="text-5xl font-bold text-white glow-text groovy-font mb-6">
          NFA Bears
        </h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  ),
});

// Server component - super fast loading, no Web3 dependencies
export default function Home() {
  return <DynamicHomePage />;
}
