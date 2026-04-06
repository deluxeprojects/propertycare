/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/services', destination: '/home-services', permanent: true },
      { source: '/services/:path*', destination: '/home-services/:path*', permanent: true },
      { source: '/guardian', destination: '/home-services/guardian', permanent: true },
      { source: '/property-guardian', destination: '/home-services/guardian', permanent: true },
      { source: '/signup', destination: '/login', permanent: false },
      { source: '/register', destination: '/login', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://api.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com;" },
        ],
      },
      {
        // Restrict API routes to same-origin by default
        source: '/api/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default nextConfig;
