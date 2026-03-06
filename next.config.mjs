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
      { source: "/categories/cuisine", destination: "/categories/electromenager", permanent: true },
      { source: "/categories/cuisine/:path*", destination: "/categories/electromenager/:path*", permanent: true },
      { source: "/categories/mobilier", destination: "/", permanent: true },
      { source: "/categories/mobilier/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
