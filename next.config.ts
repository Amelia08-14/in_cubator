import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      // L'ancienne vitrine s'appuyait sur des données de démonstration ;
      // l'annuaire réel des startups est /startups.
      { source: "/vitrine", destination: "/startups", permanent: true },
      { source: "/vitrine/:slug", destination: "/startups", permanent: true },
    ];
  },
  async rewrites() {
    const apiOrigin = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:4000";

    return [
      {
        // Espace de transition : les Route Handlers historiques restent sous
        // /api pendant que chaque domaine bascule vers l'API Express.
        source: "/api/v2/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
