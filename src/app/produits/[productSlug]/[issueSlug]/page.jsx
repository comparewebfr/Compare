import { permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { productSlug, issueSlug } = await params;
  permanentRedirect(`/produits/${productSlug}/reparer/${issueSlug}`);
}
