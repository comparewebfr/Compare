const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://compare-fr.com";

function url(path, changefreq = "monthly", priority = 0.8) {
  return {
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: changefreq,
    priority: path === "/" ? 1 : priority,
  };
}

export default function sitemap() {
  const { CATS, PTYPES, ITEMS } = require("../lib/data");
  const { getCategorySlug, getProductTypeSlug, getProductSlug, getIssueSlug } = require("../lib/routes");
  const { getIssues } = require("../lib/helpers");

  const pages = [
    url("/", "weekly", 1),
    url("/comment-ca-marche", "monthly"),
    url("/guide/reparer-ou-racheter", "monthly"),
    url("/faq", "monthly"),
    url("/mentions-legales", "yearly"),
    url("/contact", "monthly"),
    url("/a-propos", "monthly"),
  ];

  for (const cat of CATS) {
    pages.push(url(`/categories/${getCategorySlug(cat)}`, "weekly", 0.9));
    const types = PTYPES[cat.id] || [];
    for (const ptype of types) {
      pages.push(url(`/categories/${getCategorySlug(cat)}/${getProductTypeSlug(ptype)}`, "weekly", 0.85));
    }
  }

  for (const item of ITEMS) {
    pages.push(url(`/produits/${getProductSlug(item)}`, "weekly", 0.9));
    const issues = getIssues(item);
    for (const issue of issues) {
      pages.push(url(`/produits/${getProductSlug(item)}/${getIssueSlug(issue)}`, "monthly", 0.85));
    }
  }

  return pages;
}
