import { notFound } from "next/navigation";
import menu from "@/data/menu.json";
import ARItemPageClient from "@/components/ARItemPageClient";

export default async function ARMenuPage({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const slug = resolved?.slug;
  const item = menu.find((m) => m.slug === slug);

  if (!item) {
    notFound();
  }

  return <ARItemPageClient item={item} />;
}
