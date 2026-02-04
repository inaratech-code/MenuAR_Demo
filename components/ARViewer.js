"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

function isLikelyARCapableMobile() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isChrome = /Chrome/i.test(ua) && !/Edge/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua);
  return (isAndroid && isChrome) || (isIOS && isSafari);
}

function ARViewerClient({ src, alt, poster }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const viewerRef = useRef(null);
  const onMobile = typeof window !== "undefined" && isLikelyARCapableMobile();

  const fullSrc =
    typeof window !== "undefined" && src && src.startsWith("/")
      ? `${window.location.origin}${src}`
      : src || "";

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setRetryKey((k) => k + 1);
  };

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const onLoad = () => setLoading(false);
    const onErr = () => {
      setLoading(false);
      setError(true);
    };
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onErr);
    
    // Configure AR settings for stability and interaction
    if (el && typeof el.setAttribute === "function") {
      // Ensure touch gestures are enabled for zoom
      el.setAttribute("touch-action", "pan-y pinch-zoom");
      // Enable interaction when focused
      el.setAttribute("interaction-policy", "allow-when-focused");
      // Set AR placement for stable positioning
      el.setAttribute("ar-placement", "floor");
      // Auto scale for proper sizing
      el.setAttribute("ar-scale", "auto");
    }
    
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onErr);
    };
  }, [fullSrc, retryKey]);

  return (
    <div
      className="ar-viewer"
      style={{
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "320px",
          background: "#e8e8e8",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#e8e8e8",
              zIndex: 1,
            }}
          >
            <p style={{ margin: 0, color: "#555" }}>Loading 3D model…</p>
          </div>
        )}
        {error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              background: "#f5f5f5",
              textAlign: "center",
              zIndex: 2,
            }}
          >
            <p style={{ margin: "0 0 0.5rem 0", color: "#333", fontWeight: 600 }}>
              {onMobile
                ? "This 3D model couldn't load."
                : "AR isn't available on this device."}
            </p>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
              {onMobile
                ? "Check your connection or try another menu item. Make sure you're using Chrome on Android or Safari on iPhone."
                : "Open this page on your phone (Chrome on Android or Safari on iPhone) to view in AR."}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              style={{
                marginTop: "1rem",
                padding: "10px 20px",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#0066cc",
                background: "#fff",
                border: "2px solid #0066cc",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        )}
        <model-viewer
          key={retryKey}
          ref={viewerRef}
          src={fullSrc}
          alt={alt || "3D model"}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          ar-scale="auto"
          environment-image="neutral"
          camera-controls
          touch-action="pan-y pinch-zoom"
          interaction-policy="allow-when-focused"
          auto-rotate
          loading="eager"
          style={{
            width: "100%",
            height: "320px",
            minHeight: "320px",
            display: error ? "none" : "block",
          }}
          poster={poster || undefined}
        >
          <button
            slot="ar-button"
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "12px 24px",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#fff",
              background: "#0066cc",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            View in AR
          </button>
        </model-viewer>
      </div>
    </div>
  );
}

const ARViewer = dynamic(
  () =>
    import("@google/model-viewer").then(() => {
      return function ARViewerLoaded(props) {
        return <ARViewerClient {...props} />;
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          margin: "0 auto",
          minHeight: "320px",
          background: "#e8e8e8",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ margin: 0, color: "#555" }}>Loading AR viewer…</p>
      </div>
    ),
  }
);

export default ARViewer;
