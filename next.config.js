/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",   // Cloudflare Images CDN
        pathname: "/**",
      },
    ],
  },

  // SEO: trailing slash for consistent canonical URLs
  trailingSlash: false,

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Redirects for old URLs
  async redirects() {
    return [
      // e.g. /business/slug → /guia/slug
      {
        source: "/business/:slug",
        destination: "/guia/:slug",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
