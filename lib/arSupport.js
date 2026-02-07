/**
 * AR support detection for Web-based AR (model-viewer / WebXR / Scene Viewer / Quick Look).
 * Used to decide whether to show AR UI or fall back to 2D menu view.
 */

/**
 * Checks if the current context (HTTPS + device/browser) supports AR.
 * @returns {boolean}
 */
export function isARSupported() {
  if (typeof window === "undefined") return false;
  const protocol = window.location?.protocol || "";
  const hostname = window.location?.hostname || "";
  const isSecure =
    protocol === "https:" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1";

  if (!isSecure) return false;

  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isChrome = /Chrome/i.test(ua) && !/Edge/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua);

  return (isAndroid && isChrome) || (isIOS && isSafari);
}

/**
 * Client-only: run detection after mount (e.g. in useEffect).
 * Use this when you need a reactive value that updates after hydration.
 * @returns {boolean}
 */
export function checkARSupportClient() {
  return isARSupported();
}
