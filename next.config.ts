import type { NextConfig } from "next";

const WP_ORIGIN = process.env.WORDPRESS_ORIGIN || "https://cms.lilaiireland.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.lilaiireland.com"
      },
      {
        protocol: "https",
        hostname: "lilaiireland.com"
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/wp-json/:path*",
        destination: `${WP_ORIGIN}/wp-json/:path*`
      },
      {
        source: "/wp-content/:path*",
        destination: `${WP_ORIGIN}/wp-content/:path*`
      },
      {
        source: "/wp-admin/:path*",
        destination: `${WP_ORIGIN}/wp-admin/:path*`
      },
      {
        source: "/cart/:path*",
        destination: `${WP_ORIGIN}/cart/:path*`
      },
      {
        source: "/checkout/:path*",
        destination: `${WP_ORIGIN}/checkout/:path*`
      },
      {
        source: "/my-account/:path*",
        destination: `${WP_ORIGIN}/my-account/:path*`
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/cart/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
      },
      {
        source: "/checkout/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
      },
      {
        source: "/my-account/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
      }
    ];
  }
};

export default nextConfig;
