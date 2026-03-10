import { NextResponse } from "next/server";
import { findCategoryBySlug, getCategorySlug, getProductSlug } from "./lib/routes";
import { ITEMS } from "./lib/data";

export function middleware(request) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // 1. trailing slash → sans slash (sauf racine)
  if (pathname !== "/" && pathname.endsWith("/")) {
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  // 2. /c/:slug → /categories/:slug (anciennes URLs)
  const cMatch = pathname.match(/^\/c\/([^/]+)$/);
  if (cMatch) {
    const cat = findCategoryBySlug(cMatch[1]);
    if (cat) {
      url.pathname = `/categories/${getCategorySlug(cat)}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // 3. /p/:id (sans /aff) → /produits/:slug
  const pMatch = pathname.match(/^\/p\/(\d+)(?:-.*)?$/);
  if (pMatch && !pathname.endsWith("/aff")) {
    const id = parseInt(pMatch[1], 10);
    const item = ITEMS.find((i) => i.id === id);
    if (item) {
      url.pathname = `/produits/${getProductSlug(item)}`;
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|icon|banner|logo|retailers|sitemap).*)"],
};
