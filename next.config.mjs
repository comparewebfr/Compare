/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/guide", destination: "/comment-ca-marche", permanent: true },
      { source: "/guide-reparation", destination: "/guide/reparer-ou-racheter", permanent: true },
    ];
  },
};

export default nextConfig;
