import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: __dirname },
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "logo.clearbit.com", pathname: "/**" },
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/favicons" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/**" },
      { protocol: "https", hostname: "encrypted-tbn1.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com", pathname: "/**" },
      { protocol: "https", hostname: "m.media-amazon.com", pathname: "/**" },
      { protocol: "https", hostname: "media.rueducommerce.fr", pathname: "/**" },
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
