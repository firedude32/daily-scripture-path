// Lightweight device/platform detection for the Add-to-Home-Screen prompt.
// No external libs — UA sniffing + standalone checks only.

export type Platform =
  | "ios-safari"
  | "ios-other" // Chrome/Firefox/Edge on iOS (all WebKit)
  | "ipados"
  | "android-chrome" // Chrome, Edge, Brave, Samsung Internet
  | "android-firefox"
  | "desktop"
  | "unknown";

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const mql = window.matchMedia?.("(display-mode: standalone)").matches;
  // iOS exposes navigator.standalone
  const iosStandalone =
    typeof navigator !== "undefined" &&
    (navigator as unknown as { standalone?: boolean }).standalone === true;
  return Boolean(mql || iosStandalone);
}

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent || "";
  const isMobileViewport =
    typeof window !== "undefined" && window.innerWidth < 768;

  // iPadOS reports as Mac — disambiguate via touch points.
  const isIpadOS =
    /Macintosh/.test(ua) &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1;

  const isIOS = /iPhone|iPod/.test(ua) || isIpadOS;
  const isAndroid = /Android/.test(ua);

  if (isIOS) {
    if (isIpadOS) return "ipados";
    // CriOS = Chrome iOS, FxiOS = Firefox iOS, EdgiOS = Edge iOS
    const isOtherIOS = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
    if (isOtherIOS) return "ios-other";
    return "ios-safari";
  }

  if (isAndroid) {
    if (/Firefox/.test(ua)) return "android-firefox";
    return "android-chrome";
  }

  if (!isMobileViewport) return "desktop";
  return "unknown";
}
