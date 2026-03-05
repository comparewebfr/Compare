const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://compare-fr.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
