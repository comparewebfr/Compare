/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "logo.clearbit.com", pathname: "/**" },
    ],
  },
  compress: true,
  poweredByHeader: false,
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
