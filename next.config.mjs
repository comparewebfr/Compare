/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
  async redirects() {
    return [
      { source: "/guide", destination: "/comment-ca-marche", permanent: true },
      { source: "/guide-reparation", destination: "/guide/reparer-ou-racheter", permanent: true },
    ];
  },
};

export default nextConfig;
