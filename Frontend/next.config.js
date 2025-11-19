/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Firebase Hosting
  output: 'export',
  trailingSlash: true,
  distDir: 'out',

  // Optimize images for static export
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prod.spline.design',
        port: '',
        pathname: '/**',
      }
    ],
  },

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
      'firebase/auth',
      'firebase/database',
      'firebase/firestore',
      'framer-motion',
      '@react-pdf/renderer'
    ],
  },



  // Compiler options for better performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // Enable SWC minification
    styledComponents: true,
  },

  // Enable gzip compression
  compress: true,

  // Webpack configuration to handle Firebase and prevent Fast Refresh issues
  webpack: (config, { isServer }) => {
    // Mark Firebase modules to prevent Fast Refresh issues
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
      }
      
      // Ignore Firebase initialization errors during Fast Refresh
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        /Firebase/,
        /@firebase/,
      ]
    }
    return config
  },
  
  // Disable Fast Refresh for Firebase modules to prevent reload issues
  reactStrictMode: true,

  // Headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig