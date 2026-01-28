import Link from "next/link";
import menu from "@/data/menu.json";
import PhoneTestHint from "@/components/PhoneTestHint";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem 1rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "0.5rem", fontSize: "1.75rem" }}>
        WebAR Menu
      </h1>
      <p style={{ color: "#555", marginBottom: "2rem", fontSize: "0.95rem" }}>
        Tap an item to open its AR page. On a phone, use &quot;View in AR&quot;
        to place the model in your space.
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {menu.map((item) => (
          <li key={item.slug} style={{ marginBottom: "1rem" }}>
            <Link
              href={`/ar/${item.slug}`}
              style={{
                display: "block",
                padding: "1rem 1.25rem",
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                color: "#111",
              }}
            >
              <span style={{ fontWeight: 600 }}>{item.name}</span>
              <span style={{ marginLeft: "0.5rem", color: "#0066cc" }}>
                {item.price}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <PhoneTestHint />
    </main>
  );
}
