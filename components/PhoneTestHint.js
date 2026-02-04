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
        padding: "1.5rem",
        background: "rgba(255,255,255,0.95)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <p style={{ margin: "0 0 0.75rem 0", fontWeight: 700, fontSize: "1.1rem", color: "#667eea" }}>
        📱 Test on your phone
      </p>
      <p style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", color: "#555", lineHeight: 1.6 }}>
        Use the same Wi‑Fi as this computer, then open:
      </p>
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem",
        borderRadius: "12px",
        marginBottom: "1rem"
      }}>
        <p
          style={{
            margin: 0,
            fontFamily: "monospace",
            fontSize: "1.1rem",
            wordBreak: "break-all",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {url}
        </p>
      </div>
      <p style={{ margin: "0", fontSize: "0.85rem", color: "#777", lineHeight: 1.5 }}>
        On your phone, type this exactly (include <strong>http://</strong> and
        every digit, e.g. 192 not 92).
      </p>
    </div>
  );
}
