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
  const [progress, setProgress] = useState(0);
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
    
    const onLoad = () => {
      setLoading(false);
      setProgress(100);
    };
    const onErr = () => {
      setLoading(false);
      setError(true);
      setProgress(0);
    };
    const onProgress = (e) => {
      if (e.detail.totalProgress !== undefined) {
        const percent = Math.round(e.detail.totalProgress * 100);
        setProgress(percent);
        if (percent >= 100) {
          setLoading(false);
        }
      }
    };
    
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onErr);
    el.addEventListener("progress", onProgress);
    
    // AR session event handlers for camera tracking
    const onARSessionStart = () => {
      console.log("AR session started - camera tracking active");
    };
    const onARSessionEnd = () => {
      console.log("AR session ended");
    };
    
    el.addEventListener("ar-status", (e) => {
      if (e.detail.status === "session-started") {
        onARSessionStart();
      } else if (e.detail.status === "session-ended") {
        onARSessionEnd();
      }
    });
    
    // Configure AR settings for stability and interaction
    if (el && typeof el.setAttribute === "function") {
      // Ensure touch gestures are enabled for zoom
      el.setAttribute("touch-action", "pan-y pinch-zoom");
      // Enable interaction when focused
      el.setAttribute("interaction-policy", "allow-when-focused");
      // Auto scale for proper sizing
      el.setAttribute("ar-scale", "auto");
      // Prioritize WebXR for better camera tracking
      el.setAttribute("ar-modes", "webxr scene-viewer quick-look");
      // Ensure camera tracking is enabled (WebXR default behavior)
    }
    
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onErr);
      el.removeEventListener("progress", onProgress);
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
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              zIndex: 1,
            }}
          >
            <div style={{
              width: "60px",
              height: "60px",
              border: "4px solid rgba(255,255,255,0.3)",
              borderTop: "4px solid #fff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "1.5rem"
            }} />
            <p style={{ margin: "0 0 1.5rem 0", color: "#fff", fontSize: "1.1rem", fontWeight: 600 }}>Loading 3D model…</p>
            <div
              style={{
                width: "250px",
                height: "8px",
                background: "rgba(255,255,255,0.3)",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)",
                  transition: "width 0.3s ease",
                  borderRadius: "10px",
                }}
              />
            </div>
            {progress > 0 && (
              <p style={{ margin: "1rem 0 0 0", fontSize: "1rem", color: "#fff", fontWeight: 600 }}>
                {progress}%
              </p>
            )}
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
              padding: "2rem",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              textAlign: "center",
              zIndex: 2,
              borderRadius: "16px",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <p style={{ margin: "0 0 0.5rem 0", color: "#fff", fontWeight: 700, fontSize: "1.2rem" }}>
              {onMobile
                ? "This 3D model couldn't load."
                : "AR isn't available on this device."}
            </p>
            <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.95rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>
              {onMobile
                ? "Check your connection or try another menu item. Make sure you're using Chrome on Android or Safari on iPhone."
                : "Open this page on your phone (Chrome on Android or Safari on iPhone) to view in AR."}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              style={{
                marginTop: "0.5rem",
                padding: "12px 28px",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#f5576c",
                background: "#fff",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
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
          ar-scale="auto"
          environment-image="neutral"
          camera-controls
          touch-action="pan-y pinch-zoom"
          interaction-policy="allow-when-focused"
          auto-rotate
          loading="lazy"
          reveal="auto"
          preload="auto"
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
            className="ar-vr-button"
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "14px 32px",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "16px",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            🎯 View in AR
          </button>
        </model-viewer>
        <button
          className="ar-vr-button"
          onClick={() => {
            if (viewerRef.current && typeof viewerRef.current.enterVR === "function") {
              viewerRef.current.enterVR();
            }
          }}
          style={{
            position: "absolute",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "14px 32px",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            border: "none",
            borderRadius: "16px",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(240, 147, 251, 0.4)",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            zIndex: 10,
          }}
        >
          🥽 View in VR
        </button>
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
