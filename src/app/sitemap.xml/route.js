import { NextResponse } from "next/server";
import { CATS, PTYPES, ITEMS } from "../../lib/data";
import { getCategorySlug, getProductTypeSlug, getProductSlug, getIssueSlug } from "../../lib/routes";
import { getIssues } from "../../lib/helpers";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://compare-fr.com";

function escapeXml(s) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(path, changefreq = "monthly", priority = 0.8) {
  const loc = `${baseUrl}${path}`;
  const lastmod = new Date().toISOString().split("T")[0];
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${path === "/" ? 1 : priority}</priority>
  </url>`;
}

export async function GET() {
  const urls = [
    urlEntry("/", "weekly", 1),
    urlEntry("/comment-ca-marche", "monthly"),
    urlEntry("/guide/reparer-ou-racheter", "monthly"),
    urlEntry("/faq", "monthly"),
    urlEntry("/mentions-legales", "yearly"),
    urlEntry("/contact", "monthly"),
    urlEntry("/a-propos", "monthly"),
  ];

  for (const cat of CATS) {
    urls.push(urlEntry(`/categories/${getCategorySlug(cat)}`, "weekly", 0.9));
    const types = PTYPES[cat.id] || [];
    for (const ptype of types) {
      urls.push(urlEntry(`/categories/${getCategorySlug(cat)}/${getProductTypeSlug(ptype)}`, "weekly", 0.85));
    }
  }

  for (const item of ITEMS) {
    urls.push(urlEntry(`/produits/${getProductSlug(item)}`, "weekly", 0.9));
    const issues = getIssues(item);
    for (const issue of issues) {
      urls.push(urlEntry(`/produits/${getProductSlug(item)}/${getIssueSlug(issue)}`, "monthly", 0.85));
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
