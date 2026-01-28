"use client";

import { useState, useEffect } from "react";

export default function ARHttpsNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      window.location.protocol === "http:" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";
    setShow(ok);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "1rem",
        background: "#fff8e6",
        borderRadius: "8px",
        border: "1px solid #ffe082",
        fontSize: "0.9rem",
        color: "#333",
      }}
    >
      <p style={{ margin: "0 0 0.5rem 0", fontWeight: 600 }}>
        View in AR isn’t available on this URL
      </p>
      <p style={{ margin: 0, color: "#555" }}>
        AR needs a secure page (HTTPS). Right now you’re on HTTP. Use one of
        these:
      </p>
      <ul style={{ margin: "0.5rem 0 0 1.25rem", padding: 0 }}>
        <li style={{ marginBottom: "0.25rem" }}>
          <strong>Deploy to Vercel</strong> and open the site on your phone using
          the Vercel HTTPS URL.
        </li>
        <li style={{ marginBottom: "0.25rem" }}>
          <strong>Local HTTPS tunnel:</strong> run{" "}
          <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 4 }}>
            npx ngrok http 3000
          </code>
          , then on your phone open the <strong>https://</strong> URL ngrok
          shows.
        </li>
      </ul>
    </div>
  );
}
