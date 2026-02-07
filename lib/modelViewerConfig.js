/**
 * Centralized 3D / WebAR configuration for model-viewer.
 * Use these values so all food/drink models have consistent scale, lighting,
 * camera framing, and AR placement across the app.
 */

// --- 3D model consistency (real-world scale & placement) ---
// Models should be authored with Y-up, pivot at bottom center, 1 unit ≈ 1m.
// ar-scale-value is the size in meters when placed in AR (e.g. plate ~0.25m).
export const AR_SCALE_METERS = "0.25";
export const AR_PLACEMENT = "floor";

// --- Camera (framing & interaction limits) ---
// Initial orbit: theta (azimuth), phi (inclination), radius (distance in meters).
// Slightly above and in front so the model is centered and well framed.
export const CAMERA_ORBIT = "0deg 75deg 1.2m";
export const CAMERA_TARGET = "0m 0m 0m";
// Min/max orbit to avoid extreme zoom and keep interaction sensible.
export const MIN_CAMERA_ORBIT = "0deg 30deg 0.5m";
export const MAX_CAMERA_ORBIT = "360deg 90deg 3m";

// --- Lighting & realism (food-friendly, no overexposure) ---
export const ENVIRONMENT_IMAGE = "neutral";
export const EXPOSURE = "1";
export const SHADOW_INTENSITY = "1";
export const TONE_MAPPING = "commerce";

// --- AR modes (WebXR first, then platform-specific) ---
export const AR_MODES = "webxr scene-viewer quick-look";

// --- Lazy-load: load model only when viewer is in viewport (for mobile). ---
// Set to true to defer loading until the viewer scrolls into view (saves bandwidth).
export const USE_INTERSECTION_OBSERVER = false;
export const INTERSECTION_ROOT_MARGIN = "100px";
export const INTERSECTION_THRESHOLD = 0.1;
