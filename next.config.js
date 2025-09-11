/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Turbopack configuration (Next.js 15.5+)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Aggressive bundle optimization for fast compilation
  experimental: {
    // Optimize server actions
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:3001", "localhost:3005"],
    },

    // Aggressive package optimization - target ALL heavy Web3 imports
    optimizePackageImports: [
      "@heroicons/react",
      "@radix-ui/react-slot",
      "clsx",
      "class-variance-authority",
      "@privy-io/react-auth",
      "@privy-io/wagmi",
      "@tanstack/react-query",
      "wagmi",
      "viem",
      "lucide-react", // Added lucide-react to optimizePackageImports
    ],

    // Enable optimized compilation for faster builds
    optimizeServerReact: true,
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: ["crypto-js"],

  // Aggressive Webpack optimizations for MAXIMUM speed
  webpack: (config, { dev, isServer }) => {
    // DEVELOPMENT: Skip heavy optimizations to speed up compilation
    if (dev) {
      // Dramatically reduce chunk complexity during development
      config.optimization.splitChunks = {
        chunks: "async", // Only async chunks
        cacheGroups: {
          default: false,
          vendors: false,
          // Single vendor chunk for all node_modules
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            enforce: true,
          },
        },
      }

      // Disable source maps in development for speed
      config.devtool = false

      // Reduce parallelism to prevent memory issues
      config.parallelism = 1
    } else {
      // PRODUCTION: Optimize bundle size
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          web3: {
            name: "web3",
            test: /[\\/]node_modules[\\/](@privy-io|@wagmi|viem|@tanstack)[\\/]/,
            chunks: "all",
            priority: 30,
          },
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            priority: 20,
          },
        },
      }
    }

    // Optimize for Web3 libraries
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }

    // Add caching for faster rebuilds
    config.cache = {
      type: "filesystem",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }

    return config
  },

  // Headers for CORS and performance
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=300" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ]
  },

  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    unoptimized: true, // Added unoptimized field
    domains: ["placeholder.com"], // Added domains field
  },

  // Skip static optimization in development for speed
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,

  // ESLint and TypeScript configurations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
