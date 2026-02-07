"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ARViewer from "@/components/ARViewer";
import ARHttpsNotice from "@/components/ARHttpsNotice";
import { isARSupported } from "@/lib/arSupport";

const FALLBACK_IMAGE_PLACEHOLDER = "/LOGO-removebg-preview.png";

export default function ARItemPageClient({ item }) {
  const [arSupported, setArSupported] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setArSupported(isARSupported());
  }, []);

  const showAR = mounted && arSupported;
  const imageUrl = item?.imagePath || FALLBACK_IMAGE_PLACEHOLDER;

  return (
    <main
      style={{
        padding: "1rem",
        maxWidth: "520px",
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <Link
          href="/"
          className="back-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "0.95rem",
            color: "#fff",
            background: "rgba(255,255,255,0.2)",
            padding: "0.75rem 1.25rem",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            fontWeight: 500,
            transition: "all 0.3s ease",
          }}
        >
          ← Back to menu
        </Link>
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "12px",
            padding: "0.5rem 1rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Image
            src="/LOGO-removebg-preview.png"
            alt="Company Logo"
            width={120}
            height={120}
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "20px",
          padding: "2rem",
          marginBottom: "1.5rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          style={{
            marginBottom: "0.5rem",
            fontSize: "2rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {item.name}
        </h1>
        <p
          style={{
            margin: "0 0 1rem 0",
            fontSize: "1.5rem",
            color: "#f5576c",
            fontWeight: 700,
          }}
        >
          {item.price}
        </p>
        <p
          style={{
            margin: "0",
            color: "#555",
            fontSize: "1rem",
            lineHeight: 1.6,
          }}
        >
          {item.description}
        </p>
      </div>

      {showAR ? (
        <>
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              backdropFilter: "blur(10px)",
              marginBottom: "1rem",
            }}
          >
            <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem", color: "#667eea", fontWeight: 600 }}>
              Item
            </p>
            <div
              style={{
                width: "100%",
                maxWidth: "200px",
                margin: "0 auto 0",
                aspectRatio: "1",
                borderRadius: "12px",
                overflow: "hidden",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={imageUrl}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              backdropFilter: "blur(10px)",
              marginBottom: "1.5rem",
            }}
          >
            <ARViewer
              src={item.modelPath}
              alt={`${item.name} – view in AR`}
              poster={imageUrl}
            />
          </div>
          <ARHttpsNotice />
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "16px",
              padding: "1rem",
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <p
              style={{
                margin: "0",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.95)",
                fontWeight: 500,
              }}
            >
              📱 Tap the model or &quot;View in AR&quot; on a supported phone
            </p>
          </div>
        </>
      ) : (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "1.5rem",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              margin: "0 0 1rem 0",
              fontSize: "0.95rem",
              color: "#667eea",
              fontWeight: 600,
            }}
          >
            Viewing in 2D (AR not available on this device)
          </p>
          <div
            style={{
              width: "100%",
              maxWidth: "320px",
              margin: "0 auto 1rem",
              aspectRatio: "1",
              borderRadius: "16px",
              overflow: "hidden",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={imageUrl}
              alt={item.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <p
            style={{
              margin: "0",
              fontSize: "0.9rem",
              color: "#555",
              lineHeight: 1.5,
            }}
          >
            Open this page on your phone (Chrome on Android or Safari on iPhone)
            over HTTPS to view in AR.
          </p>
        </div>
      )}
    </main>
  );
}
