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

const TAP_TO_PLACE_STORAGE_KEY = "ar-menu-tap-to-place-seen";

function ARViewerClient({ src, alt, poster }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [modelRequested, setModelRequested] = useState(false);
  const [showTapToPlaceOverlay, setShowTapToPlaceOverlay] = useState(false);
  const pendingActivateARRef = useRef(false);
  const viewerRef = useRef(null);
  const onMobile = typeof window !== "undefined" && isLikelyARCapableMobile();

  const fullSrc =
    typeof window !== "undefined" && src && src.startsWith("/")
      ? `${window.location.origin}${src}`
      : src || "";

  const effectiveSrc = modelRequested ? fullSrc : undefined;

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setModelRequested(true);
    setRetryKey((k) => k + 1);
  };

  const handleViewInAR = () => {
    if (!fullSrc) return;
    try {
      const seen = typeof sessionStorage !== "undefined" && sessionStorage.getItem(TAP_TO_PLACE_STORAGE_KEY);
      if (seen) {
        pendingActivateARRef.current = true;
        setModelRequested(true);
        setLoading(true);
      } else {
        setShowTapToPlaceOverlay(true);
      }
    } catch (_) {
      pendingActivateARRef.current = true;
      setModelRequested(true);
      setLoading(true);
    }
  };

  const dismissTapToPlaceAndEnterAR = () => {
    setShowTapToPlaceOverlay(false);
    try {
      if (typeof sessionStorage !== "undefined") sessionStorage.setItem(TAP_TO_PLACE_STORAGE_KEY, "1");
    } catch (_) {}
    pendingActivateARRef.current = true;
    setModelRequested(true);
    setLoading(true);
  };

  const handleExitAR = () => {
    const el = viewerRef.current;
    if (!el?.shadowRoot) return;
    const exitBtn = el.shadowRoot.querySelector("#default-exit-webxr-ar-button");
    if (exitBtn) exitBtn.click();
  };

  const handleReset = () => {
    const el = viewerRef.current;
    if (!el) return;
    if (typeof el.resetTurntable === "function") {
      el.resetTurntable();
    }
    if (typeof el.resetFieldOfView === "function") {
      el.resetFieldOfView();
    }
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
      if (e.detail?.totalProgress !== undefined) {
        const percent = Math.round(e.detail.totalProgress * 100);
        setProgress(percent);
        if (percent >= 100) setLoading(false);
      }
    };

    const onLoadWithAR = () => {
      onLoad();
      if (pendingActivateARRef.current && typeof el.activateAR === "function") {
        pendingActivateARRef.current = false;
        requestAnimationFrame(() => {
          setTimeout(() => el.activateAR(), 50);
        });
      }
    };
    el.addEventListener("load", onLoadWithAR);

    el.addEventListener("load", onLoad);
    el.addEventListener("error", onErr);
    el.addEventListener("progress", onProgress);
    el.addEventListener("ar-status", () => {});

    if (typeof el.setAttribute === "function") {
      el.setAttribute("touch-action", "pan-y pinch-zoom");
      el.setAttribute("interaction-policy", "allow-when-focused");
      el.setAttribute("ar-scale", "fixed");
      el.setAttribute("ar-scale-value", "0.25");
      el.setAttribute("ar-modes", "webxr scene-viewer quick-look");
      el.setAttribute("shadow-intensity", "1");
      el.setAttribute("exposure", "1");
      el.setAttribute("environment-image", "neutral");
    }

    return () => {
      el.removeEventListener("load", onLoadWithAR);
      el.removeEventListener("error", onErr);
      el.removeEventListener("progress", onProgress);
    };
  }, [effectiveSrc, retryKey]);


  return (
    <div
      className="ar-viewer"
      style={{
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto",
        touchAction: "pan-y pinch-zoom",
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
        {loading && effectiveSrc && (
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
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "4px solid rgba(255,255,255,0.3)",
                borderTop: "4px solid #fff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "1.5rem",
              }}
            />
            <p style={{ margin: "0 0 1.5rem 0", color: "#fff", fontSize: "1.1rem", fontWeight: 600 }}>
              Loading 3D model…
            </p>
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
              {onMobile ? "This 3D model couldn't load." : "AR isn't available on this device."}
            </p>
            <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.95rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>
              {onMobile
                ? "Check your connection or try another menu item. Use Chrome on Android or Safari on iPhone."
                : "Open this page on your phone (Chrome on Android or Safari on iPhone) to view in AR."}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="ar-retry-button"
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
            >
              Try again
            </button>
          </div>
        )}

        {!modelRequested ? (
          <div
            style={{
              width: "100%",
              height: "320px",
              minHeight: "320px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <p style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600 }}>
              🫙 3D model loads when you tap &quot;View in AR&quot;
            </p>
            <button
              type="button"
              className="ar-vr-button"
              onClick={handleViewInAR}
              style={{
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
          </div>
        ) : (
          <>
            <model-viewer
              key={retryKey}
              ref={viewerRef}
              src={effectiveSrc}
              alt={alt || "3D model"}
              ar
              ar-modes="webxr scene-viewer quick-look"
              ar-scale="fixed"
              ar-scale-value="0.25"
              environment-image="neutral"
              exposure="1"
              shadow-intensity="1"
              tone-mapping="commerce"
              camera-controls
              touch-action="pan-y pinch-zoom"
              interaction-policy="allow-when-focused"
              auto-rotate
              loading="lazy"
              reveal="interaction"
              preload="none"
              style={{
                width: "100%",
                height: "320px",
                minHeight: "320px",
                display: error ? "none" : "block",
              }}
              poster={poster || undefined}
            />
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <button
                type="button"
                className="ar-vr-button"
                onClick={handleReset}
                style={{
                  padding: "10px 20px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#fff",
                  background: "rgba(0,0,0,0.4)",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                }}
              >
                Reset
              </button>
              <button
                type="button"
                className="ar-vr-button"
                onClick={handleExitAR}
                style={{
                  padding: "10px 20px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#fff",
                  background: "rgba(0,0,0,0.4)",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                }}
              >
                Exit AR
              </button>
            </div>
          </>
        )}

        {showTapToPlaceOverlay && (
          <div
            role="dialog"
            aria-live="polite"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.6)",
              padding: "1.5rem",
            }}
            onClick={dismissTapToPlaceAndEnterAR}
            onTouchEnd={(e) => { e.preventDefault(); dismissTapToPlaceAndEnterAR(); }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.98)",
                borderRadius: "16px",
                padding: "1.5rem 2rem",
                textAlign: "center",
                maxWidth: "320px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a" }}>
                Tap to place item
              </p>
              <p style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", color: "#555" }}>
                Tap a surface in your space to place the model.
              </p>
              <button
                type="button"
                onClick={dismissTapToPlaceAndEnterAR}
                style={{
                  padding: "10px 24px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#fff",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
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
