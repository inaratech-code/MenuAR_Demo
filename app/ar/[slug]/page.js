import Link from "next/link";
import { notFound } from "next/navigation";
import menu from "@/data/menu.json";
import ARViewer from "@/components/ARViewer";
import ARHttpsNotice from "@/components/ARHttpsNotice";

export default async function ARMenuPage({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const slug = resolved?.slug;
  const item = menu.find((m) => m.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <main style={{ padding: "1rem", maxWidth: "520px", margin: "0 auto" }}>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          fontSize: "0.9rem",
          color: "#0066cc",
        }}
      >
        ← Back to menu
      </Link>

      <h1 style={{ marginBottom: "0.25rem", fontSize: "1.5rem" }}>
        {item.name}
      </h1>
      <p style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", color: "#0066cc" }}>
        {item.price}
      </p>
      <p
        style={{
          margin: "0 0 1.5rem 0",
          color: "#555",
          fontSize: "0.95rem",
          lineHeight: 1.5,
        }}
      >
        {item.description}
      </p>

      <ARViewer
        src={item.modelPath}
        alt={`${item.name} – view in AR`}
      />

      <ARHttpsNotice />

      <p
        style={{
          marginTop: "1rem",
          fontSize: "0.85rem",
          color: "#666",
          textAlign: "center",
        }}
      >
        Tap the model or the &quot;View in AR&quot; button on a supported phone.
      </p>
    </main>
  );
}
