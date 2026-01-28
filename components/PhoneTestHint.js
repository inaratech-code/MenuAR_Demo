"use client";

import { useState, useEffect } from "react";

export default function PhoneTestHint() {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");
    if (!isLocalhost) {
      setLoading(false);
      return;
    }
    fetch("/api/local-ip")
      .then((r) => r.json())
      .then((data) => {
        if (data.ip && data.ip !== "unknown") {
          setUrl(`http://${data.ip}:3000`);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !url) return null;

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem 1.25rem",
        background: "#e8f4fc",
        borderRadius: "8px",
        border: "1px solid #b8daff",
      }}
    >
      <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600, color: "#084298" }}>
        Test on your phone
      </p>
      <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#055160" }}>
        Use the same Wi‑Fi as this computer, then open:
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: "monospace",
          fontSize: "1rem",
          wordBreak: "break-all",
          color: "#0066cc",
          fontWeight: 600,
        }}
      >
        {url}
      </p>
      <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem", color: "#666" }}>
        On your phone, type this exactly (include <strong>http://</strong> and
        every digit, e.g. 192 not 92).
      </p>
    </div>
  );
}
