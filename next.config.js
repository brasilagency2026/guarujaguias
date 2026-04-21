/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  // Convex uses browser APIs (localStorage, etc.) that crash SSG prerendering.
  // Force all pages to render dynamically on the server (SSR), not statically.
  // This is the correct approach for real-time Convex apps.
  experimental: {
    // Allow dynamic code evaluation used by Convex internals
    unstable_allowDynamic: [
      "**/node_modules/convex/**",
      "**/node_modules/@convex-dev/**",
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        pathname: "/**",
      },
    ],
  },

  trailingSlash: false,

  // Resolve @convex alias so all imports work regardless of folder depth
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@convex": path.resolve(__dirname, "convex"),
    };
    return config;
  },

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

  async redirects() {
    return [
      {
        source: "/business/:slug",
        destination: "/guia/:slug",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
