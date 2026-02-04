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
        marginTop: "1.5rem",
        padding: "1.5rem",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        fontSize: "0.95rem",
        color: "#fff",
      }}
    >
      <p style={{ margin: "0 0 0.75rem 0", fontWeight: 700, fontSize: "1.1rem" }}>
        ⚠️ View in AR isn't available on this URL
      </p>
      <p style={{ margin: "0 0 1rem 0", color: "rgba(255,255,255,0.95)", lineHeight: 1.6 }}>
        AR needs a secure page (HTTPS). Right now you're on HTTP. Use one of
        these:
      </p>
      <ul style={{ margin: "0", padding: "0", listStyle: "none" }}>
        <li style={{ marginBottom: "0.75rem", paddingLeft: "1.5rem", position: "relative" }}>
          <span style={{ position: "absolute", left: 0 }}>1️⃣</span>
          <strong>Deploy to Vercel</strong> and open the site on your phone using
          the Vercel HTTPS URL.
        </li>
        <li style={{ marginBottom: "0", paddingLeft: "1.5rem", position: "relative" }}>
          <span style={{ position: "absolute", left: 0 }}>2️⃣</span>
          <strong>Local HTTPS tunnel:</strong> run{" "}
          <code style={{ 
            background: "rgba(255,255,255,0.3)", 
            padding: "4px 8px", 
            borderRadius: "6px",
            fontFamily: "monospace",
            fontWeight: 600
          }}>
            npx ngrok http 3000
          </code>
          , then on your phone open the <strong>https://</strong> URL ngrok
          shows.
        </li>
      </ul>
    </div>
  );
}
