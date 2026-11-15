import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // L'ancienne page « Équipe » présentait des barbiers fictifs : elle est remplacée par « Savoir-faire ».
      { source: "/equipe", destination: "/savoir-faire", permanent: false },
      { source: "/equipe/:slug", destination: "/savoir-faire", permanent: false },
    ];
  },
};

export default nextConfig;
