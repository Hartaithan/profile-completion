import type { Device } from "@/models/app";

const isDesktop = (ua: string) => /Windows NT|Macintosh|Linux.*X11/i.test(ua);
const isMobile = (ua: string) => /Mobile|Tablet/i.test(ua);

export const detectBrowser = () => {
  const ua = window.navigator.userAgent;
  const cleaned = ua ? ua.toLowerCase() : "";
  if (/chrome/.test(cleaned) && !/edg|opr|brave/.test(cleaned)) return "chrome";
  if (/firefox/.test(cleaned)) return "firefox";
  if (/safari/.test(cleaned) && !/chrome/.test(cleaned)) return "safari";
  return "unknown";
};

export const getDeviceType = (): Device => {
  const ua = window.navigator.userAgent;
  return isDesktop(ua) && !isMobile(ua) ? "desktop" : "mobile";
};

export const initDeviceDetection = () => {
  const html = document.documentElement;
  html.setAttribute("data-device", getDeviceType());
  html.setAttribute("data-browser", detectBrowser());
};

export const isTouchDevice = () => {
  const hasWindow = typeof window !== "undefined";
  const hasTouch = "ontouchstart" in window || navigator?.maxTouchPoints > 0;
  return hasWindow && hasTouch;
};
