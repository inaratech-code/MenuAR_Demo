import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        padding: "2rem 1rem",
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>
        Item not found
      </h1>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        This menu item doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          background: "#0066cc",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: 600,
        }}
      >
        Back to menu
      </Link>
    </main>
  );
}
